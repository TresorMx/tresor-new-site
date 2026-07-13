import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifySession, ASESOR_COOKIE } from '@/lib/asesor/session';
import { fetchDriveFileUrl } from '@/lib/sanity/drive';
import { STATIC_FILES } from '@/lib/asesor/driveStaticFiles';

export const runtime = 'nodejs';

// Descarga protegida: solo con sesión de asesor válida (cookie httpOnly
// firmada — un `asesor_ui` falso no basta). Resuelve primero contra Sanity
// (el editor sube el archivo en Studio → Drive de Ventas); si el campo está
// vacío ahí, cae al material estático que ya existía de Quattro (Long
// Island/Gardens) para no romper nada mientras se termina de subir todo.

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
