import { ImageResponse } from 'next/og';
import { getPlazaBySlugAsync } from '@/lib/data';

export const runtime = 'nodejs';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';
export const alt = 'Tresor Real Estate';

// Minimalista, mismo tratamiento que el card del home: foto de fondo con
// overlay oscuro + logo blanco centrado. Nada de texto, pills ni precio.
export default async function OG({
  params,
}: {
  params: Promise<{ slug: string; locale: string }>;
}) {
  const { slug } = await params;
  const plaza = await getPlazaBySlugAsync(slug);
  if (!plaza) return new Response('', { status: 404 });

  return new ImageResponse(
    (
      <div
        style={{
          width: 1200,
          height: 630,
          display: 'flex',
          background: '#16151C',
          position: 'relative',
        }}
      >
        {/* Foto de fondo */}
        {plaza.heroRender && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={plaza.heroRender}
            alt=""
            style={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
            }}
          />
        )}

        {/* Overlay oscuro para legibilidad del logo (igual que el card) */}
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex' }} />

        {/* Logo centrado en buen tamaño */}
        {plaza.logoWhite && (
          <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={plaza.logoWhite}
              alt={plaza.name}
              style={{ height: 220, width: 'auto', maxWidth: 760, objectFit: 'contain' }}
            />
          </div>
        )}
      </div>
    ),
    size,
  );
}
