import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifyBrokerSession, BROKER_COOKIE } from '@/lib/broker/session';
import { fetchDriveFileUrl } from '@/lib/sanity/drive';
import { STATIC_FILES } from '@/lib/asesor/driveStaticFiles';

export const runtime = 'nodejs';

// Descarga protegida: solo con sesión de broker válida. Reusa exactamente la
// misma resolución de archivos que /api/asesor/file (Sanity primero, fallback
// estático) — el broker ve el mismo Drive real, sin duplicar el catálogo.

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const dev = searchParams.get('dev') ?? '';
  const doc = searchParams.get('doc') ?? '';

  const cookieStore = await cookies();
  if (!verifyBrokerSession(cookieStore.get(BROKER_COOKIE)?.value)) {
    // Mismo fix que /api/asesor/file: este link se abre con click directo
    // (target="_blank"), un JSON pelón era un callejón sin salida si el
    // estado `isBroker` del cliente quedó viejo respecto a la cookie real.
    // `?reauth=1` le dice a BrokerGate que limpie ese estado.
    return NextResponse.redirect(new URL(`/brokers/drive/${encodeURIComponent(dev)}?reauth=1`, req.url));
  }

  let url: string | null = null;
  try {
    url = await fetchDriveFileUrl(dev, doc);
  } catch (e) {
    console.error('[broker/file] Sanity fetch failed, usando fallback estático', e);
  }
  url ??= STATIC_FILES[dev]?.[doc] ?? null;

  if (!url) return NextResponse.json({ error: 'En preparación' }, { status: 404 });

  return NextResponse.redirect(new URL(url, req.url), 302);
}
