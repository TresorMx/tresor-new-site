import type { Metadata } from 'next';
import CategoryHero from '@/components/category/CategoryHero';
import CategoryGridSection from '@/components/category/CategoryGridSection';
import { getMergedDevelopmentsAsync } from '@/lib/developments';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const isEs = locale !== 'en';
  const title = isEs ? 'Propiedades en Venta en Puerto Cancún' : 'Properties for Sale in Puerto Cancún';
  const description = isEs
    ? 'Departamentos de lujo en Puerto Cancún, el enclave residencial más exclusivo de la ciudad, frente al mar Caribe y la marina.'
    : "Luxury apartments in Puerto Cancún, the city's most exclusive residential enclave, facing the Caribbean Sea and the marina.";
  return {
    title,
    description,
    alternates: { canonical: isEs ? 'https://www.tresor.mx/puerto-cancun' : 'https://www.tresor.mx/en/puerto-cancun' },
    openGraph: {
      title,
      description,
      url: isEs ? 'https://www.tresor.mx/puerto-cancun' : 'https://www.tresor.mx/en/puerto-cancun',
      images: [{ url: '/ogfinal.jpg', width: 1200, height: 630 }],
      locale: isEs ? 'es_MX' : 'en_US',
    },
  };
}

export default async function PuertoCancunPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const isEs = locale !== 'en';
  const all = await getMergedDevelopmentsAsync();
  const developments = all.filter((d) => d.city === 'Puerto Cancún');

  return (
    <>
      <CategoryHero
        image="/desarrollos/Blume/BLUME-Drone-1.jpg"
        imageAlt={isEs ? 'Propiedades en venta en Puerto Cancún' : 'Properties for sale in Puerto Cancún'}
        eyebrow={isEs ? '— Ciudad' : '— City'}
        title="Puerto Cancún"
        subtitle={
          isEs
            ? 'El enclave residencial más exclusivo de Cancún, frente al mar Caribe y la marina.'
            : "Cancún's most exclusive residential enclave, facing the Caribbean Sea and the marina."
        }
      />
      <CategoryGridSection
        eyebrow="Puerto Cancún"
        title={isEs ? <>Propiedades en <span className="text-ink-3">Puerto Cancún</span></> : <>Properties in <span className="text-ink-3">Puerto Cancún</span></>}
        developments={developments}
      />
    </>
  );
}
