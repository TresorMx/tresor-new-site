import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import DeptosSeoPageEs, {
  type DeptosFaq,
  type DeptosZona,
  type DeptosRelatedLink,
} from '@/components/category/DeptosSeoPageEs';
import { getMergedDevelopmentsAsync, isListingRelationship } from '@/lib/developments';

export const dynamic = 'force-dynamic';

// Página de contenido en ESPAÑOL para "departamentos en venta en playa del
// carmen". Tercera de la serie (después de Cancún), mismo componente y
// mismo criterio para NO canibalizar:
//   · /departamentos                          → departamentos de TODA la región
//   · /departamentos-en-venta-playa-del-carmen → solo Playa del Carmen
//   · /playa-del-carmen                       → TODOS los tipos de propiedad en la ciudad
// Equivalente en español de /en/condos-for-sale-playa-del-carmen.
//
// Solo vive en español: la ruta cuelga de [locale], así que la variante /en/
// redirige a su equivalente real en inglés en vez de dejar una URL española
// sirviendo contenido traducido a medias.
const PATH = '/departamentos-en-venta-playa-del-carmen';
const URL_ES = `https://www.tresor.mx${PATH}`;

const TITLE = 'Departamentos en Venta en Playa del Carmen — Precios y Disponibilidad';
const DESCRIPTION =
  'Departamentos en venta en Playa del Carmen desde $2,244,000 MXN. Entrega inmediata a minutos de la Quinta Avenida y el mar Caribe — precio directo del desarrollador.';

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: { absolute: `${TITLE} · Tresor Real Estate` },
    description: DESCRIPTION,
    keywords: [
      'departamentos en venta playa del carmen',
      'departamentos en venta en playa del carmen',
      'departamentos playa del carmen',
      'comprar departamento en playa del carmen',
      'departamentos quinta avenida playa del carmen',
      'departamentos entrega inmediata playa del carmen',
    ],
    alternates: {
      canonical: URL_ES,
      languages: {
        es: URL_ES,
        // El equivalente real en inglés es la página de condos, no una
        // traducción de esta URL.
        en: 'https://www.tresor.mx/en/condos-for-sale-playa-del-carmen',
        'x-default': URL_ES,
      },
    },
    openGraph: {
      title: TITLE,
      description: DESCRIPTION,
      url: URL_ES,
      images: [{ url: '/ogfinal.jpg', width: 1200, height: 630 }],
      locale: 'es_MX',
      type: 'website',
    },
    robots: { index: true, follow: true },
  };
}

// Zonas reales y bien conocidas de Playa del Carmen — no se inventa ninguna.
// A diferencia de Cancún, hoy solo tenemos inventario en la zona residencial
// (La Selva), pero las otras dos existen y son las que compara cualquiera
// que investigue la ciudad antes de comprar.
const ZONAS: DeptosZona[] = [
  {
    nombre: 'Quinta Avenida / Centro',
    descripcion:
      'El corazón turístico y comercial de la ciudad: el corredor peatonal frente al mar donde están los restaurantes, tiendas y la vida nocturna. Ticket de entrada más alto por la cercanía a la playa y al movimiento constante de la zona.',
  },
  {
    nombre: 'Playacar',
    descripcion:
      'Comunidad privada al sur del centro, con campo de golf y acceso directo a la playa. El segmento residencial más establecido y de mayor plusvalía histórica de Playa del Carmen.',
  },
  {
    nombre: 'Zona Residencial (poniente)',
    descripcion:
      'El corredor donde hoy está creciendo la ciudad tierra adentro, a minutos de la Quinta Avenida y de Playa Xcalacoco. Es la zona de entrada más accesible del mercado — aquí está nuestro inventario activo.',
  },
];

