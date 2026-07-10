'use client';

import { useTranslations } from 'next-intl';
import ReservaForm from '@/components/ReservaForm';
import { formatMXN } from '@/lib/utils';
import type { FloorPlanTypology } from '@/lib/developments';

interface AsesorApartadoOnlyProps {
  devSlug: string;
  floorPlans?: FloorPlanTypology[];
  displayName: string;
  locale: string;
  reservationAmount: number;
}

// Vista de la sección #aparta SOLO para asesores logueados en un Sales
// Partner: sin tab de "Agendar visita" (el público sí lo sigue viendo, ver
// AgendaReservaTabs) — el apartado es el único CTA, forzado activo aunque el
// desarrollo no tenga reservationEnabled en Sanity (isAsesor server-side ya
// lo decidió antes de llegar aquí).
export default function AsesorApartadoOnly({
  devSlug,
  floorPlans,
  displayName,
  locale,
  reservationAmount,
}: AsesorApartadoOnlyProps) {
  const t = useTranslations('reserva');

  return (
    <>
      <div className="container-wrap pb-0 pt-20 text-center md:pt-28">
        <span className="eyebrow eyebrow-accent font-bold">{t('eyebrow')}</span>
        <h2 className="mx-auto mt-5 h-display max-w-3xl text-[clamp(24px,3.2vw,48px)]">
          <span className="text-ink-3">{t('title1')}</span>
          <br />
          {displayName}
        </h2>

        <p className="mx-auto mt-6 max-w-xl text-[17px] font-normal text-ink md:max-w-3xl">
          {t.rich('apartaIntro', {
            devName: displayName,
            amount: `${formatMXN(reservationAmount)} MXN`,
            bold: (chunks) => <span className="font-semibold text-ink">{chunks}</span>,
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
