import { developments } from '@/lib/developments';
import LandingClient from './LandingClient';

// Server component a propósito: `developments` pesa >100 KB de fuente y la
// landing solo necesita los 17 planos de Vellmari. Leerlos aquí evita mandar
// el catálogo completo al bundle del cliente — en una landing de pauta la
// velocidad de carga es conversión.
export default function VellmariLandingPage() {
  const dev = developments.find((d) => d.slug === 'vellmari-puerto-cancun');
  return <LandingClient floorPlans={dev?.floorPlans ?? []} />;
}
