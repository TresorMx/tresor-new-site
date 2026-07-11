import type { Metadata } from 'next';
import Image from 'next/image';
import ProjectImage from '@/components/desarrollo/ProjectImage';

// Página fija (sin Sanity) — trayectoria de Tresor Real Estate como
// desarrollador. Réplica adaptada de la sección "Desarrollo" del sitio
// anterior (tresor.mx, WordPress/Elementor), con el lenguaje visual del
// sitio nuevo. Contenido en español únicamente, mismo criterio que las
// páginas de blog (no hay copy en inglés en el sitio original que traducir).

export const metadata: Metadata = {
  title: 'Desarrollo — Trayectoria de Tresor Real Estate',
  description:
    'Más de 3,000 unidades entregadas en Cancún y Tulum. Conoce los proyectos de lujo, residenciales, comerciales, vacacionales y master plans desarrollados por Tresor Real Estate.',
  alternates: { canonical: 'https://tresor.mx/desarrollo' },
  openGraph: {
    title: 'Desarrollo — Trayectoria de Tresor Real Estate',
    description: 'Proyectos de lujo, residenciales, comerciales, vacacionales y master plans desarrollados por Tresor Real Estate en Cancún y Tulum.',
    url: 'https://tresor.mx/desarrollo',
    images: [{ url: '/desarrollo-corporativo/LuxuryL.jpg', width: 1920, height: 992 }],
  },
};

interface Project {
  name: string;
  description: string;
  images: string[]; // 2+ imágenes → slider (mismo tratamiento que Allure/Blume/La Vela en el sitio anterior)
}

interface Category {
  id: string;
  eyebrow: string;
  location: string;
  intro: string;
  projects: Project[];
}

const CATEGORIES: Category[] = [
  {
    id: 'luxury',
    eyebrow: 'Luxury',
    location: 'Puerto Cancún',
    intro: 'Como Managing Partner de Urban Homes, hemos desarrollado dos proyectos frente al mar en Puerto Cancún —Allure y Blume— y participamos en la conceptualización y planeación de La Vela.',
    projects: [
      {
        name: 'Allure Luxury Condos',
        description: 'Frente al Mar Caribe en Puerto Cancún: 96 departamentos de 2 a 4 recámaras (153–428 m²) y 8 penthouses (535–589 m²). Spa, business center, kids club, gimnasio y muelle propio. Diseño de Ancona + Ancona Arquitectos.',
        images: ['/desarrollo-corporativo/LuxuryL.jpg', '/desarrollo-corporativo/LuxuryG.jpg'],
      },
      {
        name: 'Blume Boutique Condos',
        description: 'En la marina de Puerto Cancún: 109 departamentos de 3 recámaras (235–265 m²) y 4 penthouses (380–430 m²). Alberca infinity frente a la marina, muelle propio, spa y gimnasio.',
        images: ['/desarrollos/Blume/BLUME-Arquitectura-1.jpg', '/desarrollos/Blume/BLUME-Drone-1.jpg'],
      },
      {
        name: 'La Vela',
        description: 'Frente a la marina de Puerto Cancún: 105 unidades de 3 y 4 recámaras (300–400 m²) y penthouses (400–500 m²), con vistas al campo de golf de Puerto Cancún.',
        images: ['/desarrollo-corporativo/LuxuryJ.jpg', '/desarrollo-corporativo/LuxuryP.jpg'],
      },
    ],
  },
  {
    id: 'residencial',
    eyebrow: 'Residencial',
    location: 'Cancún',
    intro: 'Como Managing Partner de Urban Homes hemos entregado y registrado más de 1,800 unidades residenciales en puntos estratégicos de Cancún, como Av. Huayacán —reconocida por su alta plusvalía.',
    projects: [
      {
        name: 'Vita Residenze',
        description: 'Departamentos de 2 recámaras y casas de 2 y 3 niveles en una de las zonas residenciales con mayor crecimiento de Cancún, con amenidades pensadas para el día a día.',
        images: ['/desarrollo-corporativo/ResidencialE.jpg'],
      },
      {
        name: 'Astoria Gated Community',
        description: '437 unidades y áreas comerciales en Av. Huayacán, combinando privadas de casas y departamentos —Tribeca, Soho, Queens, Chelsea— frente a amplias áreas comunes y jardines.',
        images: ['/desarrollo-corporativo/astoriaA.jpg'],
      },
      {
        name: 'Long Island Community',
        description: '15 desarrollos de casas y departamentos —cerca de 1,300 unidades en clusters de 60 a 90, como Madison, Duke, Kings y York— uno de los referentes residenciales de Cancún.',
        images: ['/desarrollo-corporativo/ResidencialA.jpg'],
      },
    ],
  },
  {
    id: 'comercial',
    eyebrow: 'Comercial',
    location: 'Cancún',
    intro: 'Quattro Plaza Center es nuestra línea de plazas comerciales, diseñada por la prestigiosa firma Ancona + Ancona Arquitectos.',
    projects: [
      {
        name: 'Quattro Plaza Center · Long Island',
        description: 'Plaza comercial en zona de alto crecimiento en Cancún, entre Av. Huayacán y Av. Chac Mool, junto a residenciales de prestigio como Aqua, Río y Long Island.',
        images: ['/renders/long-island/01.jpg'],
      },
      {
        name: 'Quattro Plaza Center · Gardens',
        description: 'Plaza comercial en una de las zonas de mayor crecimiento de Cancún, rodeada de residenciales como Jardines del Sur VI, Ciudadela, Zienna, Terraquia y La Rioja II.',
        images: ['/renders/gardens/01.jpg'],
      },
    ],
  },
  {
    id: 'vacacional',
    eyebrow: 'Vacacional',
    location: 'Tulum',
    intro: 'Desde 2022 desarrollamos proyectos en Aldea Zamá, una de las zonas más exclusivas de Tulum, pensados para maximizar el retorno por renta vacacional.',
    projects: [
      {
        name: 'Luna Residence',
        description: 'En Aldea Zamá: 28 departamentos de 1 recámara y locales comerciales, en conjunto con Giada Developments. Elevador, recepción y alberca infinity.',
        images: ['/desarrollo-corporativo/TulumB.jpg'],
      },
      {
        name: 'Kabana',
        description: 'En la fase 4 premium de Aldea Zamá: 16 departamentos en 3 modelos —Garden Houses, Condos y Penthouses con roof garden— de 150 a 250 m².',
        images: ['/desarrollo-corporativo/TulumC.jpg'],
      },
    ],
  },
  {
    id: 'master-plan',
    eyebrow: 'Master Plan',
    location: 'Cancún',
    intro: 'Amplia trayectoria en la planeación y desarrollo de master plans integrales, concebidos para crear comunidades con visión a largo plazo y un equilibrio armónico entre urbanismo y naturaleza.',
    projects: [
      {
        name: 'Sanam Country Club',
        description: 'Lotes unifamiliares y macrolotes para desarrolladores en 32 hectáreas, con una reserva natural de 8 hectáreas —cenotes, área de yoga y senderos. Diseño de Sanzpont Arquitectura.',
        images: ['/desarrollos/Sanam/portada.jpg'],
      },
    ],
  },
];

