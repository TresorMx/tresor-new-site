/**
 * Estructura del sidebar del Studio.
 * Nombrado desk.ts para evitar colisión circular con el módulo npm 'sanity/structure'
 * cuando baseUrl="." está configurado en tsconfig.
 *
 * El tipo de `S` se infiere en runtime desde structureTool({ structure });
 * TS no puede resolver sanity/structure types via exports map (falta condición "types"),
 * así que usamos any acotado — seguro en runtime.
 *
 * Organizado por categoría de negocio, no por orden de creación — cada vez
 * que se agregue un tipo de documento nuevo, entra aquí en su categoría, no
 * al final de una lista plana. Grupos:
 *   1) Portafolio — todo lo que es una ficha o entidad de un desarrollo
 *   2) Actividad comercial — el embudo real: leads → cotizaciones → apartados
 *   3) Brokers
 *   4) Configuración
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const structure = (S: any) =>
  S.list()
    .title('Tresor Real Estate — Contenido')
    .items([
      // ── 1) PORTAFOLIO ──────────────────────────────────────────
      S.listItem()
        .title('🏬 Plazas (Quattro)')
        .child(
          S.documentTypeList('plaza')
            .title('Plazas')
            .defaultOrdering([{ field: 'name', direction: 'asc' }])
        ),

      S.listItem()
        .title('🏪 Locales (Quattro)')
        .child(
          S.documentTypeList('unit')
            .title('Locales')
            .defaultOrdering([{ field: 'code', direction: 'asc' }])
        ),

      S.listItem()
        .title('🏗️ Desarrollos (Sales Partner y otros)')
        .child(
          S.documentTypeList('development')
            .title('Desarrollos')
            .defaultOrdering([{ field: 'name', direction: 'asc' }])
        ),

      S.listItem()
        .title('🧑‍💼 Desarrolladores')
        .child(
          S.documentTypeList('developer')
            .title('Desarrolladores')
            .defaultOrdering([{ field: 'name', direction: 'asc' }])
        ),

      S.divider(),

      // ── 2) ACTIVIDAD COMERCIAL — orden de embudo real ──────────
      S.listItem()
        .title('👥 Leads')
        .child(
          S.documentTypeList('lead')
            .title('Leads')
            .defaultOrdering([{ field: 'createdAt', direction: 'desc' }])
        ),

      S.listItem()
        .title('🧾 Cotizaciones')
        .child(
          S.documentTypeList('quote')
            .title('Cotizaciones')
            .defaultOrdering([{ field: 'createdAt', direction: 'desc' }])
        ),

      S.listItem()
        .title('💳 Apartados')
        .child(
          S.documentTypeList('reservation')
            .title('Apartados')
            .defaultOrdering([{ field: 'createdAt', direction: 'desc' }])
        ),

      S.divider(),

      // ── 3) BROKERS ──────────────────────────────────────────────
      S.listItem()
        .title('📁 Drive de brokers')
        .child(S.documentTypeList('brokerDoc').title('Documentos')),

      S.divider(),

      // ── 4) CONFIGURACIÓN ─────────────────────────────────────────
      S.listItem()
        .title('⚙️ Configuración del sitio')
        .child(
          S.document()
            .schemaType('siteSettings')
            .documentId('siteSettings')
        ),
    ]);
