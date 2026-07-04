import { defineField, defineType } from 'sanity';

// Cotizaciones generadas en /cotizar — antes vivían solo en memoria del
// servidor (Map en globalThis), lo cual no es confiable en funciones
// serverless de Vercel (cada request puede caer en una instancia distinta).
// `dataJson` guarda el StoredQuote completo (contacto + cálculo) tal cual se
// generó, para reconstruir el PDF y confirmar el pago sin depender de que el
// mismo proceso siga vivo.
export default defineType({
  name: 'quote',
  title: 'Cotización',
  type: 'document',
  fields: [
    defineField({ name: 'quoteId', title: 'ID', type: 'string' }),
    defineField({
      name: 'status',
      title: 'Estatus',
      type: 'string',
      options: { list: ['generated', 'reserved', 'paid', 'expired'] },
    }),
    defineField({ name: 'plazaSlug', title: 'Plaza', type: 'string' }),
    defineField({ name: 'unitCode', title: 'Local', type: 'string' }),
    defineField({ name: 'contactName', title: 'Cliente', type: 'string' }),
    defineField({ name: 'contactEmail', title: 'Email', type: 'string' }),
    defineField({ name: 'total', title: 'Total (MXN)', type: 'number' }),
    defineField({ name: 'dataJson', title: 'Datos completos (JSON)', type: 'text' }),
    defineField({ name: 'createdAt', title: 'Creado', type: 'datetime' }),
  ],
  preview: {
    select: { title: 'quoteId', subtitle: 'contactEmail', status: 'status' },
    prepare: ({ title, subtitle, status }) => ({
      title: title || '(sin id)',
      subtitle: `${status ?? ''} · ${subtitle ?? ''}`,
    }),
  },
});
