import type { Metadata } from 'next';
import CategoryHero from '@/components/category/CategoryHero';
import CategoryGridSection from '@/components/category/CategoryGridSection';
import { getListingsDevelopmentsAsync } from '@/lib/developments';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const isEs = locale !== 'en';
  const title = isEs ? 'Listings: Locales, Oficinas y Bodegas en Cancún' : 'Listings: Retail, Offices and Warehouses in Cancún';
  const description = isEs
    ? 'Inventario de terceros que Tresor comercializa en Cancún: locales y oficinas en renta, bodegas industriales en venta. Disponibilidad real, sin intermediarios.'
    : 'Third-party inventory commercialized by Tresor in Cancún: retail spaces and offices for rent, industrial warehouses for sale. Real availability, no middlemen.';
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
        imageAlt={isEs ? 'Locales, oficinas y bodegas en renta y venta en Cancún' : 'Retail, offices and warehouses for rent and sale in Cancún'}
        eyebrow={isEs ? '— Propiedades' : '— Properties'}
        title={isEs ? 'Listings' : 'Listings'}
        subtitle={
          isEs
            ? 'Inventario de terceros que Tresor comercializa en Cancún: locales, oficinas y bodegas con disponibilidad real, en renta o en venta.'
            : 'Third-party inventory commercialized by Tresor in Cancún: retail, offices and warehouses with real availability, for rent or sale.'
        }
      />
      <CategoryGridSection
        eyebrow={isEs ? 'Listings' : 'Listings'}
        title={isEs ? <>Renta y venta con <span className="text-ink-3">disponibilidad real</span></> : <>Rent and sale with <span className="text-ink-3">real availability</span></>}
        developments={developments}
      />
    </>
  );
}
