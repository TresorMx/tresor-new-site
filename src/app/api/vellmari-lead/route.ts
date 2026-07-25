import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { upsertGHLContact } from '@/lib/ghl';
import { saveLeadToSanity } from '@/lib/sanity/saveLead';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// Calificadores de la landing de Vellmari — producto de super lujo ($14.8 MDP
// en adelante), así que en vez de "cuántas recámaras" se pregunta rango de
// superficie (proxy directo de presupuesto) y propósito de compra.
const SUPERFICIE_LABELS: Record<string, string> = {
  '169-250': 'Residencia 169 – 250 m²',
  '250-400': 'Residencia 250 – 400 m²',
  ph: 'Penthouse 445 – 714 m²',
  abierto: 'Abierto a opciones',
};

const PROPOSITO_LABELS: Record<string, string> = {
  vivir: 'Para vivir',
  inversion: 'Inversión / renta',
  segunda: 'Segunda residencia',
};

function deriveChannel(utm?: UTM): string {
  const src = (utm?.utm_source ?? '').toLowerCase();
  if (utm?.fbclid || /meta|facebook|instagram|\big\b|fb/.test(src)) return 'Ads Meta';
  if (utm?.gclid || /google|gads|adwords|gclid/.test(src)) return 'Ads Google';
  if (src) return `Ads ${utm!.utm_source}`;
  return 'Directo/Orgánico';
}

interface UTM {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_content?: string;
  utm_term?: string;
  gclid?: string;
  fbclid?: string;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { firstName, email, phone, superficie, proposito, utm } = body as {
      firstName: string;
      email?: string;
      phone: string;
      superficie?: string;
      proposito?: string;
      utm?: UTM;
    };

    if (!firstName || !phone) {
      return NextResponse.json({ error: 'Faltan campos requeridos' }, { status: 400 });
    }

    const channel = deriveChannel(utm);
    const superficieLabel = superficie ? SUPERFICIE_LABELS[superficie] ?? superficie : undefined;
    const propositoLabel = proposito ? PROPOSITO_LABELS[proposito] ?? proposito : undefined;
    const [first, ...rest] = firstName.trim().split(' ');

    const utmSummary = utm
      ? Object.entries(utm)
          .filter(([, v]) => v)
          .map(([k, v]) => `${k}=${v}`)
          .join(' · ')
      : '';

    const notes = [
      'Vellmari Landing',
      superficieLabel ? `Interés: ${superficieLabel}` : null,
      propositoLabel ? `Propósito: ${propositoLabel}` : null,
      `Canal: ${channel}`,
      utmSummary || null,
    ]
      .filter(Boolean)
      .join(' | ');

    // Upsert (no create): unifica con el contacto que el mismo teléfono pueda
    // generar por el chatbot de la landing (que también hace upsert).
    const [ghlRes] = await Promise.all([
      upsertGHLContact({
        firstName: first || firstName,
        lastName: rest.join(' '),
        ...(email ? { email } : {}),
        phone,
        source: 'agenda',
        tags: [
          'Tresor Web',
          'vellmari-puerto-cancun',
          'Vellmari Landing',
          channel,
          ...(propositoLabel ? [propositoLabel] : []),
        ],
        customFields: {
          fuente_de_contacto: 'digital',
          observaciones: notes,
        },
        notes,
      }),
      saveLeadToSanity({
        source: 'form',
        fullName: firstName,
        ...(email ? { email } : {}),
        phone,
        plazaSlug: 'vellmari-puerto-cancun',
        message: notes,
      }),
    ]);

    if (process.env.RESEND_API_KEY) {
      try {
        const resend = new Resend(process.env.RESEND_API_KEY);
        await resend.emails.send({
          from: `Tresor Real Estate <${process.env.RESEND_FROM_EMAIL ?? 'hello@tresor.mx'}>`,
          to: process.env.LEADS_EMAIL_TO ?? 'david.baena@gmail.com',
          subject: `💎 Nuevo lead Vellmari (${channel}) — ${firstName}`,
          html: `
            <div style="font-family:-apple-system,BlinkMacSystemFont,sans-serif;max-width:540px;margin:0 auto;color:#0E0E0E;">
              <div style="border-bottom:2px solid #FAB413;padding-bottom:12px;margin-bottom:20px;">
                <h2 style="margin:0;font-size:20px;">💎 Nuevo lead · Vellmari Landing</h2>
              </div>
              <table style="width:100%;border-collapse:collapse;font-size:14px;">
                <tr><td style="padding:8px 0;color:#6B6863;">Nombre</td><td style="text-align:right;font-weight:600;">${firstName}</td></tr>
                <tr><td style="padding:8px 0;color:#6B6863;">Email</td><td style="text-align:right;">${email ? `<a href="mailto:${email}">${email}</a>` : '—'}</td></tr>
                <tr><td style="padding:8px 0;color:#6B6863;">Teléfono</td><td style="text-align:right;"><a href="tel:${phone}">${phone}</a></td></tr>
                <tr><td style="padding:8px 0;color:#6B6863;">Interés</td><td style="text-align:right;font-weight:600;">${superficieLabel ?? '—'}</td></tr>
                <tr><td style="padding:8px 0;color:#6B6863;">Propósito</td><td style="text-align:right;font-weight:600;">${propositoLabel ?? '—'}</td></tr>
                <tr><td style="padding:8px 0;color:#6B6863;">Canal</td><td style="text-align:right;font-weight:600;">${channel}</td></tr>
                <tr><td style="padding:8px 0;color:#6B6863;">UTM</td><td style="text-align:right;font-size:12px;">${utmSummary || '—'}</td></tr>
                <tr style="border-top:1px solid #EEEAE1;"><td style="padding:12px 0 8px;color:#6B6863;">GHL</td><td style="text-align:right;">${ghlRes.ok ? `✅ ${ghlRes.contactId ?? ''}` : `❌ ${ghlRes.error}`}</td></tr>
              </table>
            </div>
          `,
        });
      } catch (emailErr) {
        console.error('[vellmari-lead] email error', emailErr);
      }
    }

    return NextResponse.json({ ok: true, contactId: ghlRes.contactId ?? null });
  } catch (e) {
    console.error('[vellmari-lead]', e);
    return NextResponse.json({ error: 'Error interno' }, { status: 500 });
  }
}
