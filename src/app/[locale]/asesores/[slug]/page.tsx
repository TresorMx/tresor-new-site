import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import AsesorDrive, { type DriveDev } from '@/components/asesor/AsesorDrive';
import { getMergedDevelopmentsAsync, developers } from '@/lib/developments';

export const metadata: Metadata = {
  title: 'Drive de Ventas · Asesores',
  robots: { index: false, follow: false },
};

function routeSlug(href: string): string | null {
  return href.startsWith('/desarrollos/') ? href.slice('/desarrollos/'.length) : null;
}

export default async function AsesorDrivePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const all = await getMergedDevelopmentsAsync();
  const dev = all.find((d) => routeSlug(d.href) === slug);
  if (!dev) notFound();

  const driveDev: DriveDev = {
    slug,
    name: dev.name,
    developerName: dev.brand ?? developers[dev.developer]?.name ?? dev.developer,
    logo: dev.logo,
    image: dev.heroRender ?? dev.image,
    // Los formatos administrativos (Recibo de Pago, Apartado, etc.) solo
    // existen para Quattro (desarrollos propios de Tresor) — Sales Partner
    // no los tiene.
    showAdmin: dev.relationship === 'develop',
  };

  return <AsesorDrive dev={driveDev} />;
}
