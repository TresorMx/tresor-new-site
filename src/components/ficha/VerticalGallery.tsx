'use client';

import { useState } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface VerticalGalleryProps {
  images: string[];
  alt: string;
}

// Galería en formato retrato para vivir en una columna angosta (ej. junto
// al grid de Amenidades). Etapa única con crossfade + flechas a los lados,
// sin miniaturas. Altura acotada al máximo de la galería general (640px).
// Con 1 sola foto, se muestra completa sin controles.
export default function VerticalGallery({ images, alt }: VerticalGalleryProps) {
  const [active, setActive] = useState(0);

  if (images.length === 0) return null;

  if (images.length === 1) {
    return (
      <div className="relative aspect-[3/4] max-h-[640px] w-full overflow-hidden rounded-[20px]">
        <Image src={images[0]} alt={alt} fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover" />
      </div>
    );
  }

  const prev = () => setActive((i) => (i - 1 + images.length) % images.length);
  const next = () => setActive((i) => (i + 1) % images.length);

  return (
    <div className="relative aspect-[3/4] max-h-[640px] w-full overflow-hidden rounded-[20px] bg-bg-soft">
      {images.map((src, i) => (
        <Image
          key={src}
          src={src}
          alt={`${alt} ${i + 1}`}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          priority={i === 0}
          className={`object-cover transition-opacity duration-700 ease-in-out ${
            i === active ? 'opacity-100' : 'opacity-0'
          }`}
        />
      ))}

      {/* Prev / Next — a los lados, como la galería general */}
      <button
        onClick={prev}
        aria-label="Anterior"
        className="absolute left-3 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-ink shadow-sm backdrop-blur-sm transition-all hover:scale-105 hover:bg-white"
      >
        <ChevronLeft size={18} strokeWidth={1.8} />
      </button>
      <button
        onClick={next}
        aria-label="Siguiente"
        className="absolute right-3 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-ink shadow-sm backdrop-blur-sm transition-all hover:scale-105 hover:bg-white"
      >
        <ChevronRight size={18} strokeWidth={1.8} />
      </button>

      {/* Contador */}
      <div className="absolute bottom-4 left-4 z-10 rounded-full bg-black/60 px-3.5 py-1.5 font-mono text-[10px] tracking-widest text-white backdrop-blur-sm">
        {String(active + 1).padStart(2, '0')} / {String(images.length).padStart(2, '0')}
      </div>
    </div>
  );
}
