'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { Link } from '@/navigation';
import { CheckCircle2, ArrowRight, MessageCircle } from 'lucide-react';

function ReservaGraciasContent() {
  const t = useTranslations('reserva');
  const sp = useSearchParams();
  const folio = sp.get('folio') ?? '';

  return (
    <main className="min-h-screen bg-bg pb-20">
      <section className="relative overflow-hidden border-b border-line bg-bg-soft/40 pt-32 pb-20">
        <div className="container-wrap text-center">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-ink text-bg">
            <CheckCircle2 size={28} strokeWidth={1.6} />
          </div>

          <span className="eyebrow eyebrow-accent">{t('graciasEyebrow')}</span>

          <h1 className="mx-auto mt-4 max-w-3xl h-display text-[clamp(36px,5vw,64px)]">
            {t('graciasTitle1')}<br />
            <span style={{ color: '#FAB413' }}>{t('graciasTitle2')}</span>
          </h1>

          <p className="mx-auto mt-5 max-w-xl text-[15px] text-ink-3">{t('graciasDesc')}</p>

          {folio && (
            <div className="mx-auto mt-8 inline-flex flex-col items-center gap-1 rounded-xl border border-line bg-white px-8 py-5">
              <span className="text-[10px] font-semibold uppercase tracking-caps text-ink-3">{t('graciasFolioLabel')}</span>
              <span className="font-mono text-[18px] font-semibold tracking-wide">{folio}</span>
            </div>
          )}
        </div>
      </section>

      <section className="container-wrap mt-12 grid gap-5 md:grid-cols-2">
        <div className="flex flex-col items-start gap-5 rounded-lg border border-line bg-white p-8">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-bg-soft">
            <CheckCircle2 size={20} strokeWidth={1.6} />
          </div>
          <div>
            <h3 className="h-display text-2xl">{t('graciasNextTitle')}</h3>
            <p className="mt-2 text-[14px] text-ink-3">{t('graciasNextDesc')}</p>
          </div>
        </div>

        <a
          href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? '529984045602'}`}
          target="_blank"
          rel="noopener noreferrer"
          className="group flex flex-col items-start gap-5 rounded-lg p-8 text-left transition-all hover:-translate-y-1"
          style={{ background: '#FFEFC2' }}
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-ink text-bg">
            <MessageCircle size={20} strokeWidth={1.6} />
          </div>
          <div>
            <h3 className="h-display text-2xl">{t('graciasWhatsappTitle')}</h3>
            <p className="mt-2 text-[14px] text-ink-3">{t('graciasWhatsappDesc')}</p>
          </div>
          <span
            className="mt-auto inline-flex items-center gap-2 rounded-full px-5 py-3 text-[11px] font-bold uppercase tracking-caps"
            style={{ background: '#0E0E0E', color: '#fff' }}
          >
            {t('graciasWhatsappBtn')} <ArrowRight size={14} strokeWidth={1.6} />
          </span>
        </a>
      </section>

      <div className="container-wrap mt-12 text-center">
        <Link href="/" className="btn btn-lg" style={{ background: '#FAB413', color: '#0E0E0E' }}>
          {t('graciasHome')}
        </Link>
      </div>
    </main>
  );
}

export default function ReservaGraciasPage() {
  return (
    <Suspense fallback={null}>
      <ReservaGraciasContent />
    </Suspense>
  );
}
