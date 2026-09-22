import type { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import EnArticleShell, { H2, P, LEAD, type EnFaq, type EnRelated } from '@/components/blog/EnArticleShell';
import { entryByCity, saleCondos, mxn } from '@/lib/blogCatalog';
import type { City } from '@/lib/developments';

// Keyword informacional "cancun vs playa del carmen vs tulum" / "where to buy
// property riviera maya" — la comparación ENTRE ciudades. No compite con:
//   /en/condos-for-sale-{cancun,playa-del-carmen,puerto-cancun} (transaccional,
//     por ciudad) → este post les manda enlaces con su keyword exacta.
//   /en/blog/best-areas-to-buy-in-cancun (zonas DENTRO de Cancún).
//
// Precios: de lib/blogCatalog, en vivo (Sanity gana), revalidate 1h. Nada de
// precios escritos a mano en el texto — la prosa remite a la tabla.
// Sobreoferta en la Riviera Maya: se menciona solo cualitativamente, porque la
// nota de prensa que la reporta no trae cifras. La cifra de caída en Tulum
// que circula sin fuente NO se usa.
export const revalidate = 3600;

const SLUG = 'cancun-vs-playa-del-carmen-vs-tulum';
const TITLE = 'Cancún vs. Playa del Carmen vs. Tulum: Where to Buy a Condo in 2026';
const DESCRIPTION =
  'An honest side-by-side of the three Riviera Maya markets foreign buyers compare most: entry prices from live inventory, airport access, lifestyle, rental profile and the risks of each.';
// Aérea real de Vellmari (Puerto Cancún) — abierta y revisada: torres, marina
// y el Caribe al fondo. 1920×1281, horizontal.
const HERO = '/desarrollos/Vellmari/ENTREGAFINAL_CADU_VELMARI_AEREA03.jpg';
const DATE_ISO = '2026-09-22';
const DATE_LABEL = 'September 22, 2026';
const URL = `https://www.tresor.mx/en/blog/${SLUG}`;

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: { absolute: `${TITLE} | Tresor Real Estate` },
    description: DESCRIPTION,
    keywords: [
      'cancun vs playa del carmen vs tulum',
      'cancun vs tulum real estate',
      'playa del carmen vs tulum condo',
      'where to buy property in riviera maya',
      'best place to buy condo mexican caribbean',
    ],
    alternates: { canonical: URL, languages: { en: URL, 'x-default': URL } },
    openGraph: {
      title: TITLE,
      description: DESCRIPTION,
      url: URL,
      type: 'article',
      publishedTime: DATE_ISO,
      locale: 'en_US',
      images: [{ url: `https://www.tresor.mx${HERO}`, width: 1920, height: 1281 }],
    },
    twitter: { card: 'summary_large_image', title: TITLE, description: DESCRIPTION, images: [`https://www.tresor.mx${HERO}`] },
    robots: { index: true, follow: true },
  };
}

const FAQS: EnFaq[] = [
  {
    q: 'Is it better to buy in Cancún, Playa del Carmen or Tulum?',
    a: 'There is no universal winner — they are different products. Cancún is a full city with the region’s main international airport and the widest range of inventory. Playa del Carmen is smaller and walkable, built around Fifth Avenue. Tulum is the most lifestyle- and brand-driven of the three, with a newer international airport and a market that is mostly pre-construction. Decide how you will use the property first; the city usually follows from that.',
  },
  {
    q: 'Which is cheapest: Cancún, Playa del Carmen or Tulum?',
    a: 'Entry prices across the three are closer than most people expect — the comparison table in this article is generated from our live inventory, so check it for current numbers. The bigger price differences are within each city (beachfront or marina versus inland) rather than between cities.',
  },
  {
    q: 'How far are Playa del Carmen and Tulum from Cancún airport?',
    a: 'Playa del Carmen is roughly one hour south of Cancún International Airport by highway. Tulum is roughly two hours south, but it also has its own international airport, which opened at the end of 2023 and has been adding routes since.',
  },
  {
    q: 'Is Tulum overbuilt?',
    a: 'Local press has reported a sales slowdown across the Riviera Maya linked to oversupply, described as a natural market adjustment. For a buyer that means more choice and more negotiating room, but also more reason to check the developer’s delivery track record and the project’s sales pace before signing — especially for pre-construction.',
  },
  {
    q: 'Can foreigners buy in all three cities?',
    a: 'Yes. All three are inside Mexico’s coastal restricted zone, so foreign buyers purchase residential property through a bank trust (fideicomiso), which is a routine, well-established process. Our guide on buying property in Mexico as a foreigner covers it step by step.',
  },
];

