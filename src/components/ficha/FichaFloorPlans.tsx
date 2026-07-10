'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Orbit, Calendar, ArrowRight } from 'lucide-react';
import { Link } from '@/navigation';
import { cn } from '@/lib/utils';
import VirtualTourModal from '@/components/ficha/VirtualTourModal';
import SlidingTabs from '@/components/ui/SlidingTabs';
import type { FloorPlanTypology, I18nText } from '@/lib/developments';

// Con pocas tipologías (≤5) el pill deslizante de Quattro se ve mejor y cabe
// en una sola fila. Con más (ej. Olivia y sus 10) el pill se corta, así que
// se usan chips que envuelven en varias filas — se ven todas de un vistazo.
const PILL_MAX_ITEMS = 5;

interface FichaFloorPlansProps {
  floorPlans: FloorPlanTypology[];
  locale: string;
  gray?: boolean;
  ctaLabels?: { scheduleVisit?: I18nText; virtualTour?: I18nText };
  // Asesor logueado: este botón deja de ser "Agendar visita" (el público sí
  // lo sigue viendo) y pasa a ser "Aparta ahora", igual que el resto de la
  // ficha en modo asesor.
  isAsesor?: boolean;
}

// Módulo de tipologías para desarrollos SIN inventario propio (Sales
// Partner) — mismo lenguaje visual que FloorPlans.tsx (Tresor), pero cada
// tipología trae SUS PROPIOS specs (flexible, no una forma fija de área/
// frente/fondo) y el CTA es "Tour virtual" (si existe) + "Agendar una
// visita" (o "Aparta ahora" para un asesor) en vez de "Ver disponibilidad"
// (no hay unidades que consultar).
export default function FichaFloorPlans({ floorPlans, locale, gray = false, ctaLabels, isAsesor = false }: FichaFloorPlansProps) {
  const isEs = locale !== 'en';
  const [active, setActive] = useState(0);
  const [tourOpen, setTourOpen] = useState<string | null>(null);
  const current = floorPlans[active];

  const scheduleLabel = isAsesor
    ? (isEs ? 'Aparta ahora' : 'Reserve now')
    : (isEs ? ctaLabels?.scheduleVisit?.es : ctaLabels?.scheduleVisit?.en ?? ctaLabels?.scheduleVisit?.es) ??
      (isEs ? 'Agendar una visita' : 'Schedule a visit');
  const tourLabel =
    (isEs ? ctaLabels?.virtualTour?.es : ctaLabels?.virtualTour?.en ?? ctaLabels?.virtualTour?.es) ??
    (isEs ? 'Tour virtual' : 'Virtual tour');

  return (
    <section className={`${gray ? 'bg-[#FAFAFA]' : 'bg-bg'} py-20 md:py-28`} id="floor-plans">
      <div className="container-wrap">
        {/* Con pocas tipologías (pill deslizante) el tab cabe junto al título,
            igual que en la ficha de Quattro (FloorPlans.tsx) — mismo grid
            `1fr_auto`. Con muchas (chips que envuelven varias filas) se ve
            apretado al lado del título, así que esas se quedan abajo. */}
        <div
          className={cn(
            'mb-8',
            floorPlans.length > 1 && floorPlans.length <= PILL_MAX_ITEMS && 'grid items-end gap-8 md:grid-cols-[1fr_auto]',
          )}
        >
          <div>
            <span className="eyebrow eyebrow-accent block font-bold">— Floor Plans</span>
            <h2 className="mt-4 h-display text-[clamp(24px,3.2vw,48px)]">
              {isEs ? 'Tipologías' : 'Unit'} <span className="text-ink-3">{isEs ? 'disponibles' : 'typologies'}</span>
            </h2>
          </div>

          {floorPlans.length > 1 && floorPlans.length <= PILL_MAX_ITEMS && (
            <SlidingTabs
              activeIndex={active}
              onChange={setActive}
              items={floorPlans.map((fp) => ({
                key: fp.slug,
                label: isEs
                  ? fp.shortLabel?.es ?? fp.label.es
                  : fp.shortLabel?.en ?? fp.label.en ?? fp.shortLabel?.es ?? fp.label.es,
              }))}
            />
          )}
        </div>

        {floorPlans.length > PILL_MAX_ITEMS && (
          // Chips que envuelven en varias filas — con 8-10 tipologías, un tab
          // deslizante de una sola fila se corta o requiere scroll oculto.
          // Aquí se ven todas las opciones de un vistazo, sin cortar nada.
          <div className="mb-8 flex flex-wrap gap-2">
            {floorPlans.map((fp, i) => (
              <button
                key={fp.slug}
                onClick={() => setActive(i)}
                className={cn(
                  'rounded-full px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.15em] transition-all duration-200',
                  active === i
                    ? 'bg-ink text-white'
                    : 'bg-ink/[0.06] text-ink/50 hover:bg-ink/[0.10] hover:text-ink',
                )}
              >
                {isEs ? fp.shortLabel?.es ?? fp.label.es : fp.shortLabel?.en ?? fp.label.en ?? fp.label.es}
              </button>
            ))}
          </div>
        )}

        <div className="grid gap-6 md:grid-cols-[1.4fr_1fr]">
          {/* Imagen de la planta */}
          <div className="flex items-center justify-center overflow-hidden rounded-[18px] border border-line bg-white aspect-[1.4/1]">
            {current.image ? (
              <Image
                src={current.image}
                alt={isEs ? current.label.es : current.label.en ?? current.label.es}
                width={900}
                height={640}
                className="h-full w-full object-contain p-6"
              />
            ) : (
              <span className="text-[13px] text-ink-3">Sin imagen disponible</span>
            )}
          </div>

          {/* Ficha técnica */}
          <div className="rounded-[18px] border border-line bg-white p-8">
            <div className="text-[10.5px] uppercase tracking-[0.18em] text-ink-3">
              {isEs ? 'Tipo' : 'Type'}
            </div>
            <div className="mt-1.5 font-sans text-[32px] font-medium leading-tight">
              {isEs ? current.label.es : current.label.en ?? current.label.es}
            </div>

            {current.specs.length > 0 && (
              <div className="mt-5 flex flex-col gap-3 border-t border-line pt-5">
                {current.specs.map((spec) => (
                  <div key={spec.key} className="flex justify-between text-[13px]">
                    <span className="text-ink-3">{isEs ? spec.label.es : spec.label.en ?? spec.label.es}</span>
                    <span className="font-medium tabular-nums">{spec.value}</span>
                  </div>
                ))}
              </div>
            )}

            <div className="mt-7 flex flex-col gap-3">
              {current.virtualTourUrl && (
                <button
                  onClick={() => setTourOpen(current.virtualTourUrl!)}
                  className="btn btn-outline w-full font-semibold"
                >
                  <Orbit size={15} strokeWidth={1.8} />
                  {tourLabel}
                </button>
              )}
              <Link href="#aparta" className="btn w-full border-0 bg-accent text-ink hover:brightness-95">
                {isAsesor ? <ArrowRight size={15} strokeWidth={1.8} /> : <Calendar size={15} strokeWidth={1.8} />}
                {scheduleLabel}
              </Link>
            </div>
          </div>
        </div>
      </div>

      <VirtualTourModal
        url={tourOpen}
        onClose={() => setTourOpen(null)}
        title={`${isEs ? current.label.es : current.label.en ?? current.label.es} — ${tourLabel}`}
      />
    </section>
  );
}
