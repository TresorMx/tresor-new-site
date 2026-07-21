import type { Metadata } from 'next';
import Image from 'next/image';
import BlogArticlesGrid from '@/components/blog/BlogArticlesGrid';

export const metadata: Metadata = {
  title: 'Blog Tresor Real Estate — Inversión Inmobiliaria en Cancún y la Riviera Maya',
  description:
    'Artículos, análisis y guías para invertir con éxito en Cancún y la Riviera Maya: departamentos, locales comerciales, lotes residenciales y preventa.',
  keywords: [
    'blog tresor real estate',
    'inversión inmobiliaria cancun',
    'blog inmobiliario cancun',
    'guia comprar propiedad cancun',
    'locales comerciales cancun 2026',
  ],
  alternates: {
    canonical: 'https://www.tresor.mx/blog',
  },
  openGraph: {
    title: 'Blog Tresor Real Estate — Inversión Inmobiliaria en Cancún y la Riviera Maya',
    description:
      'Artículos expertos sobre inversión inmobiliaria en Cancún y la Riviera Maya: precios, zonas, preventa y análisis del mercado.',
    url: 'https://www.tresor.mx/blog',
    images: [{ url: '/ogfinal.jpg', width: 1200, height: 630 }],
  },
};

const articles = [
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

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  name: 'Blog — Tresor Real Estate',
  url: 'https://www.tresor.mx/blog',
  itemListElement: articles.map((a, i) => ({
    '@type': 'ListItem',
    position: i + 1,
    url: `https://www.tresor.mx/blog/${a.slug}`,
    name: a.title,
  })),
};

export default function BlogPage() {
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
            src="/blog/AdobeStock_656227413.jpeg"
            alt="Blog Tresor Real Estate — Inversión inmobiliaria en Cancún"
            fill
            priority
            sizes="100vw"
            className="scale-105 object-cover"
          />
        </div>
        <div className="absolute inset-0 bg-black/55" />
        <div className="relative z-10 flex h-full flex-col items-center justify-center px-6 pt-[72px] text-center">
          <span className="eyebrow eyebrow-accent font-bold">— Blog</span>
          <h1 className="mt-5 h-display max-w-3xl text-[clamp(40px,7vw,88px)] text-white">
            Blog Tresor Real Estate
          </h1>
          <p className="mt-6 max-w-xl text-[15px] font-normal leading-relaxed text-white">
            Análisis, guías y consejos para invertir con éxito en Cancún, Tulum, Playa del Carmen y Puerto Cancún.
          </p>
        </div>
      </section>

      <BlogArticlesGrid articles={articles} />
    </>
  );
}
