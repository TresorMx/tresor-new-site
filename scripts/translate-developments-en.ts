/**
 * Rellena los campos EN faltantes de los 10 `development` en Sanity
 * (seoTitleEn, seoDescriptionEn, taglineEn, projectTitleEn,
 * projectTitleMutedEn, highlights[0].valueEn — todos vacíos hasta ahora,
 * causando que /en cayera de vuelta al español en fichas).
 *
 * Patch puntual (no createOrReplace) — solo toca estos campos, nada más.
 *
 * Uso: pnpm tsx scripts/translate-developments-en.ts
 */
import { createClient } from '@sanity/client';

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET ?? 'production',
  apiVersion: '2024-01-01',
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
});

interface Translation {
  slug: string;
  taglineEn: string;
  seoTitleEn: string;
  seoDescriptionEn: string;
  projectTitleEn?: string;
  projectTitleMutedEn?: string;
  highlight0ValueEn?: string;
}

const TRANSLATIONS: Translation[] = [
  {
    slug: 'blume-urban',
    taglineEn: "A place where luxury blends with Cancún's natural beauty",
    seoTitleEn: 'Blume — Luxury Condos in Puerto Cancún Marina',
    seoDescriptionEn:
      "Luxury 2 and 3-bedroom condos in Puerto Cancún with a private marina and unique amenities, in Cancún's most exclusive residential enclave.",
  },
  {
    slug: 'esther-wow-condos',
    taglineEn: 'Live on Huayacán Avenue, inside Vía Cumbres',
    seoTitleEn: 'Esther Wow Condos — Apartments in Vía Cumbres, Cancún',
    seoDescriptionEn:
      "Pre-sale 1, 2, and 3-bedroom apartments in Vía Cumbres, Cancún's fastest-growing and highest-value area, with top-tier amenities.",
    projectTitleEn: '1 to 3-bedroom apartments',
    projectTitleMutedEn: 'in Vía Cumbres',
    highlight0ValueEn: 'Vía Cumbres',
  },
  {
    slug: 'koa-onix',
    taglineEn: '1, 2, and 3-bedroom apartments with exclusive amenities',
    seoTitleEn: 'Koa — Apartments in Cancún, Delivery 2025',
    seoDescriptionEn:
      "1, 2, and 3-bedroom apartments with exclusive design and luxury amenities, in Cancún's fastest-growing and most promising residential area.",
    highlight0ValueEn: 'Huayacán Area',
  },
  {
    slug: 'loreta-wow-condos',
    taglineEn: "Live inside Cancún's first Smart City",
    seoTitleEn: 'Loreta Wow Condos — Apartments in Lausana, Cancún',
    seoDescriptionEn:
      'Pre-sale apartments from 76 sqm with open views of Paseo Lausana and the golf course, inside the exclusive Lausana Residencial in Cancún.',
    projectTitleEn: '1 to 3-bedroom apartments',
    projectTitleMutedEn: 'and Garden Houses in Lausana Residencial',
    highlight0ValueEn: 'Lausana Residencial',
  },
  {
    slug: 'olivia-wow-condos',
    taglineEn: 'Live facing Paseo Lausana and the golf course',
    seoTitleEn: 'Olivia Wow Condos — Apartments with Stunning Views',
    seoDescriptionEn:
      'Pre-sale apartments from 39 sqm with spectacular views of Paseo Lausana and the golf course, in an exceptional residential setting in Cancún.',
    projectTitleEn: 'Apartments with stunning views',
    projectTitleMutedEn: 'in Cancún',
    highlight0ValueEn: 'Lausana Residencial',
  },
  {
    slug: 'valmira-urban',
    taglineEn: 'Ready-to-move-in apartments in Gran Vía',
    seoTitleEn: 'Valmira — Luxury Apartments in Gran Vía, Cancún',
    seoDescriptionEn:
      'Luxury 2 and 3-bedroom apartments on Av. Huayacán, inside the exclusive Gran Vía community, in a high-value area of Cancún.',
    projectTitleEn: '2 and 3-bedroom apartments',
    projectTitleMutedEn: 'ready to move into in Gran Vía',
    highlight0ValueEn: 'Av. Huayacán',
  },
  {
    slug: 'villalta-onix',
    taglineEn: 'An oasis of calm on the lagoon, in the heart of the Hotel Zone',
    seoTitleEn: 'Villalta — Apartments on the Lagoon, Cancún',
    seoDescriptionEn:
      "A luxury residence redefining Cancún's Hotel Zone lifestyle: 1, 2, and 3-bedroom apartments with incredible ocean views.",
    projectTitleEn: 'Discover Villalta Laguna',
    projectTitleMutedEn: 'elegance and exclusivity on the lagoon',
    highlight0ValueEn: 'Hotel Zone',
  },
  {
    slug: 'xaviera-wow-condos',
    taglineEn: 'Only 20 exclusive condos in Aldea Premium, Tulum',
    seoTitleEn: 'Xaviera — Condos in Aldea Zamá, Tulum',
    seoDescriptionEn:
      "In Aldea Zamá, the heart of Tulum — Mexico's fastest-growing destination — Xaviera offers exclusive 1 to 3-bedroom apartments.",
    projectTitleEn: 'Only 20 condominiums',
    projectTitleMutedEn: 'in the heart of Tulum',
    highlight0ValueEn: 'Aldea Premium, Tulum',
  },
  {
    slug: 'ximena-wow-condos',
    taglineEn: 'Contemporary design inside Vía Cumbres',
    seoTitleEn: 'Ximena Wow Condos — Luxury Apartments, Cancún',
    seoDescriptionEn:
      "One of Cancún's most exclusive developments: luxury 1, 2, and 3-bedroom apartments in Vía Cumbres, with top-tier design and amenities.",
    projectTitleEn: '1 to 3-bedroom apartments',
    projectTitleMutedEn: 'and Garden Houses in Vía Cumbres',
    highlight0ValueEn: 'Vía Cumbres',
  },
  {
    slug: 'zienna-onix',
    taglineEn: 'The best location with strategic connectivity',
    seoTitleEn: 'Zienna — Residential Lots on Av. Huayacán, Cancún',
    seoDescriptionEn:
      "Residential community on Av. Huayacán with 604 single-family lots, clubhouse, and sports areas, in one of Cancún's highest-value areas.",
    highlight0ValueEn: 'Av. Huayacán',
  },
];

async function run() {
  console.log(`\nTraduciendo ${TRANSLATIONS.length} fichas...\n`);

  for (const t of TRANSLATIONS) {
    const id = `development-${t.slug}`;
    const patch = client.patch(id);
    const setFields: Record<string, unknown> = {
      taglineEn: t.taglineEn,
      seoTitleEn: t.seoTitleEn,
      seoDescriptionEn: t.seoDescriptionEn,
    };
    if (t.projectTitleEn) setFields.projectTitleEn = t.projectTitleEn;
    if (t.projectTitleMutedEn) setFields.projectTitleMutedEn = t.projectTitleMutedEn;
    if (t.highlight0ValueEn) setFields['highlights[_key=="h0"].valueEn'] = t.highlight0ValueEn;

    patch.set(setFields);
    await patch.commit();
    console.log(`  ✓ ${id}`);
  }

  console.log('\nListo.\n');
}

run().catch((e) => {
  console.error('\nError:', e.message ?? e);
  process.exit(1);
});
