import type { Metadata } from 'next';

// page.tsx es 'use client' (formulario interactivo con hooks de estado) y no
// puede exportar metadata — por eso vive aquí, mismo patrón que las páginas
// de gracias. Sin este archivo, /agenda no tenía canonical ni hreflang
// propios y caía a los defaults del layout raíz — SEMrush lo reportó como
// "Non-canonical URL" (aparece en el sitemap pero sin canonical
// autorreferenciado) y "No self-referencing hreflang" en ambos idiomas.
const SITE = 'https://www.tresor.mx';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const isEs = locale !== 'en';
  const title = isEs ? 'Agenda una Visita — Tresor Real Estate' : 'Schedule a Visit — Tresor Real Estate';
  const description = isEs
    ? 'Agenda una visita presencial o por videollamada con un asesor de Tresor Real Estate. Conoce disponibilidad real, precios y planes de pago.'
    : 'Schedule an in-person or video call visit with a Tresor Real Estate advisor. See real availability, prices and payment plans.';
  const url = isEs ? `${SITE}/agenda` : `${SITE}/en/agenda`;

  return {
    title: { absolute: `${title}` },
    description,
    alternates: {
      canonical: url,
      languages: {
        es: `${SITE}/agenda`,
        en: `${SITE}/en/agenda`,
        'x-default': `${SITE}/agenda`,
      },
    },
    openGraph: {
      title,
      description,
      url,
      images: [{ url: '/ogfinal.jpg', width: 1200, height: 630 }],
      locale: isEs ? 'es_MX' : 'en_US',
    },
  };
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
