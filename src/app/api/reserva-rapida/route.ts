import { NextRequest, NextResponse } from 'next/server';
import { sendLeadToGHL } from '@/lib/ghl';
import { saveLeadToSanity } from '@/lib/sanity/saveLead';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// Reserva Rápida — captura de lead genérica para desarrollos sin cotizador
// (hoy: Sales Partner). Un solo form corto → CRM. No aparta inventario real;
// es un lead calificado con la unidad/desarrollo de interés ya etiquetado.
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { fullName, phone, devSlug, devName, developerName } = body;

    if (!fullName || !phone || !devSlug) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    await saveLeadToSanity({
      source: 'form',
      fullName,
      phone,
      plazaSlug: devSlug,
      message: `Reserva rápida — ${devName ?? devSlug}${developerName ? ` (${developerName})` : ''}`,
    });

    const [firstName, ...rest] = String(fullName).trim().split(' ');
    const ghlResult = await sendLeadToGHL({
      firstName,
      lastName: rest.join(' ') || undefined,
      phone,
      source: 'reservation',
      tags: ['reserva-rapida'],
      devSlug,
      notes: `Reserva rápida — ${devName ?? devSlug}${developerName ? ` (${developerName})` : ''}`,
    });

    return NextResponse.json({ ok: true, ghl: ghlResult.ok });
  } catch (e) {
    console.error('[reserva-rapida] error', e);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
