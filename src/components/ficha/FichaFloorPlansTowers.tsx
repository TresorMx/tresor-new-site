'use client';

import { useState } from 'react';
import Image from 'next/image';
import { X, Maximize2, Calendar } from 'lucide-react';
import { Link } from '@/navigation';
import { cn } from '@/lib/utils';
import type { FloorPlanTypology, I18nText } from '@/lib/developments';

// Módulo de floor plans EXCLUSIVO de Vellmari — los planos se dividen en dos
// torres (Sur / Norte) y son muchos (17), así que en vez de los chips
// genéricos de FichaFloorPlans se usa un selector interactivo: la foto de las
// dos torres con hotspots; al elegir una torre se despliega su grid de
// tipologías; al hacer click en una, se abre el plano en grande. Cero chips.
type Tower = 'sur' | 'norte';

const TOWER_META: Record<Tower, { es: string; en: string }> = {
  sur: { es: 'Torre Sur', en: 'South Tower' },
  norte: { es: 'Torre Norte', en: 'North Tower' },
};

// Zonas clickeables sobre `towersImage` (torres.jpg) en porcentajes —
// confirmado por el cliente: Torre Sur = torre izquierda, Torre Norte = torre
// central/derecha. Ajustables sin tocar la lógica.
const HOTSPOTS: Record<Tower, { left: number; top: number; width: number; height: number }> = {
  sur: { left: 10.5, top: 4, width: 19.5, height: 66 },
  norte: { left: 30, top: 9, width: 17.5, height: 61 },
};

interface Props {
  floorPlans: FloorPlanTypology[]; // cada uno con `tower` y `area`
  towersImage: string;
  locale: string;
  gray?: boolean;
  ctaLabels?: { scheduleVisit?: I18nText };
}

