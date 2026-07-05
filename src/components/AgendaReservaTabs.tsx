'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import SlidingTabs from '@/components/ui/SlidingTabs';
import AgendaWidget from '@/components/AgendaWidget';
import ReservaForm from '@/components/ReservaForm';
import { formatMXN } from '@/lib/utils';

interface AgendaReservaTabsProps {
  devSlug: string;
  devName: string;
  reservationAmount: number;
  // Copy de la pestaña Agenda (viene de siteSettings, ya localizado).
  agendaTitle1: string;
  agendaTitle2: string;
  agendaDesc: string;
  displayName: string;
}

// Envuelve la sección CTA cuando el desarrollo tiene apartado en línea activo:
// un pill deslizante Agenda / Aparta, con título y formulario por pestaña.
// El eyebrow se reemplaza por el pill. Si el apartado NO está activo, la ficha
// no usa este componente (renderiza el AgendaWidget suelto con su eyebrow).
export default function AgendaReservaTabs({
  devSlug,
  devName,
  reservationAmount,
  agendaTitle1,
  agendaTitle2,
  agendaDesc,
  displayName,
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
        <div className="flex justify-center">
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

        <h2 className="mx-auto mt-6 h-display max-w-5xl text-[clamp(24px,3.2vw,48px)]">
          <span className="text-ink-3">{agendaTitle1}</span>
          <br />
          {tab === 0
            ? `${agendaTitle2} ${displayName}`
            : `${t('apartaLine2Prefix')} ${formatMXN(reservationAmount)} MXN`}
        </h2>

        <p className="mx-auto mt-5 max-w-xl text-[15px] font-light text-ink-3">
          {tab === 0 ? agendaDesc : t('apartaDesc')}
        </p>
      </div>

      {tab === 0 ? (
        <AgendaWidget devSlug={devSlug} devName={devName} />
      ) : (
        <ReservaForm devSlug={devSlug} />
      )}
    </>
  );
}
