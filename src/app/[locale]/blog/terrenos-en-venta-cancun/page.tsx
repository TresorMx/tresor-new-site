import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import BlogCTA from '@/components/BlogCTA';

// Estrategia de keywords (evitar canibalización):
//   /lotes-residenciales ......... "lotes residenciales en venta cancun" (catálogo, transaccional)
//   ESTE POST ..................... "terrenos en venta cancun" — término más
//     coloquial/genérico que "lotes residenciales", con el que buscan tanto
//     quien quiere construir su casa como el inversionista que nunca ha
//     comprado tierra en México. Post informacional: qué revisar antes de
//     comprar, no solo el catálogo.
//
// Zienna es HOY el único desarrollo de lotes residenciales en el catálogo —
// no se inventan "alternativas" para rellenar el post. Los datos de Zienna
// (604 lotes, 227 m² promedio, 27 ha, casa club) salen del catálogo real
// (developments.ts / Sanity), no se inventan aquí.

const URL = 'https://www.tresor.mx/blog/terrenos-en-venta-cancun';
const TITLE = 'Terrenos en Venta en Cancún: Qué Revisar Antes de Comprar (2026)';
const DESCRIPTION =
  'Guía para comprar un terreno en Cancún sin errores: uso de suelo, factibilidad de servicios, escrituración y zonas con lotes residenciales activos — con Zienna, sobre Av. Huayacán, como caso real.';
const HERO = '/desarrollos/zienna/CASETA_ZIENNA.jpg';
const FECHA_ISO = '2026-08-07';
const FECHA = '7 de agosto de 2026';

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  keywords: [
    'terrenos en venta cancun',
    'terrenos en cancun',
    'lotes residenciales cancun',
    'comprar terreno en cancun',
    'terrenos av huayacan cancun',
    'zienna cancun',
    'como comprar un terreno en mexico',
  ],
  alternates: { canonical: URL },
  openGraph: {
    title: TITLE,
    description:
      'Uso de suelo, factibilidad de servicios y escrituración: lo que hay que revisar antes de comprar un terreno en Cancún — con datos reales de Zienna, sobre Av. Huayacán.',
    url: URL,
    type: 'article',
    publishedTime: FECHA_ISO,
    images: [{ url: `https://www.tresor.mx${HERO}`, width: 1920, height: 1080 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: TITLE,
    description:
      'Uso de suelo, factibilidad de servicios y escrituración: lo que hay que revisar antes de comprar un terreno en Cancún.',
    images: [`https://www.tresor.mx${HERO}`],
  },
};

const FAQS = [
  {
    q: '¿Qué es lo primero que debo revisar antes de comprar un terreno en Cancún?',
    a: 'El uso de suelo (que el predio esté autorizado para lo que planeas hacer: vivienda, comercio, etc.) y la factibilidad de servicios — que agua, luz y drenaje realmente puedan llegar al lote. Sin esto, un terreno barato puede terminar costando mucho más en trámites o simplemente no ser construible.',
  },
  {
    q: '¿Cuál es la diferencia entre comprar en un fraccionamiento y un terreno suelto?',
    a: 'Un fraccionamiento como Zienna ya viene con uso de suelo residencial autorizado, servicios subterráneos a pie de lote y reglamento de construcción definido — reduces la mayoría de los riesgos de un terreno suelto, donde tú tienes que gestionar todo eso por tu cuenta y verificar la situación legal del predio uno por uno.',
  },
  {
    q: '¿Los terrenos en Cancún tienen escritura o son ejidales?',
    a: 'Depende del predio. Hay terrenos plenamente escriturados y otros que arrastran una situación ejidal sin regularizar — comprar sin verificar esto es el error más costoso que existe en bienes raíces en México. Un desarrollo formal y ya establecido, con escrituras individuales por lote, elimina ese riesgo desde el inicio.',
  },
  {
    q: '¿Cuánto cuesta un terreno residencial en Cancún?',
    a: 'Varía mucho por zona y superficie. En nuestro portafolio, los lotes de Zienna —sobre Av. Huayacán, de 200 a 444 m²— tienen precio desde $1,750,000 MXN. Un asesor te comparte el precio vigente por tamaño y ubicación dentro del desarrollo.',
  },
  {
    q: '¿Puedo construir cuando yo quiera después de comprar el terreno?',
    a: 'En un fraccionamiento normalmente sí, sujeto al reglamento de construcción del desarrollo (alturas, retiros, tiempos). Es distinto a un terreno suelto sin reglamento, donde también tienes más libertad pero también más incertidumbre sobre lo que construirá tu vecino al lado.',
  },
  {
    q: '¿Conviene más comprar terreno o departamento como inversión en Cancún?',
    a: 'Depende del objetivo. Un terreno da más libertad y, en zonas de crecimiento, mayor margen de plusvalía a largo plazo — pero no genera renta mientras no se construye. Un departamento genera renta desde el día uno pero con menos margen de personalización. Lo comparamos con más detalle en el enlace al final de este artículo.',
  },
];

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Article',
      headline: TITLE,
      description: DESCRIPTION,
      datePublished: FECHA_ISO,
      dateModified: FECHA_ISO,
      author: { '@type': 'Organization', name: 'Tresor Real Estate', url: 'https://www.tresor.mx' },
      publisher: {
        '@type': 'Organization',
        name: 'Tresor Real Estate',
        logo: 'https://www.tresor.mx/logos/LogoTresor-ink.svg',
      },
      image: `https://www.tresor.mx${HERO}`,
      mainEntityOfPage: URL,
    },
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Inicio', item: 'https://www.tresor.mx' },
        { '@type': 'ListItem', position: 2, name: 'Blog', item: 'https://www.tresor.mx/blog' },
        { '@type': 'ListItem', position: 3, name: 'Terrenos en venta en Cancún', item: URL },
      ],
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

