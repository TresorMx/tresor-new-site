import type { Metadata } from 'next';
import CategoryHero from '@/components/category/CategoryHero';
import CategoryGridSection from '@/components/category/CategoryGridSection';
import { getListingsDevelopmentsAsync } from '@/lib/developments';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const isEs = locale !== 'en';
  const title = isEs ? 'Listings en Cancún: Renta y Venta con Disponibilidad Real' : 'Listings in Cancún: Rent and Sale with Real Availability';
  const description = isEs
    ? 'Departamentos, locales, oficinas y bodegas en Cancún con disponibilidad real, en renta o en venta.'
    : 'Apartments, retail spaces, offices and warehouses in Cancún with real availability, for rent or sale.';
  return {
    title,
    description,
    alternates: {
      canonical: isEs ? 'https://www.tresor.mx/listings' : 'https://www.tresor.mx/en/listings',
      languages: {
        es: 'https://www.tresor.mx/listings',
        en: 'https://www.tresor.mx/en/listings',
        'x-default': 'https://www.tresor.mx/listings',
      },
    },
    openGraph: {
      title,
      description,
      url: isEs ? 'https://www.tresor.mx/listings' : 'https://www.tresor.mx/en/listings',
      images: [{ url: '/ogfinal.jpg', width: 1200, height: 630 }],
      locale: isEs ? 'es_MX' : 'en_US',
    },
  };
}

export default async function ListingsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const isEs = locale !== 'en';
  const developments = await getListingsDevelopmentsAsync();

  return (
    <>
      <CategoryHero
        image="/listings/lindavista/04-scaled.jpg"
        imageAlt={isEs ? 'Departamentos, locales, oficinas y bodegas en renta y venta en Cancún' : 'Apartments, retail, offices and warehouses for rent and sale in Cancún'}
        eyebrow={isEs ? '— Propiedades' : '— Properties'}
        title={isEs ? 'Listings' : 'Listings'}
        subtitle={
          isEs
            ? 'Departamentos, locales, oficinas y bodegas con disponibilidad real, en renta o en venta.'
            : 'Apartments, retail, offices and warehouses with real availability, for rent or sale.'
        }
      />
      <CategoryGridSection
        eyebrow={isEs ? 'Listings' : 'Listings'}
        title={isEs ? <>Renta y venta con <span className="text-ink-3">disponibilidad real</span></> : <>Rent and sale with <span className="text-ink-3">real availability</span></>}
        developments={developments}
        showDeveloperFilter={false}
        showTypeFilter
        schemaUrl={isEs ? 'https://www.tresor.mx/listings' : 'https://www.tresor.mx/en/listings'}
        schemaName={isEs ? 'Listings en Cancún: Renta y Venta con Disponibilidad Real' : 'Listings in Cancún: Rent and Sale with Real Availability'}
        schemaDescription={
          isEs
            ? 'Departamentos, locales, oficinas y bodegas en Cancún con disponibilidad real, en renta o en venta.'
            : 'Apartments, retail spaces, offices and warehouses in Cancún with real availability, for rent or sale.'
        }
        breadcrumbLabel="Listings"
        locale={isEs ? 'es_MX' : 'en_US'}
      />
    </>
  );
}
