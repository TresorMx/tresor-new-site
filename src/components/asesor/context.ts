'use client';

import { createContext, useContext } from 'react';

export interface AsesorCtx {
  isAsesor: boolean;
  ready: boolean; // ya se hidrató el estado desde la cookie
  // El modal de login (con tabs Asesor/Broker) vive en
  // src/components/commercial/CommercialLoginModal.tsx — ver
  // useCommercialAccess() para abrirlo. Este contexto solo expone la
  // acción real de login/logout, no el estado de un modal propio.
  // Devuelve `null` si el login fue exitoso, o el mensaje de error del
  // servidor si no (credenciales incorrectas, rate limit, etc.) — así el
  // modal muestra el motivo real en vez de un genérico "incorrectos" para
  // todo, incluyendo un 429 por demasiados asesores logueándose a la vez.
  login: (email: string, password: string) => Promise<string | null>;
  logout: () => Promise<void>;
  // true mientras se refresca el árbol server-rendered después de un login/
  // logout (ver AsesorProvider) — úsalo para mostrar feedback de carga.
  isPending: boolean;
}

// Contexto en su propio módulo — así el provider (que renderiza el modal) y el
// modal (que consume el contexto) importan de aquí sin ciclo entre ellos.
export const AsesorContext = createContext<AsesorCtx | null>(null);

export function useAsesor(): AsesorCtx {
  const ctx = useContext(AsesorContext);
  if (!ctx) throw new Error('useAsesor debe usarse dentro de <AsesorProvider>');
  return ctx;
}
