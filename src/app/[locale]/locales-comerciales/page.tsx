import type { Metadata } from 'next';
import CategoryHero from '@/components/category/CategoryHero';
import CategoryGridSection from '@/components/category/CategoryGridSection';
import { getMergedDevelopmentsAsync } from '@/lib/developments';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const isEs = locale !== 'en';
  const title = isEs ? 'Locales Comerciales en Venta en Cancún' : 'Commercial Spaces for Sale in Cancún';
  const description = isEs
    ? 'Locales comerciales en preventa en plazas premium de Cancún. Alto retorno, ubicaciones estratégicas y desarrolladores con trayectoria comprobada.'
    : 'Pre-sale commercial spaces in premium plazas in Cancún. High returns, strategic locations and developers with a proven track record.';
  return {
    title,
    description,
    alternates: {
      canonical: isEs ? 'https://www.tresor.mx/locales-comerciales' : 'https://www.tresor.mx/en/locales-comerciales',
      languages: {
        es: 'https://www.tresor.mx/locales-comerciales',
        en: 'https://www.tresor.mx/en/locales-comerciales',
        'x-default': 'https://www.tresor.mx/locales-comerciales',
      },
    },
    openGraph: {
      title,
      description,
      url: isEs ? 'https://www.tresor.mx/locales-comerciales' : 'https://www.tresor.mx/en/locales-comerciales',
      images: [{ url: '/ogfinal.jpg', width: 1200, height: 630 }],
      locale: isEs ? 'es_MX' : 'en_US',
    },
  };
}

export default async function LocalesComercialesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const isEs = locale !== 'en';
  const all = await getMergedDevelopmentsAsync();
  const developments = all.filter((d) => d.propertyType === 'Local Comercial');

  return (
    <>
      <CategoryHero
        image="/renders/gardens/01.jpg"
        imageAlt={isEs ? 'Locales comerciales en venta en Cancún' : 'Commercial spaces for sale in Cancún'}
        eyebrow={isEs ? '— Propiedades' : '— Properties'}
        title={isEs ? 'Locales Comerciales' : 'Commercial Spaces'}
        subtitle={
          isEs
            ? 'Plazas comerciales premium en Cancún, listas para invertir con alto potencial de retorno.'
            : 'Premium commercial plazas in Cancún, ready to invest in with high return potential.'
        }
      />
      <CategoryGridSection
        eyebrow={isEs ? 'Locales Comerciales' : 'Commercial Spaces'}
        title={isEs ? <>Invierte en <span className="text-ink-3">plazas de alto retorno</span></> : <>Invest in <span className="text-ink-3">high-return plazas</span></>}
        developments={developments}
      />
    </>
  );
}
