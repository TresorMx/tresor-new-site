import type { Metadata } from 'next';
import CategoryHero from '@/components/category/CategoryHero';
import CategoryGridSection from '@/components/category/CategoryGridSection';
import { getMergedDevelopmentsAsync, developers } from '@/lib/developments';

export const dynamic = 'force-dynamic';

const dev = developers.Tresor;

export const metadata: Metadata = {
  title: 'Nuestros Desarrollos',
  description: dev.credentials?.es ?? `Proyectos desarrollados por ${dev.name}.`,
  alternates: { canonical: 'https://tresor.mx/tresor' },
  openGraph: {
    title: 'Nuestros Desarrollos',
    description: dev.credentials?.es ?? `Proyectos desarrollados por ${dev.name}.`,
    url: 'https://tresor.mx/tresor',
    images: [{ url: '/renders/gardens/01.jpg', width: 1920, height: 992 }],
  },
};

export default async function TresorPage() {
  const all = await getMergedDevelopmentsAsync();
  const developments = all.filter((d) => d.developer === 'Tresor');

  return (
    <>
      <CategoryHero
        image="/renders/gardens/01.jpg"
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
