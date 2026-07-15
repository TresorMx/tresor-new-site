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
  logoIsWhite = false,
  logoScale = 1,
}: {
  image: string;
  imageAlt: string;
  eyebrow: string;
  title?: string;
  subtitle?: string;
  logo?: string;
  logoAlt?: string;
  // true si `logo` ya es una variante blanca real (ej. Urban Homes) — se usa
  // tal cual, sin el filtro brightness-0/invert que fuerza a blanco a los
  // logos que solo existen en su color original.
  logoIsWhite?: boolean;
  // Multiplicador sobre el tamaño default — logos con proporción más
  // cuadrada (ej. Quattro, ~1.5:1) quedan limitados por la altura de la
  // caja y se ven más chicos que un wordmark ancho, aunque compartan la
  // misma caja. Mismo criterio que heroLogoScale en la ficha.
  logoScale?: number;
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
        // Logo del desarrollador — tamaño moderado (ni diminuto ni gigante,
        // en mobile y desktop), pensado para esta landing "de paso" y no
        // para el momento dramático del hero de ficha (por eso NO reutiliza
        // ese clamp, mucho más grande). Cuando el logo no tiene variante
        // blanca real (Live/Onix) se fuerza a blanco con brightness-0/invert;
        // si ya es blanco de origen (`logoIsWhite`, ej. Urban Homes) se usa
        // tal cual. H1 sr-only porque el logo ya cubre el rol visual del
        // título — sin esto la página se queda sin H1.
        <div className="relative z-10 flex h-full flex-col items-center justify-center px-6 pt-[72px] text-center">
          {title && <h1 className="sr-only">{title}</h1>}
          <div
            className="relative h-[var(--logo-h-mobile)] w-[min(70vw,260px)] md:h-[var(--logo-h-desktop)] md:w-[min(46vw,340px)]"
            style={{
              ['--logo-h-desktop' as string]: `clamp(${(70 * logoScale).toFixed(0)}px, ${(12 * logoScale).toFixed(1)}vh, ${(120 * logoScale).toFixed(0)}px)`,
              ['--logo-h-mobile' as string]: `clamp(${(52 * logoScale).toFixed(0)}px, ${(8.5 * logoScale).toFixed(1)}vh, ${(84 * logoScale).toFixed(0)}px)`,
            } as CSSProperties}
          >
            <Image
              src={logo}
              alt={logoAlt ?? imageAlt}
              fill
              className={`object-contain drop-shadow-[0_12px_40px_rgba(0,0,0,0.4)] ${logoIsWhite ? '' : 'brightness-0 invert'}`}
              priority
            />
          </div>
          {subtitle && (
            <p className="mt-6 max-w-xl text-[15px] font-normal leading-relaxed text-white">{subtitle}</p>
          )}
        </div>
      ) : (
        <div className="relative z-10 flex h-full flex-col items-center justify-center px-6 pt-[72px] text-center">
          <span className="eyebrow eyebrow-accent font-bold">{eyebrow}</span>
          {title && <h1 className="mt-5 h-display max-w-3xl text-[clamp(40px,7vw,88px)] text-white">{title}</h1>}
          {subtitle && (
            <p className="mt-6 max-w-xl text-[15px] font-normal leading-relaxed text-white">{subtitle}</p>
          )}
        </div>
      )}
    </section>
  );
}
