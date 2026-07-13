import type { LucideIcon } from 'lucide-react';
import {
  FileText, ClipboardList, Layers, Banknote, MapPin, Megaphone, Building2,
  Image as ImageIcon, Receipt, ReceiptText, CheckSquare, FileSignature,
  Sparkles, Video, LayoutGrid, HardHat, Calculator,
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
};

interface DriveLayoutItem {
  key: string;        // debe existir en DRIVE_CATALOG
  label?: string;      // override de label solo para este layout (ej. "Inventario y Lista de Precios")
  fullWidth?: boolean; // ocupa las 2 columnas del grid (ej. "Cotizador Tresor")
}

// Layout por grupo de desarrollador — qué documentos se muestran y en qué
// orden. `default` es el que ya existía (Quattro y cualquiera sin layout
// propio todavía). Agregar un desarrollador nuevo (Urban Homes, Onix
// Living…) es solo una entrada más aquí, sin tocar el componente.
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

export function getDriveLayout(developerId: string): DriveLayoutItem[] {
  return DRIVE_LAYOUTS[developerId] ?? DRIVE_LAYOUTS.default;
}

export function getDriveAdminLayout(developerId: string): DriveLayoutItem[] {
  return DRIVE_ADMIN_LAYOUTS[developerId] ?? DRIVE_ADMIN_LAYOUTS.default;
}
