'use client';

import { usePathname } from 'next/navigation';

// Oculta el chrome del sitio (Header, Footer, MobileBar, FloatingLayer) en
// rutas de herramienta a pantalla completa — hoy /asesores/[slug]/cotizador
// (Urban Homes/La Selva y los que sigan), mismo patrón que quattroplaza-web.
// No toca el /cotizador standalone (embebido en GHL vía iframe), que no
// vive bajo /asesores/.
export default function ChromeGate({
  header,
  footer,
  extras,
  children,
}: {
  header: React.ReactNode;
  footer: React.ReactNode;
  extras: React.ReactNode;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const bare = pathname?.includes('/asesores/') && pathname?.endsWith('/cotizador');

  if (bare) {
    return <main className="min-h-screen">{children}</main>;
  }

  return (
    <>
      {header}
      <main className="min-h-screen pt-[104px]">{children}</main>
      {footer}
      {extras}
    </>
  );
}
