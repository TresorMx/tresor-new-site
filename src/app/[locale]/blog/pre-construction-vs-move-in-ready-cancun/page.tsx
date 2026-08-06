import type { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import EnArticleShell, { H2, P, LEAD, type EnFaq, type EnRelated } from '@/components/blog/EnArticleShell';

// Keyword informacional "pre construction condos cancun" / "pre construction
// vs resale mexico". Cierra el cluster: el comprador ya sabe que puede
// comprar (pilar), cuánto cuesta cerrar (costos) y dónde (zonas) — falta
// decidir en qué etapa entra.
const SLUG = 'pre-construction-vs-move-in-ready-cancun';
const URL = `https://www.tresor.mx/en/blog/${SLUG}`;
const TITLE = 'Pre-Construction vs. Move-In Ready in Cancún: Which Is Right for You?';
const DESCRIPTION =
  'Pre-construction gets you a lower price and the pick of the inventory but you wait. Move-in ready costs more and you see exactly what you buy. An honest comparison of the trade-offs, risks and payment structures.';
const HERO = '/blog/AdobeStock_841077811.jpeg';
const DATE_ISO = '2026-08-06';
const DATE_LABEL = 'August 6, 2026';

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: { absolute: `${TITLE} | Tresor Real Estate` },
    description: DESCRIPTION,
    keywords: [
      'pre construction condos cancun',
      'pre construction vs resale mexico',
      'buying pre construction in mexico',
      'move in ready condos cancun',
      'cancun pre sale property',
      'is pre construction safe in mexico',
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
    q: 'Is buying pre-construction in Mexico safe?',
    a: 'It carries a risk that a finished unit does not: you are paying against a promise to deliver. That risk is managed by who you buy from, not by the contract alone. Buy from a developer with completed projects you can physically visit in the same state, confirm the construction permits exist, and have your own attorney review the delivery obligations and what happens if the date slips.',
  },
  {
    q: 'How much cheaper is pre-construction?',
    a: 'The discount is the developer paying you to finance part of the build, so it is widest at launch and narrows as the building progresses. There is no fixed percentage — it varies by project and by how early you enter. Compare a specific pre-construction unit against a comparable finished one in the same area rather than relying on a rule of thumb.',
  },
  {
    q: 'How do payments work on pre-construction?',
    a: 'Typically a deposit to reserve, then instalments during construction, then the balance at delivery. The closing costs and deed happen at delivery, not at the start. That means your capital goes in gradually — which some buyers prefer — but you own nothing until the deed is executed.',
  },
  {
    q: 'Can I rent out a pre-construction unit before it is finished?',
    a: 'No. You take possession at delivery, so there is no income until then. If your plan depends on rental income starting immediately, a move-in ready unit is the honest answer for you.',
  },
  {
    q: 'What happens if the developer delivers late?',
    a: 'Delivery windows in pre-construction are estimates and some slippage is common in the industry. What matters is what your contract says: whether there is a grace period, what remedies you have if it is exceeded, and under what conditions you can walk away. Read that clause specifically, with your own attorney.',
  },
  {
    q: 'Can I resell before delivery?',
    a: 'Sometimes. Some developers permit assignment of the contract to another buyer, often with conditions or a fee, and others restrict it. If exiting before delivery is a scenario you want open, confirm it in writing before you sign — do not assume it.',
  },
];

