import type { Metadata } from 'next';
import { developmentRouteSlugsForPrefix } from '@/lib/developments';
import { generateFichaMetadata, FichaPage } from '../../_ficha';

// Wrapper delgado — mismo cuerpo de ficha que /desarrollos/[slug]
// (src/app/[locale]/_ficha.tsx). Listings (Plaza Lindavista y lo que siga)
// vive en su propio prefijo /listings/{slug} para no mezclarse con el
// portafolio de desarrollo/Sales Partner; ver fichaSlugFromHref en
// src/lib/developments.ts.

export async function generateStaticParams() {
  return developmentRouteSlugsForPrefix('/listings/').map((slug) => ({ slug }));
}

export async function generateMetadata(props: { params: Promise<{ slug: string; locale: string }> }): Promise<Metadata> {
  return generateFichaMetadata(props);
}

export default async function Page(props: { params: Promise<{ slug: string; locale: string }> }) {
  return FichaPage(props);
}
