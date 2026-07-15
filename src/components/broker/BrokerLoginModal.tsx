'use client';

import { useEffect, useState } from 'react';
import { Lock, X, ArrowRight, Eye, EyeOff } from 'lucide-react';
import { Link } from '@/navigation';
import { useBroker } from '@/components/broker/context';

export default function BrokerLoginModal() {
  const { loginOpen, closeLogin, login } = useBroker();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [needsVerification, setNeedsVerification] = useState(false);

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

  useEffect(() => {
    if (!loginOpen) {
      setErr(null);
      setPassword('');
      setLoading(false);
      setNeedsVerification(false);
    }
  }, [loginOpen]);

  if (!loginOpen) return null;

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    setNeedsVerification(false);
    setLoading(true);
    const result = await login(email, password);
    if (result) {
      setErr(result.error);
      setNeedsVerification(Boolean(result.needsVerification));
      setLoading(false);
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
          aria-label="Cerrar"
          className="absolute right-5 top-5 flex h-8 w-8 items-center justify-center rounded-full text-ink-3 transition-colors hover:bg-black/[0.05] hover:text-ink"
        >
          <X size={18} strokeWidth={1.8} />
        </button>

        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-ink text-white">
          <Lock size={20} strokeWidth={1.6} />
        </div>
        <h2 className="mt-5 font-sans text-[26px] font-medium leading-tight tracking-tight">
          Acceso Brokers
        </h2>
        <p className="mt-2 text-[14px] font-light leading-relaxed text-ink">
          Inicia sesión para ver los materiales de venta de los desarrollos inmobiliarios.
        </p>

        <form onSubmit={submit} className="mt-7 grid gap-4">
          <label className="field">
            <span className="field-label">Correo</span>
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
            <span className="field-label">Contraseña</span>
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
                aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-3 transition-colors hover:text-ink"
              >
                {showPassword ? <EyeOff size={17} strokeWidth={1.6} /> : <Eye size={17} strokeWidth={1.6} />}
              </button>
            </div>
          </label>

          {err && (
            <div className="rounded-xl bg-red-50 px-3.5 py-2.5 text-[13px] text-red-700">
              {err}
              {needsVerification && (
                <>
                  {' '}
                  <Link href="/brokers" onClick={closeLogin} className="font-semibold underline">
                    Verifica tu cuenta aquí.
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
            {loading ? 'Verificando…' : 'Iniciar sesión'}
            <ArrowRight size={15} strokeWidth={1.8} />
          </button>

          <div className="mt-1 flex items-center justify-between text-[12px]">
            <Link href="/brokers?mode=forgot" onClick={closeLogin} className="text-ink-3 underline">
              ¿Olvidaste tu contraseña?
            </Link>
            <Link href="/brokers" onClick={closeLogin} className="font-semibold text-ink underline">
              ¿No tienes cuenta? Regístrate
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
