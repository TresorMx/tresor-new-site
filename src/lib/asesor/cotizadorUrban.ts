/* ────────────────────────────────────────────────────────────
   Cotizador Urban Homes — La Selva — data + motor de cálculo
   Fuente: "COTIZADOR VERSION FEB 2.1 2026.xlsx", pestaña
   COTIZADOR URBAN (tabla de unidades A90:E133, catálogo de
   cierre B179:C182). A diferencia del cotizador de Quattro, el
   precio de la unidad YA varía según la forma de pago elegida
   (no es un precio único + descuento por esquema), y el
   financiamiento puede combinar hasta 3 fuentes a la vez
   (crédito bancario + Infonavit + Fovissste).
   ──────────────────────────────────────────────────────────── */

export type Edificio = 'Viena' | 'Verona';

export type EsquemaPago =
  | 'contado'
  | 'infonavit'
  | 'bancoExterno'        // Santander / HSBC
  | 'promocionBanorte'    // mismo precio que Infonavit, escrituración al 7% en vez de 6%
  | 'bbva'
  | 'banamex';            // = precio bancoExterno − 5% (solo existe para Viena en la fuente)

export const ESQUEMA_LABEL: Record<EsquemaPago, string> = {
  contado: 'Contado',
  infonavit: 'Infonavit',
  bancoExterno: 'Banco externo (Santander/HSBC)',
  promocionBanorte: 'Promoción avalúo y Banorte',
  bbva: 'BBVA',
  banamex: 'Banamex',
};

export interface UnidadUrban {
  id: string;                    // 'viena-1n-contado'
  edificio: Edificio;
  nivel: 1 | 2 | 3 | 4;
  esquema: EsquemaPago;
  label: string;                 // 'Viena 1N · Contado'
  precio: number;
  gastosEscrituracionPct: number; // 0.07 o 0.06 (Infonavit)
  entidadValuadora: string;      // informativo — VASUIN, AGA, TASVALUO, BANCO…
}

function u(
  edificio: Edificio, nivel: 1 | 2 | 3 | 4, esquema: EsquemaPago,
  precio: number, gastosEscrituracionPct: number, entidadValuadora: string,
): UnidadUrban {
  return {
    id: `${edificio.toLowerCase()}-${nivel}n-${esquema}`,
    edificio, nivel, esquema,
    label: `${edificio} ${nivel}N · ${ESQUEMA_LABEL[esquema]}`,
    precio, gastosEscrituracionPct, entidadValuadora,
  };
}

export const UNIDADES_URBAN: UnidadUrban[] = [
  // Viena — contado
  u('Viena', 1, 'contado', 3200000, 0.07, 'VASUIN'),
  u('Viena', 2, 'contado', 3069000, 0.07, 'VASUIN'),
  u('Viena', 3, 'contado', 3035000, 0.07, 'VASUIN'),
  u('Viena', 4, 'contado', 2888000, 0.07, 'VASUIN'),
  // Viena — infonavit
  u('Viena', 1, 'infonavit', 3457000, 0.06, 'AGA'),
  u('Viena', 2, 'infonavit', 3354000, 0.06, 'AGA'),
  u('Viena', 3, 'infonavit', 3285000, 0.06, 'AGA'),
  u('Viena', 4, 'infonavit', 3148000, 0.06, 'AGA'),
  // Viena — banco externo
  u('Viena', 1, 'bancoExterno', 3480000, 0.07, 'VASUIN EXT'),
  u('Viena', 2, 'bancoExterno', 3397000, 0.07, 'VASUIN EXT'),
  u('Viena', 3, 'bancoExterno', 3252000, 0.07, 'VASUIN EXT'),
  u('Viena', 4, 'bancoExterno', 3228000, 0.07, 'VASUIN EXT'),
  // Viena — promoción avalúo y Banorte (mismo precio que infonavit, escrituración 7%)
  u('Viena', 1, 'promocionBanorte', 3457000, 0.07, 'AGA'),
  u('Viena', 2, 'promocionBanorte', 3354000, 0.07, 'AGA'),
  u('Viena', 3, 'promocionBanorte', 3285000, 0.07, 'AGA'),
  u('Viena', 4, 'promocionBanorte', 3148000, 0.07, 'AGA'),
  // Viena — BBVA
  u('Viena', 1, 'bbva', 3442000, 0.07, 'TASVALUO'),
  u('Viena', 2, 'bbva', 3337000, 0.07, 'TASVALUO'),
  u('Viena', 3, 'bbva', 3285000, 0.07, 'TASVALUO'),
  u('Viena', 4, 'bbva', 3263000, 0.07, 'TASVALUO'),
  // Viena — Banamex (banco externo − 5%)
  u('Viena', 1, 'banamex', 3306000, 0.07, 'BANCO'),
  u('Viena', 2, 'banamex', 3227150, 0.07, 'BANCO'),
  u('Viena', 3, 'banamex', 3089400, 0.07, 'BANCO'),
  u('Viena', 4, 'banamex', 3066600, 0.07, 'BANCO'),

  // Verona — contado
  u('Verona', 1, 'contado', 3810000, 0.07, 'VASUIN'),
  u('Verona', 2, 'contado', 3659000, 0.07, 'VASUIN'),
  u('Verona', 3, 'contado', 3618000, 0.07, 'VASUIN'),
  u('Verona', 4, 'contado', 3467000, 0.07, 'VASUIN'),
  // Verona — infonavit
  u('Verona', 1, 'infonavit', 3893000, 0.06, 'AGA'),
  u('Verona', 2, 'infonavit', 3756000, 0.06, 'AGA'),
  u('Verona', 3, 'infonavit', 3610000, 0.06, 'AGA'),
  u('Verona', 4, 'infonavit', 3468000, 0.06, 'AGA'),
  // Verona — promoción avalúo y Banorte
  u('Verona', 1, 'promocionBanorte', 3893000, 0.07, 'AGA'),
  u('Verona', 2, 'promocionBanorte', 3756000, 0.07, 'AGA'),
  u('Verona', 3, 'promocionBanorte', 3610000, 0.07, 'AGA'),
  u('Verona', 4, 'promocionBanorte', 3468000, 0.07, 'AGA'),
  // Verona — BBVA
  u('Verona', 1, 'bbva', 4099000, 0.07, 'TASVALUO'),
  u('Verona', 2, 'bbva', 4059000, 0.07, 'TASVALUO'),
  u('Verona', 3, 'bbva', 4019000, 0.07, 'TASVALUO'),
  u('Verona', 4, 'bbva', 3980000, 0.07, 'TASVALUO'),
  // Verona — banco externo
  u('Verona', 1, 'bancoExterno', 4213000, 0.07, 'VASUIN EXT'),
  u('Verona', 2, 'bancoExterno', 4094000, 0.07, 'VASUIN EXT'),
  u('Verona', 3, 'bancoExterno', 4052000, 0.07, 'VASUIN EXT'),
  u('Verona', 4, 'bancoExterno', 4011000, 0.07, 'VASUIN EXT'),
];

