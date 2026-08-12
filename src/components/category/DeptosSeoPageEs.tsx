import { Link } from '@/navigation';
import { ArrowRight, MapPin, Wallet, FileSignature, KeyRound } from 'lucide-react';
import CategoryHero from '@/components/category/CategoryHero';
import CategoryGridSection from '@/components/category/CategoryGridSection';
import type { Development } from '@/lib/developments';

// Cuerpo compartido de las páginas de contenido en ESPAÑOL que atacan
// "departamentos en venta en {ciudad}".
//
// Es hermano de CondosSeoPage (inglés), no una traducción: el comprador
// mexicano no necesita que le expliquen el fideicomiso — necesita zonas,
// preventa vs. entrega inmediata, enganche y escrituración. Se mantiene
// aparte a propósito para no tocar CondosSeoPage, que hoy está rankeando en
// primera página y no conviene arriesgar.
//
// Tipografía: se copian las clases exactas del home, sin inventar clamp()
// nuevos. Títulos con el patrón "lead sólido + remate en text-ink-3" — nunca
// amarillo en texto de heading; el acento solo va en íconos y hover.

const SITE = 'https://www.tresor.mx';

export interface DeptosFaq {
  q: string;
  a: string;
}

export interface DeptosZona {
  nombre: string;
  descripcion: string;
}

export interface DeptosRelatedLink {
  href: string;
  label: string;
  sub: string;
}

// Proceso de compra para un comprador nacional. Son hechos generales del
// proceso inmobiliario en México; el copy remata siempre recomendando
// validar con notario propio, porque aquí no se da asesoría legal ni fiscal.
const PASOS_COMPRA = [
  {
    icon: MapPin,
    title: 'Eliges el departamento',
    body: 'Te mostramos disponibilidad real, planos y niveles directo del desarrollador. Si una unidad ya se vendió, no aparece — el inventario cambia cada semana.',
  },
  {
    icon: Wallet,
    title: 'Apartas la unidad',
    body: 'Un monto de apartado reserva la unidad a tu nombre mientras se formaliza el contrato. En los desarrollos de nuestro portafolio suele ir desde $25,000 MXN, y se descuenta del enganche.',
  },
  {
    icon: FileSignature,
    title: 'Contrato y plan de pagos',
    body: 'Firmas contrato con el desarrollador y defines el esquema: enganche y mensualidades hasta la entrega, normalmente sin intereses en preventa. En entrega inmediata el esquema es distinto porque el inmueble ya existe.',
  },
  {
    icon: KeyRound,
    title: 'Escrituración y entrega',
    body: 'La escritura se firma ante Notario Público, que verifica el título y lo inscribe en el Registro Público de la Propiedad. Además del precio hay que presupuestar gastos de escrituración — pide el estimado por escrito antes de firmar.',
  },
];

