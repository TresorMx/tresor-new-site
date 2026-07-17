'use client';

import { useEffect, useState } from 'react';

export interface AgendaSlot {
  time: string; // 'HH:mm'
  iso: string | null; // null si viene del fallback estático (sin GHL)
}

/** Horarios disponibles para una fecha — se re-consulta cada vez que cambia `date`. */
export function useAgendaSlots(date: string) {
  const [slots, setSlots] = useState<AgendaSlot[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!date) {
      setSlots([]);
      return;
    }
    let cancelled = false;
    setLoading(true);
    fetch(`/api/agenda/slots?date=${date}`)
      .then((res) => res.json())
      .then((data) => {
        if (!cancelled) setSlots(data.slots ?? []);
      })
      .catch(() => {
        if (!cancelled) setSlots([]);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [date]);

  return { slots, loading };
}
