import type { Metadata } from 'next';

const URL = 'https://www.tresor.mx/departamentos-en-cancun-valmira';

// Título antes arrancaba con "Departamentos en Venta en Cancún" — el MISMO
// arranque que el título de /departamentos, la página de categoría que sí
// queremos que gane esa búsqueda genérica. Con dos páginas indexables
// compitiendo por la misma frase exacta, Google puede repartir la fuerza
// entre las dos en vez de consolidarla en una. Se cambia a marca-primero
// (mismo criterio ya aplicado en Loreta) — la URL de la campaña de mailing
// activa NO cambia, solo el <title>, así que no rompe nada ya enviado.
// `absolute`: sin esto el layout raíz le pega '· Tresor Real Estate' encima
// y el título terminaba pasado de 90 caracteres, truncado en Google.
export const metadata: Metadata = {
  title: { absolute: 'Valmira — Departamentos con Entrega Inmediata en Cancún' },
  description:
    'Departamentos equipados de 2 y 3 recámaras en Cancún con entrega inmediata y 0% de enganche. Desde $2,690,000 MXN sobre Av. Huayacán, en la comunidad Gran Vía. Agenda tu visita.',
  keywords: [
    'valmira urban homes',
    'departamentos en cancun entrega inmediata',
    'departamentos equipados cancun',
    'departamentos av huayacan cancun',
    'departamentos 0 enganche cancun',
    'departamentos gran via cancun',
  ],
  alternates: { canonical: URL },
  openGraph: {
    title: 'Valmira — Departamentos con Entrega Inmediata en Cancún',
    description:
      'Departamentos equipados de 2 y 3 recámaras en Cancún. Entrega inmediata, 0% de enganche, desde $2,690,000 MXN. Urban Homes en Gran Vía, Av. Huayacán.',
    url: URL,
    images: [{ url: '/og/valmira.jpg', width: 1200, height: 630 }],
    locale: 'es_MX',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Valmira — Departamentos con Entrega Inmediata en Cancún',
    description:
      'Departamentos equipados de 2 y 3 recámaras en Cancún. Entrega inmediata, 0% de enganche, desde $2,690,000 MXN.',
    images: ['/og/valmira.jpg'],
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
