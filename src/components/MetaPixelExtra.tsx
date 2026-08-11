'use client';

import Script from 'next/script';

/**
 * Pixel adicional para una landing específica, sumado al pixel base de
 * MetaPixel.tsx (que ya corre en todo el sitio). Incluye el loader completo
 * de fbq (no solo `init`) a propósito: los <Script afterInteractive> de
 * Next no garantizan orden entre componentes hermanos/anidados, así que no
 * se puede asumir que el pixel base ya definió `window.fbq` para cuando
 * este corra. El loader es idempotente (`if(f.fbq)return`), así que
 * incluirlo dos veces en la página es exactamente el patrón oficial de Meta
 * para varios pixeles y no rompe nada si el otro ya corrió primero. fbq
 * reenvía los eventos posteriores (ej. `track('Lead', ...)` en /gracias) a
 * todos los pixeles inicializados.
 */
export default function MetaPixelExtra({ pixelId }: { pixelId: string }) {
  return (
    <>
      <Script id={`meta-pixel-${pixelId}`} strategy="afterInteractive">
        {`
          !function(f,b,e,v,n,t,s)
          {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
          n.callMethod.apply(n,arguments):n.queue.push(arguments)};
          if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
          n.queue=[];t=b.createElement(e);t.async=!0;
          t.src=v;s=b.getElementsByTagName(e)[0];
          s.parentNode.insertBefore(t,s)}(window, document,'script',
          'https://connect.facebook.net/en_US/fbevents.js');
          fbq('init', '${pixelId}');
          fbq('track', 'PageView');
        `}
      </Script>
      <noscript>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          height="1"
          width="1"
          style={{ display: 'none' }}
          src={`https://www.facebook.com/tr?id=${pixelId}&ev=PageView&noscript=1`}
          alt=""
        />
      </noscript>
    </>
  );
}
