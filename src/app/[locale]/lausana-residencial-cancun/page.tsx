import { getMergedDevelopmentsAsync } from '@/lib/developments';
import LandingClient from './LandingClient';

export const dynamic = 'force-dynamic';

// Landing de campaña para Olivia y Loreta Wow Condos juntos — ambos dentro de
// Lausana Residencial, mismo desarrollador (Live Desarrollos). Los precios y
// datos de cada uno se leen del catálogo fusionado en vez de escribirse aquí
// a mano, mismo criterio que portafolio-cancun y Loreta: la landing nunca
// queda desfasada si cambia el precio en Sanity.
const SLUGS = ['olivia-wow-condos', 'loreta-wow-condos'] as const;

export default async function LausanaResidencialPage() {
  const all = await getMergedDevelopmentsAsync();
  const [olivia, loreta] = SLUGS.map((slug) => all.find((d) => d.slug === slug));

  if (!olivia || !loreta) {
    throw new Error('Lausana landing: falta Olivia o Loreta en el catálogo');
  }

  return <LandingClient olivia={olivia} loreta={loreta} />;
}
