'use client';

import { useState } from 'react';
import * as Popover from '@radix-ui/react-popover';
import { ChevronLeft, ChevronRight, CalendarDays } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DatePickerProps {
  value: string; // 'YYYY-MM-DD'
  onChange: (value: string) => void;
  minDate?: string; // 'YYYY-MM-DD'
  locale?: string;
  placeholder?: string;
}

function toISODate(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

function parseISODate(s: string): Date {
  const [y, m, d] = s.split('-').map(Number);
  return new Date(y, m - 1, d);
}

function isSameDay(a: Date, b: Date): boolean {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

// Reemplaza el <input type="date"> nativo: en varios navegadores solo el
// icono abre el calendario (no el campo completo), y el diseño del picker
// nativo no se puede tocar. Este es propio, se abre con un click en
// cualquier parte del campo, y el look coincide con el resto del sitio.
export default function DatePicker({ value, onChange, minDate, locale = 'es', placeholder }: DatePickerProps) {
  const isEs = locale !== 'en';
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const min = minDate ? parseISODate(minDate) : today;
  const selected = value ? parseISODate(value) : null;

  const [open, setOpen] = useState(false);
  const [viewMonth, setViewMonth] = useState(() => {
    const base = selected ?? min;
    return new Date(base.getFullYear(), base.getMonth(), 1);
  });

  const monthLabel = viewMonth.toLocaleDateString(isEs ? 'es-MX' : 'en-US', { month: 'long', year: 'numeric' });
  const weekdayLabels = isEs ? ['L', 'M', 'M', 'J', 'V', 'S', 'D'] : ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

  const firstOfMonth = new Date(viewMonth.getFullYear(), viewMonth.getMonth(), 1);
  const daysInMonth = new Date(viewMonth.getFullYear(), viewMonth.getMonth() + 1, 0).getDate();
  const startWeekday = (firstOfMonth.getDay() + 6) % 7; // semana inicia lunes

  const cells: (Date | null)[] = [
    ...Array.from({ length: startWeekday }, () => null),
    ...Array.from({ length: daysInMonth }, (_, i) => new Date(viewMonth.getFullYear(), viewMonth.getMonth(), i + 1)),
  ];

  const displayValue = selected
    ? selected.toLocaleDateString(isEs ? 'es-MX' : 'en-US', { weekday: 'short', day: 'numeric', month: 'short' })
    : (placeholder ?? (isEs ? 'Selecciona una fecha' : 'Select a date'));

  function goToMonth(offset: number) {
    setViewMonth((v) => new Date(v.getFullYear(), v.getMonth() + offset, 1));
  }

  function pick(d: Date) {
    onChange(toISODate(d));
    setOpen(false);
  }

  return (
    <Popover.Root open={open} onOpenChange={setOpen}>
      <Popover.Trigger asChild>
        <button
          type="button"
          className={cn('field-input flex w-full items-center justify-between gap-2 text-left', !selected && 'text-ink-3')}
        >
          <span className="capitalize">{displayValue}</span>
          <CalendarDays size={15} strokeWidth={1.6} className="shrink-0 text-ink-3" />
        </button>
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content
          align="start"
          sideOffset={8}
          className="z-50 w-[300px] rounded-2xl border border-line bg-white p-4 shadow-[0_20px_60px_rgba(0,0,0,0.14)]"
        >
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={() => goToMonth(-1)}
              className="flex h-8 w-8 items-center justify-center rounded-full text-ink-3 transition-colors hover:bg-bg-soft hover:text-ink"
              aria-label={isEs ? 'Mes anterior' : 'Previous month'}
            >
              <ChevronLeft size={16} strokeWidth={1.8} />
            </button>
            <div className="text-[13px] font-semibold capitalize">{monthLabel}</div>
            <button
              type="button"
              onClick={() => goToMonth(1)}
              className="flex h-8 w-8 items-center justify-center rounded-full text-ink-3 transition-colors hover:bg-bg-soft hover:text-ink"
              aria-label={isEs ? 'Mes siguiente' : 'Next month'}
            >
              <ChevronRight size={16} strokeWidth={1.8} />
            </button>
          </div>

          <div className="mt-4 grid grid-cols-7 gap-1 text-center text-[10px] font-semibold uppercase tracking-wide text-ink-3">
            {weekdayLabels.map((w, i) => (
              <div key={i}>{w}</div>
            ))}
          </div>

          <div className="mt-1 grid grid-cols-7 gap-1">
            {cells.map((d, i) => {
              if (!d) return <div key={i} />;
              const disabled = d < min;
              const isSelected = selected ? isSameDay(d, selected) : false;
              const isToday = isSameDay(d, today);
              return (
                <button
                  key={i}
                  type="button"
                  disabled={disabled}
                  onClick={() => pick(d)}
                  className={cn(
                    'flex h-9 w-9 items-center justify-center rounded-full text-[13px] transition-colors',
                    disabled && 'cursor-not-allowed text-line',
                    !disabled && !isSelected && 'text-ink hover:bg-bg-soft',
                    isSelected && 'bg-ink font-semibold text-bg',
                    !isSelected && isToday && !disabled && 'border border-accent',
                  )}
                >
                  {d.getDate()}
                </button>
              );
            })}
          </div>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}
