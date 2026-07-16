import type { Metadata } from 'next';
import CategoryHero from '@/components/category/CategoryHero';
import CategoryGridSection from '@/components/category/CategoryGridSection';
import { getMergedDevelopmentsAsync } from '@/lib/developments';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Propiedades en Venta en Cancún',
  description:
    'Departamentos, locales comerciales y lotes residenciales en las zonas de mayor crecimiento de Cancún. Preventa y entrega inmediata.',
  alternates: { canonical: 'https://www.tresor.mx/cancun' },
  openGraph: {
    title: 'Propiedades en Venta en Cancún',
    description: 'Departamentos, locales comerciales y lotes residenciales en las zonas de mayor crecimiento de Cancún.',
    url: 'https://www.tresor.mx/cancun',
    images: [{ url: '/ogfinal.jpg', width: 1200, height: 630 }],
  },
};

export default async function CancunPage() {
  const all = await getMergedDevelopmentsAsync();
  const developments = all.filter((d) => d.city === 'Cancún');

  return (
    <>
      <CategoryHero
        image="/desarrollos/villalta/portada2.jpg"
        imageAlt="Propiedades en venta en Cancún"
        eyebrow="— Ciudad"
        title="Cancún"
        subtitle="Departamentos, locales comerciales y lotes residenciales en las zonas de mayor crecimiento y plusvalía de la ciudad."
      />
      <CategoryGridSection
        eyebrow="Cancún"
        title={<>Propiedades en <span className="text-ink-3">Cancún</span></>}
        developments={developments}
      />
    </>
  );
}
