'use client';

import { FolderLock, Grid2x2 } from 'lucide-react';
import { Link } from '@/navigation';
import { usePathname } from '@/navigation';
import Chatbot from '@/components/Chatbot';
import { useAsesor } from '@/components/asesor/context';
import { useBroker } from '@/components/broker/context';

// Capa flotante global (reemplaza al <Chatbot /> suelto en el layout). El
// chat de Luis NUNCA aparece con sesión de asesor NI de broker — no tiene
// sentido para alguien que ya está adentro del Drive. En su lugar:
//   - En una ficha: botón volado "Drive de Ventas" (el de ese desarrollo).
//   - En cualquier otra página (home, agenda, etc.): botón volado "Todos
//     los drives" → /asesores o /brokers/drive según el caso. Antes esto
//     vivía como un link repetido en cada card del home; un solo botón
//     flotante es más simple y consistente con cómo ya funciona en la ficha.
//   - Ya DENTRO del Drive (/asesores* o /brokers/drive*): ningún botón —
//     sería un link a la página en la que ya estás.
// isAsesor tiene prioridad sobre isBroker en el caso (raro) de que alguien
// tenga ambas sesiones activas — el equipo interno manda.
export default function FloatingLayer() {
  const { isAsesor } = useAsesor();
  const { isBroker } = useBroker();
  const pathname = usePathname(); // sin prefijo de locale (viene de @/navigation)

  // /drive/* (landings espejo sin login para brokers de confianza) — nada
  // de chat ahí tampoco, sin importar la sesión: es una zona oculta, el
  // chat de Luis no tiene nada que hacer ahí.
  if (pathname === '/drive' || pathname.startsWith('/drive/')) return null;

  if (!isAsesor && !isBroker) return <Chatbot />;

  const base = isAsesor ? '/asesores' : '/brokers/drive';
  const alreadyInDrive = pathname === base || pathname.startsWith(`${base}/`);
  if (alreadyInDrive) return null;

  const fichaMatch = pathname.match(/^\/desarrollos\/([^/]+)/);
  const href = fichaMatch ? `${base}/${fichaMatch[1]}` : base;
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
