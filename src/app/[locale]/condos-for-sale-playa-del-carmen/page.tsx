import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import CondosSeoPage, { type CondosFaq, type CondosRelatedLink } from '@/components/category/CondosSeoPage';
import { getMergedDevelopmentsAsync, isListingRelationship } from '@/lib/developments';

export const dynamic = 'force-dynamic';

// Página de contenido en INGLÉS para "condos for sale in playa del carmen".
// Tercera de la serie, después de /condos-for-sale-cancun (que ya rankea en
// primera página) y /condos-for-sale-puerto-cancun — misma receta y mismo
// componente.
//
// NOTA DE INVENTARIO: hoy Playa del Carmen tiene solo 2 desarrollos en el
// catálogo (La Selva, entrega inmediata; Favorite, próximamente). La Selva
// YA tiene ficha propia (/desarrollos/la-selva-playa-del-carmen); Favorite
// sigue con href '#'. Es MUCHO menos inventario que los 10 de Cancún, así
// que esta página se apoya más en el contenido —zonas, proceso de compra,
// FAQ— que en el catálogo. Ver el filtro de href '#' en CondosSeoPage: deja
// fuera del schema a los desarrollos sin ficha para no emitir URLs rotas.
//
// Solo vive en inglés: la variante en español redirige a /playa-del-carmen,
// que es la landing de ciudad que ya existe en ES.
const PATH = '/condos-for-sale-playa-del-carmen';
const URL_EN = `https://www.tresor.mx/en${PATH}`;
// El equivalente real en español NO es una traducción de esta URL, es la
// página de departamentos de la ciudad. Tiene que declararse aquí: el
// hreflang solo cuenta si es recíproco, y /departamentos-en-venta-playa-del-carmen
// ya nos declara a nosotros. Si falta este lado, Google descarta el par entero.
const URL_ES = 'https://www.tresor.mx/departamentos-en-venta-playa-del-carmen';

const TITLE = 'Condos for Sale in Playa del Carmen — Prices & Availability';
const DESCRIPTION =
  'Browse condos for sale in Playa del Carmen from $2,244,000 MXN. Move-in ready and upcoming developments steps from Fifth Avenue and the Caribbean, plus a plain-English guide to how foreigners buy property in Mexico.';

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: { absolute: `${TITLE} · Tresor Real Estate` },
    description: DESCRIPTION,
    keywords: [
      'condos for sale playa del carmen',
      'playa del carmen condos for sale',
      'buy condo in playa del carmen',
      'playa del carmen real estate',
      'playa del carmen condos for foreigners',
      'riviera maya condos for sale',
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
    q: 'Can a foreigner buy a condo in Playa del Carmen?',
    a: 'Yes. There is no restriction on foreigners owning property in Mexico. Because Playa del Carmen sits on the coast — inside the so-called restricted zone — foreign buyers usually hold title through a bank trust called a fideicomiso, or through a Mexican corporation. Both are standard, long-established routes.',
  },
  {
    q: 'How much does a condo in Playa del Carmen cost?',
    a: 'In our current portfolio, condos in Playa del Carmen start at $2,244,000 MXN for a move-in ready unit, and we have a luxury project near Fifth Avenue launching soon. Price depends mostly on how close you are to the beach and to Fifth Avenue, on the size of the unit, and on whether the building is finished or still in pre-construction. The USD equivalent moves with the exchange rate, so ask an advisor for the figure on the day you are comparing.',
  },
  {
    q: 'Is Playa del Carmen a better investment than Cancún?',
    a: 'They attract different buyers. Cancún is a bigger city with an international airport, a large local economy and year-round demand, so it works for both living and renting. Playa del Carmen is smaller and more walkable, with a stronger European and digital-nomad presence and a rental market concentrated around Fifth Avenue and the beach. If you want walkability and a vacation-rental profile, Playa often fits better; if you want scale and a wider choice of inventory, Cancún does. We work in both and will tell you honestly which suits your goal.',
  },
  {
    q: 'Can I rent out my condo when I am not using it?',
    a: 'Yes, and short-term rental is common in Playa del Carmen — it is one of the main reasons people buy here. Keep in mind that rental income earned in Mexico is taxable there, so you will need to register with the tax authority (SAT) and, in most cases, work with a local accountant. Some buildings also set their own rules on short-term rentals, so confirm the condo regime before you buy.',
  },
  {
    q: 'How far is Playa del Carmen from Cancún airport?',
    a: 'Playa del Carmen is roughly an hour south of Cancún International Airport along the federal highway, and there is a well-established shuttle and private transfer market on that route. The ferry terminal to Cozumel sits in the middle of town, a short walk from Fifth Avenue.',
  },
  {
    q: 'What are the closing costs when buying in Mexico?',
    a: 'On top of the purchase price you should budget for the acquisition tax, notary fees, registry fees and — if you use one — the setup of the fideicomiso. These are usually quoted together as a percentage of the purchase price and vary by property value and municipality. Ask for a written closing-cost estimate before you sign, and confirm it with your own attorney.',
  },
  {
    q: 'Is it safer to buy pre-construction or a finished unit?',
    a: 'They solve different problems. Pre-construction gets you a lower entry price and the pick of the inventory, but you wait for delivery. A finished unit costs more and you can see exactly what you are buying — which is what our current Playa del Carmen inventory offers. We work with both, and only with developers that have delivered projects in Quintana Roo before.',
  },
  {
    q: 'Do I need to travel to Playa del Carmen to buy?',
    a: 'Not necessarily. We run private tours by video call, and a purchase can be completed through a power of attorney granted to a representative in Mexico. That said, most buyers do visit before closing, and we can organise the trip around the properties on your shortlist.',
  },
];

