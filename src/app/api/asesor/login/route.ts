import { NextResponse } from 'next/server';
import { signSession, ASESOR_COOKIE, ASESOR_EMAIL, ASESOR_PASSWORD } from '@/lib/asesor/session';

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
  // Única cookie: httpOnly, el cliente no la puede leer. El estado de UI ya
  // no depende de una segunda cookie legible — se calcula server-side en el
  // layout con esta misma cookie y se manda como prop (ver AsesorProvider).
  res.cookies.set(ASESOR_COOKIE, signSession(), {
    path: '/', maxAge: MAX_AGE, sameSite: 'lax', secure, httpOnly: true,
  });
  return res;
}
