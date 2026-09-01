import { getMergedDevelopmentsAsync } from '@/lib/developments';
import LandingClient from './LandingClient';

export const dynamic = 'force-dynamic';

// Landing de campaña para Quattro Plaza Center — Quattro Gardens y Quattro
// Long Island juntos, las dos plazas comerciales propias (Tresor), mismo
// desarrollador. Antes Quattro Plaza Center no tenía NINGUNA landing de
// campaña — solo la página de desarrollador (/quattro-plaza-center,
// indexable) y el Drive privado de asesores.
//
// Precio y datos de cada plaza se leen del catálogo fusionado, no se
// escriben aquí a mano — mismo criterio que Lausana (Olivia+Loreta) y
// Portafolio: la landing nunca queda desfasada si cambia el precio en
// Sanity o en developments.ts.
//
// OJO — dato de ubicación descartado a propósito: el catálogo trae
// `zone: 'Av. Huayacán'` para ambos, pero el usuario confirmó que esa NO es
// la ubicación real de Gardens/Long Island. Toda la landing (hero, cifras,
// cards) usa copy genérico ("mejores ubicaciones de Cancún") en vez de ese
// campo. El campo `zone` en developments.ts sigue sin corregir — afecta
// también a Zienna, Bardenna y Valmira, que comparten el mismo valor; sin
// confirmar cuál de los 6 está mal, no se tocó el catálogo compartido.
const SLUGS = ['quattro-gardens', 'quattro-long-island'] as const;

export default async function QuattroPlazaCenterLandingPage() {
  const all = await getMergedDevelopmentsAsync();
  const [gardens, longIsland] = SLUGS.map((slug) => all.find((d) => d.slug === slug));

  if (!gardens || !longIsland) {
    throw new Error('Quattro Plaza Center landing: falta Gardens o Long Island en el catálogo');
  }

  return <LandingClient gardens={gardens} longIsland={longIsland} />;
}
