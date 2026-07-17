import { NextRequest, NextResponse } from 'next/server';
import { getMergedDevelopmentsAsync } from '@/lib/developments';

export const runtime = 'nodejs';

// Lookup ligero: el nombre de un desarrollo por su slug de ruta — usado por
// el Chatbot para armar el arranque curado por ficha sin depender del LLM
// (rápido, sin costo de tokens, sin riesgo de alucinar el nombre).
export async function GET(req: NextRequest) {
  const slug = req.nextUrl.searchParams.get('slug');
  if (!slug) return NextResponse.json({ error: 'slug requerido' }, { status: 400 });

  const devs = await getMergedDevelopmentsAsync();
  const dev = devs.find((d) => d.href === `/desarrollos/${slug}`);
  if (!dev) return NextResponse.json({ error: 'not found' }, { status: 404 });

  return NextResponse.json({ name: dev.name });
}
