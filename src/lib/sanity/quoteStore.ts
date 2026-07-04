import { sanityClient } from './client';
import type { StoredQuote } from '../leadStore';

// Reemplaza el Map en memoria (leadStore.ts) que no sobrevivía entre
// funciones serverless distintas de Vercel. `_id` fijo por quoteId permite
// lookup directo por documento (sin query) y hace `createOrReplace`
// idempotente.
const docId = (quoteId: string) => `quote-${quoteId}`;

export async function saveQuoteToSanity(quote: StoredQuote): Promise<void> {
  if (!process.env.SANITY_API_TOKEN) return;
  try {
    await sanityClient.createOrReplace({
      _id: docId(quote.quoteId),
      _type: 'quote',
      quoteId: quote.quoteId,
      status: quote.status,
      plazaSlug: quote.computed.plaza.slug,
      unitCode: quote.computed.unit.code,
      contactName: quote.contact.fullName,
      contactEmail: quote.contact.email,
      total: quote.computed.total,
      dataJson: JSON.stringify(quote),
      createdAt: quote.createdAt,
    });
  } catch (e) {
    console.error('[Sanity] saveQuoteToSanity error', e);
  }
}

export async function getQuoteFromSanity(quoteId: string): Promise<StoredQuote | null> {
  if (!process.env.SANITY_API_TOKEN) return null;
  try {
    const doc = await sanityClient.getDocument(docId(quoteId));
    if (!doc?.dataJson) return null;
    return JSON.parse(doc.dataJson as string) as StoredQuote;
  } catch (e) {
    console.error('[Sanity] getQuoteFromSanity error', e);
    return null;
  }
}

export async function updateQuoteStatus(
  quoteId: string,
  status: StoredQuote['status']
): Promise<StoredQuote | null> {
  const quote = await getQuoteFromSanity(quoteId);
  if (!quote) return null;
  quote.status = status;
  await saveQuoteToSanity(quote);
  return quote;
}
