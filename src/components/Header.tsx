'use client';

import { useEffect, useRef, useState } from 'react';
import { Link } from '@/navigation';
import Image from 'next/image';
import { useLocale } from 'next-intl';
import { usePathname, useRouter } from '@/navigation';
import { ChevronDown, ArrowUpRight, ArrowRight, Building2, LandPlot, Store, MapPin, Phone, Mail, Globe, Lock, LogOut } from 'lucide-react';
import { cn } from '@/lib/utils';
import { getDevelopDevelopments, countByCity, type City } from '@/lib/developments';
import { useAsesor } from '@/components/asesor/context';

const corporate = [
  { href: '/desarrollo', label: 'Desarrollo' },
  { href: '#', label: 'Gestión' },
  { href: '#', label: 'Comercialización' },
];

// Por tipo de propiedad — cada tipo con su ícono (mismo criterio que los cards),
// apunta a su landing real (/departamentos, etc.) para SEO — antes todos
// caían al ancla genérica /#portafolio.
const propertyTypes = [
  { icon: Store, title: 'Locales Comerciales', desc: 'Plazas y locales premium', href: '/locales-comerciales' },
  { icon: Building2, title: 'Departamentos', desc: 'Residencias de 1, 2 y 3 recámaras', href: '/departamentos' },
  { icon: LandPlot, title: 'Lotes Residenciales', desc: 'Terrenos en zonas de plusvalía', href: '/lotes-residenciales' },
];

// Todas las ciudades del portafolio; en el menú solo se muestran las que tienen
// desarrollos activos (countByCity > 0). El slug de ruta de cada una vive en
// CITY_HREF — Puerto Morelos no tiene landing propia todavía (sin desarrollos
// activos), así que countByCity ya la excluye del menú antes de necesitarlo.
const cityList: City[] = ['Cancún', 'Puerto Cancún', 'Puerto Morelos', 'Playa del Carmen', 'Tulum'];
const CITY_HREF: Record<City, string> = {
  'Cancún': '/cancun',
  'Puerto Cancún': '/puerto-cancun',
  'Puerto Morelos': '/puerto-morelos',
  'Playa del Carmen': '/playa-del-carmen',
  'Tulum': '/tulum',
};

// Por desarrollador — mismo orden que aparece en el resto del sitio.
const developerLinks = [
  { name: 'Tresor Real Estate', href: '/tresor' },
  { name: 'Live Desarrollos', href: '/live-desarrollos' },
  { name: 'Onix Living', href: '/onix-living' },
  { name: 'Urban Homes', href: '/urban-homes' },
];

