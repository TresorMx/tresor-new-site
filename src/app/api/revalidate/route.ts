import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';

export const runtime = 'nodejs';

// Webhook de Sanity → invalida el caché de las páginas estáticas cuando se
// edita una Plaza o un Local (unit) en el Studio.
//
// POR QUÉ EXISTE: /desarrollos/[slug] y /cotizar/[slug] usan
// generateStaticParams SIN `revalidate` — Next.js las genera una sola vez
// en el build y nunca las vuelve a tocar. Un cambio de estatus en Sanity
// (ej. marcar el local 114 de Gardens como "Apartado") queda invisible en
// tresor.mx hasta el próximo deploy, aunque el mismo dato sí se refleje de
// inmediato en quattroplaza-web (que lee Sanity de otra forma). Este
// endpoint cierra ese hueco: Sanity lo llama automáticamente en cada
// cambio, y esto le dice a Next "vuelve a generar esta página ahora".
//
// CONFIGURACIÓN PENDIENTE EN SANITY (no se puede hacer desde el código,
// es un paso manual en manage.sanity.io):
//   1. manage.sanity.io → proyecto hg48pwsi → API → Webhooks → Create webhook
//   2. URL: https://www.tresor.mx/api/revalidate
//   3. Dataset: production
//   4. Trigger on: Create, Update, Delete
//   5. Filter:  _type == "plaza" || _type == "unit"
//   6. Projection (GROQ):
//        {
//          "type": _type,
//          "slug": select(_type == "plaza" => slug.current, _type == "unit" => plazaSlug)
//        }
//   7. HTTP method: POST
//   8. HTTP Headers: Authorization: Bearer <SANITY_REVALIDATE_SECRET>
//      (el mismo valor que la env var SANITY_REVALIDATE_SECRET en Vercel)
//   9. API version: v2021-03-25 (o la que sugiera el Studio)
export async function POST(req: NextRequest) {
  const auth = req.headers.get('authorization');
  const secret = process.env.SANITY_REVALIDATE_SECRET;

  if (!secret) {
    console.error('[revalidate] Falta SANITY_REVALIDATE_SECRET en el entorno');
    return NextResponse.json({ error: 'Not configured' }, { status: 500 });
  }
  if (auth !== `Bearer ${secret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  let body: { type?: string; slug?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const { slug } = body;
  if (!slug) {
    return NextResponse.json({ error: 'Falta slug en el payload del webhook' }, { status: 400 });
  }

  // Revalida ambos locales de las dos páginas que muestran datos en vivo de
  // la plaza/local: la ficha pública y el cotizador. /listings/[slug]
  // comparte el mismo FichaPage pero hoy solo lo usa Plaza Lindavista (no
  // Tresor); se revalida también por si acaso, es barato y no rompe nada.
  const paths = [
    `/desarrollos/${slug}`, `/en/desarrollos/${slug}`,
    `/listings/${slug}`, `/en/listings/${slug}`,
    `/cotizar/${slug}`, `/en/cotizar/${slug}`,
  ];
  for (const p of paths) revalidatePath(p);

  return NextResponse.json({ revalidated: true, slug, paths });
}
