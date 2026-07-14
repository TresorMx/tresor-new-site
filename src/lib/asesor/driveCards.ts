import type { LucideIcon } from 'lucide-react';
import {
  FileText, ClipboardList, Layers, Banknote, MapPin, Megaphone, Building2,
  Image as ImageIcon, Receipt, ReceiptText, CheckSquare, FileSignature,
  Sparkles, Video, LayoutGrid, HardHat, Calculator,
  BookOpen, Box, FileStack, Film, Palette, DoorOpen, Clapperboard, MapPinned,
} from 'lucide-react';

export interface DriveCard {
  key: string;          // identifica el documento en la ruta de descarga (= key de fetchDriveFileUrl)
  label: string;
  desc: string;
  icon: LucideIcon;
}

// Catálogo maestro — TODOS los documentos posibles del Drive, uno por key.
// Un layout (ver DRIVE_LAYOUTS) es solo una lista de keys en el orden que
// se quiera mostrar; agregar un documento nuevo al catálogo no lo pone en
// ningún drive hasta que un layout lo referencie. Mismo espíritu que
// AMENITY_CATALOG en amenities.ts — fuente única, sin texto libre repetido.
export const DRIVE_CATALOG: Record<string, DriveCard> = {
  presentation:  { key: 'presentation',  label: 'Presentación',  desc: 'Pitch deck completo del proyecto', icon: FileText },
  priceList:     { key: 'priceList',     label: 'Lista de Precios', desc: 'Precios actualizados por nivel', icon: ClipboardList },
  masterPlan:    { key: 'masterPlan',    label: 'Master Plan',   desc: 'Distribución con cotas', icon: Layers },
  bankAccounts:  { key: 'bankAccounts',  label: 'Cuentas Bancarias', desc: 'Datos para depósito y SPEI', icon: Banknote },
  location:      { key: 'location',      label: 'Ubicación',     desc: 'Coordenadas, KML y entorno', icon: MapPin },
  marketing:     { key: 'marketing',     label: 'Materiales de Marketing', desc: 'Posts, banners y videos', icon: Megaphone },
  developer:     { key: 'developer',     label: 'Desarrollador', desc: 'Trayectoria del desarrollador', icon: Building2 },
  renders:       { key: 'renders',       label: 'Renders',       desc: 'Imágenes en alta resolución', icon: ImageIcon },
  receiptPay:      { key: 'receiptPay',      label: 'Recibo de Pago',     desc: 'Formato editable', icon: Receipt },
  receiptReserve:  { key: 'receiptReserve',  label: 'Recibo de Apartado', desc: 'Formato editable', icon: ReceiptText },
  checklist:       { key: 'checklist',       label: 'Check List',        desc: 'Validación previa al cierre', icon: CheckSquare },
  offerLetter:     { key: 'offerLetter',     label: 'Carta Oferta',      desc: 'Plantilla institucional', icon: FileSignature },
  // ── Extendidos (Live Desarrollos y los que sigan) ──
  amenities:            { key: 'amenities',            label: 'Amenidades',    desc: 'Ficha y galería de amenidades', icon: Sparkles },
  virtualTour:           { key: 'virtualTour',           label: 'Tour Virtual',  desc: 'Recorrido virtual 360°', icon: Video },
  floorPlans:            { key: 'floorPlans',            label: 'Floor Plans',   desc: 'Todas las tipologías juntas', icon: LayoutGrid },
  constructionProgress:  { key: 'constructionProgress',  label: 'Avances de Obra', desc: 'Reporte de avance de construcción', icon: HardHat },
  quoter:                { key: 'quoter',                label: 'Cotizador Tresor', desc: 'Cotiza en línea con el equipo Tresor', icon: Calculator },
  // ── Extendidos (Urban Homes, Onix Living y los que sigan) ──
  brochure:              { key: 'brochure',              label: 'Brochure',       desc: 'Brochure comercial del proyecto', icon: BookOpen },
  prototypes:            { key: 'prototypes',            label: 'Prototipos',     desc: 'Fichas de cada prototipo', icon: Box },
  individualFloorPlans:  { key: 'individualFloorPlans',  label: 'Planos Individuales', desc: 'Plano por tipología, uno a uno', icon: FileStack },
  multimedia:            { key: 'multimedia',            label: 'Contenido Multimedia', desc: 'Fotos y videos para redes', icon: Film },
  finishesCatalog:       { key: 'finishesCatalog',       label: 'Catálogo de Acabados', desc: 'Materiales y especificaciones', icon: Palette },
  showUnit:              { key: 'showUnit',              label: 'Departamento Muestra', desc: 'Fotos y video del depa muestra', icon: DoorOpen },
  videos:                { key: 'videos',                label: 'Videos',         desc: 'Videos del proyecto', icon: Clapperboard },
  availability:          { key: 'availability',          label: 'Disponibilidad', desc: 'Mapa interactivo de unidades disponibles', icon: MapPinned },
};

