import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import AsesorDrive from '@/components/asesor/AsesorDrive';
import BrokerGate from '@/components/broker/BrokerGate';
import { findDevBySlug, buildDriveDev } from '@/lib/asesor/driveDev';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const dev = await findDevBySlug(slug);
  return {
    title: dev ? `Drive de Ventas · ${dev.name}` : 'Drive de Ventas · Brokers',
    robots: { index: false, follow: false },
  };
}

export default async function BrokerDriveDevPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const driveDev = await buildDriveDev(slug);
  if (!driveDev) notFound();

  return <AsesorDrive dev={driveDev} gate={BrokerGate} fileEndpoint="/api/broker/file" />;
}
