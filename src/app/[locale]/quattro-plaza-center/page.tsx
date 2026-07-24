import type { Metadata } from 'next';
import CategoryHero from '@/components/category/CategoryHero';
import CategoryGridSection from '@/components/category/CategoryGridSection';
import { getMergedDevelopmentsAsync } from '@/lib/developments';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const isEs = locale !== 'en';
  const title = isEs ? 'Quattro Plaza Center — Locales Comerciales en Cancún' : 'Quattro Plaza Center — Commercial Spaces in Cancún';
  const description = isEs
    ? 'Quattro Plaza Center, la línea de plazas comerciales de Tresor Real Estate en Cancún: locales en preventa y entrega inmediata en zonas de alto crecimiento.'
    : "Quattro Plaza Center, Tresor Real Estate's commercial plaza line in Cancún: pre-sale and immediate-delivery spaces in high-growth areas.";
  return {
    title,
    description,
    alternates: {
      canonical: isEs ? 'https://www.tresor.mx/quattro-plaza-center' : 'https://www.tresor.mx/en/quattro-plaza-center',
      languages: {
        es: 'https://www.tresor.mx/quattro-plaza-center',
        en: 'https://www.tresor.mx/en/quattro-plaza-center',
        'x-default': 'https://www.tresor.mx/quattro-plaza-center',
      },
    },
    openGraph: {
      title,
      description,
      url: isEs ? 'https://www.tresor.mx/quattro-plaza-center' : 'https://www.tresor.mx/en/quattro-plaza-center',
      // Imagen dedicada para compartir (1200×630, ~280KB) — la foto original
      // del hero (/renders/gardens/01.jpg) pesa 2.1MB y con dimensiones
      // declaradas que no coinciden con las reales (992 vs 1080 real), lo que
      // hacía que el bot de WhatsApp fallara al traerla intermitentemente.
      images: [{ url: '/og/quattro-plaza-center.jpg', width: 1200, height: 630 }],
      locale: isEs ? 'es_MX' : 'en_US',
    },
    // Sin esto, Twitter/X heredaba el twitter:image genérico del layout raíz
    // (ogfinal.jpg) — Next.js solo reemplaza `openGraph` si lo defines, pero
    // `twitter` sigue siendo un campo aparte que hay que definir explícito.
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: ['/og/quattro-plaza-center.jpg'],
    },
  };
}

export default async function QuattroPlazaCenterPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const isEs = locale !== 'en';
  const all = await getMergedDevelopmentsAsync();
  const developments = all.filter((d) => d.developer === 'Tresor');

  return (
    <>
      <CategoryHero
        image="/renders/gardens/01.jpg"
        imageAlt="Quattro Plaza Center"
        eyebrow={isEs ? '— Desarrollador' : '— Developer'}
        title="Quattro Plaza Center"
        subtitle={
          isEs
            ? 'Plazas comerciales diseñadas para el flujo y crecimiento de cada zona — ubicación estratégica y alta plusvalía en Cancún.'
            : "Commercial plazas designed for each area's traffic and growth — strategic locations and high appreciation in Cancún."
        }
        logo="/quattrohero.svg"
        logoAlt="Quattro Plaza Center"
        logoIsWhite
        logoScale={1.3}
      />
      <CategoryGridSection
        eyebrow={isEs ? 'Desarrollador' : 'Developer'}
        title={isEs ? <>Proyectos de <span className="text-ink-3">Quattro Plaza Center</span></> : <>Quattro Plaza Center <span className="text-ink-3">Projects</span></>}
        developments={developments}
        showDeveloperFilter={false}
      />
    </>
  );
}
