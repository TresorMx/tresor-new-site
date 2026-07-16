import type { Metadata } from 'next';
import CategoryHero from '@/components/category/CategoryHero';
import CategoryGridSection from '@/components/category/CategoryGridSection';
import { getMergedDevelopmentsAsync, developers } from '@/lib/developments';

// Espejo privado de /live-desarrollos para brokers de confianza — ver
// src/app/[locale]/drive/quattro-plaza-center/page.tsx para el criterio.
export const dynamic = 'force-dynamic';

const dev = developers.Live;

export const metadata: Metadata = {
  title: 'Live Desarrollos - Departamentos en Preventa en Cancún',
  description:
    'Departamentos en preventa de Live Desarrollos, diseño contemporáneo y amenidades de primer nivel en las zonas de mayor plusvalía de Cancún.',
  robots: { index: false, follow: false },
  openGraph: {
    title: 'Live Desarrollos - Departamentos en Preventa en Cancún',
    description:
      'Departamentos en preventa de Live Desarrollos, diseño contemporáneo y amenidades de primer nivel en las zonas de mayor plusvalía de Cancún.',
    images: [{ url: '/desarrollos/ximena/2.-Fachada-de-Noche.jpg', width: 1920, height: 992 }],
  },
};

export default async function DriveLiveDesarrollosPage() {
  const all = await getMergedDevelopmentsAsync();
  const developments = all.filter((d) => d.developer === 'Live');

  return (
    <>
      <CategoryHero
        image="/desarrollos/ximena/2.-Fachada-de-Noche.jpg"
        imageAlt={dev.name}
        eyebrow="— Desarrollador"
        title={dev.name}
        subtitle="Espacios residenciales de lujo en las zonas de mayor plusvalía de Cancún, con diseño contemporáneo y amenidades de primer nivel."
        logo={dev.logoDark}
        logoAlt={dev.name}
      />
      <CategoryGridSection
        eyebrow="Desarrollador"
        title={<>Proyectos de <span className="text-ink-3">{dev.name}</span></>}
        developments={developments}
        showDeveloperFilter={false}
        forceDriveLink
      />
    </>
  );
}
