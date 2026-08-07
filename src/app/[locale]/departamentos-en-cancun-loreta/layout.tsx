import type { Metadata } from 'next';

const URL = 'https://www.tresor.mx/departamentos-en-cancun-loreta';
const OG = '/desarrollos/loreta/7.-Piscina-Infinity_.jpg';

// `absolute`: el layout raíz aplica el template '%s · Tresor Real Estate',
// y sin esto el title terminaba pasado de 100 caracteres (se ve truncado en
// Google y en el anuncio) — mismo bug ya corregido en otras landings.
export const metadata: Metadata = {
  title: { absolute: 'Loreta Wow Condos — Preventa en Lausana Residencial, Cancún' },
  description:
    'Departamentos en preventa desde $3,800,000 MXN dentro de Lausana Residencial, la primera Smart City de Cancún. Vistas al golf y al lago, alberca infinity, spa y kids club. Aparta con $25,000.',
  keywords: [
    'loreta wow condos',
    'departamentos en preventa cancun',
    'lausana residencial cancun',
    'departamentos vista al golf cancun',
    'live desarrollos loreta',
    'departamentos en venta cancun',
  ],
  alternates: { canonical: URL },
  openGraph: {
    title: 'Loreta Wow Condos — Preventa en Lausana Residencial, Cancún',
    description:
      'Departamentos de 1 a 3 recámaras y Garden Houses con vistas al golf y al lago, dentro de la primera Smart City de Cancún. Desde $3,800,000 MXN.',
    url: URL,
    images: [{ url: OG, width: 1920, height: 1080 }],
    locale: 'es_MX',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Loreta Wow Condos — Preventa en Lausana Residencial, Cancún',
    description:
      'Departamentos de 1 a 3 recámaras con vistas al golf y al lago. Desde $3,800,000 MXN.',
    images: [OG],
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
