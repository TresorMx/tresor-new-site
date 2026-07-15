// Nombre de cookie — client-safe (sin dependencias de Node), separado de la
// lógica de firma/crypto en session.ts (server-only). A propósito distinta
// de ASESOR_COOKIE: un broker autenticado nunca debe activar isAsesor en
// otras partes del sitio (CTAs de ficha, FloatingLayer, etc.) — son permisos
// internos distintos aunque el Drive que ven sea el mismo.
export const BROKER_COOKIE = 'broker_session'; // httpOnly — autoriza descargas y decide el estado de UI server-side
