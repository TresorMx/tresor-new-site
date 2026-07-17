/**
 * Rellena seoTitle/seoDescription (ES) de los 10 `development` Sales
 * Partner en Sanity — hasta ahora vacíos, funcionaban por fallback
 * (dev.description + título generado) pero sin SEO curado a mano, a
 * diferencia del inglés (ver translate-developments-en.ts).
 *
 * Patch puntual (no createOrReplace) — solo toca estos 2 campos.
 *
 * Uso: pnpm tsx scripts/translate-developments-es-seo.ts
 */
import { createClient } from '@sanity/client';

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET ?? 'production',
  apiVersion: '2024-01-01',
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
});

const SEO_ES: Record<string, { seoTitle: string; seoDescription: string }> = {
  'blume-urban': {
    seoTitle: 'Blume — Condominios de Lujo en la Marina de Puerto Cancún',
    seoDescription:
      'Condominios de lujo de 2 y 3 recámaras en Puerto Cancún, con marina propia y amenidades únicas, en el enclave residencial más exclusivo de Cancún.',
  },
  'esther-wow-condos': {
    seoTitle: 'Esther Wow Condos — Departamentos en Vía Cumbres, Cancún',
    seoDescription:
      'Departamentos en preventa de 1, 2 y 3 recámaras en Vía Cumbres, la zona de mayor crecimiento y plusvalía de Cancún, con amenidades de primer nivel.',
  },
  'koa-onix': {
    seoTitle: 'Koa — Departamentos en Cancún, Entrega 2025',
    seoDescription:
      'Departamentos de 1, 2 y 3 recámaras con diseño exclusivo y amenidades de lujo, en la zona residencial de mayor crecimiento y proyección de Cancún.',
  },
  'loreta-wow-condos': {
    seoTitle: 'Loreta Wow Condos — Departamentos en Venta, Lausana Cancún',
    seoDescription:
      'Preventa de departamentos desde 76 m² con vistas abiertas al paseo Lausana y al campo de golf, dentro del exclusivo Lausana Residencial en Cancún.',
  },
  'olivia-wow-condos': {
    seoTitle: 'Olivia Wow Condos — Departamentos con Vistas, Cancún',
    seoDescription:
      'Preventa de departamentos desde 39 m² con vistas espectaculares al paseo Lausana y al campo de golf, en un entorno residencial de excepción en Cancún.',
  },
  'valmira-urban': {
    seoTitle: 'Valmira — Departamentos de Lujo en Gran Vía, Cancún',
    seoDescription:
      'Departamentos de lujo de 2 y 3 recámaras sobre Av. Huayacán, dentro de la exclusiva comunidad Gran Vía, en una zona de alta plusvalía de Cancún.',
  },
  'villalta-onix': {
    seoTitle: 'Villalta — Departamentos frente a la Laguna, Cancún',
    seoDescription:
      'Residencial de lujo que redefine el estándar de vida en la Zona Hotelera de Cancún: departamentos de 1, 2 y 3 recámaras con vistas increíbles al mar.',
  },
  'xaviera-wow-condos': {
    seoTitle: 'Xaviera — Condominios en Aldea Zamá, Tulum',
    seoDescription:
      'En Aldea Zamá, corazón de Tulum —el destino de mayor crecimiento de México—, Xaviera ofrece exclusivos departamentos de 1 a 3 recámaras.',
  },
  'ximena-wow-condos': {
    seoTitle: 'Ximena Wow Condos — Departamentos de Lujo, Cancún',
    seoDescription:
      'Uno de los desarrollos más exclusivos de Cancún: departamentos de lujo de 1, 2 y 3 recámaras en Vía Cumbres, con diseño y amenidades de primer nivel.',
  },
  'zienna-onix': {
    seoTitle: 'Zienna — Lotes Residenciales en Av. Huayacán, Cancún',
    seoDescription:
      'Comunidad residencial sobre Av. Huayacán con 604 lotes unifamiliares, casa club y áreas deportivas, en una de las zonas de mayor plusvalía de Cancún.',
  },
};

async function run() {
  const slugs = Object.keys(SEO_ES);
  console.log(`\nRellenando SEO en español de ${slugs.length} fichas...\n`);

  for (const slug of slugs) {
    const id = `development-${slug}`;
    await client.patch(id).set(SEO_ES[slug]).commit();
    console.log(`  ✓ ${id}`);
  }

  console.log('\nListo.\n');
}

run().catch((e) => {
  console.error('\nError:', e.message ?? e);
  process.exit(1);
});
