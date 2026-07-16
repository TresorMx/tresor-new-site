import { NextResponse } from 'next/server';
import { z } from 'zod';
import { sanityClient } from '@/lib/sanity/client';
import { generateOtp, hashOtp, sendOtpEmail, OTP_TTL_MS } from '@/lib/broker/otp';
import { checkResendRateLimit } from '@/lib/broker/rateLimit';

export const runtime = 'nodejs';

const Schema = z.object({ email: z.string().email() });

export async function POST(req: Request) {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown';
  const rate = checkResendRateLimit(ip);
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

    const account = await freshClient.fetch<{ _id: string; verified: boolean } | null>(
      `*[_type == "brokerAccount" && email == $email][0]{ _id, verified }`,
      { email },
    );

    // Mismo mensaje exista o no la cuenta — no revela si un correo está
    // registrado.
    if (!account || account.verified) {
      return NextResponse.json({ ok: true });
    }

    const code = generateOtp();
    await freshClient
      .patch(account._id)
      .set({ otpCodeHash: hashOtp(code), otpExpiresAt: new Date(Date.now() + OTP_TTL_MS).toISOString(), otpAttempts: 0 })
      .commit();

    await sendOtpEmail(email, code);
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error('[broker/resend-code] falló para', email, e);
    return NextResponse.json({ error: 'No pudimos reenviar el código. Intenta de nuevo en unos minutos.' }, { status: 500 });
  }
}
