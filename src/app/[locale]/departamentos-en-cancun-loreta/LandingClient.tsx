'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import {
  ArrowRight, MessageCircle, ChevronDown, Check, ShieldCheck,
} from 'lucide-react';
import RevealOnScroll from '@/components/RevealOnScroll';
import Gallery from '@/components/Gallery';
import FichaAmenities from '@/components/ficha/FichaAmenities';
import FichaFloorPlans from '@/components/ficha/FichaFloorPlans';
import FichaContentBlock from '@/components/ficha/FichaContentBlock';
import FichaLocationMap from '@/components/ficha/FichaLocationMap';
import LandingFooter, { waLink } from '@/components/landing/LandingFooter';
import { renderEditorial } from '@/lib/richText';
import type { Development } from '@/lib/developments';

/* ─────────────────────────── datos fijos de la landing ───────────────────────────
   Todo lo que SÍ cambia con el tiempo (precio, tipologías, amenidades,
   ubicación, galería) viene de `dev`, el catálogo real — no se hardcodea
   aquí. Eso es justo lo que se corrigió en Vellmari: un precio escrito a
   mano que quedó desfasado del real en Sanity. Solo el copy fijo de la
   landing (hero, banners, FAQ) vive en este archivo.                      */
const IMG = '/desarrollos/loreta';
const HERO_IMG = `${IMG}/7.-Piscina-Infinity_.jpg`;
const LOGO = `${IMG}/Loreta.svg`; // SVG blanco, verificado — funciona sobre foto oscura

const CTA_BANNER_1_IMG = `${IMG}/1.-Vista-Golf_.jpg`;
const CTA_BANNER_2_IMG = `${IMG}/10.-Alberca---Lago.jpg`;

const COUNTRIES = [
  { code: 'MX', dial: '+52', flag: '🇲🇽' },
  { code: 'US', dial: '+1', flag: '🇺🇸' },
  { code: 'CA', dial: '+1', flag: '🇨🇦' },
] as const;
const DIAL_CODES: Record<string, string> = Object.fromEntries(COUNTRIES.map((c) => [c.code, c.dial]));

const GALLERY_IMAGES = [
  `${IMG}/6.-Vista-Drone-2.jpg`,
  `${IMG}/21.-Sala-comedor---3-recámaras.jpg`,
  `${IMG}/27.-Cocina.jpg`,
  `${IMG}/19.-Recámara-Principal.jpg`,
  `${IMG}/20.-Recámara-Secundaria.jpg`,
  `${IMG}/22.-PH-6-y-7---Doble-Altur.jpg`,
  `${IMG}/23.-PH-1-y-4.jpg`,
  `${IMG}/11.-Lateral-Alberca.jpg`,
];

const AMENITIES_GALLERY = [
  `${IMG}/12.-Gym-Wellness.jpg`,
  `${IMG}/16.-Spa.jpg`,
  `${IMG}/17.-Kids-Club.jpg`,
  `${IMG}/11.1.-Asoleadero.jpg`,
];

const TOUR_URL = 'https://s3.us-east-2.amazonaws.com/live.vt/LORETA+VT/index.htm';

