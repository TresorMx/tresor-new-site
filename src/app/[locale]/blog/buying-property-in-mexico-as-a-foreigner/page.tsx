import type { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import EnArticleShell, { H2, P, LEAD, type EnFaq, type EnRelated } from '@/components/blog/EnArticleShell';

// Artículo pilar en inglés. Estrategia de keywords (sin canibalizar las
// páginas transaccionales):
//   /en/condos-for-sale-cancun ..... "condos for sale cancun"        (catálogo)
//   ESTE POST ...................... "can foreigners buy property in mexico",
//                                     "fideicomiso"                  (informacional)
// Es la objeción #1 del comprador de EE.UU./Canadá: si no la resolvemos aquí,
// se va a buscarla a otro sitio y ahí lo capta la competencia.
//
// Solo existe en inglés: la ruta sin prefijo redirige a /en/ (mismo criterio
// que /condos-for-sale-*).
const SLUG = 'buying-property-in-mexico-as-a-foreigner';
const URL = `https://www.tresor.mx/en/blog/${SLUG}`;
const TITLE = 'Can Foreigners Buy Property in Mexico? The Complete 2026 Guide';
const DESCRIPTION =
  'Yes — and here is exactly how. The restricted zone, the fideicomiso bank trust, what a Mexican notary actually does, and the step-by-step process for buying a condo in Cancún as a US or Canadian buyer.';
const HERO = '/desarrollos/Blume/BLUME-Drone-1.jpg';
const DATE_ISO = '2026-08-06';
const DATE_LABEL = 'August 6, 2026';

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: { absolute: `${TITLE} | Tresor Real Estate` },
    description: DESCRIPTION,
    keywords: [
      'can foreigners buy property in mexico',
      'buying property in mexico as a foreigner',
      'fideicomiso mexico',
      'mexico restricted zone property',
      'buy condo in cancun as american',
      'foreign ownership mexico real estate',
      'notario publico mexico property',
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
    q: 'Can a foreigner legally own property in Mexico?',
    a: 'Yes. Foreigners can own property anywhere in Mexico. The only difference is how title is held: within the restricted zone — 50 km from any coastline and 100 km from any border — foreign buyers hold residential property through a bank trust (fideicomiso) or through a Mexican corporation, rather than directly in their own name.',
  },
  {
    q: 'Do I lose my property after 50 years with a fideicomiso?',
    a: 'No. The trust has a 50-year term and is renewable, and the renewal is a routine administrative step, not a re-approval of your ownership. Throughout the term you are the beneficiary: you can live in the property, remodel it, rent it out, sell it or leave it to your heirs.',
  },
  {
    q: 'Is a fideicomiso the same as leasing?',
    a: 'No, and this is the most common misunderstanding. A lease gives you the right to use someone else\'s property for a period. A fideicomiso holds title to a property you bought, with you as the sole beneficiary. The bank cannot sell it, mortgage it or use it — it acts as trustee, following your instructions.',
  },
  {
    q: 'Should I buy through a Mexican corporation instead?',
    a: 'It depends on what you are buying and why. A Mexican corporation can hold restricted-zone property directly and is often used for commercial property or for buyers acquiring several units. It also brings ongoing accounting and tax filing obligations that a fideicomiso does not. For a single residence, most foreign buyers use the trust — but confirm the right structure with your own attorney and accountant.',
  },
  {
    q: 'What does the notary do, and do I still need my own lawyer?',
    a: 'In Mexico the Notario Público is a state-appointed attorney who executes the closing: verifies title, confirms there are no liens, calculates and withholds taxes and registers the deed. The notary is impartial — they represent the transaction, not you. Many foreign buyers also retain their own attorney to review the contract on their behalf, which we recommend.',
  },
  {
    q: 'Do I need to be a resident or have a visa to buy?',
    a: 'No. You do not need residency, a visa or a Mexican bank account to purchase. You will need your passport and, if you plan to earn rental income in Mexico, you will need to register with the tax authority (SAT) and obtain an RFC.',
  },
  {
    q: 'Can I complete the purchase without travelling to Mexico?',
    a: 'Yes. A purchase can be executed through a power of attorney granted to a representative in Mexico, and tours can be done by video call. Most buyers still choose to visit before closing, but it is not a legal requirement.',
  },
];

