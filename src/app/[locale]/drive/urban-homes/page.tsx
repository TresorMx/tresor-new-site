import type { Metadata } from 'next';
import CategoryHero from '@/components/category/CategoryHero';
import CategoryGridSection from '@/components/category/CategoryGridSection';
import { getMergedDevelopmentsAsync, developers } from '@/lib/developments';

// Espejo privado de /urban-homes para brokers de confianza — ver
// src/app/[locale]/drive/quattro-plaza-center/page.tsx para el criterio.
export const dynamic = 'force-dynamic';

const dev = developers['Urban Homes'];

export const metadata: Metadata = {
  title: `Drive de Ventas · ${dev.name}`,
  robots: { index: false, follow: false },
};

export default async function DriveUrbanHomesPage() {
  const all = await getMergedDevelopmentsAsync();
  const developments = all.filter((d) => d.developer === 'Urban Homes');

  return (
    <>
      <CategoryHero
        image="/desarrollos/Blume/BLUME-Drone-1.jpg"
        imageAlt={dev.name}
        eyebrow="— Desarrollador"
        title={dev.name}
        subtitle="Más de 18 años definiendo el estándar de vida de lujo en Puerto Cancún, Playa del Carmen y Tulum."
        logo={dev.logoWhite ?? dev.logoDark}
        logoAlt={dev.name}
        logoIsWhite={Boolean(dev.logoWhite)}
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
