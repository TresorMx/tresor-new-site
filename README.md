# Tresor Real Estate — tresor.mx

Sitio oficial de Tresor Real Estate: desarrollos propios (Quattro) y
desarrollos comercializados como Sales Partner (Live Desarrollos, Onix
Living, Urban Homes) en Cancún y la Riviera Maya.

## Stack

- **Next.js 15** (App Router, RSC)
- **TypeScript** estricto
- **Tailwind CSS** — design system propio (Switzer + Cormorant Garamond)
- **next-intl** — i18n ES/EN
- **Sanity CMS** — inventario en vivo, leads, contenido de fichas (Tresor)
- **Stripe Checkout** — apartado (tarjeta + OXXO + SPEI)
- **Resend** — emails transaccionales
- **Go High Level** — CRM (vía API, leads de todos los formularios)
- **Vercel** — hosting + Analytics + Speed Insights

## Modelo de datos (clave para entender el proyecto)

Todo el portafolio (Tresor + Sales Partner) vive en `src/lib/developments.ts`
como un modelo unificado (`Development`). Cada ficha (`/desarrollos/[slug]`)
se arma con `getDevelopment(slug)`, que fusiona ese modelo con datos ricos
de Sanity cuando existen (inventario en vivo, master plan interactivo —
exclusivo de los desarrollos Tresor). Los módulos de la ficha (galería,
amenidades, floor plans, master plan, cotizador vs. reserva rápida) se
encienden o apagan solos según qué datos tiene cada desarrollo — no hay
que tocar código para agregar un desarrollo nuevo.

## Estructura

```
src/
  app/
    [locale]/                    # i18n routes (es | en)
      page.tsx                   # Home
      desarrollos/[slug]/        # Ficha por desarrollo (Tresor + Sales Partner)
      cotizar/[slug]/            # Cotizador multi-paso (solo Tresor)
      brokers/                   # Portal broker
    api/
      reserva-rapida/            # Lead genérico → Sanity + GHL (Sales Partner)
      chat/                      # Chatbot endpoint
      stripe/webhook/            # Stripe → marca unidad como apartada
    studio/                      # Sanity Studio embebido
  components/
    ficha/                       # Módulos de la ficha (Amenidades, FloorPlans, etc.)
  lib/
    developments.ts              # Modelo unificado + adaptador getDevelopment()
    amenities.ts                 # Catálogo de amenidades (clave → ícono)
    data.ts, types.ts, sanity/   # Capa Sanity/Plaza (Tresor)
public/desarrollos/              # Fotos, logos y floor plans por desarrollo
messages/                        # Traducciones ES/EN
```

## Quick start

```bash
pnpm install
cp .env.example .env.local   # llena las keys (ver checklist abajo)
pnpm dev
```

Abre [http://localhost:3001](http://localhost:3001) (puerto configurado en
`package.json`).

## Checklist de keys antes del deploy

- [ ] Sanity (sanity.io/manage) → `NEXT_PUBLIC_SANITY_PROJECT_ID` + `NEXT_PUBLIC_SANITY_DATASET` + `SANITY_API_TOKEN` (permiso Editor)
- [ ] Stripe → publishable + secret + webhook signing
- [ ] Resend → `RESEND_API_KEY` + dominio verificado
- [ ] Go High Level → API key, Location ID
- [ ] `NEXT_PUBLIC_SITE_URL` → dominio de producción (afecta metadata/OG)

## Deploy

```bash
vercel link
vercel env pull
vercel --prod
```
