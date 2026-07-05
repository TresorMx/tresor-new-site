'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { MapPin, Store } from 'lucide-react';
import { Link } from '@/navigation';
import { formatPrice, type Development } from '@/lib/developments';

const GAP = 20;

// WE DEVELOP = desarrollos donde Tresor es el desarrollador. Recibe los
// datos ya resueltos por prop (el server component los enriquece con el
// precio en vivo del inventario antes de pasarlos aquí).
export default function DevelopmentCarousel({ developments }: { developments: Development[] }) {
  const slides = developments
    .filter((d) => d.logo)
    .map((d) => ({
      id: d.slug,
      tab: d.tab ?? d.name,
      brand: d.brand ?? 'Tresor Real Estate',
      phases: d.phases ?? `${d.city}${d.zone ? ` · ${d.zone}` : ''}`,
      logo: d.logo as string,
      badge: d.badge ?? d.status,
      title: d.name,
      price: d.priceLabel ?? formatPrice(d) ?? '',
      desc: d.description ?? '',
      image: d.image,
      href: d.href,
      comingSoon: d.comingSoon ?? false,
      cta: d.comingSoon ? 'Muy pronto' : 'Ver desarrollo',
    }));

  const [active, setActive] = useState(0);
  const [cardWidth, setCardWidth] = useState(0);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // ── Indicador deslizante de los tabs (pill blanco que se mueve al activo) ──
  const tabsRef = useRef<(HTMLButtonElement | null)[]>([]);
  const [indicator, setIndicator] = useState({ left: 0, width: 0 });

  useEffect(() => {
    function measure() {
      const el = tabsRef.current[active];
      if (el) setIndicator({ left: el.offsetLeft, width: el.offsetWidth });
    }
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, [active]);

  const updateSize = useCallback(() => {
    if (wrapperRef.current) {
      // wrapper ahora es full-bleed (≈100vw); calculamos la card sobre el ancho
      // de contenido (restando el gutter). En móvil la card es más ancha (apilada).
      const w = wrapperRef.current.offsetWidth;
      const isMobile = w < 768;
      const gutter = Math.max(isMobile ? 16 : 24, w * 0.05);
      const frac = isMobile ? 0.88 : 0.74;
      setCardWidth(Math.min(820, (w - gutter * 2) * frac));
    }
  }, []);

  useEffect(() => {
    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, [updateSize]);

  const trackOffset =
    cardWidth > 0
      ? (wrapperRef.current!.offsetWidth - cardWidth) / 2 - active * (cardWidth + GAP)
      : 0;

  // ── Swipe táctil (móvil) + arrastre con mouse/trackpad (desktop) ──
  const [drag, setDrag] = useState(0);
  const [dragging, setDragging] = useState(false);
  const startX = useRef(0);
  const startY = useRef(0);
  const dragRef = useRef(0);
  const axis = useRef<'x' | 'y' | null>(null);

  function dragStart(x: number, y: number) {
    startX.current = x;
    startY.current = y;
    dragRef.current = 0;
    axis.current = null;
    setDragging(true);
  }
  function dragMove(x: number, y: number) {
    const dx = x - startX.current;
    const dy = y - startY.current;
    // Decide el eje en el primer movimiento significativo: si es vertical,
    // dejamos que la página haga scroll y no arrastramos la card.
    if (axis.current === null && (Math.abs(dx) > 8 || Math.abs(dy) > 8)) {
      axis.current = Math.abs(dx) > Math.abs(dy) ? 'x' : 'y';
    }
    if (axis.current === 'x') {
      dragRef.current = dx;
      setDrag(dx);
    }
  }
  function dragEnd() {
    setDragging(false);
    const d = dragRef.current;
    const threshold = Math.max(40, cardWidth * 0.18);
    setActive((a) => {
      if (d < -threshold && a < slides.length - 1) return a + 1;
      if (d > threshold && a > 0) return a - 1;
      return a;
    });
    dragRef.current = 0;
    setDrag(0);
  }

  function onTouchStart(e: React.TouchEvent) {
    dragStart(e.touches[0].clientX, e.touches[0].clientY);
  }
  function onTouchMove(e: React.TouchEvent) {
    dragMove(e.touches[0].clientX, e.touches[0].clientY);
  }
  function onTouchEnd() {
    dragEnd();
  }

  // Click y arrastra con el mouse. Escucha en window (no solo en el track)
  // para no perder el gesto si el cursor sale del área mientras arrastra.
  function onMouseDown(e: React.MouseEvent) {
    if (e.button !== 0) return;
    dragStart(e.clientX, e.clientY);
    const handleMove = (ev: MouseEvent) => dragMove(ev.clientX, ev.clientY);
    const handleUp = () => {
      dragEnd();
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('mouseup', handleUp);
    };
    window.addEventListener('mousemove', handleMove);
    window.addEventListener('mouseup', handleUp);
  }

  // Gesto de dos dedos en trackpad (Mac): el navegador lo entrega como wheel
  // con deltaX horizontal. Solo se activa si el gesto es predominantemente
  // horizontal, para no robarle el scroll vertical de la página.
  const wheelAccum = useRef(0);
  const wheelTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  function onWheel(e: React.WheelEvent) {
    if (Math.abs(e.deltaX) <= Math.abs(e.deltaY)) return;
    e.preventDefault();
    wheelAccum.current += e.deltaX;
    if (wheelTimeout.current) clearTimeout(wheelTimeout.current);
    const threshold = Math.max(40, cardWidth * 0.18);
    if (Math.abs(wheelAccum.current) > threshold) {
      const dir = wheelAccum.current > 0 ? 1 : -1;
      setActive((a) => Math.min(slides.length - 1, Math.max(0, a + dir)));
      wheelAccum.current = 0;
      return;
    }
    // Si el gesto se detiene sin cruzar el umbral, reinicia el acumulador.
    wheelTimeout.current = setTimeout(() => {
      wheelAccum.current = 0;
    }, 200);
  }

  return (
    <div>
      {/* ── Tabs con indicador deslizante ── */}
      <div className="mb-10 flex justify-center">
        <div className="relative flex gap-1 rounded-full bg-ink/[0.06] p-1">
          {/* Pill blanco que se desliza al tab activo */}
          <span
            aria-hidden
            className="absolute bottom-1 top-1 rounded-full bg-white shadow-sm transition-all duration-[450ms] ease-[cubic-bezier(0.76,0,0.24,1)]"
            style={{ left: indicator.left, width: indicator.width }}
          />
          {slides.map((s, i) => (
            <button
              key={s.id}
              ref={(el) => {
                tabsRef.current[i] = el;
              }}
              onClick={() => setActive(i)}
              className={`relative z-10 rounded-full px-6 py-2.5 text-[11px] font-bold uppercase tracking-[0.2em] transition-colors duration-300 ${
                active === i ? 'text-ink' : 'text-ink/40 hover:text-ink'
              }`}
            >
              {s.tab}
            </button>
          ))}
        </div>
      </div>

      {/* ── Track (full-bleed: las cards que asoman tocan el borde de la pantalla) ── */}
      <div
        ref={wrapperRef}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        onMouseDown={onMouseDown}
        onWheel={onWheel}
        className={`relative left-1/2 right-1/2 -mx-[50vw] w-screen touch-pan-y overflow-hidden select-none ${
          dragging ? 'cursor-grabbing' : 'cursor-grab'
        }`}
      >
        <div
          className={`flex ${dragging ? '' : 'transition-transform duration-[850ms] ease-[cubic-bezier(0.76,0,0.24,1)]'}`}
          style={{ gap: `${GAP}px`, transform: `translateX(${trackOffset + drag}px)` }}
        >
          {slides.map((s, i) => (
            <div
              key={s.id}
              style={{ width: cardWidth || 'auto', minWidth: cardWidth || 'auto' }}
              className={`shrink-0 transition-opacity duration-[850ms] ease-[cubic-bezier(0.76,0,0.24,1)] ${
                i === active ? 'opacity-100' : 'opacity-30'
              }`}
            >
              {/* Card: imagen enmarcada (izq) + contenido (der). El padding del card
                  hace de marco; la imagen tiene esquinas redondeadas en los 4 lados. */}
              <div className="grid grid-cols-1 gap-3 rounded-[28px] bg-white p-3 md:grid-cols-[54%_46%]">
                {/* Imagen con marco */}
                <div className="relative min-h-[220px] overflow-hidden rounded-[20px] md:min-h-[420px]">
                  <Image
                    src={s.image}
                    alt={s.tab}
                    fill
                    sizes="480px"
                    className={`object-cover ${s.comingSoon ? 'scale-110 blur-md' : ''}`}
                    priority={i === 0}
                    draggable={false}
                  />
                  {/* Overlay oscuro sobre la foto */}
                  <div className="absolute inset-0 bg-black/40" />
                  {/* Barra superior: badge (izq) + ícono de negocio (der), alineados */}
                  <div className="absolute inset-x-4 top-4 z-10 flex items-center">
                    {s.badge && (
                      <span className="rounded-full bg-white/10 px-4 py-2 text-[10px] font-bold uppercase tracking-[0.2em] text-white backdrop-blur-md">
                        {s.badge}
                      </span>
                    )}
                    <Store size={24} strokeWidth={1.6} className="ml-auto text-white" />
                  </div>
                  {/* Logo en blanco, centrado sobre la foto */}
                  <Image
                    src={s.logo}
                    alt={s.tab}
                    width={300}
                    height={88}
                    className="absolute left-1/2 top-1/2 z-10 h-[154px] w-auto -translate-x-1/2 -translate-y-1/2"
                    draggable={false}
                  />
                </div>

                {/* Contenido */}
                <div className="flex flex-col px-5 py-6 md:py-7 md:pl-5 md:pr-8">
                  <div className="flex items-center justify-between gap-3 text-[9px] font-bold uppercase tracking-[0.12em] text-ink-3/60">
                    <span className="whitespace-nowrap">{s.brand}</span>
                    <span className="flex items-center gap-1 whitespace-nowrap">
                      <MapPin size={11} strokeWidth={2} style={{ display: 'inline' }} />
                      {s.phases}
                    </span>
                  </div>

                  <div className="mt-6 md:mt-auto">
                    <h3 className="font-sans text-[clamp(18px,1.8vw,28px)] font-medium leading-[1.15] text-ink md:whitespace-nowrap">
                      {s.title}
                    </h3>
                    <span className="eyebrow eyebrow-accent mt-1 block font-bold">
                      {s.comingSoon ? (
                        <>
                          Desde{' '}
                          <span className="select-none blur-[3px]">
                            {s.price.replace(/^Desde\s*/i, '')}
                          </span>
                        </>
                      ) : (
                        s.price
                      )}
                    </span>
                    <p className="mt-2 text-[13px] font-light leading-relaxed text-ink-2">
                      {s.desc}
                    </p>
                    <div className="pt-5">
                      {s.comingSoon ? (
                        <span
                          aria-disabled="true"
                          className="inline-flex cursor-not-allowed items-center gap-2.5 rounded-full bg-ink/[0.08] px-6 py-3 text-[11px] font-bold uppercase tracking-[0.2em] text-ink/40"
                        >
                          {s.cta}
                        </span>
                      ) : (
                        <Link
                          href={s.href}
                          className="inline-flex items-center gap-2.5 rounded-full bg-accent px-6 py-3 text-[11px] font-bold uppercase tracking-[0.2em] text-ink transition-all hover:brightness-95"
                        >
                          {s.cta}
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
