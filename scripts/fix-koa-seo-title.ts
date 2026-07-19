// Corrige el seoTitle de Koa (Onix Living): decía "Entrega 2025" en un meta
// title de producción, con la fecha ya vencida (hoy es julio 2026) — Koa está
// catalogado como "Entrega inmediata", no como una fecha futura específica.
// Uso: pnpm tsx scripts/fix-koa-seo-title.ts
import 'dotenv/config';
import { createClient } from '@sanity/client';

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET ?? 'production',
  apiVersion: '2024-01-01',
  token: process.env.SANITY_API_TOKEN!,
  useCdn: false,
});

async function main() {
  const doc = await client.fetch(
    `*[_type == "development" && slug.current == "koa-onix"][0]{ _id, seoTitle, seoTitleEn }`
  );
  if (!doc) {
    console.error('No se encontró el documento development con slug koa-onix');
    process.exit(1);
  }
  console.log('Antes:', { seoTitle: doc.seoTitle, seoTitleEn: doc.seoTitleEn });

  await client
    .patch(doc._id)
    .set({
      seoTitle: 'Koa — Departamentos con Entrega Inmediata en Zona Huayacán',
      seoTitleEn: 'Koa — Ready-to-Move-In Apartments in Huayacán Zone',
    })
    .commit();

  const after = await client.fetch(
    `*[_type == "development" && slug.current == "koa-onix"][0]{ seoTitle, seoTitleEn }`
  );
  console.log('Después:', after);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
