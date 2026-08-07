'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import {
  ArrowRight, MessageCircle, ChevronDown, Check, MapPin,
  ShieldCheck, Handshake, Building2, HeartHandshake, Store, Home,
} from 'lucide-react';
import RevealOnScroll from '@/components/RevealOnScroll';
import LandingFooter, { waLink } from '@/components/landing/LandingFooter';
import type { Development } from '@/lib/developments';

/* ─────────────────────────── configuración ───────────────────────────
   Los 6 desarrollos y sus precios NO se escriben aquí: llegan del catálogo
   fusionado (Sanity + estático) vía page.tsx. Así la landing nunca queda
   desfasada respecto al sitio — que es justo el problema que tenían las
   landings de Vellmari, con el precio hardcodeado.                      */

const HERO = '/desarrollos/villalta/portada2.jpg';

// Categorías del formulario. Tres opciones convierten mejor que seis: el que
// llega del anuncio no siempre sabe qué desarrollo quiere, pero sí sabe qué
// TIPO de producto busca.
const CATEGORIAS = [
  { v: 'local', l: 'Local Comercial' },
  { v: 'departamento', l: 'Departamento Residencial' },
  { v: 'luxury', l: 'Luxury Condo' },
] as const;

// Qué categoría le corresponde a cada desarrollo. NO se puede derivar del
// `propertyType` del catálogo: Villalta y Vellmari son 'Departamento' ahí,
// igual que Valmira u Olivia — "Luxury Condo" es una distinción comercial,
// no de tipo de propiedad. Por eso el mapa es explícito.
const DEV_CATEGORIA: Record<string, string> = {
  'quattro-gardens': 'local',
  'valmira-urban': 'departamento',
  'olivia-wow-condos': 'departamento',
  'loreta-wow-condos': 'departamento',
  'villalta-onix': 'luxury',
  'vellmari-puerto-cancun': 'luxury',
};

const CIFRAS = [
  { value: '6', label: 'Desarrollos activos' },
  { value: '3', label: 'Tipos de propiedad' },
  { value: 'Desde $1.9', label: 'MDP de entrada' },
  { value: '20+', label: 'Años de trayectoria' },
];

const POR_QUE = [
  {
    icon: ShieldCheck,
    title: 'Solo desarrolladoras con entregas',
    body: 'Trabajamos con desarrolladoras que ya entregaron proyectos en Quintana Roo. Puedes visitar obra terminada, no solo renders.',
  },
  {
    icon: Handshake,
    title: 'Precio directo del desarrollador',
    body: 'Somos comercializadores autorizados. El precio que te damos es el de lista — nuestra comisión la paga el desarrollador, no tú.',
  },
  {
    icon: Building2,
    title: 'Portafolio, no un solo proyecto',
    body: 'Comparamos entre 6 desarrollos de distintos precios y zonas. Si ninguno te encaja, te lo decimos.',
  },
  {
    icon: HeartHandshake,
    title: 'Acompañamiento hasta la escritura',
    body: 'Te ayudamos con el proceso completo: apartado, contrato, notaría y entrega. También si compras desde otra ciudad.',
  },
];

