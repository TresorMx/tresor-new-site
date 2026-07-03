import type { Amenity } from '@/lib/developments';
import { AMENITY_CATALOG } from '@/lib/amenities';
import VerticalGallery from '@/components/ficha/VerticalGallery';

interface FichaAmenitiesProps {
  amenities: Amenity[];
  locale: string;
  gray?: boolean;
  galleryImages?: string[]; // fotos curadas de amenidades — a veces 1, a veces varias
  devName: string;
}

// Módulo nuevo del modelo unificado. Se enciende solo si `dev.amenities`
// existe — hoy sobre todo para fichas Sales Partner sin inventario propio.
// 3 columnas: 2/3 texto+íconos (centrado verticalmente contra la galería),
// 1/3 galería vertical.
export default function FichaAmenities({ amenities, locale, gray = true, galleryImages = [], devName }: FichaAmenitiesProps) {
  const isEn = locale === 'en';
  const hasGallery = galleryImages.length > 0;

  return (
    <section className={`${gray ? 'bg-[#FAFAFA]' : 'bg-bg'} py-20 md:py-28`}>
      <div className="container-wrap">
        <div className={`grid gap-10 md:gap-14 ${hasGallery ? 'md:grid-cols-3' : ''}`}>
          {/* Texto + grid de íconos — centrado verticalmente contra la galería */}
          <div className={hasGallery ? 'flex flex-col justify-center md:col-span-2' : ''}>
            <div className="mb-12">
              <span className="eyebrow eyebrow-accent block font-bold">— Amenidades</span>
              <h2 className="mt-5 h-display whitespace-nowrap text-[clamp(24px,3.2vw,48px)]">
                {isEn ? (
                  <>Lifestyle <span className="text-ink-3">of its own</span></>
                ) : (
                  <>Un estilo de vida <span className="text-ink-3">propio</span></>
                )}
              </h2>
            </div>

            <div className="grid grid-cols-4 gap-2">
              {amenities.map((a, i) => {
                const entry = AMENITY_CATALOG[a.key];
                const label = a.labelOverride ?? (isEn ? entry.label.en : entry.label.es) ?? entry.label.es;
                const Icon = entry.icon;
                return (
                  <div key={i} className="flex flex-col items-center gap-3 rounded-2xl bg-white px-6 py-6 text-center">
                    <span className="flex h-16 w-16 items-center justify-center rounded-full bg-accent/10">
                      <Icon size={30} strokeWidth={1.3} className="text-accent" />
                    </span>
                    <span className="text-[14px] font-medium leading-snug text-ink">{label}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Galería vertical — 1 foto o varias, según el desarrollo */}
          {hasGallery && (
            <div className="md:col-span-1">
              <VerticalGallery images={galleryImages} alt={`Amenidades ${devName}`} />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
