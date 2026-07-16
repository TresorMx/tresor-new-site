import type { Metadata } from 'next';
import CategoryHero from '@/components/category/CategoryHero';
import CategoryGridSection from '@/components/category/CategoryGridSection';
import { getMergedDevelopmentsAsync, developers } from '@/lib/developments';

// Espejo privado de /onix-living para brokers de confianza — ver
// src/app/[locale]/drive/quattro-plaza-center/page.tsx para el criterio.
export const dynamic = 'force-dynamic';

const dev = developers.Onix;

export const metadata: Metadata = {
  title: 'Onix Living - Departamentos en Preventa y Entrega Inmediata en Cancún',
  description:
    'Departamentos en preventa y entrega inmediata de Onix Living, comunidades residenciales modernas y bien planeadas en Cancún.',
  robots: { index: false, follow: false },
  openGraph: {
    title: 'Onix Living - Departamentos en Preventa y Entrega Inmediata en Cancún',
    description:
      'Departamentos en preventa y entrega inmediata de Onix Living, comunidades residenciales modernas y bien planeadas en Cancún.',
    images: [{ url: '/desarrollos/villalta/portada3.jpg', width: 1920, height: 992 }],
  },
};

export default async function DriveOnixLivingPage() {
  const all = await getMergedDevelopmentsAsync();
  const developments = all.filter((d) => d.developer === 'Onix');

  return (
    <>
      <CategoryHero
        image="/desarrollos/villalta/portada3.jpg"
        imageAlt={dev.name}
        eyebrow="— Desarrollador"
        title={dev.name}
        subtitle="Comunidades residenciales modernas y bien planeadas, en armonía con su entorno — diseño contemporáneo y plusvalía a largo plazo."
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
