import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { upsertGHLContact } from '@/lib/ghl';
import { saveLeadToSanity } from '@/lib/sanity/saveLead';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const TIPOLOGIA_LABELS: Record<string, string> = {
  '2rec': '2 recámaras',
  '3rec': '3 recámaras',
  indeciso: 'Aún no lo sabe',
};

// Deriva el canal de tráfico a partir de los parámetros UTM / click ids —
// así el equipo ve en GHL si el lead vino de Meta, Google o directo, sin
// tener que leer la cadena UTM completa a mano.
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
    const { firstName, phone, tipologia, utm } = body as {
      firstName: string;
      phone: string;
      tipologia?: string;
      utm?: UTM;
    };

    if (!firstName || !phone) {
      return NextResponse.json({ error: 'Faltan campos requeridos' }, { status: 400 });
    }

    const channel = deriveChannel(utm);
    const tipologiaLabel = tipologia ? TIPOLOGIA_LABELS[tipologia] ?? tipologia : undefined;
    const [first, ...rest] = firstName.trim().split(' ');

    const utmSummary = utm
      ? Object.entries(utm)
          .filter(([, v]) => v)
          .map(([k, v]) => `${k}=${v}`)
          .join(' · ')
      : '';

    const notes = [
      'Valmira Landing',
      tipologiaLabel ? `Tipología: ${tipologiaLabel}` : null,
      `Canal: ${channel}`,
      utmSummary || null,
    ]
      .filter(Boolean)
      .join(' | ');

    // Upsert (no create): unifica con el contacto que el mismo teléfono pueda
    // generar por el chatbot de la landing (que también hace upsert). Como
    // upsert no auto-agrega 'Tresor Web'/slug (a diferencia de sendLeadToGHL),
    // aquí se pasan todos los tags explícitos.
    const [ghlRes] = await Promise.all([
      upsertGHLContact({
        firstName: first || firstName,
        lastName: rest.join(' '),
        phone,
        source: 'agenda',
        tags: ['Tresor Web', 'valmira-urban', 'Valmira Landing', channel],
        customFields: {
          fuente_de_contacto: 'digital',
          observaciones: notes,
        },
        notes,
      }),
      saveLeadToSanity({
        source: 'form',
        fullName: firstName,
        phone,
        plazaSlug: 'valmira-urban',
        message: notes,
      }),
    ]);

    if (process.env.RESEND_API_KEY) {
      try {
        const resend = new Resend(process.env.RESEND_API_KEY);
        await resend.emails.send({
          from: `Tresor Real Estate <${process.env.RESEND_FROM_EMAIL ?? 'hello@tresor.mx'}>`,
          to: process.env.LEADS_EMAIL_TO ?? 'david.baena@gmail.com',
          subject: `🏠 Nuevo lead Valmira (${channel}) — ${firstName}`,
          html: `
            <div style="font-family:-apple-system,BlinkMacSystemFont,sans-serif;max-width:540px;margin:0 auto;color:#0E0E0E;">
              <div style="border-bottom:2px solid #FAB413;padding-bottom:12px;margin-bottom:20px;">
                <h2 style="margin:0;font-size:20px;">🏠 Nuevo lead · Valmira Landing</h2>
              </div>
              <table style="width:100%;border-collapse:collapse;font-size:14px;">
                <tr><td style="padding:8px 0;color:#6B6863;">Nombre</td><td style="text-align:right;font-weight:600;">${firstName}</td></tr>
                <tr><td style="padding:8px 0;color:#6B6863;">Teléfono</td><td style="text-align:right;"><a href="tel:${phone}">${phone}</a></td></tr>
                <tr><td style="padding:8px 0;color:#6B6863;">Tipología</td><td style="text-align:right;font-weight:600;">${tipologiaLabel ?? '—'}</td></tr>
                <tr><td style="padding:8px 0;color:#6B6863;">Canal</td><td style="text-align:right;font-weight:600;">${channel}</td></tr>
                <tr><td style="padding:8px 0;color:#6B6863;">UTM</td><td style="text-align:right;font-size:12px;">${utmSummary || '—'}</td></tr>
                <tr style="border-top:1px solid #EEEAE1;"><td style="padding:12px 0 8px;color:#6B6863;">GHL</td><td style="text-align:right;">${ghlRes.ok ? `✅ ${ghlRes.contactId ?? ''}` : `❌ ${ghlRes.error}`}</td></tr>
              </table>
            </div>
          `,
        });
      } catch (emailErr) {
        console.error('[valmira-lead] email error', emailErr);
      }
    }

    return NextResponse.json({ ok: true, contactId: ghlRes.contactId ?? null });
  } catch (e) {
    console.error('[valmira-lead]', e);
    return NextResponse.json({ error: 'Error interno' }, { status: 500 });
  }
}
