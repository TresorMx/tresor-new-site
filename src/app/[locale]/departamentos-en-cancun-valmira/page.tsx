'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import {
  Zap, BadgePercent, Sofa, ShieldCheck, ArrowRight, MessageCircle, Phone,
  BedDouble, Bath, Car, Ruler, Dumbbell, Dog, Baby, Trophy, Play,
  Plane, Train, MapPin, Check, ChevronDown,
} from 'lucide-react';
import Chatbot from '@/components/Chatbot';
import VirtualTourModal from '@/components/ficha/VirtualTourModal';
import LocationMap from '@/components/LocationMap';

/* ─────────────── datos reales de Valmira ─────────────── */
const WA = '529984045602';
const waLink = (msg: string) => `https://wa.me/${WA}?text=${encodeURIComponent(msg)}`;

const GANCHOS = [
  { icon: Zap,          label: 'Entrega inmediata',   sub: 'Sin esperar obra' },
  { icon: BadgePercent, label: '0% de enganche',      sub: 'Facilidades de pago' },
  { icon: Sofa,         label: 'Totalmente equipado', sub: 'Cocina y acabados premium' },
  { icon: ShieldCheck,  label: 'Comunidad privada',   sub: 'Gran Vía, Av. Huayacán' },
];

const GALLERY = [
  { src: '/desarrollos/Valmira/galeria-valmira/Sala.jpg',    alt: 'Sala de departamento equipado en Valmira Cancún', big: true },
  { src: '/desarrollos/Valmira/galeria-valmira/Cocina.jpg',  alt: 'Cocina integral equipada — Valmira Cancún' },
  { src: '/desarrollos/Valmira/galeria-valmira/Hab..jpg',    alt: 'Recámara principal — Valmira Cancún' },
  { src: '/desarrollos/Valmira/galeria-valmira/Comedor.jpg', alt: 'Comedor — departamento Valmira Cancún' },
  { src: '/desarrollos/Valmira/galeria-valmira/Fachada.jpg', alt: 'Fachada de Valmira, Urban Homes en Cancún' },
];

const TIPOLOGIAS = [
  {
    id: '2rec',
    label: '2 Recámaras',
    price: 'Desde $2,595,000 MXN',
    image: '/desarrollos/Valmira/floor-plans/2rec.webp',
    matterport: 'https://my.matterport.com/show/?m=nVe4hfX2hZw',
    specs: [
      { icon: BedDouble, label: 'Recámaras', value: '2' },
      { icon: Bath,      label: 'Baños',     value: '2' },
      { icon: Ruler,     label: 'Superficie', value: '87 m²' },
      { icon: Car,       label: 'Estacionamiento', value: '1 a 2 cajones' },
    ],
  },
  {
    id: '3rec',
    label: '3 Recámaras',
    price: 'Consulta precio',
    image: '/desarrollos/Valmira/floor-plans/3rec.webp',
    matterport: null,
    specs: [
      { icon: BedDouble, label: 'Recámaras', value: '3' },
      { icon: Bath,      label: 'Baños',     value: '2' },
      { icon: Ruler,     label: 'Superficie', value: '109 m²' },
      { icon: Car,       label: 'Estacionamiento', value: '1 a 2 cajones' },
    ],
  },
];

const AMENIDADES = [
  { icon: Dumbbell, label: 'Gym & Wellness' },
  { icon: Dog,      label: 'Pet Park' },
  { icon: Trophy,   label: 'Cancha de Pádel' },
  { icon: Trophy,   label: 'Cancha de Fútbol' },
  { icon: Baby,     label: 'Área de Niños' },
];

const UBICACION = [
  { icon: Plane, label: 'A 12 minutos del Aeropuerto de Cancún' },
  { icon: Train, label: 'A 9 minutos de la estación del Tren Maya' },
  { icon: MapPin, label: 'Sobre Av. Huayacán, dentro de Gran Vía' },
];

