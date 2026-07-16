import type { MetadataRoute } from 'next';

const SITE = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://tresor.mx';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      // '/gracias/' (con la barra) solo bloqueaba /gracias — las páginas de
      // agradecimiento reales (/agenda/gracias, /reserva/gracias) NO
      // empiezan con ese prefijo, así que nunca quedaban bloqueadas.
      // Sin barra final: /cotizar y /gracias bloquean también todo lo que
      // empiece igual (/cotizar/..., /gracias/...), no solo el path exacto.
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/studio/', '/cotizar', '/gracias', '/agenda/gracias', '/reserva/gracias'],
      },
    ],
    sitemap: `${SITE}/sitemap.xml`,
    host: SITE,
  };
}
