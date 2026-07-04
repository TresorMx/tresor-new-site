import Image from 'next/image';
import { Link } from '@/navigation';
import { ArrowRight, Building2, ShieldCheck, Handshake } from 'lucide-react';
import RevealOnScroll from '@/components/RevealOnScroll';
import DevelopmentCarousel from '@/components/home/DevelopmentCarousel';
import RivieraCTA from '@/components/home/RivieraCTA';
import SalesPartnerGrid from '@/components/home/SalesPartnerGrid';
import LuisReveal from '@/components/home/LuisReveal';
import HeroVideoSequence from '@/components/home/HeroVideoSequence';
import { salesPartnerDevelopments, developDevelopments, withLivePrices, type Development } from '@/lib/developments';
import { EtherealShadow } from '@/components/ui/ethereal-shadow';

export default async function HomePage() {
  // Precio en vivo: para los desarrollos Tresor con ficha e inventario en
  // Sanity, el precio del card SIEMPRE refleja el mínimo disponible real.
  const liveDevelopDevelopments = await withLivePrices(developDevelopments);

  return (
    <>
      <Hero />
      {/* Bloque que sube por encima del hero (sticky) con el borde superior curvo.
          Sin overflow-hidden ni box-shadow (disparan repintados/bleed sobre el sticky).
          La curva la da rounded-t recortando el propio fondo; la 1ª sección es transparente. */}
      <div className="relative z-10 -mt-11">
        {/* Fondo blanco detrás del contenido para que las curvas inferiores muestren
            blanco (no el hero sticky). Empieza bajo las esquinas superiores para no
            tapar el reveal del hero en la curva de arriba. */}
        <div aria-hidden className="absolute inset-x-0 bottom-0 top-16 -z-10 bg-bg" />
        <Intent developments={liveDevelopDevelopments} />
        <RivieraCTA />
        <Portfolio />
        <Positioning />
      </div>
    </>
  );
}

