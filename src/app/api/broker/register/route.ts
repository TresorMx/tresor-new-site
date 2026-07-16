import { NextResponse } from 'next/server';
import { z } from 'zod';
import { sanityClient } from '@/lib/sanity/client';
import { sendLeadToGHL } from '@/lib/ghl';
import { hashPassword } from '@/lib/broker/password';
import { generateOtp, hashOtp, sendOtpEmail, OTP_TTL_MS } from '@/lib/broker/otp';
import { checkRegisterRateLimit } from '@/lib/broker/rateLimit';

export const runtime = 'nodejs';

const Schema = z.object({
  fullName: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(7),
  brokerage: z.string().optional(),
  password: z.string().min(8),
});

export async function POST(req: Request) {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown';
  const rate = checkRegisterRateLimit(ip);
  if (!rate.ok) {
    return NextResponse.json(
      { error: 'Demasiados intentos. Intenta de nuevo en unos minutos.' },
      { status: 429, headers: { 'Retry-After': String(rate.retryAfterSeconds) } },
    );
  }

  const body = await req.json().catch(() => ({}));
  const parsed = Schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: 'Datos inválidos.' }, { status: 400 });

  const { fullName, phone, brokerage, password } = parsed.data;
  const email = parsed.data.email.trim().toLowerCase();

  try {
    // Sin CDN: una lectura desincronizada aquí ("¿ya existe este correo?")
    // podría dejar registrar un correo duplicado.
    const freshClient = sanityClient.withConfig({ useCdn: false });
    const existing = await freshClient.fetch<{ _id: string; verified: boolean } | null>(
      `*[_type == "brokerAccount" && email == $email][0]{ _id, verified }`,
      { email },
    );

    if (existing?.verified) {
      return NextResponse.json({ error: 'Ya existe una cuenta con este correo. Inicia sesión.' }, { status: 409 });
    }

    const passwordHash = await hashPassword(password);
    const code = generateOtp();
    const otpCodeHash = hashOtp(code);
    const otpExpiresAt = new Date(Date.now() + OTP_TTL_MS).toISOString();

    if (existing) {
      // Cuenta sin verificar (típico: no le llegó el código o expiró) — se
      // actualiza en vez de dejar un doc huérfano bloqueando el correo.
      await freshClient
        .patch(existing._id)
        .set({ fullName, phone, brokerage: brokerage ?? null, passwordHash, otpCodeHash, otpExpiresAt, otpAttempts: 0 })
        .commit();
    } else {
      await freshClient.create({
        _type: 'brokerAccount',
        fullName,
        email,
        phone,
        brokerage: brokerage ?? null,
        passwordHash,
        verified: false,
        otpCodeHash,
        otpExpiresAt,
        otpAttempts: 0,
        createdAt: new Date().toISOString(),
      });
    }

    await sendOtpEmail(email, code);

    const [first, ...rest] = fullName.split(' ');
    await sendLeadToGHL({
      firstName: first,
      lastName: rest.join(' '),
      email,
      phone,
      company: brokerage,
      source: 'broker',
      tags: ['broker-registro', brokerage ? `inm-${brokerage.toLowerCase().slice(0, 30)}` : 'inm-individual'],
    });

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error('[broker/register] falló para', email, e);
    return NextResponse.json({ error: 'No pudimos completar tu registro. Intenta de nuevo en unos minutos.' }, { status: 500 });
  }
}
