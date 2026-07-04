'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';

// Secuencia en loop A → B → C → A… Cada clip reproduce completo hasta su
// final natural; el corte al siguiente es duro (sin fade, sin overlap). El
// siguiente clip ya está precargado en el otro <video> para que el corte
// sea instantáneo, sin espera de carga entre clips.
const SEQUENCE = ['/herovideo/A.mp4', '/herovideo/B.mp4', '/herovideo/C.mp4'];

export default function HeroVideoSequence() {
  const ref0 = useRef<HTMLVideoElement>(null);
  const ref1 = useRef<HTMLVideoElement>(null);
  const refs = [ref0, ref1] as const;

  const [activeSlot, setActiveSlot] = useState<0 | 1>(0);
  const [ready, setReady] = useState(false);
  const seqIndex = useRef(0); // índice del clip actualmente activo

  useEffect(() => {
    const active = refs[0].current;
    const next = refs[1].current;
    if (!active || !next) return;

    // En un refresh en frío (sobre todo mobile / red lenta) el video aún no
    // tiene suficiente data cuando llamamos .play() justo después de
    // .load() — la promesa falla silenciosa y el video nunca arranca (se
    // queda solo la foto de respaldo). Reintenta en cuanto el propio video
    // avisa que ya puede reproducirse, en vez de asumir que .play() gana la
    // carrera contra la descarga.
    const tryPlay = (video: HTMLVideoElement) => {
      const attempt = () => video.play().catch(() => {});
      if (video.readyState >= 2) attempt();
      else video.addEventListener('canplay', attempt, { once: true });
    };

    active.src = SEQUENCE[0];
    active.load();
    tryPlay(active);
    next.src = SEQUENCE[1];
    next.load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleEnded(slot: 0 | 1) {
    if (slot !== activeSlot) return; // el slot en espera no dispara nada
    const other = slot === 0 ? 1 : 0;
    const nextVideo = refs[other].current;
    if (nextVideo) {
      nextVideo.currentTime = 0;
      nextVideo.play().catch(() => {});
    }
    setActiveSlot(other); // corte instantáneo, sin fade ni overlap

    // Recicla el clip que acaba de terminar: precarga el que sigue después del próximo.
    seqIndex.current = (seqIndex.current + 1) % SEQUENCE.length;
    const upcoming = (seqIndex.current + 1) % SEQUENCE.length;
    const finished = refs[slot].current;
    if (finished) {
      finished.pause();
      finished.src = SEQUENCE[upcoming];
      finished.load();
    }
  }

  return (
    // Único nivel de opacidad (0.7) para todo el bloque foto+video — evita
    // sumar transparencias entre capas (doble exposición).
    <div className="absolute inset-0 opacity-70">
      {/* Foto de respaldo: visible de inmediato, nunca bloquea el primer
          render mientras el video carga (o si falla). */}
      <Image
        src="/renders/long-island/WEB.jpg"
        alt="Tresor Real Estate — Riviera Maya"
        fill
        priority
        sizes="100vw"
        className="object-cover"
      />
      {/* El video, opaco a 100% dentro de este bloque, tapa la foto por
          completo una vez listo. Sin transición: durante el fade la mezcla
          foto+video cambia de brillo y el backdrop-blur de los botones
          glass lo reflejaba como un salto — mejor un corte instantáneo. */}
      <div className="absolute inset-0" style={{ opacity: ready ? 1 : 0 }}>
        {([0, 1] as const).map((slot) => (
          <video
            key={slot}
            ref={refs[slot]}
            muted
            playsInline
            preload="auto"
            onEnded={() => handleEnded(slot)}
            onPlaying={() => slot === 0 && setReady(true)}
            className="absolute inset-0 h-full w-full object-cover"
            style={{ opacity: activeSlot === slot ? 1 : 0 }}
          />
        ))}
      </div>
    </div>
  );
}
