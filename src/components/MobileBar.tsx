'use client';

import { Calendar, MessageCircle } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Link, usePathname } from '@/navigation';
import { whatsappURL } from '@/lib/utils';

export default function MobileBar() {
  const t = useTranslations('mobileBar');
  const pathname = usePathname();
  const phone = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? '+529984045602';

  // /drive/* (landings espejo sin login para brokers de confianza) — sin
  // barra de "Agenda/WhatsApp" ahí, mismo criterio que el chat de Luis en
  // FloatingLayer: es una zona oculta, no debe empujar al visitante hacia
  // el resto del sitio.
  if (pathname === '/drive' || pathname.startsWith('/drive/')) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 flex items-stretch bg-white shadow-[0_-8px_24px_rgba(0,0,0,0.06)] md:hidden">
      <Link
        href="/agenda"
        className="flex flex-1 items-center justify-center gap-2 py-4 text-[11px] font-semibold uppercase tracking-caps text-ink"
      >
        <Calendar size={16} strokeWidth={1.6} />
        {t('visit')}
      </Link>
      <div className="w-px bg-line" />
      <a
        href={whatsappURL(phone, 'Hola, me interesan las propiedades de Tresor Real Estate')}
        target="_blank"
        rel="noopener noreferrer"
        className="flex flex-1 items-center justify-center gap-2 bg-[#25D366] py-4 text-[11px] font-semibold uppercase tracking-caps text-white"
      >
        <MessageCircle size={16} strokeWidth={1.6} />
        {t('whatsapp')}
      </a>
    </div>
  );
}
