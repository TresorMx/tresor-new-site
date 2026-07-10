'use client';

import { FolderLock, Grid2x2 } from 'lucide-react';
import { Link } from '@/navigation';
import { usePathname } from '@/navigation';
import Chatbot from '@/components/Chatbot';
import { useAsesor } from '@/components/asesor/context';

// Capa flotante global (reemplaza al <Chatbot /> suelto en el layout). El
// chat de Luis NUNCA aparece con sesión de asesor — no tiene sentido para
// alguien del equipo de ventas. En su lugar:
//   - En una ficha: botón volado "Drive de Ventas" (el de ese desarrollo).
//   - En cualquier otra página (home, agenda, etc.): botón volado "Todos
//     los drives" → /asesores. Antes esto vivía como un link repetido en
//     cada card del home; un solo botón flotante es más simple y consistente
//     con cómo ya funciona en la ficha.
export default function FloatingLayer() {
  const { isAsesor } = useAsesor();
  const pathname = usePathname(); // sin prefijo de locale (viene de @/navigation)

  if (!isAsesor) return <Chatbot />;

  const fichaMatch = pathname.match(/^\/desarrollos\/([^/]+)/);
  const href = fichaMatch ? `/asesores/${fichaMatch[1]}` : '/asesores';
  const label = fichaMatch ? 'Drive de Ventas' : 'Todos los drives';
  const Icon = fichaMatch ? FolderLock : Grid2x2;

  return (
    <Link
      href={href}
      className="fixed bottom-5 right-5 z-40 inline-flex items-center gap-2.5 rounded-full bg-ink px-5 py-3.5 text-[12px] font-bold uppercase tracking-[0.16em] text-white shadow-[0_12px_40px_rgba(0,0,0,0.25)] transition-all hover:brightness-110 md:bottom-6 md:right-6"
    >
      <Icon size={16} strokeWidth={1.8} />
      {label}
    </Link>
  );
}
