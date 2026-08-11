import type { Metadata } from 'next';
import MetaPixelExtra from '@/components/MetaPixelExtra';

const URL = 'https://www.tresor.mx/lausana-residencial-cancun';
const OG = '/desarrollos/olivia/10.-Parque-urbano.jpg';

const TITLE = 'Olivia y Loreta Wow Condos — Lausana Residencial, Cancún';
const DESCRIPTION =
  'Departamentos desde $3,100,000 MXN en Lausana Residencial, la nueva Smart City de Cancún. 10% de enganche, 3% de descuento + aires y persianas. Dos proyectos de Live Desarrollos: Olivia y Loreta Wow Condos.';

// noindex a propósito, mismo criterio que /portafolio-cancun: esta landing
// es para tráfico pagado (Meta/Google) con una promo puntual (enganche +
// descuento), no para rankear. Loreta y Olivia ya tienen sus propias fichas
// y su propia landing (Loreta) indexables — si esta también compitiera por
// "lausana residencial cancun" se canibalizarían entre sí.
export const metadata: Metadata = {
  title: { absolute: `${TITLE} · Tresor Real Estate` },
  description: DESCRIPTION,
  alternates: { canonical: URL },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: URL,
    siteName: 'Tresor Real Estate',
    images: [{ url: OG, width: 1920, height: 1037, alt: 'Lausana Residencial — Olivia y Loreta Wow Condos' }],
    locale: 'es_MX',
    type: 'website',
  },
  twitter: { card: 'summary_large_image', title: TITLE, description: DESCRIPTION, images: [OG] },
  robots: { index: false, follow: true },
};

// Pixel adicional solo para esta landing (además del pixel base del sitio,
// que ya corre en el layout raíz). Cubre también /gracias, que hereda este
// layout, así que el evento `Lead` disparado ahí llega a ambos pixeles.
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <MetaPixelExtra pixelId="1215240240575498" />
      {children}
    </>
  );
}
