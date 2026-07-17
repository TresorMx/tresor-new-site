import { NextResponse } from 'next/server';
import { upsertGHLContact } from '@/lib/ghl';
import { saveLeadToSanity } from '@/lib/sanity/saveLead';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const { fullName, phone } = await req.json();
    if (!fullName || !phone) return NextResponse.json({ ok: false }, { status: 400 });

    const [first, ...rest] = fullName.trim().split(' ');
    // Upsert (no create): si esta misma persona ya escribió antes, reusa el
    // mismo contactId en vez de crear un registro duplicado en GHL — ese
    // contactId viaja con el chat de aquí en adelante (capture_lead,
    // book_appointment) para que todo quede en el mismo contacto.
    const [ghlResult] = await Promise.all([
      upsertGHLContact({
        firstName: first || fullName,
        lastName: rest.join(' '),
        phone,
        source: 'chat',
        tags: ['Tresor Web', 'Chatbot'],
        customFields: { 'fuente_de_contacto': 'digital' },
      }),
      saveLeadToSanity({
        source: 'chatbot',
        fullName,
        phone,
        message: 'Captado desde formulario inicial del chatbot',
      }),
    ]);

    return NextResponse.json({ ok: true, contactId: ghlResult.contactId ?? null });
  } catch (e) {
    console.error('[chat-lead]', e);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
