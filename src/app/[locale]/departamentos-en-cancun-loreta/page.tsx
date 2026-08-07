import { getMergedDevelopmentsAsync } from '@/lib/developments';
import LandingClient from './LandingClient';

// Server component a propósito: `getMergedDevelopmentsAsync` trae el
// catálogo completo (Sanity + estático); la landing solo necesita a Loreta.
// Se lee el desarrollo COMPLETO (no solo floorPlans, como en Vellmari) para
// pasar precio, highlights, amenidades, galería y ubicación reales — así la
// landing nunca puede desincronizarse del catálogo. Ese fue justo el bug que
// se encontró y corrigió en las landings de Vellmari: precio hardcodeado
// ($14.8M) que quedó desfasado del real en Sanity ($15.289M).
export default async function LoretaLandingPage() {
  const all = await getMergedDevelopmentsAsync();
  const dev = all.find((d) => d.slug === 'loreta-wow-condos');
  if (!dev) return null;
  return <LandingClient dev={dev} />;
}
