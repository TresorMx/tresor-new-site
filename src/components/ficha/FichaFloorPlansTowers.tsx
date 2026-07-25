'use client';

import { useState } from 'react';
import Image from 'next/image';
import { X, Maximize2, Calendar, ArrowRight, ChevronRight } from 'lucide-react';
import { Link } from '@/navigation';
import { cn } from '@/lib/utils';
import SlidingTabs from '@/components/ui/SlidingTabs';
import type { FloorPlanTypology, I18nText } from '@/lib/developments';

// Módulo de floor plans EXCLUSIVO de Vellmari — los planos se dividen en dos
// torres (Sur / Norte). En vez de los chips genéricos, un explorador de dos
// columnas: a la izquierda la foto de las torres (spotlight sobre la torre
// activa), a la derecha se elige una torre y se despliegan sus tipologías en
// un grid de 2 columnas con scroll; al hacer click, el plano se abre en modal.
type Tower = 'sur' | 'norte';

const TOWER_META: Record<Tower, { es: string; en: string }> = {
  sur: { es: 'Torre Sur', en: 'South Tower' },
  norte: { es: 'Torre Norte', en: 'North Tower' },
};
const TOWER_ORDER: Tower[] = ['sur', 'norte'];

// Zoom + pan por torre sobre `towersImage` — Sur = torre izquierda, Norte =
// torre derecha (confirmado). objectPosition/scale medidos a ojo sobre
// torresmitad.jpg (948×1010) para que cada torre quede completa y centrada,
// sin recortes ni overlay oscuro encima.
const FOCUS: Record<'default' | Tower, { x: number; y: number; scale: number }> = {
  default: { x: 50, y: 42, scale: 1 },
  sur: { x: 33, y: 40, scale: 1.85 },
  norte: { x: 69, y: 38, scale: 2.05 },
};

interface Props {
  floorPlans: FloorPlanTypology[]; // cada uno con `tower`, `area` y specs
  towersImage: string;
  locale: string;
  gray?: boolean;
  ctaLabels?: { scheduleVisit?: I18nText };
  // En la ficha el CTA del modal lleva al bloque #aparta; en una landing de
  // captación no existe esa sección, así que se le pasa un handler para
  // hacer scroll al formulario propio de la landing.
  onCtaClick?: () => void;
}

