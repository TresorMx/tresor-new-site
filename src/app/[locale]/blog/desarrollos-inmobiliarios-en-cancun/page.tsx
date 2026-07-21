import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import BlogCTA from '@/components/BlogCTA';

export const metadata: Metadata = {
  title: 'Desarrollos Inmobiliarios en Cancún 2026: Guía Completa y Proyectos Destacados',
  description:
    'Los mejores desarrollos inmobiliarios en Cancún en 2026: comerciales, residenciales y en preventa. Zonas, precios, plusvalía y proyectos activos de Tresor Real Estate.',
  keywords: [
    'desarrollos inmobiliarios en cancun',
    'desarrollos inmobiliarios cancun',
    'nuevos desarrollos cancun',
    'inversion inmobiliaria cancun 2026',
    'preventa cancun 2026',
    'desarrolladoras inmobiliarias cancun',
  ],
  alternates: {
    canonical: 'https://www.tresor.mx/blog/desarrollos-inmobiliarios-en-cancun',
  },
  openGraph: {
    title: 'Desarrollos Inmobiliarios en Cancún 2026: Guía Completa y Proyectos Destacados',
    description:
      'Comerciales, residenciales, lotes y preventas: el mapa completo de los desarrollos inmobiliarios más relevantes de Cancún en 2026.',
    url: 'https://www.tresor.mx/blog/desarrollos-inmobiliarios-en-cancun',
    images: [{ url: '/renders/long-island/01.jpg', width: 1920, height: 1080 }],
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'Desarrollos Inmobiliarios en Cancún 2026: Guía Completa y Proyectos Destacados',
  datePublished: '2026-07-18',
  dateModified: '2026-07-18',
  author: { '@type': 'Organization', name: 'Tresor Real Estate' },
  publisher: {
    '@type': 'Organization',
    name: 'Tresor Real Estate',
    logo: 'https://www.tresor.mx/logos/LogoTresor-ink.svg',
  },
  image: 'https://www.tresor.mx/renders/long-island/01.jpg',
  mainEntityOfPage: 'https://www.tresor.mx/blog/desarrollos-inmobiliarios-en-cancun',
};

const featured = [
  {
    name: 'Quattro Plaza Center Long Island',
    href: '/desarrollos/long-island',
    img: '/renders/long-island/01.jpg',
    developer: 'Tresor Real Estate',
    tag: 'Comercial · Preventa',
    price: 'Desde $2,650,000 MXN + IVA',
    detail: '30 locales desde 40 m² · 120 m lineales de frente comercial · entrega DIC 2026–MAR 2027',
  },
  {
    name: 'Quattro Plaza Center Gardens',
    href: '/desarrollos/gardens',
    img: '/renders/gardens/03.jpg',
    developer: 'Tresor Real Estate',
    tag: 'Comercial · Preventa',
    price: 'Desde $1,968,600 MXN + IVA',
    detail: '32 locales desde 32 m² · diseño con vegetación integrada · entrega JUN–SEP 2027',
  },
  {
    name: 'Esther Wow Condos',
    href: '/desarrollos/esther-wow-condos',
    img: '/desarrollos/esther/Vista-dron.jpg',
    developer: 'Live Desarrollos',
    tag: 'Residencial · Preventa',
    price: 'Desde $3,500,000 MXN',
    detail: 'Departamentos con amenidades de alto nivel en una de las zonas de mayor plusvalía de Cancún',
  },
  {
    name: 'Ximena Wow Condos',
    href: '/desarrollos/ximena-wow-condos',
    img: '/desarrollos/ximena/2.-Fachada-de-Noche.jpg',
    developer: 'Live Desarrollos',
    tag: 'Residencial · Preventa',
    price: 'Desde $3,500,000 MXN',
    detail: 'Hermana de Esther: mismo estándar de diseño, distintas tipologías disponibles',
  },
  {
    name: 'Loreta Wow Condos',
    href: '/desarrollos/loreta-wow-condos',
    img: '/desarrollos/loreta/5.-Vista-Drone.jpg',
    developer: 'Live Desarrollos',
    tag: 'Residencial · Preventa',
    price: 'Desde $3,800,000 MXN',
    detail: 'El proyecto más reciente de la línea Wow Condos, con tipologías de 1 a 3 recámaras',
  },
  {
    name: 'Olivia Wow Condos',
    href: '/desarrollos/olivia-wow-condos',
    img: '/desarrollos/olivia/5.-Fachada-frontal.jpg',
    developer: 'Live Desarrollos',
    tag: 'Residencial · Preventa',
    price: 'Desde $2,613,000 MXN',
    detail: 'El punto de entrada más accesible de Live Desarrollos en Cancún',
  },
  {
    name: 'Koa',
    href: '/desarrollos/koa-onix',
    img: '/desarrollos/koa/AEREO_01.jpg',
    developer: 'Onix Living',
    tag: 'Residencial · Entrega inmediata',
    price: 'Desde $3,500,000 MXN',
    detail: 'Departamentos listos para habitar o rentar de inmediato, con amenidades completas',
  },
  {
    name: 'Villalta',
    href: '/desarrollos/villalta-onix',
    img: '/desarrollos/villalta/portada3.jpg',
    developer: 'Onix Living',
    tag: 'Residencial · Entrega inmediata',
    price: 'Desde $5,000,000 MXN',
    detail: 'Un producto residencial premium de Onix Living con entrega inmediata',
  },
  {
    name: 'Zienna',
    href: '/desarrollos/zienna-onix',
    img: '/desarrollos/zienna/portadazienna.jpg',
    developer: 'Onix Living',
    tag: 'Lotes residenciales · Preventa',
    price: 'Desde $1,750,000 MXN',
    detail: 'Lotes residenciales dentro de un desarrollo con casa club y áreas comunes completas',
  },
  {
    name: 'Valmira',
    href: '/desarrollos/valmira-urban',
    img: '/desarrollos/Valmira/portadaValmira.jpg',
    developer: 'Urban Homes',
    tag: 'Residencial · Entrega inmediata',
    price: 'Desde $2,595,000 MXN',
    detail: 'Vivienda de entrega inmediata de Urban Homes en Cancún, lista para escriturar',
  },
  {
    name: 'Blume',
    href: '/desarrollos/blume-urban',
    img: '/desarrollos/Blume/BLUME-Drone-1.jpg',
    developer: 'Urban Homes',
    tag: 'Residencial · Entrega inmediata',
    price: 'Desde $19,256,000 MXN',
    detail: 'El proyecto insignia de Urban Homes en Puerto Cancún, frente al canal y la marina',
  },
];

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
          src="/renders/long-island/01.jpg"
          alt="Desarrollos inmobiliarios en Cancún — Quattro Plaza Center Long Island"
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/40 to-transparent" />
        <div className="absolute inset-0 flex flex-col justify-end px-6 pb-10">
          <div className="container-wrap">
            <p className="eyebrow eyebrow-accent mb-3">Panorama del Mercado</p>
            <h1 className="h-display text-[clamp(28px,4.5vw,52px)] text-white max-w-3xl leading-tight">
              Desarrollos Inmobiliarios en Cancún 2026: Guía Completa y Proyectos Destacados
            </h1>
            <div className="flex items-center gap-4 mt-4 text-white/60 text-sm">
              <span>18 de julio de 2026</span>
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
            <li className="text-ink truncate max-w-[240px] md:max-w-none">Desarrollos inmobiliarios en Cancún</li>
          </ol>
        </div>
      </nav>

      {/* Content */}
      <article className="py-16 px-6">
        <div className="max-w-3xl mx-auto">

          <p className="text-lg text-ink-2 leading-relaxed mb-8">
            Cancún concentra hoy una de las ofertas de desarrollos inmobiliarios más activas de México: plazas comerciales, residenciales de lujo, lotes y proyectos de entrega inmediata compitiendo en un mercado que sigue creciendo en turismo, población y demanda de vivienda. Elegir en qué desarrollo invertir no es cuestión de suerte — es cuestión de entender la zona, el desarrollador y el momento correcto del proyecto.
          </p>
          <p className="text-ink-2 leading-relaxed mb-8">
            En esta guía reunimos el panorama completo: por qué Cancún sigue siendo un destino de inversión sólido, qué tipos de desarrollos existen, en qué zonas conviene mirar, y un repaso a fondo de los proyectos activos de Tresor Real Estate y sus desarrolladores aliados — Quattro Plaza Center, Live Desarrollos, Onix Living y Urban Homes.
          </p>

          <h2 className="font-sans text-[clamp(24px,3.2vw,48px)] font-normal leading-[1.05] tracking-tight text-ink mt-12 mb-6">
            ¿Por qué Cancún sigue siendo un mercado fuerte para desarrollos inmobiliarios?
          </h2>
          <p className="text-ink-2 leading-relaxed mb-4">
            Cancún recibe más de 25 millones de visitantes al año y es la puerta de entrada turística más importante de México. Esa base de flujo constante sostiene tres motores de demanda inmobiliaria que rara vez coinciden en una sola ciudad:
          </p>
          <ul className="space-y-3 mb-6 text-ink-2">
            <li className="flex gap-2"><span className="text-accent font-bold">→</span> <span><strong>Demanda residencial local:</strong> una población que crece de forma sostenida y necesita vivienda, impulsada por la industria hotelera y de servicios que la ciudad sostiene todo el año.</span></li>
            <li className="flex gap-2"><span className="text-accent font-bold">→</span> <span><strong>Demanda de segunda residencia e inversión:</strong> compradores nacionales y extranjeros que buscan un activo en dólares o pesos con rentabilidad vía renta vacacional.</span></li>
            <li className="flex gap-2"><span className="text-accent font-bold">→</span> <span><strong>Demanda comercial:</strong> cada nueva zona residencial necesita locales, servicios y comercio de proximidad — el motor detrás de plazas como Quattro Plaza Center.</span></li>
          </ul>
          <p className="text-ink-2 leading-relaxed mb-8">
            El resultado es una plusvalía consistente: zonas de expansión reciente en Cancún han registrado incrementos de valor de entre 10% y 15% anual en los últimos ciclos, con los desarrollos en preventa capturando la mayor parte de esa ganancia antes incluso de la entrega.
          </p>

          <h2 className="font-sans text-[clamp(24px,3.2vw,48px)] font-normal leading-[1.05] tracking-tight text-ink mt-12 mb-6">
            Tipos de desarrollos inmobiliarios en Cancún
          </h2>
          <p className="text-ink-2 leading-relaxed mb-4">
            No todos los desarrollos responden al mismo objetivo de inversión. Conviene distinguir entre:
          </p>
          <div className="space-y-4 mb-10">
            {[
              { t: 'Desarrollos comerciales', d: 'Plazas y locales pensados para negocios y servicios de proximidad. Suelen ofrecer rentas más estables y menor rotación de inquilino que la vivienda, con retornos atractivos si la zona tiene tráfico peatonal y vehicular real.' },
              { t: 'Desarrollos residenciales verticales', d: 'Condominios y departamentos, desde entrada accesible hasta segmento premium. Funcionan tanto para vivir como para renta a mediano y corto plazo (turística).' },
              { t: 'Lotes residenciales', d: 'Terreno urbanizado dentro de un desarrollo con infraestructura y amenidades ya definidas, para quien prefiere construir a su medida o especular con la plusvalía del lote mismo.' },
              { t: 'Proyectos de entrega inmediata', d: 'Unidades ya construidas y listas para escriturar. El precio de entrada es mayor que en preventa, pero elimina el riesgo de tiempos de obra y permite generar renta desde el primer mes.' },
            ].map((item) => (
              <div key={item.t} className="p-5 rounded-xl border border-line bg-bg-soft">
                <h3 className="font-sans font-bold text-ink mb-1">{item.t}</h3>
                <p className="text-ink-2 text-sm leading-relaxed">{item.d}</p>
              </div>
            ))}
          </div>

          <h2 className="font-sans text-[clamp(24px,3.2vw,48px)] font-normal leading-[1.05] tracking-tight text-ink mt-12 mb-6">
            Las mejores zonas de Cancún para invertir en desarrollos inmobiliarios
          </h2>
          <p className="text-ink-2 leading-relaxed mb-4">
            No toda la ciudad tiene el mismo potencial. Las zonas con mayor actividad de desarrollo y mejor proyección de plusvalía hoy son:
          </p>
          <ul className="space-y-3 mb-8 text-ink-2">
            <li className="flex gap-2"><span className="text-accent font-bold">→</span> <span><strong>Puerto Cancún:</strong> la zona residencial y de marina de mayor lujo de la ciudad, con proyectos como Blume y Vellmari frente al canal.</span></li>
            <li className="flex gap-2"><span className="text-accent font-bold">→</span> <span><strong>Región 100 y zonas de expansión norte:</strong> corredores en crecimiento activo, donde Quattro Plaza Center identificó la oportunidad comercial de sus dos plazas actuales.</span></li>
            <li className="flex gap-2"><span className="text-accent font-bold">→</span> <span><strong>SM y zonas cercanas al centro:</strong> alta densidad de servicios y vida urbana, terreno natural para los proyectos residenciales de Live Desarrollos.</span></li>
            <li className="flex gap-2"><span className="text-accent font-bold">→</span> <span><strong>Corredores hacia la Riviera Maya:</strong> Cancún ya no compite solo dentro de sus límites — Onix Living y Urban Homes también desarrollan en Playa del Carmen y Tulum bajo la misma lógica de mercado.</span></li>
          </ul>
          <p className="text-ink-2 leading-relaxed mb-8">
            Puedes explorar los desarrollos disponibles filtrados por zona en nuestras landings de{' '}
            <Link href="/cancun" className="text-accent hover:underline">Cancún</Link>,{' '}
            <Link href="/puerto-cancun" className="text-accent hover:underline">Puerto Cancún</Link> y{' '}
            <Link href="/tulum" className="text-accent hover:underline">Tulum</Link>.
          </p>

          <h2 className="font-sans text-[clamp(24px,3.2vw,48px)] font-normal leading-[1.05] tracking-tight text-ink mt-12 mb-6">
            Desarrollos inmobiliarios destacados en Cancún 2026
          </h2>
          <p className="text-ink-2 leading-relaxed mb-8">
            Este es el panorama actual de proyectos activos que representamos en Cancún, organizado por desarrollador. Cada uno responde a un perfil de inversión distinto — de la plaza comercial en preventa hasta el departamento de entrega inmediata frente al mar.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
            {featured.map((dev) => (
              <Link
                key={dev.href}
                href={dev.href}
                className="group rounded-xl overflow-hidden border border-line hover:shadow-md transition-shadow bg-bg-soft"
              >
                <div className="relative aspect-[4/3]">
                  <Image
                    src={dev.img}
                    alt={dev.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 640px) 100vw, 340px"
                  />
                </div>
                <div className="p-5">
                  <p className="text-xs text-ink-3 mb-1">{dev.developer} · {dev.tag}</p>
                  <h3 className="font-sans font-bold text-ink mb-2 group-hover:text-accent transition-colors">
                    {dev.name}
                  </h3>
                  <p className="text-sm font-semibold text-ink mb-1">{dev.price}</p>
                  <p className="text-xs text-ink-2 leading-relaxed">{dev.detail}</p>
                </div>
              </Link>
            ))}
          </div>
          <p className="text-ink-2 leading-relaxed mb-8">
            Consulta el catálogo completo, filtrable por desarrollador, ciudad y tipo de propiedad, en{' '}
            <Link href="/desarrollo" className="text-accent hover:underline">nuestra sección de desarrollos</Link>.
          </p>

          <h2 className="font-sans text-[clamp(24px,3.2vw,48px)] font-normal leading-[1.05] tracking-tight text-ink mt-12 mb-6">
            Cómo elegir el desarrollo correcto para tu inversión
          </h2>
          <ol className="space-y-6 mb-8">
            {[
              { n: '01', title: 'Define tu objetivo antes que el proyecto', body: 'Renta a corto plazo, plusvalía a mediano plazo o vivienda propia son tres estrategias distintas que apuntan a tipos de desarrollo distintos. Elegir el proyecto antes de definir el objetivo suele terminar en decisiones emocionales.' },
              { n: '02', title: 'Evalúa la zona, no solo el proyecto', body: 'Un desarrollo excelente en una zona sin proyección de crecimiento rinde menos que un proyecto sólido en una zona en expansión activa. La plusvalía la hace la zona; el desarrollador ejecuta sobre ella.' },
              { n: '03', title: 'Verifica el historial del desarrollador', body: 'Proyectos anteriores entregados a tiempo y en las condiciones prometidas son el mejor indicador disponible. Pide referencias y, si puedes, visita un proyecto ya terminado del mismo desarrollador.' },
              { n: '04', title: 'Compara preventa contra entrega inmediata', body: 'La preventa ofrece el precio más bajo del ciclo a cambio de tiempo de espera; la entrega inmediata cuesta más pero genera flujo desde el primer mes. Ninguna es mejor en automático — depende de tu horizonte.' },
              { n: '05', title: 'Revisa el esquema de pagos y el enganche', body: 'Un plan de pagos escalonado durante la construcción facilita la planeación financiera. Confirma qué porcentaje corresponde al enganche y cómo se distribuyen las mensualidades hasta la entrega.' },
            ].map((step) => (
              <li key={step.n} className="flex gap-4">
                <span className="font-serif italic text-3xl text-accent flex-shrink-0 leading-none">{step.n}</span>
                <div>
                  <strong className="block text-ink mb-1">{step.title}</strong>
                  <p className="text-ink-2 leading-relaxed">{step.body}</p>
                </div>
              </li>
            ))}
          </ol>

          <h2 className="font-sans text-[clamp(24px,3.2vw,48px)] font-normal leading-[1.05] tracking-tight text-ink mt-12 mb-6">
            Preguntas frecuentes sobre desarrollos inmobiliarios en Cancún
          </h2>
          <div className="space-y-4 mb-10">
            {[
              { q: '¿Cuál es el desarrollo inmobiliario más accesible en Cancún para empezar a invertir?', a: 'Entre los proyectos activos de Tresor, Quattro Plaza Center Gardens (locales comerciales desde $1,968,600 MXN + IVA, enganche desde $147,000 MXN) y Olivia Wow Condos (departamentos desde $2,613,000 MXN) son los puntos de entrada más accesibles en preventa.' },
              { q: '¿Es mejor invertir en un desarrollo comercial o residencial en Cancún?', a: 'Depende del objetivo: los desarrollos comerciales suelen ofrecer rentas más estables y menor rotación de inquilino; los residenciales tienen mayor liquidez de reventa y acceso a renta vacacional de corto plazo. Ambos formatos tienen presencia sólida en el portafolio de Tresor.' },
              { q: '¿Los extranjeros pueden invertir en desarrollos inmobiliarios en Cancún?', a: 'Sí. Cancún está en zona restringida constitucionalmente para extranjeros, pero el mecanismo de fideicomiso bancario permite la compra de forma segura y es el esquema estándar del mercado — nuestro equipo asesora el proceso completo.' },
              { q: '¿Qué garantiza que un desarrollo en preventa se entregue a tiempo?', a: 'No existe una garantía absoluta, pero el historial del desarrollador, la situación legal del terreno y un contrato con cláusulas claras de penalidad por retraso reducen el riesgo de forma significativa. Revisa nuestra guía completa de preventa para el checklist detallado.' },
            ].map((item, i) => (
              <div key={i} className="p-4 bg-bg-soft rounded-xl border border-line">
                <p className="font-semibold text-ink mb-1">{item.q}</p>
                <p className="text-ink-2 text-sm leading-relaxed">{item.a}</p>
              </div>
            ))}
          </div>

          <h2 className="font-sans text-[clamp(24px,3.2vw,48px)] font-normal leading-[1.05] tracking-tight text-ink mt-12 mb-6">
            Por qué invertir en desarrollos inmobiliarios en Cancún con Tresor Real Estate
          </h2>
          <p className="text-ink-2 leading-relaxed mb-4">
            Tresor Real Estate concentra bajo un solo equipo el desarrollo comercial propio (Quattro Plaza Center) y la comercialización de desarrolladores aliados con trayectoria en la región — Live Desarrollos, Onix Living y Urban Homes. Eso significa un solo punto de contacto, un solo proceso de asesoría y visibilidad honesta sobre qué proyecto conviene a cada perfil de inversión, sin sesgo hacia un único desarrollador.
          </p>
          <p className="text-ink-2 leading-relaxed mb-8">
            Si quieres profundizar en el proceso de compra, lee nuestra{' '}
            <Link href="/blog/guia-comprar-en-preventa-cancun" className="text-accent hover:underline">Guía para Comprar en Preventa en Cancún</Link>{' '}
            o nuestro análisis de{' '}
            <Link href="/blog/cuanto-cuesta-un-local-comercial-en-cancun" className="text-accent hover:underline">precios de locales comerciales en 2026</Link>.
          </p>

          <h2 className="font-sans text-[clamp(24px,3.2vw,48px)] font-normal leading-[1.05] tracking-tight text-ink mt-12 mb-6">
            Conclusión
          </h2>
          <p className="text-ink-2 leading-relaxed mb-8">
            Cancún ofrece hoy uno de los abanicos más completos de desarrollos inmobiliarios de México: comercial, residencial, lotes, preventa y entrega inmediata, distribuidos en zonas con proyecciones de crecimiento distintas. La clave no es encontrar &ldquo;el mejor desarrollo&rdquo; en abstracto, sino el que responde a tu objetivo real de inversión — y eso empieza por hablar con alguien que conozca el portafolio completo, no solo un proyecto.
          </p>

          {/* Related articles */}
          <h2 className="font-sans text-[clamp(20px,2.6vw,32px)] font-normal leading-[1.05] tracking-tight text-ink mt-16 mb-6">Artículos relacionados</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-4">
            {[
              { slug: 'como-invertir-en-locales-comerciales-en-cancun', title: 'Cómo Invertir en Locales Comerciales en Cancún: Guía Completa', img: '/blog/AdobeStock_663402090.jpeg' },
              { slug: 'mejores-zonas-para-negocio-en-cancun', title: 'Las Mejores Zonas para Poner un Negocio en Cancún', img: '/blog/AdobeStock_838554951.jpeg' },
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
            title="Conoce el portafolio completo de desarrollos en Cancún"
            subtitle="Habla con un asesor hoy. Comerciales, residenciales y lotes en las zonas de mayor crecimiento de Cancún."
            image="/renders/gardens/03.jpg"
            imageAlt="Portafolio de desarrollos Tresor Real Estate en Cancún"
            primaryHref="/desarrollo"
            primaryLabel="Ver todos los desarrollos"
            whatsappMessage="Hola, me interesa conocer el portafolio de desarrollos en Cancún"
          />
        </div>
      </div>
    </>
  );
}
