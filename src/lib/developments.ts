// ────────────────────────────────────────────────────────────────────────────
// Portafolio Tresor — semilla del modelo "Desarrollo" (placeholder, pre-Sanity)
// Imágenes provisionales (renders de Quattro / lifestyle). Sustituir con assets
// reales por desarrollo. Este archivo se migra a Sanity en la Fase 5.
//
// Modelo unificado: TODOS los desarrollos viven aquí. Cada sección del home
// (WE DEVELOP / SALES PARTNER) filtra por `relationship`.
// ────────────────────────────────────────────────────────────────────────────

import { getPlazaBySlugAsync, getMinAvailablePrice } from '@/lib/data';
import type { Unit, PaymentPlan, UnitSpecTemplate, I18nText } from '@/lib/types';
import type { AmenityKey } from '@/lib/amenities';

export type { I18nText };

export type City = 'Cancún' | 'Puerto Cancún' | 'Puerto Morelos' | 'Playa del Carmen' | 'Tulum';
export type PropertyType = 'Departamento' | 'Casa' | 'Lote Residencial' | 'Local Comercial';
export type DevType = 'Residencial' | 'Comercial' | 'Lotes' | 'Mixto';
export type Intent = 'vivir' | 'invertir' | 'negocio';
export type DevStatus = 'Preventa' | 'En obra' | 'Entrega inmediata' | 'Próximamente';

// Etapa comercial — es la pastilla (badge) que aparece sobre la foto del card.
// Eje DISTINTO a DevType/PropertyType: describe el momento de venta, no el tipo
// de inmueble. Futuro filtro (aún NO en la UI). Hoy solo usamos 'Preventa'.
export type SalesStage = 'Preventa' | 'Lanzamiento' | 'Últimas unidades' | 'Entrega inmediata';

// Relación de Tresor con el desarrollo:
//  - develop:       Tresor es el desarrollador (WE DEVELOP)
//  - sales-partner: Tresor comercializa proyecto de otro desarrollador (master broker)
//  - listings:      (futuro) reventa / propiedades en lista
//  - rentals:       (futuro) propiedades en renta
export type Relationship = 'develop' | 'sales-partner' | 'listings' | 'rentals';

// Desarrolladores (Tresor + socios actuales)
export type DeveloperId = 'Tresor' | 'Live' | 'Onix' | 'Urban Homes';
// Alias retro-compat: el código actual usa `Developer` como el id.
export type Developer = DeveloperId;

// ── Entidad Desarrollador (lookup) ──
// El bloque "Empresa desarrolladora" vive AQUÍ, no repetido en cada desarrollo.
// Los 3 Quattro comparten el de Tresor; los 4 Live el de Live. La ficha lo jala
// por `dev.developer`. En Sanity será un document type `developer`.
export interface DeveloperEntity {
  id: DeveloperId;
  name: string;              // "Tresor Real Estate", "Live Desarrollos"…
  logoDark?: string;         // sobre fondo claro (bloque desarrollador)
  logoWhite?: string;        // sobre foto (hero/OG)
  blockLabel: I18nText;      // "Empresa desarrolladora" / "Desarrollado por"
  credentials?: I18nText;    // copy del bloque
}

export const developers: Record<DeveloperId, DeveloperEntity> = {
  Tresor: {
    id: 'Tresor',
    name: 'Tresor Real Estate',
    logoDark: '/logos/LogoTresor-ink.svg',
    logoWhite: '/logos/LogoTresor.svg',
    blockLabel: { es: 'Empresa desarrolladora', en: 'The developer' },
    credentials: {
      es: 'Más de 20 años de experiencia, 25 desarrollos concebidos y más de 2,000 hogares entregados respaldan a Tresor como una de las desarrolladoras más sólidas de Cancún y la Riviera Maya.',
      en: 'Over 20 years of experience, 25 developments and more than 2,000 homes delivered position Tresor as one of the most solid developers in Cancún and the Riviera Maya.',
    },
  },
  Live: {
    id: 'Live',
    name: 'Live Desarrollos',
    logoDark: '/logos-desarrolladores/live.svg',
    blockLabel: { es: 'Desarrollado por', en: 'Developed by' },
    credentials: {
      es: 'Live Desarrollos crea espacios residenciales de lujo en las zonas de mayor plusvalía de Cancún, combinando diseño contemporáneo con amenidades de primer nivel.',
      en: 'Live Desarrollos creates luxury residential spaces in Cancún\'s highest-value areas, combining contemporary design with first-class amenities.',
    },
  },
  Onix: {
    id: 'Onix',
    name: 'Onix Living',
    logoDark: '/logos-desarrolladores/Onix.svg',
    blockLabel: { es: 'Desarrollado por', en: 'Developed by' },
    credentials: {
      es: 'Más de 1,000 unidades vendidas y entregadas respaldan a Onix Living, una desarrolladora enfocada en comunidades residenciales modernas, bien planeadas y en armonía con su entorno — diseño contemporáneo, ubicación estratégica y una apuesta clara por la plusvalía a largo plazo.',
      en: 'More than 1,000 units sold and delivered stand behind Onix Living, a developer focused on modern, thoughtfully planned residential communities in harmony with their surroundings — contemporary design, strategic locations and a clear commitment to long-term value.',
    },
  },
  'Urban Homes': {
    id: 'Urban Homes',
    name: 'Urban Homes',
    logoDark: '/logos-desarrolladores/urbanhomes.avif',
    logoWhite: '/logos-desarrolladores/logowhiteurban.webp',
    blockLabel: { es: 'Desarrollado por', en: 'Developed by' },
    credentials: {
      es: 'Más de 18 años de experiencia en Quintana Roo, 22 desarrollos y más de 5,000 viviendas entregadas en Puerto Cancún, Playa del Carmen y Tulum respaldan a Urban Homes como referente del estándar de vida de lujo en la zona más exclusiva de Cancún.',
      en: 'More than 18 years of experience in Quintana Roo, 22 developments and over 5,000 homes delivered in Puerto Cancún, Playa del Carmen and Tulum position Urban Homes as the benchmark for luxury living in Cancún\'s most exclusive area.',
    },
  },
};

// Modo del módulo master plan: interactivo (pines + inventario, Tresor) o
// estático (solo imagen con zoom, Sales Partner sin inventario).
export type MasterPlanMode = 'interactive' | 'static';

// Bloque de amenidades (para Sales Partner sobre todo).
// Una amenidad es una referencia a `AMENITY_CATALOG` (src/lib/amenities.ts) —
// nunca texto libre. Se selecciona por `key`; el label y el ícono salen del
// catálogo solos. `labelOverride` es un escape hatch por si un desarrollo
// necesita un texto distinto al genérico del catálogo (ej. "3 Lagos" en vez
// de "Lagos"), sin tener que crear una entrada nueva en el catálogo.
export interface Amenity {
  key: AmenityKey;
  labelOverride?: string;
}

// Un dato de ficha técnica de una tipología (ej. "Área interior: 103 m²").
// `value` ya viene formateado como string porque las unidades varían entre
// desarrollos (m², m 2, etc.) — no vale la pena forzar un número + unit fijos
// cuando el dato real llega así de las fichas técnicas de cada developer.
export interface FloorPlanSpec {
  key: string;
  label: I18nText;
  value: string;
}

export interface FloorPlanTypology {
  slug: string;               // key estable para tabs/React, ej. 'estudio'
  label: I18nText;            // "Estudio", "2 PH + Terraza"… (título completo de la ficha técnica)
  shortLabel?: I18nText;      // versión corta para el tab/pill (ej. "1 Rec. + Studio" en vez de
                               // "1 Recámara + 1 Studio"). Si no se define, el tab usa `label`.
  image?: string;
  specs: FloorPlanSpec[];     // flexible por tipología — cada una trae lo que aplica
  virtualTourUrl?: string;    // si existe, se muestra el botón "Tour virtual"
  order?: number;
}

// Módulo editorial genérico — eyebrow + título + descripción + imagen
// opcional. Para historias que no encajan en ningún módulo fijo de la ficha
// (ej. "conectividad", "sustentabilidad", "el entorno"). Un desarrollo puede
// tener varios; cada uno se intercala blanco/gris igual que el resto.
export interface ContentBlock {
  eyebrow?: I18nText;
  title: I18nText;
  titleMuted?: I18nText;       // parte del título en gris (mismo patrón lead+muted del resto)
  description: I18nText;
  image?: string;
  // 'side-by-side' (2 columnas, imagen a un lado) si hay imagen; si no hay
  // imagen siempre es efectivamente texto centrado. 'stacked' = imagen abajo,
  // tamaño de la galería (ancho completo, aspect 16/7). Default: side-by-side.
  layout?: 'stacked' | 'side-by-side';
  imagePosition?: 'left' | 'right';  // solo aplica en 'side-by-side'. Default: 'right'.
  // CTA opcional (ej. "Vista Panorámica" de un masterplan/residencial) — abre
  // `url` en el mismo modal/iframe que usa el "Tour virtual" de floor plans.
  cta?: { label: I18nText; url: string };
}

export interface Development {
  slug: string;
  name: string;
  relationship: Relationship;
  developer: Developer;
  brand?: string; // etiqueta de marca a mostrar (puede coincidir con developer)
  city: City;
  zone?: string;
  type: DevType;
  intent: Intent[];
  priceFrom?: number;
  currency?: 'MXN' | 'USD';
  status: DevStatus;
  deliveryWindow?: string;
  image: string;
  href: string;
  featured?: boolean;
  // Campos de presentación (card estilo WE DEVELOP)
  tab?: string;         // etiqueta corta para el tab del carrusel, ej. 'Long Island'
  logo?: string;        // logo blanco para sobreponer en la foto
  phases?: string;      // etapas/sub-marcas, ej. 'Long Island · RIO · Aqua'
  description?: string; // copy del card
  priceLabel?: string;  // etiqueta de precio override, ej. 'Desde $2,650,000 MXN + IVA'
  badge?: string;       // etiqueta del badge override (si no, usa status)
  propertyType?: PropertyType; // tipo específico para filtros (más granular que `type`)
  logoScale?: number;   // factor de escala del logo sobre la foto (1 = base).
                        // Ajustable por desarrollo: algunos logos pesan más
                        // visualmente y conviene reducirlos. En Sanity será un campo.
  comingSoon?: boolean; // si true, el CTA del card se muestra desactivado (gris)
                        // porque el desarrollo aún no tiene página/venta activa.

  // ─── Capa de ficha (todo opcional; el módulo se enciende si el dato existe) ───
  heroRender?: string;              // foto grande del hero de la ficha
  heroLogoScale?: number;           // factor de escala del logo del hero de FICHA
                                     // (1 = base). Independiente de `logoScale`
                                     // (esa es para el card). Aplica a desktop; en
                                     // mobile se reduce 30% automático salvo que
                                     // `heroLogoScaleMobile` lo especifique distinto.
                                     // Ajustable por desarrollo — en Sanity será un campo.
  heroLogoScaleMobile?: number;     // override manual del logo del hero SOLO en mobile
                                     // (si no se define, cae al heurístico heroLogoScale*0.7)
  heroImagePosition?: {             // encuadre de la foto del hero por dispositivo
    mobile?: 'top' | 'center' | 'bottom';   // default: 'center'
    desktop?: 'top' | 'center' | 'bottom';  // default: 'center'
  };
  contentBlocks?: ContentBlock[];   // módulo(s) editorial(es) genérico(s), ver arriba
  highlights?: { label: string; labelEn?: string; value: string; valueEn?: string }[]; // barra de detalle
  tagline?: I18nText;              // subtítulo corto
  projectTitle?: I18nText;         // título de la sección "El Proyecto" (parte sólida)
  projectTitleMuted?: I18nText;    // remate del título en gris (patrón del home:
                                    // protagonista sólido + apoyo gris). Opcional —
                                    // en Sanity será un 2do campo de texto junto al título.
  projectBody?: I18nText[];        // párrafos de "El Proyecto"
  gallery?: string[];              // → módulo Galería (si length > 0)
  amenitiesGallery?: string[];     // fotos curadas para la columna vertical
                                    // del módulo Amenidades (1 o varias).
  amenities?: Amenity[];           // → módulo Amenidades (si existe)
  location?: { lat: number; lng: number; address: string }; // → módulo Mapa
  locationBullets?: I18nText[];    // 3 puntos de venta bajo el mapa (íconos fijos en UI)
  floorPlans?: FloorPlanTypology[]; // → módulo Floor Plans (si length > 0). Flexible:
                                    // cada tipología trae SUS PROPIOS specs (un local
                                    // comercial no mide lo mismo que un depto con
                                    // terraza) — no hay una forma fija de "área/frente/
                                    // fondo" para todos los desarrollos.
  unitSpecsTemplate?: UnitSpecTemplate[]; // specs configurables de las tipologías
  masterPlan?: { image: string; imageLevel2?: string }; // → módulo Master Plan
  masterPlanMode?: MasterPlanMode; // 'interactive' (Tresor) | 'static' (SP)
  paymentPlans?: PaymentPlan[];    // → esquemas de pago (si length > 0)

  // ─── Inventario en vivo (SOLO Tresor; su presencia enciende disponibilidad ───
  //     + botón "Ver disponibilidad" en floor plans + precio calculado) ───
  units?: Unit[];

