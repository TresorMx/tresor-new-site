import type { Metadata, Viewport } from 'next';
import { Cormorant_Garamond, JetBrains_Mono } from 'next/font/google';
import localFont from 'next/font/local';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import MobileBar from '@/components/MobileBar';
import ChromeGate from '@/components/ChromeGate';
import { cookies } from 'next/headers';
import { AsesorProvider } from '@/components/asesor/AsesorProvider';
import FloatingLayer from '@/components/asesor/FloatingLayer';
import { verifySession, ASESOR_COOKIE } from '@/lib/asesor/session';
import { BrokerProvider } from '@/components/broker/BrokerProvider';
import { verifyBrokerSession, BROKER_COOKIE } from '@/lib/broker/session';
import { getBrokerFullName } from '@/lib/broker/profile';
import { CommercialAccessProvider } from '@/components/commercial/CommercialAccessProvider';
// import ExitIntent from '@/components/ExitIntent'; // desactivado por lo pronto
import MetaPixel from '@/components/MetaPixel';
import GoogleAnalytics from '@/components/GoogleAnalytics';
import { locales, type Locale } from '@/i18n';
import { getPlazasAsync, getSiteSettings } from '@/lib/data';
import { getMergedDevelopmentsAsync } from '@/lib/developments';
import '@/styles/globals.css';

// force-dynamic: cada visita hace un fetch fresco a Sanity.
// Garantiza que los cambios del Studio se reflejan de inmediato.
export const dynamic = 'force-dynamic';

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '500'],
  style: ['normal', 'italic'],
  variable: '--font-cormorant',
  display: 'swap',
});

// Switzer auto-hospedada (next/font/local, sin @import externo bloqueante)
// — reemplaza a Manrope como font-sans. Antes se cargaba vía @import de
// Fontshare directo en globals.css: eso bloquea el primer render de todo el
// sitio. Los mismos 5 woff2 ahora viven en src/fonts/switzer/ y se sirven
// self-hosted, con el mismo `display: swap` y sin el costo de red externo.
const switzer = localFont({
  src: [
    { path: '../../fonts/switzer/Switzer-300.woff2', weight: '300', style: 'normal' },
    { path: '../../fonts/switzer/Switzer-400.woff2', weight: '400', style: 'normal' },
    { path: '../../fonts/switzer/Switzer-500.woff2', weight: '500', style: 'normal' },
    { path: '../../fonts/switzer/Switzer-600.woff2', weight: '600', style: 'normal' },
    { path: '../../fonts/switzer/Switzer-700.woff2', weight: '700', style: 'normal' },
  ],
  variable: '--font-switzer',
  display: 'swap',
});

const jetbrains = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-jetbrains',
  display: 'swap',
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.tresor.mx';

