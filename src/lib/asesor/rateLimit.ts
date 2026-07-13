// Rate limit en memoria para el login de asesor — un solo usuario, sin base
// de datos, así que un contador por IP en memoria del proceso es suficiente
// para frenar fuerza bruta casual. No sobrevive a un cold start ni se
// comparte entre instancias serverless (cada una lleva su propio conteo),
// pero eso solo hace el límite MÁS generoso en el peor caso, nunca menos
// seguro — sigue siendo mejor que no tener ningún límite.
//
// El contador es por IP, y hasta 25 asesores pueden compartir la misma IP
// de oficina — 8 intentos totales entre todos se agotaban en minutos y el
// resto veía "usuario o contraseña incorrectos" aunque la sesión de arriba
// estuviera bien escrita. 60 deja margen real para 25 personas con algún
// typo cada quien, sin dejar de frenar fuerza bruta contra una sola
// contraseña fija.
const WINDOW_MS = 10 * 60 * 1000; // 10 minutos
const MAX_ATTEMPTS = 60;

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
