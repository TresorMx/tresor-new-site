'use client';

import { useMemo, useState } from 'react';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import {
  User, Home, LayoutPanelLeft, Percent, Landmark, Calendar,
  CalendarClock, StickyNote, Building2,
} from 'lucide-react';
import AsesorGate from '@/components/asesor/AsesorGate';
import {
  UNIDADES_URBAN, PAQUETES_CIERRE, CANALES, BANK,
  getUnidad, getPaqueteCierre, cotizarUrban, fmtMXN,
  type Edificio, type EsquemaPago,
} from '@/lib/asesor/cotizadorUrban';

const DownloadPdfButton = dynamic(() => import('./DownloadPdfButton'), {
  ssr: false,
  loading: () => <span className="text-[12px] text-ink-3">Cargando PDF…</span>,
});

const todayISO = () => new Date().toISOString().slice(0, 10);

function Section({ n, icon: Icon, title, children }: { n: number; icon: any; title: string; children: React.ReactNode }) {
  return (
    <div className="border-b border-white/10 py-5">
      <div className="mb-3 flex items-center gap-2 text-accent">
        <Icon size={15} strokeWidth={2} />
        <span className="text-[11px] font-bold uppercase tracking-widest">{n} · {title}</span>
      </div>
      {children}
    </div>
  );
}

