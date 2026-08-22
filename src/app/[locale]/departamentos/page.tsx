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
  // EN dice "Condos", no "Apartments": para el comprador de EE.UU./Canadá un
  // apartment es lo que renta y un condo lo que compra — la búsqueda real es
  // "condos for sale cancun". Ver PROPERTY_TYPE_EN en src/lib/developments.ts.
  // Título REGIONAL a propósito. Antes arrancaba con "Departamentos en Venta
  // en Cancún…", la frase exacta que ataca /departamentos-en-venta-cancun —
  // dos páginas propias peleando la misma búsqueda reparten la fuerza en vez
  // de sumarla (mismo bug ya corregido en la landing de Valmira). Esta página
  // es el hub de TODA la región; la de ciudad es la dueña de "Cancún".
  const title = isEs ? 'Departamentos en Venta en la Riviera Maya y Quintana Roo' : 'Condos for Sale in the Riviera Maya and Quintana Roo';
  const description = isEs
    ? 'Departamentos en preventa y entrega inmediata en Cancún, Tulum, Playa del Carmen y Puerto Cancún. Inversión inmobiliaria con las desarrolladoras más sólidas de Quintana Roo.'
    : "Browse condos for sale in Cancún, Tulum, Playa del Carmen and Puerto Cancún — pre-construction and move-in ready. Beachfront, marina and golf communities from Quintana Roo's most established developers.";
  return {
    title,
    description,
    alternates: {
      canonical: isEs ? 'https://www.tresor.mx/departamentos' : 'https://www.tresor.mx/en/departamentos',
      languages: {
        es: 'https://www.tresor.mx/departamentos',
        en: 'https://www.tresor.mx/en/departamentos',
        'x-default': 'https://www.tresor.mx/departamentos',
      },
    },
    openGraph: {
      title,
      description,
      url: isEs ? 'https://www.tresor.mx/departamentos' : 'https://www.tresor.mx/en/departamentos',
      images: [{ url: '/ogfinal.jpg', width: 1200, height: 630 }],
      locale: isEs ? 'es_MX' : 'en_US',
    },
  };
}

export default async function DepartamentosPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const isEs = locale !== 'en';
  const all = await getMergedDevelopmentsAsync();
  const developments = all.filter((d) => d.propertyType === 'Departamento' && !isListingRelationship(d.relationship));

  return (
    <>
      <CategoryHero
        image="/desarrollo-corporativo/LuxuryL.jpg"
        imageAlt={isEs ? 'Departamentos en venta en Cancún y Riviera Maya' : 'Condos for sale in Cancún and the Riviera Maya'}
        eyebrow={isEs ? '— Propiedades' : '— Properties'}
        title={isEs ? 'Departamentos' : 'Condos'}
        subtitle={
          isEs
            ? 'Preventa y entrega inmediata en Cancún, Tulum, Playa del Carmen y Puerto Cancún — con las desarrolladoras más sólidas de la región.'
            : "Pre-sale and immediate delivery in Cancún, Tulum, Playa del Carmen and Puerto Cancún — with the region's most solid developers."
        }
      />
      <CategoryGridSection
        eyebrow={isEs ? 'Departamentos' : 'Condos'}
        title={isEs ? <>Encuentra tu <span className="text-ink-3">próximo hogar o inversión</span></> : <>Find your <span className="text-ink-3">next home or investment</span></>}
        developments={developments}
        schemaUrl={isEs ? 'https://www.tresor.mx/departamentos' : 'https://www.tresor.mx/en/departamentos'}
        schemaName={isEs ? 'Departamentos en Venta en la Riviera Maya y Quintana Roo' : 'Condos for Sale in the Riviera Maya and Quintana Roo'}
        schemaDescription={
          isEs
            ? 'Departamentos en preventa y entrega inmediata en Cancún, Tulum, Playa del Carmen y Puerto Cancún. Inversión inmobiliaria con las desarrolladoras más sólidas de Quintana Roo.'
            : "Browse condos for sale in Cancún, Tulum, Playa del Carmen and Puerto Cancún — pre-construction and move-in ready. Beachfront, marina and golf communities from Quintana Roo's most established developers."
        }
        breadcrumbLabel={isEs ? 'Departamentos' : 'Condos'}
        locale={isEs ? 'es_MX' : 'en_US'}
      />

      {/* Enlace jerárquico hub → ciudad. Es la mitad que faltaba del esquema
          que evita la canibalización: esta página cubre toda la región y
          manda hacia abajo a la página de ciudad, que es la que debe ganar
          "departamentos en venta en cancún". Sin este enlace, la página de
          ciudad quedaría casi huérfana y no recibiría autoridad interna. */}
      <section className="bg-bg-soft py-20 md:py-28">
        <div className="container-wrap max-w-3xl">
          <span className="eyebrow eyebrow-accent font-bold">{isEs ? '— Por ciudad' : '— By city'}</span>
          <h2 className="mt-4 font-sans text-[clamp(24px,3.2vw,48px)] font-normal leading-[1.05] tracking-tight text-ink">
            {isEs ? <>¿Buscas <span className="text-ink-3">solo en Cancún?</span></> : <>Looking <span className="text-ink-3">only in Cancún?</span></>}
          </h2>
          <p className="mt-5 text-[15px] font-light leading-relaxed text-ink-2">
            {isEs
              ? 'Tenemos una página dedicada solo a Cancún, con el detalle de cada zona —Av. Huayacán, Lausana, Vía Cumbres, Zona Hotelera y Puerto Cancún—, precios actuales y cómo funciona la compra en preventa.'
              : "We have a page dedicated to Cancún alone, with a breakdown of every zone, current prices and how buying as a foreigner actually works."}
          </p>
          <Link
            href={isEs ? '/departamentos-en-venta-cancun' : '/condos-for-sale-cancun'}
            className="btn btn-lg mt-8 border-0 bg-ink text-white hover:bg-ink/85"
          >
            {isEs ? 'Ver departamentos en Cancún' : 'View condos in Cancún'}
            <ArrowRight size={14} strokeWidth={2.2} />
          </Link>
        </div>
      </section>
    </>
  );
}
