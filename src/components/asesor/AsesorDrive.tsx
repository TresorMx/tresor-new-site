'use client';

import type { CSSProperties } from 'react';
import { Download, ArrowLeft } from 'lucide-react';
import Image from 'next/image';
import { Link } from '@/navigation';
import { cn } from '@/lib/utils';
import AsesorGate from '@/components/asesor/AsesorGate';
import { DRIVE_MAIN, DRIVE_ADMIN, type DriveCard } from '@/lib/asesor/driveCards';

export interface DriveDev {
  slug: string;   // slug de ruta (mismo de la ficha)
  name: string;
  developerName: string;
  logo?: string;  // logo del desarrollo (blanco, va sobre fondo oscuro)
  image?: string;
  // Formatos administrativos (Recibo de Pago, Apartado, etc.) — solo existen
  // para desarrollos propios de Tresor (Quattro), no para Sales Partner.
  showAdmin?: boolean;
}

export default function AsesorDrive({ dev }: { dev: DriveDev }) {
  return (
    <AsesorGate>
      <main className="min-h-screen bg-bg pb-24 pt-[104px]">
        {/* Encabezado — MISMO hero que las fichas (mismas clases: -mt-[72px],
            height calc(100svh - 104px - 72px), animate-hero-zoom, logo
            centrado con el mismo tamaño clamp), solo se le agregan los
            textos propios del drive (eyebrow + nombre a la izquierda,
            "Todos los drives" a la derecha, en la misma línea) abajo. */}
        <section data-nav="dark" className="relative -mt-[72px] overflow-hidden bg-bg-deep text-bg" style={{ height: 'calc(100svh - 104px - 72px)', minHeight: '480px' }}>
          <div className="absolute inset-0 animate-hero-zoom">
            {dev.image && (
              <Image src={dev.image} alt={dev.name} fill priority sizes="100vw" className="object-cover scale-105" />
            )}
          </div>
          <div className="absolute inset-0 bg-black/50" />

          <div className="relative z-10 flex h-full items-center justify-center pt-[72px]">
            {dev.logo ? (
              <div
                className="relative h-[var(--logo-h-mobile)] w-[min(78vw,420px)] md:h-[var(--logo-h-desktop)] md:w-[min(60vw,640px)]"
                style={{
                  ['--logo-h-desktop' as string]: 'clamp(140px, 26vh, 260px)',
                  ['--logo-h-mobile' as string]: 'clamp(98px, 18.2vh, 182px)',
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

          <div className="container-wrap absolute inset-x-0 bottom-0 z-10 flex items-end justify-between gap-4 pb-8">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-accent">
                Drive de Ventas · {dev.developerName}
              </span>
              <h2 className="mt-2 font-sans text-[clamp(22px,3vw,32px)] font-medium leading-tight tracking-tight text-white">
                {dev.name}
              </h2>
            </div>
            <Link
              href="/asesores"
              className="mb-1 inline-flex shrink-0 items-center gap-2 text-[11px] font-bold uppercase tracking-[0.16em] text-white/80 transition-colors hover:text-white"
            >
              <ArrowLeft size={14} strokeWidth={1.8} />
              Todos los drives
            </Link>
          </div>
        </section>

        {/* Drive principal */}
        <section className="container-wrap pt-14">
          <div className="mb-7 flex items-end justify-between gap-4">
            <h2 className="font-sans text-[clamp(20px,2.6vw,30px)] font-medium tracking-tight">Drive principal</h2>
            <span className="text-[11px] font-bold uppercase tracking-[0.16em] text-ink-3">{DRIVE_MAIN.length} secciones</span>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {DRIVE_MAIN.map((c) => (
              <DriveTile key={c.key} card={c} slug={dev.slug} />
            ))}
          </div>
        </section>

        {/* Formatos administrativos — solo Quattro (Sales Partner no los tiene) */}
        {dev.showAdmin && (
          <section className="container-wrap pt-16">
            <div className="mb-7 flex items-end justify-between gap-4">
              <div>
                <span className="eyebrow eyebrow-accent block font-bold">— Administrativo</span>
                <h2 className="mt-3 font-sans text-[clamp(20px,2.6vw,30px)] font-medium tracking-tight">Formatos administrativos</h2>
              </div>
              <span className="text-[11px] font-bold uppercase tracking-[0.16em] text-ink-3">{DRIVE_ADMIN.length} formatos</span>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {DRIVE_ADMIN.map((c) => (
                <DriveTile key={c.key} card={c} slug={dev.slug} variant="admin" />
              ))}
            </div>
          </section>
        )}
      </main>
    </AsesorGate>
  );
}

function DriveTile({ card, slug, variant = 'main' }: { card: DriveCard; slug: string; variant?: 'main' | 'admin' }) {
  const Icon = card.icon;
  return (
    <a
      href={`/api/asesor/file?dev=${slug}&doc=${card.key}`}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex flex-col gap-5 rounded-[18px] border border-line bg-white p-6 transition-all hover:-translate-y-1 hover:border-ink hover:shadow-md"
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
        <div className="font-sans text-[17px] font-medium leading-tight">{card.label}</div>
        <p className="mt-1.5 text-[12.5px] leading-relaxed text-ink-3">{card.desc}</p>
      </div>
      <span className="inline-flex items-center gap-2 text-[10.5px] font-bold uppercase tracking-[0.16em] text-ink-3 group-hover:text-accent">
        <Download size={12} strokeWidth={1.8} /> Descargar
      </span>
    </a>
  );
}
