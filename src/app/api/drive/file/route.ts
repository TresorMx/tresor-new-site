import { NextResponse } from 'next/server';
import { fetchDriveFileUrl } from '@/lib/sanity/drive';
import { STATIC_FILES } from '@/lib/asesor/driveStaticFiles';

export const runtime = 'nodejs';

// Sin auth a propósito — reusa exactamente la misma resolución de archivos
// que /api/asesor/file y /api/broker/file (Sanity primero, fallback
// estático), pero esta ruta solo la alcanzan las landings espejo /drive/*,
// que no están enlazadas ni indexadas. La protección es la URL, no un login
// (ver src/app/[locale]/drive/).

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const dev = searchParams.get('dev') ?? '';
  const doc = searchParams.get('doc') ?? '';

  let url: string | null = null;
  try {
    url = await fetchDriveFileUrl(dev, doc);
  } catch (e) {
    console.error('[drive/file] Sanity fetch failed, usando fallback estático', e);
  }
  url ??= STATIC_FILES[dev]?.[doc] ?? null;

  if (!url) return NextResponse.json({ error: 'En preparación' }, { status: 404 });

  return NextResponse.redirect(new URL(url, req.url), 302);
}
