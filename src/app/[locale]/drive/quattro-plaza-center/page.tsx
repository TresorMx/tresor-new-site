import type { Metadata } from 'next';
import CategoryHero from '@/components/category/CategoryHero';
import CategoryGridSection from '@/components/category/CategoryGridSection';
import { getMergedDevelopmentsAsync } from '@/lib/developments';

// Espejo privado de /quattro-plaza-center para brokers de confianza — mismo
// diseño, pero el link "Drive de Ventas" siempre aparece en las cards (sin
// login) y apunta al Drive abierto. Sin indexar, sin enlazar desde ningún
// lado del sitio — la URL en sí es la única protección.
export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const isEs = locale !== 'en';
  const title = isEs
    ? 'Quattro Plaza Center - Locales en Preventa en Cancún'
    : 'Quattro Plaza Center - Commercial Spaces in Pre-Sale in Cancún';
  const description = isEs
    ? 'Locales comerciales en preventa en Quattro Plaza Center, la línea de plazas comerciales de Tresor Real Estate en las zonas de mayor crecimiento de Cancún.'
    : "Commercial spaces in pre-sale at Quattro Plaza Center, Tresor Real Estate's line of commercial plazas in Cancún's fastest-growing areas.";
  return {
    title,
    description,
    robots: { index: false, follow: false },
    openGraph: {
      title,
      description,
      images: [{ url: '/renders/gardens/01.jpg', width: 1920, height: 992 }],
      locale: isEs ? 'es_MX' : 'en_US',
    },
  };
}

export default async function DriveQuattroPlazaCenterPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const isEs = locale !== 'en';
  const all = await getMergedDevelopmentsAsync();
  const developments = all.filter((d) => d.developer === 'Tresor');

  return (
    <>
      <CategoryHero
        image="/renders/gardens/01.jpg"
        imageAlt="Quattro Plaza Center"
        eyebrow={isEs ? '— Desarrollador' : '— Developer'}
        title="Quattro Plaza Center"
        subtitle={
          isEs
            ? 'Plazas comerciales diseñadas para el flujo y crecimiento de cada zona — ubicación estratégica y alta plusvalía en Cancún.'
            : 'Commercial plazas designed for the flow and growth of each area — strategic locations and high appreciation in Cancún.'
        }
        logo="/quattrohero.svg"
        logoAlt="Quattro Plaza Center"
        logoIsWhite
        logoScale={1.3}
      />
      <CategoryGridSection
        eyebrow={isEs ? 'Desarrollador' : 'Developer'}
        title={
          isEs
            ? <>Proyectos de <span className="text-ink-3">Quattro Plaza Center</span></>
            : <>Quattro Plaza Center <span className="text-ink-3">Developments</span></>
        }
        developments={developments}
        showDeveloperFilter={false}
        forceDriveLink
      />
    </>
  );
}
