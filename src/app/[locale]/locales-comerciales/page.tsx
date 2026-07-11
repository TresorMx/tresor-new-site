import type { Metadata } from 'next';
import CategoryHero from '@/components/category/CategoryHero';
import CategoryGridSection from '@/components/category/CategoryGridSection';
import { getMergedDevelopmentsAsync } from '@/lib/developments';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Locales Comerciales en Venta en Cancún',
  description:
    'Locales comerciales en preventa en plazas premium de Cancún. Alto retorno, ubicaciones estratégicas y desarrolladores con trayectoria comprobada.',
  alternates: { canonical: 'https://tresor.mx/locales-comerciales' },
  openGraph: {
    title: 'Locales Comerciales en Venta en Cancún',
    description: 'Locales comerciales en preventa en plazas premium de Cancún, con alto potencial de retorno.',
    url: 'https://tresor.mx/locales-comerciales',
    images: [{ url: '/renders/gardens/01.jpg', width: 1920, height: 992 }],
  },
};

export default async function LocalesComercialesPage() {
  const all = await getMergedDevelopmentsAsync();
  const developments = all.filter((d) => d.propertyType === 'Local Comercial');

  return (
    <>
      <CategoryHero
        image="/renders/gardens/01.jpg"
        imageAlt="Locales comerciales en venta en Cancún"
        eyebrow="— Propiedades"
        title="Locales Comerciales"
        subtitle="Plazas comerciales premium en Cancún, listas para invertir con alto potencial de retorno."
      />
      <CategoryGridSection
        eyebrow="Locales Comerciales"
        title={<>Invierte en <span className="text-ink-3">plazas de alto retorno</span></>}
        developments={developments}
      />
    </>
  );
}
