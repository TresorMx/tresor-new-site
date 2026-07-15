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

  const logout = useCallback(async () => {
    await fetch('/api/broker/logout', { method: 'POST' });
    setIsBroker(false);
    setFirstName(null);
    startTransition(() => { router.refresh(); });
  }, [router]);

  return (
    <BrokerContext.Provider value={{ isBroker, firstName, logout }}>
      {children}
    </BrokerContext.Provider>
  );
}
