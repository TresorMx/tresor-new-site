import { getMergedDevelopmentsAsync, isListingRelationship, type City, type Development } from '@/lib/developments';

// Datos del catálogo para artículos del blog que citan precios.
//
// Por qué existe: los posts viejos tienen precios escritos a mano ("desde
// $2,244,000") que quedan desactualizados cuando cambia la lista en Sanity.
// Los posts nuevos que dependen de precios los leen de aquí — misma fuente
// que las fichas (Sanity gana sobre developments.ts) — y la página se
// regenera cada hora (`revalidate` en el page.tsx).

// Solo departamentos en venta con ficha real: fuera listings de terceros,
// fichas pendientes (href '#') y "próximamente".
export async function saleCondos(): Promise<Development[]> {
  const all = await getMergedDevelopmentsAsync();
  return all.filter(
    (d) =>
      d.propertyType === 'Departamento' &&
      !isListingRelationship(d.relationship) &&
      !d.comingSoon &&
      d.href &&
      d.href !== '#',
  );
}

// "Desde $2,690,000 MXN" → 2690000. Ignora etiquetas mensuales (renta).
export function priceNumber(d: Development): number | null {
  const label = d.priceLabel ?? '';
  if (/mes|month/i.test(label)) return null;
  const m = label.match(/\$\s*([\d,]+)/);
  if (m) return Number(m[1].replace(/,/g, ''));
  return d.priceFrom ?? null;
}

export const mxn = (n: number) => `$${n.toLocaleString('en-US')} MXN`;

// Departamento más barato por ciudad, con el desarrollo que lo pone.
export async function entryByCity(): Promise<Partial<Record<City, { price: number; dev: Development }>>> {
  const out: Partial<Record<City, { price: number; dev: Development }>> = {};
  for (const d of await saleCondos()) {
    const p = priceNumber(d);
    if (p == null) continue;
    const cur = out[d.city];
    if (!cur || p < cur.price) out[d.city] = { price: p, dev: d };
  }
  return out;
}
