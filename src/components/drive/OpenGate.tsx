'use client';

// Gate "abierto" para las landings espejo /drive/* — mismo shape que
// AsesorGate/BrokerGate (ComponentType<{children}>) pero sin ningún check:
// la única protección de estas rutas es que la URL no está enlazada desde
// ningún lado del sitio ni indexada (noindex + fuera del sitemap). Quien
// tiene el link, entra — no hay login de por medio a propósito.
// 'use client' obligatorio: AsesorDrive es Client Component y recibe este
// gate como prop desde un Server Component — solo se pueden pasar
// referencias a Client Components a través de esa frontera, no funciones
// de servidor sueltas.
export default function OpenGate({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
