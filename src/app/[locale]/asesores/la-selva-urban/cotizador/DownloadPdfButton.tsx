'use client';

import { PDFDownloadLink } from '@react-pdf/renderer';
import { Download } from 'lucide-react';
import CotizadorUrbanPdf from './CotizadorUrbanPdf';
import type { CotizacionUrban } from '@/lib/asesor/cotizadorUrban';

interface Props {
  asesor: string;
  cliente: string;
  unidadLabel: string;
  fechaCotizacion: string;
  cot: CotizacionUrban;
  observaciones: string;
  fileName: string;
}

export default function DownloadPdfButton(props: Props) {
  const { fileName, ...pdfProps } = props;
  return (
    <PDFDownloadLink
      document={<CotizadorUrbanPdf {...pdfProps} />}
      fileName={fileName}
      className="inline-flex items-center gap-2 rounded-lg border border-accent bg-accent/10 px-4 py-2 text-[12px] font-bold text-accent-deep transition hover:bg-accent hover:text-ink"
    >
      {({ loading }) => (
        <>
          <Download size={14} />
          {loading ? 'Generando…' : 'Descargar PDF'}
        </>
      )}
    </PDFDownloadLink>
  );
}
