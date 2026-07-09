import type { Metadata } from 'next';
import AsesoresIndex, { type DriveGroup } from '@/components/asesor/AsesoresIndex';
import { getMergedDevelopmentsAsync, developers, type DeveloperId } from '@/lib/developments';

export const metadata: Metadata = {
  title: 'Drives de Ventas · Asesores',
  robots: { index: false, follow: false }, // área interna, fuera de buscadores
};

// Orden de las secciones del índice.
const GROUP_ORDER: DeveloperId[] = ['Tresor', 'Live', 'Urban Homes', 'Onix'];

function routeSlug(href: string): string | null {
  return href.startsWith('/desarrollos/') ? href.slice('/desarrollos/'.length) : null;
}

export default async function AsesoresPage() {
  const all = await getMergedDevelopmentsAsync();

  const groups: DriveGroup[] = GROUP_ORDER.map((id) => {
    const devs: DriveGroup['devs'] = [];
    for (const d of all) {
      if (d.developer !== id || d.comingSoon) continue;
      const slug = routeSlug(d.href);
      if (!slug) continue;
      devs.push({ slug, name: d.name, image: d.image });
    }
    return {
      id,
      developerName: developers[id]?.name ?? id,
      developerLogo: developers[id]?.logoDark,
      devs,
    };
  }).filter((g) => g.devs.length > 0);

  return <AsesoresIndex groups={groups} />;
}
