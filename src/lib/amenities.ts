import {
  Trees, Waves, Droplets, GlassWater, Target, Trophy, CircleDot, Baby, ToyBrick,
  Blocks, Dumbbell, Flame, PersonStanding, Users, PartyPopper, Activity, Home,
  Sailboat, Bike, Wifi, FlameKindling, Dog, Utensils, Anchor, Sofa, Armchair,
  Martini, Wine, Laptop, ShieldCheck, ParkingCircle, type LucideIcon,
} from 'lucide-react';
import type { I18nText } from '@/lib/types';

// ────────────────────────────────────────────────────────────────────────────
// Catálogo maestro de amenidades — fuente única de verdad.
// Cada desarrollo referencia amenidades por `key` (no texto libre); el ícono
// se resuelve automáticamente de aquí. Cuando esto viva en Sanity, cada
// `key` es una opción de un campo `select` (lista fija) — el editor elige
// de la lista y el ícono aparece solo, exactamente el comportamiento pedido.
// ────────────────────────────────────────────────────────────────────────────
export type AmenityKey =
  | 'areas-verdes'
  | 'alberca-semiolimpica'
  | 'alberca-recreativa'
  | 'alberca-familiar'
  | 'alberca-infinity'
  | 'cancha-padel'
  | 'cancha-usos-multiples'
  | 'cancha-futbol'
  | 'parque-ninos'
  | 'area-infantil'
  | 'ludoteca'
  | 'gym'
  | 'zona-crossfit'
  | 'zona-yoga'
  | 'salon-usos-multiples'
  | 'salon-eventos'
  | 'skate-park'
  | 'casa-club'
  | 'lagos'
  | 'andadores-ciclovias'
  | 'wifi-areas-comunes'
  | 'asadores'
  | 'pet-park'
  | 'restaurante-terraza'
  | 'muelle'
  | 'zona-chill'
  | 'area-lounge'
  | 'lounge-bar'
  | 'terraza-bar'
  // ── Extensión fuera de la lista original (comunes en desarrollos
  // residenciales; agregadas porque Olivia ya las usaba). Confirmar con
  // el usuario si se quedan en el catálogo maestro o se quitan. ──
  | 'coworking'
  | 'seguridad-24-7'
  | 'estacionamiento-visitas'
  | 'camastros'
  | 'sauna'
  | 'lobby';

export const AMENITY_CATALOG: Record<AmenityKey, { label: I18nText; icon: LucideIcon }> = {
  'areas-verdes':          { label: { es: 'Áreas verdes', en: 'Green areas' },                          icon: Trees },
  'alberca-semiolimpica':  { label: { es: 'Alberca semiolímpica', en: 'Semi-Olympic pool' },            icon: Waves },
  'alberca-recreativa':    { label: { es: 'Alberca recreativa', en: 'Recreational pool' },              icon: Droplets },
  'alberca-familiar':      { label: { es: 'Alberca familiar', en: 'Family pool' },                      icon: Waves },
  'alberca-infinity':      { label: { es: 'Alberca infinity', en: 'Infinity pool' },                    icon: GlassWater },
  'cancha-padel':          { label: { es: 'Cancha de pádel', en: 'Padel court' },                       icon: Target },
  'cancha-usos-multiples': { label: { es: 'Cancha de usos múltiples', en: 'Multi-purpose court' },      icon: Trophy },
  'cancha-futbol':         { label: { es: 'Cancha de fútbol', en: 'Soccer field' },                     icon: CircleDot },
  'parque-ninos':          { label: { es: 'Parque para niños', en: "Children's park" },                 icon: Baby },
  'area-infantil':         { label: { es: 'Área infantil', en: 'Kids area' },                           icon: ToyBrick },
  'ludoteca':              { label: { es: 'Ludoteca', en: 'Playroom' },                                 icon: Blocks },
  'gym':                   { label: { es: 'Gym', en: 'Gym' },                                           icon: Dumbbell },
  'zona-crossfit':         { label: { es: 'Zona crossfit', en: 'CrossFit zone' },                       icon: Flame },
  'zona-yoga':             { label: { es: 'Zona yoga', en: 'Yoga zone' },                                icon: PersonStanding },
  'salon-usos-multiples':  { label: { es: 'Salón de usos múltiples', en: 'Multi-purpose room' },        icon: Users },
  'salon-eventos':         { label: { es: 'Salón de eventos', en: 'Event hall' },                       icon: PartyPopper },
  'skate-park':            { label: { es: 'Skate park', en: 'Skate park' },                             icon: Activity },
  'casa-club':             { label: { es: 'Casa club', en: 'Clubhouse' },                               icon: Home },
  'lagos':                 { label: { es: 'Lagos', en: 'Lakes' },                                       icon: Sailboat },
  'andadores-ciclovias':   { label: { es: 'Andadores y ciclovías', en: 'Walkways and bike paths' },     icon: Bike },
  'wifi-areas-comunes':    { label: { es: 'Wifi en áreas comunes', en: 'Wifi in common areas' },        icon: Wifi },
  'asadores':              { label: { es: 'Asadores', en: 'BBQ grills' },                                icon: FlameKindling },
  'pet-park':              { label: { es: 'Pet park', en: 'Pet park' },                                 icon: Dog },
  'restaurante-terraza':   { label: { es: 'Restaurante con terraza', en: 'Rooftop restaurant' },        icon: Utensils },
  'muelle':                { label: { es: 'Muelle', en: 'Dock' },                                       icon: Anchor },
  'zona-chill':            { label: { es: 'Zona chill', en: 'Chill zone' },                             icon: Sofa },
  'area-lounge':           { label: { es: 'Área lounge', en: 'Lounge area' },                           icon: Armchair },
  'lounge-bar':            { label: { es: 'Lounge bar', en: 'Lounge bar' },                             icon: Martini },
  'terraza-bar':           { label: { es: 'Terraza bar', en: 'Rooftop bar' },                           icon: Wine },
  // ── Extensión (ver nota en AmenityKey) ──
  'coworking':             { label: { es: 'Área de coworking', en: 'Coworking area' },                  icon: Laptop },
  'seguridad-24-7':        { label: { es: 'Seguridad 24/7', en: '24/7 security' },                      icon: ShieldCheck },
  'estacionamiento-visitas': { label: { es: 'Estacionamiento para visitas', en: 'Visitor parking' },    icon: ParkingCircle },
  'camastros':             { label: { es: 'Camastros', en: 'Loungers' },                                icon: Sofa },
  'sauna':                 { label: { es: 'Sauna', en: 'Sauna' },                                       icon: Flame },
  'lobby':                 { label: { es: 'Lobby', en: 'Lobby' },                                       icon: Home },
};

// Lista para poblar un <select>/multi-select (Sanity: options.list de un
// array de `string`, cada `AmenityKey` con su `title` legible).
export const amenityOptions = (Object.keys(AMENITY_CATALOG) as AmenityKey[]).map((key) => ({
  key,
  title: AMENITY_CATALOG[key].label.es,
}));
