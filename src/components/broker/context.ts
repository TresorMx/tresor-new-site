'use client';

import { createContext, useContext } from 'react';

export interface BrokerCtx {
  isBroker: boolean;
  firstName: string | null;
  logout: () => Promise<void>;
}

// Contexto separado de AsesorContext a propósito: un broker autenticado
// nunca debe activar isAsesor en el resto del sitio (CTAs de ficha,
// FloatingLayer, etc.) — son permisos internos distintos aunque el Drive que
// ven sea el mismo (ver src/lib/broker/cookies.ts).
export const BrokerContext = createContext<BrokerCtx | null>(null);

export function useBroker(): BrokerCtx {
  const ctx = useContext(BrokerContext);
  if (!ctx) throw new Error('useBroker debe usarse dentro de <BrokerProvider>');
  return ctx;
}
