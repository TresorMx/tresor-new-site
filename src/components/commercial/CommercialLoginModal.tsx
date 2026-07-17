'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Lock, X, ArrowRight, Eye, EyeOff } from 'lucide-react';
import { Link } from '@/navigation';
import SlidingTabs from '@/components/ui/SlidingTabs';
import { useAsesor } from '@/components/asesor/context';
import { useBroker } from '@/components/broker/context';
import { useCommercialAccess, type CommercialTab } from '@/components/commercial/context';

export default function CommercialLoginModal() {
  const t = useTranslations('commercialModal');
  const { loginOpen, initialTab, closeLogin } = useCommercialAccess();
  const { login: asesorLogin } = useAsesor();
  const { login: brokerLogin } = useBroker();

  const [tab, setTab] = useState<CommercialTab>(initialTab);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [needsVerification, setNeedsVerification] = useState(false);

  // Al abrir, arranca en el tab que pidió quien invocó openLogin() (ej.
  // AsesorGate siempre abre en 'asesor', el botón genérico del header en
  // 'broker' por default).
  useEffect(() => {
    if (loginOpen) setTab(initialTab);
  }, [loginOpen, initialTab]);

  useEffect(() => {
    if (!loginOpen) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') closeLogin();
    }
    document.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [loginOpen, closeLogin]);

  // Limpia el estado al cerrar.
  useEffect(() => {
    if (!loginOpen) {
      setErr(null);
      setPassword('');
      setLoading(false);
      setNeedsVerification(false);
    }
  }, [loginOpen]);

  // Cuentas distintas por tab (asesor: una sola compartida; broker: una por
  // persona) — no tiene sentido arrastrar lo escrito al cambiar de tab.
  useEffect(() => {
    setEmail('');
    setPassword('');
    setErr(null);
    setNeedsVerification(false);
  }, [tab]);

  if (!loginOpen) return null;

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    setNeedsVerification(false);
    setLoading(true);

    if (tab === 'asesor') {
      const errorMessage = await asesorLogin(email, password);
      if (errorMessage) {
        setErr(errorMessage);
        setLoading(false);
      } else {
        // A diferencia de broker (que navega directo a /brokers/drive), el
        // login de asesor se queda en la misma página — hay que cerrar el
        // modal a mano, si no se quedaba abierto en "Verificando…".
        closeLogin();
      }
    } else {
      const result = await brokerLogin(email, password);
      if (result) {
        setErr(result.error);
        setNeedsVerification(Boolean(result.needsVerification));
        setLoading(false);
      }
    }
  }

  return (
    <div
      className="fixed inset-0 z-[90] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
      onClick={closeLogin}
    >
      <div
        className="relative w-full max-w-md overflow-hidden rounded-[26px] bg-white p-8 shadow-[0_30px_80px_rgba(0,0,0,0.25)] md:p-10"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={closeLogin}
          aria-label={t('close')}
          className="absolute right-5 top-5 flex h-8 w-8 items-center justify-center rounded-full text-ink-3 transition-colors hover:bg-black/[0.05] hover:text-ink"
        >
          <X size={18} strokeWidth={1.8} />
        </button>

        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-ink text-white">
          <Lock size={20} strokeWidth={1.6} />
        </div>
        <h2 className="mt-5 font-sans text-[26px] font-medium leading-tight tracking-tight">
          {t('title')}
        </h2>
        <p className="mt-2 text-[14px] font-light leading-relaxed text-ink">
          {tab === 'asesor' ? t('descAsesor') : t('descBroker')}
        </p>

        <SlidingTabs
          className="mt-6"
          activeIndex={tab === 'asesor' ? 0 : 1}
          onChange={(i) => setTab(i === 0 ? 'asesor' : 'broker')}
          items={[
            { key: 'asesor', label: t('tabAsesor') },
            { key: 'broker', label: t('tabBroker') },
          ]}
        />

        <form onSubmit={submit} className="mt-6 grid gap-4">
          <label className="field">
            <span className="field-label">{t('email')}</span>
            <input
              type="email"
              autoComplete="username"
              className="field-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tu@correo.com"
              required
            />
          </label>
          <label className="field">
            <span className="field-label">{t('password')}</span>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                className="field-input pr-10"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                aria-label={showPassword ? t('hidePassword') : t('showPassword')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-3 transition-colors hover:text-ink"
              >
                {showPassword ? <EyeOff size={17} strokeWidth={1.6} /> : <Eye size={17} strokeWidth={1.6} />}
              </button>
            </div>
          </label>

          {err && (
            <div className="rounded-xl bg-red-50 px-3.5 py-2.5 text-[13px] text-red-700">
              {err}
              {tab === 'broker' && needsVerification && (
                <>
                  {' '}
                  <Link href="/brokers" onClick={closeLogin} className="font-semibold underline">
                    {t('verifyAccountLink')}
                  </Link>
                </>
              )}
            </div>
          )}

          <button
            type="submit"
            disabled={loading || !email || !password}
            className="btn btn-lg mt-2 w-full border-0 bg-accent font-bold text-ink transition-all hover:brightness-95 disabled:opacity-40"
          >
            {loading ? t('verifying') : t('submit')}
            <ArrowRight size={15} strokeWidth={1.8} />
          </button>

          {tab === 'broker' && (
            <div className="mt-1 flex items-center justify-between text-[12px]">
              <Link href="/brokers?mode=forgot" onClick={closeLogin} className="text-ink-3 underline">
                {t('forgotPassword')}
              </Link>
              <Link href="/brokers" onClick={closeLogin} className="font-semibold text-ink underline">
                {t('noAccount')}
              </Link>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
