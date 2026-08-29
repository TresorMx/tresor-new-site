import type { MetadataRoute } from 'next';
import { getActivePlazasAsync } from '@/lib/data';
import { getMergedDevelopmentsAsync } from '@/lib/developments';

const SITE = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.tresor.mx';

export const dynamic = 'force-dynamic';

// ─── Fechas reales, no `new Date()` ─────────────────────────────────────────
// Antes CADA una de las ~98 URLs llevaba `lastModified: new Date()`, calculado
// en cada request porque el sitemap es force-dynamic. Google veía "todo
// cambió" en cada rastreo, sin importar si la página llevaba meses igual —
// la señal de frescura existe justo para decirle a Google dónde priorizar el
// recrawl, y si TODO dice "ahora mismo" la señal se vuelve ruido y Google
// aprende a ignorarla.
//
// Por qué son constantes y no `git log` en vivo: el sitemap sigue siendo
// force-dynamic porque el catálogo de desarrollos puede cambiar vía Sanity
// sin redeploy — pero el build de Vercel no incluye la carpeta .git en el
// runtime de la función serverless, así que no hay dónde correr `git log` en
// cada request aunque quisiéramos. La alternativa real es esta: fechas reales
// de "última vez que el contenido cambió de verdad", tomadas de
// `git log -1 --format=%aI` sobre cada page.tsx en el momento de este commit.
//
// TRADE-OFF, dicho con honestidad: estas fechas quedan congeladas hasta que
// alguien las actualice a mano. Es peor que un sistema que se actualiza solo,
// pero muchísimo mejor que mentir en cada request. Regla práctica: si editas
// el contenido real de una página (precio, copy, FAQ, zona) — no un ajuste de
// estilo o un typo — actualiza su fecha aquí. ES y EN de la misma ruta
// comparten fecha: son el mismo page.tsx, la única diferencia es el locale.
const DATES = {
  home: '2026-07-17',
  agenda: '2026-07-17',
  desarrollo: '2026-08-21',
  gestion: '2026-07-24',
  comercializacion: '2026-07-24',
  quattroPlazaCenter: '2026-07-24',
  liveDesarrollos: '2026-07-24',
  onixLiving: '2026-07-24',
  urbanHomes: '2026-07-24',
  cancun: '2026-08-06',
  puertoCancun: '2026-08-13',
  playaDelCarmen: '2026-08-13',
  tulum: '2026-08-06',
  departamentos: '2026-08-11',
  localesComerciales: '2026-08-13',
  lotesResidenciales: '2026-07-29',
  listings: '2026-07-29',
  desarrollos: '2026-08-21',
  deptosVentaCancun: '2026-08-13',
  deptosVentaPuertoCancun: '2026-08-13',
  deptosVentaPlayaDelCarmen: '2026-08-13',
  condosCancun: '2026-08-20',
  condosPuertoCancun: '2026-08-20',
  condosPlayaDelCarmen: '2026-08-20',
  invertirEnCancun: '2026-07-24',
  rewards: '2026-07-03',
  privacidad: '2026-08-13',
  localesComercialesCancun: '2026-07-24',
  valmiraLanding: '2026-08-10',
  vellmariLanding: '2026-07-24',
  loretaLanding: '2026-08-07',
  vellmariEnLanding: '2026-08-05',
  blog: '2026-08-13',
  blogVivirEnPlayaDelCarmen: '2026-08-14',
  blogTerrenosEnVentaCancun: '2026-08-14',
  blogVivirEnPuertoCancun: '2026-08-14',
  blogDondeComprarDepartamentoEnCancun: '2026-08-14',
  blogDesarrollosInmobiliariosEnCancun: '2026-08-14',
  blogComoInvertirEnLocalesComercialesEnCancun: '2026-07-24',
  blogCuantoCuestaUnLocalComercialEnCancun: '2026-07-24',
  blogMejoresZonasParaNegocioEnCancun: '2026-07-24',
  blogLocalComercialVsDepartamentoCancun: '2026-08-14',
  blogGuiaComprarEnPreventaCancun: '2026-07-24',
  blogInvertirEnCancunDesdeMonterreyCdmx: '2026-07-24',
  blogBuyingPropertyInMexicoAsAForeigner: '2026-08-20',
  blogBestAreasToBuyInCancun: '2026-08-07',
  blogClosingCosts: '2026-08-20',
  blogPreConstructionVsMoveInReady: '2026-08-20',
  blogIsCancunGoodInvestment: '2026-08-28',
  // developments.ts es la fuente de TODO el catálogo estático (Tresor, Sales
  // Partner) — se usa como fecha de todas las fichas por igual. Es menos
  // preciso que una fecha por proyecto (no distingue "cambié el precio de
  // Vellmari" de "agregué La Selva"), pero es real y de una sola fuente,
  // contra el "ahora mismo" que había antes en las 21 fichas.
  developmentsCatalog: '2026-08-14',
} as const;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Fichas cuyo origen es Sanity (Plaza) sí pueden cambiar sin redeploy —
  // para esas, `now` sigue siendo la señal honesta: el contenido
  // efectivamente puede haber cambiado desde el último request.
  const now = new Date();
  const plazas = await getActivePlazasAsync();
  // Todos los desarrollos con ficha real (Tresor + Sales Partner + Listings)
  // — no solo los que tienen Plaza en Sanity. Si el sitemap solo trae
  // Tresor, Google nunca descubre las demás fichas. Se usa `d.href` TAL
  // CUAL en vez de reconstruir `/desarrollos/${slug}` a mano — Listings
  // (Plaza Lindavista) vive bajo /listings/, no /desarrollos/, y reconstruir
  // el prefijo a mano generaba la URL equivocada.
  const merged = await getMergedDevelopmentsAsync();
  const plazaSlugs = new Set(plazas.map((p) => p.slug));
  const devHrefs = new Set(
    merged
      .filter((d) => !d.comingSoon)
      .map((d) => d.href)
      .filter((h) => h.startsWith('/desarrollos/') || h.startsWith('/listings/')),
  );
  for (const p of plazas) devHrefs.add(`/desarrollos/${p.slug}`);
  const allHrefs = Array.from(devHrefs);

  // Fecha por ficha: si el slug viene de Sanity (Plaza), `now` es honesto —
  // ese contenido puede cambiar sin redeploy. Si viene del catálogo estático,
  // usa la fecha real de developments.ts en vez de `now`.
  const devDate = (href: string) => {
    const slug = href.split('/').pop() ?? '';
    return plazaSlugs.has(slug) ? now : new Date(DATES.developmentsCatalog);
  };

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: SITE,                 lastModified: new Date(DATES.home),        changeFrequency: 'weekly',  priority: 1.0 },
    { url: `${SITE}/en`,         lastModified: new Date(DATES.home),        changeFrequency: 'weekly',  priority: 0.8 },
    { url: `${SITE}/agenda`,     lastModified: new Date(DATES.agenda),      changeFrequency: 'monthly', priority: 0.9 },
    { url: `${SITE}/en/agenda`,  lastModified: new Date(DATES.agenda),      changeFrequency: 'monthly', priority: 0.7 },
    { url: `${SITE}/desarrollo`, lastModified: new Date(DATES.desarrollo),  changeFrequency: 'monthly', priority: 0.6 },
    { url: `${SITE}/locales-comerciales-cancun`, lastModified: new Date(DATES.localesComercialesCancun), changeFrequency: 'weekly', priority: 0.98 },
    { url: `${SITE}/departamentos-en-cancun-valmira`, lastModified: new Date(DATES.valmiraLanding), changeFrequency: 'weekly', priority: 0.95 },
    { url: `${SITE}/departamentos-en-puerto-cancun-vellmari`, lastModified: new Date(DATES.vellmariLanding), changeFrequency: 'weekly', priority: 0.95 },
    { url: `${SITE}/departamentos-en-cancun-loreta`, lastModified: new Date(DATES.loretaLanding), changeFrequency: 'weekly', priority: 0.95 },
    // Versión en inglés de la landing de Vellmari (Google Ads US/CA). Sin
    // /en/ a propósito: es su URL canónica, ver el layout de esa ruta.
    { url: `${SITE}/luxury-condos-puerto-cancun`, lastModified: new Date(DATES.vellmariEnLanding), changeFrequency: 'weekly', priority: 0.95 },
    // Páginas de contenido en inglés que atacan "condos for sale in {ciudad}".
    // Solo la variante /en/: la ruta sin prefijo redirige ahí (contenido
    // únicamente en inglés), así que listar ambas sería listar un redirect.
    // Página de ciudad en español, equivalente de /en/condos-for-sale-cancun.
    // Solo /es: la variante /en redirige a la de condos, así que listarla
    // sería listar un redirect.
    // Hub de todo el portafolio. Antes era un 301 a /#portafolio, por eso no
    // estaba aquí; ahora es página real y es la que debe recibir el clúster
    // "desarrollos …". Bilingüe, a diferencia de las de condos.
    { url: `${SITE}/desarrollos`, lastModified: new Date(DATES.desarrollos), changeFrequency: 'weekly', priority: 0.95 },
    { url: `${SITE}/en/desarrollos`, lastModified: new Date(DATES.desarrollos), changeFrequency: 'weekly', priority: 0.9 },
    { url: `${SITE}/departamentos-en-venta-cancun`, lastModified: new Date(DATES.deptosVentaCancun), changeFrequency: 'weekly', priority: 0.98 },
    { url: `${SITE}/departamentos-en-venta-puerto-cancun`, lastModified: new Date(DATES.deptosVentaPuertoCancun), changeFrequency: 'weekly', priority: 0.95 },
    { url: `${SITE}/departamentos-en-venta-playa-del-carmen`, lastModified: new Date(DATES.deptosVentaPlayaDelCarmen), changeFrequency: 'weekly', priority: 0.95 },
    { url: `${SITE}/en/condos-for-sale-cancun`, lastModified: new Date(DATES.condosCancun), changeFrequency: 'weekly', priority: 0.95 },
    { url: `${SITE}/en/condos-for-sale-puerto-cancun`, lastModified: new Date(DATES.condosPuertoCancun), changeFrequency: 'weekly', priority: 0.95 },
    { url: `${SITE}/en/condos-for-sale-playa-del-carmen`, lastModified: new Date(DATES.condosPlayaDelCarmen), changeFrequency: 'weekly', priority: 0.95 },
    { url: `${SITE}/invertir-en-cancun`, lastModified: new Date(DATES.invertirEnCancun), changeFrequency: 'weekly', priority: 0.95 },
    { url: `${SITE}/rewards`,    lastModified: new Date(DATES.rewards),    changeFrequency: 'monthly', priority: 0.6 },
    { url: `${SITE}/privacidad`, lastModified: new Date(DATES.privacidad), changeFrequency: 'yearly',  priority: 0.2 },
    // /brokers y /en/brokers NO van aquí: la página tiene
    // `robots: { index: false }` (es login/registro de asesores, no
    // contenido) — listarla en el sitemap le manda a Google la señal
    // contraria ("indéxame") a la del meta tag ("no me indexes"). SEMrush lo
    // reportó como "Non-canonical URL". Nunca se debe listar una página
    // noindex en el sitemap.
  ];

  // Páginas de desarrollador (trayectoria corporativa) — mismo criterio de
  // prioridad que /desarrollo.
  const developerRoutes: MetadataRoute.Sitemap = (
    [
      ['gestion', DATES.gestion],
      ['comercializacion', DATES.comercializacion],
      ['quattro-plaza-center', DATES.quattroPlazaCenter],
      ['live-desarrollos', DATES.liveDesarrollos],
      ['onix-living', DATES.onixLiving],
      ['urban-homes', DATES.urbanHomes],
    ] as const
  ).flatMap(([slug, date]) => [
    { url: `${SITE}/${slug}`,    lastModified: new Date(date), changeFrequency: 'monthly' as const, priority: 0.6 },
    { url: `${SITE}/en/${slug}`, lastModified: new Date(date), changeFrequency: 'monthly' as const, priority: 0.45 },
  ]);

  // Landings por ciudad y por tipo de propiedad — palabra clave real,
  // prioridad alta (mismo nivel que /locales-comerciales-cancun e
  // /invertir-en-cancun, que ya estaban en staticRoutes).
  const keywordLandingRoutes: MetadataRoute.Sitemap = (
    [
      ['cancun', DATES.cancun],
      ['puerto-cancun', DATES.puertoCancun],
      ['playa-del-carmen', DATES.playaDelCarmen],
      ['tulum', DATES.tulum],
      ['departamentos', DATES.departamentos],
      ['locales-comerciales', DATES.localesComerciales],
      ['lotes-residenciales', DATES.lotesResidenciales],
      ['listings', DATES.listings],
    ] as const
  ).flatMap(([slug, date]) => [
    { url: `${SITE}/${slug}`,    lastModified: new Date(date), changeFrequency: 'weekly' as const, priority: 0.85 },
    { url: `${SITE}/en/${slug}`, lastModified: new Date(date), changeFrequency: 'weekly' as const, priority: 0.65 },
  ]);

  const plazaRoutes: MetadataRoute.Sitemap = allHrefs.flatMap((href) => [
    {
      url: `${SITE}${href}`,
      lastModified: devDate(href),
      changeFrequency: 'weekly',
      priority: 0.95,
    },
    {
      url: `${SITE}/en${href}`,
      lastModified: devDate(href),
      changeFrequency: 'weekly',
      priority: 0.75,
    },
  ]);

  const blogSlugs = [
    ['vivir-en-playa-del-carmen', DATES.blogVivirEnPlayaDelCarmen],
    ['terrenos-en-venta-cancun', DATES.blogTerrenosEnVentaCancun],
    ['vivir-en-puerto-cancun', DATES.blogVivirEnPuertoCancun],
    ['donde-comprar-departamento-en-cancun', DATES.blogDondeComprarDepartamentoEnCancun],
    ['desarrollos-inmobiliarios-en-cancun', DATES.blogDesarrollosInmobiliariosEnCancun],
    ['como-invertir-en-locales-comerciales-en-cancun', DATES.blogComoInvertirEnLocalesComercialesEnCancun],
    ['cuanto-cuesta-un-local-comercial-en-cancun', DATES.blogCuantoCuestaUnLocalComercialEnCancun],
    ['mejores-zonas-para-negocio-en-cancun', DATES.blogMejoresZonasParaNegocioEnCancun],
    ['local-comercial-vs-departamento-cancun', DATES.blogLocalComercialVsDepartamentoCancun],
    ['guia-comprar-en-preventa-cancun', DATES.blogGuiaComprarEnPreventaCancun],
    ['invertir-en-cancun-desde-monterrey-cdmx', DATES.blogInvertirEnCancunDesdeMonterreyCdmx],
  ] as const;

  // Artículos en inglés — solo bajo /en/, igual que /en/condos-for-sale-*:
  // la ruta sin prefijo redirige ahí, así que listarla sería listar un redirect.
  const blogSlugsEn = [
    ['buying-property-in-mexico-as-a-foreigner', DATES.blogBuyingPropertyInMexicoAsAForeigner],
    ['best-areas-to-buy-in-cancun', DATES.blogBestAreasToBuyInCancun],
    ['closing-costs-when-buying-property-in-mexico', DATES.blogClosingCosts],
    ['pre-construction-vs-move-in-ready-cancun', DATES.blogPreConstructionVsMoveInReady],
    ['is-cancun-real-estate-a-good-investment', DATES.blogIsCancunGoodInvestment],
  ] as const;

  const blogRoutes: MetadataRoute.Sitemap = [
    { url: `${SITE}/blog`, lastModified: new Date(DATES.blog), changeFrequency: 'weekly', priority: 0.85 },
    { url: `${SITE}/en/blog`, lastModified: new Date(DATES.blog), changeFrequency: 'weekly', priority: 0.8 },
    ...blogSlugs.map(([slug, date]) => ({
      url: `${SITE}/blog/${slug}`,
      lastModified: new Date(date),
      changeFrequency: 'monthly' as const,
      priority: 0.85,
    })),
    ...blogSlugsEn.map(([slug, date]) => ({
      url: `${SITE}/en/blog/${slug}`,
      lastModified: new Date(date),
      changeFrequency: 'monthly' as const,
      priority: 0.85,
    })),
  ];

  return [...staticRoutes, ...developerRoutes, ...keywordLandingRoutes, ...plazaRoutes, ...blogRoutes];
}
