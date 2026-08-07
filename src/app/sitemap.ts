import type { MetadataRoute } from 'next';
import { getActivePlazasAsync } from '@/lib/data';
import { getMergedDevelopmentsAsync } from '@/lib/developments';

const SITE = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.tresor.mx';

export const dynamic = 'force-dynamic';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const plazas = await getActivePlazasAsync();
  // Todos los desarrollos con ficha real (Tresor + Sales Partner + Listings)
  // — no solo los que tienen Plaza en Sanity. Si el sitemap solo trae
  // Tresor, Google nunca descubre las demás fichas. Se usa `d.href` TAL
  // CUAL en vez de reconstruir `/desarrollos/${slug}` a mano — Listings
  // (Plaza Lindavista) vive bajo /listings/, no /desarrollos/, y reconstruir
  // el prefijo a mano generaba la URL equivocada.
  const merged = await getMergedDevelopmentsAsync();
  const devHrefs = new Set(
    merged
      .filter((d) => !d.comingSoon)
      .map((d) => d.href)
      .filter((h) => h.startsWith('/desarrollos/') || h.startsWith('/listings/')),
  );
  for (const p of plazas) devHrefs.add(`/desarrollos/${p.slug}`);
  const allHrefs = Array.from(devHrefs);

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: SITE,                 lastModified: now, changeFrequency: 'weekly',  priority: 1.0 },
    { url: `${SITE}/en`,         lastModified: now, changeFrequency: 'weekly',  priority: 0.8 },
    { url: `${SITE}/agenda`,     lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${SITE}/en/agenda`,  lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${SITE}/desarrollo`, lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${SITE}/locales-comerciales-cancun`, lastModified: now, changeFrequency: 'weekly', priority: 0.98 },
    { url: `${SITE}/departamentos-en-cancun-valmira`, lastModified: now, changeFrequency: 'weekly', priority: 0.95 },
    { url: `${SITE}/departamentos-en-puerto-cancun-vellmari`, lastModified: now, changeFrequency: 'weekly', priority: 0.95 },
    { url: `${SITE}/departamentos-en-cancun-loreta`, lastModified: now, changeFrequency: 'weekly', priority: 0.95 },
    // Versión en inglés de la landing de Vellmari (Google Ads US/CA). Sin
    // /en/ a propósito: es su URL canónica, ver el layout de esa ruta.
    { url: `${SITE}/luxury-condos-puerto-cancun`, lastModified: now, changeFrequency: 'weekly', priority: 0.95 },
    // Páginas de contenido en inglés que atacan "condos for sale in {ciudad}".
    // Solo la variante /en/: la ruta sin prefijo redirige ahí (contenido
    // únicamente en inglés), así que listar ambas sería listar un redirect.
    { url: `${SITE}/en/condos-for-sale-cancun`, lastModified: now, changeFrequency: 'weekly', priority: 0.95 },
    { url: `${SITE}/en/condos-for-sale-puerto-cancun`, lastModified: now, changeFrequency: 'weekly', priority: 0.95 },
    { url: `${SITE}/invertir-en-cancun`, lastModified: now, changeFrequency: 'weekly', priority: 0.95 },
    { url: `${SITE}/rewards`,    lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${SITE}/brokers`,    lastModified: now, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${SITE}/privacidad`, lastModified: now, changeFrequency: 'yearly',  priority: 0.2 },
    { url: `${SITE}/en/brokers`, lastModified: now, changeFrequency: 'monthly', priority: 0.4 },
  ];

  // Páginas de desarrollador (trayectoria corporativa) — mismo criterio de
  // prioridad que /desarrollo.
  const developerSlugs = ['gestion', 'comercializacion', 'quattro-plaza-center', 'live-desarrollos', 'onix-living', 'urban-homes'];
  const developerRoutes: MetadataRoute.Sitemap = developerSlugs.flatMap((slug) => [
    { url: `${SITE}/${slug}`,        lastModified: now, changeFrequency: 'monthly' as const, priority: 0.6 },
    { url: `${SITE}/en/${slug}`,     lastModified: now, changeFrequency: 'monthly' as const, priority: 0.45 },
  ]);

  // Landings por ciudad y por tipo de propiedad — palabra clave real,
  // prioridad alta (mismo nivel que /locales-comerciales-cancun e
  // /invertir-en-cancun, que ya estaban en staticRoutes).
  const keywordLandingSlugs = [
    'cancun', 'puerto-cancun', 'playa-del-carmen', 'tulum',
    'departamentos', 'locales-comerciales', 'lotes-residenciales', 'listings',
  ];
  const keywordLandingRoutes: MetadataRoute.Sitemap = keywordLandingSlugs.flatMap((slug) => [
    { url: `${SITE}/${slug}`,    lastModified: now, changeFrequency: 'weekly' as const, priority: 0.85 },
    { url: `${SITE}/en/${slug}`, lastModified: now, changeFrequency: 'weekly' as const, priority: 0.65 },
  ]);

  const plazaRoutes: MetadataRoute.Sitemap = allHrefs.flatMap((href) => [
    {
      url: `${SITE}${href}`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.95,
    },
    {
      url: `${SITE}/en${href}`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.75,
    },
  ]);

  const blogSlugs = [
    'vivir-en-puerto-cancun',
    'donde-comprar-departamento-en-cancun',
    'desarrollos-inmobiliarios-en-cancun',
    'como-invertir-en-locales-comerciales-en-cancun',
    'cuanto-cuesta-un-local-comercial-en-cancun',
    'mejores-zonas-para-negocio-en-cancun',
    'local-comercial-vs-departamento-cancun',
    'guia-comprar-en-preventa-cancun',
    'invertir-en-cancun-desde-monterrey-cdmx',
  ];

  // Artículos en inglés — solo bajo /en/, igual que /en/condos-for-sale-*:
  // la ruta sin prefijo redirige ahí, así que listarla sería listar un redirect.
  const blogSlugsEn = [
    'buying-property-in-mexico-as-a-foreigner',
    'best-areas-to-buy-in-cancun',
    'closing-costs-when-buying-property-in-mexico',
    'pre-construction-vs-move-in-ready-cancun',
  ];

  const blogRoutes: MetadataRoute.Sitemap = [
    { url: `${SITE}/blog`, lastModified: now, changeFrequency: 'weekly', priority: 0.85 },
    { url: `${SITE}/en/blog`, lastModified: now, changeFrequency: 'weekly', priority: 0.8 },
    ...blogSlugs.map((slug) => ({
      url: `${SITE}/blog/${slug}`,
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: 0.85,
    })),
    ...blogSlugsEn.map((slug) => ({
      url: `${SITE}/en/blog/${slug}`,
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: 0.85,
    })),
  ];

  return [...staticRoutes, ...developerRoutes, ...keywordLandingRoutes, ...plazaRoutes, ...blogRoutes];
}
