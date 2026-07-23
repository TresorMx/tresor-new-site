'use client';

import { usePathname } from 'next/navigation';
import DriveHeader from '@/components/drive/DriveHeader';

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
  // Herramientas a pantalla completa (cotizador de asesor) y landings de
  // captación pagada (Valmira) — sin header/footer/nav ni el chatbot genérico
  // (FloatingLayer): nada que distraiga de convertir. La landing de Valmira
  // renderiza su PROPIO chatbot (exclusivo del proyecto) dentro de la página.
  const bare =
    (pathname?.includes('/asesores/') && pathname?.endsWith('/cotizador')) ||
    pathname === '/departamentos-en-cancun-valmira' ||
    pathname?.startsWith('/departamentos-en-cancun-valmira/');

  if (bare) {
    return <main className="min-h-screen">{children}</main>;
  }

  // /drive/* (landings + fichas espejo, ver src/app/[locale]/drive/) — zona
  // oculta para brokers de confianza: nada de barra amarilla, menú
  // "Propiedades", "Agenda una visita" ni footer — todo eso invita a
  // navegar fuera. Header mínimo (logo sin link + idioma) en su lugar.
  // `extras` se queda (MobileBar/FloatingLayer ya se ocultan/adaptan solos
  // en /drive/* por su propia cuenta, ver esos componentes).
  const isDrive = pathname === '/drive' || pathname?.startsWith('/drive/');
  if (isDrive) {
    return (
      <>
        <DriveHeader />
        <main className="min-h-screen pt-[104px]">{children}</main>
        {extras}
      </>
    );
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
