import type { Metadata } from 'next';
import Link from 'next/link';
import CategoryHero from '@/components/category/CategoryHero';
import CategoryGridSection from '@/components/category/CategoryGridSection';
import { getMergedDevelopmentsAsync, isListingRelationship } from '@/lib/developments';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const isEs = locale !== 'en';
  const title = isEs ? 'Propiedades en Venta en Tulum' : 'Condos for Sale in Tulum, Mexico';
  const description = isEs
    ? 'Departamentos en preventa en Tulum, el destino de mayor crecimiento de México. Aldea Zamá y las zonas de mayor plusvalía.'
    : "Pre-construction condos for sale in Tulum, Mexico's fastest-growing destination — Aldea Zamá and the highest-appreciation areas of the Riviera Maya.";
  return {
    title,
    description,
    alternates: {
      canonical: isEs ? 'https://www.tresor.mx/tulum' : 'https://www.tresor.mx/en/tulum',
      languages: {
        es: 'https://www.tresor.mx/tulum',
        en: 'https://www.tresor.mx/en/tulum',
        'x-default': 'https://www.tresor.mx/tulum',
      },
    },
    openGraph: {
      title,
      description,
      url: isEs ? 'https://www.tresor.mx/tulum' : 'https://www.tresor.mx/en/tulum',
      images: [{ url: '/ogfinal.jpg', width: 1200, height: 630 }],
      locale: isEs ? 'es_MX' : 'en_US',
    },
  };
}

export default async function TulumPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const isEs = locale !== 'en';
  const all = await getMergedDevelopmentsAsync();
  const developments = all.filter((d) => d.city === 'Tulum' && !isListingRelationship(d.relationship));

  return (
    <>
      <CategoryHero
        image="/desarrollos/xaviera/fotos/1. Fachada de Noche.jpg"
        imageAlt={isEs ? 'Propiedades en venta en Tulum' : 'Properties for sale in Tulum'}
        eyebrow={isEs ? '— Ciudad' : '— City'}
        title="Tulum"
        subtitle={
          isEs
            ? 'El destino de mayor crecimiento de México — departamentos en Aldea Zamá y las zonas de mayor plusvalía.'
            : "Mexico's fastest-growing destination — apartments in Aldea Zamá and the highest-value areas."
        }
      />
      <CategoryGridSection
        eyebrow="Tulum"
        title={isEs ? <>Propiedades en <span className="text-ink-3">Tulum</span></> : <>Properties in <span className="text-ink-3">Tulum</span></>}
        developments={developments}
        schemaUrl={isEs ? 'https://www.tresor.mx/tulum' : 'https://www.tresor.mx/en/tulum'}
        schemaName={isEs ? 'Propiedades en Venta en Tulum' : 'Condos for Sale in Tulum, Mexico'}
        schemaDescription={
          isEs
            ? 'Departamentos en preventa en Tulum, el destino de mayor crecimiento de México. Aldea Zamá y las zonas de mayor plusvalía.'
            : "Pre-construction condos for sale in Tulum, Mexico's fastest-growing destination — Aldea Zamá and the highest-appreciation areas of the Riviera Maya."
        }
        breadcrumbLabel="Tulum"
        locale={isEs ? 'es_MX' : 'en_US'}
      />

      {/* Contexto para comprar en Tulum + enlaces a las guías. La página era
          casi solo el grid (~180 palabras propias en la auditoría de sep/2026):
          poco texto para rankear y ningún enlace hacia el blog. */}
      <section data-nav="light" className="bg-white py-20 md:py-28">
        <div className="container-wrap">
          <div className="max-w-3xl">
            <span className="eyebrow eyebrow-accent font-bold">
              {isEs ? 'Antes de comprar' : 'Before you buy'}
            </span>
            <h2 className="mt-4 mb-6 font-sans text-[clamp(24px,3.2vw,48px)] font-normal leading-[1.05] tracking-tight text-ink">
              {isEs ? <>Comprar en Tulum, <span className="text-ink-3">con criterio</span></> : <>Buying in Tulum, <span className="text-ink-3">with eyes open</span></>}
            </h2>
            {isEs ? (
              <>
                <p className="text-ink-2 leading-relaxed mb-6">
                  Tulum tiene aeropuerto internacional propio desde finales de 2023 y está conectado por el Tren Maya, pero también es la zona de la Riviera Maya donde más se construyó en los últimos años. La mayor parte de la oferta es preventa, así que en Tulum la decisión real no es solo la ubicación: es el desarrollador. Antes de firmar, revisa qué proyectos ha entregado, el calendario de obra y cuánto del proyecto está vendido.
                </p>
                <p className="text-ink-2 leading-relaxed">
                  Te explicamos cómo está el mercado este año en{' '}
                  <Link href="/blog/mercado-inmobiliario-cancun-2026" className="text-accent hover:underline">mercado inmobiliario en Cancún y la Riviera Maya 2026</Link>{' '}
                  y qué revisar en una preventa en nuestra{' '}
                  <Link href="/blog/guia-comprar-en-preventa-cancun" className="text-accent hover:underline">guía para comprar en preventa</Link>.
                </p>
              </>
            ) : (
              <>
                <p className="text-ink-2 leading-relaxed mb-6">
                  Tulum has had its own international airport since the end of 2023 and is connected by the Tren Maya, but it is also where the Riviera Maya&apos;s construction boom was most intense. Most inventory is pre-construction, so in Tulum the real decision is not just location — it is the developer. Before signing, look at their delivered projects, the construction schedule and how much of the project has sold.
                </p>
                <p className="text-ink-2 leading-relaxed">
                  See how Tulum compares with the other two markets in{' '}
                  <Link href="/en/blog/cancun-vs-playa-del-carmen-vs-tulum" className="text-accent hover:underline">Cancún vs. Playa del Carmen vs. Tulum</Link>, and how the purchase works in{' '}
                  <Link href="/en/blog/buying-property-in-mexico-as-a-foreigner" className="text-accent hover:underline">buying property in Mexico as a foreigner</Link>.
                </p>
              </>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
