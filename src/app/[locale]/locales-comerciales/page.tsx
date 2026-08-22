import type { Metadata } from 'next';
import { ArrowRight } from 'lucide-react';
import { Link } from '@/navigation';
import CategoryHero from '@/components/category/CategoryHero';
import CategoryGridSection from '@/components/category/CategoryGridSection';
import { getMergedDevelopmentsAsync, isListingRelationship } from '@/lib/developments';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const isEs = locale !== 'en';
  // Título REGIONAL a propósito. Antes era IDÉNTICO, palabra por palabra, al
  // de /locales-comerciales-cancun ("Locales Comerciales en Venta en
  // Cancún") — SEMrush lo reportó como duplicate title tags. Esta página
  // filtra por TIPO de propiedad sin filtro de ciudad (hoy todo el
  // inventario resulta estar en Cancún, pero la página en sí es el hub);
  // la de Cancún es la que debe ganar esa keyword exacta. Mismo criterio ya
  // aplicado a /departamentos vs. /departamentos-en-venta-cancun.
  const title = isEs ? 'Locales Comerciales en Venta en Quintana Roo' : 'Commercial Space for Sale in Quintana Roo';
  const description = isEs
    ? 'Locales comerciales en preventa en plazas premium de Cancún. Alto retorno, ubicaciones estratégicas y desarrolladores con trayectoria comprobada.'
    : 'Retail and commercial space for sale in premium Cancún shopping plazas. Strategic high-traffic locations from developers with a proven track record.';
  return {
    title,
    description,
    alternates: {
      canonical: isEs ? 'https://www.tresor.mx/locales-comerciales' : 'https://www.tresor.mx/en/locales-comerciales',
      languages: {
        es: 'https://www.tresor.mx/locales-comerciales',
        en: 'https://www.tresor.mx/en/locales-comerciales',
        'x-default': 'https://www.tresor.mx/locales-comerciales',
      },
    },
    openGraph: {
      title,
      description,
      url: isEs ? 'https://www.tresor.mx/locales-comerciales' : 'https://www.tresor.mx/en/locales-comerciales',
      images: [{ url: '/ogfinal.jpg', width: 1200, height: 630 }],
      locale: isEs ? 'es_MX' : 'en_US',
    },
  };
}

export default async function LocalesComercialesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const isEs = locale !== 'en';
  const all = await getMergedDevelopmentsAsync();
  const developments = all.filter((d) => d.propertyType === 'Local Comercial' && !isListingRelationship(d.relationship));

  return (
    <>
      <CategoryHero
        image="/renders/gardens/01.jpg"
        imageAlt={isEs ? 'Locales comerciales en venta en Cancún' : 'Commercial spaces for sale in Cancún'}
        eyebrow={isEs ? '— Propiedades' : '— Properties'}
        title={isEs ? 'Locales Comerciales' : 'Commercial Spaces'}
        subtitle={
          isEs
            ? 'Plazas comerciales premium en Cancún, listas para invertir con alto potencial de retorno.'
            : 'Premium commercial plazas in Cancún, ready to invest in with high return potential.'
        }
      />
      <CategoryGridSection
        eyebrow={isEs ? 'Locales Comerciales' : 'Commercial Spaces'}
        title={isEs ? <>Invierte en <span className="text-ink-3">plazas de alto retorno</span></> : <>Invest in <span className="text-ink-3">high-return plazas</span></>}
        developments={developments}
        schemaUrl={isEs ? 'https://www.tresor.mx/locales-comerciales' : 'https://www.tresor.mx/en/locales-comerciales'}
        schemaName={isEs ? 'Locales Comerciales en Venta en Quintana Roo' : 'Commercial Space for Sale in Quintana Roo'}
        schemaDescription={
          isEs
            ? 'Locales comerciales en preventa en plazas premium de Cancún. Alto retorno, ubicaciones estratégicas y desarrolladores con trayectoria comprobada.'
            : 'Retail and commercial space for sale in premium Cancún shopping plazas. Strategic high-traffic locations from developers with a proven track record.'
        }
        breadcrumbLabel={isEs ? 'Locales Comerciales' : 'Commercial Spaces'}
        locale={isEs ? 'es_MX' : 'en_US'}
      />

      {/* Enlace jerárquico hub → ciudad, mismo patrón que /departamentos →
          /departamentos-en-venta-cancun. */}
      <section className="bg-bg-soft py-20 md:py-28">
        <div className="container-wrap max-w-3xl">
          <span className="eyebrow eyebrow-accent font-bold">{isEs ? '— Por ciudad' : '— By city'}</span>
          <h2 className="mt-4 font-sans text-[clamp(24px,3.2vw,48px)] font-normal leading-[1.05] tracking-tight text-ink">
            {isEs ? <>¿Buscas <span className="text-ink-3">solo en Cancún?</span></> : <>Looking <span className="text-ink-3">only in Cancún?</span></>}
          </h2>
          <p className="mt-5 text-[15px] font-light leading-relaxed text-ink-2">
            {isEs
              ? 'Tenemos una página dedicada a locales comerciales en Cancún, con las plazas Quattro Plaza Gardens y Long Island, precios actuales y planes de pago.'
              : 'We have a page dedicated to commercial spaces in Cancún, with the Quattro Plaza Gardens and Long Island plazas, current prices and payment plans.'}
          </p>
          <Link
            href="/locales-comerciales-cancun"
            className="btn btn-lg mt-8 border-0 bg-ink text-white hover:bg-ink/85"
          >
            {isEs ? 'Ver locales comerciales en Cancún' : 'View commercial spaces in Cancún'}
            <ArrowRight size={14} strokeWidth={2.2} />
          </Link>
        </div>
      </section>
    </>
  );
}