export const getUnidad = (id: string) => UNIDADES_URBAN.find((x) => x.id === id);

/* Paquetes de cierre notarial — catálogo independiente de la unidad
   (dropdown CIERRE, B179:C182 en la fuente). */
export interface PaqueteCierre {
  id: string;
  label: string;
  monto: number;
}

export const PAQUETES_CIERRE: PaqueteCierre[] = [
  { id: '2r-std', label: '2R STD', monto: 30156 },
  { id: '3r-std', label: '3R STD', monto: 31756 },
  { id: '2r-scotiabank', label: '2R Scotiabank', monto: 32216 },
  { id: '3r-scotiabank', label: '3R Scotiabank', monto: 32216 },
];

export const getPaqueteCierre = (id: string) => PAQUETES_CIERRE.find((x) => x.id === id);

/* Canal de origen del prospecto — informativo, no afecta el cálculo
   (fuente: B164:B173; se quitó un "REFERIDO" duplicado del original). */
export const CANALES = [
  'UH Digital', 'FB Asesor', 'Prospección', 'Referido',
  'Piso de venta', 'Broker', 'Referido Cadu', 'Expo', 'Base de datos',
] as const;

export const BANK = {
  beneficiario: 'CADU INMOBILIARIA SA DE CV',
  banco: 'BBVA BANCOMER',
  cuenta: '121930125',
  clabe: '012691001219301255',
};

/* ─────────── Motor de cálculo ─────────── */
export interface FinanciamientoInput {
  bancoAforoPct: number;        // % del PRECIO DE LISTA de la unidad
  infonavitSubcuenta: number;   // $
  infonavitCuenta: number;      // $
  fovisssteImporte: number;     // $
}

export interface CotizarUrbanInput {
  unidad: UnidadUrban;
  descuentoEspecial: number;         // $ (E11)
  precioViviendaOverride?: number;   // $ — si no se da, = precioLista - descuentoEspecial
  cierre: PaqueteCierre;
  financiamiento: FinanciamientoInput;
  reserva: number;                   // $ (E18)
  enganchePct: number;                // % del precio vivienda (B8)
  pagosDiferidosPct: number;          // % del precio vivienda (B9)
  numPagosDiferidos: number;          // E23
  fechas: {
    apartado?: string;
    enganche?: string;
    inicioDiferidos?: string;
    cierre?: string;
  };
}

export interface FilaPagoUrban {
  n: number;
  fecha: string;
  concepto: string;
  importe: number;
}

export interface CotizacionUrban {
  precioLista: number;
  descuentoEspecial: number;
  precioVivienda: number;
  descuentoImplicito: number;    // "E9" — lo que queda sin justificar si se sobre-escribió el precio vivienda
  gastosEscrituracion: number;
  gastosCierre: number;
  totalPrecioMasGastos: number;
  montoBanco: number;
  montoInfonavit: number;
  montoFovissste: number;
  financiamientoTotal: number;
  pagosConRecursosCliente: number;
  montoEnganche: number;
  montoPagosDiferidos: number;
  pagosAlCierre: number;
  saldoAFavorCierre: number;
  mensCreditoAprox: number;
  checkCubrePrecio: 'OK' | 'CHECK';
  filas: FilaPagoUrban[];
  total: number;
}

