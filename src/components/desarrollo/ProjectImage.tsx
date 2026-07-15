'use client';

import { useState } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';

// Foto de proyecto en /desarrollo — si trae 2+ imágenes se vuelve un slider
// compacto (mismo lenguaje del componente Gallery: flechas circulares
// blancas + contador), si trae solo una es una imagen estática. Reemplaza
// al slider de Elementor que tenía el sitio anterior en Allure, Blume y
// La Vela, con nuestro propio estilo.
export default function ProjectImage({
  images, alt, fit = 'cover', aspectRatio = '16/9',
}: { images: string[]; alt: string; fit?: 'cover' | 'contain'; aspectRatio?: string }) {
  const [active, setActive] = useState(0);
  const multi = images.length > 1;
  const fitClass = fit === 'contain' ? 'object-contain' : 'object-cover';

  const prev = (e: React.MouseEvent) => {
    e.preventDefault();
    setActive((i) => (i - 1 + images.length) % images.length);
  };
  const next = (e: React.MouseEvent) => {
    e.preventDefault();
    setActive((i) => (i + 1) % images.length);
  };

  return (
    // aspectRatio es dinámico (distinto por proyecto) — Tailwind no puede
    // generar una clase arbitraria en build-time si el valor viene de una
    // variable, así que va como inline style, no como `aspect-[...]`.
    <div className="group relative overflow-hidden rounded-[20px] bg-bg-soft" style={{ aspectRatio }}>
      {images.map((src, i) => (
        <Image
          key={src}
          src={src}
          alt={`${alt} ${i + 1}`}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1100px) 50vw, 33vw"
          priority={i === 0}
          className={`${fitClass} transition-opacity duration-700 ease-in-out ${
            i === active ? 'opacity-100' : 'opacity-0'
          }`}
        />
      ))}

      {multi && (
        <>
          <button
            onClick={prev}
            aria-label="Anterior"
            className="absolute left-3 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-ink opacity-0 shadow-sm backdrop-blur-sm transition-all hover:scale-105 hover:bg-white group-hover:opacity-100"
          >
            <ChevronLeft size={16} strokeWidth={1.8} />
          </button>
          <button
            onClick={next}
            aria-label="Siguiente"
            className="absolute right-3 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-ink opacity-0 shadow-sm backdrop-blur-sm transition-all hover:scale-105 hover:bg-white group-hover:opacity-100"
          >
            <ChevronRight size={16} strokeWidth={1.8} />
          </button>
          <div className="absolute bottom-3 right-3 z-10 rounded-full bg-black/60 px-3 py-1 font-mono text-[10px] tracking-widest text-white backdrop-blur-sm">
            {String(active + 1).padStart(2, '0')} / {String(images.length).padStart(2, '0')}
          </div>
        </>
      )}
    </div>
  );
}
