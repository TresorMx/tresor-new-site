/**
 * Adaptador para Go High Level (CRM + Calendario).
 *
 * Cuando David envíe las credenciales (Location ID + API key v2 + pipeline ID),
 * activamos `createGHLContact()` y `addGHLOpportunity()`.
 *
 * Por ahora el adaptador hace fallback silencioso a un log + email.
 */

/**
 * Mapea slug de desarrollo al valor exacto del campo GHL desarrollo_de_inters.
 * Ese custom field es un picklist de GHL con opciones predefinidas — hoy solo
 * tiene las de Quattro. Para un desarrollo sin opción configurada ahí, cae al
 * slug crudo (en vez de mentir con "proyectos_quattro"); GHL simplemente no
 * lo mostrará en ese picklist hasta que se agregue la opción manualmente en
 * el CRM. El enrutamiento real por desarrollo debe hacerse vía `tags`
 * (string libre, sin este límite), no vía este custom field.
 */
export function plazaToDesarrollo(plaza: string): string {
  const map: Record<string, string> = {
    'gardens':     'quattro_plaza_gardens',
    'long-island': 'quattro_plaza_long_island',
    'ambos':       'proyectos_quattro',
  };
  return map[plaza] ?? plaza;
}

export interface GHLLead {
  firstName: string;
  lastName?: string;
  email?: string;
  phone: string;
  company?: string;
  source: 'quote' | 'chatbot' | 'broker' | 'reservation' | 'agenda' | 'chat';
  tags?: string[];
  // Slug del desarrollo/ficha que disparó el lead (ej. 'long-island',
  // 'esther-wow-condos') — se agrega como tag además de 'Tresor Web'.
  // Se omite cuando el lead no viene de una ficha específica (registro de
  // broker, rewards, chat/ads genéricos, etc.) — así el enrutamiento por
  // desarrollo queda en un solo lugar en vez de que cada caller arme el
  // string de tags a mano.
  devSlug?: string;
  customFields?: Record<string, string | number | boolean>;
  notes?: string;
}

export async function sendLeadToGHL(lead: GHLLead): Promise<{ ok: boolean; contactId?: string; error?: string }> {
  const apiKey = process.env.GHL_API_KEY;
  const locationId = process.env.GHL_LOCATION_ID;

  if (!apiKey || !locationId) {
    console.log('[GHL] Skipped — credentials not configured. Lead:', lead.email, lead.source);
    return { ok: true };
  }

  try {
    const res = await fetch('https://services.leadconnectorhq.com/contacts/', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        Version: '2021-07-28',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        firstName: lead.firstName,
        lastName: lead.lastName ?? '',
        ...(lead.email ? { email: lead.email } : {}),
        phone: lead.phone,
        companyName: lead.company,
        locationId,
        source: `web-${lead.source}`,
        // 'Tresor Web' siempre, más el desarrollo (si aplica) — un solo
        // lugar decide el formato en vez de que cada ruta lo arme distinto.
        tags: ['Tresor Web', ...(lead.devSlug ? [lead.devSlug] : []), ...(lead.tags ?? [])],
        customFields: lead.customFields
          ? Object.entries(lead.customFields).map(([key, value]) => ({ key, field_value: String(value) }))
          : [],
      }),
    });
    if (!res.ok) {
      const text = await res.text();
      console.error('[GHL] Error', res.status, text);
      return { ok: false, error: text };
    }
    const data = await res.json();
    return { ok: true, contactId: data.contact?.id };
  } catch (e) {
    console.error('[GHL] Network error', e);
    return { ok: false, error: String(e) };
  }
}
