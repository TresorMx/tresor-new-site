import { NextResponse } from 'next/server';
import { signSession, ASESOR_COOKIE, ASESOR_UI_COOKIE, ASESOR_EMAIL, ASESOR_PASSWORD } from '@/lib/asesor/session';

export const runtime = 'nodejs';

const MAX_AGE = 60 * 60 * 24 * 7; // 7 días

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : '';
  const password = typeof body.password === 'string' ? body.password : '';

  if (email !== ASESOR_EMAIL || password !== ASESOR_PASSWORD) {
    return NextResponse.json({ error: 'Correo o contraseña incorrectos.' }, { status: 401 });
  }

  const res = NextResponse.json({ ok: true });
  const secure = process.env.NODE_ENV === 'production';
  const base = { path: '/', maxAge: MAX_AGE, sameSite: 'lax' as const, secure };
  // Cookie de autorización real (httpOnly, el cliente no la puede leer).
  res.cookies.set(ASESOR_COOKIE, signSession(), { ...base, httpOnly: true });
  // Pista de UI para el cliente (sin secreto) — solo enciende/apaga los links.
  res.cookies.set(ASESOR_UI_COOKIE, '1', { ...base, httpOnly: false });
  return res;
}
