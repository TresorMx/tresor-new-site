import type { Metadata } from 'next';
import CategoryHero from '@/components/category/CategoryHero';
import CategoryGridSection from '@/components/category/CategoryGridSection';
import { getMergedDevelopmentsAsync } from '@/lib/developments';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Quattro Plaza Center — Locales Comerciales en Cancún',
  description:
    'Quattro Plaza Center, la línea de plazas comerciales de Tresor Real Estate en Cancún: locales en preventa y entrega inmediata en zonas de alto crecimiento.',
  alternates: { canonical: 'https://tresor.mx/quattro-plaza-center' },
  openGraph: {
    title: 'Quattro Plaza Center — Locales Comerciales en Cancún',
    description:
      'Quattro Plaza Center, la línea de plazas comerciales de Tresor Real Estate en Cancún: locales en preventa y entrega inmediata en zonas de alto crecimiento.',
    url: 'https://tresor.mx/quattro-plaza-center',
    images: [{ url: '/renders/gardens/01.jpg', width: 1920, height: 992 }],
  },
};

export default async function QuattroPlazaCenterPage() {
  const all = await getMergedDevelopmentsAsync();
  const developments = all.filter((d) => d.developer === 'Tresor');

  return (
    <>
      <CategoryHero
        image="/renders/gardens/01.jpg"
        imageAlt="Quattro Plaza Center"
        eyebrow="— Desarrollador"
        title="Quattro Plaza Center"
        subtitle="Plazas comerciales diseñadas para el flujo y crecimiento de cada zona — ubicación estratégica y alta plusvalía en Cancún."
        logo="/quattrohero.svg"
        logoAlt="Quattro Plaza Center"
        logoIsWhite
        logoScale={1.3}
      />
      <CategoryGridSection
        eyebrow="Desarrollador"
        title={<>Proyectos de <span className="text-ink-3">Quattro Plaza Center</span></>}
        developments={developments}
        showDeveloperFilter={false}
      />
    </>
  );
}