const FAQS = [
  {
    q: '¿Puedo comprar si vivo en otra ciudad?',
    a: 'Sí, es lo más común en nuestro portafolio. Hacemos recorridos por videollamada, te mandamos disponibilidad y planos en tiempo real, y la compra puede cerrarse a distancia mediante poder notarial. Muchos clientes visitan una sola vez, ya con la decisión tomada.',
  },
  {
    q: '¿Cuál es el enganche y cómo son los planes de pago?',
    a: 'Varía por desarrollo. En preventa lo habitual es un apartado, un enganche y mensualidades hasta la entrega, sin intereses. En entrega inmediata el esquema es distinto porque el producto ya existe. Un asesor te comparte el plan vigente del proyecto que te interese.',
  },
  {
    q: '¿Qué diferencia hay entre preventa y entrega inmediata?',
    a: 'En preventa entras a mejor precio y con la mejor selección de unidades, pero esperas a la entrega. En entrega inmediata pagas más, pero ves exactamente lo que compras y puedes habitarlo o rentarlo desde el primer día. En este portafolio tienes ambas opciones.',
  },
  {
    q: '¿Puedo rentar la propiedad después?',
    a: 'En la mayoría de los casos sí, pero las reglas de renta corta las define el reglamento interno de cada condominio, no la zona. Si tu objetivo es rentar, dilo desde el inicio para mostrarte solo los desarrollos cuyo régimen lo permite.',
  },
  {
    q: '¿Cobran algo por la asesoría?',
    a: 'No. Somos comercializadores autorizados y nuestra comisión la paga el desarrollador. El precio que pagas es el mismo que si fueras directo con ellos, pero con acompañamiento y con la posibilidad de comparar entre varios proyectos.',
  },
  {
    q: '¿Los precios incluyen IVA?',
    a: 'Los departamentos de uso habitacional no causan IVA. Los locales comerciales sí, y por eso el precio de Quattro Plaza Gardens se muestra como "+ IVA". Cualquier duda te la aclara el asesor con la cotización formal.',
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
export default function PortafolioLanding({ developments }: { developments: Development[] }) {
  const formRef = useRef<HTMLDivElement>(null);
  const utmRef = useRef<UTM>({});
  const [form, setForm] = useState({ firstName: '', email: '', phone: '', categoria: '', desarrollo: '', presupuesto: '' });
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState('');

  useEffect(() => { utmRef.current = readUTM(); }, []);

  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));
  const valid = Boolean(form.firstName.trim() && form.email.trim() && form.phone.trim());
  const scrollToForm = () => formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });

  // Click en "Me interesa" de una card: marca la categoría que corresponde y
  // guarda APARTE el desarrollo exacto. El formulario se ve simple (3
  // opciones) pero el CRM igual recibe qué proyecto le llamó la atención —
  // sin sacar al usuario del embudo hacia la ficha.
  // Elegir categoría a mano borra el desarrollo que hubiera dejado una card:
  // si el usuario cambia de opinión, mandar al CRM el proyecto anterior sería
  // peor que no mandar ninguno.
  const pickCategoria = (v: string) => {
    setForm((f) => ({ ...f, categoria: v, desarrollo: '' }));
  };

  const pickAndScroll = (slug: string) => {
    setForm((f) => ({ ...f, categoria: DEV_CATEGORIA[slug] ?? '', desarrollo: slug }));
    scrollToForm();
  };

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!valid || loading) return;
    setErr('');
    setLoading(true);
    try {
      const res = await fetch('/api/portafolio-lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: form.firstName,
          email: form.email,
          phone: form.phone,
          categoria: form.categoria || undefined,
          desarrollo: form.desarrollo || undefined,
          presupuesto: form.presupuesto || undefined,
          utm: utmRef.current,
        }),
      });
      if (!res.ok) throw new Error('fail');
      window.location.assign('/portafolio-cancun/gracias');
    } catch {
      setErr('Hubo un problema. Intenta de nuevo o escríbenos por WhatsApp.');
      setLoading(false);
    }
  }

  const formCard = (
    <FormCard
      form={form}
      set={set}
      valid={valid}
      loading={loading}
      err={err}
      submit={submit}
      onPickCategoria={pickCategoria}
    />
  );

  return (
    <>
      {/* ═════════ HERO ═════════ */}
      <section className="relative overflow-hidden bg-ink lg:flex lg:min-h-[94svh] lg:items-center">
        <div className="absolute inset-0 animate-hero-zoom">
          <Image
            src={HERO}
            alt="Vista aérea de Cancún y el mar Caribe"
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
              Invierte con seguridad · Cancún
            </p>

            <h1 className="mt-5 h-display text-[clamp(32px,5vw,68px)] text-white">
              Departamentos, locales comerciales<br className="hidden lg:block" />{' '}
              <span className="text-accent">y luxury condos en Cancún</span>
            </h1>

            <p className="mx-auto mt-6 max-w-xl text-[15px] font-light leading-relaxed text-white/75 lg:mx-0 lg:text-[16px]">
              Seis desarrollos activos con precio directo del desarrollador, en las zonas de mayor
              crecimiento de la ciudad. Te ayudamos a comparar y elegir.
            </p>

            <div className="mt-7 flex flex-wrap justify-center gap-2 lg:justify-start">
              {['Precio directo del desarrollador', 'Preventa y entrega inmediata', 'Asesoría sin costo'].map((g) => (
                <span key={g} className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border border-white/15 bg-white/[0.07] px-3.5 py-1.5 text-[11px] font-medium text-white/90 backdrop-blur-md lg:text-[12px]">
                  <Check size={12} strokeWidth={3} className="text-accent" /> {g}
                </span>
              ))}
            </div>

            <div className="mt-9 flex items-end justify-center gap-3 lg:justify-start">
              <span className="pb-1 text-[11px] font-medium uppercase tracking-caps text-white/50">Desde</span>
              <span className="h-display text-[clamp(26px,3.4vw,42px)] leading-none text-white">$1,968,600 MXN</span>
            </div>
          </div>

          <div ref={formRef} id="registro" className="scroll-mt-24">{formCard}</div>
        </div>

        <a href="#portafolio" aria-label="Ver desarrollos" className="absolute bottom-5 left-1/2 hidden -translate-x-1/2 text-white/40 transition hover:text-white lg:block">
          <ChevronDown size={26} className="animate-bounce" />
        </a>
      </section>

      {/* ═════════ CIFRAS ═════════ */}
      <section className="border-b border-white/10 bg-ink py-10 md:py-12">
        <div className="container-wrap grid grid-cols-2 gap-y-8 lg:grid-cols-4">
          {CIFRAS.map(({ value, label }, i) => (
            <div key={label} className={`px-2 text-center lg:px-8 ${i > 0 ? 'lg:border-l lg:border-white/10' : ''}`}>
              <div className="h-display text-[clamp(24px,2.8vw,38px)] text-accent">{value}</div>
              <div className="mt-2 text-[11px] uppercase tracking-caps text-white/45">{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ═════════ LOS 6 DESARROLLOS ═════════ */}
      <section
        id="portafolio"
        data-nav="light"
        className="relative z-10 -mt-10 scroll-mt-16 rounded-t-[2.5rem] py-20 md:py-28"
        style={{ backgroundImage: 'linear-gradient(180deg, #f7f8fa 0%, #f2f3f5 55%, #eceef1 100%)' }}
      >
        <div className="container-wrap">
          <RevealOnScroll className="max-w-2xl">
            <span className="eyebrow eyebrow-accent font-bold">— El portafolio</span>
            <h2 className="mt-4 font-sans text-[clamp(24px,3.2vw,48px)] font-normal leading-[1.05] tracking-tight text-ink">
              Seis desarrollos <span className="text-ink-3">en las mejores zonas de Cancún</span>
            </h2>
            <p className="mt-5 text-[15px] font-light leading-relaxed text-ink-2">
              De locales comerciales desde $1.9 MDP hasta residencias frente a la marina. Elige el
              que te interese y un asesor te contacta con disponibilidad y planes de pago reales.
            </p>
          </RevealOnScroll>

          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {developments.map((dev, i) => (
              <RevealOnScroll key={dev.slug} delay={i * 60}>
                <DevCard dev={dev} onPick={() => pickAndScroll(dev.slug)} />
              </RevealOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* ═════════ POR QUÉ TRESOR ═════════ */}
      <section className="bg-white py-20 md:py-28">
        <div className="container-wrap">
          <RevealOnScroll className="max-w-2xl">
            <span className="eyebrow eyebrow-accent font-bold">— Por qué con nosotros</span>
            <h2 className="mt-4 font-sans text-[clamp(24px,3.2vw,48px)] font-normal leading-[1.05] tracking-tight text-ink">
              Comprar bien <span className="text-ink-3">no es solo elegir el proyecto correcto</span>
            </h2>
          </RevealOnScroll>

          <div className="mt-12 grid gap-4 md:grid-cols-2 md:gap-5">
            {POR_QUE.map(({ icon: Icon, title, body }) => (
              <div key={title} className="rounded-[26px] bg-bg-soft p-7 md:p-8">
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-accent/12 text-ink">
                  <Icon size={19} strokeWidth={1.7} />
                </span>
                <h3 className="mt-5 font-sans text-[clamp(18px,1.8vw,28px)] font-medium leading-[1.15] text-ink">{title}</h3>
                <p className="mt-3 text-[15px] font-light leading-relaxed text-ink-2">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═════════ BANNER CTA ═════════ */}
      <section className="relative isolate flex min-h-[52vh] items-center overflow-hidden bg-ink py-20 md:min-h-[60vh] md:py-28">
        <Image
          src="/desarrollos/Vellmari/ENTREGAFINAL_CADU_VELMARI_AMENIDADES09.jpg"
          alt="Amenidades de un desarrollo residencial en Cancún"
          fill sizes="100vw" className="object-cover"
        />
        <div className="absolute inset-0 bg-ink/60" />
        <div className="container-wrap relative z-10">
          <RevealOnScroll className="mx-auto max-w-3xl text-center">
            <span className="eyebrow eyebrow-accent font-bold">Disponibilidad real, hoy</span>
            <h2 className="mt-5 h-display text-[clamp(28px,4vw,58px)] text-white">
              El inventario cambia<br />todas las semanas
            </h2>
            <p className="mx-auto mt-6 max-w-2xl text-[16px] font-normal leading-relaxed text-white/85 md:text-[18px]">
              Déjanos tus datos y te compartimos qué unidades siguen disponibles, en qué piso y con
              qué plan de pago — sin compromiso.
            </p>
            <button onClick={scrollToForm} className="btn btn-lg mt-9 border-0 bg-accent text-ink hover:brightness-95">
              Solicitar disponibilidad <ArrowRight size={14} strokeWidth={2.2} />
            </button>
          </RevealOnScroll>
        </div>
      </section>

      {/* ═════════ FAQ ═════════ */}
      <section className="bg-white py-20 md:py-28">
        <div className="container-wrap max-w-3xl">
          <span className="eyebrow eyebrow-accent font-bold">— Preguntas frecuentes</span>
          <h2 className="mt-4 font-sans text-[clamp(24px,3.2vw,48px)] font-normal leading-[1.05] tracking-tight text-ink">
            Antes de <span className="text-ink-3">dar el primer paso</span>
          </h2>
          <div className="mt-10">
            {FAQS.map((f) => <FaqItem key={f.q} q={f.q} a={f.a} />)}
          </div>
        </div>
      </section>

      {/* ═════════ CIERRE + FOOTER (componente compartido) ═════════ */}
      <LandingFooter
        image="/desarrollos/Vellmari/ENTREGAFINAL_CADU_VELMARI_FACHADA04.jpg"
        imageAlt="Desarrollos residenciales en Cancún al atardecer"
        eyebrow="6 desarrollos · Cancún"
        title={<>Encuentra la propiedad correcta en Cancún</>}
        text="Déjanos tus datos y un asesor te contacta con disponibilidad real, precios y planes de pago de los proyectos que te interesen."
        ctaLabel="Quiero que me contacten"
        onCtaClick={scrollToForm}
        whatsappMessage="Hola, vi el portafolio de desarrollos en Cancún y quiero más información."
        disclaimer={
          <>
            Tresor Real Estate participa como comercializador autorizado de los desarrollos
            mostrados. Imágenes de carácter ilustrativo. * Precios, superficies, disponibilidad y
            condiciones de pago sujetos a cambio sin previo aviso y no constituyen una oferta.
            Consulta términos con un asesor. © {new Date().getFullYear()} Tresor Real Estate.
          </>
        }
      />

      {/* Sticky móvil */}
      <div className="fixed inset-x-0 bottom-0 z-40 flex items-center gap-2.5 border-t border-white/10 bg-ink/95 px-4 py-3 backdrop-blur-md lg:hidden">
        <a
          href={waLink('Hola, vi el portafolio de desarrollos en Cancún y quiero más información.')}
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

/* ─────────────── card de desarrollo ───────────────
   Misma receta visual que DevelopmentCard del home (card blanca con padding,
   foto 4/3 enmarcada, overlay, badge y logo centrado) — no se inventa un
   estilo nuevo. Los dos cambios son a propósito: no enlaza a la ficha (sacaría
   al usuario del embudo) y el pie muestra tipología + precio con más peso,
   que es lo que decide en una landing de pauta.                            */
function DevCard({ dev, onPick }: { dev: Development; onPick: () => void }) {
  const badge = dev.badge ?? dev.status;
  const TypeIcon = dev.propertyType === 'Local Comercial' ? Store : Home;
  const location = `${dev.zone ? `${dev.zone}, ` : ''}${dev.city}`;

  return (
    <div className="flex h-full flex-col gap-3 rounded-[28px] bg-white p-3">
      <div className="relative aspect-[4/3] overflow-hidden rounded-[20px]">
        <Image
          src={dev.image}
          alt={dev.name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1100px) 50vw, 33vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/40" />
        <div className="absolute inset-x-4 top-4 z-10 flex items-center">
          {badge && (
            <span className="rounded-full bg-white/10 px-4 py-2 text-[10px] font-bold uppercase tracking-[0.2em] text-white backdrop-blur-md">
              {badge}
            </span>
          )}
          <TypeIcon size={22} strokeWidth={1.6} className="ml-auto text-white" />
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

        <h3 className="mt-3 font-sans text-[clamp(18px,1.8vw,28px)] font-medium leading-[1.15] text-ink">
          {dev.name}
        </h3>

        {dev.tagline?.es && (
          <p className="mt-1.5 text-[13px] font-light leading-relaxed text-ink-2">{dev.tagline.es}</p>
        )}

        <div className="mt-auto pt-5">
          <span className="block text-[10px] font-bold uppercase tracking-caps text-ink-3/60">Precio desde</span>
          <span className="mt-1 block font-sans text-[20px] font-medium leading-tight text-ink">
            {(dev.priceLabel ?? '').replace(/^desde\s+/i, '') || 'Consultar'}
          </span>
          <button
            onClick={onPick}
            className="btn mt-4 w-full border-0 bg-ink py-3 text-white hover:bg-ink/85"
          >
            Me interesa <ArrowRight size={14} strokeWidth={2.2} />
          </button>
        </div>
      </div>
    </div>
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

/* ─────────────── formulario ─────────────── */
function FormCard({
  form, set, valid, loading, err, submit, onPickCategoria,
}: {
  form: { firstName: string; email: string; phone: string; categoria: string; desarrollo: string; presupuesto: string };
  set: (k: string, v: string) => void;
  valid: boolean;
  loading: boolean;
  err: string;
  submit: (e: React.FormEvent) => void;
  onPickCategoria: (v: string) => void;
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
        <p className="mt-2 text-[15px] font-medium text-white">Recibe precios y disponibilidad</p>
        <p className="mt-1 text-[12.5px] font-light text-white/50">Un asesor te contacta hoy · Sin compromiso</p>
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
        <input
          required type="tel" placeholder="Teléfono / WhatsApp" autoComplete="tel"
          value={form.phone} onChange={(e) => set('phone', e.target.value)}
          className="appearance-none rounded-2xl border border-white/10 bg-white px-4 py-3 text-[14px] text-ink outline-none transition-colors focus:border-accent"
        />

        <div className="pt-1">
          <p className="mb-2 text-[10.5px] uppercase tracking-caps text-white/45">¿Qué te interesa?</p>
          {/* Una columna: "Departamento Residencial" no cabe en media sin
              partirse en dos líneas, y a pantalla completa son más fáciles de
              tocar en móvil. Elegir a mano limpia el desarrollo que hubiera
              dejado el botón "Me interesa" de una card — el usuario está
              cambiando de opinión, y mandar al CRM un proyecto que ya no
              corresponde sería peor que no mandar ninguno. */}
          <div className="grid grid-cols-1 gap-2">
            {CATEGORIAS.map(({ v, l }) => (
              <button
                key={v}
                type="button"
                onClick={() => onPickCategoria(v)}
                className={chip(form.categoria === v)}
              >
                {l}
              </button>
            ))}
          </div>
        </div>

        <div className="pt-1">
          <p className="mb-2 text-[10.5px] uppercase tracking-caps text-white/45">Presupuesto aproximado</p>
          <div className="grid grid-cols-2 gap-2">
            {[
              { v: '1-3', l: '$1.9 – $3 MDP' },
              { v: '3-6', l: '$3 – $6 MDP' },
              { v: '6-12', l: '$6 – $12 MDP' },
              { v: '12+', l: 'Más de $12 MDP' },
            ].map(({ v, l }) => (
              <button key={v} type="button" onClick={() => set('presupuesto', v)} className={chip(form.presupuesto === v)}>
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