  // ─── Toggles explícitos (el dato existe pero la feature puede estar apagada) ──
  quoterEnabled?: boolean;         // el cotizador está listo (hoy = showAgendaWidget invertido)
  reservationEnabled?: boolean;    // apartado en línea disponible (enciende el tab "Aparta ahora")
  reservationAmount?: number;      // monto del apartado en MXN. Si no se define, ver getReservationAmount()

  // ─── Textos de CTA — override opcional con default sensato. La mayoría de
  // desarrollos nunca llena esto; existe para cuando un botón necesita decir
  // algo distinto al genérico (ej. "Agenda tu recorrido" en vez de "Agendar
  // una visita"). Lo ESTRUCTURAL (si el botón existe) sigue siendo por datos
  // (ej. virtualTourUrl presente/ausente), no por este campo. ──
  ctaLabels?: {
    scheduleVisit?: I18nText;  // default: "Agendar una visita"
    virtualTour?: I18nText;    // default: "Tour virtual"
    reserve?: I18nText;        // default: "Reservar mi lugar"
  };

  // ─── Gancho para la vista Broker (se materializa en su fase; reservado) ───
  brokerAssets?: { label: string; url: string }[];

  // ─── SEO por ficha ───
  seoTitle?: I18nText;
  seoDescription?: I18nText;
}

