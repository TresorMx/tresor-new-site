'use client';

import { useState } from 'react';
import { Lock, ArrowRight, Eye, EyeOff } from 'lucide-react';

type Mode = 'register' | 'verify' | 'login' | 'forgot' | 'reset';

export default function BrokerAuthForm({ initialMode = 'register' }: { initialMode?: Mode }) {
  const [mode, setMode] = useState<Mode>(initialMode);
  const [email, setEmail] = useState('');

  return (
    <main className="min-h-screen bg-bg-soft pt-24 pb-24">
      <section className="container-wrap grid items-center gap-16 pt-4 pb-16 md:grid-cols-[1fr_1.2fr]">
        <div>
          <span className="eyebrow eyebrow-accent">— Acceso Broker</span>
          <h1 className="mt-4 h-display text-[clamp(36px,5vw,64px)] text-ink">
            Comercializa <span className="text-ink-3">nuestros desarrollos</span>
          </h1>
          <p className="mt-5 max-w-md text-[15px] leading-relaxed text-ink-3">
            Toda la información comercial que necesitas para vender los desarrollos más
            exclusivos de Cancún y Riviera Maya: presentaciones, listas de precios, master
            plans, cuentas bancarias, materiales de marketing y formatos administrativos.
          </p>
        </div>

        {mode === 'register' && (
          <RegisterForm
            onRegistered={(registeredEmail) => { setEmail(registeredEmail); setMode('verify'); }}
            onSwitchToLogin={() => setMode('login')}
          />
        )}
        {mode === 'verify' && (
          <VerifyForm email={email} onBack={() => setMode('register')} />
        )}
        {mode === 'login' && (
          <LoginForm
            onNeedsVerification={(loginEmail) => { setEmail(loginEmail); setMode('verify'); }}
            onSwitchToRegister={() => setMode('register')}
            onForgotPassword={() => setMode('forgot')}
          />
        )}
        {mode === 'forgot' && (
          <ForgotPasswordForm
            onCodeSent={(sentEmail) => { setEmail(sentEmail); setMode('reset'); }}
            onBack={() => setMode('login')}
          />
        )}
        {mode === 'reset' && (
          <ResetPasswordForm email={email} onBack={() => setMode('forgot')} />
        )}
      </section>
    </main>
  );
}

/* Encabezado compartido por cada card — mismo lenguaje que
   CommercialLoginModal (font-sans, sin serif/itálica: ese estilo era del
   /brokers viejo, anterior al sistema de tipografía actual del sitio). */
function CardHeading({ title, subtitle }: { title: string; subtitle: React.ReactNode }) {
  return (
    <div className="mb-7 flex items-center gap-3">
      <div className="flex h-11 w-11 items-center justify-center rounded-full bg-ink text-bg">
        <Lock size={18} strokeWidth={1.6} />
      </div>
      <div>
        <div className="font-sans text-[22px] font-medium leading-tight tracking-tight">{title}</div>
        <div className="text-[12px] text-ink-3">{subtitle}</div>
      </div>
    </div>
  );
}

