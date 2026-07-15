'use client';

import { useCallback, useState } from 'react';
import { CommercialAccessContext, type CommercialTab } from '@/components/commercial/context';
import CommercialLoginModal from '@/components/commercial/CommercialLoginModal';

export function CommercialAccessProvider({ children }: { children: React.ReactNode }) {
  const [loginOpen, setLoginOpen] = useState(false);
  const [initialTab, setInitialTab] = useState<CommercialTab>('broker');

  const openLogin = useCallback((tab: CommercialTab = 'broker') => {
    setInitialTab(tab);
    setLoginOpen(true);
  }, []);
  const closeLogin = useCallback(() => setLoginOpen(false), []);

  return (
    <CommercialAccessContext.Provider value={{ loginOpen, initialTab, openLogin, closeLogin }}>
      {children}
      <CommercialLoginModal />
    </CommercialAccessContext.Provider>
  );
}
