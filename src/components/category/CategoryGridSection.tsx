import SalesPartnerGrid from '@/components/home/SalesPartnerGrid';
import type { Development } from '@/lib/developments';

const SITE = 'https://www.tresor.mx';

// Sección de cards + filtros para las landings de categoría (tipo/ciudad/
// desarrollador) — misma envoltura visual (gradiente gris, container-wrap)
// que ya usa la sección "Sales Partner" del home; solo cambia qué filtros
// de SalesPartnerGrid se muestran.
export default function CategoryGridSection({
  eyebrow,
  title,
  developments,
  showDeveloperFilter = true,
  showStatusFilter = true,
  // Apagado por default: las landings por tipo (/departamentos, etc.) ya
  // vienen pre-filtradas a un solo tipo, así que el filtro sería inútil ahí.
  // /listings sí lo prende — mezcla Local Comercial, Bodega y lo que se
  // agregue después, es la única landing de categoría donde el tipo varía.
  showTypeFilter = false,
  // Apagado por default por la misma razón que el de tipo: las landings de
  // ciudad ya vienen pre-filtradas a una sola ciudad. Lo prende /desarrollos,
  // que es el único hub que muestra TODO el portafolio sin pre-filtrar.
  showCityFilter = false,
  forceDriveLink = false,
  // ── Schema (CollectionPage + ItemList + BreadcrumbList) ──
  // Opt-in: 16 páginas de categoría (ciudad, desarrollador, tipo) usaban este
  // componente sin emitir NADA de structured data — a diferencia de las 3
  // páginas /departamentos-en-venta-{ciudad}, que sí lo tienen vía
  // DeptosSeoPageEs. Se agrega aquí, compartido, para no repetir el JSON-LD
  // 16 veces. Solo se emite si se pasa `schemaUrl` — así una página que no
  // quiera esto (ninguna hoy) no se ve forzada a pasar los otros props.
  schemaUrl,
  schemaName,
  schemaDescription,
  // Etiqueta del breadcrumb "Inicio > {breadcrumbLabel}". Todas las páginas
  // que usan este componente son hijas directas de home (rutas planas, sin
  // anidar bajo otra categoría) — de ahí el breadcrumb de 2 niveles fijo.
  breadcrumbLabel,
  locale = 'es-MX',
}: {
  eyebrow: string;
  title: React.ReactNode;
  developments: Development[];
  showDeveloperFilter?: boolean;
  showStatusFilter?: boolean;
  showTypeFilter?: boolean;
  showCityFilter?: boolean;
  // Landings espejo /drive/* — ver DevelopmentCard.
  forceDriveLink?: boolean;
  schemaUrl?: string;
  schemaName?: string;
  schemaDescription?: string;
  breadcrumbLabel?: string;
  locale?: string;
}) {
  // Mismo criterio que DeptosSeoPageEs: solo fichas con href real entran al
  // ItemList. Un desarrollo sin ficha (href '#') emitiría una URL rota
  // "https://www.tresor.mx#" en el schema.
  const listed = developments.filter((d) => d.href !== '#');

  const jsonLd = schemaUrl
    ? [
        {
          '@context': 'https://schema.org',
          '@type': 'CollectionPage',
          name: schemaName,
          description: schemaDescription,
          url: schemaUrl,
          inLanguage: locale,
          ...(listed.length > 0 && {
            mainEntity: {
              '@type': 'ItemList',
              numberOfItems: listed.length,
              itemListElement: listed.map((d, i) => ({
                '@type': 'ListItem',
                position: i + 1,
                name: d.name,
                url: `${SITE}${d.href}`,
              })),
            },
          }),
        },
        {
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: locale === 'en_US' ? 'Home' : 'Inicio', item: SITE },
            { '@type': 'ListItem', position: 2, name: breadcrumbLabel ?? schemaName, item: schemaUrl },
          ],
        },
      ]
    : null;

  return (
    <section
      data-nav="light"
      className="relative z-10 -mt-10 rounded-[2.5rem] py-20 md:py-28"
      style={{ backgroundImage: 'linear-gradient(180deg, #f7f8fa 0%, #f2f3f5 55%, #eceef1 100%)' }}
    >
      {jsonLd && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      )}
      <div className="container-wrap">
        <SalesPartnerGrid
          developments={developments}
          showDeveloperFilter={showDeveloperFilter}
          showCityFilter={showCityFilter}
          showTypeFilter={showTypeFilter}
          showStatusFilter={showStatusFilter}
          forceDriveLink={forceDriveLink}
        >
          <div>
            <span className="eyebrow eyebrow-accent font-bold">{eyebrow}</span>
            <h2 className="mt-4 font-sans text-[clamp(24px,3.2vw,48px)] font-normal leading-[1.05] tracking-tight">
              {title}
            </h2>
          </div>
        </SalesPartnerGrid>
      </div>
    </section>
  );
}
