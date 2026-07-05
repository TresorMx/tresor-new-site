import type { ReactNode } from 'react';

// Da tratamiento editorial a copy de ficha (cifras clave, frases que deben
// resaltar) sin meter JSX en los datos: el texto se escribe con **negritas**
// estilo markdown (igual que cualquier editor de contenido esperaría) y esto
// lo convierte a spans reales. Mismo criterio visual que `withBoldNumbers` en
// FichaDeveloper (font-medium + text-ink contra el body más claro).
export function renderEditorial(text: string): ReactNode {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) => {
    const match = part.match(/^\*\*([^*]+)\*\*$/);
    return match ? (
      <span key={i} className="font-medium text-ink">{match[1]}</span>
    ) : (
      <span key={i}>{part}</span>
    );
  });
}
