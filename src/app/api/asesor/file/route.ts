import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifySession, ASESOR_COOKIE } from '@/lib/asesor/session';
import { fetchDriveFileUrl } from '@/lib/sanity/drive';

export const runtime = 'nodejs';

// Descarga protegida: solo con sesión de asesor válida (cookie httpOnly
// firmada — un `asesor_ui` falso no basta). Resuelve primero contra Sanity
// (el editor sube el archivo en Studio → Drive de Ventas); si el campo está
// vacío ahí, cae al material estático que ya existía de Quattro (Long
// Island/Gardens) para no romper nada mientras se termina de subir todo.
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

  let url: string | null = null;
  try {
    url = await fetchDriveFileUrl(dev, doc);
  } catch (e) {
    console.error('[asesor/file] Sanity fetch failed, usando fallback estático', e);
  }
  url ??= STATIC_FILES[dev]?.[doc] ?? null;

  if (!url) return NextResponse.json({ error: 'En preparación' }, { status: 404 });

  return NextResponse.redirect(new URL(url, req.url), 302);
}
