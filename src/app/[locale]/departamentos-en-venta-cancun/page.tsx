import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import DeptosSeoPageEs, {
  type DeptosFaq,
  type DeptosZona,
  type DeptosRelatedLink,
} from '@/components/category/DeptosSeoPageEs';
import { getMergedDevelopmentsAsync, isListingRelationship } from '@/lib/developments';

export const dynamic = 'force-dynamic';

// Página de contenido en ESPAÑOL para "departamentos en venta en cancún".
//
// Existe aparte de /departamentos por ALCANCE, no por keyword — que es lo que
// evita que se canibalicen:
//   · /departamentos              → departamentos de TODA la región
//                                   (Cancún, Tulum, Playa del Carmen).
//   · /departamentos-en-venta-cancun → solo Cancún y Puerto Cancún.
//   · /cancun                     → TODOS los tipos de propiedad en Cancún.
// Cada una responde una búsqueda distinta y muestra un inventario distinto.
// Es la misma arquitectura que en inglés (/en/departamentos vs.
// /en/condos-for-sale-cancun), donde ya está probada: la página de ciudad
// rankea en primera página sin canibalizar a la regional.
//
// Solo vive en español: la ruta cuelga de [locale], así que la variante /en/
// redirige a su equivalente real en inglés en vez de dejar una URL española
// sirviendo contenido traducido a medias.
const PATH = '/departamentos-en-venta-cancun';
const URL_ES = `https://www.tresor.mx${PATH}`;

