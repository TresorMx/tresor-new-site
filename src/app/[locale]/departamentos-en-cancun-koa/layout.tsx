import type { Metadata } from 'next';

const URL = 'https://www.tresor.mx/departamentos-en-cancun-koa';

// noindex a propósito — a diferencia de Valmira (que sí es indexable), Koa
// YA tiene su propia ficha indexable en /desarrollos/koa-onix con el mismo
// inventario y casi el mismo copy. Una segunda página indexable con
// contenido tan parecido se canibalizaría con esa ficha en vez de sumar.
// Esta landing es solo para tráfico pagado — mismo criterio que Lausana,
// Portafolio, Loreta y Quattro Plaza Center.
export const metadata: Metadata = {
  title: { absolute: 'Koa — Departamentos con Entrega Inmediata en Cancún' },
  description:
    'Departamentos de 1, 2 y 3 recámaras en Cancún con entrega inmediata y escrituración garantizada. Desde $3,500,000 MXN en Zona Huayacán. Agenda tu visita.',
  alternates: { canonical: URL },
  openGraph: {
    title: 'Koa — Departamentos con Entrega Inmediata en Cancún',
    description:
      'Departamentos de 1, 2 y 3 recámaras en Cancún. Entrega inmediata, escrituración garantizada, desde $3,500,000 MXN. Zona Huayacán.',
    url: URL,
    images: [{ url: '/desarrollos/koa/Copia-de-FF_01.jpg', width: 1920, height: 1408 }],
    locale: 'es_MX',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Koa — Departamentos con Entrega Inmediata en Cancún',
    description: 'Departamentos de 1, 2 y 3 recámaras en Cancún. Entrega inmediata, escrituración garantizada, desde $3,500,000 MXN.',
    images: ['/desarrollos/koa/Copia-de-FF_01.jpg'],
  },
  robots: { index: false, follow: true },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
