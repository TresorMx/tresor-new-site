'use client';

import type { ComponentType, CSSProperties, ReactNode } from 'react';
import { Download } from 'lucide-react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import AsesorGate from '@/components/asesor/AsesorGate';
import { DRIVE_CATALOG, getDriveLayout, getDriveAdminLayout, type DriveCard } from '@/lib/asesor/driveCards';
import { OBJECT_POSITION_MOBILE, OBJECT_POSITION_DESKTOP } from '@/lib/heroImagePosition';

export interface DriveDev {
  slug: string;   // slug de ruta (mismo de la ficha)
  name: string;
  developerName: string;
  developer: string; // id (Tresor/Live/Onix/'Urban Homes') — elige el layout del drive, ver driveCards.ts
  type?: string; // 'Residencial'/'Comercial'/'Lotes'… — filtra items universales (ej. showUnit no aplica a Lotes)
  logo?: string;  // logo del desarrollo (blanco, va sobre fondo oscuro)
  image?: string;
  // Mismo encuadre/escala que usa el hero de la ficha pública (ver
  // Development en developments.ts) — el Drive comparte foto y logo con la
  // ficha, así que debe verse igual, no con el crop/tamaño default.
  heroImagePosition?: { mobile?: 'top' | 'center' | 'bottom'; desktop?: 'top' | 'center' | 'bottom' };
  heroLogoScale?: number;
  heroLogoScaleMobile?: number;
  // Qué documentos tienen contenido real (archivo o liga) en Sanity/estático
  // — un tile SOLO se muestra si available[key] es true. Ver
  // fetchDriveAssetsPresence en src/lib/sanity/drive.ts.
  available: Record<string, boolean>;
  // Formatos administrativos (Recibo de Pago, Apartado, etc.) — solo existen
  // para desarrollos propios de Tresor (Quattro), no para Sales Partner.
  showAdmin?: boolean;
}

