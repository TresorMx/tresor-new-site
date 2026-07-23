import type { Metadata } from 'next';

const URL = 'https://www.tresor.mx/departamentos-en-cancun-valmira';

export const metadata: Metadata = {
  title: 'Departamentos en Venta en Cancún · Entrega Inmediata — Valmira | Urban Homes',
  description:
    'Departamentos equipados de 2 y 3 recámaras en Cancún con entrega inmediata y 0% de enganche. Desde $2,595,000 MXN sobre Av. Huayacán, en la comunidad Gran Vía. Agenda tu visita.',
  keywords: [
    'departamentos en venta en cancun',
    'departamentos en cancun entrega inmediata',
    'departamentos equipados cancun',
    'departamentos av huayacan cancun',
    'valmira urban homes',
    'departamentos 0 enganche cancun',
    'departamentos gran via cancun',
  ],
  alternates: { canonical: URL },
  openGraph: {
    title: 'Departamentos en Cancún con Entrega Inmediata — Valmira',
    description:
      'Departamentos equipados de 2 y 3 recámaras en Cancún. Entrega inmediata, 0% de enganche, desde $2,595,000 MXN. Urban Homes en Gran Vía, Av. Huayacán.',
    url: URL,
    images: [{ url: '/og/valmira.jpg', width: 1200, height: 630 }],
    locale: 'es_MX',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Departamentos en Cancún con Entrega Inmediata — Valmira',
    description:
      'Departamentos equipados de 2 y 3 recámaras en Cancún. Entrega inmediata, 0% de enganche, desde $2,595,000 MXN.',
    images: ['/og/valmira.jpg'],
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
