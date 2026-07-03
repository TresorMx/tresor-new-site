import Image from 'next/image';
import type { DeveloperEntity } from '@/lib/developments';

// Bloque de desarrollador — data-driven desde el registro `developers`.
// Universal: Tresor muestra "Empresa desarrolladora" + credenciales; un Sales
// Partner muestra "Desarrollado por [X]". Mismo componente, distinto dato.
interface FichaDeveloperProps {
  developer: DeveloperEntity;
  locale: string;
  gray?: boolean;
}

// Resalta los números del copy (ej. "20 años", "2,000 hogares") en font-medium.
// Genérico: funciona con las credenciales de cualquier desarrollador.
function withBoldNumbers(text: string) {
  return text.split(/(\d[\d,]*)/g).map((part, i) =>
    /^\d[\d,]*$/.test(part) ? (
      <span key={i} className="font-medium">
        {part}
      </span>
    ) : (
      <span key={i}>{part}</span>
    ),
  );
}

export default function FichaDeveloper({ developer, locale, gray = false }: FichaDeveloperProps) {
  const isEn = locale === 'en';
  const label = (isEn ? developer.blockLabel.en : developer.blockLabel.es) ?? developer.blockLabel.es;
  const credentials = isEn
    ? developer.credentials?.en ?? developer.credentials?.es
    : developer.credentials?.es;

  return (
    // El fondo (blanco/gris) se calcula en page.tsx según qué secciones
    // realmente renderizan — nunca hardcodeado aquí. Sin stroke: el cambio
    // de fondo entre secciones ya las diferencia.
    <section className={`${gray ? 'bg-[#FAFAFA]' : 'bg-bg'} py-14 md:py-20`}>
      <div className="container-wrap flex flex-col items-center gap-6 text-center">
        {/* Logo del desarrollador (o su nombre si aún no hay logo cargado) */}
        {developer.logoDark ? (
          <Image
            src={developer.logoDark}
            alt={developer.name}
            width={220}
            height={120}
            className="h-auto w-[160px] md:w-[190px]"
          />
        ) : (
          <span className="font-sans text-[26px] font-semibold tracking-tight text-ink">
            {developer.name}
          </span>
        )}

        {/* Credenciales */}
        <div>
          <span className="eyebrow eyebrow-accent font-bold">{label}</span>
          {credentials && (
            <p className="mx-auto mt-4 max-w-[54ch] font-sans text-[clamp(18px,2.1vw,28px)] font-light leading-[1.38] tracking-tight text-ink">
              {withBoldNumbers(credentials)}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