const RELATED: EnRelated[] = [
  { slug: 'closing-costs-when-buying-property-in-mexico', title: 'Closing Costs When Buying Property in Mexico: What to Budget For', img: '/blog/AdobeStock_887006964.jpeg' },
  { slug: 'best-areas-to-buy-in-cancun', title: 'The Best Areas to Buy in Cancún: An Honest Comparison', img: '/desarrollos/villalta/portada3.jpg' },
  { slug: 'pre-construction-vs-move-in-ready-cancun', title: 'Pre-Construction vs. Move-In Ready in Cancún: Which Is Right for You?', img: '/blog/AdobeStock_841077811.jpeg' },
];

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (locale !== 'en') redirect(`/en/blog/${SLUG}`);

  return (
    <EnArticleShell
      slug={SLUG}
      title={TITLE}
      h1="Can foreigners buy property in Mexico?"
      description={DESCRIPTION}
      eyebrow="Buyer's Guide"
      heroImage={HERO}
      heroAlt="Aerial view of Puerto Cancún, Mexico — residential towers, the marina and the Caribbean Sea"
      dateIso={DATE_ISO}
      dateLabel={DATE_LABEL}
      readTime="9 min"
      breadcrumbLabel="Buying property as a foreigner"
      faqs={FAQS}
      related={RELATED}
      cta={{
        eyebrow: 'Tresor Real Estate',
        title: 'Thinking about buying in Cancún?',
        subtitle: 'An English-speaking advisor will walk you through live availability, pricing and the full purchase process — no obligation.',
        image: '/desarrollos/Vellmari/ENTREGAFINAL_CADU_VELMARI_FACHADA04.jpg',
        imageAlt: 'Luxury condos in Puerto Cancún',
        primaryHref: '/en/condos-for-sale-cancun',
        primaryLabel: 'Browse condos in Cancún',
        whatsappMessage: "Hi! I'm interested in buying a condo in Cancún and I have questions about the process.",
      }}
    >
      <p className={LEAD}>
        The short answer is yes. Foreigners can and do own property throughout Mexico, including on
        the beach. The confusion comes from a rule that gets repeated badly on the internet: that
        foreigners &ldquo;can&rsquo;t own near the coast.&rdquo; That is not what the law says. What
        the law says is that near the coast, you hold title <em>differently</em>.
      </p>
      <p className={P}>
        Cancún sits inside that area, so if you are buying here this applies to you. Below is what
        the structure actually is, what it costs you in practice, and how a Mexican closing differs
        from one in the US or Canada.
      </p>

      <h2 className={H2}>The restricted zone, explained</h2>
      <p className={P}>
        The Mexican Constitution reserves direct foreign ownership of land within a defined band:{' '}
        <strong className="text-ink font-semibold">50 kilometres from any coastline</strong> and{' '}
        <strong className="text-ink font-semibold">100 kilometres from any border</strong>. This is
        the &ldquo;restricted zone&rdquo; (<em>zona restringida</em>), and it dates back to a time
        when coastal land was treated as a national security matter.
      </p>
      <p className={P}>
        Since the Foreign Investment Law of 1993, the practical effect is narrow: it does not stop
        you from buying, it determines the vehicle you use to hold title. Outside the restricted
        zone — inland cities like Mérida or Guadalajara — a foreigner can take title directly. Inside
        it, which includes all of Cancún, the Riviera Maya and Tulum, you use one of two routes.
      </p>

      <h2 className={H2}>Route 1: the fideicomiso (bank trust)</h2>
      <p className={P}>
        This is what the large majority of foreign buyers of a home or condo use. A Mexican bank
        holds title as trustee, and you are named the beneficiary. In practice you have the rights
        you would expect from ownership:
      </p>
      <ul className="space-y-3 mb-10 text-ink-2">
        {[
          ['Use it however you want', 'Live in it full-time, use it seasonally, or leave it empty.'],
          ['Rent it out', 'Long-term or short-term, subject to the building\'s own rules and to registering for tax purposes.'],
          ['Renovate and improve it', 'You do not need the bank\'s permission to remodel.'],
          ['Sell it', 'You instruct the bank to transfer to your buyer, or you assign your beneficiary rights.'],
          ['Leave it to your heirs', 'You name substitute beneficiaries in the trust, which avoids Mexican probate on your death.'],
        ].map(([t, d]) => (
          <li key={t} className="flex gap-3">
            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
            <span><strong className="text-ink font-semibold">{t}:</strong> {d}</span>
          </li>
        ))}
      </ul>
      <p className={P}>
        The trust runs for <strong className="text-ink font-semibold">50 years and is renewable</strong>.
        This is where most of the online panic comes from — people read &ldquo;50 years&rdquo; and
        assume the property reverts to the bank. It does not. Renewal is an administrative filing,
        and the trust can also be transferred to a buyer when you sell.
      </p>
      <p className={P}>
        The bank charges a one-time setup fee and an annual administration fee. Both vary by bank
        and by property value, so ask for the specific numbers from the institution your notary
        proposes rather than relying on a figure you read somewhere.
      </p>

      <h2 className={H2}>Route 2: a Mexican corporation</h2>
      <p className={P}>
        A Mexican corporation can hold restricted-zone property directly, with no trust involved.
        Foreigners are permitted to own such a company outright. This route is common when the
        property is commercial, or when a buyer is acquiring several units and the per-property
        trust fees start to add up.
      </p>
      <p className={P}>
        The trade-off is that a corporation is a live entity: it has monthly and annual accounting
        obligations, tax filings and a legal representative, whether or not it generates income. For
        a single residence most buyers find the trust simpler and cheaper overall. Which one fits
        your case is a question for your accountant, not for a blog post.
      </p>

      <h2 className={H2}>What the notary actually does</h2>
      <p className={P}>
        This is the piece that surprises US and Canadian buyers most. In Mexico there is no escrow
        company and no title insurance in the way you are used to. The{' '}
        <strong className="text-ink font-semibold">Notario Público</strong> is a state-appointed
        attorney with public authority, and the closing runs through them.
      </p>
      <p className={P}>The notary verifies that the seller holds clear title, confirms there are no liens or unpaid
        property taxes, calculates and withholds the taxes due, drafts the deed, and registers it in
        the Public Registry of Property. Their signature is what makes the transfer legally effective.
      </p>
      <p className={P}>
        One important nuance: <strong className="text-ink font-semibold">the notary is impartial</strong>.
        They are responsible to the transaction and to the state, not to you. They will not
        negotiate on your behalf or flag that a clause is bad for you. That is why we recommend
        retaining your own attorney to review the purchase agreement before you sign — a modest cost
        relative to the purchase, and the single best protection you can buy.
      </p>

      <h2 className={H2}>The process, step by step</h2>
      <div className="overflow-x-auto mb-10 -mx-6 px-6 md:mx-0 md:px-0">
        <table className="w-full text-sm border-collapse min-w-[520px]">
          <tbody className="text-ink-2">
            {[
              ['1. Choose the property', 'Confirm live availability, floor plan, delivery date and payment schedule directly with the developer.'],
              ['2. Reserve it', 'A deposit takes the unit off the market. Get in writing what happens to that deposit if the deal does not proceed.'],
              ['3. Purchase agreement', 'Signed with the developer or seller. This is the document your own attorney should review.'],
              ['4. Set up the structure', 'The bank trust is requested and permitted, or the corporation is formed. This runs in parallel with the rest.'],
              ['5. Due diligence', 'The notary confirms title, liens and taxes. For pre-construction, also confirm the permits and the developer\'s delivery record.'],
              ['6. Closing', 'You sign before the notary — in person or through a power of attorney — pay the balance and closing costs, and the deed is registered.'],
            ].map(([step, detail]) => (
              <tr key={step} className="border-b border-line align-top">
                <td className="py-3 pr-6 font-semibold text-ink whitespace-nowrap">{step}</td>
                <td className="py-3">{detail}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className={P}>
        For a finished unit the whole sequence typically runs a matter of weeks once the paperwork
        is moving. For pre-construction, the closing happens at delivery, and you pay in
        instalments until then — which is a different financial profile entirely. We compare the two
        in{' '}
        <Link href="/en/blog/pre-construction-vs-move-in-ready-cancun" className="text-accent hover:underline">
          pre-construction vs. move-in ready
        </Link>.
      </p>

      <h2 className={H2}>What to check before you sign</h2>
      <ul className="space-y-3 mb-10 text-ink-2">
        {[
          ['Who is the developer, and what have they delivered?', 'Ask for finished projects you can visit, not renderings. A developer with a delivery record in Quintana Roo is a different risk profile from a first-time one.'],
          ['What exactly is included?', 'Kitchen, closets, air conditioning and parking are sometimes extras. Get the finish schedule in writing.'],
          ['What are the maintenance fees?', 'They vary enormously with the amenity package. A building with a marina, spa and concierge costs more to run than one without.'],
          ['Does the building allow short-term rental?', 'This is set by the condo regime, not by the city. If rental income is your plan, confirm it before you commit.'],
          ['What is the total closing cost estimate?', 'Ask in writing, in advance. We break the components down in the next article.'],
        ].map(([t, d]) => (
          <li key={t} className="flex gap-3">
            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
            <span><strong className="text-ink font-semibold">{t}</strong> {d}</span>
          </li>
        ))}
      </ul>

      <h2 className={H2}>The bottom line</h2>
      <p className={P}>
        Buying in Mexico as a foreigner is not risky because it is foreign — it is risky the same way
        buying anywhere is risky if you skip the diligence. The legal framework for foreign ownership
        has been stable for decades and is used by hundreds of thousands of people. The parts that
        deserve your attention are the ordinary ones: who is selling to you, what is actually
        included, and what the total cost is once the closing is done.
      </p>
      <p className={P}>
        If you want to see what is currently available, start with{' '}
        <Link href="/en/condos-for-sale-cancun" className="text-accent hover:underline">condos for sale in Cancún</Link>{' '}
        or the{' '}
        <Link href="/en/condos-for-sale-puerto-cancun" className="text-accent hover:underline">marina community in Puerto Cancún</Link>.
      </p>
      <p className="text-[13px] font-light leading-relaxed text-ink-3 mb-4">
        This article is general information, not legal or tax advice. Laws and fees change, and every
        purchase is different — review your specific situation with a licensed Mexican notary and
        your own attorney and accountant before signing anything.
      </p>
    </EnArticleShell>
  );
}
