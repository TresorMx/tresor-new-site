import type { Metadata } from 'next';
import CategoryHero from '@/components/category/CategoryHero';
import CategoryGridSection from '@/components/category/CategoryGridSection';
import { getMergedDevelopmentsAsync, developers } from '@/lib/developments';

export const dynamic = 'force-dynamic';

const dev = developers['Urban Homes'];

export const metadata: Metadata = {
  title: `Desarrollos de ${dev.name}`,
  description: dev.credentials?.es ?? `Proyectos desarrollados por ${dev.name}.`,
  alternates: { canonical: 'https://tresor.mx/urban-homes' },
  openGraph: {
    title: `Desarrollos de ${dev.name}`,
    description: dev.credentials?.es ?? `Proyectos desarrollados por ${dev.name}.`,
    url: 'https://tresor.mx/urban-homes',
    images: [{ url: '/desarrollos/Blume/BLUME-Drone-1.jpg', width: 1920, height: 992 }],
  },
};

export default async function UrbanHomesPage() {
  const all = await getMergedDevelopmentsAsync();
  const developments = all.filter((d) => d.developer === 'Urban Homes');

  return (
    <>
      <CategoryHero
        image="/desarrollos/Blume/BLUME-Drone-1.jpg"
        imageAlt={dev.name}
        eyebrow="— Desarrollador"
        title={dev.name}
        logo={dev.logoDark}
        logoAlt={dev.name}
      />
      <CategoryGridSection
        eyebrow="Desarrollador"
        title={<>Proyectos de <span className="text-ink-3">{dev.name}</span></>}
        developments={developments}
        showDeveloperFilter={false}
      />
    </>
  );
}