/* ════════════════════════════ HERO ════════════════════════════ */
function Hero() {
  return (
    <section
      className="sticky top-0 z-0 -mt-[104px] flex h-[100svh] flex-col justify-center overflow-hidden bg-bg-deep pt-[104px] text-bg"
      style={{ transform: 'translateZ(0)', WebkitBackfaceVisibility: 'hidden' }}
    >
      {/* Capa 1: fondo animado ethereal */}
      <div className="absolute inset-0">
        <EtherealShadow
          color="rgba(250, 180, 19, 0.9)"
          animation={{ scale: 80, speed: 85 }}
          noise={{ opacity: 0.4, scale: 1.2 }}
          sizing="fill"
          style={{ width: '100%', height: '100%' }}
        />
      </div>
      {/* Capa 2: foto de respaldo + secuencia de video A→B→C, ambas a un
          único 0.7 de opacidad (el video vive dentro del mismo contenedor
          para no sumar transparencias con la foto y evitar doble exposición). */}
      <HeroVideoSequence />
      {/* Capa 3: gradiente oscuro para legibilidad */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/70" />

      <div className="container-wrap relative z-10 w-full pb-20 md:pb-24">
        <RevealOnScroll>
          <h1
            className="mt-6 w-full text-center text-[clamp(22px,4vw,58px)] leading-[0.95] tracking-tight"
            style={{ fontFamily: 'Javacom, serif' }}
          >
            The Art of Luxury Living
          </h1>
          <p className="mt-7 w-full text-center text-[clamp(11px,1.1vw,16px)] font-bold uppercase tracking-[0.2em] text-white">
            We develop · We manage · We are your Sales Partner
          </p>
        </RevealOnScroll>

        {/* Fuera de RevealOnScroll a propósito: su fade de opacidad se
            multiplicaba con la transparencia propia del botón glass y se
            veía "más transparente" durante el segundo de la animación. */}
        <div className="mt-10 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <Link href="#portafolio" className="btn btn-lg border-0 bg-accent text-ink hover:brightness-95">
            Ver desarrollos
            <ArrowRight size={15} strokeWidth={1.8} />
          </Link>
          <Link href="/agenda" className="btn btn-glass btn-lg border-0">
            Asesoría sin costo
          </Link>
        </div>
      </div>
    </section>
  );
}

/* ════════════════════════════ INTENT ════════════════════════════ */
const intents = [
  {
    key: 'vivir',
    title: 'Vivir',
    desc: 'Residencias y departamentos de lujo para habitar el Caribe todo el año.',
    image: '/lifestyle/people-1.jpg',
    href: '#portafolio',
  },
  {
    key: 'invertir',
    title: 'Invertir',
    desc: 'Activos con plusvalía comprobada y rentas en dólares en los destinos de mayor crecimiento.',
    image: '/renders/long-island/WEBB.jpg',
    href: '#portafolio',
  },
  {
    key: 'negocio',
    title: 'Tu negocio',
    desc: 'Locales y plazas comerciales premium en las avenidas con mayor flujo de Cancún.',
    image: '/lifestyle/retail-1.jpg',
    href: '/desarrollos/long-island',
  },
];

function Intent({ developments }: { developments: Development[] }) {
  return (
    <section
      data-nav="light"
      className="relative z-10 rounded-[2.5rem] pb-20 pt-16 md:pb-28 md:pt-24"
      style={{
        backgroundImage:
          'linear-gradient(180deg, #ffffff 0%, #f7f8fa 55%, #eceef1 100%)',
      }}
    >
      <div className="container-wrap">
        <RevealOnScroll className="mb-12 flex items-center justify-between gap-8">
          <div className="flex-1">
            <span className="eyebrow eyebrow-accent font-bold">WE DEVELOP</span>
            <h2 className="mt-4 font-sans text-[clamp(24px,3.2vw,48px)] font-normal leading-[1.05] tracking-tight">
              Desarrollos <span className="text-ink-3">diseñados<br />para el futuro</span>
            </h2>
          </div>
          <Image
            src="/logos/LogoTresor-ink.svg"
            alt="Tresor Real Estate"
            width={160}
            height={86}
            className="hidden h-16 w-auto shrink-0 self-end mb-2 md:block"
          />
        </RevealOnScroll>

        <DevelopmentCarousel developments={developments} />
      </div>
    </section>
  );
}

/* ════════════════════════════ PORTFOLIO ════════════════════════════ */
function Portfolio() {
  return (
    <section
      id="portafolio"
      data-nav="light"
      className="relative z-10 -mt-10 rounded-[2.5rem] py-20 md:py-28"
      style={{
        backgroundImage:
          'linear-gradient(180deg, #f7f8fa 0%, #f2f3f5 55%, #eceef1 100%)',
      }}
    >
      <div className="container-wrap">
        <SalesPartnerGrid developments={salesPartnerDevelopments} showDeveloperFilter={true}>
          <div>
            <span className="eyebrow eyebrow-accent font-bold">Sales Partner</span>
            <h2 className="mt-4 font-sans text-[clamp(24px,3.2vw,48px)] font-normal leading-[1.05] tracking-tight">
              Una selección <span className="text-ink-3">exclusiva<br />de desarrollos</span>
            </h2>
          </div>
        </SalesPartnerGrid>
      </div>
    </section>
  );
}

/* ════════════════════════════ POSITIONING ════════════════════════════ */
const services = [
  {
    icon: Building2,
    t: 'Develop',
    d: 'Creamos lugares con significado que dejan una huella duradera en las ciudades.',
  },
  {
    icon: ShieldCheck,
    t: 'Manage',
    d: 'Te acompañamos desde la planeación financiera hasta la implementación comercial.',
  },
  {
    icon: Handshake,
    t: 'Sales Partner',
    d: 'Nos convertimos en tu dirección de ventas para asegurar tu éxito inmobiliario.',
  },
];

function Positioning() {
  return (
    <section data-nav="dark" className="relative z-0 -mt-10 overflow-hidden bg-black py-20 text-bg md:py-28">
      <div className="container-wrap">
        <div className="grid gap-14 md:grid-cols-[1.1fr_1fr] md:items-end">
          <RevealOnScroll>
            <span className="eyebrow text-accent font-bold">Quiénes somos</span>
            <h2 className="mt-5 font-sans text-[clamp(24px,3.2vw,48px)] font-normal leading-[1.05] tracking-tight">
              <span className="text-white/55">Desarrollamos, gestionamos y comercializamos,</span> todo bajo un mismo sello.
            </h2>
            <p className="mt-6 text-[15px] font-light leading-relaxed text-white/70">
              Ofrecemos soluciones integrales —de la planeación y comercialización de
              desarrollos a la compra y venta de propiedades— con asesoría experta,
              estrategias a la medida y un servicio de excelencia que asegura resultados.
            </p>

            <div className="mt-10 grid gap-px overflow-hidden rounded-lg bg-white/10 sm:grid-cols-3">
              {services.map((s) => (
                <div key={s.t} className="bg-bg-deep p-6">
                  <s.icon size={22} strokeWidth={1.3} className="text-accent" />
                  <h3 className="mt-4 font-sans text-[17px] font-light">{s.t}</h3>
                  <p className="mt-2 text-[13px] font-light leading-relaxed text-white/60">{s.d}</p>
                </div>
              ))}
            </div>
          </RevealOnScroll>

          <LuisReveal />
        </div>
      </div>
    </section>
  );
}

