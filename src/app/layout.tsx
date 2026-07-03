import type { Metadata } from 'next';

// Root layout required by Next.js App Router.
// All real layout logic (html, body, fonts, providers) lives in [locale]/layout.tsx.
// metadataBase vive aquí porque rutas fuera de [locale] (/ads/*, /studio,
// /sitemap.xml, /opengraph-image raíz) no pasan por ese layout — sin esto,
// Next resuelve URLs de OG/Twitter contra localhost en vez del dominio real.
export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'https://tresor.mx'),
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return children;
}
