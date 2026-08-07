import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { upsertGHLContact } from '@/lib/ghl';
import { saveLeadToSanity } from '@/lib/sanity/saveLead';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// Landing multi-producto /portafolio-cancun (Google Ads + Meta + mailing).
// A diferencia de las landings de un solo desarrollo (Valmira, Vellmari),
// aquí el lead califica en dos niveles y ambos viajan como tag propio, no
// enterrados en las notas:
//   · `categoria`  — lo que elige en el formulario (Local / Departamento /
//                    Luxury). Siempre presente si contestó.
//   · `desarrollo` — el proyecto exacto, solo si entró por el botón "Me
//                    interesa" de una card. Es la señal más fuerte cuando
//                    existe, porque indica qué le llamó la atención.

// Categoría elegida en el formulario (3 opciones).
const CATEGORIA_LABELS: Record<string, string> = {
  local: 'Local Comercial',
  departamento: 'Departamento Residencial',
  luxury: 'Luxury Condo',
};

// Desarrollo exacto. Solo llega si el lead entró por el botón "Me interesa"
// de una card — el formulario por sí solo pide categoría, no proyecto. Es la
// señal más valiosa cuando existe, así que va como tag propio.
// Las claves son los slugs reales del catálogo, para que el tag coincida con
// el que ya usan las fichas.
const DESARROLLO_LABELS: Record<string, string> = {
  'quattro-gardens': 'Quattro Plaza Gardens',
  'valmira-urban': 'Valmira',
  'olivia-wow-condos': 'Olivia Wow Condos',
  'loreta-wow-condos': 'Loreta Wow Condos',
  'villalta-onix': 'Villalta',
  'vellmari-puerto-cancun': 'Vellmari',
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
    const { firstName, email, phone, categoria, desarrollo, presupuesto, utm } = body as {
      firstName: string;
      email?: string;
      phone: string;
      categoria?: string;
      desarrollo?: string;
      presupuesto?: string;
      utm?: UTM;
    };

    if (!firstName || !phone) {
      return NextResponse.json({ error: 'Faltan campos requeridos' }, { status: 400 });
    }

    const channel = deriveChannel(utm);
    const categoriaLabel = categoria ? CATEGORIA_LABELS[categoria] ?? categoria : undefined;
    const desarrolloLabel = desarrollo ? DESARROLLO_LABELS[desarrollo] ?? desarrollo : undefined;
    const presupuestoLabel = presupuesto ? PRESUPUESTO_LABELS[presupuesto] ?? presupuesto : undefined;
    const [first, ...rest] = firstName.trim().split(' ');

    const utmSummary = utm
      ? Object.entries(utm).filter(([, v]) => v).map(([k, v]) => `${k}=${v}`).join(' · ')
      : '';

    const notes = [
      'Portafolio Cancún Landing',
      categoriaLabel ? `Interés: ${categoriaLabel}` : null,
      desarrolloLabel ? `Desarrollo: ${desarrolloLabel}` : null,
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
          // Categoría y desarrollo como tags propios: permiten armar
          // audiencias y rutear al asesor correcto sin leer la nota.
          ...(categoriaLabel ? [categoriaLabel] : []),
          ...(desarrollo ? [desarrollo] : []),
          ...(desarrolloLabel ? [desarrolloLabel] : []),
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
        ...(desarrollo ? { plazaSlug: desarrollo } : {}),
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
                <tr><td style="padding:8px 0;color:#6B6863;">Le interesa</td><td style="text-align:right;font-weight:600;">${categoriaLabel ?? '—'}</td></tr>
                <tr><td style="padding:8px 0;color:#6B6863;">Desarrollo</td><td style="text-align:right;font-weight:600;">${desarrolloLabel ?? '—'}</td></tr>
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
