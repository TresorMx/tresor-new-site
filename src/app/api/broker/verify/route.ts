import { NextResponse } from 'next/server';
import { z } from 'zod';
import { sanityClient } from '@/lib/sanity/client';
import { hashOtp, OTP_MAX_ATTEMPTS } from '@/lib/broker/otp';
import { signBrokerSession, BROKER_COOKIE } from '@/lib/broker/session';
import { checkVerifyRateLimit } from '@/lib/broker/rateLimit';

export const runtime = 'nodejs';

const MAX_AGE = 60 * 60 * 24 * 30; // 30 días — igual que signBrokerSession

const Schema = z.object({
  email: z.string().email(),
  code: z.string().min(4).max(8),
});

export async function POST(req: Request) {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown';
  const rate = checkVerifyRateLimit(ip);
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

  try {
    const freshClient = sanityClient.withConfig({ useCdn: false });

    const account = await freshClient.fetch<{
      _id: string;
      otpCodeHash: string | null;
      otpExpiresAt: string | null;
      otpAttempts: number;
    } | null>(
      `*[_type == "brokerAccount" && email == $email][0]{ _id, otpCodeHash, otpExpiresAt, otpAttempts }`,
      { email },
    );

    if (!account || !account.otpCodeHash || !account.otpExpiresAt) {
      return NextResponse.json({ error: 'Código inválido o expirado.' }, { status: 400 });
    }

    if (account.otpAttempts >= OTP_MAX_ATTEMPTS) {
      return NextResponse.json({ error: 'Demasiados intentos. Solicita un nuevo código.' }, { status: 429 });
    }

    const expired = Date.now() > new Date(account.otpExpiresAt).getTime();
    const matches = hashOtp(parsed.data.code) === account.otpCodeHash;

    if (expired || !matches) {
      await freshClient.patch(account._id).inc({ otpAttempts: 1 }).commit();
      return NextResponse.json({ error: expired ? 'El código expiró. Solicita uno nuevo.' : 'Código incorrecto.' }, { status: 400 });
    }

    await freshClient
      .patch(account._id)
      .set({ verified: true })
      .unset(['otpCodeHash', 'otpExpiresAt', 'otpAttempts'])
      .commit();

    const res = NextResponse.json({ ok: true });
    const secure = process.env.NODE_ENV === 'production';
    res.cookies.set(BROKER_COOKIE, signBrokerSession(account._id), {
      path: '/', maxAge: MAX_AGE, sameSite: 'lax', secure, httpOnly: true,
    });
    return res;
  } catch (e) {
    console.error('[broker/verify] falló para', email, e);
    return NextResponse.json({ error: 'No pudimos verificar tu código. Intenta de nuevo en unos minutos.' }, { status: 500 });
  }
}
