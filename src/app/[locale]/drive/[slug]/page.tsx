import type { Metadata } from 'next';
import PlazaPage, { generateMetadata as generateRealMetadata } from '../../desarrollos/[slug]/page';

// Espejo de /desarrollos/[slug] para brokers de confianza — MISMO
// componente de ficha real (cero duplicación de las ~700 líneas de
// markup: hero, quickfacts, floor plans, amenidades, master plan, etc.),
// solo que sin indexar. El botón flotante (FloatingLayer) detecta esta
// ruta y muestra "Drive de Ventas" en vez del chat de Luis — mismo
// criterio que ya usa cuando un asesor logueado ve la ficha real.
// Sin generateStaticParams a propósito: se renderiza on-demand, como el
// resto de /drive/* (nadie necesita esto pre-generado en build).
export const dynamic = 'force-dynamic';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string; locale: string }>;
}): Promise<Metadata> {
  const meta = await generateRealMetadata({ params });
  return { ...meta, robots: { index: false, follow: false } };
}

export default async function DriveFichaMirrorPage({
  params,
}: {
  params: Promise<{ slug: string; locale: string }>;
}) {
  return <PlazaPage params={params} />;
}
