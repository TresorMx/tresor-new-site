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

  // ── Extendidos — layout de Live Desarrollos (y los que sigan; ver
  // src/lib/asesor/driveCards.ts DRIVE_LAYOUTS). "File"/nombre distinto al
  // módulo real cuando ya existe un campo con ese nombre en el schema. ──
  defineField({ name: 'amenitiesFile', title: 'Amenidades (Drive)', type: 'driveAsset', group: 'drive', description: 'Ficha o brochure de amenidades (PDF o liga). Independiente del módulo "Amenidades" de la ficha pública.' }),
  defineField({ name: 'virtualTour', title: 'Tour Virtual', type: 'driveAsset', group: 'drive', description: 'Liga al recorrido virtual 360°.' }),
  defineField({ name: 'floorPlansFile', title: 'Floor Plans (Drive)', type: 'driveAsset', group: 'drive', description: 'PDF con todas las tipologías juntas, o liga (archivo o liga).' }),
  defineField({ name: 'constructionProgress', title: 'Avances de Obra', type: 'driveAsset', group: 'drive', description: 'Reporte o galería de avance de construcción (PDF, ZIP o liga).' }),
  defineField({ name: 'quoter', title: 'Cotizador Tresor', type: 'driveAsset', group: 'drive', description: 'Liga al cotizador (o archivo, si aplica).' }),

  // ── Extendidos — layout de Urban Homes / Onix Living (y los que sigan) ──
  defineField({ name: 'brochure', title: 'Brochure', type: 'driveAsset', group: 'drive', description: 'Brochure comercial del proyecto (PDF o liga).' }),
  defineField({ name: 'prototypes', title: 'Prototipos', type: 'driveAsset', group: 'drive', description: 'Fichas de cada prototipo (PDF, ZIP o liga).' }),
  defineField({ name: 'individualFloorPlans', title: 'Planos Individuales', type: 'driveAsset', group: 'drive', description: 'Plano por tipología, uno a uno (ZIP o liga).' }),
  defineField({ name: 'multimedia', title: 'Contenido Multimedia', type: 'driveAsset', group: 'drive', description: 'Fotos y videos para redes (ZIP o liga a carpeta compartida).' }),
  defineField({ name: 'finishesCatalog', title: 'Catálogo de Acabados', type: 'driveAsset', group: 'drive', description: 'Materiales y especificaciones (PDF o liga).' }),
  defineField({ name: 'showUnit', title: 'Departamento Muestra', type: 'driveAsset', group: 'drive', description: 'Fotos y video del depa muestra (ZIP o liga).' }),
  defineField({ name: 'videos', title: 'Videos', type: 'driveAsset', group: 'drive', description: 'Videos del proyecto (liga o archivo).' }),
  defineField({ name: 'availability', title: 'Disponibilidad', type: 'driveAsset', group: 'drive', description: 'Mapa interactivo de disponibilidad del desarrollador (liga), o archivo. Este es el que también se usa para el botón "Ver disponibilidad" en floor plans cuando el asesor está logueado.' }),
];
