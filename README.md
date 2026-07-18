# Tresor Real Estate — tresor.mx

Sitio oficial de Tresor Real Estate: desarrollos propios bajo la marca
**Quattro Plaza Center** (locales comerciales) y desarrollos comercializados
como **Sales Partner** (Live Desarrollos, Onix Living, Urban Homes —
departamentos y lotes) en Cancún, Puerto Cancún, Playa del Carmen y Tulum.

Dominio en producción: `www.tresor.mx` (el apex `tresor.mx` redirige 308 a
`www`). Hosting en Vercel.

Este documento es la referencia completa del proyecto — arquitectura,
integraciones, convenciones y trampas conocidas. Si en algún momento se
retoma este proyecto con otra IA o con otro desarrollador, este archivo
debería bastar para no tener que re-descubrir nada.

## Stack

- **Next.js 15** (App Router, React Server Components), **React 19**, **TypeScript** estricto
- **Tailwind CSS** — design system propio (Switzer + Cormorant Garamond + Javacom para el logotipo)
- **next-intl** — i18n ES/EN
- **Sanity CMS** — inventario en vivo, leads, cuentas de broker, contenido de fichas
- **Stripe Checkout** — apartado en línea ($50,000 MXN, tarjeta + OXXO + SPEI)
- **Resend** — emails transaccionales (notificaciones internas, OTP de brokers)
- **Anthropic (Claude Haiku 4.5)** — chatbot "Luis"
- **Go High Level** — CRM (todos los leads del sitio) + calendario Round Robin (`/agenda`)
- **Vercel** — hosting, Analytics, Speed Insights
- **pnpm** — package manager. Dev server en el puerto **3001** (`pnpm dev`)

## Modelo de datos — lo más importante para entender el proyecto

Todo el portafolio (Quattro + Sales Partner) vive en `src/lib/developments.ts`
como un modelo unificado (`Development`). Cada ficha (`/desarrollos/[slug]`)
se arma con `getDevelopment(slug)`, que fusiona ese modelo estático con datos
ricos de Sanity cuando existen (inventario en vivo por unidad, master plan
interactivo con pines — exclusivo de los desarrollos que Tresor **desarrolla**,
`relationship: 'develop'`, es decir Quattro). Los Sales Partner
(`relationship: 'sales-partner'`) tienen ficha completa pero sin inventario
unidad-por-unidad (solo `priceLabel` + `description` estáticos).

Los módulos de la ficha (galería, amenidades, floor plans, master plan,
cotizador vs. reserva rápida, apartado en línea) se encienden o apagan solos
según qué datos tiene cada desarrollo — agregar un desarrollo nuevo no
requiere tocar el código de la ficha, solo llenar datos (en Sanity, o en
`developments.ts` para los que aún no migran).

