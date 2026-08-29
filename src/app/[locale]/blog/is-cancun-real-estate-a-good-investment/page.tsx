import type { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import EnArticleShell, { H2, P, LEAD, type EnFaq, type EnRelated } from '@/components/blog/EnArticleShell';

// Keyword informacional "is cancun real estate a good investment" / "cancun
// rental yields" — distinto en intención a "condos for sale cancun"
// (transaccional): alguien investigando SI vale la pena, antes de estar
// listo para ver inventario. Escrito a propósito para complementar
// /en/condos-for-sale-cancun, no competir con ella — el enlace hacia esa
// página usa el texto ancla exacto de la keyword que esa página debe ganar.
//
// SOBRE LOS NÚMEROS: no existe un dato de ocupación/tarifa propio (ni de
// unidades administradas por Tresor ni de listings). En vez de inventar un
// "yield del X%" — que es exactamente el tipo de contenido genérico que se
// critica en el post de Medium del cliente — el artículo muestra el RANGO
// real que reportan 3 fuentes públicas distintas (que no coinciden entre
// sí) y enseña la fórmula para que el lector calcule su propio escenario.
// Fuentes citadas inline, no como bibliografía al final.
const SLUG = 'is-cancun-real-estate-a-good-investment';
const URL = `https://www.tresor.mx/en/blog/${SLUG}`;
const TITLE = 'Is Cancún Real Estate a Good Investment? Rental Yields, ROI and the Real Numbers (2026)';
const DESCRIPTION =
  'Public sources on Cancún rental yields disagree by a wide margin — occupancy estimates range from 36% to 57%, daily rates from $70 to $320. Here is why they diverge, and the actual formula to calculate your own return.';
// Foto real de Blume (Puerto Cancún), no stock — las dos imágenes "sin usar"
// de public/blog/ resultaron ser una farmacia y una cafetería genéricas al
// verlas de verdad (nunca las había abierto, solo tomé el nombre de archivo
// de una lista). Landscape real (1639×1092) para que la vista previa de
// WhatsApp/Facebook no salga recortada rara, a diferencia de las aéreas de
// Valmira disponibles, que son verticales.
const HERO = '/desarrollos/Blume/BLUME-Drone-3.jpg';
const DATE_ISO = '2026-08-28';
const DATE_LABEL = 'August 28, 2026';

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: { absolute: `${TITLE} | Tresor Real Estate` },
    description: DESCRIPTION,
    keywords: [
      'is cancun real estate a good investment',
      'cancun rental yields',
      'cancun roi condo',
      'cancun airbnb income',
      'cancun property investment returns',
      'buy condo cancun rental income',
    ],
    alternates: { canonical: URL, languages: { en: URL, 'x-default': URL } },
    openGraph: {
      title: TITLE,
      description: DESCRIPTION,
      url: URL,
      type: 'article',
      publishedTime: DATE_ISO,
      locale: 'en_US',
      images: [{ url: `https://www.tresor.mx${HERO}`, width: 1639, height: 1092 }],
    },
    twitter: { card: 'summary_large_image', title: TITLE, description: DESCRIPTION, images: [`https://www.tresor.mx${HERO}`] },
    robots: { index: true, follow: true },
  };
}

