import { sanityClient } from './client';

// Las 12 keys del drive tal como las usa src/lib/asesor/driveCards.ts. Los
// campos de Sanity para 'developer' y 'location' se llaman 'developerFile' y
// 'locationFile' (evitan chocar con los campos 'developer' y 'location' que
// ya existen como texto/objeto en ambos schemas) — se traducen aquí, una
// sola vez.
const DRIVE_DOC_KEYS = [
  'presentation', 'priceList', 'masterPlan', 'bankAccounts', 'location',
  'marketing', 'developer', 'renders', 'receiptPay', 'receiptReserve',
  'checklist', 'offerLetter',
] as const;

const SANITY_FIELD_OVERRIDES: Partial<Record<(typeof DRIVE_DOC_KEYS)[number], string>> = {
  developer: 'developerFile',
  location: 'locationFile',
};

function sanityFieldFor(doc: string): string | null {
  if (!DRIVE_DOC_KEYS.includes(doc as (typeof DRIVE_DOC_KEYS)[number])) return null;
  return SANITY_FIELD_OVERRIDES[doc as (typeof DRIVE_DOC_KEYS)[number]] ?? doc;
}

// Busca el archivo/liga en Sanity (plaza o development, comparten slug con
// la ficha pública) para un desarrollo + documento del drive. Cada campo es
// tipo `driveAsset` (ver sanity/schemas/driveAsset.ts): el editor sube UN
// archivo O pega UNA liga, nunca ambos — aquí se resuelve cuál de los dos
// está lleno (la liga gana si por error se llenaron ambos, ya que es la más
// barata de detectar). `null` si el editor no ha llenado nada todavía — el
// caller decide el fallback.
export async function fetchDriveFileUrl(devSlug: string, doc: string): Promise<string | null> {
  const field = sanityFieldFor(doc);
  if (!field) return null;

  const raw = await sanityClient.fetch(
    `*[(_type == "plaza" || _type == "development") && slug.current == $slug][0]{
      "fileUrl": ${field}.file.asset->url,
      "url": ${field}.url
    }`,
    { slug: devSlug },
    { cache: 'no-store' },
  );
  return raw?.url || raw?.fileUrl || null;
}
