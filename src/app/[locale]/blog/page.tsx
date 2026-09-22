import type { Metadata } from 'next';
import Image from 'next/image';
import BlogArticlesGrid from '@/components/blog/BlogArticlesGrid';
import { articlesEs, articlesEn } from '@/lib/blogArticles';

const META = {
  es: {
    title: 'Blog Inmobiliario de Cancún y la Riviera Maya | Tresor Real Estate',
    description:
      'Análisis del mercado inmobiliario en Cancún, Puerto Cancún, Playa del Carmen y Tulum: precios por zona, guías de preventa y qué revisar antes de comprar.',
    keywords: [
      'blog inmobiliario cancun',
      'mercado inmobiliario cancun',
      'inversión inmobiliaria riviera maya',
      'guia comprar propiedad cancun',
      'precios departamentos cancun por zona',
      'comprar en preventa cancun',
    ],
    ogTitle: 'Blog Inmobiliario de Cancún y la Riviera Maya — Tresor Real Estate',
    ogDescription:
      'Precios por zona, guías de preventa y análisis del mercado inmobiliario en Cancún, Puerto Cancún, Playa del Carmen y Tulum.',
  },
  en: {
    title: 'Buying Property in Cancún: Guides for Foreign Buyers | Tresor Real Estate',
    description:
      'Plain-English guides to buying real estate in Cancún and the Riviera Maya: how foreigners take title, what closing costs to budget for, which areas fit which buyer, and pre-construction vs. move-in ready.',
    keywords: [
      'buying property in cancun',
      'cancun real estate guide',
      'buying property in mexico as a foreigner',
      'fideicomiso mexico',
      'closing costs mexico real estate',
      'best areas to buy in cancun',
    ],
    ogTitle: 'Buying Property in Cancún — Guides for Foreign Buyers',
    ogDescription:
      'How foreigners take title in Mexico, what closing costs to budget for, and which part of Cancún actually fits what you want.',
  },
} as const;

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const isEs = locale !== 'en';
  const m = isEs ? META.es : META.en;
  const url = isEs ? 'https://www.tresor.mx/blog' : 'https://www.tresor.mx/en/blog';
  return {
    // `absolute` es obligatorio aquí: el layout del blog aplica la plantilla
    // '%s | Tresor Real Estate Blog', y sin esto el título salía con la marca
    // repetida tres veces y pasado de 100 caracteres (se truncaba en Google).
    title: { absolute: m.title },
    description: m.description,
    keywords: [...m.keywords],
    alternates: {
      canonical: url,
      languages: {
        es: 'https://www.tresor.mx/blog',
        en: 'https://www.tresor.mx/en/blog',
        'x-default': 'https://www.tresor.mx/blog',
      },
    },
    openGraph: {
      title: m.ogTitle,
      description: m.ogDescription,
      url,
      locale: isEs ? 'es_MX' : 'en_US',
      images: [{ url: '/ogfinal.jpg', width: 1200, height: 630 }],
    },
  };
}


function buildJsonLd(isEs: boolean, articles: typeof articlesEs | typeof articlesEn) {
  const base = isEs ? 'https://www.tresor.mx/blog' : 'https://www.tresor.mx/en/blog';
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Blog',
        '@id': `${base}#blog`,
        name: isEs
          ? 'Blog Inmobiliario de Cancún y la Riviera Maya'
          : 'Buying Property in Cancún — Guides for Foreign Buyers',
        description: isEs
          ? 'Análisis del mercado inmobiliario en Cancún, Puerto Cancún, Playa del Carmen y Tulum: precios por zona, guías de preventa y qué revisar antes de comprar.'
          : 'Plain-English guides to buying real estate in Cancún and the Riviera Maya: taking title as a foreigner, closing costs, areas and buying stages.',
        url: base,
        inLanguage: isEs ? 'es-MX' : 'en-US',
        publisher: {
          '@type': 'Organization',
          name: 'Tresor Real Estate',
          url: 'https://www.tresor.mx',
          logo: 'https://www.tresor.mx/logos/LogoTresor-ink.svg',
        },
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: isEs ? 'Inicio' : 'Home', item: isEs ? 'https://www.tresor.mx' : 'https://www.tresor.mx/en' },
          { '@type': 'ListItem', position: 2, name: 'Blog', item: base },
        ],
      },
      {
        '@type': 'ItemList',
        name: isEs
          ? 'Artículos del blog inmobiliario de Tresor Real Estate'
          : 'Cancún real estate guides by Tresor Real Estate',
        url: base,
        itemListElement: articles.map((a, i) => ({
          '@type': 'ListItem',
          position: i + 1,
          url: `${base}/${a.slug}`,
          name: a.title,
        })),
      },
    ],
  };
}

export default async function BlogPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const isEs = locale !== 'en';
  const articles = isEs ? articlesEs : articlesEn;
  const jsonLd = buildJsonLd(isEs, articles);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* ═════ HERO ═════ */}
      <section
        data-nav="dark"
        className="relative -mt-[72px] overflow-hidden bg-bg-deep text-bg"
        style={{ height: 'calc(100svh - 104px - 72px)', minHeight: '480px' }}
      >
        <div className="absolute inset-0 animate-hero-zoom">
          <Image
            src="/desarrollos/Vellmari/ENTREGAFINAL_CADU_VELMARI_AEREA01.jpg"
            alt={isEs
              ? 'Vista aérea de Puerto Cancún — marina, campo de golf y el mar Caribe'
              : 'Aerial view of Puerto Cancún — marina, golf course and the Caribbean Sea'}
            fill
            priority
            sizes="100vw"
            className="scale-105 object-cover"
          />
        </div>
        <div className="absolute inset-0 bg-black/55" />
        <div className="relative z-10 flex h-full flex-col items-center justify-center px-6 pt-[72px] text-center">
          <span className="eyebrow eyebrow-accent font-bold">
            {isEs ? '— Análisis y guías' : '— Guides and analysis'}
          </span>
          <h1 className="mt-5 h-display max-w-4xl text-[clamp(38px,6.4vw,80px)] text-white">
            {isEs ? (
              <>El mercado inmobiliario de Cancún, <span className="text-white/45">explicado</span></>
            ) : (
              <>Buying property in Cancún, <span className="text-white/45">explained</span></>
            )}
          </h1>
          <p className="mt-6 max-w-xl text-[15px] font-normal leading-relaxed text-white/75">
            {isEs
              ? 'Precios reales por zona, guías de preventa y análisis sin humo — para que compares con criterio antes de comprar en Cancún, Puerto Cancún, Playa del Carmen o Tulum.'
              : 'How foreigners take title, what closing costs to budget for and which area actually fits you — straight answers, so you can compare properly before you buy.'}
          </p>
        </div>
      </section>

      <BlogArticlesGrid articles={articles} basePath={isEs ? '/blog' : '/en/blog'} />
    </>
  );
}
