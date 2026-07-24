import type { Metadata } from 'next';
import CategoryHero from '@/components/category/CategoryHero';
import CategoryGridSection from '@/components/category/CategoryGridSection';
import { getMergedDevelopmentsAsync, developers } from '@/lib/developments';

export const dynamic = 'force-dynamic';

const dev = developers.Live;

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
    alternates: { canonical: isEs ? 'https://www.tresor.mx/live-desarrollos' : 'https://www.tresor.mx/en/live-desarrollos' },
    openGraph: {
      title,
      description,
      url: isEs ? 'https://www.tresor.mx/live-desarrollos' : 'https://www.tresor.mx/en/live-desarrollos',
      images: [{ url: '/desarrollos/ximena/2.-Fachada-de-Noche.jpg', width: 1920, height: 992 }],
      locale: isEs ? 'es_MX' : 'en_US',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: ['/desarrollos/ximena/2.-Fachada-de-Noche.jpg'],
    },
  };
}

export default async function LiveDesarrollosPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const isEs = locale !== 'en';
  const all = await getMergedDevelopmentsAsync();
  const developments = all.filter((d) => d.developer === 'Live');

  return (
    <>
      <CategoryHero
        image="/desarrollos/ximena/2.-Fachada-de-Noche.jpg"
        imageAlt={dev.name}
        eyebrow={isEs ? '— Desarrollador' : '— Developer'}
        title={dev.name}
        subtitle={
          isEs
            ? 'Espacios residenciales de lujo en las zonas de mayor plusvalía de Cancún, con diseño contemporáneo y amenidades de primer nivel.'
            : "Luxury residential spaces in Cancún's highest-value areas, with contemporary design and first-class amenities."
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
