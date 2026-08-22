import type { Metadata } from 'next';
import { ArrowRight } from 'lucide-react';
import { Link } from '@/navigation';
import CategoryHero from '@/components/category/CategoryHero';
import CategoryGridSection from '@/components/category/CategoryGridSection';
import { getMergedDevelopmentsAsync, isListingRelationship } from '@/lib/developments';

export const dynamic = 'force-dynamic';

// Hub de TODO el portafolio — todos los tipos de propiedad, todas las
// ciudades, todas las desarrolladoras. Es la única página del sitio sin
// pre-filtrar, por eso es la única que prende el filtro de ciudad.
//
// POR QUÉ EXISTE: hasta ahora /desarrollos era un redirect 301 a /#portafolio
// (un ancla del home). Search Console mostraba ~310 impresiones al mes en el
// clúster "desarrollos …" (desarrollos inmobiliarios en cancun pos 33,
// desarrollos en cancun pos 39, desarrollos quintana roo pos 38, desarrollos
// residenciales en cancun pos 38) con CERO clics, porque no había página que
// las recibiera: un ancla del home no puede rankear para una consulta de
// categoría, el home está optimizado para la marca.
//
// CANIBALIZACIÓN — con qué NO compite y por qué:
//   /departamentos ............ un solo tipo de propiedad, alcance regional
//   /cancun, /tulum … ......... una sola ciudad, todos los tipos
//   /urban-homes, /onix-living  una sola desarrolladora
//   /blog/desarrollos-inmobiliarios-en-cancun … INFORMACIONAL ("Guía Completa
//     y Proyectos Destacados", hoy en pos 7.87). Esta página es el CATÁLOGO.
//     Por eso el título ataca "desarrollos EN VENTA" y no repite la frase
//     "Desarrollos Inmobiliarios en Cancún" que el post ya trabaja.
//   /desarrollo (singular) .... trayectoria de Tresor COMO desarrollador.
//     Ojo: ese sí colisionaba semánticamente (estaba en pos 52 con 444
//     impresiones y 0 clics); se le cambió el título para desambiguar.
const URL_ES = 'https://www.tresor.mx/desarrollos';
const URL_EN = 'https://www.tresor.mx/en/desarrollos';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const isEs = locale !== 'en';
  const title = isEs
    ? 'Desarrollos en Venta en Cancún y Quintana Roo'
    : 'Real Estate Developments in Cancún and Quintana Roo';
  const description = isEs
    ? 'Portafolio completo de desarrollos en venta en Cancún, Puerto Cancún, Playa del Carmen y Tulum: departamentos, locales comerciales y lotes residenciales, en preventa y entrega inmediata, de las desarrolladoras más sólidas de Quintana Roo.'
    : 'The full portfolio of real estate developments for sale in Cancún, Puerto Cancún, Playa del Carmen and Tulum: condos, commercial units and residential lots, pre-construction and move-in ready, from the most established developers in Quintana Roo.';
  return {
    title,
    description,
    keywords: isEs
      ? [
          'desarrollos en cancun',
          'desarrollos inmobiliarios cancun',
          'desarrollos quintana roo',
          'desarrollos residenciales en cancun',
          'desarrolladoras inmobiliarias en cancun',
          'proyectos inmobiliarios cancun',
        ]
      : [
          'real estate developments cancun',
          'new developments cancun',
          'quintana roo developments',
          'real estate developers cancun',
        ],
    alternates: {
      canonical: isEs ? URL_ES : URL_EN,
      languages: { es: URL_ES, en: URL_EN, 'x-default': URL_ES },
    },
    openGraph: {
      title,
      description,
      url: isEs ? URL_ES : URL_EN,
      images: [{ url: '/ogfinal.jpg', width: 1200, height: 630 }],
      locale: isEs ? 'es_MX' : 'en_US',
      type: 'website',
    },
    robots: { index: true, follow: true },
  };
}

// Enlaces jerárquicos hacia abajo. Es la otra mitad del esquema anti-
// canibalización: el hub cubre toda la región y reparte autoridad interna a
// las páginas que sí deben ganar cada búsqueda específica.
const BY_DEVELOPER = [
  // Listas verificadas contra el campo `developer` de developments.ts —
  // completas, no una selección. Si se agrega un desarrollo, actualizar aquí.
  { href: '/urban-homes', label: 'Urban Homes', es: 'Vellmari, Blume, Valmira, La Selva, Sanam y Favorite.', en: 'Vellmari, Blume, Valmira, La Selva, Sanam and Favorite.' },
  { href: '/onix-living', label: 'Onix Living', es: 'Zienna, Koa, Villalta y Bardenna.', en: 'Zienna, Koa, Villalta and Bardenna.' },
  { href: '/live-desarrollos', label: 'Live Desarrollos', es: 'Esther, Ximena, Loreta, Olivia y Xaviera — la familia Wow Condos.', en: 'Esther, Ximena, Loreta, Olivia and Xaviera — the Wow Condos family.' },
] as const;

const BY_TYPE = [
  { href: '/departamentos', es: 'Departamentos', en: 'Condos' },
  { href: '/locales-comerciales', es: 'Locales comerciales', en: 'Commercial units' },
  { href: '/lotes-residenciales', es: 'Lotes residenciales', en: 'Residential lots' },
] as const;

const BY_CITY = [
  { href: '/cancun', label: 'Cancún' },
  { href: '/puerto-cancun', label: 'Puerto Cancún' },
  { href: '/playa-del-carmen', label: 'Playa del Carmen' },
  { href: '/tulum', label: 'Tulum' },
] as const;

