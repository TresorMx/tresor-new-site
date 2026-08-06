'use client';

import { useEffect } from 'react';
import Image from 'next/image';
import { CheckCircle2, MessageCircle, Phone, Clock, CalendarCheck } from 'lucide-react';

const WA = '529984045602';
const waLink = (msg: string) => `https://wa.me/${WA}?text=${encodeURIComponent(msg)}`;

export default function VellmariEnThankYou() {
  // Punto único de conversión para Google Ads y Meta — se dispara al cargar
  // esta página, a la que solo se llega tras enviar el formulario.
  //
  // OJO: el `send_to` es el MISMO label que usan las landings de Valmira y de
  // Vellmari en español. Para reportar la campaña en inglés por separado hay
  // que crear una conversión nueva en Google Ads y cambiar el label aquí —
  // no se puede hacer desde el código.
  useEffect(() => {
    if (typeof (window as any).gtag === 'function') {
      (window as any).gtag('event', 'conversion', { send_to: 'AW-17453917774/wazACPXDnMQcEM7M1oJB' });
    }
    if (typeof (window as any).fbq === 'function') {
      (window as any).fbq('track', 'Lead', { content_name: 'Vellmari Landing EN', content_category: 'ads' });
    }
  }, []);

  return (
    <section className="relative flex min-h-[100svh] items-center justify-center overflow-hidden bg-ink px-6 py-16 text-white">
      <Image
        src="/desarrollos/Vellmari/ENTREGAFINAL_CADU_VELMARI_AEREA03.jpg"
        alt="Vellmari — Puerto Cancún"
        fill priority sizes="100vw"
        className="object-cover opacity-25"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/85 to-ink/60" />

      <div className="relative z-10 w-full max-w-lg text-center">
        <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-accent text-ink">
          <CheckCircle2 size={34} strokeWidth={1.8} />
        </span>
        <h1 className="mt-7 h-display text-[clamp(30px,5vw,52px)] text-white">Thank you — we got your details</h1>
        <p className="mx-auto mt-4 max-w-md text-[15px] font-light leading-relaxed text-white/70">
          An English-speaking advisor specialized in Vellmari will reach out shortly with live
          availability by tower, pricing and payment plans. In the meantime, get a head start on
          WhatsApp:
        </p>

        <a
          href={waLink("Hi! I just submitted my details on the Vellmari, Puerto Cancún page. I'd like to schedule a tour.")}
          target="_blank" rel="noopener noreferrer"
          className="mt-8 inline-flex items-center gap-2.5 rounded-full bg-[#25D366] px-8 py-4 text-[13px] font-bold uppercase tracking-[0.15em] text-white transition hover:brightness-95"
        >
          <MessageCircle size={16} strokeWidth={2} /> Message us on WhatsApp
        </a>

        <div className="mx-auto mt-12 grid max-w-md gap-3 text-left sm:grid-cols-2">
          {[
            { icon: Clock, title: 'We contact you today', sub: 'An advisor will call or write' },
            { icon: CalendarCheck, title: 'Private tour', sub: 'On site or by video call' },
          ].map(({ icon: Icon, title, sub }) => (
            <div key={title} className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.06] px-4 py-3.5 backdrop-blur-md">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/10 text-accent"><Icon size={18} strokeWidth={1.8} /></span>
              <div>
                <div className="text-[13.5px] font-semibold text-white leading-tight">{title}</div>
                <div className="text-[11.5px] font-light text-white/55">{sub}</div>
              </div>
            </div>
          ))}
        </div>

        <a href="tel:+529984045602" className="mt-10 inline-flex items-center gap-2 text-[13px] text-white/60 transition hover:text-white">
          <Phone size={14} /> Prefer to call? +52 998 404 5602
        </a>
      </div>
    </section>
  );
}
