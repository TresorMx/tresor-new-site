import type { MetadataRoute } from 'next';
import { getActivePlazasAsync } from '@/lib/data';
import { getAllDevelopmentRouteSlugsAsync } from '@/lib/developments';

const SITE = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://tresor.mx';

export const dynamic = 'force-dynamic';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const plazas = await getActivePlazasAsync();
  // Todos los desarrollos con ficha real bajo /desarrollos/ (Tresor + Sales
  // Partner) — no solo los que tienen Plaza en Sanity. Si el sitemap solo
  // trae Tresor, Google nunca descubre las fichas de Sales Partner.
  const plazaSlugs = new Set(plazas.map((p) => p.slug));
  const devSlugs = new Set(await getAllDevelopmentRouteSlugsAsync());
  const allSlugs = Array.from(new Set([...plazaSlugs, ...devSlugs]));

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: SITE,                 lastModified: now, changeFrequency: 'weekly',  priority: 1.0 },
    { url: `${SITE}/en`,         lastModified: now, changeFrequency: 'weekly',  priority: 0.8 },
    { url: `${SITE}/agenda`,     lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${SITE}/en/agenda`,  lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${SITE}/desarrollo`, lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${SITE}/locales-comerciales-cancun`, lastModified: now, changeFrequency: 'weekly', priority: 0.98 },
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
    'departamentos', 'locales-comerciales', 'lotes-residenciales',
  ];
  const keywordLandingRoutes: MetadataRoute.Sitemap = keywordLandingSlugs.flatMap((slug) => [
    { url: `${SITE}/${slug}`,    lastModified: now, changeFrequency: 'weekly' as const, priority: 0.85 },
    { url: `${SITE}/en/${slug}`, lastModified: now, changeFrequency: 'weekly' as const, priority: 0.65 },
  ]);

  const plazaRoutes: MetadataRoute.Sitemap = allSlugs.flatMap((slug) => [
    {
      url: `${SITE}/desarrollos/${slug}`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.95,
    },
    {
      url: `${SITE}/en/desarrollos/${slug}`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.75,
    },
  ]);

  const blogSlugs = [
    'como-invertir-en-locales-comerciales-en-cancun',
    'cuanto-cuesta-un-local-comercial-en-cancun',
    'mejores-zonas-para-negocio-en-cancun',
    'local-comercial-vs-departamento-cancun',
    'guia-comprar-en-preventa-cancun',
    'invertir-en-cancun-desde-monterrey-cdmx',
  ];

  const blogRoutes: MetadataRoute.Sitemap = [
    { url: `${SITE}/blog`, lastModified: now, changeFrequency: 'weekly', priority: 0.85 },
    ...blogSlugs.map((slug) => ({
      url: `${SITE}/blog/${slug}`,
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: 0.85,
    })),
  ];

  return [...staticRoutes, ...developerRoutes, ...keywordLandingRoutes, ...plazaRoutes, ...blogRoutes];
}
