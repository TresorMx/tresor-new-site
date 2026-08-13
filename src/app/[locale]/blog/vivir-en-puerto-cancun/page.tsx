import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import BlogCTA from '@/components/BlogCTA';

// Estrategia de keywords (evitar canibalización con las páginas de dinero):
//   /puerto-cancun ................. "propiedades / departamentos EN VENTA en Puerto Cancún"  (catálogo)
//   /desarrollos/vellmari-...... ... "Vellmari"                                                (marca)
//   /departamentos-en-puerto-... ... landing de pauta, término transaccional
//   ESTE POST .................... "VIVIR en Puerto Cancún", "qué es Puerto Cancún"           (informacional)
// Por eso el H1/title/description NO usan "en venta" ni "comprar departamento":
// el post capta la búsqueda informacional y reparte enlaces a las páginas
// transaccionales, en vez de competir contra ellas.

const URL = 'https://www.tresor.mx/blog/vivir-en-puerto-cancun';
const TITLE = 'Vivir en Puerto Cancún: Guía Completa de la Zona Más Exclusiva de Cancún (2026)';
const DESCRIPTION =
  'Qué es Puerto Cancún, cómo es vivir dentro de sus 327 hectáreas con marina privada y campo de golf, cuánto cuesta entrar a la zona y qué residencias hay disponibles hoy.';
