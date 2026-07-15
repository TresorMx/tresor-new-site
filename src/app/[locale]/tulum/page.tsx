import type { Metadata } from 'next';
import CategoryHero from '@/components/category/CategoryHero';
import CategoryGridSection from '@/components/category/CategoryGridSection';
import { getMergedDevelopmentsAsync } from '@/lib/developments';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Propiedades en Venta en Tulum',
  description:
    'Departamentos en preventa en Tulum, el destino de mayor crecimiento de México. Aldea Zamá y las zonas de mayor plusvalía.',
  alternates: { canonical: 'https://tresor.mx/tulum' },
  openGraph: {
    title: 'Propiedades en Venta en Tulum',
    description: 'Departamentos en preventa en Tulum, el destino de mayor crecimiento de México.',
    url: 'https://tresor.mx/tulum',
    images: [{ url: '/ogfinal.jpg', width: 1200, height: 630 }],
  },
};

export default async function TulumPage() {
  const all = await getMergedDevelopmentsAsync();
  const developments = all.filter((d) => d.city === 'Tulum');

  return (
    <>
      <CategoryHero
        image="/desarrollos/xaviera/fotos/1. Fachada de Noche.jpg"
        imageAlt="Propiedades en venta en Tulum"
        eyebrow="— Ciudad"
        title="Tulum"
        subtitle="El destino de mayor crecimiento de México — departamentos en Aldea Zamá y las zonas de mayor plusvalía."
      />
      <CategoryGridSection
        eyebrow="Tulum"
        title={<>Propiedades en <span className="text-ink-3">Tulum</span></>}
        developments={developments}
      />
    </>
  );
}