const round2 = (n: number) => Math.round(n * 100) / 100;

function fmtFecha(iso?: string): string {
  if (!iso) return '';
  const [y, m, d] = iso.split('-');
  if (!y || !m || !d) return '';
  return `${d}/${m}/${y}`;
}

function addMonths(iso: string | undefined, months: number): string {
  if (!iso) return '';
  const [y, m, d] = iso.split('-').map(Number);
  if (!y || !m || !d) return '';
  const base = new Date(y, m - 1, d);
  base.setMonth(base.getMonth() + months);
  const dd = String(base.getDate()).padStart(2, '0');
  const mm = String(base.getMonth() + 1).padStart(2, '0');
  return `${dd}/${mm}/${base.getFullYear()}`;
}

export function cotizarUrban(input: CotizarUrbanInput): CotizacionUrban {
  const {
    unidad, descuentoEspecial, precioViviendaOverride, cierre, financiamiento,
    reserva, enganchePct, pagosDiferidosPct, numPagosDiferidos, fechas,
  } = input;

  const precioLista = unidad.precio;
  const precioVivienda = round2(precioViviendaOverride ?? (precioLista - descuentoEspecial));
  const descuentoImplicito = round2(precioLista - precioVivienda - descuentoEspecial);

  const gastosEscrituracion = round2(precioLista * unidad.gastosEscrituracionPct);
  const gastosCierre = cierre.monto;
  const totalPrecioMasGastos = round2(precioVivienda + gastosEscrituracion + gastosCierre);

  const montoBanco = round2(precioLista * (financiamiento.bancoAforoPct / 100));
  const montoInfonavit = round2(financiamiento.infonavitSubcuenta + financiamiento.infonavitCuenta);
  const montoFovissste = round2(financiamiento.fovisssteImporte);
  const financiamientoTotal = round2(montoBanco + montoInfonavit + montoFovissste);

  const pagosConRecursosCliente = round2(totalPrecioMasGastos - financiamientoTotal);

  const montoEnganche = enganchePct === 0 ? 0 : round2(precioVivienda * (enganchePct / 100) - reserva);
  const montoPagosDiferidos = round2(precioVivienda * (pagosDiferidosPct / 100));

  const cubierto = reserva + montoEnganche + montoPagosDiferidos + financiamientoTotal;
  const pagosAlCierre = round2(Math.max(0, totalPrecioMasGastos - cubierto));
  const saldoAFavorCierre = round2(Math.max(0, cubierto - totalPrecioMasGastos));
  const checkCubrePrecio: 'OK' | 'CHECK' = cubierto > precioVivienda ? 'OK' : 'CHECK';

  const mensCreditoAprox = round2((financiamientoTotal - financiamiento.infonavitSubcuenta) / 1000 * 10.383);

  const filas: FilaPagoUrban[] = [];
  let n = 1;
  filas.push({ n: n++, fecha: fmtFecha(fechas.apartado), concepto: 'Apartado / Reserva', importe: round2(reserva) });
  if (montoEnganche > 0) {
    filas.push({ n: n++, fecha: fmtFecha(fechas.enganche), concepto: 'Enganche (menos reserva)', importe: montoEnganche });
  }
  if (montoPagosDiferidos > 0 && numPagosDiferidos > 0) {
    const per = round2(montoPagosDiferidos / numPagosDiferidos);
    let acc = 0;
    for (let i = 0; i < numPagosDiferidos; i++) {
      const importe = i < numPagosDiferidos - 1 ? per : round2(montoPagosDiferidos - acc);
      acc += per;
      filas.push({
        n: n++,
        fecha: addMonths(fechas.inicioDiferidos, i),
        concepto: `Pago parcial ${i + 1} de ${numPagosDiferidos}`,
        importe,
      });
    }
  }
  filas.push({ n: n++, fecha: fmtFecha(fechas.cierre), concepto: 'Pago al cierre / Escritura', importe: pagosAlCierre });

  const total = round2(filas.reduce((s, f) => s + f.importe, 0) + financiamientoTotal);

  return {
    precioLista, descuentoEspecial, precioVivienda, descuentoImplicito,
    gastosEscrituracion, gastosCierre, totalPrecioMasGastos,
    montoBanco, montoInfonavit, montoFovissste, financiamientoTotal,
    pagosConRecursosCliente, montoEnganche, montoPagosDiferidos,
    pagosAlCierre, saldoAFavorCierre, mensCreditoAprox, checkCubrePrecio,
    filas, total,
  };
}

export const fmtMXN = (n: number) =>
  n.toLocaleString('es-MX', { style: 'currency', currency: 'MXN', minimumFractionDigits: 2 });
