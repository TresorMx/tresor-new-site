import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import DeptosSeoPageEs, {
  type DeptosFaq,
  type DeptosZona,
  type DeptosRelatedLink,
} from '@/components/category/DeptosSeoPageEs';
import { getMergedDevelopmentsAsync, isListingRelationship } from '@/lib/developments';

export const dynamic = 'force-dynamic';

// Página de contenido en ESPAÑOL para "departamentos en venta en puerto
// cancún". Equivalente de /en/condos-for-sale-puerto-cancun, que ya existía.
//
// Alcance vs. las páginas vecinas (así es como NO se canibalizan):
//   · /departamentos-en-venta-cancun  → toda la ciudad, Puerto Cancún incluido
//     (es una zona DENTRO de Cancún, y quien busca la ciudad espera verla)
//   · ESTA                            → solo Puerto Cancún
//   · /puerto-cancun                  → TODOS los tipos de propiedad en la zona
// Es exactamente la misma relación que ya existe en inglés entre
// /en/condos-for-sale-cancun y /en/condos-for-sale-puerto-cancun.
//
// Distinta también de /luxury-condos-puerto-cancun: esa es landing de pauta
// (sin chrome, bloqueada a un solo desarrollo, noindex). Esta lleva header,
// footer y enlaces internos — es la que compite en orgánico.
//
// Solo vive en español: la variante /en/ redirige a la página de condos.
const PATH = '/departamentos-en-venta-puerto-cancun';
const URL_ES = `https://www.tresor.mx${PATH}`;

