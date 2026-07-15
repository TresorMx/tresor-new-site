import type { Metadata } from 'next';
import AsesoresIndex from '@/components/asesor/AsesoresIndex';
import { buildDriveGroups } from '@/lib/asesor/driveGroups';

export const metadata: Metadata = {
  title: 'Drives de Ventas · Asesores',
  robots: { index: false, follow: false }, // área interna, fuera de buscadores
};

export default async function AsesoresPage() {
  const groups = await buildDriveGroups();
  return <AsesoresIndex groups={groups} />;
}