export default function Header({ logoStyle = 'vertical' }: { logoStyle?: 'vertical' | 'horizontal' }) {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const isHome = pathname === '/';
  const { isAsesor, openLogin, logout } = useAsesor();

  const [scrollY, setScrollY] = useState(0);
  const [theme, setTheme] = useState<'dark' | 'light'>(isHome ? 'dark' : 'light');
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  // Acordeón del panel móvil — independiente de `openMenu` (ese es hover-driven
  // para desktop; este es tap-driven). Cuando lleguemos a más items de nav con
  // submenú, cada uno se agrega aquí como una fila de acordeón más — el panel
  // ya está armado para escalar sin rediseñarlo de nuevo.
  const [mobileSection, setMobileSection] = useState<string | null>(null);
  const [hovered, setHovered] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Detecta el fondo (claro/oscuro) de la sección bajo la píldora y adapta el tema.
  // Las secciones se marcan con data-nav="dark" | "light".
  useEffect(() => {
    const sections = Array.from(document.querySelectorAll<HTMLElement>('[data-nav]'));
    if (!sections.length) {
      setTheme('light');
      return;
    }
    const line = 56; // px desde el top — justo bajo la píldora
    const active = new Set<HTMLElement>();
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) active.add(e.target as HTMLElement);
          else active.delete(e.target as HTMLElement);
        });
        if (active.size === 0) {
          // Nada cubre la píldora = estamos sobre el hero fijo → tema por defecto
          setTheme(isHome ? 'dark' : 'light');
          return;
        }
        // La sección más abajo entre las activas es la que está bajo la píldora
        let chosenTop = -Infinity;
        const chosen = Array.from(active).reduce<HTMLElement | null>((best, el) => {
          const top = el.getBoundingClientRect().top;
          if (top > chosenTop) {
            chosenTop = top;
            return el;
          }
          return best;
        }, null);
        setTheme(chosen?.getAttribute('data-nav') === 'dark' ? 'dark' : 'light');
      },
      { rootMargin: `-${line}px 0px -${Math.max(0, window.innerHeight - line - 1)}px 0px`, threshold: 0 },
    );
    sections.forEach((s) => obs.observe(s));
    return () => obs.disconnect();
  }, [pathname, isHome]);

  useEffect(() => {
    setMobileOpen(false);
    setOpenMenu(null);
    setMobileSection(null);
  }, [pathname]);

  const scrolled = scrollY > 8;
  const menuActive = openMenu !== null;
  // Transparente/oscura sobre secciones oscuras; clara sobre secciones claras
  // (o cuando el mega-menú o el panel móvil están abiertos, para contrastar
  // con el panel blanco).
  const dark = theme === 'dark' && !menuActive && !hovered && !mobileOpen;

  function openNow(id: string) {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setOpenMenu(id);
  }
  function scheduleClose() {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setOpenMenu(null), 150);
  }
  function switchLocale(next: 'es' | 'en') {
    if (next === locale) return;
    router.replace(pathname, { locale: next });
  }

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50">
        {/* ─── Barra amarilla superior (nav corporativo) ─── */}
        <div
          className={cn(
            'w-full overflow-hidden bg-accent text-ink transition-[height,opacity,transform] duration-[550ms] ease-[cubic-bezier(0.33,1,0.68,1)] motion-reduce:transition-none',
            scrolled ? 'h-0 -translate-y-1.5 opacity-0' : 'h-9 translate-y-0 opacity-100',
          )}
        >
          <div className="mx-auto flex h-9 max-w-wrap items-center justify-between px-[5vw] text-[10px] font-bold uppercase tracking-[0.2em]">
            {/* Izquierda/Centro: contacto */}
            <div className="flex flex-1 items-center justify-center gap-5 md:flex-none md:justify-start">
              <a href="tel:+529984045602" className="flex items-center gap-1.5 transition-opacity hover:opacity-60">
                <Phone size={11} strokeWidth={2} style={{ display: 'inline' }} />
                <span>+52 998 404 56 02</span>
              </a>
              <a href="mailto:hello@tresor.mx" className="flex items-center gap-1.5 transition-opacity hover:opacity-60">
                <Mail size={11} strokeWidth={2} style={{ display: 'inline', position: 'relative', top: '1px' }} />
                <span style={{ position: 'relative', top: '1px' }}>hello@tresor.mx</span>
              </a>
            </div>
            {/* Derecha: navegación corporativa — solo desktop */}
            <div className="hidden items-center gap-6 md:flex">
              {corporate.map((l) => (
                <Link key={l.label} href={l.href} className="transition-opacity hover:opacity-60">
                  {l.label}
                </Link>
              ))}
              <span className="h-3 w-px bg-ink/25" />
              {/* Asesores — abre el login (o muestra estado + Salir). Brokers
                  queda oculto por lo pronto hasta trabajar esa sección. */}
              {/* `uppercase` explícito en los <button> — Tailwind Preflight
                  resetea `text-transform: none` en botones, así que no
                  heredan el uppercase del contenedor como sí hacen los <a>. */}
              {isAsesor ? (
                <span className="inline-flex items-center gap-3">
                  <span className="inline-flex items-center gap-1.5 uppercase">
                    <span className="h-1.5 w-1.5 rounded-full bg-ink" />
                    Asesor
                  </span>
                  <button onClick={logout} className="inline-flex items-center gap-1 uppercase transition-opacity hover:opacity-60">
                    Salir
                    <LogOut size={12} strokeWidth={2} />
                  </button>
                </span>
              ) : (
                <button onClick={openLogin} className="inline-flex items-center gap-1.5 uppercase transition-opacity hover:opacity-60">
                  Asesores
                  <Lock size={12} strokeWidth={2} />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* ─── Píldora principal ─── */}
        <div
          className="relative px-[max(14px,4vw)] pt-3"
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => { setHovered(false); scheduleClose(); }}
        >
          <div
            className={cn(
              'mx-auto flex max-w-wrap items-center justify-between gap-4 rounded-full py-2.5 pl-5 pr-2.5 backdrop-blur-xl transition-all duration-300 ease-soft',
              dark
                ? 'bg-white/10 text-white'
                : 'bg-white/80 text-ink shadow-[0_10px_40px_rgba(0,0,0,0.10)]',
            )}
          >
            {/* Logo — vertical (actual) u horizontal (el anterior), según
                siteSettings.headerLogoStyle en Sanity. */}
            <Link href="/" aria-label="Tresor Real Estate" className="flex shrink-0 items-center">
              {logoStyle === 'horizontal' ? (
                <Image
                  src={dark ? '/logos/LogoTresor.svg' : '/logos/LogoTresor-ink.svg'}
                  alt="Tresor Real Estate"
                  width={168}
                  height={91}
                  priority
                  className="h-[38px] w-auto"
                />
              ) : (
                <Image
                  src={dark ? '/LogoTresorVerticalWhite.svg' : '/LogoTresorVertical.svg'}
                  alt="Tresor Real Estate"
                  width={175}
                  height={37}
                  priority
                  className="h-[37px] w-auto"
                />
              )}
            </Link>

            {/* Nav — pegada a la derecha, junto al toggle de idioma */}
            <nav className="ml-auto hidden items-center md:flex">
              <button
                onMouseEnter={() => openNow('propiedades')}
                onMouseLeave={scheduleClose}
                onFocus={() => openNow('propiedades')}
                aria-expanded={openMenu === 'propiedades'}
                className={cn(
                  'inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-[11px] font-bold uppercase tracking-[0.2em] transition-colors',
                  openMenu === 'propiedades' ? (dark ? 'bg-white/10' : 'bg-black/[0.04]') : '',
                )}
              >
                Propiedades
                <ChevronDown
                  size={14}
                  strokeWidth={2}
                  className={cn('transition-transform duration-300', openMenu === 'propiedades' && 'rotate-180')}
                />
              </button>
            </nav>

            {/* Derecha */}
            <div className="flex shrink-0 items-center gap-2.5">
              <div
                className={cn(
                  'hidden items-center gap-px rounded-full p-[3px] sm:inline-flex',
                  dark ? 'bg-white/10' : 'bg-black/[0.05]',
                )}
                role="group"
                aria-label="Idioma"
              >
                {(['es', 'en'] as const).map((lng) => (
                  <button
                    key={lng}
                    onClick={() => switchLocale(lng)}
                    aria-pressed={locale === lng}
                    className={cn(
                      'rounded-full px-2.5 py-1 text-[11px] font-bold uppercase tracking-[0.2em] transition-colors',
                      locale === lng
                        ? 'bg-accent text-ink'
                        : dark
                          ? 'text-white/60 hover:text-white'
                          : 'text-ink-3 hover:text-ink',
                    )}
                  >
                    {lng}
                  </button>
                ))}
              </div>

              <Link
                href="/agenda"
                className="hidden rounded-full bg-accent px-5 py-2.5 text-[11px] font-bold uppercase tracking-[0.2em] text-ink transition-all hover:brightness-95 sm:inline-flex"
              >
                Asesoría sin costo
              </Link>

              {/* Hamburguesa móvil */}
              <button
                aria-label="Abrir menú"
                onClick={() => setMobileOpen((v) => !v)}
                className="flex flex-col gap-[5px] p-2 md:hidden"
              >
                <span className={cn('h-px w-5 bg-current transition-transform', mobileOpen && 'translate-y-[6px] rotate-45')} />
                <span className={cn('h-px w-5 bg-current transition-opacity', mobileOpen && 'opacity-0')} />
                <span className={cn('h-px w-5 bg-current transition-transform', mobileOpen && '-translate-y-[6px] -rotate-45')} />
              </button>
            </div>
          </div>

          {/* ─── Mega-menú (desktop) ─── */}
          <div
            className={cn(
              'pointer-events-none absolute inset-x-0 top-full hidden px-[max(14px,4vw)] transition-all duration-300 ease-soft md:block',
              menuActive ? 'translate-y-0 opacity-100' : '-translate-y-2 opacity-0',
            )}
          >
            <div
              className={cn('mx-auto max-w-wrap pt-3', menuActive ? 'pointer-events-auto' : 'pointer-events-none')}
              onMouseEnter={() => openNow(openMenu ?? 'propiedades')}
              onMouseLeave={scheduleClose}
            >
              {openMenu === 'propiedades' && <PropiedadesMenu />}
            </div>
          </div>

          {/* ─── Panel móvil (acordeón) — mismo lenguaje visual que el
              mega-menú desktop (panel blanco flotante, no un takeover negro
              de pantalla completa). Cada item de nav con submenú es una fila
              de acordeón; hoy solo "Propiedades", pero agregar el siguiente
              (ej. "Nosotros", "Desarrollos") es solo otro <MobileAccordionRow>
              más en esta misma lista — el patrón ya escala. ─── */}
          <div
            className={cn(
              'absolute inset-x-0 top-full px-[max(14px,4vw)] transition-all duration-300 ease-soft md:hidden',
              mobileOpen ? 'pointer-events-auto translate-y-0 opacity-100' : 'pointer-events-none -translate-y-2 opacity-0',
            )}
          >
            <div className="mx-auto max-w-wrap pt-3">
              <div className="max-h-[calc(100svh-140px)] overflow-y-auto overscroll-contain rounded-[26px] bg-white text-ink shadow-[0_30px_80px_rgba(0,0,0,0.18)] ring-1 ring-black/[0.04]">
                <MobileAccordionRow
                  label="Propiedades"
                  open={mobileSection === 'propiedades'}
                  onToggle={() => setMobileSection((v) => (v === 'propiedades' ? null : 'propiedades'))}
                >
                  <PropiedadesMenuMobile />
                </MobileAccordionRow>

                {/* Asesores — login (o Salir si ya inició sesión). Brokers oculto por ahora. */}
                {isAsesor ? (
                  <button
                    onClick={() => { logout(); setMobileOpen(false); }}
                    className="flex w-full items-center justify-between border-t border-line px-6 py-5 text-[15px] font-semibold"
                  >
                    Cerrar sesión de asesor
                    <LogOut size={16} strokeWidth={1.8} className="text-ink-3" />
                  </button>
                ) : (
                  <button
                    onClick={() => { openLogin(); setMobileOpen(false); }}
                    className="flex w-full items-center justify-between border-t border-line px-6 py-5 text-[15px] font-semibold"
                  >
                    Asesores
                    <Lock size={15} strokeWidth={1.8} className="text-ink-3" />
                  </button>
                )}

                {/* Idioma — antes solo existía en desktop (sm:inline-flex),
                    en mobile no había forma de cambiarlo. */}
                <div className="flex items-center justify-between border-t border-line px-6 py-5">
                  <span className="flex items-center gap-2 text-[13px] font-medium text-ink-3">
                    <Globe size={16} strokeWidth={1.6} />
                    Idioma
                  </span>
                  <div className="inline-flex items-center gap-px rounded-full bg-black/[0.05] p-[3px]" role="group" aria-label="Idioma">
                    {(['es', 'en'] as const).map((lng) => (
                      <button
                        key={lng}
                        onClick={() => switchLocale(lng)}
                        aria-pressed={locale === lng}
                        className={cn(
                          'rounded-full px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.2em] transition-colors',
                          locale === lng ? 'bg-accent text-ink' : 'text-ink-3 hover:text-ink',
                        )}
                      >
                        {lng}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="border-t border-line p-6">
                  <Link
                    href="/agenda"
                    className="flex w-full items-center justify-center rounded-full bg-accent px-6 py-3.5 text-[11px] font-bold uppercase tracking-caps text-ink"
                  >
                    Asesoría sin costo
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* ─── Overlay con blur del fondo (mega-menú desktop + panel móvil) ─── */}
      <div
        aria-hidden
        onMouseEnter={scheduleClose}
        onClick={() => setMobileOpen(false)}
        className={cn(
          'fixed inset-0 z-40 bg-black/15 backdrop-blur-md transition-opacity duration-300',
          menuActive || mobileOpen ? 'opacity-100' : 'pointer-events-none opacity-0',
        )}
      />
    </>
  );
}

