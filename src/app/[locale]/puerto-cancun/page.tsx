import type { Metadata } from 'next';
import CategoryHero from '@/components/category/CategoryHero';
import CategoryGridSection from '@/components/category/CategoryGridSection';
import { getMergedDevelopmentsAsync } from '@/lib/developments';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Propiedades en Venta en Puerto Cancún',
  description:
    'Departamentos de lujo en Puerto Cancún, el enclave residencial más exclusivo de la ciudad, frente al mar Caribe y la marina.',
  alternates: { canonical: 'https://tresor.mx/puerto-cancun' },
  openGraph: {
    title: 'Propiedades en Venta en Puerto Cancún',
    description: 'Departamentos de lujo en Puerto Cancún, frente al mar Caribe y la marina.',
    url: 'https://tresor.mx/puerto-cancun',
    images: [{ url: '/ogfinal.jpg', width: 1200, height: 630 }],
  },
};

export default async function PuertoCancunPage() {
  const all = await getMergedDevelopmentsAsync();
  const developments = all.filter((d) => d.city === 'Puerto Cancún');

  return (
    <>
      <CategoryHero
        image="/desarrollos/Blume/BLUME-Drone-1.jpg"
        imageAlt="Propiedades en venta en Puerto Cancún"
        eyebrow="— Ciudad"
        title="Puerto Cancún"
        subtitle="El enclave residencial más exclusivo de Cancún, frente al mar Caribe y la marina."
      />
      <CategoryGridSection
        eyebrow="Puerto Cancún"
        title={<>Propiedades en <span className="text-ink-3">Puerto Cancún</span></>}
        developments={developments}
      />
    </>
  );
}
