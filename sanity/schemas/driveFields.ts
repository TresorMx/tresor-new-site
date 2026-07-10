import { defineField } from 'sanity';

// Campos del Drive de Ventas — compartidos entre `plaza` (Quattro) y
// `development` (Sales Partner) para no duplicar las 12 definiciones dos
// veces. Cada uno es un archivo (PDF, ZIP, DOCX, lo que sea) que sube el
// usuario en Studio; /api/asesor/file los resuelve por su `name` (la misma
// key que usa src/lib/asesor/driveCards.ts) — cambiar un `name` aquí rompe
// esa relación, no renombrar sin avisar.
export const driveFields = [
  defineField({ name: 'presentation', title: 'Presentación', type: 'file', group: 'drive', description: 'Pitch deck completo del proyecto (PDF).' }),
  defineField({ name: 'priceList', title: 'Lista de Precios', type: 'file', group: 'drive', description: 'Precios actualizados por nivel (PDF).' }),
  defineField({ name: 'masterPlan', title: 'Master Plan', type: 'file', group: 'drive', description: 'Distribución con cotas (PDF).' }),
  defineField({ name: 'bankAccounts', title: 'Cuentas Bancarias', type: 'file', group: 'drive', description: 'Datos para depósito y SPEI (PDF). Sensible — solo asesores logueados pueden descargarlo.' }),
  defineField({ name: 'location', title: 'Ubicación', type: 'file', group: 'drive', description: 'Coordenadas, KML o mapa del entorno.' }),
  defineField({ name: 'marketing', title: 'Materiales de Marketing', type: 'file', group: 'drive', description: 'Posts, banners y videos (ZIP).' }),
  defineField({ name: 'developerFile', title: 'Desarrollador', type: 'file', group: 'drive', description: 'Trayectoria del desarrollador (PDF).' }),
  defineField({ name: 'renders', title: 'Renders', type: 'file', group: 'drive', description: 'Imágenes en alta resolución (ZIP).' }),
  defineField({ name: 'receiptPay', title: 'Recibo de Pago', type: 'file', group: 'drive', description: 'Formato editable.' }),
  defineField({ name: 'receiptReserve', title: 'Recibo de Apartado', type: 'file', group: 'drive', description: 'Formato editable.' }),
  defineField({ name: 'checklist', title: 'Check List', type: 'file', group: 'drive', description: 'Validación previa al cierre.' }),
  defineField({ name: 'offerLetter', title: 'Carta Oferta', type: 'file', group: 'drive', description: 'Plantilla institucional.' }),
];
