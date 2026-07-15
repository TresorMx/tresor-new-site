import bcrypt from 'bcryptjs';

// bcryptjs (pura JS, sin compilación nativa) — segura en serverless de
// Vercel. Cost factor 10 es el estándar recomendado por la librería.
const SALT_ROUNDS = 10;

export function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS);
}

export function comparePassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}