export const viewport: Viewport = {
  themeColor: '#F6F4EF',
  width: 'device-width',
  initialScale: 1,
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const isEs = locale === 'es';

  return {
    metadataBase: new URL(SITE_URL),
    title: {
      default: isEs
        ? 'Tresor Real Estate | Propiedades Inmobiliarias en Cancún y Riviera Maya'
        : 'Tresor Real Estate | Real Estate in Cancún and Riviera Maya',
      template: '%s · Tresor Real Estate',
    },
    description: isEs
      ? 'Desarrollador y comercializador inmobiliario en Cancún y la Riviera Maya. Departamentos, locales comerciales y lotes residenciales en preventa y entrega inmediata.'
      : 'Real estate developer and broker in Cancún and the Riviera Maya. Apartments, commercial units and residential lots in pre-sale and immediate delivery.',
    keywords: isEs
      ? [
          'Tresor Real Estate',
          'inmobiliaria Cancún',
          'departamentos en venta Cancún',
          'locales en venta Cancún',
          'lotes residenciales Cancún',
          'inversión inmobiliaria Cancún',
          'preventa Quintana Roo',
          'Riviera Maya bienes raíces',
          'Quattro Plaza Center',
        ]
      : ['Tresor Real Estate', 'real estate Cancún', 'apartments for sale Cancún', 'commercial units Cancún', 'Riviera Maya real estate'],
    authors: [{ name: 'Tresor Real Estate' }],
    creator: 'Tresor Real Estate',
    publisher: 'Tresor Real Estate',
    formatDetection: { telephone: true, address: true, email: true },
    alternates: {
      canonical: isEs ? SITE_URL : `${SITE_URL}/en`,
      languages: {
        'es':        SITE_URL,
        'en':        `${SITE_URL}/en`,
        'x-default': SITE_URL,
      },
    },
    openGraph: {
      type: 'website',
      locale: isEs ? 'es_MX' : 'en_US',
      siteName: 'Tresor Real Estate',
      title: isEs
        ? 'Tresor Real Estate | Propiedades Inmobiliarias en Cancún y Riviera Maya'
        : 'Tresor Real Estate | Real Estate in Cancún and Riviera Maya',
      description: isEs
        ? 'Departamentos, locales comerciales y lotes residenciales en Cancún y la Riviera Maya. Preventa y entrega inmediata.'
        : 'Apartments, commercial units and residential lots in Cancún and the Riviera Maya. Pre-sale and immediate delivery.',
      images: [{ url: '/ogfinal.jpg', width: 1200, height: 630, alt: 'Tresor Real Estate' }],
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Tresor Real Estate',
      description: isEs
        ? 'Propiedades inmobiliarias en Cancún y la Riviera Maya.'
        : 'Real estate properties in Cancún and the Riviera Maya.',
      images: ['/ogfinal.jpg'],
    },
    verification: { google: 'U4evI45bFXrab7MhX6773_n1G9ZW862gxl8W9FufDh4' },
    robots: { index: true, follow: true, googleBot: { index: true, follow: true } },
    icons: {
      icon: [
        { url: '/favicon2.svg', type: 'image/svg+xml' },
        { url: '/favicon2.png', type: 'image/png' },
      ],
      apple: '/favicon2.png',
    },
  };
}

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  if (!locales.includes(locale)) notFound();

  // Carga plazas + desarrollos + configuración del sitio desde Sanity en
  // PARALELO (no en serie — cada uno es un round-trip de red aparte; en
  // serie duplican el tiempo de espera antes de poder mandar cualquier byte
  // de HTML). Deduplicado con React.cache — una sola llamada real por
  // request. El segundo calienta el cache que Header.tsx (Client Component)
  // lee sincrónicamente vía getDevelopDevelopments()/countByCity().
  const [, , siteSettings] = await Promise.all([
    getPlazasAsync(),
    getMergedDevelopmentsAsync(),
    getSiteSettings(),
  ]);

  // isAsesor se calcula SERVER-SIDE (misma cookie httpOnly que autoriza las
  // descargas) y se manda como prop inicial al provider — así el primer
  // render ya es correcto (sin depender de un useEffect client-side que
  // lee la cookie después de hidratar, lo que causaba un parpadeo: el chat
  // de Luis se alcanzaba a ver un instante incluso con sesión de asesor).
  const cookieStore = await cookies();
  const initialIsAsesor = verifySession(cookieStore.get(ASESOR_COOKIE)?.value);

  // Mismo patrón para brokers, pero con cookie/contexto propios (ver
  // src/lib/broker/cookies.ts) — un broker autenticado nunca debe activar
  // initialIsAsesor en el resto del sitio.
  const brokerId = verifyBrokerSession(cookieStore.get(BROKER_COOKIE)?.value);
  const initialIsBroker = Boolean(brokerId);
  const initialBrokerFirstName = brokerId ? (await getBrokerFullName(brokerId))?.split(' ')[0] ?? null : null;

  const messages = await getMessages();

  const orgJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'RealEstateAgent',
    name: 'Tresor Real Estate',
    url: SITE_URL,
    logo: `${SITE_URL}/logos/LogoTresor-ink.svg`,
    image: `${SITE_URL}/og/home.jpg`,
    description: 'Desarrollador y comercializador inmobiliario en Cancún y la Riviera Maya. Departamentos, locales comerciales y lotes residenciales en preventa y entrega inmediata.',
    telephone: '+52-998-404-5602',
    email: 'hello@tresor.mx',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Cancún',
      addressRegion: 'Quintana Roo',
      postalCode: '77500',
      addressCountry: 'MX',
    },
    areaServed: [
      { '@type': 'City', name: 'Cancún' },
      { '@type': 'City', name: 'Tulum' },
      { '@type': 'City', name: 'Playa del Carmen' },
    ],
    sameAs: [
      'https://www.instagram.com/quattroplazacenter',
      `${SITE_URL}`,
    ],
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Propiedades en Venta en Cancún y Riviera Maya',
      itemListElement: [
        { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Departamentos en venta en Cancún y Riviera Maya', description: 'Departamentos en preventa y entrega inmediata en Cancún, Tulum, Playa del Carmen y Puerto Cancún.' } },
        { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Locales comerciales en venta en Cancún', description: 'Locales comerciales en preventa en plazas premium de Cancún, desde 32 m².' } },
        { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Lotes residenciales en venta en Cancún', description: 'Lotes y macrolotes residenciales en las zonas de mayor plusvalía de Cancún.' } },
      ],
    },
  };

  return (
    <html
      lang={locale}
      className={`${cormorant.variable} ${switzer.variable} ${jetbrains.variable}`}
    >
      {/* Google exige el snippet de GA dentro de <head> para verificar la
          propiedad del sitio en Search Console — en <body> no cuenta, aunque
          el tag esté presente en el HTML. Next.js fusiona este <head> con el
          que genera solo desde `metadata`. */}
      <head>
        <GoogleAnalytics />
      </head>
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }}
        />
        <NextIntlClientProvider messages={messages} locale={locale}>
          <AsesorProvider initialIsAsesor={initialIsAsesor}>
            <BrokerProvider initialIsBroker={initialIsBroker} initialFirstName={initialBrokerFirstName}>
              {/* CommercialAccessProvider adentro de ambos: el modal
                  compartido (tabs Asesor/Broker) llama a useAsesor()/
                  useBroker() para el login real de cada tab. */}
              <CommercialAccessProvider>
                <ChromeGate
                  header={<Header logoStyle={siteSettings.headerLogoStyle} />}
                  footer={<Footer />}
                  extras={
                    <>
                      <MobileBar />
                      {/* FloatingLayer = Luis, o el botón "Drive de Ventas" si eres asesor/broker y estás en una ficha. */}
                      <FloatingLayer />
                    </>
                  }
                >
                  {children}
                </ChromeGate>
                {/* <ExitIntent /> desactivado por lo pronto */}
              </CommercialAccessProvider>
            </BrokerProvider>
          </AsesorProvider>
        </NextIntlClientProvider>
        <MetaPixel />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