const FAQS: EnFaq[] = [
  {
    q: 'Is Cancún real estate a good investment?',
    a: 'It depends far more on the specific building, location and how it is managed than on the city-wide averages you will find in most articles — including this one. Cancún has real, durable demand drivers (a large international airport, a diversified local economy, decades of tourism infrastructure) that many secondary markets lack. But "Cancún is a good market" and "this specific condo will perform well" are two different claims, and only the second one actually determines your return.',
  },
  {
    q: 'What is a good rental yield in Cancún?',
    a: 'There is no single honest answer, and be skeptical of anyone who gives you one without showing their assumptions. Public occupancy and daily-rate estimates for the market vary by a factor of nearly 2x between reputable data providers. Ask instead: at what occupancy and rate does THIS unit break even, and how far is that from what comparable units in the same building are actually achieving? That is a answerable question. "The market yield" is not.',
  },
  {
    q: 'Airbnb or long-term rental — which pays more in Cancún?',
    a: 'Short-term rental generally has a higher revenue ceiling but real operating costs — cleaning between stays, higher management fees, seasonality, and the work of keeping a listing competitive. Long-term rental is lower revenue but far lower effort and much more predictable. If you will not be actively managing the property or paying someone who will, long-term is usually the honest choice.',
  },
  {
    q: 'How much does property management cost in Cancún?',
    a: 'Short-term rental management typically runs in the range of 15–25% of gross rental income industry-wide, on top of the monthly HOA/maintenance fee the building charges regardless of whether the unit is occupied. Get the exact percentage and what it includes (cleaning, guest communication, dynamic pricing) in writing before you commit to a management company.',
  },
  {
    q: 'Does Cancún real estate appreciate?',
    a: 'Prices in well-located, well-built projects have generally trended upward over the past decade, but past appreciation is not a guarantee of future appreciation, and it varies enormously by submarket — a beachfront tower and an inland pre-construction lot are different bets with different risk profiles. Infrastructure matters here concretely: the Tren Maya and Tulum’s international airport both opened at the end of 2023, and traffic patterns and land values in the region are still adjusting to that.',
  },
  {
    q: 'Is short-term rental legal in Cancún condos?',
    a: 'It depends entirely on the specific building’s bylaws (reglamento de condominio), not on a citywide rule. Some buildings allow it freely, some restrict or ban it, and some require registration. Confirm this in writing for the exact unit before you buy if short-term rental is part of your plan — do not assume it from what you see on listing sites.',
  },
];

