'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import {
  Anchor, Waves, Sparkles, Dumbbell, Trophy, Briefcase, Baby, Wine,
  ArrowRight, MessageCircle, Phone, ChevronDown, Check, Plane, Landmark,
  ShoppingBag, Ship,
} from 'lucide-react';
import Chatbot from '@/components/Chatbot';
import Gallery from '@/components/Gallery';
import LocationMap from '@/components/LocationMap';
import RevealOnScroll from '@/components/RevealOnScroll';
import FichaFloorPlansTowers from '@/components/ficha/FichaFloorPlansTowers';
import type { FloorPlanTypology } from '@/lib/developments';

/* ─────────────── datos reales de Vellmari (presentación oficial Urban Homes) ─────────────── */
const WA = '529984045602';
const waLink = (msg: string) => `https://wa.me/${WA}?text=${encodeURIComponent(msg)}`;
const IMG = '/desarrollos/Vellmari';

const CIFRAS = [
  { value: '98', label: 'Residencias exclusivas' },
  { value: '2', label: 'Torres frente a la marina' },
  { value: '169 – 714', label: 'm² de superficie' },
  { value: '327 ha', label: 'Puerto Cancún' },
];

const AMENIDADES = [
  { icon: Anchor,    label: 'Marina privada' },
  { icon: Waves,     label: 'Albercas' },
  { icon: Sparkles,  label: 'Spa & sauna' },
  { icon: Dumbbell,  label: 'Gimnasio' },
  { icon: Trophy,    label: 'Cancha de pádel' },
  { icon: Briefcase, label: 'Business center' },
  { icon: Baby,      label: "Kid's club" },
  { icon: Wine,      label: 'Lounge bar' },
];

// Una sola galería en slider (mismo componente que las fichas) — arquitectura
// y amenidades juntas, ordenadas por impacto para que el primer frame venda.
const GALERIA = [
  `${IMG}/ENTREGAFINAL_CADU_VELMARI_FACHADA04.jpg`,
  `${IMG}/ENTREGAFINAL_CADU_VELMARI_AMENIDADES09.jpg`,
  `${IMG}/ENTREGAFINAL_CADU_VELMARI_AMENIDADES06-.jpg`,
  `${IMG}/ENTREGAFINAL_CADU_VELMARI_AMENIDADES02.jpg`,
  `${IMG}/ENTREGAFINAL_CADU_VELMARI_AMENIDADES07.jpg`,
  `${IMG}/ENTREGAFINAL_CADU_VELMARI_AMENIDADES04.jpg`,
  `${IMG}/ENTREGAFINAL_CADU_VELMARI_FACHADA03.jpg`,
  `${IMG}/ENTREGAFINAL_CADU_VELMARI_AEREADETALLE02.jpg`,
  `${IMG}/ENTREGAFINAL_CADU_VELMARI_AEREADETALLE04.jpg`,
  `${IMG}/ENTREGAFINAL_CADU_VELMARI_FACHADA02.jpg`,
];

const TOUR_URL = 'https://my.matterport.com/show/?m=JM56Q2CtX2f';

const ENTORNO = [
  { icon: Ship,        label: 'Marina privada para embarcaciones' },
  { icon: Trophy,      label: 'Campo de golf de 18 hoyos' },
  { icon: ShoppingBag, label: 'Plaza comercial de primer nivel' },
  { icon: Plane,       label: 'A minutos de la Zona Hotelera y el aeropuerto' },
];

