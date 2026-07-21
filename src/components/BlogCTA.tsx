import Image from 'next/image';
import { whatsappURL } from '@/lib/utils';

interface BlogCTAProps {
  eyebrow?: string;
  title?: string;
  subtitle?: string;
  image?: string;
  imageAlt?: string;
  primaryHref?: string;
  primaryLabel?: string;
  whatsappMessage?: string;
}

// Defaults = el CTA original (Quattro Plaza Center) — los posts que hablan de
// una plaza comercial no necesitan pasar ningún prop. Los posts sobre otros
// temas (ej. departamentos, portafolio completo) pasan overrides.
export default function BlogCTA({
  eyebrow = 'Quattro Plaza Center',
  title = '¿Listo para invertir en Cancún?',
  subtitle = 'Habla con un asesor hoy. Locales comerciales desde $1,968,600 MXN + IVA.',
  image = '/renders/long-island/WEB.jpg',
  imageAlt = 'Locales comerciales Quattro Plaza Center Cancún',
  primaryHref = '/locales-comerciales-cancun',
  primaryLabel = 'Ver locales disponibles',
  whatsappMessage = 'Hola, me interesa un local comercial en Cancún',
}: BlogCTAProps) {
  return (
    <section className="relative overflow-hidden rounded-2xl bg-ink my-16">
      <Image
        src={image}
        alt={imageAlt}
        fill
        className="object-cover opacity-30"
        sizes="(max-width: 768px) 100vw, 900px"
      />
      <div className="relative z-10 px-8 py-16 md:px-16 md:py-20 text-center">
        <p className="eyebrow eyebrow-accent mb-4">{eyebrow}</p>
        <h2 className="h-display text-[clamp(28px,4vw,48px)] text-white mb-4 leading-tight">
          {title}
        </h2>
        <p className="text-white/70 text-lg mb-10 max-w-xl mx-auto">
          {subtitle}
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href={primaryHref}
            className="inline-flex items-center justify-center px-8 py-4 rounded-full bg-accent text-ink font-semibold text-sm tracking-wide hover:opacity-90 transition-opacity"
          >
            {primaryLabel}
          </a>
          <a
            href={whatsappURL('+529984045602', whatsappMessage)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center px-8 py-4 rounded-full border border-white text-white font-semibold text-sm tracking-wide hover:bg-white/10 transition-colors"
          >
            Hablar por WhatsApp
          </a>
        </div>
      </div>
    </section>
  );
}
