import type { Metadata } from 'next';

// Landing multi-producto para Google Ads, Meta y mailing. Solo español.
//
// noindex a propósito: su trabajo es convertir tráfico pagado, no rankear.
// Si se indexara competiría contra /departamentos y /cancun, que son las
// páginas que sí trabajamos para orgánico — y las tres hablan del mismo
// inventario, así que se canibalizarían entre sí.
const URL = 'https://www.tresor.mx/portafolio-cancun';
const OG = 'https://www.tresor.mx/ogfinal.jpg';

const TITLE = 'Departamentos, Locales Comerciales y Luxury Condos en Cancún';
const DESCRIPTION =
  'Seis desarrollos activos en Cancún desde $1,968,600 MXN. Precio directo del desarrollador, preventa y entrega inmediata. Recibe disponibilidad y planes de pago.';

export const metadata: Metadata = {
  title: { absolute: `${TITLE} · Tresor Real Estate` },
  description: DESCRIPTION,
  alternates: { canonical: URL },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: URL,
    siteName: 'Tresor Real Estate',
    images: [{ url: OG, width: 1200, height: 630, alt: 'Portafolio de desarrollos en Cancún — Tresor Real Estate' }],
    locale: 'es_MX',
    type: 'website',
  },
  twitter: { card: 'summary_large_image', title: TITLE, description: DESCRIPTION, images: [OG] },
  robots: { index: false, follow: true },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
