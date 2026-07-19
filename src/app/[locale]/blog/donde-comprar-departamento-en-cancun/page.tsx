import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import BlogCTA from '@/components/BlogCTA';

export const metadata: Metadata = {
  title: 'Zona Hotelera vs. Puerto Cancún vs. Av. Huayacán: ¿Dónde Comprar Departamento en Cancún?',
  description:
    'Comparamos las tres zonas donde hoy se concentra la oferta de departamentos en Cancún: precios, perfil de comprador, plusvalía y desarrollos activos en cada una.',
  keywords: [
    'donde comprar departamento en cancun',
    'zona hotelera cancun departamentos',
    'puerto cancun departamentos',
    'av huayacan cancun departamentos',
    'mejores zonas departamento cancun',
    'departamentos en venta cancun',
  ],
  alternates: {
    canonical: 'https://www.tresor.mx/blog/donde-comprar-departamento-en-cancun',
  },
  openGraph: {
    title: 'Zona Hotelera vs. Puerto Cancún vs. Av. Huayacán: ¿Dónde Comprar Departamento en Cancún?',
    description:
      'Precios, perfil de comprador y desarrollos activos en las tres zonas donde hoy se concentra la oferta de departamentos en Cancún.',
    url: 'https://www.tresor.mx/blog/donde-comprar-departamento-en-cancun',
    images: [{ url: '/desarrollos/villalta/portada3.jpg', width: 1920, height: 1080 }],
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'Zona Hotelera vs. Puerto Cancún vs. Av. Huayacán: ¿Dónde Comprar Departamento en Cancún?',
  datePublished: '2026-07-19',
  dateModified: '2026-07-19',
  author: { '@type': 'Organization', name: 'Tresor Real Estate' },
  publisher: {
    '@type': 'Organization',
    name: 'Tresor Real Estate',
    logo: 'https://www.tresor.mx/logos/LogoTresor-ink.svg',
  },
  image: 'https://www.tresor.mx/desarrollos/villalta/portada3.jpg',
  mainEntityOfPage: 'https://www.tresor.mx/blog/donde-comprar-departamento-en-cancun',
};

export default function ArticlePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Hero */}
      <div className="relative h-[55vh] min-h-[400px] overflow-hidden">
        <Image
          src="/desarrollos/villalta/portada3.jpg"
          alt="Departamentos en la Zona Hotelera de Cancún — Villalta Laguna"
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/40 to-transparent" />
        <div className="absolute inset-0 flex flex-col justify-end px-6 pb-10">
          <div className="container-wrap">
            <p className="eyebrow eyebrow-accent mb-3">Comparativa de Zonas</p>
            <h1 className="font-serif italic text-3xl md:text-5xl text-white max-w-3xl leading-tight">
              Zona Hotelera vs. Puerto Cancún vs. Av. Huayacán: ¿Dónde Comprar Departamento en Cancún?
            </h1>
            <div className="flex items-center gap-4 mt-4 text-white/60 text-sm">
              <span>19 de julio de 2026</span>
              <span>·</span>
              <span>9 min de lectura</span>
            </div>
          </div>
        </div>
      </div>

      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="py-4 px-6 border-b border-line">
        <div className="container-wrap">
          <ol className="flex items-center gap-2 text-sm text-ink-3">
            <li><Link href="/" className="hover:text-accent transition-colors">Inicio</Link></li>
            <li>/</li>
            <li><Link href="/blog" className="hover:text-accent transition-colors">Blog</Link></li>
            <li>/</li>
            <li className="text-ink truncate max-w-[240px] md:max-w-none">Dónde comprar departamento en Cancún</li>
          </ol>
        </div>
      </nav>

      {/* Content */}
      <article className="py-16 px-6">
        <div className="max-w-3xl mx-auto">

          <p className="text-lg text-ink-2 leading-relaxed mb-8">
            "¿Dónde compro?" suele ser la primera pregunta real de cualquier comprador de departamento en Cancún — antes que el desarrollo, antes que el precio. Hoy la oferta activa se concentra en tres zonas con carácter muy distinto: la Zona Hotelera, Puerto Cancún y el corredor de Av. Huayacán. Cada una responde a un perfil de comprador diferente.
          </p>
          <p className="text-ink-2 leading-relaxed mb-8">
            En esta guía comparamos las tres con datos reales de precio, plusvalía y desarrollos activos, para que elijas con criterio y no solo por el render más bonito.
          </p>

          <h2 className="font-serif italic text-3xl text-ink mt-12 mb-6">
            Comparativa rápida
          </h2>
          <div className="overflow-x-auto mb-10 -mx-6 px-6 md:mx-0 md:px-0">
            <table className="w-full text-sm border-collapse min-w-[560px]">
              <thead>
                <tr className="border-b border-line text-left text-ink-3 text-xs uppercase tracking-wide">
                  <th className="py-3 pr-4 font-semibold">Zona</th>
                  <th className="py-3 pr-4 font-semibold">Precio de entrada</th>
                  <th className="py-3 pr-4 font-semibold">Perfil de comprador</th>
                  <th className="py-3 font-semibold">Carácter</th>
                </tr>
              </thead>
              <tbody className="text-ink-2">
                <tr className="border-b border-line">
                  <td className="py-3 pr-4 font-semibold text-ink">Zona Hotelera</td>
                  <td className="py-3 pr-4">Desde $5,000,000 MXN</td>
                  <td className="py-3 pr-4">Renta vacacional premium, segunda residencia</td>
                  <td className="py-3">Frente a laguna o mar, inventario limitado</td>
                </tr>
                <tr className="border-b border-line">
                  <td className="py-3 pr-4 font-semibold text-ink">Puerto Cancún</td>
                  <td className="py-3 pr-4">Desde $14,800,000 MXN</td>
                  <td className="py-3 pr-4">Lujo residencial, marina y estilo de vida</td>
                  <td className="py-3">El enclave más exclusivo de la ciudad</td>
                </tr>
                <tr>
                  <td className="py-3 pr-4 font-semibold text-ink">Av. Huayacán</td>
                  <td className="py-3 pr-4">Desde $2,595,000 MXN</td>
                  <td className="py-3 pr-4">Vivienda propia, renta de largo plazo, primer patrimonio</td>
                  <td className="py-3">La zona de mayor crecimiento y oferta de la ciudad</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h2 className="font-serif italic text-3xl text-ink mt-12 mb-6">
            Zona Hotelera: inventario limitado, plusvalía sostenida
          </h2>
          <p className="text-ink-2 leading-relaxed mb-4">
            La Zona Hotelera es la franja de Cancún con menos terreno disponible para nueva construcción — eso sostiene la presión de precio al alza en cualquier unidad frente a la laguna Nichupté o el mar Caribe. Es la zona con mayor demanda de renta vacacional de la ciudad por su cercanía directa a playa y a la infraestructura turística.
          </p>
          <div className="p-6 rounded-xl border border-line bg-bg-soft mb-8">
            <h3 className="font-sans font-bold text-ink mb-2">
              <Link href="/desarrollos/villalta-onix" className="hover:text-accent transition-colors">Villalta Laguna</Link>
            </h3>
            <p className="text-sm text-ink-2 mb-2">Onix Living · Entrega inmediata</p>
            <ul className="space-y-1 text-sm text-ink-2">
              <li>Departamentos de 1, 2 y 3 recámaras</li>
              <li>Desde $5,000,000 MXN</li>
              <li>Frente a la laguna Nichupté, dentro de la Zona Hotelera</li>
            </ul>
          </div>

          <h2 className="font-serif italic text-3xl text-ink mt-12 mb-6">
            Puerto Cancún: el segmento de lujo con marina propia
          </h2>
          <p className="text-ink-2 leading-relaxed mb-4">
            Puerto Cancún es el enclave residencial de mayor plusvalía histórica de la ciudad — acceso controlado, marina privada y un estándar de amenidades que no existe en ninguna otra zona de Cancún. Es la opción natural para quien busca segunda residencia de lujo o inversión de alto ticket con estilo de vida frente al mar.
          </p>
          <div className="p-6 rounded-xl border border-line bg-bg-soft mb-8">
            <h3 className="font-sans font-bold text-ink mb-2">
              <Link href="/desarrollos/blume-urban" className="hover:text-accent transition-colors">Blume</Link>
            </h3>
            <p className="text-sm text-ink-2 mb-2">Urban Homes · Entrega inmediata</p>
            <ul className="space-y-1 text-sm text-ink-2">
              <li>Condominios de 2 y 3 recámaras, 113 residencias</li>
              <li>Desde $19,256,000 MXN</li>
              <li>Muelle propio en la Marina de Puerto Cancún, vistas al mar Caribe y a la laguna Nichupté</li>
            </ul>
          </div>

          <h2 className="font-serif italic text-3xl text-ink mt-12 mb-6">
            Av. Huayacán: la zona de mayor crecimiento y mayor oferta
          </h2>
          <p className="text-ink-2 leading-relaxed mb-4">
            El corredor de Av. Huayacán concentra hoy la mayor cantidad de desarrollos activos de la ciudad — es la zona de expansión residencial más dinámica de Cancún, con precios de entrada notablemente más accesibles que la Zona Hotelera o Puerto Cancún. Es la opción natural para quien busca vivienda propia, renta de largo plazo o su primer patrimonio inmobiliario.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
            <div className="p-6 rounded-xl border border-line bg-bg-soft">
              <h3 className="font-sans font-bold text-ink mb-2">
                <Link href="/desarrollos/valmira-urban" className="hover:text-accent transition-colors">Valmira</Link>
              </h3>
              <p className="text-sm text-ink-2 mb-2">Urban Homes · Entrega inmediata</p>
              <ul className="space-y-1 text-sm text-ink-2">
                <li>Departamentos de lujo de 2 y 3 recámaras</li>
                <li>Desde $2,595,000 MXN</li>
                <li>Dentro de la comunidad Gran Vía</li>
              </ul>
            </div>
            <div className="p-6 rounded-xl border border-line bg-bg-soft">
              <h3 className="font-sans font-bold text-ink mb-2">
                <Link href="/desarrollos/koa-onix" className="hover:text-accent transition-colors">Koa</Link>
              </h3>
              <p className="text-sm text-ink-2 mb-2">Onix Living · Entrega inmediata</p>
              <ul className="space-y-1 text-sm text-ink-2">
                <li>Departamentos de 1, 2 y 3 recámaras</li>
                <li>Desde $3,500,000 MXN</li>
                <li>Zona Huayacán, diseño exclusivo y amenidades de lujo</li>
              </ul>
            </div>
            <div className="p-6 rounded-xl border border-line bg-bg-soft">
              <h3 className="font-sans font-bold text-ink mb-2">
                <Link href="/desarrollos/esther-wow-condos" className="hover:text-accent transition-colors">Esther Wow Condos</Link>
              </h3>
              <p className="text-sm text-ink-2 mb-2">Live Desarrollos · Preventa</p>
              <ul className="space-y-1 text-sm text-ink-2">
                <li>Departamentos de 1, 2 y 3 recámaras</li>
                <li>Desde $3,500,000 MXN</li>
                <li>Dentro de Vía Cumbres, sobre Av. Huayacán</li>
              </ul>
            </div>
            <div className="p-6 rounded-xl border border-line bg-bg-soft">
              <h3 className="font-sans font-bold text-ink mb-2">
                <Link href="/desarrollos/ximena-wow-condos" className="hover:text-accent transition-colors">Ximena Wow Condos</Link>
              </h3>
              <p className="text-sm text-ink-2 mb-2">Live Desarrollos · Preventa</p>
              <ul className="space-y-1 text-sm text-ink-2">
                <li>Departamentos de 1, 2 y 3 recámaras + Garden Houses</li>
                <li>Desde $3,500,000 MXN</li>
                <li>Dentro de Vía Cumbres, sobre Av. Huayacán</li>
              </ul>
            </div>
          </div>

          <h2 className="font-serif italic text-3xl text-ink mt-12 mb-6">
            Cómo decidir según tu objetivo
          </h2>
          <div className="space-y-4 mb-10">
            {[
              { t: 'Si buscas renta vacacional de alta demanda', d: 'La Zona Hotelera tiene la ocupación turística más consistente de la ciudad — el inventario limitado también protege tu plusvalía a futuro.' },
              { t: 'Si buscas estilo de vida y lujo residencial', d: 'Puerto Cancún ofrece amenidades y exclusividad que ninguna otra zona replica — marina propia, acceso controlado, el ticket de entrada más alto de Cancún.' },
              { t: 'Si buscas tu primer patrimonio o vivienda propia', d: 'Av. Huayacán tiene el precio de entrada más accesible y la mayor oferta activa — es también la zona con más proyección de crecimiento de infraestructura en el corto plazo.' },
              { t: 'Si buscas renta de largo plazo con flujo estable', d: 'Av. Huayacán y sus comunidades planeadas (Vía Cumbres, Gran Vía) tienen la demanda de renta residencial más consistente por su cercanía a servicios y al aeropuerto.' },
            ].map((item) => (
              <div key={item.t} className="p-5 rounded-xl border border-line bg-bg-soft">
                <h3 className="font-sans font-bold text-ink mb-1">{item.t}</h3>
                <p className="text-ink-2 text-sm leading-relaxed">{item.d}</p>
              </div>
            ))}
          </div>

          <h2 className="font-serif italic text-3xl text-ink mt-12 mb-6">
            Preguntas frecuentes
          </h2>
          <div className="space-y-4 mb-10">
            {[
              { q: '¿Cuál zona de Cancún tiene mejor plusvalía?', a: 'Puerto Cancún tiene la plusvalía histórica más alta por su acceso restringido y oferta limitada. La Zona Hotelera le sigue de cerca por la misma razón: terreno disponible casi nulo. Av. Huayacán tiene menor precio base pero mayor proyección de crecimiento porcentual, al ser una zona todavía en expansión.' },
              { q: '¿Es más barato comprar departamento en Av. Huayacán que en la Zona Hotelera?', a: 'Sí, considerablemente. El precio de entrada en Av. Huayacán arranca desde $2,595,000 MXN, frente a $5,000,000 MXN en la Zona Hotelera y $14,800,000 MXN en Puerto Cancún.' },
              { q: '¿Qué zona conviene más para renta vacacional en plataformas como Airbnb?', a: 'La Zona Hotelera y Puerto Cancún tienen la demanda turística más consistente por cercanía directa a playa. Av. Huayacán funciona mejor para renta residencial de largo plazo que para renta vacacional de corto plazo.' },
            ].map((item, i) => (
              <div key={i} className="p-4 bg-bg-soft rounded-xl border border-line">
                <p className="font-semibold text-ink mb-1">{item.q}</p>
                <p className="text-ink-2 text-sm leading-relaxed">{item.a}</p>
              </div>
            ))}
          </div>

          <h2 className="font-serif italic text-3xl text-ink mt-12 mb-6">
            Conclusión
          </h2>
          <p className="text-ink-2 leading-relaxed mb-8">
            No existe una "mejor zona" universal — existe la zona correcta según tu objetivo real: renta vacacional, lujo residencial o vivienda propia con proyección de crecimiento. Puedes explorar el{' '}
            <Link href="/cancun" className="text-accent hover:underline">catálogo de departamentos en Cancún</Link>{' '}
            completo, filtrado por zona y desarrollador, y hablar con un asesor que te ayude a comparar opciones reales según tu presupuesto y objetivo de inversión.
          </p>

          {/* Related articles */}
          <h2 className="font-serif italic text-2xl text-ink mt-16 mb-6">Artículos relacionados</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-4">
            {[
              { slug: 'desarrollos-inmobiliarios-en-cancun', title: 'Desarrollos Inmobiliarios en Cancún 2026: Guía Completa y Proyectos Destacados', img: '/renders/long-island/01.jpg' },
              { slug: 'mejores-zonas-para-negocio-en-cancun', title: 'Las Mejores Zonas para Poner un Negocio en Cancún', img: '/blog/AdobeStock_838554951.jpeg' },
              { slug: 'invertir-en-cancun-desde-monterrey-cdmx', title: 'Por Qué Invertir en Cancún desde Monterrey, CDMX o Guadalajara', img: '/blog/AdobeStock_841077811.jpeg' },
            ].map((rel) => (
              <Link key={rel.slug} href={`/blog/${rel.slug}`} className="group rounded-xl overflow-hidden border border-line hover:shadow-md transition-shadow">
                <div className="relative aspect-video">
                  <Image src={rel.img} alt={rel.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" sizes="300px" />
                </div>
                <p className="p-4 text-sm font-semibold text-ink group-hover:text-accent transition-colors leading-snug">{rel.title}</p>
              </Link>
            ))}
          </div>
        </div>
      </article>

      <div className="px-6">
        <div className="max-w-3xl mx-auto">
          <BlogCTA title="Compara zonas y encuentra tu departamento ideal en Cancún" />
        </div>
      </div>
    </>
  );
}