const FAQS = [
  {
    q: '¿Cuánto cuesta un departamento en Vellmari, Puerto Cancún?',
    a: 'Las residencias en Vellmari tienen precio desde $14,800,000 MXN. Las superficies van de 169 m² hasta 714 m² en los penthouses, por lo que el precio depende de la tipología y la torre. Precios y condiciones de pago sujetos a cambio sin previo aviso; un asesor te confirma el precio y plan de pago vigente.',
  },
  {
    q: '¿Cuántas residencias tiene el desarrollo?',
    a: 'Vellmari son 98 residencias exclusivas distribuidas en dos torres —Torre Sur y Torre Norte— frente a la marina de Puerto Cancún. Al ser un inventario limitado, la disponibilidad por tipología cambia constantemente.',
  },
  {
    q: '¿Qué superficies y tipologías hay disponibles?',
    a: 'Hay 17 tipologías distintas entre ambas torres, desde 169 m² hasta 714 m², incluyendo penthouses de doble vista y una residencia garden. Puedes ver todos los planos por torre en esta misma página.',
  },
  {
    q: '¿Dónde está ubicado Vellmari?',
    a: 'Vellmari está dentro de Puerto Cancún, un desarrollo turístico planeado por FONATUR sobre 327 hectáreas, con campo de golf de 18 hoyos, marina privada y plaza comercial — a minutos de la Zona Hotelera y del aeropuerto internacional de Cancún.',
  },
  {
    q: '¿Qué amenidades incluye?',
    a: 'Marina, albercas, spa y sauna, gimnasio, cancha de pádel, business center, kid\'s club y lounge bar, además de las amenidades del entorno de Puerto Cancún.',
  },
  {
    q: '¿Quién desarrolla Vellmari?',
    a: 'Vellmari es un desarrollo de Urban Homes. Tresor Real Estate participa como comercializador autorizado, por lo que la asesoría, los precios y la disponibilidad son directos del desarrollador.',
  },
  {
    q: '¿Puedo agendar una visita privada?',
    a: 'Sí, presencial o por videollamada. Deja tus datos en el formulario y un asesor especializado te contacta con disponibilidad real, precios y planes de pago.',
  },
];