const RELATED: EnRelated[] = [
  { slug: 'buying-property-in-mexico-as-a-foreigner', title: 'Can Foreigners Buy Property in Mexico? The Complete 2026 Guide', img: '/desarrollos/Blume/BLUME-Drone-1.jpg' },
  { slug: 'closing-costs-when-buying-property-in-mexico', title: 'Closing Costs When Buying Property in Mexico: What to Budget For', img: '/blog/AdobeStock_887006964.jpeg' },
  { slug: 'best-areas-to-buy-in-cancun', title: 'The Best Areas to Buy in Cancún: An Honest Comparison', img: '/desarrollos/villalta/portada3.jpg' },
];

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (locale !== 'en') redirect(`/en/blog/${SLUG}`);

  return (
    <EnArticleShell
      slug={SLUG}
      title={TITLE}
      h1="Pre-construction vs. move-in ready in Cancún"
      description={DESCRIPTION}
      eyebrow="Buyer's Guide"
      heroImage={HERO}
      heroAlt="Residential construction and finished towers in Cancún"
      dateIso={DATE_ISO}
      dateLabel={DATE_LABEL}
      readTime="7 min"
      breadcrumbLabel="Pre-construction vs. move-in ready"
      faqs={FAQS}
      related={RELATED}
      cta={{
        eyebrow: 'Tresor Real Estate',
        title: 'Want to compare both side by side?',
        subtitle: 'An advisor can show you a pre-construction unit and a finished one in the same area, with the real numbers for each.',
        image: '/desarrollos/Vellmari/ENTREGAFINAL_CADU_VELMARI_FACHADA04.jpg',
        imageAlt: 'Luxury condos in Puerto Cancún',
        primaryHref: '/en/condos-for-sale-cancun',
        primaryLabel: 'Browse condos in Cancún',
        whatsappMessage: "Hi! I'd like to compare pre-construction and move-in ready options in Cancún.",
      }}
    >
      <p className={LEAD}>
        Almost every buyer in Cancún faces this choice, and it is usually framed badly — as though
        pre-construction is the smart money and finished units are for people who did not do their
        homework. It is not that. They are two different products solving two different problems.
      </p>

      <h2 className={H2}>The trade-off in one table</h2>
      <div className="overflow-x-auto mb-10 -mx-6 px-6 md:mx-0 md:px-0">
        <table className="w-full text-sm border-collapse min-w-[620px]">
          <thead>
            <tr className="border-b border-line text-left">
              <th className="py-3 pr-6 font-semibold text-ink"></th>
              <th className="py-3 pr-6 font-semibold text-ink">Pre-construction</th>
              <th className="py-3 font-semibold text-ink">Move-in ready</th>
            </tr>
          </thead>
          <tbody className="text-ink-2">
            {[
              ['Price', 'Lower — the discount is you financing part of the build', 'Higher — you pay for certainty'],
              ['Choice of unit', 'Best floors, views and layouts still available', 'Whatever has not sold'],
              ['What you see', 'Renderings, plans and a show unit', 'The actual property'],
              ['Payment', 'Deposit, then instalments during construction', 'Full amount at closing'],
              ['Income starts', 'At delivery', 'Immediately'],
              ['Main risk', 'Delivery timing and developer execution', 'Paying more; less negotiating room'],
            ].map(([row, pre, ready]) => (
              <tr key={row} className="border-b border-line align-top">
                <td className="py-3 pr-6 font-semibold text-ink whitespace-nowrap">{row}</td>
                <td className="py-3 pr-6">{pre}</td>
                <td className="py-3">{ready}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2 className={H2}>The case for pre-construction</h2>
      <p className={P}>
        The price difference is real, and it is not a marketing gimmick — you are supplying capital
        during the build, and the discount is what you are paid for that. Entering early also means
        the inventory is intact: the corner units, the high floors and the layouts everyone wants are
        still on the table.
      </p>
      <p className={P}>
        The payment structure suits some buyers better too. Instead of one large outlay, you commit
        gradually over the construction period. If your capital is arriving over time rather than
        sitting ready today, that alone can decide it.
      </p>

      <h2 className={H2}>The case for move-in ready</h2>
      <p className={P}>
        You see exactly what you are buying. Not a rendering of the view — the view. The finish
        quality, the noise, the light at 4pm, the state of the common areas, whether the lobby feels
        like the brochure. That is worth a great deal, and it is impossible to verify in advance on a
        pre-construction unit.
      </p>
      <p className={P}>
        You also start using it immediately: living in it, or renting it. If the property is meant to
        generate income, every month of construction is a month of no return. And there is no
        delivery risk at all, because delivery already happened.
      </p>

      <h2 className={H2}>How to de-risk a pre-construction purchase</h2>
      <p className={P}>
        The risk in pre-construction is concentrated almost entirely in one variable: who you are
        buying from. Contracts matter, but a strong contract with a weak developer is a slow problem,
        not a solved one. Practical checks:
      </p>
      <ul className="space-y-3 mb-10 text-ink-2">
        {[
          ['Visit their finished buildings', 'Not the sales gallery — a project they delivered years ago. How has it aged? Talk to someone who lives there if you can.'],
          ['Confirm the permits exist', 'Construction and land-use permits should be issued, not "in process". Your attorney can verify this.'],
          ['Read the delivery clause', 'What is the committed date, what grace period applies, and what are your remedies if it is exceeded?'],
          ['Understand the deposit', 'Under what circumstances is it refundable? Get it in writing before you transfer anything.'],
          ['Check the assignment rules', 'Can you sell your contract before delivery if your plans change? Some developers allow it, some do not.'],
        ].map(([t, d]) => (
          <li key={t} className="flex gap-3">
            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
            <span><strong className="text-ink font-semibold">{t}:</strong> {d}</span>
          </li>
        ))}
      </ul>

      <h2 className={H2}>Which one is for you</h2>
      <p className={P}>
        <strong className="text-ink font-semibold">Pre-construction</strong> if you have time, you
        want the best entry price and the pick of the units, your capital is arriving over months
        rather than today, and you are comfortable doing diligence on a developer.
      </p>
      <p className={P}>
        <strong className="text-ink font-semibold">Move-in ready</strong> if you need to use or rent
        the property soon, you want to physically inspect what you are buying, or you simply do not
        want delivery timing to be one of your variables.
      </p>
      <p className={P}>
        We work with both, and our portfolio includes each. You can filter by status on{' '}
        <Link href="/en/condos-for-sale-cancun" className="text-accent hover:underline">condos for sale in Cancún</Link>{' '}
        to see what is available at each stage, and{' '}
        <Link href="/en/blog/best-areas-to-buy-in-cancun" className="text-accent hover:underline">compare the areas</Link>{' '}
        before you narrow down.
      </p>
      <p className="text-[13px] font-light leading-relaxed text-ink-3 mb-4">
        This article is general information, not legal, tax or investment advice. No return,
        appreciation or delivery outcome is implied or guaranteed. Review contracts and developer
        track records with your own attorney before committing.
      </p>
    </EnArticleShell>
  );
}
