import type { Metadata } from 'next';
import CategoryHero from '@/components/category/CategoryHero';
import CategoryGridSection from '@/components/category/CategoryGridSection';
import { getMergedDevelopmentsAsync, isListingRelationship } from '@/lib/developments';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const isEs = locale !== 'en';
  // EN dice "Condos", no "Apartments": para el comprador de EE.UU./Canadá un
  // apartment es lo que renta y un condo lo que compra — la búsqueda real es
  // "condos for sale cancun". Ver PROPERTY_TYPE_EN en src/lib/developments.ts.
  const title = isEs ? 'Departamentos en Venta en Cancún y Riviera Maya' : 'Condos for Sale in Cancún and the Riviera Maya';
  const description = isEs
    ? 'Departamentos en preventa y entrega inmediata en Cancún, Tulum, Playa del Carmen y Puerto Cancún. Inversión inmobiliaria con las desarrolladoras más sólidas de Quintana Roo.'
    : "Browse condos for sale in Cancún, Tulum, Playa del Carmen and Puerto Cancún — pre-construction and move-in ready. Beachfront, marina and golf communities from Quintana Roo's most established developers.";
  return {
    title,
    description,
    alternates: {
      canonical: isEs ? 'https://www.tresor.mx/departamentos' : 'https://www.tresor.mx/en/departamentos',
      languages: {
        es: 'https://www.tresor.mx/departamentos',
        en: 'https://www.tresor.mx/en/departamentos',
        'x-default': 'https://www.tresor.mx/departamentos',
      },
    },
    openGraph: {
      title,
      description,
      url: isEs ? 'https://www.tresor.mx/departamentos' : 'https://www.tresor.mx/en/departamentos',
      images: [{ url: '/ogfinal.jpg', width: 1200, height: 630 }],
      locale: isEs ? 'es_MX' : 'en_US',
    },
  };
}

export default async function DepartamentosPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const isEs = locale !== 'en';
  const all = await getMergedDevelopmentsAsync();
  const developments = all.filter((d) => d.propertyType === 'Departamento' && !isListingRelationship(d.relationship));

  return (
    <>
      <CategoryHero
        image="/desarrollo-corporativo/LuxuryL.jpg"
        imageAlt={isEs ? 'Departamentos en venta en Cancún y Riviera Maya' : 'Apartments for sale in Cancún and the Riviera Maya'}
        eyebrow={isEs ? '— Propiedades' : '— Properties'}
        title={isEs ? 'Departamentos' : 'Apartments'}
        subtitle={
          isEs
            ? 'Preventa y entrega inmediata en Cancún, Tulum, Playa del Carmen y Puerto Cancún — con las desarrolladoras más sólidas de la región.'
            : "Pre-sale and immediate delivery in Cancún, Tulum, Playa del Carmen and Puerto Cancún — with the region's most solid developers."
        }
      />
      <CategoryGridSection
        eyebrow={isEs ? 'Departamentos' : 'Apartments'}
        title={isEs ? <>Encuentra tu <span className="text-ink-3">próximo hogar o inversión</span></> : <>Find your <span className="text-ink-3">next home or investment</span></>}
        developments={developments}
      />
    </>
  );
}
