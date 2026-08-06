import { developments } from '@/lib/developments';
import LandingClient from './LandingClient';

// Server component a propósito (mismo criterio que la landing en español):
// `developments` pesa >100 KB de fuente y aquí solo se ocupan los 17 planos
// de Vellmari. Leerlos en el servidor evita mandar el catálogo completo al
// bundle del cliente — en una landing de pauta, velocidad de carga es
// conversión.
export default function LuxuryCondosPuertoCancunPage() {
  const dev = developments.find((d) => d.slug === 'vellmari-puerto-cancun');
  return <LandingClient floorPlans={dev?.floorPlans ?? []} />;
}
