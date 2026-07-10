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
import { cookies } from 'next/headers';
import { AsesorProvider } from '@/components/asesor/AsesorProvider';
import FloatingLayer from '@/components/asesor/FloatingLayer';
import { verifySession, ASESOR_COOKIE } from '@/lib/asesor/session';
// import ExitIntent from '@/components/ExitIntent'; // desactivado por lo pronto
import MetaPixel from '@/components/MetaPixel';
import GoogleAnalytics from '@/components/GoogleAnalytics';
import { locales, type Locale } from '@/i18n';
import { getPlazasAsync } from '@/lib/data';
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

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://tresor.mx';

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
        ? 'Quattro Plaza Center — Locales en Venta Cancún'
        : 'Quattro Plaza Center — Commercial Units for Sale in Cancún',
      template: '%s · Quattro Plaza Center',
    },
    description: isEs
      ? 'Plazas comerciales premium en Cancún. Locales en preventa con alto retorno. Long Island y Gardens disponibles. Por Tresor Real Estate.'
      : 'Premium commercial plazas in Cancún. Pre-sale units with high returns. Long Island & Gardens available. By Tresor Real Estate.',
    keywords: isEs
      ? [
          'locales en venta Cancún',
          'plaza comercial Cancún',
          'inversión inmobiliaria Cancún',
          'locales preventa Quintana Roo',
          'desarrollo comercial Cancún',
          'Quattro Plaza Center',
          'Long Island Cancún',
          'Gardens Cancún',
          'Tresor Real Estate',
        ]
      : ['commercial units Cancún', 'real estate investment Cancún', 'Quattro Plaza Center'],
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
      siteName: 'Quattro Plaza Center',
      title: isEs
        ? 'Quattro Plaza Center — Locales en Venta Cancún'
        : 'Quattro Plaza Center — Commercial Units in Cancún',
      description: isEs
        ? 'Plazas comerciales premium en Cancún. Long Island y Gardens en preventa.'
        : 'Premium commercial plazas in Cancún. Long Island and Gardens in pre-sale.',
      images: [{ url: '/og/home.jpg', width: 1200, height: 630, alt: 'Quattro Plaza Center' }],
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Quattro Plaza Center',
      description: isEs
        ? 'Locales comerciales premium en Cancún.'
        : 'Premium commercial units in Cancún.',
      images: ['/og/home.jpg'],
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

  // Carga plazas + desarrollos desde Sanity en PARALELO (no en serie — cada
  // uno es un round-trip de red aparte; en serie duplican el tiempo de espera
  // antes de poder mandar cualquier byte de HTML). Deduplicado con
  // React.cache — una sola llamada real por request. El segundo calienta el
  // cache que Header.tsx (Client Component) lee sincrónicamente vía
  // getDevelopDevelopments()/countByCity().
  await Promise.all([getPlazasAsync(), getMergedDevelopmentsAsync()]);

  // isAsesor se calcula SERVER-SIDE (misma cookie httpOnly que autoriza las
  // descargas) y se manda como prop inicial al provider — así el primer
  // render ya es correcto (sin depender de un useEffect client-side que
  // lee la cookie después de hidratar, lo que causaba un parpadeo: el chat
  // de Luis se alcanzaba a ver un instante incluso con sesión de asesor).
  const cookieStore = await cookies();
  const initialIsAsesor = verifySession(cookieStore.get(ASESOR_COOKIE)?.value);

  const messages = await getMessages();

  const orgJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'RealEstateAgent',
    name: 'Quattro Plaza Center',
    url: SITE_URL,
    logo: `${SITE_URL}/logos/logo-quattro.svg`,
    image: `${SITE_URL}/og/home.jpg`,
    description: 'Plazas comerciales premium en Cancún. Locales en venta con alto retorno en Long Island y Gardens. Por Tresor Real Estate.',
    telephone: '+52-998-404-5602',
    email: 'hello@tresor.mx',
    parentOrganization: {
      '@type': 'Organization',
      name: 'Tresor Real Estate',
      url: 'https://tresor.mx',
    },
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Cancún',
      addressRegion: 'Quintana Roo',
      postalCode: '77500',
      addressCountry: 'MX',
    },
    areaServed: {
      '@type': 'City',
      name: 'Cancún',
    },
    sameAs: [
      'https://www.instagram.com/quattroplazacenter',
      `${SITE_URL}`,
    ],
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Locales Comerciales en Venta Cancún',
      itemListElement: [
        { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Local Comercial Quattro Plaza Gardens', description: 'Locales comerciales en venta en Cancún desde 32 m². Enganche desde $147,000 MXN.' } },
        { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Local Comercial Quattro Plaza Long Island', description: 'Locales comerciales en venta en Cancún. Diseño premium y ubicación estratégica.' } },
      ],
    },
  };

  return (
    <html
      lang={locale}
      className={`${cormorant.variable} ${switzer.variable} ${jetbrains.variable}`}
    >
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }}
        />
        <NextIntlClientProvider messages={messages} locale={locale}>
          <AsesorProvider initialIsAsesor={initialIsAsesor}>
            <Header />
            <main className="min-h-screen pt-[104px]">{children}</main>
            <Footer />
            <MobileBar />
            {/* FloatingLayer = Luis, o el botón "Drive de Ventas" si eres asesor y estás en una ficha. */}
            <FloatingLayer />
            {/* <ExitIntent /> desactivado por lo pronto */}
          </AsesorProvider>
        </NextIntlClientProvider>
        <MetaPixel />
        <GoogleAnalytics />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
