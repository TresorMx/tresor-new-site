'use client';

import { FolderLock } from 'lucide-react';
import { Link } from '@/navigation';
import { usePathname } from '@/navigation';
import Chatbot from '@/components/Chatbot';
import { useAsesor } from '@/components/asesor/context';

// Capa flotante global (reemplaza al <Chatbot /> suelto en el layout).
// Regla: en una ficha de desarrollo Y con sesión de asesor, el chat de Luis
// se oculta y en su lugar aparece un botón volado "Drive de Ventas". En
// cualquier otro caso, se muestra Luis como siempre.
export default function FloatingLayer() {
  const { isAsesor } = useAsesor();
  const pathname = usePathname(); // sin prefijo de locale (viene de @/navigation)

  const fichaMatch = pathname.match(/^\/desarrollos\/([^/]+)/);

  if (isAsesor && fichaMatch) {
    const slug = fichaMatch[1];
    return (
      <Link
        href={`/asesores/${slug}`}
        className="fixed bottom-5 right-5 z-40 inline-flex items-center gap-2.5 rounded-full bg-ink px-5 py-3.5 text-[12px] font-bold uppercase tracking-[0.16em] text-white shadow-[0_12px_40px_rgba(0,0,0,0.25)] transition-all hover:brightness-110 md:bottom-6 md:right-6"
      >
        <FolderLock size={16} strokeWidth={1.8} />
        Drive de Ventas
      </Link>
    );
  }

  return <Chatbot />;
}
