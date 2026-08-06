import type { Metadata } from 'next';

// El `openGraph.locale` estaba fijo en 'es_MX' y lo heredaba cualquier página
// del blog que no lo declarara — incluidas las de la sección en inglés.
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const isEs = locale !== 'en';
  return {
    title: {
      default: isEs
        ? 'Blog — Inversión Inmobiliaria en Cancún y Riviera Maya | Tresor Real Estate'
        : 'Blog — Buying Real Estate in Cancún and the Riviera Maya | Tresor Real Estate',
      template: isEs ? '%s | Tresor Real Estate Blog' : '%s | Tresor Real Estate',
    },
    description: isEs
      ? 'Guías, análisis y consejos para invertir en bienes raíces en Cancún y la Riviera Maya. Todo lo que necesitas saber antes de comprar.'
      : 'Guides and analysis for buying real estate in Cancún and the Riviera Maya — written for foreign buyers.',
    openGraph: {
      siteName: 'Tresor Real Estate',
      type: 'website',
      locale: isEs ? 'es_MX' : 'en_US',
    },
  };
}

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