const FAQS = [
  { q: '¿Cuánto cuesta un departamento en Valmira, Cancún?', a: 'Los departamentos en Valmira tienen precio desde $2,595,000 MXN para la tipología de 2 recámaras (87 m²). La tipología de 3 recámaras es de 109 m². Precios y condiciones de pago sujetos a cambio sin previo aviso; un asesor te confirma el precio y plan de pago vigente.' },
  { q: '¿Los departamentos son de entrega inmediata?', a: 'Sí. Valmira es un desarrollo de entrega inmediata: los departamentos están listos para habitar o rentar desde el primer día, sin esperar a que termine la construcción.' },
  { q: '¿Los departamentos vienen equipados?', a: 'Sí. Cada departamento incluye cocina integral equipada, walk-in closet y acabados premium importados, pensados para mudarte o rentar de inmediato.' },
  { q: '¿Dónde está ubicado Valmira?', a: 'Valmira está sobre Av. Huayacán, dentro de la comunidad privada Gran Vía, una de las zonas de mayor plusvalía de Cancún — a 12 minutos del aeropuerto y a 9 minutos de la estación del Tren Maya.' },
  { q: '¿Qué amenidades tiene la comunidad?', a: 'Gym & Wellness, pet park, cancha de pádel, cancha de fútbol y área de niños, dentro de una comunidad privada con acceso controlado.' },
  { q: '¿Puedo agendar una visita?', a: 'Sí, presencial o por videollamada. Deja tu nombre y teléfono en el formulario y un asesor te contacta el mismo día con disponibilidad, precios y planes de pago.' },
];

const JSONLD = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Residence',
      name: 'Valmira — Departamentos en Cancún',
      description: 'Departamentos equipados de 2 y 3 recámaras en Cancún con entrega inmediata, sobre Av. Huayacán dentro de la comunidad Gran Vía. Desarrollo de Urban Homes.',
      url: 'https://www.tresor.mx/departamentos-en-cancun-valmira',
      image: 'https://www.tresor.mx/og/valmira.jpg',
      address: { '@type': 'PostalAddress', streetAddress: 'Av. Huayacán, Gran Vía', addressLocality: 'Cancún', addressRegion: 'Quintana Roo', postalCode: '77560', addressCountry: 'MX' },
      geo: { '@type': 'GeoCoordinates', latitude: 21.0753984, longitude: -86.8860978 },
    },
    {
      '@type': 'Offer',
      name: 'Departamentos en venta en Cancún — Valmira',
      price: 2595000,
      priceCurrency: 'MXN',
      availability: 'https://schema.org/InStock',
      url: 'https://www.tresor.mx/departamentos-en-cancun-valmira',
      seller: { '@type': 'Organization', name: 'Tresor Real Estate', telephone: '+529984045602' },
    },
    {
      '@type': 'FAQPage',
      mainEntity: FAQS.map(({ q, a }) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })),
    },
  ],
};

/* ─────────────── UTM ─────────────── */
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

