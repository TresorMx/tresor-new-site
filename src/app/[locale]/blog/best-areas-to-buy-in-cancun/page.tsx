import type { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import EnArticleShell, { H2, P, LEAD, type EnFaq, type EnRelated } from '@/components/blog/EnArticleShell';

// Keyword informacional "best areas to buy in cancun". Este post es el que
// más enlaces internos reparte: cada zona apunta a su landing o ficha, así
// que funciona como distribuidor de autoridad hacia las páginas de catálogo.
// Los precios citados salen del inventario real (developments.ts) — si cambian
// ahí, hay que actualizarlos aquí también.
const SLUG = 'best-areas-to-buy-in-cancun';
const URL = `https://www.tresor.mx/en/blog/${SLUG}`;
const TITLE = 'The Best Areas to Buy in Cancún: An Honest Comparison (2026)';
const DESCRIPTION =
  'Puerto Cancún, the Hotel Zone, Av. Huayacán, Vía Cumbres and Lausana compared on price, buyer profile and trade-offs — so you can tell which part of Cancún actually fits what you want.';
const HERO = '/desarrollos/villalta/portada3.jpg';
const DATE_ISO = '2026-08-06';
const DATE_LABEL = 'August 6, 2026';

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: { absolute: `${TITLE} | Tresor Real Estate` },
    description: DESCRIPTION,
    keywords: [
      'best areas to buy in cancun',
      'where to buy property in cancun',
      'best neighborhoods cancun',
      'puerto cancun vs hotel zone',
      'cancun real estate areas',
      'where to invest in cancun',
    ],
    alternates: { canonical: URL, languages: { en: URL, 'x-default': URL } },
    openGraph: {
      title: TITLE,
      description: DESCRIPTION,
      url: URL,
      type: 'article',
      publishedTime: DATE_ISO,
      locale: 'en_US',
      images: [{ url: `https://www.tresor.mx${HERO}`, width: 1920, height: 1080 }],
    },
    twitter: { card: 'summary_large_image', title: TITLE, description: DESCRIPTION, images: [`https://www.tresor.mx${HERO}`] },
    robots: { index: true, follow: true },
  };
}

const FAQS: EnFaq[] = [
  {
    q: 'What is the best area to buy in Cancún?',
    a: 'There is no single best area — they serve different goals. Puerto Cancún is the premium gated option for a second home. The Hotel Zone is where beach access and vacation-rental demand are strongest. Av. Huayacán, Vía Cumbres and Lausana are where the city itself is growing and where entry prices are lowest. Pick the one that matches how you will actually use the property.',
  },
  {
    q: 'Which area is cheapest to buy into?',
    a: 'The inland residential corridors. In our current portfolio, condos on Av. Huayacán start around $2,595,000 MXN and in Lausana around $2,613,000 MXN, against roughly $15,289,000 MXN for the entry point in Puerto Cancún.',
  },
  {
    q: 'Which area is best for rental income?',
    a: 'The Hotel Zone has the most consistent vacation-rental demand because of beach access and tourist traffic. Puerto Cancún skews toward long-stay and second-home use. Whatever the area, the deciding factor is the individual building: the condo regime sets whether short-term rental is allowed at all, so confirm that before you buy.',
  },
  {
    q: 'Is Puerto Cancún worth the premium?',
    a: 'It depends what you are buying for. You are paying for a gated, master-planned enclave with a marina, an 18-hole golf course and a beach club, on land that cannot expand. If you value that environment and a scarce supply, the premium is the point. If your goal is the lowest entry price or the highest rental turnover, other areas fit better.',
  },
  {
    q: 'How far is each area from the airport?',
    a: 'Cancún International Airport sits south of the city, which makes Puerto Cancún and the Hotel Zone convenient for frequent flyers. The Huayacán and Cumbres corridors are inland and closer to everyday city services — schools, hospitals and shopping — than to the beach.',
  },
];

