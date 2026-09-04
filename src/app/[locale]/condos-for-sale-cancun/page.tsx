import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import CondosSeoPage, { type CondosFaq, type CondosRelatedLink } from '@/components/category/CondosSeoPage';
import { getMergedDevelopmentsAsync, isListingRelationship } from '@/lib/developments';

export const dynamic = 'force-dynamic';

// Página de contenido en INGLÉS para "condos for sale in cancun".
// Existe aparte de /departamentos porque esa es la landing bilingüe genérica
// de tipo de propiedad; esta ataca la búsqueda exacta del comprador
// extranjero y suma el contenido que un portal no da (cómo compra un
// extranjero, fideicomiso, costos de cierre).
//
// Solo vive en inglés: la ruta cuelga de [locale], así que la variante en
// español (/condos-for-sale-cancun) redirige a /en/ para no dejar contenido
// en inglés bajo una URL española ni duplicar la página en dos URLs.
const PATH = '/condos-for-sale-cancun';
const URL_EN = `https://www.tresor.mx/en${PATH}`;
// El equivalente real en español NO es una traducción de esta URL, es la
// página de departamentos de la ciudad. Tiene que declararse aquí: el
// hreflang solo cuenta si es recíproco, y /departamentos-en-venta-cancun
// ya nos declara a nosotros. Si falta este lado, Google descarta el par entero.
const URL_ES = 'https://www.tresor.mx/departamentos-en-venta-cancun';

const TITLE = 'Condos for Sale in Cancún, Mexico — Prices & Availability';
const DESCRIPTION =
  'Browse condos for sale in Cancún from $2,690,000 MXN. Pre-construction and move-in ready units from established developers, plus a plain-English guide to how foreigners buy property in Mexico.';

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: { absolute: `${TITLE} · Tresor Real Estate` },
    description: DESCRIPTION,
    keywords: [
      'condos for sale cancun',
      'cancun condos for sale',
      'buy condo in cancun mexico',
      'cancun real estate for sale',
      'pre construction condos cancun',
      'cancun condos for foreigners',
    ],
    alternates: {
      canonical: URL_EN,
      // x-default apunta al español para coincidir con lo que declara la
      // página ES; si cada lado declara un x-default distinto se contradicen.
      languages: { en: URL_EN, es: URL_ES, 'x-default': URL_ES },
    },
    openGraph: {
      title: TITLE,
      description: DESCRIPTION,
      url: URL_EN,
      images: [{ url: '/ogfinal.jpg', width: 1200, height: 630 }],
      locale: 'en_US',
      type: 'website',
    },
    robots: { index: true, follow: true },
  };
}

const FAQS: CondosFaq[] = [
  {
    q: 'Can a foreigner buy a condo in Cancún?',
    a: 'Yes. There is no restriction on foreigners owning property in Mexico. Because Cancún is within 50 km of the coast — the so-called restricted zone — foreign buyers usually hold title through a bank trust called a fideicomiso, or through a Mexican corporation. Both are standard, long-established routes.',
  },
  {
    q: 'What is a fideicomiso, exactly?',
    a: 'A fideicomiso is a trust held by a Mexican bank on your behalf. You are the beneficiary: you can live in the property, rent it out, remodel it, sell it or leave it to your heirs. The trust runs for 50 years and is renewable. The bank charges a setup fee and an annual fee — your notary and attorney will confirm current amounts for your case.',
  },
  {
    q: 'How much does a condo in Cancún cost?',
    a: 'In our current portfolio, condos in Cancún start at $2,690,000 MXN and run up to well over $19,000,000 MXN for marina-front residences in Puerto Cancún. Price depends mostly on zone, size and delivery date. The USD equivalent moves with the exchange rate, so ask an advisor for the figure on the day you are comparing.',
  },
  {
    q: 'What are the closing costs when buying in Mexico?',
    a: 'On top of the purchase price you should budget for the acquisition tax, notary fees, registry fees and — if you use one — the setup of the fideicomiso. These are usually quoted together as a percentage of the purchase price and vary by property value and municipality. Ask for a written closing-cost estimate before you sign, and confirm it with your own attorney.',
  },
  {
    q: 'Can I rent out my condo when I am not using it?',
    a: 'Yes, and short-term rental is common in Cancún. Keep in mind that rental income earned in Mexico is taxable there, so you will need to register with the tax authority (SAT) and, in most cases, work with a local accountant. Some buildings also set their own rules on short-term rentals, so confirm the condo regime before you buy.',
  },
  {
    q: 'Can I get a mortgage as a foreign buyer?',
    a: 'Most of our buyers use the developer payment plan during construction — a deposit followed by instalments until delivery — rather than a Mexican mortgage. Cross-border financing options do exist but terms vary widely by lender and nationality. Tell your advisor how you plan to pay and they will show you which developments fit.',
  },
  {
    q: 'Is it safer to buy pre-construction or a finished unit?',
    a: 'They solve different problems. Pre-construction gets you a lower entry price and the pick of the inventory, but you wait for delivery. A finished unit costs more and you can see exactly what you are buying. We work with both, and only with developers that have delivered projects in Quintana Roo before.',
  },
  {
    q: 'Do I need to travel to Cancún to buy?',
    a: 'Not necessarily. We run private tours by video call, and a purchase can be completed through a power of attorney granted to a representative in Mexico. That said, most buyers do visit before closing, and we can organise the trip around the properties on your shortlist.',
  },
];

