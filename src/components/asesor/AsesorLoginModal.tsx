'use client';

import { useEffect, useState } from 'react';
import { Lock, X, ArrowRight } from 'lucide-react';
import { useAsesor } from '@/components/asesor/context';

export default function AsesorLoginModal() {
  const { loginOpen, closeLogin, login } = useAsesor();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

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
    }
  }, [loginOpen]);

  if (!loginOpen) return null;

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    setLoading(true);
    const ok = await login(email, password);
    if (!ok) {
      setErr('Correo o contraseña incorrectos.');
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
          Acceso Asesores
        </h2>
        <p className="mt-2 text-[14px] font-light leading-relaxed text-ink-3">
          Ingresa con tu cuenta de Tresor para activar los Drives de Ventas.
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
              placeholder="hello@tresor.mx"
              required
            />
          </label>
          <label className="field">
            <span className="field-label">Contraseña</span>
            <input
              type="password"
              autoComplete="current-password"
              className="field-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </label>

          {err && (
            <div className="rounded-xl bg-red-50 px-3.5 py-2.5 text-[13px] text-red-700">{err}</div>
          )}

          <button
            type="submit"
            disabled={loading || !email || !password}
            className="btn btn-lg mt-2 w-full border-0 bg-accent font-bold text-ink transition-all hover:brightness-95 disabled:opacity-40"
          >
            {loading ? 'Verificando…' : 'Iniciar sesión'}
            <ArrowRight size={15} strokeWidth={1.8} />
          </button>
        </form>
      </div>
    </div>
  );
}