export default function DeptosSeoPageEs({
  canonicalPath,
  heroImage,
  heroImageAlt,
  h1,
  heroSubtitle,
  gridEyebrow,
  gridTitle,
  gridTitleMuted,
  developments,
  introTitle,
  introTitleMuted,
  introBody,
  zonas,
  zonasTitle,
  zonasTitleMuted,
  faqs,
  relatedLinks,
  breadcrumbCity,
  breadcrumbCityHref,
}: {
  canonicalPath: string;
  heroImage: string;
  heroImageAlt: string;
  h1: string;
  heroSubtitle: string;
  gridEyebrow: string;
  gridTitle: string;
  gridTitleMuted: string;
  developments: Development[];
  introTitle: string;
  introTitleMuted: string;
  introBody: string[];
  zonas: DeptosZona[];
  zonasTitle: string;
  zonasTitleMuted: string;
  faqs: DeptosFaq[];
  relatedLinks: DeptosRelatedLink[];
  breadcrumbCity: string;
  breadcrumbCityHref: string;
}) {
  const pageUrl = `${SITE}${canonicalPath}`;

  // Las fichas que esta página lista — le dice a Google exactamente qué
  // inventario respalda el contenido, y refuerza el enlace interno.
  //
  // Solo los desarrollos con ficha real: los que aún no la tienen llevan
  // href '#' en el catálogo (hoy Bardenna en Cancún) y emitirlos generaría
  // una URL basura "https://www.tresor.mx#" que Google lee como enlace roto.
  // Si no queda ninguno, el ItemList se omite entero — declarar
  // "numberOfItems: 0" le diría a Google que la colección está vacía.
  const listed = developments.filter((d) => d.href !== '#');

  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      name: h1,
      description: heroSubtitle,
      url: pageUrl,
      inLanguage: 'es-MX',
      ...(listed.length > 0 && {
        mainEntity: {
          '@type': 'ItemList',
          numberOfItems: listed.length,
          itemListElement: listed.map((d, i) => ({
            '@type': 'ListItem',
            position: i + 1,
            name: d.name,
            url: `${SITE}${d.href}`,
          })),
        },
      }),
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Inicio', item: SITE },
        { '@type': 'ListItem', position: 2, name: breadcrumbCity, item: `${SITE}${breadcrumbCityHref}` },
        { '@type': 'ListItem', position: 3, name: h1, item: pageUrl },
      ],
    },
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: faqs.map(({ q, a }) => ({
        '@type': 'Question',
        name: q,
        acceptedAnswer: { '@type': 'Answer', text: a },
      })),
    },
  ];

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <CategoryHero
        image={heroImage}
        imageAlt={heroImageAlt}
        eyebrow="— Propiedades"
        title={h1}
        subtitle={heroSubtitle}
      />

      {/* Inventario real — es lo que convierte esto en una página de listados
          y no en un artículo suelto. */}
      <CategoryGridSection
        eyebrow={gridEyebrow}
        title={<>{gridTitle} <span className="text-ink-3">{gridTitleMuted}</span></>}
        developments={developments}
        showDeveloperFilter={false}
      />

      {/* ── El mercado ── */}
      <section className="bg-white py-20 md:py-28">
        <div className="container-wrap max-w-3xl">
          <span className="eyebrow eyebrow-accent font-bold">— El mercado</span>
          <h2 className="mt-4 font-sans text-[clamp(24px,3.2vw,48px)] font-normal leading-[1.05] tracking-tight text-ink">
            {introTitle} <span className="text-ink-3">{introTitleMuted}</span>
          </h2>
          <div className="mt-7 space-y-5">
            {introBody.map((p) => (
              <p key={p.slice(0, 40)} className="text-[15px] font-light leading-relaxed text-ink-2">
                {p}
              </p>
            ))}
          </div>
        </div>
      </section>

      {/* ── Zonas ──
          El bloque que un portal genérico no da: qué esperar de cada zona.
          Es también donde entran de forma natural los nombres de zona que la
          gente busca junto con la keyword principal. */}
      <section className="bg-bg-soft py-20 md:py-28">
        <div className="container-wrap">
          <div className="max-w-3xl">
            <span className="eyebrow eyebrow-accent font-bold">— Las zonas</span>
            <h2 className="mt-4 font-sans text-[clamp(24px,3.2vw,48px)] font-normal leading-[1.05] tracking-tight text-ink">
              {zonasTitle} <span className="text-ink-3">{zonasTitleMuted}</span>
            </h2>
          </div>

          <div className="mt-12 grid gap-4 md:grid-cols-2 md:gap-5">
            {zonas.map(({ nombre, descripcion }) => (
              <div key={nombre} className="rounded-[26px] bg-white p-7 md:p-8">
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent/12 text-ink">
                    <MapPin size={18} strokeWidth={1.7} />
                  </span>
                </div>
                <h3 className="mt-5 font-sans text-[clamp(18px,1.8vw,28px)] font-medium leading-[1.15] text-ink">
                  {nombre}
                </h3>
                <p className="mt-3 text-[15px] font-light leading-relaxed text-ink-2">{descripcion}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Cómo se compra ── */}
      <section className="bg-white py-20 md:py-28">
        <div className="container-wrap">
          <div className="max-w-3xl">
            <span className="eyebrow eyebrow-accent font-bold">— El proceso</span>
            <h2 className="mt-4 font-sans text-[clamp(24px,3.2vw,48px)] font-normal leading-[1.05] tracking-tight text-ink">
              Cómo se compra <span className="text-ink-3">un departamento en preventa</span>
            </h2>
            <p className="mt-6 text-[15px] font-light leading-relaxed text-ink-2">
              Comprar en preventa no es lo mismo que comprar un inmueble terminado. Esta es la
              versión corta de cómo funciona el proceso, paso por paso.
            </p>
          </div>

          <ol className="mt-12 grid gap-4 md:grid-cols-2 md:gap-5">
            {PASOS_COMPRA.map(({ icon: Icon, title, body }, i) => (
              <li key={title} className="rounded-[26px] bg-bg-soft p-7 md:p-8">
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent/12 text-ink">
                    <Icon size={18} strokeWidth={1.7} />
                  </span>
                  <span className="text-[11px] uppercase tracking-caps text-ink-3">Paso {i + 1}</span>
                </div>
                <h3 className="mt-5 font-sans text-[clamp(18px,1.8vw,28px)] font-medium leading-[1.15] text-ink">
                  {title}
                </h3>
                <p className="mt-3 text-[15px] font-light leading-relaxed text-ink-2">{body}</p>
              </li>
            ))}
          </ol>

          <p className="mt-8 max-w-3xl text-[13px] font-light leading-relaxed text-ink-3">
            Esta es información general, no asesoría legal ni fiscal. Cada compra es distinta —
            revisa siempre el contrato, los costos y los tiempos con tu propio abogado y con un
            notario público antes de firmar.
          </p>

          {/* Enlace al cluster de guías: cierra el circuito en los dos sentidos
              y le da al lector la versión larga de lo que este bloque resume. */}
          <div className="mt-10 flex flex-wrap gap-3">
            {[
              { href: '/blog/guia-comprar-en-preventa-cancun', label: 'Guía completa: comprar en preventa' },
              { href: '/blog/donde-comprar-departamento-en-cancun', label: '¿En qué zona comprar?' },
              { href: '/blog/desarrollos-inmobiliarios-en-cancun', label: 'Desarrollos activos en Cancún' },
            ].map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className="inline-flex items-center gap-2 rounded-full border border-line bg-white px-4 py-2.5 text-[13px] font-medium text-ink transition-colors hover:border-ink/25 hover:text-accent"
              >
                {label} <ArrowRight size={13} strokeWidth={2.2} />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ──
          <details>/<summary> en vez de un acordeón en React: se renderiza en
          el servidor, Google lo lee completo sin ejecutar JS y funciona aunque
          el JS falle. */}
      <section className="bg-bg-soft py-20 md:py-28">
        <div className="container-wrap max-w-3xl">
          <span className="eyebrow eyebrow-accent font-bold">— Preguntas frecuentes</span>
          <h2 className="mt-4 font-sans text-[clamp(24px,3.2vw,48px)] font-normal leading-[1.05] tracking-tight text-ink">
            Lo que más <span className="text-ink-3">nos preguntan</span>
          </h2>
          <div className="mt-10">
            {faqs.map(({ q, a }) => (
              <details key={q} className="group border-b border-line">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-5 text-[15px] font-semibold text-ink [&::-webkit-details-marker]:hidden">
                  {q}
                  <span className="shrink-0 text-ink-3 transition-transform group-open:rotate-45">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                      <path d="M8 3v10M3 8h10" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                    </svg>
                  </span>
                </summary>
                <p className="pb-5 text-[14px] font-light leading-relaxed text-ink-3">{a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ── Enlaces internos ──
          Reparte autoridad hacia las fichas y las otras landings. */}
      <section className="bg-white py-20 md:py-28">
        <div className="container-wrap">
          <span className="eyebrow eyebrow-accent font-bold">— Sigue explorando</span>
          <h2 className="mt-4 font-sans text-[clamp(24px,3.2vw,48px)] font-normal leading-[1.05] tracking-tight text-ink">
            Otras opciones <span className="text-ink-3">en el Caribe Mexicano</span>
          </h2>

          <div className="mt-10 grid gap-4 md:grid-cols-3 md:gap-5">
            {relatedLinks.map(({ href, label, sub }) => (
              <Link
                key={href}
                href={href}
                className="group rounded-[26px] bg-bg-soft p-7 transition-colors hover:bg-bg-soft/70 md:p-8"
              >
                <h3 className="font-sans text-[clamp(18px,1.8vw,28px)] font-medium leading-[1.15] text-ink">
                  {label}
                </h3>
                <p className="mt-2 text-[15px] font-light leading-relaxed text-ink-2">{sub}</p>
                <span className="mt-5 inline-flex items-center gap-2 text-[13px] font-semibold text-ink transition-colors group-hover:text-accent">
                  Ver propiedades <ArrowRight size={14} strokeWidth={2.2} />
                </span>
              </Link>
            ))}
          </div>

          <div className="mt-12 flex flex-wrap items-center gap-4">
            <Link href="/agenda" className="btn btn-lg border-0 bg-ink text-white hover:bg-ink/85">
              Agenda una visita privada <ArrowRight size={14} strokeWidth={2.2} />
            </Link>
            <a
              href="https://wa.me/529984045602"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-lg btn-outline font-semibold"
            >
              Hablar con un asesor por WhatsApp
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
