'use client';

import { useCallback, useState, useTransition } from 'react';
import { useRouter } from '@/navigation';
import { BrokerContext } from '@/components/broker/context';

interface BrokerProviderProps {
  children: React.ReactNode;
  // Calculado SERVER-SIDE en el layout (misma cookie httpOnly que autoriza
  // las descargas) — mismo patrón que AsesorProvider, ver
  // src/app/[locale]/layout.tsx.
  initialIsBroker: boolean;
  initialFirstName: string | null;
}

export function BrokerProvider({ children, initialIsBroker, initialFirstName }: BrokerProviderProps) {
  const router = useRouter();
  const [isBroker, setIsBroker] = useState(initialIsBroker);
  const [firstName, setFirstName] = useState(initialFirstName);
  const [, startTransition] = useTransition();

  const login = useCallback(async (email: string, password: string) => {
    const res = await fetch('/api/broker/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const body = await res.json().catch(() => ({}));
    if (!res.ok) {
      return {
        error: typeof body.error === 'string' ? body.error : 'Correo o contraseña incorrectos.',
        needsVerification: Boolean(body.needsVerification),
      };
    }
    // A diferencia de AsesorProvider (que se queda en la misma página), el
    // login de broker manda directo al Drive — es lo que el broker vino a
    // buscar. Navegación completa (no router.push) para que el layout raíz
    // vuelva a leer la cookie recién puesta (el estado de "Brokers" en el
    // header depende de eso).
    window.location.assign('/brokers/drive');
    return null;
  }, []);

  const logout = useCallback(async () => {
    await fetch('/api/broker/logout', { method: 'POST' });
    setIsBroker(false);
    setFirstName(null);
    startTransition(() => { router.refresh(); });
  }, [router]);

  return (
    <BrokerContext.Provider value={{ isBroker, firstName, login, logout }}>
      {children}
    </BrokerContext.Provider>
  );
}
