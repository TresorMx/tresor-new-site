'use client';

import { useState } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';

// Foto de proyecto en /desarrollo — si trae 2+ imágenes se vuelve un slider
// compacto (mismo lenguaje del componente Gallery: flechas circulares
// blancas + contador), si trae solo una es una imagen estática. Reemplaza
// al slider de Elementor que tenía el sitio anterior en Allure, Blume y
// La Vela, con nuestro propio estilo.
export default function ProjectImage({ images, alt }: { images: string[]; alt: string }) {
  const [active, setActive] = useState(0);
  const multi = images.length > 1;

  const prev = (e: React.MouseEvent) => {
    e.preventDefault();
    setActive((i) => (i - 1 + images.length) % images.length);
  };
  const next = (e: React.MouseEvent) => {
    e.preventDefault();
    setActive((i) => (i + 1) % images.length);
  };

  return (
    <div className="group relative aspect-[4/3] overflow-hidden rounded-[20px] bg-bg-soft">
      {images.map((src, i) => (
        <Image
          key={src}
          src={src}
          alt={`${alt} ${i + 1}`}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1100px) 50vw, 33vw"
          priority={i === 0}
          className={`object-cover transition-opacity duration-700 ease-in-out ${
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