const RELATED: EnRelated[] = [
  { slug: 'best-areas-to-buy-in-cancun', title: 'The Best Areas to Buy in Cancún: An Honest Comparison', img: '/desarrollos/villalta/portada3.jpg' },
  { slug: 'pre-construction-vs-move-in-ready-cancun', title: 'Pre-Construction vs. Move-In Ready in Cancún: Which Is Right for You?', img: '/blog/AdobeStock_841077811.jpeg' },
  { slug: 'closing-costs-when-buying-property-in-mexico', title: 'Closing Costs When Buying Property in Mexico: What to Budget For', img: '/blog/AdobeStock_887006964.jpeg' },
];

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (locale !== 'en') redirect(`/en/blog/${SLUG}`);

  return (
    <EnArticleShell
      slug={SLUG}
      title={TITLE}
      h1="Is Cancún real estate a good investment?"
      description={DESCRIPTION}
      eyebrow="Investor's Guide"
      heroImage={HERO}
      heroAlt="Aerial view of a marina residence and private marina in Puerto Cancún"
      dateIso={DATE_ISO}
      dateLabel={DATE_LABEL}
      readTime="9 min"
      breadcrumbLabel="Is Cancún a good investment?"
      faqs={FAQS}
      related={RELATED}
      cta={{
        eyebrow: 'Tresor Real Estate',
        title: 'Want the real numbers on a specific building?',
        subtitle: 'An advisor can show you what comparable units in the same building are actually renting for — not a citywide estimate.',
        image: '/desarrollos/villalta/portada3.jpg',
        imageAlt: 'Condo tower in Cancún',
        primaryHref: '/en/condos-for-sale-cancun',
        primaryLabel: 'Browse condos in Cancún',
        whatsappMessage: "Hi! I'd like to understand the real rental return on a specific condo in Cancún.",
      }}
    >
      <p className={LEAD}>
        Search "Cancún rental yield" and you will find a confident number in the first paragraph of
        almost every result. Search three more sources and you will find three more confident numbers,
        and they will not agree with each other. That disagreement is not a data problem you can fix by
        finding the right article — it is the honest state of the information. Here is why, and here is
        what to do about it instead.
      </p>

      <h2 className={H2}>The numbers genuinely do not agree</h2>
      <p className={P}>
        We pulled current occupancy and average daily rate (ADR) estimates for Cancún short-term rentals
        from three independent data providers. The spread is not small:
      </p>
      <div className="overflow-x-auto mb-10 -mx-6 px-6 md:mx-0 md:px-0">
        <table className="w-full text-sm border-collapse min-w-[560px]">
          <thead>
            <tr className="border-b border-line text-left">
              <th className="py-3 pr-6 font-semibold text-ink">Source</th>
              <th className="py-3 pr-6 font-semibold text-ink">Occupancy</th>
              <th className="py-3 font-semibold text-ink">Average daily rate</th>
            </tr>
          </thead>
          <tbody className="text-ink-2">
            {[
              ['Airbtics', '57%', '~$70 (MXN 1,201)'],
              ['AirROI', '36.1%', '~$130'],
              ['AirDNA', '46%', '~$320'],
            ].map(([src, occ, adr]) => (
              <tr key={src} className="border-b border-line align-top">
                <td className="py-3 pr-6 font-semibold text-ink whitespace-nowrap">{src}</td>
                <td className="py-3 pr-6">{occ}</td>
                <td className="py-3">{adr}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className={P}>
        That is roughly a 1.6x spread on occupancy and a 4.5x spread on daily rate, from three providers
        that all claim to measure the same market. The reason is not that one of them is wrong — it is
        that "Cancún short-term rental" is not one product. It blends a downtown studio, a hotel-zone
        penthouse and a Puerto Cancún marina residence into a single average, and that average describes
        none of them accurately. Any article that gives you one number for "the Cancún yield" has made
        that same blend, whether it says so or not.
      </p>

      <h2 className={H2}>The formula that actually answers your question</h2>
      <p className={P}>
        Instead of a citywide average, run this on the specific unit you are considering. It is not
        complicated — it just requires your own inputs instead of someone else&apos;s.
      </p>
      <div className="rounded-lg border border-line bg-bg-soft p-6 mb-8">
        <p className="font-mono text-[13px] text-ink leading-relaxed">
          Gross annual rental income = ADR × 365 × occupancy rate<br />
          Net annual income = Gross income − (management fee % × gross income) − annual HOA/maintenance<br />
          Gross yield = Net annual income ÷ purchase price
        </p>
      </div>
      <p className={P}>
        Two inputs you need that a citywide average cannot give you: the ADR and occupancy{' '}
        <em>comparable units in the same building</em> are actually achieving — ask your advisor or the
        building&apos;s management for this, not a market report — and the building&apos;s real monthly
        HOA/maintenance fee, which in Cancún condos runs roughly from MXN 3,000/month for a modest
        property to MXN 25,000/month or more for a full-amenity beachfront building. Short-term rental
        management typically runs 15–25% of gross income on top of that.
      </p>

      <h2 className={H2}>What that spread means in dollars</h2>
      <p className={P}>
        To make the disagreement concrete instead of abstract, here is gross annual income from the
        formula above, using each source&apos;s own occupancy and rate together — not mixed across
        sources, since that would overstate the point rather than illustrate it honestly:
      </p>
      <div className="overflow-x-auto mb-6 -mx-6 px-6 md:mx-0 md:px-0">
        <table className="w-full text-sm border-collapse min-w-[620px]">
          <thead>
            <tr className="border-b border-line text-left">
              <th className="py-3 pr-6 font-semibold text-ink">Source</th>
              <th className="py-3 pr-6 font-semibold text-ink">Occupancy × ADR</th>
              <th className="py-3 font-semibold text-ink">Implied gross annual income</th>
            </tr>
          </thead>
          <tbody className="text-ink-2">
            {[
              ['Airbtics', '57% × $70', '≈ $14,560 USD'],
              ['AirROI', '36.1% × $130', '≈ $17,130 USD'],
              ['AirDNA', '46% × $320', '≈ $53,730 USD'],
            ].map(([src, calc, income]) => (
              <tr key={src} className="border-b border-line align-top">
                <td className="py-3 pr-6 font-semibold text-ink whitespace-nowrap">{src}</td>
                <td className="py-3 pr-6">{calc}</td>
                <td className="py-3">{income}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className={P}>
        Against a current entry-tier Cancún condo — Valmira, from $2,595,000 MXN — that is roughly a 3.7x
        difference in implied gross income depending on which published source you happened to read,
        before a single dollar of management fees or HOA is subtracted. That gap is the whole point: it
        is why we are not going to hand you a single percentage and ask you to trust it. Run the math on
        the specific unit, with that building&apos;s real occupancy and rate, and you get an answer you
        can actually rely on.
      </p>
      <p className="text-[13px] font-light leading-relaxed text-ink-3 mb-4">
        Gross income figures above are calculated directly from the occupancy/ADR estimates cited earlier
        (ADR × 365 × occupancy), shown to illustrate the size of the gap between sources — they are not a
        forecast for any specific property. Currency figures in MXN and USD are approximate and move with
        the exchange rate; ask an advisor for the figure on the day you are comparing.
      </p>

      <h2 className={H2}>What actually moves your return, in practice</h2>
      <p className={P}>
        Once you stop looking for a magic citywide number, the things that genuinely determine whether a
        Cancún condo performs are mostly things you can evaluate before you buy:
      </p>
      <ul className="space-y-3 mb-10 text-ink-2">
        {[
          ['Building location, specifically', 'Beachfront, hotel-zone-adjacent, and marina/golf communities like Puerto Cancún attract a different guest profile and price point than inland residential corridors. Neither is "better" — they are different products with different demand curves.'],
          ['Whether the building allows short-term rental', 'Confirmed in the bylaws, not assumed. This alone determines whether the higher-revenue, higher-effort strategy is even available to you.'],
          ['Who manages it', 'The spread between a well-run listing and a neglected one, in the same building, is often larger than the spread between cities. Ask for real performance data from an existing owner in the building if you can.'],
          ['Delivery stage', 'A finished unit starts earning immediately; a pre-construction unit earns nothing until delivery. Time-value of that gap belongs in your math.'],
          ['Your actual strategy', 'Long-term rental, short-term rental, and personal use with occasional renting are three different financial models. Pick one before you calculate a return, not after.'],
        ].map(([t, d]) => (
          <li key={t} className="flex gap-3">
            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
            <span><strong className="text-ink font-semibold">{t}:</strong> {d}</span>
          </li>
        ))}
      </ul>

      <h2 className={H2}>Where this leaves you</h2>
      <p className={P}>
        Cancún has real structural demand — an international airport that is one of the busiest in
        Latin America, a large and diversified local economy beyond tourism, and infrastructure
        investment (the Tren Maya and Tulum&apos;s new international airport both opened at the end of
        2023) that is still reshaping travel and land values across the region. Those are genuine
        tailwinds. They are not, on their own, a yield.
      </p>
      <p className={P}>
        If you want a number you can actually trust, get it from a specific building, not a market
        report: what comparable units are renting for today, what the real monthly costs are, and what
        an existing owner in that building — not a listing site&apos;s estimate — is actually seeing. You
        can browse current{' '}
        <Link href="/en/condos-for-sale-cancun" className="text-accent hover:underline">
          condos for sale in Cancún
        </Link>{' '}
        by price and delivery status, or if the marina-and-golf profile of{' '}
        <Link href="/en/condos-for-sale-puerto-cancun" className="text-accent hover:underline">
          Puerto Cancún
        </Link>{' '}
        fits your strategy better, that is a genuinely different product with its own numbers to run.
      </p>
      <p className="text-[13px] font-light leading-relaxed text-ink-3 mb-4">
        This article is general information, not investment, legal or tax advice. No rental income,
        occupancy, appreciation or return is implied or guaranteed. Public data cited (Airbtics, AirROI,
        AirDNA) reflects third-party estimates current as of publication and can change; verify current
        figures and building-specific bylaws before making a purchase decision.
      </p>
    </EnArticleShell>
  );
}
