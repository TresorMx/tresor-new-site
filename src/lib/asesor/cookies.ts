// Nombres de cookie — client-safe (sin dependencias de Node). El provider
// (cliente) solo necesita leer la pista de UI; la lógica de firma/crypto vive
// aparte en session.ts (server-only) para no arrastrar node:crypto al bundle.
export const ASESOR_COOKIE = 'asesor_session'; // httpOnly — autoriza descargas
export const ASESOR_UI_COOKIE = 'asesor_ui';   // legible — solo pista de UI (sin secreto)
