'use client';

import { Lock } from 'lucide-react';
import { Link } from '@/navigation';
import { useBroker } from '@/components/broker/context';

// Envuelve las vistas de /brokers/drive: si no hay sesión de broker muestra
// una pantalla de acceso con link a /brokers (registro/login es demasiado
// para un modal chico, a diferencia de AsesorGate). Los archivos en sí están
// protegidos server-side en /api/broker/file — esta compuerta es de UI.
export default function BrokerGate({ children }: { children: React.ReactNode }) {
  const { isBroker } = useBroker();

  if (!isBroker) {
    return (
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
    );
  }

  return <>{children}</>;
}
