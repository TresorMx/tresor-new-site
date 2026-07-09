import { createHmac, timingSafeEqual } from 'node:crypto';

// Sesión de asesor (usuario único interno de Tresor). SOLO SERVER — importa
// node:crypto, no debe entrar al bundle del cliente. La contraseña NUNCA
// viaja al navegador: se valida server-side contra una env var, y la sesión
// se materializa como una cookie httpOnly firmada con HMAC. Un solo usuario →
// el payload firmado es constante; el token es el HMAC de ese payload con un
// secreto de servidor. Verificar = recomputar y comparar en tiempo constante.
// (Los NOMBRES de cookie viven en ./cookies.ts, client-safe.)

const SECRET = process.env.ASESOR_SESSION_SECRET ?? 'tresor-asesor-dev-secret-cambiar-en-prod';
const PAYLOAD = 'asesor-v1';

export { ASESOR_COOKIE, ASESOR_UI_COOKIE } from './cookies';

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

// Credenciales del único asesor. Email fijo por default; password vía env
// (con fallback al valor que el usuario definió, para que funcione de
// inmediato — se debe mover a env var en Vercel).
export const ASESOR_EMAIL = (process.env.ASESOR_EMAIL ?? 'hello@tresor.mx').toLowerCase();
export const ASESOR_PASSWORD = process.env.ASESOR_PASSWORD ?? 'Tresor2026!';