/* ════════ Registro ════════ */
function RegisterForm({
  onRegistered,
  onSwitchToLogin,
}: {
  onRegistered: (email: string) => void;
  onSwitchToLogin: () => void;
}) {
  const [form, setForm] = useState({ fullName: '', email: '', phone: '', brokerage: '', password: '', confirmPassword: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);

    if (form.password.length < 8) {
      setErr('La contraseña debe tener al menos 8 caracteres.');
      return;
    }
    if (form.password !== form.confirmPassword) {
      setErr('Las contraseñas no coinciden.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/broker/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: form.fullName,
          email: form.email,
          phone: form.phone,
          brokerage: form.brokerage || undefined,
          password: form.password,
        }),
      });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(body.error || 'No pudimos completar tu registro.');
      onRegistered(form.email.trim().toLowerCase());
    } catch (e: any) {
      setErr(e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={submit} className="rounded-lg bg-white p-10 shadow-sm">
      <CardHeading
        title="Regístrate"
        subtitle={
          <>
            ¿Ya tienes cuenta?{' '}
            <button type="button" onClick={onSwitchToLogin} className="font-semibold text-ink underline">
              Inicia sesión
            </button>
          </>
        }
      />

      <div className="grid gap-5">
        <label className="field">
          <span className="field-label">Nombre completo *</span>
          <input required type="text" className="field-input" value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} placeholder="Tu nombre completo" />
        </label>
        <label className="field">
          <span className="field-label">Email *</span>
          <input required type="email" autoComplete="username" className="field-input" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="tu@correo.com" />
        </label>
        <label className="field">
          <span className="field-label">Teléfono *</span>
          <input required type="tel" className="field-input" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="+52 998 404 5602" />
        </label>
        <label className="field">
          <span className="field-label">Inmobiliaria</span>
          <input type="text" className="field-input" value={form.brokerage} onChange={(e) => setForm({ ...form, brokerage: e.target.value })} placeholder="Opcional" />
        </label>
        <label className="field">
          <span className="field-label">Contraseña *</span>
          <div className="relative">
            <input
              required
              type={showPassword ? 'text' : 'password'}
              autoComplete="new-password"
              className="field-input pr-10"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              placeholder="Mínimo 8 caracteres"
            />
            <button type="button" onClick={() => setShowPassword((v) => !v)} aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'} className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-3 transition-colors hover:text-ink">
              {showPassword ? <EyeOff size={17} strokeWidth={1.6} /> : <Eye size={17} strokeWidth={1.6} />}
            </button>
          </div>
        </label>
        <label className="field">
          <span className="field-label">Confirmar contraseña *</span>
          <input required type={showPassword ? 'text' : 'password'} autoComplete="new-password" className="field-input" value={form.confirmPassword} onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })} placeholder="Repite tu contraseña" />
        </label>
      </div>

      {err && <div className="mt-4 rounded bg-red-50 px-3 py-2 text-[12px] text-red-700">{err}</div>}

      <button
        type="submit"
        disabled={loading || !form.fullName || !form.email || !form.phone || !form.password || !form.confirmPassword}
        className="btn btn-lg mt-8 w-full font-bold disabled:opacity-40"
        style={{ background: '#0E0E0E', color: '#fff' }}
      >
        {loading ? 'Creando cuenta…' : 'Crear cuenta'} <ArrowRight size={14} strokeWidth={1.6} />
      </button>
    </form>
  );
}

/* ════════ Verificación ════════ */
function VerifyForm({ email, onBack }: { email: string; onBack: () => void }) {
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    setLoading(true);
    try {
      const res = await fetch('/api/broker/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code }),
      });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(body.error || 'Código inválido.');
      // Navegación completa: garantiza que el layout raíz vuelva a leer la
      // cookie recién puesta (el estado de "Brokers" en el header depende de
      // eso) — mismo motivo por el que AsesorProvider usa router.refresh()
      // tras un login, aquí además cambiamos de ruta.
      window.location.assign('/brokers/drive');
    } catch (e: any) {
      setErr(e.message);
      setLoading(false);
    }
  }

  async function resend() {
    setErr(null);
    setNotice(null);
    setResending(true);
    try {
      await fetch('/api/broker/resend-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      setNotice('Te reenviamos el código.');
    } finally {
      setResending(false);
    }
  }

  return (
    <form onSubmit={submit} className="rounded-lg bg-white p-10 shadow-sm">
      <CardHeading title="Verifica tu correo" subtitle={`Enviamos un código a ${email}`} />

      <label className="field">
        <span className="field-label">Código de verificación *</span>
        <input
          required
          type="text"
          inputMode="numeric"
          maxLength={6}
          className="field-input text-center text-[20px] tracking-[0.4em]"
          value={code}
          onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
          placeholder="000000"
        />
      </label>

      {err && <div className="mt-4 rounded bg-red-50 px-3 py-2 text-[12px] text-red-700">{err}</div>}
      {notice && <div className="mt-4 rounded bg-emerald-50 px-3 py-2 text-[12px] text-emerald-700">{notice}</div>}

      <button
        type="submit"
        disabled={loading || code.length < 6}
        className="btn btn-lg mt-8 w-full font-bold disabled:opacity-40"
        style={{ background: '#0E0E0E', color: '#fff' }}
      >
        {loading ? 'Verificando…' : 'Verificar'} <ArrowRight size={14} strokeWidth={1.6} />
      </button>

      <div className="mt-5 flex items-center justify-between text-[12px]">
        <button type="button" onClick={onBack} className="text-ink-3 underline">Volver</button>
        <button type="button" onClick={resend} disabled={resending} className="font-semibold text-ink underline disabled:opacity-40">
          {resending ? 'Enviando…' : 'Reenviar código'}
        </button>
      </div>
    </form>
  );
}

