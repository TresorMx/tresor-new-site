import { Link } from '@/navigation';
import { ArrowRight, Landmark, FileSignature, KeyRound, Search } from 'lucide-react';
import CategoryHero from '@/components/category/CategoryHero';
import CategoryGridSection from '@/components/category/CategoryGridSection';
import type { Development } from '@/lib/developments';

// Cuerpo compartido de las páginas de contenido en inglés que atacan
// "condos for sale in {ciudad}" (/en/condos-for-sale-cancun y
// /en/condos-for-sale-puerto-cancun).
//
// A diferencia de las landings de pauta (/luxury-condos-puerto-cancun), estas
// SÍ llevan header, footer y enlaces internos: son las que tienen que rankear
// en orgánico, y una página huérfana no recibe autoridad de ningún lado.
//
// La sección "how foreigners buy" vive aquí y no en cada página porque es
// idéntica en las dos — es justo el contenido que nos diferencia de un portal
// y el que responde la objeción #1 del comprador extranjero.
//
// Tipografía: se copian las clases exactas del home (ver page.tsx y
// DevelopmentCard.tsx), sin inventar clamp() nuevos. Los títulos usan el
// patrón "lead sólido + remate en text-ink-3" — nunca amarillo en texto de
// heading; el acento solo va en íconos y hover.

const SITE = 'https://www.tresor.mx';

export interface CondosFaq {
  q: string;
  a: string;
}

export interface CondosRelatedLink {
  href: string;
  label: string;
  sub: string;
}

// Pasos del proceso de compra para un extranjero. Son hechos generales y
// bien establecidos del marco legal mexicano; el copy remata siempre
// recomendando validar con notario/abogado propio, porque aquí no se da
// asesoría legal ni fiscal.
const BUYING_STEPS = [
  {
    icon: Search,
    title: 'Choose the property',
    body: 'We show you live availability, floor plans and payment schedules directly from the developer — no listing is shown if it is already sold.',
  },
  {
    icon: FileSignature,
    title: 'Offer and deposit',
    body: 'You sign a purchase agreement with the developer and place a deposit that takes the unit off the market while the paperwork moves forward.',
  },
  {
    icon: Landmark,
    title: 'Set up your bank trust',
    body: 'Cancún sits inside the coastal "restricted zone", so foreign buyers typically hold title through a fideicomiso — a renewable 50-year bank trust — or through a Mexican corporation. It is a standard route that has been in place for decades.',
  },
  {
    icon: KeyRound,
    title: 'Closing before a notary',
    body: 'In Mexico the closing is executed by a Notario Público, a state-appointed attorney who verifies title and registers the deed. Budget for closing costs on top of the purchase price, and review the final structure with your own legal and tax advisors.',
  },
];

