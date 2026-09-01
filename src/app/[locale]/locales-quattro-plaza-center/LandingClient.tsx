'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import {
  ArrowRight, MessageCircle, ChevronDown, Check, MapPin, ShieldCheck,
} from 'lucide-react';
import RevealOnScroll from '@/components/RevealOnScroll';
import LandingFooter, { waLink } from '@/components/landing/LandingFooter';
import type { Development } from '@/lib/developments';

/* ─────────────────────────── datos fijos de la landing ───────────────────────────
   Precio, zona, entrega y descripción de cada plaza vienen del catálogo
   (prop `gardens` / `longIsland`) — no se hardcodean aquí. Las fotos sí son
   fijas: son renders reales de cada plaza, elegidas a mano (ver comentario
   en is-cancun-real-estate-a-good-investment/page.tsx sobre por qué NUNCA
   elegir una imagen sin abrirla primero). No se inventa ninguna promo
   (enganche/descuento) porque Quattro, a diferencia de Lausana, no tiene
   una condición comercial vigente confirmada — si se define una campaña
   real, se agrega aquí con su disclaimer de vigencia, igual que Lausana.  */
const HERO_IMG = '/renders/long-island/02.jpg';
const GARDENS_CARD_IMG = '/renders/gardens/01.jpg';
const LONG_ISLAND_CARD_IMG = '/renders/long-island/01.jpg';
const ABOUT_IMG = '/renders/gardens/02.jpg';
const CTA_BANNER_IMG = '/renders/gardens/03.jpg';

const PROYECTOS = [
  { v: 'gardens', l: 'Quattro Gardens' },
  { v: 'long-island', l: 'Quattro Long Island' },
  { v: 'indeciso', l: 'Aún no decido' },
] as const;

const COUNTRIES = [
  { code: 'MX', dial: '+52', flag: '🇲🇽' },
  { code: 'US', dial: '+1', flag: '🇺🇸' },
  { code: 'CA', dial: '+1', flag: '🇨🇦' },
] as const;
const DIAL_CODES: Record<string, string> = Object.fromEntries(COUNTRIES.map((c) => [c.code, c.dial]));

/* ─────────────────────────── UTM ─────────────────────────── */
interface UTM {
  utm_source?: string; utm_medium?: string; utm_campaign?: string;
  utm_content?: string; utm_term?: string; gclid?: string; fbclid?: string;
}
function readUTM(): UTM {
  if (typeof window === 'undefined') return {};
  const p = new URLSearchParams(window.location.search);
  const utm: UTM = {};
  (['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term', 'gclid', 'fbclid'] as const)
    .forEach((k) => { const v = p.get(k); if (v) utm[k] = v; });
  return utm;
}

