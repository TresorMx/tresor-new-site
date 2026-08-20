import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import CondosSeoPage, { type CondosFaq, type CondosRelatedLink } from '@/components/category/CondosSeoPage';
import { getMergedDevelopmentsAsync, isListingRelationship } from '@/lib/developments';

export const dynamic = 'force-dynamic';

// Página de contenido en INGLÉS para "condos for sale in puerto cancun".
// Hermana de /condos-for-sale-cancun; misma estructura y mismo motivo de ser
// (ver notas ahí). Se distingue de la landing de pauta
// /luxury-condos-puerto-cancun: aquella es de Google Ads, sin nav ni footer y
// bloqueada a un solo desarrollo; esta lleva chrome completo, enlaces
// internos y TODO el inventario de la zona — es la que compite en orgánico.
const PATH = '/condos-for-sale-puerto-cancun';
const URL_EN = `https://www.tresor.mx/en${PATH}`;
// El equivalente real en español NO es una traducción de esta URL, es la
// página de departamentos de la zona. Tiene que declararse aquí: el
// hreflang solo cuenta si es recíproco, y /departamentos-en-venta-puerto-cancun
// ya nos declara a nosotros. Si falta este lado, Google descarta el par entero.
const URL_ES = 'https://www.tresor.mx/departamentos-en-venta-puerto-cancun';

const TITLE = 'Condos for Sale in Puerto Cancún — Marina & Golf Community';
const DESCRIPTION =
  'Condos for sale in Puerto Cancún, the gated marina and golf community in Cancún. Browse marina-front residences from established developers and see how foreigners buy property in Mexico.';

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: { absolute: `${TITLE} · Tresor Real Estate` },
    description: DESCRIPTION,
    keywords: [
      'condos for sale puerto cancun',
      'puerto cancun condos',
      'puerto cancun real estate',
      'marina front condos cancun',
      'puerto cancun golf community',
      'luxury condos cancun mexico',
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
    q: 'What exactly is Puerto Cancún?',
    a: 'Puerto Cancún is an 808-acre (327-hectare) master-planned community developed by FONATUR, sitting between downtown Cancún and the Hotel Zone. Inside it you have an 18-hole golf course, a private marina with boat slips, a beach club and a luxury shopping mall — all behind controlled access, minutes from Cancún International Airport.',
  },
  {
    q: 'How much does a condo in Puerto Cancún cost?',
    a: 'Puerto Cancún is the premium end of the Cancún market. In our current portfolio, residences there start at $15,289,000 MXN and go up from there depending on the tower, floor and exposure. The USD equivalent moves with the exchange rate — ask an advisor for the figure on the day you are comparing.',
  },
  {
    q: 'Can a foreigner buy in Puerto Cancún?',
    a: 'Yes. Puerto Cancún sits inside the coastal restricted zone, so foreign buyers typically take title through a fideicomiso — a renewable 50-year bank trust — or through a Mexican corporation. It is the same structure used across the Riviera Maya and it has been in place for decades.',
  },
  {
    q: 'Does buying a condo include golf or marina access?',
    a: 'Not automatically. The golf club and the marina operate their own memberships and slip rentals, separate from the condo purchase. Some developments negotiate access or preferential terms for owners, so ask specifically what is included before you sign — it varies building by building.',
  },
  {
    q: 'Is Puerto Cancún good for rental income?',
    a: 'It is a residential community rather than a hotel strip, so the profile skews toward long-stay and second-home use rather than high-turnover vacation rental. Individual buildings also set their own rules on short-term rentals. If rental income is your main goal, tell your advisor up front so they only show you buildings whose regime allows it.',
  },
  {
    q: 'How far is Puerto Cancún from the airport and the beach?',
    a: 'Cancún International Airport is a short drive away, and the Hotel Zone begins immediately south of the community. Puerto Cancún has its own beach club, so owners are not dependent on public beach access.',
  },
  {
    q: 'What are the closing costs?',
    a: 'Budget for the acquisition tax, notary fees, registry fees and the setup of the fideicomiso, on top of the purchase price. They are usually quoted as a percentage of the purchase price and vary with the property value. Ask for a written estimate before signing and review it with your own attorney — this is general information, not legal or tax advice.',
  },
  {
    q: 'Can I see the property without travelling to Mexico?',
    a: 'Yes. We run private tours by video call in English, and several developments have virtual tours you can walk through yourself. A purchase can also be completed remotely through a power of attorney, though most buyers choose to visit before closing.',
  },
];

const RELATED: CondosRelatedLink[] = [
  { href: '/condos-for-sale-cancun', label: 'Cancún', sub: 'The full picture across every zone of the city.' },
  { href: '/tulum', label: 'Tulum', sub: "Pre-construction condos in Mexico's fastest-growing destination." },
  { href: '/condos-for-sale-playa-del-carmen', label: 'Playa del Carmen', sub: 'Condos steps from Fifth Avenue and the Caribbean Sea.' },
];

export default async function CondosForSalePuertoCancunPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (locale !== 'en') redirect(`/en${PATH}`);

  const all = await getMergedDevelopmentsAsync();
  const developments = all.filter(
    (d) => d.city === 'Puerto Cancún' && !isListingRelationship(d.relationship),
  );

  return (
    <CondosSeoPage
      canonicalPath={PATH}
      heroImage="/desarrollos/Vellmari/ENTREGAFINAL_CADU_VELMARI_AEREA01.jpg"
      heroImageAlt="Aerial view of Puerto Cancún — marina, golf course and condos"
      h1="Condos for Sale in Puerto Cancún"
      heroSubtitle="Marina-front residences inside Cancún's gated golf community — with a beach club, a private marina and the airport minutes away."
      gridEyebrow="Puerto Cancún"
      gridTitle="Residences available"
      gridTitleMuted="in Puerto Cancún"
      developments={developments}
      introTitle="A gated community"
      introTitleMuted="wrapped around a marina and a golf course"
      introBody={[
        'Puerto Cancún is the closest thing Cancún has to a self-contained address. Built by FONATUR on 808 acres between downtown and the Hotel Zone, it puts an 18-hole golf course, a working marina, a beach club and a luxury mall behind one controlled entrance — which is why it attracts second-home buyers rather than short-stay tourists.',
        'The trade-off is price. This is the premium tier of the local market: residences here start around $15,289,000 MXN, against roughly $2,595,000 MXN for a condo in one of the city\'s growing inland corridors. You are paying for the enclave, the water frontage and the scarcity of land inside it.',
        'Because inventory is small and concentrated in a handful of towers, availability by floor plan changes quickly. The list below is what is actually open right now — if a layout is not showing, it is because it is gone.',
      ]}
      faqs={FAQS}
      relatedLinks={RELATED}
      breadcrumbCity="Puerto Cancún"
      breadcrumbCityHref="/puerto-cancun"
    />
  );
}
