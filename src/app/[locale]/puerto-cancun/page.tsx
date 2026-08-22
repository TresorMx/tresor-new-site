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
  // Todo el inventario de Puerto Cancún es departamento, así que "Condos for
  // Sale in Puerto Cancún" es literal, no un estiramiento — y es la búsqueda
  // exacta del comprador extranjero para esta zona.
  const title = isEs ? 'Propiedades en Venta en Puerto Cancún' : 'Condos for Sale in Puerto Cancún — Marina & Golf';
  const description = isEs
    ? 'Departamentos de lujo en Puerto Cancún, el enclave residencial más exclusivo de la ciudad, frente al mar Caribe y la marina.'
    : "Luxury condos for sale in Puerto Cancún, the city's most exclusive gated community — an 18-hole golf course, private marina, beach club and the Caribbean Sea at your door.";
  return {
    title,
    description,
    alternates: {
      canonical: isEs ? 'https://www.tresor.mx/puerto-cancun' : 'https://www.tresor.mx/en/puerto-cancun',
      languages: {
        es: 'https://www.tresor.mx/puerto-cancun',
        en: 'https://www.tresor.mx/en/puerto-cancun',
        'x-default': 'https://www.tresor.mx/puerto-cancun',
      },
    },
    openGraph: {
      title,
      description,
      url: isEs ? 'https://www.tresor.mx/puerto-cancun' : 'https://www.tresor.mx/en/puerto-cancun',
      images: [{ url: '/ogfinal.jpg', width: 1200, height: 630 }],
      locale: isEs ? 'es_MX' : 'en_US',
    },
  };
}

export default async function PuertoCancunPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const isEs = locale !== 'en';
  const all = await getMergedDevelopmentsAsync();
  const developments = all.filter((d) => d.city === 'Puerto Cancún' && !isListingRelationship(d.relationship));

  return (
    <>
      <CategoryHero
        image="/desarrollos/Blume/BLUME-Drone-1.jpg"
        imageAlt={isEs ? 'Propiedades en venta en Puerto Cancún' : 'Properties for sale in Puerto Cancún'}
        eyebrow={isEs ? '— Ciudad' : '— City'}
        title="Puerto Cancún"
        subtitle={
          isEs
            ? 'El enclave residencial más exclusivo de Cancún, frente al mar Caribe y la marina.'
            : "Cancún's most exclusive residential enclave, facing the Caribbean Sea and the marina."
        }
      />
      <CategoryGridSection
        eyebrow="Puerto Cancún"
        title={isEs ? <>Propiedades en <span className="text-ink-3">Puerto Cancún</span></> : <>Properties in <span className="text-ink-3">Puerto Cancún</span></>}
        developments={developments}
        schemaUrl={isEs ? 'https://www.tresor.mx/puerto-cancun' : 'https://www.tresor.mx/en/puerto-cancun'}
        schemaName={isEs ? 'Propiedades en Venta en Puerto Cancún' : 'Condos for Sale in Puerto Cancún — Marina & Golf'}
        schemaDescription={
          isEs
            ? 'Departamentos de lujo en Puerto Cancún, el enclave residencial más exclusivo de la ciudad, frente al mar Caribe y la marina.'
            : "Luxury condos for sale in Puerto Cancún, the city's most exclusive gated community — an 18-hole golf course, private marina, beach club and the Caribbean Sea at your door."
        }
        breadcrumbLabel="Puerto Cancún"
        locale={isEs ? 'es_MX' : 'en_US'}
      />

      {/* Enlace jerárquico hub → keyword específica, mismo patrón que
          /playa-del-carmen y /departamentos. El href va SIN el prefijo /en/:
          el `Link` de @/navigation ya antepone el locale — escribirlo a mano
          genera /en/en/... (bug real que reportó SEMrush). */}
      <section className="bg-bg-soft py-20 md:py-28">
        <div className="container-wrap max-w-3xl">
          <span className="eyebrow eyebrow-accent font-bold">{isEs ? '— Por tipo' : '— By type'}</span>
          <h2 className="mt-4 font-sans text-[clamp(24px,3.2vw,48px)] font-normal leading-[1.05] tracking-tight text-ink">
            {isEs ? <>¿Buscas <span className="text-ink-3">solo departamentos?</span></> : <>Looking <span className="text-ink-3">only for condos?</span></>}
          </h2>
          <p className="mt-5 text-[15px] font-light leading-relaxed text-ink-2">
            {isEs
              ? 'Tenemos una página dedicada a departamentos en Puerto Cancún, con el detalle de la marina, el campo de golf y el club de playa, precios actuales y disponibilidad real por tipología.'
              : 'We have a page dedicated to condos in Puerto Cancún, with a breakdown of the marina, golf course and beach club, current prices and real availability.'}
          </p>
          <Link
            href={isEs ? '/departamentos-en-venta-puerto-cancun' : '/condos-for-sale-puerto-cancun'}
            className="btn btn-lg mt-8 border-0 bg-ink text-white hover:bg-ink/85"
          >
            {isEs ? 'Ver departamentos en Puerto Cancún' : 'View condos in Puerto Cancún'}
            <ArrowRight size={14} strokeWidth={2.2} />
          </Link>
        </div>
      </section>
    </>
  );
}
