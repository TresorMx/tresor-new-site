import type { Metadata } from 'next';
import CategoryHero from '@/components/category/CategoryHero';
import CategoryGridSection from '@/components/category/CategoryGridSection';
import { getMergedDevelopmentsAsync } from '@/lib/developments';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Lotes Residenciales en Venta en Cancún',
  description:
    'Lotes y macrolotes residenciales en las zonas de mayor crecimiento de Cancún. Ideal para desarrolladores e inversionistas.',
  alternates: { canonical: 'https://tresor.mx/lotes-residenciales' },
  openGraph: {
    title: 'Lotes Residenciales en Venta en Cancún',
    description: 'Lotes y macrolotes residenciales en las zonas de mayor plusvalía de Cancún.',
    url: 'https://tresor.mx/lotes-residenciales',
    images: [{ url: '/desarrollos/Sanam/portada.jpg', width: 1920, height: 992 }],
  },
};

export default async function LotesResidencialesPage() {
  const all = await getMergedDevelopmentsAsync();
  const developments = all.filter((d) => d.propertyType === 'Lote Residencial');

  return (
    <>
      <CategoryHero
        image="/desarrollos/Sanam/portada.jpg"
        imageAlt="Lotes residenciales en venta en Cancún"
        eyebrow="— Propiedades"
        title="Lotes Residenciales"
        subtitle="Terrenos en las zonas de mayor plusvalía de Cancún, listos para tu próxima inversión."
      />
      <CategoryGridSection
        eyebrow="Lotes Residenciales"
        title={<>Terrenos en <span className="text-ink-3">zonas de alta plusvalía</span></>}
        developments={developments}
      />
    </>
  );
}
