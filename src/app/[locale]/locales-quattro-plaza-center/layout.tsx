import type { Metadata } from 'next';

const URL = 'https://www.tresor.mx/locales-quattro-plaza-center';
const OG = '/renders/long-island/02.jpg';

const TITLE = 'Quattro Plaza Center — Locales Comerciales en Cancún';
const DESCRIPTION =
  'Locales comerciales en preventa desde $1,968,600 MXN + IVA en las mejores ubicaciones de Cancún. Quattro Gardens y Quattro Long Island, las dos plazas comerciales de Tresor Real Estate.';

// noindex a propósito, mismo criterio que las demás landings de campaña
// (Lausana, Portafolio, Loreta, Valmira): esta página es para tráfico
// pagado, no para rankear. /quattro-plaza-center (la página de
// desarrollador) y /locales-comerciales-cancun ya son las que deben ganar
// esas búsquedas orgánicas — si esta landing también compitiera se
// canibalizarían entre sí.
export const metadata: Metadata = {
  title: { absolute: `${TITLE} · Tresor Real Estate` },
  description: DESCRIPTION,
  alternates: { canonical: URL },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: URL,
    siteName: 'Tresor Real Estate',
    images: [{ url: OG, width: 3840, height: 2160, alt: 'Quattro Plaza Center — Cancún' }],
    locale: 'es_MX',
    type: 'website',
  },
  twitter: { card: 'summary_large_image', title: TITLE, description: DESCRIPTION, images: [OG] },
  robots: { index: false, follow: true },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