const RELATED: EnRelated[] = [
  { slug: 'buying-property-in-mexico-as-a-foreigner', title: 'Can Foreigners Buy Property in Mexico? The Complete 2026 Guide', img: '/desarrollos/Blume/BLUME-Drone-1.jpg' },
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
      h1="The best areas to buy in Cancún"
      description={DESCRIPTION}
      eyebrow="Area Guide"
      heroImage={HERO}
      heroAlt="Residential towers and lagoon views in Cancún"
      dateIso={DATE_ISO}
      dateLabel={DATE_LABEL}
      readTime="8 min"
      breadcrumbLabel="Best areas to buy in Cancún"
      faqs={FAQS}
      related={RELATED}
      cta={{
        eyebrow: 'Tresor Real Estate',
        title: 'Not sure which area fits you?',
        subtitle: 'Tell an advisor how you plan to use the property and they will narrow it down to the two or three buildings that actually make sense.',
        image: '/desarrollos/Vellmari/ENTREGAFINAL_CADU_VELMARI_AEREA01.jpg',
        imageAlt: 'Aerial view of Puerto Cancún — marina, golf course and beaches',
        primaryHref: '/en/condos-for-sale-cancun',
        primaryLabel: 'Browse condos in Cancún',
        whatsappMessage: "Hi! I'd like help choosing the right area in Cancún for my budget and goals.",
      }}
    >
      <p className={LEAD}>
        &ldquo;Cancún&rdquo; is not one market. A condo on the lagoon in the Hotel Zone and a condo
        on Av. Huayacán are in the same city and almost nothing else. They have different buyers,
        different price floors, and different reasons to exist.
      </p>
      <p className={P}>
        So rather than rank the areas — which would be meaningless without knowing your goal — here
        is what each one actually is, what it costs to get in today, and who it genuinely suits.
      </p>

      <h2 className={H2}>At a glance</h2>
      <div className="overflow-x-auto mb-10 -mx-6 px-6 md:mx-0 md:px-0">
        <table className="w-full text-sm border-collapse min-w-[620px]">
          <thead>
            <tr className="border-b border-line text-left">
              <th className="py-3 pr-6 font-semibold text-ink">Area</th>
              <th className="py-3 pr-6 font-semibold text-ink">Entry price*</th>
              <th className="py-3 font-semibold text-ink">Best for</th>
            </tr>
          </thead>
          <tbody className="text-ink-2">
            {[
              ['Puerto Cancún', 'from ~$15,289,000 MXN', 'Second home, marina and golf lifestyle, scarcity'],
              ['Hotel Zone', 'from ~$5,000,000 MXN', 'Beach access and vacation-rental demand'],
              ['Av. Huayacán', 'from ~$2,595,000 MXN', 'Lowest entry price, city growth corridor'],
              ['Vía Cumbres', 'from ~$3,500,000 MXN', 'Planned community, families, airport access'],
              ['Lausana', 'from ~$2,613,000 MXN', 'Golf-course views at a mid-market price'],
            ].map(([area, price, best]) => (
              <tr key={area} className="border-b border-line align-top">
                <td className="py-3 pr-6 font-semibold text-ink whitespace-nowrap">{area}</td>
                <td className="py-3 pr-6 whitespace-nowrap">{price}</td>
                <td className="py-3">{best}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-[13px] font-light leading-relaxed text-ink-3 mb-10">
        *Entry price refers to the lowest-priced unit currently in our portfolio for that area, in
        Mexican pesos. Availability and pricing change constantly — ask an advisor for today&rsquo;s
        figure. The USD equivalent moves with the exchange rate.
      </p>

      <h2 className={H2}>Puerto Cancún — the premium enclave</h2>
      <p className={P}>
        An 808-acre master-planned community developed by FONATUR, sitting between downtown and the
        Hotel Zone, with a private marina, an 18-hole golf course, a beach club and a luxury mall
        behind controlled access.
      </p>
      <p className={P}>
        What makes it distinct is not the amenities so much as the fact that{' '}
        <strong className="text-ink font-semibold">it cannot grow</strong>. It is a closed polygon
        with regulated density, so supply is structurally finite. That is the argument for the
        premium, and it is a real one.
      </p>
      <p className={P}>
        <strong className="text-ink font-semibold">Suits:</strong> buyers who want a second home in a
        controlled environment and are thinking in terms of holding an asset rather than maximising
        turnover. <strong className="text-ink font-semibold">Less suited to:</strong> anyone whose
        plan depends on high-frequency short-term rental. See{' '}
        <Link href="/en/condos-for-sale-puerto-cancun" className="text-accent hover:underline">
          condos for sale in Puerto Cancún
        </Link>.
      </p>

      <h2 className={H2}>Hotel Zone — beach access and rental demand</h2>
      <p className={P}>
        The barrier island between the Caribbean and the Nichupté Lagoon. This is the Cancún people
        picture: hotels, beach clubs, nightlife, and the strongest and most consistent
        vacation-rental demand in the city.
      </p>
      <p className={P}>
        The trade-offs are the flip side of the same coin. It is a tourism strip, so it is busier and
        more seasonal than a residential neighbourhood, and day-to-day services are oriented to
        visitors rather than residents. Residential inventory here is limited relative to hotel
        development.
      </p>
      <p className={P}>
        <strong className="text-ink font-semibold">Suits:</strong> buyers prioritising beach
        proximity and rental income. <strong className="text-ink font-semibold">Less suited to:</strong>{' '}
        full-time family living.
      </p>

      <h2 className={H2}>Av. Huayacán — the growth corridor</h2>
      <p className={P}>
        Inland, and the corridor where a lot of Cancún&rsquo;s actual residential growth has
        concentrated. Schools, hospitals, supermarkets and shopping have followed the housing, which
        is what turns a corridor into a neighbourhood.
      </p>
      <p className={P}>
        This is where entry prices are lowest — condos start around $2,595,000 MXN in our current
        portfolio. You are not buying beach proximity here; you are buying into the part of the city
        that is being built out.
      </p>
      <p className={P}>
        <strong className="text-ink font-semibold">Suits:</strong> first purchases, buyers with a
        tighter budget, and anyone who wants a property that works as a home rather than a holiday
        let.
      </p>

      <h2 className={H2}>Vía Cumbres and Lausana — planned residential</h2>
      <p className={P}>
        Two master-planned residential areas that sit between Huayacán&rsquo;s pricing and Puerto
        Cancún&rsquo;s exclusivity. Vía Cumbres is a large-scale planned community with good airport
        connectivity; Lausana is built around a golf course and a landscaped promenade, which gives
        a meaningful share of its units open green views rather than a neighbouring facade.
      </p>
      <p className={P}>
        <strong className="text-ink font-semibold">Suits:</strong> buyers who want a residential
        environment with amenities and planning, without the Puerto Cancún ticket. Browse everything
        available across the city in{' '}
        <Link href="/en/condos-for-sale-cancun" className="text-accent hover:underline">condos for sale in Cancún</Link>.
      </p>

      <h2 className={H2}>How to actually choose</h2>
      <p className={P}>
        Answer three questions honestly and the list narrows itself:
      </p>
      <ul className="space-y-3 mb-10 text-ink-2">
        {[
          ['How will you use it?', 'Living in it full-time, visiting a few weeks a year, or never setting foot in it? A property you will not visit should be chosen on rental rules and management, not on views.'],
          ['What is your real budget, all-in?', 'Purchase price plus closing costs plus the annual maintenance fee. A cheaper unit in a heavily amenitised building is not always the cheaper option over five years.'],
          ['Do you need the beach?', 'This single question separates Puerto Cancún and the Hotel Zone from everything inland — and it is worth a large price difference, so be honest about whether it matters to you.'],
        ].map(([t, d]) => (
          <li key={t} className="flex gap-3">
            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
            <span><strong className="text-ink font-semibold">{t}</strong> {d}</span>
          </li>
        ))}
      </ul>
      <p className={P}>
        If you are buying from abroad, read the{' '}
        <Link href="/en/blog/buying-property-in-mexico-as-a-foreigner" className="text-accent hover:underline">
          guide to buying as a foreigner
        </Link>{' '}
        before you shortlist — the ownership structure is the same everywhere in Cancún, but it is
        worth understanding before you place a deposit.
      </p>
      <p className="text-[13px] font-light leading-relaxed text-ink-3 mb-4">
        Prices reflect our portfolio at the time of writing and change without notice. This article
        is general information, not investment advice — no return or appreciation is implied or
        guaranteed.
      </p>
    </EnArticleShell>
  );
}
