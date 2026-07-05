'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import SlidingTabs from '@/components/ui/SlidingTabs';
import AgendaWidget from '@/components/AgendaWidget';
import ReservaForm from '@/components/ReservaForm';
import type { FloorPlanTypology } from '@/lib/developments';

interface AgendaReservaTabsProps {
  devSlug: string;
  devName: string;
  floorPlans?: FloorPlanTypology[];
  // Copy de la pestaña Agenda (viene de siteSettings, ya localizado).
  agendaTitle1: string;
  agendaTitle2: string;
  agendaDesc: string;
  displayName: string;
  locale: string;
}

// Envuelve la sección CTA cuando el desarrollo tiene apartado en línea activo:
// un pill deslizante Agenda / Aparta, con título y formulario por pestaña.
// El eyebrow se reemplaza por el pill. Si el apartado NO está activo, la ficha
// no usa este componente (renderiza el AgendaWidget suelto con su eyebrow).
export default function AgendaReservaTabs({
  devSlug,
  devName,
  floorPlans,
  agendaTitle1,
  agendaTitle2,
  agendaDesc,
  displayName,
  locale,
}: AgendaReservaTabsProps) {
  const t = useTranslations('reserva');
  const [tab, setTab] = useState(0);

  // Los botones de la sección 1 apuntan a #aparta (agenda) y #reservar
  // (apartado). Como #reservar no es un id real, hacemos el scroll a mano.
  useEffect(() => {
    function syncFromHash() {
      if (window.location.hash === '#reservar') {
        setTab(1);
        document.getElementById('aparta')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
    syncFromHash();
    window.addEventListener('hashchange', syncFromHash);
    return () => window.removeEventListener('hashchange', syncFromHash);
  }, []);

  return (
    <>
      <div className="container-wrap pb-0 pt-20 text-center md:pt-28">
        <h2 className="mx-auto h-display max-w-5xl text-[clamp(24px,3.2vw,48px)]">
          <span className="text-ink-3">{agendaTitle1}</span>
          <br />
          {agendaTitle2} {displayName}
        </h2>

        <div className="mt-6 flex justify-center">
          <SlidingTabs
            activeIndex={tab}
            onChange={setTab}
            items={[
              { key: 'agenda', label: t('tabAgenda') },
              { key: 'aparta', label: t('tabAparta') },
            ]}
            indicatorClassName="bg-accent"
          />
        </div>

        <p className="mx-auto mt-6 max-w-xl text-[17px] font-semibold text-ink">
          {tab === 0 ? agendaDesc : t('apartaIntro', { devName: displayName })}
        </p>
      </div>

      {tab === 0 ? (
        <AgendaWidget devSlug={devSlug} devName={devName} />
      ) : (
        <ReservaForm devSlug={devSlug} floorPlans={floorPlans} locale={locale} />
      )}
    </>
  );
}
