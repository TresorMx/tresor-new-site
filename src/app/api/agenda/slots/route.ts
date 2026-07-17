import { NextRequest, NextResponse } from 'next/server';
import { fetchFreeSlotsForDate, GHL_CALENDAR_CONFIGURED } from '@/lib/ghlCalendar';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// Fallback si el calendario de GHL no está configurado (o falla) — mismos
// horarios fijos que tenía el widget antes de esta integración.
const FALLBACK_SLOTS = ['09:00', '10:00', '11:00', '12:00', '14:00', '15:00', '16:00', '17:00'];

function isoToLabel(iso: string): string {
  // "2026-07-20T08:30:00-05:00" → "08:30" (hora local del slot, ya viene en
  // America/Cancun desde GHL — no hace falta convertir con Date/timezone).
  const match = iso.match(/T(\d{2}:\d{2})/);
  return match ? match[1] : iso;
}

export async function GET(req: NextRequest) {
  const date = req.nextUrl.searchParams.get('date');
  if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return NextResponse.json({ error: 'date inválida (YYYY-MM-DD)' }, { status: 400 });
  }

  if (!GHL_CALENDAR_CONFIGURED) {
    return NextResponse.json({ slots: FALLBACK_SLOTS.map((time) => ({ time, iso: null })) });
  }

  try {
    const isoSlots = await fetchFreeSlotsForDate(date);
    return NextResponse.json({ slots: isoSlots.map((iso) => ({ time: isoToLabel(iso), iso })) });
  } catch (e) {
    console.error('[api/agenda/slots] falló', e);
    return NextResponse.json({ slots: FALLBACK_SLOTS.map((time) => ({ time, iso: null })) });
  }
}
