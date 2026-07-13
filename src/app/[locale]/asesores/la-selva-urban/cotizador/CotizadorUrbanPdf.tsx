'use client';

import { Document, Page, Text, View, Image, StyleSheet } from '@react-pdf/renderer';
import { fmtMXN, BANK, type CotizacionUrban } from '@/lib/asesor/cotizadorUrban';

const YELLOW = '#FAB413';
const INK = '#0E0E0E';

const s = StyleSheet.create({
  page: { paddingTop: 24, paddingBottom: 24, paddingHorizontal: 30, fontSize: 8, fontFamily: 'Helvetica', color: INK },
  header: { backgroundColor: INK, borderRadius: 6, padding: 14, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  logo: { width: 104, height: 44, objectFit: 'contain' },
  metaRow: { flexDirection: 'row', justifyContent: 'flex-end', marginBottom: 2 },
  metaLabel: { color: '#bbb', fontSize: 7 },
  metaVal: { color: '#fff', fontSize: 7, fontFamily: 'Helvetica-Bold', marginLeft: 4 },
  metaValYellow: { color: YELLOW, fontSize: 7, fontFamily: 'Helvetica-Bold', marginLeft: 4 },
  title: { fontSize: 12, fontFamily: 'Helvetica-Bold', marginTop: 11, marginBottom: 7 },
  resumen: { backgroundColor: '#FBF7EC', borderLeftWidth: 3, borderLeftColor: YELLOW, padding: 9, marginBottom: 8 },
  rLine: { marginBottom: 2.5 },
  rBold: { fontFamily: 'Helvetica-Bold' },
  splitRow: { flexDirection: 'row', gap: 8, marginBottom: 9, flexWrap: 'wrap' },
  splitBox: { flexBasis: '32%', backgroundColor: INK, borderRadius: 4, padding: 8, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
  splitLabel: { color: '#fff', fontFamily: 'Helvetica-Bold', fontSize: 7.5 },
  splitVal: { color: YELLOW, fontFamily: 'Helvetica-Bold', fontSize: 7.5 },
  tHead: { flexDirection: 'row', backgroundColor: INK, paddingVertical: 5, paddingHorizontal: 8 },
  th: { color: '#fff', fontFamily: 'Helvetica-Bold', fontSize: 7.5 },
  tRow: { flexDirection: 'row', paddingVertical: 3.6, paddingHorizontal: 8, borderBottomWidth: 0.5, borderBottomColor: '#e5e5e5' },
  cNum: { width: '8%' },
  cFecha: { width: '20%' },
  cConcepto: { width: '47%' },
  cImporte: { width: '25%', textAlign: 'right' },
  totalRow: { flexDirection: 'row', backgroundColor: '#FBF7EC', paddingVertical: 5.5, paddingHorizontal: 8, marginTop: 2 },
  bank: { marginTop: 9, backgroundColor: '#f4f4f4', borderRadius: 6, padding: 10, flexDirection: 'row', justifyContent: 'space-between' },
  bankTitle: { fontFamily: 'Helvetica-Bold', fontSize: 8.5, marginBottom: 4 },
  bankLine: { fontSize: 7.5, marginBottom: 2 },
  obs: { marginTop: 8, borderWidth: 0.5, borderColor: '#e0e0e0', borderRadius: 4, padding: 8 },
  obsTitle: { fontFamily: 'Helvetica-Bold', fontSize: 8, marginBottom: 3 },
  obsText: { fontSize: 7.5, color: '#444', lineHeight: 1.4 },
  disclaimer: { marginTop: 8, fontSize: 6.5, color: '#888', lineHeight: 1.35 },
  checkBadge: { marginTop: 4, fontSize: 7, fontFamily: 'Helvetica-Bold' },
});

interface Props {
  asesor: string;
  cliente: string;
  unidadLabel: string;
  fechaCotizacion: string;
  cot: CotizacionUrban;
  observaciones: string;
}

export default function CotizadorUrbanPdf(p: Props) {
  const { cot } = p;
  return (
    <Document>
      <Page size="A4" wrap={false} style={s.page}>
        <View style={s.header}>
          {/* eslint-disable-next-line jsx-a11y/alt-text */}
          <Image style={s.logo} src="/logos-desarrolladores/logowhiteurban.webp" />
          <View>
            <View style={s.metaRow}><Text style={s.metaLabel}>Proyecto:</Text><Text style={s.metaVal}>La Selva</Text></View>
            <View style={s.metaRow}><Text style={s.metaLabel}>Asesor:</Text><Text style={s.metaVal}>{p.asesor || '—'}</Text></View>
            <View style={s.metaRow}><Text style={s.metaLabel}>Unidad:</Text><Text style={s.metaVal}>{p.unidadLabel}</Text></View>
            <View style={s.metaRow}><Text style={s.metaLabel}>Fecha:</Text><Text style={s.metaValYellow}>{p.fechaCotizacion}</Text></View>
          </View>
        </View>

        <Text style={s.title}>Cotización y calendario de pagos</Text>

        <View style={s.resumen}>
          <Text style={s.rLine}>Cliente: <Text style={s.rBold}>{p.cliente || '—'}</Text></Text>
          <Text style={s.rLine}>Unidad: <Text style={s.rBold}>{p.unidadLabel}</Text></Text>
          <Text style={s.rLine}>Precio de lista: <Text style={s.rBold}>{fmtMXN(cot.precioLista)}</Text></Text>
          <Text style={s.rLine}>Precio vivienda: <Text style={s.rBold}>{fmtMXN(cot.precioVivienda)}</Text></Text>
          <Text style={s.rLine}>Gastos escrituración + cierre: <Text style={s.rBold}>{fmtMXN(cot.gastosEscrituracion + cot.gastosCierre)}</Text></Text>
          <Text style={s.rLine}>Total precio + gastos: <Text style={s.rBold}>{fmtMXN(cot.totalPrecioMasGastos)}</Text></Text>
        </View>

        <View style={s.splitRow}>
          <View style={s.splitBox}><Text style={s.splitLabel}>Financiamiento</Text><Text style={s.splitVal}>{fmtMXN(cot.financiamientoTotal)}</Text></View>
          <View style={s.splitBox}><Text style={s.splitLabel}>Enganche</Text><Text style={s.splitVal}>{fmtMXN(cot.montoEnganche)}</Text></View>
          <View style={s.splitBox}><Text style={s.splitLabel}>Diferidos</Text><Text style={s.splitVal}>{fmtMXN(cot.montoPagosDiferidos)}</Text></View>
        </View>

        <View style={s.tHead}>
          <Text style={[s.th, s.cNum]}>Pago #</Text>
          <Text style={[s.th, s.cFecha]}>Fecha</Text>
          <Text style={[s.th, s.cConcepto]}>Concepto</Text>
          <Text style={[s.th, s.cImporte]}>Importe</Text>
        </View>
        {cot.filas.map((f) => (
          <View style={s.tRow} key={f.n}>
            <Text style={s.cNum}>{f.n}</Text>
            <Text style={s.cFecha}>{f.fecha || '—'}</Text>
            <Text style={s.cConcepto}>{f.concepto}</Text>
            <Text style={s.cImporte}>{fmtMXN(f.importe)}</Text>
          </View>
        ))}
        <View style={s.totalRow}>
          <Text style={[{ fontFamily: 'Helvetica-Bold' }, s.cNum]}></Text>
          <Text style={[{ fontFamily: 'Helvetica-Bold' }, s.cFecha]}></Text>
          <Text style={[{ fontFamily: 'Helvetica-Bold' }, s.cConcepto]}>Total (financiamiento + pagos cliente)</Text>
          <Text style={[{ fontFamily: 'Helvetica-Bold' }, s.cImporte]}>{fmtMXN(cot.total)}</Text>
        </View>

        <Text style={[s.checkBadge, { color: cot.checkCubrePrecio === 'OK' ? '#2E7D32' : '#C8543E' }]}>
          Validación pagos + financiamiento vs. precio: {cot.checkCubrePrecio}
        </Text>

        <View style={s.bank}>
          <View>
            <Text style={s.bankTitle}>Datos bancarios para transferencia</Text>
            <Text style={s.bankLine}>Beneficiario: <Text style={s.rBold}>{BANK.beneficiario}</Text></Text>
            <Text style={s.bankLine}>Banco: <Text style={s.rBold}>{BANK.banco}</Text></Text>
            <Text style={s.bankLine}>Cuenta: <Text style={s.rBold}>{BANK.cuenta}</Text></Text>
          </View>
          <View>
            <Text style={[s.bankLine, { marginTop: 14 }]}>CLABE: <Text style={s.rBold}>{BANK.clabe}</Text></Text>
            <Text style={s.bankLine}>Referencia: <Text style={s.rBold}>{p.unidadLabel}</Text></Text>
          </View>
        </View>

        {p.observaciones?.trim() ? (
          <View style={s.obs}>
            <Text style={s.obsTitle}>Observaciones</Text>
            <Text style={s.obsText}>{p.observaciones.trim()}</Text>
          </View>
        ) : null}

        <Text style={s.disclaimer}>
          Cotizador a modo informativo sin valor contractual. Importes de avalúo, financiamiento y gastos sujetos a cambio.{'\n'}
          Disponibilidad de vivienda y precios sujetos a cambio en cualquier momento.
        </Text>
      </Page>
    </Document>
  );
}
