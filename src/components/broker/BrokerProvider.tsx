'use client';

import { useCallback, useState, useTransition } from 'react';
import { useRouter } from '@/navigation';
import { BrokerContext } from '@/components/broker/context';
import BrokerLoginModal from '@/components/broker/BrokerLoginModal';

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
  const [loginOpen, setLoginOpen] = useState(false);
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
    setIsBroker(true);
    setFirstName(body.firstName ?? null);
    setLoginOpen(false);
    // Mismo motivo que AsesorProvider: el estado del header/FloatingLayer se
    // calcula server-side con la cookie — sin refresh se queda con lo que ya
    // se había mandado al navegador.
    startTransition(() => { router.refresh(); });
    return null;
  }, [router]);

  const logout = useCallback(async () => {
    await fetch('/api/broker/logout', { method: 'POST' });
    setIsBroker(false);
    setFirstName(null);
    startTransition(() => { router.refresh(); });
  }, [router]);

  const openLogin = useCallback(() => setLoginOpen(true), []);
  const closeLogin = useCallback(() => setLoginOpen(false), []);

  return (
    <BrokerContext.Provider value={{ isBroker, firstName, openLogin, closeLogin, loginOpen, login, logout }}>
      {children}
      <BrokerLoginModal />
    </BrokerContext.Provider>
  );
}
