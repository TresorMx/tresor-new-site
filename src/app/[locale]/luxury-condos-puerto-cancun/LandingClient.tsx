'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import Image from 'next/image';
import {
  Anchor, Waves, Sparkles, Dumbbell, Trophy, Briefcase, Baby, Wine,
  ArrowRight, MessageCircle, Phone, ChevronDown, ChevronLeft, ChevronRight,
  Check, Plane, ShoppingBag, Ship, X, ShieldCheck, Expand,
} from 'lucide-react';
import LocationMap from '@/components/LocationMap';
import RevealOnScroll from '@/components/RevealOnScroll';
import FichaFloorPlansTowers from '@/components/ficha/FichaFloorPlansTowers';
import type { FloorPlanTypology } from '@/lib/developments';

/* ─────────── datos reales de Vellmari (presentación oficial Urban Homes) ───────────
   Las superficies se muestran en sq ft primero y m² entre paréntesis: el
   comprador de US/Canadá piensa en pies cuadrados, y obligarlo a convertir
   mentalmente es fricción en una landing de pauta. Equivalencias:
   169 m² = 1,819 sq ft · 250 m² = 2,691 · 400 m² = 4,306 ·
   445 m² = 4,790 · 714 m² = 7,686 · 327 ha = 808 acres            */
const WA = '529984045602';
const waLink = (msg: string) => `https://wa.me/${WA}?text=${encodeURIComponent(msg)}`;
const IMG = '/desarrollos/Vellmari';
const URL_EN = 'https://www.tresor.mx/luxury-condos-puerto-cancun';

const STATS = [
  { value: '98', label: 'Exclusive residences' },
  { value: '2', label: 'Marina-front towers' },
  { value: '1,819 – 7,686', label: 'Square feet' },
  { value: '808 acres', label: 'Puerto Cancún' },
];

const AMENITIES = [
  { icon: Anchor,    label: 'Private marina' },
  { icon: Waves,     label: 'Resort-style pools' },
  { icon: Sparkles,  label: 'Spa & sauna' },
  { icon: Dumbbell,  label: 'Fitness center' },
  { icon: Trophy,    label: 'Paddle tennis court' },
  { icon: Briefcase, label: 'Business center' },
  { icon: Baby,      label: "Kids' club" },
  { icon: Wine,      label: 'Lounge bar' },
];

const NEIGHBORHOOD = [
  { icon: Ship,        label: 'Private marina with boat slips' },
  { icon: Trophy,      label: '18-hole championship golf course' },
  { icon: ShoppingBag, label: 'Luxury shopping mall and beach club' },
  { icon: Plane,       label: 'Minutes from the Hotel Zone and Cancún International Airport' },
];

// Ordenada por impacto: el primer frame tiene que vender solo.
const GALLERY = [
  { src: `${IMG}/ENTREGAFINAL_CADU_VELMARI_FACHADA04.jpg`,        alt: 'Vellmari towers at sunset in Puerto Cancún' },
  { src: `${IMG}/ENTREGAFINAL_CADU_VELMARI_AMENIDADES09.jpg`,     alt: 'Resort-style pool overlooking the Caribbean Sea' },
  { src: `${IMG}/ENTREGAFINAL_CADU_VELMARI_AMENIDADES06-.jpg`,    alt: 'Rooftop lounge and terrace at Vellmari' },
  { src: `${IMG}/ENTREGAFINAL_CADU_VELMARI_AMENIDADES02.jpg`,     alt: 'Fire pit lounge at dusk at Vellmari, Puerto Cancún' },
  { src: `${IMG}/ENTREGAFINAL_CADU_VELMARI_AEREADETALLE02.jpg`,   alt: 'Aerial view of Vellmari and the Puerto Cancún marina' },
  { src: `${IMG}/ENTREGAFINAL_CADU_VELMARI_AMENIDADES07.jpg`,     alt: 'Spa and wellness area at Vellmari' },
  { src: `${IMG}/ENTREGAFINAL_CADU_VELMARI_FACHADA03.jpg`,        alt: 'Contemporary architecture of the Vellmari towers' },
  { src: `${IMG}/ENTREGAFINAL_CADU_VELMARI_AMENIDADES04.jpg`,     alt: 'Social amenities and outdoor lounge at Vellmari' },
  { src: `${IMG}/ENTREGAFINAL_CADU_VELMARI_AEREADETALLE04.jpg`,   alt: 'Marina and golf course views from Vellmari' },
];

