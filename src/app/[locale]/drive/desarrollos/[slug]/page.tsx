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
  return {
    title: dev ? `Drive de Ventas · ${dev.name}` : 'Drive de Ventas',
    robots: { index: false, follow: false },
  };
}

export default async function OpenDrivePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const driveDev = await buildDriveDev(slug);
  if (!driveDev) notFound();

  return <AsesorDrive dev={driveDev} gate={OpenGate} fileEndpoint="/api/drive/file" />;
}
