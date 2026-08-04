'use client';

import { Suspense, useEffect, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import { Lock } from 'lucide-react';
import { Link, useRouter, usePathname } from '@/navigation';
import { useBroker } from '@/components/broker/context';

// `?reauth=1` — lo manda /api/broker/file cuando la cookie real ya no es
// válida pero `isBroker` (calentado una sola vez en el layout raíz) se
// había quedado en `true` de una sesión vieja. Mismo fix que AsesorGate,
// aparte en su propio componente + <Suspense> porque `useSearchParams` lo
// exige (mismo patrón ya usado en /gracias).
function ReauthWatcher() {
  const { logout } = useBroker();
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const handledReauth = useRef(false);

  useEffect(() => {
    if (searchParams.get('reauth') !== '1' || handledReauth.current) return;
    handledReauth.current = true;
    logout();
    router.replace(pathname);
  }, [searchParams, logout, router, pathname]);

  return null;
}

// Envuelve las vistas de /brokers/drive: si no hay sesión de broker muestra
// una pantalla de acceso con link a /brokers (registro/login es demasiado
// para un modal chico, a diferencia de AsesorGate). Los archivos en sí están
// protegidos server-side en /api/broker/file — esta compuerta es de UI.
export default function BrokerGate({ children }: { children: React.ReactNode }) {
  const { isBroker } = useBroker();
  const reauthWatcher = <Suspense fallback={null}><ReauthWatcher /></Suspense>;

  if (!isBroker) {
    return (
      <>
        {reauthWatcher}
        <div className="flex min-h-[70vh] items-center justify-center bg-bg px-6">
          <div className="w-full max-w-md rounded-[26px] border border-line bg-white p-10 text-center shadow-sm">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-ink text-white">
              <Lock size={20} strokeWidth={1.6} />
            </div>
            <h1 className="mt-5 font-sans text-[24px] font-medium tracking-tight">Acceso solo para brokers</h1>
            <p className="mt-2 text-[14px] font-light leading-relaxed text-ink-3">
              Regístrate o inicia sesión para ver los Drives de Ventas.
            </p>
            <Link
              href="/brokers"
              className="btn btn-lg mt-7 w-full border-0 bg-accent font-bold text-ink hover:brightness-95"
            >
              Ir a Brokers
            </Link>
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
