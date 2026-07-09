import type { LucideIcon } from 'lucide-react';
import {
  FileText, ClipboardList, Layers, Banknote, MapPin, Megaphone, Building2,
  Image as ImageIcon, Receipt, ReceiptText, CheckSquare, FileSignature,
} from 'lucide-react';

export interface DriveCard {
  key: string;          // identifica el documento en la ruta de descarga
  label: string;
  desc: string;
  icon: LucideIcon;
}

// Drive principal — un documento comercial por card. Mismo set que ya usaba
// la página de brokers; es el template que se repite por cada desarrollo.
export const DRIVE_MAIN: DriveCard[] = [
  { key: 'presentation', label: 'Presentación', desc: 'Pitch deck completo del proyecto', icon: FileText },
  { key: 'priceList', label: 'Lista de Precios', desc: 'Precios actualizados por nivel', icon: ClipboardList },
  { key: 'masterPlan', label: 'Master Plan', desc: 'Distribución con cotas', icon: Layers },
  { key: 'bankAccounts', label: 'Cuentas Bancarias', desc: 'Datos para depósito y SPEI', icon: Banknote },
  { key: 'location', label: 'Ubicación', desc: 'Coordenadas, KML y entorno', icon: MapPin },
  { key: 'marketing', label: 'Materiales de Marketing', desc: 'Posts, banners y videos', icon: Megaphone },
  { key: 'developer', label: 'Desarrollador', desc: 'Trayectoria del desarrollador', icon: Building2 },
  { key: 'renders', label: 'Renders', desc: 'Imágenes en alta resolución', icon: ImageIcon },
];

// Formatos administrativos — misma estructura, sección aparte.
export const DRIVE_ADMIN: DriveCard[] = [
  { key: 'receiptPay', label: 'Recibo de Pago', desc: 'Formato editable', icon: Receipt },
  { key: 'receiptReserve', label: 'Recibo de Apartado', desc: 'Formato editable', icon: ReceiptText },
  { key: 'checklist', label: 'Check List', desc: 'Validación previa al cierre', icon: CheckSquare },
  { key: 'offerLetter', label: 'Carta Oferta', desc: 'Plantilla institucional', icon: FileSignature },
];
