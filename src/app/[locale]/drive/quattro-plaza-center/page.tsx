import type { Metadata } from 'next';
import CategoryHero from '@/components/category/CategoryHero';
import CategoryGridSection from '@/components/category/CategoryGridSection';
import { getMergedDevelopmentsAsync } from '@/lib/developments';

// Espejo privado de /quattro-plaza-center para brokers de confianza — mismo
// diseño, pero el link "Drive de Ventas" siempre aparece en las cards (sin
// login) y apunta al Drive abierto. Sin indexar, sin enlazar desde ningún
// lado del sitio — la URL en sí es la única protección.
export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Quattro Plaza Center - Locales en Preventa en Cancún',
  description:
    'Locales comerciales en preventa en Quattro Plaza Center, la línea de plazas comerciales de Tresor Real Estate en las zonas de mayor crecimiento de Cancún.',
  robots: { index: false, follow: false },
  openGraph: {
    title: 'Quattro Plaza Center - Locales en Preventa en Cancún',
    description:
      'Locales comerciales en preventa en Quattro Plaza Center, la línea de plazas comerciales de Tresor Real Estate en las zonas de mayor crecimiento de Cancún.',
    images: [{ url: '/renders/gardens/01.jpg', width: 1920, height: 992 }],
  },
};

export default async function DriveQuattroPlazaCenterPage() {
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
        forceDriveLink
      />
    </>
  );
}
