import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import BlogCTA from '@/components/BlogCTA';

// Estrategia de keywords (evitar canibalización con las páginas de dinero):
//   /playa-del-carmen .................. "propiedades / departamentos EN VENTA en Playa del Carmen" (catálogo)
//   /en/condos-for-sale-playa-del-carmen  misma keyword, en inglés, para el comprador extranjero
//   /desarrollos/la-selva-playa-del-carmen ........ "La Selva"                                                 (marca)
//   ESTE POST .......................... "VIVIR en Playa del Carmen", "cómo es Playa del Carmen"    (informacional)
// Por eso el H1/title/description NO usan "en venta" ni "comprar departamento": el post capta la
// búsqueda informacional y reparte enlaces a las páginas transaccionales, en vez de competir contra ellas.

const URL = 'https://www.tresor.mx/blog/vivir-en-playa-del-carmen';
const TITLE = 'Vivir en Playa del Carmen: Guía Completa de la Riviera Maya (2026)';
const DESCRIPTION =
  'Cómo es realmente vivir en Playa del Carmen, qué zonas tienen más plusvalía, cuánto cuesta entrar y qué departamentos hay disponibles hoy en el corazón de la Riviera Maya.';
const HERO = '/desarrollos/la-selva/aerial-comunidad.avif';
const FECHA_ISO = '2026-08-13';
const FECHA = '13 de agosto de 2026';

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  keywords: [
    'vivir en playa del carmen',
    'como es playa del carmen',
    'que es playa del carmen',
    'playa del carmen quinta avenida',
    'cuanto cuesta vivir en playa del carmen',
    'playa del carmen riviera maya',
    'playa del carmen para extranjeros',
  ],
  alternates: { canonical: URL },
  openGraph: {
    title: TITLE,
    description:
      'La ciudad más caminable de la Riviera Maya: Quinta Avenida, playa a pie y una comunidad internacional. Cómo es vivir ahí y cuánto cuesta entrar.',
    url: URL,
    type: 'article',
    publishedTime: FECHA_ISO,
    images: [{ url: `https://www.tresor.mx${HERO}`, width: 1920, height: 1080 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: TITLE,
    description:
      'La ciudad más caminable de la Riviera Maya: Quinta Avenida, playa a pie y comunidad internacional. Cómo es vivir ahí y cuánto cuesta entrar.',
    images: [`https://www.tresor.mx${HERO}`],
  },
};

const FAQS = [
  {
    q: '¿En qué se diferencia Playa del Carmen de Cancún?',
    a: 'Cancún es una ciudad grande con aeropuerto internacional propio y una economía diversificada; Playa del Carmen es más chica, más caminable y con una vida de calle concentrada en la Quinta Avenida, la vía peatonal que corre paralela a la playa. Cancún funciona mejor si buscas escala y variedad de inventario; Playa si buscas un entorno donde puedas moverte a pie y una comunidad con fuerte presencia internacional.',
  },
  {
    q: '¿Cuánto cuesta vivir en Playa del Carmen?',
    a: 'En nuestro portafolio actual, un departamento de entrega inmediata en Playa del Carmen arranca en $2,244,000 MXN. El precio sube según qué tan cerca esté de la Quinta Avenida y de la playa — esa cercanía es, con diferencia, el factor que más mueve el precio por metro cuadrado en la zona.',
  },
  {
    q: '¿Playa del Carmen es buena para invertir o solo para vivir?',
    a: 'Ambas cosas, y no se excluyen. La renta de corto plazo tiene demanda fuerte todo el año gracias al perfil de visitante que recibe la zona — muy distinto al turismo puramente vacacional de otras partes de la Riviera Maya. Muchos compradores usan la propiedad unas semanas al año y la rentan el resto del tiempo.',
  },
  {
    q: '¿Qué tan lejos está del aeropuerto de Cancún?',
    a: 'Playa del Carmen está aproximadamente a una hora al sur del Aeropuerto Internacional de Cancún por la carretera federal, con un mercado establecido de shuttles y traslados privados en esa ruta. La terminal del ferry hacia Cozumel está en pleno centro, a pasos de la Quinta Avenida.',
  },
  {
    q: '¿Se puede rentar una propiedad en Playa del Carmen?',
    a: 'Sí, y es una de las razones principales por las que se compra ahí. Como en cualquier zona, las reglas de renta corta las define el reglamento interno de cada condominio, no la ciudad en general — conviene confirmarlas antes de comprar si el objetivo es rentar. El ingreso por renta, además, es gravable y hay que declararlo ante el SAT.',
  },
  {
    q: '¿Qué hay disponible hoy en Playa del Carmen?',
    a: 'En nuestro portafolio hay dos proyectos activos, ambos de Urban Homes: La Selva, con entrega inmediata desde $2,244,000 MXN; y Favorite, un desarrollo de lujo a pasos de la Quinta Avenida que lanzaremos próximamente.',
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
      about: { '@type': 'Place', name: 'Playa del Carmen', address: { '@type': 'PostalAddress', addressLocality: 'Playa del Carmen', addressRegion: 'Quintana Roo', addressCountry: 'MX' } },
    },
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Inicio', item: 'https://www.tresor.mx' },
        { '@type': 'ListItem', position: 2, name: 'Blog', item: 'https://www.tresor.mx/blog' },
        { '@type': 'ListItem', position: 3, name: 'Vivir en Playa del Carmen', item: URL },
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
      <div
        data-nav="dark"
        className="relative -mt-[72px] h-[55vh] min-h-[400px] overflow-hidden"
      >
        <Image
          src={HERO}
          alt="Vista aérea de una comunidad residencial en Playa del Carmen, Riviera Maya"
          fill priority className="object-cover" sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/40 to-transparent" />
        <div className="absolute inset-0 flex flex-col justify-end px-6 pb-10 pt-[104px]">
          <div className="container-wrap">
            <p className="eyebrow eyebrow-accent mb-3">Guía de Zona</p>
            <h1 className="h-display text-[clamp(28px,4.5vw,52px)] text-white max-w-3xl leading-tight">
              Vivir en Playa del Carmen: guía completa de la Riviera Maya
            </h1>
            <div className="flex items-center gap-4 mt-4 text-white/60 text-sm">
              <span>{FECHA}</span>
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
            <li className="text-ink truncate max-w-[240px] md:max-w-none">Vivir en Playa del Carmen</li>
          </ol>
        </div>
      </nav>

      {/* Content */}
      <article className="py-16 px-6">
        <div className="max-w-3xl mx-auto">

          <p className="text-lg text-ink-2 leading-relaxed mb-8">
            De todas las ciudades de la Riviera Maya, Playa del Carmen es la más caminable. No es una comparación menor: en una región donde casi todo se mueve en coche, tener la Quinta Avenida —el corredor peatonal que corre paralela al mar— como columna vertebral de la ciudad cambia por completo cómo se vive el día a día.
          </p>
          <p className="text-ink-2 leading-relaxed mb-8">
            En esta guía explicamos cómo es realmente vivir en Playa del Carmen, qué la distingue de Cancún, cuánto cuesta entrar hoy y qué departamentos hay disponibles ahora mismo en la zona.
          </p>

          <h2 className={H2}>Qué hace distinta a Playa del Carmen</h2>
          <p className="text-ink-2 leading-relaxed mb-6">
            Playa del Carmen creció distinto al resto de Quintana Roo. En vez de un corredor hotelero separado de la vida residencial —como en la Zona Hotelera de Cancún—, aquí el turismo, el comercio y la vivienda conviven en la misma trama urbana, con la Quinta Avenida como eje.
          </p>
          <ul className="space-y-3 mb-10 text-ink-2">
            {[
              ['Quinta Avenida', 'El corredor peatonal que concentra restaurantes, tiendas y vida nocturna, corriendo paralelo a la playa desde el centro de la ciudad.'],
              ['Terminal de ferry al centro', 'La salida hacia Cozumel está en pleno centro de la ciudad, a pasos de la Quinta — no hay que salir de la mancha urbana para tomarlo.'],
              ['Comunidad internacional', 'Fuerte presencia de residentes europeos y trabajo remoto, lo que sostiene una demanda de renta menos estacional que en zonas puramente vacacionales.'],
            ].map(([t, d]) => (
              <li key={t} className="flex gap-3">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                <span><strong className="text-ink font-semibold">{t}:</strong> {d}</span>
              </li>
            ))}
          </ul>

          <h2 className={H2}>Playa del Carmen de un vistazo</h2>
          <div className="overflow-x-auto mb-10 -mx-6 px-6 md:mx-0 md:px-0">
            <table className="w-full text-sm border-collapse min-w-[520px]">
              <tbody className="text-ink-2">
                {[
                  ['Distancia al aeropuerto de Cancún', '~1 hora por carretera federal'],
                  ['Eje de la ciudad', 'Quinta Avenida — corredor peatonal frente al mar'],
                  ['Conexión marítima', 'Ferry a Cozumel, desde el centro de la ciudad'],
                  ['Perfil de comprador', 'Residencia con uso real, renta vacacional, comunidad internacional'],
                  ['Precio de entrada (2026)', 'Desde $2,244,000 MXN'],
                  ['Qué mueve el precio', 'Cercanía a la Quinta Avenida y a la playa, más que la superficie'],
                ].map(([k, v]) => (
                  <tr key={k} className="border-b border-line">
                    <td className="py-3 pr-6 font-semibold text-ink whitespace-nowrap align-top">{k}</td>
                    <td className="py-3">{v}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <h2 className={H2}>Cómo es vivir en Playa del Carmen</h2>
          <p className="text-ink-2 leading-relaxed mb-6">
            La diferencia más clara frente a otras ciudades de la región es que en Playa se puede vivir sin coche. Restaurantes, supermercados, farmacias y vida social están al alcance de una caminata desde buena parte de la zona residencial que rodea a la Quinta Avenida — algo que en Cancún o en la mayoría de la Riviera Maya requiere trasladarse en auto.
          </p>
          <p className="text-ink-2 leading-relaxed mb-10">
            Esa caminabilidad, sumada a la comunidad internacional que ya vive ahí, es lo que ha hecho de Playa un destino tanto para quien busca residencia principal fuera de una gran ciudad como para quien busca una segunda casa con uso real, no solo de inversión sobre el papel.
          </p>

          <h2 className={H2}>Cuánto cuesta entrar a Playa del Carmen</h2>
          <p className="text-ink-2 leading-relaxed mb-6">
            En nuestro portafolio actual, un departamento de entrega inmediata en Playa del Carmen arranca en <strong className="text-ink font-semibold">$2,244,000 MXN</strong>. A diferencia de zonas donde el precio depende principalmente de la superficie, en Playa el factor que más mueve el precio por metro cuadrado es la cercanía a la Quinta Avenida y a la playa — dos departamentos del mismo tamaño pueden tener precios muy distintos según qué tan lejos estén de ese corredor.
          </p>
          <p className="text-ink-2 leading-relaxed mb-6">
            Es una zona donde conviene comparar con criterio antes de decidir. Si quieres ver cómo se compara contra otras ciudades de la Riviera Maya y del Caribe Mexicano, revisa nuestra guía en inglés sobre{' '}
            <Link href="/en/condos-for-sale-playa-del-carmen" className="text-accent hover:underline">condos for sale in Playa del Carmen</Link>, pensada para el comprador extranjero.
          </p>

          <h2 className={H2}>Qué se puede comprar hoy en Playa del Carmen</h2>
          <p className="text-ink-2 leading-relaxed mb-6">
            En nuestro portafolio hay dos proyectos activos en la ciudad, ambos de{' '}
            <Link href="/urban-homes" className="text-accent hover:underline">Urban Homes</Link>, en dos momentos de compra distintos:
          </p>
          <div className="grid gap-5 sm:grid-cols-2 mb-10">
            <Link href="/desarrollos/la-selva-playa-del-carmen" className="group rounded-xl overflow-hidden border border-line hover:shadow-md transition-shadow">
              <div className="relative aspect-video">
                <Image src="/desarrollos/la-selva/aerial-acceso.avif" alt="La Selva — departamentos en Playa del Carmen" fill className="object-cover group-hover:scale-105 transition-transform duration-500" sizes="(max-width:640px) 100vw, 340px" />
                <span className="absolute left-3 top-3 rounded-full bg-white/95 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-ink">Entrega inmediata</span>
              </div>
              <div className="p-4">
                <p className="font-semibold text-ink group-hover:text-accent transition-colors">La Selva</p>
                <p className="text-accent text-xs font-medium mt-0.5">Desde $2,244,000 MXN</p>
                <p className="text-ink-2 text-sm leading-relaxed mt-2">Comunidad completa de Urban Homes con departamentos de 2 y 3 recámaras, a 6 minutos de Playa Xcalacoco y 12 de la Quinta Avenida.</p>
              </div>
            </Link>
            {/* Favorite aún no tiene ficha propia (comingSoon) — se muestra
                como referencia, sin Link, mismo criterio que las cards de
                "Próximamente" en el resto del sitio (botón desactivado en
                vez de enlace roto a una ficha que no existe todavía). */}
            <div className="rounded-xl overflow-hidden border border-line opacity-80">
              <div className="relative aspect-video">
                <Image src="/desarrollos/Favorite/playaNIGHT.jpg" alt="Favorite — próximo desarrollo en Playa del Carmen" fill className="object-cover" sizes="(max-width:640px) 100vw, 340px" />
                <span className="absolute left-3 top-3 rounded-full bg-white/95 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-ink">Próximamente</span>
              </div>
              <div className="p-4">
                <p className="font-semibold text-ink">Favorite</p>
                <p className="text-ink-3 text-xs font-medium mt-0.5">Lanzamiento próximo</p>
                <p className="text-ink-2 text-sm leading-relaxed mt-2">Departamentos de lujo a pasos de la Quinta Avenida y del mar Caribe. Muy pronto revelamos todos los detalles.</p>
              </div>
            </div>
          </div>
          <p className="text-ink-2 leading-relaxed mb-10">
            Si quieres ver el inventario completo de la ciudad, incluyendo lo que se vaya sumando, está en{' '}
            <Link href="/departamentos-en-venta-playa-del-carmen" className="text-accent hover:underline">departamentos en venta en Playa del Carmen</Link>.
          </p>

          <h2 className={H2}>La Selva: la comunidad que hoy define la entrada a Playa</h2>
          <p className="text-ink-2 leading-relaxed mb-6">
            De los proyectos activos, <Link href="/desarrollos/la-selva-playa-del-carmen" className="text-accent hover:underline">La Selva</Link> es el desarrollo insignia de Urban Homes en la ciudad: una comunidad completa, no solo un edificio, con departamentos de <strong className="text-ink font-semibold">2 y 3 recámaras</strong> de entrega inmediata.
          </p>
          <p className="text-ink-2 leading-relaxed mb-6">
            El Modelo Terra (2 recámaras, 87 m², un cajón de estacionamiento) y el Modelo Amazonas (3 recámaras, 103 m², dos cajones) vienen equipados con cocineta, walk-in closets y aire acondicionado — listos para habitar o rentar desde el primer día. La comunidad suma cinco albercas familiares, canchas de pádel y pickleball, cancha deportiva, área de juegos, pet park y vigilancia 24/7.
          </p>
          <div className="relative aspect-[16/9] rounded-xl overflow-hidden mb-6">
            <Image
              src="/desarrollos/la-selva/alberca.avif"
              alt="Alberca de la comunidad La Selva Residences en Playa del Carmen"
              fill className="object-cover" sizes="(max-width:768px) 100vw, 768px"
            />
          </div>
          <p className="text-ink-2 leading-relaxed mb-10">
            Está ubicada a solo <strong className="text-ink font-semibold">6 minutos de Playa Xcalacoco</strong>, una de las playas más hermosas de la Riviera Maya, y a <strong className="text-ink font-semibold">12 minutos de la Quinta Avenida</strong> y de la Plaza Quinta Alegría. Al ser entrega inmediata, es hoy la vía más rápida para comprar en Playa del Carmen sin esperar a que termine la construcción.
          </p>

          <h2 className={H2}>¿Para quién tiene sentido Playa del Carmen?</h2>
          <div className="space-y-4 mb-10">
            {[
              { t: 'Para quien quiere vivir sin depender del coche', d: 'La caminabilidad de la zona alrededor de la Quinta Avenida es única en la región — un factor de calidad de vida que pesa tanto como el precio para muchos compradores.' },
              { t: 'Para renta vacacional con demanda estable', d: 'La comunidad internacional que ya reside en Playa sostiene una demanda de renta menos estacional que en destinos puramente turísticos.' },
              { t: 'Para entrega inmediata sin esperar obra', d: 'Con La Selva ya construido, se puede habitar o poner en renta desde el cierre de la compra, sin tiempos de espera de preventa.' },
              { t: 'No es la zona si buscas la mayor variedad de inventario', d: 'Hoy nuestro portafolio en Playa es más chico que en Cancún — si priorizas comparar entre muchos proyectos, Cancún tiene más opciones activas.' },
            ].map((item) => (
              <div key={item.t} className="p-5 rounded-xl border border-line bg-bg-soft">
                <h3 className="font-sans font-bold text-ink mb-1">{item.t}</h3>
                <p className="text-ink-2 text-sm leading-relaxed">{item.d}</p>
              </div>
            ))}
          </div>

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
            Playa del Carmen no compite con Cancún por escala, compite por estilo de vida: una ciudad caminable, con playa a pie y una comunidad internacional ya establecida. Para quien busca entrada inmediata sin esperar preventa, La Selva es hoy la opción más directa de la ciudad. Puedes revisar las{' '}
            <Link href="/playa-del-carmen" className="text-accent hover:underline">propiedades disponibles en Playa del Carmen</Link>{' '}
            o comparar contra el resto del{' '}
            <Link href="/cancun" className="text-accent hover:underline">catálogo de propiedades en Cancún</Link>{' '}
            antes de decidir.
          </p>

          {/* Related articles */}
          <h2 className="font-sans text-[clamp(20px,2.6vw,32px)] font-normal leading-[1.05] tracking-tight text-ink mt-16 mb-6">Artículos relacionados</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-4">
            {[
              { slug: 'vivir-en-puerto-cancun', title: 'Vivir en Puerto Cancún: Guía Completa de la Zona Más Exclusiva de Cancún', img: '/desarrollos/Vellmari/ENTREGAFINAL_CADU_VELMARI_AEREA01.jpg' },
              { slug: 'donde-comprar-departamento-en-cancun', title: 'Zona Hotelera vs. Puerto Cancún vs. Av. Huayacán: ¿Dónde Comprar Departamento en Cancún?', img: '/desarrollos/villalta/portada3.jpg' },
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
            title="¿Te interesa un departamento en Playa del Carmen?"
            subtitle="Un asesor te comparte disponibilidad real, precios y planes de pago de La Selva y los proyectos activos en la zona."
            image="/desarrollos/la-selva/aerial-acceso.avif"
            imageAlt="Comunidad La Selva Residences en Playa del Carmen"
            primaryHref="/playa-del-carmen"
            primaryLabel="Ver propiedades en Playa del Carmen"
            whatsappMessage="Hola, me interesa un departamento en Playa del Carmen"
          />
        </div>
      </div>
    </>
  );
}
