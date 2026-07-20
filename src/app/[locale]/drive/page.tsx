import type { Metadata } from 'next';
import AsesoresIndex from '@/components/asesor/AsesoresIndex';
import OpenGate from '@/components/drive/OpenGate';
import { buildDriveGroups } from '@/lib/asesor/driveGroups';

// Índice abierto de /drive — mismo catálogo e índice que /asesores y
// /brokers/drive (ver AsesoresIndex + buildDriveGroups), pero sin gate: la
// única protección es que la URL no está enlazada desde ningún lado del
// sitio ni indexada. Cada card enlaza a /drive/[slug] (mirror de ficha ya
// existente, también OpenGate + noindex).
export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Drive de Ventas',
  robots: { index: false, follow: false },
};

export default async function DrivePage() {
  const groups = await buildDriveGroups();
  return <AsesoresIndex groups={groups} gate={OpenGate} hrefBase="/drive" />;
}
