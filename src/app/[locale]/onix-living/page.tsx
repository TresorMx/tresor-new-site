import type { Metadata } from 'next';
import CategoryHero from '@/components/category/CategoryHero';
import CategoryGridSection from '@/components/category/CategoryGridSection';
import { getMergedDevelopmentsAsync, developers } from '@/lib/developments';

export const dynamic = 'force-dynamic';

const dev = developers.Onix;

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
      canonical: isEs ? 'https://www.tresor.mx/onix-living' : 'https://www.tresor.mx/en/onix-living',
      languages: {
        es: 'https://www.tresor.mx/onix-living',
        en: 'https://www.tresor.mx/en/onix-living',
        'x-default': 'https://www.tresor.mx/onix-living',
      },
    },
    openGraph: {
      title,
      description,
      url: isEs ? 'https://www.tresor.mx/onix-living' : 'https://www.tresor.mx/en/onix-living',
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

export default async function OnixLivingPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const isEs = locale !== 'en';
  const all = await getMergedDevelopmentsAsync();
  const developments = all.filter((d) => d.developer === 'Onix');

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
        title={isEs ? <>Proyectos de <span className="text-ink-3">{dev.name}</span></> : <>{dev.name} <span className="text-ink-3">Projects</span></>}
        developments={developments}
        showDeveloperFilter={false}
      />
    </>
  );
}