const HERO = '/desarrollos/Vellmari/ENTREGAFINAL_CADU_VELMARI_AEREA01.jpg';
const FECHA_ISO = '2026-07-24';
const FECHA = '24 de julio de 2026';

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  keywords: [
    'vivir en puerto cancun',
    'que es puerto cancun',
    'como es puerto cancun',
    'puerto cancun marina',
    'puerto cancun campo de golf',
    'cuanto cuesta vivir en puerto cancun',
    'zona residencial de lujo cancun',
    'puerto cancun fonatur',
  ],
  alternates: { canonical: URL },
  openGraph: {
    title: TITLE,
    description:
      'Marina privada, campo de golf de 18 hoyos y 327 hectáreas planeadas por FONATUR: cómo es realmente vivir en Puerto Cancún y cuánto cuesta entrar.',
    url: URL,
    type: 'article',
    publishedTime: FECHA_ISO,
    images: [{ url: `https://www.tresor.mx${HERO}`, width: 1920, height: 1080 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: TITLE,
    description:
      'Marina privada, golf de 18 hoyos y 327 hectáreas planeadas por FONATUR: cómo es vivir en Puerto Cancún y cuánto cuesta entrar.',
    images: [`https://www.tresor.mx${HERO}`],
  },
};

const FAQS = [
  {
    q: '¿Qué es exactamente Puerto Cancún?',
    a: 'Puerto Cancún es un desarrollo turístico-residencial planeado por FONATUR sobre 327 hectáreas, ubicado entre el centro de Cancún y el arranque de la Zona Hotelera. A diferencia de una colonia que creció de forma orgánica, nació con un plan maestro: marina privada para embarcaciones, campo de golf de 18 hoyos, plaza comercial, acceso controlado y lotes residenciales con densidad regulada.',
  },
  {
    q: '¿Cuánto cuesta vivir en Puerto Cancún?',
    a: 'Es el ticket de entrada más alto de Cancún. Hoy las residencias en el mercado dentro de la zona arrancan alrededor de $15,289,000 MXN y superan los $19,000,000 MXN según el desarrollo y la superficie. A eso hay que sumar la cuota de mantenimiento, que varía según el condominio y las amenidades — conviene confirmarla proyecto por proyecto con un asesor antes de decidir.',
  },
  {
    q: '¿Por qué Puerto Cancún tiene tanta plusvalía?',
    a: 'Por una razón estructural: la oferta es finita. Al ser un polígono cerrado y planeado, no puede expandirse ni densificarse libremente, y el suelo disponible es cada vez menor. Esa escasez, sumada al acceso controlado y a las amenidades de la zona, es lo que ha sostenido históricamente su valor por encima del resto de la ciudad.',
  },
  {
    q: '¿Qué tan lejos está del aeropuerto y de la Zona Hotelera?',
    a: 'Puerto Cancún está a minutos del arranque de la Zona Hotelera y con acceso directo a las vialidades que conectan con el Aeropuerto Internacional de Cancún. Es una de sus mayores ventajas prácticas: se vive en un entorno residencial cerrado sin quedar aislado de la ciudad ni de la playa.',
  },
  {
    q: '¿Se puede rentar una propiedad en Puerto Cancún?',
    a: 'Sí, y la zona tiene demanda tanto de renta residencial de largo plazo como vacacional por su cercanía a la playa y al golf. Las reglas de renta corta, sin embargo, dependen del reglamento interno de cada condominio, no de la zona en general: hay desarrollos que la permiten y otros que la restringen. Es una de las primeras cosas que hay que revisar si el objetivo es rentar.',
  },
  {
    q: '¿Qué residencias hay disponibles hoy en Puerto Cancún?',
    a: 'En nuestro portafolio hay dos opciones activas, ambas de Urban Homes: Vellmari, en preventa, con 98 residencias de 169 a 714 m² frente a la marina; y Blume, con entrega inmediata. La preventa ofrece mejor precio y planes de pago; la entrega inmediata permite habitar o rentar desde el primer día.',
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
      about: { '@type': 'Place', name: 'Puerto Cancún', address: { '@type': 'PostalAddress', addressLocality: 'Cancún', addressRegion: 'Quintana Roo', addressCountry: 'MX' } },
    },
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Inicio', item: 'https://www.tresor.mx' },
        { '@type': 'ListItem', position: 2, name: 'Blog', item: 'https://www.tresor.mx/blog' },
        { '@type': 'ListItem', position: 3, name: 'Vivir en Puerto Cancún', item: URL },
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
          alt="Vista aérea de Puerto Cancún: marina privada, campo de golf y desarrollos residenciales frente al mar Caribe"
          fill priority className="object-cover" sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/40 to-transparent" />
        <div className="absolute inset-0 flex flex-col justify-end px-6 pb-10 pt-[104px]">
          <div className="container-wrap">
            <p className="eyebrow eyebrow-accent mb-3">Guía de Zona</p>
            <h1 className="h-display text-[clamp(28px,4.5vw,52px)] text-white max-w-3xl leading-tight">
              Vivir en Puerto Cancún: guía completa de la zona más exclusiva de Cancún
            </h1>
            <div className="flex items-center gap-4 mt-4 text-white/60 text-sm">
              <span>{FECHA}</span>
              <span>·</span>
              <span>10 min de lectura</span>
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
            <li className="text-ink truncate max-w-[240px] md:max-w-none">Vivir en Puerto Cancún</li>
          </ol>
        </div>
      </nav>

      {/* Content */}
      <article className="py-16 px-6">
        <div className="max-w-3xl mx-auto">

          <p className="text-lg text-ink-2 leading-relaxed mb-8">
            Hay una diferencia importante entre comprar <em>en</em> Cancún y comprar <em>en</em> Puerto Cancún. La primera es una decisión de ciudad; la segunda es una decisión de entorno. Puerto Cancún no es una colonia más ni un fraccionamiento cerrado: es un polígono de 327 hectáreas planeado desde cero por FONATUR, con marina privada, campo de golf de 18 hoyos y acceso controlado, ubicado entre el centro de la ciudad y el arranque de la Zona Hotelera.
          </p>
          <p className="text-ink-2 leading-relaxed mb-8">
            Esa planeación es justamente lo que explica su precio y su plusvalía. En esta guía explicamos qué es Puerto Cancún, cómo es la vida ahí dentro, cuánto cuesta realmente entrar y qué residencias están disponibles hoy — incluyendo el proyecto que hoy marca el estándar de la zona.
          </p>

          <h2 className={H2}>Qué es Puerto Cancún</h2>
          <p className="text-ink-2 leading-relaxed mb-6">
            Puerto Cancún nació como un desarrollo turístico-residencial planeado por FONATUR, el organismo que en su momento diseñó la Cancún moderna. A diferencia de las zonas que crecieron por demanda y se fueron densificando sin plan, aquí el uso de suelo, la densidad, las vialidades y las áreas comunes se definieron antes de construir la primera torre.
          </p>
          <p className="text-ink-2 leading-relaxed mb-6">
            El resultado es un entorno con tres piezas que ninguna otra zona de Cancún reúne al mismo tiempo:
          </p>
          <ul className="space-y-3 mb-10 text-ink-2">
            {[
              ['Marina privada', 'Con posiciones para embarcaciones dentro del propio desarrollo — no es un club náutico al que se llega en coche, es parte del paisaje cotidiano de la zona.'],
              ['Campo de golf de 18 hoyos', 'Integrado al trazo residencial, lo que además funciona como una enorme reserva de área verde que ninguna torre puede ocupar.'],
              ['Plaza comercial de primer nivel', 'Comercio, restaurantes y servicios dentro del polígono, sin necesidad de salir a la ciudad para el día a día.'],
            ].map(([t, d]) => (
              <li key={t} className="flex gap-3">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                <span><strong className="text-ink font-semibold">{t}:</strong> {d}</span>
              </li>
            ))}
          </ul>

          <h2 className={H2}>Puerto Cancún de un vistazo</h2>
          <div className="overflow-x-auto mb-10 -mx-6 px-6 md:mx-0 md:px-0">
            <table className="w-full text-sm border-collapse min-w-[520px]">
              <tbody className="text-ink-2">
                {[
                  ['Superficie del desarrollo', '327 hectáreas'],
                  ['Planeación', 'FONATUR — plan maestro turístico-residencial'],
                  ['Amenidades de zona', 'Marina privada, golf de 18 hoyos, plaza comercial'],
                  ['Ubicación', 'Entre el centro de Cancún y el inicio de la Zona Hotelera'],
                  ['Acceso', 'Controlado, con vigilancia'],
                  ['Precio de entrada (2026)', 'Desde ~$15,289,000 MXN'],
                  ['Perfil', 'Residencia principal de alto patrimonio, segunda residencia y inversión patrimonial'],
                ].map(([k, v]) => (
                  <tr key={k} className="border-b border-line">
                    <td className="py-3 pr-6 font-semibold text-ink whitespace-nowrap align-top">{k}</td>
                    <td className="py-3">{v}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <h2 className={H2}>Cómo es vivir en Puerto Cancún</h2>
          <p className="text-ink-2 leading-relaxed mb-6">
            La descripción más honesta de la zona es esta: se vive en un entorno cerrado y de baja fricción, sin quedar aislado. Estás a minutos del arranque de la Zona Hotelera y con conexión directa a las vialidades que llevan al Aeropuerto Internacional de Cancún — algo que importa mucho si viajas seguido o si la propiedad va a funcionar como segunda residencia.
          </p>
          <p className="text-ink-2 leading-relaxed mb-6">
            Al mismo tiempo, el acceso controlado y la densidad regulada hacen que el día a día se sienta distinto al de la Zona Hotelera, que vive al ritmo del turismo. Puerto Cancún es residencial primero: la marina, el golf y la plaza comercial están ahí para quienes viven en el polígono, no para el flujo turístico masivo.
          </p>
          <p className="text-ink-2 leading-relaxed mb-10">
            Si estás comparando Puerto Cancún contra otras zonas de la ciudad antes de decidir, te puede servir nuestra{' '}
            <Link href="/blog/donde-comprar-departamento-en-cancun" className="text-accent hover:underline">
              comparativa entre Zona Hotelera, Puerto Cancún y Av. Huayacán
            </Link>, donde analizamos precio de entrada, perfil de comprador y plusvalía de cada una.
          </p>

          <h2 className={H2}>Cuánto cuesta entrar a Puerto Cancún</h2>
          <p className="text-ink-2 leading-relaxed mb-6">
            Puerto Cancún tiene el ticket de entrada más alto de la ciudad, y no por casualidad: la oferta es estructuralmente finita. Al ser un polígono cerrado con plan maestro, no puede expandirse ni densificarse libremente. Cada torre nueva reduce el suelo disponible y no hay forma de crear más.
          </p>
          <p className="text-ink-2 leading-relaxed mb-6">
            Hoy, las residencias activas dentro de la zona arrancan alrededor de <strong className="text-ink font-semibold">$15,289,000 MXN</strong> y superan los <strong className="text-ink font-semibold">$19,000,000 MXN</strong> según el desarrollo, la superficie y el nivel. Un punto que suele pasarse por alto: además del precio de compra hay que considerar la cuota de mantenimiento, que cambia bastante entre condominios según las amenidades que operan. Conviene pedirla por escrito, proyecto por proyecto, antes de comparar.
          </p>

          <h2 className={H2}>Qué se puede comprar hoy en Puerto Cancún</h2>
          <p className="text-ink-2 leading-relaxed mb-6">
            En nuestro portafolio hay dos residenciales activos en la zona, ambos de{' '}
            <Link href="/urban-homes" className="text-accent hover:underline">Urban Homes</Link>, que responden a dos momentos de compra distintos:
          </p>
          <div className="grid gap-5 sm:grid-cols-2 mb-10">
            {[
              {
                name: 'Vellmari',
                tag: 'Preventa',
                href: '/desarrollos/vellmari-puerto-cancun',
                price: 'Desde $15,289,000 MXN',
                desc: '98 residencias en dos torres frente a la marina, de 169 a 714 m², con penthouses de doble vista.',
                img: '/desarrollos/Vellmari/ENTREGAFINAL_CADU_VELMARI_FACHADA04.jpg',
              },
              {
                name: 'Blume',
                tag: 'Entrega inmediata',
                href: '/desarrollos/blume-urban',
                price: 'Desde $19,256,000 MXN',
                desc: 'Listo para habitar o rentar desde el primer día, sin esperar el cierre de obra.',
                img: '/desarrollos/Blume/BLUME-Drone-1.jpg',
              },
            ].map((d) => (
              <Link key={d.name} href={d.href} className="group rounded-xl overflow-hidden border border-line hover:shadow-md transition-shadow">
                <div className="relative aspect-video">
                  <Image src={d.img} alt={`${d.name} — residencias en Puerto Cancún`} fill className="object-cover group-hover:scale-105 transition-transform duration-500" sizes="(max-width:640px) 100vw, 340px" />
                  <span className="absolute left-3 top-3 rounded-full bg-white/95 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-ink">{d.tag}</span>
                </div>
                <div className="p-4">
                  <p className="font-semibold text-ink group-hover:text-accent transition-colors">{d.name}</p>
                  <p className="text-accent text-xs font-medium mt-0.5">{d.price}</p>
                  <p className="text-ink-2 text-sm leading-relaxed mt-2">{d.desc}</p>
                </div>
              </Link>
            ))}
          </div>
          <p className="text-ink-2 leading-relaxed mb-10">
            Si quieres ver el inventario completo de la zona, incluyendo lo que se vaya sumando, está en{' '}
            <Link href="/puerto-cancun" className="text-accent hover:underline">propiedades en venta en Puerto Cancún</Link>.
          </p>

          <h2 className={H2}>Vellmari: el proyecto que hoy marca el estándar de la zona</h2>
          <p className="text-ink-2 leading-relaxed mb-6">
            De los proyectos activos, <Link href="/desarrollos/vellmari-puerto-cancun" className="text-accent hover:underline">Vellmari</Link> es el que mejor resume la lógica de Puerto Cancún: pocas unidades, superficies grandes y frente de marina. Son <strong className="text-ink font-semibold">98 residencias</strong> distribuidas en dos torres —Sur y Norte—, con tipologías que van de <strong className="text-ink font-semibold">169 m² a 714 m²</strong>.
          </p>
          <p className="text-ink-2 leading-relaxed mb-6">
            Ese rango es inusual incluso para la zona: significa que en el mismo desarrollo conviven departamentos de dos recámaras con penthouses de doble vista de más de 700 m². Para un comprador patrimonial, esa mezcla importa, porque define el perfil de vecino y la liquidez futura del activo.
          </p>
          <div className="relative aspect-[16/9] rounded-xl overflow-hidden mb-6">
            <Image
              src="/desarrollos/Vellmari/ENTREGAFINAL_CADU_VELMARI_AMENIDADES09.jpg"
              alt="Alberca frente al mar Caribe en Vellmari, Puerto Cancún"
              fill className="object-cover" sizes="(max-width:768px) 100vw, 768px"
            />
          </div>
          <p className="text-ink-2 leading-relaxed mb-6">
            En amenidades propias suma marina, albercas, spa y sauna, gimnasio, cancha de pádel, business center, kid&apos;s club y lounge bar — es decir, no depende únicamente de las amenidades de zona. Al estar en <strong className="text-ink font-semibold">preventa</strong>, es también la vía de entrada más accesible al polígono hoy, con planes de pago durante la obra.
          </p>
          <p className="text-ink-2 leading-relaxed mb-10">
            Si es tu primera compra en preventa, vale la pena leer antes nuestra{' '}
            <Link href="/blog/guia-comprar-en-preventa-cancun" className="text-accent hover:underline">guía para comprar en preventa en Cancún</Link>: qué revisar del contrato, cómo funcionan los pagos y qué riesgos vigilar.
          </p>

          <h2 className={H2}>¿Para quién tiene sentido Puerto Cancún?</h2>
          <div className="space-y-4 mb-10">
            {[
              { t: 'Para quien busca patrimonio, no rendimiento rápido', d: 'La escasez de suelo protege el valor en el largo plazo. Es una compra de preservación patrimonial más que de flujo agresivo.' },
              { t: 'Para segunda residencia con uso real', d: 'La cercanía al aeropuerto y el acceso controlado hacen viable usarla algunas semanas al año sin complicaciones logísticas ni de seguridad.' },
              { t: 'Para quien quiere lujo residencial, no ritmo turístico', d: 'Si buscas playa con vida nocturna y flujo constante de visitantes, la Zona Hotelera responde mejor a ese perfil que Puerto Cancún.' },
              { t: 'No es la zona si tu prioridad es el precio de entrada', d: 'Con un arranque cercano a los $14.8 MDP, hay zonas de Cancún con ticket muy inferior y mayor crecimiento porcentual proyectado.' },
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
            Puerto Cancún no compite por precio y no pretende hacerlo: compite por escasez. Es un polígono planeado que no puede crecer, con marina y golf dentro, a minutos de la playa y del aeropuerto. Para el comprador correcto —el que busca patrimonio y entorno antes que rendimiento inmediato— es la zona más sólida de Cancún. Puedes revisar las{' '}
            <Link href="/puerto-cancun" className="text-accent hover:underline">propiedades disponibles en Puerto Cancún</Link>{' '}
            o comparar contra el resto del{' '}
            <Link href="/cancun" className="text-accent hover:underline">catálogo de propiedades en Cancún</Link>{' '}
            antes de decidir.
          </p>

          {/* Related articles */}
          <h2 className="font-sans text-[clamp(20px,2.6vw,32px)] font-normal leading-[1.05] tracking-tight text-ink mt-16 mb-6">Artículos relacionados</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-4">
            {[
              { slug: 'donde-comprar-departamento-en-cancun', title: 'Zona Hotelera vs. Puerto Cancún vs. Av. Huayacán: ¿Dónde Comprar Departamento en Cancún?', img: '/desarrollos/villalta/portada3.jpg' },
              { slug: 'guia-comprar-en-preventa-cancun', title: 'Guía para Comprar en Preventa en Cancún: Todo lo que Debes Saber', img: '/blog/AdobeStock_887006964.jpeg' },
              { slug: 'vivir-en-playa-del-carmen', title: 'Vivir en Playa del Carmen: Guía Completa de la Riviera Maya', img: '/desarrollos/la-selva/aerial-comunidad.avif' },
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
            title="¿Te interesa una residencia en Puerto Cancún?"
            subtitle="Un asesor te comparte disponibilidad real, precios y planes de pago de los proyectos activos en la zona."
            image="/desarrollos/Vellmari/ENTREGAFINAL_CADU_VELMARI_FACHADA04.jpg"
            imageAlt="Residencias de Vellmari frente a la marina de Puerto Cancún"
            primaryHref="/puerto-cancun"
            primaryLabel="Ver propiedades en Puerto Cancún"
            whatsappMessage="Hola, me interesa una residencia en Puerto Cancún"
          />
        </div>
      </div>
    </>
  );
}
