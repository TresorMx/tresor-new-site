import type { Metadata } from 'next';
import CategoryHero from '@/components/category/CategoryHero';
import CategoryGridSection from '@/components/category/CategoryGridSection';
import { getMergedDevelopmentsAsync, isListingRelationship } from '@/lib/developments';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const isEs = locale !== 'en';
  // Cancún es la única ciudad con inventario mixto (departamentos, locales,
  // lotes y bodegas), así que el título no puede decir solo "Condos" sin ser
  // inexacto — se nombran los tres tipos, con condos al frente.
  const title = isEs ? 'Propiedades en Venta en Cancún' : 'Real Estate in Cancún — Condos, Commercial Space & Lots';
  const description = isEs
    ? 'Departamentos, locales comerciales y lotes residenciales en las zonas de mayor crecimiento de Cancún. Preventa y entrega inmediata.'
    : 'Condos, commercial space and residential lots for sale in the fastest-growing areas of Cancún. Pre-construction and move-in ready, with financing options for foreign buyers.';
  return {
    title,
    description,
    alternates: {
      canonical: isEs ? 'https://www.tresor.mx/cancun' : 'https://www.tresor.mx/en/cancun',
      languages: {
        es: 'https://www.tresor.mx/cancun',
        en: 'https://www.tresor.mx/en/cancun',
        'x-default': 'https://www.tresor.mx/cancun',
      },
    },
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
  const developments = all.filter((d) => d.city === 'Cancún' && !isListingRelationship(d.relationship));

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
            : "Condos, commercial space and residential lots in the city's fastest-growing, highest-value areas."
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
