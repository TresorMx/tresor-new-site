import type { Metadata } from 'next';

// noindex: si Google la posiciona, entra tráfico orgánico que dispara el
// evento de conversión sin haber llenado el formulario, ensuciando el
// reporte de Ads con conversiones falsas. Mismo criterio que las demás
// landings de campaña.
export const metadata: Metadata = {
  title: { absolute: 'Gracias — Lausana Residencial · Tresor Real Estate' },
  robots: { index: false, follow: false },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
