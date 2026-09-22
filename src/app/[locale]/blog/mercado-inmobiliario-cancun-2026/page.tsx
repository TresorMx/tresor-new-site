import type { Metadata } from 'next';
import { blogModified } from '@/lib/blogDates';
import { saleCondos, priceNumber, mxn } from '@/lib/blogCatalog';
import Image from 'next/image';
import Link from 'next/link';
import BlogCTA from '@/components/BlogCTA';

// Keyword informacional "mercado inmobiliario Cancún 2026" / "cómo está el
// mercado inmobiliario en Cancún" — nadie del portafolio la ataca: los demás
// posts son de zona (vivir en…), de tipo (terrenos, locales) o de catálogo
// (desarrollos inmobiliarios). Este responde "¿es buen momento?" y reparte
// enlaces a las páginas transaccionales sin usar su keyword en el title.
//
// SOBRE LAS CIFRAS: solo se citan datos con fuente nombrada y enlazada.
//   - AMPI Cancún (Dafnee Fuentes Trujillo, presidenta), nota del 12/ago/2026:
//     caída ~30% de actividad en julio–agosto, atribuida a temporada; primeros
//     7 meses positivos pero debajo de lo esperado; esperan repunte al cierre.
//   - Riviera Maya, nota del 17/jun/2026: desaceleración por exceso de oferta,
//     "reajuste natural". La nota NO da cifras ni fuente con nombre → se cita
//     solo cualitativamente.
//   - Una cifra de caída en Tulum que circula en redes NO tiene fuente
//     verificable → no se usa.
// Los precios salen del catálogo en vivo (lib/blogCatalog), no escritos a mano.

export const revalidate = 3600;

const SLUG = 'mercado-inmobiliario-cancun-2026';
const URL = `https://www.tresor.mx/blog/${SLUG}`;
const TITLE = 'Mercado Inmobiliario en Cancún 2026: Qué Está Pasando y Cómo Comprar';
const DESCRIPTION =
  'El mercado inmobiliario de Cancún se enfrió en 2026. Qué dicen AMPI y la prensa local, por qué eso cambia la negociación a favor del comprador y qué revisar antes de comprar.';
// Foto real de Blume (Puerto Cancún) — abierta y revisada: alberca y muelle
// sobre la marina, vista cenital. 1639×1092, horizontal.
const HERO = '/desarrollos/Blume/BLUME-Drone-5.jpg';
const FECHA_ISO = '2026-09-22';
const FECHA = '22 de septiembre de 2026';

const SRC_AMPI =
  'https://www.marcrixnoticias.com.mx/cancun-resiste-baja-inmobiliaria-y-espera-repunte-al-cierre-de-2026/';
const SRC_RIVIERA =
  'https://www.marcrixnoticias.com.mx/se-desacelera-la-venta-inmobiliaria-en-la-riviera-maya-por-exceso-de-oferta/';

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  keywords: [
    'mercado inmobiliario cancun 2026',
    'como esta el mercado inmobiliario en cancun',
    'es buen momento para comprar en cancun',
    'mercado inmobiliario riviera maya',
    'ampi cancun',
    'sobreoferta departamentos cancun',
  ],
  alternates: { canonical: URL },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: URL,
    type: 'article',
    publishedTime: FECHA_ISO,
    images: [{ url: `https://www.tresor.mx${HERO}`, width: 1639, height: 1092 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: TITLE,
    description: DESCRIPTION,
    images: [`https://www.tresor.mx${HERO}`],
  },
};