const RELATED: CondosRelatedLink[] = [
  { href: '/condos-for-sale-cancun', label: 'Cancún', sub: 'The widest choice of inventory in the state, from entry-level to marina-front.' },
  { href: '/tulum', label: 'Tulum', sub: "Pre-construction condos in Mexico's fastest-growing destination." },
  { href: '/condos-for-sale-puerto-cancun', label: 'Puerto Cancún', sub: 'Marina-front condos inside a gated golf community.' },
];

export default async function CondosForSalePlayaDelCarmenPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  // Contenido solo en inglés — la versión en español es /playa-del-carmen.
  if (locale !== 'en') redirect('/playa-del-carmen');

  const all = await getMergedDevelopmentsAsync();
  const developments = all.filter(
    (d) =>
      d.propertyType === 'Departamento' &&
      d.city === 'Playa del Carmen' &&
      !isListingRelationship(d.relationship),
  );

  return (
    <CondosSeoPage
      canonicalPath={PATH}
      cityName="Playa del Carmen"
      heroImage="/desarrollos/Favorite/playaNIGHT.jpg"
      heroImageAlt="Condos for sale in Playa del Carmen, Mexico"
      h1="Condos for Sale in Playa del Carmen"
      heroSubtitle="Move-in ready and upcoming condos in the heart of the Riviera Maya — walking distance to Fifth Avenue and the Caribbean."
      gridEyebrow="Playa del Carmen"
      gridTitle="Condos available"
      gridTitleMuted="in Playa del Carmen right now"
      developments={developments}
      introTitle="Why buyers choose Playa del Carmen"
      introTitleMuted="over the bigger resort cities"
      introBody={[
        'Playa del Carmen is the most walkable town on the Riviera Maya. Fifth Avenue — the pedestrian spine that runs parallel to the beach — concentrates the restaurants, shops and nightlife, and the ferry to Cozumel leaves from the middle of town. You can live here without a car, which is not true of most of Quintana Roo.',
        'That walkability is exactly what drives the rental market. Playa attracts a heavily European and remote-working crowd that stays for weeks rather than nights, so demand is less tied to the classic high season than in a pure resort destination. Proximity to Fifth Avenue and to the beach is what moves the price per square metre here, far more than the size of the unit.',
        'Our current inventory in Playa del Carmen is deliberately small. We only list developments from builders that have already delivered in Quintana Roo, which in this town means a move-in ready project starting at $2,244,000 MXN and a luxury building near Fifth Avenue launching soon. If you want a wider selection today, Cancún is where the depth is — and we will say so rather than push you into the wrong city.',
      ]}
      faqs={FAQS}
      relatedLinks={RELATED}
      breadcrumbCity="Playa del Carmen"
      breadcrumbCityHref="/playa-del-carmen"
    />
  );
}