/* ════════════════ Fila de acordeón (panel móvil) ════════════════ */
function MobileAccordionRow({
  label,
  open,
  onToggle,
  children,
}: {
  label: string;
  open: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}) {
  return (
    <div>
      <button
        onClick={onToggle}
        aria-expanded={open}
        className="flex w-full items-center justify-between px-6 py-5 text-[15px] font-semibold"
      >
        {label}
        <ChevronDown size={16} strokeWidth={2} className={cn('text-ink-3 transition-transform duration-300', open && 'rotate-180')} />
      </button>
      <div
        className={cn(
          'grid transition-all duration-300 ease-soft',
          open ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]',
        )}
      >
        <div className="overflow-hidden">{children}</div>
      </div>
    </div>
  );
}

/* ════════════════ Mega-menú Propiedades ════════════════ */
function PropiedadesMenu() {
  // Destacados: solo desarrollos propios (WE DEVELOP), sin los "próximamente", máx. 2.
  const destacados = getDevelopDevelopments().filter((d) => !d.comingSoon).slice(0, 2);
  // Ciudades: solo las que tienen desarrollos activos.
  const activeCities = cityList.filter((c) => countByCity(c) > 0);

  return (
    <div className="overflow-hidden rounded-[26px] bg-white text-ink shadow-[0_30px_80px_rgba(0,0,0,0.18)] ring-1 ring-black/[0.04]">
      <div className="grid gap-8 p-8 lg:grid-cols-[1fr_0.8fr_0.8fr_1.1fr]">
        {/* Por tipo de propiedad */}
        <div>
          <span className="eyebrow eyebrow-accent font-bold">Por tipo de propiedad</span>
          <div className="mt-5 flex flex-col gap-1">
            {propertyTypes.map((it) => (
              <Link key={it.title} href={it.href} className="group flex items-center gap-4 rounded-xl p-3 transition-colors hover:bg-bg-soft">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-bg-soft text-ink transition-colors group-hover:bg-accent">
                  <it.icon size={19} strokeWidth={1.5} />
                </span>
                <span>
                  <span className="block text-[15px] font-semibold">{it.title}</span>
                  <span className="block text-[13px] text-ink-3">{it.desc}</span>
                </span>
              </Link>
            ))}
          </div>
        </div>

        {/* Por ciudad */}
        <div>
          <span className="eyebrow eyebrow-accent font-bold">Por ciudad</span>
          <div className="mt-5 flex flex-col">
            {activeCities.map((c) => (
              <Link key={c} href={CITY_HREF[c]} className="group flex items-center justify-between border-b border-line py-3 transition-colors last:border-0 hover:text-accent">
                <span className="flex items-center gap-2.5 text-[15px] font-medium">
                  <MapPin size={15} strokeWidth={1.6} className="text-ink-3" />
                  {c}
                </span>
                <span className="text-[12px] text-ink-3">{countByCity(c)}</span>
              </Link>
            ))}
          </div>
        </div>

        {/* Por desarrollador */}
        <div>
          <span className="eyebrow eyebrow-accent font-bold">Por desarrollador</span>
          <div className="mt-5 flex flex-col">
            {developerLinks.map((d) => (
              <Link key={d.href} href={d.href} className="border-b border-line py-3 text-[15px] font-medium transition-colors last:border-0 hover:text-accent">
                {d.name}
              </Link>
            ))}
          </div>
        </div>

        {/* Destacados */}
        <div>
          <span className="eyebrow eyebrow-accent font-bold">Destacados</span>
          <div className="mt-5 grid grid-cols-2 gap-3">
            {destacados.map((d) => (
              <Link key={d.slug} href={d.href} className="group flex flex-col gap-2">
                <span className="relative aspect-[4/3] overflow-hidden rounded-lg">
                  <Image src={d.image} alt={d.name} fill sizes="160px" className="object-cover transition-transform duration-500 group-hover:scale-105" />
                </span>
                <span className="text-[13px] font-semibold leading-tight">{d.name}</span>
                <span className="-mt-1 text-[11.5px] text-ink-3">{d.city}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Pie del panel */}
      <div className="flex items-center justify-between border-t border-line bg-bg-soft px-8 py-4">
        <span className="text-[12px] tracking-[0.16em] text-ink-3" style={{ fontFamily: 'Javacom, var(--font-switzer), sans-serif' }}>
          The Art of Luxury Living
        </span>
        <Link href="/#portafolio" className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-caps text-ink transition-colors hover:text-accent">
          Ver todo el portafolio
          <ArrowRight size={14} strokeWidth={1.8} />
        </Link>
      </div>
    </div>
  );
}

/* ════════════════ Propiedades — contenido del acordeón móvil ════════════════
   Misma data que PropiedadesMenu (desktop), apilada en 1 columna en vez de
   3 — el patrón a seguir cuando lleguen más secciones de nav con submenú. */
function PropiedadesMenuMobile() {
  const destacados = getDevelopDevelopments().filter((d) => !d.comingSoon).slice(0, 2);
  const activeCities = cityList.filter((c) => countByCity(c) > 0);

  return (
    <div className="flex flex-col gap-7 px-6 pb-7">
      {/* Por tipo de propiedad */}
      <div>
        <span className="eyebrow eyebrow-accent font-bold">Por tipo de propiedad</span>
        <div className="mt-3 flex flex-col gap-1">
          {propertyTypes.map((it) => (
            <Link key={it.title} href={it.href} className="flex items-center gap-3.5 rounded-xl py-2.5">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-bg-soft text-ink">
                <it.icon size={17} strokeWidth={1.5} />
              </span>
              <span className="text-[14px] font-medium">{it.title}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Por ciudad */}
      <div>
        <span className="eyebrow eyebrow-accent font-bold">Por ciudad</span>
        <div className="mt-3 flex flex-col">
          {activeCities.map((c) => (
            <Link key={c} href={CITY_HREF[c]} className="flex items-center justify-between border-b border-line py-3 last:border-0">
              <span className="flex items-center gap-2.5 text-[14px] font-medium">
                <MapPin size={14} strokeWidth={1.6} className="text-ink-3" />
                {c}
              </span>
              <span className="text-[12px] text-ink-3">{countByCity(c)}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Por desarrollador */}
      <div>
        <span className="eyebrow eyebrow-accent font-bold">Por desarrollador</span>
        <div className="mt-3 flex flex-col">
          {developerLinks.map((d) => (
            <Link key={d.href} href={d.href} className="border-b border-line py-3 text-[14px] font-medium last:border-0">
              {d.name}
            </Link>
          ))}
        </div>
      </div>

      {/* Destacados */}
      <div>
        <span className="eyebrow eyebrow-accent font-bold">Destacados</span>
        <div className="mt-3 grid grid-cols-2 gap-3">
          {destacados.map((d) => (
            <Link key={d.slug} href={d.href} className="flex flex-col gap-2">
              <span className="relative aspect-[4/3] overflow-hidden rounded-lg">
                <Image src={d.image} alt={d.name} fill sizes="160px" className="object-cover" />
              </span>
              <span className="text-[13px] font-semibold leading-tight">{d.name}</span>
            </Link>
          ))}
        </div>
      </div>

      <Link href="/#portafolio" className="inline-flex items-center gap-2 text-[12px] font-bold uppercase tracking-caps text-ink">
        Ver todo el portafolio
        <ArrowRight size={14} strokeWidth={1.8} />
      </Link>
    </div>
  );
}
