'use client';

import { useCallback, useState, useTransition } from 'react';
import { useRouter } from '@/navigation';
import { AsesorContext } from '@/components/asesor/context';
import AsesorTransitionOverlay from '@/components/asesor/AsesorTransitionOverlay';

interface AsesorProviderProps {
  children: React.ReactNode;
  // Calculado SERVER-SIDE en el layout (misma cookie httpOnly que autoriza
  // las descargas) — el primer render ya es correcto, sin useEffect
  // client-side leyendo cookies después de hidratar. Eso causaba un
  // parpadeo real: el chat de Luis se alcanzaba a ver un instante incluso
  // con sesión de asesor activa, porque el estado inicial siempre arrancaba
  // en `false` hasta que el efecto corría.
  initialIsAsesor: boolean;
}

export function AsesorProvider({ children, initialIsAsesor }: AsesorProviderProps) {
  const router = useRouter();
  const [isAsesor, setIsAsesor] = useState(initialIsAsesor);
  const [isPending, startTransition] = useTransition();

  const login = useCallback(async (email: string, password: string) => {
    const res = await fetch('/api/asesor/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      return typeof body.error === 'string' ? body.error : 'Correo o contraseña incorrectos.';
    }
    setIsAsesor(true);
    // CRÍTICO: el CTA de la ficha (cotizador/apartado vs Agenda) se decide
    // SERVER-SIDE leyendo la cookie httpOnly en el momento del request. El
    // fetch de arriba solo pone la cookie — no vuelve a renderizar nada. Sin
    // este refresh, la página se queda con lo que ya se había mandado al
    // navegador y hay que recargar a mano para ver el cambio. router.refresh()
    // vuelve a pedir los Server Components de la ruta actual con la cookie ya
    // puesta, sin perder el estado de cliente (scroll, modales, etc.).
    startTransition(() => { router.refresh(); });
    return null;
  }, [router]);

  const logout = useCallback(async () => {
    await fetch('/api/asesor/logout', { method: 'POST' });
    setIsAsesor(false);
    startTransition(() => { router.refresh(); });
  }, [router]);

  return (
    <AsesorContext.Provider value={{ isAsesor, ready: true, login, logout, isPending }}>
      {children}
      <AsesorTransitionOverlay show={isPending} />
    </AsesorContext.Provider>
  );
}
