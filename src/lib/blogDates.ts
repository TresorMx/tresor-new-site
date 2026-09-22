// Fechas de publicación y de última modificación REAL de cada artículo —
// fuente única para el schema Article (datePublished/dateModified) de cada
// blog y para el <lastmod> del sitemap. Antes cada blog repetía la fecha de
// publicación como dateModified aunque se hubiera editado después, y el
// sitemap tenía su propia copia: tres lugares que se desincronizaban.
//
// Por qué importa: la frescura es señal para Google y sobre todo para los
// motores de IA (GEO) — prefieren citar la fuente más reciente. Pero SOLO
// sirve si es honesta: inflar dateModified sin cambio real es una práctica
// que Google identifica y descuenta.
//
// CRITERIO de "modificado" (revisado commit por commit con git log):
//   CUENTA:    cambios que el lector ve en el cuerpo del artículo — precios
//              actualizados, párrafos o enlaces de interlinking agregados.
//   NO CUENTA: rediseño/layout del blog, hero, canonical, og:image,
//              metadatos, cambio de foto, tarjetas de "artículos
//              relacionados", corrección de un slug (mismo contenido).
//
// REGLA al editar un artículo: si cambias el contenido real, actualiza
// `modified` aquí. Si es un ajuste de estilo o un typo, no.
export const BLOG_DATES: Record<string, { published: string; modified: string }> = {
  // ── Español ──
  'como-invertir-en-locales-comerciales-en-cancun': { published: '2026-06-23', modified: '2026-06-23' },
  'cuanto-cuesta-un-local-comercial-en-cancun':     { published: '2026-06-23', modified: '2026-06-23' },
  'guia-comprar-en-preventa-cancun':                { published: '2026-06-23', modified: '2026-06-23' },
  'invertir-en-cancun-desde-monterrey-cdmx':        { published: '2026-06-23', modified: '2026-06-23' },
  'mejores-zonas-para-negocio-en-cancun':           { published: '2026-06-23', modified: '2026-06-23' },
  // 14 ago: párrafo de interlinking hacia /departamentos-en-venta-cancun.
  'local-comercial-vs-departamento-cancun':         { published: '2026-06-23', modified: '2026-08-14' },
  // 14 ago: interlinking. 4 sep: precio de Valmira.
  'desarrollos-inmobiliarios-en-cancun':            { published: '2026-07-18', modified: '2026-09-04' },
  // 7 ago: precio de Puerto Cancún. 14 ago: interlinking. 4 sep: precio de Valmira.
  'donde-comprar-departamento-en-cancun':           { published: '2026-07-19', modified: '2026-09-04' },
  // 14 ago: interlinking hacia /departamentos-en-venta-puerto-cancun.
  'vivir-en-puerto-cancun':                         { published: '2026-07-24', modified: '2026-08-14' },
  // 14 ago: enlace y texto ancla hacia /departamentos-en-venta-cancun.
  'terrenos-en-venta-cancun':                       { published: '2026-08-07', modified: '2026-08-14' },
  // 14 ago: enlace y texto ancla hacia /departamentos-en-venta-playa-del-carmen.
  'vivir-en-playa-del-carmen':                      { published: '2026-08-13', modified: '2026-08-14' },

  // ── English ──
  // 20 ago: párrafo de interlinking hacia Playa del Carmen.
  'buying-property-in-mexico-as-a-foreigner':       { published: '2026-08-06', modified: '2026-08-20' },
  'closing-costs-when-buying-property-in-mexico':   { published: '2026-08-06', modified: '2026-08-20' },
  'pre-construction-vs-move-in-ready-cancun':       { published: '2026-08-06', modified: '2026-08-20' },
  // 7 ago: precio de Puerto Cancún. 4 sep: precio de Valmira.
  'best-areas-to-buy-in-cancun':                    { published: '2026-08-06', modified: '2026-09-04' },
  // 4 sep: precio de Valmira.
  'is-cancun-real-estate-a-good-investment':        { published: '2026-08-28', modified: '2026-09-04' },
};

/** dateModified del artículo; cae a `fallback` (su fecha de publicación) si no está en el mapa. */
export function blogModified(slug: string, fallback: string): string {
  return BLOG_DATES[slug]?.modified ?? fallback;
}
