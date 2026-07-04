'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';

// Reveal ligado al scroll: la foto se descubre de abajo hacia arriba conforme
// la sección entra en el viewport, con un ligero ascenso para darle vida.
export default function LuisReveal() {
  const ref = useRef<HTMLDivElement>(null);
  const [p, setP] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Respeta usuarios con motion reducido: muestra la foto completa sin animar.
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setP(1);
      return;
    }

    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const rect = el.getBoundingClientRect();
        const vh = window.innerHeight;
        const start = vh * 0.95; // empieza cuando el top entra por abajo
        const end = vh * 0.4; // termina cuando el top llega al 40% superior
        const prog = (start - rect.top) / (start - end);
        setP(Math.max(0, Math.min(1, prog)));
      });
    };

    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div ref={ref} className="relative -mb-20 self-end md:-mb-28">
      {/* La foto emerge desde abajo (sube a su posición) según el scroll */}
      <div
        style={{
          transform: `translateY(${(1 - p) * 90}px)`,
          opacity: Math.min(1, p * 1.3),
          transition: 'transform 150ms linear, opacity 150ms linear',
        }}
      >
        <Image
          src="/luissection.jpg"
          alt="Luis Castillo, Director Comercial — Tresor Real Estate"
          width={760}
          height={900}
          sizes="(max-width: 768px) 100vw, 45vw"
          className="h-auto w-full object-contain object-bottom"
          style={{
            // Difumina los bordes (sup/izq/der) para fundir el negro de la
            // foto con el fondo de la sección; el inferior queda al ras.
            WebkitMaskImage:
              'linear-gradient(to right, transparent 0, #000 9%, #000 91%, transparent 100%), linear-gradient(to bottom, transparent 0, #000 14%, #000 100%)',
            WebkitMaskComposite: 'source-in',
            maskImage:
              'linear-gradient(to right, transparent 0, #000 9%, #000 91%, transparent 100%), linear-gradient(to bottom, transparent 0, #000 14%, #000 100%)',
            maskComposite: 'intersect',
          }}
        />
        {/* Gradiente negro sutil encima: oscurece la parte superior para un
            acabado más fino y la funde con el fondo de la sección. */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              'linear-gradient(to bottom, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.2) 28%, rgba(0,0,0,0) 55%)',
          }}
        />
      </div>

      {/* Crédito de la foto — vertical, lateral derecho (fuera del clip para
          que permanezca visible durante el reveal) */}
      <span
        className="absolute right-4 top-1/2 z-10 -translate-y-1/2 whitespace-nowrap text-[9px] font-bold uppercase tracking-[0.12em] text-white transition-opacity duration-500"
        style={{ writingMode: 'vertical-rl', opacity: p > 0.6 ? 1 : 0 }}
      >
        Luis Castillo | Chief Commercial Officer
      </span>
    </div>
  );
}