/* ─────────────────────────── página ─────────────────────────── */
export default function QuattroPlazaCenterLanding({ gardens, longIsland }: { gardens: Development; longIsland: Development }) {
  const formRef = useRef<HTMLDivElement>(null);
  const utmRef = useRef<UTM>({});
  const [form, setForm] = useState({
    firstName: '', email: '', phone: '', phoneCountry: 'MX', proyecto: '', proposito: '',
  });
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState('');

  useEffect(() => { utmRef.current = readUTM(); }, []);

  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));
  const valid = Boolean(form.firstName.trim() && form.email.trim() && form.phone.trim());
  const scrollToForm = () => formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });

  const pickAndScroll = (proyecto: string) => {
    setForm((f) => ({ ...f, proyecto }));
    scrollToForm();
  };

  // Precio más bajo entre las dos plazas — usa el campo numérico `priceFrom`
  // del catálogo directo, no un parseo de texto: es el mismo dato que ya
  // ordena las cards en /quattro-plaza-center, sin duplicar lógica.
  const cheapest = (gardens.priceFrom ?? Infinity) <= (longIsland.priceFrom ?? Infinity) ? gardens : longIsland;
  const heroPrice = (cheapest.priceLabel ?? '').replace(/^desde\s+/i, '');

  // Cifras reales del catálogo — nada inventado (sin promo de enganche/
  // descuento ni monto de apartado: Quattro no tiene ninguno confirmado hoy,
  // a diferencia de Lausana). 3 columnas, no 4, por la misma razón: no hay
  // un cuarto dato real que agregar sin forzarlo.
  const primeraEntrega = [gardens.deliveryWindow, longIsland.deliveryWindow]
    .filter((d): d is string => Boolean(d))
    .sort()[0];
  const CIFRAS = [
    { value: '2', label: 'Plazas en preventa' },
    { value: gardens.zone ?? 'Cancún', label: 'Misma zona, dos plazas' },
    ...(primeraEntrega ? [{ value: primeraEntrega, label: 'Primera entrega' }] : []),
  ];

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!valid || loading) return;
    setErr('');
    setLoading(true);
    try {
      const res = await fetch('/api/quattro-plaza-center-lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: form.firstName,
          email: form.email,
          phone: `${DIAL_CODES[form.phoneCountry]} ${form.phone}`.trim(),
          country: form.phoneCountry,
          proyecto: form.proyecto || undefined,
          proposito: form.proposito || undefined,
          utm: utmRef.current,
        }),
      });
      if (!res.ok) throw new Error('fail');
      window.location.assign('/locales-quattro-plaza-center/gracias');
    } catch {
      setErr('Hubo un problema. Intenta de nuevo o escríbenos por WhatsApp.');
      setLoading(false);
    }
  }

  const formCard = (
    <FormCard form={form} set={set} valid={valid} loading={loading} err={err} submit={submit} onPickProyecto={(v) => set('proyecto', v)} />
  );

  return (
    <>
      {/* ═════════ HERO ═════════ */}
      <section className="relative overflow-hidden bg-ink lg:flex lg:min-h-[94svh] lg:items-center">
        <div className="absolute inset-0 animate-hero-zoom">
          <Image
            src={HERO_IMG}
            alt="Quattro Plaza Center — fachada al atardecer, Cancún"
            fill priority sizes="100vw"
            className="object-cover"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/80 to-ink/55 lg:to-ink/25" />
        <div className="absolute inset-0 lg:bg-gradient-to-r lg:from-ink lg:via-ink/60 lg:to-transparent" />

        <div className="container-wrap relative z-10 grid items-center gap-10 pb-14 pt-16 lg:grid-cols-[1.05fr_minmax(360px,440px)] lg:gap-16 lg:py-28">
          <div className="text-center text-white lg:text-left">
            <Image
              src="/logos/LogoTresor.svg"
              alt="Tresor Real Estate"
              width={200} height={52}
              priority
              className="mx-auto h-12 w-auto lg:mx-0 lg:h-14"
            />
            <p className="mt-4 text-[11px] font-medium uppercase tracking-eyebrow text-accent">
              Quattro Plaza Center · Tresor Real Estate
            </p>

            <h1 className="mt-5 h-display text-[clamp(30px,4.6vw,58px)] text-white">
              Invierte en locales comerciales <span className="italic text-accent">en la zona de mayor crecimiento</span> de Cancún
            </h1>

            <p className="mx-auto mt-6 max-w-xl text-[15px] font-light leading-relaxed text-white/75 lg:mx-0 lg:text-[16px]">
              Quattro Gardens y Quattro Long Island, dos plazas comerciales en preventa sobre
              Av. Huayacán — locales para negocio propio o para renta, con las marcas y servicios
              que ya buscan los vecinos de la zona.
            </p>

            <div className="mt-7 flex flex-wrap justify-center gap-2 lg:justify-start">
              {['Av. Huayacán, Cancún', 'Tresor Real Estate', '2 plazas en preventa'].map((g) => (
                <span key={g} className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border border-white/15 bg-white/[0.07] px-3.5 py-1.5 text-[11px] font-medium text-white/90 backdrop-blur-md lg:text-[12px]">
                  <Check size={12} strokeWidth={3} className="text-accent" /> {g}
                </span>
              ))}
            </div>

            <div className="mt-9 flex items-end justify-center gap-3 lg:justify-start">
              <span className="pb-1 text-[11px] font-medium uppercase tracking-caps text-white/50">Desde</span>
              <span className="h-display text-[clamp(26px,3.4vw,42px)] leading-none text-white">{heroPrice}</span>
            </div>
          </div>

          <div ref={formRef} id="informacion" className="scroll-mt-24">{formCard}</div>
        </div>

        <a href="#plazas" aria-label="Ver plazas" className="absolute bottom-5 left-1/2 hidden -translate-x-1/2 text-white/40 transition hover:text-white lg:block">
          <ChevronDown size={26} className="animate-bounce" />
        </a>
      </section>

      {/* ═════════ CIFRAS ═════════ */}
      <section className="border-b border-white/10 bg-ink py-10 md:py-12">
        <div className="container-wrap grid grid-cols-1 gap-y-8 sm:grid-cols-3">
          {CIFRAS.map(({ value, label }, i) => (
            <div key={label} className={`px-2 text-center lg:px-8 ${i > 0 ? 'sm:border-l sm:border-white/10' : ''}`}>
              <div className="h-display text-[clamp(24px,2.8vw,38px)] text-accent">{value}</div>
              <div className="mt-2 text-[11px] uppercase tracking-caps text-white/45">{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ═════════ LAS 2 PLAZAS ═════════ */}
      <section
        id="plazas"
        data-nav="light"
        className="relative z-10 scroll-mt-16 py-20 md:py-28"
        style={{ backgroundImage: 'linear-gradient(180deg, #f7f8fa 0%, #f2f3f5 55%, #eceef1 100%)' }}
      >
        <div className="container-wrap">
          <RevealOnScroll className="max-w-2xl">
            <span className="eyebrow eyebrow-accent font-bold">— Las plazas</span>
            <h2 className="mt-4 font-sans text-[clamp(24px,3.2vw,48px)] font-normal leading-[1.05] tracking-tight text-ink">
              Dos preventas <span className="text-ink-3">sobre Av. Huayacán</span>
            </h2>
            <p className="mt-5 text-[15px] font-light leading-relaxed text-ink-2">
              Mismo desarrollador, misma zona, dos plazas con marcas y giros distintos. Elige la
              que te interese y un asesor te contacta con locales disponibles y planes de pago
              reales.
            </p>
          </RevealOnScroll>

          <div className="mt-12 grid gap-5 sm:grid-cols-2">
            <RevealOnScroll>
              <ProjectCard dev={gardens} image={GARDENS_CARD_IMG} onPick={() => pickAndScroll('gardens')} />
            </RevealOnScroll>
            <RevealOnScroll delay={80}>
              <ProjectCard dev={longIsland} image={LONG_ISLAND_CARD_IMG} onPick={() => pickAndScroll('long-island')} />
            </RevealOnScroll>
          </div>
        </div>
      </section>

      {/* ═════════ SOBRE QUATTRO PLAZA CENTER ═════════ */}
      <section className="bg-white py-24 md:py-32">
        <div className="container-wrap grid gap-12 lg:grid-cols-2 lg:items-center lg:gap-20">
          <RevealOnScroll>
            <span className="eyebrow eyebrow-accent font-bold">— La línea comercial de Tresor</span>
            <h2 className="mt-5 h-display text-[clamp(28px,3.6vw,52px)] text-ink">
              Quattro Plaza Center<br />
              <span className="text-ink-3">locales pensados para el flujo real de cada zona</span>
            </h2>
            <p className="mt-7 text-[15px] font-light leading-relaxed text-ink-2 md:text-[16px]">
              Plazas comerciales desarrolladas y comercializadas directamente por Tresor Real
              Estate, ubicadas en las zonas de mayor dinamismo y crecimiento de Cancún — pensadas
              para negocios de servicio diario: salud, belleza, gastronomía, wellness y retail.
            </p>
            <button onClick={scrollToForm} className="btn btn-lg mt-9 border-0 bg-ink text-white hover:bg-ink/85">
              Solicita precios y disponibilidad <ArrowRight size={14} strokeWidth={2.2} />
            </button>
          </RevealOnScroll>

          <RevealOnScroll delay={120}>
            <div className="relative aspect-[4/3] overflow-hidden rounded-[28px] bg-bg-soft">
              <Image src={ABOUT_IMG} alt="Fachada de Quattro Plaza Center" fill sizes="(max-width: 1024px) 100vw, 50vw" className="object-cover" />
            </div>
          </RevealOnScroll>
        </div>
      </section>

      {/* ═════════ BANNER CTA ═════════ */}
      <section className="relative isolate flex min-h-[52vh] items-center overflow-hidden bg-ink py-20 md:min-h-[60vh] md:py-28">
        <Image src={CTA_BANNER_IMG} alt="Locales comerciales de Quattro Plaza Center" fill sizes="100vw" className="object-cover" />
        <div className="absolute inset-0 bg-ink/60" />
        <div className="container-wrap relative z-10">
          <RevealOnScroll className="mx-auto max-w-3xl text-center">
            <span className="eyebrow eyebrow-accent font-bold">Disponibilidad real, hoy</span>
            <h2 className="mt-5 h-display text-[clamp(28px,4vw,58px)] text-white">
              El inventario cambia<br />todas las semanas
            </h2>
            <p className="mx-auto mt-6 max-w-2xl text-[16px] font-normal leading-relaxed text-white/85 md:text-[18px]">
              Déjanos tus datos y te compartimos qué locales siguen disponibles en Gardens y Long
              Island, en qué nivel y con qué plan de pago — sin compromiso.
            </p>
            <button onClick={scrollToForm} className="btn btn-lg mt-9 border-0 bg-accent text-ink hover:brightness-95">
              Solicitar disponibilidad <ArrowRight size={14} strokeWidth={2.2} />
            </button>
          </RevealOnScroll>
        </div>
      </section>

      {/* ═════════ CIERRE + FOOTER (componente compartido) ═════════ */}
      <LandingFooter
        image={ABOUT_IMG}
        imageAlt="Fachada de Quattro Plaza Center"
        eyebrow="Quattro Gardens y Quattro Long Island"
        title={<>Encuentra tu local en Quattro Plaza Center</>}
        text="Déjanos tus datos y un asesor te contacta con disponibilidad real, precios y planes de pago de Quattro Gardens y Quattro Long Island."
        ctaLabel="Quiero que me contacten"
        onCtaClick={scrollToForm}
        whatsappMessage="Hola, vi la campaña de Quattro Plaza Center (Gardens y Long Island) y quiero más información."
        disclaimer={
          <>
            Quattro Gardens y Quattro Long Island son desarrollos propios de Tresor Real Estate.
            Imágenes de carácter ilustrativo. * Precios, superficies, disponibilidad y condiciones
            de pago sujetos a cambio sin previo aviso y no constituyen una oferta. Consulta
            términos con un asesor. © {new Date().getFullYear()} Tresor Real Estate.
          </>
        }
      />

      {/* Sticky móvil */}
      <div className="fixed inset-x-0 bottom-0 z-40 flex items-center gap-2.5 border-t border-white/10 bg-ink/95 px-4 py-3 backdrop-blur-md lg:hidden">
        <a
          href={waLink('Hola, vi la campaña de Quattro Plaza Center (Gardens y Long Island) y quiero más información.')}
          target="_blank" rel="noopener noreferrer"
          aria-label="WhatsApp"
          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#25D366] text-white"
        >
          <MessageCircle size={20} strokeWidth={2} />
        </a>
        <button onClick={scrollToForm} className="flex flex-1 items-center justify-center gap-2 rounded-full bg-accent py-3.5 text-[12px] font-bold uppercase tracking-[0.18em] text-ink">
          Quiero información <ArrowRight size={14} strokeWidth={2.5} />
        </button>
      </div>
    </>
  );
}

/* ─────────────── card de proyecto ───────────────
   A diferencia de la de Lausana (departamentos), esta usa `dev.phases` y
   `dev.description` en vez de `tagline`/`highlights` — Gardens y Long
   Island no tienen esos campos cargados en el catálogo, y `phases` sí
   describe algo real y verificable (las marcas/etapas de cada plaza). */
function ProjectCard({ dev, image, onPick }: { dev: Development; image: string; onPick: () => void }) {
  const location = `${dev.zone ? `${dev.zone}, ` : ''}${dev.city}`;

  return (
    <div className="flex h-full flex-col gap-3 rounded-[28px] bg-white p-3">
      <div className="relative aspect-[4/3] overflow-hidden rounded-[20px]">
        <Image src={image} alt={dev.name} fill sizes="(max-width: 640px) 100vw, 50vw" className="object-cover" />
        <div className="absolute inset-0 bg-black/40" />
        <div className="absolute inset-x-4 top-4 z-10">
          {(dev.badge ?? dev.status) && (
            <span className="rounded-full bg-white/10 px-4 py-2 text-[10px] font-bold uppercase tracking-[0.2em] text-white backdrop-blur-md">
              {dev.badge ?? dev.status}
            </span>
          )}
        </div>
        {dev.logo && (
          <div
            className="absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2"
            style={{
              height: 92 * (dev.logoScale ?? 1),
              width: `${62 * (dev.logoScale ?? 1)}%`,
              maxWidth: 230 * (dev.logoScale ?? 1),
            }}
          >
            <Image src={dev.logo} alt={dev.name} fill className="object-contain" />
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col px-5 pb-5 pt-4">
        <span className="flex items-center gap-1 text-[9px] font-bold uppercase tracking-[0.12em] text-ink-3/60">
          <MapPin size={11} strokeWidth={2} style={{ display: 'inline' }} />
          {location}
        </span>

        <h3 className="mt-3 font-sans text-[clamp(18px,1.8vw,28px)] font-medium leading-[1.15] text-ink">{dev.name}</h3>

        {dev.description && (
          <p className="mt-1.5 text-[13px] font-light leading-relaxed text-ink-2">{dev.description}</p>
        )}

        <div className="mt-4 flex flex-wrap gap-x-4 gap-y-1 text-[12px] text-ink-3">
          {dev.phases && <span>{dev.phases}</span>}
          {dev.deliveryWindow && <span>Entrega {dev.deliveryWindow}</span>}
        </div>

        <div className="mt-auto pt-5">
          <span className="block text-[10px] font-bold uppercase tracking-caps text-ink-3/60">Precio desde</span>
          <span className="mt-1 block font-sans text-[20px] font-medium leading-tight text-ink">
            {(dev.priceLabel ?? '').replace(/^desde\s+/i, '') || 'Consultar'}
          </span>
          <button onClick={onPick} className="btn mt-4 w-full border-0 bg-ink py-3 text-white hover:bg-ink/85">
            Me interesa <ArrowRight size={14} strokeWidth={2.2} />
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─────────────── formulario ─────────────── */
function FormCard({
  form, set, valid, loading, err, submit, onPickProyecto,
}: {
  form: { firstName: string; email: string; phone: string; phoneCountry: string; proyecto: string; proposito: string };
  set: (k: string, v: string) => void;
  valid: boolean;
  loading: boolean;
  err: string;
  submit: (e: React.FormEvent) => void;
  onPickProyecto: (v: string) => void;
}) {
  const chip = (active: boolean) =>
    `rounded-xl border px-2 py-2.5 text-[11.5px] font-semibold transition ${
      active
        ? 'border-accent bg-accent text-ink'
        : 'border-white/15 bg-white/[0.07] text-white/75 hover:border-white/35 hover:text-white'
    }`;

  return (
    <div className="rounded-[28px] border-[10px] border-white/20 bg-ink/75 p-6 shadow-[0_30px_80px_rgba(0,0,0,0.45)] backdrop-blur-2xl md:p-7">
      <div className="mb-5">
        <span className="eyebrow eyebrow-accent font-bold">Atención personalizada</span>
        <p className="mt-2 text-[15px] font-medium text-white">Solicita disponibilidad y precios</p>
        <p className="mt-1 text-[12.5px] font-light text-white/50">Un asesor especializado te contacta hoy · Sin compromiso</p>
      </div>

      <form onSubmit={submit} className="flex flex-col gap-3">
        <input
          required type="text" placeholder="Tu nombre" autoComplete="name"
          value={form.firstName} onChange={(e) => set('firstName', e.target.value)}
          className="appearance-none rounded-2xl border border-white/10 bg-white px-4 py-3 text-[14px] text-ink outline-none transition-colors focus:border-accent"
        />
        <input
          required type="email" placeholder="Correo electrónico" autoComplete="email"
          value={form.email} onChange={(e) => set('email', e.target.value)}
          className="appearance-none rounded-2xl border border-white/10 bg-white px-4 py-3 text-[14px] text-ink outline-none transition-colors focus:border-accent"
        />
        <div className="flex items-stretch overflow-hidden rounded-2xl border border-white/10 bg-white focus-within:border-accent">
          <div className="relative shrink-0 border-r border-black/10">
            <select
              aria-label="País"
              value={form.phoneCountry}
              onChange={(e) => set('phoneCountry', e.target.value)}
              className="h-full appearance-none bg-transparent py-3 pl-3 pr-6 text-[14px] text-ink outline-none"
            >
              {COUNTRIES.map((c) => (
                <option key={c.code} value={c.code}>{c.flag} {c.dial}</option>
              ))}
            </select>
          </div>
          <input
            required type="tel" placeholder="Teléfono / WhatsApp" autoComplete="tel"
            value={form.phone} onChange={(e) => set('phone', e.target.value)}
            className="min-w-0 flex-1 appearance-none bg-white px-4 py-3 text-[14px] text-ink outline-none"
          />
        </div>

        <div className="pt-1">
          <p className="mb-2 text-[10.5px] uppercase tracking-caps text-white/45">¿Qué plaza te interesa?</p>
          <div className="grid grid-cols-1 gap-2">
            {PROYECTOS.map(({ v, l }) => (
              <button key={v} type="button" onClick={() => onPickProyecto(v)} className={chip(form.proyecto === v)}>
                {l}
              </button>
            ))}
          </div>
        </div>

        <div className="pt-1">
          {/* "Inversión" / "Mi negocio", no "Vivir" — refleja el campo real
              `intent: ['invertir', 'negocio']` del catálogo para estos dos
              desarrollos, distinto al binario vivir/inversión de Lausana
              (que sí es residencial). */}
          <p className="mb-2 text-[10.5px] uppercase tracking-caps text-white/45">¿Para qué lo buscas?</p>
          <div className="grid grid-cols-2 gap-2">
            {[
              { v: 'inversion', l: 'Inversión' },
              { v: 'negocio', l: 'Mi negocio' },
            ].map(({ v, l }) => (
              <button key={v} type="button" onClick={() => set('proposito', v)} className={chip(form.proposito === v)}>
                {l}
              </button>
            ))}
          </div>
        </div>

        {err && <p className="rounded-lg bg-red-50 px-3 py-2 text-[12px] text-red-700">{err}</p>}

        <button type="submit" disabled={!valid || loading} className="btn mt-2 w-full border-0 bg-accent py-4 text-ink hover:brightness-95 disabled:opacity-40">
          {loading ? 'Enviando…' : <>Solicitar información <ArrowRight size={14} strokeWidth={2.5} /></>}
        </button>
        <p className="flex items-center justify-center gap-1.5 text-center text-[10.5px] text-white/40">
          <ShieldCheck size={12} strokeWidth={2} /> Tus datos están seguros. Sin spam.
        </p>
      </form>
    </div>
  );
}
