import type { QuoteCalc } from './quote';

export interface StoredQuote {
  quoteId: string;
  createdAt: string;
  contact: {
    fullName: string;
    email: string;
    phone: string;
    company?: string;
    isBroker?: boolean;
    brokerage?: string;
    notes?: string;
  };
  computed: QuoteCalc;
  status: 'generated' | 'reserved' | 'paid' | 'expired';
}
