'use client';

import { useCallback, useEffect, useState } from 'react';
import { ASESOR_UI_COOKIE } from '@/lib/asesor/cookies';
import { AsesorContext } from '@/components/asesor/context';
import AsesorLoginModal from '@/components/asesor/AsesorLoginModal';

function readUiCookie(): boolean {
  if (typeof document === 'undefined') return false;
  return document.cookie.split('; ').some((c) => c === `${ASESOR_UI_COOKIE}=1`);
}

export function AsesorProvider({ children }: { children: React.ReactNode }) {
  const [isAsesor, setIsAsesor] = useState(false);
  const [ready, setReady] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);

  // Se lee la cookie de UI en el mount (síncrono, sin red) — visitantes
  // normales nunca pagan un fetch; los links de drive simplemente no existen.
  useEffect(() => {
    setIsAsesor(readUiCookie());
    setReady(true);
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const res = await fetch('/api/asesor/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    if (!res.ok) return false;
    setIsAsesor(true);
    setLoginOpen(false);
    return true;
  }, []);

  const logout = useCallback(async () => {
    await fetch('/api/asesor/logout', { method: 'POST' });
    setIsAsesor(false);
  }, []);

  const openLogin = useCallback(() => setLoginOpen(true), []);
  const closeLogin = useCallback(() => setLoginOpen(false), []);

  return (
    <AsesorContext.Provider value={{ isAsesor, ready, openLogin, closeLogin, loginOpen, login, logout }}>
      {children}
      <AsesorLoginModal />
    </AsesorContext.Provider>
  );
}
