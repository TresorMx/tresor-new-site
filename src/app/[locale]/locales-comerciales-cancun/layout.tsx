import type { Metadata } from 'next';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const isEs = locale !== 'en';
  const title = isEs ? 'Locales Comerciales en Venta en Cancún' : 'Commercial Spaces for Sale in Cancún';
  const description = isEs
    ? 'Locales comerciales en venta en Cancún desde $1,968,600 MXN + IVA. Dos plazas disponibles: Gardens y Long Island. Enganche desde $147,000 MXN. Tresor Real Estate.'
    : 'Commercial spaces for sale in Cancún from $1,968,600 MXN + VAT. Two plazas available: Gardens and Long Island. Down payment from $147,000 MXN. Tresor Real Estate.';
  return {
    title,
    description,
    keywords: isEs
      ? ['locales comerciales en cancun', 'locales comerciales cancun', 'local comercial en venta cancun', 'venta de locales comerciales cancun', 'local comercial cancun', 'locales en venta cancun', 'plaza comercial cancun', 'inversion local comercial cancun', 'local comercial preventa cancun', 'quattro plaza center']
      : ['commercial spaces cancun', 'commercial property for sale cancun', 'retail space cancun', 'commercial plaza cancun investment', 'quattro plaza center'],
    alternates: {
      canonical: isEs ? 'https://www.tresor.mx/locales-comerciales-cancun' : 'https://www.tresor.mx/en/locales-comerciales-cancun',
      languages: {
        es: 'https://www.tresor.mx/locales-comerciales-cancun',
        en: 'https://www.tresor.mx/en/locales-comerciales-cancun',
        'x-default': 'https://www.tresor.mx/locales-comerciales-cancun',
      },
    },
    openGraph: {
      title,
      description: isEs
        ? 'Dos plazas comerciales premium en Cancún. Locales desde 32 m² y desde $1,968,600 MXN + IVA. Enganche desde $147,000 MXN. Entrega 2027.'
        : 'Two premium commercial plazas in Cancún. Spaces from 32 sqm and from $1,968,600 MXN + VAT. Down payment from $147,000 MXN. Delivery 2027.',
      url: isEs ? 'https://www.tresor.mx/locales-comerciales-cancun' : 'https://www.tresor.mx/en/locales-comerciales-cancun',
      images: [{ url: '/ogfinal.jpg', width: 1200, height: 630 }],
      locale: isEs ? 'es_MX' : 'en_US',
      type: 'website',
    },
  };
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