const TITLE = 'Departamentos en Venta en Cancún — Precios y Disponibilidad';
const DESCRIPTION =
  'Departamentos en venta en Cancún desde $2,595,000 MXN. Preventa y entrega inmediata en Av. Huayacán, Vía Cumbres, Lausana, Zona Hotelera y Puerto Cancún — precio directo del desarrollador.';

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: { absolute: `${TITLE} · Tresor Real Estate` },
    description: DESCRIPTION,
    keywords: [
      'departamentos en venta cancun',
      'departamentos en venta en cancun',
      'departamentos cancun',
      'comprar departamento en cancun',
      'departamentos en preventa cancun',
      'departamentos av huayacan cancun',
      'departamentos zona hotelera cancun',
    ],
    alternates: {
      canonical: URL_ES,
      languages: {
        es: URL_ES,
        // El equivalente real en inglés es la página de condos, no una
        // traducción de esta URL.
        en: 'https://www.tresor.mx/en/condos-for-sale-cancun',
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

// Zonas reales donde hoy tenemos inventario — no se inventa ninguna.
// Ver el filtro de abajo: Vía Cumbres, Lausana, Huayacán, Zona Hotelera y
// Puerto Cancún son las zonas de los 10 desarrollos que lista esta página.
const ZONAS: DeptosZona[] = [
  {
    nombre: 'Av. Huayacán',
    descripcion:
      'El corredor donde más se está construyendo hoy en Cancún. Es la zona de entrada natural al mercado: aquí están los departamentos con el precio más accesible de nuestro portafolio, con escuelas, hospitales y plazas siguiendo a la vivienda nueva.',
  },
  {
    nombre: 'Lausana Residencial',
    descripcion:
      'Comunidad privada planeada al sur de la ciudad, con más de 15 hectáreas de áreas verdes, lagos y ciclovías. Perfil residencial familiar, con vistas al paseo Lausana y al campo de golf.',
  },
  {
    nombre: 'Vía Cumbres',
    descripcion:
      'Zona residencial consolidada al poniente, con acceso rápido al centro y a la Av. Huayacán. Departamentos pensados tanto para vivir como para renta a largo plazo.',
  },
  {
    nombre: 'Zona Hotelera',
    descripcion:
      'Frente al mar Caribe y con la demanda turística más alta de la ciudad. Ticket de entrada más elevado, pero es la zona con el mercado de renta vacacional más maduro de Cancún.',
  },
  {
    nombre: 'Puerto Cancún',
    descripcion:
      'Comunidad privada con marina y campo de golf, el segmento más alto de la ciudad. Residencias de lujo pensadas como segunda casa o patrimonio, no como primera compra.',
  },
  {
    nombre: 'Zona Huayacán / Centro',
    descripcion:
      'El área que conecta el corredor de Huayacán con el resto de la ciudad. Aquí encuentras opciones de entrega inmediata, útiles si buscas habitar o rentar desde el primer día.',
  },
];

const FAQS: DeptosFaq[] = [
  {
    q: '¿Cuánto cuesta un departamento en Cancún?',
    a: 'En nuestro portafolio actual los departamentos en Cancún van desde $2,595,000 MXN, sobre Av. Huayacán, hasta más de $19,000,000 MXN para residencias frente a la marina en Puerto Cancún. El precio depende sobre todo de la zona, la superficie y la fecha de entrega. Precios sujetos a cambio sin previo aviso; un asesor te confirma el vigente.',
  },
  {
    q: '¿Cuál es el enganche para comprar en preventa?',
    a: 'Varía por desarrollo. El esquema más común en preventa es un apartado (desde $25,000 MXN en varios de nuestros proyectos), seguido de un enganche y mensualidades sin intereses hasta la entrega. En entrega inmediata el esquema es distinto, porque el inmueble ya existe. Pide el plan de pagos vigente del proyecto que te interese.',
  },
  {
    q: '¿Puedo comprar con crédito hipotecario?',
    a: 'Depende del desarrollo y de la etapa. Durante la preventa la mayoría de nuestros compradores usa el plan de pagos directo del desarrollador, y el crédito bancario entra normalmente al momento de la escrituración o en unidades de entrega inmediata. Coméntale a tu asesor cómo planeas pagar y te muestra qué desarrollos aceptan tu esquema.',
  },
  {
    q: '¿Qué zona de Cancún conviene más?',
    a: 'Depende de tu objetivo. Si buscas el mejor precio de entrada y plusvalía a mediano plazo, el corredor de Av. Huayacán es donde más está creciendo la ciudad. Si tu prioridad es renta vacacional, la Zona Hotelera tiene el mercado más maduro. Y si buscas patrimonio o segunda casa, Puerto Cancún es el segmento alto. Arriba tienes el detalle de cada zona.',
  },
  {
    q: '¿Conviene más preventa o entrega inmediata?',
    a: 'Resuelven cosas distintas. En preventa entras a mejor precio y con la mejor selección de unidades, pero esperas a la entrega. En entrega inmediata pagas más, pero ves exactamente lo que compras y puedes habitarlo o rentarlo desde el primer día. Trabajamos con las dos, y solo con desarrolladoras que ya entregaron proyectos en Quintana Roo.',
  },
  {
    q: '¿Puedo rentar el departamento después?',
    a: 'En la mayoría de los casos sí, pero las reglas de renta corta las define el reglamento interno de cada condominio, no la zona. Si tu objetivo es rentar, dilo desde el inicio para mostrarte solo los desarrollos cuyo régimen lo permite. Ten en cuenta también que el ingreso por renta es gravable y hay que declararlo ante el SAT.',
  },
  {
    q: '¿Puedo comprar si vivo en otra ciudad?',
    a: 'Sí, es muy común en nuestro portafolio. Hacemos recorridos por videollamada, te compartimos disponibilidad y planos en tiempo real, y la compra puede cerrarse a distancia mediante poder notarial. Muchos clientes visitan Cancún una sola vez, ya con la decisión tomada.',
  },
  {
    q: '¿Cobran comisión por la asesoría?',
    a: 'No. Somos comercializadores autorizados y nuestra comisión la paga el desarrollador. El precio que pagas es el mismo que si fueras directo con ellos, pero con acompañamiento y con la posibilidad de comparar entre varios proyectos.',
  },
];

const RELATED: DeptosRelatedLink[] = [
  { href: '/puerto-cancun', label: 'Puerto Cancún', sub: 'Residencias frente a la marina, dentro de una comunidad privada con campo de golf.' },
  { href: '/playa-del-carmen', label: 'Playa del Carmen', sub: 'Departamentos a pasos de la Quinta Avenida y el mar Caribe.' },
  { href: '/tulum', label: 'Tulum', sub: 'Preventa en el destino de mayor crecimiento del Caribe Mexicano.' },
];

export default async function DepartamentosEnVentaCancunPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  // Contenido solo en español — ver nota de arriba.
  if (locale === 'en') redirect('/en/condos-for-sale-cancun');

  const all = await getMergedDevelopmentsAsync();
  // Puerto Cancún se incluye a propósito: es una zona DENTRO de Cancún, y
  // quien busca "departamentos en venta en cancún" espera verla. Se excluyen
  // los Listings por el mismo criterio que el resto de las landings.
  const developments = all.filter(
    (d) =>
      d.propertyType === 'Departamento' &&
      (d.city === 'Cancún' || d.city === 'Puerto Cancún') &&
      !isListingRelationship(d.relationship),
  );

  return (
    <DeptosSeoPageEs
      canonicalPath={PATH}
      heroImage="/desarrollos/villalta/portada2.jpg"
      heroImageAlt="Departamentos en venta en Cancún"
      h1="Departamentos en Venta en Cancún"
      heroSubtitle="Preventa y entrega inmediata en las zonas de mayor crecimiento de la ciudad — con precio directo del desarrollador y disponibilidad real."
      gridEyebrow="Cancún"
      gridTitle="Departamentos disponibles"
      gridTitleMuted="en Cancún hoy"
      developments={developments}
      introTitle="Cancún no es un solo mercado"
      introTitleMuted="y el precio lo demuestra"
      introBody={[
        'La Zona Hotelera vive del turismo y de la renta vacacional; Puerto Cancún es una comunidad privada con marina y golf pensada como segunda casa; y los corredores tierra adentro —Av. Huayacán, Vía Cumbres, Lausana— son donde la ciudad realmente está creciendo, con escuelas, hospitales y plazas siguiendo a la vivienda nueva.',
        'Esa mezcla es lo que hace que la misma ciudad funcione para presupuestos muy distintos. En nuestro portafolio actual un departamento en un corredor residencial en crecimiento arranca en $2,595,000 MXN, mientras que una residencia frente a la marina en Puerto Cancún supera los $19,000,000 MXN. Misma ciudad, productos completamente distintos.',
        'Lo que casi nadie compara bien no es el precio por metro cuadrado, sino qué tan avanzado está el desarrollo y quién lo construye. Por eso aquí solo listamos desarrollos activos de desarrolladoras que ya entregaron proyectos en Quintana Roo, con disponibilidad real: si una unidad ya se vendió, no aparece.',
      ]}
      zonas={ZONAS}
      zonasTitle="Dónde comprar"
      zonasTitleMuted="departamento en Cancún"
      faqs={FAQS}
      relatedLinks={RELATED}
      breadcrumbCity="Cancún"
      breadcrumbCityHref="/cancun"
    />
  );
}
