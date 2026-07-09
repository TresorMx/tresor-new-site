'use client';

import { useState } from 'react';
import Image from 'next/image';
import DevelopmentCard from '@/components/home/DevelopmentCard';
import { FilterDropdown } from '@/components/home/SalesPartnerGrid';
import { developers, type Development, type DeveloperId } from '@/lib/developments';

// Orden fijo de las secciones — pedido explícito: Live, Urban Homes, Onix.
const GROUP_ORDER: DeveloperId[] = ['Live', 'Urban Homes', 'Onix'];

interface Props {
  developments: Development[];
  children?: React.ReactNode;
}

// Alterna a SalesPartnerGrid (home/page.tsx elige cuál renderizar según
// siteSettings.salesPartnerLayout) — una sección por desarrollador (título +
// su logo a la derecha, igual que Tresor en "We Develop") en vez de un grid
// plano con 3 filtros. Único filtro: Desarrollador (elegir uno oculta las
// demás secciones; "Todos" las muestra todas).
export default function SalesPartnerGrouped({ developments, children }: Props) {
  const [activeDev, setActiveDev] = useState<DeveloperId | null>(null);

  const groups = GROUP_ORDER.map((id) => ({
    id,
    name: developers[id]?.name ?? id,
    logo: developers[id]?.logoDark,
    devs: developments.filter((d) => d.developer === id),
  })).filter((g) => g.devs.length > 0);

  const visibleGroups = activeDev ? groups.filter((g) => g.id === activeDev) : groups;

  return (
    <div>
      {/* ── Header: título (izq) + filtro de desarrollador (der) ── */}
      <div className="mb-10 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        {children}

        {groups.length > 1 && (
          <div className="flex flex-wrap items-center gap-2">
            <FilterDropdown
              label="Desarrollador"
              options={groups.map((g) => g.id)}
              active={activeDev}
              onSelect={setActiveDev}
              labelMap={Object.fromEntries(groups.map((g) => [g.id, g.name]))}
            />
          </div>
        )}
      </div>

      {/* ── Una sección por desarrollador ── */}
      <div className="flex flex-col gap-16">
        {visibleGroups.map((g) => (
          <div key={g.id}>
            <div className="mb-6 flex items-end justify-between gap-6">
              <h3 className="font-sans text-[clamp(20px,2.6vw,32px)] font-normal tracking-tight">{g.name}</h3>
              {g.logo && (
                <Image
                  src={g.logo}
                  alt={g.name}
                  width={160}
                  height={64}
                  className="h-[25px] w-auto shrink-0 self-end object-contain md:h-7"
                />
              )}
            </div>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {g.devs.map((dev) => (
                <DevelopmentCard key={dev.slug} dev={dev} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
