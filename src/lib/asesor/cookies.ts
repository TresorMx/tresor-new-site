// Nombre de cookie — client-safe (sin dependencias de Node), separado de la
// lógica de firma/crypto en session.ts (server-only) para no arrastrar
// node:crypto al bundle del cliente.
export const ASESOR_COOKIE = 'asesor_session'; // httpOnly — autoriza descargas y decide el estado de UI server-side