export default function AsesorDrive({
  dev,
  gate: Gate = AsesorGate,
  fileEndpoint = '/api/asesor/file',
}: {
  dev: DriveDev;
  // Permite reusar este mismo Drive (y su catálogo real) en
  // /brokers/drive/[slug] con un gate/endpoint de archivo distintos, sin
  // duplicar el contenido.
  gate?: ComponentType<{ children: ReactNode }>;
  fileEndpoint?: string;
}) {
  const mainItems = getDriveLayout(dev.developer, dev.type).filter((item) => dev.available[item.key]);
  const adminItems = dev.showAdmin ? getDriveAdminLayout(dev.developer).filter((item) => dev.available[item.key]) : [];

  return (
    <Gate>
      {/* Sin <main> propio: el layout raíz ya envuelve todo en
          <main className="pt-[104px]">, y anidar OTRO <main> con SU PROPIO
          pt-[104px] duplicaba el padding (104 + 104, con -mt-[72px] solo
          cancelando el interno) — el hero terminaba empezando ~136px abajo
          de lo real, con el header flotando en su propio bloque en vez de
          superponerse a la foto. Mismo patrón que usa la ficha: el hero es
          hijo directo del <main> del layout. */}
      <>
        {/* Encabezado — MISMO hero que las fichas (mismas clases: -mt-[72px],
            height calc(100svh - 104px - 72px), animate-hero-zoom, logo
            centrado con el mismo tamaño clamp), solo se le agrega el texto
            propio del drive (eyebrow + nombre) abajo. */}
        <section data-nav="dark" className="relative -mt-[72px] overflow-hidden bg-bg-deep text-bg" style={{ height: 'calc(100svh - 104px - 72px)', minHeight: '480px' }}>
          <div className="absolute inset-0 animate-hero-zoom">
            {dev.image && (
              <Image
                src={dev.image}
                alt={dev.name}
                fill
                priority
                sizes="100vw"
                className={cn(
                  'scale-105 object-cover',
                  OBJECT_POSITION_MOBILE[dev.heroImagePosition?.mobile ?? 'center'],
                  OBJECT_POSITION_DESKTOP[dev.heroImagePosition?.desktop ?? 'center'],
                )}
              />
            )}
          </div>
          <div className="absolute inset-0 bg-black/50" />

          <div className="relative z-10 flex h-full items-center justify-center pt-[72px]">
            {dev.logo ? (
              <div
                className="relative h-[var(--logo-h-mobile)] w-[min(78vw,420px)] md:h-[var(--logo-h-desktop)] md:w-[min(60vw,640px)]"
                style={{
                  ['--logo-h-desktop' as string]: `clamp(${(140 * (dev.heroLogoScale ?? 1)).toFixed(0)}px, ${(26 * (dev.heroLogoScale ?? 1)).toFixed(1)}vh, ${(260 * (dev.heroLogoScale ?? 1)).toFixed(0)}px)`,
                  ['--logo-h-mobile' as string]: `clamp(${(140 * (dev.heroLogoScaleMobile ?? (dev.heroLogoScale ?? 1) * 0.7)).toFixed(0)}px, ${(26 * (dev.heroLogoScaleMobile ?? (dev.heroLogoScale ?? 1) * 0.7)).toFixed(1)}vh, ${(260 * (dev.heroLogoScaleMobile ?? (dev.heroLogoScale ?? 1) * 0.7)).toFixed(0)}px)`,
                } as CSSProperties}
              >
                <Image
                  src={dev.logo}
                  alt={dev.name}
                  fill
                  className="object-contain drop-shadow-[0_12px_40px_rgba(0,0,0,0.4)]"
                  priority
                />
              </div>
            ) : (
              <h1 className="h-display text-center text-[clamp(40px,7vw,100px)] text-white">{dev.name}</h1>
            )}
          </div>

          <div className="container-wrap absolute inset-x-0 bottom-0 z-10 pb-8">
            <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-accent">
              Drive de Ventas · {dev.developerName}
            </span>
            <h2 className="mt-2 font-sans text-[clamp(22px,3vw,32px)] font-medium leading-tight tracking-tight text-white">
              {dev.name}
            </h2>
          </div>
        </section>

        {/* A diferencia del índice (AsesoresIndex), aquí SÍ hay un hero de
            foto detrás (la sección de arriba) — el mismo truco -mt-10
            rounded-[2.5rem] que usan /gestion y /desarrollo funciona bien
            porque el hueco de las esquinas redondeadas revela la foto del
            hero, no un fondo blanco suelto. */}
        <div className="relative z-10 -mt-10 rounded-[2.5rem] bg-bg-soft pb-24">
          {/* Drive principal */}
          <section className="container-wrap pt-14">
            <div className="mb-7 flex items-end justify-between gap-4">
              <h2 className="font-sans text-[clamp(20px,2.6vw,30px)] font-medium tracking-tight">Drive principal</h2>
              <span className="text-[11px] font-bold uppercase tracking-[0.16em] text-ink-3">{mainItems.length} secciones</span>
            </div>
            {mainItems.length === 0 ? (
              <p className="text-[13px] text-ink-3">Todavía no hay material cargado para este desarrollo.</p>
            ) : (
              <div className="grid gap-4 lg:grid-cols-4">
                {mainItems.map((item) => (
                  <DriveTile
                    key={item.key}
                    card={DRIVE_CATALOG[item.key]}
                    labelOverride={item.label}
                    slug={dev.slug}
                    fullWidth={item.fullWidth}
                    fileEndpoint={fileEndpoint}
                  />
                ))}
              </div>
            )}
          </section>

          {/* Formatos administrativos — solo Quattro (Sales Partner no los tiene) */}
          {adminItems.length > 0 && (
            <section className="container-wrap pt-16">
              <div className="mb-7 flex items-end justify-between gap-4">
                <div>
                  <span className="eyebrow eyebrow-accent block font-bold">— Administrativo</span>
                  <h2 className="mt-3 font-sans text-[clamp(20px,2.6vw,30px)] font-medium tracking-tight">Formatos administrativos</h2>
                </div>
                <span className="text-[11px] font-bold uppercase tracking-[0.16em] text-ink-3">{adminItems.length} formatos</span>
              </div>
              <div className="grid gap-4 lg:grid-cols-4">
                {adminItems.map((item) => (
                  <DriveTile key={item.key} card={DRIVE_CATALOG[item.key]} slug={dev.slug} variant="admin" fileEndpoint={fileEndpoint} />
                ))}
              </div>
            </section>
          )}
        </div>
      </>
    </Gate>
  );
}

function DriveTile({
  card,
  slug,
  variant = 'main',
  labelOverride,
  fullWidth,
  fileEndpoint,
}: {
  card: DriveCard;
  slug: string;
  variant?: 'main' | 'admin';
  labelOverride?: string;
  fullWidth?: boolean;
  fileEndpoint: string;
}) {
  const Icon = card.icon;
  return (
    <a
      href={`${fileEndpoint}?dev=${slug}&doc=${card.key}`}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        'group flex flex-col gap-5 rounded-[18px] bg-white p-6 transition-all duration-300 ease-soft hover:-translate-y-1 hover:shadow-[0_20px_45px_rgba(0,0,0,0.08)]',
        fullWidth && 'lg:col-span-4',
      )}
    >
      <div
        className={cn(
          'flex h-12 w-12 items-center justify-center rounded-full transition-colors',
          variant === 'admin'
            ? 'bg-bg-soft text-ink-2'
            : 'bg-bg-soft text-ink group-hover:bg-ink group-hover:text-white',
        )}
      >
        <Icon size={20} strokeWidth={1.4} />
      </div>
      <div className="flex-1">
        <div className="font-sans text-[17px] font-medium leading-tight">{labelOverride ?? card.label}</div>
        <p className="mt-1.5 text-[12.5px] leading-relaxed text-ink-3">{card.desc}</p>
      </div>
      <span className="inline-flex items-center gap-2 text-[10.5px] font-bold uppercase tracking-[0.16em] text-ink-3 group-hover:text-accent">
        <Download size={12} strokeWidth={1.8} /> Descargar
      </span>
    </a>
  );
}