const RELATED: EnRelated[] = [
  { slug: 'best-areas-to-buy-in-cancun', title: 'The Best Areas to Buy in Cancún: An Honest Comparison', img: '/desarrollos/villalta/portada3.jpg' },
  { slug: 'buying-property-in-mexico-as-a-foreigner', title: 'Can Foreigners Buy Property in Mexico? The Complete 2026 Guide', img: '/desarrollos/Blume/BLUME-Drone-1.jpg' },
  { slug: 'pre-construction-vs-move-in-ready-cancun', title: 'Pre-Construction vs. Move-In Ready in Cancún: Which Is Right for You?', img: '/blog/AdobeStock_841077811.jpeg' },
];

const CITIES: { city: City; label: string; href: string; anchor: string }[] = [
  { city: 'Cancún', label: 'Cancún', href: '/en/condos-for-sale-cancun', anchor: 'condos for sale in Cancún' },
  { city: 'Puerto Cancún', label: 'Puerto Cancún', href: '/en/condos-for-sale-puerto-cancun', anchor: 'condos for sale in Puerto Cancún' },
  { city: 'Playa del Carmen', label: 'Playa del Carmen', href: '/en/condos-for-sale-playa-del-carmen', anchor: 'condos for sale in Playa del Carmen' },
  { city: 'Tulum', label: 'Tulum', href: '/en/tulum', anchor: 'condos for sale in Tulum' },
];

