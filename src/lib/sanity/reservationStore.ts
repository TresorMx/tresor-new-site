import { sanityClient } from './client';

export interface StoredReservation {
  folio: string;
  status: 'pending' | 'paid' | 'expired';
  devSlug: string;
  devName: string;
  amount: number;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  unitType?: string;
  stripeSessionId?: string;
  createdAt: string;
  paidAt?: string;
}

// `_id` fijo por folio → lookup directo por documento y `createOrReplace`
// idempotente. Sobrevive entre funciones serverless distintas de Vercel (el
// checkout y la confirmación del webhook pueden correr en instancias
// diferentes).
const docId = (folio: string) => `reservation-${folio}`;

export async function saveReservation(r: StoredReservation): Promise<void> {
  if (!process.env.SANITY_API_TOKEN) return;
  try {
    await sanityClient.createOrReplace({
      _id: docId(r.folio),
      _type: 'reservation',
      ...r,
    });
  } catch (e) {
    console.error('[Sanity] saveReservation error', e);
  }
}

export async function getReservation(folio: string): Promise<StoredReservation | null> {
  if (!process.env.SANITY_API_TOKEN) return null;
  try {
    const doc = await sanityClient.getDocument(docId(folio));
    if (!doc) return null;
    const { _id, _type, _rev, _createdAt, _updatedAt, ...rest } = doc as Record<string, unknown>;
    return rest as unknown as StoredReservation;
  } catch (e) {
    console.error('[Sanity] getReservation error', e);
    return null;
  }
}

// Marca pagado de forma idempotente: si ya está en 'paid', no hace nada (el
// webhook de Stripe puede dispararse más de una vez). Devuelve true solo la
// PRIMERA vez que transiciona a 'paid', para que el caller dispare efectos
// secundarios (email de confirmación, tag en GHL) exactamente una vez.
export async function markReservationPaid(
  folio: string,
  stripeSessionId: string
): Promise<{ reservation: StoredReservation; firstTime: boolean } | null> {
  const reservation = await getReservation(folio);
  if (!reservation) return null;
  if (reservation.status === 'paid') {
    return { reservation, firstTime: false };
  }
  const updated: StoredReservation = {
    ...reservation,
    status: 'paid',
    stripeSessionId,
    paidAt: new Date().toISOString(),
  };
  await saveReservation(updated);
  return { reservation: updated, firstTime: true };
}
