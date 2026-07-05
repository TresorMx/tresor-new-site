'use client';

import { useMemo, useState } from 'react';
import { useTranslations } from 'next-intl';
import DevelopmentCard from '@/components/home/DevelopmentCard';
import SlidingTabs from '@/components/ui/SlidingTabs';
import type { Development } from '@/lib/developments';

interface RelatedDevelopmentsProps {
  items: Development[]; // ya filtrados por mismo `developer`, sin el actual
  gray?: boolean;
}

// Franja de cierre de ficha: otros desarrollos del mismo developer, con
// filtro opcional por ciudad (solo se muestra si hay más de una ciudad entre
// los candidatos — si todos son de la misma ciudad, el filtro sería inútil).
export default function RelatedDevelopments({ items, gray = false }: RelatedDevelopmentsProps) {
  const t = useTranslations('plaza');
  const cities = useMemo(() => Array.from(new Set(items.map((d) => d.city))), [items]);
  const [cityIndex, setCityIndex] = useState(0); // 0 = todas las ciudades

  if (items.length === 0) return null;

  const activeCity = cityIndex > 0 ? cities[cityIndex - 1] : null;
  const visible = (activeCity ? items.filter((d) => d.city === activeCity) : items).slice(0, 3);

  return (
    <section className={`${gray ? 'bg-[#FAFAFA]' : 'bg-white'} py-20 md:py-28`}>
      <div className="container-wrap">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <span className="eyebrow eyebrow-accent font-bold">{t('relatedEyebrow')}</span>
            <h2 className="mt-3 h-display text-[clamp(24px,3.2vw,40px)]">{t('relatedTitle')}</h2>
          </div>
          {cities.length > 1 && (
            <SlidingTabs
              activeIndex={cityIndex}
              onChange={setCityIndex}
              items={[
                { key: 'all', label: t('relatedAllCities') },
                ...cities.map((c) => ({ key: c, label: c })),
              ]}
            />
          )}
        </div>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((d) => (
            <DevelopmentCard key={d.slug} dev={d} />
          ))}
        </div>
      </div>
    </section>
  );
}
