import Image from 'next/image';
import Link from 'next/link';
import { Cormorant_Garamond } from 'next/font/google';
import localFont from 'next/font/local';
import { ArrowLeft } from 'lucide-react';
import '@/styles/globals.css';

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '500'],
  style: ['normal', 'italic'],
  variable: '--font-cormorant',
  display: 'swap',
});

const switzer = localFont({
  src: [
    { path: '../fonts/switzer/Switzer-300.woff2', weight: '300', style: 'normal' },
    { path: '../fonts/switzer/Switzer-400.woff2', weight: '400', style: 'normal' },
    { path: '../fonts/switzer/Switzer-500.woff2', weight: '500', style: 'normal' },
    { path: '../fonts/switzer/Switzer-600.woff2', weight: '600', style: 'normal' },
    { path: '../fonts/switzer/Switzer-700.woff2', weight: '700', style: 'normal' },
  ],
  variable: '--font-switzer',
  display: 'swap',
});

export default function NotFound() {
  return (
    <html lang="es" className={`${cormorant.variable} ${switzer.variable}`}>
      <body>
        <main className="relative flex min-h-screen items-center justify-center overflow-hidden">
          {/* Fondo render */}
          <div className="absolute inset-0">
            <Image
              src="/renders/gardens/02.jpg"
              alt=""
              fill
              priority
              sizes="100vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-black/70" />
          </div>

          {/* Contenido */}
          <div className="relative z-10 flex flex-col items-center px-6 text-center text-white">
            <span className="font-serif text-[clamp(100px,18vw,180px)] font-light italic leading-none tracking-tight text-white/10 select-none">
              404
            </span>

            <div className="-mt-6 md:-mt-10">
              <h1 className="font-serif text-[clamp(28px,4vw,52px)] font-light italic leading-tight">
                Esta página no existe
              </h1>
              <p className="mt-4 max-w-md text-[15px] font-light leading-relaxed text-white/60">
                Parece que la URL que buscas no está disponible.<br />
                Pero tenemos mucho más por mostrarte.
              </p>

              <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
                <Link
                  href="/"
                  className="inline-flex items-center gap-2 rounded-full bg-[#FAB413] px-6 py-3 text-[12px] font-bold uppercase tracking-widest text-[#0E0E0E] transition hover:bg-[#FAB413]/90"
                >
                  <ArrowLeft size={14} strokeWidth={2} />
                  Ir al inicio
                </Link>
                <Link
                  href="/agenda"
                  className="inline-flex items-center gap-2 rounded-full border border-white/30 px-6 py-3 text-[12px] font-bold uppercase tracking-widest text-white transition hover:border-white/60"
                >
                  Agendar visita
                </Link>
              </div>
            </div>

            <p className="mt-16 text-[11px] uppercase tracking-[0.3em] text-white/30">
              Quattro Plaza Center · Cancún
            </p>
          </div>
        </main>
      </body>
    </html>
  );
}
