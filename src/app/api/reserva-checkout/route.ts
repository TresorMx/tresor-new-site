import { NextRequest, NextResponse } from 'next/server';
import { randomUUID } from 'crypto';
import { z } from 'zod';
import { getStripe } from '@/lib/stripe';
import { getDevelopment, getReservationAmount } from '@/lib/developments';
import { saveReservation } from '@/lib/sanity/reservationStore';
import { saveLeadToSanity } from '@/lib/sanity/saveLead';
import { sendLeadToGHL } from '@/lib/ghl';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// Apartado en línea SIN inventario (Sales Partner). Distinto del checkout del
// cotizador (/api/stripe/checkout), que amarra un local específico. Aquí el
// monto se resuelve SERVER-SIDE desde la config del desarrollo — el cliente
// nunca lo envía — y el folio queda como referencia compartida.
const Schema = z.object({
  devSlug: z.string(),
  fullName: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(7),
  unitType: z.string().optional(), // slug de la tipología (dev.floorPlans[].slug)
});

function folioFor(devSlug: string): string {
  const abbr = devSlug.replace(/[^a-z0-9]/gi, '').slice(0, 6).toUpperCase();
  return `RES-${abbr}-${randomUUID().split('-')[0].toUpperCase()}`;
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const parsed = Schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid payload', issues: parsed.error.issues }, { status: 400 });
  }
  const { devSlug, fullName, email, phone, unitType } = parsed.data;

  // El apartado solo procede si el desarrollo lo tiene habilitado.
  const dev = await getDevelopment(devSlug);
  if (!dev || dev.comingSoon || !dev.reservationEnabled) {
    return NextResponse.json({ error: 'Reservation not available for this development' }, { status: 403 });
  }

  const amount = getReservationAmount(dev); // MXN, SERVER-SIDE
  const folio = folioFor(devSlug);
  const createdAt = new Date().toISOString();
  const unitLabel = dev.floorPlans?.find((fp) => fp.slug === unitType)?.label.es ?? unitType;
  const unitSuffix = unitLabel ? ` · ${unitLabel}` : '';

  // 1) Persistir el apartado en estado 'pending' (el webhook lo marca 'paid').
  await saveReservation({
    folio,
    status: 'pending',
    devSlug,
    devName: dev.name,
    amount,
    contactName: fullName,
    contactEmail: email,
    contactPhone: phone,
    unitType: unitLabel,
    createdAt,
  });

  // 2) Lead a Sanity + GHL (apartado iniciado, aún no pagado).
  await saveLeadToSanity({
    source: 'reservation',
    fullName,
    email,
    phone,
    plazaSlug: devSlug,
    message: `Apartado iniciado — ${dev.name}${unitSuffix} · ${folio} · $${amount.toLocaleString('es-MX')} MXN`,
  });
  const [firstName, ...rest] = fullName.trim().split(' ');
  await sendLeadToGHL({
    firstName: firstName || fullName,
    lastName: rest.join(' ') || undefined,
    email,
    phone,
    source: 'reservation',
    tags: ['apartado-iniciado', devSlug],
    notes: `Apartado iniciado — ${dev.name}${unitSuffix} · Folio ${folio} · $${amount.toLocaleString('es-MX')} MXN`,
  });

  // 3) Sesión de Stripe Checkout (hospedada). Solo tarjeta: OXXO tiene tope
  // (~$10K) y estos montos lo superan, así que ofrecerlo tronaría la sesión.
  try {
    const stripe = getStripe();
    const origin = req.headers.get('origin') ?? process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.tresor.mx';
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      customer_email: email,
      line_items: [
        {
          price_data: {
            currency: 'mxn',
            unit_amount: amount * 100, // centavos
            product_data: {
              name: `Apartado · ${dev.name}${unitSuffix}`,
              description: `Folio ${folio}. Apartado reembolsable.`,
            },
          },
          quantity: 1,
        },
      ],
      metadata: {
        reservationFolio: folio,
        devSlug,
        contactEmail: email,
      },
      success_url: `${origin}/reserva/gracias?folio=${folio}&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/desarrollos/${devSlug}`,
      locale: 'es-419',
    });
    return NextResponse.json({ url: session.url, folio });
  } catch (e: any) {
    console.error('[reserva-checkout] error', e);
    return NextResponse.json({ error: e.message ?? 'Stripe error' }, { status: 500 });
  }
}
