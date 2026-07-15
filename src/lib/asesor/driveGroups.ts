import { getMergedDevelopmentsAsync, developers, type DeveloperId } from '@/lib/developments';
import type { DriveGroup } from '@/components/asesor/AsesoresIndex';

// Agrupación por developer del índice de Drives — usada tanto por
// /asesores como por /brokers/drive (mismo catálogo completo para ambos,
// ver AsesoresIndex).
const GROUP_ORDER: DeveloperId[] = ['Tresor', 'Live', 'Urban Homes', 'Onix'];

function routeSlug(href: string): string | null {
  return href.startsWith('/desarrollos/') ? href.slice('/desarrollos/'.length) : null;
}

export async function buildDriveGroups(): Promise<DriveGroup[]> {
  const all = await getMergedDevelopmentsAsync();

  return GROUP_ORDER.map((id) => {
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
}