const FAQS = [
  {
    q: '¿Cuánto cuesta un departamento en Loreta?',
    a: 'Loreta tiene precio desde $3,800,000 MXN. Hay tipologías de 1 a 3 recámaras, además de Garden Houses y Penthouses de doble altura — el precio final depende de la superficie y la vista. Precios y planes de pago sujetos a cambio sin previo aviso; un asesor te confirma el vigente.',
  },
  {
    q: '¿Con cuánto puedo apartar mi unidad?',
    a: 'El apartado es de $25,000 MXN. Ese monto reserva la unidad de tu elección mientras se formaliza el contrato y el plan de pago con el desarrollador.',
  },
  {
    q: '¿Qué es Lausana Residencial?',
    a: 'Es la primera Smart City de Cancún: una comunidad privada de más de 15 hectáreas de áreas verdes, con lagos, ciclovías, parques y diseño urbano planeado — a 11 minutos del aeropuerto y 25 minutos de Puerto Cancún.',
  },
  {
    q: '¿Qué tipologías hay disponibles?',
    a: 'Departamentos de 1, 2 y 3 recámaras, además de unidades con cuarto de servicio, Garden Houses y Penthouses de doble altura (PH5 y PH8). Puedes ver todos los planos y superficies en esta misma página.',
  },
  {
    q: '¿Qué amenidades tiene el desarrollo?',
    a: 'Alberca infinity frente al lago, gimnasio, spa, kids club, pet park, ciclovía y áreas sociales — dentro de Loreta y las áreas comunes de Lausana Residencial.',
  },
  {
    q: '¿Quién desarrolla Loreta?',
    a: 'Loreta es un desarrollo de Live Desarrollos. Tresor Real Estate participa como comercializador autorizado, por lo que la asesoría, los precios y la disponibilidad son directos del desarrollador.',
  },
  {
    q: '¿Puedo agendar una visita?',
    a: 'Sí, presencial o por videollamada. Deja tus datos en el formulario y un asesor especializado te contacta con disponibilidad real, precios y planes de pago.',
  },
];

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
export default function LoretaLanding({ dev }: { dev: Development }) {
  const formRef = useRef<HTMLDivElement>(null);
  const utmRef = useRef<UTM>({});
  const [form, setForm] = useState({ firstName: '', email: '', phone: '', phoneCountry: 'MX', tipologia: '', proposito: '' });
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState('');

  useEffect(() => { utmRef.current = readUTM(); }, []);

  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));
  const valid = Boolean(form.firstName.trim() && form.email.trim() && form.phone.trim());
  const scrollToForm = () => formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });

  const priceLabel = (dev.priceLabel ?? '').replace(/^desde\s+/i, '');
  const tagline = dev.tagline?.es ?? 'Vive dentro de la primera Smart City de Cancún';
  const location = dev.location;

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!valid || loading) return;
    setErr('');
    setLoading(true);
    try {
      const res = await fetch('/api/loreta-lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: form.firstName,
          email: form.email,
          phone: `${DIAL_CODES[form.phoneCountry]} ${form.phone}`.trim(),
          country: form.phoneCountry,
          tipologia: form.tipologia || undefined,
          proposito: form.proposito || undefined,
          utm: utmRef.current,
        }),
      });
      if (!res.ok) throw new Error('fail');
      window.location.assign('/departamentos-en-cancun-loreta/gracias');
    } catch {
      setErr('Hubo un problema. Intenta de nuevo o escríbenos por WhatsApp.');
      setLoading(false);
    }
  }

  return (
    <>
      {/* ═════════ HERO ═════════ */}
      <section className="relative overflow-hidden bg-ink lg:flex lg:min-h-[94svh] lg:items-center">
        <div className="absolute inset-0 animate-hero-zoom">
          <Image
            src={HERO_IMG}
            alt="Loreta Wow Condos — alberca infinity y fachada, Lausana Residencial, Cancún"
            fill priority sizes="100vw"
            className="object-cover"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/80 to-ink/55 lg:to-ink/25" />
        <div className="absolute inset-0 lg:bg-gradient-to-r lg:from-ink lg:via-ink/60 lg:to-transparent" />

        <div className="container-wrap relative z-10 grid items-center gap-10 pb-14 pt-16 lg:grid-cols-[1.05fr_minmax(360px,440px)] lg:gap-16 lg:py-28">
          <div className="text-center text-white lg:text-left">
            <Image
              src={LOGO}
              alt="Loreta Wow Condos"
              width={251} height={47}
              priority
              className="mx-auto h-14 w-auto lg:mx-0 lg:h-16"
            />
            <p className="mt-3 text-[11px] font-medium uppercase tracking-eyebrow text-accent">
              Lausana Residencial · Live Desarrollos
            </p>

            <h1 className="mt-6 h-display text-[clamp(32px,5vw,64px)] text-white">
              {tagline}
            </h1>

            <p className="mx-auto mt-6 max-w-xl text-[15px] font-light leading-relaxed text-white/75 lg:mx-0 lg:text-[16px]">
              Departamentos de 1 a 3 recámaras y Garden Houses con vistas abiertas al paseo Lausana
              y al campo de golf, dentro de la primera Smart City de Cancún.
            </p>

            <div className="mt-7 flex flex-wrap justify-center gap-2 lg:justify-start">
              {['Vistas al golf y al lago', 'Alberca infinity', 'Aparta con $25,000'].map((g) => (
                <span key={g} className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border border-white/15 bg-white/[0.07] px-3.5 py-1.5 text-[11px] font-medium text-white/90 backdrop-blur-md lg:text-[12px]">
                  <Check size={12} strokeWidth={3} className="text-accent" /> {g}
                </span>
              ))}
            </div>

            <div className="mt-9 flex items-end justify-center gap-3 lg:justify-start">
              <span className="pb-1 text-[11px] font-medium uppercase tracking-caps text-white/50">Desde</span>
              <span className="h-display text-[clamp(26px,3.4vw,42px)] leading-none text-white">{priceLabel}</span>
            </div>
          </div>

          <div ref={formRef} id="aparta" className="scroll-mt-24">
            <FormCard form={form} set={set} valid={valid} loading={loading} err={err} submit={submit} devSlug={dev.slug} />
          </div>
        </div>

        <a href="#proyecto" aria-label="Ver más" className="absolute bottom-5 left-1/2 hidden -translate-x-1/2 text-white/40 transition hover:text-white lg:block">
          <ChevronDown size={26} className="animate-bounce" />
        </a>
      </section>

      {/* ═════════ CIFRAS ═════════ */}
      <section className="border-b border-white/10 bg-ink py-10 md:py-12">
        <div className="container-wrap grid grid-cols-2 gap-y-8 lg:grid-cols-4">
          {[
            { value: dev.highlights?.[1]?.value ?? '1 a 3 Rec y PH', label: 'Tipologías' },
            { value: dev.highlights?.[2]?.value?.replace(/^Desde\s*/i, '') ?? '79 m²', label: 'Desde' },
            { value: '15 ha', label: 'Áreas verdes en Lausana' },
            { value: '$25,000', label: 'Para apartar' },
          ].map(({ value, label }, i) => (
            <div key={label} className={`px-2 text-center lg:px-8 ${i > 0 ? 'lg:border-l lg:border-white/10' : ''}`}>
              <div className="h-display text-[clamp(24px,2.8vw,38px)] text-accent">{value}</div>
              <div className="mt-2 text-[11px] uppercase tracking-caps text-white/45">{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ═════════ EL PROYECTO ═════════ */}
      <section id="proyecto" className="scroll-mt-16 bg-white py-24 md:py-32">
        <div className="container-wrap grid gap-12 lg:grid-cols-2 lg:items-center lg:gap-20">
          <RevealOnScroll>
            <span className="eyebrow eyebrow-accent font-bold">— El proyecto</span>
            <h2 className="mt-5 h-display text-[clamp(28px,3.6vw,52px)] text-ink">
              {dev.projectTitle?.es ?? 'Departamentos de 1 a 3 recámaras'}<br />
              <span className="text-ink-3">{dev.projectTitleMuted?.es ?? 'y Garden Houses en Lausana Residencial'}</span>
            </h2>
            <div className="mt-7 space-y-5 text-[15px] font-light leading-relaxed text-ink-2 md:text-[16px]">
              {(dev.projectBody ?? []).map((p) => (
                <p key={(p.es ?? '').slice(0, 30)}>{renderEditorial(p.es ?? '')}</p>
              ))}
            </div>
            <button onClick={scrollToForm} className="btn btn-lg mt-9 border-0 bg-ink text-white hover:bg-ink/85">
              Solicita precios y disponibilidad <ArrowRight size={14} strokeWidth={2.2} />
            </button>
          </RevealOnScroll>

          <RevealOnScroll delay={120}>
            <div className="relative aspect-[4/5] overflow-hidden rounded-[28px] bg-bg-soft">
              <Image
                src={CTA_BANNER_1_IMG}
                alt="Vista al campo de golf desde Loreta, Lausana Residencial"
                fill sizes="(max-width:1024px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
          </RevealOnScroll>
        </div>
      </section>

      {/* ═════════ BANNER CTA 1 ═════════ */}
      <CtaBanner
        image={CTA_BANNER_1_IMG}
        alt="Vista al campo de golf y al lago desde un balcón de Loreta"
        eyebrow="Un entorno, no solo un departamento"
        title={<>Despierta con vista<br />al golf y al lago</>}
        text="Balcones abiertos al paseo Lausana, en una de las comunidades privadas de mayor plusvalía de Cancún."
        cta="Solicitar disponibilidad"
        onClick={scrollToForm}
      />

      {/* ═════════ LAUSANA RESIDENCIAL (módulo editorial real de la ficha) ═════════ */}
      {dev.contentBlocks?.[0] && (
        <FichaContentBlock block={dev.contentBlocks[0]} locale="es" gray />
      )}

      {/* ═════════ UBICACIÓN ═════════ */}
      {location && (
        <section className="bg-white py-24 md:py-32">
          <div className="container-wrap">
            <RevealOnScroll className="max-w-3xl">
              <span className="eyebrow eyebrow-accent font-bold">— Ubicación</span>
              <h2 className="mt-5 h-display text-[clamp(28px,3.6vw,52px)] text-ink">
                Al sur de Cancún,<br /><span className="text-ink-3">dentro de Lausana Residencial</span>
              </h2>
            </RevealOnScroll>

            <div className="mt-12 grid gap-4 lg:grid-cols-2 lg:gap-6">
              <RevealOnScroll className="flex flex-col gap-4 lg:gap-6">
                <ul className="grid gap-3 rounded-[28px] bg-bg-soft p-7 md:p-8">
                  {(dev.locationBullets ?? []).map((b) => (
                    <li key={b.es} className="flex items-center gap-4">
                      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-accent/12 text-ink">
                        <Check size={16} strokeWidth={2.4} className="text-ink" />
                      </span>
                      <span className="text-[14.5px] text-ink-2">{b.es}</span>
                    </li>
                  ))}
                </ul>
              </RevealOnScroll>

              <RevealOnScroll delay={120} className="min-h-[260px] overflow-hidden rounded-[28px] bg-bg-soft [&>div]:h-full [&>div]:min-h-[260px] [&>div]:rounded-none [&>div]:border-0">
                <FichaLocationMap
                  lat={location.lat}
                  lng={location.lng}
                  address="Lausana Residencial, Cancún, Q. Roo"
                  mapStyle={location.mapStyle}
                  locale="es"
                />
              </RevealOnScroll>
            </div>
          </div>
        </section>
      )}

      {/* ═════════ AMENIDADES (módulo real de la ficha) ═════════ */}
      {dev.amenities && dev.amenities.length > 0 && (
        <FichaAmenities
          amenities={dev.amenities}
          locale="es"
          gray
          galleryImages={AMENITIES_GALLERY}
          devName={dev.name}
        />
      )}

      {/* ═════════ GALERÍA (mismo componente que las fichas) ═════════ */}
      <Gallery
        images={GALLERY_IMAGES}
        alt="Loreta Wow Condos — Lausana Residencial, Cancún"
        eyebrow="— Galería"
        title="Arquitectura e interiores"
        tourUrl={TOUR_URL}
        gray={false}
      />

      {/* ═════════ BANNER CTA 2 ═════════ */}
      <CtaBanner
        image={CTA_BANNER_2_IMG}
        alt="Alberca frente al lago en Loreta, Lausana Residencial"
        eyebrow="Preventa · Inventario limitado"
        title={<>Elige tu tipología<br />antes que alguien más</>}
        text="Un asesor especializado te comparte disponibilidad real por tipología, precios y planes de pago."
        cta="Ver disponibilidad"
        onClick={scrollToForm}
      />

      {/* ═════════ FLOOR PLANS (módulo real de la ficha) ═════════ */}
      {dev.floorPlans && dev.floorPlans.length > 0 && (
        <FichaFloorPlans floorPlans={dev.floorPlans} locale="es" gray />
      )}

      {/* ═════════ FAQ ═════════ */}
      <section className="bg-white py-24 md:py-32">
        <div className="container-wrap max-w-3xl">
          <span className="eyebrow eyebrow-accent font-bold">— Preguntas frecuentes</span>
          <h2 className="mt-5 h-display text-[clamp(28px,3.6vw,52px)] text-ink">
            Todo sobre Loreta
          </h2>
          <div className="mt-10">
            {FAQS.map((f) => <FaqItem key={f.q} q={f.q} a={f.a} />)}
          </div>
        </div>
      </section>

      {/* ═════════ CIERRE + FOOTER (componente compartido) ═════════ */}
      <LandingFooter
        image={HERO_IMG}
        imageAlt="Loreta Wow Condos al atardecer — Lausana Residencial"
        eyebrow="Preventa · Lausana Residencial"
        title={<>Tu departamento con vista al golf y al lago</>}
        text="Déjanos tus datos y un asesor especializado te contacta con disponibilidad real, precios y planes de pago."
        ctaLabel="Solicitar información"
        onCtaClick={scrollToForm}
        whatsappMessage="Hola, me interesa un departamento en Loreta, Lausana Residencial."
        disclaimer={
          <>
            Loreta es un desarrollo de Live Desarrollos; Tresor Real Estate participa como
            comercializador autorizado. Imágenes de carácter ilustrativo. * Precios, superficies y
            condiciones de pago sujetos a cambio sin previo aviso. Consulta términos y
            disponibilidad con un asesor. © {new Date().getFullYear()} Tresor Real Estate.
          </>
        }
      />

      {/* Sticky móvil */}
      <div className="fixed inset-x-0 bottom-0 z-40 flex items-center gap-2.5 border-t border-white/10 bg-ink/95 px-4 py-3 backdrop-blur-md lg:hidden">
        <a
          href={waLink('Hola, me interesa un departamento en Loreta, Lausana Residencial.')}
          target="_blank" rel="noopener noreferrer"
          aria-label="WhatsApp"
          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#25D366] text-white"
        >
          <MessageCircle size={20} strokeWidth={2} />
        </a>
        <button onClick={scrollToForm} className="flex flex-1 items-center justify-center gap-2 rounded-full bg-accent py-3.5 text-[12px] font-bold uppercase tracking-[0.18em] text-ink">
          Agenda tu visita <ArrowRight size={14} strokeWidth={2.5} />
        </button>
      </div>
    </>
  );
}

/* ─────────────── banner CTA full-width ─────────────── */
function CtaBanner({
  image, alt, eyebrow, title, text, cta, onClick,
}: {
  image: string;
  alt: string;
  eyebrow: string;
  title: React.ReactNode;
  text: string;
  cta: string;
  onClick: () => void;
}) {
  return (
    <section className="relative isolate flex min-h-[62vh] items-center overflow-hidden bg-ink py-24 md:min-h-[70vh] md:py-32">
      <Image src={image} alt={alt} fill sizes="100vw" className="object-cover" />
      <div className="absolute inset-0 bg-ink/55" />
      <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-transparent to-transparent" />

      <div className="container-wrap relative z-10">
        <RevealOnScroll className="mx-auto max-w-3xl text-center">
          <span className="eyebrow eyebrow-accent font-bold">{eyebrow}</span>
          <h2 className="mt-5 h-display text-[clamp(28px,4vw,58px)] text-white">{title}</h2>
          <p className="mx-auto mt-6 max-w-2xl text-[16px] font-normal leading-relaxed text-white/85 md:text-[18px]">
            {text}
          </p>
          <button onClick={onClick} className="btn btn-lg mt-9 border-0 bg-accent text-ink hover:brightness-95">
            {cta} <ArrowRight size={14} strokeWidth={2.2} />
          </button>
        </RevealOnScroll>
      </div>
    </section>
  );
}

/* ─────────────── FAQ item ─────────────── */
function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-line">
      <button onClick={() => setOpen((o) => !o)} className="flex w-full items-center justify-between gap-4 py-5 text-left">
        <span className="text-[15px] font-semibold text-ink">{q}</span>
        <ChevronDown size={18} className={`shrink-0 text-ink-3 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && <p className="pb-5 text-[14px] leading-relaxed text-ink-3">{a}</p>}
    </div>
  );
}

/* ─────────────── form card ─────────────── */
function FormCard({
  form, set, valid, loading, err, submit,
}: {
  form: { firstName: string; email: string; phone: string; phoneCountry: string; tipologia: string; proposito: string };
  set: (k: string, v: string) => void;
  valid: boolean;
  loading: boolean;
  err: string;
  submit: (e: React.FormEvent) => void;
  devSlug: string;
}) {
  const chip = (active: boolean) =>
    `rounded-xl border px-2 py-2.5 text-[11.5px] font-semibold transition ${
      active
        ? 'border-accent bg-accent text-ink'
        : 'border-white/15 bg-white/[0.07] text-white/75 hover:border-white/35 hover:text-white'
    }`;

  return (
    <div className="rounded-[28px] border border-white/12 bg-ink/75 p-6 shadow-[0_30px_80px_rgba(0,0,0,0.45)] backdrop-blur-2xl md:p-7">
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
          <p className="mb-2 text-[10.5px] uppercase tracking-caps text-white/45">Tipología de interés</p>
          <div className="grid grid-cols-2 gap-2">
            {[
              { v: '1rec', l: '1 Recámara' },
              { v: '2rec', l: '2 Recámaras' },
              { v: '3rec', l: '3 Recámaras' },
              { v: 'ph', l: 'PH / Garden House' },
            ].map(({ v, l }) => (
              <button key={v} type="button" onClick={() => set('tipologia', v)} className={chip(form.tipologia === v)}>
                {l}
              </button>
            ))}
          </div>
        </div>

        <div className="pt-1">
          <p className="mb-2 text-[10.5px] uppercase tracking-caps text-white/45">¿Para qué la buscas?</p>
          <div className="grid grid-cols-2 gap-2">
            {[
              { v: 'vivir', l: 'Vivir' },
              { v: 'inversion', l: 'Inversión' },
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
