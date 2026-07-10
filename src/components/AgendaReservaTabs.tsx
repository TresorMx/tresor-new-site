'use client';

import { useTranslations } from 'next-intl';
import ReservaForm from '@/components/ReservaForm';
import { formatMXN } from '@/lib/utils';
import type { FloorPlanTypology } from '@/lib/developments';

interface AgendaReservaTabsProps {
  devSlug: string;
  floorPlans?: FloorPlanTypology[];
  displayName: string;
  locale: string;
  reservationAmount: number;
}

// Sección de apartado en línea de un Sales Partner. Fase 3: se quitó el tab
// "Agendar visita" — el apartado (cuando está activo) es el único CTA de la
// sección, sin alternativa de agendar. `AgendaWidget`/`SlidingTabs` ya no se
// usan aquí (el archivo se llama igual para no tocar los imports en
// page.tsx, aunque ya no hay "tabs").
export default function AgendaReservaTabs({
  devSlug,
  floorPlans,
  displayName,
  locale,
  reservationAmount,
}: AgendaReservaTabsProps) {
  const t = useTranslations('reserva');

  return (
    <>
      <div className="container-wrap pb-0 pt-20 text-center md:pt-28">
        <span className="eyebrow eyebrow-accent font-bold">{t('eyebrow')}</span>
        <h2 className="mx-auto mt-5 h-display max-w-3xl text-[clamp(24px,3.2vw,48px)]">
          <span className="text-ink-3">{t('title1')}</span> {displayName}
        </h2>

        <p className="mx-auto mt-6 max-w-xl text-[17px] font-normal text-ink md:max-w-3xl">
          {t.rich('apartaIntro', {
            devName: displayName,
            amount: `${formatMXN(reservationAmount)} MXN`,
            bold: (chunks) => <span className="font-semibold text-ink">{chunks}</span>,
            // `block` fuerza el salto de línea SIEMPRE antes de "100%
            // Reembolsable", sin importar el ancho — antes solo tenía
            // whitespace-nowrap, así que si sobraba espacio en la línea
            // anterior, el final de la oración (ej. "Wow Condos") se
            // metía en la misma línea que el "100%".
            yellow: (chunks) => (
              <span className="mt-1 block whitespace-nowrap text-[1.5em] font-semibold text-accent">
                {chunks}
              </span>
            ),
          })}
        </p>
      </div>

      <ReservaForm devSlug={devSlug} floorPlans={floorPlans} locale={locale} />
    </>
  );
}
