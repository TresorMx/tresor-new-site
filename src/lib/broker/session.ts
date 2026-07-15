import { createHmac, timingSafeEqual } from 'node:crypto';

// Sesión de broker — SOLO SERVER (node:crypto). A diferencia de
// src/lib/asesor/session.ts (un solo usuario, payload constante), aquí cada
// broker tiene su propio id de Sanity, así que el token SÍ varía por
// persona: `brokerId.expiresAt.firma`. Verificar = recomputar la firma sobre
// `brokerId.expiresAt` y compararla en tiempo constante, más checar que no
// haya expirado.

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`Falta la env var ${name} — revisa .env.local / Vercel.`);
  return value;
}

const SECRET = requireEnv('BROKER_SESSION_SECRET');
const MAX_AGE_MS = 1000 * 60 * 60 * 24 * 30; // 30 días

export { BROKER_COOKIE } from './cookies';

function sign(payload: string): string {
  return createHmac('sha256', SECRET).update(payload).digest('hex');
}

export function signBrokerSession(brokerId: string): string {
  const expiresAt = Date.now() + MAX_AGE_MS;
  const payload = `${brokerId}.${expiresAt}`;
  return `${payload}.${sign(payload)}`;
}

export function verifyBrokerSession(token: string | undefined | null): string | null {
  if (!token) return null;
  const parts = token.split('.');
  if (parts.length !== 3) return null;
  const [brokerId, expiresAtStr, signature] = parts;
  const payload = `${brokerId}.${expiresAtStr}`;
  const expected = sign(payload);

  if (signature.length !== expected.length) return null;
  try {
    if (!timingSafeEqual(Buffer.from(signature), Buffer.from(expected))) return null;
  } catch {
    return null;
  }

  const expiresAt = Number(expiresAtStr);
  if (!Number.isFinite(expiresAt) || Date.now() > expiresAt) return null;

  return brokerId;
}
