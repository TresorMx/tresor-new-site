'use client';

import { useState, useRef } from 'react';
import { useLocale } from 'next-intl';
import Image from 'next/image';
import Link from 'next/link';
import {
  ArrowRight, CheckCircle2, TrendingUp, Building2,
  ShieldCheck, Phone, MessageCircle, ChevronDown, ChevronUp,
  Star, Plane, BarChart2, Clock,
} from 'lucide-react';

const BENEFITS_ES = [
  { icon: TrendingUp,  title: 'Plusvalía 2–3× mayor que en tu ciudad', desc: 'Los corredores comerciales de Cancún han mantenido plusvalía de 10–15% anual en los últimos 5 años, frente al 5–8% de Monterrey, CDMX o Guadalajara.' },
  { icon: Building2,   title: 'Precio de entrada hasta 3× menor',       desc: 'Un local en Cancún desde $1,968,600 MXN te da acceso a 32 m² en una plaza premium. El mismo presupuesto en San Pedro o Polanco no te alcanza ni para 15 m².' },
  { icon: BarChart2,   title: 'Rendimiento por renta del 10–15%',        desc: 'Frente al 5–6% típico en las grandes ciudades. La relación entre precio y renta en Cancún es de las mejores del país.' },
  { icon: Plane,       title: 'Proceso 100% remoto',                     desc: 'Videollamada inicial, contrato digital, mensualidades por transferencia. Si quieres visitar, es 2 horas de avión. Muchos clientes nunca vienen hasta la entrega.' },
  { icon: ShieldCheck, title: 'Desarrollador con trayectoria comprobada', desc: 'Tresor Real Estate lleva más de 10 años desarrollando proyectos en Quintana Roo. Más de 25 proyectos entregados. Apartado 100% reembolsable.' },
  { icon: Clock,       title: 'Listo para rentar desde el día 1',         desc: 'Locales con acabados de primera calidad, planta libre. Sin obra adicional. Tu inquilino puede entrar al mes de la entrega.' },
];

const BENEFITS_EN = [
  { icon: TrendingUp,  title: '2–3× higher appreciation than your city', desc: "Cancún's commercial corridors have held 10–15% annual appreciation over the last 5 years, versus 5–8% in Monterrey, Mexico City or Guadalajara." },
  { icon: Building2,   title: 'Entry price up to 3× lower',               desc: 'A commercial space in Cancún from $1,968,600 MXN gets you 32 sqm in a premium plaza. The same budget in San Pedro or Polanco barely covers 15 sqm.' },
  { icon: BarChart2,   title: '10–15% rental yield',                      desc: 'Versus a typical 5–6% in major cities. The price-to-rent ratio in Cancún is among the best in the country.' },
  { icon: Plane,       title: '100% remote process',                     desc: 'Initial video call, digital contract, monthly payments by transfer. If you want to visit, it\'s a 2-hour flight. Many clients never come until delivery.' },
  { icon: ShieldCheck, title: 'A developer with a proven track record',   desc: 'Tresor Real Estate has been developing projects in Quintana Roo for over 10 years. 25+ projects delivered. 100% refundable reservation.' },
  { icon: Clock,       title: 'Ready to rent from day 1',                 desc: 'Top-quality finishes, open floor plan. No additional construction needed. Your tenant can move in a month after delivery.' },
];

