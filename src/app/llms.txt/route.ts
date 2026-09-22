import { getMergedDevelopmentsAsync, developers, isListingRelationship } from '@/lib/developments';
import { articlesEs, articlesEn } from '@/lib/blogArticles';
import { SOCIAL_PROFILES } from '@/lib/social';

// /llms.txt — índice en Markdown para motores de IA (formato de llmstxt.org).
//
// Honestidad sobre su impacto: es un estándar propuesto, no oficial. Google
// dice que no lo usa; algunas herramientas de IA sí lo leen. Se agrega porque
// es un archivo aparte que no toca ninguna página ni el SEO existente — el
// costo es cero y el mantenimiento también, porque se GENERA del catálogo.
//
// Por qué se genera y no es un .txt estático en public/: los precios y el
// inventario cambian (Sanity + developments.ts). Un archivo a mano quedaría
// desactualizado y un motor de IA terminaría citando un precio viejo — peor
// que no tener el archivo.
//
// Qué NO incluye, a propósito:
//   - Landings de Google Ads/Meta: son noindex, solo para tráfico pagado.
//   - La zona de cada desarrollo: el campo `zone` del catálogo tiene datos
//     incorrectos confirmados (Quattro Gardens/Long Island NO están sobre
//     Av. Huayacán). Solo se usa la ciudad, que sí es correcta.
//   - Cifras de trayectoria ("+2,000" vs "+3,000" unidades): el sitio hoy se
//     contradice entre el footer y /desarrollo — no se repite ninguna hasta
//     confirmar cuál es la correcta.
//
// El middleware de idiomas ignora rutas con punto (ver matcher en
// src/middleware.ts), así que esta ruta no se redirige a /es o /en.
export const dynamic = 'force-dynamic';

const SITE = 'https://www.tresor.mx';

const PAGES_ES: [string, string, string][] = [
  ['/desarrollos', 'Todos los desarrollos', 'Portafolio completo en Cancún, Puerto Cancún, Playa del Carmen y Tulum: departamentos, locales comerciales y lotes.'],
  ['/departamentos-en-venta-cancun', 'Departamentos en venta en Cancún', 'Inventario, precios por zona, preventa vs. entrega inmediata y preguntas frecuentes.'],
  ['/departamentos-en-venta-puerto-cancun', 'Departamentos en venta en Puerto Cancún', 'Residencias en la comunidad con marina, campo de golf y club de playa.'],
  ['/departamentos-en-venta-playa-del-carmen', 'Departamentos en venta en Playa del Carmen', 'Departamentos cerca de la Quinta Avenida y el mar Caribe.'],
  ['/locales-comerciales-cancun', 'Locales comerciales en Cancún', 'Locales en preventa en las plazas Quattro Plaza Center.'],
  ['/lotes-residenciales', 'Lotes residenciales', 'Terrenos para construir en Cancún.'],
  ['/quattro-plaza-center', 'Quattro Plaza Center', 'Línea de plazas comerciales desarrolladas por Tresor Real Estate.'],
  ['/urban-homes', 'Urban Homes', 'Desarrollos de Urban Homes comercializados por Tresor.'],
  ['/onix-living', 'Onix Living', 'Desarrollos de Onix Living comercializados por Tresor.'],
  ['/live-desarrollos', 'Live Desarrollos', 'Desarrollos de Live Desarrollos (familia Wow Condos) comercializados por Tresor.'],
  ['/agenda', 'Agenda una visita', 'Visita presencial o por videollamada con un asesor.'],
];

const PAGES_EN: [string, string, string][] = [
  ['/en/condos-for-sale-cancun', 'Condos for sale in Cancún', 'Inventory, prices by area and how foreigners buy property in Mexico (fideicomiso, closing costs).'],
  ['/en/condos-for-sale-puerto-cancun', 'Condos for sale in Puerto Cancún', 'Marina-front residences inside the gated golf community.'],
  ['/en/condos-for-sale-playa-del-carmen', 'Condos for sale in Playa del Carmen', 'Condos near Fifth Avenue and the Caribbean Sea.'],
  ['/en/desarrollos', 'All developments', 'The full portfolio across Cancún, Puerto Cancún, Playa del Carmen and Tulum.'],
];

const link = ([path, title, desc]: [string, string, string]) => `- [${title}](${SITE}${path}): ${desc}`;
const oneLine = (s: string) => s.replace(/\s+/g, ' ').trim();

export async function GET() {
  const all = await getMergedDevelopmentsAsync();

  // Solo desarrollos con ficha real: sin href '#' (ficha pendiente) ni
  // "próximamente" (no hay nada que comprar todavía).
  const devs = all.filter((d) => d.href && d.href !== '#' && !d.comingSoon && d.href.startsWith('/'));
  const forSale = devs.filter((d) => !isListingRelationship(d.relationship));
  const listings = devs.filter((d) => isListingRelationship(d.relationship));

  const devLine = (d: (typeof devs)[number]) => {
    const parts = [
      [d.propertyType, d.city].filter(Boolean).join(' en '),
      d.status,
      d.priceLabel,
      developers[d.developer]?.name ? `Desarrollador: ${developers[d.developer].name}` : null,
    ].filter(Boolean);
    const desc = d.description ? ` ${oneLine(d.description)}` : '';
    return `- [${d.name}](${SITE}${d.href}): ${parts.join('. ')}.${desc}`;
  };

  const today = new Date().toISOString().slice(0, 10);

  const body = `# Tresor Real Estate

> Desarrollador y comercializador inmobiliario en Cancún y la Riviera Maya (Quintana Roo, México). Departamentos, locales comerciales y lotes residenciales en preventa y entrega inmediata, en Cancún, Puerto Cancún, Playa del Carmen y Tulum. Desarrolla sus propias plazas comerciales (Quattro Plaza Center) y comercializa proyectos de desarrolladoras como Urban Homes, Onix Living y Live Desarrollos.

- Sitio: ${SITE} (español) y ${SITE}/en (inglés)
- Contacto: hello@tresor.mx · +52 998 404 5602 · Cancún, Quintana Roo, México
- Perfiles oficiales: ${SOCIAL_PROFILES.map((p) => `${p.name} ${p.url}`).join(' · ')}
- Precios en pesos mexicanos (MXN), sujetos a cambio sin previo aviso; confirma disponibilidad con un asesor. Lista generada del inventario actual el ${today}.

## Páginas principales

${PAGES_ES.map(link).join('\n')}

## English pages (for foreign buyers)

${PAGES_EN.map(link).join('\n')}

## Desarrollos en venta

${forSale.map(devLine).join('\n')}

## Renta y venta (listings)

${listings.map(devLine).join('\n')}

## Blog (español)

${articlesEs.map((a) => `- [${a.title}](${SITE}/blog/${a.slug}): ${oneLine(a.description)}`).join('\n')}

## Blog (English)

${articlesEn.map((a) => `- [${a.title}](${SITE}/en/blog/${a.slug}): ${oneLine(a.description)}`).join('\n')}
`;

  return new Response(body, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      // Una hora en CDN: suficientemente fresco para precios, sin regenerar
      // en cada visita de un bot.
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
    },
  });
}
