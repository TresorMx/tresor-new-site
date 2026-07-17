import type { Metadata } from 'next';
import CategoryHero from '@/components/category/CategoryHero';
import CategoryGridSection from '@/components/category/CategoryGridSection';
import { getMergedDevelopmentsAsync, developers } from '@/lib/developments';

// Espejo privado de /onix-living para brokers de confianza — ver
// src/app/[locale]/drive/quattro-plaza-center/page.tsx para el criterio.
export const dynamic = 'force-dynamic';

const dev = developers.Onix;

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const isEs = locale !== 'en';
  const title = isEs
    ? 'Onix Living - Departamentos en Preventa y Entrega Inmediata en Cancún'
    : 'Onix Living - Apartments in Pre-Sale and Ready to Move In, Cancún';
  const description = isEs
    ? 'Departamentos en preventa y entrega inmediata de Onix Living, comunidades residenciales modernas y bien planeadas en Cancún.'
    : 'Apartments in pre-sale and ready to move in by Onix Living, modern and well-planned residential communities in Cancún.';
  return {
    title,
    description,
    robots: { index: false, follow: false },
    openGraph: {
      title,
      description,
      images: [{ url: '/desarrollos/villalta/portada3.jpg', width: 1920, height: 992 }],
      locale: isEs ? 'es_MX' : 'en_US',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: ['/desarrollos/villalta/portada3.jpg'],
    },
  };
}

export default async function DriveOnixLivingPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const isEs = locale !== 'en';
  const all = await getMergedDevelopmentsAsync();
  // Bardenna (bardenna-onix) fuera de este landing por pedido explícito —
  // sigue sin ficha real (href: '#'), no tiene sentido ofrecerla aquí.
  const developments = all.filter((d) => d.developer === 'Onix' && d.slug !== 'bardenna-onix');

  return (
    <>
      <CategoryHero
        image="/desarrollos/villalta/portada3.jpg"
        imageAlt={dev.name}
        eyebrow={isEs ? '— Desarrollador' : '— Developer'}
        title={dev.name}
        subtitle={
          isEs
            ? 'Comunidades residenciales modernas y bien planeadas, en armonía con su entorno — diseño contemporáneo y plusvalía a largo plazo.'
            : 'Modern, well-planned residential communities in harmony with their surroundings — contemporary design and long-term appreciation.'
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
