import type { Metadata } from 'next';
import Image from 'next/image';
import { Gem } from 'lucide-react';
import ProjectImage from '@/components/desarrollo/ProjectImage';

// Página fija (sin Sanity), réplica de la estructura de /desarrollo —
// hero + secciones de contenido. Contenido en español únicamente, mismo
// criterio que /desarrollo y las páginas de blog.

export const metadata: Metadata = {
  title: 'Gestión — Servicios de Gestión Inmobiliaria',
  description:
    'Servicios integrales de gestión inmobiliaria de Tresor Real Estate: búsqueda de terrenos, estudios de viabilidad, diseño de plan maestro, gestión de permisos, supervisión de obra y comercialización, en Cancún y Tulum.',
  alternates: { canonical: 'https://tresor.mx/gestion' },
  openGraph: {
    title: 'Gestión — Servicios de Gestión Inmobiliaria',
    description: 'Servicios integrales de gestión inmobiliaria de Tresor Real Estate, desde la conceptualización hasta la venta de la última unidad.',
    url: 'https://tresor.mx/gestion',
    images: [{ url: '/ogfinal.jpg', width: 1200, height: 630 }],
  },
};

const SERVICES = [
  ['Búsqueda de Terrenos', 'Estudios de Viabilidad', 'Proyecciones Financieras', 'Inversión y Financiamiento'],
  ['Diseño del Plan Maestro', 'Definición de Prototipos', 'Gestión de Permisos', 'Supervisión de Obra'],
  ['Gestión Comercial', 'Estrategia de Marketing', 'Procesos Operativos y Comunicación', 'Titulación y Entrega de Viviendas'],
];

interface Project {
  name: string;
  description: string;
  images: string[];
}

const PROJECTS: Project[] = [
  {
    name: 'Amira District',
    description:
      'Ubicado a solo 280 metros de la playa de Tulum, este exclusivo desarrollo, rodeado de exuberante naturaleza y paisajes tropicales, ofrece amenidades premium y áreas en la azotea con vistas espectaculares al mar, diseñadas para el descanso, la convivencia y disfrutar de un estilo de vida único junto a la naturaleza.',
    images: ['/amira.jpg'],
  },
  {
    name: 'Novo Cancún',
    description:
      'Un exclusivo desarrollo inmobiliario de Hansa Urbana en Puerto Cancún, dirigido por el equipo directivo de Tresor Real Estate. Un desarrollo rodeado de agua y muelles, con una ubicación única frente al mar que abarca 250 metros de playa, y donde se alojan actualmente nuevas fases del proyecto SLS Cancún.',
    images: ['/novo.jpg'],
  },
];

export default function GestionPage() {
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
            src="/desarrollos/olivia/5.-Fachada-frontal.jpg"
            alt="Tresor Real Estate — Gestión"
            fill
            priority
            sizes="100vw"
            className="scale-105 object-cover"
          />
        </div>
        <div className="absolute inset-0 bg-black/55" />
        <div className="relative z-10 flex h-full flex-col items-center justify-center px-6 pt-[72px] text-center">
          <span className="eyebrow eyebrow-accent font-bold">— Gestión</span>
          <h1 className="mt-5 h-display max-w-3xl text-[clamp(40px,7vw,88px)] text-white">We Manage</h1>
          <p className="mt-6 max-w-xl text-[15px] font-normal leading-relaxed text-white">
            Acompañamos cada proyecto en todas sus etapas, de la planeación a la entrega —
            con la misma visión integral con la que desarrollamos.
          </p>
        </div>
      </section>

      {/* ═════ SERVICIOS ═════ */}
      <section className="relative z-10 -mt-10 rounded-[2.5rem] bg-bg-soft py-16 md:py-24">
        <div className="container-wrap">
          <h2 className="font-sans text-[clamp(24px,3.2vw,48px)] font-normal leading-[1.05] tracking-tight">Servicios de Gestión</h2>
          <p className="mt-6 text-[15px] font-light leading-relaxed text-ink-2">
            Ofrecemos una amplia gama de servicios para garantizar el éxito de tu proyecto
            inmobiliario, desde la conceptualización inicial hasta la venta de la última unidad.
            Con una visión integral y un enfoque proactivo, nuestro equipo colabora
            estrechamente con nuestros clientes para asegurar que cada etapa del proceso sea un
            verdadero éxito.
          </p>
        </div>
        <div className="container-wrap mt-14 grid gap-x-10 gap-y-4 sm:grid-cols-2 lg:grid-cols-3">
          {SERVICES.map((col, i) => (
            <ul key={i} className="flex flex-col gap-4">
              {col.map((item) => (
                <li key={item} className="flex items-center gap-3 text-[15px] font-light text-ink">
                  <Gem size={16} strokeWidth={1.8} className="shrink-0 text-accent" />
                  {item}
                </li>
              ))}
            </ul>
          ))}
        </div>
      </section>

      {/* ═════ PROYECTOS — misma estructura de fila texto/foto que
          /desarrollo (texto izq., foto der., esquinas redondeadas). ═════ */}
      {/* pb-[140px] fijo: el Footer tiene su propio -mt-10 (sube 40px sobre
          esta sección con esquinas redondeadas) — sin compensar esos 40px,
          el espacio VISIBLE quedaba en 100-40=60px, no en los 100px reales
          que se querían. 100 + 40 = 140px de pb para que el hueco blanco
          visible antes del negro sí sea de 100px. */}
      <section className="bg-white pt-16 pb-[140px] md:pt-24">
        <div className="flex flex-col gap-20 md:gap-24">
          {PROJECTS.map((p) => (
            <div key={p.name} className="container-wrap grid gap-8 md:grid-cols-[0.85fr_1.15fr] md:items-center md:gap-14">
              <div>
                <h2 className="font-sans text-[clamp(20px,2.2vw,32px)] font-medium leading-[1.15] text-ink">{p.name}</h2>
                <p className="mt-5 text-[15px] font-light leading-relaxed text-ink-2">{p.description}</p>
              </div>
              <div>
                <ProjectImage images={p.images} alt={p.name} />
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
