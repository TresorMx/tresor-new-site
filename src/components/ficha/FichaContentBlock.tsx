import Image from 'next/image';
import type { ContentBlock } from '@/lib/developments';
import { renderEditorial } from '@/lib/richText';

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
  const eyebrow = block.eyebrow ? (isEs ? block.eyebrow.es : block.eyebrow.en ?? block.eyebrow.es) : undefined;
  const title = isEs ? block.title.es : block.title.en ?? block.title.es;
  const titleMuted = block.titleMuted
    ? (isEs ? block.titleMuted.es : block.titleMuted.en ?? block.titleMuted.es)
    : undefined;
  const description = isEs ? block.description.es : block.description.en ?? block.description.es;
  const layout = block.layout ?? (block.image ? 'side-by-side' : 'stacked');
  const imageOnRight = (block.imagePosition ?? 'right') === 'right';

  const textContent = (
    <div>
      {eyebrow && <span className="eyebrow eyebrow-accent block font-bold">{eyebrow}</span>}
      <h2 className="mt-3 h-display text-[clamp(24px,3.2vw,48px)]">
        {title} {titleMuted && <span className="text-ink-3">{titleMuted}</span>}
      </h2>
      <p className="mt-5 text-[15px] font-light leading-relaxed text-ink-2">
        {renderEditorial(description)}
      </p>
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
              <Image src={block.image} alt={title} fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover" />
            </div>
          </div>
        ) : (
          <>
            <div className="mb-10 max-w-[62ch]">{textContent}</div>
            {block.image && (
              <div className="relative aspect-[16/7] max-h-[640px] w-full overflow-hidden rounded-[18px] bg-bg-soft">
                <Image src={block.image} alt={title} fill sizes="100vw" className="object-cover" />
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}
