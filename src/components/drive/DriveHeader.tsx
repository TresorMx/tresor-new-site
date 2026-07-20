'use client';

import Image from 'next/image';
import { useLocale } from 'next-intl';
import { ArrowLeft } from 'lucide-react';
import { Link, usePathname, useRouter } from '@/navigation';
import { cn } from '@/lib/utils';

// Header mínimo para las rutas ocultas /drive/* — sin barra amarilla, sin
// menú "Propiedades", sin "Agenda una visita": nada que invite a navegar
// fuera de esta zona. El logo NO es un link a propósito (mismo motivo). El
// único control adicional es "Volver" hacia /drive (el índice abierto) —
// sin esto, entrar a un drive específico era un callejón sin salida. Se
// oculta en el propio /drive para no ser un link a sí mismo. El toggle
// ES/EN sigue aquí porque el resto del chrome del sitio (donde vive el
// toggle normal) está oculto.
export default function DriveHeader() {
  const locale = useLocale();
  const isEs = locale !== 'en';
  const pathname = usePathname();
  const router = useRouter();
  const isIndex = pathname === '/drive';

  function switchLocale(next: 'es' | 'en') {
    if (next === locale) return;
    router.replace(pathname, { locale: next });
  }

  return (
    <div className="fixed inset-x-0 top-0 z-50 flex items-center justify-between bg-white/90 px-[max(14px,4vw)] py-3.5 shadow-[0_2px_16px_rgba(0,0,0,0.06)] backdrop-blur-md">
      <div className="flex items-center gap-4">
        {!isIndex && (
          <Link
            href="/drive"
            className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.15em] text-ink-3 transition-colors hover:text-ink"
          >
            <ArrowLeft size={14} strokeWidth={2} />
            {isEs ? 'Volver' : 'Back'}
          </Link>
        )}
        <Image
          src="/LogoTresorVertical.svg"
          alt="Tresor Real Estate"
          width={140}
          height={30}
          priority
          className="h-7 w-auto"
        />
      </div>
      <div className="inline-flex items-center gap-px rounded-full bg-black/[0.05] p-[3px]" role="group" aria-label="Idioma">
        {(['es', 'en'] as const).map((lng) => (
          <button
            key={lng}
            onClick={() => switchLocale(lng)}
            aria-pressed={locale === lng}
            className={cn(
              'rounded-full px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.2em] transition-colors',
              locale === lng ? 'bg-accent text-ink' : 'text-ink-3 hover:text-ink',
            )}
          >
            {lng}
          </button>
        ))}
      </div>
    </div>
  );
}
