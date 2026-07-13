import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import AsesorDrive, { type DriveDev } from '@/components/asesor/AsesorDrive';
import { getMergedDevelopmentsAsync, developers } from '@/lib/developments';
import { fetchDriveAssetsPresence } from '@/lib/sanity/drive';
import { STATIC_FILES } from '@/lib/asesor/driveStaticFiles';

function routeSlug(href: string): string | null {
  return href.startsWith('/desarrollos/') ? href.slice('/desarrollos/'.length) : null;
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const all = await getMergedDevelopmentsAsync();
  const dev = all.find((d) => routeSlug(d.href) === slug);
  return {
    title: dev ? `Drive de Ventas · ${dev.name}` : 'Drive de Ventas · Asesores',
    robots: { index: false, follow: false },
  };
}

export default async function AsesorDrivePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const all = await getMergedDevelopmentsAsync();
  const dev = all.find((d) => routeSlug(d.href) === slug);
  if (!dev) notFound();

  let sanityAvailable: Record<string, boolean> = {};
  try {
    sanityAvailable = await fetchDriveAssetsPresence(slug);
  } catch (e) {
    console.error('[asesores/[slug]] fetchDriveAssetsPresence falló, usando solo fallback estático', e);
  }
  // Un documento cuenta como disponible si Sanity lo tiene O si es uno de
  // los pocos que ya existían como archivo estático (Long Island/Gardens,
  // de antes de que el Drive viviera en Sanity) — mismo mapa que usa
  // /api/asesor/file para no desincronizarse.
  const staticKeys = STATIC_FILES[slug] ?? {};
  const available: Record<string, boolean> = { ...sanityAvailable };
  for (const key of Object.keys(staticKeys)) available[key] = true;

  const driveDev: DriveDev = {
    slug,
    name: dev.name,
    developerName: dev.brand ?? developers[dev.developer]?.name ?? dev.developer,
    developer: dev.developer,
    type: dev.type,
    logo: dev.logo,
    image: dev.heroRender ?? dev.image,
    // Mismo encuadre/escala que la ficha pública — el Drive usa la misma
    // foto y el mismo logo, no tiene sentido que se vean distinto.
    heroImagePosition: dev.heroImagePosition,
    heroLogoScale: dev.heroLogoScale,
    heroLogoScaleMobile: dev.heroLogoScaleMobile,
    available,
    // Los formatos administrativos (Recibo de Pago, Apartado, etc.) solo
    // existen para Quattro (desarrollos propios de Tresor) — Sales Partner
    // no los tiene.
    showAdmin: dev.relationship === 'develop',
  };

  return <AsesorDrive dev={driveDev} />;
}