const H2 = 'font-sans text-[clamp(24px,3.2vw,48px)] font-normal leading-[1.05] tracking-tight text-ink mt-12 mb-6';

export default function ArticlePage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* Hero */}
      <div data-nav="dark" className="relative -mt-[72px] h-[55vh] min-h-[400px] overflow-hidden">
        <Image
          src={HERO}
          alt="Acceso principal de Zienna, comunidad de lotes residenciales sobre Av. Huayacán, Cancún"
          fill priority className="object-cover" sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/40 to-transparent" />
        <div className="absolute inset-0 flex flex-col justify-end px-6 pb-10 pt-[104px]">
          <div className="container-wrap">
            <p className="eyebrow eyebrow-accent mb-3">Guía de Compra</p>
            <h1 className="h-display text-[clamp(28px,4.5vw,52px)] text-white max-w-3xl leading-tight">
              Terrenos en venta en Cancún: qué revisar antes de comprar
            </h1>
            <div className="flex items-center gap-4 mt-4 text-white/60 text-sm">
              <span>{FECHA}</span>
              <span>·</span>
              <span>8 min de lectura</span>
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
            <li className="text-ink truncate max-w-[240px] md:max-w-none">Terrenos en venta en Cancún</li>
          </ol>
        </div>
      </nav>

      {/* Content */}
      <article className="py-16 px-6">
        <div className="max-w-3xl mx-auto">

          <p className="text-lg text-ink-2 leading-relaxed mb-8">
            Comprar un terreno es distinto a comprar un departamento — no hay renders que verificar contra la realidad, hay un pedazo de tierra que tiene una historia legal propia: uso de suelo, factibilidad de servicios, y una cadena de escrituras que hay que revisar antes de firmar. Es la inversión con más libertad (construyes lo que quieras, cuando quieras) y también la que más errores comunes tiene en México si no se hace bien.
          </p>
          <p className="text-ink-2 leading-relaxed mb-8">
            En esta guía explicamos qué revisar antes de comprar un terreno en Cancún, y usamos como referencia real Zienna, la comunidad de lotes residenciales que hoy tenemos activa sobre Av. Huayacán.
          </p>

          <h2 className={H2}>Los 4 errores más comunes al comprar un terreno en México</h2>
          <ul className="space-y-3 mb-10 text-ink-2">
            {[
              ['Uso de suelo no verificado', 'Comprar un predio sin confirmar que está autorizado para uso residencial (o el uso que planeas darle) ante el municipio. Sin esto, no puedes obtener licencia de construcción, sin importar qué tan buena se vea la ubicación.'],
              ['Sin factibilidad de servicios', 'Que agua, luz y drenaje realmente puedan conectarse al predio. Hay terrenos donde la red más cercana está a kilómetros — introducir servicios ahí puede costar más que el terreno mismo.'],
              ['Situación ejidal sin regularizar', 'Terrenos que originalmente fueron tierra ejidal y nunca completaron el proceso de dominio pleno. Comprar sin verificar esto en el Registro Público de la Propiedad es el error más costoso que existe: puedes terminar sin título de propiedad real.'],
              ['Sin reglamento de construcción claro', 'En un terreno suelto, sin fraccionamiento formal, nada te garantiza qué construirá tu vecino al lado — ni alturas, ni restricciones, ni uso. Eso también afecta tu propia plusvalía a futuro.'],
            ].map(([t, d]) => (
              <li key={t} className="flex gap-3">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                <span><strong className="text-ink font-semibold">{t}:</strong> {d}</span>
              </li>
            ))}
          </ul>
          <p className="text-ink-2 leading-relaxed mb-8">
            La forma más directa de evitar los cuatro es comprar dentro de un fraccionamiento formal y ya establecido, donde el desarrollador ya resolvió el uso de suelo, la factibilidad de servicios y la situación legal del predio completo — antes de vender el primer lote.
          </p>

          <h2 className={H2}>Zienna: lotes residenciales reales sobre Av. Huayacán</h2>
          <p className="text-ink-2 leading-relaxed mb-4">
            Zienna es una comunidad de <strong className="text-ink font-semibold">604 lotes unifamiliares</strong> sobre Av. Huayacán — el corredor de mayor crecimiento residencial de Cancún, la misma zona donde hoy se concentra buena parte de la nueva oferta de departamentos de la ciudad. Los lotes van de <strong className="text-ink font-semibold">200 a 444 m²</strong>, con una superficie promedio de 227 m², dentro de 27 hectáreas.
          </p>
          <div className="relative aspect-video rounded-xl overflow-hidden mb-6">
            <Image
              src="/desarrollos/zienna/Casa-club-general.jpg"
              alt="Casa club de Zienna, comunidad de lotes residenciales en Cancún"
              fill className="object-cover" sizes="(max-width:768px) 100vw, 700px"
            />
          </div>
          <ul className="space-y-3 mb-8 text-ink-2">
            {[
              ['Doble acceso con servicios subterráneos a pie de lote', 'Agua, luz y drenaje ya resueltos hasta el límite de tu terreno.'],
              ['40% de áreas verdes naturales', 'Sobre las 27 hectáreas totales del desarrollo.'],
              ['A 10 minutos del aeropuerto y 15 del Tren Maya', 'Conectividad real, sin salir de Cancún.'],
              ['Casa club y áreas deportivas', 'Alberca, gimnasio, restaurante, canchas de pádel y área infantil para toda la comunidad.'],
            ].map(([t, d]) => (
              <li key={t} className="flex gap-3">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                <span><strong className="text-ink font-semibold">{t}:</strong> {d}</span>
              </li>
            ))}
          </ul>
          <div className="p-6 rounded-xl border border-line bg-bg-soft mb-8">
            <h3 className="font-sans font-bold text-ink mb-2">
              <Link href="/desarrollos/zienna-onix" className="hover:text-accent transition-colors">Zienna</Link>
            </h3>
            <p className="text-sm text-ink-2 mb-2">Onix Living · Preventa</p>
            <ul className="space-y-1 text-sm text-ink-2">
              <li>604 lotes residenciales, de 200 a 444 m²</li>
              <li>Desde $1,750,000 MXN</li>
              <li>Av. Huayacán, Cancún</li>
            </ul>
          </div>

          <h2 className={H2}>¿Terreno o departamento? Cómo decidir</h2>
          <div className="overflow-x-auto mb-10 -mx-6 px-6 md:mx-0 md:px-0">
            <table className="w-full text-sm border-collapse min-w-[520px]">
              <thead>
                <tr className="border-b border-line text-left text-ink-3 text-xs uppercase tracking-wide">
                  <th className="py-3 pr-4 font-semibold"></th>
                  <th className="py-3 pr-4 font-semibold">Terreno</th>
                  <th className="py-3 font-semibold">Departamento</th>
                </tr>
              </thead>
              <tbody className="text-ink-2">
                {[
                  ['Renta inmediata', 'No — hasta que construyes', 'Sí, desde la entrega'],
                  ['Libertad de diseño', 'Total, tú decides qué construir', 'Limitada al inmueble ya construido'],
                  ['Inversión inicial', 'Menor (solo tierra)', 'Mayor (incluye construcción)'],
                  ['Plusvalía en zona de crecimiento', 'Potencial más alto a largo plazo', 'Más predecible, menos volátil'],
                  ['Trámites y tiempos', 'Requiere gestionar permisos y construcción', 'Solo escrituración'],
                ].map(([row, terreno, depto]) => (
                  <tr key={row} className="border-b border-line align-top">
                    <td className="py-3 pr-4 font-semibold text-ink whitespace-nowrap">{row}</td>
                    <td className="py-3 pr-4">{terreno}</td>
                    <td className="py-3">{depto}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-ink-2 leading-relaxed mb-8">
            Si tu objetivo es construir tu propia casa o desarrollar a tu ritmo con más margen de plusvalía, un terreno como los de Zienna tiene sentido. Si buscas renta o uso inmediato, un{' '}
            <Link href="/departamentos-en-venta-cancun" className="text-accent hover:underline">departamento en preventa o entrega inmediata en Cancún</Link>{' '}
            probablemente se ajusta mejor a tu objetivo.
          </p>

          <h2 className={H2}>Preguntas frecuentes</h2>
          <div className="space-y-4 mb-10">
            {FAQS.map((item) => (
              <div key={item.q} className="p-4 bg-bg-soft rounded-xl border border-line">
                <p className="font-semibold text-ink mb-1">{item.q}</p>
                <p className="text-ink-2 text-sm leading-relaxed">{item.a}</p>
              </div>
            ))}
          </div>

          <h2 className={H2}>Conclusión</h2>
          <p className="text-ink-2 leading-relaxed mb-8">
            Comprar un terreno en Cancún es una decisión sólida si se hace en un desarrollo con uso de suelo resuelto, servicios reales y situación legal clara desde el inicio — justo lo que evita los cuatro errores más comunes de comprar tierra en México. Puedes revisar el{' '}
            <Link href="/lotes-residenciales" className="text-accent hover:underline">catálogo completo de lotes residenciales en Cancún</Link>{' '}
            o hablar con un asesor sobre disponibilidad y precios vigentes en Zienna.
          </p>

          {/* Related articles */}
          <h2 className="font-sans text-[clamp(20px,2.6vw,32px)] font-normal leading-[1.05] tracking-tight text-ink mt-16 mb-6">Artículos relacionados</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-4">
            {[
              { slug: 'donde-comprar-departamento-en-cancun', title: 'Zona Hotelera vs. Puerto Cancún vs. Av. Huayacán: ¿Dónde Comprar Departamento en Cancún?', img: '/desarrollos/villalta/portada3.jpg' },
              { slug: 'desarrollos-inmobiliarios-en-cancun', title: 'Desarrollos Inmobiliarios en Cancún 2026: Guía Completa y Proyectos Destacados', img: '/renders/long-island/01.jpg' },
              { slug: 'guia-comprar-en-preventa-cancun', title: 'Guía para Comprar en Preventa en Cancún: Todo lo que Debes Saber', img: '/blog/AdobeStock_887006964.jpeg' },
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
          <BlogCTA
            eyebrow="Tresor Real Estate"
            title="¿Te interesa un lote en Zienna, Av. Huayacán?"
            subtitle="Un asesor te comparte disponibilidad real por tamaño y ubicación dentro del desarrollo, precios y planes de pago."
            image="/desarrollos/zienna/CASETA_ZIENNA.jpg"
            imageAlt="Zienna — lotes residenciales sobre Av. Huayacán, Cancún"
            primaryHref="/desarrollos/zienna-onix"
            primaryLabel="Ver lotes disponibles en Zienna"
            whatsappMessage="Hola, me interesa un terreno en Zienna, Av. Huayacán"
          />
        </div>
      </div>
    </>
  );
}
