import type { Metadata } from 'next';
import CategoryHero from '@/components/category/CategoryHero';
import CategoryGridSection from '@/components/category/CategoryGridSection';
import { getMergedDevelopmentsAsync, developers } from '@/lib/developments';

// Espejo privado de /live-desarrollos para brokers de confianza — ver
// src/app/[locale]/drive/quattro-plaza-center/page.tsx para el criterio.
export const dynamic = 'force-dynamic';

const dev = developers.Live;

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const isEs = locale !== 'en';
  const title = isEs
    ? 'Live Desarrollos - Departamentos en Preventa en Cancún'
    : 'Live Desarrollos - Apartments in Pre-Sale in Cancún';
  const description = isEs
    ? 'Departamentos en preventa de Live Desarrollos, diseño contemporáneo y amenidades de primer nivel en las zonas de mayor plusvalía de Cancún.'
    : "Apartments in pre-sale by Live Desarrollos, contemporary design and top-tier amenities in Cancún's highest-value areas.";
  return {
    title,
    description,
    robots: { index: false, follow: false },
    openGraph: {
      title,
      description,
      images: [{ url: '/desarrollos/ximena/2.-Fachada-de-Noche.jpg', width: 1920, height: 992 }],
      locale: isEs ? 'es_MX' : 'en_US',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: ['/desarrollos/ximena/2.-Fachada-de-Noche.jpg'],
    },
  };
}

export default async function DriveLiveDesarrollosPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const isEs = locale !== 'en';
  const all = await getMergedDevelopmentsAsync();
  const developments = all.filter((d) => d.developer === 'Live');

  return (
    <>
      <CategoryHero
        image="/desarrollos/ximena/2.-Fachada-de-Noche.jpg"
        imageAlt={dev.name}
        eyebrow={isEs ? '— Desarrollador' : '— Developer'}
        title={dev.name}
        subtitle={
          isEs
            ? 'Espacios residenciales de lujo en las zonas de mayor plusvalía de Cancún, con diseño contemporáneo y amenidades de primer nivel.'
            : "Luxury residential spaces in Cancún's highest-value areas, with contemporary design and top-tier amenities."
        }
        logo={dev.logoDark}
        logoAlt={dev.name}
      />
      <CategoryGridSection
        eyebrow={isEs ? 'Desarrollador' : 'Developer'}
        title={
          isEs
            ? <>Proyectos de <span className="text-ink-3">{dev.name}</span></>
            : <>{dev.name} <span className="text-ink-3">Developments</span></>
        }
        developments={developments}
        showDeveloperFilter={false}
        forceDriveLink
      />
    </>
  );
}
