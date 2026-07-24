import type { Metadata } from 'next';
import CategoryHero from '@/components/category/CategoryHero';
import CategoryGridSection from '@/components/category/CategoryGridSection';
import { getMergedDevelopmentsAsync } from '@/lib/developments';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const isEs = locale !== 'en';
  const title = isEs ? 'Propiedades en Venta en Playa del Carmen' : 'Properties for Sale in Playa del Carmen';
  const description = isEs
    ? 'Departamentos en preventa y entrega inmediata en Playa del Carmen, a pasos de la Quinta Avenida y el mar Caribe.'
    : 'Pre-sale and immediate-delivery apartments in Playa del Carmen, steps from Fifth Avenue and the Caribbean Sea.';
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
  const developments = all.filter((d) => d.city === 'Playa del Carmen');

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
    </>
  );
}
