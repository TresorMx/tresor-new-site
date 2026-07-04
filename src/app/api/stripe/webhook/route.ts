import { NextResponse } from 'next/server';
import type Stripe from 'stripe';
import { Resend } from 'resend';
import { getStripe } from '@/lib/stripe';
import { updateQuoteStatus } from '@/lib/sanity/quoteStore';
import { markReservationPaid } from '@/lib/sanity/reservationStore';
import { sendLeadToGHL } from '@/lib/ghl';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  const sig = req.headers.get('stripe-signature');
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!sig || !secret) return NextResponse.json({ error: 'Missing signature' }, { status: 400 });

  const stripe = getStripe();
  const raw = await req.text();
  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(raw, sig, secret);
  } catch (e: any) {
    return NextResponse.json({ error: `Webhook error: ${e.message}` }, { status: 400 });
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;

    // ── Apartado sin inventario (Sales Partner) ──
    const reservationFolio = session.metadata?.reservationFolio;
    if (reservationFolio) {
      await handleReservationPaid(reservationFolio, session);
      return NextResponse.json({ received: true });
    }

    // ── Apartado del cotizador (Tresor, amarrado a un local) ──
    const quoteId = session.metadata?.quoteId;
    if (quoteId) {
      const quote = await updateQuoteStatus(quoteId, 'reserved');
      if (quote) {
        // TODO: actualizar el local en Sanity → status: "apartado"
        // sanityClient.patch(unitDoc._id).set({ status: 'apartado' }).commit()

        // Tag en GHL como apartado
        await sendLeadToGHL({
          firstName: quote.contact.fullName.split(' ')[0],
          email: quote.contact.email,
          phone: quote.contact.phone,
          source: 'reservation',
          tags: ['apartado-pagado', quote.computed.plaza.slug, `local-${quote.computed.unit.code}`],
          customFields: { quoteId, stripeSessionId: session.id },
        });

        // Meta Conversions API — Purchase server-side
        const pixelId = process.env.NEXT_PUBLIC_META_PIXEL_ID;
        const accessToken = process.env.META_CONVERSIONS_TOKEN;
        if (pixelId && accessToken) {
          try {
            await fetch(`https://graph.facebook.com/v19.0/${pixelId}/events`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                data: [{
                  event_name: 'Purchase',
                  event_time: Math.floor(Date.now() / 1000),
                  action_source: 'website',
                  user_data: {
                    em: [quote.contact.email],
                    ph: [quote.contact.phone],
                  },
                  custom_data: {
                    value: session.amount_total ? session.amount_total / 100 : 0,
                    currency: 'MXN',
                    content_ids: [quote.computed.unit.id],
                    content_name: `${quote.computed.plaza.name} · Local ${quote.computed.unit.code}`,
                  },
                }],
                access_token: accessToken,
              }),
            });
          } catch (e) {
            console.error('[Meta CAPI] Purchase error', e);
          }
        }
      }
    }
  }

  return NextResponse.json({ received: true });
}

// Confirma un apartado pagado. `markReservationPaid` es idempotente y solo
// devuelve firstTime=true la PRIMERA vez que transiciona a 'paid', para que
// el tag de GHL y el correo se disparen exactamente una vez aunque Stripe
// reenvíe el webhook.
async function handleReservationPaid(folio: string, session: Stripe.Checkout.Session) {
  const result = await markReservationPaid(folio, session.id);
  if (!result || !result.firstTime) return;
  const r = result.reservation;

  await sendLeadToGHL({
    firstName: r.contactName.split(' ')[0],
    email: r.contactEmail,
    phone: r.contactPhone,
    source: 'reservation',
    tags: ['apartado-pagado', r.devSlug],
    notes: `Apartado PAGADO — ${r.devName} · Folio ${folio} · $${r.amount.toLocaleString('es-MX')} MXN`,
    customFields: { folio, stripeSessionId: session.id },
  });

  // Notificación interna (si hay Resend configurado).
  if (process.env.RESEND_API_KEY) {
    try {
      const resend = new Resend(process.env.RESEND_API_KEY);
      await resend.emails.send({
        from: process.env.RESEND_FROM_EMAIL ?? 'hello@tresor.mx',
        to: process.env.LEADS_EMAIL_TO ?? 'david.baena@gmail.com',
        subject: `💰 Apartado pagado · ${r.devName} · ${r.contactName}`,
        html: `
          <div style="font-family: sans-serif; max-width: 540px; margin: 0 auto; color: #0E0E0E;">
            <div style="border-bottom: 2px solid #FAB413; padding-bottom: 12px; margin-bottom: 24px;">
              <h2 style="margin: 0; font-size: 22px;">💰 Apartado pagado</h2>
              <div style="color: #6B6863; font-size: 13px; margin-top: 4px;">${folio}</div>
            </div>
            <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
              <tr><td style="padding: 8px 0; color: #6B6863;">Desarrollo</td><td style="text-align: right; font-weight: 600;">${r.devName}</td></tr>
              <tr><td style="padding: 8px 0; color: #6B6863;">Monto</td><td style="text-align: right; font-weight: 600;">$${r.amount.toLocaleString('es-MX')} MXN</td></tr>
              <tr style="border-top: 1px solid #EEEAE1;"><td style="padding: 12px 0 8px; color: #6B6863;">Cliente</td><td style="text-align: right; font-weight: 600;">${r.contactName}</td></tr>
              <tr><td style="padding: 8px 0; color: #6B6863;">Email</td><td style="text-align: right;"><a href="mailto:${r.contactEmail}">${r.contactEmail}</a></td></tr>
              <tr><td style="padding: 8px 0; color: #6B6863;">Teléfono</td><td style="text-align: right;"><a href="tel:${r.contactPhone}">${r.contactPhone}</a></td></tr>
            </table>
          </div>
        `,
      });
    } catch (e) {
      console.error('[Resend] reservation paid error', e);
    }
  }
}
