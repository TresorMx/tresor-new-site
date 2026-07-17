/**
 * Calendario de GHL para /agenda — horarios reales del calendario Round
 * Robin "TRESOR REAL ESTATE" (se reparte solo entre los asesores que sean
 * miembros de ese calendario en GHL) y creación de la cita al confirmar.
 */

const CALENDAR_VERSION = '2021-04-15';
const TIMEZONE = 'America/Cancun';

export const GHL_CALENDAR_CONFIGURED = Boolean(
  process.env.GHL_API_KEY && process.env.GHL_LOCATION_ID && process.env.GHL_CALENDAR_ID,
);

interface FreeSlotsResponse {
  [date: string]: { slots?: string[] } | undefined;
}

/** Horarios disponibles (ISO con offset) para un solo día, en orden. */
export async function fetchFreeSlotsForDate(dateISO: string): Promise<string[]> {
  const apiKey = process.env.GHL_API_KEY;
  const calendarId = process.env.GHL_CALENDAR_ID;
  if (!apiKey || !calendarId) return [];

  const [y, m, d] = dateISO.split('-').map(Number);
  const start = new Date(y, m - 1, d, 0, 0, 0);
  const end = new Date(y, m - 1, d + 1, 0, 0, 0);

  const url = new URL(`https://services.leadconnectorhq.com/calendars/${calendarId}/free-slots`);
  url.searchParams.set('startDate', String(start.getTime()));
  url.searchParams.set('endDate', String(end.getTime()));
  url.searchParams.set('timezone', TIMEZONE);

  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${apiKey}`, Version: CALENDAR_VERSION },
    cache: 'no-store',
  });
  if (!res.ok) {
    console.error('[ghlCalendar] free-slots falló', res.status, await res.text());
    return [];
  }

  const data: FreeSlotsResponse = await res.json();
  return data[dateISO]?.slots ?? [];
}

interface CreateAppointmentInput {
  contactId: string;
  startTimeISO: string;
  title: string;
}

export async function createGHLAppointment(
  input: CreateAppointmentInput,
): Promise<{ ok: boolean; appointmentId?: string; error?: string }> {
  const apiKey = process.env.GHL_API_KEY;
  const locationId = process.env.GHL_LOCATION_ID;
  const calendarId = process.env.GHL_CALENDAR_ID;
  if (!apiKey || !locationId || !calendarId) return { ok: false, error: 'GHL calendar no configurado' };

  const start = new Date(input.startTimeISO);
  const end = new Date(start.getTime() + 30 * 60 * 1000); // slotDuration del calendario: 30 min

  try {
    const res = await fetch('https://services.leadconnectorhq.com/calendars/events/appointments', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        Version: CALENDAR_VERSION,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        calendarId,
        locationId,
        contactId: input.contactId,
        startTime: input.startTimeISO,
        endTime: end.toISOString(),
        title: input.title,
        appointmentStatus: 'confirmed',
      }),
    });
    if (!res.ok) {
      const text = await res.text();
      console.error('[ghlCalendar] crear cita falló', res.status, text);
      return { ok: false, error: text };
    }
    const data = await res.json();
    return { ok: true, appointmentId: data.id };
  } catch (e) {
    console.error('[ghlCalendar] crear cita — error de red', e);
    return { ok: false, error: String(e) };
  }
}
