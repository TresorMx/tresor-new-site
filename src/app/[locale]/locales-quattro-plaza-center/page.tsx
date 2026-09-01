import { getMergedDevelopmentsAsync } from '@/lib/developments';
import LandingClient from './LandingClient';

export const dynamic = 'force-dynamic';

// Landing de campaña para Quattro Plaza Center — Quattro Gardens y Quattro
// Long Island juntos, las dos plazas comerciales propias (Tresor), mismo
// desarrollador, misma zona (Av. Huayacán). Antes Quattro Plaza Center no
// tenía NINGUNA landing de campaña — solo la página de desarrollador
// (/quattro-plaza-center, indexable) y el Drive privado de asesores.
//
// Precio y datos de cada plaza se leen del catálogo fusionado, no se
// escriben aquí a mano — mismo criterio que Lausana (Olivia+Loreta) y
// Portafolio: la landing nunca queda desfasada si cambia el precio en
// Sanity o en developments.ts.
const SLUGS = ['quattro-gardens', 'quattro-long-island'] as const;

export default async function QuattroPlazaCenterLandingPage() {
  const all = await getMergedDevelopmentsAsync();
  const [gardens, longIsland] = SLUGS.map((slug) => all.find((d) => d.slug === slug));

  if (!gardens || !longIsland) {
    throw new Error('Quattro Plaza Center landing: falta Gardens o Long Island en el catálogo');
  }

  return <LandingClient gardens={gardens} longIsland={longIsland} />;
}
