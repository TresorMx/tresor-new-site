'use client';

import { useEffect } from 'react';
import { X, ExternalLink } from 'lucide-react';

interface VirtualTourModalProps {
  url: string | null; // null = cerrado
  onClose: () => void;
  title?: string;
}

// Incrusta el tour virtual (germanlomeli.com no bloquea iframes — sin
// X-Frame-Options ni frame-ancestors, verificado). Escape hatch "abrir en
// pestaña nueva" por si algún tour puntual sí bloquea el embed en runtime.
export default function VirtualTourModal({ url, onClose, title }: VirtualTourModalProps) {
  useEffect(() => {
    if (!url) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    document.addEventListener('keydown', onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [url, onClose]);

  if (!url) return null;

  return (
    <div
      className="fixed inset-0 z-[80] flex items-center justify-center bg-black/80 p-3 backdrop-blur-sm md:p-6"
      onClick={onClose}
    >
      <div
        className="relative flex h-full w-full max-w-6xl flex-col overflow-hidden rounded-2xl bg-black shadow-2xl md:h-[88vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-white/10 bg-ink px-5 py-3">
          <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-white/70">
            {title ?? 'Tour virtual'}
          </span>
          <div className="flex items-center gap-1">
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Abrir en pestaña nueva"
              className="flex h-8 w-8 items-center justify-center rounded-full text-white/60 transition-colors hover:bg-white/10 hover:text-white"
            >
              <ExternalLink size={15} strokeWidth={1.8} />
            </a>
            <button
              onClick={onClose}
              aria-label="Cerrar"
              className="flex h-8 w-8 items-center justify-center rounded-full text-white/60 transition-colors hover:bg-white/10 hover:text-white"
            >
              <X size={17} strokeWidth={1.8} />
            </button>
          </div>
        </div>
        <iframe
          src={url}
          title={title ?? 'Tour virtual'}
          className="h-full w-full flex-1 border-0"
          allow="fullscreen; xr-spatial-tracking; gyroscope; accelerometer"
          allowFullScreen
        />
      </div>
    </div>
  );
}
