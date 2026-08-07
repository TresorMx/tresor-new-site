import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { upsertGHLContact } from '@/lib/ghl';
import { saveLeadToSanity } from '@/lib/sanity/saveLead';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// Landing multi-producto /portafolio-cancun (Google Ads + Meta + mailing).
// A diferencia de las landings de un solo desarrollo (Valmira, Vellmari),
// aquí el lead elige QUÉ le interesa de 6 opciones — ese dato es la
// calificación más valiosa del formulario, así que viaja al CRM como tag
// propio y no enterrado en las notas.

// Etiquetas legibles por slug. La clave es el slug real del catálogo, así el
// tag que llega a GHL coincide con el que ya usan las fichas.
const INTERES_LABELS: Record<string, string> = {
  'quattro-gardens': 'Quattro Plaza Gardens — Locales comerciales',
  'valmira-urban': 'Valmira — Departamentos',
  'olivia-wow-condos': 'Olivia Wow Condos — Departamentos',
  'loreta-wow-condos': 'Loreta Wow Condos — Departamentos',
  'villalta-onix': 'Villalta — Departamentos',
  'vellmari-puerto-cancun': 'Vellmari — Luxury condos',
  explorar: 'Abierto a explorar opciones',
};

const PRESUPUESTO_LABELS: Record<string, string> = {
  '1-3': '$1.9 – $3 MDP',
  '3-6': '$3 – $6 MDP',
  '6-12': '$6 – $12 MDP',
  '12+': 'Más de $12 MDP',
};

interface UTM {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_content?: string;
  utm_term?: string;
  gclid?: string;
  fbclid?: string;
}

function deriveChannel(utm?: UTM): string {
  const src = (utm?.utm_source ?? '').toLowerCase();
  if (utm?.fbclid || /meta|facebook|instagram|\big\b|fb/.test(src)) return 'Ads Meta';
  if (utm?.gclid || /google|gads|adwords|gclid/.test(src)) return 'Ads Google';
  if (/mail|newsletter|correo|klaviyo|mailchimp/.test(src)) return 'Mailing';
  if (src) return `Ads ${utm!.utm_source}`;
  return 'Directo/Orgánico';
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { firstName, email, phone, interes, presupuesto, utm } = body as {
      firstName: string;
      email?: string;
      phone: string;
      interes?: string;
      presupuesto?: string;
      utm?: UTM;
    };

    if (!firstName || !phone) {
      return NextResponse.json({ error: 'Faltan campos requeridos' }, { status: 400 });
    }

    const channel = deriveChannel(utm);
    const interesLabel = interes ? INTERES_LABELS[interes] ?? interes : undefined;
    const presupuestoLabel = presupuesto ? PRESUPUESTO_LABELS[presupuesto] ?? presupuesto : undefined;
    const [first, ...rest] = firstName.trim().split(' ');

    const utmSummary = utm
      ? Object.entries(utm).filter(([, v]) => v).map(([k, v]) => `${k}=${v}`).join(' · ')
      : '';

    const notes = [
      'Portafolio Cancún Landing',
      interesLabel ? `Interés: ${interesLabel}` : null,
      presupuestoLabel ? `Presupuesto: ${presupuestoLabel}` : null,
      `Canal: ${channel}`,
      utmSummary || null,
    ].filter(Boolean).join(' | ');

    // Upsert, no create: el mismo teléfono puede llegar por el chatbot o por
    // otra landing — se unifica en un solo contacto en vez de duplicarlo.
    const [ghlRes] = await Promise.all([
      upsertGHLContact({
        firstName: first || firstName,
        lastName: rest.join(' '),
        ...(email ? { email } : {}),
        phone,
        source: 'agenda',
        tags: [
          'Tresor Web',
          'Portafolio Cancún',
          channel,
          // El desarrollo de interés como tag propio: permite armar
          // audiencias y rutear al asesor correcto sin leer la nota.
          ...(interes && interes !== 'explorar' ? [interes] : []),
          ...(interesLabel ? [interesLabel] : []),
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
        ...(interes && interes !== 'explorar' ? { plazaSlug: interes } : {}),
        message: notes,
      }),
    ]);

    if (process.env.RESEND_API_KEY) {
      try {
        const resend = new Resend(process.env.RESEND_API_KEY);
        await resend.emails.send({
          from: `Tresor Real Estate <${process.env.RESEND_FROM_EMAIL ?? 'hello@tresor.mx'}>`,
          to: process.env.LEADS_EMAIL_TO ?? 'david.baena@gmail.com',
          subject: `🏙️ Nuevo lead Portafolio Cancún (${channel}) — ${firstName}`,
          html: `
            <div style="font-family:-apple-system,BlinkMacSystemFont,sans-serif;max-width:540px;margin:0 auto;color:#0E0E0E;">
              <div style="border-bottom:2px solid #FAB413;padding-bottom:12px;margin-bottom:20px;">
                <h2 style="margin:0;font-size:20px;">🏙️ Nuevo lead · Portafolio Cancún</h2>
              </div>
              <table style="width:100%;border-collapse:collapse;font-size:14px;">
                <tr><td style="padding:8px 0;color:#6B6863;">Nombre</td><td style="text-align:right;font-weight:600;">${firstName}</td></tr>
                <tr><td style="padding:8px 0;color:#6B6863;">Email</td><td style="text-align:right;">${email ? `<a href="mailto:${email}">${email}</a>` : '—'}</td></tr>
                <tr><td style="padding:8px 0;color:#6B6863;">Teléfono</td><td style="text-align:right;"><a href="tel:${phone}">${phone}</a></td></tr>
                <tr><td style="padding:8px 0;color:#6B6863;">Le interesa</td><td style="text-align:right;font-weight:600;">${interesLabel ?? '—'}</td></tr>
                <tr><td style="padding:8px 0;color:#6B6863;">Presupuesto</td><td style="text-align:right;font-weight:600;">${presupuestoLabel ?? '—'}</td></tr>
                <tr><td style="padding:8px 0;color:#6B6863;">Canal</td><td style="text-align:right;font-weight:600;">${channel}</td></tr>
                <tr><td style="padding:8px 0;color:#6B6863;">UTM</td><td style="text-align:right;font-size:12px;">${utmSummary || '—'}</td></tr>
                <tr style="border-top:1px solid #EEEAE1;"><td style="padding:12px 0 8px;color:#6B6863;">GHL</td><td style="text-align:right;">${ghlRes.ok ? `✅ ${ghlRes.contactId ?? ''}` : `❌ ${ghlRes.error}`}</td></tr>
              </table>
            </div>
          `,
        });
      } catch (emailErr) {
        console.error('[portafolio-lead] email error', emailErr);
      }
    }

    return NextResponse.json({ ok: true, contactId: ghlRes.contactId ?? null });
  } catch (e) {
    console.error('[portafolio-lead]', e);
    return NextResponse.json({ error: 'Error interno' }, { status: 500 });
  }
}