/* ════════ Login ════════ */
function LoginForm({
  onNeedsVerification,
  onSwitchToRegister,
  onForgotPassword,
}: {
  onNeedsVerification: (email: string) => void;
  onSwitchToRegister: () => void;
  onForgotPassword: () => void;
}) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    setLoading(true);
    try {
      const res = await fetch('/api/broker/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) {
        if (body.needsVerification) {
          onNeedsVerification(email.trim().toLowerCase());
          return;
        }
        throw new Error(body.error || 'Correo o contraseña incorrectos.');
      }
      window.location.assign('/brokers/drive');
    } catch (e: any) {
      setErr(e.message);
      setLoading(false);
    }
  }

  return (
    <form onSubmit={submit} className="rounded-lg bg-white p-10 shadow-sm">
      <CardHeading
        title="Inicia sesión"
        subtitle={
          <>
            ¿Aún no tienes cuenta?{' '}
            <button type="button" onClick={onSwitchToRegister} className="font-semibold text-ink underline">
              Regístrate
            </button>
          </>
        }
      />

      <div className="grid gap-5">
        <label className="field">
          <span className="field-label">Email *</span>
          <input required type="email" autoComplete="username" className="field-input" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="tu@correo.com" />
        </label>
        <label className="field">
          <span className="field-label">Contraseña *</span>
          <div className="relative">
            <input
              required
              type={showPassword ? 'text' : 'password'}
              autoComplete="current-password"
              className="field-input pr-10"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />
            <button type="button" onClick={() => setShowPassword((v) => !v)} aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'} className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-3 transition-colors hover:text-ink">
              {showPassword ? <EyeOff size={17} strokeWidth={1.6} /> : <Eye size={17} strokeWidth={1.6} />}
            </button>
          </div>
        </label>
      </div>

      {err && <div className="mt-4 rounded bg-red-50 px-3 py-2 text-[12px] text-red-700">{err}</div>}

      <button
        type="submit"
        disabled={loading || !email || !password}
        className="btn btn-lg mt-8 w-full font-bold disabled:opacity-40"
        style={{ background: '#0E0E0E', color: '#fff' }}
      >
        {loading ? 'Verificando…' : 'Iniciar sesión'} <ArrowRight size={14} strokeWidth={1.6} />
      </button>

      <div className="mt-5 text-center text-[12px]">
        <button type="button" onClick={onForgotPassword} className="text-ink-3 underline">
          ¿Olvidaste tu contraseña?
        </button>
      </div>
    </form>
  );
}

