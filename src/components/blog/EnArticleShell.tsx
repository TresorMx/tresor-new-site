import Image from 'next/image';
import Link from 'next/link';
import BlogCTA from '@/components/BlogCTA';

// Envoltura compartida de los artículos del blog en INGLÉS.
//
// Los 9 posts en español repiten inline el hero, el breadcrumb, el JSON-LD y
// el bloque de relacionados — ~120 líneas idénticas por archivo. Aquí eso vive
// una sola vez y cada artículo aporta solo su contenido y su configuración,
// que es lo que de verdad cambia.
//
// Tipografía: mismas clases que los posts en español (H2 copiado tal cual),
// para que las dos secciones del blog se vean como el mismo sitio.

const SITE = 'https://www.tresor.mx';

// Exportadas para que los artículos usen las MISMAS clases y no inventen
// tamaños nuevos (ver memoria de escala tipográfica del proyecto).
export const H2 = 'font-sans text-[clamp(24px,3.2vw,48px)] font-normal leading-[1.05] tracking-tight text-ink mt-12 mb-6';
export const P = 'text-ink-2 leading-relaxed mb-6';
export const LEAD = 'text-lg text-ink-2 leading-relaxed mb-8';

export interface EnFaq {
  q: string;
  a: string;
}

export interface EnRelated {
  slug: string;
  title: string;
  img: string;
}

export default function EnArticleShell({
  slug,
  title,
  h1,
  description,
  eyebrow,
  heroImage,
  heroAlt,
  dateIso,
  dateLabel,
  readTime,
  breadcrumbLabel,
  faqs,
  faqHeading = 'Frequently asked questions',
  related,
  cta,
  children,
}: {
  slug: string;
  title: string;
  h1: string;
  description: string;
  eyebrow: string;
  heroImage: string;
  heroAlt: string;
  dateIso: string;
  dateLabel: string;
  readTime: string;
  breadcrumbLabel: string;
  faqs: EnFaq[];
  faqHeading?: string;
  related: EnRelated[];
  cta: {
    eyebrow: string;
    title: string;
    subtitle: string;
    image: string;
    imageAlt: string;
    primaryHref: string;
    primaryLabel: string;
    whatsappMessage: string;
  };
  children: React.ReactNode;
}) {
  // Todo cuelga de /en/: estos artículos existen solo en inglés y la ruta sin
  // prefijo redirige aquí (ver el page.tsx de cada uno).
  const url = `${SITE}/en/blog/${slug}`;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Article',
        headline: title,
        description,
        inLanguage: 'en-US',
        datePublished: dateIso,
        dateModified: dateIso,
        author: { '@type': 'Organization', name: 'Tresor Real Estate', url: SITE },
        publisher: {
          '@type': 'Organization',
          name: 'Tresor Real Estate',
          logo: `${SITE}/logos/LogoTresor-ink.svg`,
        },
        image: heroImage.startsWith('http') ? heroImage : `${SITE}${heroImage}`,
        mainEntityOfPage: url,
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE}/en` },
          { '@type': 'ListItem', position: 2, name: 'Blog', item: `${SITE}/en/blog` },
          { '@type': 'ListItem', position: 3, name: breadcrumbLabel, item: url },
        ],
      },
      {
        '@type': 'FAQPage',
        mainEntity: faqs.map(({ q, a }) => ({
          '@type': 'Question',
          name: q,
          acceptedAnswer: { '@type': 'Answer', text: a },
        })),
      },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* Hero */}
      <div data-nav="dark" className="relative -mt-[72px] h-[55vh] min-h-[400px] overflow-hidden">
        <Image src={heroImage} alt={heroAlt} fill priority className="object-cover" sizes="100vw" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/40 to-transparent" />
        <div className="absolute inset-0 flex flex-col justify-end px-6 pb-10 pt-[104px]">
          <div className="container-wrap">
            <p className="eyebrow eyebrow-accent mb-3">{eyebrow}</p>
            <h1 className="h-display text-[clamp(28px,4.5vw,52px)] text-white max-w-3xl leading-tight">{h1}</h1>
            <div className="flex items-center gap-4 mt-4 text-white/60 text-sm">
              <span>{dateLabel}</span>
              <span>·</span>
              <span>{readTime} read</span>
            </div>
          </div>
        </div>
      </div>

      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="py-4 px-6 border-b border-line">
        <div className="container-wrap">
          <ol className="flex items-center gap-2 text-sm text-ink-3">
            <li><Link href="/en" className="hover:text-accent transition-colors">Home</Link></li>
            <li>/</li>
            <li><Link href="/en/blog" className="hover:text-accent transition-colors">Blog</Link></li>
            <li>/</li>
            <li className="text-ink truncate max-w-[240px] md:max-w-none">{breadcrumbLabel}</li>
          </ol>
        </div>
      </nav>

      {/* Content */}
      <article className="py-16 px-6">
        <div className="max-w-3xl mx-auto">
          {children}

          {faqs.length > 0 && (
            <>
              <h2 className={H2}>{faqHeading}</h2>
              <div className="space-y-6 mb-4">
                {faqs.map((item) => (
                  <div key={item.q} className="border-l-2 border-accent/40 pl-5">
                    <h3 className="font-semibold text-ink mb-2">{item.q}</h3>
                    <p className="text-ink-2 text-sm leading-relaxed">{item.a}</p>
                  </div>
                ))}
              </div>
            </>
          )}

          {related.length > 0 && (
            <>
              <h2 className="font-sans text-[clamp(20px,2.6vw,32px)] font-normal leading-[1.05] tracking-tight text-ink mt-16 mb-6">
                Related articles
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-4">
                {related.map((rel) => (
                  <Link
                    key={rel.slug}
                    href={`/en/blog/${rel.slug}`}
                    className="group rounded-xl overflow-hidden border border-line hover:shadow-md transition-shadow"
                  >
                    <div className="relative aspect-video">
                      <Image
                        src={rel.img}
                        alt={rel.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        sizes="300px"
                      />
                    </div>
                    <p className="p-4 text-sm font-semibold text-ink group-hover:text-accent transition-colors leading-snug">
                      {rel.title}
                    </p>
                  </Link>
                ))}
              </div>
            </>
          )}
        </div>
      </article>

      <div className="px-6">
        <div className="max-w-3xl mx-auto">
          <BlogCTA {...cta} />
        </div>
      </div>
    </>
  );
}
