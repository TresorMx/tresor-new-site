import type { Metadata } from 'next';
import CategoryHero from '@/components/category/CategoryHero';
import CategoryGridSection from '@/components/category/CategoryGridSection';
import { getMergedDevelopmentsAsync, developers } from '@/lib/developments';

// Espejo privado de /urban-homes para brokers de confianza — ver
// src/app/[locale]/drive/quattro-plaza-center/page.tsx para el criterio.
export const dynamic = 'force-dynamic';

const dev = developers['Urban Homes'];

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const isEs = locale !== 'en';
  const title = isEs
    ? 'Urban Homes - Departamentos en Preventa y Entrega Inmediata en Cancún'
    : 'Urban Homes - Apartments in Pre-Sale and Ready to Move In, Cancún';
  const description = isEs
    ? 'Departamentos en preventa y entrega inmediata de Urban Homes en Puerto Cancún, Playa del Carmen y Tulum — más de 18 años de experiencia.'
    : 'Apartments in pre-sale and ready to move in by Urban Homes in Puerto Cancún, Playa del Carmen, and Tulum — over 18 years of experience.';
  return {
    title,
    description,
    robots: { index: false, follow: false },
    openGraph: {
      title,
      description,
      images: [{ url: '/desarrollos/Blume/BLUME-Drone-1.jpg', width: 1920, height: 992 }],
      locale: isEs ? 'es_MX' : 'en_US',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: ['/desarrollos/Blume/BLUME-Drone-1.jpg'],
    },
  };
}

export default async function DriveUrbanHomesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const isEs = locale !== 'en';
  const all = await getMergedDevelopmentsAsync();
  const developments = all.filter((d) => d.developer === 'Urban Homes');

  return (
    <>
      <CategoryHero
        image="/desarrollos/Blume/BLUME-Drone-1.jpg"
        imageAlt={dev.name}
        eyebrow={isEs ? '— Desarrollador' : '— Developer'}
        title={dev.name}
        subtitle={
          isEs
            ? 'Más de 18 años definiendo el estándar de vida de lujo en Puerto Cancún, Playa del Carmen y Tulum.'
            : 'Over 18 years defining the luxury lifestyle standard in Puerto Cancún, Playa del Carmen, and Tulum.'
        }
        logo={dev.logoWhite ?? dev.logoDark}
        logoAlt={dev.name}
        logoIsWhite={Boolean(dev.logoWhite)}
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
