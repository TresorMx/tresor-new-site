import type { Metadata } from 'next';
import { getActivePlazasAsync } from '@/lib/data';
import { developmentRouteSlugsForPrefix } from '@/lib/developments';
import { generateFichaMetadata, FichaPage } from '../../_ficha';

// Wrapper delgado — el cuerpo real de la ficha vive en src/app/[locale]/_ficha.tsx,
// compartido con src/app/[locale]/listings/[slug]/page.tsx. Esta carpeta solo
// pre-genera SUS PROPIOS slugs (Tresor + Sales Partner bajo /desarrollos/);
// Listings (Plaza Lindavista) vive en /listings/[slug], no aquí.

export async function generateStaticParams() {
  const plazas = await getActivePlazasAsync();
  const slugs = new Set([...plazas.map((p) => p.slug), ...developmentRouteSlugsForPrefix('/desarrollos/')]);
  return Array.from(slugs).map((slug) => ({ slug }));
}

export async function generateMetadata(props: { params: Promise<{ slug: string; locale: string }> }): Promise<Metadata> {
  return generateFichaMetadata(props);
}

export default async function Page(props: { params: Promise<{ slug: string; locale: string }> }) {
  return FichaPage(props);
}
