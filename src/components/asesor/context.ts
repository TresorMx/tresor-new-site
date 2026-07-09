'use client';

import { createContext, useContext } from 'react';

export interface AsesorCtx {
  isAsesor: boolean;
  ready: boolean; // ya se hidrató el estado desde la cookie
  openLogin: () => void;
  closeLogin: () => void;
  loginOpen: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
}

// Contexto en su propio módulo — así el provider (que renderiza el modal) y el
// modal (que consume el contexto) importan de aquí sin ciclo entre ellos.
export const AsesorContext = createContext<AsesorCtx | null>(null);

export function useAsesor(): AsesorCtx {
  const ctx = useContext(AsesorContext);
  if (!ctx) throw new Error('useAsesor debe usarse dentro de <AsesorProvider>');
  return ctx;
}