const FAQS_ES = [
  { q: '¿Puedo comprar un local en Cancún sin vivir allá?', a: 'Sí. Todo el proceso previo a la entrega se puede gestionar de forma remota: la videollamada de presentación, el contrato de promesa y las mensualidades durante la construcción. Para la escrituración, puedes acudir personalmente o dar poder notarial a un representante en Cancún.' },
  { q: '¿Quién administra el local si no estoy en Cancún?', a: 'Existen gestores de propiedades locales en Cancún que por entre el 8% y el 12% de la renta mensual se encargan de todo: búsqueda de inquilino, cobro de renta, mantenimiento menor y reportes periódicos. Es la misma figura que se usa en cualquier inversión inmobiliaria remota.' },
  { q: '¿Cuánto necesito para invertir?', a: 'El enganche mínimo en Quattro Plaza Center es de $147,000 MXN (30% del precio base del local más pequeño). El resto se paga en mensualidades sin intereses durante la construcción y el saldo a la entrega. Es un esquema diseñado para que la inversión no comprometa todo tu capital de golpe.' },
  { q: '¿Por qué Cancún y no Mérida, Playa del Carmen o Los Cabos?', a: 'Cancún tiene la mayor base de población residente del sureste mexicano (más de 1 millón de habitantes), el aeropuerto internacional más transitado de México después del AICM y la mayor oferta de servicios comerciales de la región. Es el mercado más líquido — encontrar inquilino es más fácil que en mercados más pequeños.' },
  { q: '¿Cuándo puedo esperar recuperar mi inversión?', a: 'Con un local bien ubicado en preventa, comprando a precio de entrada y rentando desde el primer mes de entrega, el período de recuperación típico es de 7 a 10 años considerando renta más plusvalía. En el escenario conservador de solo renta, el flujo cubre el costo financiero del capital invertido en menos tiempo que la mayoría de los instrumentos tradicionales.' },
  { q: '¿Los precios publicados incluyen IVA?', a: 'No. Los precios publicados son + IVA (16%). Un asesor te puede desglosar el precio total con IVA y el plan de pagos detallado para el local específico que te interese.' },
];

const FAQS_EN = [
  { q: 'Can I buy a commercial space in Cancún without living there?', a: "Yes. The entire pre-delivery process can be handled remotely: the initial video call, the promise-to-purchase contract, and monthly payments during construction. For the final deed, you can attend in person or grant power of attorney to a representative in Cancún." },
  { q: "Who manages the property if I'm not in Cancún?", a: 'Local property managers in Cancún handle everything — tenant search, rent collection, minor maintenance and periodic reports — for roughly 8–12% of monthly rent. It\'s the same setup used for any remote real estate investment.' },
  { q: 'How much do I need to invest?', a: "The minimum down payment at Quattro Plaza Center is $147,000 MXN (30% of the smallest unit's base price). The rest is paid in interest-free installments during construction, with the balance due at delivery — designed so the investment doesn't commit all your capital at once." },
  { q: "Why Cancún and not Mérida, Playa del Carmen or Los Cabos?", a: "Cancún has the largest resident population base in southeastern Mexico (over 1 million people), the busiest international airport in Mexico after Mexico City's, and the region's largest commercial services offer. It's the most liquid market — finding a tenant is easier than in smaller markets." },
  { q: 'When can I expect to recoup my investment?', a: 'With a well-located pre-sale unit, buying at entry price and renting from the first month of delivery, the typical payback period is 7 to 10 years considering rent plus appreciation. In the conservative rent-only scenario, cash flow covers the financial cost of the invested capital faster than most traditional instruments.' },
  { q: 'Do the published prices include tax?', a: "No. Published prices are + VAT (16%). An advisor can break down the full price with VAT and the detailed payment plan for the specific space you're interested in." },
];

function buildJsonLd(isEs: boolean, faqs: { q: string; a: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebPage',
        name: isEs
          ? 'Invertir en Cancún — Locales Comerciales para Inversionistas de Monterrey, CDMX y Guadalajara'
          : 'Invest in Cancún — Commercial Spaces for Out-of-Town Investors',
        description: isEs
          ? 'Locales comerciales en preventa en Cancún con rendimientos del 10–15% anual. Proceso 100% remoto. Ideal para inversionistas de Monterrey, CDMX o Guadalajara.'
          : 'Pre-sale commercial spaces in Cancún with 10–15% annual returns. 100% remote process.',
        url: isEs ? 'https://www.tresor.mx/invertir-en-cancun' : 'https://www.tresor.mx/en/invertir-en-cancun',
      },
      {
        '@type': 'FAQPage',
        mainEntity: faqs.map(({ q, a }) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })),
      },
      {
        '@type': 'LocalBusiness',
        '@id': 'https://www.tresor.mx/#organization',
        name: 'Tresor Real Estate',
        url: 'https://www.tresor.mx',
        logo: 'https://www.tresor.mx/logos/LogoTresor-ink.svg',
        telephone: '+529984045602',
        email: 'hello@tresor.mx',
        address: { '@type': 'PostalAddress', addressLocality: 'Cancún', addressRegion: 'Quintana Roo', addressCountry: 'MX' },
      },
    ],
  };
}

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-line">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between gap-4 py-5 text-left"
      >
        <span className="text-[15px] font-medium text-ink">{q}</span>
        {open ? <ChevronUp size={18} className="shrink-0 text-ink-3" /> : <ChevronDown size={18} className="shrink-0 text-ink-3" />}
      </button>
      {open && <p className="pb-5 text-[14px] leading-relaxed text-ink-3">{a}</p>}
    </div>
  );
}

