import type { Metadata } from 'next';
import CategoryHero from '@/components/category/CategoryHero';
import CategoryGridSection from '@/components/category/CategoryGridSection';
import { getMergedDevelopmentsAsync } from '@/lib/developments';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const isEs = locale !== 'en';
  const title = isEs ? 'Lotes Residenciales en Venta en Cancún' : 'Residential Lots for Sale in Cancún';
  const description = isEs
    ? 'Lotes y macrolotes residenciales en las zonas de mayor crecimiento de Cancún. Ideal para desarrolladores e inversionistas.'
    : "Residential lots and macro-lots in Cancún's fastest-growing areas. Ideal for developers and investors.";
  return {
    title,
    description,
    alternates: {
      canonical: isEs ? 'https://www.tresor.mx/lotes-residenciales' : 'https://www.tresor.mx/en/lotes-residenciales',
      languages: {
        es: 'https://www.tresor.mx/lotes-residenciales',
        en: 'https://www.tresor.mx/en/lotes-residenciales',
        'x-default': 'https://www.tresor.mx/lotes-residenciales',
      },
    },
    openGraph: {
      title,
      description,
      url: isEs ? 'https://www.tresor.mx/lotes-residenciales' : 'https://www.tresor.mx/en/lotes-residenciales',
      images: [{ url: '/ogfinal.jpg', width: 1200, height: 630 }],
      locale: isEs ? 'es_MX' : 'en_US',
    },
  };
}

export default async function LotesResidencialesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const isEs = locale !== 'en';
  const all = await getMergedDevelopmentsAsync();
  const developments = all.filter((d) => d.propertyType === 'Lote Residencial');

  return (
    <>
      <CategoryHero
        image="/desarrollos/Sanam/portada.jpg"
        imageAlt={isEs ? 'Lotes residenciales en venta en Cancún' : 'Residential lots for sale in Cancún'}
        eyebrow={isEs ? '— Propiedades' : '— Properties'}
        title={isEs ? 'Lotes Residenciales' : 'Residential Lots'}
        subtitle={
          isEs
            ? 'Terrenos en las zonas de mayor plusvalía de Cancún, listos para tu próxima inversión.'
            : "Land in Cancún's highest-value areas, ready for your next investment."
        }
      />
      <CategoryGridSection
        eyebrow={isEs ? 'Lotes Residenciales' : 'Residential Lots'}
        title={isEs ? <>Terrenos en <span className="text-ink-3">zonas de alta plusvalía</span></> : <>Land in <span className="text-ink-3">high-value areas</span></>}
        developments={developments}
      />
    </>
  );
}
