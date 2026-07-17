import type { Metadata } from 'next';
import CategoryHero from '@/components/category/CategoryHero';
import CategoryGridSection from '@/components/category/CategoryGridSection';
import { getMergedDevelopmentsAsync, developers } from '@/lib/developments';

export const dynamic = 'force-dynamic';

const dev = developers.Live;

export const metadata: Metadata = {
  title: `Desarrollos de ${dev.name}`,
  description: dev.credentials?.es ?? `Proyectos desarrollados por ${dev.name}.`,
  alternates: { canonical: 'https://www.tresor.mx/live-desarrollos' },
  openGraph: {
    title: `Desarrollos de ${dev.name}`,
    description: dev.credentials?.es ?? `Proyectos desarrollados por ${dev.name}.`,
    url: 'https://www.tresor.mx/live-desarrollos',
    images: [{ url: '/desarrollos/ximena/2.-Fachada-de-Noche.jpg', width: 1920, height: 992 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: `Desarrollos de ${dev.name}`,
    description: dev.credentials?.es ?? `Proyectos desarrollados por ${dev.name}.`,
    images: ['/desarrollos/ximena/2.-Fachada-de-Noche.jpg'],
  },
};

export default async function LiveDesarrollosPage() {
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
      />
    </>
  );
}
