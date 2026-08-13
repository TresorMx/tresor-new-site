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
  // Título EN antes era IDÉNTICO al de /en/condos-for-sale-playa-del-carmen
  // ("Condos for Sale in Playa del Carmen") — dos páginas propias peleando
  // la misma frase exacta, mismo bug ya corregido en /departamentos. Esta
  // es la página de TODOS los tipos de propiedad; la dedicada es la dueña
  // de "condos for sale".
  const title = isEs ? 'Propiedades en Venta en Playa del Carmen' : 'Real Estate in Playa del Carmen, Mexico';
  const description = isEs
    ? 'Departamentos en preventa y entrega inmediata en Playa del Carmen, a pasos de la Quinta Avenida y el mar Caribe.'
    : 'Pre-construction and move-in ready condos for sale in Playa del Carmen, steps from Fifth Avenue and the Caribbean Sea.';
  return {
    title,
    description,
    alternates: {
      canonical: isEs ? 'https://www.tresor.mx/playa-del-carmen' : 'https://www.tresor.mx/en/playa-del-carmen',
      languages: {
        es: 'https://www.tresor.mx/playa-del-carmen',
        en: 'https://www.tresor.mx/en/playa-del-carmen',
        'x-default': 'https://www.tresor.mx/playa-del-carmen',
      },
    },
    openGraph: {
      title,
      description,
      url: isEs ? 'https://www.tresor.mx/playa-del-carmen' : 'https://www.tresor.mx/en/playa-del-carmen',
      images: [{ url: '/ogfinal.jpg', width: 1200, height: 630 }],
      locale: isEs ? 'es_MX' : 'en_US',
    },
  };
}

export default async function PlayaDelCarmenPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const isEs = locale !== 'en';
  const all = await getMergedDevelopmentsAsync();
  const developments = all.filter((d) => d.city === 'Playa del Carmen' && !isListingRelationship(d.relationship));

  return (
    <>
      <CategoryHero
        image="/desarrollos/Favorite/playaNIGHT.jpg"
        imageAlt={isEs ? 'Propiedades en venta en Playa del Carmen' : 'Properties for sale in Playa del Carmen'}
        eyebrow={isEs ? '— Ciudad' : '— City'}
        title="Playa del Carmen"
        subtitle={
          isEs
            ? 'Departamentos a pasos de la Quinta Avenida y el mar Caribe, en uno de los destinos más buscados de la Riviera Maya.'
            : "Apartments steps from Fifth Avenue and the Caribbean Sea, in one of the Riviera Maya's most sought-after destinations."
        }
      />
      <CategoryGridSection
        eyebrow="Playa del Carmen"
        title={isEs ? <>Propiedades en <span className="text-ink-3">Playa del Carmen</span></> : <>Properties in <span className="text-ink-3">Playa del Carmen</span></>}
        developments={developments}
      />

      {/* Enlace jerárquico hub → keyword específica. Esta página cubre TODOS
          los tipos de propiedad; la de departamentos es la que debe ganar
          "departamentos en venta en playa del carmen". Mismo patrón que
          /departamentos → /departamentos-en-venta-cancun. */}
      <section className="bg-bg-soft py-20 md:py-28">
        <div className="container-wrap max-w-3xl">
          <span className="eyebrow eyebrow-accent font-bold">{isEs ? '— Por tipo' : '— By type'}</span>
          <h2 className="mt-4 font-sans text-[clamp(24px,3.2vw,48px)] font-normal leading-[1.05] tracking-tight text-ink">
            {isEs ? <>¿Buscas <span className="text-ink-3">solo departamentos?</span></> : <>Looking <span className="text-ink-3">only for condos?</span></>}
          </h2>
          <p className="mt-5 text-[15px] font-light leading-relaxed text-ink-2">
            {isEs
              ? 'Tenemos una página dedicada a departamentos en Playa del Carmen, con el detalle de cada zona —Quinta Avenida, Playacar y la zona residencial—, precios actuales y cómo funciona la compra.'
              : 'We have a page dedicated to condos in Playa del Carmen, with a breakdown of every zone, current prices and how buying works.'}
          </p>
          <Link
            href={isEs ? '/departamentos-en-venta-playa-del-carmen' : '/en/condos-for-sale-playa-del-carmen'}
            className="btn btn-lg mt-8 border-0 bg-ink text-white hover:bg-ink/85"
          >
            {isEs ? 'Ver departamentos en Playa del Carmen' : 'View condos in Playa del Carmen'}
            <ArrowRight size={14} strokeWidth={2.2} />
          </Link>
        </div>
      </section>
    </>
  );
}