export default function FichaFloorPlansTowers({ floorPlans, towersImage, locale, gray = false, ctaLabels }: Props) {
  const isEs = locale !== 'en';
  const [tower, setTower] = useState<Tower | null>(null);
  const [zoom, setZoom] = useState<FloorPlanTypology | null>(null);

  const scheduleLabel =
    (isEs ? ctaLabels?.scheduleVisit?.es : ctaLabels?.scheduleVisit?.en ?? ctaLabels?.scheduleVisit?.es) ??
    (isEs ? 'Agendar una visita' : 'Schedule a visit');

  const count = (tw: Tower) => floorPlans.filter((fp) => fp.tower === tw).length;
  const plans = tower ? floorPlans.filter((fp) => fp.tower === tower) : [];

  return (
    <section className={`${gray ? 'bg-[#FAFAFA]' : 'bg-bg'} py-20 md:py-28`} id="floor-plans">
      <div className="container-wrap">
        <div className="max-w-2xl">
          <span className="eyebrow eyebrow-accent block font-bold">— Floor Plans</span>
          <h2 className="mt-4 h-display text-[clamp(24px,3.2vw,48px)]">
            {isEs ? 'Elige tu ' : 'Choose your '}
            <span className="text-ink-3">{isEs ? 'torre' : 'tower'}</span>
          </h2>
          <p className="mt-4 text-[15px] font-light leading-relaxed text-ink-3">
            {isEs
              ? 'Dos torres frente a la marina de Puerto Cancún. Selecciona una para ver sus tipologías y planos.'
              : 'Two towers facing the Puerto Cancún marina. Select one to explore its layouts and floor plans.'}
          </p>
        </div>

        {/* ── Foto interactiva de las torres ── */}
        <div className="mt-10 overflow-hidden rounded-[24px] border border-line bg-white">
          <div className="relative aspect-[16/9] w-full">
            <Image src={towersImage} alt={isEs ? 'Torres de Vellmari en Puerto Cancún' : 'Vellmari towers in Puerto Cancún'} fill priority sizes="100vw" className="object-cover" />

            {/* Hotspots — solo desktop (en móvil se usan los botones de abajo) */}
            {(['sur', 'norte'] as Tower[]).map((tw) => {
              const h = HOTSPOTS[tw];
              const selected = tower === tw;
              return (
                <button
                  key={tw}
                  onClick={() => setTower(tw)}
                  aria-label={isEs ? TOWER_META[tw].es : TOWER_META[tw].en}
                  className="group absolute hidden md:block"
                  style={{ left: `${h.left}%`, top: `${h.top}%`, width: `${h.width}%`, height: `${h.height}%` }}
                >
                  {/* Marco/overlay que aparece en hover o cuando está activa */}
                  <span
                    className={cn(
                      'absolute inset-0 rounded-[14px] border-2 transition-all duration-300',
                      selected
                        ? 'border-accent bg-accent/10 shadow-[0_0_0_9999px_rgba(14,14,14,0.35)]'
                        : 'border-transparent bg-ink/0 group-hover:border-white/80 group-hover:bg-white/10',
                    )}
                  />
                  {/* Etiqueta flotante */}
                  <span
                    className={cn(
                      'absolute left-1/2 top-3 -translate-x-1/2 whitespace-nowrap rounded-full px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-[0.16em] backdrop-blur-md transition-all duration-300',
                      selected
                        ? 'bg-accent text-ink'
                        : 'bg-black/45 text-white opacity-0 group-hover:opacity-100',
                    )}
                  >
                    {isEs ? TOWER_META[tw].es : TOWER_META[tw].en}
                  </span>
                </button>
              );
            })}

            {/* Hint inicial (desktop, sin selección) */}
            {!tower && (
              <div className="pointer-events-none absolute inset-x-0 bottom-4 hidden justify-center md:flex">
                <span className="rounded-full bg-black/50 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-white backdrop-blur-md">
                  {isEs ? 'Haz click en una torre' : 'Click a tower'}
                </span>
              </div>
            )}
          </div>

          {/* Selector segmentado — visible siempre en móvil, y en desktop una
              vez que ya se eligió una torre (para cambiar sin apuntar a la foto) */}
          <div className={cn('flex items-center gap-2 border-t border-line p-3', tower ? 'md:flex' : 'md:hidden')}>
            {(['sur', 'norte'] as Tower[]).map((tw) => {
              const selected = tower === tw;
              return (
                <button
                  key={tw}
                  onClick={() => setTower(tw)}
                  className={cn(
                    'flex flex-1 items-center justify-center gap-2 rounded-full px-4 py-3 text-[12px] font-bold uppercase tracking-[0.14em] transition-all',
                    selected ? 'bg-ink text-white' : 'bg-ink/[0.05] text-ink-3 hover:bg-ink/[0.09] hover:text-ink',
                  )}
                >
                  {isEs ? TOWER_META[tw].es : TOWER_META[tw].en}
                  <span className={cn('rounded-full px-2 py-0.5 text-[10px]', selected ? 'bg-white/20 text-white' : 'bg-ink/10 text-ink-3')}>
                    {count(tw)}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* ── Grid de tipologías de la torre elegida ── */}
        {tower && (
          <div className="mt-8">
            <div className="mb-6 flex items-center justify-between">
              <h3 className="font-sans text-[clamp(18px,2vw,26px)] font-medium">
                {isEs ? TOWER_META[tower].es : TOWER_META[tower].en}
                <span className="ml-2 text-ink-3">
                  · {plans.length} {isEs ? 'tipologías' : 'layouts'}
                </span>
              </h3>
            </div>

            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {plans.map((fp) => (
                <button
                  key={fp.slug}
                  onClick={() => setZoom(fp)}
                  className="group flex flex-col overflow-hidden rounded-[18px] border border-line bg-white text-left transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_16px_40px_rgba(0,0,0,0.10)]"
                >
                  <div className="relative aspect-[1.2/1] w-full overflow-hidden bg-[#FAFAFA]">
                    {fp.image && (
                      <Image src={fp.image} alt={(isEs ? fp.label.es : fp.label.en ?? fp.label.es) ?? ''} fill sizes="(max-width:640px) 50vw, 25vw" className="object-contain p-4 transition-transform duration-500 group-hover:scale-[1.04]" />
                    )}
                    <span className="absolute right-2.5 top-2.5 flex h-8 w-8 items-center justify-center rounded-full bg-ink/0 text-ink opacity-0 backdrop-blur-md transition-all duration-300 group-hover:bg-white/85 group-hover:opacity-100">
                      <Maximize2 size={14} strokeWidth={2} />
                    </span>
                  </div>
                  <div className="flex items-center justify-between gap-2 border-t border-line px-4 py-3">
                    <span className="text-[13px] font-semibold text-ink">
                      {isEs ? fp.label.es : fp.label.en ?? fp.label.es}
                    </span>
                    {fp.area && <span className="shrink-0 text-[12px] font-medium tabular-nums text-ink-3">{fp.area}</span>}
                  </div>
                </button>
              ))}
            </div>

            <div className="mt-10 flex justify-center">
              <Link href="#aparta" className="btn border-0 bg-accent text-ink hover:brightness-95">
                <Calendar size={15} strokeWidth={1.8} />
                {scheduleLabel}
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* ── Modal del plano en grande ── */}
      {zoom && (
        <div
          className="fixed inset-0 z-[80] flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm md:p-8"
          onClick={() => setZoom(null)}
        >
          <div
            className="relative flex max-h-full w-full max-w-4xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-line px-5 py-3">
              <div>
                <div className="text-[10.5px] uppercase tracking-[0.18em] text-ink-3">
                  {zoom.tower ? (isEs ? TOWER_META[zoom.tower].es : TOWER_META[zoom.tower].en) : ''}
                </div>
                <div className="text-[16px] font-semibold text-ink">
                  {isEs ? zoom.label.es : zoom.label.en ?? zoom.label.es}
                  {zoom.area && <span className="ml-2 font-normal text-ink-3">· {zoom.area}</span>}
                </div>
              </div>
              <button
                onClick={() => setZoom(null)}
                aria-label={isEs ? 'Cerrar' : 'Close'}
                className="flex h-9 w-9 items-center justify-center rounded-full text-ink-3 transition-colors hover:bg-ink/5 hover:text-ink"
              >
                <X size={18} strokeWidth={1.8} />
              </button>
            </div>
            <div className="relative min-h-0 flex-1 bg-[#FAFAFA]">
              {zoom.image && (
                <div className="relative h-[70vh] w-full">
                  <Image src={zoom.image} alt={(isEs ? zoom.label.es : zoom.label.en ?? zoom.label.es) ?? ''} fill sizes="100vw" className="object-contain p-4 md:p-8" />
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
