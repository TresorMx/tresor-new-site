import type { Metadata } from 'next';
import { ArrowRight } from 'lucide-react';
import { Link } from '@/navigation';
import CategoryHero from '@/components/category/CategoryHero';
import CategoryGridSection from '@/components/category/CategoryGridSection';
import { getMergedDevelopmentsAsync, isListingRelationship } from '@/lib/developments';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const isEs = locale !== 'en';
  const title = isEs ? 'Lotes Residenciales en Venta en Cancún' : 'Residential Lots for Sale in Cancún';
  const description = isEs
    ? 'Lotes y macrolotes residenciales en las zonas de mayor crecimiento de Cancún. Ideal para desarrolladores e inversionistas.'
    : "Residential lots and macro-lots in Cancún's fastest-growing areas. Ideal for developers and investors.";
  return {
    title,
    description,
    alternates: {
      canonical: isEs ? 'https://www.tresor.mx/lotes-residenciales' : 'https://www.tresor.mx/en/lotes-residenciales',
      languages: {
        es: 'https://www.tresor.mx/lotes-residenciales',
        en: 'https://www.tresor.mx/en/lotes-residenciales',
        'x-default': 'https://www.tresor.mx/lotes-residenciales',
      },
    },
    openGraph: {
      title,
      description,
      url: isEs ? 'https://www.tresor.mx/lotes-residenciales' : 'https://www.tresor.mx/en/lotes-residenciales',
      images: [{ url: '/ogfinal.jpg', width: 1200, height: 630 }],
      locale: isEs ? 'es_MX' : 'en_US',
    },
  };
}

