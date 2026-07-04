import { defineField, defineType } from 'sanity';

// Apartado en línea (pago de reserva vía Stripe) para desarrollos SIN
// inventario por unidad — ej. Sales Partner como Olivia. A diferencia de
// `quote` (que sí amarra un local específico del cotizador de Tresor), aquí
// el cliente paga el monto de apartado del desarrollo y un asesor cierra los
// siguientes pasos. El `folio` es la referencia compartida cliente/Tresor y
// el `_id` del documento (`reservation-{folio}`), lo que hace idempotente la
// confirmación del webhook de Stripe (puede llegar más de una vez).
export default defineType({
  name: 'reservation',
  title: 'Apartado',
  type: 'document',
  fields: [
    defineField({ name: 'folio', title: 'Folio', type: 'string' }),
    defineField({
      name: 'status',
      title: 'Estatus',
      type: 'string',
      options: { list: ['pending', 'paid', 'expired'] },
      initialValue: 'pending',
    }),
    defineField({ name: 'devSlug', title: 'Desarrollo (slug)', type: 'string' }),
    defineField({ name: 'devName', title: 'Desarrollo', type: 'string' }),
    defineField({ name: 'amount', title: 'Monto (MXN)', type: 'number' }),
    defineField({ name: 'contactName', title: 'Cliente', type: 'string' }),
    defineField({ name: 'contactEmail', title: 'Email', type: 'string' }),
    defineField({ name: 'contactPhone', title: 'Teléfono', type: 'string' }),
    defineField({ name: 'stripeSessionId', title: 'Stripe session', type: 'string' }),
    defineField({ name: 'createdAt', title: 'Creado', type: 'datetime' }),
    defineField({ name: 'paidAt', title: 'Pagado', type: 'datetime' }),
  ],
  preview: {
    select: { title: 'folio', subtitle: 'contactName', status: 'status', dev: 'devName' },
    prepare: ({ title, subtitle, status, dev }) => ({
      title: `${title || '(sin folio)'} · ${dev ?? ''}`,
      subtitle: `${status ?? ''} · ${subtitle ?? ''}`,
    }),
  },
});
