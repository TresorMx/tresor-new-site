'use client';

import { useState } from 'react';
import Image from 'next/image';
import { View } from 'lucide-react';
import type { ContentBlock } from '@/lib/developments';
import { renderEditorial } from '@/lib/richText';
import VirtualTourModal from '@/components/ficha/VirtualTourModal';

interface FichaContentBlockProps {
  block: ContentBlock;
  locale: string;
  gray?: boolean;
}

// Módulo editorial genérico (eyebrow + título + descripción + imagen
// opcional) para historias que no encajan en ningún módulo fijo de la ficha.
// Dos layouts: 'side-by-side' (2 columnas, imagen a un lado — el default
// cuando hay imagen) o 'stacked' (imagen abajo, ancho completo, mismo
// tamaño/proporción que la Galería para que se sienta parte del mismo
// sistema visual, no un cuadro suelto).
export default function FichaContentBlock({ block, locale, gray = false }: FichaContentBlockProps) {
  const isEs = locale !== 'en';
  const [tourOpen, setTourOpen] = useState<string | null>(null);
  const eyebrow = block.eyebrow ? (isEs ? block.eyebrow.es : block.eyebrow.en ?? block.eyebrow.es) : undefined;
  const title = isEs ? block.title.es : block.title.en ?? block.title.es;
  const titleMuted = block.titleMuted
    ? (isEs ? block.titleMuted.es : block.titleMuted.en ?? block.titleMuted.es)
    : undefined;
  const description = isEs ? block.description.es : block.description.en ?? block.description.es;
  const layout = block.layout ?? (block.image ? 'side-by-side' : 'stacked');
  const imageOnRight = (block.imagePosition ?? 'right') === 'right';
  const imageFitClass = block.imageFit === 'contain' ? 'object-contain' : 'object-cover';
  const ctaLabel = block.cta ? (isEs ? block.cta.label.es : block.cta.label.en ?? block.cta.label.es) : undefined;

  const textContent = (
    <div>
      {eyebrow && <span className="eyebrow eyebrow-accent block font-bold">{eyebrow}</span>}
      <h2 className="mt-3 h-display text-[clamp(24px,3.2vw,48px)]">
        {title} {titleMuted && <span className="text-ink-3">{titleMuted}</span>}
      </h2>
      <p className="mt-5 text-[15px] font-light leading-relaxed text-ink-2">
        {renderEditorial(description)}
      </p>
      {block.cta && (
        <button
          onClick={() => setTourOpen(block.cta!.url)}
          className="btn btn-outline mt-6 font-semibold"
        >
          <View size={15} strokeWidth={1.8} />
          {ctaLabel}
        </button>
      )}
    </div>
  );

  return (
    <section className={`${gray ? 'bg-[#FAFAFA]' : 'bg-bg'} py-20 md:py-28`}>
      <div className="container-wrap">
        {layout === 'side-by-side' && block.image ? (
          <div className="grid items-center gap-10 md:grid-cols-2 md:gap-16">
            <div className={imageOnRight ? 'md:order-1' : 'md:order-2'}>{textContent}</div>
            <div
              className={`relative aspect-[4/3] overflow-hidden rounded-[18px] bg-bg-soft ${
                imageOnRight ? 'md:order-2' : 'md:order-1'
              }`}
            >
              <Image src={block.image} alt={title} fill sizes="(max-width: 768px) 100vw, 50vw" className={imageFitClass} />
            </div>
          </div>
        ) : (
          <>
            <div className="mb-10 max-w-[62ch]">{textContent}</div>
            {block.image && (
              <div className="relative aspect-[16/7] max-h-[640px] w-full overflow-hidden rounded-[18px] bg-bg-soft">
                <Image src={block.image} alt={title} fill sizes="100vw" className={imageFitClass} />
              </div>
            )}
          </>
        )}
      </div>

      {block.cta && (
        <VirtualTourModal url={tourOpen} onClose={() => setTourOpen(null)} title={ctaLabel} />
      )}
    </section>
  );
}
