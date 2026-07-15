import { createHash, randomInt } from 'node:crypto';
import { Resend } from 'resend';

export const OTP_TTL_MS = 1000 * 60 * 10; // 10 minutos
export const OTP_MAX_ATTEMPTS = 5;

export function generateOtp(): string {
  return String(randomInt(0, 1_000_000)).padStart(6, '0');
}

// El código es de 6 dígitos (baja entropía) — la protección real es el
// rate-limit + expiración corta + límite de intentos, no el costo del hash.
// sha256 alcanza; no hace falta bcrypt aquí.
export function hashOtp(code: string): string {
  return createHash('sha256').update(code).digest('hex');
}

export async function sendOtpEmail(email: string, code: string): Promise<void> {
  // En dev/preview sin RESEND_API_KEY configurada, el código se loguea para
  // poder probar el flujo completo sin bandeja de correo real — SOLO fuera
  // de producción, nunca se loguea una contraseña ni el hash.
  if (!process.env.RESEND_API_KEY) {
    if (process.env.NODE_ENV !== 'production') {
      console.log(`[broker/otp] RESEND_API_KEY no configurada — código para ${email}: ${code}`);
      return;
    }
    throw new Error('RESEND_API_KEY no configurada — no se puede enviar el código de verificación.');
  }

  const resend = new Resend(process.env.RESEND_API_KEY);
  await resend.emails.send({
    from: process.env.RESEND_FROM_EMAIL ?? 'hello@tresor.mx',
    to: email,
    subject: `Tu código de verificación: ${code}`,
    html: `
      <div style="font-family: -apple-system, sans-serif; max-width: 480px;">
        <h3 style="border-bottom: 2px solid #FAB413; padding-bottom: 8px;">Verifica tu cuenta de Broker</h3>
        <p>Tu código de verificación es:</p>
        <p style="font-size: 32px; font-weight: 700; letter-spacing: 6px;">${code}</p>
        <p style="color: #666; font-size: 13px;">Expira en 10 minutos. Si no solicitaste este código, ignora este correo.</p>
      </div>
    `,
  });
}
