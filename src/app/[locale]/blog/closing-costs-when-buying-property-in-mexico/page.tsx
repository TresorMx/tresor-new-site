import type { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import EnArticleShell, { H2, P, LEAD, type EnFaq, type EnRelated } from '@/components/blog/EnArticleShell';

// Keyword informacional: "closing costs mexico real estate". Complementa al
// pilar (buying-property-in-mexico-as-a-foreigner) sin competir con él.
//
// NOTA sobre las cifras: se describen los COMPONENTES del costo, que son
// estables y verificables, y los porcentajes se presentan siempre como rango
// aproximado con la instrucción explícita de pedir estimado por escrito al
// notario. No se publican cifras cerradas: varían por municipio, valor de la
// propiedad y banco, y una cifra falsamente precisa aquí se convierte en una
// expectativa incumplida en la mesa de cierre.
const SLUG = 'closing-costs-when-buying-property-in-mexico';
const URL = `https://www.tresor.mx/en/blog/${SLUG}`;
const TITLE = 'Closing Costs When Buying Property in Mexico: What to Budget For';
const DESCRIPTION =
  'Acquisition tax, notary fees, registry, appraisal and the bank trust: every line item that lands on top of the purchase price when you buy a condo in Cancún, and how to get a reliable estimate before you sign.';
const HERO = '/blog/AdobeStock_887006964.jpeg';
const DATE_ISO = '2026-08-06';
const DATE_LABEL = 'August 6, 2026';

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: { absolute: `${TITLE} | Tresor Real Estate` },
    description: DESCRIPTION,
    keywords: [
      'closing costs mexico real estate',
      'cost of buying property in mexico',
      'mexico property acquisition tax',
      'fideicomiso cost',
      'notary fees mexico property',
      'buying a condo in cancun costs',
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
    q: 'How much are closing costs in Mexico?',
    a: 'They are commonly quoted in the range of roughly 5% to 8% of the purchase price, but that is a planning figure, not a quote. The real number depends on the property value, the municipality, the notary and whether you are setting up a bank trust. Ask your notary for a written estimate once you have a specific property — they can calculate it precisely.',
  },
  {
    q: 'Who pays closing costs, the buyer or the seller?',
    a: 'In Mexico the buyer customarily pays the acquisition tax, notary fees, registry fees and the trust setup. The seller pays their own capital gains tax and, where applicable, the broker commission. This is customary practice rather than a legal requirement, so confirm what your specific contract says.',
  },
  {
    q: 'Are closing costs negotiable?',
    a: 'The taxes are not — they are set by law. Notary fees follow a published schedule but there is some variation between notaries, and you generally have the right to choose yours. Bank trust fees vary meaningfully between institutions, which is worth comparing if your purchase is large.',
  },
  {
    q: 'Do I pay closing costs on a pre-construction unit?',
    a: 'Yes, but later. With pre-construction you pay a deposit and instalments during the build, and the closing — with its taxes and fees — happens at delivery, when the deed is executed. Budget for it as a separate amount due at the end, not as part of your monthly instalments.',
  },
  {
    q: 'What is the annual property tax in Mexico?',
    a: 'The annual property tax is called predial and is generally very low by US or Canadian standards. Many municipalities offer a discount for paying early in the year. Your larger recurring cost as a condo owner is usually the building maintenance fee, not the property tax.',
  },
  {
    q: 'Is there title insurance in Mexico?',
    a: 'It exists and some US-based insurers offer it for Mexican property, but it is not part of a standard transaction the way it is in the US. The equivalent protection comes from the notary\'s title verification and registration. If title insurance matters to you, raise it early — it needs to be arranged, not assumed.',
  },
];

