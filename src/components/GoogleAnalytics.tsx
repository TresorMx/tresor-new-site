const GA_ID  = 'G-14BFY19YM5';
const ADS_ID = 'AW-17453917774';

// SIN next/script: `strategy="afterInteractive"` inyecta el <script> vía JS
// después de hidratar — nunca aparece como <script> literal en el HTML que
// sirve el servidor. Search Console (y cualquier crawler que no ejecute JS)
// solo ve un <link rel="preload">, no encuentra el tag de GA y la
// verificación por "Google Analytics" falla. Server Component + <script>
// plano SÍ queda en el HTML crudo, que es lo que Search Console revisa.
export default function GoogleAnalytics() {
  return (
    <>
      <script async src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} />
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
