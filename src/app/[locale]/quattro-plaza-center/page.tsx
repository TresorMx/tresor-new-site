import type { Metadata } from 'next';
import { ArrowRight } from 'lucide-react';
import { Link } from '@/navigation';
import CategoryHero from '@/components/category/CategoryHero';
import CategoryGridSection from '@/components/category/CategoryGridSection';
import { getMergedDevelopmentsAsync } from '@/lib/developments';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const isEs = locale !== 'en';
  const title = isEs ? 'Quattro Plaza Center — Locales Comerciales en Cancún' : 'Quattro Plaza Center — Commercial Spaces in Cancún';
  const description = isEs
    ? 'Quattro Plaza Center, la línea de plazas comerciales de Tresor Real Estate en Cancún: locales en preventa en zonas de alto crecimiento.'
    : "Quattro Plaza Center, Tresor Real Estate's commercial plaza line in Cancún: pre-sale commercial spaces in high-growth areas.";
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
        schemaUrl={isEs ? 'https://www.tresor.mx/quattro-plaza-center' : 'https://www.tresor.mx/en/quattro-plaza-center'}
        schemaName={isEs ? 'Quattro Plaza Center — Locales Comerciales en Cancún' : 'Quattro Plaza Center — Commercial Spaces in Cancún'}
        schemaDescription={
          isEs
            ? 'Quattro Plaza Center, la línea de plazas comerciales de Tresor Real Estate en Cancún: locales en preventa en zonas de alto crecimiento.'
            : "Quattro Plaza Center, Tresor Real Estate's commercial plaza line in Cancún: pre-sale commercial spaces in high-growth areas."
        }
        breadcrumbLabel="Quattro Plaza Center"
        locale={isEs ? 'es_MX' : 'en_US'}
      />

      {/* Página de MARCA: no se le mete copy de keyword a propósito — la
          dueña de "locales comerciales en Cancún" es /locales-comerciales-cancun
          y esta le pasa el enlace. Sin datos de ubicación: el campo `zone` del
          catálogo es incorrecto para estas plazas. */}
      <section className="bg-bg-soft py-20 md:py-28">
        <div className="container-wrap max-w-3xl">
          <span className="eyebrow eyebrow-accent font-bold">{isEs ? '— Invertir en locales' : '— Investing in retail'}</span>
          <h2 className="mt-4 font-sans text-[clamp(24px,3.2vw,48px)] font-normal leading-[1.05] tracking-tight text-ink">
            {isEs ? <>Precios, planes de pago <span className="text-ink-3">y disponibilidad</span></> : <>Prices, payment plans <span className="text-ink-3">and availability</span></>}
          </h2>
          <p className="mt-5 text-[15px] font-light leading-relaxed text-ink-2">
            {isEs
              ? 'Comparamos las plazas Quattro Plaza Gardens y Long Island lado a lado —precio de entrada, superficies y planes de pago— en nuestra página de locales comerciales en Cancún.'
              : 'We compare the Quattro Plaza Gardens and Long Island plazas side by side — entry price, unit sizes and payment plans — on our commercial spaces in Cancún page.'}
          </p>
          <Link href="/locales-comerciales-cancun" className="btn btn-lg mt-8 border-0 bg-ink text-white hover:bg-ink/85">
            {isEs ? 'Ver locales comerciales en Cancún' : 'View commercial spaces in Cancún'}
            <ArrowRight size={14} strokeWidth={2.2} />
          </Link>
          {isEs && (
            <ul className="mt-10 space-y-3 text-[15px] font-light leading-relaxed text-ink-2">
              {[
                ['/blog/como-invertir-en-locales-comerciales-en-cancun', 'Cómo invertir en locales comerciales en Cancún'],
                ['/blog/cuanto-cuesta-un-local-comercial-en-cancun', '¿Cuánto cuesta un local comercial en Cancún?'],
                ['/blog/local-comercial-vs-departamento-cancun', 'Local comercial vs. departamento: ¿qué conviene más?'],
              ].map(([href, label]) => (
                <li key={href} className="flex gap-3">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                  <Link href={href} className="text-ink underline underline-offset-4 hover:text-accent transition-colors">{label}</Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </>
  );
}