const FAQS: DeptosFaq[] = [
  {
    q: '¿Cuánto cuesta un departamento en Playa del Carmen?',
    a: 'En nuestro portafolio actual, un departamento de entrega inmediata en Playa del Carmen arranca en $2,244,000 MXN. El precio sube según qué tan cerca esté de la Quinta Avenida y de la playa — esa cercanía mueve el precio por metro cuadrado más que la superficie del departamento. Precios sujetos a cambio sin previo aviso; un asesor te confirma el vigente.',
  },
  {
    q: '¿Cuál es el enganche para comprar en Playa del Carmen?',
    a: 'Depende del desarrollo y de si está en preventa o entrega inmediata. En preventa el esquema más común es un apartado, seguido de un enganche y mensualidades sin intereses hasta la entrega. En entrega inmediata el esquema es distinto porque el inmueble ya existe. Pide el plan de pagos vigente del proyecto que te interese.',
  },
  {
    q: '¿Qué zona de Playa del Carmen conviene más?',
    a: 'Depende de tu objetivo. Si buscas cercanía a la vida turística y renta vacacional inmediata, la Quinta Avenida y el centro tienen el mercado más maduro. Si buscas patrimonio y un entorno más establecido, Playacar es el segmento alto. Y si buscas el mejor precio de entrada, la zona residencial hacia el poniente es donde la ciudad está creciendo hoy — ahí está nuestro inventario activo.',
  },
  {
    q: '¿Playa del Carmen es buena para renta vacacional?',
    a: 'Sí, es una de sus razones principales de compra. La comunidad internacional que ya vive en la ciudad sostiene una demanda de renta menos estacional que en destinos puramente turísticos. Como en cualquier zona, las reglas de renta corta las define el reglamento interno de cada condominio, no la ciudad en general — conviene confirmarlas antes de comprar.',
  },
  {
    q: '¿Conviene más preventa o entrega inmediata?',
    a: 'Resuelven cosas distintas. En preventa entras a mejor precio y con la mejor selección de unidades, pero esperas a la entrega. En entrega inmediata pagas más, pero ves exactamente lo que compras y puedes habitarlo o rentarlo desde el primer día — que es justo lo que ofrece nuestro inventario activo hoy en la ciudad.',
  },
  {
    q: '¿Puedo comprar si vivo en otra ciudad o en el extranjero?',
    a: 'Sí, es muy común en nuestro portafolio. Hacemos recorridos por videollamada, te compartimos disponibilidad y planos en tiempo real, y la compra puede cerrarse a distancia mediante poder notarial. Muchos clientes visitan Playa del Carmen una sola vez, ya con la decisión tomada.',
  },
  {
    q: '¿Cobran comisión por la asesoría?',
    a: 'No. Somos comercializadores autorizados y nuestra comisión la paga el desarrollador. El precio que pagas es el mismo que si fueras directo con ellos, pero con acompañamiento durante todo el proceso.',
  },
];

const RELATED: DeptosRelatedLink[] = [
  { href: '/departamentos-en-venta-cancun', label: 'Cancún', sub: 'El portafolio más amplio: desde Av. Huayacán hasta Puerto Cancún.' },
  { href: '/puerto-cancun', label: 'Puerto Cancún', sub: 'Residencias frente a la marina, dentro de una comunidad privada con campo de golf.' },
  { href: '/tulum', label: 'Tulum', sub: 'Preventa en el destino de mayor crecimiento del Caribe Mexicano.' },
];

export default async function DepartamentosEnVentaPlayaDelCarmenPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  // Contenido solo en español — ver nota de arriba.
  if (locale === 'en') redirect('/en/condos-for-sale-playa-del-carmen');

  const all = await getMergedDevelopmentsAsync();
  const developments = all.filter(
    (d) =>
      d.propertyType === 'Departamento' &&
      d.city === 'Playa del Carmen' &&
      !isListingRelationship(d.relationship),
  );

  return (
    <DeptosSeoPageEs
      canonicalPath={PATH}
      heroImage="/desarrollos/la-selva/aerial-comunidad.avif"
      heroImageAlt="Departamentos en venta en Playa del Carmen"
      h1="Departamentos en Venta en Playa del Carmen"
      heroSubtitle="Entrega inmediata a minutos de la Quinta Avenida y el mar Caribe — con precio directo del desarrollador y disponibilidad real."
      gridEyebrow="Playa del Carmen"
      gridTitle="Departamentos disponibles"
      gridTitleMuted="en Playa del Carmen hoy"
      developments={developments}
      introTitle="Playa del Carmen no es un solo mercado"
      introTitleMuted="y el precio lo demuestra"
      introBody={[
        'La Quinta Avenida y el centro viven del turismo y de la renta vacacional; Playacar es una comunidad privada con golf y playa pensada como patrimonio; y la zona residencial hacia el poniente es donde la ciudad realmente está creciendo, con precios de entrada más accesibles.',
        'Esa mezcla es lo que hace que la misma ciudad funcione para presupuestos muy distintos. En nuestro portafolio actual un departamento de entrega inmediata arranca en $2,244,000 MXN — el ticket de entrada más bajo de nuestro catálogo en la Riviera Maya.',
        'Lo que casi nadie compara bien no es el precio por metro cuadrado, sino qué tan avanzado está el desarrollo y quién lo construye. Por eso aquí solo listamos desarrollos activos de desarrolladoras que ya entregaron proyectos en Quintana Roo, con disponibilidad real: si una unidad ya se vendió, no aparece.',
      ]}
      zonas={ZONAS}
      zonasTitle="Dónde comprar"
      zonasTitleMuted="departamento en Playa del Carmen"
      faqs={FAQS}
      relatedLinks={RELATED}
      breadcrumbCity="Playa del Carmen"
      breadcrumbCityHref="/playa-del-carmen"
    />
  );
}