**Texto bilingüe (`I18nText`)**: `{ es?: string; en?: string }` en
`src/lib/types.ts`. Ambos campos son **opcionales a propósito** — si `es`
viniera con un default falso (ej. el valor en inglés puesto ahí para "no
perder el dato"), cualquier `campo?.es ?? fallbackReal` más arriba en la
cadena dejaría de activarse (`??` solo cae al fallback con `undefined`, nunca
con un string ya presente aunque esté en el idioma equivocado). El patrón
estándar en toda la UI es `isEs ? x.es : (x.en ?? x.es)`.

## Sitemap (rutas principales)

Todo vive bajo `src/app/[locale]/`. En español no hay prefijo de URL
(`localePrefix: 'as-needed'` en `src/i18n/routing.ts`); en inglés todo lleva
`/en/...`.

| Ruta | Qué es |
|---|---|
| `/` | Home |
| `/desarrollos/[slug]` | Ficha de un desarrollo (Quattro o Sales Partner) |
| `/quattro-plaza-center`, `/live-desarrollos`, `/onix-living`, `/urban-homes` | Landing por desarrollador |
| `/cancun`, `/puerto-cancun`, `/playa-del-carmen`, `/tulum` | Landing por ciudad |
| `/departamentos`, `/locales-comerciales`, `/lotes-residenciales` | Landing por tipo de propiedad |
| `/desarrollo`, `/gestion`, `/comercializacion` | Páginas corporativas (trayectoria, servicios, modelo de comercialización) — contenido fijo, bilingüe |
| `/cotizar/[slug]` | Cotizador multi-paso (solo Quattro, con inventario en vivo) |
| `/agenda` | Formulario de agendar visita — horarios reales del calendario GHL |
| `/reserva/[slug]` | Apartado en línea vía Stripe |
| `/blog` + posts | Contenido fijo, español únicamente |
| `/asesores`, `/asesores/[slug]` | Drive de ventas — equipo interno de Tresor |
| `/brokers`, `/brokers/drive`, `/brokers/drive/[slug]` | Registro + Drive de ventas para brokers externos |
| `/drive/*` | Espejos privados sin login para brokers de confianza (ver abajo) |
| `/studio` | Sanity Studio embebido |

## Autenticación — dos sistemas distintos, no se mezclan

- **Asesores** (equipo interno): una sola cuenta compartida
  (`ASESOR_EMAIL`/`ASESOR_PASSWORD`), cookie HMAC de payload constante.
  Lógica en `src/lib/asesor/`.
- **Brokers** (externos): cuenta real por persona en Sanity
  (`brokerAccount`), password con `bcryptjs`, verificación por código de
  6 dígitos vía Resend (`src/lib/broker/otp.ts`), cookie HMAC firmada
  por-usuario (`brokerId.expiresAt`, distinta de la de asesor). Lógica en
  `src/lib/broker/`.
- Ambos ven el **mismo Drive real** (mismo catálogo, mismos archivos) —
  `AsesoresIndex`/`AsesorDrive` son componentes parametrizables
  (`gate`, `hrefBase`, `fileEndpoint`) reusados por ambos sistemas.
- Un broker autenticado **nunca** activa `isAsesor` en el resto del sitio
  (CTAs de ficha, chat, etc.) — son permisos internos distintos aunque el
  contenido que ven sea el mismo.
- `FloatingLayer.tsx` decide qué botón/widget flotante mostrar según
  sesión + ruta actual (chat de Luis / botón "Drive de Ventas" / nada).

## `/drive/*` — espejos privados para brokers de confianza

Pensado para compartir con brokers que aún no tienen cuenta, sin fricción de
login: la URL en sí es la única protección (no indexado, nunca enlazado
desde ningún lado público).

- `/drive/quattro-plaza-center`, `/drive/live-desarrollos`,
  `/drive/onix-living`, `/drive/urban-homes` — landings espejo de las
  páginas por desarrollador, con el link "Drive de Ventas" siempre visible
  en cada card (sin necesidad de sesión).
- `/drive/[slug]` — espejo de la ficha completa de un desarrollo
  (`src/app/[locale]/drive/[slug]/page.tsx`, reusa el mismo componente que
  `/desarrollos/[slug]` — cero duplicación de markup).
- `/drive/desarrollos/[slug]` — el Drive de archivos (documentos/presentación/
  precios) de un desarrollo específico, abierto sin login
  (`gate={OpenGate}`, `fileEndpoint="/api/drive/file"`).
- En toda esta zona: sin footer, sin barra amarilla de nav, sin chat de
  Luis, sin barra móvil de "Agenda/WhatsApp" — header mínimo
  (`DriveHeader.tsx`, logo sin link + toggle de idioma) vía `ChromeGate.tsx`.
  Todo esto para que nada invite a navegar fuera de la zona compartida.
- Las cards de "Ver desarrollo"/"También te puede interesar" dentro de esta
  zona detectan la ruta actual (`usePathname`) y apuntan a `/drive/{slug}`
  en vez de a la ficha pública — ver `forceDriveLink` en
  `DevelopmentCard.tsx` y `RelatedDevelopments.tsx`.

## Chat "Luis" (`src/app/api/chat/route.ts` + `src/components/Chatbot.tsx`)

- Conoce **todo el portafolio** (Quattro + los 3 Sales Partner), no solo
  Quattro — vía `getMergedDevelopmentsAsync()`.
- Arranque curado por ficha: si se abre desde `/desarrollos/[slug]`, el
  primer mensaje y los quick-replies son específicos de ese desarrollo
  (resuelto vía `/api/dev-name`, sin pasar por el LLM — instantáneo, no
  puede alucinar el nombre).
- Puede **agendar citas reales**: `check_available_slots` trae horarios
  reales del calendario Round Robin de GHL (mismo que usa `/agenda`,
  `src/lib/ghlCalendar.ts`) y los ofrece como botones; `book_appointment`
  confirma la cita de verdad.
- El contacto se crea/actualiza en GHL vía **upsert** (`upsertGHLContact`,
  dedupe por teléfono/email), nunca `create` — el mismo `contactId` viaja
  entre el form previo al chat, `capture_lead` y `book_appointment` para no
  duplicar contactos.
- Tono "directo, sin relleno": máximo 2 oraciones, nunca lista más de 3
  desarrollos de un jalón, cierra seco cualquier pregunta fuera de tema —
  con una excepción explícita para lenguaje de crisis real (responde con la
  Línea de la Vida, sin sarcasmo).
- `GHL_CALENDAR_CONFIGURED` (en `ghlCalendar.ts`) apaga las tools de
  agendar si esas env vars no están puestas — el resto del chat sigue
  funcionando igual.

## Go High Level — convención de tags

Todo lead que llega a GHL (desde cualquier formulario del sitio) lleva:
- **`"Tresor Web"`** siempre, como tag fijo de origen.
- El **slug del desarrollo** de interés como tag adicional, cuando aplica
  (ej. `capture_lead`/`sendLeadToGHL` reciben `devSlug`).

`sendLeadToGHL()` (`src/lib/ghl.ts`) hace `POST /contacts/` (create simple) —
úsala para leads que no necesitan continuidad. `upsertGHLContact()` hace
`POST /contacts/upsert` (dedupe) — úsala en cualquier flujo donde la misma
persona pueda "entrar" más de una vez (el chat, brokers).

## Variables de entorno

Ver `.env.example` para la lista completa y comentada. Resumen por
integración:

| Integración | Variables |
|---|---|
| Sanity | `NEXT_PUBLIC_SANITY_PROJECT_ID`, `NEXT_PUBLIC_SANITY_DATASET`, `SANITY_API_TOKEN` (rol **Editor**, no "Access Manager" — ese no da permiso de escritura) |
| Stripe | `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`, `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET` |
| Asesores | `ASESOR_EMAIL`, `ASESOR_PASSWORD`, `ASESOR_SESSION_SECRET` |
| Brokers | `BROKER_SESSION_SECRET` |
| Anthropic (chat) | `ANTHROPIC_API_KEY` |
| Resend | `RESEND_API_KEY`, `RESEND_FROM_EMAIL`, `LEADS_EMAIL_TO` |
| Go High Level | `GHL_API_KEY` (token de **Private Integration**, no la API key v1 vieja), `GHL_LOCATION_ID`, `GHL_CALENDAR_ID` (calendario Round Robin de `/agenda`) |
| Sitio | `NEXT_PUBLIC_SITE_URL` (afecta metadata/OG/canonical), `NEXT_PUBLIC_WHATSAPP_NUMBER` |

Los secretos de sesión (`*_SESSION_SECRET`) se generan con:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

## Estructura de archivos

```
src/
  app/
    [locale]/                    # rutas i18n (es | en)
      page.tsx                   # Home
      desarrollos/[slug]/        # Ficha por desarrollo (Quattro + Sales Partner)
      cotizar/[slug]/             # Cotizador multi-paso (solo Quattro)
      agenda/, reserva/           # Agendar visita / apartado en línea
      asesores/, brokers/         # Drive de ventas (interno / externo)
      drive/                      # Espejos privados sin login (ver arriba)
      desarrollo/, gestion/, comercializacion/  # Páginas corporativas
      blog/                       # Contenido fijo, español únicamente
    api/
      chat/, chat-lead/, dev-name/    # Chatbot "Luis"
      agenda/, agenda/slots/          # Agendar visita + horarios reales de GHL
      asesor/, broker/                # Auth + archivos del Drive
      drive/file/                     # Archivos del Drive abierto (sin login)
      reserva-rapida/, quote/         # Leads → Sanity + GHL
      stripe/webhook/                 # Marca unidad como apartada
    studio/                      # Sanity Studio embebido
  components/
    ficha/                       # Módulos de la ficha (Amenidades, FloorPlans, etc.)
    asesor/, broker/, commercial/  # Auth, gates, FloatingLayer
    drive/                       # DriveHeader, OpenGate
  lib/
    developments.ts              # Modelo unificado + adaptador getDevelopment()
    ghl.ts, ghlCalendar.ts       # GHL (leads + calendario)
    amenities.ts                 # Catálogo de amenidades (clave → ícono, bilingüe)
    asesor/, broker/             # Sesión, password, OTP, rate limit
    data.ts, types.ts, sanity/   # Capa Sanity (Plaza, Development, queries)
sanity/
  schemas/                       # plaza, development, developer, unit, brokerAccount,
                                  # lead, siteSettings, quote, reservation, driveAsset
  desk.ts                        # Estructura del menú del Studio
scripts/                         # Seeders y migraciones puntuales a Sanity (ver abajo)
content/data/plazas.json         # Fallback estático si Sanity no responde
public/desarrollos/              # Fotos, logos y floor plans por desarrollo
messages/                        # Traducciones ES/EN (next-intl)
```

## Scripts de Sanity (`scripts/`)

Uso: `pnpm tsx scripts/<archivo>.ts` con `SANITY_API_TOKEN` +
`NEXT_PUBLIC_SANITY_PROJECT_ID` + `NEXT_PUBLIC_SANITY_DATASET` en el entorno
(cargar desde `.env.local` con `source <(grep ...)` o similar). Todos usan
`.patch()` puntual, no `createOrReplace` — no pisan campos que no tocan
(imágenes, pines, etc. cargados desde el Studio).

- `seed-sanity.ts` — seed inicial (histórico, ya no se re-corre).
- `migrate-developments-to-sanity.ts` — migración de developments.ts → Sanity.
  ⚠️ Puede ser destructiva si se re-corre sobre slugs ya migrados sin
  confirmar explícitamente — no ejecutar sin revisar qué hace primero.
- `translate-developments-en.ts` / `translate-developments-es-seo.ts` —
  rellenan SEO (title/description) por idioma en los `development` que
  falten. Sirven de plantilla para llenar otros campos bilingües puntuales.
- `fix-null-pins.ts` — limpieza puntual de pines de master plan nulos.

## Quick start

```bash
pnpm install
cp .env.example .env.local   # llena las keys (ver tabla de arriba)
pnpm dev                     # http://localhost:3001
```

## Deploy

Vercel, deploy automático al hacer push a `main` (vía integración GitHub↔Vercel).
Deploy manual:
```bash
vercel link
vercel env pull
vercel --prod
```

## Trampas conocidas / notas operativas

- **Sanity CDN vs. escritura**: el cliente compartido (`src/lib/sanity/client.ts`)
  usa `useCdn: true` en producción por performance general — pero cualquier
  lectura relacionada a auth (¿ya existe este correo?, ¿es correcta esta
  contraseña?) debe ir con `sanityClient.withConfig({ useCdn: false })`,
  si no puede leer datos desactualizados por unos segundos.
- **`Metadata.openGraph`/`.twitter` no hacen merge profundo**: si una página
  define su propio `openGraph`, Next.js **reemplaza el objeto completo** del
  padre — cualquier campo que el padre tenía (ej. `locale`) y la página hija
  no repite, se pierde. `twitter` es un campo **totalmente aparte** de
  `openGraph`: si la página no lo define, hereda el genérico del layout raíz
  completo (título/imagen genérico de Tresor), aunque el `openGraph` de esa
  página esté perfecto. Cuando se agregue una página nueva con imagen propia,
  hay que declarar **ambos** bloques explícitamente.
- **Caché de WhatsApp/Facebook al compartir**: si una URL ya fue compartida
  antes de corregir su metadata, WhatsApp sigue mostrando la vista previa
  vieja hasta que se fuerza un re-scrape: Facebook Sharing Debugger
  (`developers.facebook.com/tools/debug/`) → pegar la URL → "Scrape Again".
  No confundir con un bug de código — verificar primero con `curl` que el
  HTML del servidor ya está bien antes de asumir que es esto.
- **Imágenes de compartir pesadas rompen el LCP**: `next/image` transforma
  cada tamaño del `srcset` on-demand la primera vez que se pide (cache miss
  en el optimizador de Vercel) — entre más pesado el archivo de origen, más
  tarda esa transformación en frío, lo que puede disparar el LCP en
  auditorías de PageSpeed (sobre todo en móvil). Mantener los archivos de
  hero/OG comprimidos desde el origen (calidad ~50 en JPEG suele ser
  indistinguible visualmente y corta el peso a la mitad).
- **`i18n()` en `src/lib/sanity/developments.ts`**: nunca debe rellenar un
  idioma faltante con el valor del otro — si lo hace, cualquier
  `campo?.es ?? fallback` de más arriba deja de activarse porque el campo ya
  no está vacío (aunque esté en el idioma equivocado). Si falta uno de los
  dos, debe quedar genuinamente `undefined`.
- **`GHL_API_KEY` debe ser un token de Private Integration** (Settings →
  Private Integrations en GHL), no la API key v1 vieja (Settings → API
  Keys) — esa ya no funciona con los endpoints usados aquí.
- **El shell de este entorno a veces resuelve mal `curl`/`grep`/`head`/`rm`**
  (comando no encontrado intermitente) — usar rutas absolutas
  (`/usr/bin/curl`, etc.) si algo falla sin razón aparente.
- **Blog y páginas corporativas** (`desarrollo`, `gestion`, `comercializacion`)
  vivían "solo en español" por decisión explícita — ya no aplica a las 3
  corporativas (se tradujeron), pero el blog sigue siendo español únicamente
  a propósito.
