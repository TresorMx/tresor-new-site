import type { Metadata } from 'next';
import CategoryHero from '@/components/category/CategoryHero';
import CategoryGridSection from '@/components/category/CategoryGridSection';
import { getMergedDevelopmentsAsync } from '@/lib/developments';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const isEs = locale !== 'en';
  const title = isEs ? 'Propiedades en Venta en Cancún' : 'Properties for Sale in Cancún';
  const description = isEs
    ? 'Departamentos, locales comerciales y lotes residenciales en las zonas de mayor crecimiento de Cancún. Preventa y entrega inmediata.'
    : 'Apartments, commercial spaces and residential lots in the fastest-growing areas of Cancún. Pre-sale and immediate delivery.';
  return {
    title,
    description,
    alternates: { canonical: isEs ? 'https://www.tresor.mx/cancun' : 'https://www.tresor.mx/en/cancun' },
    openGraph: {
      title,
      description,
      url: isEs ? 'https://www.tresor.mx/cancun' : 'https://www.tresor.mx/en/cancun',
      images: [{ url: '/ogfinal.jpg', width: 1200, height: 630 }],
      locale: isEs ? 'es_MX' : 'en_US',
    },
  };
}

export default async function CancunPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const isEs = locale !== 'en';
  const all = await getMergedDevelopmentsAsync();
  const developments = all.filter((d) => d.city === 'Cancún');

  return (
    <>
      <CategoryHero
        image="/desarrollos/villalta/portada2.jpg"
        imageAlt={isEs ? 'Propiedades en venta en Cancún' : 'Properties for sale in Cancún'}
        eyebrow={isEs ? '— Ciudad' : '— City'}
        title="Cancún"
        subtitle={
          isEs
            ? 'Departamentos, locales comerciales y lotes residenciales en las zonas de mayor crecimiento y plusvalía de la ciudad.'
            : "Apartments, commercial spaces and residential lots in the city's fastest-growing, highest-value areas."
        }
      />
      <CategoryGridSection
        eyebrow="Cancún"
        title={isEs ? <>Propiedades en <span className="text-ink-3">Cancún</span></> : <>Properties in <span className="text-ink-3">Cancún</span></>}
        developments={developments}
      />
    </>
  );
}
