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
  // Los títulos cortos de una palabra ("Cancún", "Tulum") se ven bien al
  // tamaño grande (hasta 88px) porque caben en 1 línea. Los títulos largos
  // de las páginas de departamentos por ciudad ("Departamentos en Venta en
  // Playa del Carmen", 44 caracteres) parten a 3 líneas y, al mismo tamaño,
  // se veían apretados y gritones — mucho texto denso sin aire, mala
  // lectura. Se reduce a un tamaño ya usado en otros heroes del sitio
  // (LandingFooter usa el mismo clamp), no uno inventado.
  const isLongTitle = (title?.length ?? 0) > 28;

  return (
    <section
      data-nav="dark"
      // El centrado vertical (flex + justify-center) vive en la SECCIÓN, no
      // en un div hijo con `h-full`. `h-full` es height:100%, y un
      // porcentaje de altura solo funciona si el padre tiene una altura
      // explícita — con solo `minHeight` (sin `height` fijo) el navegador no
      // puede resolverlo, el hijo cae a altura automática (la del
      // contenido) y el flex se queda centrando dentro de una caja del
      // tamaño del propio contenido: en la práctica, sin efecto. Por eso el
      // primer intento de este fix (min-height solo) descuadró el centrado
      // — el contenido se iba arriba y quedaba un hueco vacío abajo, tal
      // cual se ve en las capturas. Centrando la sección misma con flex, el
      // centrado funciona sea cual sea la altura final (min-height o más
      // grande si el contenido no cabe) sin depender de porcentajes.
      className="relative -mt-[72px] flex flex-col items-center justify-center overflow-hidden bg-bg-deep px-6 pt-[72px] text-center text-bg"
      style={{ minHeight: 'max(440px, calc(100svh - 104px - 72px))' }}
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
        <div className="relative z-10 flex flex-col items-center">
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
        <div className="relative z-10 flex flex-col items-center">
          <span className="eyebrow eyebrow-accent font-bold">{eyebrow}</span>
          {title && (
            <h1 className={`mt-5 h-display max-w-3xl text-white ${isLongTitle ? 'text-[clamp(30px,4.2vw,60px)]' : 'text-[clamp(40px,7vw,88px)]'}`}>
              {title}
            </h1>
          )}
          {subtitle && (
            <p className="mt-6 max-w-xl text-[15px] font-normal leading-relaxed text-white">{subtitle}</p>
          )}
        </div>
      )}
    </section>
  );
}