export const developments: Development[] = [
  {
    slug: 'quattro-long-island',
    name: 'Quattro Long Island',
    relationship: 'develop',
    developer: 'Tresor',
    brand: 'Tresor Real Estate',
    city: 'Cancún',
    zone: 'Av. Huayacán',
    type: 'Comercial',
    intent: ['invertir', 'negocio'],
    priceFrom: 2650000,
    currency: 'MXN',
    status: 'Preventa',
    deliveryWindow: '2026',
    image: '/renders/long-island/WEB.jpg',
    href: '/desarrollos/long-island',
    featured: true,
    tab: 'Long Island',
    logo: '/logos/QuattroLongIslandLogoWhite.svg',
    logoScale: 1.25,
    phases: 'Long Island · RIO · Aqua',
    description:
      'Plaza comercial con locales en preventa, ubicada en una de las zonas con mayor dinamismo y crecimiento de todo Cancún.',
    priceLabel: 'Desde $2,650,000 MXN + IVA',
    badge: 'Preventa',
    propertyType: 'Local Comercial',
  },
  {
    slug: 'quattro-gardens',
    name: 'Quattro Gardens',
    relationship: 'develop',
    developer: 'Tresor',
    brand: 'Tresor Real Estate',
    city: 'Cancún',
    zone: 'Av. Huayacán',
    type: 'Comercial',
    intent: ['invertir', 'negocio'],
    priceFrom: 1968600,
    currency: 'MXN',
    status: 'Preventa',
    deliveryWindow: '2027',
    image: '/renders/gardens/03.jpg',
    href: '/desarrollos/gardens',
    featured: true,
    tab: 'Gardens',
    logo: '/logos/QuattroGardensLogoWhite.svg',
    logoScale: 1.25,
    phases: 'Jardines · Zienna · Ciudadela',
    description:
      'Plaza comercial con locales en preventa, ubicada en una de las zonas con mayor dinamismo y crecimiento de todo Cancún.',
    priceLabel: 'Desde $1,968,600 MXN + IVA',
    badge: 'Lanzamiento',
    propertyType: 'Local Comercial',
  },
  // ── Placeholder: duplicado de Gardens para el tab SELVA (assets pendientes) ──
  {
    slug: 'quattro-selva',
    name: 'Quattro Selva',
    relationship: 'develop',
    developer: 'Tresor',
    brand: 'Tresor Real Estate',
    city: 'Cancún',
    zone: 'Av. Huayacán',
    type: 'Comercial',
    intent: ['invertir', 'negocio'],
    priceFrom: 1968600,
    currency: 'MXN',
    status: 'Preventa',
    deliveryWindow: '2027',
    image: '/renders/gardens/05.jpg',
    href: '#',
    featured: true,
    tab: 'Selva',
    logo: '/logos/QuattroSelva.svg',
    // El archivo de Selva tiene mucho menos margen interno que los de Long
    // Island/Gardens (el trazo ocupa ~99% de su viewBox vs ~89% en los
    // otros) — a la MISMA escala numérica se ve más grande. Se compensa
    // con un logoScale menor para que el tamaño VISUAL quede igual.
    logoScale: 1.1,
    phases: 'Paseo de la Selva',
    description:
      'Nuestro próximo desarrollo en una de las zonas de mayor plusvalía de Cancún. Muy pronto revelaremos todos los detalles.',
    priceLabel: 'Desde $1,968,600 MXN + IVA',
    badge: 'Próximamente',
    propertyType: 'Local Comercial',
    comingSoon: true,
  },

  // ── SALES PARTNER · Live Desarrollos (Wow Condos) ──
  // Placeholders: foto, ciudad y precio pendientes de confirmar.
  {
    slug: 'esther-wow-condos',
    name: 'Esther Wow Condos',
    relationship: 'sales-partner',
    developer: 'Live',
    brand: 'Live Desarrollos',
    city: 'Cancún',
    zone: 'Vía Cumbres',
    type: 'Residencial',
    intent: ['vivir', 'invertir'],
    status: 'Preventa',
    image: '/desarrollos/esther/Fachada-frontal.jpg',
    href: '/desarrollos/esther-wow-condos',
    featured: true,
    logo: '/desarrollos/esther/Esther.svg',
    logoScale: 0.8,
    badge: 'Preventa',
    propertyType: 'Departamento',
    priceLabel: 'Desde $3,500,000 MXN',
    description:
      'Departamentos en preventa de 1, 2 y 3 recámaras en Vía Cumbres, la zona de mayor crecimiento y plusvalía de Cancún, con amenidades de primer nivel.',
    // ── Apartado en línea ──
    reservationEnabled: true,
    reservationAmount: 25000,
    // ── Capa de ficha ──
    heroRender: '/desarrollos/esther/Vista-dron.jpg',
    heroLogoScale: 0.7,
    tagline: { es: 'Vive sobre avenida Huayacán, dentro de Vía Cumbres' },
    highlights: [
      { label: 'Ubicación', labelEn: 'Location', value: 'Vía Cumbres' },
      { label: 'Tipología', labelEn: 'Property type', value: '1 a 3 Rec y PH', valueEn: '1 to 3 Bed & PH' },
      { label: 'Superficie', labelEn: 'Size', value: 'Desde 67 m²', valueEn: 'From 67 sqm' },
    ],
    gallery: [
      '/desarrollos/esther/Sala-comedor.jpg',
      '/desarrollos/esther/27.-Cocina.jpg',
      '/desarrollos/esther/Recámara-principal.jpg',
      '/desarrollos/esther/Recámara-secundaria.jpg',
    ],
    projectTitle: { es: 'Departamentos de 1 a 3 recámaras' },
    projectTitleMuted: { es: 'en Vía Cumbres' },
    projectBody: [
      {
        es: 'Esther es un desarrollo de Live Desarrollos ubicado sobre **avenida Huayacán**, dentro de Vía Cumbres, una de las zonas de mayor crecimiento y plusvalía de Cancún.',
        en: 'Esther is a development by Live Desarrollos located on **Avenida Huayacán**, inside Vía Cumbres, one of Cancún\'s fastest-growing and highest-value areas.',
      },
      {
        es: 'Departamentos desde **67 m²**, con opciones de 1, 2 y 3 recámaras y penthouses con rooftop propio, pensados para quienes buscan vivir o invertir a minutos del aeropuerto y de la Zona Hotelera.',
        en: 'Apartments from **67 sqm**, with 1, 2 and 3-bedroom options plus penthouses with private rooftops, designed for those looking to live or invest minutes from the airport and the Hotel Zone.',
      },
    ],
    locationBullets: [
      { es: 'Sobre avenida Huayacán, dentro de Vía Cumbres' },
      { es: 'A 10 minutos del aeropuerto de Cancún' },
      { es: 'A 15 minutos de la Zona Hotelera' },
    ],
    amenities: [
      { key: 'alberca-recreativa', labelOverride: 'Alberca' },
      { key: 'area-lounge', labelOverride: 'Media Room' },
      { key: 'lobby' },
      { key: 'asadores', labelOverride: 'Área pergolada con asadores' },
      { key: 'seguridad-24-7' },
    ],
    floorPlans: [
      {
        slug: '1rec',
        label: { es: '1 Recámara' },
        image: '/desarrollos/esther/floor plans/1Rec.jpg',
        specs: [
          { key: 'recamaras', label: { es: 'Recámaras' }, value: '1' },
          { key: 'banos', label: { es: 'Baños' }, value: '1' },
          { key: 'balcon', label: { es: 'Balcón' }, value: 'Sí' },
          { key: 'areaTotal', label: { es: 'Área total' }, value: '67 m²' },
        ],
      },
      {
        slug: '2rec',
        label: { es: '2 Recámaras' },
        image: '/desarrollos/esther/floor plans/2Rec.jpg',
        specs: [
          { key: 'recamaras', label: { es: 'Recámaras' }, value: '2' },
          { key: 'banos', label: { es: 'Baños' }, value: '2' },
          { key: 'balcon', label: { es: 'Balcón' }, value: 'Sí' },
          { key: 'areaTotal', label: { es: 'Área total' }, value: '80 m²' },
        ],
      },
      {
        slug: 'garden-house-2rec',
        label: { es: 'Garden House | 2 Recámaras' },
        shortLabel: { es: 'Garden House 2 Rec.' },
        image: '/desarrollos/esther/floor plans/GardenHouse-2Rec.jpg',
        specs: [
          { key: 'recamaras', label: { es: 'Recámaras' }, value: '2' },
          { key: 'banos', label: { es: 'Baños' }, value: '2' },
          { key: 'balcon', label: { es: 'Balcón' }, value: 'Sí' },
          { key: 'areaTotal', label: { es: 'Área total' }, value: '96 m²' },
        ],
      },
      {
        slug: '3rec',
        label: { es: '3 Recámaras' },
        image: '/desarrollos/esther/floor plans/3Rec.jpg',
        specs: [
          { key: 'recamaras', label: { es: 'Recámaras' }, value: '3' },
          { key: 'banos', label: { es: 'Baños' }, value: '2' },
          { key: 'balcon', label: { es: 'Balcón' }, value: 'Sí' },
          { key: 'areaTotal', label: { es: 'Área total' }, value: '163 m²' },
        ],
      },
      {
        slug: 'ph-1rec',
        label: { es: 'PH 1 Recámara' },
        image: '/desarrollos/esther/floor plans/PH1Rec.jpg',
        specs: [
          { key: 'recamaras', label: { es: 'Recámaras' }, value: '1' },
          { key: 'banos', label: { es: 'Baños' }, value: '1' },
          { key: 'balcon', label: { es: 'Balcón + Rooftop' }, value: 'Sí' },
          { key: 'areaTotal', label: { es: 'Área total' }, value: '96 m²' },
        ],
      },
      {
        slug: 'ph-2rec',
        label: { es: 'PH 2 Recámaras' },
        image: '/desarrollos/esther/floor plans/PH2Rec.jpg',
        specs: [
          { key: 'recamaras', label: { es: 'Recámaras' }, value: '2' },
          { key: 'banos', label: { es: 'Baños' }, value: '2' },
          { key: 'balcon', label: { es: 'Balcón + Rooftop' }, value: 'Sí' },
          { key: 'areaTotal', label: { es: 'Área total' }, value: '109 m²' },
        ],
      },
      {
        slug: 'ph-3rec',
        label: { es: 'PH 3 Recámaras' },
        image: '/desarrollos/esther/floor plans/PH3Rec-1.jpg',
        specs: [
          { key: 'recamaras', label: { es: 'Recámaras' }, value: '3' },
          { key: 'banos', label: { es: 'Baños' }, value: '2' },
          { key: 'balcon', label: { es: 'Balcón' }, value: 'Sí' },
          { key: 'areaTotal', label: { es: 'Área total' }, value: '192 m²' },
        ],
      },
    ],
  },
  {
    slug: 'ximena-wow-condos',
    name: 'Ximena Wow Condos',
    relationship: 'sales-partner',
    developer: 'Live',
    brand: 'Live Desarrollos',
    city: 'Cancún',
    zone: 'Vía Cumbres',
    type: 'Residencial',
    intent: ['vivir', 'invertir'],
    status: 'Preventa',
    image: '/desarrollos/ximena/12.-Vista-Principal.jpg',
    href: '/desarrollos/ximena-wow-condos',
    featured: true,
    logo: '/desarrollos/ximena/Ximena.png',
    logoScale: 0.8,
    badge: 'Preventa',
    propertyType: 'Departamento',
    priceLabel: 'Desde $3,500,000 MXN',
    description:
      'Uno de los desarrollos más exclusivos de Cancún: departamentos de lujo de 1, 2 y 3 recámaras en Vía Cumbres, con diseño y amenidades de primer nivel.',
    // ── Apartado en línea ──
    reservationEnabled: true,
    reservationAmount: 25000,
    // ── Capa de ficha ──
    heroRender: '/desarrollos/ximena/2.-Fachada-de-Noche.jpg',
    heroLogoScale: 0.7,
    tagline: { es: 'Diseño contemporáneo dentro de Vía Cumbres' },
    highlights: [
      { label: 'Ubicación', labelEn: 'Location', value: 'Vía Cumbres' },
      { label: 'Tipología', labelEn: 'Property type', value: '1 a 3 Rec y PH', valueEn: '1 to 3 Bed & PH' },
      { label: 'Superficie', labelEn: 'Size', value: 'Desde 63 m²', valueEn: 'From 63 sqm' },
    ],
    gallery: [
      '/desarrollos/ximena/2.-Sala---Comedor_.jpg',
      '/desarrollos/ximena/3.-Cocina.jpg',
      '/desarrollos/ximena/1.-Recámara-Principal.jpg',
      '/desarrollos/ximena/4.-Recámara-Doble.jpg',
    ],
    amenitiesGallery: [
      '/desarrollos/ximena/5.-Alberca.jpg',
      '/desarrollos/ximena/10.-Kids-Club.jpg',
      '/desarrollos/ximena/8.-Coworking.jpg',
      '/desarrollos/ximena/9.-Yoga-Site.jpg',
    ],
    projectTitle: { es: 'Departamentos de 1 a 3 recámaras' },
    projectTitleMuted: { es: 'y Garden Houses en Vía Cumbres' },
    projectBody: [
      {
        es: 'Ximena es un desarrollo de Live Desarrollos que integra **diseño contemporáneo** y entorno natural dentro de Vía Cumbres, una de las zonas de mayor crecimiento y plusvalía de Cancún.',
        en: 'Ximena is a development by Live Desarrollos that blends **contemporary design** with natural surroundings inside Vía Cumbres, one of Cancún\'s fastest-growing and highest-value areas.',
      },
      {
        es: 'Departamentos de 1 a 3 recámaras, además de **Garden Houses y Penthouses**, pensados para brindar amplitud, iluminación natural y una distribución eficiente de cada espacio — para quienes buscan vivir o invertir con tranquilidad, seguridad y conectividad.',
        en: 'Apartments from 1 to 3 bedrooms, plus **Garden Houses and Penthouses**, designed for spaciousness, natural light and an efficient layout in every unit — for those looking to live or invest with peace of mind, security and connectivity.',
      },
    ],
    locationBullets: [
      { es: 'Sobre avenida Huayacán, dentro de Vía Cumbres' },
      { es: 'A 10 minutos del aeropuerto de Cancún' },
      { es: 'A 15 minutos de la Zona Hotelera' },
    ],
    amenities: [
      { key: 'alberca-recreativa', labelOverride: 'Alberca' },
      { key: 'zona-yoga', labelOverride: 'Yoga Site' },
      { key: 'gym' },
      { key: 'coworking' },
      { key: 'ludoteca', labelOverride: 'Kids Club' },
      { key: 'asadores', labelOverride: 'Área pergolada con asadores' },
      { key: 'lobby' },
      { key: 'seguridad-24-7' },
    ],
    contentBlocks: [
      {
        eyebrow: { es: '— Conoce el desarrollo' },
        title: { es: 'Parte de Vía Cumbres' },
        titleMuted: { es: 'un desarrollo urbano de gran escala' },
        description: {
          es: 'Ximena está ubicado dentro de Vía Cumbres, un innovador desarrollo habitacional en una de las mejores zonas de Cancún, resultado de una **colaboración entre la iniciativa privada y el gobierno** que sienta precedente en desarrollo urbano responsable y sostenible en la región. Fue inaugurado oficialmente a finales de **noviembre de 2024** por la gobernadora Mara Lezama.',
          en: 'Ximena sits inside Vía Cumbres, an innovative residential development in one of Cancún\'s best areas, the result of a **partnership between private investment and government** that sets a precedent for responsible, sustainable urban development in the region. It was officially inaugurated in **November 2024** by governor Mara Lezama.',
        },
        image: '/desarrollos/ximena/4.-Fachada-Áreas-Comunes.jpg',
        layout: 'side-by-side',
        imagePosition: 'right',
      },
    ],
    floorPlans: [
      {
        slug: '1rec',
        label: { es: '1 Recámara' },
        image: '/desarrollos/ximena/floor-plans/1Rec.jpg',
        specs: [
          { key: 'interior', label: { es: 'Área interior' }, value: '58 m²' },
          { key: 'exterior', label: { es: 'Área exterior' }, value: '5 m²' },
          { key: 'areaTotal', label: { es: 'Área total' }, value: '63 m²' },
        ],
      },
      {
        slug: '2rec',
        label: { es: '2 Recámaras' },
        image: '/desarrollos/ximena/floor-plans/2rec.jpg',
        specs: [
          { key: 'interior', label: { es: 'Área interior' }, value: '78 m²' },
          { key: 'exterior', label: { es: 'Área exterior' }, value: '5 m²' },
          { key: 'areaTotal', label: { es: 'Área total' }, value: '83 m²' },
        ],
      },
      {
        slug: 'garden-2rec',
        label: { es: 'Garden 2 Recámaras' },
        shortLabel: { es: 'Garden 2 Rec.' },
        image: '/desarrollos/ximena/floor-plans/Garden2Rec.jpg',
        specs: [
          { key: 'interior', label: { es: 'Área interior' }, value: '78 m²' },
          { key: 'exterior', label: { es: 'Área exterior' }, value: '20 m²' },
          { key: 'areaTotal', label: { es: 'Área total' }, value: '98 m²' },
        ],
      },
      {
        slug: '3rec',
        label: { es: '3 Recámaras' },
        image: '/desarrollos/ximena/floor-plans/3rec.jpg',
        specs: [
          { key: 'interior', label: { es: 'Área interior' }, value: '97 m²' },
          { key: 'exterior', label: { es: 'Área exterior' }, value: '5 m²' },
          { key: 'areaTotal', label: { es: 'Área total' }, value: '102 m²' },
        ],
      },
      {
        slug: 'ph-3rec',
        label: { es: 'PH 3 Recámaras' },
        image: '/desarrollos/ximena/floor-plans/ph.jpg',
        specs: [
          { key: 'interior', label: { es: 'Área interior' }, value: '133 m²' },
          { key: 'exterior', label: { es: 'Área exterior' }, value: '27 m²' },
          { key: 'areaTotal', label: { es: 'Área total' }, value: '160 m²' },
        ],
      },
    ],
  },
  {
    slug: 'loreta-wow-condos',
    name: 'Loreta Wow Condos',
    relationship: 'sales-partner',
    developer: 'Live',
    brand: 'Live Desarrollos',
    city: 'Cancún',
    zone: 'Lausana Residencial',
    type: 'Residencial',
    intent: ['vivir', 'invertir'],
    status: 'Preventa',
    image: '/desarrollos/loreta/7.-Piscina-Infinity_.jpg',
    href: '/desarrollos/loreta-wow-condos',
    featured: true,
    logo: '/desarrollos/loreta/Loreta.svg',
    logoScale: 0.8,
    badge: 'Preventa',
    propertyType: 'Departamento',
    priceLabel: 'Desde $3,800,000 MXN',
    description:
      'Preventa de departamentos desde 76 m² con vistas abiertas al paseo Lausana y al campo de golf, dentro del exclusivo Lausana Residencial en Cancún.',
    // ── Apartado en línea ──
    reservationEnabled: true,
    reservationAmount: 25000,
    // ── Capa de ficha ──
    heroRender: '/desarrollos/loreta/6.-Vista-Drone-2.jpg',
    heroLogoScale: 0.7,
    tagline: { es: 'Vive dentro de la primera Smart City de Cancún' },
    highlights: [
      { label: 'Ubicación', labelEn: 'Location', value: 'Lausana Residencial' },
      { label: 'Tipología', labelEn: 'Property type', value: '1 a 3 Rec y PH', valueEn: '1 to 3 Bed & PH' },
      { label: 'Superficie', labelEn: 'Size', value: 'Desde 79 m²', valueEn: 'From 79 sqm' },
    ],
    gallery: [
      '/desarrollos/loreta/21.-Sala-comedor---3-recámaras.jpg',
      '/desarrollos/loreta/27.-Cocina.jpg',
      '/desarrollos/loreta/19.-Recámara-Principal.jpg',
      '/desarrollos/loreta/20.-Recámara-Secundaria.jpg',
    ],
    amenitiesGallery: [
      '/desarrollos/loreta/10.-Alberca---Lago.jpg',
      '/desarrollos/loreta/12.-Gym-Wellness.jpg',
      '/desarrollos/loreta/16.-Spa.jpg',
      '/desarrollos/loreta/17.-Kids-Club.jpg',
    ],
    projectTitle: { es: 'Departamentos de 1 a 3 recámaras' },
    projectTitleMuted: { es: 'y Garden Houses en Lausana Residencial' },
    projectBody: [
      {
        es: 'Loreta es un desarrollo de Live Desarrollos dentro de **Lausana Residencial**, con vistas abiertas al paseo Lausana y al campo de golf, en una de las comunidades privadas de mayor plusvalía de Cancún.',
        en: 'Loreta is a development by Live Desarrollos inside **Lausana Residencial**, with open views of the Lausana promenade and the golf course, in one of Cancún\'s highest-value private communities.',
      },
      {
        es: 'Departamentos de 1 a 3 recámaras, además de **Garden Houses y Penthouses de doble altura**, con alberca infinity frente al lago, gimnasio, spa y kids club — pensados para quienes buscan vivir o invertir con la tranquilidad de una comunidad diseñada para todas las edades.',
        en: 'Apartments from 1 to 3 bedrooms, plus **double-height Garden Houses and Penthouses**, with an infinity pool facing the lake, a gym, spa and kids club — designed for those looking to live or invest with the peace of mind of a community built for every age.',
      },
    ],
    locationBullets: [
      { es: 'Dentro de Lausana Residencial, primera Smart City de Cancún' },
      { es: 'A 11 minutos del aeropuerto de Cancún' },
      { es: 'A 25 minutos de Puerto Cancún' },
    ],
    amenities: [
      { key: 'alberca-infinity', labelOverride: 'Piscina Infinity' },
      { key: 'gym', labelOverride: 'Gym & Wellness' },
      { key: 'sauna', labelOverride: 'Spa' },
      { key: 'ludoteca', labelOverride: 'Kids Club' },
      { key: 'lagos', labelOverride: 'Lago Lausana' },
      { key: 'pet-park' },
      { key: 'andadores-ciclovias', labelOverride: 'Ciclovía y andadores' },
      { key: 'area-lounge', labelOverride: 'Áreas sociales' },
    ],
    contentBlocks: [
      {
        eyebrow: { es: '— Conoce el desarrollo' },
        title: { es: 'Dentro de Lausana Residencial' },
        titleMuted: { es: 'la primera Smart City de Cancún' },
        description: {
          es: 'Lausana Residencial, al sur de Cancún, es la primera **Smart City** de la ciudad — diseño urbano de clase mundial, conectividad y amenidades para todas las edades distribuidas en más de **15 hectáreas de áreas verdes**, con lagos, ciclovías y parques.',
          en: 'Lausana Residencial, south of Cancún, is the city\'s first **Smart City** — world-class urban design, connectivity and amenities for every age spread across more than **15 hectares of green areas**, with lakes, bike paths and parks.',
        },
        image: '/desarrollos/loreta/lausanamapa.png',
        layout: 'side-by-side',
        imagePosition: 'right',
        cta: {
          label: { es: 'Vista Panorámica', en: 'Panoramic View' },
          url: 'https://s3.us-east-2.amazonaws.com/live.vt/LORETA+VT/index.htm',
        },
      },
    ],
    floorPlans: [
      {
        slug: '1rec',
        label: { es: '1 Recámara' },
        image: '/desarrollos/loreta/floor-plans/1rec.png',
        specs: [
          { key: 'interior', label: { es: 'Área interior' }, value: '60 m²' },
          { key: 'exterior', label: { es: 'Área exterior' }, value: '16 m²' },
          { key: 'areaTotal', label: { es: 'Área total' }, value: '79 m²' },
        ],
      },
      {
        slug: '2rec',
        label: { es: '2 Recámaras' },
        image: '/desarrollos/loreta/floor-plans/2rec.jpg',
        specs: [
          { key: 'interior', label: { es: 'Área interior' }, value: '90 m²' },
          { key: 'exterior', label: { es: 'Área exterior' }, value: '21 m²' },
          { key: 'areaTotal', label: { es: 'Área total' }, value: '111 m²' },
        ],
      },
      {
        slug: '3rec',
        label: { es: '3 Recámaras' },
        image: '/desarrollos/loreta/floor-plans/3rec.jpg',
        specs: [
          { key: 'interior', label: { es: 'Área interior' }, value: '115 m²' },
          { key: 'exterior', label: { es: 'Área exterior' }, value: '16 m²' },
          { key: 'areaTotal', label: { es: 'Área total' }, value: '131 m²' },
        ],
      },
      {
        slug: '3rec-servicio',
        label: { es: '3 Recámaras + Cuarto de Servicio' },
        shortLabel: { es: '3 Rec. + Servicio' },
        image: '/desarrollos/loreta/floor-plans/3recycuartodeservicio.jpg',
        specs: [
          { key: 'areaTotal', label: { es: 'Área total' }, value: '221 m²' },
        ],
      },
      {
        slug: 'ph5-ph8',
        label: { es: 'PH5 y PH8' },
        image: '/desarrollos/loreta/floor-plans/PH5andPH8.jpg',
        specs: [
          { key: 'interior', label: { es: 'Área interior' }, value: '177 m²' },
          { key: 'exterior', label: { es: 'Área exterior' }, value: '27 m²' },
          { key: 'areaTotal', label: { es: 'Área total' }, value: '204 m²' },
        ],
      },
      {
        slug: 'garden-3rec-servicio',
        label: { es: 'Garden 3R + Cuarto de Servicio' },
        shortLabel: { es: 'Garden 3 Rec. + Servicio' },
        image: '/desarrollos/loreta/floor-plans/Gardern3Rec.jpg',
        specs: [
          { key: 'interior', label: { es: 'Área interior' }, value: '218.75 m²' },
          { key: 'exterior', label: { es: 'Área exterior' }, value: '28 m²' },
          { key: 'areaTotal', label: { es: 'Área total' }, value: '246.75 m²' },
        ],
      },
    ],
  },
  {
    slug: 'olivia-wow-condos',
    name: 'Olivia Wow Condos',
    relationship: 'sales-partner',
    developer: 'Live',
    brand: 'Live Desarrollos',
    city: 'Cancún',
    zone: 'Lausana Residencial',
    type: 'Residencial',
    intent: ['vivir', 'invertir'],
    status: 'Preventa',
    image: '/desarrollos/olivia/33.-Olivia.jpg',
    href: '/desarrollos/olivia-wow-condos',
    featured: true,
    logo: '/desarrollos/olivia/Olivia.svg',
    logoScale: 0.8,
    badge: 'Preventa',
    propertyType: 'Departamento',
    priceLabel: 'Desde $2,613,000 MXN',
    description:
      'Preventa de departamentos desde 76 m² con vistas espectaculares al paseo Lausana y al campo de golf, en un entorno residencial de excepción en Cancún.',
    // ── Apartado en línea (piloto Sales Partner) ──
    reservationEnabled: true,
    reservationAmount: 25000,
    // ── Capa de ficha (piloto Sales Partner) ──
    heroRender: '/desarrollos/olivia/10.-Parque-urbano.jpg', // panorámica real (1920x1037)
    heroLogoScale: 0.65,
    tagline: { es: 'Vive frente al paseo Lausana y el campo de golf' },
    highlights: [
      { label: 'Ubicación', labelEn: 'Location', value: 'Lausana Residencial' },
      { label: 'Tipología', labelEn: 'Property type', value: 'Departamentos', valueEn: 'Apartments' },
      { label: 'Superficie', labelEn: 'Size', value: 'Desde 76 m²', valueEn: 'From 76 m²' },
    ],
    gallery: [
      '/desarrollos/olivia/5.-Fachada-frontal.jpg',
      '/desarrollos/olivia/3.-Alberca-Aerea.jpg',
      '/desarrollos/olivia/7.-Alberca.jpg',
      '/desarrollos/olivia/20.-Tipo-E.jpg',
      '/desarrollos/olivia/28.-Tipo-F-Comedor.jpg',
    ],
    // Fotos 11-19 de la carpeta (rango de amenidades); 10 ya es el hero, no se repite.
    amenitiesGallery: [
      '/desarrollos/olivia/11.-Espejo.jpg',
      '/desarrollos/olivia/14.-Cocina-Lounge.jpg',
      '/desarrollos/olivia/15.-Terraza.jpg',
      '/desarrollos/olivia/16.-Lounge_.jpg',
      '/desarrollos/olivia/17.-Business-Center.jpg',
      '/desarrollos/olivia/18.-Usos-Multiples.jpg',
      '/desarrollos/olivia/19.-Lobby_.jpg',
    ],
    projectTitle: { es: 'Departamentos con impresionantes vistas' },
    projectTitleMuted: { es: 'en Cancún' },
    projectBody: [
      {
        es: 'es un desarrollo de Live Desarrollos ubicado dentro de **Lausana Residencial**, una de las comunidades privadas de mayor plusvalía de Cancún, con vistas abiertas al paseo Lausana y al campo de golf.',
        en: 'is a development by Live Desarrollos located within **Lausana Residencial**, one of Cancún\'s highest-value private communities, with open views of the Lausana promenade and the golf course.',
      },
      {
        es: 'Departamentos desde **76 m²**, pensados para quienes buscan vivir o invertir en un entorno residencial de excepción, con amenidades de primer nivel y a minutos de las zonas de mayor crecimiento de la ciudad.',
        en: 'Apartments from **76 sqm**, designed for those looking to live or invest in an exceptional residential setting, with first-class amenities minutes from the city\'s fastest-growing areas.',
      },
    ],
    locationBullets: [
      { es: 'Dentro de Lausana Residencial, comunidad privada' },
      { es: 'Vistas abiertas al paseo Lausana y al campo de golf' },
      { es: 'Cerca de las zonas de mayor plusvalía de Cancún' },
    ],
    location: { lat: 20.9968117, lng: -86.876584, address: 'Lausana Residencial, Cancún, Q. Roo' },
    amenities: [
      { key: 'alberca-recreativa', labelOverride: 'Alberca con camastros' },
      { key: 'gym' },
      { key: 'salon-usos-multiples' },
      { key: 'areas-verdes', labelOverride: 'Roof garden' },
      { key: 'coworking' },
      { key: 'ludoteca', labelOverride: 'Kids club' },
      { key: 'seguridad-24-7' },
      { key: 'estacionamiento-visitas' },
    ],
    contentBlocks: [
      {
        eyebrow: { es: '— Conoce el desarrollo' },
        title: { es: 'Dentro de Lausana Residencial' },
        titleMuted: { es: 'la primera Smart City de Cancún' },
        description: {
          es: 'Lausana Residencial, al sur de Cancún, es la primera **Smart City** de la ciudad — diseño urbano de clase mundial, conectividad y amenidades para todas las edades distribuidas en más de **15 hectáreas de áreas verdes**, con lagos, ciclovías y parques.',
          en: 'Lausana Residencial, south of Cancún, is the city\'s first **Smart City** — world-class urban design, connectivity and amenities for every age spread across more than **15 hectares of green areas**, with lakes, bike paths and parks.',
        },
        image: '/desarrollos/loreta/lausanamapa.png',
        layout: 'side-by-side',
        imagePosition: 'right',
        cta: {
          label: { es: 'Vista Panorámica', en: 'Panoramic View' },
          url: 'https://s3.us-east-2.amazonaws.com/live.vt/OVT/index.htm',
        },
      },
    ],
    floorPlans: [
      {
        slug: 'estudio',
        label: { es: 'Estudio' },
        image: '/desarrollos/olivia/floor-plans/Estudio.jpg',
        specs: [
          { key: 'areaInterior', label: { es: 'Área interior' }, value: '34 m²' },
          { key: 'areaExterior', label: { es: 'Área exterior' }, value: '5 m²' },
          { key: 'areaTotal', label: { es: 'Área total' }, value: '39 m²' },
        ],
      },
      {
        slug: 'loft',
        label: { es: 'Loft' },
        image: '/desarrollos/olivia/floor-plans/Loft.jpg',
        virtualTourUrl: 'https://germanlomeli.com/tour/olivia/e/',
        specs: [
          { key: 'areaInterior', label: { es: 'Área interior' }, value: '46 m²' },
          { key: 'areaExterior', label: { es: 'Área exterior' }, value: '9 m²' },
          { key: 'areaTotal', label: { es: 'Área total' }, value: '55 m²' },
        ],
      },
      {
        slug: '1rec-doble-vista',
        label: { es: '1 Recámara | Doble Vista' },
        image: '/desarrollos/olivia/floor-plans/1RecDobleVista.jpg',
        virtualTourUrl: 'https://germanlomeli.com/tour/olivia/d/',
        specs: [
          { key: 'areaInterior', label: { es: 'Área interior' }, value: '58 m²' },
          { key: 'areaExterior', label: { es: 'Área exterior' }, value: '8 m²' },
          { key: 'areaTotal', label: { es: 'Área total' }, value: '66 m²' },
        ],
      },
      {
        slug: '1rec-1-5b',
        label: { es: '1 Recámara + 1.5 B' },
        image: '/desarrollos/olivia/floor-plans/1rec15.jpg',
        specs: [
          { key: 'areaInterior', label: { es: 'Área interior' }, value: '63 m²' },
          { key: 'areaExterior', label: { es: 'Área exterior' }, value: '10 m²' },
          { key: 'areaTotal', label: { es: 'Área total' }, value: '73 m²' },
        ],
      },
      {
        slug: '1rec-sky-villa',
        label: { es: '1 Recámara | Sky Villa' },
        image: '/desarrollos/olivia/floor-plans/1RecSky.jpg',
        virtualTourUrl: 'https://germanlomeli.com/tour/olivia/skyvilla/d/',
        specs: [
          { key: 'interiorTechado', label: { es: 'Interior techado' }, value: '57.96 m²' },
          { key: 'exteriorTechado', label: { es: 'Exterior techado' }, value: '7.86 m²' },
          { key: 'terraza', label: { es: 'Terraza' }, value: '15.29 m²' },
          { key: 'areaTotal', label: { es: 'Área total' }, value: '81.11 m²' },
        ],
      },
      {
        slug: '1rec-1-5b-doble-vista',
        label: { es: '1 Recámara + 1.5 B | Doble Vista' },
        image: '/desarrollos/olivia/floor-plans/1rec15Doble.jpg',
        specs: [
          { key: 'areaInterior', label: { es: 'Área interior' }, value: '72 m²' },
          { key: 'areaExterior', label: { es: 'Área exterior' }, value: '10 m²' },
          { key: 'areaTotal', label: { es: 'Área total' }, value: '82 m²' },
        ],
      },
      {
        slug: 'loft-sky-villa',
        label: { es: 'Loft Sky Villa' },
        image: '/desarrollos/olivia/floor-plans/loftOlivia.jpg',
        virtualTourUrl: 'https://germanlomeli.com/tour/olivia/skyvilla/e/',
        specs: [
          { key: 'interiorTechado', label: { es: 'Interior techado' }, value: '46.00 m²' },
          { key: 'exteriorTechado', label: { es: 'Exterior techado' }, value: '10.00 m²' },
          { key: 'terraza', label: { es: 'Terraza' }, value: '30.00 m²' },
          { key: 'areaTotal', label: { es: 'Área total' }, value: '86.00 m²' },
        ],
      },
      {
        slug: '2rec',
        label: { es: '2 Recámaras' },
        image: '/desarrollos/olivia/floor-plans/Olivia2rec.jpg',
        virtualTourUrl: 'https://germanlomeli.com/tour/olivia/c/',
        specs: [
          { key: 'areaInterior', label: { es: 'Interior' }, value: '105 m²' },
          { key: 'areaExterior', label: { es: 'Exterior' }, value: '14 m²' },
          { key: 'areaTotal', label: { es: 'Área total' }, value: '119 m²' },
        ],
      },
      {
        slug: '2ph-terraza',
        label: { es: '2 PH + Terraza' },
        image: '/desarrollos/olivia/floor-plans/phterraza.jpg',
        virtualTourUrl: 'https://germanlomeli.com/tour/olivia/f/',
        specs: [
          { key: 'interiorTechado', label: { es: 'Interior techado' }, value: '103.00 m²' },
          { key: 'exteriorTechado', label: { es: 'Exterior techado' }, value: '26.00 m²' },
          { key: 'terraza', label: { es: 'Terraza' }, value: '60.00 m²' },
          { key: 'areaTotal', label: { es: 'Área total' }, value: '189 m²' },
        ],
      },
      {
        slug: '2ph-rooftop',
        label: { es: '2 PH + Rooftop' },
        image: '/desarrollos/olivia/floor-plans/2PHRooftop.jpg',
        virtualTourUrl: 'https://germanlomeli.com/tour/olivia/g/',
        specs: [
          { key: 'areaTotal', label: { es: 'Área total' }, value: '215 m²' },
        ],
      },
    ],
  },
  {
    slug: 'xaviera-wow-condos',
    name: 'Xaviera',
    relationship: 'sales-partner',
    developer: 'Live',
    brand: 'Live Desarrollos',
    city: 'Tulum',
    zone: 'Aldea Zamá',
    type: 'Residencial',
    intent: ['vivir', 'invertir'],
    status: 'Preventa',
    image: '/desarrollos/xaviera/fotos/1. Fachada de Noche.jpg',
    href: '/desarrollos/xaviera-wow-condos',
    featured: true,
    logo: '/desarrollos/xaviera/XavieraLogo-1.svg',
    badge: 'Preventa',
    propertyType: 'Departamento',
    priceLabel: 'Desde $2,900,000 MXN',
    description:
      'En Aldea Zamá, corazón de Tulum —el destino de mayor crecimiento de México—, Xaviera ofrece exclusivos departamentos de 1 a 3 recámaras.',
    // ── Capa de ficha ──
    heroRender: '/desarrollos/xaviera/fotos/1. Fachada de Noche.jpg',
    tagline: { es: 'Solo 20 condominios exclusivos en Aldea Premium, Tulum' },
    highlights: [
      { label: 'Ubicación', labelEn: 'Location', value: 'Aldea Premium, Tulum' },
      { label: 'Tipología', labelEn: 'Property type', value: '1 a 3 Rec y PH', valueEn: '1 to 3 Bed & PH' },
      { label: 'Superficie', labelEn: 'Size', value: 'Desde 45 m²', valueEn: 'From 45 sqm' },
    ],
    gallery: [
      '/desarrollos/xaviera/fotos/3. Vista Frontal.jpg',
      '/desarrollos/xaviera/fotos/2. Fachada de Día.jpg',
      '/desarrollos/xaviera/fotos/5. Sala - Comedor.jpg',
      '/desarrollos/xaviera/fotos/9.Andador.jpg',
    ],
    amenitiesGallery: [
      '/desarrollos/xaviera/fotos/4. Roof Garden.jpg',
      '/desarrollos/xaviera/fotos/7. Vista Superior Frontal.jpg',
    ],
    projectTitle: { es: 'Solo 20 condominios' },
    projectTitleMuted: { es: 'en el corazón de Tulum' },
    projectBody: [
      {
        es: 'Xaviera son solo **20 condominios exclusivos** en Aldea Premium, la zona residencial de mayor plusvalía de Tulum — diseñados para fusionar los lujos y comodidades del primer mundo con la naturaleza característica del destino.',
        en: 'Xaviera is a collection of just **20 exclusive condominiums** in Aldea Premium, Tulum\'s highest-value residential area — designed to blend first-world comfort and luxury with the natural surroundings that define the destination.',
      },
      {
        es: 'Landscaping de **Reyes Ríos + Larraín Arquitectos** y una arquitectura que dialoga con la selva: la combinación exacta entre lo extraordinario de la naturaleza y lo emocionante del diseño contemporáneo.',
        en: 'Landscaping by **Reyes Ríos + Larraín Arquitectos** and an architecture that speaks to the jungle: the exact combination of extraordinary nature and exciting contemporary design.',
      },
    ],
    location: { lat: 20.1944504, lng: -87.4620091, address: 'Aldea Premium, Tulum, Q. Roo' },
    locationBullets: [
      { es: 'En Aldea Premium, la zona de mayor plusvalía de Tulum' },
      { es: 'Landscaping de Reyes Ríos + Larraín Arquitectos' },
      { es: 'Solo 20 condominios exclusivos' },
    ],
    amenities: [
      { key: 'areas-verdes' },
      { key: 'alberca-recreativa', labelOverride: 'Alberca en Roof Garden' },
      { key: 'lobby', labelOverride: 'Lobby y acceso controlado' },
      { key: 'seguridad-24-7', labelOverride: 'Vigilancia y acceso vehicular controlado' },
      { key: 'wifi-areas-comunes' },
      { key: 'salon-usos-multiples' },
      { key: 'asadores', labelOverride: 'BBQ y Bar Área' },
    ],
    floorPlans: [
      {
        slug: '1rec',
        label: { es: '1 Recámara', en: '1 Bedroom' },
        image: '/desarrollos/xaviera/floor-plans/1Rec.jpg',
        specs: [
          { key: 'interior', label: { es: 'Área interior', en: 'Interior area' }, value: '40 m²' },
          { key: 'exterior', label: { es: 'Área exterior', en: 'Exterior area' }, value: '5 m²' },
          { key: 'areaTotal', label: { es: 'Área total', en: 'Total area' }, value: '45 m²' },
        ],
      },
      {
        slug: '2rec',
        label: { es: '2 Recámaras', en: '2 Bedrooms' },
        image: '/desarrollos/xaviera/floor-plans/2rec.jpg',
        specs: [
          { key: 'interior', label: { es: 'Área interior', en: 'Interior area' }, value: '85 m²' },
          { key: 'exterior', label: { es: 'Área exterior', en: 'Exterior area' }, value: '5 m²' },
          { key: 'areaTotal', label: { es: 'Área total', en: 'Total area' }, value: '90 m²' },
        ],
      },
      {
        slug: 'ph-3rec',
        label: { es: 'PH 3 Recámaras', en: 'PH 3 Bedrooms' },
        shortLabel: { es: 'PH 3 Rec.', en: 'PH 3 Bed.' },
        image: '/desarrollos/xaviera/floor-plans/PH-3rec.jpg',
        specs: [
          { key: 'nivel1', label: { es: 'Nivel 1', en: 'Level 1' }, value: '110 m²' },
          { key: 'nivel2', label: { es: 'Nivel 2', en: 'Level 2' }, value: '83.55 m²' },
          { key: 'areaTotal', label: { es: 'Área total', en: 'Total area' }, value: '193.55 m²' },
        ],
      },
    ],
  },

  // ── SALES PARTNER · Onix Living ──
  // Placeholders: foto (reutilizada), precio y descripción pendientes de confirmar.
  {
    slug: 'koa-onix',
    name: 'Koa',
    relationship: 'sales-partner',
    developer: 'Onix',
    brand: 'Onix Living',
    city: 'Cancún',
    zone: 'Zona Huayacán',
    type: 'Residencial',
    intent: ['vivir', 'invertir'],
    status: 'Entrega inmediata',
    image: '/desarrollos/koa/Copia-de-FF_01.jpg',
    href: '/desarrollos/koa-onix',
    featured: true,
    logo: '/desarrollos/koa/KOALogo.svg',
    badge: 'Entrega inmediata',
    propertyType: 'Departamento',
    priceLabel: 'Desde $3,500,000 MXN',
    description:
      'Departamentos de 1, 2 y 3 recámaras con diseño exclusivo y amenidades de lujo, en la zona residencial de mayor crecimiento y proyección de Cancún.',
    // ── Capa de ficha (contenido tomado de koatowers.com) ──
    heroRender: '/desarrollos/koa/Copia-de-FF_01.jpg', // misma foto que el card
    heroLogoScale: 0.6,
    heroImagePosition: { mobile: 'bottom', desktop: 'bottom' },
    tagline: { es: 'Departamentos de 1, 2 y 3 recámaras con amenidades exclusivas' },
    highlights: [
      { label: 'Ubicación', labelEn: 'Location', value: 'Zona Huayacán' },
      { label: 'Tipología', labelEn: 'Property type', value: '1 a 3 Rec', valueEn: '1 to 3 Bed' },
      { label: 'Superficie', labelEn: 'Size', value: 'Desde 79 m²', valueEn: 'From 79 sqm' },
    ],
    gallery: [
      '/desarrollos/koa/AEREO_01.jpg',
      '/desarrollos/koa/AEREO_02.jpg',
      '/desarrollos/koa/Copia-de-FACHADA_ZOOM_01.jpg',
      '/desarrollos/koa/Sala_balcón.jpg',
      '/desarrollos/koa/comedor_cocina.jpg',
      '/desarrollos/koa/habitación.jpg',
      '/desarrollos/koa/sala_comedor.jpg',
    ],
    amenitiesGallery: [
      '/desarrollos/koa/Copia-de-ALBERCA_01.jpg',
      '/desarrollos/koa/Copia-de-GYM_01.jpg',
      '/desarrollos/koa/Copia-de-LUDOTECA_01.jpg',
      '/desarrollos/koa/Copia-de-ROOFTOP_01.jpg',
      '/desarrollos/koa/Copia-de-JUEGOS_INF_01.jpg',
    ],
    projectTitle: { es: 'Invierte en Cancún', en: 'Invest in Cancún' },
    projectTitleMuted: { es: 'con entrega garantizada en 2025', en: 'with delivery guaranteed in 2025' },
    projectBody: [
      {
        es: 'son departamentos de 1, 2 y 3 recámaras en Av. Prolongación La Luna, a un costado de Areka Towers, diseñados para un alto potencial de plusvalía con **escrituración garantizada**.',
        en: 'is a collection of 1, 2 and 3-bedroom apartments on Av. Prolongación La Luna, next to Areka Towers, designed for high appreciation potential with **guaranteed title deed delivery**.',
      },
      {
        es: '**Alberca infinity**, asadores en rooftop, gimnasio climatizado y cancha de pádel — amenidades pensadas para vivir e invertir en una de las zonas de mayor crecimiento de Cancún.',
        en: '**Infinity pool**, rooftop grills, climate-controlled gym and padel court — amenities built for living and investing in one of Cancún\'s fastest-growing areas.',
      },
    ],
    locationBullets: [
      { es: 'A un costado de Areka Towers', en: 'Right next to Areka Towers' },
      { es: 'Escrituración garantizada en 2025', en: 'Title deed delivery guaranteed in 2025' },
      { es: 'Alto potencial de plusvalía', en: 'High appreciation potential' },
    ],
    amenities: [
      { key: 'alberca-infinity' },
      { key: 'asadores', labelOverride: 'Asadores en rooftop' },
      { key: 'gym', labelOverride: 'Gimnasio climatizado' },
      { key: 'cancha-padel' },
      { key: 'ludoteca' },
      { key: 'zona-yoga' },
      { key: 'area-infantil' },
    ],
    floorPlans: [
      {
        slug: '1rec-studio',
        label: { es: '1 Recámara + 1 Studio', en: '1 Bedroom + 1 Studio' },
        shortLabel: { es: '1 Rec. + Studio', en: '1 Bed. + Studio' },
        image: '/desarrollos/koa/floor-plans/1RecStudio.jpg',
        specs: [
          { key: 'regular', label: { es: 'Regular', en: 'Regular' }, value: '79 m²' },
          { key: 'garden', label: { es: 'Garden', en: 'Garden' }, value: '94 m²' },
          { key: 'recamaras', label: { es: 'Recámaras', en: 'Bedrooms' }, value: '1 + Studio' },
          { key: 'banos', label: { es: 'Baños', en: 'Bathrooms' }, value: '1' },
          { key: 'terraza', label: { es: 'Terraza', en: 'Terrace' }, value: 'Sí' },
          { key: 'lavado', label: { es: 'Área de lavado', en: 'Laundry area' }, value: 'Sí' },
          { key: 'estacionamiento', label: { es: 'Estacionamiento', en: 'Parking' }, value: '1 cajón' },
        ],
      },
      {
        slug: '2rec-out',
        label: { es: '2 Recámaras Out', en: '2 Bedrooms Out' },
        shortLabel: { es: '2 Rec. Out', en: '2 Bed. Out' },
        image: '/desarrollos/koa/floor-plans/2RecOut.jpg',
        specs: [
          { key: 'regular', label: { es: 'Regular', en: 'Regular' }, value: '111 m²' },
          { key: 'garden', label: { es: 'Garden', en: 'Garden' }, value: '176 m²' },
          { key: 'recamaras', label: { es: 'Recámaras', en: 'Bedrooms' }, value: '2' },
          { key: 'banos', label: { es: 'Baños', en: 'Bathrooms' }, value: '2' },
          { key: 'terraza', label: { es: 'Terraza', en: 'Terrace' }, value: 'Sí' },
          { key: 'lavado', label: { es: 'Área de lavado', en: 'Laundry area' }, value: 'Sí' },
          { key: 'estacionamiento', label: { es: 'Estacionamiento', en: 'Parking' }, value: '2 cajones' },
        ],
      },
      {
        slug: '2rec-in',
        label: { es: '2 Recámaras IN', en: '2 Bedrooms IN' },
        shortLabel: { es: '2 Rec. IN', en: '2 Bed. IN' },
        image: '/desarrollos/koa/floor-plans/2RecIN.jpg',
        specs: [
          { key: 'regular', label: { es: 'Regular', en: 'Regular' }, value: '119 m²' },
          { key: 'garden', label: { es: 'Garden', en: 'Garden' }, value: '175 m²' },
          { key: 'recamaras', label: { es: 'Recámaras', en: 'Bedrooms' }, value: '2' },
          { key: 'banos', label: { es: 'Baños', en: 'Bathrooms' }, value: '2' },
          { key: 'terraza', label: { es: 'Terraza', en: 'Terrace' }, value: 'Sí' },
          { key: 'lavado', label: { es: 'Área de lavado', en: 'Laundry area' }, value: 'Sí' },
          { key: 'estacionamiento', label: { es: 'Estacionamiento', en: 'Parking' }, value: '2 cajones' },
        ],
      },
      {
        slug: '3rec',
        label: { es: '3 Recámaras', en: '3 Bedrooms' },
        shortLabel: { es: '3 Rec.', en: '3 Bed.' },
        image: '/desarrollos/koa/floor-plans/3Rec.jpg',
        specs: [
          { key: 'regular', label: { es: 'Regular', en: 'Regular' }, value: '143 m²' },
          { key: 'garden', label: { es: 'Garden', en: 'Garden' }, value: '195 m²' },
          { key: 'recamaras', label: { es: 'Recámaras', en: 'Bedrooms' }, value: '3' },
          { key: 'banos', label: { es: 'Baños', en: 'Bathrooms' }, value: '2.5' },
          { key: 'terraza', label: { es: 'Terraza', en: 'Terrace' }, value: 'Sí' },
          { key: 'lavado', label: { es: 'Área de lavado', en: 'Laundry area' }, value: 'Sí' },
          { key: 'estacionamiento', label: { es: 'Estacionamiento', en: 'Parking' }, value: '2 cajones' },
        ],
      },
    ],
  },
  {
    slug: 'villalta-onix',
    name: 'Villalta',
    relationship: 'sales-partner',
    developer: 'Onix',
    brand: 'Onix Living',
    city: 'Cancún',
    zone: 'Zona Hotelera',
    type: 'Residencial',
    intent: ['vivir', 'invertir'],
    status: 'Entrega inmediata',
    image: '/desarrollos/villalta/portada3.jpg',
    href: '/desarrollos/villalta-onix',
    featured: true,
    logo: '/desarrollos/villalta/LogoVillalta.svg',
    badge: 'Entrega inmediata',
    propertyType: 'Departamento',
    priceLabel: 'Desde $5,000,000 MXN',
    description:
      'Residencial de lujo que redefine el estándar de vida en la Zona Hotelera de Cancún: departamentos de 1, 2 y 3 recámaras con vistas increíbles al mar.',
    // ── Capa de ficha ──
    heroRender: '/desarrollos/villalta/portada2.jpg',
    // El edificio y la alberca quedan hasta abajo de la foto — bottom evita
    // que el crop se coma la escena real y se quede solo con cielo/laguna.
    heroImagePosition: { mobile: 'bottom', desktop: 'bottom' },
    tagline: { es: 'Un oasis de tranquilidad frente a la laguna, en el corazón de la Zona Hotelera' },
    highlights: [
      { label: 'Ubicación', labelEn: 'Location', value: 'Zona Hotelera' },
      { label: 'Tipología', labelEn: 'Property type', value: '1 a 3 Rec', valueEn: '1 to 3 Bed' },
      { label: 'Superficie', labelEn: 'Size', value: 'Desde 88 m²', valueEn: 'From 88 sqm' },
    ],
    gallery: [
      '/desarrollos/villalta/portada3.jpg',
      '/desarrollos/villalta/1-03.jpg',
      '/desarrollos/villalta/1-07.jpg',
      '/desarrollos/villalta/1-01.jpg',
    ],
    amenitiesGallery: [
      '/desarrollos/villalta/VL01.jpg',
      '/desarrollos/villalta/VL02.jpg',
    ],
    projectTitle: { es: 'Conoce Villalta Laguna' },
    projectTitleMuted: { es: 'elegancia y exclusividad frente a la laguna' },
    projectBody: [
      {
        es: 'Villalta Laguna es un desarrollo residencial de lujo que redefine el estándar de vida en Cancún: una **fusión entre elegancia, comodidad y exclusividad** en uno de los destinos más codiciados del Caribe mexicano.',
        en: 'Villalta Laguna is a luxury residential development that redefines the standard of living in Cancún: a **blend of elegance, comfort and exclusivity** in one of the most sought-after destinations in the Mexican Caribbean.',
      },
      {
        es: 'Departamentos de 1, 2 y 3 recámaras dentro de la Zona Hotelera, a un costado de la Laguna Nichupté — un oasis de tranquilidad con amenidades pensadas para vivir o invertir con total confianza.',
        en: '1, 2 and 3-bedroom apartments inside the Hotel Zone, next to the Nichupté Lagoon — a haven of tranquility with amenities designed to live or invest with total confidence.',
      },
    ],
    location: { lat: 21.1499493, lng: -86.8160737, address: 'Villalta Laguna, Zona Hotelera, Cancún, Q. Roo' },
    locationBullets: [
      { es: 'Dentro de la Zona Hotelera, junto a la Laguna Nichupté' },
      { es: 'A minutos de la playa y de los principales centros comerciales' },
      { es: 'Departamentos de 1, 2 y 3 recámaras' },
    ],
    amenities: [
      { key: 'areas-verdes' },
      { key: 'cancha-padel' },
      { key: 'salon-eventos' },
      { key: 'alberca-familiar', labelOverride: 'Albercas familiares' },
      { key: 'gym' },
      { key: 'camastros' },
      { key: 'area-infantil' },
      { key: 'seguridad-24-7' },
    ],
    floorPlans: [
      {
        slug: '1rec',
        label: { es: '1 Recámara', en: '1 Bedroom' },
        image: '/desarrollos/villalta/floor-plans/1Rec.jpg',
        specs: [
          { key: 'area', label: { es: 'Área', en: 'Area' }, value: '88 m² a 107 m²' },
          { key: 'recamaras', label: { es: 'Recámaras', en: 'Bedrooms' }, value: '1' },
          { key: 'banos', label: { es: 'Baños', en: 'Bathrooms' }, value: '1.5' },
          { key: 'terraza', label: { es: 'Terraza', en: 'Terrace' }, value: 'Sí' },
          { key: 'lavado', label: { es: 'Área de lavado', en: 'Laundry area' }, value: 'Sí' },
          { key: 'estacionamiento', label: { es: 'Estacionamiento', en: 'Parking' }, value: '2 cajones' },
        ],
      },
      {
        slug: '2rec',
        label: { es: '2 Recámaras', en: '2 Bedrooms' },
        image: '/desarrollos/villalta/floor-plans/2Rec.png',
        specs: [
          { key: 'area', label: { es: 'Área', en: 'Area' }, value: 'Desde 131 m²' },
          { key: 'recamaras', label: { es: 'Recámaras', en: 'Bedrooms' }, value: '2' },
          { key: 'banos', label: { es: 'Baños', en: 'Bathrooms' }, value: '2.5' },
          { key: 'terraza', label: { es: 'Terraza', en: 'Terrace' }, value: 'Sí' },
          { key: 'lavado', label: { es: 'Área de lavado', en: 'Laundry area' }, value: 'Sí' },
          { key: 'estacionamiento', label: { es: 'Estacionamiento', en: 'Parking' }, value: '2 cajones' },
        ],
      },
      {
        slug: '3rec',
        label: { es: '3 Recámaras', en: '3 Bedrooms' },
        image: '/desarrollos/villalta/floor-plans/3rec.jpg',
        specs: [
          { key: 'area', label: { es: 'Área', en: 'Area' }, value: '157 m² a 228 m²' },
          { key: 'recamaras', label: { es: 'Recámaras', en: 'Bedrooms' }, value: '3' },
          { key: 'banos', label: { es: 'Baños', en: 'Bathrooms' }, value: '3.5' },
          { key: 'servicio', label: { es: 'Cuarto de servicio', en: 'Service room' }, value: 'Sí' },
          { key: 'terraza', label: { es: 'Terraza', en: 'Terrace' }, value: 'Sí' },
          { key: 'lavado', label: { es: 'Área de lavado', en: 'Laundry area' }, value: 'Sí' },
          { key: 'estacionamiento', label: { es: 'Estacionamiento', en: 'Parking' }, value: '2 cajones' },
        ],
      },
    ],
  },
  {
    slug: 'bardenna-onix',
    name: 'Bardenna',
    relationship: 'sales-partner',
    developer: 'Onix',
    brand: 'Onix Living',
    city: 'Cancún',
    zone: 'Av. Huayacán',
    type: 'Residencial',
    intent: ['vivir', 'invertir'],
    status: 'Preventa',
    image: '/desarrollos/bardenna/002.jpg',
    href: '#',
    featured: true,
    logo: '/desarrollos/bardenna/LogoBardenna.svg',
    badge: 'Preventa',
    propertyType: 'Departamento',
    priceLabel: 'Desde $3,769,588.03 MXN',
    description:
      'Departamentos de 2 y 3 recámaras dentro de Zienna Residencial, sobre Av. Huayacán, la zona con mayor plusvalía y crecimiento inmobiliario de Cancún.',
  },
  {
    slug: 'zienna-onix',
    name: 'Zienna',
    relationship: 'sales-partner',
    developer: 'Onix',
    brand: 'Onix Living',
    city: 'Cancún',
    zone: 'Av. Huayacán',
    type: 'Lotes',
    intent: ['invertir'],
    status: 'Preventa',
    image: '/desarrollos/zienna/portadazienna.jpg',
    href: '/desarrollos/zienna-onix',
    featured: true,
    logo: '/desarrollos/zienna/ZiennaLogo.svg',
    badge: 'Preventa',
    propertyType: 'Lote Residencial',
    priceLabel: 'Desde $1,750,000 MXN',
    description:
      'Comunidad residencial sobre Av. Huayacán con 604 lotes unifamiliares, casa club y áreas deportivas, en una de las zonas de mayor plusvalía de Cancún.',
    // ── Capa de ficha (contenido tomado de zienna.mx) ──
    heroRender: '/desarrollos/zienna/portadazienna.jpg', // misma foto que el card
    // La foto tiene mucho cielo vacío arriba; el acceso/portada (lo importante)
    // queda hasta abajo — bottom evita que el crop se coma la escena real.
    heroImagePosition: { mobile: 'bottom', desktop: 'bottom' },
    tagline: { es: 'La mejor ubicación con conectividad estratégica' },
    contentBlocks: [
      {
        eyebrow: { es: '— Casa club', en: '— Clubhouse' },
        title: { es: 'Diseño en conexión', en: 'Design in connection' },
        titleMuted: { es: 'con la naturaleza', en: 'with nature' },
        description: {
          es: 'La casa club de Zienna combina materiales naturales, vegetación integrada y una arquitectura abierta que difumina el límite entre interior y exterior — el mismo principio de diseño que define **cada rincón** de la comunidad.',
          en: 'Zienna\'s clubhouse combines natural materials, integrated greenery and an open architecture that blurs the line between indoors and outdoors — the same design principle that defines **every corner** of the community.',
        },
        image: '/desarrollos/zienna/Casa_club.jpg',
      },
    ],
    highlights: [
      { label: 'Ubicación', labelEn: 'Location', value: 'Av. Huayacán' },
      { label: 'Lotes', labelEn: 'Lots', value: '200 a 444 m²', valueEn: '200 to 444 sqm' },
      { label: 'Extensión', labelEn: 'Total area', value: '27 hectáreas', valueEn: '27 hectares' },
    ],
    gallery: [
      '/desarrollos/zienna/Acceso-01.jpg',
      '/desarrollos/zienna/Acceso-02.jpg',
      '/desarrollos/zienna/Andador-ppl-01.jpg',
      '/desarrollos/zienna/Áreas-comunes-01.jpg',
      '/desarrollos/zienna/Calle.jpg',
      '/desarrollos/zienna/Casa-club-general.jpg',
    ],
    amenitiesGallery: [
      '/desarrollos/zienna/Alberca.jpg',
      '/desarrollos/zienna/Gym.jpg',
      '/desarrollos/zienna/Parque-01.jpg',
      '/desarrollos/zienna/Alberca-gym-01.jpg',
      '/desarrollos/zienna/Kidsclub.jpg',
      '/desarrollos/zienna/Multicancha.jpg',
    ],
    projectTitle: { es: 'La mejor ubicación', en: 'The best location' },
    projectTitleMuted: { es: 'con conectividad estratégica', en: 'with strategic connectivity' },
    projectBody: [
      {
        es: 'es una comunidad de **604 lotes** unifamiliares sobre la Av. Huayacán, con una superficie promedio de 227 m² (desde 200 hasta 444 m²), en 27 hectáreas con casa club y áreas deportivas.',
        en: 'is a community of **604 single-family lots** on Av. Huayacán, with an average size of 227 sqm (from 200 to 444 sqm), across 27 hectares with a clubhouse and sports areas.',
      },
      {
        es: 'A 10 minutos del aeropuerto y 15 del Tren Maya, con doble acceso, servicios subterráneos a pie de lote y **40% de áreas verdes naturales** — la conectividad que buscas, sin salir de Cancún.',
        en: '10 minutes from the airport and 15 from the Tren Maya, with double access, underground utilities at each lot, and **40% natural green areas** — the connectivity you\'re looking for, without leaving Cancún.',
      },
    ],
    locationBullets: [
      { es: 'A 10 minutos del aeropuerto de Cancún', en: '10 minutes from Cancún airport' },
      { es: '40% de áreas verdes naturales', en: '40% natural green areas' },
      { es: 'Doble acceso y servicios subterráneos a pie de lote', en: 'Double access with underground utilities at each lot' },
    ],
    amenities: [
      { key: 'alberca-recreativa', labelOverride: 'Alberca' },
      { key: 'gym' },
      { key: 'areas-verdes', labelOverride: 'Áreas naturales' },
      { key: 'camastros' },
      { key: 'restaurante-terraza', labelOverride: 'Restaurante' },
      { key: 'area-infantil' },
      { key: 'sauna' },
      { key: 'cancha-padel', labelOverride: 'Canchas de pádel' },
    ],
    floorPlans: [
      {
        slug: 'lote-residencial',
        label: { es: 'Lote residencial', en: 'Residential lot' },
        image: '/desarrollos/zienna/floor-plans/Captura-de-pantalla-2026-02-10-a-las-5.42.39 p.m.png',
        specs: [
          { key: 'superficie', label: { es: 'Lote desde', en: 'Lot from' }, value: '204 m²' },
          { key: 'desplante', label: { es: 'Desplante', en: 'Footprint' }, value: '108.12 m²' },
          { key: 'construccionMax', label: { es: 'Construcción máx.', en: 'Max. construction' }, value: '306 m²' },
          { key: 'construccionMin', label: { es: 'Construcción mín.', en: 'Min. construction' }, value: '108.12 m²' },
          { key: 'alturaMax', label: { es: 'Altura máx.', en: 'Max. height' }, value: '3 niveles' },
        ],
      },
    ],
  },

  // ── SALES PARTNER · Urban Homes ──
  // Placeholders: foto reutilizada; precio y descripción pendientes.
  {
    slug: 'blume-urban',
    name: 'Blume',
    relationship: 'sales-partner',
    developer: 'Urban Homes',
    brand: 'Urban Homes',
    city: 'Puerto Cancún',
    type: 'Residencial',
    intent: ['vivir', 'invertir'],
    status: 'Entrega inmediata',
    image: '/desarrollos/Blume/BLUME-Arquitectura-1.jpg',
    href: '/desarrollos/blume-urban',
    featured: true,
    logo: '/desarrollos/Blume/logo.png',
    badge: 'Entrega inmediata',
    propertyType: 'Departamento',
    priceLabel: 'Desde $19,256,000 MXN',
    description:
      'Condominios de lujo de 2 y 3 recámaras en Puerto Cancún, con marina propia y amenidades únicas, en el enclave residencial más exclusivo de Cancún.',
    // ── Capa de ficha (contenido tomado de blumeboutiquecondos.com) ──
    heroRender: '/desarrollos/Blume/BLUME-Arquitectura-1.jpg', // misma foto que el card
    tagline: { es: 'Un lugar donde el lujo se fusiona con la belleza natural de Cancún' },
    highlights: [
      { label: 'Ubicación', labelEn: 'Location', value: 'Marina Puerto Cancún', valueEn: 'Puerto Cancún Marina' },
      { label: 'Tipología', labelEn: 'Property type', value: '2 a 3 Rec y PH', valueEn: '2 to 3 Bed & PH' },
      { label: 'Unidades', labelEn: 'Units', value: '113 (109 + 4 PH)' },
    ],
    gallery: [
      '/desarrollos/Blume/BLUME-Drone-1.jpg',
      '/desarrollos/Blume/BLUME-Drone-3.jpg',
      '/desarrollos/Blume/BLUME-Arquitectura-5.jpg',
      '/desarrollos/Blume/BLUME-Arquitectura-10.jpg',
      '/desarrollos/Blume/BLUME-Arquitectura-15.jpg',
      '/desarrollos/Blume/Sala y comedor.jpg',
      '/desarrollos/Blume/Recamara Secundaria.jpg',
      '/desarrollos/Blume/foto-habitacion-blume.jpg',
    ],
    amenitiesGallery: [
      '/desarrollos/Blume/ALBERCA AEREA 1.jpg',
      '/desarrollos/Blume/AREA CONVIVENCIA.jpg',
    ],
    projectTitle: { es: 'Vistas al mar Caribe', en: 'Caribbean Sea views' },
    projectTitleMuted: { es: 'en la Marina de Puerto Cancún', en: 'at the Puerto Cancún Marina' },
    projectBody: [
      {
        es: 'son **113 residencias de lujo** —109 condominios y 4 penthouses— de 2 y 3 recámaras en la Marina de Puerto Cancún, con vistas al mar Caribe y a la laguna Nichupté.',
        en: 'is a collection of **113 luxury residences** —109 condominiums and 4 penthouses— with 2 and 3 bedrooms at the Puerto Cancún Marina, with views of the Caribbean Sea and the Nichupté Lagoon.',
      },
      {
        es: '**Muelle propio**, alberca infinity, business center, spa y vigilancia 24/7, desarrollado por Urban Homes en asociación con Cadu Inmobiliaria.',
        en: '**Private dock**, infinity pool, business center, spa and 24/7 security, developed by Urban Homes in partnership with Cadu Inmobiliaria.',
      },
    ],
    locationBullets: [
      { es: 'Muelle propio en la Marina de Puerto Cancún', en: 'Private dock at the Puerto Cancún Marina' },
      { es: 'Vistas al mar Caribe y a la laguna Nichupté', en: 'Caribbean Sea and Nichupté Lagoon views' },
      { es: '113 residencias: 109 condominios + 4 penthouses', en: '113 residences: 109 condos + 4 penthouses' },
    ],
    amenities: [
      { key: 'muelle' },
      { key: 'lounge-bar' },
      { key: 'alberca-infinity' },
      { key: 'alberca-familiar' },
      { key: 'cancha-padel' },
      { key: 'gym' },
      { key: 'seguridad-24-7', labelOverride: 'Vigilancia 24/7' },
      { key: 'area-infantil', labelOverride: 'Kids Club' },
      { key: 'terraza-bar' },
    ],
    floorPlans: [
      {
        slug: '3rec-c',
        label: { es: '3 Recámaras - C', en: '3 Bedrooms - C' },
        shortLabel: { es: '3 Rec. C', en: '3 Bed. C' },
        image: '/desarrollos/Blume/floor-plans/3rec-C.jpg',
        specs: [
          { key: 'recamaras', label: { es: 'Recámaras', en: 'Bedrooms' }, value: '3' },
          { key: 'interior', label: { es: 'Interior', en: 'Interior' }, value: '233.45 m²' },
          { key: 'terraza', label: { es: 'Terraza', en: 'Terrace' }, value: '23.16 m²' },
          { key: 'vista', label: { es: 'Vista', en: 'View' }, value: 'Mar Caribe o laguna Nichupté' },
        ],
      },
      {
        slug: '3rec-d',
        label: { es: '3 Recámaras - D', en: '3 Bedrooms - D' },
        shortLabel: { es: '3 Rec. D', en: '3 Bed. D' },
        image: '/desarrollos/Blume/floor-plans/3rec-D.jpg',
        specs: [
          { key: 'recamaras', label: { es: 'Recámaras', en: 'Bedrooms' }, value: '3' },
          { key: 'interior', label: { es: 'Interior', en: 'Interior' }, value: '219.56 m²' },
          { key: 'terraza', label: { es: 'Terraza', en: 'Terrace' }, value: '23.53 m²' },
          { key: 'vista', label: { es: 'Vista', en: 'View' }, value: 'Mar Caribe o laguna Nichupté' },
        ],
      },
    ],
  },
  {
    slug: 'favorite-urban',
    name: 'Favorite',
    relationship: 'sales-partner',
    developer: 'Urban Homes',
    brand: 'Urban Homes',
    city: 'Playa del Carmen',
    type: 'Residencial',
    intent: ['vivir', 'invertir'],
    status: 'Próximamente',
    image: '/desarrollos/Favorite/playaNIGHT.jpg',
    href: '#',
    featured: true,
    logo: '/desarrollos/Favorite/FavoriteLogo.svg',
    badge: 'Próximamente',
    propertyType: 'Departamento',
    comingSoon: true,
    priceLabel: 'Desde $9,999,999 MXN',
    description:
      'Departamentos de lujo a unos pasos del mar Caribe y de la célebre Quinta Avenida de Playa del Carmen. Muy pronto revelaremos todos los detalles.',
  },
  {
    slug: 'la-selva-urban',
    name: 'La Selva',
    relationship: 'sales-partner',
    developer: 'Urban Homes',
    brand: 'Urban Homes',
    city: 'Playa del Carmen',
    type: 'Residencial',
    intent: ['vivir', 'invertir'],
    status: 'Entrega inmediata',
    image: '/desarrollos/la-selva/portada.jpg',
    href: '#',
    featured: true,
    logo: '/desarrollos/la-selva/Logo-4.png',
    logoScale: 1.2,
    badge: 'Entrega inmediata',
    propertyType: 'Departamento',
    priceLabel: 'Desde $2,244,000 MXN',
    description:
      'Departamentos de entrega inmediata de 2 y 3 recámaras en el corazón de la Riviera Maya, con amenidades de excepción y diseño contemporáneo de autor.',
  },
  {
    slug: 'sanam-urban',
    name: 'Sanam',
    relationship: 'sales-partner',
    developer: 'Urban Homes',
    brand: 'Urban Homes',
    city: 'Tulum',
    type: 'Residencial',
    intent: ['vivir', 'invertir'],
    status: 'Preventa',
    image: '/desarrollos/Sanam/portada.jpg',
    href: '#',
    featured: true,
    logo: '/desarrollos/Sanam/SANAMLogo.svg',
    badge: 'Preventa',
    propertyType: 'Departamento',
    priceLabel: 'Desde $2,925,000 MXN',
    description:
      'Departamentos de 2 y 3 recámaras en una comunidad privada en el corazón de Tulum, a diez minutos de la playa, entre naturaleza, diseño y confort.',
  },
  {
    slug: 'valmira-urban',
    name: 'Valmira',
    relationship: 'sales-partner',
    developer: 'Urban Homes',
    brand: 'Urban Homes',
    city: 'Cancún',
    zone: 'Av. Huayacán',
    type: 'Residencial',
    intent: ['vivir', 'invertir'],
    status: 'Entrega inmediata',
    image: '/desarrollos/Valmira/portadaValmira.jpg',
    href: '/desarrollos/valmira-urban',
    featured: true,
    logo: '/desarrollos/Valmira/logovalmira.svg',
    badge: 'Entrega inmediata',
    propertyType: 'Departamento',
    priceLabel: 'Desde $2,595,000 MXN',
    description:
      'Departamentos de lujo de 2 y 3 recámaras sobre Av. Huayacán, dentro de la exclusiva comunidad Gran Vía, en una zona de alta plusvalía de Cancún.',
    // ── Capa de ficha ──
    heroRender: '/desarrollos/Valmira/galeria-valmira/VistaDesarrollo.jpg',
    heroLogoScale: 0.7,
    tagline: { es: 'Departamentos con entrega inmediata en Gran Vía' },
    highlights: [
      { label: 'Ubicación', labelEn: 'Location', value: 'Av. Huayacán' },
      { label: 'Tipología', labelEn: 'Property type', value: '2 a 3 Rec', valueEn: '2 to 3 Bed' },
      { label: 'Superficie', labelEn: 'Size', value: 'Desde 87 m²', valueEn: 'From 87 sqm' },
    ],
    gallery: [
      '/desarrollos/Valmira/galeria-valmira/Sala.jpg',
      '/desarrollos/Valmira/galeria-valmira/Cocina.jpg',
      '/desarrollos/Valmira/galeria-valmira/Hab..jpg',
      '/desarrollos/Valmira/galeria-valmira/Comedor.jpg',
    ],
    amenitiesGallery: [
      '/desarrollos/Valmira/galeria-valmira/Gym.jpg',
      '/desarrollos/Valmira/galeria-valmira/cancha-futbol.jpg',
      '/desarrollos/Valmira/galeria-valmira/pet-park.jpg',
      '/desarrollos/Valmira/galeria-valmira/Area-Niños.jpg',
    ],
    projectTitle: { es: 'Departamentos de 2 y 3 recámaras' },
    projectTitleMuted: { es: 'con entrega inmediata en Gran Vía' },
    projectBody: [
      {
        es: 'Valmira es un desarrollo de Urban Homes sobre **avenida Huayacán**, dentro de Gran Vía, una comunidad cerrada en una de las zonas de mayor plusvalía de Cancún — y con **entrega inmediata**, sin esperar a que termine la construcción.',
        en: 'Valmira is a development by Urban Homes on **Avenida Huayacán**, inside Gran Vía, a gated community in one of Cancún\'s highest-value areas — with **immediate delivery**, no waiting for construction to finish.',
      },
      {
        es: 'Departamentos de 2 y 3 recámaras desde **87 m²**, con cocina integral equipada, walk-in closet y **acabados premium importados** — pensados para quienes buscan vivir o invertir con la certeza de un desarrollo ya entregado.',
        en: 'Apartments with 2 and 3 bedrooms from **87 sqm**, with a fully equipped kitchen, walk-in closet and **imported premium finishes** — designed for those looking to live or invest with the certainty of an already-delivered development.',
      },
    ],
    locationBullets: [
      { es: 'Sobre avenida Huayacán, dentro de Gran Vía' },
      { es: 'A 12 minutos del aeropuerto de Cancún' },
      { es: 'A 9 minutos de la estación del Tren Maya' },
    ],
    location: { lat: 21.0753984, lng: -86.8860978, address: 'Gran Vía, Av. Huayacán, Cancún, Q. Roo' },
    amenities: [
      { key: 'gym', labelOverride: 'Gym & Wellness' },
      { key: 'pet-park', labelOverride: 'Pet Park' },
      { key: 'cancha-padel', labelOverride: 'Cancha de Pádel' },
      { key: 'cancha-futbol', labelOverride: 'Cancha de Fútbol' },
      { key: 'area-infantil', labelOverride: 'Área de Niños' },
    ],
    floorPlans: [
      {
        slug: '2rec',
        label: { es: '2 Recámaras' },
        image: '/desarrollos/Valmira/floor-plans/2rec.webp',
        virtualTourUrl: 'https://my.matterport.com/show/?m=nVe4hfX2hZw',
        specs: [
          { key: 'recamaras', label: { es: 'Recámaras' }, value: '2' },
          { key: 'banos', label: { es: 'Baños' }, value: '2' },
          { key: 'areaTotal', label: { es: 'Área total' }, value: '87 m²' },
          { key: 'estacionamiento', label: { es: 'Estacionamiento' }, value: '2 a 1 cajón' },
        ],
      },
      {
        slug: '3rec',
        label: { es: '3 Recámaras' },
        image: '/desarrollos/Valmira/floor-plans/3rec.webp',
        specs: [
          { key: 'recamaras', label: { es: 'Recámaras' }, value: '3' },
          { key: 'banos', label: { es: 'Baños' }, value: '2' },
          { key: 'areaTotal', label: { es: 'Área total' }, value: '109 m²' },
          { key: 'estacionamiento', label: { es: 'Estacionamiento' }, value: '2 a 1 cajones' },
        ],
      },
    ],
  },
  {
    slug: 'vellmari-urban',
    name: 'Vellmari',
    relationship: 'sales-partner',
    developer: 'Urban Homes',
    brand: 'Urban Homes',
    city: 'Puerto Cancún',
    type: 'Residencial',
    intent: ['vivir', 'invertir'],
    status: 'Preventa',
    image: '/desarrollos/Vellmari/ENTREGAFINAL_CADU_VELMARI_FACHADA01_.jpg',
    href: '#',
    featured: true,
    logo: '/desarrollos/Vellmari/logo.png',
    logoScale: 1.2,
    badge: 'Preventa',
    propertyType: 'Departamento',
    priceLabel: 'Desde $14,800,000 MXN',
    description:
      'Condominios exclusivos frente a la marina de Puerto Cancún, con amenidades de primer nivel en la zona residencial más cotizada del Caribe mexicano.',
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// Sanity: fusión con el `type: development` de Sanity Studio.
// Mismo patrón que src/lib/data.ts (Plaza): USE_SANITY + cache en memoria con
// TTL + fallback silencioso al estático. Un `development` de Sanity con el
// mismo `slug` REEMPLAZA la entrada estática (Studio gana); slugs que solo
// existen en Sanity se agregan al catálogo. Si Sanity no está configurado o
// falla, todo sigue funcionando exactamente igual que antes (100% estático).
// ─────────────────────────────────────────────────────────────────────────────
import { cache } from 'react';

const USE_SANITY_DEV = !!process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;

function developerDocId(id: DeveloperId): string {
  return `developer-${id.toLowerCase().replace(/\s+/g, '-')}`;
}

function developerIdFromDocId(docId: string | undefined): DeveloperId | undefined {
  if (!docId) return undefined;
  return (Object.keys(developers) as DeveloperId[]).find((id) => developerDocId(id) === docId);
}

let _mergedDevCache: Development[] | null = null;
let _mergedDevCacheTs = 0;
const DEV_CACHE_TTL = 60_000; // 1 minuto

async function loadMergedDevelopments(): Promise<Development[]> {
  if (!USE_SANITY_DEV) return developments;

  const now = Date.now();
  if (_mergedDevCache && now - _mergedDevCacheTs < DEV_CACHE_TTL) return _mergedDevCache;

  try {
    const { fetchAllSanityDevelopments, fetchAllSanityDevelopers } = await import('./sanity/developments');
    const [sanityDevs, sanityDevelopers] = await Promise.all([
      fetchAllSanityDevelopments(),
      fetchAllSanityDevelopers(),
    ]);

    // Créditos de desarrollador: si el Studio trae datos para un id conocido,
    // sobreescriben el registro estático `developers` (edición sin deploy).
    for (const sd of sanityDevelopers) {
      const id = developerIdFromDocId(sd.docId);
      if (!id) continue;
      developers[id] = {
        ...developers[id],
        name: sd.name || developers[id].name,
        logoDark: sd.logoDark ?? developers[id].logoDark,
        blockLabel: sd.blockLabel ? { es: sd.blockLabel, en: sd.blockLabelEn || sd.blockLabel } : developers[id].blockLabel,
        credentials: sd.credentials ? { es: sd.credentials, en: sd.credentialsEn || sd.credentials } : developers[id].credentials,
      };
    }

    const bySlug = new Map(developments.map((d) => [d.slug, d]));
    for (const sd of sanityDevs) {
      const { developerDocId: docId, ...devFields } = sd as Development & { developerDocId?: string };
      const staticEntry = bySlug.get(sd.slug);
      const developerId = developerIdFromDocId(docId) ?? staticEntry?.developer ?? 'Tresor';
      // Merge, no reemplazo — campos que solo existen en el estático (ej.
      // heroImagePosition/heroLogoScale, que ni siquiera son un field de
      // Sanity) se perdían por completo en cuanto un dev tenía CUALQUIER
      // presencia en Sanity, porque esto antes sobreescribía el objeto
      // entero. `devFields` con un valor explícito (incluido `null`, si un
      // editor limpió el campo en Studio) sigue ganando; solo lo que Sanity
      // nunca preguntó (undefined) cae de vuelta al default estático.
      bySlug.set(sd.slug, { ...staticEntry, ...devFields, developer: developerId });
    }

    _mergedDevCache = Array.from(bySlug.values());
    _mergedDevCacheTs = now;
    return _mergedDevCache;
  } catch (e) {
    console.error('[developments] Sanity fetch failed, falling back to static', e);
    return developments;
  }
}

// API sincrónica — retorna el cache ya calentado (ver getMergedDevelopmentsAsync,
// llamado en layout.tsx) o el estático puro si aún no se ha calentado. Mismo
// truco que getStaticOrCached() en data.ts: los Server Components pueden usar
// la versión async, los Client Components (ej. Header.tsx) siguen leyendo
// sincrónicamente pero ya con datos frescos una vez que el layout resolvió.
function getStaticOrCachedDevelopments(): Development[] {
  return _mergedDevCache ?? developments;
}

// API async deduplicada con React.cache() — una sola llamada real por request
// aunque layout/página/componentes la pidan en paralelo.
export const getMergedDevelopmentsAsync = cache((): Promise<Development[]> => loadMergedDevelopments());

export async function getDevelopDevelopmentsAsync(): Promise<Development[]> {
  return (await getMergedDevelopmentsAsync()).filter((d) => d.relationship === 'develop');
}

export async function getSalesPartnerDevelopmentsAsync(): Promise<Development[]> {
  return (await getMergedDevelopmentsAsync()).filter((d) => d.relationship === 'sales-partner');
}

export async function getFeaturedDevelopmentsAsync(): Promise<Development[]> {
  return (await getMergedDevelopmentsAsync()).filter((d) => d.featured);
}

export async function getAllDevelopmentRouteSlugsAsync(): Promise<string[]> {
  const merged = await getMergedDevelopmentsAsync();
  return merged.filter((d) => !d.comingSoon).map((d) => plazaSlugFromHref(d.href)).filter((s): s is string => Boolean(s));
}

// ── Selectores por relación (cada sección del home filtra de aquí) ──
// Sincrónicos, sobre el cache ya calentado por el layout (ver arriba). Son
// FUNCIONES (no arrays precalculados) a propósito: si fueran `const`, se
// evaluarían una sola vez al cargar el módulo —antes de que exista cualquier
// request— y quedarían congelados con el catálogo 100% estático para
// siempre. Como función, cada llamada relee el cache ya tibio del layout.
// Se mantienen por compatibilidad con Client Components como Header.tsx.
export function getDevelopDevelopments(): Development[] {
  return getStaticOrCachedDevelopments().filter((d) => d.relationship === 'develop');
}

export function getSalesPartnerDevelopments(): Development[] {
  return getStaticOrCachedDevelopments().filter((d) => d.relationship === 'sales-partner');
}

export function getFeaturedDevelopments(): Development[] {
  return getStaticOrCachedDevelopments().filter((d) => d.featured);
}

export const cities: { name: City; tagline: string }[] = [
  { name: 'Cancún', tagline: 'Plusvalía y vida urbana frente al Caribe' },
  { name: 'Playa del Carmen', tagline: 'Lujo cosmopolita en la Riviera Maya' },
  { name: 'Tulum', tagline: 'El destino de inversión de mayor crecimiento' },
];

export function countByCity(city: City): number {
  return getStaticOrCachedDevelopments().filter((d) => d.city === city).length;
}

export function formatPrice(d: Development): string | null {
  if (!d.priceFrom) return null;
  if (d.currency === 'USD') {
    return `Desde USD $${d.priceFrom.toLocaleString('en-US')}`;
  }
  return `Desde $${d.priceFrom.toLocaleString('es-MX')} MXN`;
}

// ── Precio en vivo (solo Tresor) ──
// Para desarrollos donde Tresor controla el inventario, el precio del card
// SIEMPRE debe reflejar el mínimo disponible real (Sanity/ficha), no un
// número capturado a mano en este archivo. Sales Partner y "próximamente"
// no tienen inventario propio, así que se quedan con su priceLabel estático.
function plazaSlugFromHref(href: string): string | null {
  const match = href.match(/^\/desarrollos\/([^/]+)$/);
  return match ? match[1] : null;
}

// Slugs de ruta de TODOS los desarrollos con ficha propia bajo /desarrollos/
// (Tresor + Sales Partner), para generateStaticParams. "Próximamente" y sin
// href real (#) quedan fuera — no tienen página que generar.
export function allDevelopmentRouteSlugs(): string[] {
  return developments
    .filter((d) => !d.comingSoon)
    .map((d) => plazaSlugFromHref(d.href))
    .filter((s): s is string => Boolean(s));
}

export async function withLivePrice(dev: Development): Promise<Development> {
  if (dev.relationship !== 'develop' || dev.comingSoon) return dev;
  const plazaSlug = plazaSlugFromHref(dev.href);
  if (!plazaSlug) return dev;

  const plaza = await getPlazaBySlugAsync(plazaSlug);
  if (!plaza) return dev;

  const minPrice = getMinAvailablePrice(plaza);
  if (minPrice == null) return dev;

  return { ...dev, priceLabel: `Desde $${minPrice.toLocaleString('es-MX')} MXN + IVA` };
}

export async function withLivePrices(devs: Development[]): Promise<Development[]> {
  return Promise.all(devs.map(withLivePrice));
}

// Monto del apartado (MXN). Se resuelve así, en orden:
//   1) `reservationAmount` explícito del desarrollo (override)
//   2) $50,000 si es un desarrollo propio de Tresor (relationship 'develop')
//   3) $25,000 para todo lo demás (Sales Partner)
// IMPORTANTE: el monto SIEMPRE se calcula server-side desde este helper — el
// cliente nunca lo envía. Si se confiara en un monto enviado por el navegador,
// alguien podría apartar por $1.
export function getReservationAmount(dev: Development): number {
  if (typeof dev.reservationAmount === 'number' && dev.reservationAmount > 0) {
    return dev.reservationAmount;
  }
  return dev.relationship === 'develop' ? 50000 : 25000;
}

// ─────────────────────────────────────────────────────────────────────────────
// ADAPTADOR UNIFICADO — la keystone.
// Devuelve UN `Development` completo fusionando la data estática del card
// (developments.ts) con la data rica de ficha (plazas.json/Sanity vía Plaza).
// La ficha consume ESTO, no el `Plaza` crudo. El día que todo viva en Sanity,
// solo cambia la fuente de datos aquí dentro; la ficha no se entera.
// `routeSlug` es el slug de la URL (ej. 'long-island'), no el slug interno.
// ─────────────────────────────────────────────────────────────────────────────
export async function getDevelopment(routeSlug: string): Promise<Development | undefined> {
  // `base` sale del catálogo fusionado (estático + Sanity `development`) —
  // si el Studio tiene un doc para este slug, GANA sobre developments.ts.
  const catalog = await getMergedDevelopmentsAsync();
  const base = catalog.find((d) => plazaSlugFromHref(d.href) === routeSlug);
  if (!base) return undefined;

  // Data rica de ficha Tresor (hoy Plaza/plazas.json, ya Sanity vía queries.ts).
  // Si no existe (Sales Partner: su ficha completa ya vive en `base` arriba,
  // estática o Sanity), regresamos solo la capa de card+ficha ya resuelta.
  const plaza = await getPlazaBySlugAsync(routeSlug);
  if (!plaza) return base;

  const hasInventory = (plaza.units?.length ?? 0) > 0;
  const body = [
    { es: plaza.projectBody1, en: plaza.projectBody1En },
    { es: plaza.projectBody2, en: plaza.projectBody2En },
  ].filter((p) => p.es) as I18nText[];
  const bullets = [
    { es: plaza.bullet1, en: plaza.bullet1En },
    { es: plaza.bullet2, en: plaza.bullet2En },
    { es: plaza.bullet3, en: plaza.bullet3En },
  ].filter((b) => b.es) as I18nText[];

  const merged: Development = {
    ...base,
    // La ficha (plaza) tiene el deliveryWindow rico ("DIC 2026 — MAR 2027");
    // el de developments.ts es corto ("2026"). Preferimos el rico.
    deliveryWindow: plaza.deliveryWindow ?? base.deliveryWindow,
    highlights: plaza.highlights?.length ? plaza.highlights : undefined,
    heroRender: plaza.heroRender ?? base.image,
    tagline: plaza.tagline ? { es: plaza.tagline, en: plaza.taglineEn } : undefined,
    projectTitle: plaza.projectTitle ? { es: plaza.projectTitle, en: plaza.projectTitleEn } : undefined,
    projectBody: body.length ? body : undefined,
    gallery: plaza.gallery?.length ? plaza.gallery : undefined,
    location: plaza.location,
    locationBullets: bullets.length ? bullets : undefined,
    // `dev.floorPlans` (forma flexible) es exclusivo de Sales Partner, se
    // define directo en developments.ts — Tresor sigue leyendo
    // `plaza.floorPlans` (forma rígida área/frente/fondo) vía FloorPlans.tsx.
    unitSpecsTemplate: plaza.unitSpecsTemplate,
    masterPlan: plaza.masterPlanImage
      ? { image: plaza.masterPlanImage, imageLevel2: plaza.masterPlanLevel2 }
      : undefined,
    // Con inventario → interactivo (pines). Sin inventario → estático (imagen).
    masterPlanMode: hasInventory ? 'interactive' : 'static',
    paymentPlans: plaza.paymentPlans?.length ? plaza.paymentPlans : undefined,
    units: plaza.units?.length ? plaza.units : undefined,
    seoTitle: plaza.seoTitle ? { es: plaza.seoTitle, en: plaza.seoTitleEn } : undefined,
    seoDescription: plaza.seoDescription ? { es: plaza.seoDescription, en: plaza.seoDescriptionEn } : undefined,
  };

  // Precio en vivo: mínimo disponible real del inventario (solo Tresor).
  if (hasInventory) {
    const minPrice = getMinAvailablePrice(plaza);
    if (minPrice != null) merged.priceLabel = `Desde $${minPrice.toLocaleString('es-MX')} MXN + IVA`;
  }

  return merged;
}