interface DriveLayoutItem {
  key: string;        // debe existir en DRIVE_CATALOG
  label?: string;      // override de label solo para este layout (ej. "Inventario y Lista de Precios")
  fullWidth?: boolean; // ocupa las 2 columnas del grid (ej. "Cotizador Tresor")
  excludeTypes?: string[]; // no se muestra si dev.type está en esta lista (ej. showUnit no aplica a 'Lotes')
}

// Documentos que aplican a CUALQUIER desarrollador que no sea Quattro
// (Tresor) — se agregan automáticamente al final de cada layout (antes de
// los items fullWidth) sin tener que repetirlos en cada entrada de
// DRIVE_LAYOUTS. Ej: Departamento Muestra aplica a todos los Sales Partner
// excepto desarrollos tipo 'Lotes' (no hay depa muestra en un lote).
const UNIVERSAL_ITEMS: DriveLayoutItem[] = [
  { key: 'showUnit', excludeTypes: ['Lotes'] },
  { key: 'finishesCatalog' },
];

// Layout genérico para cualquier Sales Partner SIN layout propio (Onix,
// Urban Homes, y los que sigan) — a diferencia de curar campo por campo,
// aquí se listan TODOS los documentos del catálogo y la visibilidad real la
// decide `available[key]` (solo aparece si el editor llenó ese campo en
// Sanity). Evita el bug de "llené 8 campos y solo aparecen 6" por tener
// listas curadas distintas por desarrollador.
const ALL_ITEMS_LAYOUT: DriveLayoutItem[] = [
  { key: 'presentation' },
  { key: 'priceList' },
  { key: 'masterPlan' },
  { key: 'bankAccounts' },
  { key: 'location' },
  { key: 'marketing' },
  { key: 'developer' },
  { key: 'renders' },
  { key: 'amenities' },
  { key: 'virtualTour' },
  { key: 'floorPlans' },
  { key: 'constructionProgress' },
  { key: 'brochure' },
  { key: 'prototypes' },
  { key: 'individualFloorPlans' },
  { key: 'multimedia' },
  { key: 'finishesCatalog' },
  { key: 'showUnit', excludeTypes: ['Lotes'] },
  { key: 'videos' },
  { key: 'availability' },
  { key: 'quoter', fullWidth: true },
];

// Layout por grupo de desarrollador — qué documentos se muestran y en qué
// orden. `default` es Quattro (Tresor), curado a mano, no cambia. Un
// desarrollador SIN entrada aquí (cualquier Sales Partner nuevo) cae en
// ALL_ITEMS_LAYOUT, ver getDriveLayout. `Live` sigue con su orden propio
// (viene de una captura de referencia específica).
export const DRIVE_LAYOUTS: Record<string, DriveLayoutItem[]> = {
  default: [
    { key: 'presentation' },
    { key: 'priceList' },
    { key: 'masterPlan' },
    { key: 'bankAccounts' },
    { key: 'location' },
    { key: 'marketing' },
    { key: 'developer' },
    { key: 'renders' },
    { key: 'quoter', fullWidth: true },
  ],
  Live: [
    { key: 'presentation' },
    { key: 'location' },
    { key: 'renders' },
    { key: 'amenities' },
    { key: 'virtualTour' },
    { key: 'floorPlans' },
    { key: 'constructionProgress' },
    { key: 'priceList', label: 'Inventario y Lista de Precios' },
    { key: 'availability' },
    { key: 'quoter', fullWidth: true },
  ],
};

// Formatos administrativos — hoy solo Quattro (Tresor) los tiene; mismo
// patrón de layout por si algún Sales Partner los necesita en el futuro.
export const DRIVE_ADMIN_LAYOUTS: Record<string, DriveLayoutItem[]> = {
  default: [
    { key: 'receiptPay' },
    { key: 'receiptReserve' },
    { key: 'checklist' },
    { key: 'offerLetter' },
  ],
};

export function getDriveLayout(developerId: string, devType?: string): DriveLayoutItem[] {
  if (developerId === 'Tresor') return DRIVE_LAYOUTS.default;
  const base = DRIVE_LAYOUTS[developerId] ?? ALL_ITEMS_LAYOUT;
  const extra = UNIVERSAL_ITEMS.filter((u) => !base.some((b) => b.key === u.key));
  const withExtra = [...base.filter((i) => !i.fullWidth), ...extra, ...base.filter((i) => i.fullWidth)];
  return withExtra.filter((item) => !item.excludeTypes?.includes(devType ?? ''));
}

export function getDriveAdminLayout(developerId: string): DriveLayoutItem[] {
  return DRIVE_ADMIN_LAYOUTS[developerId] ?? DRIVE_ADMIN_LAYOUTS.default;
}
