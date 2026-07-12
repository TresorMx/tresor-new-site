import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: {
    default: 'Blog — Inversión Inmobiliaria en Cancún y Riviera Maya | Tresor Real Estate',
    template: '%s | Tresor Real Estate Blog',
  },
  description:
    'Guías, análisis y consejos para invertir en bienes raíces en Cancún y la Riviera Maya. Todo lo que necesitas saber antes de comprar.',
  openGraph: {
    siteName: 'Tresor Real Estate',
    type: 'website',
    locale: 'es_MX',
  },
};

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
