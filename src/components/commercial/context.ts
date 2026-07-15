'use client';

import { createContext, useContext } from 'react';

export type CommercialTab = 'asesor' | 'broker';

export interface CommercialAccessCtx {
  loginOpen: boolean;
  initialTab: CommercialTab;
  openLogin: (tab?: CommercialTab) => void;
  closeLogin: () => void;
}

// Un solo modal de "Acceso Comercial" con tabs (Asesor Tresor / Broker) en
// vez de dos botones separados en la barra amarilla — son cuentas y
// permisos distintos (equipo interno vs. brokers externos autoregistrados),
// pero comparten la misma puerta de entrada. El login real de cada uno sigue
// viviendo en AsesorContext/BrokerContext (login/logout) — este contexto
// solo controla el estado del modal compartido.
export const CommercialAccessContext = createContext<CommercialAccessCtx | null>(null);

export function useCommercialAccess(): CommercialAccessCtx {
  const ctx = useContext(CommercialAccessContext);
  if (!ctx) throw new Error('useCommercialAccess debe usarse dentro de <CommercialAccessProvider>');
  return ctx;
}
