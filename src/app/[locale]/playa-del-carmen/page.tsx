import type { Metadata } from 'next';
import CategoryHero from '@/components/category/CategoryHero';
import CategoryGridSection from '@/components/category/CategoryGridSection';
import { getMergedDevelopmentsAsync } from '@/lib/developments';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Propiedades en Venta en Playa del Carmen',
  description:
    'Departamentos en preventa y entrega inmediata en Playa del Carmen, a pasos de la Quinta Avenida y el mar Caribe.',
  alternates: { canonical: 'https://tresor.mx/playa-del-carmen' },
  openGraph: {
    title: 'Propiedades en Venta en Playa del Carmen',
    description: 'Departamentos en preventa y entrega inmediata en Playa del Carmen.',
    url: 'https://tresor.mx/playa-del-carmen',
    images: [{ url: '/desarrollos/Favorite/playaNIGHT.jpg', width: 1920, height: 992 }],
  },
};

export default async function PlayaDelCarmenPage() {
  const all = await getMergedDevelopmentsAsync();
  const developments = all.filter((d) => d.city === 'Playa del Carmen');

  return (
    <>
      <CategoryHero
        image="/desarrollos/Favorite/playaNIGHT.jpg"
        imageAlt="Propiedades en venta en Playa del Carmen"
        eyebrow="— Ciudad"
        title="Playa del Carmen"
        subtitle="Departamentos a pasos de la Quinta Avenida y el mar Caribe, en uno de los destinos más buscados de la Riviera Maya."
      />
      <CategoryGridSection
        eyebrow="Playa del Carmen"
        title={<>Propiedades en <span className="text-ink-3">Playa del Carmen</span></>}
        developments={developments}
      />
    </>
  );
}
