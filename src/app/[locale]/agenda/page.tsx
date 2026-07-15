'use client';

import { useState } from 'react';
import { useRouter } from '@/navigation';
import { useTranslations } from 'next-intl';
import {
  CalendarDays, Video, MapPin, ArrowRight, Clock, Home,
  Store, Trees, HelpCircle, Phone, Navigation, MessageCircle,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import CategoryHero from '@/components/category/CategoryHero';
import LocationModal from '@/components/LocationModal';

const TIME_SLOTS = [
  '09:00', '10:00', '11:00', '12:00',
  '14:00', '15:00', '16:00', '17:00',
];

const OFFICE_ADDRESS = 'Plaza Espacio, Oficina S-214, Av. Puerto Cancún, Puerto Cancún, Zona Hotelera, 77500 Cancún, Q.R.';
const OFFICE_PHONE_DISPLAY = '+52 998 404 5602';
const OFFICE_PHONE_TEL = '+529984045602';
const WHATSAPP_URL = `https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? '529984045602'}`;
// TRESOR Real Estate — Plaza Espacio, Puerto Cancún (coordenadas reales de Google Maps)
const OFFICE_LAT = 21.1600969;
const OFFICE_LNG = -86.8066403;

const formatTime = (t: string) => {
  const [h] = t.split(':').map(Number);
  const period = h >= 12 ? 'PM' : 'AM';
  const display = h > 12 ? h - 12 : h;
  return `${display}:00 ${period}`;
};

function minDate() {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  return d.toISOString().split('T')[0];
}

export default function AgendaPage() {
  const t = useTranslations('agenda');
  const router = useRouter();
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    interest: '' as 'local' | 'departamento' | 'lote' | 'asesoria' | '',
    mode: '' as 'presencial' | 'zoom' | '',
    date: '',
    time: '',
  });
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [mapOpen, setMapOpen] = useState(false);

  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const valid =
    form.firstName && form.lastName && form.email && form.phone &&
    form.interest && form.mode && form.date && form.time;

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!valid) return;
    setErr(null);
    setLoading(true);
    try {
      const res = await fetch('/api/agenda', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error(t('errorMsg'));
      const { id } = await res.json();
      if (typeof (window as any).gtag === 'function') {
        (window as any).gtag('event', 'conversion', { send_to: 'AW-17453917774/wazACPXDnMQcEM7M1oJB' });
      }
      router.push(`/agenda/gracias?id=${id}&mode=${form.mode}&date=${form.date}&time=${form.time}&name=${encodeURIComponent(form.firstName)}&interest=${form.interest}`);
    } catch (e: any) {
      setErr(e.message || t('errorMsg'));
    } finally {
      setLoading(false);
    }
  }

  const interests = [
    { value: 'local', icon: Store, label: t('interestLocal'), desc: t('interestLocalDesc') },
    { value: 'departamento', icon: Home, label: t('interestDepto'), desc: t('interestDeptoDesc') },
    { value: 'lote', icon: Trees, label: t('interestLote'), desc: t('interestLoteDesc') },
    { value: 'asesoria', icon: HelpCircle, label: t('interestAsesoria'), desc: t('interestAsesoriaDesc') },
  ] as const;

  const modalities = [
    { value: 'presencial', icon: MapPin, title: t('presencial'), desc: t('presencialDesc') },
    { value: 'zoom',       icon: Video,  title: t('zoom'),        desc: t('zoomDesc') },
  ] as const;

  return (
    <>
      <CategoryHero
        image="/location.jpg"
        imageAlt="Oficinas de Tresor Real Estate en Puerto Cancún"
        eyebrow={t('eyebrow')}
        title={t('title')}
        subtitle={t('desc')}
      />

      <section
        data-nav="light"
        className="relative z-10 -mt-10 rounded-[2.5rem] py-20 md:py-28"
        style={{ backgroundImage: 'linear-gradient(180deg, #f7f8fa 0%, #f2f3f5 55%, #eceef1 100%)' }}
      >
        <div className="container-wrap grid gap-14 md:grid-cols-[1fr_1.5fr] md:gap-16">

          {/* ── Columna izquierda: nuestra oficina ── */}
          <div className="md:sticky md:top-28 md:self-start">
            <span className="eyebrow eyebrow-accent block font-bold">{t('officeEyebrow')}</span>
            <h2 className="mt-4 h-display text-[clamp(24px,3.2vw,40px)]">{t('officeTitle')}</h2>
            <p className="mt-4 text-[15px] font-light leading-relaxed text-ink-2">{t('officeDesc')}</p>

            {/* Sin border: mismo lenguaje que las cards del Drive (blanca
                sin borde sobre fondo gris, con shadow-sm en vez de línea). */}
            <div className="mt-8 rounded-lg bg-white p-7 shadow-sm">
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-bg-soft">
                  <MapPin size={17} strokeWidth={1.6} className="text-ink" />
                </div>
                <div className="text-[13.5px] leading-relaxed">
                  <div className="font-semibold text-ink">{t('officeName')}</div>
                  <div className="text-ink-3">{t('officeAddressLine1')}</div>
                  <div className="text-ink-3">{t('officeAddressLine2')}</div>
                </div>
              </div>

              <div className="mt-5 flex items-center gap-4 border-t border-line pt-5">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-bg-soft">
                  <Phone size={16} strokeWidth={1.6} className="text-ink" />
                </div>
                <div className="text-[13.5px]">
                  <div className="text-[11px] uppercase tracking-caps text-ink-3">{t('officePhoneLabel')}</div>
                  <a href={`tel:${OFFICE_PHONE_TEL}`} className="font-semibold text-ink hover:text-accent-deep">
                    {OFFICE_PHONE_DISPLAY}
                  </a>
                </div>
              </div>

              <div className="mt-6 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => setMapOpen(true)}
                  className="inline-flex items-center gap-2 rounded-full border border-line px-4 py-2.5 text-[11px] font-bold uppercase tracking-caps text-ink transition-colors hover:border-ink"
                >
                  <Navigation size={13} strokeWidth={1.8} /> {t('officeDirections')}
                </button>
                <a
                  href={WHATSAPP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full bg-accent px-4 py-2.5 text-[11px] font-bold uppercase tracking-caps text-ink transition-all hover:brightness-95"
                >
                  <MessageCircle size={13} strokeWidth={1.8} /> {t('officeWhatsapp')}
                </a>
              </div>
            </div>
          </div>

          {/* ── Columna derecha: formulario ── */}
          <form onSubmit={submit}>
            <p className="mb-8 text-[15px] font-light leading-relaxed text-ink-2">{t('formIntro')}</p>

            {/* Nombre + Apellido */}
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

            {/* Email + Teléfono */}
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

            {/* Interés */}
            <div className="mt-10">
              <span className="field-label block mb-4">{t('interestLabel')}</span>
              <div className="grid gap-3 sm:grid-cols-2">
                {interests.map(({ value, icon: Icon, label, desc }) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => set('interest', value)}
                    className={cn(
                      'flex items-start gap-3.5 rounded-lg p-4 text-left transition-all',
                      form.interest === value
                        ? 'bg-ink text-bg'
                        : 'bg-white shadow-sm hover:shadow-md',
                    )}
                  >
                    <div className={cn(
                      'flex h-9 w-9 shrink-0 items-center justify-center rounded-full',
                      form.interest === value ? 'bg-white/10 text-bg' : 'bg-bg-soft text-ink',
                    )}>
                      <Icon size={16} strokeWidth={1.6} />
                    </div>
                    <div>
                      <div className="text-[13px] font-semibold">{label}</div>
                      <div className={cn('mt-0.5 text-[11px] leading-snug', form.interest === value ? 'text-white/60' : 'text-ink-3')}>
                        {desc}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Modalidad */}
            <div className="mt-10">
              <span className="field-label block mb-4">{t('modalityLabel')}</span>
              <div className="grid gap-4 sm:grid-cols-2">
                {modalities.map(({ value, icon: Icon, title, desc }) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => set('mode', value)}
                    className={cn(
                      'flex items-start gap-4 rounded-lg p-5 text-left transition-all',
                      form.mode === value ? 'bg-ink text-bg' : 'bg-white shadow-sm hover:shadow-md',
                    )}
                  >
                    <div className={cn(
                      'flex h-10 w-10 shrink-0 items-center justify-center rounded-full',
                      form.mode === value ? 'bg-white/10 text-bg' : 'bg-bg-soft text-ink',
                    )}>
                      <Icon size={18} strokeWidth={1.5} />
                    </div>
                    <div>
                      <div className="text-[13px] font-semibold">{title}</div>
                      <div className={cn('mt-0.5 text-[12px] leading-relaxed', form.mode === value ? 'text-white/70' : 'text-ink-3')}>
                        {desc}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Fecha */}
            <div className="mt-10">
              <label className="field">
                <span className="field-label flex items-center gap-1.5">
                  <CalendarDays size={11} strokeWidth={2} /> {t('dateLabel')}
                </span>
                <input required type="date" min={minDate()} className="field-input cursor-pointer"
                  value={form.date} onChange={(e) => set('date', e.target.value)} />
              </label>
            </div>

            {/* Hora */}
            <div className="mt-8">
              <span className="field-label flex items-center gap-1.5 mb-4">
                <Clock size={11} strokeWidth={2} /> {t('timeLabel')}
              </span>
              <div className="grid grid-cols-4 gap-2">
                {TIME_SLOTS.map((slot) => (
                  <button
                    key={slot}
                    type="button"
                    onClick={() => set('time', slot)}
                    className={cn(
                      'rounded-full py-2.5 text-[11px] font-semibold uppercase tracking-caps transition-all',
                      form.time === slot
                        ? 'bg-ink text-bg'
                        : 'bg-white text-ink-3 shadow-sm hover:text-ink hover:shadow-md',
                    )}
                  >
                    {formatTime(slot)}
                  </button>
                ))}
              </div>
            </div>

            {err && (
              <div className="mt-6 rounded bg-red-50 px-4 py-3 text-[13px] text-red-700">{err}</div>
            )}

            {/* Submit */}
            <div className="mt-10 border-t border-line pt-8">
              <button
                type="submit"
                disabled={!valid || loading}
                className="btn btn-lg w-full bg-ink text-bg hover:bg-ink/80 disabled:opacity-40"
              >
                {loading ? t('submitting') : t('submit')}
                {!loading && <ArrowRight size={15} strokeWidth={1.6} />}
              </button>
              <p className="mt-4 text-center text-[11px] text-ink-3">{t('submitNote')}</p>
            </div>
          </form>
        </div>
      </section>

      <LocationModal
        open={mapOpen}
        onClose={() => setMapOpen(false)}
        lat={OFFICE_LAT}
        lng={OFFICE_LNG}
        address={OFFICE_ADDRESS}
        title={t('officeName')}
      />
    </>
  );
}
