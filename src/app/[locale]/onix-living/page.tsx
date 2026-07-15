import type { Metadata } from 'next';
import CategoryHero from '@/components/category/CategoryHero';
import CategoryGridSection from '@/components/category/CategoryGridSection';
import { getMergedDevelopmentsAsync, developers } from '@/lib/developments';

export const dynamic = 'force-dynamic';

const dev = developers.Onix;

export const metadata: Metadata = {
  title: `Desarrollos de ${dev.name}`,
  description: dev.credentials?.es ?? `Proyectos desarrollados por ${dev.name}.`,
  alternates: { canonical: 'https://tresor.mx/onix-living' },
  openGraph: {
    title: `Desarrollos de ${dev.name}`,
    description: dev.credentials?.es ?? `Proyectos desarrollados por ${dev.name}.`,
    url: 'https://tresor.mx/onix-living',
    images: [{ url: '/desarrollos/villalta/portada3.jpg', width: 1920, height: 992 }],
  },
};

export default async function OnixLivingPage() {
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
      />
    </>
  );
}
