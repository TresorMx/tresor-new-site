// Encuadre de la foto del hero — `heroImagePosition` por dispositivo. Con
// fotos que no son perfectamente centradas (ej. un edificio donde lo
// importante está abajo) el default 'center' recorta mal en pantallas
// angostas; este mapa deja elegir el encuadre por breakpoint sin CSS a mano.
// Compartido entre la ficha (page.tsx) y el Drive de Ventas (AsesorDrive.tsx)
// — mismo dev, mismo hero, mismo encuadre en los dos lugares.
export const OBJECT_POSITION_MOBILE: Record<'top' | 'center' | 'bottom', string> = {
  top: 'object-top',
  center: 'object-center',
  bottom: 'object-bottom',
};
export const OBJECT_POSITION_DESKTOP: Record<'top' | 'center' | 'bottom', string> = {
  top: 'md:object-top',
  center: 'md:object-center',
  bottom: 'md:object-bottom',
};
