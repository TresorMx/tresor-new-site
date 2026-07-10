// Rate limit en memoria para el login de asesor — un solo usuario, sin base
// de datos, así que un contador por IP en memoria del proceso es suficiente
// para frenar fuerza bruta casual. No sobrevive a un cold start ni se
// comparte entre instancias serverless (cada una lleva su propio conteo),
// pero eso solo hace el límite MÁS generoso en el peor caso, nunca menos
// seguro — sigue siendo mejor que no tener ningún límite.
const WINDOW_MS = 10 * 60 * 1000; // 10 minutos
const MAX_ATTEMPTS = 8;

const attempts = new Map<string, { count: number; resetAt: number }>();

export function checkLoginRateLimit(key: string): { ok: true } | { ok: false; retryAfterSeconds: number } {
  const now = Date.now();
  const entry = attempts.get(key);

  if (!entry || now > entry.resetAt) {
    attempts.set(key, { count: 1, resetAt: now + WINDOW_MS });
    return { ok: true };
  }

  entry.count += 1;
  if (entry.count > MAX_ATTEMPTS) {
    return { ok: false, retryAfterSeconds: Math.ceil((entry.resetAt - now) / 1000) };
  }
  return { ok: true };
}