export default async function LotesResidencialesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const isEs = locale !== 'en';
  const all = await getMergedDevelopmentsAsync();
  const developments = all.filter((d) => d.propertyType === 'Lote Residencial' && !isListingRelationship(d.relationship));

  return (
    <>
      <CategoryHero
        // Antes: /desarrollos/Sanam/portada.jpg — alberca de un condominio de
        // departamentos en Tulum, no un lote en Cancún. Ahora una calle
        // interior de Zienna (render del desarrollador), que sí es lo que vende
        // esta página.
        image="/desarrollos/zienna/Calle.jpg"
        imageAlt={isEs ? 'Lotes residenciales en venta en Cancún' : 'Residential lots for sale in Cancún'}
        eyebrow={isEs ? '— Propiedades' : '— Properties'}
        title={isEs ? 'Lotes Residenciales' : 'Residential Lots'}
        subtitle={
          isEs
            ? 'Terrenos en las zonas de mayor plusvalía de Cancún, listos para tu próxima inversión.'
            : "Land in Cancún's highest-value areas, ready for your next investment."
        }
      />
      <CategoryGridSection
        eyebrow={isEs ? 'Lotes Residenciales' : 'Residential Lots'}
        title={isEs ? <>Terrenos en <span className="text-ink-3">zonas de alta plusvalía</span></> : <>Land in <span className="text-ink-3">high-value areas</span></>}
        developments={developments}
        schemaUrl={isEs ? 'https://www.tresor.mx/lotes-residenciales' : 'https://www.tresor.mx/en/lotes-residenciales'}
        schemaName={isEs ? 'Lotes Residenciales en Venta en Cancún' : 'Residential Lots for Sale in Cancún'}
        schemaDescription={
          isEs
            ? 'Lotes y macrolotes residenciales en las zonas de mayor crecimiento de Cancún. Ideal para desarrolladores e inversionistas.'
            : "Residential lots and macro-lots in Cancún's fastest-growing areas. Ideal for developers and investors."
        }
        breadcrumbLabel={isEs ? 'Lotes Residenciales' : 'Residential Lots'}
        locale={isEs ? 'es_MX' : 'en_US'}
      />

      {/* Contexto + qué revisar. La página era solo el grid (~80 palabras
          propias en la auditoría de sep/2026) y es la única dueña de "lotes
          residenciales en venta en Cancún" — no hay otra página que la cubra.
          Datos de cada desarrollo leídos del catálogo (highlights), no
          escritos a mano, para que no se desactualicen. */}
      <section data-nav="light" className="bg-white py-20 md:py-28">
        <div className="container-wrap max-w-3xl">
          <span className="eyebrow eyebrow-accent font-bold">{isEs ? '— Antes de comprar' : '— Before you buy'}</span>
          <h2 className="mt-4 font-sans text-[clamp(24px,3.2vw,48px)] font-normal leading-[1.05] tracking-tight text-ink">
            {isEs ? <>Comprar un lote, <span className="text-ink-3">no solo un terreno</span></> : <>Buying a lot, <span className="text-ink-3">not just land</span></>}
          </h2>
          <p className="mt-5 text-[15px] font-light leading-relaxed text-ink-2">
            {isEs
              ? 'Un lote dentro de una comunidad planeada te da lo que un terreno suelto no: servicios introducidos, acceso controlado, amenidades y un reglamento que protege el valor de lo que se construya alrededor. Tú decides cuándo y qué construir, con el precio de hoy.'
              : 'A lot inside a planned community gives you what a standalone plot does not: utilities already in place, controlled access, shared amenities and bylaws that protect the value of what gets built around you. You decide when and what to build, at today’s price.'}
          </p>

          {developments.map((d) => (
            <div key={d.slug} className="mt-10 rounded-xl border border-line bg-bg-soft p-6">
              <p className="font-sans text-[clamp(18px,1.8vw,24px)] font-medium leading-[1.15] text-ink">{d.name}</p>
              {(isEs ? d.priceLabel : d.priceLabelEn ?? d.priceLabel) && (
                <p className="mt-1 text-[13px] text-ink-3">{isEs ? d.priceLabel : d.priceLabelEn ?? d.priceLabel}</p>
              )}
              {(isEs ? d.description : d.descriptionEn ?? d.description) && (
                <p className="mt-4 text-[15px] font-light leading-relaxed text-ink-2">{isEs ? d.description : d.descriptionEn ?? d.description}</p>
              )}
              {d.highlights && d.highlights.length > 0 && (
                <dl className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-3">
                  {d.highlights.map((h) => (
                    <div key={h.label}>
                      <dt className="text-[11px] uppercase tracking-caps text-ink-3">{isEs ? h.label : h.labelEn ?? h.label}</dt>
                      <dd className="mt-1 text-[15px] text-ink">{isEs ? h.value : h.valueEn ?? h.value}</dd>
                    </div>
                  ))}
                </dl>
              )}
              {d.href && d.href !== '#' && (
                <Link href={d.href} className="btn btn-lg mt-6 border-0 bg-ink text-white hover:bg-ink/85">
                  {isEs ? `Ver ${d.name}` : `View ${d.name}`}
                  <ArrowRight size={14} strokeWidth={2.2} />
                </Link>
              )}
            </div>
          ))}

          <h3 className="mt-12 font-sans text-[clamp(18px,1.8vw,24px)] font-medium leading-[1.15] text-ink">
            {isEs ? 'Qué revisar antes de apartar' : 'What to check before you reserve'}
          </h3>
          <ul className="mt-5 space-y-3 text-[15px] font-light leading-relaxed text-ink-2">
            {(isEs
              ? [
                  ['Uso de suelo', 'que el lote permita construir lo que tienes en mente (vivienda unifamiliar, niveles, densidad).'],
                  ['Factibilidad de servicios', 'agua, drenaje y electricidad: si ya están introducidos o cuándo lo estarán.'],
                  ['Escrituración', 'régimen de propiedad, cuándo se escritura y si el lote se entrega libre de gravámenes.'],
                  ['Reglamento de construcción', 'qué exige la comunidad (restricciones, plazos para construir, cuotas de mantenimiento).'],
                ]
              : [
                  ['Zoning', 'confirm the lot allows what you plan to build (single-family, number of floors, density).'],
                  ['Utilities', 'water, sewage and electricity — already in place, or when they will be.'],
                  ['Title', 'the ownership regime, when the deed is signed and whether the lot is delivered free of liens.'],
                  ['Building rules', 'what the community requires (setbacks, construction deadlines, maintenance fees).'],
                ]
            ).map(([t, d]) => (
              <li key={t} className="flex gap-3">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                <span><strong className="font-semibold text-ink">{t}:</strong> {d}</span>
              </li>
            ))}
          </ul>
          {isEs && (
            <p className="mt-8 text-[15px] font-light leading-relaxed text-ink-2">
              Lo explicamos a detalle en nuestra guía{' '}
              <Link href="/blog/terrenos-en-venta-cancun" className="text-ink underline underline-offset-4 hover:text-accent transition-colors">
                Terrenos en venta en Cancún: qué revisar antes de comprar
              </Link>.
            </p>
          )}
        </div>
      </section>
    </>
  );
}
