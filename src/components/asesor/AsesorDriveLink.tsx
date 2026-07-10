'use client';

import { FolderLock } from 'lucide-react';
import { Link } from '@/navigation';
import { useAsesor } from '@/components/asesor/context';

// Link "Drive de Ventas" que aparece junto al botón "Ver desarrollo" en los
// cards — SOLO para asesores logueados. Para cualquier otro visitante
// renderiza `null`: sin costo visual ni de bundle-runtime, el link no existe.
export default function AsesorDriveLink({ slug }: { slug: string }) {
  const { isAsesor } = useAsesor();
  if (!isAsesor) return null;
  return (
    <Link
      href={`/asesores/${slug}`}
      className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.16em] text-ink-3 transition-colors hover:text-accent"
    >
      <FolderLock size={13} strokeWidth={1.8} />
      Drive de Ventas
    </Link>
  );
}
