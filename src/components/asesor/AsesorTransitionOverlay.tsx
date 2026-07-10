'use client';

import { Loader2 } from 'lucide-react';

// Feedback visual breve mientras router.refresh() vuelve a traer los Server
// Components de la página con la sesión ya actualizada (login/logout de
// asesor). Sin esto el cambio se sentía "silencioso" — el usuario no sabía
// si de verdad pasó algo hasta ver el resultado final.
export default function AsesorTransitionOverlay({ show }: { show: boolean }) {
  if (!show) return null;
  return (
    <div
      aria-hidden
      className="fixed inset-0 z-[95] flex items-center justify-center bg-white/40 backdrop-blur-sm transition-opacity"
    >
      <div className="flex items-center gap-3 rounded-full bg-ink px-5 py-3 text-white shadow-[0_12px_40px_rgba(0,0,0,0.25)]">
        <Loader2 size={16} strokeWidth={2} className="animate-spin" />
        <span className="text-[12px] font-bold uppercase tracking-[0.14em]">Actualizando…</span>
      </div>
    </div>
  );
}
