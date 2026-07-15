import { NextResponse } from 'next/server';
import { z } from 'zod';
import { sanityClient } from '@/lib/sanity/client';
import { comparePassword } from '@/lib/broker/password';
import { signBrokerSession, BROKER_COOKIE } from '@/lib/broker/session';
import { checkLoginRateLimit } from '@/lib/broker/rateLimit';

export const runtime = 'nodejs';

const MAX_AGE = 60 * 60 * 24 * 30; // 30 días — igual que signBrokerSession

const Schema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export async function POST(req: Request) {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown';
  const rate = checkLoginRateLimit(ip);
  if (!rate.ok) {
    return NextResponse.json(
      { error: 'Demasiados intentos. Intenta de nuevo en unos minutos.' },
      { status: 429, headers: { 'Retry-After': String(rate.retryAfterSeconds) } },
    );
  }

  const body = await req.json().catch(() => ({}));
  const parsed = Schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: 'Datos inválidos.' }, { status: 400 });

  const email = parsed.data.email.trim().toLowerCase();
  const freshClient = sanityClient.withConfig({ useCdn: false });

  const account = await freshClient.fetch<{ _id: string; passwordHash: string; verified: boolean } | null>(
    `*[_type == "brokerAccount" && email == $email][0]{ _id, passwordHash, verified }`,
    { email },
  );

  if (!account || !account.passwordHash || !(await comparePassword(parsed.data.password, account.passwordHash))) {
    return NextResponse.json({ error: 'Correo o contraseña incorrectos.' }, { status: 401 });
  }

  if (!account.verified) {
    return NextResponse.json({ error: 'Tu cuenta todavía no está verificada.', needsVerification: true }, { status: 403 });
  }

  const res = NextResponse.json({ ok: true });
  const secure = process.env.NODE_ENV === 'production';
  res.cookies.set(BROKER_COOKIE, signBrokerSession(account._id), {
    path: '/', maxAge: MAX_AGE, sameSite: 'lax', secure, httpOnly: true,
  });
  return res;
}
