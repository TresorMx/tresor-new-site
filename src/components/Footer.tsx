import { Link } from '@/navigation';
import Image from 'next/image';
import { getTranslations } from 'next-intl/server';
import { ArrowRight } from 'lucide-react';

export default async function Footer() {
  const t = await getTranslations('footer');

  return (
    <footer className="relative z-10 -mt-10 overflow-hidden rounded-t-[2.5rem] bg-bg-deep pt-24 text-bg">
      <div className="container-wrap">
        <div className="grid grid-cols-2 gap-x-6 gap-y-12 pb-20 md:grid-cols-[1.4fr_1fr_1fr_1.2fr] md:gap-[60px]">

          {/* Brand — full width on mobile */}
          <div className="col-span-2 text-center md:col-span-1 md:text-left">
            <Image
              src="/logos/LogoTresor.svg"
              alt="Tresor Real Estate"
              width={168}
              height={56}
              className="mb-6 mx-auto h-[67px] w-auto md:mx-0 md:h-14"
            />
            <p className="font-sans text-[22px] font-light leading-[1.25] text-white/95">
              We develop, we manage,<br />we are your sales partner.
            </p>
            <p className="mt-5 text-[15px] leading-snug text-white">
              <span className="block">{t('developmentBy1')}</span>
              <span className="block">{t('developmentBy2')}</span>
            </p>
            {/* Separador amarillo desvanecido */}
            <div className="my-5 h-px w-24 mx-auto md:mx-0" style={{ background: 'linear-gradient(to right, transparent, #FAB413, transparent)' }} />
            <ul className="flex flex-col gap-2 text-[13px] text-white/70">
              <li><a href="mailto:hello@tresor.mx" className="hover:text-accent transition-colors">hello@tresor.mx</a></li>
              <li><a href="tel:+529984045602" className="hover:text-accent transition-colors">+52 998 404 5602</a></li>
              <li className="text-white/50">Cancún, Q. Roo · México</li>
            </ul>
          </div>

          {/* Acerca de Tresor */}
          <div>
            <h4 className="mb-5 text-[11px] uppercase tracking-eyebrow font-medium text-accent">
              Acerca de Tresor
            </h4>
            <ul className="flex flex-col gap-3 text-[13px] text-white/85 md:text-[14px]">
              <li><Link href="/nosotros" className="hover:text-accent">Desarrollo</Link></li>
              <li><Link href="/nosotros" className="hover:text-accent">Gestión</Link></li>
              <li><Link href="/nosotros" className="hover:text-accent">Comercialización</Link></li>
              <li><Link href="/blog" className="hover:text-accent">Tresor News</Link></li>
              <li><Link href="/privacidad" className="hover:text-accent">Políticas de Privacidad</Link></li>
            </ul>
          </div>

          {/* Propiedades */}
          <div>
            <h4 className="mb-5 text-[11px] uppercase tracking-eyebrow font-medium text-accent">
              Propiedades
            </h4>
            <ul className="flex flex-col gap-3 text-[13px] text-white/85 md:text-[14px]">
              <li><Link href="/#portafolio" className="hover:text-accent">Desarrollos</Link></li>
              <li><Link href="/listings" className="hover:text-accent">Listings</Link></li>
              <li><Link href="/rentas" className="hover:text-accent">Rentas</Link></li>
            </ul>
          </div>

          {/* Broker CTA card — full width on mobile */}
          <div className="col-span-2 flex flex-col gap-4 rounded-lg bg-gradient-to-br from-white/[0.04] to-transparent p-7 md:col-span-1">
            <span className="text-[11px] uppercase tracking-eyebrow font-medium text-accent">
              {t('brokerAccess')}
            </span>
            <div className="font-sans text-[26px] font-light leading-[1.15] text-bg">
              {t('brokerLabel')}<br />{t('brokerSub')}
            </div>
            <p className="text-[13px] leading-relaxed text-white/60">{t('brokerDesc')}</p>
            <Link
              href="/brokers"
              className="inline-flex w-fit items-center gap-2.5 rounded-full bg-accent px-[22px] py-3 text-[11px] font-bold uppercase tracking-caps text-ink transition-all hover:bg-white"
            >
              {t('brokerBtn')}
              <ArrowRight size={14} strokeWidth={1.6} />
            </Link>
          </div>

        </div>

        {/* Bottom: copyright + The Art of Luxury Living + Tresor logo */}
        <div className="flex flex-col items-center justify-between gap-4 border-t border-white/10 py-7 text-[11px] uppercase tracking-caps text-white/40 md:flex-row">
          <span className="whitespace-nowrap text-center text-[9px] font-semibold md:text-left md:text-[11px]">{t('rights')}</span>
          <div className="flex items-center gap-3.5">
            <span
              className="font-tresor text-[10px] normal-case tracking-[0.14em] text-white/60"
              style={{ fontFamily: 'Javacom, var(--font-manrope), sans-serif' }}
            >
              The Art of Luxury Living
            </span>
            <Image src="/logos/LogoTresor.svg" alt="Tresor Real Estate" width={108} height={36} className="h-9 w-auto" />
          </div>
        </div>

        {/* Disclaimer legal */}
        <div className="border-t border-white/10 py-6">
          <p className="mx-auto w-[95%] text-center text-[10px] font-light leading-relaxed text-white/35">
            La información, precios y condiciones publicados en este sitio tienen carácter meramente
            informativo y pueden modificarse sin previo aviso. Las imágenes, renders, planos y áreas son
            representaciones ilustrativas con fines promocionales y no constituyen una representación exacta
            del producto final ni generan obligación contractual alguna. Los desarrollos en los que Tresor
            Real Estate participa como Sales Partner son propiedad y responsabilidad de sus respectivos
            desarrolladores; Tresor actúa exclusivamente como comercializador y no asume responsabilidad
            sobre el diseño, construcción, entrega o cumplimiento de dichos proyectos. Toda compra queda
            sujeta a los términos y condiciones establecidos en el contrato correspondiente.
          </p>
        </div>
      </div>
    </footer>
  );
}
