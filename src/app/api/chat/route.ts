import { NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { getMergedDevelopmentsAsync, withLivePrices, type Development } from '@/lib/developments';
import { getPlazaBySlugAsync } from '@/lib/data';
import { upsertGHLContact } from '@/lib/ghl';
import { saveLeadToSanity } from '@/lib/sanity/saveLead';
import { fetchFreeSlotsForDate, createGHLAppointment, GHL_CALENDAR_CONFIGURED } from '@/lib/ghlCalendar';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

function routeSlug(href: string): string | null {
  const match = href.match(/^\/desarrollos\/([^/]+)$/);
  return match ? match[1] : null;
}

// ─── System prompt dinámico — catálogo completo de Tresor, no solo Quattro ────

function buildSystemPrompt(devs: Development[], contactId: string | null, devSlug?: string): string {
  const active = devs.filter((d) => !d.comingSoon && routeSlug(d.href));
  const coming = devs.filter((d) => d.comingSoon);

  const activeStr = active
    .map((d) => {
      const slug = routeSlug(d.href);
      const brand = d.brand ?? d.developer;
      return `- ${d.name} (slug: ${slug}) — ${brand}, ${d.city}, ${d.propertyType ?? d.type}, ${d.status}${d.priceLabel ? `, ${d.priceLabel}` : ''}${d.deliveryWindow ? `, entrega ${d.deliveryWindow}` : ''}`;
    })
    .join('\n');

  const comingStr = coming.map((d) => `- ${d.name} (${d.brand ?? d.developer}, ${d.city}): próximamente`).join('\n');

  const fichaDev = devSlug ? active.find((d) => routeSlug(d.href) === devSlug) : undefined;

  const contactLine = contactId
    ? `El contacto ya está identificado en el CRM (contact_id activo) — puedes usar book_appointment directo sin volver a pedir nombre/teléfono.`
    : `Todavía NO hay contacto identificado. Antes de agendar una cita necesitas nombre + teléfono vía capture_lead.`;

  return `Eres Luis, asesor de Tresor Real Estate. Conoces TODO el portafolio de la empresa — sus propios desarrollos (Quattro Plaza Center) y los de sus Sales Partners (Live Desarrollos / Wow Condos, Onix, Urban Homes) en Cancún, Puerto Cancún, Playa del Carmen y Tulum: locales comerciales, departamentos y lotes residenciales.

${fichaDev ? `CONTEXTO ACTUAL: el usuario está viendo ahora mismo la ficha de ${fichaDev.name} (${fichaDev.brand ?? fichaDev.developer}, ${fichaDev.city}). Si es tu primer mensaje y el usuario no preguntó algo distinto, parte de este desarrollo específico — no le preguntes "qué está buscando" en general, pregúntale algo concreto sobre ${fichaDev.name} (tipología, disponibilidad, agendar visita).` : ''}

${contactLine}

ESTILO — INNEGOCIABLE:
- Máximo 2 oraciones por respuesta. Cero relleno, cero disculpas repetidas, cero rodeos.
- Directo y seguro, como un asesor que ya vendió cientos de propiedades — no un chatbot tímido.
- Cuando haya opciones discretas (desarrollos, horarios, tipologías), preséntalas como lista corta, no como párrafo.
- Español mexicano por defecto; inglés si el cliente escribe en inglés.
- Nunca repitas lo que el cliente ya dijo. Nunca inventes precios, m² ni disponibilidad — usa las tools siempre.

PORTAFOLIO ACTIVO (datos en vivo — si no aparece aquí no existe):
${activeStr || '- Sin desarrollos activos en este momento'}

PRÓXIMAMENTE:
${comingStr || '- Sin proyectos próximos'}

FLUJO:
1. Si el usuario pregunta algo general del portafolio, respóndelo directo con la tabla de arriba — no captures el lead todavía.
2. En cuanto el usuario muestre intención real (quiere precios de un local específico, disponibilidad, cotizar o agendar) y aún no tengas contact_id, pide nombre + teléfono y usa capture_lead de inmediato.
3. Usa get_dev_details o get_availability para dar datos concretos de un desarrollo.
4. Si el usuario quiere agendar: usa check_available_slots (nunca inventes horarios) y ofrece 3-4 opciones concretas en formato "Lun 20 jul · 10:00 am". Cuando elija una, confirma con book_appointment usando el iso exacto que trajo check_available_slots.
5. Si tiene cotizador disponible (Quattro), usa get_quote_link tras capturar el lead.
6. Si no quiere agendar ni cotizar aún: deja la puerta abierta, no insistas más de una vez por mensaje.

CONTACTO DIRECTO (cuando el cliente quiere hablar con alguien o cierras conversación):
- WhatsApp: https://wa.me/529984045602
- Email: hello@tresor.mx

REGLAS DURAS:
- No prometas rentabilidades específicas ni descuentos no oficiales.
- Apartado en línea (cuando aplica): monto varía por desarrollo, 100% reembolsable — usa get_dev_details, no lo inventes.
- Si el local/desarrollo no aparece en las tools, no lo menciones.

FUERA DE TEMA — CIERRA RÁPIDO, SIN CONTEMPLACIONES:
- Preguntas absurdas, trivia, matemáticas, chistes, groserías, o cualquier cosa que no sea sobre Tresor/inmuebles: UNA respuesta corta tipo "Eso no me toca a mí — pero si buscas [desarrollo relevante], con gusto." y regresas el tema a propiedades.
- Si insiste con lo mismo fuera de tema: cierra con "Para eso no te puedo ayudar. Si necesitas algo de Tresor, aquí sigo. Si no, escríbenos por WhatsApp: https://wa.me/529984045602" y no vuelvas a engancharte con ese hilo.
- EXCEPCIÓN — nunca la trates como "fuera de tema": si el mensaje suena a una crisis real (autolesión, quiere hacerse daño, etc.), NO uses sarcasmo ni el cierre de arriba. Responde en serio, una sola vez: "Esto no es algo que yo pueda resolver, pero sí hay quien puede ayudarte de verdad: Línea de la Vida, 800-911-2000, gratuita y confidencial, las 24 horas." y no sigas por ese lado salvo que el usuario retome el tema de propiedades.`;
}

// ─── Tools ────────────────────────────────────────────────────────────────────

function buildTools(devs: Development[]): Anthropic.Tool[] {
  const active = devs.filter((d) => !d.comingSoon && routeSlug(d.href));
  const allSlugs = active.map((d) => routeSlug(d.href)!);
  // Solo los desarrollos propios de Tresor (Quattro) tienen inventario por
  // unidad en vivo (vía Plaza) y cotizador — Sales Partner usa priceLabel/
  // description estáticos, sin disponibilidad unidad-por-unidad.
  const quattroSlugs = active.filter((d) => d.relationship === 'develop').map((d) => routeSlug(d.href)!);

  const tools: Anthropic.Tool[] = [
    {
      name: 'get_dev_details',
      description:
        'Información de un desarrollo: ubicación, entrega, status, precio, descripción. Úsala para cualquier desarrollo (Quattro o Sales Partner) cuando pregunten por un proyecto específico.',
      input_schema: {
        type: 'object' as const,
        properties: {
          dev_slug: { type: 'string', enum: allSlugs.length ? allSlugs : [''] },
        },
        required: ['dev_slug'],
      },
    },
    {
      name: 'get_availability',
      description:
        'Locales/unidades disponibles con precio y specs — SOLO funciona para desarrollos de Quattro Plaza Center (los que tienen inventario en vivo). Para Sales Partner usa get_dev_details en su lugar.',
      input_schema: {
        type: 'object' as const,
        properties: {
          dev_slug: { type: 'string', enum: quattroSlugs.length ? quattroSlugs : [''] },
          max_price_mxn: { type: 'number', description: 'Precio máximo en MXN (sin IVA)' },
          min_price_mxn: { type: 'number', description: 'Precio mínimo en MXN (sin IVA)' },
          level: { type: 'number', enum: [1, 2], description: 'Nivel del local' },
          max_area: { type: 'number', description: 'Área máxima en m²' },
          min_area: { type: 'number', description: 'Área mínima en m²' },
        },
        required: ['dev_slug'],
      },
    },
    {
      name: 'capture_lead',
      description:
        'Guarda/actualiza el nombre y teléfono del prospecto en el CRM (upsert — no crea duplicados). Úsala en cuanto tengas nombre + teléfono, y siempre antes de agendar una cita si no hay contact_id activo.',
      input_schema: {
        type: 'object' as const,
        properties: {
          nombre: { type: 'string' },
          telefono: { type: 'string' },
          dev_interes: { type: 'string', description: 'slug del desarrollo de interés (opcional)' },
          notas: { type: 'string', description: 'Qué busca, presupuesto, tipología, etc.' },
        },
        required: ['nombre', 'telefono'],
      },
    },
    {
      name: 'get_quote_link',
      description: 'Genera el link al cotizador interno. Solo disponible para desarrollos de Quattro Plaza Center.',
      input_schema: {
        type: 'object' as const,
        properties: {
          dev_slug: { type: 'string', enum: quattroSlugs.length ? quattroSlugs : [''] },
          unit_id: { type: 'string', description: 'ID del local específico (opcional)' },
        },
        required: ['dev_slug'],
      },
    },
  ];

  if (GHL_CALENDAR_CONFIGURED) {
    tools.push(
      {
        name: 'check_available_slots',
        description:
          'Trae horarios REALES disponibles para agendar una visita (calendario compartido, sirve para cualquier desarrollo). Úsala siempre antes de ofrecer horarios — nunca los inventes.',
        input_schema: { type: 'object' as const, properties: {} },
      },
      {
        name: 'book_appointment',
        description:
          'Agenda la cita en el calendario real usando un horario que haya salido de check_available_slots. Requiere que ya exista un contact_id (capture_lead primero si no lo hay).',
        input_schema: {
          type: 'object' as const,
          properties: {
            start_time_iso: { type: 'string', description: 'ISO exacto de check_available_slots, ej. 2026-07-20T10:00:00-05:00' },
            title: { type: 'string', description: 'Ej. "Gardens · Juan Pérez"' },
          },
          required: ['start_time_iso', 'title'],
        },
      },
    );
  }

  return tools;
}

// ─── Tool runner ────────────────────────────────────────────────────────────

interface RunToolCtx {
  devs: Development[];
  contactId: { current: string | null };
  lastSlots: { current: SlotDay[] | null };
}

interface SlotDay {
  date: string;
  label: string;
  slots: { time: string; iso: string }[];
}

async function runTool(name: string, input: any, ctx: RunToolCtx): Promise<any> {
  switch (name) {
    case 'get_dev_details': {
      const dev = ctx.devs.find((d) => routeSlug(d.href) === input.dev_slug);
      if (!dev) return { error: 'dev not found' };
      return {
        slug: input.dev_slug,
        nombre: dev.name,
        desarrollador: dev.brand ?? dev.developer,
        ciudad: dev.city,
        tipo: dev.propertyType ?? dev.type,
        status: dev.status,
        entrega: dev.deliveryWindow,
        precio: dev.priceLabel,
        descripcion: dev.description,
        highlights: dev.highlights?.map((h) => `${h.label}: ${h.value}`),
        apartadoDisponible: Boolean(dev.reservationEnabled),
        montoApartado: dev.reservationAmount,
      };
    }
    case 'get_availability': {
      const dev = ctx.devs.find((d) => routeSlug(d.href) === input.dev_slug && d.relationship === 'develop');
      if (!dev) return { error: 'Este desarrollo no tiene inventario en vivo — usa get_dev_details' };
      const plaza = await getPlazaBySlugAsync(input.dev_slug);
      if (!plaza) return { error: 'plaza not found' };
      let units = (plaza.units ?? []).filter((u) => u.status === 'disponible');
      if (input.max_price_mxn) units = units.filter((u) => u.price && u.price <= input.max_price_mxn);
      if (input.min_price_mxn) units = units.filter((u) => u.price && u.price >= input.min_price_mxn);
      if (input.level) units = units.filter((u) => u.level === input.level);
      if (input.max_area) units = units.filter((u) => {
        const area = Number(u.specs?.areaTotal ?? u.specs?.area ?? u.specs?.m2 ?? u.specs?.metros ?? 0);
        return area > 0 && area <= input.max_area;
      });
      if (input.min_area) units = units.filter((u) => {
        const area = Number(u.specs?.areaTotal ?? u.specs?.area ?? u.specs?.m2 ?? u.specs?.metros ?? 0);
        return area > 0 && area >= input.min_area;
      });
      return {
        desarrollo: dev.name,
        disponibles: units.length,
        locales: units.slice(0, 8).map((u) => ({
          id: u.id,
          code: u.code,
          nivel: u.level,
          specs: u.specs ?? {},
          precioMXN: u.price,
          entrega: u.delivery,
        })),
      };
    }
    case 'capture_lead': {
      try {
        const [first, ...rest] = (input.nombre as string).trim().split(' ');
        const [ghlResult] = await Promise.all([
          upsertGHLContact({
            firstName: first || input.nombre,
            lastName: rest.join(' '),
            phone: input.telefono,
            source: 'chat',
            tags: ['Tresor Web', 'Chatbot'],
            devSlug: (input.dev_interes as string) || undefined,
            customFields: { 'fuente_de_contacto': 'digital' },
            notes: input.notas,
          }),
          saveLeadToSanity({
            source: 'chatbot',
            fullName: input.nombre,
            phone: input.telefono,
            plazaSlug: input.dev_interes,
            message: input.notas,
          }),
        ]);
        if (ghlResult.contactId) ctx.contactId.current = ghlResult.contactId;
        return { ok: true, message: 'Lead guardado correctamente', contact_id: ghlResult.contactId ?? null };
      } catch (e) {
        console.error('[capture_lead]', e);
        return { ok: false, message: 'Error guardando lead, continúa la conversación' };
      }
    }
    case 'get_quote_link': {
      const dev = ctx.devs.find((d) => routeSlug(d.href) === input.dev_slug && d.relationship === 'develop');
      if (!dev) return { error: 'dev not found o sin cotizador' };
      const url = input.unit_id ? `/cotizar/${input.dev_slug}?unit=${input.unit_id}` : `/cotizar/${input.dev_slug}`;
      return { url, desarrollo: dev.name };
    }
    case 'check_available_slots': {
      const now = new Date();
      const dates = Array.from({ length: 6 }, (_, i) => {
        const d = new Date(now);
        d.setDate(d.getDate() + i + 1);
        return d;
      });
      const perDay = await Promise.all(
        dates.map(async (d) => {
          const dateISO = d.toISOString().split('T')[0];
          const isoSlots = await fetchFreeSlotsForDate(dateISO);
          return { d, dateISO, isoSlots };
        }),
      );
      const days: SlotDay[] = perDay
        .filter((p) => p.isoSlots.length > 0)
        .slice(0, 3)
        .map((p) => ({
          date: p.dateISO,
          label: p.d.toLocaleDateString('es-MX', { weekday: 'short', day: 'numeric', month: 'short' }),
          slots: p.isoSlots.slice(0, 4).map((iso) => ({
            time: iso.match(/T(\d{2}:\d{2})/)?.[1] ?? iso,
            iso,
          })),
        }));
      ctx.lastSlots.current = days.length ? days : null;
      if (!days.length) return { error: 'No hay horarios disponibles en los próximos días, ofrece WhatsApp' };
      return { dias: days };
    }
    case 'book_appointment': {
      if (!ctx.contactId.current) {
        return { error: 'No hay contact_id — usa capture_lead primero con nombre y teléfono' };
      }
      const result = await createGHLAppointment({
        contactId: ctx.contactId.current,
        startTimeISO: input.start_time_iso,
        title: input.title || 'Cita agendada por chat',
      });
      if (!result.ok) return { error: 'No se pudo agendar ese horario, ofrece otro de check_available_slots' };
      ctx.lastSlots.current = null;
      return { ok: true, confirmado: true, appointment_id: result.appointmentId };
    }
    default:
      return { error: 'unknown tool' };
  }
}

// ─── POST handler ─────────────────────────────────────────────────────────────

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export async function POST(req: Request) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return NextResponse.json({
      message: 'El asesor está temporalmente fuera. Contáctanos por WhatsApp o agenda una visita.',
    });
  }

  let body: { messages: ChatMessage[]; devSlug?: string; contactId?: string | null };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid body' }, { status: 400 });
  }

  const devs = await getMergedDevelopmentsAsync();
  const quattroActive = devs.filter((d) => d.relationship === 'develop' && !d.comingSoon);
  const liveQuattro = await withLivePrices(quattroActive);
  const merged = devs.map((d) => liveQuattro.find((q) => q.slug === d.slug) ?? d);

  const ctx: RunToolCtx = {
    devs: merged,
    contactId: { current: body.contactId ?? null },
    lastSlots: { current: null },
  };

  const systemPrompt = buildSystemPrompt(merged, ctx.contactId.current, body.devSlug);
  const tools = buildTools(merged);

  const client = new Anthropic({ apiKey });
  const history: Anthropic.MessageParam[] = (body.messages ?? [])
    .filter((m) => m.content?.trim())
    .map((m) => ({ role: m.role, content: m.content }));

  try {
    let response = await client.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 300,
      system: systemPrompt,
      tools,
      messages: history,
    });

    let safety = 0;
    while (response.stop_reason === 'tool_use' && safety < 5) {
      safety++;
      const toolUses = response.content.filter((c) => c.type === 'tool_use') as Anthropic.ToolUseBlock[];
      const toolResults: Anthropic.ToolResultBlockParam[] = await Promise.all(
        toolUses.map(async (tu) => ({
          type: 'tool_result' as const,
          tool_use_id: tu.id,
          content: JSON.stringify(await runTool(tu.name, tu.input, ctx)),
        })),
      );

      history.push({ role: 'assistant', content: response.content });
      history.push({ role: 'user', content: toolResults });

      response = await client.messages.create({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 300,
        system: systemPrompt,
        tools,
        messages: history,
      });
    }

    const text = response.content
      .filter((c) => c.type === 'text')
      .map((c) => (c as Anthropic.TextBlock).text)
      .join('\n')
      .trim();

    return NextResponse.json({
      message: text || '¿En qué te puedo ayudar?',
      contactId: ctx.contactId.current,
      slots: ctx.lastSlots.current,
    });
  } catch (e: any) {
    console.error('[Chat] error', e);
    return NextResponse.json({
      message: 'Tuve un problema. ¿Puedes intentarlo de nuevo?',
    });
  }
}
