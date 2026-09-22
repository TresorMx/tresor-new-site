import type { Metadata } from 'next';

// Landing de pauta en INGLÉS para Vellmari (Google Ads, comprador US/CA).
// Slug en inglés a propósito: el tráfico frío busca "luxury condos puerto
// cancun", no la marca — un slug con la keyword sube el Quality Score y la
// relevancia del anuncio. La versión en español vive aparte, en
// /departamentos-en-puerto-cancun-vellmari.
const URL_EN = 'https://www.tresor.mx/luxury-condos-puerto-cancun';
const OG = 'https://www.tresor.mx/desarrollos/Vellmari/ENTREGAFINAL_CADU_VELMARI_AEREA03.jpg';

// `absolute` a propósito: el layout raíz aplica el template
// '%s · Tresor Real Estate', que aquí dejaba un title de 88 caracteres —
// Google lo trunca en SERP y en el anuncio se ve cortado. Este lo controla
// la landing completo, con la keyword al inicio y el precio como gancho.
const TITLE = 'Luxury Condos in Puerto Cancún — From $900,000 USD';
const DESCRIPTION =
  'Own a marina-front luxury condo in Puerto Cancún from $900,000 USD. 98 exclusive residences from 1,819 to 7,686 sq ft, with an 18-hole golf course, private marina, spa and beach club. Schedule a private tour.';

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  keywords: [
    'luxury condos puerto cancun',
    'puerto cancun real estate',
    'condos for sale in cancun mexico',
    'luxury condos for sale cancun',
    'marina front condos cancun',
    'penthouse for sale cancun',
    'cancun beachfront condos',
    'vellmari puerto cancun',
    'buy property in cancun',
  ],
  // Sin hreflang: la versión ES (/departamentos-en-puerto-cancun-vellmari)
  // nunca lo devolvía (no era recíproco) y ambas son noindex ahora.
  alternates: { canonical: URL_EN },
  openGraph: {
    title: 'Luxury Condos in Puerto Cancún — from $900,000 USD',
    description:
      '98 exclusive marina-front residences from 1,819 to 7,686 sq ft in Puerto Cancún. Golf, private marina, spa and beach club.',
    url: URL_EN,
    siteName: 'Tresor Real Estate',
    images: [{ url: OG, width: 1200, height: 630, alt: 'Vellmari — luxury condos in Puerto Cancún' }],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Luxury Condos in Puerto Cancún — from $900,000 USD',
    description:
      '98 exclusive marina-front residences from 1,819 to 7,686 sq ft in Puerto Cancún.',
    images: [OG],
  },
  // noindex (sep/2026): landing solo para tráfico pagado/mailing. La ficha
  // del desarrollo ya es la página indexable con el mismo inventario; dos
  // páginas indexables casi iguales se canibalizan. Search Console: 0 clics
  // orgánicos. Mismo criterio que Koa y Quattro Plaza Center.
  robots: { index: false, follow: true },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
