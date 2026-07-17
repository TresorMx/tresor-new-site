import type { Metadata } from 'next';
import CategoryHero from '@/components/category/CategoryHero';
import CategoryGridSection from '@/components/category/CategoryGridSection';
import { getMergedDevelopmentsAsync } from '@/lib/developments';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Quattro Plaza Center — Locales Comerciales en Cancún',
  description:
    'Quattro Plaza Center, la línea de plazas comerciales de Tresor Real Estate en Cancún: locales en preventa y entrega inmediata en zonas de alto crecimiento.',
  alternates: { canonical: 'https://www.tresor.mx/quattro-plaza-center' },
  openGraph: {
    title: 'Quattro Plaza Center — Locales Comerciales en Cancún',
    description:
      'Quattro Plaza Center, la línea de plazas comerciales de Tresor Real Estate en Cancún: locales en preventa y entrega inmediata en zonas de alto crecimiento.',
    url: 'https://www.tresor.mx/quattro-plaza-center',
    // Imagen dedicada para compartir (1200×630, ~280KB) — la foto original
    // del hero (/renders/gardens/01.jpg) pesa 2.1MB y con dimensiones
    // declaradas que no coinciden con las reales (992 vs 1080 real), lo que
    // hacía que el bot de WhatsApp fallara al traerla intermitentemente.
    images: [{ url: '/og/quattro-plaza-center.jpg', width: 1200, height: 630 }],
  },
  // Sin esto, Twitter/X heredaba el twitter:image genérico del layout raíz
  // (ogfinal.jpg) — Next.js solo reemplaza `openGraph` si lo defines, pero
  // `twitter` sigue siendo un campo aparte que hay que definir explícito.
  twitter: {
    card: 'summary_large_image',
    title: 'Quattro Plaza Center — Locales Comerciales en Cancún',
    description:
      'Quattro Plaza Center, la línea de plazas comerciales de Tresor Real Estate en Cancún: locales en preventa y entrega inmediata en zonas de alto crecimiento.',
    images: ['/og/quattro-plaza-center.jpg'],
  },
};

export default async function QuattroPlazaCenterPage() {
  const all = await getMergedDevelopmentsAsync();
  const developments = all.filter((d) => d.developer === 'Tresor');

  return (
    <>
      <CategoryHero
        image="/renders/gardens/01.jpg"
        imageAlt="Quattro Plaza Center"
        eyebrow="— Desarrollador"
        title="Quattro Plaza Center"
        subtitle="Plazas comerciales diseñadas para el flujo y crecimiento de cada zona — ubicación estratégica y alta plusvalía en Cancún."
        logo="/quattrohero.svg"
        logoAlt="Quattro Plaza Center"
        logoIsWhite
        logoScale={1.3}
      />
      <CategoryGridSection
        eyebrow="Desarrollador"
        title={<>Proyectos de <span className="text-ink-3">Quattro Plaza Center</span></>}
        developments={developments}
        showDeveloperFilter={false}
      />
    </>
  );
}