const inputCls = 'w-full rounded-[10px] border border-white/10 bg-white/[0.04] px-3.5 py-2.5 text-[13px] text-white outline-none transition-all placeholder:text-white/25 hover:border-white/20 focus:border-accent/60 focus:bg-white/[0.06] focus:ring-2 focus:ring-accent/15';
const selectCls = inputCls + ' cursor-pointer appearance-none bg-[length:14px] bg-[right_0.85rem_center] bg-no-repeat pr-9 [&>option]:bg-ink [&>option]:text-white';
const chevronBg = { backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='14' height='14' fill='none' stroke='%23FAB413' stroke-width='2' viewBox='0 0 24 24'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")` };
const labelCls = 'mb-1.5 block text-[11.5px] font-medium text-white/55';

const EDIFICIOS: Edificio[] = ['Viena', 'Verona'];
const NIVELES = [1, 2, 3, 4] as const;
const ESQUEMAS: { id: EsquemaPago; label: string }[] = [
  { id: 'contado', label: 'Contado' },
  { id: 'infonavit', label: 'Infonavit' },
  { id: 'bancoExterno', label: 'Banco externo (Santander/HSBC)' },
  { id: 'promocionBanorte', label: 'Promoción avalúo y Banorte' },
  { id: 'bbva', label: 'BBVA' },
  { id: 'banamex', label: 'Banamex' },
];

export default function CotizadorUrbanPage() {
  return (
    <AsesorGate>
      <CotizadorUrbanForm />
    </AsesorGate>
  );
}

function CotizadorUrbanForm() {
  const [asesor, setAsesor] = useState('');
  const [canal, setCanal] = useState('');
  const [cliente, setCliente] = useState('');

  const [edificio, setEdificio] = useState<Edificio | ''>('');
  const [nivel, setNivel] = useState<number | ''>('');
  const [esquema, setEsquema] = useState<EsquemaPago | ''>('');

  const [descuentoEspecial, setDescuentoEspecial] = useState(0);
  const [precioOverride, setPrecioOverride] = useState<number | ''>('');

  const [bancoAforoPct, setBancoAforoPct] = useState(0);
  const [infonavitSubcuenta, setInfonavitSubcuenta] = useState(0);
  const [infonavitCuenta, setInfonavitCuenta] = useState(0);
  const [fovisssteImporte, setFovisssteImporte] = useState(0);

  const [cierreId, setCierreId] = useState(PAQUETES_CIERRE[0].id);
  const [reserva, setReserva] = useState(25000);
  const [enganchePct, setEnganchePct] = useState(0);
  const [pagosDiferidosPct, setPagosDiferidosPct] = useState(0);
  const [numPagosDiferidos, setNumPagosDiferidos] = useState(12);

  const [fechas, setFechas] = useState({ apartado: '', enganche: '', inicioDiferidos: '', cierre: '' });
  const [fechaCotizacion, setFechaCotizacion] = useState(todayISO());
  const [obs, setObs] = useState('');

  const unidadId = edificio && nivel && esquema ? `${edificio.toLowerCase()}-${nivel}n-${esquema}` : '';
  const unidad = getUnidad(unidadId);
  const unidadesDisponibles = useMemo(
    () => (edificio ? UNIDADES_URBAN.filter((x) => x.edificio === edificio) : []),
    [edificio],
  );
  const esquemasDisponibles = useMemo(
    () => (edificio && nivel ? unidadesDisponibles.filter((x) => x.nivel === nivel).map((x) => x.esquema) : []),
    [edificio, nivel, unidadesDisponibles],
  );

  const cierre = getPaqueteCierre(cierreId) ?? PAQUETES_CIERRE[0];

  const cot = useMemo(() => {
    if (!unidad) return null;
    return cotizarUrban({
      unidad,
      descuentoEspecial,
      precioViviendaOverride: precioOverride === '' ? undefined : precioOverride,
      cierre,
      financiamiento: {
        bancoAforoPct, infonavitSubcuenta, infonavitCuenta, fovisssteImporte,
      },
      reserva,
      enganchePct,
      pagosDiferidosPct,
      numPagosDiferidos,
      fechas,
    });
  }, [
    unidad, descuentoEspecial, precioOverride, cierre, bancoAforoPct,
    infonavitSubcuenta, infonavitCuenta, fovisssteImporte, reserva,
    enganchePct, pagosDiferidosPct, numPagosDiferidos, fechas,
  ]);

  const fechaCotTxt = fechaCotizacion.split('-').reverse().join('/');

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[380px_1fr]">
      {/* ═══ Sidebar formulario ═══ */}
      <aside className="bg-ink px-6 py-6 lg:sticky lg:top-0 lg:h-screen lg:self-start lg:overflow-y-auto">
        <div className="mb-5 flex items-center justify-between border-b border-white/10 pb-4">
          <Image src="/logos-desarrolladores/logowhiteurban.webp" alt="Urban Homes" width={140} height={50} className="h-9 w-auto" priority />
          <span className="text-[11px] font-semibold uppercase tracking-[0.25em] text-white/40">Cotizador · La Selva</span>
        </div>

        <Section n={1} icon={User} title="Asesor">
          <label className={labelCls}>Nombre del asesor *</label>
          <input className={inputCls} placeholder="Tu nombre completo" value={asesor} onChange={(e) => setAsesor(e.target.value)} />
          <label className={`${labelCls} mt-3`}>Canal</label>
          <select className={selectCls} style={chevronBg} value={canal} onChange={(e) => setCanal(e.target.value)}>
            <option value="">Selecciona canal</option>
            {CANALES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </Section>

        <Section n={2} icon={Home} title="Cliente">
          <label className={labelCls}>Nombre completo *</label>
          <input className={inputCls} placeholder="Nombre del cliente" value={cliente} onChange={(e) => setCliente(e.target.value)} />
        </Section>

        <Section n={3} icon={LayoutPanelLeft} title="Unidad">
          <label className={labelCls}>Edificio *</label>
          <select className={selectCls} style={chevronBg} value={edificio} onChange={(e) => { setEdificio(e.target.value as Edificio); setNivel(''); setEsquema(''); }}>
            <option value="">Selecciona edificio</option>
            {EDIFICIOS.map((e) => <option key={e} value={e}>{e}</option>)}
          </select>
          <label className={`${labelCls} mt-3`}>Nivel *</label>
          <select className={selectCls} style={chevronBg} value={nivel} onChange={(e) => { setNivel(Number(e.target.value)); setEsquema(''); }} disabled={!edificio}>
            <option value="">{edificio ? 'Selecciona nivel' : 'Elige edificio primero'}</option>
            {NIVELES.map((n) => <option key={n} value={n}>{n}N</option>)}
          </select>
          <label className={`${labelCls} mt-3`}>Forma de pago *</label>
          <select className={selectCls} style={chevronBg} value={esquema} onChange={(e) => setEsquema(e.target.value as EsquemaPago)} disabled={!nivel}>
            <option value="">{nivel ? 'Selecciona forma de pago' : 'Elige nivel primero'}</option>
            {ESQUEMAS.filter((e) => esquemasDisponibles.includes(e.id)).map((e) => <option key={e.id} value={e.id}>{e.label}</option>)}
          </select>
          {unidad && (
            <p className="mt-2 text-[12px] text-white/70">Precio de lista: <span className="font-bold text-accent">{fmtMXN(unidad.precio)}</span> · Escrituración {(unidad.gastosEscrituracionPct * 100).toFixed(0)}% · {unidad.entidadValuadora}</p>
          )}
        </Section>

        <Section n={4} icon={Percent} title="Descuento y precio">
          <label className={labelCls}>Descuento especial ($)</label>
          <input type="number" className={inputCls} value={descuentoEspecial || ''} onChange={(e) => setDescuentoEspecial(Number(e.target.value))} />
          <label className={`${labelCls} mt-3`}>Precio vivienda final ($) — opcional</label>
          <input type="number" className={inputCls} placeholder={unidad ? fmtMXN(unidad.precio - descuentoEspecial) : 'Precio lista − descuento'} value={precioOverride} onChange={(e) => setPrecioOverride(e.target.value === '' ? '' : Number(e.target.value))} />
          <p className="mt-1.5 text-[11px] text-white/40">Déjalo vacío para usar precio de lista − descuento especial. Ajústalo si se negoció un precio final distinto.</p>
        </Section>

        <Section n={5} icon={Landmark} title="Financiamiento">
          <label className={labelCls}>Crédito bancario — % de aforo</label>
          <input type="number" className={inputCls} value={bancoAforoPct || ''} onChange={(e) => setBancoAforoPct(Number(e.target.value))} />
          <label className={`${labelCls} mt-3`}>Infonavit — Subcuenta ($)</label>
          <input type="number" className={inputCls} value={infonavitSubcuenta || ''} onChange={(e) => setInfonavitSubcuenta(Number(e.target.value))} />
          <label className={`${labelCls} mt-3`}>Infonavit — Cuenta ($)</label>
          <input type="number" className={inputCls} value={infonavitCuenta || ''} onChange={(e) => setInfonavitCuenta(Number(e.target.value))} />
          <label className={`${labelCls} mt-3`}>Fovissste — Importe de crédito ($)</label>
          <input type="number" className={inputCls} value={fovisssteImporte || ''} onChange={(e) => setFovisssteImporte(Number(e.target.value))} />
        </Section>

        <Section n={6} icon={Building2} title="Gastos de cierre">
          <label className={labelCls}>Paquete de cierre *</label>
          <select className={selectCls} style={chevronBg} value={cierreId} onChange={(e) => setCierreId(e.target.value)}>
            {PAQUETES_CIERRE.map((c) => <option key={c.id} value={c.id}>{c.label} · {fmtMXN(c.monto)}</option>)}
          </select>
        </Section>

        <Section n={7} icon={Calendar} title="Pagos del cliente">
          <label className={labelCls}>Reserva ($)</label>
          <input type="number" className={inputCls} value={reserva || ''} onChange={(e) => setReserva(Number(e.target.value))} />
          <label className={`${labelCls} mt-3`}>Enganche (% del precio vivienda)</label>
          <input type="number" className={inputCls} value={enganchePct || ''} onChange={(e) => setEnganchePct(Number(e.target.value))} />
          <label className={`${labelCls} mt-3`}>Pagos diferidos (% del precio vivienda)</label>
          <input type="number" className={inputCls} value={pagosDiferidosPct || ''} onChange={(e) => setPagosDiferidosPct(Number(e.target.value))} />
          <label className={`${labelCls} mt-3`}>Número de pagos diferidos</label>
          <input type="number" className={inputCls} value={numPagosDiferidos} onChange={(e) => setNumPagosDiferidos(Number(e.target.value))} />
        </Section>

        <Section n={8} icon={CalendarClock} title="Fechas">
          {[['apartado', 'Fecha de apartado'], ['enganche', 'Fecha de enganche'], ['inicioDiferidos', 'Inicio de pagos diferidos'], ['cierre', 'Fecha de cierre / escritura']].map(([k, lbl]) => (
            <div key={k} className="mb-2">
              <label className={labelCls}>{lbl}</label>
              <input type="date" className={inputCls} value={(fechas as any)[k]} onChange={(e) => setFechas((f) => ({ ...f, [k]: e.target.value }))} />
            </div>
          ))}
          <label className={`${labelCls} mt-3`}>Fecha de cotización</label>
          <input type="date" className={inputCls} value={fechaCotizacion} onChange={(e) => setFechaCotizacion(e.target.value)} />
        </Section>

        <Section n={9} icon={StickyNote} title="Observaciones">
          <textarea className={`${inputCls} min-h-[70px]`} placeholder="Notas u observaciones adicionales…" value={obs} onChange={(e) => setObs(e.target.value)} />
        </Section>
      </aside>

      {/* ═══ Preview ═══ */}
      <main className="bg-bg-soft px-4 py-6 lg:px-10">
        <div className="mx-auto max-w-3xl">
          <div className="mb-4 flex items-center justify-between">
            <span className="text-[12px] font-semibold uppercase tracking-[0.25em] text-ink-3">Vista previa</span>
            {cot && unidad && (
              <DownloadPdfButton
                asesor={asesor}
                cliente={cliente}
                unidadLabel={unidad.label}
                fechaCotizacion={fechaCotTxt}
                cot={cot}
                observaciones={obs}
                fileName={`Cotizacion ${unidad.label} - ${cliente || 'cliente'}.pdf`}
              />
            )}
          </div>

          <div className="overflow-hidden rounded-xl bg-white shadow-lg">
            <div className="flex items-start justify-between bg-ink p-6 text-white">
              <Image src="/logos-desarrolladores/logowhiteurban.webp" alt="Urban Homes" width={150} height={54} className="h-11 w-auto" />
              <div className="text-right text-[11px] leading-relaxed">
                <p><span className="text-white/50">Proyecto:</span> <b>La Selva</b></p>
                <p><span className="text-white/50">Asesor:</span> <b>{asesor || '—'}</b></p>
                <p><span className="text-white/50">Unidad:</span> <b>{unidad?.label ?? '—'}</b></p>
                <p><span className="text-white/50">Fecha:</span> <b className="text-accent">{fechaCotTxt}</b></p>
              </div>
            </div>

            <div className="p-6">
              <h2 className="mb-4 text-lg font-bold text-ink">Cotización y calendario de pagos</h2>

              {!cot ? (
                <div className="rounded-lg border-l-4 border-accent bg-accent-soft/40 p-5 text-[13px] text-ink-2">
                  <p>Cliente: <b>{cliente || '—'}</b></p>
                  <p>Unidad: <b>{unidad ? unidad.label : '—'}</b></p>
                  <p className="mt-2 text-[12px] text-ink-3">Completa edificio, nivel y forma de pago para ver la cotización.</p>
                </div>
              ) : (
                <>
                  <div className="mb-4 rounded-lg border-l-4 border-accent bg-accent-soft/40 p-4 text-[13px] text-ink-2">
                    <p>Cliente: <b>{cliente || '—'}</b></p>
                    <p>Unidad: <b>{unidad!.label}</b></p>
                    <p>Precio de lista: <b>{fmtMXN(cot.precioLista)}</b></p>
                    <p>Precio vivienda: <b>{fmtMXN(cot.precioVivienda)}</b></p>
                    {cot.descuentoImplicito !== 0 && (
                      <p>Descuento adicional implícito: <b>{fmtMXN(cot.descuentoImplicito)}</b></p>
                    )}
                    <p>Gastos escrituración: <b>{fmtMXN(cot.gastosEscrituracion)}</b> · Gastos cierre ({cierre.label}): <b>{fmtMXN(cot.gastosCierre)}</b></p>
                    <p>Total precio + gastos: <b>{fmtMXN(cot.totalPrecioMasGastos)}</b></p>
                  </div>

                  <div className="mb-4 grid grid-cols-3 gap-2">
                    {[['Financiamiento', cot.financiamientoTotal], ['Enganche', cot.montoEnganche], ['Diferidos', cot.montoPagosDiferidos]].map(([l, v]) => (
                      <div key={l as string} className="flex items-center justify-between rounded-lg bg-ink px-3 py-2.5">
                        <span className="text-[11px] font-bold text-white">{l}</span>
                        <span className="text-[11px] font-bold text-accent">{fmtMXN(v as number)}</span>
                      </div>
                    ))}
                  </div>

                  <div className="overflow-hidden rounded-lg border border-line text-[12px]">
                    <div className="flex bg-ink px-3 py-2 font-bold text-white">
                      <span className="w-[8%]">#</span>
                      <span className="w-[22%]">Fecha</span>
                      <span className="w-[45%]">Concepto</span>
                      <span className="w-[25%] text-right">Importe</span>
                    </div>
                    {cot.filas.map((f) => (
                      <div key={f.n} className="flex border-b border-line px-3 py-1.5 text-ink-2">
                        <span className="w-[8%]">{f.n}</span>
                        <span className="w-[22%]">{f.fecha || '—'}</span>
                        <span className="w-[45%]">{f.concepto}</span>
                        <span className="w-[25%] text-right">{fmtMXN(f.importe)}</span>
                      </div>
                    ))}
                    <div className="flex bg-accent-soft/40 px-3 py-2 font-bold text-ink">
                      <span className="w-[75%]">Total (financiamiento + pagos cliente)</span>
                      <span className="w-[25%] text-right">{fmtMXN(cot.total)}</span>
                    </div>
                  </div>

                  <p className={`mt-3 text-[12px] font-semibold ${cot.checkCubrePrecio === 'OK' ? 'text-green-600' : 'text-red-600'}`}>
                    Validación pagos + financiamiento vs. precio vivienda: {cot.checkCubrePrecio}
                    {cot.saldoAFavorCierre > 0 && ` · Saldo a favor al cierre: ${fmtMXN(cot.saldoAFavorCierre)}`}
                  </p>

                  <div className="mt-4 flex justify-between rounded-lg bg-gray-50 p-4 text-[12px] text-ink-2">
                    <div>
                      <p className="mb-1 font-bold text-ink">Datos bancarios para transferencia</p>
                      <p>Beneficiario: <b>{BANK.beneficiario}</b></p>
                      <p>Banco: <b>{BANK.banco}</b></p>
                      <p>Cuenta: <b>{BANK.cuenta}</b></p>
                    </div>
                    <div className="text-right">
                      <p>CLABE: <b>{BANK.clabe}</b></p>
                      <p>Referencia: <b>{unidad!.label}</b></p>
                    </div>
                  </div>

                  {obs && <p className="mt-3 text-[12px] text-ink-2"><b>Observaciones:</b> {obs}</p>}

                  <p className="mt-4 text-[10px] leading-relaxed text-ink-3">
                    Cotizador a modo informativo sin valor contractual. Importes de avalúo, financiamiento y gastos sujetos a cambio.<br />
                    Disponibilidad de vivienda y precios sujetos a cambio en cualquier momento.
                  </p>
                </>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
