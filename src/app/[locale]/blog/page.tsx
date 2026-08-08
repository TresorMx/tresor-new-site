import type { Metadata } from 'next';
import Image from 'next/image';
import BlogArticlesGrid from '@/components/blog/BlogArticlesGrid';

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

const articlesEs = [
  {
    slug: 'terrenos-en-venta-cancun',
    title: 'Terrenos en Venta en Cancún: Qué Revisar Antes de Comprar (2026)',
    description:
      'Uso de suelo, factibilidad de servicios y escrituración: lo que hay que revisar antes de comprar un terreno en Cancún — con Zienna, sobre Av. Huayacán, como caso real.',
    image: '/desarrollos/zienna/CASETA_ZIENNA.jpg',
    readTime: '8 min',
    date: '7 de agosto de 2026',
  },
  {
    slug: 'vivir-en-puerto-cancun',
    title: 'Vivir en Puerto Cancún: Guía Completa de la Zona Más Exclusiva de Cancún (2026)',
    description:
      'Qué es Puerto Cancún, cómo es vivir dentro de sus 327 hectáreas con marina privada y campo de golf, cuánto cuesta entrar y qué residencias hay disponibles hoy.',
    image: '/desarrollos/Vellmari/ENTREGAFINAL_CADU_VELMARI_AEREA01.jpg',
    readTime: '10 min',
    date: '24 de julio de 2026',
  },
  {
    slug: 'donde-comprar-departamento-en-cancun',
    title: 'Zona Hotelera vs. Puerto Cancún vs. Av. Huayacán: ¿Dónde Comprar Departamento en Cancún?',
    description:
      'Comparamos las tres zonas donde hoy se concentra la oferta de departamentos en Cancún: precios, perfil de comprador, plusvalía y desarrollos activos en cada una.',
    image: '/desarrollos/villalta/portada3.jpg',
    readTime: '9 min',
    date: '19 de julio de 2026',
  },
  {
    slug: 'desarrollos-inmobiliarios-en-cancun',
    title: 'Desarrollos Inmobiliarios en Cancún 2026: Guía Completa y Proyectos Destacados',
    description:
      'El mapa completo de los desarrollos inmobiliarios más relevantes de Cancún: zonas, tipos de proyecto y el portafolio activo de Tresor Real Estate.',
    image: '/renders/long-island/01.jpg',
    readTime: '10 min',
    date: '18 de julio de 2026',
  },
  {
    slug: 'como-invertir-en-locales-comerciales-en-cancun',
    title: 'Cómo Invertir en Locales Comerciales en Cancún: Guía Completa 2026',
    description:
      'Todo lo que necesitas saber para invertir en locales comerciales en Cancún: desde elegir la ubicación correcta hasta entender el retorno de inversión.',
    image: '/blog/AdobeStock_791905652.jpeg',
    readTime: '8 min',
    date: '23 de junio de 2026',
  },
  {
    slug: 'cuanto-cuesta-un-local-comercial-en-cancun',
    title: '¿Cuánto Cuesta un Local Comercial en Cancún en 2026?',
    description:
      'Análisis detallado de precios por zona, m² y tipo de local en Cancún. Conoce el rango actual del mercado y qué factores influyen en el precio.',
    image: '/blog/AdobeStock_804358854.jpeg',
    readTime: '7 min',
    date: '10 de junio de 2026',
  },
  {
    slug: 'mejores-zonas-para-negocio-en-cancun',
    title: 'Las Mejores Zonas para Poner un Negocio en Cancún',
    description:
      'Comparativa de las principales zonas comerciales de Cancún: tráfico peatonal, tipo de cliente, precios y potencial de crecimiento.',
    image: '/blog/AdobeStock_838554951.jpeg',
    readTime: '7 min',
    date: '20 de mayo de 2026',
  },
  {
    slug: 'local-comercial-vs-departamento-cancun',
    title: 'Local Comercial vs Departamento en Cancún: ¿Qué Conviene Más como Inversión?',
    description:
      'Comparamos rendimientos, riesgos, plusvalía y flujo de caja entre locales comerciales y departamentos en Cancún para que tomes la mejor decisión.',
    image: '/blog/AdobeStock_862766615.jpeg',
    readTime: '7 min',
    date: '15 de abril de 2026',
  },
  {
    slug: 'guia-comprar-en-preventa-cancun',
    title: 'Guía para Comprar en Preventa en Cancún: Todo lo que Debes Saber',
    description:
      'Ventajas, riesgos y pasos para comprar un local comercial en preventa en Cancún. Incluye checklist y preguntas clave que debes hacerle al desarrollador.',
    image: '/blog/AdobeStock_887006964.jpeg',
    readTime: '7 min',
    date: '3 de marzo de 2026',
  },
  {
    slug: 'invertir-en-cancun-desde-monterrey-cdmx',
    title: 'Por Qué Invertir en Cancún desde Monterrey, CDMX o Guadalajara',
    description:
      'Si buscas rendimientos mayores que en tu ciudad, Cancún ofrece locales comerciales desde .96 MDP con plusvalía de 10–15% anual y proceso 100% remoto.',
    image: '/blog/AdobeStock_841077811.jpeg',
    readTime: '8 min',
    date: '23 de junio de 2026',
  },
];


// Artículos en INGLÉS. Viven en /en/blog/{slug} y su ruta sin prefijo
// redirige ahí (ver el page.tsx de cada uno) — igual que /condos-for-sale-*.
// No son traducciones de los de español: atacan las búsquedas del comprador
// extranjero, que son otras.
const articlesEn = [
  {
    slug: 'buying-property-in-mexico-as-a-foreigner',
    title: 'Can Foreigners Buy Property in Mexico? The Complete 2026 Guide',
    description:
      'Yes — and here is exactly how. The restricted zone, the fideicomiso bank trust, what a Mexican notary actually does, and the step-by-step process for buying a condo in Cancún.',
    image: '/desarrollos/Blume/BLUME-Drone-1.jpg',
    readTime: '9 min',
    date: 'August 6, 2026',
  },
  {
    slug: 'best-areas-to-buy-in-cancun',
    title: 'The Best Areas to Buy in Cancún: An Honest Comparison (2026)',
    description:
      'Puerto Cancún, the Hotel Zone, Av. Huayacán, Vía Cumbres and Lausana compared on price, buyer profile and trade-offs.',
    image: '/desarrollos/villalta/portada3.jpg',
    readTime: '8 min',
    date: 'August 6, 2026',
  },
  {
    slug: 'closing-costs-when-buying-property-in-mexico',
    title: 'Closing Costs When Buying Property in Mexico: What to Budget For',
    description:
      'Acquisition tax, notary fees, registry, appraisal and the bank trust: every line item that lands on top of the purchase price, and how to get a reliable estimate.',
    image: '/blog/AdobeStock_887006964.jpeg',
    readTime: '7 min',
    date: 'August 6, 2026',
  },
  {
    slug: 'pre-construction-vs-move-in-ready-cancun',
    title: 'Pre-Construction vs. Move-In Ready in Cancún: Which Is Right for You?',
    description:
      'Pre-construction gets you a lower price and the pick of the inventory but you wait. An honest comparison of the trade-offs, risks and payment structures.',
    image: '/blog/AdobeStock_841077811.jpeg',
    readTime: '7 min',
    date: 'August 6, 2026',
  },
];

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
