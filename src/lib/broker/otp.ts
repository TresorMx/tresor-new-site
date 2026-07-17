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

type OtpPurpose = 'verify' | 'reset';

const COPY: Record<OtpPurpose, { subject: (code: string) => string; heading: string; intro: string }> = {
  verify: {
    subject: (code) => `Tu código de verificación: ${code}`,
    heading: 'Verifica tu cuenta de Broker',
    intro: 'Tu código de verificación es:',
  },
  reset: {
    subject: (code) => `Tu código para restablecer contraseña: ${code}`,
    heading: 'Restablece tu contraseña de Broker',
    intro: 'Tu código para crear una nueva contraseña es:',
  },
};

// Mismo código, mismo mecanismo de envío, para verificación de cuenta y
// para recuperación de contraseña — solo cambia la copy del correo (ver
// COPY arriba). Reusa los mismos campos otpCodeHash/otpExpiresAt/
// otpAttempts en Sanity para ambos casos: un broker nunca está a la vez
// registrándose y recuperando contraseña, así que no hay riesgo de mezclar
// un flujo con otro.
export async function sendOtpEmail(email: string, code: string, purpose: OtpPurpose = 'verify'): Promise<void> {
  const copy = COPY[purpose];

  // En dev/preview sin RESEND_API_KEY configurada, el código se loguea para
  // poder probar el flujo completo sin bandeja de correo real — SOLO fuera
  // de producción, nunca se loguea una contraseña ni el hash.
  if (!process.env.RESEND_API_KEY) {
    if (process.env.NODE_ENV !== 'production') {
      console.log(`[broker/otp] RESEND_API_KEY no configurada — código (${purpose}) para ${email}: ${code}`);
      return;
    }
    throw new Error('RESEND_API_KEY no configurada — no se puede enviar el código.');
  }

  const resend = new Resend(process.env.RESEND_API_KEY);
  // El SDK de Resend (v4+) NO lanza excepción cuando la API rechaza el envío
  // (dominio sin verificar, etc.) — regresa { data: null, error }. Sin este
  // chequeo, un envío fallido se reportaba como éxito silencioso.
  const { error } = await resend.emails.send({
    from: `Tresor Real Estate <${process.env.RESEND_FROM_EMAIL ?? 'hello@tresor.mx'}>`,
    to: email,
    subject: copy.subject(code),
    html: `
      <div style="font-family: -apple-system, sans-serif; max-width: 480px;">
        <h3 style="border-bottom: 2px solid #FAB413; padding-bottom: 8px;">${copy.heading}</h3>
        <p>${copy.intro}</p>
        <p style="font-size: 32px; font-weight: 700; letter-spacing: 6px;">${code}</p>
        <p style="color: #666; font-size: 13px;">Expira en 10 minutos. Si no solicitaste este código, ignora este correo.</p>
      </div>
    `,
  });
  if (error) {
    console.error('[broker/otp] Resend rechazó el envío:', error);
    throw new Error('No pudimos enviar el código. Intenta de nuevo en unos minutos.');
  }
}
