import { createHmac, timingSafeEqual } from 'node:crypto';

// Sesión de asesor (usuario único interno de Tresor). SOLO SERVER — importa
// node:crypto, no debe entrar al bundle del cliente. La contraseña NUNCA
// viaja al navegador: se valida server-side contra una env var, y la sesión
// se materializa como una cookie httpOnly firmada con HMAC. Un solo usuario →
// el payload firmado es constante; el token es el HMAC de ese payload con un
// secreto de servidor. Verificar = recomputar y comparar en tiempo constante.
// (El NOMBRE de cookie vive en ./cookies.ts, client-safe.)

// Sin fallback: si faltan estas env vars el módulo truena al cargar en vez
// de correr en producción con un secret/password conocido y commiteado al
// repo (lo que pasaba antes). Deben estar en .env.local (dev) y en Vercel
// (prod) — ver .env.example.
function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`Falta la env var ${name} — revisa .env.local / Vercel.`);
  return value;
}

const SECRET = requireEnv('ASESOR_SESSION_SECRET');
const PAYLOAD = 'asesor-v1';

export { ASESOR_COOKIE } from './cookies';

export function signSession(): string {
  return createHmac('sha256', SECRET).update(PAYLOAD).digest('hex');
}

export function verifySession(token: string | undefined | null): boolean {
  if (!token) return false;
  const expected = signSession();
  if (token.length !== expected.length) return false;
  try {
    return timingSafeEqual(Buffer.from(token), Buffer.from(expected));
  } catch {
    return false;
  }
}

// Credenciales del único asesor. ASESOR_EMAIL no es secreto (es el correo
// público del sitio) — mantiene fallback. ASESOR_PASSWORD sí es secreto, sin
// fallback: antes vivía commiteado al repo como valor por default.
export const ASESOR_EMAIL = (process.env.ASESOR_EMAIL ?? 'hello@tresor.mx').toLowerCase();
export const ASESOR_PASSWORD = requireEnv('ASESOR_PASSWORD');
