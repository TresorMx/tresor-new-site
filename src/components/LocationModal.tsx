'use client';

import { useEffect } from 'react';
import { X, ExternalLink } from 'lucide-react';
import LocationMap from '@/components/LocationMap';

// Mismo chrome que VirtualTourModal (barra oscura, cerrar + abrir en pestaña
// nueva) pero envolviendo el mapa blanco editorial (LocationMap) en vez de
// un iframe — para "Cómo llegar" en vez de mandar a Google Maps de golpe.
export default function LocationModal({
  open, onClose, lat, lng, address, title,
}: {
  open: boolean;
  onClose: () => void;
  lat: number;
  lng: number;
  address: string;
  title?: string;
}) {
  useEffect(() => {
    if (!open) return;
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
  }, [open, onClose]);

  if (!open) return null;

  const externalUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;

  return (
    <div
      className="fixed inset-0 z-[80] flex items-center justify-center bg-black/80 p-3 backdrop-blur-sm md:p-6"
      onClick={onClose}
    >
      <div
        className="relative flex w-full max-w-2xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-white/10 bg-ink px-5 py-3">
          <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-white/70">
            {title ?? 'Ubicación'}
          </span>
          <div className="flex items-center gap-1">
            <a
              href={externalUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Abrir en Google Maps"
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
        <div className="p-4">
          <LocationMap lat={lat} lng={lng} address={address} />
        </div>
      </div>
    </div>
  );
}
