'use client';

import { useState } from 'react';
import { Check } from 'lucide-react';

interface ReservaRapidaFormProps {
  devSlug: string;
  devName: string;
  developerName?: string;
  submitLabel?: string;
}

// CTA para desarrollos sin cotizador (hoy: Sales Partner). Form corto →
// /api/reserva-rapida → CRM. Mismo peso visual que QuoteWizard/AgendaWidget
// pero sin la complejidad de unidades/planes de pago que no aplican aquí.
export default function ReservaRapidaForm({ devSlug, devName, developerName, submitLabel = 'Reservar mi lugar' }: ReservaRapidaFormProps) {
  const [form, setForm] = useState({ fullName: '', phone: '' });
  const [status, setStatus] = useState<'idle' | 'saving' | 'done'>('idle');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.fullName.trim() || !form.phone.trim()) return;
    setStatus('saving');
    try {
      await fetch('/api/reserva-rapida', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, devSlug, devName, developerName }),
      });
    } catch {}
    setStatus('done');
  }

  if (status === 'done') {
    return (
      <div className="container-wrap flex max-w-md flex-col items-center gap-4 py-16 text-center">
        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-accent text-ink">
          <Check size={24} strokeWidth={2.4} />
        </span>
        <h3 className="font-sans text-2xl font-medium text-ink">¡Listo, {form.fullName.split(' ')[0]}!</h3>
        <p className="text-[15px] font-light text-ink-3">
          Un asesor de Tresor te contactará en breve para darte seguimiento con {developerName ?? 'el desarrollador'}.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="container-wrap flex max-w-md flex-col gap-4 py-16">
      <div className="flex flex-col gap-1.5">
        <label className="text-[12px] font-medium text-ink/60">Nombre completo *</label>
        <input
          required
          type="text"
          className="appearance-none rounded-2xl border border-line bg-white px-4 py-3 text-[14px] transition-colors focus:border-ink-4"
          style={{ outline: 'none', boxShadow: 'none' }}
          placeholder="Tu nombre"
          value={form.fullName}
          onChange={(e) => setForm((f) => ({ ...f, fullName: e.target.value }))}
        />
      </div>
      <div className="flex flex-col gap-1.5">
        <label className="text-[12px] font-medium text-ink/60">Teléfono *</label>
        <input
          required
          type="tel"
          className="appearance-none rounded-2xl border border-line bg-white px-4 py-3 text-[14px] transition-colors focus:border-ink-4"
          style={{ outline: 'none', boxShadow: 'none' }}
          placeholder="+52 998 000 0000"
          value={form.phone}
          onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
        />
      </div>
      <button
        type="submit"
        disabled={status === 'saving'}
        className="btn border-0 bg-accent text-ink hover:brightness-95 disabled:opacity-50"
      >
        {status === 'saving' ? 'Un momento…' : submitLabel}
      </button>
    </form>
  );
}
