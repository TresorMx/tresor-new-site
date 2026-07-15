// Rate limit en memoria — mismo criterio que src/lib/asesor/rateLimit.ts
// (un contador por IP en memoria del proceso, no sobrevive cold starts ni se
// comparte entre instancias serverless, pero eso solo lo hace MÁS generoso
// en el peor caso, nunca menos seguro). A diferencia de asesor (un solo
// usuario), aquí hay varios endpoints con distinto criterio de abuso
// (registro, login, verificación de OTP, reenvío) — factory parametrizable
// en vez de un límite fijo.

interface Entry { count: number; resetAt: number }

export function createRateLimiter(windowMs: number, maxAttempts: number) {
  const attempts = new Map<string, Entry>();

  return function check(key: string): { ok: true } | { ok: false; retryAfterSeconds: number } {
    const now = Date.now();
    const entry = attempts.get(key);

    if (!entry || now > entry.resetAt) {
      attempts.set(key, { count: 1, resetAt: now + windowMs });
      return { ok: true };
    }

    entry.count += 1;
    if (entry.count > maxAttempts) {
      return { ok: false, retryAfterSeconds: Math.ceil((entry.resetAt - now) / 1000) };
    }
    return { ok: true };
  };
}

// Registro: pocas cuentas nuevas por IP en poco tiempo.
export const checkRegisterRateLimit = createRateLimiter(60 * 60 * 1000, 10);
// Login: margen para typos, pero frena fuerza bruta contra un password.
export const checkLoginRateLimit = createRateLimiter(10 * 60 * 1000, 20);
// Verificación de OTP: pocos intentos — el código son solo 6 dígitos.
export const checkVerifyRateLimit = createRateLimiter(10 * 60 * 1000, 15);
// Reenvío de código: evita spamear el correo del broker.
export const checkResendRateLimit = createRateLimiter(10 * 60 * 1000, 5);
