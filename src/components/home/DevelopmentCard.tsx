import Image from 'next/image';
import { Link } from '@/navigation';
import { MapPin, Store, Home, Building2, LandPlot, type LucideIcon } from 'lucide-react';
import { formatPrice, developers, type Development, type PropertyType } from '@/lib/developments';

// Ícono por tipo de propiedad (fuente única — replicar en Sanity: al elegir el
// tipo, este es el ícono que se muestra en el card).
const PROPERTY_ICONS: Record<PropertyType, LucideIcon> = {
  Departamento: Building2,
  Casa: Home,
  'Lote Residencial': LandPlot,
  'Local Comercial': Store,
};

export default function DevelopmentCard({ dev, dark = false }: { dev: Development; dark?: boolean }) {
  const price = dev.priceLabel ?? formatPrice(dev);
  // `brand` es un override opcional; la fuente de verdad del nombre del
  // desarrollador es SIEMPRE el registro `developers` (resuelto por
  // `dev.developer`) — nunca un default fijo a "Tresor Real Estate", que
  // hacía que las fichas de Live/Onix/Urban Homes migradas a Sanity (sin
  // `brand`, campo que no existe en el schema) mostraran "Tresor Real
  // Estate" en el card sin importar quién las desarrolló de verdad.
  const brandName = dev.brand ?? developers[dev.developer]?.name ?? 'Tresor Real Estate';
  const badge = dev.badge ?? dev.status;
  const location = dev.phases ?? `${dev.zone ? `${dev.zone}, ` : ''}${dev.city}`;
  // Ícono según propertyType; fallback al type amplio si aún no está definido.
  const TypeIcon = dev.propertyType
    ? PROPERTY_ICONS[dev.propertyType]
    : dev.type === 'Comercial'
      ? Store
      : Home;

  return (
    // Mismo formato que el card de WE DEVELOP (apilado): card blanco enmarcado,
    // imagen arriba (con overlay, badge, ícono y logo centrado) y contenido abajo.
    // `dark` invierte el card a fondo negro (footer) para secciones oscuras
    // (ej. "También te puede interesar") sin tocar el uso normal (home, claro).
    <div className={`grid grid-cols-1 gap-3 rounded-[28px] p-3 ${dark ? 'bg-bg-deep' : 'bg-white'}`}>
      {/* Imagen con marco */}
      <div className="relative aspect-[4/3] overflow-hidden rounded-[20px]">
        <Image
          src={dev.image}
          alt={dev.name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1100px) 50vw, 33vw"
          className={`object-cover ${dev.comingSoon ? 'scale-110 blur-md' : ''}`}
        />
        {/* Overlay oscuro sobre la foto */}
        <div className="absolute inset-0 bg-black/40" />
        {/* Barra superior: badge (izq) + ícono de negocio (der) */}
        <div className="absolute inset-x-4 top-4 z-10 flex items-center">
          {badge && (
            <span className="rounded-full bg-white/10 px-4 py-2 text-[10px] font-bold uppercase tracking-[0.2em] text-white backdrop-blur-md">
              {badge}
            </span>
          )}
          <TypeIcon size={24} strokeWidth={1.6} className="ml-auto text-white" />
        </div>
        {/* Logo centrado sobre la foto (object-contain para soportar wordmarks anchos) */}
        {dev.logo && (
          <div
            className="absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2"
            style={{
              height: 96 * (dev.logoScale ?? 1),
              width: `${64 * (dev.logoScale ?? 1)}%`,
              maxWidth: 240 * (dev.logoScale ?? 1),
            }}
          >
            <Image src={dev.logo} alt={dev.name} fill className="object-contain" />
          </div>
        )}
      </div>

      {/* Contenido */}
      <div className="flex flex-col px-5 py-6">
        <div className={`flex items-center justify-between gap-3 text-[9px] font-bold uppercase tracking-[0.12em] ${dark ? 'text-white/50' : 'text-ink-3/60'}`}>
          <span className="whitespace-nowrap">{brandName}</span>
          <span className="flex items-center gap-1 whitespace-nowrap">
            <MapPin size={11} strokeWidth={2} style={{ display: 'inline' }} />
            {location}
          </span>
        </div>

        <div className="mt-6">
          <h3 className={`font-sans text-[clamp(18px,1.8vw,28px)] font-medium leading-[1.15] ${dark ? 'text-white' : 'text-ink'}`}>
            {dev.name}
          </h3>
          {price && (
            <span className="eyebrow eyebrow-accent mt-1 block font-bold">
              {dev.comingSoon ? (
                <>
                  Desde{' '}
                  <span className="select-none blur-[3px]">{price.replace(/^Desde\s*/i, '')}</span>
                </>
              ) : (
                price
              )}
            </span>
          )}
          {dev.description && (
            <p className={`mt-2 text-[13px] font-light leading-relaxed ${dark ? 'text-white/70' : 'text-ink-2'}`}>
              {dev.description}
            </p>
          )}
          <div className="pt-5">
            {dev.comingSoon ? (
              <span
                aria-disabled="true"
                className={`inline-flex cursor-not-allowed items-center gap-2.5 rounded-full px-6 py-3 text-[11px] font-bold uppercase tracking-[0.2em] ${
                  dark ? 'bg-white/10 text-white/40' : 'bg-ink/[0.08] text-ink/40'
                }`}
              >
                Muy pronto
              </span>
            ) : (
              <Link
                href={dev.href}
                className="inline-flex items-center gap-2.5 rounded-full bg-accent px-6 py-3 text-[11px] font-bold uppercase tracking-[0.2em] text-ink transition-all hover:brightness-95"
              >
                Ver desarrollo
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
