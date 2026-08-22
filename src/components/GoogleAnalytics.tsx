const GA_ID  = 'G-14BFY19YM5';
const ADS_ID = 'AW-17453917774';

// SIN next/script: `strategy="afterInteractive"` inyecta el <script> vía JS
// después de hidratar — nunca aparece como <script> literal en el HTML que
// sirve el servidor. Search Console (y cualquier crawler que no ejecute JS)
// solo ve un <link rel="preload">, no encuentra el tag de GA y la
// verificación por "Google Analytics" falla. Server Component + <script>
// plano SÍ queda en el HTML crudo, que es lo que Search Console revisa.
//
// fetchPriority="low": este script vive en <head>, así que el navegador lo
// descubre antes que la imagen del hero — en 4G lenta (PageSpeed móvil,
// LCP 10.4s) sus ~315 KiB (gtag.js + el fetch de config remota que dispara
// el segundo gtag('config', ...)) compiten por el mismo ancho de banda
// limitado que la imagen que debe pintarse primero. `fetchpriority="low"`
// no mueve el script del <head> (la verificación sigue intacta) — solo le
// dice al navegador que ceda el ancho de banda a los recursos que sí
// bloquean el render. GA sigue disparando exactamente igual, solo un poco
// más tarde en conexiones lentas.
export default function GoogleAnalytics() {
  return (
    <>
      <script async fetchPriority="low" src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} />
      <script
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_ID}');
            gtag('config', '${ADS_ID}');
          `,
        }}
      />
    </>
  );
}