const TITLE = 'Departamentos en Venta en Puerto Cancún — Precios y Disponibilidad';
const DESCRIPTION =
  'Departamentos en venta en Puerto Cancún desde $15,289,000 MXN. Residencias frente a la marina dentro de la comunidad privada con campo de golf — preventa y entrega inmediata.';

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: { absolute: `${TITLE} · Tresor Real Estate` },
    description: DESCRIPTION,
    keywords: [
      'departamentos en venta puerto cancun',
      'departamentos puerto cancun',
      'comprar departamento en puerto cancun',
      'departamentos frente a la marina cancun',
      'departamentos de lujo cancun',
      'residencias puerto cancun',
    ],
    alternates: {
      canonical: URL_ES,
      languages: {
        es: URL_ES,
        // El equivalente real en inglés es la página de condos, no una
        // traducción de esta URL.
        en: 'https://www.tresor.mx/en/condos-for-sale-puerto-cancun',
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

// Puerto Cancún es UNA sola zona, así que este bloque no lista colonias como
// en las páginas de ciudad — describe qué hay dentro de la comunidad, que es
// justo lo que la diferencia del resto de Cancún. Todos son elementos reales
// y documentados del plan maestro de FONATUR.
const ZONAS: DeptosZona[] = [
  {
    nombre: 'La marina privada',
    descripcion:
      'Posiciones para embarcaciones dentro del propio desarrollo. No es un club náutico al que se llega en coche: es parte del paisaje cotidiano y lo que define el frente de agua de los condominios.',
  },
  {
    nombre: 'Campo de golf de 18 hoyos',
    descripcion:
      'Integrado al trazo residencial. Además del uso deportivo funciona como una enorme reserva de área verde que ninguna torre puede ocupar — parte de por qué la densidad se mantiene baja.',
  },
  {
    nombre: 'Beach club y acceso a playa',
    descripcion:
      'La comunidad tiene su propio club de playa, así que los propietarios no dependen de accesos públicos. Es una de las diferencias prácticas más grandes frente a otras zonas residenciales de la ciudad.',
  },
  {
    nombre: 'Plaza comercial y acceso controlado',
    descripcion:
      'Comercio, restaurantes y servicios dentro del polígono, con vigilancia en los accesos. Se resuelve el día a día sin salir de la comunidad, a minutos del aeropuerto y de la Zona Hotelera.',
  },
];

const FAQS: DeptosFaq[] = [
  {
    q: '¿Cuánto cuesta un departamento en Puerto Cancún?',
    a: 'Es el segmento más alto de la ciudad. En nuestro portafolio actual las residencias en Puerto Cancún arrancan en $15,289,000 MXN y superan los $19,000,000 MXN según el desarrollo, la torre, el piso y la superficie. Para dimensionarlo: un departamento en un corredor residencial de Cancún arranca alrededor de $2,690,000 MXN. Precios sujetos a cambio sin previo aviso.',
  },
  {
    q: '¿Por qué Puerto Cancún es más caro que el resto de Cancún?',
    a: 'Por una razón estructural: la oferta es finita. Es un polígono cerrado y planeado por FONATUR sobre 327 hectáreas, que no puede expandirse ni densificarse libremente. Cada torre nueva reduce el suelo disponible y no hay forma de crear más. Esa escasez, sumada a la marina, el golf y el acceso controlado, es lo que sostiene el precio por encima del resto de la ciudad.',
  },
  {
    q: '¿Comprar un departamento incluye el golf o la marina?',
    a: 'No automáticamente. El club de golf y la marina operan sus propias membresías y rentas de posición, separadas de la compra del departamento. Algunos desarrollos negocian accesos o condiciones preferentes para propietarios, así que conviene preguntar específicamente qué incluye tu unidad antes de firmar — varía edificio por edificio.',
  },
  {
    q: '¿Qué hay disponible hoy en Puerto Cancún?',
    a: 'Dos desarrollos activos, ambos de Urban Homes: Vellmari, en preventa, con 98 residencias de 169 a 714 m² frente a la marina; y Blume, con entrega inmediata, 113 unidades entre condominios y penthouses, con muelle propio. La preventa ofrece mejor precio y planes de pago durante la obra; la entrega inmediata permite habitar o rentar desde el primer día.',
  },
  {
    q: '¿Se puede rentar un departamento en Puerto Cancún?',
    a: 'Sí, y la zona tiene demanda tanto de renta residencial de largo plazo como vacacional. Pero es una comunidad residencial, no una franja hotelera: el perfil se inclina más a estancias largas y segunda residencia que a renta de alta rotación. Las reglas de renta corta las define el reglamento interno de cada condominio — si tu objetivo es rentar, dilo desde el inicio para mostrarte solo los que lo permiten.',
  },
  {
    q: '¿Qué tan lejos está del aeropuerto y de la Zona Hotelera?',
    a: 'Puerto Cancún está a minutos del arranque de la Zona Hotelera y con acceso directo a las vialidades que conectan con el Aeropuerto Internacional de Cancún. Es una de sus mayores ventajas prácticas: se vive en un entorno cerrado sin quedar aislado de la ciudad ni de la playa.',
  },
  {
    q: '¿Además del precio, qué otros costos debo considerar?',
    a: 'La cuota de mantenimiento, que cambia bastante entre condominios según las amenidades que operan, y los gastos de escrituración (impuesto de adquisición, notario, registro). Conviene pedir ambos por escrito, proyecto por proyecto, antes de comparar — es información general, no asesoría legal ni fiscal.',
  },
  {
    q: '¿Puedo comprar si vivo en otra ciudad o en el extranjero?',
    a: 'Sí, es muy común en este segmento. Hacemos recorridos por videollamada, te compartimos disponibilidad y planos en tiempo real, y la compra puede cerrarse a distancia mediante poder notarial. Si eres extranjero, la propiedad se adquiere vía fideicomiso bancario por estar en zona costera — un esquema estándar con décadas de uso.',
  },
];

const RELATED: DeptosRelatedLink[] = [
  { href: '/departamentos-en-venta-cancun', label: 'Cancún', sub: 'Todas las zonas de la ciudad, desde Av. Huayacán hasta la Zona Hotelera.' },
  { href: '/departamentos-en-venta-playa-del-carmen', label: 'Playa del Carmen', sub: 'Departamentos a minutos de la Quinta Avenida y el mar Caribe.' },
  { href: '/tulum', label: 'Tulum', sub: 'Preventa en el destino de mayor crecimiento del Caribe Mexicano.' },
];

export default async function DepartamentosEnVentaPuertoCancunPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  // Contenido solo en español — ver nota de arriba.
  if (locale === 'en') redirect('/en/condos-for-sale-puerto-cancun');

  const all = await getMergedDevelopmentsAsync();
  const developments = all.filter(
    (d) =>
      d.propertyType === 'Departamento' &&
      d.city === 'Puerto Cancún' &&
      !isListingRelationship(d.relationship),
  );

  return (
    <DeptosSeoPageEs
      canonicalPath={PATH}
      heroImage="/desarrollos/Vellmari/ENTREGAFINAL_CADU_VELMARI_AEREA01.jpg"
      heroImageAlt="Departamentos en venta en Puerto Cancún — marina, campo de golf y residencias"
      h1="Departamentos en Venta en Puerto Cancún"
      heroSubtitle="Residencias frente a la marina dentro de la comunidad privada con campo de golf — a minutos de la Zona Hotelera y del aeropuerto."
      gridEyebrow="Puerto Cancún"
      gridTitle="Residencias disponibles"
      gridTitleMuted="en Puerto Cancún hoy"
      developments={developments}
      introTitle="Una comunidad cerrada"
      introTitleMuted="alrededor de una marina y un campo de golf"
      introBody={[
        'Puerto Cancún no es una colonia más ni un fraccionamiento cerrado: es un polígono de 327 hectáreas planeado desde cero por FONATUR, entre el centro de la ciudad y el arranque de la Zona Hotelera. Marina privada, campo de golf de 18 hoyos, club de playa y plaza comercial detrás de un solo acceso controlado.',
        'El costo de eso es el precio. Es el segmento premium del mercado local: las residencias aquí arrancan alrededor de $15,289,000 MXN, contra unos $2,690,000 MXN por un departamento en uno de los corredores en crecimiento de la ciudad. Estás pagando el enclave, el frente de agua y la escasez de suelo dentro de él.',
        'Como el inventario es reducido y está concentrado en pocas torres, la disponibilidad por tipología cambia rápido. Lo que ves abajo es lo que está realmente abierto hoy: si un plano no aparece, es porque ya se vendió.',
      ]}
      zonas={ZONAS}
      zonasEyebrow="— La comunidad"
      zonasTitle="Qué hay dentro"
      zonasTitleMuted="de Puerto Cancún"
      faqs={FAQS}
      relatedLinks={RELATED}
      breadcrumbCity="Puerto Cancún"
      breadcrumbCityHref="/puerto-cancun"
    />
  );
}
