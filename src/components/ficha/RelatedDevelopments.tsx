'use client';

import { useMemo, useState } from 'react';
import { useTranslations } from 'next-intl';
import DevelopmentCard from '@/components/home/DevelopmentCard';
import SlidingTabs from '@/components/ui/SlidingTabs';
import type { Development } from '@/lib/developments';

interface RelatedDevelopmentsProps {
  items: Development[]; // ya filtrados por mismo `developer`, sin el actual
}

// Franja de cierre de ficha: otros desarrollos del mismo developer, con
// filtro opcional por ciudad (solo se muestra si hay más de una ciudad entre
// los candidatos — si todos son de la misma ciudad, el filtro sería inútil).
// Fondo siempre gris (no participa de la intercalación blanco/gris del resto
// de la ficha) — un gris más marcado que el #FAFAFA estándar, para que se
// sienta como cierre.
export default function RelatedDevelopments({ items }: RelatedDevelopmentsProps) {
  const t = useTranslations('plaza');
  const cities = useMemo(() => Array.from(new Set(items.map((d) => d.city))), [items]);
  const [cityIndex, setCityIndex] = useState(0); // 0 = todas las ciudades

  if (items.length === 0) return null;

  const activeCity = cityIndex > 0 ? cities[cityIndex - 1] : null;
  const visible = (activeCity ? items.filter((d) => d.city === activeCity) : items).slice(0, 3);

  return (
    <section className="bg-[#F0F0EF] py-20 md:py-28">
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
