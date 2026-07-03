'use client';

import { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';
import DevelopmentCard from '@/components/home/DevelopmentCard';
import type { Development, City, PropertyType } from '@/lib/developments';

const CITY_LABELS: Record<City, string> = {
  'Cancún': 'Cancún',
  'Puerto Cancún': 'Puerto Cancún',
  'Puerto Morelos': 'Puerto Morelos',
  'Playa del Carmen': 'Playa del Carmen',
  'Tulum': 'Tulum',
};

const TYPE_LABELS: Record<PropertyType, string> = {
  'Departamento': 'Departamentos',
  'Casa': 'Casas',
  'Lote Residencial': 'Lotes residenciales',
  'Local Comercial': 'Locales comerciales',
};

interface FilterState {
  developer: string | null;
  city: City | null;
  propertyType: PropertyType | null;
}

interface Props {
  developments: Development[];
  showDeveloperFilter?: boolean;
  children?: React.ReactNode;
}

// Dropdown de filtro: muestra el label (o el valor activo) + chevron.
function FilterDropdown<T extends string>({
  label,
  options,
  active,
  onSelect,
  labelMap,
}: {
  label: string;
  options: T[];
  active: T | null;
  onSelect: (v: T | null) => void;
  labelMap?: Record<string, string>;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, [open]);

  const labelFor = (v: T) => labelMap?.[v] ?? v;
  const isActive = active !== null;

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className={`flex items-center gap-2 rounded-full px-4 py-2 text-[10px] font-bold uppercase tracking-[0.15em] transition-all duration-200 ${
          isActive
            ? 'bg-accent text-ink'
            : 'bg-ink/[0.06] text-ink/70 hover:bg-ink/[0.10]'
        }`}
      >
        <span className="whitespace-nowrap">
          {isActive ? labelFor(active) : label}
        </span>
        <ChevronDown
          size={13}
          strokeWidth={2.4}
          style={{ display: 'inline' }}
          className={`transition-transform duration-300 ${open ? 'rotate-180' : ''}`}
        />
      </button>

      {/* Panel */}
      <div
        className={`absolute left-0 top-[calc(100%+8px)] z-30 min-w-[200px] origin-top rounded-2xl border border-ink/10 bg-white p-1.5 shadow-xl shadow-ink/10 transition-all duration-200 ${
          open
            ? 'pointer-events-auto scale-100 opacity-100'
            : 'pointer-events-none scale-95 opacity-0'
        }`}
      >
        <button
          onClick={() => {
            onSelect(null);
            setOpen(false);
          }}
          className={`flex w-full items-center justify-between rounded-xl px-3.5 py-2.5 text-left text-[10px] font-bold uppercase tracking-[0.12em] transition-colors ${
            active === null ? 'bg-ink/[0.04] text-ink' : 'text-ink/60 hover:text-ink'
          }`}
        >
          Todos
          {active === null && <Check size={14} strokeWidth={2.5} className="text-accent" style={{ display: 'inline' }} />}
        </button>
        {options.map((opt) => (
          <button
            key={opt}
            onClick={() => {
              onSelect(opt);
              setOpen(false);
            }}
            className={`flex w-full items-center justify-between rounded-xl px-3.5 py-2.5 text-left text-[10px] font-bold uppercase tracking-[0.12em] transition-colors ${
              active === opt ? 'bg-ink/[0.04] text-ink' : 'text-ink/60 hover:text-ink'
            }`}
          >
            {labelFor(opt)}
            {active === opt && <Check size={14} strokeWidth={2.5} className="text-accent" style={{ display: 'inline' }} />}
          </button>
        ))}
      </div>
    </div>
  );
}

export default function SalesPartnerGrid({
  developments,
  showDeveloperFilter = true,
  children,
}: Props) {
  const [filters, setFilters] = useState<FilterState>({
    developer: null,
    city: null,
    propertyType: null,
  });
  const [filtered, setFiltered] = useState(developments);
  const [exiting, setExiting] = useState(false);
  const [renderKey, setRenderKey] = useState(0);

  const devOptions = [...new Set(developments.map((d) => d.brand ?? d.developer))];
  const cityOptions = [...new Set(developments.map((d) => d.city))];
  const typeOptions = [...new Set(
    developments.map((d) => d.propertyType).filter((t): t is PropertyType => Boolean(t)),
  )];

  function applyFilters(next: FilterState) {
    setExiting(true);
    setTimeout(() => {
      setFiltered(
        developments.filter((d) => {
          if (next.developer && (d.brand ?? d.developer) !== next.developer) return false;
          if (next.city && d.city !== next.city) return false;
          if (next.propertyType && d.propertyType !== next.propertyType) return false;
          return true;
        }),
      );
      setRenderKey((k) => k + 1);
      setExiting(false);
    }, 220);
  }

  function setFilter<K extends keyof FilterState>(key: K, value: FilterState[K]) {
    const next = { ...filters, [key]: value };
    setFilters(next);
    applyFilters(next);
  }

  const hasActiveFilters =
    filters.developer !== null || filters.city !== null || filters.propertyType !== null;

  function clearAll() {
    const next: FilterState = { developer: null, city: null, propertyType: null };
    setFilters(next);
    applyFilters(next);
  }

  return (
    <div>
      {/* ── Header: título (izq) + dropdowns (der) ── */}
      <div className="mb-10 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        {children}

        <div className="flex flex-wrap items-center gap-2">
          {showDeveloperFilter && devOptions.length >= 1 && (
            <FilterDropdown
              label="Desarrollador"
              options={devOptions}
              active={filters.developer}
              onSelect={(v) => setFilter('developer', v)}
            />
          )}
          <FilterDropdown
            label="Ciudad"
            options={cityOptions}
            active={filters.city}
            onSelect={(v) => setFilter('city', v)}
            labelMap={CITY_LABELS}
          />
          <FilterDropdown
            label="Tipo de propiedad"
            options={typeOptions}
            active={filters.propertyType}
            onSelect={(v) => setFilter('propertyType', v)}
            labelMap={TYPE_LABELS}
          />

          {/* Limpiar — aparece solo con filtro activo */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: hasActiveFilters ? '1fr' : '0fr',
              transition: 'grid-template-columns 300ms ease',
            }}
          >
            <div className="overflow-hidden">
              <button
                onClick={clearAll}
                className="whitespace-nowrap px-1 text-[10px] font-bold uppercase tracking-[0.18em] text-ink/35 transition-colors hover:text-accent"
              >
                Limpiar
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ── Grid de cards ── */}
      <div
        style={{
          transition: 'opacity 220ms ease, transform 220ms ease',
          opacity: exiting ? 0 : 1,
          transform: exiting ? 'scale(0.985) translateY(8px)' : 'scale(1) translateY(0)',
        }}
      >
        {filtered.length === 0 ? (
          <div className="py-20 text-center text-[14px] font-light text-ink-3">
            No hay desarrollos con estos filtros.
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((dev, i) => (
              <div
                key={`${renderKey}-${dev.slug}`}
                style={{
                  animation: `cardEnter 0.55s cubic-bezier(0.22, 1, 0.36, 1) ${i * 70}ms both`,
                }}
              >
                <DevelopmentCard dev={dev} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
