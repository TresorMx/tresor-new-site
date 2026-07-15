import type { Metadata } from 'next';
import Image from 'next/image';
import ProjectImage from '@/components/desarrollo/ProjectImage';

// Página fija (sin Sanity) — trayectoria de Tresor Real Estate como
// desarrollador. Réplica de la sección "Desarrollo" del sitio anterior
// (tresor.mx, WordPress/Elementor) MANTENIENDO su estructura real —
// encabezado de categoría a la izquierda, fila de texto+foto por proyecto
// (texto izquierda, media derecha) — con nuestra tipografía, esquinas
// redondeadas en todas las fotos y nuestro propio estilo de slider en los
// 3 proyectos que lo tenían (Allure, Blume, La Vela). Contenido en español
// únicamente, mismo criterio que las páginas de blog.

export const metadata: Metadata = {
  title: 'Desarrollo — Nuestra Trayectoria',
  description:
    'Más de 3,000 unidades entregadas en Cancún y Tulum. Conoce los proyectos de lujo, residenciales, comerciales, vacacionales y master plans desarrollados por Tresor Real Estate.',
  alternates: { canonical: 'https://tresor.mx/desarrollo' },
  openGraph: {
    title: 'Desarrollo — Nuestra Trayectoria',
    description: 'Proyectos de lujo, residenciales, comerciales, vacacionales y master plans desarrollados por Tresor Real Estate en Cancún y Tulum.',
    url: 'https://tresor.mx/desarrollo',
    images: [{ url: '/1g-1.jpg', width: 1920, height: 992 }],
  },
};

interface Project {
  name: string;
  description: string;
  images?: string[]; // 1 = foto estática, 2+ = slider (Allure/Blume/La Vela)
  tiles?: string[];  // grid de sub-marcas (Astoria, Long Island Community) — reemplaza `images`
  fit?: 'cover' | 'contain';   // 'contain' para PNGs con fondo transparente que no deben recortarse
  aspectRatio?: string;        // override del aspect-ratio default (16/9) — necesario con `fit: 'contain'`
                                // cuando la imagen no es panorámica (ej. un master plan vertical).
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
        description: '437 unidades y áreas comerciales en Av. Huayacán, combinando privadas de casas y departamentos frente a amplias áreas comunes y jardines.',
        tiles: [
          '/desarrollo-corporativo/astoriaA.jpg', // Tribeca
          '/desarrollo-corporativo/astoriaB.jpg', // Queens
          '/desarrollo-corporativo/soho.jpg',     // Soho
          '/desarrollo-corporativo/astoriaC.jpg', // York
        ],
      },
      {
        name: 'Long Island Community',
        description: '15 desarrollos de casas y departamentos —cerca de 1,300 unidades en clusters de 60 a 90— uno de los referentes residenciales de Cancún.',
        tiles: [
          '/desarrollo-corporativo/ResidencialA.jpg', // Kings
          '/desarrollo-corporativo/ResidencialB.jpg', // Madison
          '/desarrollo-corporativo/ResidencialC.jpg', // Midtown
          '/desarrollo-corporativo/ResidencialD.jpg', // Duke
        ],
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
    location: '',
    intro: 'Contamos con una amplia trayectoria en la planeación y desarrollo de Master Plans integrales, concebidos para crear comunidades con visión a largo plazo y un equilibrio armónico entre urbanismo y naturaleza.',
    projects: [
      {
        name: 'Astoria Cancún',
        description: 'Un proyecto icónico en Av. Huayacán, la primera comunidad planeada con casas y departamentos dentro de un master plan de 437 unidades.',
        images: ['/astoriamaster.png'],
        fit: 'contain',
        aspectRatio: '1.444/1',
      },
      {
        name: 'Long Island Cancún',
        description: 'Master plan de 1,315 unidades que dio vida a una comunidad privada, logrando uno de los proyectos más innovadores de Cancún.',
        images: ['/longmaster.png'],
        fit: 'contain',
        aspectRatio: '1.566/1',
      },
      {
        name: 'Sanam Country Club',
        description: 'Proyecto inmobiliario en Tulum que integra lotes unifamiliares y macrolotes dentro de un entorno de 32 hectáreas, con una reserva natural de 2.5 hectáreas que alberga cenotes, áreas de yoga y senderos. Un diseño de Sanzpont Arquitectura & Artigas.',
        images: ['/sanammaster.png'],
        fit: 'contain',
        // La imagen real es muy vertical (1052×1646 ≈ 0.64/1) — a esa
        // proporción exacta la columna se ve descomunal en desktop junto al
        // texto. 4/5 la deja alta pero contenida; con object-contain sigue
        // sin recortarse, solo entra con un poco de aire arriba/abajo.
        aspectRatio: '4/5',
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
            src="/1g-1.jpg"
            alt="Tresor Real Estate — Desarrollo"
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
          <p className="mt-6 max-w-xl text-[15px] font-normal leading-relaxed text-white">
            Nos enfocamos en crear lugares especiales y significativos, más allá de la simple
            construcción — proyectos que dejan una huella duradera en las ciudades donde vivimos.
          </p>
        </div>
      </section>

      {/* ═════ CATEGORÍAS — estructura del sitio anterior: encabezado a la
          izquierda, fila de texto+media por proyecto (texto izq., foto/
          slider/grid der.), alternando fondo blanco/gris por sección
          (mismo orden que el sitio anterior: Luxury blanco, Residencial
          gris, Comercial blanco, Vacacional gris, Master Plan blanco). ═════ */}
      {CATEGORIES.map((c, i) => (
        <section
          key={c.id}
          id={c.id}
          className={`py-16 md:py-24 ${i % 2 === 1 ? 'bg-bg-soft' : 'bg-white'} ${
            i === 0 ? 'relative z-10 -mt-10 rounded-[2.5rem]' : ''
          }`}
        >
          <div className="container-wrap">
            <h2 className="font-sans text-[clamp(24px,3.2vw,48px)] font-normal leading-[1.05] tracking-tight">
              {c.location ? (
                <>{c.eyebrow} <span className="text-ink-3">en {c.location}</span></>
              ) : (
                c.eyebrow
              )}
            </h2>
            <p className="mt-6 text-[15px] font-light leading-relaxed text-ink-2">{c.intro}</p>
          </div>

          <div className="mt-14 flex flex-col gap-20 md:gap-24">
            {c.projects.map((p) => (
              <div key={p.name} className="container-wrap grid gap-8 md:grid-cols-[0.85fr_1.15fr] md:items-center md:gap-14">
                <div>
                  <h3 className="font-sans text-[clamp(18px,1.8vw,28px)] font-medium leading-[1.15] text-ink">{p.name}</h3>
                  <p className="mt-5 text-[15px] font-light leading-relaxed text-ink-2">{p.description}</p>
                </div>
                <div>
                  {p.tiles ? (
                    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                      {p.tiles.map((t) => (
                        <div key={t} className="relative aspect-square overflow-hidden rounded-[20px] bg-bg-soft">
                          <Image src={t} alt={p.name} fill sizes="(max-width: 640px) 50vw, 260px" className="object-cover" />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <ProjectImage images={p.images ?? []} alt={p.name} fit={p.fit} aspectRatio={p.aspectRatio} />
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      ))}
    </>
  );
}