const TOUR_URL = 'https://my.matterport.com/show/?m=JM56Q2CtX2f';

const FAQS = [
  {
    q: 'How much does a luxury condo at Vellmari in Puerto Cancún cost?',
    a: 'Residences at Vellmari start at $900,000 USD. Layouts range from 1,819 sq ft (169 m²) up to 7,686 sq ft (714 m²) in the penthouses, so the final price depends on the floor plan and tower. Prices and payment terms are subject to change without notice — an advisor will confirm current pricing and availability for you.',
  },
  {
    q: 'Can foreigners buy property in Cancún, Mexico?',
    a: 'Yes. Foreign buyers can purchase property anywhere in Mexico. Because Puerto Cancún sits within the coastal "restricted zone", foreign buyers typically hold title through a bank trust known as a fideicomiso, or through a Mexican corporation. It is a standard, well-established process used for decades. Our team coordinates with the notary and your attorney so you can review every step with your own legal and tax advisors.',
  },
  {
    q: 'How many residences are there, and how many are still available?',
    a: 'Vellmari is a limited collection of 98 residences across two towers — South Tower and North Tower — facing the Puerto Cancún marina. Because inventory is limited, availability by floor plan changes constantly. Request the current availability list and an advisor will send you what is open today.',
  },
  {
    q: 'What sizes and floor plans are available?',
    a: 'There are 17 distinct floor plans across both towers, from 1,819 sq ft (169 m²) up to 7,686 sq ft (714 m²), including dual-exposure penthouses and one garden residence. You can explore every floor plan by tower on this page.',
  },
  {
    q: 'Where exactly is Puerto Cancún?',
    a: 'Puerto Cancún is an 808-acre (327-hectare) master-planned community developed by FONATUR, located between downtown Cancún and the Hotel Zone. It includes an 18-hole golf course, a private marina, a beach club and a luxury shopping mall, and it is only minutes from Cancún International Airport.',
  },
  {
    q: 'What amenities are included?',
    a: 'Private marina access, resort-style pools, spa and sauna, fitness center, paddle tennis court, business center, kids\' club and a lounge bar — plus everything Puerto Cancún itself offers: golf, beach club, marina and shopping.',
  },
  {
    q: 'Who is the developer?',
    a: 'Vellmari is developed by Urban Homes, with more than 18 years of experience in Quintana Roo, 22 developments and over 5,000 homes delivered. Tresor Real Estate is an authorized sales partner, so pricing, availability and terms come directly from the developer.',
  },
  {
    q: 'Can I schedule a private tour if I live abroad?',
    a: 'Yes. We host private tours both on site and by video call, in English. Share your details in the form and an English-speaking advisor will reach out to arrange a time that works for your time zone.',
  },
];