export default function CondosSeoPage({
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
  faqs: CondosFaq[];
  relatedLinks: CondosRelatedLink[];
  breadcrumbCity: string;
  breadcrumbCityHref: string;
}) {
  const pageUrl = `${SITE}/en${canonicalPath}`;

  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      name: h1,
      description: heroSubtitle,
      url: pageUrl,
      inLanguage: 'en-US',
      // Las fichas que esta página lista — le dice a Google exactamente qué
      // inventario respalda el contenido, y refuerza el enlace interno.
      mainEntity: {
        '@type': 'ItemList',
        numberOfItems: developments.length,
        itemListElement: developments.map((d, i) => ({
          '@type': 'ListItem',
          position: i + 1,
          name: d.name,
          url: `${SITE}/en${d.href}`,
        })),
      },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE}/en` },
        { '@type': 'ListItem', position: 2, name: breadcrumbCity, item: `${SITE}/en${breadcrumbCityHref}` },
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
        eyebrow="— Properties"
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

      {/* ── Por qué comprar aquí ── */}
      <section className="bg-white py-20 md:py-28">
        <div className="container-wrap max-w-3xl">
          <span className="eyebrow eyebrow-accent font-bold">— The market</span>
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

      {/* ── Cómo compra un extranjero ── */}
      <section className="bg-bg-soft py-20 md:py-28">
        <div className="container-wrap">
          <div className="max-w-3xl">
            <span className="eyebrow eyebrow-accent font-bold">— The process</span>
            <h2 className="mt-4 font-sans text-[clamp(24px,3.2vw,48px)] font-normal leading-[1.05] tracking-tight text-ink">
              How foreigners buy <span className="text-ink-3">property in Mexico</span>
            </h2>
            <p className="mt-6 text-[15px] font-light leading-relaxed text-ink-2">
              Buying in Cancún as a non-resident is a well-established process — but it works
              differently than it does in the US or Canada. This is the short version of what to
              expect.
            </p>
          </div>

          <ol className="mt-12 grid gap-4 md:grid-cols-2 md:gap-5">
            {BUYING_STEPS.map(({ icon: Icon, title, body }, i) => (
              <li key={title} className="rounded-[26px] bg-white p-7 md:p-8">
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent/12 text-ink">
                    <Icon size={18} strokeWidth={1.7} />
                  </span>
                  <span className="text-[11px] uppercase tracking-caps text-ink-3">Step {i + 1}</span>
                </div>
                <h3 className="mt-5 font-sans text-[clamp(18px,1.8vw,28px)] font-medium leading-[1.15] text-ink">
                  {title}
                </h3>
                <p className="mt-3 text-[15px] font-light leading-relaxed text-ink-2">{body}</p>
              </li>
            ))}
          </ol>

          <p className="mt-8 max-w-3xl text-[13px] font-light leading-relaxed text-ink-3">
            This is general information, not legal or tax advice. Every purchase is different —
            always review the structure, costs and timing with your own attorney and a licensed
            Mexican notary before signing.
          </p>
        </div>
      </section>

      {/* ── FAQ ──
          <details>/<summary> en vez de un acordeón en React: se renderiza en
          el servidor, Google lo lee completo sin ejecutar JS y funciona aunque
          el JS falle. */}
      <section className="bg-white py-20 md:py-28">
        <div className="container-wrap max-w-3xl">
          <span className="eyebrow eyebrow-accent font-bold">— Frequently asked</span>
          <h2 className="mt-4 font-sans text-[clamp(24px,3.2vw,48px)] font-normal leading-[1.05] tracking-tight text-ink">
            Questions from <span className="text-ink-3">foreign buyers</span>
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
          El punto no es decorativo: reparte autoridad hacia las fichas y las
          otras landings en inglés, que es justo lo que le faltaba a la landing
          de pauta para poder competir en orgánico. */}
      <section className="bg-bg-soft py-20 md:py-28">
        <div className="container-wrap">
          <span className="eyebrow eyebrow-accent font-bold">— Keep exploring</span>
          <h2 className="mt-4 font-sans text-[clamp(24px,3.2vw,48px)] font-normal leading-[1.05] tracking-tight text-ink">
            Other places <span className="text-ink-3">to buy in the Mexican Caribbean</span>
          </h2>

          <div className="mt-10 grid gap-4 md:grid-cols-3 md:gap-5">
            {relatedLinks.map(({ href, label, sub }) => (
              <Link
                key={href}
                href={href}
                className="group rounded-[26px] bg-white p-7 transition-colors hover:bg-white/70 md:p-8"
              >
                <h3 className="font-sans text-[clamp(18px,1.8vw,28px)] font-medium leading-[1.15] text-ink">
                  {label}
                </h3>
                <p className="mt-2 text-[15px] font-light leading-relaxed text-ink-2">{sub}</p>
                <span className="mt-5 inline-flex items-center gap-2 text-[13px] font-semibold text-ink transition-colors group-hover:text-accent">
                  View properties <ArrowRight size={14} strokeWidth={2.2} />
                </span>
              </Link>
            ))}
          </div>

          <div className="mt-12 flex flex-wrap items-center gap-4">
            <Link href="/agenda" className="btn btn-lg border-0 bg-ink text-white hover:bg-ink/85">
              Schedule a private tour <ArrowRight size={14} strokeWidth={2.2} />
            </Link>
            <a
              href="https://wa.me/529984045602"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-lg btn-outline font-semibold"
            >
              Talk to an advisor on WhatsApp
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
