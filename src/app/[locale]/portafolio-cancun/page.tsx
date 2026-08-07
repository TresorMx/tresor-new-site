import { getMergedDevelopmentsAsync } from '@/lib/developments';
import LandingClient from './LandingClient';

export const dynamic = 'force-dynamic';

// Los 6 desarrollos de la campaña, en el orden de la pieza gráfica: de menor
// a mayor ticket. El orden importa — la card más accesible primero baja la
// barrera de entrada del que llega desde el anuncio.
const CAMPAIGN_SLUGS = [
  'quattro-gardens',
  'valmira-urban',
  'olivia-wow-condos',
  'loreta-wow-condos',
  'villalta-onix',
  'vellmari-puerto-cancun',
] as const;

export default async function PortafolioCancunPage() {
  const all = await getMergedDevelopmentsAsync();
  // Se leen del catálogo fusionado (Sanity gana) en vez de hardcodear precios
  // en la landing: así nunca queda desfasada respecto al sitio. Ese fue justo
  // el problema de las landings de Vellmari, con el precio escrito a mano.
  const developments = CAMPAIGN_SLUGS
    .map((slug) => all.find((d) => d.slug === slug))
    .filter((d): d is NonNullable<typeof d> => Boolean(d));

  return <LandingClient developments={developments} />;
}