const FAQS = [
  {
    q: '¿Cómo está el mercado inmobiliario en Cancún en 2026?',
    a: 'Más lento que en años anteriores. Según AMPI Cancún, la actividad cayó alrededor de 30% en julio y agosto de 2026 —lo atribuyen a la temporada de verano— y los primeros siete meses del año fueron positivos pero por debajo de lo esperado. En la Riviera Maya, la prensa local reporta una desaceleración asociada a exceso de oferta. No es un desplome: es un mercado con más inventario que compradores en varios segmentos.',
  },
  {
    q: '¿Es buen momento para comprar en Cancún?',
    a: 'Para el comprador, un mercado lento suele significar más margen para negociar condiciones —plan de pagos, enganche, fechas— y más tiempo para comparar sin la presión de "se va a acabar". Eso no significa que cualquier propiedad sea buena compra: con más oferta, elegir bien el proyecto y la ubicación pesa más, no menos.',
  },
  {
    q: '¿Van a bajar los precios de los departamentos en Cancún?',
    a: 'Nadie puede prometerlo con seriedad. Lo que sí cambia en un mercado lento es que los desarrolladores tienden a flexibilizar condiciones antes que bajar el precio de lista. Por eso conviene preguntar por planes de pago y beneficios concretos por escrito, no solo por el precio.',
  },
  {
    q: '¿Qué conviene más ahora: preventa o entrega inmediata?',
    a: 'Con más oferta en el mercado, la entrega inmediata gana atractivo: ves exactamente lo que compras, eliminas el riesgo de obra y la propiedad puede habitarse o rentarse desde el cierre. La preventa sigue teniendo sentido si el precio de entrada es claramente menor y el desarrollador tiene historial de entregas cumplidas.',
  },
  {
    q: '¿Qué pasa con la sobreoferta en la Riviera Maya?',
    a: 'La prensa local reporta que la venta se desaceleró en la Riviera Maya por exceso de oferta y lo describe como un reajuste natural del mercado. Para el comprador la consecuencia práctica es la misma: más opciones, más competencia entre proyectos y más razones para verificar el historial del desarrollador antes de firmar.',
  },
];

const H2 = 'font-sans text-[clamp(24px,3.2vw,48px)] font-normal leading-[1.05] tracking-tight text-ink mt-12 mb-6';