export default function DesarrolloPage() {
  return (
    <>
      {/* ═════ HERO ═════ */}
      <section
        data-nav="dark"
        className="relative -mt-[72px] overflow-hidden bg-bg-deep text-bg"
        style={{ height: 'calc(100svh - 104px - 72px)', minHeight: '480px' }}
      >
        <div className="absolute inset-0 animate-hero-zoom">
          <Image
            src="/desarrollo-corporativo/LuxuryL.jpg"
            alt="Allure Luxury Condos — Puerto Cancún"
            fill
            priority
            sizes="100vw"
            className="scale-105 object-cover"
          />
        </div>
        <div className="absolute inset-0 bg-black/55" />
        <div className="relative z-10 flex h-full flex-col items-center justify-center px-6 pt-[72px] text-center">
          <span className="eyebrow eyebrow-accent font-bold">— Desarrollo</span>
          <h1 className="mt-5 h-display max-w-3xl text-[clamp(40px,7vw,88px)] text-white">We Develop</h1>
          <p className="mt-6 max-w-xl text-[15px] font-light leading-relaxed text-white/80">
            Nos enfocamos en crear lugares especiales y significativos, más allá de la simple
            construcción — proyectos que dejan una huella duradera en las ciudades donde vivimos.
          </p>
        </div>
      </section>

      {/* ═════ CATEGORÍAS ═════ */}
      {CATEGORIES.map((c, i) => (
        <section
          key={c.id}
          id={c.id}
          className={`py-16 md:py-24 ${i % 2 === 1 ? 'bg-bg-soft' : 'bg-white'}`}
        >
          <div className="container-wrap">
            <span className="eyebrow eyebrow-accent block font-bold">{c.eyebrow}</span>
            <h2 className="mt-3 font-sans text-[clamp(24px,3.2vw,40px)] font-normal tracking-tight">
              {c.eyebrow} <span className="text-ink-3">| {c.location}</span>
            </h2>
            <p className="mt-4 max-w-2xl text-[15px] font-light leading-relaxed text-ink-3">{c.intro}</p>

            <div className="mt-10 grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
              {c.projects.map((p) => (
                <div key={p.name}>
                  <ProjectImage images={p.images} alt={p.name} />
                  <h3 className="mt-4 font-sans text-[17px] font-medium tracking-tight">{p.name}</h3>
                  <p className="mt-1.5 text-[13px] leading-relaxed text-ink-3">{p.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      ))}
    </>
  );
}
