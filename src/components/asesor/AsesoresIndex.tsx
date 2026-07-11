'use client';

import { ArrowRight } from 'lucide-react';
import Image from 'next/image';
import { Link } from '@/navigation';
import AsesorGate from '@/components/asesor/AsesorGate';

export interface DriveGroup {
  id: string;
  developerName: string;
  developerLogo?: string;
  devs: { slug: string; name: string; image?: string }[];
}

export default function AsesoresIndex({ groups }: { groups: DriveGroup[] }) {
  return (
    <AsesorGate>
      {/* Sin pt propio: el <main> del layout raíz ya trae pt-[104px] — tener
          otro <main> anidado con SU propio padding duplicaba el espacio. */}
      <div className="min-h-screen bg-bg pb-24 pt-9">
        <div className="container-wrap">
          <span className="eyebrow eyebrow-accent block font-bold">— Drives de Ventas</span>
          <h1 className="mt-3 font-sans text-[clamp(28px,4vw,52px)] font-normal leading-[1.05] tracking-tight">
            Material comercial <span className="text-ink-3">por desarrollo</span>
          </h1>
          <p className="mt-4 max-w-xl text-[15px] font-light leading-relaxed text-ink-3">
            Presentaciones, listas de precios, master plans, cuentas bancarias y formatos
            administrativos — listos para cerrar.
          </p>

          <div className="mt-14 flex flex-col gap-16">
            {groups.map((g) => (
              <div key={g.id}>
                <div className="mb-6 flex items-end justify-between gap-6">
                  <h2 className="font-sans text-[clamp(20px,2.6vw,32px)] font-normal tracking-tight">{g.developerName}</h2>
                  {g.developerLogo && (
                    <Image
                      src={g.developerLogo}
                      alt={g.developerName}
                      width={160}
                      height={64}
                      className="h-7 w-auto shrink-0 self-end object-contain md:h-8"
                    />
                  )}
                </div>
                <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                  {g.devs.map((d) => (
                    <Link
                      key={d.slug}
                      href={`/asesores/${d.slug}`}
                      className="group overflow-hidden rounded-[20px] bg-white ring-1 ring-line transition-all duration-300 ease-soft hover:-translate-y-1 hover:shadow-[0_20px_45px_rgba(0,0,0,0.10)]"
                    >
                      <div className="relative aspect-[16/10] overflow-hidden bg-bg-soft">
                        {d.image && (
                          <Image
                            src={d.image}
                            alt={d.name}
                            fill
                            sizes="(max-width: 640px) 100vw, (max-width: 1100px) 50vw, 33vw"
                            className="object-cover transition-transform duration-700 ease-soft group-hover:scale-105"
                          />
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                      </div>
                      <div className="flex items-center justify-between gap-3 px-5 py-4">
                        <span className="font-sans text-[15px] font-medium leading-tight text-ink">{d.name}</span>
                        <ArrowRight
                          size={16}
                          strokeWidth={1.8}
                          className="shrink-0 text-ink-3 transition-all duration-300 group-hover:translate-x-0.5 group-hover:text-accent"
                        />
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AsesorGate>
  );
}
