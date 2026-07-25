import type { Metadata } from 'next';

const URL = 'https://www.tresor.mx/departamentos-en-puerto-cancun-vellmari';
const OG = '/desarrollos/Vellmari/ENTREGAFINAL_CADU_VELMARI_AEREA03.jpg';

export const metadata: Metadata = {
  title: 'Departamentos de Lujo en Puerto Cancún · Frente a la Marina — Vellmari | Urban Homes',
  description:
    'Residencias de lujo en Puerto Cancún desde $14,800,000 MXN. 98 exclusivas residencias de 169 a 714 m² en dos torres frente a la marina, con golf, spa y amenidades de primer nivel. Agenda tu visita privada.',
  keywords: [
    'departamentos en puerto cancun',
    'departamentos de lujo en cancun',
    'departamentos frente a la marina cancun',
    'penthouse puerto cancun',
    'vellmari urban homes',
    'residencias de lujo puerto cancun',
    'preventa departamentos puerto cancun',
  ],
  alternates: { canonical: URL },
  openGraph: {
    title: 'Departamentos de Lujo en Puerto Cancún — Vellmari',
    description:
      '98 residencias exclusivas de 169 a 714 m² frente a la marina de Puerto Cancún. Desde $14,800,000 MXN. Urban Homes.',
    url: URL,
    images: [{ url: OG, width: 1200, height: 630 }],
    locale: 'es_MX',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Departamentos de Lujo en Puerto Cancún — Vellmari',
    description:
      '98 residencias exclusivas de 169 a 714 m² frente a la marina de Puerto Cancún. Desde $14,800,000 MXN.',
    images: [OG],
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
