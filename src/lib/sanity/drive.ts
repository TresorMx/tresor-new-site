import { sanityClient } from './client';

// Las 12 keys del drive tal como las usa src/lib/asesor/driveCards.ts. El
// campo de Sanity para 'developer' se llama 'developerFile' (evita chocar
// con el campo 'developer' que ya existe como texto/referencia en ambos
// schemas) — se traduce aquí, una sola vez.
const DRIVE_DOC_KEYS = [
  'presentation', 'priceList', 'masterPlan', 'bankAccounts', 'location',
  'marketing', 'developer', 'renders', 'receiptPay', 'receiptReserve',
  'checklist', 'offerLetter',
] as const;

function sanityFieldFor(doc: string): string | null {
  if (!DRIVE_DOC_KEYS.includes(doc as (typeof DRIVE_DOC_KEYS)[number])) return null;
  return doc === 'developer' ? 'developerFile' : doc;
}

// Busca el archivo en Sanity (plaza o development, comparten slug con la
// ficha pública) para un desarrollo + documento del drive. `null` si el
// campo no existe o el editor no ha subido nada ahí todavía — el caller
// decide el fallback.
export async function fetchDriveFileUrl(devSlug: string, doc: string): Promise<string | null> {
  const field = sanityFieldFor(doc);
  if (!field) return null;

  const raw = await sanityClient.fetch(
    `*[(_type == "plaza" || _type == "development") && slug.current == $slug][0]{
      "url": ${field}.asset->url
    }`,
    { slug: devSlug },
    { cache: 'no-store' },
  );
  return raw?.url ?? null;
}
