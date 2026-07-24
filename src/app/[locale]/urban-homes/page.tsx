import type { Metadata } from 'next';
import CategoryHero from '@/components/category/CategoryHero';
import CategoryGridSection from '@/components/category/CategoryGridSection';
import { getMergedDevelopmentsAsync, developers } from '@/lib/developments';

export const dynamic = 'force-dynamic';

const dev = developers['Urban Homes'];

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const isEs = locale !== 'en';
  const title = isEs ? `Desarrollos de ${dev.name}` : `${dev.name} Developments`;
  const description = isEs
    ? (dev.credentials?.es ?? `Proyectos desarrollados por ${dev.name}.`)
    : (dev.credentials?.en ?? dev.credentials?.es ?? `Projects developed by ${dev.name}.`);
  return {
    title,
    description,
    alternates: {
      canonical: isEs ? 'https://www.tresor.mx/urban-homes' : 'https://www.tresor.mx/en/urban-homes',
      languages: {
        es: 'https://www.tresor.mx/urban-homes',
        en: 'https://www.tresor.mx/en/urban-homes',
        'x-default': 'https://www.tresor.mx/urban-homes',
      },
    },
    openGraph: {
      title,
      description,
      url: isEs ? 'https://www.tresor.mx/urban-homes' : 'https://www.tresor.mx/en/urban-homes',
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

export default async function UrbanHomesPage({ params }: { params: Promise<{ locale: string }> }) {
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
            : 'Over 18 years defining the standard of luxury living in Puerto Cancún, Playa del Carmen and Tulum.'
        }
        logo={dev.logoWhite ?? dev.logoDark}
        logoAlt={dev.name}
        logoIsWhite={Boolean(dev.logoWhite)}
      />
      <CategoryGridSection
        eyebrow={isEs ? 'Desarrollador' : 'Developer'}
        title={isEs ? <>Proyectos de <span className="text-ink-3">{dev.name}</span></> : <>{dev.name} <span className="text-ink-3">Projects</span></>}
        developments={developments}
        showDeveloperFilter={false}
      />
    </>
  );
}
