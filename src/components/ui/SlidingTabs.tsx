'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';
import { cn } from '@/lib/utils';

// Pill deslizante genérico — mismo efecto que los tabs de WE DEVELOP en el
// home. Se usa en cualquier switcher de la ficha (nivel, tipologías, etc.)
// para que todos los tabs del sitio se comporten y se vean idénticos.
interface SlidingTabsProps {
  activeIndex: number;
  onChange: (index: number) => void;
  items: { key: string | number; label: ReactNode }[];
  className?: string;
  indicatorClassName?: string; // override del color del pill (default: blanco)
  activeTextClassName?: string; // override del texto activo (default: text-ink)
  inactiveTextClassName?: string; // override del texto inactivo (default: text-ink-3)
}

export default function SlidingTabs({
  activeIndex,
  onChange,
  items,
  className,
  indicatorClassName,
  activeTextClassName,
  inactiveTextClassName,
}: SlidingTabsProps) {
  const tabsRef = useRef<(HTMLButtonElement | null)[]>([]);
  const [indicator, setIndicator] = useState({ left: 0, width: 0 });

  useEffect(() => {
    function measure() {
      const el = tabsRef.current[activeIndex];
      if (el) setIndicator({ left: el.offsetLeft, width: el.offsetWidth });
    }
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, [activeIndex, items.length]);

  return (
    <div className={cn('relative flex items-center gap-1 rounded-full bg-ink/[0.06] p-1', className)}>
      <span
        aria-hidden
        className={cn(
          'absolute bottom-1 top-1 rounded-full shadow-sm transition-all duration-[450ms] ease-[cubic-bezier(0.76,0,0.24,1)]',
          indicatorClassName ?? 'bg-white',
        )}
        style={{ left: indicator.left, width: indicator.width }}
      />
      {items.map((item, i) => (
        <button
          key={item.key}
          ref={(el) => {
            tabsRef.current[i] = el;
          }}
          onClick={() => onChange(i)}
          className={cn(
            'relative z-10 whitespace-nowrap rounded-full px-5 py-2 text-[11px] font-semibold uppercase tracking-[0.2em] transition-colors duration-300',
            activeIndex === i
              ? (activeTextClassName ?? 'text-ink')
              : (inactiveTextClassName ?? 'text-ink-3 hover:text-ink'),
          )}
        >
          {item.label}
        </button>
      ))}
    </div>
  );
}
