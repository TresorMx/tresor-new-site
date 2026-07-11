import type { CSSProperties } from 'react';
import Image from 'next/image';

// Hero de las landings de categoría (tipo de propiedad, ciudad, desarrollador)
// — mismo patrón exacto que el hero de ficha/drive/desarrollo corporativo:
// -mt-[72px] + data-nav="dark" + height calc(100svh - 104px - 72px) +
// animate-hero-zoom. Con `logo` centra el logo del desarrollador (como en
// ficha); sin `logo` centra eyebrow + título + subtítulo (para tipo/ciudad).
export default function CategoryHero({
  image,
  imageAlt,
  eyebrow,
  title,
  subtitle,
  logo,
  logoAlt,
}: {
  image: string;
  imageAlt: string;
  eyebrow: string;
  title?: string;
  subtitle?: string;
  logo?: string;
  logoAlt?: string;
}) {
  return (
    <section
      data-nav="dark"
      className="relative -mt-[72px] overflow-hidden bg-bg-deep text-bg"
      style={{ height: 'calc(100svh - 104px - 72px)', minHeight: '440px' }}
    >
      <div className="absolute inset-0 animate-hero-zoom">
        <Image src={image} alt={imageAlt} fill priority sizes="100vw" className="scale-105 object-cover" />
      </div>
      <div className="absolute inset-0 bg-black/55" />

      {logo ? (
        // Card blanca detrás del logo — los logos de Live/Onix/Urban Homes
        // no tienen variante blanca (su wordmark es negro), así que caerían
        // invisibles directo sobre la foto oscura. Una tarjeta blanca los
        // deja legibles a todos por igual, sin inventar un filtro de color
        // que les cambie su marca real. H1 sr-only porque el logo ya cubre
        // el rol visual del título — sin esto la página se queda sin H1.
        <div className="relative z-10 flex h-full items-center justify-center pt-[72px]">
          {title && <h1 className="sr-only">{title}</h1>}
          <div className="flex items-center justify-center rounded-[28px] bg-white px-10 py-8 shadow-[0_20px_60px_rgba(0,0,0,0.35)] sm:px-14 sm:py-10">
            <div
              className="relative h-[var(--logo-h-mobile)] w-[min(60vw,320px)] md:h-[var(--logo-h-desktop)] md:w-[min(40vw,440px)]"
              style={{
                ['--logo-h-desktop' as string]: 'clamp(100px, 16vh, 160px)',
                ['--logo-h-mobile' as string]: 'clamp(70px, 11.2vh, 112px)',
              } as CSSProperties}
            >
              <Image src={logo} alt={logoAlt ?? imageAlt} fill className="object-contain" priority />
            </div>
          </div>
        </div>
      ) : (
        <div className="relative z-10 flex h-full flex-col items-center justify-center px-6 pt-[72px] text-center">
          <span className="eyebrow eyebrow-accent font-bold">{eyebrow}</span>
          {title && <h1 className="mt-5 h-display max-w-3xl text-[clamp(40px,7vw,88px)] text-white">{title}</h1>}
          {subtitle && (
            <p className="mt-6 max-w-xl text-[15px] font-light leading-relaxed text-white/80">{subtitle}</p>
          )}
        </div>
      )}
    </section>
  );
}
