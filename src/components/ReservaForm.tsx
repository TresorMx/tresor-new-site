'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { ArrowRight, ShieldCheck } from 'lucide-react';
import { pixel } from '@/lib/pixel';

interface ReservaFormProps {
  devSlug: string;
}

// Formulario de apartado en línea → Stripe Checkout hospedado. No cobra aquí:
// junta el contacto, pide al server la sesión de pago (el monto lo fija el
// server) y redirige a la página segura de Stripe.
export default function ReservaForm({ devSlug }: ReservaFormProps) {
  const t = useTranslations('reserva');

  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', phone: '' });
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));
  const valid = form.firstName && form.lastName && form.email && form.phone;

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!valid) return;
    setErr(null);
    setLoading(true);
    try {
      const res = await fetch('/api/reserva-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          devSlug,
          fullName: `${form.firstName} ${form.lastName}`.trim(),
          email: form.email,
          phone: form.phone,
        }),
      });
      if (!res.ok) throw new Error(t('errorMsg'));
      const { url } = await res.json();
      if (!url) throw new Error(t('errorMsg'));
      pixel.lead({ content_name: 'Apartado Iniciado', content_category: devSlug });
      // Redirige a la página segura de Stripe (no volvemos aquí salvo cancelar).
      window.location.href = url;
    } catch (e: any) {
      setErr(e.message || t('errorMsg'));
      setLoading(false);
    }
  }

  return (
    <div className="container-wrap pb-20 pt-12 md:pb-28 md:pt-16">
      <form onSubmit={submit} className="mx-auto max-w-2xl">
        <div className="grid gap-6 sm:grid-cols-2">
          <label className="field">
            <span className="field-label">{t('firstName')}</span>
            <input required type="text" className="field-input" placeholder={t('firstNamePlaceholder')}
              value={form.firstName} onChange={(e) => set('firstName', e.target.value)} />
          </label>
          <label className="field">
            <span className="field-label">{t('lastName')}</span>
            <input required type="text" className="field-input" placeholder={t('lastNamePlaceholder')}
              value={form.lastName} onChange={(e) => set('lastName', e.target.value)} />
          </label>
        </div>

        <div className="mt-6 grid gap-6 sm:grid-cols-2">
          <label className="field">
            <span className="field-label">{t('email')}</span>
            <input required type="email" className="field-input" placeholder={t('emailPlaceholder')}
              value={form.email} onChange={(e) => set('email', e.target.value)} />
          </label>
          <label className="field">
            <span className="field-label">{t('phone')}</span>
            <input required type="tel" className="field-input" placeholder={t('phonePlaceholder')}
              value={form.phone} onChange={(e) => set('phone', e.target.value)} />
          </label>
        </div>

        {err && (
          <div className="mt-6 rounded bg-red-50 px-4 py-3 text-[13px] text-red-700">{err}</div>
        )}

        <div className="mt-10 border-t border-line pt-8">
          <button
            type="submit"
            disabled={!valid || loading}
            className="btn btn-lg w-full bg-ink text-bg hover:bg-ink/80 disabled:opacity-40"
          >
            {loading ? t('submitting') : t('submit')}
            {!loading && <ArrowRight size={15} strokeWidth={1.6} />}
          </button>
          <p className="mt-4 flex items-center justify-center gap-1.5 text-center text-[11px] text-ink-3">
            <ShieldCheck size={13} strokeWidth={1.6} /> {t('submitNote')}
          </p>
        </div>
      </form>
    </div>
  );
}
