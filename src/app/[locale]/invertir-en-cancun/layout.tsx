import type { Metadata } from 'next';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const isEs = locale !== 'en';
  const title = isEs
    ? 'Invertir en Cancún — Locales Comerciales para Inversionistas de Monterrey, CDMX y GDL'
    : 'Invest in Cancún — Commercial Spaces for Out-of-Town Investors';
  const description = isEs
    ? 'Locales comerciales en preventa en Cancún con rendimientos del 10–15% anual. Proceso 100% remoto. Ideal para inversionistas de Monterrey, CDMX o Guadalajara que buscan diversificar fuera de su ciudad.'
    : 'Pre-sale commercial spaces in Cancún with 10–15% annual returns. 100% remote process. Ideal for investors looking to diversify outside their home market.';
  return {
    title,
    description,
    keywords: isEs
      ? [
          'invertir en cancun',
          'inversión inmobiliaria cancun monterrey',
          'invertir en cancun desde monterrey',
          'locales comerciales cancun inversionista',
          'bienes raices cancun cdmx',
          'invertir fuera de mi ciudad cancun',
        ]
      : ['invest in cancun', 'cancun real estate investment', 'commercial property cancun investor', 'remote real estate investment mexico'],
    alternates: {
      canonical: isEs ? 'https://www.tresor.mx/invertir-en-cancun' : 'https://www.tresor.mx/en/invertir-en-cancun',
    },
    openGraph: {
      title: isEs
        ? 'Invertir en Cancún — Para Inversionistas de Monterrey, CDMX y Guadalajara'
        : 'Invest in Cancún — For Out-of-Town Investors',
      description: isEs
        ? 'Rendimientos del 10–15% anual. Proceso 100% remoto. Locales en preventa desde $1,968,600 MXN + IVA.'
        : '10–15% annual returns. 100% remote process. Pre-sale commercial spaces from $1,968,600 MXN + VAT.',
      url: isEs ? 'https://www.tresor.mx/invertir-en-cancun' : 'https://www.tresor.mx/en/invertir-en-cancun',
      images: [{ url: 'https://www.tresor.mx/blog/AdobeStock_841077811.jpeg', width: 1200, height: 630 }],
      locale: isEs ? 'es_MX' : 'en_US',
    },
  };
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
