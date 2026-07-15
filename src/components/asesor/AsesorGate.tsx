'use client';

import { Lock } from 'lucide-react';
import { useAsesor } from '@/components/asesor/context';
import { useCommercialAccess } from '@/components/commercial/context';

// Envuelve las vistas de /asesores: si no hay sesión de asesor muestra una
// pantalla de acceso (con botón que abre el login, tab "Asesor Tresor" del
// modal compartido). Los archivos en sí están protegidos server-side en
// /api/asesor/file — esta compuerta es de UI.
export default function AsesorGate({ children }: { children: React.ReactNode }) {
  const { isAsesor, ready } = useAsesor();
  const { openLogin } = useCommercialAccess();

  if (!ready) return null; // evita flash antes de hidratar el estado

  if (!isAsesor) {
    // Sin pt-[104px] propio: el <main> del layout raíz ya trae ese padding
    // — duplicarlo aquí empujaba esta pantalla innecesariamente más abajo.
    return (
      <div className="flex min-h-[70vh] items-center justify-center bg-bg px-6">
        <div className="w-full max-w-md rounded-[26px] border border-line bg-white p-10 text-center shadow-sm">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-ink text-white">
            <Lock size={20} strokeWidth={1.6} />
          </div>
          <h1 className="mt-5 font-sans text-[24px] font-medium tracking-tight">Acceso solo para asesores</h1>
          <p className="mt-2 text-[14px] font-light leading-relaxed text-ink-3">
            Inicia sesión con tu cuenta de Tresor para ver los Drives de Ventas.
          </p>
          <button
            onClick={() => openLogin('asesor')}
            className="btn btn-lg mt-7 w-full border-0 bg-accent font-bold text-ink hover:brightness-95"
          >
            Iniciar sesión
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
