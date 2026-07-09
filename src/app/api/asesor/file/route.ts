import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifySession, ASESOR_COOKIE } from '@/lib/asesor/session';

export const runtime = 'nodejs';

// Descarga protegida: solo con sesión de asesor válida (cookie httpOnly
// firmada — un `asesor_ui` falso no basta). Turn 1: mapea al material
// estático que ya existe de Quattro. FASE 2: resolver la URL del archivo
// desde los campos de Sanity por desarrollo.
const STATIC_FILES: Record<string, Record<string, string>> = {
  'long-island': {
    presentation: '/broker/long-island/presentacion.pdf',
    priceList: '/broker/long-island/lista-precios.pdf',
    masterPlan: '/broker/long-island/master-plan.pdf',
    bankAccounts: '/broker/long-island/datos-bancarios.pdf',
    location: '/broker/long-island/ubicacion.jpg',
    marketing: '/broker/long-island/marketing.zip',
    developer: '/broker/long-island/desarrollador.pdf',
    renders: '/broker/long-island/renders.zip',
    receiptPay: '/broker/long-island/recibo-de-pago.docx',
    receiptReserve: '/broker/long-island/recibo-de-reserva.docx',
    checklist: '/broker/long-island/check-list.docx',
    offerLetter: '/broker/long-island/carta-oferta.docx',
  },
  gardens: {
    presentation: '/broker/gardens/presentacion.pdf',
    priceList: '/broker/gardens/lista-precios.pdf',
    masterPlan: '/broker/gardens/master-plan.pdf',
    bankAccounts: '/broker/gardens/datos-bancarios.pdf',
    location: '/broker/gardens/ubicacion.pdf',
    marketing: '/broker/gardens/marketing.zip',
    developer: '/broker/gardens/desarrollador.pdf',
    renders: '/broker/gardens/renders.zip',
    receiptPay: '/broker/gardens/recibo-de-pago.docx',
    receiptReserve: '/broker/gardens/recibo-de-reserva.docx',
    checklist: '/broker/gardens/check-list.docx',
    offerLetter: '/broker/gardens/carta-oferta.docx',
  },
};

export async function GET(req: Request) {
  const cookieStore = await cookies();
  if (!verifySession(cookieStore.get(ASESOR_COOKIE)?.value)) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const dev = searchParams.get('dev') ?? '';
  const doc = searchParams.get('doc') ?? '';

  const url = STATIC_FILES[dev]?.[doc];
  if (!url) return NextResponse.json({ error: 'En preparación' }, { status: 404 });

  return NextResponse.redirect(new URL(url, req.url), 302);
}
