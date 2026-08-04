'use client';

import { Suspense, useEffect, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import { Lock } from 'lucide-react';
import { useRouter, usePathname } from '@/navigation';
import { useAsesor } from '@/components/asesor/context';
import { useCommercialAccess } from '@/components/commercial/context';

// `?reauth=1` — lo manda /api/asesor/file cuando la cookie real ya no es
// válida pero el `isAsesor` de React (calentado una sola vez en el layout
// raíz, ver AsesorProvider) se había quedado en `true` de una sesión vieja.
// Sin esto, el asesor ve el Drive "logueado" pero cada descarga truena —
// con esto, se limpia el estado viejo y se reabre el login solo. Aparte en
// su propio componente + <Suspense> porque `useSearchParams` lo exige
// (mismo patrón ya usado en /gracias) — no debe bloquear el render del
// resto del gate mientras tanto.
function ReauthWatcher() {
  const { logout } = useAsesor();
  const { openLogin } = useCommercialAccess();
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const handledReauth = useRef(false);

  useEffect(() => {
    if (searchParams.get('reauth') !== '1' || handledReauth.current) return;
    handledReauth.current = true;
    logout().then(() => openLogin('asesor'));
    router.replace(pathname);
  }, [searchParams, logout, openLogin, router, pathname]);

  return null;
}

// Envuelve las vistas de /asesores: si no hay sesión de asesor muestra una
// pantalla de acceso (con botón que abre el login, tab "Asesor Tresor" del
// modal compartido). Los archivos en sí están protegidos server-side en
// /api/asesor/file — esta compuerta es de UI.
export default function AsesorGate({ children }: { children: React.ReactNode }) {
  const { isAsesor, ready } = useAsesor();
  const { openLogin } = useCommercialAccess();

  const reauthWatcher = <Suspense fallback={null}><ReauthWatcher /></Suspense>;

  if (!ready) return reauthWatcher; // evita flash antes de hidratar el estado

  if (!isAsesor) {
    // Sin pt-[104px] propio: el <main> del layout raíz ya trae ese padding
    // — duplicarlo aquí empujaba esta pantalla innecesariamente más abajo.
    return (
      <>
        {reauthWatcher}
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
      </>
    );
  }

  return (
    <>
      {reauthWatcher}
      {children}
    </>
  );
}
