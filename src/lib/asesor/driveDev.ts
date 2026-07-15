import { getMergedDevelopmentsAsync, developers } from '@/lib/developments';
import { fetchDriveAssetsPresence } from '@/lib/sanity/drive';
import { STATIC_FILES } from '@/lib/asesor/driveStaticFiles';
import type { DriveDev } from '@/components/asesor/AsesorDrive';

// Armado del DriveDev de un desarrollo — usado tanto por /asesores/[slug]
// como por /brokers/drive/[slug] (mismo Drive real para ambos).

function routeSlug(href: string): string | null {
  return href.startsWith('/desarrollos/') ? href.slice('/desarrollos/'.length) : null;
}

export async function findDevBySlug(slug: string) {
  const all = await getMergedDevelopmentsAsync();
  return all.find((d) => routeSlug(d.href) === slug) ?? null;
}

export async function buildDriveDev(slug: string): Promise<DriveDev | null> {
  const dev = await findDevBySlug(slug);
  if (!dev) return null;

  let sanityAvailable: Record<string, boolean> = {};
  try {
    sanityAvailable = await fetchDriveAssetsPresence(slug);
  } catch (e) {
    console.error('[driveDev] fetchDriveAssetsPresence falló, usando solo fallback estático', e);
  }
  // Un documento cuenta como disponible si Sanity lo tiene O si es uno de
  // los pocos que ya existían como archivo estático (Long Island/Gardens,
  // de antes de que el Drive viviera en Sanity) — mismo mapa que usa
  // /api/asesor/file y /api/broker/file para no desincronizarse.
  const staticKeys = STATIC_FILES[slug] ?? {};
  const available: Record<string, boolean> = { ...sanityAvailable };
  for (const key of Object.keys(staticKeys)) available[key] = true;

  return {
    slug,
    name: dev.name,
    developerName: dev.brand ?? developers[dev.developer]?.name ?? dev.developer,
    developer: dev.developer,
    type: dev.type,
    logo: dev.logo,
    image: dev.heroRender ?? dev.image,
    heroImagePosition: dev.heroImagePosition,
    heroLogoScale: dev.heroLogoScale,
    heroLogoScaleMobile: dev.heroLogoScaleMobile,
    available,
    // Los formatos administrativos (Recibo de Pago, Apartado, etc.) solo
    // existen para Quattro (desarrollos propios de Tresor) — Sales Partner
    // no los tiene.
    showAdmin: dev.relationship === 'develop',
  };
}
