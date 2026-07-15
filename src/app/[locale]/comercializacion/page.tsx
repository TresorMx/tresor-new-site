import type { Metadata } from 'next';
import Image from 'next/image';
import ProjectImage from '@/components/desarrollo/ProjectImage';

// Página fija (sin Sanity), réplica de la estructura de /desarrollo y
// /gestion — hero + sección de contenido. Contenido en español únicamente,
// mismo criterio que esas dos páginas.

export const metadata: Metadata = {
  title: 'Comercialización — Sales Partner',
  description:
    'Modelo de comercialización de Tresor Real Estate: Master Broker, Sales Partner y Real Estate Agency — red de brokers aliados, equipo de ventas y servicio de agencia inmobiliaria en Cancún y Riviera Maya.',
  alternates: { canonical: 'https://tresor.mx/comercializacion' },
  openGraph: {
    title: 'Comercialización — Sales Partner',
    description: 'Master Broker, Sales Partner y Real Estate Agency — el modelo de comercialización de Tresor Real Estate.',
    url: 'https://tresor.mx/comercializacion',
    images: [{ url: '/salespartner.jpg', width: 1152, height: 648 }],
  },
};

interface Model {
  name: string;
  description: string;
  image: string;
}

const MODELS: Model[] = [
  {
    name: 'Master Broker',
    description:
      'Comercialización de desarrollos de manera integral: diseñamos estrategias de marketing y ventas, construimos sólidas redes de brokers aliados y garantizamos que cada proyecto alcance su máximo potencial en el mercado.',
    image: '/masterbroker.jpg',
  },
  {
    name: 'Sales Partner',
    description:
      'Nos integramos a tu equipo comercial para impulsar ventas, aportando experiencia en marketing, manejo de leads, capacitación de asesores y conexión con una sólida red de brokers aliados.',
    image: '/salespartner.jpg',
  },
  {
    name: 'Real Estate Agency',
    description:
      'A través de nuestra agencia inmobiliaria ayudamos a nuestros clientes a alcanzar sus objetivos, ofreciendo un servicio confiable y profesional en la compra, venta y arrendamiento de propiedades.',
    image: '/realestateagency.jpg',
  },
];

export default function ComercializacionPage() {
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
            src="/salespartner.jpg"
            alt="Tresor Real Estate — Comercialización"
            fill
            priority
            sizes="100vw"
            className="scale-105 object-cover"
          />
        </div>
        <div className="absolute inset-0 bg-black/55" />
        <div className="relative z-10 flex h-full flex-col items-center justify-center px-6 pt-[72px] text-center">
          <span className="eyebrow eyebrow-accent font-bold">— Comercialización</span>
          <h1 className="mt-5 h-display max-w-3xl text-[clamp(40px,7vw,88px)] text-white">Sales Partner</h1>
          <p className="mt-6 max-w-xl text-[15px] font-normal leading-relaxed text-white">
            Somos el socio comercial de desarrollos inmobiliarios en Cancún y la Riviera Maya —
            combinamos una sólida red de brokers aliados, un equipo de ventas especializado y un
            servicio de agencia inmobiliaria para maximizar el potencial de cada proyecto.
          </p>
        </div>
      </section>

      {/* ═════ MODELOS DE COMERCIALIZACIÓN — 3 columnas, mismo lenguaje
          tipográfico que /gestion y /desarrollo (sin amarillo en títulos). */}
      {/* pb-[140px] fijo: el Footer tiene su propio -mt-10 (sube 40px sobre
          esta sección) — sin compensar esos 40px, el espacio VISIBLE
          quedaba en 100-40=60px, no en los 100px reales que se querían.
          100 + 40 = 140px de pb para que el hueco blanco visible antes del
          negro sí sea de 100px. */}
      <section className="relative z-10 -mt-10 rounded-[2.5rem] bg-bg-soft pt-16 pb-[140px] md:pt-24">
        <div className="container-wrap">
          <span className="eyebrow eyebrow-accent block font-bold">— Nuestro Modelo</span>
          <h2 className="mt-4 font-sans text-[clamp(24px,3.2vw,48px)] font-normal leading-[1.05] tracking-tight">
            Tres formas de <span className="text-ink-3">impulsar tu venta</span>
          </h2>
        </div>

        <div className="container-wrap mt-14 grid gap-10 md:grid-cols-3 md:gap-8">
          {MODELS.map((m) => (
            <div key={m.name}>
              <h3 className="font-sans text-[clamp(18px,1.8vw,24px)] font-medium leading-[1.15] text-ink">{m.name}</h3>
              <div className="mt-5">
                <ProjectImage images={[m.image]} alt={m.name} />
              </div>
              <p className="mt-5 text-[15px] font-light leading-relaxed text-ink-2">{m.description}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
