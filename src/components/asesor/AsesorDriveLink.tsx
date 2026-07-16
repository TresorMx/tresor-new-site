'use client';

import { FolderLock } from 'lucide-react';
import { Link } from '@/navigation';
import { useAsesor } from '@/components/asesor/context';

// Link "Drive de Ventas" que aparece junto al botón "Ver desarrollo" en los
// cards — SOLO para asesores logueados. Para cualquier otro visitante
// renderiza `null`: sin costo visual ni de bundle-runtime, el link no existe.
//
// `force` + `hrefBase` lo usan las landings espejo en /drive/* (link privado
// sin login para brokers de confianza, ver src/app/[locale]/drive/) — ahí el
// link SIEMPRE se muestra sin checar isAsesor, y apunta al Drive abierto
// (/drive/desarrollos/[slug]) en vez del gateado (/asesores/[slug]).
export default function AsesorDriveLink({
  slug,
  force = false,
  hrefBase = '/asesores',
}: {
  slug: string;
  force?: boolean;
  hrefBase?: string;
}) {
  const { isAsesor } = useAsesor();
  if (!force && !isAsesor) return null;
  return (
    <Link
      href={`${hrefBase}/${slug}`}
      className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.16em] text-ink-3 transition-colors hover:text-accent"
    >
      <FolderLock size={13} strokeWidth={1.8} />
      Drive de Ventas
    </Link>
  );
}
