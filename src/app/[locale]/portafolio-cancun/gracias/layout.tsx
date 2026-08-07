import type { Metadata } from 'next';

// La página de gracias NO se indexa: si Google la posiciona, entra tráfico
// orgánico que dispara el evento de conversión sin haber llenado el
// formulario — y eso ensucia el reporte de Ads con conversiones falsas.
// (page.tsx es 'use client' y no puede exportar metadata, por eso vive aquí.)
export const metadata: Metadata = {
  title: { absolute: 'Gracias — Portafolio Cancún · Tresor Real Estate' },
  robots: { index: false, follow: false },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
