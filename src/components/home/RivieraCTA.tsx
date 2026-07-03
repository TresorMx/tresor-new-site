'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { Link } from '@/navigation';
import { ArrowRight } from 'lucide-react';
import RevealOnScroll from '@/components/RevealOnScroll';

export default function RivieraCTA() {
  const ref = useRef<HTMLElement>(null);
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      if (!ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      const vh = window.innerHeight;
      // Progreso de la sección al cruzar el viewport: la imagen se desplaza
      // suavemente (parallax) conforme haces scroll, dando sensación de aparición.
      const progress = (rect.top + rect.height / 2 - vh / 2) / vh;
      setOffset(progress * -70);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  return (
    <section
      ref={ref}
      data-nav="dark"
      className="relative z-0 -mt-10 flex min-h-[72vh] items-center overflow-hidden text-bg"
    >
      {/* Imagen de fondo con parallax (no fija) */}
      <div
        className="absolute inset-0 will-change-transform"
        style={{ transform: `translate3d(0, ${offset}px, 0) scale(1.18)` }}
      >
        <Image
          src="/lifestyle/riviera.jpeg"
          alt="Riviera Maya"
          fill
          sizes="100vw"
          className="object-cover"
        />
      </div>
      {/* Overlay para legibilidad */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/45 to-black/30" />

      {/* Contenido */}
      <div className="container-wrap relative z-10 w-full py-24 md:py-32">
        <RevealOnScroll className="max-w-[56rem]">
          <span className="eyebrow text-accent font-bold">Cancún y Riviera Maya</span>
          <h2 className="mt-5 font-sans text-[clamp(24px,3.2vw,48px)] font-normal leading-[1.05] tracking-tight">
            Vive y crece en <span className="text-white/60">el corazón del Caribe mexicano</span>
          </h2>
          <p className="mt-6 text-[15px] font-normal leading-relaxed text-white">
            El destino que más crece en México: plusvalía sostenida, rentas en dólares
            y calidad de vida todo el año. Invierte hoy donde el Caribe trabaja para ti
            y asegura tu lugar en los desarrollos de mayor potencial de la región.
          </p>
          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            <Link href="#portafolio" className="btn btn-lg border-0 bg-accent text-ink hover:brightness-95">
              Ver desarrollos
              <ArrowRight size={15} strokeWidth={1.8} />
            </Link>
            <Link href="/agenda" className="btn btn-glass btn-lg border-0">
              Asesoría sin costo
            </Link>
          </div>
        </RevealOnScroll>
      </div>
    </section>
  );
}
