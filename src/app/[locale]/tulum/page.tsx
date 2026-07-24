import type { Metadata } from 'next';
import CategoryHero from '@/components/category/CategoryHero';
import CategoryGridSection from '@/components/category/CategoryGridSection';
import { getMergedDevelopmentsAsync } from '@/lib/developments';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const isEs = locale !== 'en';
  const title = isEs ? 'Propiedades en Venta en Tulum' : 'Properties for Sale in Tulum';
  const description = isEs
    ? 'Departamentos en preventa en Tulum, el destino de mayor crecimiento de México. Aldea Zamá y las zonas de mayor plusvalía.'
    : "Pre-sale apartments in Tulum, Mexico's fastest-growing destination. Aldea Zamá and the highest-value areas.";
  return {
    title,
    description,
    alternates: {
      canonical: isEs ? 'https://www.tresor.mx/tulum' : 'https://www.tresor.mx/en/tulum',
      languages: {
        es: 'https://www.tresor.mx/tulum',
        en: 'https://www.tresor.mx/en/tulum',
        'x-default': 'https://www.tresor.mx/tulum',
      },
    },
    openGraph: {
      title,
      description,
      url: isEs ? 'https://www.tresor.mx/tulum' : 'https://www.tresor.mx/en/tulum',
      images: [{ url: '/ogfinal.jpg', width: 1200, height: 630 }],
      locale: isEs ? 'es_MX' : 'en_US',
    },
  };
}

export default async function TulumPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const isEs = locale !== 'en';
  const all = await getMergedDevelopmentsAsync();
  const developments = all.filter((d) => d.city === 'Tulum');

  return (
    <>
      <CategoryHero
        image="/desarrollos/xaviera/fotos/1. Fachada de Noche.jpg"
        imageAlt={isEs ? 'Propiedades en venta en Tulum' : 'Properties for sale in Tulum'}
        eyebrow={isEs ? '— Ciudad' : '— City'}
        title="Tulum"
        subtitle={
          isEs
            ? 'El destino de mayor crecimiento de México — departamentos en Aldea Zamá y las zonas de mayor plusvalía.'
            : "Mexico's fastest-growing destination — apartments in Aldea Zamá and the highest-value areas."
        }
      />
      <CategoryGridSection
        eyebrow="Tulum"
        title={isEs ? <>Propiedades en <span className="text-ink-3">Tulum</span></> : <>Properties in <span className="text-ink-3">Tulum</span></>}
        developments={developments}
      />
    </>
  );
}