/* ════════ Olvidé mi contraseña ════════ */
function ForgotPasswordForm({
  onCodeSent,
  onBack,
}: {
  onCodeSent: (email: string) => void;
  onBack: () => void;
}) {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    setLoading(true);
    try {
      const res = await fetch('/api/broker/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      if (!res.ok) throw new Error('No pudimos procesar tu solicitud.');
      onCodeSent(email.trim().toLowerCase());
    } catch (e: any) {
      setErr(e.message);
      setLoading(false);
    }
  }

  return (
    <form onSubmit={submit} className="rounded-lg bg-white p-10 shadow-sm">
      <CardHeading title="Olvidé mi contraseña" subtitle="Te mandamos un código para crear una nueva." />

      <label className="field">
        <span className="field-label">Email *</span>
        <input required type="email" autoComplete="username" className="field-input" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="tu@correo.com" />
      </label>

      {err && <div className="mt-4 rounded bg-red-50 px-3 py-2 text-[12px] text-red-700">{err}</div>}

      <button
        type="submit"
        disabled={loading || !email}
        className="btn btn-lg mt-8 w-full font-bold disabled:opacity-40"
        style={{ background: '#0E0E0E', color: '#fff' }}
      >
        {loading ? 'Enviando…' : 'Enviar código'} <ArrowRight size={14} strokeWidth={1.6} />
      </button>

      <div className="mt-5 text-center text-[12px]">
        <button type="button" onClick={onBack} className="text-ink-3 underline">Volver a inicio de sesión</button>
      </div>
    </form>
  );
}

/* ════════ Nueva contraseña ════════ */
function ResetPasswordForm({ email, onBack }: { email: string; onBack: () => void }) {
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);

    if (newPassword.length < 8) {
      setErr('La contraseña debe tener al menos 8 caracteres.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setErr('Las contraseñas no coinciden.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/broker/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code, newPassword }),
      });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(body.error || 'Código inválido.');
      window.location.assign('/brokers/drive');
    } catch (e: any) {
      setErr(e.message);
      setLoading(false);
    }
  }

  async function resend() {
    setErr(null);
    setNotice(null);
    setResending(true);
    try {
      await fetch('/api/broker/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      setNotice('Te reenviamos el código.');
    } finally {
      setResending(false);
    }
  }

  return (
    <form onSubmit={submit} className="rounded-lg bg-white p-10 shadow-sm">
      <CardHeading title="Crea tu nueva contraseña" subtitle={`Enviamos un código a ${email}`} />

      <div className="grid gap-5">
        <label className="field">
          <span className="field-label">Código de verificación *</span>
          <input
            required
            type="text"
            inputMode="numeric"
            maxLength={6}
            className="field-input text-center text-[20px] tracking-[0.4em]"
            value={code}
            onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
            placeholder="000000"
          />
        </label>
        <label className="field">
          <span className="field-label">Nueva contraseña *</span>
          <div className="relative">
            <input
              required
              type={showPassword ? 'text' : 'password'}
              autoComplete="new-password"
              className="field-input pr-10"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Mínimo 8 caracteres"
            />
            <button type="button" onClick={() => setShowPassword((v) => !v)} aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'} className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-3 transition-colors hover:text-ink">
              {showPassword ? <EyeOff size={17} strokeWidth={1.6} /> : <Eye size={17} strokeWidth={1.6} />}
            </button>
          </div>
        </label>
        <label className="field">
          <span className="field-label">Confirmar contraseña *</span>
          <input required type={showPassword ? 'text' : 'password'} autoComplete="new-password" className="field-input" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Repite tu contraseña" />
        </label>
      </div>

      {err && <div className="mt-4 rounded bg-red-50 px-3 py-2 text-[12px] text-red-700">{err}</div>}
      {notice && <div className="mt-4 rounded bg-emerald-50 px-3 py-2 text-[12px] text-emerald-700">{notice}</div>}

      <button
        type="submit"
        disabled={loading || code.length < 6 || !newPassword || !confirmPassword}
        className="btn btn-lg mt-8 w-full font-bold disabled:opacity-40"
        style={{ background: '#0E0E0E', color: '#fff' }}
      >
        {loading ? 'Guardando…' : 'Guardar y entrar'} <ArrowRight size={14} strokeWidth={1.6} />
      </button>

      <div className="mt-5 flex items-center justify-between text-[12px]">
        <button type="button" onClick={onBack} className="text-ink-3 underline">Volver</button>
        <button type="button" onClick={resend} disabled={resending} className="font-semibold text-ink underline disabled:opacity-40">
          {resending ? 'Enviando…' : 'Reenviar código'}
        </button>
      </div>
    </form>
  );
}