const JSONLD = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Residence',
      name: 'Vellmari — Luxury Condos in Puerto Cancún',
      description:
        '98 exclusive marina-front residences from 1,819 to 7,686 sq ft in Puerto Cancún. Developed by Urban Homes, with private marina, 18-hole golf course, spa and resort-style amenities.',
      url: URL_EN,
      image: `https://www.tresor.mx${IMG}/ENTREGAFINAL_CADU_VELMARI_AEREA03.jpg`,
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
      name: 'Luxury condos for sale in Puerto Cancún — Vellmari',
      price: 900000,
      priceCurrency: 'USD',
      availability: 'https://schema.org/InStock',
      url: URL_EN,
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
export default function VellmariEnLanding({ floorPlans }: { floorPlans: FloorPlanTypology[] }) {
  const formRef = useRef<HTMLDivElement>(null);
  const utmRef = useRef<UTM>({});
  const [form, setForm] = useState({ firstName: '', email: '', phone: '', size: '', purpose: '' });
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
          superficie: form.size || undefined,
          proposito: form.purpose || undefined,
          utm: utmRef.current,
          // Marca el lead como angloparlante en el CRM — sin esto, un asesor
          // podría llamarle en español a alguien que llegó por un anuncio en
          // inglés.
          lang: 'en',
        }),
      });
      if (!res.ok) throw new Error('fail');
      // El evento de conversión (gtag + fbq) se dispara en /thank-you — un
      // solo punto de verdad para Google Ads y Meta.
      window.location.assign('/luxury-condos-puerto-cancun/thank-you');
    } catch {
      setErr('Something went wrong. Please try again or reach us on WhatsApp.');
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
            alt="Vellmari — luxury marina-front condos in Puerto Cancún, Mexico"
            fill priority sizes="100vw"
            className="object-cover"
          />
        </div>
        {/* En mobile el logo/título caen en la franja superior del gradiente,
            donde `to-ink/25` casi no oscurece — se leían casi directo sobre
            la foto. Se refuerza esa franja solo hasta lg (donde entra el
            segundo overlay horizontal de abajo y ya no hace falta). */}
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/80 to-ink/55 lg:to-ink/25" />
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
              Puerto Cancún · Mexico
            </p>

            <h1 className="mt-6 h-display text-[clamp(32px,5vw,68px)] text-white">
              Luxury condos on the<br className="hidden lg:block" />{' '}
              <span className="text-accent">Puerto Cancún marina</span>
            </h1>

            <p className="mx-auto mt-6 max-w-xl text-[15px] font-light leading-relaxed text-white/70 lg:mx-0 lg:text-[16px]">
              Only <strong className="font-semibold text-white">98 residences</strong> across two towers,
              from 1,819 to 7,686 sq ft — wrapped by an 18-hole golf course, a private marina and the
              best beaches in the Caribbean.
            </p>

            <div className="mt-7 flex flex-wrap justify-center gap-2 lg:justify-start">
              {['98 residences only', 'Marina-front', 'Dual-exposure penthouses'].map((g) => (
                <span key={g} className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border border-white/15 bg-white/[0.07] px-3.5 py-1.5 text-[11px] font-medium text-white/90 backdrop-blur-md lg:text-[12px]">
                  <Check size={12} strokeWidth={3} className="text-accent" /> {g}
                </span>
              ))}
            </div>

            <div className="mt-9 flex items-end justify-center gap-3 lg:justify-start">
              <span className="pb-1 text-[11px] font-medium uppercase tracking-caps text-white/50">From</span>
              <span className="h-display text-[clamp(26px,3.4vw,42px)] leading-none text-white">$900,000 USD</span>
            </div>
          </div>

          {/* form — visible above the fold en desktop, a un scroll corto en móvil */}
          <div ref={formRef} id="request-info" className="scroll-mt-24">
            <FormCard form={form} set={set} valid={valid} loading={loading} err={err} submit={submit} />
          </div>
        </div>

        <a href="#project" aria-label="See more" className="absolute bottom-5 left-1/2 hidden -translate-x-1/2 text-white/40 transition hover:text-white lg:block">
          <ChevronDown size={26} className="animate-bounce" />
        </a>
      </section>

      {/* ═════════ STATS ═════════ */}
      <section className="border-b border-white/10 bg-ink py-10 md:py-12">
        <div className="container-wrap grid grid-cols-2 gap-y-8 lg:grid-cols-4">
          {STATS.map(({ value, label }, i) => (
            <div key={label} className={`px-2 text-center lg:px-8 ${i > 0 ? 'lg:border-l lg:border-white/10' : ''}`}>
              <div className="h-display text-[clamp(24px,2.8vw,38px)] text-accent">{value}</div>
              <div className="mt-2 text-[11px] uppercase tracking-caps text-white/45">{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ═════════ THE PROJECT ═════════ */}
      <section id="project" className="scroll-mt-16 bg-white py-24 md:py-32">
        <div className="container-wrap grid gap-12 lg:grid-cols-2 lg:items-center lg:gap-20">
          <RevealOnScroll>
            <span className="eyebrow eyebrow-accent font-bold">— The residences</span>
            <h2 className="mt-5 h-display text-[clamp(28px,3.6vw,52px)] text-ink">
              98 luxury residences<br />
              <span className="text-ink-3">in the heart of Puerto Cancún</span>
            </h2>
            <div className="mt-7 space-y-5 text-[15px] font-light leading-relaxed text-ink-2 md:text-[16px]">
              <p>
                Vellmari is an architectural landmark of{' '}
                <strong className="font-semibold text-ink">98 exclusive residences</strong> in the most
                sought-after residential address in the Mexican Caribbean — designed around the water,
                the light and the view.
              </p>
              <p>
                Two towers facing the marina, with layouts from{' '}
                <strong className="font-semibold text-ink">1,819 to 7,686 sq ft</strong> and
                dual-exposure penthouses, surrounded by a championship golf course, a luxury mall and
                the Caribbean Sea.
              </p>
            </div>
            <button onClick={scrollToForm} className="btn btn-lg mt-9 border-0 bg-ink text-white hover:bg-ink/85">
              Request pricing &amp; brochure <ArrowRight size={14} strokeWidth={2.2} />
            </button>
          </RevealOnScroll>

          <RevealOnScroll delay={120}>
            <div className="relative aspect-[4/5] overflow-hidden rounded-[28px] bg-bg-soft">
              <Image
                src={`${IMG}/ENTREGAFINAL_CADU_VELMARI_FACHADA03.jpg`}
                alt="Contemporary architecture of Vellmari in Puerto Cancún"
                fill sizes="(max-width:1024px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
          </RevealOnScroll>
        </div>
      </section>

      {/* ═════════ CTA BANNER 1 ═════════ */}
      <CtaBanner
        image={`${IMG}/ENTREGAFINAL_CADU_VELMARI_AMENIDADES09.jpg`}
        alt="Resort-style pool facing the Caribbean Sea at Vellmari, Puerto Cancún"
        eyebrow="A lifestyle, not just an address"
        title={<>Wake up to the Caribbean<br />at your feet</>}
        text="Amenities designed so every single day feels like a private stay at a five-star resort."
        cta="Schedule a private tour"
        onClick={scrollToForm}
      />

      {/* ═════════ PUERTO CANCÚN ═════════ */}
      <section className="bg-bg-soft py-24 md:py-32">
        <div className="container-wrap">
          <RevealOnScroll className="max-w-3xl">
            <span className="eyebrow eyebrow-accent font-bold">— The location</span>
            <h2 className="mt-5 h-display text-[clamp(28px,3.6vw,52px)] text-ink">
              Puerto Cancún,{' '}
              <span className="text-ink-3">the most exclusive address in the Mexican Caribbean</span>
            </h2>
            <p className="mt-6 text-[15px] font-light leading-relaxed text-ink-2 md:text-[16px]">
              An <strong className="font-semibold text-ink">808-acre</strong> master-planned community
              developed by FONATUR, with an 18-hole championship golf course, a private marina, a beach
              club and a luxury shopping mall — sitting between downtown Cancún and the Hotel Zone, only
              minutes from Cancún International Airport.
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
                  alt="Aerial view of Puerto Cancún — marina, golf course and beaches"
                  fill sizes="(max-width:1024px) 100vw, 55vw"
                  className="object-cover"
                />
              </div>
            </RevealOnScroll>

            <RevealOnScroll delay={120} className="flex flex-col gap-4 lg:gap-6">
              <ul className="grid gap-3 rounded-[28px] bg-white p-7 md:p-8">
                {NEIGHBORHOOD.map(({ icon: Icon, label }) => (
                  <li key={label} className="flex items-center gap-4">
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-accent/12 text-ink">
                      <Icon size={18} strokeWidth={1.7} />
                    </span>
                    <span className="text-[14.5px] text-ink-2">{label}</span>
                  </li>
                ))}
              </ul>
              <div className="min-h-[260px] flex-1 overflow-hidden rounded-[28px] bg-white [&>div]:h-full [&>div]:min-h-[260px] [&>div]:rounded-none [&>div]:border-0">
                <LocationMap lat={21.1616} lng={-86.8098} zoom={14} address="Puerto Cancún, Cancún, Q. Roo, Mexico" />
              </div>
            </RevealOnScroll>
          </div>
        </div>
      </section>

      {/* ═════════ AMENITIES ═════════ */}
      <section className="bg-white py-24 md:py-32">
        <div className="container-wrap">
          <RevealOnScroll className="max-w-2xl">
            <span className="eyebrow eyebrow-accent font-bold">— Amenities</span>
            <h2 className="mt-5 h-display text-[clamp(28px,3.6vw,52px)] text-ink">
              Everything you need,<br />
              <span className="text-ink-3">without leaving home</span>
            </h2>
          </RevealOnScroll>

          <div className="mt-12 grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
            {AMENITIES.map(({ icon: Icon, label }) => (
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

      {/* ═════════ GALLERY ═════════ */}
      <LuxuryGallery images={GALLERY} tourUrl={TOUR_URL} />

      {/* ═════════ CTA BANNER 2 ═════════ */}
      <CtaBanner
        image={`${IMG}/ENTREGAFINAL_CADU_VELMARI_AMENIDADES02.jpg`}
        alt="Fire pit lounge at dusk at Vellmari, Puerto Cancún"
        eyebrow="Limited collection · 98 residences"
        title={<>Choose your residence<br />before someone else does</>}
        text="An English-speaking advisor will walk you through live availability by tower, pricing and payment plans."
        cta="See current availability"
        onClick={scrollToForm}
      />

      {/* ═════════ FLOOR PLANS ═════════ */}
      <div id="floor-plans" className="scroll-mt-16">
        <FichaFloorPlansTowers
          floorPlans={floorPlans}
          towersImage={`${IMG}/torresmitad.jpg`}
          locale="en"
          gray
          onCtaClick={scrollToForm}
        />
      </div>

      {/* ═════════ FAQ ═════════ */}
      <section className="bg-white py-24 md:py-32">
        <div className="container-wrap max-w-3xl">
          <span className="eyebrow eyebrow-accent font-bold">— Frequently asked</span>
          <h2 className="mt-5 h-display text-[clamp(28px,3.6vw,52px)] text-ink">
            Buying in Puerto Cancún
          </h2>
          <div className="mt-10">
            {FAQS.map((f) => <FaqItem key={f.q} q={f.q} a={f.a} />)}
          </div>
        </div>
      </section>

      {/* ═════════ CLOSING (CTA + minimal footer) ═════════ */}
      <footer data-nav="dark" className="relative z-10 -mt-10 overflow-hidden rounded-t-[2.5rem] bg-bg-deep pt-24 text-white">
        <Image
          src={`${IMG}/ENTREGAFINAL_CADU_VELMARI_FACHADA04.jpg`}
          alt="Vellmari at sunset — Puerto Cancún"
          fill sizes="100vw"
          className="object-cover object-top opacity-[0.22]"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-bg-deep/70 via-bg-deep/90 to-bg-deep" />

        <div className="container-wrap relative z-10 text-center">
          <span className="eyebrow eyebrow-accent font-bold">Now selling · 98 residences</span>
          <h2 className="mx-auto mt-5 h-display text-[clamp(30px,4.2vw,60px)] text-white max-w-3xl">
            Your residence on the Puerto Cancún marina
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-[15px] font-light leading-relaxed text-white/60">
            Share your details and an English-speaking advisor will contact you with live availability
            by tower, pricing and payment plans.
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <button onClick={scrollToForm} className="btn btn-lg border-0 bg-accent text-ink hover:brightness-95">
              Schedule a private tour <ArrowRight size={14} strokeWidth={2.2} />
            </button>
            <a
              href={waLink("Hi! I'm interested in Vellmari, Puerto Cancún. I'd like more information.")}
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
              <a href={waLink("Hi! I'm interested in Vellmari, Puerto Cancún.")} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 transition hover:text-white"><MessageCircle size={14} /> WhatsApp</a>
            </div>
            <p className="max-w-2xl text-[11px] leading-relaxed text-white/35">
              Vellmari is developed by Urban Homes; Tresor Real Estate acts as an authorized sales
              partner. Renderings are for illustrative purposes only. * Prices, dimensions and payment
              terms are subject to change without notice and do not constitute an offer. Foreign
              ownership in the coastal zone is typically held through a bank trust (fideicomiso) —
              please review the structure with your own legal and tax advisors.
              © {new Date().getFullYear()} Tresor Real Estate.
            </p>
          </div>
        </div>
      </footer>

      {/* Sticky móvil */}
      <div className="fixed inset-x-0 bottom-0 z-40 flex items-center gap-2.5 border-t border-white/10 bg-ink/95 px-4 py-3 backdrop-blur-md lg:hidden">
        <a
          href={waLink("Hi! I'm interested in Vellmari, Puerto Cancún. I'd like more information.")}
          target="_blank" rel="noopener noreferrer"
          aria-label="WhatsApp"
          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#25D366] text-white"
        >
          <MessageCircle size={20} strokeWidth={2} />
        </a>
        <button onClick={scrollToForm} className="flex flex-1 items-center justify-center gap-2 rounded-full bg-accent py-3.5 text-[12px] font-bold uppercase tracking-[0.18em] text-ink">
          Request info <ArrowRight size={14} strokeWidth={2.5} />
        </button>
      </div>
    </>
  );
}

/* ─────────────── galería editorial con lightbox ───────────────
   Propia y no el <Gallery/> compartido: ese trae "Tour Virtual" y "Galería
   del Proyecto" hardcodeados en español, que en una landing en inglés se
   leen como un error. Además aquí el layout es de mosaico (la primera foto
   a doble alto) en vez de un slider — más impacto en el primer vistazo.   */
function LuxuryGallery({ images, tourUrl }: { images: { src: string; alt: string }[]; tourUrl?: string }) {
  const [open, setOpen] = useState<number | null>(null);

  const close = useCallback(() => setOpen(null), []);
  const go = useCallback((dir: 1 | -1) => {
    setOpen((i) => (i === null ? i : (i + dir + images.length) % images.length));
  }, [images.length]);

  // Teclado en el lightbox + bloqueo del scroll de fondo.
  useEffect(() => {
    if (open === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowRight') go(1);
      if (e.key === 'ArrowLeft') go(-1);
    };
    window.addEventListener('keydown', onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [open, close, go]);

  return (
    <section className="bg-[#FAFAFA] py-24 md:py-32">
      <div className="container-wrap">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
          <div>
            <span className="eyebrow eyebrow-accent block font-bold">— Gallery</span>
            <h2 className="mt-3 h-display text-[clamp(24px,3.2vw,48px)] text-ink">
              Architecture &amp; amenities
            </h2>
          </div>
          {tourUrl && (
            <a
              href={tourUrl}
              target="_blank" rel="noopener noreferrer"
              className="btn btn-outline font-semibold"
            >
              <Expand size={15} strokeWidth={1.8} /> Virtual tour
            </a>
          )}
        </div>

        {/* Mosaico: la primera ocupa 2×2 en desktop, el resto 1×1 */}
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
          {images.map((img, i) => (
            <button
              key={img.src}
              onClick={() => setOpen(i)}
              aria-label={`Open image: ${img.alt}`}
              className={`group relative overflow-hidden rounded-[20px] bg-white md:rounded-[24px] ${
                i === 0 ? 'col-span-2 row-span-2 aspect-square' : 'aspect-square'
              }`}
            >
              <Image
                src={img.src}
                alt={img.alt}
                fill
                sizes={i === 0 ? '(max-width:768px) 100vw, 50vw' : '(max-width:768px) 50vw, 25vw'}
                className="object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.06]"
              />
              <span className="absolute inset-0 bg-ink/0 transition-colors duration-500 group-hover:bg-ink/20" />
              <span className="absolute bottom-3 right-3 flex h-9 w-9 translate-y-2 items-center justify-center rounded-full bg-white/90 text-ink opacity-0 backdrop-blur-md transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                <Expand size={15} strokeWidth={2} />
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      {open !== null && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-ink/95 backdrop-blur-sm"
          onClick={close}
          role="dialog"
          aria-modal="true"
          aria-label="Image gallery"
        >
          <button
            onClick={close}
            aria-label="Close gallery"
            className="absolute right-5 top-5 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20"
          >
            <X size={20} strokeWidth={2} />
          </button>

          <button
            onClick={(e) => { e.stopPropagation(); go(-1); }}
            aria-label="Previous image"
            className="absolute left-3 z-10 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20 md:left-6"
          >
            <ChevronLeft size={22} strokeWidth={2} />
          </button>

          <div className="relative h-[78vh] w-[92vw] max-w-6xl" onClick={(e) => e.stopPropagation()}>
            <Image
              src={images[open].src}
              alt={images[open].alt}
              fill sizes="92vw"
              className="object-contain"
            />
          </div>

          <button
            onClick={(e) => { e.stopPropagation(); go(1); }}
            aria-label="Next image"
            className="absolute right-3 z-10 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20 md:right-6"
          >
            <ChevronRight size={22} strokeWidth={2} />
          </button>

          <p className="absolute bottom-6 left-1/2 -translate-x-1/2 text-center text-[12px] text-white/60">
            {images[open].alt} · {open + 1} / {images.length}
          </p>
        </div>
      )}
    </section>
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
  form: { firstName: string; email: string; phone: string; size: string; purpose: string };
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
        <span className="eyebrow eyebrow-accent font-bold">Private consultation</span>
        <p className="mt-2 text-[15px] font-medium text-white">Request pricing &amp; availability</p>
        <p className="mt-1 text-[12.5px] font-light text-white/50">
          An English-speaking advisor contacts you today · No obligation
        </p>
      </div>

      <form onSubmit={submit} className="flex flex-col gap-3">
        <input
          required type="text" placeholder="Full name" autoComplete="name"
          value={form.firstName} onChange={(e) => set('firstName', e.target.value)}
          className="appearance-none rounded-2xl border border-white/10 bg-white px-4 py-3 text-[14px] text-ink outline-none transition-colors focus:border-accent"
        />
        <input
          required type="email" placeholder="Email address" autoComplete="email"
          value={form.email} onChange={(e) => set('email', e.target.value)}
          className="appearance-none rounded-2xl border border-white/10 bg-white px-4 py-3 text-[14px] text-ink outline-none transition-colors focus:border-accent"
        />
        <input
          required type="tel" placeholder="Phone / WhatsApp" autoComplete="tel"
          value={form.phone} onChange={(e) => set('phone', e.target.value)}
          className="appearance-none rounded-2xl border border-white/10 bg-white px-4 py-3 text-[14px] text-ink outline-none transition-colors focus:border-accent"
        />

        <div className="pt-1">
          <p className="mb-2 text-[10.5px] uppercase tracking-caps text-white/45">Size you have in mind</p>
          <div className="grid grid-cols-2 gap-2">
            {[
              { v: '169-250', l: '1,819 – 2,690 ft²' },
              { v: '250-400', l: '2,690 – 4,306 ft²' },
              { v: 'ph', l: 'Penthouse' },
              { v: 'abierto', l: 'Open to options' },
            ].map(({ v, l }) => (
              <button key={v} type="button" onClick={() => set('size', v)} className={chip(form.size === v)}>
                {l}
              </button>
            ))}
          </div>
        </div>

        <div className="pt-1">
          <p className="mb-2 text-[10.5px] uppercase tracking-caps text-white/45">What is it for?</p>
          <div className="grid grid-cols-3 gap-2">
            {[
              { v: 'vivir', l: 'To live in' },
              { v: 'inversion', l: 'Investment' },
              { v: 'segunda', l: 'Second home' },
            ].map(({ v, l }) => (
              <button key={v} type="button" onClick={() => set('purpose', v)} className={chip(form.purpose === v)}>
                {l}
              </button>
            ))}
          </div>
        </div>

        {err && <p className="rounded-lg bg-red-50 px-3 py-2 text-[12px] text-red-700">{err}</p>}

        <button type="submit" disabled={!valid || loading} className="btn mt-2 w-full border-0 bg-accent py-4 text-ink hover:brightness-95 disabled:opacity-40">
          {loading ? 'Sending…' : <>Request information <ArrowRight size={14} strokeWidth={2.5} /></>}
        </button>
        <p className="flex items-center justify-center gap-1.5 text-center text-[10.5px] text-white/40">
          <ShieldCheck size={12} strokeWidth={2} /> Your details are safe. No spam, ever.
        </p>
      </form>
    </div>
  );
}
