import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/i18n.ts');

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      { protocol: 'https', hostname: 'cdn.sanity.io' },
      { protocol: 'https', hostname: 'images.unsplash.com' },
    ],
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(self)' },
        ],
      },
      // /drive/* se embebe como iframe dentro de GoHighLevel (crm.tresor.mx)
      // — los navegadores modernos ignoran X-Frame-Options: DENY (arriba)
      // cuando hay una directiva frame-ancestors de CSP, así que basta con
      // agregarla aquí sin tocar la regla global del resto del sitio.
      {
        source: '/drive/:path*',
        headers: [
          { key: 'Content-Security-Policy', value: "frame-ancestors 'self' https://crm.tresor.mx" },
        ],
      },
      {
        source: '/en/drive/:path*',
        headers: [
          { key: 'Content-Security-Policy', value: "frame-ancestors 'self' https://crm.tresor.mx" },
        ],
      },
    ];
  },
  async redirects() {
    return [
      // /plazas/[slug] ya no existe (la ruta real es /desarrollos/[slug]) —
      // estos dos quedaron apuntando a un 404 desde una migración anterior.
      { source: '/long-island', destination: '/desarrollos/long-island', permanent: true },
      { source: '/gardens', destination: '/desarrollos/gardens', permanent: true },
      { source: '/tresor', destination: '/quattro-plaza-center', permanent: true },
      { source: '/en/tresor', destination: '/en/quattro-plaza-center', permanent: true },

      // Vellmari — el slug pasó de 'vellmari-urban' a 'vellmari-puerto-cancun'
      // (URL más limpia y con keyword). 301 para no perder la vieja.
      { source: '/desarrollos/vellmari-urban', destination: '/desarrollos/vellmari-puerto-cancun', permanent: true },
      { source: '/en/desarrollos/vellmari-urban', destination: '/en/desarrollos/vellmari-puerto-cancun', permanent: true },

      // La Selva — mismo criterio: 'la-selva-urban' pasó a
      // 'la-selva-playa-del-carmen' (URL con la keyword de ciudad). La
      // ficha se publicó con el slug viejo hace unos minutos, así que el
      // 301 es preventivo por si Google ya la rastreó.
      { source: '/desarrollos/la-selva-urban', destination: '/desarrollos/la-selva-playa-del-carmen', permanent: true },
      { source: '/en/desarrollos/la-selva-urban', destination: '/en/desarrollos/la-selva-playa-del-carmen', permanent: true },

      // Listings (Plaza Lindavista) vive en /listings/{slug}, no en
      // /desarrollos/{slug} — estuvo ahí ~1 día antes de mover el prefijo.
      { source: '/desarrollos/lindavista-locales', destination: '/listings/lindavista-locales', permanent: true },
      { source: '/en/desarrollos/lindavista-locales', destination: '/en/listings/lindavista-locales', permanent: true },
      { source: '/desarrollos/lindavista-bodegas', destination: '/listings/lindavista-bodegas', permanent: true },
      { source: '/en/desarrollos/lindavista-bodegas', destination: '/en/listings/lindavista-bodegas', permanent: true },

      // /drive/desarrollos solo (sin nada después) no es una página real —
      // manda a home en vez de dejar un 404 que invite a curiosear qué más
      // hay bajo /drive. /drive sí es una página real ahora (índice abierto,
      // ver src/app/[locale]/drive/page.tsx).
      { source: '/drive/desarrollos', destination: '/', permanent: false },
      { source: '/en/drive/desarrollos', destination: '/en', permanent: false },

      // ─────────────────────────────────────────────────────────────
      // Migración del sitio anterior (WordPress) — URLs indexadas en
      // Google que ya no existen tal cual. Mapeadas al mejor equivalente
      // real (no todas van al home): mismo contenido con otro slug,
      // la ficha del mismo desarrollo, la página del desarrollador, o la
      // categoría padre más cercana. Solo van al home las que de verdad
      // no tienen ningún equivalente (proyectos que nunca se lanzaron o
      // ya no existen en el portafolio).
      // ─────────────────────────────────────────────────────────────

      // Fichas de desarrollo — slug viejo (/proyectos/x) → slug real hoy
      { source: '/proyectos/xaviera', destination: '/desarrollos/xaviera-wow-condos', permanent: true },
      { source: '/proyectos/xaviera/xaviera-reserva', destination: '/desarrollos/xaviera-wow-condos', permanent: true },
      { source: '/proyectos/esther', destination: '/desarrollos/esther-wow-condos', permanent: true },
      { source: '/proyectos/esther/esther-reserva', destination: '/desarrollos/esther-wow-condos', permanent: true },
      { source: '/proyectos/olivia', destination: '/desarrollos/olivia-wow-condos', permanent: true },
      { source: '/proyectos/olivia/olivia-reserva', destination: '/desarrollos/olivia-wow-condos', permanent: true },
      { source: '/proyectos/loreta-cancun', destination: '/desarrollos/loreta-wow-condos', permanent: true },
      { source: '/proyectos/loreta-cancun/loreta-reserva', destination: '/desarrollos/loreta-wow-condos', permanent: true },
      { source: '/proyectos/ximena-via-cumbres', destination: '/desarrollos/ximena-wow-condos', permanent: true },
      { source: '/proyectos/ximena-via-cumbres/ximena-reserva', destination: '/desarrollos/ximena-wow-condos', permanent: true },
      { source: '/proyectos/koa-towers', destination: '/desarrollos/koa-onix', permanent: true },
      { source: '/proyectos/villalta', destination: '/desarrollos/villalta-onix', permanent: true },
      { source: '/proyectos/zienna', destination: '/desarrollos/zienna-onix', permanent: true },
      { source: '/proyectos/blume', destination: '/desarrollos/blume-urban', permanent: true },
      { source: '/rentas/blume', destination: '/desarrollos/blume-urban', permanent: true },
      { source: '/proyectos/quattro-plaza-center-gardens', destination: '/desarrollos/gardens', permanent: true },
      // "quattro-plaza" y "quattro-plaza-center" (bajo /proyectos/, sin
      // sufijo de plaza) — todo indica que eran Long Island, la plaza
      // original de la línea Quattro.
      { source: '/proyectos/quattro-plaza', destination: '/desarrollos/long-island', permanent: true },
      { source: '/proyectos/quattro-plaza-center', destination: '/desarrollos/long-island', permanent: true },
      { source: '/quattro-reserve-ahora', destination: '/quattro-plaza-center', permanent: true },

      // Media kits / admin de ventas por proyecto (viejo portal de
      // brokers) → el Drive de Ventas real de asesores para ese mismo
      // desarrollo (ya no hay media kit público, pero es el contenido
      // equivalente más cercano)
      { source: '/brokers/mediakits/xaviera-drive-de-ventas', destination: '/asesores/xaviera-wow-condos', permanent: true },
      { source: '/brokers/mediakits/esther-drive-de-ventas', destination: '/asesores/esther-wow-condos', permanent: true },
      { source: '/brokers/mediakits/loreta-lausana', destination: '/asesores/loreta-wow-condos', permanent: true },
      { source: '/brokers/mediakits/olivia-drive-de-ventas', destination: '/asesores/olivia-wow-condos', permanent: true },
      { source: '/brokers/mediakits/ximena-via-cumbres', destination: '/asesores/ximena-wow-condos', permanent: true },
      { source: '/brokers/mediakits/koa-towers', destination: '/asesores/koa-onix', permanent: true },
      { source: '/brokers/mediakits/villalta', destination: '/asesores/villalta-onix', permanent: true },
      { source: '/brokers/mediakits/zienna-residencial', destination: '/asesores/zienna-onix', permanent: true },
      { source: '/brokers/mediakits/quattro-plaza-drive-de-ventas', destination: '/quattro-plaza-center', permanent: true },
      { source: '/brokers/mediakits/quattro-plaza-gardens', destination: '/desarrollos/gardens', permanent: true },
      { source: '/brokers/mediakits/allure', destination: '/desarrollo', permanent: true },
      { source: '/brokers/mediakits/amira-district-media-kit', destination: '/gestion', permanent: true },
      { source: '/brokers/mediakits/artila-media-kit', destination: '/desarrollo', permanent: true },
      { source: '/brokers/mediakits/kabana-media-kit', destination: '/desarrollo', permanent: true },
      { source: '/brokers/mediakits/coko-media-kit', destination: '/desarrollo', permanent: true },
      { source: '/brokers/mediakits/venus-residences', destination: '/desarrollo', permanent: true },
      { source: '/brokers/mediakits/the-favorite', destination: '/urban-homes', permanent: true },
      { source: '/brokers/mediakits/bardenna', destination: '/onix-living', permanent: true },
      { source: '/brokers/mediakits', destination: '/brokers/drive', permanent: true },

      // Desarrollos "Próximamente" (comingSoon, sin ficha pública hoy) →
      // página del desarrollador correspondiente
      { source: '/proyectos/bardenna', destination: '/onix-living', permanent: true },
      { source: '/proyectos/velmari', destination: '/urban-homes', permanent: true },
      { source: '/proyectos/la-selva-community', destination: '/urban-homes', permanent: true },
      { source: '/proyectos/selva-real', destination: '/urban-homes', permanent: true },

      // Administración de ventas (viejo portal interno por proyecto) →
      // /brokers (portal actual) o la página del desarrollo si aplica
      { source: '/adm-ventas-login', destination: '/brokers', permanent: true },
      { source: '/administracion-de-ventas', destination: '/brokers', permanent: true },
      { source: '/administracion-de-ventas/amira-disctrict-adm-ventas', destination: '/gestion', permanent: true },
      { source: '/administracion-de-ventas/kabana-tulum-adm-ventas', destination: '/desarrollo', permanent: true },
      { source: '/administracion-de-ventas/coko-tulum-adm-ventas', destination: '/desarrollo', permanent: true },
      { source: '/brokers-proyectos', destination: '/brokers', permanent: true },
      { source: '/brokers/politicas-para-brokers', destination: '/brokers', permanent: true },

      // Registro/acceso de brokers (viejo portal) → el registro/login real
      { source: '/brokers/registro-brokers', destination: '/brokers', permanent: true },
      { source: '/brokers/registro-brokers/gracias-registro-brokers', destination: '/brokers', permanent: true },
      // "registro-clientes" era para leads finales, no brokers — el
      // equivalente real es el formulario de agenda/contacto
      { source: '/brokers/registro-clientes', destination: '/agenda', permanent: true },
      { source: '/brokers/registro-clientes/gracias-registro-clientes', destination: '/agenda/gracias', permanent: true },
      { source: '/brokers/agenda-una-visita', destination: '/agenda', permanent: true },
      { source: '/agenda-una-visita', destination: '/agenda', permanent: true },

      // Contacto (la página de agenda ahora hace de contacto también)
      { source: '/contacto', destination: '/agenda', permanent: true },
      { source: '/contacto/gracias-contacto', destination: '/agenda/gracias', permanent: true },

      // Landings de "departamentos en venta" por ciudad/keyword → las
      // landings reales de tipo de propiedad/ciudad.
      //
      // OJO: /departamentos-en-venta-cancun YA NO se redirige. Esa URL del
      // sitio anterior se recuperó como página real (la que ataca
      // "departamentos en venta en cancún"), así que el 301 hacia
      // /departamentos se elimina — si se dejara, la página nueva jamás
      // sería alcanzable y además seguiríamos regalándole a /departamentos
      // las señales históricas de una URL que lleva la keyword exacta.
      { source: '/departamentos-en-venta-cancun/amenidades', destination: '/departamentos-en-venta-cancun', permanent: true },
      { source: '/departamentos-en-venta-cancun/gracias-por-tu-registro', destination: '/agenda/gracias', permanent: true },
      { source: '/departamentos-en-venta-tulum', destination: '/tulum', permanent: true },

      // Proyectos propios de Tresor mencionados en la trayectoria
      // (/desarrollo) que no tienen ficha propia — mismo desarrollo, la
      // sección donde se cuenta su historia
      { source: '/proyectos/kabana-tulum', destination: '/desarrollo', permanent: true },
      { source: '/luna-media-kit', destination: '/desarrollo', permanent: true },
      { source: '/proyectos/luna-residence', destination: '/desarrollo', permanent: true },
      { source: '/proyectos/coko-tulum', destination: '/desarrollo', permanent: true },
      { source: '/proyectos/amira-district-tulum', destination: '/gestion', permanent: true },
      { source: '/allure-puerto-cancun', destination: '/desarrollo', permanent: true },
      { source: '/rentas/allure', destination: '/desarrollo', permanent: true },
      { source: '/listings/allure-3-recamaras', destination: '/desarrollo', permanent: true },
      { source: '/proyectos/la-vela', destination: '/desarrollo', permanent: true },

      // Páginas fijas con slug distinto hoy
      { source: '/politicas-de-privacidad', destination: '/privacidad', permanent: true },
      { source: '/home-tresor', destination: '/', permanent: true },
      { source: '/en/home-tresor', destination: '/en', permanent: true },
      // /desarrollos YA NO redirige: ahora es una página real (ver
      // src/app/[locale]/desarrollos/page.tsx). Mandarla a un ancla del home
      // costaba ~310 impresiones/mes del clúster "desarrollos …" en posiciones
      // 33-47 sin un solo clic — el home no puede rankear para una consulta
      // de categoría. /proyectos sí sigue redirigiendo, pero ahora al hub real
      // en vez de al ancla.
      { source: '/proyectos', destination: '/desarrollos', permanent: true },

      // /listings ahora es una sección real (ver src/app/[locale]/listings) —
      // ya NO redirige a casa. Los slugs viejos de la funcionalidad retirada
      // (WordPress) siguen sin equivalente, así que esos sí van al home.
      { source: '/listings/isola', destination: '/', permanent: true },
      { source: '/rentas', destination: '/', permanent: true },
      { source: '/rentas/isola', destination: '/', permanent: true },

      // Proyectos de terceros / de otras épocas sin ningún rastro en el
      // portafolio actual — sin equivalente real, van al home
      { source: '/sample-page', destination: '/', permanent: true },
      { source: '/artes-internos', destination: '/', permanent: true },
      { source: '/deelum-media-kit', destination: '/', permanent: true },
      { source: '/eventos', destination: '/', permanent: true },
      { source: '/proyectos/artila-tulum', destination: '/', permanent: true },
      { source: '/proyectos/casa-cinq', destination: '/', permanent: true },
      { source: '/proyectos/casa-siet', destination: '/', permanent: true },
      { source: '/venus-tulum-2', destination: '/', permanent: true },
      { source: '/proyectos/venus-aldea-zama', destination: '/', permanent: true },
      { source: '/proyectos/mayakoba-country-club', destination: '/', permanent: true },
      { source: '/proyectos/tierra-madre', destination: '/', permanent: true },
      { source: '/proyectos/lomas-aurora', destination: '/', permanent: true },
      { source: '/proyectos/gran-coralia', destination: '/', permanent: true },
      { source: '/proyectos/anthar', destination: '/', permanent: true },
      { source: '/proyectos/menesse-condos', destination: '/', permanent: true },
      { source: '/proyectos/saint-marine', destination: '/', permanent: true },
      { source: '/proyectos/punta-laguna', destination: '/', permanent: true },
      { source: '/proyectos/sonni', destination: '/', permanent: true },
      { source: '/proyectos/paravian', destination: '/', permanent: true },
      { source: '/proyectos/sls-bahia-beach', destination: '/', permanent: true },
      { source: '/proyectos/woha', destination: '/', permanent: true },
      { source: '/distrito-xcalacoco-beach', destination: '/', permanent: true },
    ];
  },
};

export default withNextIntl(nextConfig);