/* ─────────────── página ─────────────── */
export default function ValmiraLanding() {
  const formRef = useRef<HTMLDivElement>(null);
  const utmRef = useRef<UTM>({});
  const [form, setForm] = useState({ firstName: '', email: '', phone: '', tipologia: '' });
  const [tab, setTab] = useState('2rec');
  const [tourUrl, setTourUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState('');

  useEffect(() => { utmRef.current = readUTM(); }, []);

  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));
  const valid = form.firstName.trim() && form.email.trim() && form.phone.trim();
  const scrollToForm = () => formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!valid || loading) return;
    setErr('');
    setLoading(true);
    try {
      const res = await fetch('/api/valmira-lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: form.firstName,
          email: form.email,
          phone: form.phone,
          tipologia: form.tipologia || undefined,
          utm: utmRef.current,
        }),
      });
      if (!res.ok) throw new Error('fail');
      // El evento de conversión (gtag + fbq) se dispara en /gracias — un solo
      // punto de verdad para Google Ads y Meta.
      window.location.assign('/departamentos-en-cancun-valmira/gracias');
    } catch {
      setErr('Hubo un problema. Intenta de nuevo o escríbenos por WhatsApp.');
      setLoading(false);
    }
  }

  const activeTipo = TIPOLOGIAS.find((t) => t.id === tab)!;

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(JSONLD) }} />

      {/* ═════════ HERO ═════════ */}
      <section className="relative flex min-h-[92svh] items-center overflow-hidden bg-ink">
        <Image
          src="/desarrollos/Valmira/portadaValmira.jpg"
          alt="Valmira — departamentos en venta en Cancún con entrega inmediata"
          fill priority sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/80 to-ink/40" />
        <div className="absolute inset-0 bg-gradient-to-r from-ink/85 via-ink/40 to-transparent" />

        <div className="container-wrap relative z-10 grid items-center gap-10 py-24 lg:grid-cols-[1.05fr_minmax(340px,430px)] lg:gap-14">
          {/* copy */}
          <div className="text-white">
            <Image
              src="/desarrollos/Valmira/logovalmira.svg"
              alt="Valmira"
              width={200} height={47}
              priority
              className="h-9 w-auto md:h-11"
            />
            <h1 className="mt-6 h-display text-[clamp(34px,5.2vw,66px)] text-white">
              Departamentos equipados en Cancún con <span className="text-accent">entrega inmediata</span>
            </h1>

            {/* ganchos chips */}
            <div className="mt-6 flex flex-wrap gap-2.5">
              {['0% de enganche', 'Totalmente equipado', 'Entrega inmediata'].map((g) => (
                <span key={g} className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-3.5 py-1.5 text-[12px] font-semibold text-white backdrop-blur-md">
                  <Check size={13} strokeWidth={3} className="text-accent" /> {g}
                </span>
              ))}
            </div>

            <div className="mt-7 flex items-end gap-3">
              <span className="text-[13px] font-medium uppercase tracking-caps text-white/60">Desde</span>
              <span className="h-display text-[clamp(26px,3.4vw,40px)] text-white leading-none">$2,595,000 MXN</span>
            </div>
            <p className="mt-2 text-[14px] font-light text-white/70">
              2 y 3 recámaras · desde 87 m² · Gran Vía, sobre Av. Huayacán
            </p>

            {/* CTAs (visibles sobre todo en móvil, donde el form queda abajo) */}
            <div className="mt-8 flex flex-wrap gap-3 lg:hidden">
              <button onClick={scrollToForm} className="inline-flex items-center gap-2 rounded-full bg-accent px-7 py-3.5 text-[12px] font-bold uppercase tracking-[0.18em] text-ink transition hover:brightness-95">
                Agenda tu visita <ArrowRight size={14} strokeWidth={2.5} />
              </button>
              <a href={waLink('Hola, me interesa Valmira en Cancún. Quiero más información.')} target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-white/30 px-7 py-3.5 text-[12px] font-bold uppercase tracking-[0.18em] text-white transition hover:border-white/60">
                <MessageCircle size={14} strokeWidth={2} /> WhatsApp
              </a>
            </div>
          </div>

          {/* form glass */}
          <div ref={formRef} id="agenda" className="scroll-mt-24">
            <FormCard
              form={form} set={set} valid={valid} loading={loading} err={err} submit={submit}
            />
          </div>
        </div>

        <a href="#tipologias" className="absolute bottom-5 left-1/2 hidden -translate-x-1/2 text-white/50 transition hover:text-white lg:block">
          <ChevronDown size={26} className="animate-bounce" />
        </a>
      </section>

      {/* ═════════ GANCHOS STRIP ═════════ */}
      <section className="relative z-10 -mt-10 rounded-t-[2.5rem] bg-bg-soft py-14 md:py-16">
        <div className="container-wrap grid grid-cols-2 gap-4 lg:grid-cols-4">
          {GANCHOS.map(({ icon: Icon, label, sub }) => (
            <div key={label} className="flex flex-col items-start gap-3 rounded-[24px] bg-white p-6">
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-accent/15 text-ink">
                <Icon size={20} strokeWidth={1.8} />
              </span>
              <div>
                <div className="text-[15px] font-semibold text-ink leading-tight">{label}</div>
                <div className="mt-0.5 text-[12.5px] font-light text-ink-3">{sub}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ═════════ GALERÍA ═════════ */}
      <section className="bg-white py-20 md:py-28">
        <div className="container-wrap">
          <span className="eyebrow eyebrow-accent font-bold">— Conócelo por dentro</span>
          <h2 className="mt-4 h-display text-[clamp(26px,3.4vw,48px)] text-ink max-w-2xl">
            Departamentos listos para habitar, con acabados premium
          </h2>

          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {GALLERY.map((g) => (
              <div key={g.src} className={`relative overflow-hidden rounded-[24px] bg-bg-soft ${g.big ? 'md:col-span-2 md:row-span-2 aspect-[4/3] md:aspect-auto' : 'aspect-[4/3]'}`}>
                <Image src={g.src} alt={g.alt} fill sizes="(max-width:768px) 100vw, 33vw" className="object-cover transition-transform duration-700 hover:scale-105" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═════════ TIPOLOGÍAS ═════════ */}
      <section id="tipologias" className="scroll-mt-20 bg-bg-soft py-20 md:py-28">
        <div className="container-wrap">
          <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
            <div>
              <span className="eyebrow eyebrow-accent font-bold">— Tipologías</span>
              <h2 className="mt-4 h-display text-[clamp(26px,3.4vw,48px)] text-ink">Elige tu departamento</h2>
            </div>
            <div className="flex gap-2 rounded-full bg-white p-1.5">
              {TIPOLOGIAS.map((t) => (
                <button key={t.id} onClick={() => setTab(t.id)}
                  className={`rounded-full px-6 py-2.5 text-[13px] font-bold uppercase tracking-[0.12em] transition ${tab === t.id ? 'bg-ink text-white' : 'text-ink-3 hover:text-ink'}`}>
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-10 grid gap-4 overflow-hidden rounded-[32px] bg-white p-4 md:grid-cols-2 md:p-5">
            <div className="relative aspect-[4/3] overflow-hidden rounded-[22px] bg-bg-soft md:aspect-auto">
              <Image src={activeTipo.image} alt={`Plano ${activeTipo.label} — Valmira Cancún`} fill sizes="(max-width:768px) 100vw, 50vw" className="object-contain p-4" />
            </div>
            <div className="flex flex-col justify-center p-4 md:p-8">
              <span className="text-[13px] font-medium uppercase tracking-caps text-accent">{activeTipo.price}</span>
              <h3 className="mt-2 h-display text-[clamp(24px,2.6vw,36px)] text-ink">{activeTipo.label}</h3>
              <div className="mt-6 grid grid-cols-2 gap-4">
                {activeTipo.specs.map((s) => (
                  <div key={s.label} className="flex items-center gap-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-full bg-bg-soft text-ink"><s.icon size={17} strokeWidth={1.7} /></span>
                    <div>
                      <div className="text-[14px] font-semibold text-ink leading-tight">{s.value}</div>
                      <div className="text-[11px] uppercase tracking-[0.12em] text-ink-3">{s.label}</div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-8 flex flex-wrap gap-3">
                <button onClick={scrollToForm} className="inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 text-[12px] font-bold uppercase tracking-[0.18em] text-ink transition hover:brightness-95">
                  Agenda tu visita <ArrowRight size={13} strokeWidth={2.5} />
                </button>
                {activeTipo.matterport && (
                  <button onClick={() => setTourUrl(activeTipo.matterport)}
                    className="inline-flex items-center gap-2 rounded-full border border-ink/15 px-6 py-3 text-[12px] font-bold uppercase tracking-[0.18em] text-ink transition hover:border-ink/40">
                    <Play size={13} strokeWidth={2} className="fill-current" /> Recorrido virtual
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═════════ AMENIDADES ═════════ */}
      <section className="bg-white py-20 md:py-28">
        <div className="container-wrap">
          <span className="eyebrow eyebrow-accent font-bold">— Amenidades</span>
          <h2 className="mt-4 h-display text-[clamp(26px,3.4vw,48px)] text-ink max-w-2xl">Todo dentro de la comunidad</h2>
          <div className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-5">
            {AMENIDADES.map(({ icon: Icon, label }) => (
              <div key={label} className="flex flex-col items-center gap-3 rounded-[24px] border border-line bg-bg-soft px-4 py-8 text-center">
                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-ink"><Icon size={22} strokeWidth={1.6} /></span>
                <span className="text-[13px] font-semibold text-ink">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═════════ UBICACIÓN ═════════ */}
      <section className="bg-bg-soft py-20 md:py-28">
        <div className="container-wrap grid gap-10 lg:grid-cols-[1fr_1.3fr] lg:items-center">
          <div>
            <span className="eyebrow eyebrow-accent font-bold">— Ubicación</span>
            <h2 className="mt-4 h-display text-[clamp(26px,3.4vw,48px)] text-ink">En una de las zonas de mayor plusvalía de Cancún</h2>
            <ul className="mt-8 space-y-4">
              {UBICACION.map(({ icon: Icon, label }) => (
                <li key={label} className="flex items-center gap-4">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white text-ink"><Icon size={18} strokeWidth={1.7} /></span>
                  <span className="text-[15px] text-ink-2">{label}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="overflow-hidden rounded-[28px] border border-line bg-white [&>div]:h-[440px] [&>div]:rounded-none [&>div]:border-0">
            <LocationMap lat={21.0753984} lng={-86.8860978} zoom={14} address="Gran Vía, Av. Huayacán, Cancún" />
          </div>
        </div>
      </section>

      {/* ═════════ FAQ ═════════ */}
      <section className="bg-white py-20 md:py-28">
        <div className="container-wrap max-w-3xl">
          <span className="eyebrow eyebrow-accent font-bold">— Preguntas frecuentes</span>
          <h2 className="mt-4 h-display text-[clamp(26px,3.4vw,48px)] text-ink">Todo sobre Valmira en Cancún</h2>
          <div className="mt-10">
            {FAQS.map((f) => <FaqItem key={f.q} q={f.q} a={f.a} />)}
          </div>
        </div>
      </section>

      {/* ═════════ CIERRE OSCURO (CTA + footer) — mismo patrón que el Footer del sitio:
              bloque oscuro que se desliza sobre la sección clara con top redondeado ═════════ */}
      <footer data-nav="dark" className="relative z-10 -mt-10 overflow-hidden rounded-t-[2.5rem] bg-bg-deep pt-24 text-white">
        <div className="container-wrap text-center">
          <span className="eyebrow eyebrow-accent font-bold">Entrega inmediata · Unidades limitadas</span>
          <h2 className="mx-auto mt-5 h-display text-[clamp(28px,4vw,56px)] text-white max-w-3xl">
            Tu departamento en Cancún, listo para estrenar
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-[15px] font-light text-white/60">
            Déjanos tus datos y un asesor te contacta hoy con precios, planes de pago y disponibilidad real.
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <button onClick={scrollToForm} className="inline-flex items-center gap-2 rounded-full bg-accent px-8 py-4 text-[12px] font-bold uppercase tracking-[0.18em] text-ink transition hover:brightness-95">
              Agenda tu visita <ArrowRight size={14} strokeWidth={2.5} />
            </button>
            <a href={waLink('Hola, me interesa Valmira en Cancún. Quiero más información.')} target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-white/25 px-8 py-4 text-[12px] font-bold uppercase tracking-[0.18em] text-white transition hover:border-white/60">
              <MessageCircle size={14} strokeWidth={2} /> WhatsApp
            </a>
          </div>

          <div className="mx-auto mt-20 h-px w-24" style={{ background: 'linear-gradient(to right, transparent, #FAB413, transparent)' }} />

          <div className="flex flex-col items-center gap-5 pb-12 pt-10">
            <Image src="/logos/LogoTresor.svg" alt="Tresor Real Estate" width={130} height={34} className="h-8 w-auto opacity-90" />
            <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-[13px] text-white/60">
              <a href="tel:+529984045602" className="inline-flex items-center gap-2 transition hover:text-white"><Phone size={14} /> +52 998 404 5602</a>
              <a href={waLink('Hola, me interesa Valmira en Cancún.')} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 transition hover:text-white"><MessageCircle size={14} /> WhatsApp</a>
            </div>
            <p className="max-w-2xl text-[11px] leading-relaxed text-white/35">
              Valmira es un desarrollo de Urban Homes; Tresor Real Estate participa como comercializador. Imágenes de carácter ilustrativo. * Precios y condiciones de pago sujetos a cambio sin previo aviso. Consulta términos y disponibilidad con un asesor. © {new Date().getFullYear()} Tresor Real Estate.
            </p>
          </div>
        </div>
      </footer>

      {/* Sticky móvil */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-white/10 bg-ink/95 px-4 py-3 backdrop-blur-md lg:hidden">
        <button onClick={scrollToForm} className="flex w-full items-center justify-center gap-2 rounded-full bg-accent py-3.5 text-[12px] font-bold uppercase tracking-[0.18em] text-ink">
          Agenda tu visita <ArrowRight size={14} strokeWidth={2.5} />
        </button>
      </div>

      {/* Chatbot exclusivo de Valmira */}
      <Chatbot devSlug="valmira-urban" landing />

      {/* Recorrido virtual en popup (mismo modal que las fichas) */}
      <VirtualTourModal url={tourUrl} onClose={() => setTourUrl(null)} title="Valmira · Recorrido virtual" />
    </>
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

/* ─────────────── form card (glass) ─────────────── */
function FormCard({
  form, set, valid, loading, err, submit,
}: {
  form: { firstName: string; email: string; phone: string; tipologia: string };
  set: (k: string, v: string) => void;
  valid: boolean | string;
  loading: boolean;
  err: string;
  submit: (e: React.FormEvent) => void;
}) {
  return (
    <div className="rounded-[28px] border border-white/15 bg-ink/70 p-6 shadow-[0_24px_64px_rgba(0,0,0,0.35)] backdrop-blur-2xl md:p-7">
      <div className="mb-5">
        <span className="eyebrow eyebrow-accent font-bold">Agenda tu visita</span>
        <p className="mt-1.5 text-[13px] text-white/55">Un asesor te contacta hoy · Sin compromiso</p>
      </div>
      <form onSubmit={submit} className="flex flex-col gap-3.5">
        <input
          required type="text" placeholder="Tu nombre"
          value={form.firstName} onChange={(e) => set('firstName', e.target.value)}
          className="appearance-none rounded-2xl border border-line bg-white px-4 py-3 text-[14px] outline-none transition-colors focus:border-ink-4"
        />
        <input
          required type="email" placeholder="Correo electrónico"
          value={form.email} onChange={(e) => set('email', e.target.value)}
          className="appearance-none rounded-2xl border border-line bg-white px-4 py-3 text-[14px] outline-none transition-colors focus:border-ink-4"
        />
        <input
          required type="tel" placeholder="Teléfono / WhatsApp"
          value={form.phone} onChange={(e) => set('phone', e.target.value)}
          className="appearance-none rounded-2xl border border-line bg-white px-4 py-3 text-[14px] outline-none transition-colors focus:border-ink-4"
        />
        <div className="grid grid-cols-3 gap-2">
          {[
            { v: '2rec', l: '2 rec.' },
            { v: '3rec', l: '3 rec.' },
            { v: 'indeciso', l: 'No sé aún' },
          ].map(({ v, l }) => (
            <button key={v} type="button" onClick={() => set('tipologia', v)}
              className={`rounded-xl border py-2.5 text-[12px] font-semibold transition ${form.tipologia === v ? 'border-accent bg-accent text-ink' : 'border-white/20 bg-white/10 text-white/80 hover:border-white/40'}`}>
              {l}
            </button>
          ))}
        </div>
        {err && <p className="rounded-lg bg-red-50 px-3 py-2 text-[12px] text-red-700">{err}</p>}
        <button type="submit" disabled={!valid || loading}
          className="mt-1 inline-flex items-center justify-center gap-2 rounded-full bg-accent py-3.5 text-[12px] font-bold uppercase tracking-[0.18em] text-ink transition hover:brightness-95 disabled:opacity-40">
          {loading ? 'Enviando…' : <>Agenda tu visita <ArrowRight size={14} strokeWidth={2.5} /></>}
        </button>
        <p className="text-center text-[10.5px] text-ink-3">Tus datos están seguros. Sin spam.</p>
      </form>
    </div>
  );
}
