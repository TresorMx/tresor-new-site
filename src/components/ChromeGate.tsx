'use client';

import { usePathname } from 'next/navigation';
import DriveHeader from '@/components/drive/DriveHeader';

// Oculta el chrome del sitio (Header, Footer, MobileBar, FloatingLayer) en
// rutas de herramienta a pantalla completa — hoy /asesores/[slug]/cotizador
// (Urban Homes/La Selva y los que sigan), mismo patrón que quattroplaza-web.
// No toca el /cotizador standalone (embebido en GHL vía iframe), que no
// vive bajo /asesores/.
// Landings de captación pagada — se sirven "bare" (sin chrome del sitio),
// junto con sus sub-rutas (/gracias). Agregar aquí cada landing nueva.
const LANDINGS = [
  '/departamentos-en-cancun-valmira',
  '/departamentos-en-puerto-cancun-vellmari',
  '/luxury-condos-puerto-cancun', // Vellmari en inglés (Google Ads US/CA)
  '/portafolio-cancun',           // multi-producto (Ads + Meta + mailing)
  '/departamentos-en-cancun-loreta', // Loreta Wow Condos (Meta + Google Ads)
  '/lausana-residencial-cancun',   // Olivia + Loreta juntos (Meta + Google Ads)
  '/locales-quattro-plaza-center', // Quattro Gardens + Long Island juntos (Google Ads)
  '/departamentos-en-cancun-koa',  // Koa (Onix) — entrega inmediata (Google Ads)
];

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
  // `usePathname` de next/navigation trae el prefijo de locale (/en/...), y
  // las rutas de LANDINGS están escritas sin él. Sin quitarlo, la MISMA
  // landing servida bajo /en/ salía con header y footer — justo el chrome que
  // una página de pauta no debe tener.
  const path = pathname?.replace(/^\/en(?=\/|$)/, '') || '/';
  // Herramientas a pantalla completa (cotizador de asesor) y landings de
  // captación pagada — sin header/footer/nav ni el chatbot genérico
  // (FloatingLayer): nada que distraiga de convertir. Cada landing renderiza
  // su PROPIO chatbot (exclusivo del proyecto) dentro de la página.
  const bare =
    (pathname?.includes('/asesores/') && pathname?.endsWith('/cotizador')) ||
    LANDINGS.some((l) => path === l || path.startsWith(`${l}/`));

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
