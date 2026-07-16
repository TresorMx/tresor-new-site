import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import AsesorDrive from '@/components/asesor/AsesorDrive';
import OpenGate from '@/components/drive/OpenGate';
import { findDevBySlug, buildDriveDev } from '@/lib/asesor/driveDev';

// Drive de un desarrollo, sin login — solo accesible desde las landings
// espejo /drive/* (link privado para brokers de confianza, nunca enlazado
// públicamente). Ver src/app/[locale]/drive/README si se agrega más
// adelante.
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const dev = await findDevBySlug(slug);
  const title = dev ? `Drive de Ventas · ${dev.name}` : 'Drive de Ventas';
  const image = dev?.heroRender ?? dev?.image;
  return {
    title,
    robots: { index: false, follow: false },
    openGraph: {
      title,
      description: dev?.name ? `Información comercial de ${dev.name}.` : undefined,
      images: image ? [{ url: image, width: 1920, height: 992 }] : undefined,
    },
  };
}

export default async function OpenDrivePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const driveDev = await buildDriveDev(slug);
  if (!driveDev) notFound();

  return <AsesorDrive dev={driveDev} gate={OpenGate} fileEndpoint="/api/drive/file" />;
}
