import { defineField } from 'sanity';

// Campos del Drive de Ventas — compartidos entre `plaza` (Quattro) y
// `development` (Sales Partner) para no duplicar las 12 definiciones dos
// veces. Cada uno es tipo `driveAsset` (archivo O liga externa, ver
// driveAsset.ts) que llena el usuario en Studio; /api/asesor/file los
// resuelve por su `name` (la misma key que usa
// src/lib/asesor/driveCards.ts) — cambiar un `name` aquí rompe esa
// relación, no renombrar sin avisar.
export const driveFields = [
  defineField({ name: 'presentation', title: 'Presentación', type: 'driveAsset', group: 'drive', description: 'Pitch deck completo del proyecto (PDF o liga).' }),
  defineField({ name: 'priceList', title: 'Lista de Precios', type: 'driveAsset', group: 'drive', description: 'Precios actualizados por nivel (PDF o liga).' }),
  defineField({ name: 'masterPlan', title: 'Master Plan', type: 'driveAsset', group: 'drive', description: 'Distribución con cotas (PDF o liga).' }),
  defineField({ name: 'bankAccounts', title: 'Cuentas Bancarias', type: 'driveAsset', group: 'drive', description: 'Datos para depósito y SPEI (PDF o liga). Sensible — solo asesores logueados pueden verlo.' }),
  defineField({ name: 'locationFile', title: 'Ubicación', type: 'driveAsset', group: 'drive', description: 'Coordenadas, KML, mapa del entorno o liga (ej. Google Maps).' }),
  defineField({ name: 'marketing', title: 'Materiales de Marketing', type: 'driveAsset', group: 'drive', description: 'Posts, banners y videos (ZIP o liga a carpeta compartida).' }),
  defineField({ name: 'developerFile', title: 'Desarrollador', type: 'driveAsset', group: 'drive', description: 'Trayectoria del desarrollador (PDF o liga).' }),
  defineField({ name: 'renders', title: 'Renders', type: 'driveAsset', group: 'drive', description: 'Imágenes en alta resolución (ZIP o liga a carpeta compartida).' }),
  defineField({ name: 'receiptPay', title: 'Recibo de Pago', type: 'driveAsset', group: 'drive', description: 'Formato editable (archivo o liga).' }),
  defineField({ name: 'receiptReserve', title: 'Recibo de Apartado', type: 'driveAsset', group: 'drive', description: 'Formato editable (archivo o liga).' }),
  defineField({ name: 'checklist', title: 'Check List', type: 'driveAsset', group: 'drive', description: 'Validación previa al cierre (archivo o liga).' }),
  defineField({ name: 'offerLetter', title: 'Carta Oferta', type: 'driveAsset', group: 'drive', description: 'Plantilla institucional (archivo o liga).' }),
];
