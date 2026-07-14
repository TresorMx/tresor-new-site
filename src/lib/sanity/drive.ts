import { sanityClient } from './client';

// Las keys del drive tal como las usa src/lib/asesor/driveCards.ts. Algunos
// campos de Sanity tienen un nombre distinto a la key porque ya existe un
// campo con ese nombre en el schema (ej. 'developer' es texto/referencia,
// 'location' es el objeto de coordenadas, 'amenities' es el módulo de
// amenidades de la ficha, 'floorPlans' es el array de tipologías) — se
// traducen aquí, una sola vez.
const DRIVE_DOC_KEYS = [
  'presentation', 'priceList', 'masterPlan', 'bankAccounts', 'location',
  'marketing', 'developer', 'renders', 'receiptPay', 'receiptReserve',
  'checklist', 'offerLetter',
  'amenities', 'virtualTour', 'floorPlans', 'constructionProgress', 'quoter',
  'brochure', 'prototypes', 'individualFloorPlans', 'multimedia',
  'finishesCatalog', 'showUnit', 'videos',
] as const;

type DriveDocKey = (typeof DRIVE_DOC_KEYS)[number];

const SANITY_FIELD_OVERRIDES: Partial<Record<DriveDocKey, string>> = {
  developer: 'developerFile',
  location: 'locationFile',
  amenities: 'amenitiesFile',
  floorPlans: 'floorPlansFile',
};

function sanityFieldFor(doc: string): string | null {
  if (!DRIVE_DOC_KEYS.includes(doc as DriveDocKey)) return null;
  return SANITY_FIELD_OVERRIDES[doc as DriveDocKey] ?? doc;
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

// Para decidir qué tiles mostrar SIN pedir un archivo por tile (una sola
// consulta trae la presencia de los ~17 campos de una vez). Un campo cuenta
// como "lleno" si tiene archivo subido O liga — igual que fetchDriveFileUrl.
export async function fetchDriveAssetsPresence(devSlug: string): Promise<Record<string, boolean>> {
  const projection = DRIVE_DOC_KEYS
    .map((key) => {
      const field = sanityFieldFor(key)!;
      return `"${key}": defined(${field}.file.asset) || defined(${field}.url)`;
    })
    .join(',\n      ');

  const raw = await sanityClient.fetch(
    `*[(_type == "plaza" || _type == "development") && slug.current == $slug][0]{
      ${projection}
    }`,
    { slug: devSlug },
    { cache: 'no-store' },
  );
  return raw ?? {};
}