const JSONLD = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Residence',
      name: 'Vellmari — Departamentos de lujo en Puerto Cancún',
      description:
        '98 residencias exclusivas de 169 a 714 m² en dos torres frente a la marina de Puerto Cancún. Desarrollo de Urban Homes con marina, golf, spa y amenidades de primer nivel.',
      url: 'https://www.tresor.mx/departamentos-en-puerto-cancun-vellmari',
      image: 'https://www.tresor.mx/desarrollos/Vellmari/ENTREGAFINAL_CADU_VELMARI_AEREA03.jpg',
      address: {
        '@type': 'PostalAddress',
        streetAddress: 'Puerto Cancún',
        addressLocality: 'Cancún',
        addressRegion: 'Quintana Roo',
        addressCountry: 'MX',
      },
      geo: { '@type': 'GeoCoordinates', latitude: 21.1616, longitude: -86.8098 },
    },
    {
      '@type': 'Offer',
      name: 'Departamentos en venta en Puerto Cancún — Vellmari',
      price: 14800000,
      priceCurrency: 'MXN',
      availability: 'https://schema.org/InStock',
      url: 'https://www.tresor.mx/departamentos-en-puerto-cancun-vellmari',
      seller: { '@type': 'Organization', name: 'Tresor Real Estate', telephone: '+529984045602' },
    },
    {
      '@type': 'FAQPage',
      mainEntity: FAQS.map(({ q, a }) => ({
        '@type': 'Question',
        name: q,
        acceptedAnswer: { '@type': 'Answer', text: a },
      })),
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
export default function VellmariLanding({ floorPlans }: { floorPlans: FloorPlanTypology[] }) {
  const formRef = useRef<HTMLDivElement>(null);
  const utmRef = useRef<UTM>({});
  const [form, setForm] = useState({ firstName: '', email: '', phone: '', superficie: '', proposito: '' });
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState('');

  useEffect(() => { utmRef.current = readUTM(); }, []);

  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));
  const valid = Boolean(form.firstName.trim() && form.email.trim() && form.phone.trim());
  const scrollToForm = () => formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!valid || loading) return;
    setErr('');
    setLoading(true);
    try {
      const res = await fetch('/api/vellmari-lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: form.firstName,
          email: form.email,
          phone: form.phone,
          superficie: form.superficie || undefined,
          proposito: form.proposito || undefined,
          utm: utmRef.current,
        }),
      });
      if (!res.ok) throw new Error('fail');
      // El evento de conversión (gtag + fbq) se dispara en /gracias — un solo
      // punto de verdad para Google Ads y Meta.
      window.location.assign('/departamentos-en-puerto-cancun-vellmari/gracias');
    } catch {
      setErr('Hubo un problema. Intenta de nuevo o escríbenos por WhatsApp.');
      setLoading(false);
    }
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(JSONLD) }} />

      {/* ═════════ HERO ═════════ */}
      <section className="relative overflow-hidden bg-ink lg:flex lg:min-h-[94svh] lg:items-center">
        <div className="absolute inset-0 animate-hero-zoom">
          <Image
            src={`${IMG}/ENTREGAFINAL_CADU_VELMARI_AEREA03.jpg`}
            alt="Vellmari — departamentos de lujo frente a la marina de Puerto Cancún"
            fill priority sizes="100vw"
            className="object-cover"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/75 to-ink/25" />
        <div className="absolute inset-0 lg:bg-gradient-to-r lg:from-ink lg:via-ink/60 lg:to-transparent" />

        <div className="container-wrap relative z-10 grid items-center gap-10 pb-14 pt-16 lg:grid-cols-[1.05fr_minmax(360px,440px)] lg:gap-16 lg:py-28">
          <div className="text-center text-white lg:text-left">
            <Image
              src={`${IMG}/logo.png`}
              alt="Vellmari"
              width={260} height={90}
              priority
              className="mx-auto h-20 w-auto lg:mx-0 lg:h-24"
            />
            <p className="mt-2 text-[11px] font-medium uppercase tracking-eyebrow text-accent lg:mt-3">
              Puerto Cancún · Urban Homes
            </p>

            <h1 className="mt-6 h-display text-[clamp(32px,5vw,68px)] text-white">
              Residencias de lujo frente a la<br className="hidden lg:block" />{' '}
              <span className="text-accent">marina de Puerto Cancún</span>
            </h1>

            <p className="mx-auto mt-6 max-w-xl text-[15px] font-light leading-relaxed text-white/70 lg:mx-0 lg:text-[16px]">
              Solo <strong className="font-semibold text-white">98 residencias</strong> en dos torres,
              de 169 a 714 m², rodeadas de campo de golf, marina privada y las mejores playas del Caribe.
            </p>

            <div className="mt-7 flex flex-wrap justify-center gap-2 lg:justify-start">
              {['98 residencias', 'Frente a la marina', 'Penthouses de doble vista'].map((g) => (
                <span key={g} className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border border-white/15 bg-white/[0.07] px-3.5 py-1.5 text-[11px] font-medium text-white/90 backdrop-blur-md lg:text-[12px]">
                  <Check size={12} strokeWidth={3} className="text-accent" /> {g}
                </span>
              ))}
            </div>

            <div className="mt-9 flex items-end justify-center gap-3 lg:justify-start">
              <span className="pb-1 text-[11px] font-medium uppercase tracking-caps text-white/50">Desde</span>
              <span className="h-display text-[clamp(26px,3.4vw,42px)] leading-none text-white">$14,800,000 MXN</span>
            </div>
          </div>

          {/* form */}
          <div ref={formRef} id="agenda" className="scroll-mt-24">
            <FormCard form={form} set={set} valid={valid} loading={loading} err={err} submit={submit} />
          </div>
        </div>

        <a href="#proyecto" aria-label="Ver más" className="absolute bottom-5 left-1/2 hidden -translate-x-1/2 text-white/40 transition hover:text-white lg:block">
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

      {/* ═════════ EL PROYECTO ═════════ */}
      <section id="proyecto" className="scroll-mt-16 bg-white py-24 md:py-32">
        <div className="container-wrap grid gap-12 lg:grid-cols-2 lg:items-center lg:gap-20">
          <RevealOnScroll>
            <span className="eyebrow eyebrow-accent font-bold">— El proyecto</span>
            <h2 className="mt-5 h-display text-[clamp(28px,3.6vw,52px)] text-ink">
              98 residencias de lujo<br />
              <span className="text-ink-3">en el corazón de Puerto Cancún</span>
            </h2>
            <div className="mt-7 space-y-5 text-[15px] font-light leading-relaxed text-ink-2 md:text-[16px]">
              <p>
                Vellmari es un desarrollo de Urban Homes: una obra de arte arquitectónica con{' '}
                <strong className="font-semibold text-ink">98 exclusivas residencias</strong> en la zona
                residencial más cotizada del Caribe mexicano, para vivir una experiencia de lujo frente al mar.
              </p>
              <p>
                Dos torres frente a la marina, con tipologías desde{' '}
                <strong className="font-semibold text-ink">169 m² hasta 714 m²</strong> y penthouses de
                doble vista, rodeadas de campo de golf, plaza comercial y las mejores playas del mar Caribe.
              </p>
            </div>
            <button onClick={scrollToForm} className="btn btn-lg mt-9 border-0 bg-ink text-white hover:bg-ink/85">
              Solicita el brochure y precios <ArrowRight size={14} strokeWidth={2.2} />
            </button>
          </RevealOnScroll>

          <RevealOnScroll delay={120}>
            <div className="relative aspect-[4/5] overflow-hidden rounded-[28px] bg-bg-soft">
              <Image
                src={`${IMG}/ENTREGAFINAL_CADU_VELMARI_FACHADA03.jpg`}
                alt="Arquitectura de Vellmari en Puerto Cancún"
                fill sizes="(max-width:1024px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
          </RevealOnScroll>
        </div>
      </section>

      {/* ═════════ BANNER CTA 1 ═════════ */}
      <CtaBanner
        image={`${IMG}/ENTREGAFINAL_CADU_VELMARI_AMENIDADES09.jpg`}
        alt="Alberca frente al mar Caribe en Vellmari, Puerto Cancún"
        eyebrow="Un estilo de vida, no solo una dirección"
        title={<>Despierta con el Caribe<br />a tus pies</>}
        text="Amenidades diseñadas para que cada día se sienta como una estancia privada en un resort."
        cta="Agenda una visita privada"
        onClick={scrollToForm}
      />

      {/* ═════════ PUERTO CANCÚN ═════════ */}
      <section className="bg-bg-soft py-24 md:py-32">
        <div className="container-wrap">
          <RevealOnScroll className="max-w-3xl">
            <span className="eyebrow eyebrow-accent font-bold">— El entorno</span>
            <h2 className="mt-5 h-display text-[clamp(28px,3.6vw,52px)] text-ink">
              Puerto Cancún,{' '}
              <span className="text-ink-3">el nuevo estilo de vida del paraíso</span>
            </h2>
            <p className="mt-6 text-[15px] font-light leading-relaxed text-ink-2 md:text-[16px]">
              Un desarrollo turístico planeado por FONATUR sobre{' '}
              <strong className="font-semibold text-ink">327 hectáreas</strong>, con campo de golf de 18
              hoyos, marina privada para embarcaciones y una plaza comercial de primer nivel — con ubicación
              estratégica cerca de la Zona Hotelera y del aeropuerto internacional de Cancún.
            </p>
          </RevealOnScroll>

          {/* La columna izquierda se estira al alto de la derecha (lista +
              mapa) en desktop: con `aspect-[16/11]` la foto se imponía su
              propia altura e ignoraba el stretch del grid, quedando corta.
              En lg se suelta el aspect y toma h-full; el grid le da algo más
              de ancho para que la foto no se recorte de más al crecer. */}
          <div className="mt-12 grid gap-4 lg:grid-cols-[1.15fr_1fr] lg:gap-6">
            <RevealOnScroll className="lg:h-full">
              <div className="relative aspect-[16/11] overflow-hidden rounded-[28px] bg-white lg:aspect-auto lg:h-full">
                <Image
                  src={`${IMG}/ENTREGAFINAL_CADU_VELMARI_AEREA01.jpg`}
                  alt="Vista aérea de Puerto Cancún — marina, golf y playas"
                  fill sizes="(max-width:1024px) 100vw, 55vw"
                  className="object-cover"
                />
              </div>
            </RevealOnScroll>

            <RevealOnScroll delay={120} className="flex flex-col gap-4 lg:gap-6">
              <ul className="grid gap-3 rounded-[28px] bg-white p-7 md:p-8">
                {ENTORNO.map(({ icon: Icon, label }) => (
                  <li key={label} className="flex items-center gap-4">
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-accent/12 text-ink">
                      <Icon size={18} strokeWidth={1.7} />
                    </span>
                    <span className="text-[14.5px] text-ink-2">{label}</span>
                  </li>
                ))}
              </ul>
              <div className="min-h-[260px] flex-1 overflow-hidden rounded-[28px] bg-white [&>div]:h-full [&>div]:min-h-[260px] [&>div]:rounded-none [&>div]:border-0">
                <LocationMap lat={21.1616} lng={-86.8098} zoom={14} address="Puerto Cancún, Cancún, Q. Roo" />
              </div>
            </RevealOnScroll>
          </div>
        </div>
      </section>

      {/* ═════════ AMENIDADES ═════════ */}
      <section className="bg-white py-24 md:py-32">
        <div className="container-wrap">
          <RevealOnScroll className="max-w-2xl">
            <span className="eyebrow eyebrow-accent font-bold">— Amenidades</span>
            <h2 className="mt-5 h-display text-[clamp(28px,3.6vw,52px)] text-ink">
              Todo lo que necesitas,<br />
              <span className="text-ink-3">dentro de casa</span>
            </h2>
          </RevealOnScroll>

          {/* lista de amenidades */}
          <div className="mt-12 grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
            {AMENIDADES.map(({ icon: Icon, label }) => (
              <div key={label} className="flex items-center gap-3 rounded-[20px] bg-bg-soft px-5 py-4">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-ink">
                  <Icon size={17} strokeWidth={1.7} />
                </span>
                <span className="text-[13.5px] font-medium text-ink">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═════════ GALERÍA (slider, mismo componente que las fichas) ═════════ */}
      <Gallery
        images={GALERIA}
        alt="Vellmari — Puerto Cancún"
        eyebrow="— Galería"
        title="Arquitectura y amenidades"
        tourUrl={TOUR_URL}
        gray
      />

      {/* ═════════ BANNER CTA 2 ═════════ */}
      <CtaBanner
        image={`${IMG}/ENTREGAFINAL_CADU_VELMARI_AMENIDADES02.jpg`}
        alt="Fire pit lounge al atardecer en Vellmari, Puerto Cancún"
        eyebrow="Inventario limitado · 98 residencias"
        title={<>Elige tu residencia<br />antes que alguien más</>}
        text="Un asesor especializado te comparte disponibilidad real por torre, precios y planes de pago."
        cta="Ver disponibilidad"
        onClick={scrollToForm}
      />

      {/* ═════════ FLOOR PLANS (explorador por torre) ═════════ */}
      <div id="planos" className="scroll-mt-16">
        <FichaFloorPlansTowers
          floorPlans={floorPlans}
          towersImage={`${IMG}/torresmitad.jpg`}
          locale="es"
          gray
          onCtaClick={scrollToForm}
        />
      </div>

      {/* ═════════ FAQ ═════════ */}
      <section className="bg-white py-24 md:py-32">
        <div className="container-wrap max-w-3xl">
          <span className="eyebrow eyebrow-accent font-bold">— Preguntas frecuentes</span>
          <h2 className="mt-5 h-display text-[clamp(28px,3.6vw,52px)] text-ink">
            Todo sobre Vellmari
          </h2>
          <div className="mt-10">
            {FAQS.map((f) => <FaqItem key={f.q} q={f.q} a={f.a} />)}
          </div>
        </div>
      </section>

      {/* ═════════ CIERRE OSCURO (CTA + footer) ═════════ */}
      <footer data-nav="dark" className="relative z-10 -mt-10 overflow-hidden rounded-t-[2.5rem] bg-bg-deep pt-24 text-white">
        <Image
          src={`${IMG}/ENTREGAFINAL_CADU_VELMARI_FACHADA04.jpg`}
          alt="Vellmari al atardecer — Puerto Cancún"
          fill sizes="100vw"
          className="object-cover object-top opacity-[0.22]"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-bg-deep/70 via-bg-deep/90 to-bg-deep" />

        <div className="container-wrap relative z-10 text-center">
          <span className="eyebrow eyebrow-accent font-bold">Preventa · 98 residencias</span>
          <h2 className="mx-auto mt-5 h-display text-[clamp(30px,4.2vw,60px)] text-white max-w-3xl">
            Tu residencia frente a la marina de Puerto Cancún
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-[15px] font-light leading-relaxed text-white/60">
            Déjanos tus datos y un asesor especializado te contacta con disponibilidad real por torre,
            precios y planes de pago.
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <button onClick={scrollToForm} className="btn btn-lg border-0 bg-accent text-ink hover:brightness-95">
              Agenda una visita privada <ArrowRight size={14} strokeWidth={2.2} />
            </button>
            <a
              href={waLink('Hola, me interesa Vellmari en Puerto Cancún. Quiero más información.')}
              target="_blank" rel="noopener noreferrer"
              className="btn btn-lg btn-ghost-light"
            >
              <MessageCircle size={14} strokeWidth={2} /> WhatsApp
            </a>
          </div>

          <div className="mx-auto mt-20 h-px w-24" style={{ background: 'linear-gradient(to right, transparent, #FAB413, transparent)' }} />

          <div className="flex flex-col items-center gap-5 pb-28 pt-10 lg:pb-12">
            <Image src="/logos/LogoTresor.svg" alt="Tresor Real Estate" width={169} height={44} className="h-[42px] w-auto opacity-90" />
            <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-[13px] text-white/60">
              <a href="tel:+529984045602" className="inline-flex items-center gap-2 transition hover:text-white"><Phone size={14} /> +52 998 404 5602</a>
              <a href={waLink('Hola, me interesa Vellmari en Puerto Cancún.')} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 transition hover:text-white"><MessageCircle size={14} /> WhatsApp</a>
            </div>
            <p className="max-w-2xl text-[11px] leading-relaxed text-white/35">
              Vellmari es un desarrollo de Urban Homes; Tresor Real Estate participa como comercializador.
              Imágenes de carácter ilustrativo. * Precios, superficies y condiciones de pago sujetos a cambio
              sin previo aviso. Consulta términos y disponibilidad con un asesor. © {new Date().getFullYear()} Tresor Real Estate.
            </p>
          </div>
        </div>
      </footer>

      {/* Sticky móvil */}
      <div className="fixed inset-x-0 bottom-0 z-40 flex items-center gap-2.5 border-t border-white/10 bg-ink/95 px-4 py-3 backdrop-blur-md lg:hidden">
        <a
          href={waLink('Hola, me interesa Vellmari en Puerto Cancún. Quiero más información.')}
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

      {/* Chatbot exclusivo de Vellmari */}
      <Chatbot devSlug="vellmari-puerto-cancun" landing />
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
  form: { firstName: string; email: string; phone: string; superficie: string; proposito: string };
  set: (k: string, v: string) => void;
  valid: boolean;
  loading: boolean;
  err: string;
  submit: (e: React.FormEvent) => void;
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
          required type="text" placeholder="Tu nombre"
          value={form.firstName} onChange={(e) => set('firstName', e.target.value)}
          className="appearance-none rounded-2xl border border-white/10 bg-white px-4 py-3 text-[14px] text-ink outline-none transition-colors focus:border-accent"
        />
        <input
          required type="email" placeholder="Correo electrónico"
          value={form.email} onChange={(e) => set('email', e.target.value)}
          className="appearance-none rounded-2xl border border-white/10 bg-white px-4 py-3 text-[14px] text-ink outline-none transition-colors focus:border-accent"
        />
        <input
          required type="tel" placeholder="Teléfono / WhatsApp"
          value={form.phone} onChange={(e) => set('phone', e.target.value)}
          className="appearance-none rounded-2xl border border-white/10 bg-white px-4 py-3 text-[14px] text-ink outline-none transition-colors focus:border-accent"
        />

        <div className="pt-1">
          <p className="mb-2 text-[10.5px] uppercase tracking-caps text-white/45">Superficie de interés</p>
          <div className="grid grid-cols-2 gap-2">
            {[
              { v: '169-250', l: '169 – 250 m²' },
              { v: '250-400', l: '250 – 400 m²' },
              { v: 'ph', l: 'Penthouse' },
              { v: 'abierto', l: 'Abierto' },
            ].map(({ v, l }) => (
              <button key={v} type="button" onClick={() => set('superficie', v)} className={chip(form.superficie === v)}>
                {l}
              </button>
            ))}
          </div>
        </div>

        <div className="pt-1">
          <p className="mb-2 text-[10.5px] uppercase tracking-caps text-white/45">¿Para qué la buscas?</p>
          <div className="grid grid-cols-3 gap-2">
            {[
              { v: 'vivir', l: 'Vivir' },
              { v: 'inversion', l: 'Inversión' },
              { v: 'segunda', l: '2ª residencia' },
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
        <p className="text-center text-[10.5px] text-white/40">Tus datos están seguros. Sin spam.</p>
      </form>
    </div>
  );
}
