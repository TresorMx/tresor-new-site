import { defineField, defineType } from 'sanity';
import { amenityOptions } from '../../src/lib/amenities';
import { driveFields } from './driveFields';

// Presets de tamaño de logo — el número que se guarda es el mismo factor de
// escala que ya usa el código (1 = normal), pero el editor nunca ve el
// número: elige un botón con nombre. Nada de "súbelo a 1.2, bájalo a 0.7".
const LOGO_SIZE_PRESETS = [
  { title: 'Muy chico', value: 0.5 },
  { title: 'Chico', value: 0.7 },
  { title: 'Normal', value: 1 },
  { title: 'Grande', value: 1.3 },
  { title: 'Muy grande', value: 1.6 },
];

// Ficha de un desarrollo — hoy pensado para Sales Partner (Olivia, Koa,
// Zienna, Blume…), pero el mismo tipo sirve para cualquier desarrollo que no
// necesite inventario por unidad. Los desarrollos Tresor con cotizador real
// (Long Island, Gardens) siguen viviendo en `plaza` — son cosas distintas a
// propósito, no se mezclan.
//
// Cada módulo de la ficha (galería, amenidades, tipologías, contenido
// editorial…) se enciende solo si el campo tiene datos — deja lo que no
// aplique vacío, no "hay que rellenar todo para que se vea bien".
export default defineType({
  name: 'development',
  title: 'Desarrollo',
  type: 'document',
  groups: [
    { name: 'basic',       title: 'General',              default: true },
    { name: 'hero',        title: '🖼️ Hero y logo' },
    { name: 'texts',       title: '📝 Contenido' },
    { name: 'media',       title: '📸 Galería' },
    { name: 'amenities',   title: '🏊 Amenidades' },
    { name: 'floorplans',  title: '📐 Tipologías' },
    { name: 'content',     title: '📄 Módulos extra' },
    { name: 'reservation', title: '💳 Apartado y botones' },
    { name: 'drive',       title: '🔒 Drive de Ventas' },
    { name: 'seo',         title: '🔍 SEO' },
  ],
  fields: [

    // ── GENERAL ──────────────────────────────────────────────────
    defineField({ name: 'name', title: 'Nombre del desarrollo', type: 'string', group: 'basic', validation: (r) => r.required() }),
    defineField({
      name: 'slug', title: 'Slug (URL)', type: 'slug', group: 'basic',
      options: { source: 'name', maxLength: 60 },
      description: 'Se usa en la URL: tresor.mx/desarrollos/ESTO. No lo cambies después de publicar — rompe el link.',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'developer', title: 'Desarrollador', type: 'reference', group: 'basic',
      to: [{ type: 'developer' }],
      description: 'Elige de la lista. Si el desarrollador no existe, créalo primero en "Desarrollador" (menú lateral) — así lo editas una sola vez y se actualiza en todas sus fichas.',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'relationship', title: 'Relación con Tresor', type: 'string', group: 'basic',
      options: {
        list: [
          { title: 'Tresor desarrolla (WE DEVELOP)', value: 'develop' },
          { title: 'Sales Partner (Tresor solo vende)', value: 'sales-partner' },
          { title: 'Listado / reventa', value: 'listings' },
          { title: 'Renta', value: 'rentals' },
        ],
        layout: 'radio',
      },
      description: 'Controla en qué sección del home aparece el card.',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'status', title: 'Estatus comercial', type: 'string', group: 'basic',
      options: {
        list: [
          { title: 'Preventa', value: 'Preventa' },
          { title: 'Lanzamiento', value: 'Lanzamiento' },
          { title: 'Entrega inmediata', value: 'Entrega inmediata' },
          { title: 'Próximamente', value: 'Próximamente' },
        ],
        layout: 'radio',
      },
      description: 'Se muestra como badge sobre la foto del card (a menos que pongas un texto distinto abajo en "Badge").',
    }),
    defineField({ name: 'badge', title: 'Badge (override)', type: 'string', group: 'basic', description: 'Solo si quieres que el badge diga algo distinto al Estatus de arriba. Normalmente déjalo vacío.' }),
    defineField({ name: 'comingSoon', title: 'Próximamente (CTA desactivado)', type: 'boolean', group: 'basic', initialValue: false, description: 'Actívalo si el desarrollo aún no tiene información suficiente para publicarse del todo — el card se ve pero el botón sale apagado.' }),
    defineField({ name: 'featured', title: 'Destacado en el home', type: 'boolean', group: 'basic', initialValue: true }),
    defineField({
      name: 'propertyType', title: 'Tipo de propiedad', type: 'string', group: 'basic',
      options: { list: ['Departamento', 'Casa', 'Lote Residencial', 'Local Comercial'] },
      description: 'Define el ícono del card (edificio, casa, terreno, tienda).',
    }),
    defineField({
      name: 'intent', title: '¿Para qué se busca?', type: 'array', group: 'basic',
      of: [{ type: 'string' }],
      options: { list: ['vivir', 'invertir'], layout: 'tags' },
    }),
    defineField({ name: 'city', title: 'Ciudad', type: 'string', group: 'basic', options: { list: ['Cancún', 'Puerto Cancún', 'Puerto Morelos', 'Playa del Carmen', 'Tulum'] } }),
    defineField({ name: 'zone', title: 'Zona / colonia', type: 'string', group: 'basic', description: 'Ej: "Zona Huayacán". Aparece junto a la ciudad si no hay dirección completa en Ubicación.' }),
    defineField({
      name: 'location', title: 'Coordenadas y dirección', type: 'object', group: 'basic',
      description: 'Opcional. Si NO tienes coordenadas exactas, deja todo vacío — la ficha muestra Zona + Ciudad en texto sin mapa, en vez de arriesgar un pin mal puesto. Para sacarlas: abre Google Maps, click derecho sobre la ubicación exacta, y copia los dos números que aparecen arriba del menú (el primero es Latitud, el segundo Longitud).',
      fields: [
        { name: 'lat', type: 'number', title: 'Latitud' },
        { name: 'lng', type: 'number', title: 'Longitud' },
        { name: 'address', type: 'string', title: 'Dirección completa' },
      ],
    }),
    defineField({ name: 'priceLabel', title: 'Precio (texto)', type: 'string', group: 'basic', description: 'Ej: "Desde $2,650,000 MXN + IVA". Se muestra tal cual en el card y en la ficha.' }),
    defineField({ name: 'description', title: 'Descripción corta', type: 'text', rows: 3, group: 'basic', description: 'Aparece en el card del home y se usa como respaldo del SEO si no llenas la pestaña 🔍 SEO.' }),

    // ── HERO Y LOGO ──────────────────────────────────────────────
    defineField({ name: 'image', title: 'Foto del card (home)', type: 'image', group: 'hero', options: { hotspot: true }, description: 'La que se ve en el card del home. Arrastra el círculo sobre lo importante de la foto — así se recorta bien en cualquier pantalla.' }),
    defineField({ name: 'logo', title: 'Logo del card (home)', type: 'image', group: 'hero' }),
    defineField({
      name: 'logoScale', title: 'Tamaño del logo del card', type: 'number', group: 'hero',
      initialValue: 1,
      options: { list: LOGO_SIZE_PRESETS, layout: 'radio' },
      description: '¿Cómo se ve el logo sobre la foto del card? Elige un tamaño.',
    }),
    defineField({ name: 'heroRender', title: 'Foto grande del hero (ficha)', type: 'image', group: 'hero', options: { hotspot: true }, description: 'La foto de pantalla completa al entrar a la ficha. Si la dejas vacía, se usa la misma foto del card.' }),
    defineField({
      name: 'heroLogoScale', title: 'Tamaño del logo del hero — desktop', type: 'number', group: 'hero',
      initialValue: 1,
      options: { list: LOGO_SIZE_PRESETS, layout: 'radio' },
      description: '¿Cómo se ve el logo grande al entrar a la ficha, en computadora?',
    }),
    defineField({
      name: 'heroLogoScaleMobile', title: 'Tamaño del logo del hero — celular', type: 'number', group: 'hero',
      options: { list: LOGO_SIZE_PRESETS, layout: 'radio' },
      description: 'Solo si en el celular se ve muy grande o muy chico comparado con la computadora. Si no eliges nada, el celular usa automáticamente un tamaño más chico que el de arriba.',
    }),

    // ── CONTENIDO ────────────────────────────────────────────────
    defineField({ name: 'tagline', title: 'Tagline / eslogan (ES)', type: 'string', group: 'texts', description: 'Frase corta de marca. No se ve en pantalla, se usa para SEO/redes si no llenas Meta Description.' }),
    defineField({ name: 'taglineEn', title: 'Tagline / eslogan (EN)', type: 'string', group: 'texts' }),
    defineField({
      name: 'projectTitle', title: '📌 Título "El Proyecto" — parte fija (ES)', type: 'string', group: 'texts',
      description: 'Primera parte del título grande de la sección de contenido. Ej: "Departamentos con impresionantes vistas"',
    }),
    defineField({ name: 'projectTitleEn', title: '📌 Título "El Proyecto" — parte fija (EN)', type: 'string', group: 'texts' }),
    defineField({
      name: 'projectTitleMuted', title: '📌 Título "El Proyecto" — parte en gris (ES)', type: 'string', group: 'texts',
      description: 'Segunda parte del título, se muestra en gris. Ej: "en Cancún"',
    }),
    defineField({ name: 'projectTitleMutedEn', title: '📌 Título "El Proyecto" — parte en gris (EN)', type: 'string', group: 'texts' }),
    defineField({
      name: 'projectBody1', title: '📝 Párrafo 1 — qué es el desarrollo (ES)', type: 'text', rows: 3, group: 'texts',
      description: 'El sitio antepone el nombre del desarrollo antes de este texto. Empieza en minúscula, ej: "es un desarrollo de Live Desarrollos ubicado dentro de..."  Puedes poner **dos asteriscos** alrededor de una palabra o cifra para resaltarla en negrita.',
    }),
    defineField({ name: 'projectBody1En', title: '📝 Párrafo 1 — qué es el desarrollo (EN)', type: 'text', rows: 3, group: 'texts' }),
    defineField({
      name: 'projectBody2', title: '📝 Párrafo 2 — para quién / amenidades (ES)', type: 'text', rows: 3, group: 'texts',
      description: 'Igual acepta **negritas** con doble asterisco.',
    }),
    defineField({ name: 'projectBody2En', title: '📝 Párrafo 2 — para quién / amenidades (EN)', type: 'text', rows: 3, group: 'texts' }),
    defineField({ name: 'bullet1', title: '📍 Ventaja de ubicación 1 (ES)', type: 'string', group: 'texts' }),
    defineField({ name: 'bullet1En', title: '📍 Ventaja de ubicación 1 (EN)', type: 'string', group: 'texts' }),
    defineField({ name: 'bullet2', title: '📍 Ventaja de ubicación 2 (ES)', type: 'string', group: 'texts' }),
    defineField({ name: 'bullet2En', title: '📍 Ventaja de ubicación 2 (EN)', type: 'string', group: 'texts' }),
    defineField({ name: 'bullet3', title: '📍 Ventaja de ubicación 3 (ES)', type: 'string', group: 'texts' }),
    defineField({ name: 'bullet3En', title: '📍 Ventaja de ubicación 3 (EN)', type: 'string', group: 'texts' }),
    defineField({
      name: 'highlights', title: 'Datos clave (barra bajo el hero)', type: 'array', group: 'texts',
      description: 'Hasta 3 datos rápidos, ej: Ubicación / Tipología / Recámaras.',
      of: [{
        type: 'object', name: 'developmentHighlight',
        fields: [
          { name: 'label', title: 'Etiqueta (ES)', type: 'string', validation: (r: any) => r.required() },
          { name: 'labelEn', title: 'Etiqueta (EN)', type: 'string' },
          { name: 'value', title: 'Valor (ES)', type: 'string', validation: (r: any) => r.required() },
          { name: 'valueEn', title: 'Valor (EN)', type: 'string' },
        ],
        preview: { select: { title: 'value', subtitle: 'label' } },
      }],
      validation: (r) => r.max(3),
    }),

    // ── GALERÍA ──────────────────────────────────────────────────
    defineField({
      name: 'gallery', title: 'Galería general', type: 'array', group: 'media',
      description: 'Fotos del recorrido general (fachada, exteriores, interiores). No repitas la foto del hero aquí.',
      of: [{ type: 'image', options: { hotspot: true } }],
    }),
    defineField({
      name: 'galleryTourUrl', title: 'Tour Virtual de la galería', type: 'url', group: 'media',
      description: 'Opcional. Si lo llenas, en el módulo Galería aparece un botón "Tour Virtual" (abre esta liga en una ventana emergente) en vez de la etiqueta "Galería del Proyecto".',
    }),
    defineField({
      name: 'amenitiesGallery', title: 'Galería de amenidades', type: 'array', group: 'media',
      description: 'Fotos específicas de alberca, gym, casa club, etc. — se muestran junto al listado de amenidades. Si dejas 1 sola foto, se ve como foto única sin flechas.',
      of: [{ type: 'image', options: { hotspot: true } }],
    }),

    // ── AMENIDADES ───────────────────────────────────────────────
    defineField({
      name: 'amenities', title: 'Amenidades', type: 'array', group: 'amenities',
      description: 'Elige de la lista — el ícono aparece solo. Usa "Texto alternativo" solo si quieres que diga algo distinto al nombre de catálogo (ej. "2 canchas de pádel" en vez de "Cancha de pádel").',
      of: [{
        type: 'object', name: 'amenity',
        fields: [
          {
            name: 'key', title: 'Amenidad', type: 'string',
            options: { list: amenityOptions.map((o) => ({ title: o.title, value: o.key })) },
            validation: (r: any) => r.required(),
          },
          { name: 'labelOverride', title: 'Texto alternativo (ES) — opcional', type: 'string' },
          { name: 'labelOverrideEn', title: 'Texto alternativo (EN) — opcional', type: 'string' },
        ],
        preview: {
          select: { key: 'key', override: 'labelOverride' },
          prepare: ({ key, override }: any) => ({ title: override || key }),
        },
      }],
    }),

    // ── TIPOLOGÍAS ───────────────────────────────────────────────
    defineField({
      name: 'floorPlans', title: 'Tipologías', type: 'array', group: 'floorplans',
      description: 'Con 5 tipologías o menos se muestran como pestañas; con más, como chips que envuelven en varias filas — no tienes que preocuparte por cuál usar, el sitio elige solo.',
      of: [{
        type: 'object', name: 'floorPlanTypology',
        fields: [
          { name: 'label', title: 'Nombre completo (ES)', type: 'string', description: 'Ej: "1 Recámara + 1 Studio". Se muestra en la ficha técnica grande.', validation: (r: any) => r.required() },
          { name: 'labelEn', title: 'Nombre completo (EN)', type: 'string' },
          { name: 'shortLabel', title: 'Nombre corto para la pestaña (ES)', type: 'string', description: 'Ej: "1 Rec. + Studio". Si lo dejas vacío, la pestaña usa el nombre completo de arriba.' },
          { name: 'shortLabelEn', title: 'Nombre corto para la pestaña (EN)', type: 'string' },
          { name: 'image', title: 'Plano', type: 'image', description: 'Si no tienes el plano todavía, déjalo vacío — se muestran solo los datos de abajo.' },
          {
            name: 'specs', title: 'Datos (m², recámaras, baños…)', type: 'array',
            description: 'Agrega los que apliquen, en el orden en que quieres que se vean. Ej: "Interior" → "233.45 m²".',
            of: [{
              type: 'object', name: 'floorPlanSpec',
              fields: [
                { name: 'label', title: 'Etiqueta (ES)', type: 'string', validation: (r: any) => r.required() },
                { name: 'labelEn', title: 'Etiqueta (EN)', type: 'string' },
                { name: 'value', title: 'Valor', type: 'string', description: 'Texto libre — ej: "233.45 m²", "2", "Sí".', validation: (r: any) => r.required() },
              ],
              preview: { select: { title: 'value', subtitle: 'label' } },
            }],
          },
          { name: 'virtualTourUrl', title: 'Link de tour virtual', type: 'url', description: 'Si lo llenas, aparece el botón "Tour virtual". Si lo dejas vacío, no aparece.' },
        ],
        preview: { select: { title: 'label', subtitle: 'shortLabel', media: 'image' } },
      }],
    }),

    // ── MÓDULOS EXTRA (contenido editorial genérico) ──────────────
    defineField({
      name: 'contentBlocks', title: 'Módulos de contenido', type: 'array', group: 'content',
      description: 'Para historias que no encajan en ningún módulo fijo (conectividad, sustentabilidad, casa club, etc.). Puedes agregar los que quieras, en el orden en que aparecen.',
      of: [{
        type: 'object', name: 'contentBlock',
        fields: [
          { name: 'eyebrow', title: 'Eyebrow — texto chico arriba del título (ES)', type: 'string', description: 'Ej: "— Casa club"' },
          { name: 'eyebrowEn', title: 'Eyebrow (EN)', type: 'string' },
          { name: 'title', title: 'Título — parte fija (ES)', type: 'string', validation: (r: any) => r.required() },
          { name: 'titleEn', title: 'Título — parte fija (EN)', type: 'string' },
          { name: 'titleMuted', title: 'Título — parte en gris (ES)', type: 'string', description: 'Opcional. Ej: si el título fijo es "Diseño en conexión", esto sería "con la naturaleza".' },
          { name: 'titleMutedEn', title: 'Título — parte en gris (EN)', type: 'string' },
          { name: 'description', title: 'Descripción (ES)', type: 'text', rows: 4, description: 'Acepta **negritas** con doble asterisco.', validation: (r: any) => r.required() },
          { name: 'descriptionEn', title: 'Descripción (EN)', type: 'text', rows: 4 },
          { name: 'image', title: 'Imagen', type: 'image', options: { hotspot: true }, description: 'Opcional. Sin imagen, el bloque se muestra como texto centrado.' },
          {
            name: 'imageFit', title: 'Ajuste de la imagen', type: 'string',
            options: { list: [{ title: 'Rellenar y recortar (fotos normales)', value: 'cover' }, { title: 'Completa sin recortar (renders/planos con fondo transparente)', value: 'contain' }], layout: 'radio' },
            description: 'Default: "Rellenar y recortar". Usa "Completa sin recortar" para imágenes con fondo transparente o que no deben cortarse.',
          },
          {
            name: 'imageWidth', title: 'Ancho de la columna de imagen', type: 'string',
            options: { list: [{ title: 'Normal (50/50 con el texto)', value: 'normal' }, { title: 'Ancha (como el mapa de Ubicación)', value: 'wide' }], layout: 'radio' },
            description: 'Solo aplica en diseño "2 columnas". Usa "Ancha" para master plans/planos que se ven chicos a la mitad del ancho.',
            hidden: ({ parent }: any) => parent?.layout === 'stacked',
          },
          {
            name: 'layout', title: 'Diseño', type: 'string',
            options: { list: [{ title: '2 columnas (imagen a un lado)', value: 'side-by-side' }, { title: 'Apilado (imagen abajo, ancho completo)', value: 'stacked' }], layout: 'radio' },
            description: 'Si no eliges, con imagen usa "2 columnas" automáticamente.',
          },
          {
            name: 'imagePosition', title: 'Lado de la imagen', type: 'string',
            options: { list: [{ title: 'Derecha', value: 'right' }, { title: 'Izquierda', value: 'left' }], layout: 'radio' },
            description: 'Solo aplica en diseño "2 columnas". Default: derecha.',
            hidden: ({ parent }: any) => parent?.layout === 'stacked',
          },
          {
            name: 'ctaLabel', title: 'Botón — texto (ES)', type: 'string',
            description: 'Opcional. Ej: "Vista Panorámica". Si lo dejas vacío, no aparece botón. Abre el link en una ventana emergente, igual que "Tour virtual".',
          },
          { name: 'ctaLabelEn', title: 'Botón — texto (EN)', type: 'string' },
          {
            name: 'ctaUrl', title: 'Botón — link', type: 'url',
            description: 'La URL del tour/vista panorámica que abre el botón.',
            hidden: ({ parent }: any) => !parent?.ctaLabel,
          },
        ],
        preview: { select: { title: 'title', subtitle: 'eyebrow', media: 'image' } },
      }],
    }),

    // ── APARTADO Y BOTONES ───────────────────────────────────────
    defineField({
      name: 'reservationEnabled', title: '¿Apartado en línea activo?', type: 'boolean', group: 'reservation',
      initialValue: false,
      description: 'Actívalo para que la ficha muestre el tab "Aparta ahora" con pago real por Stripe. Si está apagado, solo se ve "Agenda una visita".',
    }),
    defineField({
      name: 'reservationAmount', title: 'Monto del apartado (MXN)', type: 'number', group: 'reservation',
      description: 'Si lo dejas vacío: $50,000 automático si el desarrollador es Tresor, $25,000 para todos los demás.',
      hidden: ({ parent }: any) => !parent?.reservationEnabled,
    }),
    defineField({
      name: 'ctaScheduleVisit', title: 'Texto botón "Agendar visita" (ES) — opcional', type: 'string', group: 'reservation',
      description: 'Si lo dejas vacío, dice "Agendar una visita".',
    }),
    defineField({ name: 'ctaScheduleVisitEn', title: 'Texto botón "Agendar visita" (EN) — opcional', type: 'string', group: 'reservation' }),
    defineField({
      name: 'ctaVirtualTour', title: 'Texto botón "Tour virtual" (ES) — opcional', type: 'string', group: 'reservation',
      description: 'Si lo dejas vacío, dice "Tour virtual".',
    }),
    defineField({ name: 'ctaVirtualTourEn', title: 'Texto botón "Tour virtual" (EN) — opcional', type: 'string', group: 'reservation' }),

    // ── DRIVE DE VENTAS (solo asesores logueados) ──────────────────
    ...driveFields,

    // ── SEO ──────────────────────────────────────────────────────
    defineField({ name: 'seoTitle', title: 'SEO Title (ES)', type: 'string', group: 'seo', description: 'Si se deja vacío usa el nombre del desarrollo. Recomendado: 50-60 caracteres.', validation: (r) => r.max(60) }),
    defineField({ name: 'seoTitleEn', title: 'SEO Title (EN)', type: 'string', group: 'seo', validation: (r) => r.max(60) }),
    defineField({ name: 'seoDescription', title: 'Meta Description (ES)', type: 'text', rows: 3, group: 'seo', description: 'Si se deja vacío usa la Descripción corta de la pestaña General. Recomendado: 140-160 caracteres.', validation: (r) => r.max(160) }),
    defineField({ name: 'seoDescriptionEn', title: 'Meta Description (EN)', type: 'text', rows: 3, group: 'seo', validation: (r) => r.max(160) }),
  ],

  preview: {
    select: { title: 'name', subtitle: 'priceLabel', media: 'image' },
  },
});