const statusEn: Record<string, string> = {
  Preventa: 'Pre-construction',
  'En obra': 'Under construction',
  'Entrega inmediata': 'Move-in ready',
};

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (locale !== 'en') redirect(`/en/blog/${SLUG}`);

  const [entry, condos] = await Promise.all([entryByCity(), saleCondos()]);
  // Etapas disponibles por ciudad (ej. Tulum hoy solo tiene preventa).
  const stages = (city: City) =>
    [...new Set(condos.filter((d) => d.city === city).map((d) => statusEn[d.status] ?? d.status))].join(', ');

  return (
    <EnArticleShell
      slug={SLUG}
      title={TITLE}
      h1="Cancún vs. Playa del Carmen vs. Tulum: where to buy in 2026"
      description={DESCRIPTION}
      eyebrow="Market Comparison"
      heroImage={HERO}
      heroAlt="Aerial view of residential towers, the marina and the Caribbean Sea in Puerto Cancún"
      dateIso={DATE_ISO}
      dateLabel={DATE_LABEL}
      readTime="8 min"
      breadcrumbLabel="Cancún vs. Playa vs. Tulum"
      faqs={FAQS}
      related={RELATED}
      cta={{
        eyebrow: 'Tresor Real Estate',
        title: 'Not sure which city fits you?',
        subtitle: 'Tell an advisor how you plan to use the property and your budget — we will show you real options in all three markets.',
        image: '/desarrollos/villalta/portada3.jpg',
        imageAlt: 'Condo tower in Cancún',
        primaryHref: '/en/desarrollos',
        primaryLabel: 'Browse all developments',
        whatsappMessage: "Hi! I'm comparing Cancún, Playa del Carmen and Tulum and would like some guidance.",
      }}
    >
      <p className={LEAD}>
        Almost every foreign buyer looking at the Mexican Caribbean ends up with the same three tabs open:
        Cancún, Playa del Carmen and Tulum. They are an hour or two apart on the same highway, but they are
        genuinely different markets — different buyers, different price drivers, different risks. Here is
        how they actually compare, with entry prices pulled from live inventory rather than a
        year-old blog post.
      </p>

      <h2 className={H2}>The short version</h2>
      <ul className="space-y-3 mb-10 text-ink-2">
        {[
          ['Cancún', 'A real city of close to a million people with the region’s main international airport, a year-round local economy and the widest range of inventory — from inland residential corridors to marina towers in Puerto Cancún.'],
          ['Playa del Carmen', 'Smaller and walkable, organized around Fifth Avenue, with an established international community. Best if you want to live without depending on a car.'],
          ['Tulum', 'The most lifestyle- and brand-driven of the three. Mostly pre-construction, with its own international airport since the end of 2023 — and the market where choosing the right developer matters most.'],
        ].map(([t, d]) => (
          <li key={t} className="flex gap-3">
            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
            <span><strong className="text-ink font-semibold">{t}:</strong> {d}</span>
          </li>
        ))}
      </ul>

      <h2 className={H2}>Entry prices, from live inventory</h2>
      <p className={P}>
        The lowest current list price for a condo in each market within our portfolio. This table is
        generated from our inventory and updates automatically when prices change.
      </p>
      <div className="overflow-x-auto mb-6 -mx-6 px-6 md:mx-0 md:px-0">
        <table className="w-full text-sm border-collapse min-w-[560px]">
          <thead>
            <tr className="border-b border-line text-left">
              <th className="py-3 pr-6 font-semibold text-ink">Market</th>
              <th className="py-3 pr-6 font-semibold text-ink">Condos from</th>
              <th className="py-3 pr-6 font-semibold text-ink">Development</th>
              <th className="py-3 font-semibold text-ink">Stages available</th>
            </tr>
          </thead>
          <tbody className="text-ink-2">
            {CITIES.filter(({ city }) => entry[city]).map(({ city, label }) => {
              const e = entry[city]!;
              return (
                <tr key={city} className="border-b border-line align-top">
                  <td className="py-3 pr-6 font-semibold text-ink whitespace-nowrap">{label}</td>
                  <td className="py-3 pr-6 whitespace-nowrap">{mxn(e.price)}</td>
                  <td className="py-3 pr-6">
                    <Link href={`/en${e.dev.href}`} className="hover:text-accent transition-colors">{e.dev.name}</Link>
                  </td>
                  <td className="py-3">{stages(city)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <p className="text-[13px] font-light leading-relaxed text-ink-3 mb-10">
        List prices in Mexican pesos, subject to change and availability. Puerto Cancún is a gated marina and
        golf community inside Cancún, shown separately because it is a different price tier. Closing costs
        are not included — see our guide to{' '}
        <Link href="/en/blog/closing-costs-when-buying-property-in-mexico" className="text-accent hover:underline">closing costs in Mexico</Link>.
      </p>
      <p className={P}>
        The takeaway most buyers do not expect: at the entry level, the three cities are closer in price
        than their reputations suggest. The large price gaps live <em>within</em> each market — marina or
        beachfront versus inland — more than between them.
      </p>

      <h2 className={H2}>Side by side</h2>
      <div className="overflow-x-auto mb-10 -mx-6 px-6 md:mx-0 md:px-0">
        <table className="w-full text-sm border-collapse min-w-[640px]">
          <thead>
            <tr className="border-b border-line text-left">
              <th className="py-3 pr-6 font-semibold text-ink"></th>
              <th className="py-3 pr-6 font-semibold text-ink">Cancún</th>
              <th className="py-3 pr-6 font-semibold text-ink">Playa del Carmen</th>
              <th className="py-3 font-semibold text-ink">Tulum</th>
            </tr>
          </thead>
          <tbody className="text-ink-2">
            {[
              ['Airport', 'Cancún International, in the city', '~1 hour to Cancún airport', '~2 hours to Cancún, or Tulum’s own airport (opened 2023)'],
              ['Feel', 'Full city, car-based', 'Walkable, Fifth Avenue', 'Boutique, jungle-and-beach'],
              ['Inventory range', 'Widest', 'Smaller', 'Mostly pre-construction'],
              ['Rental demand', 'Tourism plus a large local market', 'Tourism plus remote workers', 'Tourism-driven, more seasonal'],
              ['Main risk', 'Picking the wrong area within a big city', 'Distance from Fifth Avenue drives price', 'Oversupply and developer execution'],
            ].map(([k, a, b, c]) => (
              <tr key={k} className="border-b border-line align-top">
                <td className="py-3 pr-6 font-semibold text-ink whitespace-nowrap">{k}</td>
                <td className="py-3 pr-6">{a}</td>
                <td className="py-3 pr-6">{b}</td>
                <td className="py-3">{c}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2 className={H2}>Cancún: the most options, the most liquidity</h2>
      <p className={P}>
        Cancún is the only one of the three that works as a full city on its own: a large resident population,
        commerce and services that do not depend on tourists, and the region&apos;s main international airport.
        That local economy is what gives it the broadest buyer pool when you eventually sell. Inside the city,
        the choice is really between areas — the gated marina-and-golf community of Puerto Cancún, the Hotel
        Zone, and newer residential corridors — which we break down in{' '}
        <Link href="/en/blog/best-areas-to-buy-in-cancun" className="text-accent hover:underline">the best areas to buy in Cancún</Link>.
        See current{' '}
        <Link href="/en/condos-for-sale-cancun" className="text-accent hover:underline">condos for sale in Cancún</Link>, or the
        marina tier in{' '}
        <Link href="/en/condos-for-sale-puerto-cancun" className="text-accent hover:underline">Puerto Cancún</Link>.
      </p>

      <h2 className={H2}>Playa del Carmen: walkable and international</h2>
      <p className={P}>
        Playa del Carmen grew differently: tourism, commerce and housing share the same streets instead of
        being split into a separate hotel strip, with pedestrian Fifth Avenue as the spine. It has a strong
        international resident community, which supports rental demand that is less purely vacation-driven.
        The main price driver is simple — distance to Fifth Avenue and the beach. Browse{' '}
        <Link href="/en/condos-for-sale-playa-del-carmen" className="text-accent hover:underline">condos for sale in Playa del Carmen</Link>.
      </p>

      <h2 className={H2}>Tulum: the highest ceiling, the most homework</h2>
      <p className={P}>
        Tulum sells a lifestyle and a brand more than the other two, and its own international airport (open
        since the end of 2023) plus the Tren Maya have improved access. It is also where the Riviera Maya&apos;s
        construction boom was most intense, and local press has reported a regional sales slowdown linked to
        oversupply. That does not make Tulum a bad buy — it makes the developer and the specific project the
        whole decision. Before signing a Tulum pre-construction contract, look at the developer&apos;s delivered
        projects, the construction schedule and how much of the project has actually sold.
      </p>
      <p className={P}>
        In our portfolio, Tulum inventory sits in Aldea Zamá, the established residential area between town
        and the beach — see{' '}
        <Link href="/en/tulum" className="text-accent hover:underline">condos for sale in Tulum</Link>.
      </p>

      <h2 className={H2}>How to choose</h2>
      <div className="space-y-4 mb-10">
        {[
          { t: 'You want to live there, full-time or for long stretches', d: 'Playa del Carmen if walkability matters most; Cancún if you want a full city with hospitals, schools and a major airport nearby.' },
          { t: 'You want rental income', d: 'Look at the specific building’s rental rules and real comparable performance, not the city’s reputation. Our guide to Cancún rental yields explains how to run the numbers.' },
          { t: 'You want to move in soon', d: 'Cancún and Playa del Carmen have move-in-ready inventory today; Tulum is mostly pre-construction.' },
          { t: 'You want the most upside and accept more risk', d: 'Pre-construction in any of the three — but only with a developer who has delivered before. That filter matters most in Tulum.' },
        ].map((item) => (
          <div key={item.t} className="p-5 rounded-xl border border-line bg-bg-soft">
            <h3 className="font-sans font-bold text-ink mb-1">{item.t}</h3>
            <p className="text-ink-2 text-sm leading-relaxed">{item.d}</p>
          </div>
        ))}
      </div>
      <p className={P}>
        For the rental math specifically, read{' '}
        <Link href="/en/blog/is-cancun-real-estate-a-good-investment" className="text-accent hover:underline">is Cancún real estate a good investment?</Link>{' '}
        — the same formula applies to Playa del Carmen and Tulum.
      </p>
      <p className="text-[13px] font-light leading-relaxed text-ink-3 mb-4">
        This article is general information, not investment, legal or tax advice. No rental income,
        appreciation or return is implied or guaranteed. Travel times are approximate and depend on traffic.
      </p>
    </EnArticleShell>
  );
}
