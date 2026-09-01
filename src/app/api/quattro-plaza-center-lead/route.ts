import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { upsertGHLContact } from '@/lib/ghl';
import { saveLeadToSanity } from '@/lib/sanity/saveLead';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const PROYECTO_LABELS: Record<string, string> = {
  gardens: 'Quattro Gardens',
  'long-island': 'Quattro Long Island',
  indeciso: 'Aún no decide',
};

const PROYECTO_SLUGS: Record<string, string> = {
  gardens: 'quattro-gardens',
  'long-island': 'quattro-long-island',
};

const PROPOSITO_LABELS: Record<string, string> = {
  inversion: 'Inversión / renta',
  negocio: 'Negocio propio',
};

const COUNTRY_LABELS: Record<string, string> = {
  MX: 'México',
  US: 'Estados Unidos',
  CA: 'Canadá',
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
    const { firstName, email, phone, country, proyecto, proposito, utm } = body as {
      firstName: string;
      email?: string;
      phone: string;
      country?: string;
      proyecto?: string;
      proposito?: string;
      utm?: UTM;
    };

    if (!firstName || !phone) {
      return NextResponse.json({ error: 'Faltan campos requeridos' }, { status: 400 });
    }

    const channel = deriveChannel(utm);
    const proyectoLabel = proyecto ? PROYECTO_LABELS[proyecto] ?? proyecto : undefined;
    const proyectoSlug = proyecto ? PROYECTO_SLUGS[proyecto] : undefined;
    const propositoLabel = proposito ? PROPOSITO_LABELS[proposito] ?? proposito : undefined;
    const countryLabel = country ? COUNTRY_LABELS[country] ?? country : undefined;
    const [first, ...rest] = firstName.trim().split(' ');

    const utmSummary = utm
      ? Object.entries(utm).filter(([, v]) => v).map(([k, v]) => `${k}=${v}`).join(' · ')
      : '';

    const notes = [
      'Quattro Plaza Center Landing (Gardens + Long Island)',
      countryLabel ? `País: ${countryLabel}` : null,
      proyectoLabel ? `Plaza: ${proyectoLabel}` : null,
      propositoLabel ? `Propósito: ${propositoLabel}` : null,
      `Canal: ${channel}`,
      utmSummary || null,
    ].filter(Boolean).join(' | ');

    // Upsert, no create: unifica con el contacto que el mismo teléfono pueda
    // generar por el chatbot, la ficha o cualquier otra landing.
    const [ghlRes] = await Promise.all([
      upsertGHLContact({
        firstName: first || firstName,
        lastName: rest.join(' '),
        ...(email ? { email } : {}),
        phone,
        source: 'agenda',
        tags: [
          'Tresor Web',
          'Quattro Plaza Center',
          channel,
          ...(countryLabel ? [countryLabel] : []),
          ...(proyectoSlug ? [proyectoSlug] : []),
          ...(proyectoLabel ? [proyectoLabel] : []),
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
        ...(proyectoSlug ? { plazaSlug: proyectoSlug } : {}),
        message: notes,
      }),
    ]);

    if (process.env.RESEND_API_KEY) {
      try {
        const resend = new Resend(process.env.RESEND_API_KEY);
        await resend.emails.send({
          from: `Tresor Real Estate <${process.env.RESEND_FROM_EMAIL ?? 'hello@tresor.mx'}>`,
          to: process.env.LEADS_EMAIL_TO ?? 'david.baena@gmail.com',
          subject: `🏬 Nuevo lead Quattro Plaza Center (${channel}) — ${firstName}`,
          html: `
            <div style="font-family:-apple-system,BlinkMacSystemFont,sans-serif;max-width:540px;margin:0 auto;color:#0E0E0E;">
              <div style="border-bottom:2px solid #FAB413;padding-bottom:12px;margin-bottom:20px;">
                <h2 style="margin:0;font-size:20px;">🏬 Nuevo lead · Quattro Plaza Center (Gardens + Long Island)</h2>
              </div>
              <table style="width:100%;border-collapse:collapse;font-size:14px;">
                <tr><td style="padding:8px 0;color:#6B6863;">Nombre</td><td style="text-align:right;font-weight:600;">${firstName}</td></tr>
                <tr><td style="padding:8px 0;color:#6B6863;">Email</td><td style="text-align:right;">${email ? `<a href="mailto:${email}">${email}</a>` : '—'}</td></tr>
                <tr><td style="padding:8px 0;color:#6B6863;">Teléfono</td><td style="text-align:right;"><a href="tel:${phone}">${phone}</a></td></tr>
                <tr><td style="padding:8px 0;color:#6B6863;">País</td><td style="text-align:right;font-weight:600;">${countryLabel ?? '—'}</td></tr>
                <tr><td style="padding:8px 0;color:#6B6863;">Plaza</td><td style="text-align:right;font-weight:600;">${proyectoLabel ?? '—'}</td></tr>
                <tr><td style="padding:8px 0;color:#6B6863;">Propósito</td><td style="text-align:right;font-weight:600;">${propositoLabel ?? '—'}</td></tr>
                <tr><td style="padding:8px 0;color:#6B6863;">Canal</td><td style="text-align:right;font-weight:600;">${channel}</td></tr>
                <tr><td style="padding:8px 0;color:#6B6863;">UTM</td><td style="text-align:right;font-size:12px;">${utmSummary || '—'}</td></tr>
                <tr style="border-top:1px solid #EEEAE1;"><td style="padding:12px 0 8px;color:#6B6863;">GHL</td><td style="text-align:right;">${ghlRes.ok ? `✅ ${ghlRes.contactId ?? ''}` : `❌ ${ghlRes.error}`}</td></tr>
              </table>
            </div>
          `,
        });
      } catch (emailErr) {
        console.error('[quattro-plaza-center-lead] email error', emailErr);
      }
    }

    return NextResponse.json({ ok: true, contactId: ghlRes.contactId ?? null });
  } catch (e) {
    console.error('[quattro-plaza-center-lead]', e);
    return NextResponse.json({ error: 'Error interno' }, { status: 500 });
  }
}
