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
  const { searchParams } = new URL(req.url);
  const dev = searchParams.get('dev') ?? '';
  const doc = searchParams.get('doc') ?? '';

  const cookieStore = await cookies();
  if (!verifySession(cookieStore.get(ASESOR_COOKIE)?.value)) {
    // Este link se abre con click directo (target="_blank"), no con fetch —
    // un JSON pelón era un callejón sin salida. Pasa esto casi siempre
    // porque el estado `isAsesor` del cliente (AsesorProvider) es un booleano
    // que se calienta UNA vez al cargar el layout raíz y no se vuelve a
    // revalidar solo por navegar con <Link>; si la cookie real expiró o
    // cambió mientras tanto, el Drive se ve "logueado" pero cada descarga
    // 401. `?reauth=1` le dice a AsesorGate que limpie ese estado viejo y
    // reabra el login, en vez de dejar al asesor sin ninguna acción posible.
    return NextResponse.redirect(new URL(`/asesores/${encodeURIComponent(dev)}?reauth=1`, req.url));
  }

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