export default function InvertirEnCancun() {
  const locale = useLocale();
  const isEs = locale !== 'en';
  const BENEFITS = isEs ? BENEFITS_ES : BENEFITS_EN;
  const FAQS = isEs ? FAQS_ES : FAQS_EN;
  const JSONLD = buildJsonLd(isEs, FAQS);

  const formRef = useRef<HTMLDivElement>(null);
  const [form, setForm] = useState({ firstName: '', phone: '', ciudad: '', plaza: '' });
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [err, setErr] = useState('');

  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));
  const valid = form.firstName.trim() && form.phone.trim() && form.plaza;

  function scrollToForm() {
    formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!valid) return;
    setErr('');
    setLoading(true);
    try {
      const res = await fetch('/api/ads-lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: form.firstName,
          phone: form.phone,
          uso: form.plaza,
          variant: 'seo-locales-cancun',
        }),
      });
      if (!res.ok) throw new Error('Error');
      if (typeof (window as any).gtag === 'function') {
        (window as any).gtag('event', 'conversion', { send_to: 'AW-17453917774/wazACPXDnMQcEM7M1oJB' });
      }
      if (typeof window.fbq === 'function') {
        window.fbq('track', 'Lead', { content_name: 'Invertir en Cancún', content_category: 'seo' });
      }
      setDone(true);
    } catch {
      setErr(isEs ? 'Hubo un problema. Intenta de nuevo.' : 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  const waMsg = isEs ? 'Hola+quiero+información+para+invertir+en+Cancún' : 'Hi%2C+I+want+information+to+invest+in+Cancún';

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(JSONLD) }} />

      {/* ── Hero ── */}
      <section className="relative overflow-hidden bg-ink py-24 md:py-40">
        <div className="absolute inset-0">
          <Image
            src="/blog/AdobeStock_841077811.jpeg"
            alt={isEs ? 'Invertir en Cancún — Locales comerciales en preventa' : 'Invest in Cancún — Pre-sale commercial spaces'}
            fill priority sizes="100vw"
            className="object-cover opacity-25"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-ink/50 via-ink/70 to-ink" />
        </div>
        <div className="container-wrap relative z-10 text-center text-white">
          <span className="inline-block rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-[10px] font-bold uppercase tracking-widest text-white/70 backdrop-blur-sm">
            {isEs ? 'Para inversionistas de Monterrey · CDMX · Guadalajara' : 'For out-of-town investors'}
          </span>
          <h1 className="mt-6 h-display text-[clamp(36px,5.5vw,76px)] text-white leading-[1.05]">
            {isEs ? <>Invierte en Cancún<br /><span className="text-accent">sin salir de tu ciudad</span></> : <>Invest in Cancún<br /><span className="text-accent">without leaving home</span></>}
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-[16px] font-light leading-relaxed text-white/70">
            {isEs
              ? 'Locales comerciales en preventa con rendimientos del 10–15% anual. Proceso 100% remoto. Videollamada, contrato digital, mensualidades por transferencia. Desarrollado por Tresor Real Estate.'
              : 'Pre-sale commercial spaces with 10–15% annual returns. 100% remote process. Video call, digital contract, monthly payments by transfer. Developed by Tresor Real Estate.'}
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={scrollToForm}
              className="inline-flex items-center gap-2 rounded-full bg-accent px-7 py-3.5 text-[12px] font-bold uppercase tracking-widest text-ink transition hover:brightness-95"
            >
              {isEs ? 'Solicitar Información' : 'Request Information'} <ArrowRight size={14} strokeWidth={2} />
            </button>
            <a
              href={`https://wa.me/529984045602?text=${waMsg}`}
              target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-white/25 px-7 py-3.5 text-[12px] font-bold uppercase tracking-widest text-white transition hover:border-white/50"
            >
              <MessageCircle size={14} strokeWidth={2} /> WhatsApp
            </a>
          </div>
        </div>
      </section>

      {/* ── Stats bar ── */}
      <section className="border-b border-line bg-white">
        <div className="container-wrap">
          <div className="grid grid-cols-2 md:grid-cols-4" style={{ minHeight: '96px' }}>
            {[
              { value: '10–15%',           label: isEs ? 'Rendimiento anual estimado' : 'Estimated annual return' },
              { value: 'Desde $1.96 MDP*', label: isEs ? 'Precio de entrada + IVA' : 'Entry price + VAT' },
              { value: isEs ? '2 hrs de avión' : '2-hour flight', label: isEs ? 'Desde MTY / CDMX / GDL' : 'Anywhere in Mexico' },
              { value: isEs ? '100% remoto' : '100% remote',      label: isEs ? 'Todo el proceso previo' : 'The entire pre-delivery process' },
            ].map((s, i) => (
              <div key={i} className={`flex flex-col justify-center px-5 py-5 md:py-0 ${i > 0 ? 'border-l border-line' : ''} ${i >= 2 ? 'border-t md:border-t-0 border-line' : ''}`}>
                <div className="text-[clamp(18px,1.5vw,22px)] font-bold leading-tight text-ink">{s.value}</div>
                <div className="mt-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-ink-3">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Por qué Cancún ── */}
      <section className="bg-bg py-16 md:py-24">
        <div className="container-wrap max-w-3xl">
          <span className="eyebrow eyebrow-accent">{isEs ? '— El contexto' : '— The context'}</span>
          <h2 className="mt-4 h-display text-[clamp(28px,3.2vw,48px)] leading-[1.05] tracking-tight text-ink">
            {isEs ? 'Tu mercado local ya no da los rendimientos de antes' : 'Your local market no longer delivers the returns it used to'}
          </h2>
          <div className="mt-6 space-y-4 text-[15px] font-light leading-relaxed text-ink-2">
            {isEs ? (
              <>
                <p>Los precios en Monterrey, CDMX y Guadalajara subieron tanto en la última década que el rendimiento por renta de un local comercial ya no supera el 6% anual en la mayoría de las zonas. Antes de impuestos y vacancia, estás por debajo de lo que ofrece un instrumento de deuda.</p>
                <p>Cancún tiene la ecuación inversa: <strong>precio de entrada bajo, rentas altas y una plusvalía histórica de 10–15% anual</strong> sostenida por crecimiento poblacional real, escasez de suelo y turismo como piso mínimo de demanda. Es el mercado que las grandes ciudades fueron hace 20 años.</p>
                <p>Y lo mejor: no necesitas mudarte. El proceso de compra en preventa es completamente remoto. Tu local trabaja en Cancún mientras tú sigues en tu ciudad.</p>
              </>
            ) : (
              <>
                <p>Prices in major Mexican metros have risen so much over the last decade that rental yield on a commercial space no longer exceeds 6% annually in most areas. Before taxes and vacancy, that's below what a debt instrument offers.</p>
                <p>Cancún has the inverse equation: <strong>low entry price, high rents, and 10–15% annual historical appreciation</strong> sustained by real population growth, land scarcity and tourism as a demand floor. It's the market major cities were 20 years ago.</p>
                <p>And the best part: you don't need to relocate. The pre-sale purchase process is entirely remote. Your unit works in Cancún while you stay wherever you are.</p>
              </>
            )}
          </div>
          <Link
            href="/blog/invertir-en-cancun-desde-monterrey-cdmx"
            className="mt-8 inline-flex items-center gap-2 text-accent text-sm font-semibold hover:underline"
          >
            {isEs ? 'Leer el análisis completo' : 'Read the full analysis'} <ArrowRight size={14} />
          </Link>
        </div>
      </section>

      {/* ── Comparativa ── */}
      <section className="bg-white py-16 md:py-20">
        <div className="container-wrap max-w-4xl">
          <div className="mb-10 text-center">
            <span className="eyebrow eyebrow-accent">{isEs ? '— Comparativa' : '— Comparison'}</span>
            <h2 className="mt-4 h-display text-[clamp(28px,3.2vw,48px)] leading-[1.05] tracking-tight text-ink">
              {isEs ? '¿Qué obtienes con $2,000,000 MXN en cada ciudad?' : 'What do $2,000,000 MXN get you in each city?'}
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-5">
            {[
              { ciudad: 'Monterrey', emoji: '🏔', desc: isEs ? '~16 m² en zona secundaria. Renta: $9,000–$11,000/mes.' : '~16 sqm in a secondary area. Rent: $9,000–$11,000/month.', rendimiento: isEs ? '~5.4–6.6% anual' : '~5.4–6.6% annually', destacado: false },
              { ciudad: 'CDMX', emoji: '🏙', desc: isEs ? '~14 m² en colonia media. Renta: $8,500–$10,000/mes.' : '~14 sqm in a mid-tier neighborhood. Rent: $8,500–$10,000/month.', rendimiento: isEs ? '~5.1–6.0% anual' : '~5.1–6.0% annually', destacado: false },
              { ciudad: isEs ? 'Cancún · Quattro' : 'Cancún · Quattro', emoji: '🌴', desc: isEs ? 'Local de 32 m² en plaza premium. Renta: $20,000–$25,000/mes.' : 'A 32 sqm unit in a premium plaza. Rent: $20,000–$25,000/month.', rendimiento: isEs ? '~12–15% anual' : '~12–15% annually', destacado: true },
            ].map((c) => (
              <div key={c.ciudad} className={`rounded-2xl border p-7 ${c.destacado ? 'border-accent bg-accent/5' : 'border-line bg-bg-soft'}`}>
                <div className="text-3xl mb-3">{c.emoji}</div>
                <h3 className={`h-display text-xl leading-[1.05] tracking-tight mb-2 ${c.destacado ? 'text-accent' : 'text-ink'}`}>{c.ciudad}</h3>
                <p className="text-ink-2 text-sm leading-relaxed mb-4">{c.desc}</p>
                <p className={`text-sm font-bold ${c.destacado ? 'text-accent' : 'text-ink-3'}`}>{c.rendimiento}</p>
              </div>
            ))}
          </div>
          <p className="mt-6 text-[11px] text-ink-3 text-center">
            {isEs
              ? '*Precios + IVA. Estimaciones basadas en datos de mercado 2025–2026. Los rendimientos son proyectados y no garantizados.'
              : '*Prices + VAT. Estimates based on 2025–2026 market data. Returns are projected, not guaranteed.'}
          </p>
        </div>
      </section>

      {/* ── Benefits ── */}
      <section className="bg-bg py-16 md:py-24">
        <div className="container-wrap">
          <div className="mb-12 text-center">
            <span className="eyebrow eyebrow-accent">{isEs ? '— Por qué Quattro' : '— Why Quattro'}</span>
            <h2 className="mt-4 h-display text-[clamp(28px,3.2vw,48px)] leading-[1.05] tracking-tight text-ink">
              {isEs ? 'Diseñado para el inversionista que no vive en Cancún' : "Designed for the investor who doesn't live in Cancún"}
            </h2>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {BENEFITS.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="rounded-xl border border-line bg-white p-7">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-bg-soft text-ink">
                  <Icon size={22} strokeWidth={1.5} />
                </div>
                <h3 className="mt-5 h-display text-[18px] leading-[1.15] tracking-tight text-ink">{title}</h3>
                <p className="mt-2 text-[13px] leading-relaxed text-ink-3">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Plazas ── */}
      <section className="bg-white py-16 md:py-24">
        <div className="container-wrap max-w-4xl">
          <div className="mb-10 text-center">
            <span className="eyebrow eyebrow-accent">{isEs ? '— Proyectos disponibles' : '— Available projects'}</span>
            <h2 className="mt-4 h-display text-[clamp(28px,3.2vw,48px)] leading-[1.05] tracking-tight text-ink">
              {isEs ? 'Dos plazas en preventa · Cancún' : 'Two plazas in pre-sale · Cancún'}
            </h2>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            {[
              {
                name: 'Gardens',
                slug: 'gardens',
                render: '/renders/gardens/02.jpg',
                badge: isEs ? 'Lanzamiento · Preventa' : 'Launch · Pre-sale',
                stats: isEs ? ['32 locales', 'Desde 32 m²', 'Desde $1,968,600 MXN*', 'Entrega JUN–SEP 2027'] : ['32 units', 'From 32 sqm', 'From $1,968,600 MXN*', 'Delivery JUN–SEP 2027'],
                desc: isEs ? 'Arquitectura premium con vegetación integrada y 2 niveles. Enganche desde $147,000 MXN.' : 'Premium architecture with integrated greenery and 2 levels. Down payment from $147,000 MXN.',
              },
              {
                name: 'Long Island',
                slug: 'long-island',
                render: '/renders/long-island/02.jpg',
                badge: isEs ? 'Preventa · Entrega próxima' : 'Pre-sale · Delivery soon',
                stats: isEs ? ['30 locales', 'Desde 40 m²', 'Desde $2,650,000 MXN*', 'Entrega DIC 2026–MAR 2027'] : ['30 units', 'From 40 sqm', 'From $2,650,000 MXN*', 'Delivery DEC 2026–MAR 2027'],
                desc: isEs ? '120 m lineales de frente comercial. Entrega más próxima, ideal para rentar cuanto antes.' : '120 linear meters of storefront. Sooner delivery, ideal for renting out quickly.',
              },
            ].map((p) => (
              <div key={p.slug} className="rounded-2xl border border-line overflow-hidden">
                <div className="relative aspect-video">
                  <Image src={p.render} alt={`Quattro Plaza Center ${p.name}`} fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover" />
                  <span className="absolute left-4 top-4 rounded-full bg-black/60 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-white backdrop-blur-sm">{p.badge}</span>
                </div>
                <div className="p-6">
                  <h3 className="h-display text-[22px] leading-[1.05] tracking-tight mb-1 text-ink">Quattro Plaza Center {p.name}</h3>
                  <p className="text-ink-3 text-sm mb-5">{p.desc}</p>
                  <div className="grid grid-cols-2 gap-3 mb-6">
                    {p.stats.map((s) => (
                      <div key={s} className="flex items-center gap-2 text-sm text-ink-2">
                        <CheckCircle2 size={14} strokeWidth={1.5} className="shrink-0 text-accent" />
                        {s}
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-3">
                    <Link href={`/desarrollos/${p.slug}`}
                      className="flex-1 rounded-full border border-ink py-2.5 text-center text-[12px] font-bold uppercase tracking-widest text-ink transition hover:bg-ink hover:text-white">
                      {isEs ? 'Ver proyecto' : 'View project'}
                    </Link>
                    <button onClick={scrollToForm}
                      className="flex-1 rounded-full bg-accent py-2.5 text-center text-[12px] font-bold uppercase tracking-widest text-ink transition hover:brightness-95">
                      {isEs ? 'Me interesa' : "I'm interested"}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <p className="mt-4 text-[11px] text-ink-3 text-center">{isEs ? '*Precio + IVA' : '*Price + VAT'}</p>
        </div>
      </section>

      {/* ── Formulario ── */}
      <section ref={formRef} id="solicitar-info" className="border-t border-line bg-bg py-20 md:py-28">
        <div className="container-wrap grid gap-12 md:grid-cols-[1fr_480px]">
          <div>
            <span className="eyebrow eyebrow-accent">{isEs ? '— Primer paso' : '— First step'}</span>
            <h2 className="mt-4 h-display text-[clamp(28px,3.5vw,48px)] leading-[1.1] tracking-tight text-ink">
              {isEs ? 'Habla con un asesor especializado' : 'Talk to a specialized advisor'}
            </h2>
            <p className="mt-4 text-[15px] font-light leading-relaxed text-ink-3">
              {isEs
                ? 'Te contactamos en menos de 2 horas. Videollamada por Zoom, sin compromiso, desde donde estés.'
                : "We'll contact you within 2 hours. A no-commitment Zoom call, wherever you are."}
            </p>
            <ul className="mt-8 space-y-3">
              {(isEs
                ? ['Disponibilidad actualizada al momento', 'Comparativa de las dos plazas', 'Plan de pagos personalizado', 'Apartado 100% reembolsable', 'Videollamada o visita presencial en Cancún']
                : ['Real-time availability', 'Comparison of both plazas', 'A personalized payment plan', '100% refundable reservation', 'Video call or an in-person visit to Cancún']
              ).map((item) => (
                <li key={item} className="flex items-center gap-3 text-[14px] text-ink-2">
                  <CheckCircle2 size={15} strokeWidth={1.5} className="shrink-0 text-accent" />
                  {item}
                </li>
              ))}
            </ul>
            <div className="mt-10 flex flex-col gap-3 sm:flex-row">
              <a href="tel:+529984045602"
                className="flex items-center gap-2.5 rounded-full border border-line bg-white px-5 py-3 text-[13px] font-semibold text-ink transition hover:border-ink">
                <Phone size={15} strokeWidth={1.5} /> +52 998 404 5602
              </a>
              <a href={`https://wa.me/529984045602?text=${waMsg}`}
                target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-2.5 rounded-full bg-[#25D366] px-5 py-3 text-[13px] font-semibold text-white transition hover:bg-[#25D366]/90">
                <MessageCircle size={15} strokeWidth={1.5} /> {isEs ? 'WhatsApp directo' : 'WhatsApp'}
              </a>
            </div>
          </div>

          <div className="rounded-2xl bg-white p-8 shadow-xl">
            {done ? (
              <div className="flex flex-col items-center py-8 text-center">
                <CheckCircle2 size={48} strokeWidth={1} className="text-accent" />
                <h3 className="mt-4 h-display text-[22px] leading-[1.05] tracking-tight text-ink">{isEs ? '¡Listo!' : "You're all set!"}</h3>
                <p className="mt-2 text-[14px] text-ink-3">{isEs ? 'Un asesor te contactará en menos de 2 horas.' : "An advisor will reach out within 2 hours."}</p>
                <a
                  href={`https://wa.me/529984045602?text=${isEs ? `Hola+soy+${encodeURIComponent(form.firstName)}+quiero+información+para+invertir+en+Cancún` : `Hi%2C+I%27m+${encodeURIComponent(form.firstName)}%2C+I+want+information+to+invest+in+Cancún`}`}
                  target="_blank" rel="noopener noreferrer"
                  className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#25D366] px-6 py-3 text-[12px] font-bold uppercase tracking-widest text-white"
                >
                  <MessageCircle size={14} /> {isEs ? 'Escribir por WhatsApp' : 'Message on WhatsApp'}
                </a>
              </div>
            ) : (
              <>
                <div className="mb-6">
                  <div className="flex items-center gap-2.5">
                    <Star size={16} strokeWidth={1.5} className="text-accent" />
                    <span className="h-display text-[20px] leading-[1.05] tracking-tight text-ink">{isEs ? 'Solicitar Información' : 'Request Information'}</span>
                  </div>
                  <p className="mt-1 text-[12px] text-ink-3">{isEs ? 'Asesor disponible en menos de 2 horas · Sin compromiso' : 'Advisor available within 2 hours · No commitment'}</p>
                </div>
                <form onSubmit={submit} className="space-y-4">
                  <div>
                    <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-[0.15em] text-ink-3">{isEs ? 'Nombre *' : 'Name *'}</label>
                    <div className="rounded-lg border border-line bg-bg-soft px-3.5 py-2.5">
                      <input required type="text" placeholder={isEs ? 'Tu nombre completo' : 'Your full name'}
                        className="w-full bg-transparent text-[14px] text-ink outline-none placeholder:text-ink-3"
                        value={form.firstName} onChange={(e) => set('firstName', e.target.value)} />
                    </div>
                  </div>
                  <div>
                    <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-[0.15em] text-ink-3">{isEs ? 'Teléfono / WhatsApp *' : 'Phone / WhatsApp *'}</label>
                    <div className="rounded-lg border border-line bg-bg-soft px-3.5 py-2.5">
                      <input required type="tel" placeholder={isEs ? '+52 818 000 0000' : '+1 000 000 0000'}
                        className="w-full bg-transparent text-[14px] text-ink outline-none placeholder:text-ink-3"
                        value={form.phone} onChange={(e) => set('phone', e.target.value)} />
                    </div>
                  </div>
                  <div>
                    <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-[0.15em] text-ink-3">{isEs ? '¿Desde qué ciudad inviertes?' : 'Which city are you investing from?'}</label>
                    <div className="grid grid-cols-3 gap-2">
                      {['Monterrey', 'CDMX', 'Guadalajara'].map((c) => (
                        <button key={c} type="button" onClick={() => set('ciudad', c)}
                          className={`rounded-lg border py-2.5 text-[11px] font-semibold transition-all ${form.ciudad === c ? 'border-ink bg-ink text-white' : 'border-line bg-bg text-ink-3 hover:border-ink-3'}`}>
                          {c}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-[0.15em] text-ink-3">{isEs ? '¿Qué plaza te interesa? *' : 'Which plaza are you interested in? *'}</label>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        { v: 'gardens',     label: 'Gardens',     sub: 'Desde $1.96 MDP' },
                        { v: 'long-island', label: 'Long Island', sub: 'Desde $2.65 MDP' },
                      ].map(({ v, label, sub }) => (
                        <button key={v} type="button" onClick={() => set('plaza', v)}
                          className={`flex flex-col items-center rounded-lg border py-3 text-center text-[12px] font-semibold transition-all ${form.plaza === v ? 'border-ink bg-ink text-white' : 'border-line bg-bg text-ink-3 hover:border-ink-3'}`}>
                          {label}
                          <span className={`mt-0.5 text-[10px] font-normal ${form.plaza === v ? 'text-white/70' : 'text-ink-3'}`}>{sub}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                  {err && <p className="rounded bg-red-50 px-3 py-2 text-[12px] text-red-700">{err}</p>}
                  <button type="submit" disabled={!valid || loading}
                    className="mt-2 w-full rounded-full bg-accent py-3.5 text-[12px] font-bold uppercase tracking-widest text-ink disabled:opacity-40 transition">
                    {loading ? (isEs ? 'Enviando…' : 'Sending…') : (isEs ? 'Solicitar Información' : 'Request Information')} {!loading && <ArrowRight size={13} strokeWidth={2} className="inline ml-1" />}
                  </button>
                  <p className="text-center text-[10.5px] text-ink-3">{isEs ? 'Tus datos están seguros. Sin spam. *Precio + IVA' : 'Your data is safe. No spam. *Price + VAT'}</p>
                </form>
              </>
            )}
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="bg-white py-16 md:py-24">
        <div className="container-wrap max-w-3xl">
          <div className="mb-10 text-center">
            <span className="eyebrow eyebrow-accent">{isEs ? '— Preguntas frecuentes' : '— Frequently asked questions'}</span>
            <h2 className="mt-4 h-display text-[clamp(28px,3.2vw,48px)] leading-[1.05] tracking-tight text-ink">
              {isEs ? 'Todo lo que necesitas saber para invertir en Cancún desde otra ciudad' : 'Everything you need to know to invest in Cancún from anywhere'}
            </h2>
          </div>
          <div>
            {FAQS.map(({ q, a }) => <FaqItem key={q} q={q} a={a} />)}
          </div>
        </div>
      </section>

      {/* ── CTA final ── */}
      <section className="bg-ink py-20 text-white">
        <div className="container-wrap text-center">
          <h2 className="h-display text-[clamp(28px,3.5vw,52px)] leading-[1.05] tracking-tight text-white">
            {isEs ? <>Tu próxima inversión está<br /><span className="text-accent">a 2 horas de avión</span></> : <>Your next investment is<br /><span className="text-accent">a 2-hour flight away</span></>}
          </h2>
          <p className="mt-4 text-[14px] text-white/60">
            {isEs ? 'Asesor disponible en menos de 2 horas · Videollamada sin compromiso' : 'Advisor available within 2 hours · No-commitment video call'}
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <button onClick={scrollToForm}
              className="inline-flex items-center gap-2 rounded-full bg-accent px-8 py-4 text-[12px] font-bold uppercase tracking-widest text-ink transition hover:brightness-95">
              {isEs ? 'Solicitar Información' : 'Request Information'} <ArrowRight size={14} strokeWidth={2} />
            </button>
            <a href={`https://wa.me/529984045602?text=${waMsg}`}
              target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-white/30 px-8 py-4 text-[12px] font-bold uppercase tracking-widest text-white transition hover:border-white/60">
              <MessageCircle size={14} /> WhatsApp
            </a>
          </div>
          <p className="mt-8 text-[12px] text-white/40">
            {isEs ? '¿Ya conoces nuestros proyectos?' : 'Already know our projects?'} → <Link href="/locales-comerciales-cancun" className="underline hover:text-white/60">{isEs ? 'Locales Comerciales en Cancún' : 'Commercial Spaces in Cancún'}</Link>
          </p>
        </div>
      </section>
    </>
  );
}