const RELATED: EnRelated[] = [
  { slug: 'buying-property-in-mexico-as-a-foreigner', title: 'Can Foreigners Buy Property in Mexico? The Complete 2026 Guide', img: '/desarrollos/Blume/BLUME-Drone-1.jpg' },
  { slug: 'pre-construction-vs-move-in-ready-cancun', title: 'Pre-Construction vs. Move-In Ready in Cancún: Which Is Right for You?', img: '/blog/AdobeStock_841077811.jpeg' },
  { slug: 'best-areas-to-buy-in-cancun', title: 'The Best Areas to Buy in Cancún: An Honest Comparison', img: '/desarrollos/villalta/portada3.jpg' },
];

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (locale !== 'en') redirect(`/en/blog/${SLUG}`);

  return (
    <EnArticleShell
      slug={SLUG}
      title={TITLE}
      h1="Closing costs when buying property in Mexico"
      description={DESCRIPTION}
      eyebrow="Buyer's Guide"
      heroImage={HERO}
      heroAlt="Contract signing for a property purchase in Mexico"
      dateIso={DATE_ISO}
      dateLabel={DATE_LABEL}
      readTime="7 min"
      breadcrumbLabel="Closing costs in Mexico"
      faqs={FAQS}
      related={RELATED}
      cta={{
        eyebrow: 'Tresor Real Estate',
        title: 'Want a real cost estimate?',
        subtitle: 'Tell an advisor which property you are considering and we will walk you through the full cost picture — purchase price, closing costs and recurring fees.',
        image: '/desarrollos/Vellmari/ENTREGAFINAL_CADU_VELMARI_FACHADA04.jpg',
        imageAlt: 'Luxury condos in Puerto Cancún',
        primaryHref: '/en/condos-for-sale-cancun',
        primaryLabel: 'Browse condos in Cancún',
        whatsappMessage: "Hi! I'd like an estimate of the total closing costs for a condo in Cancún.",
      }}
    >
      <p className={LEAD}>
        The purchase price is not what you pay. In Mexico, as almost everywhere, there is a layer of
        taxes and fees on top — and because the structure is unfamiliar, this is where foreign buyers
        most often get an unpleasant surprise late in the process.
      </p>
      <p className={P}>
        The good news is that the components are few and predictable. Here is what each one is, who
        pays it, and how to get a number you can actually rely on.
      </p>

      <h2 className={H2}>The short answer</h2>
      <p className={P}>
        Closing costs in Mexico are commonly quoted in the range of{' '}
        <strong className="text-ink font-semibold">roughly 5% to 8% of the purchase price</strong>.
        Treat that as a planning figure for your budget, not as a quote. The percentage moves with
        the value of the property, the municipality, the notary you use and whether you are setting
        up a bank trust — and it is proportionally higher on lower-priced properties, because several
        of the fees are closer to fixed than to percentage-based.
      </p>
      <p className={P}>
        Once you have a specific property under discussion, the notary can calculate the real figure.
        Ask for it in writing before you commit. Any advisor who cannot get you that estimate is not
        doing their job.
      </p>

      <h2 className={H2}>What you are actually paying for</h2>
      <div className="overflow-x-auto mb-10 -mx-6 px-6 md:mx-0 md:px-0">
        <table className="w-full text-sm border-collapse min-w-[560px]">
          <thead>
            <tr className="border-b border-line text-left">
              <th className="py-3 pr-6 font-semibold text-ink">Line item</th>
              <th className="py-3 font-semibold text-ink">What it is</th>
            </tr>
          </thead>
          <tbody className="text-ink-2">
            {[
              ['Acquisition tax (ISAI)', 'A municipal transfer tax on the change of ownership, calculated on the property value. This is usually the single largest line item.'],
              ['Notary fees', 'The fee for the Notario Público who executes and registers the deed. Follows a published schedule that scales with the property value.'],
              ['Public Registry', 'The cost of recording the new deed in the Public Registry of Property — the step that makes your ownership enforceable against third parties.'],
              ['Appraisal (avalúo)', 'An official valuation used to calculate the taxes. Required, and ordered through the notary.'],
              ['Certificates', 'No-lien certificate, proof that property taxes and water are paid up, and similar documents the notary must obtain.'],
              ['Bank trust setup', 'Only if you use a fideicomiso: the permit from the Ministry of Foreign Affairs plus the bank\'s one-time setup fee. The first annual administration fee is often paid at closing too.'],
              ['Your own attorney', 'Optional and strongly recommended. The notary is impartial; an attorney reviewing the contract is working for you.'],
            ].map(([item, what]) => (
              <tr key={item} className="border-b border-line align-top">
                <td className="py-3 pr-6 font-semibold text-ink whitespace-nowrap">{item}</td>
                <td className="py-3">{what}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className={P}>
        Note what is <em>not</em> on that list: there is no escrow fee and no lender origination fee
        unless you are financing. Most foreign buyers here pay cash or use the developer&rsquo;s
        payment plan, so the financing side of a US closing statement simply does not appear.
      </p>

      <h2 className={H2}>Who pays what</h2>
      <p className={P}>
        Customarily the <strong className="text-ink font-semibold">buyer</strong> pays the
        acquisition tax, notary fees, registry, appraisal, certificates and the trust setup. The{' '}
        <strong className="text-ink font-semibold">seller</strong> pays their own capital gains tax
        (ISR) and, where there is one, the broker commission.
      </p>
      <p className={P}>
        This split is custom, not law, so it can be negotiated and it should be spelled out in your
        purchase agreement. Read that clause specifically — it is a common place for ambiguity.
      </p>

      <h2 className={H2}>The costs that come after closing</h2>
      <p className={P}>
        Closing costs are one-time. What matters more to your long-run budget are the recurring ones,
        and buyers routinely underestimate the second item here:
      </p>
      <ul className="space-y-3 mb-10 text-ink-2">
        {[
          ['Property tax (predial)', 'Annual, and low by US and Canadian standards. Many municipalities discount it if you pay in the first months of the year.'],
          ['Maintenance fee', 'Set by the condo association and driven by the amenity package. A tower with a marina, spa, concierge and multiple pools costs materially more to run than a simple building. Ask for the current fee per square metre before you buy, not the projected one.'],
          ['Bank trust annual fee', 'If you hold through a fideicomiso, the bank charges an annual administration fee for the life of the trust.'],
          ['Income tax on rental income', 'If you rent the property out, that income is taxable in Mexico. You will need an RFC and, in practice, a local accountant.'],
        ].map(([t, d]) => (
          <li key={t} className="flex gap-3">
            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
            <span><strong className="text-ink font-semibold">{t}:</strong> {d}</span>
          </li>
        ))}
      </ul>

      <h2 className={H2}>How to avoid the surprise</h2>
      <p className={P}>
        Three things, all of them free:
      </p>
      <ul className="space-y-3 mb-10 text-ink-2">
        {[
          ['Ask for the estimate in writing, early', 'Before you place a deposit, not after. If the property is pre-construction, ask what the estimate will be at delivery.'],
          ['Ask what is included in the price', 'Kitchen, closets, air conditioning and parking are sometimes priced separately. That gap can be larger than the closing costs.'],
          ['Ask for the current maintenance fee', 'The number the building charges today, from a real invoice — not the developer\'s projection.'],
        ].map(([t, d]) => (
          <li key={t} className="flex gap-3">
            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
            <span><strong className="text-ink font-semibold">{t}:</strong> {d}</span>
          </li>
        ))}
      </ul>
      <p className={P}>
        If you have not read it yet, the{' '}
        <Link href="/en/blog/buying-property-in-mexico-as-a-foreigner" className="text-accent hover:underline">
          guide to buying as a foreigner
        </Link>{' '}
        covers the legal structure these costs attach to. To see what is available now, browse{' '}
        <Link href="/en/condos-for-sale-cancun" className="text-accent hover:underline">condos for sale in Cancún</Link>{' '}
        or{' '}
        <Link href="/en/condos-for-sale-playa-del-carmen" className="text-accent hover:underline">condos for sale in Playa del Carmen</Link>{' '}
        — and remember these percentages apply to the purchase price, so a lower entry point in Playa
        also means a smaller closing bill.
      </p>
      <p className="text-[13px] font-light leading-relaxed text-ink-3 mb-4">
        This article is general information, not legal, tax or financial advice. Rates, fees and
        customary practice change and vary by municipality and by transaction. Always obtain a
        written estimate from a licensed Mexican notary and review your situation with your own
        attorney and accountant.
      </p>
    </EnArticleShell>
  );
}
