import type { SVGProps } from 'react';

// Perfiles oficiales de Tresor — ÚNICA fuente. La usan el footer (íconos) y
// el schema de la organización en layout.tsx (`sameAs`), así nunca se
// desincronizan: si cambia un perfil, se cambia aquí y se actualizan los dos.
//
// `sameAs` es de las señales más fuertes para GEO/SEO de entidad: le dice a
// Google y a los motores de IA "estos perfiles son esta misma empresa".
//
// Íconos: trazos copiados de lucide-react 0.475 (licencia ISC), NO importados
// de la librería — Lucide deprecó sus íconos de marca y los va a eliminar; con
// `^0.475.0` en package.json un install futuro podría quitarlos y tumbar el
// build. Mismo look que el resto de íconos del sitio (stroke, 24×24).
type IconProps = SVGProps<SVGSVGElement> & { size?: number };

function Svg({ size = 16, strokeWidth = 1.6, children, ...rest }: IconProps & { children: React.ReactNode }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24"
      fill="none" stroke="currentColor" strokeWidth={strokeWidth}
      strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...rest}
    >
      {children}
    </svg>
  );
}

const InstagramIcon = (p: IconProps) => (
  <Svg {...p}>
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </Svg>
);

const FacebookIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </Svg>
);

const LinkedinIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect width="4" height="12" x="2" y="9" />
    <circle cx="4" cy="4" r="2" />
  </Svg>
);

export const SOCIAL_PROFILES = [
  { name: 'Instagram', url: 'https://www.instagram.com/tresor_realestate/', Icon: InstagramIcon },
  { name: 'Facebook', url: 'https://www.facebook.com/TresorRealEstate/', Icon: FacebookIcon },
  { name: 'LinkedIn', url: 'https://www.linkedin.com/company/tresor-real-estate/', Icon: LinkedinIcon },
] as const;