export default async function ArticlePage() {
  // Departamentos de entrega inmediata, en vivo del catálogo, de menor a mayor.
  const ready = (await saleCondos())
    .filter((d) => d.status === 'Entrega inmediata')
    .map((d) => ({ d, price: priceNumber(d) }))
    .filter((x): x is { d: (typeof x)['d']; price: number } => x.price != null)
    .sort((a, b) => a.price - b.price);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Article',
        headline: TITLE,
        description: DESCRIPTION,
        datePublished: FECHA_ISO,
        dateModified: blogModified(SLUG, FECHA_ISO),
        author: { '@type': 'Organization', name: 'Tresor Real Estate', url: 'https://www.tresor.mx' },
        publisher: {
          '@type': 'Organization',
          name: 'Tresor Real Estate',
          logo: 'https://www.tresor.mx/logos/LogoTresor-ink.svg',
        },
        image: `https://www.tresor.mx${HERO}`,
        mainEntityOfPage: URL,
        citation: [SRC_AMPI, SRC_RIVIERA],
        about: { '@type': 'Place', name: 'Cancún', address: { '@type': 'PostalAddress', addressLocality: 'Cancún', addressRegion: 'Quintana Roo', addressCountry: 'MX' } },
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Inicio', item: 'https://www.tresor.mx' },
          { '@type': 'ListItem', position: 2, name: 'Blog', item: 'https://www.tresor.mx/blog' },
          { '@type': 'ListItem', position: 3, name: 'Mercado inmobiliario en Cancún 2026', item: URL },
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

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* Hero */}
      <div data-nav="dark" className="relative -mt-[72px] h-[55vh] min-h-[400px] overflow-hidden">
        <Image
          src={HERO}
          alt="Vista cenital de la alberca y el muelle de un condominio sobre la marina de Puerto Cancún"
          fill priority className="object-cover" sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/40 to-transparent" />
        <div className="absolute inset-0 flex flex-col justify-end px-6 pb-10 pt-[104px]">
          <div className="container-wrap">
            <p className="eyebrow eyebrow-accent mb-3">Mercado</p>
            <h1 className="h-display text-[clamp(28px,4.5vw,52px)] text-white max-w-3xl leading-tight">
              Mercado inmobiliario en Cancún 2026: qué está pasando y cómo comprar
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
            <li className="text-ink truncate max-w-[240px] md:max-w-none">Mercado inmobiliario en Cancún 2026</li>
          </ol>
        </div>
      </nav>

      <article className="py-16 px-6">
        <div className="max-w-3xl mx-auto">

          <p className="text-lg text-ink-2 leading-relaxed mb-8">
            Si estás pensando en comprar en Cancún, probablemente ya notaste que el ambiente cambió. Después de varios años en los que la conversación era "compra antes de que suba", 2026 se siente distinto: más inventario, menos prisa y compradores que se toman su tiempo.
          </p>
          <p className="text-ink-2 leading-relaxed mb-8">
            Aquí explicamos qué dicen las fuentes locales —con enlace a cada una—, qué significa eso en la práctica para quien compra y qué revisar para que un mercado lento juegue a tu favor y no en tu contra.
          </p>

          <h2 className={H2}>Lo que dicen los datos</h2>
          <p className="text-ink-2 leading-relaxed mb-6">
            La referencia más clara viene de la Asociación Mexicana de Profesionales Inmobiliarios en Cancún. Su presidenta, Dafnee Fuentes Trujillo, reportó en agosto una{' '}
            <strong className="text-ink font-semibold">caída de alrededor de 30% en la actividad durante julio y agosto de 2026</strong>, que atribuye principalmente a la temporada de verano. También señaló que los primeros siete meses del año fueron positivos, aunque por debajo de lo esperado, y que el gremio espera un repunte hacia el cierre del año (
            <a href={SRC_AMPI} target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">nota completa</a>).
          </p>
          <p className="text-ink-2 leading-relaxed mb-6">
            Más al sur, la prensa local reportó en junio que la venta inmobiliaria en la Riviera Maya se desaceleró por{' '}
            <strong className="text-ink font-semibold">exceso de oferta</strong>, y lo describió como un reajuste natural después de años de construcción acelerada (
            <a href={SRC_RIVIERA} target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">nota completa</a>). La nota no publica cifras, así que aquí tampoco inventamos una.
          </p>
          <div className="overflow-x-auto mb-10 -mx-6 px-6 md:mx-0 md:px-0">
            <table className="w-full text-sm border-collapse min-w-[520px]">
              <tbody className="text-ink-2">
                {[
                  ['Actividad en Cancún, jul–ago 2026', '≈ −30% (AMPI Cancún, atribuido a temporada)'],
                  ['Enero–julio 2026', 'Positivo, pero debajo de lo esperado (AMPI Cancún)'],
                  ['Riviera Maya', 'Desaceleración por exceso de oferta (prensa local, sin cifra)'],
                  ['Expectativa del gremio', 'Repunte hacia el cierre de 2026'],
                ].map(([k, v]) => (
                  <tr key={k} className="border-b border-line">
                    <td className="py-3 pr-6 font-semibold text-ink whitespace-nowrap align-top">{k}</td>
                    <td className="py-3">{v}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <h2 className={H2}>Qué no cambió</h2>
          <p className="text-ink-2 leading-relaxed mb-6">
            Un trimestre flojo no cambia por qué la gente compra en Cancún. Los motores de fondo siguen ahí:
          </p>
          <ul className="space-y-3 mb-10 text-ink-2">
            {[
              ['Conectividad', 'El Aeropuerto Internacional de Cancún es el segundo con más pasajeros del país, con vuelos directos a Estados Unidos, Canadá, Europa y Latinoamérica.'],
              ['Infraestructura nueva', 'El Tren Maya y el aeropuerto internacional de Tulum empezaron a operar a finales de 2023, y la región todavía se está ajustando a esa nueva conectividad.'],
              ['Economía más allá del hotel', 'Cancún es una ciudad de casi un millón de habitantes con comercio, servicios y una demanda de vivienda local que no depende solo del turista.'],
            ].map(([t, d]) => (
              <li key={t} className="flex gap-3">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                <span><strong className="text-ink font-semibold">{t}:</strong> {d}</span>
              </li>
            ))}
          </ul>

          <h2 className={H2}>Qué significa un mercado lento para el comprador</h2>
          <p className="text-ink-2 leading-relaxed mb-6">
            Cuando hay más inventario que compradores, el poder de negociación se mueve hacia quien compra. En la práctica, eso rara vez se ve como una baja en el precio de lista; se ve en las condiciones:
          </p>
          <div className="space-y-4 mb-10">
            {[
              { t: 'Planes de pago más flexibles', d: 'Enganches menores, más mensualidades o pagos contra avance de obra. Pídelos por escrito y compáralos entre proyectos.' },
              { t: 'Tiempo para comparar', d: 'Sin la presión de "quedan pocas unidades", puedes visitar, pedir la lista de precios completa y revisar con calma el historial del desarrollador.' },
              { t: 'Mejor elección de unidad', d: 'Con menos competencia, es más fácil conseguir la ubicación, el piso o la vista que realmente quieres dentro del proyecto.' },
              { t: 'Pero más riesgo de elegir mal', d: 'Con sobreoferta, no todos los proyectos van a venderse al mismo ritmo. Un desarrollo que tarde en venderse puede tardar en terminarse. La selección importa más que nunca.' },
            ].map((item) => (
              <div key={item.t} className="p-5 rounded-xl border border-line bg-bg-soft">
                <h3 className="font-sans font-bold text-ink mb-1">{item.t}</h3>
                <p className="text-ink-2 text-sm leading-relaxed">{item.d}</p>
              </div>
            ))}
          </div>

          <h2 className={H2}>Por qué la entrega inmediata gana peso en 2026</h2>
          <p className="text-ink-2 leading-relaxed mb-6">
            En un mercado con exceso de oferta, el riesgo principal de una preventa no es el precio: es que el proyecto tarde más de lo prometido. La entrega inmediata elimina ese riesgo —ves exactamente lo que compras— y la propiedad puede habitarse o rentarse desde el cierre. Estos son los departamentos de entrega inmediata en nuestro portafolio hoy, de menor a mayor precio de entrada:
          </p>
          <div className="overflow-x-auto mb-6 -mx-6 px-6 md:mx-0 md:px-0">
            <table className="w-full text-sm border-collapse min-w-[520px]">
              <thead>
                <tr className="border-b border-line text-left">
                  <th className="py-3 pr-6 font-semibold text-ink">Desarrollo</th>
                  <th className="py-3 pr-6 font-semibold text-ink">Ciudad</th>
                  <th className="py-3 font-semibold text-ink">Desde</th>
                </tr>
              </thead>
              <tbody className="text-ink-2">
                {ready.map(({ d, price }) => (
                  <tr key={d.slug} className="border-b border-line">
                    <td className="py-3 pr-6 font-semibold text-ink whitespace-nowrap">
                      <Link href={d.href} className="hover:text-accent transition-colors">{d.name}</Link>
                    </td>
                    <td className="py-3 pr-6">{d.city}</td>
                    <td className="py-3">{mxn(price)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-[13px] font-light leading-relaxed text-ink-3 mb-10">
            Precios de lista vigentes en nuestro catálogo, sujetos a cambio y disponibilidad. La tabla se actualiza automáticamente con el inventario.
          </p>
          <p className="text-ink-2 leading-relaxed mb-10">
            La preventa no deja de tener sentido: si el precio de entrada es claramente menor y el desarrollador tiene entregas cumplidas, sigue siendo la forma de comprar con más plusvalía potencial. Comparamos las dos rutas a detalle en nuestra{' '}
            <Link href="/blog/guia-comprar-en-preventa-cancun" className="text-accent hover:underline">guía para comprar en preventa en Cancún</Link>.
          </p>

          <h2 className={H2}>Checklist para comprar en un mercado lento</h2>
          <ol className="space-y-3 mb-10 text-ink-2 list-decimal pl-5">
            <li><strong className="text-ink font-semibold">Historial del desarrollador:</strong> ¿cuántos proyectos ha entregado y con qué retraso? Visita uno terminado.</li>
            <li><strong className="text-ink font-semibold">Avance real de obra:</strong> en preventa, pide el calendario y compáralo con lo que ves en sitio.</li>
            <li><strong className="text-ink font-semibold">Condiciones por escrito:</strong> plan de pagos, fecha de entrega y penalizaciones, en el contrato, no en un mensaje.</li>
            <li><strong className="text-ink font-semibold">Ritmo de ventas del proyecto:</strong> pregunta cuántas unidades se han vendido. Un proyecto estancado es una señal.</li>
            <li><strong className="text-ink font-semibold">Reglamento de condominio:</strong> si piensas rentar, confirma que la renta corta está permitida en ese edificio.</li>
            <li><strong className="text-ink font-semibold">Costo total:</strong> suma impuestos, notaría y mantenimiento mensual al precio de lista antes de comparar.</li>
          </ol>

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
            El mercado de Cancún en 2026 no está roto; está más lento y con más inventario. Para quien vende eso es un problema; para quien compra con criterio es una ventaja: más tiempo, más opciones y más margen para negociar condiciones. La clave es no confundir "hay mucho para elegir" con "cualquier cosa es buena compra". Puedes revisar los{' '}
            <Link href="/departamentos-en-venta-cancun" className="text-accent hover:underline">departamentos en venta en Cancún</Link>{' '}
            por precio y etapa, o ver el{' '}
            <Link href="/desarrollos" className="text-accent hover:underline">portafolio completo de desarrollos</Link>{' '}
            en Cancún, Playa del Carmen y Tulum.
          </p>
          <p className="text-[13px] font-light leading-relaxed text-ink-3 mb-4">
            Este artículo es información general, no asesoría de inversión, legal ni fiscal. No se garantiza plusvalía, rendimiento ni variación de precios. Las cifras de mercado citadas son de terceros y corresponden a la fecha de publicación de cada nota.
          </p>

          {/* Related articles */}
          <h2 className="font-sans text-[clamp(20px,2.6vw,32px)] font-normal leading-[1.05] tracking-tight text-ink mt-16 mb-6">Artículos relacionados</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-4">
            {[
              { slug: 'donde-comprar-departamento-en-cancun', title: 'Zona Hotelera vs. Puerto Cancún vs. Av. Huayacán: ¿Dónde Comprar Departamento en Cancún?', img: '/desarrollos/villalta/portada3.jpg' },
              { slug: 'guia-comprar-en-preventa-cancun', title: 'Guía para Comprar en Preventa en Cancún: Todo lo que Debes Saber', img: '/blog/AdobeStock_887006964.jpeg' },
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
          <BlogCTA
            eyebrow="Tresor Real Estate"
            title="¿Quieres comparar opciones con calma?"
            subtitle="Un asesor te comparte disponibilidad real, precios y planes de pago de los proyectos de entrega inmediata y preventa."
            image="/desarrollos/villalta/portada3.jpg"
            imageAlt="Torre residencial en Cancún"
            primaryHref="/departamentos-en-venta-cancun"
            primaryLabel="Ver departamentos en Cancún"
            whatsappMessage="Hola, quiero comparar departamentos de entrega inmediata en Cancún"
          />
        </div>
      </div>
    </>
  );
}
