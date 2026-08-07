'use client';

import Image from 'next/image';
import { ArrowRight, MessageCircle, Phone } from 'lucide-react';

// Cierre oscuro + footer de las landings de captación pagada.
//
// Hoy está duplicado inline en /departamentos-en-cancun-valmira y
// /departamentos-en-puerto-cancun-vellmari (~50 líneas idénticas cada una).
// Se extrae aquí para que la landing nueva no sea una tercera copia; migrar
// las dos existentes es un paso aparte, para no tocar campañas activas en el
// mismo cambio.

const WA = '529984045602';
export const waLink = (msg: string) => `https://wa.me/${WA}?text=${encodeURIComponent(msg)}`;

export default function LandingFooter({
  image,
  imageAlt,
  eyebrow,
  title,
  text,
  ctaLabel,
  onCtaClick,
  whatsappMessage,
  disclaimer,
}: {
  image: string;
  imageAlt: string;
  eyebrow: string;
  title: React.ReactNode;
  text: string;
  ctaLabel: string;
  onCtaClick: () => void;
  whatsappMessage: string;
  disclaimer: React.ReactNode;
}) {
  return (
    <footer data-nav="dark" className="relative z-10 -mt-10 overflow-hidden rounded-t-[2.5rem] bg-bg-deep pt-24 text-white">
      <Image src={image} alt={imageAlt} fill sizes="100vw" className="object-cover object-top opacity-[0.22]" />
      <div className="absolute inset-0 bg-gradient-to-b from-bg-deep/70 via-bg-deep/90 to-bg-deep" />

      <div className="container-wrap relative z-10 text-center">
        <span className="eyebrow eyebrow-accent font-bold">{eyebrow}</span>
        <h2 className="mx-auto mt-5 h-display text-[clamp(30px,4.2vw,60px)] text-white max-w-3xl">{title}</h2>
        <p className="mx-auto mt-5 max-w-xl text-[15px] font-light leading-relaxed text-white/60">{text}</p>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <button onClick={onCtaClick} className="btn btn-lg border-0 bg-accent text-ink hover:brightness-95">
            {ctaLabel} <ArrowRight size={14} strokeWidth={2.2} />
          </button>
          <a
            href={waLink(whatsappMessage)}
            target="_blank" rel="noopener noreferrer"
            className="btn btn-lg btn-ghost-light"
          >
            <MessageCircle size={14} strokeWidth={2} /> WhatsApp
          </a>
        </div>

        <div className="mx-auto mt-20 h-px w-24" style={{ background: 'linear-gradient(to right, transparent, #FAB413, transparent)' }} />

        <div className="flex flex-col items-center gap-5 pb-28 pt-10 lg:pb-12">
          <Image src="/logos/LogoTresor.svg" alt="Tresor Real Estate" width={169} height={44} className="h-[42px] w-auto opacity-90" />
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-[13px] text-white/60">
            <a href="tel:+529984045602" className="inline-flex items-center gap-2 transition hover:text-white">
              <Phone size={14} /> +52 998 404 5602
            </a>
            <a href={waLink(whatsappMessage)} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 transition hover:text-white">
              <MessageCircle size={14} /> WhatsApp
            </a>
          </div>
          <p className="max-w-2xl text-[11px] leading-relaxed text-white/35">{disclaimer}</p>
        </div>
      </div>
    </footer>
  );
}