export default async function DesarrollosPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const isEs = locale !== 'en';
  const all = await getMergedDevelopmentsAsync();
  // Mismo criterio que /departamentos: los listings y rentas son intermediación,
  // no desarrollos propios ni de socios — no pertenecen al portafolio.
  const developments = all.filter((d) => !isListingRelationship(d.relationship));

  return (
    <>
      <CategoryHero
        image="/desarrollo-corporativo/LuxuryP.jpg"
        imageAlt={
          isEs
            ? 'Desarrollos inmobiliarios en venta en Cancún y Quintana Roo'
            : 'Real estate developments for sale in Cancún and Quintana Roo'
        }
        eyebrow={isEs ? '— Portafolio' : '— Portfolio'}
        title={isEs ? 'Desarrollos en Cancún y Quintana Roo' : 'Developments in Cancún and Quintana Roo'}
        subtitle={
          isEs
            ? 'Departamentos, locales comerciales y lotes residenciales en preventa y entrega inmediata — en Cancún, Puerto Cancún, Playa del Carmen y Tulum.'
            : 'Condos, commercial units and residential lots — pre-construction and move-in ready — across Cancún, Puerto Cancún, Playa del Carmen and Tulum.'
        }
      />

      <CategoryGridSection
        eyebrow={isEs ? 'Portafolio completo' : 'Full portfolio'}
        title={
          isEs ? (
            <>Todos los desarrollos, <span className="text-ink-3">filtrados a tu medida</span></>
          ) : (
            <>Every development, <span className="text-ink-3">filtered your way</span></>
          )
        }
        developments={developments}
        showCityFilter
        showTypeFilter
        showDeveloperFilter
        showStatusFilter
      />

      {/* Por desarrolladora — además de repartir autoridad a las 3 páginas de
          desarrollador, es la sección que responde "mejores desarrolladoras
          inmobiliarias en cancún" (hoy en pos 10.5, sin página propia). */}
      <section className="bg-bg-soft py-20 md:py-28">
        <div className="container-wrap">
          <span className="eyebrow eyebrow-accent font-bold">
            {isEs ? '— Por desarrolladora' : '— By developer'}
          </span>
          <h2 className="mt-4 max-w-3xl font-sans text-[clamp(24px,3.2vw,48px)] font-normal leading-[1.05] tracking-tight text-ink">
            {isEs ? (
              <>Comercializamos para <span className="text-ink-3">las desarrolladoras más sólidas de la región</span></>
            ) : (
              <>We are the sales partner for <span className="text-ink-3">the region&apos;s most established developers</span></>
            )}
          </h2>
          <div className="mt-10 grid gap-px overflow-hidden rounded-lg bg-line sm:grid-cols-3">
            {BY_DEVELOPER.map((d) => (
              <Link key={d.href} href={d.href} className="group bg-bg p-7 transition-colors hover:bg-bg-soft">
                <h3 className="font-sans text-[19px] font-normal tracking-tight text-ink">{d.label}</h3>
                <p className="mt-2 text-[14px] font-light leading-relaxed text-ink-3">{isEs ? d.es : d.en}</p>
                <span className="mt-5 inline-flex items-center gap-2 text-[12px] font-bold uppercase tracking-caps text-ink transition-colors group-hover:text-accent">
                  {isEs ? 'Ver desarrollos' : 'View developments'}
                  <ArrowRight size={13} strokeWidth={2.2} />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Por tipo y por ciudad — enlace jerárquico hub → páginas específicas. */}
      <section className="bg-bg py-20 md:py-28">
        <div className="container-wrap grid gap-14 md:grid-cols-2">
          <div>
            <span className="eyebrow eyebrow-accent font-bold">
              {isEs ? '— Por tipo de propiedad' : '— By property type'}
            </span>
            <h2 className="mt-4 font-sans text-[clamp(24px,3.2vw,48px)] font-normal leading-[1.05] tracking-tight text-ink">
              {isEs ? <>¿Ya sabes <span className="text-ink-3">qué buscas?</span></> : <>Already know <span className="text-ink-3">what you want?</span></>}
            </h2>
            <ul className="mt-8 space-y-3">
              {BY_TYPE.map((t) => (
                <li key={t.href}>
                  <Link
                    href={t.href}
                    className="inline-flex items-center gap-2 text-[15px] font-light text-ink-2 transition-colors hover:text-accent"
                  >
                    <ArrowRight size={14} strokeWidth={2.2} className="text-accent" />
                    {isEs ? t.es : t.en}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <span className="eyebrow eyebrow-accent font-bold">{isEs ? '— Por ciudad' : '— By city'}</span>
            <h2 className="mt-4 font-sans text-[clamp(24px,3.2vw,48px)] font-normal leading-[1.05] tracking-tight text-ink">
              {isEs ? <>¿Ya elegiste <span className="text-ink-3">dónde?</span></> : <>Already picked <span className="text-ink-3">where?</span></>}
            </h2>
            <ul className="mt-8 space-y-3">
              {BY_CITY.map((c) => (
                <li key={c.href}>
                  <Link
                    href={c.href}
                    className="inline-flex items-center gap-2 text-[15px] font-light text-ink-2 transition-colors hover:text-accent"
                  >
                    <ArrowRight size={14} strokeWidth={2.2} className="text-accent" />
                    {c.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </>
  );
}