export default function FichaFloorPlansTowers({ floorPlans, towersImage, locale, gray = false, ctaLabels, onCtaClick }: Props) {
  const isEs = locale !== 'en';
  const [selected, setSelected] = useState<Tower | null>(null);
  const [hovered, setHovered] = useState<Tower | null>(null);
  const [zoom, setZoom] = useState<FloorPlanTypology | null>(null);

  // Una vez seleccionada una torre, la foto sigue a `selected` (tabs incluidos);
  // el hover solo manda antes de elegir, en la pantalla "Selecciona una torre".
  const spotlight = selected ?? hovered;
  const focus = FOCUS[spotlight ?? 'default'];
  const scheduleLabel =
    (isEs ? ctaLabels?.scheduleVisit?.es : ctaLabels?.scheduleVisit?.en ?? ctaLabels?.scheduleVisit?.es) ??
    (isEs ? 'Agendar una visita' : 'Schedule a visit');

  const count = (tw: Tower) => floorPlans.filter((fp) => fp.tower === tw).length;
  const plans = selected ? floorPlans.filter((fp) => fp.tower === selected) : [];
  const towerName = (tw: Tower) => (isEs ? TOWER_META[tw].es : TOWER_META[tw].en);

  return (
    <section className={`${gray ? 'bg-[#FAFAFA]' : 'bg-bg'} py-20 md:py-28`} id="floor-plans">
      <div className="container-wrap">
        <div className="max-w-2xl">
          <span className="eyebrow eyebrow-accent block font-bold">— Floor Plans</span>
          <h2 className="mt-4 h-display text-[clamp(24px,3.2vw,48px)]">
            {isEs ? 'Elige tu ' : 'Choose your '}
            <span className="text-ink-3">{isEs ? 'torre' : 'tower'}</span>
          </h2>
        </div>

        <div className="mt-10 grid gap-8 lg:grid-cols-[minmax(0,420px)_1fr] lg:gap-12">
          {/* ── IZQUIERDA: foto de las torres con spotlight ── */}
          <div className="lg:sticky lg:top-24 lg:self-start">
            <div className="relative aspect-[4/3] overflow-hidden rounded-[24px] border border-line lg:aspect-[0.9/1]">
              <Image
                src={towersImage}
                alt={isEs ? 'Torres de Vellmari en Puerto Cancún' : 'Vellmari towers in Puerto Cancún'}
                fill priority sizes="(max-width:1024px) 100vw, 420px"
                className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.76,0,0.24,1)]"
                style={{
                  objectPosition: `${focus.x}% ${focus.y}%`,
                  transform: `scale(${focus.scale})`,
                  transformOrigin: `${focus.x}% ${focus.y}%`,
                }}
              />
              {/* Caption discreto de la torre resaltada */}
              {spotlight && (
                <span className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-white/95 px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.16em] text-ink shadow-sm">
                  {towerName(spotlight)}
                </span>
              )}
            </div>
          </div>

          {/* ── DERECHA: selector → grid de planos ── */}
          <div>
            {!selected ? (
              <div className="flex h-full flex-col justify-center">
                <p className="text-[13px] font-semibold uppercase tracking-[0.18em] text-ink-3">
                  {isEs ? 'Selecciona una torre' : 'Select a tower'}
                </p>
                <div className="mt-5 flex flex-col gap-3">
                  {TOWER_ORDER.map((tw) => (
                    <button
                      key={tw}
                      onMouseEnter={() => setHovered(tw)}
                      onMouseLeave={() => setHovered(null)}
                      onFocus={() => setHovered(tw)}
                      onBlur={() => setHovered(null)}
                      onClick={() => setSelected(tw)}
                      className="group flex items-center justify-between gap-4 rounded-[18px] bg-white px-6 py-5 text-left shadow-[0_2px_10px_rgba(0,0,0,0.04)] transition-all duration-300 hover:shadow-[0_16px_40px_rgba(0,0,0,0.10)] focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                    >
                      <span>
                        <span className="block font-sans text-[clamp(18px,2vw,24px)] font-medium leading-tight text-ink">
                          {towerName(tw)}
                        </span>
                        <span className="mt-1 block text-[13px] text-ink-3">
                          {count(tw)} {isEs ? 'tipologías' : 'layouts'} · {isEs ? 'ver planos' : 'view floor plans'}
                        </span>
                      </span>
                      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-ink/[0.05] text-ink transition-all duration-300 group-hover:bg-accent group-hover:text-ink">
                        <ChevronRight size={18} strokeWidth={2} className="transition-transform duration-300 group-hover:translate-x-0.5" />
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="flex h-full flex-col">
                <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
                  <SlidingTabs
                    activeIndex={TOWER_ORDER.indexOf(selected)}
                    onChange={(i) => setSelected(TOWER_ORDER[i])}
                    items={TOWER_ORDER.map((tw) => ({ key: tw, label: towerName(tw) }))}
                  />
                  <span className="text-[13px] text-ink-3">
                    {plans.length} {isEs ? 'tipologías' : 'layouts'}
                  </span>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:max-h-[560px] lg:overflow-y-auto lg:pr-1 no-scrollbar">
                  {plans.map((fp) => (
                    <button
                      key={fp.slug}
                      onClick={() => setZoom(fp)}
                      className="group flex flex-col rounded-[20px] bg-[#F6F5F2] p-3 text-left transition-all duration-300 hover:-translate-y-1"
                    >
                      <div className="relative aspect-[1.3/1] w-full overflow-hidden rounded-[14px] bg-white">
                        {fp.image && (
                          <Image src={fp.image} alt={(isEs ? fp.label.es : fp.label.en ?? fp.label.es) ?? ''} fill sizes="(max-width:640px) 100vw, 220px" className="object-contain p-3 transition-transform duration-500 group-hover:scale-[1.05]" />
                        )}
                        <span className="absolute right-2.5 top-2.5 flex h-8 w-8 items-center justify-center rounded-full bg-white/0 text-ink opacity-0 shadow-sm backdrop-blur-md transition-all duration-300 group-hover:bg-white/90 group-hover:opacity-100">
                          <Maximize2 size={14} strokeWidth={2} />
                        </span>
                      </div>
                      <div className="px-2 pb-1 pt-4">
                        <div className="font-sans text-[16px] font-semibold text-ink">
                          {isEs ? fp.label.es : fp.label.en ?? fp.label.es}
                        </div>
                        <div className="mt-3 flex flex-col gap-1.5 border-t border-line pt-3">
                          {fp.area && (
                            <SpecRow label={isEs ? 'Área total' : 'Total area'} value={fp.area} />
                          )}
                          {fp.specs?.map((s) => (
                            <SpecRow key={s.key} label={isEs ? s.label.es : s.label.en ?? s.label.es} value={s.value} />
                          ))}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Modal del plano ── */}
      {zoom && (
        <div
          className="fixed inset-0 z-[80] flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm md:p-8"
          onClick={() => setZoom(null)}
        >
          <div
            className="relative flex max-h-full w-full max-w-4xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between gap-4 border-b border-line px-5 py-3.5">
              <div>
                <div className="text-[10.5px] uppercase tracking-[0.18em] text-ink-3">
                  {zoom.tower ? towerName(zoom.tower) : ''}
                </div>
                <div className="text-[16px] font-semibold text-ink">
                  {isEs ? zoom.label.es : zoom.label.en ?? zoom.label.es}
                  {zoom.area && <span className="ml-2 font-normal text-ink-3">· {zoom.area}</span>}
                </div>
              </div>
              <button
                onClick={() => setZoom(null)}
                aria-label={isEs ? 'Cerrar' : 'Close'}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-ink-3 transition-colors hover:bg-ink/5 hover:text-ink"
              >
                <X size={18} strokeWidth={1.8} />
              </button>
            </div>

            <div className="relative min-h-0 flex-1 bg-[#F6F5F2]">
              {zoom.image && (
                <div className="relative h-[58vh] w-full">
                  <Image src={zoom.image} alt={(isEs ? zoom.label.es : zoom.label.en ?? zoom.label.es) ?? ''} fill sizes="100vw" className="object-contain p-4 md:p-8" />
                </div>
              )}
            </div>

            <div className="flex flex-wrap items-center justify-between gap-4 border-t border-line px-5 py-4">
              <div className="flex flex-wrap gap-x-6 gap-y-1 text-[13px]">
                {zoom.specs?.map((s) => (
                  <span key={s.key} className="text-ink-3">
                    {isEs ? s.label.es : s.label.en ?? s.label.es}: <span className="font-medium text-ink">{s.value}</span>
                  </span>
                ))}
              </div>
              {onCtaClick ? (
                <button
                  type="button"
                  onClick={() => { setZoom(null); onCtaClick(); }}
                  className="btn border-0 bg-accent text-ink hover:brightness-95"
                >
                  <Calendar size={15} strokeWidth={1.8} />
                  {scheduleLabel}
                  <ArrowRight size={14} strokeWidth={1.8} />
                </button>
              ) : (
                <Link
                  href="#aparta"
                  onClick={() => setZoom(null)}
                  className="btn border-0 bg-accent text-ink hover:brightness-95"
                >
                  <Calendar size={15} strokeWidth={1.8} />
                  {scheduleLabel}
                  <ArrowRight size={14} strokeWidth={1.8} />
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

function SpecRow({ label, value }: { label?: string; value: string }) {
  return (
    <div className="flex items-center justify-between text-[12.5px]">
      <span className="text-ink-3">{label}</span>
      <span className="font-medium text-ink tabular-nums">{value}</span>
    </div>
  );
}