const RELATED: CondosRelatedLink[] = [
  { href: '/condos-for-sale-puerto-cancun', label: 'Puerto Cancún', sub: 'Marina-front condos inside a gated golf community.' },
  { href: '/tulum', label: 'Tulum', sub: "Pre-construction condos in Mexico's fastest-growing destination." },
  { href: '/condos-for-sale-playa-del-carmen', label: 'Playa del Carmen', sub: 'Condos steps from Fifth Avenue and the Caribbean Sea.' },
];

export default async function CondosForSaleCancunPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  // Contenido solo en inglés — ver nota de arriba.
  if (locale !== 'en') redirect(`/en${PATH}`);

  const all = await getMergedDevelopmentsAsync();
  // Puerto Cancún se incluye a propósito: es una zona DENTRO de Cancún, y
  // quien busca "condos for sale in cancun" espera verla. Se excluyen los
  // Listings por el mismo criterio que el resto de las landings de categoría.
  const developments = all.filter(
    (d) =>
      d.propertyType === 'Departamento' &&
      (d.city === 'Cancún' || d.city === 'Puerto Cancún') &&
      !isListingRelationship(d.relationship),
  );

  return (
    <CondosSeoPage
      canonicalPath={PATH}
      heroImage="/desarrollos/villalta/portada2.jpg"
      heroImageAlt="Condos for sale in Cancún, Mexico"
      h1="Condos for Sale in Cancún"
      heroSubtitle="Pre-construction and move-in ready condos across Cancún's highest-growth zones — bought the way foreigners actually buy in Mexico."
      gridEyebrow="Cancún"
      gridTitle="Condos available"
      gridTitleMuted="in Cancún right now"
      developments={developments}
      introTitle="Why buyers from the US and Canada"
      introTitleMuted="keep choosing Cancún"
      introBody={[
        'Cancún is not a single market. The Hotel Zone lives off tourism and short-term rental demand; Puerto Cancún is a gated golf-and-marina community aimed at second homes; and inland corridors like Av. Huayacán and Vía Cumbres are where the city itself is actually growing, with schools, hospitals and shopping following the new housing.',
        'That mix is what makes the city work for very different budgets. In our current portfolio a condo in a growing residential corridor starts around $2,690,000 MXN, while marina-front residences in Puerto Cancún run into the tens of millions. Same city, very different products.',
        'What almost every foreign buyer underestimates is the process, not the price. Owning near the coast in Mexico means a bank trust, a notary, and a closing that looks nothing like a US escrow. That is the part we walk you through below — and the part an advisor should be able to explain before you put money down.',
      ]}
      faqs={FAQS}
      relatedLinks={RELATED}
      breadcrumbCity="Cancún"
      breadcrumbCityHref="/cancun"
    />
  );
}
