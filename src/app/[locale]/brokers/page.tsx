import type { Metadata } from 'next';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import BrokerAuthForm from '@/components/broker/BrokerAuthForm';
import { verifyBrokerSession, BROKER_COOKIE } from '@/lib/broker/session';

export const metadata: Metadata = {
  title: 'Acceso Broker · Comercializa nuestros desarrollos',
  robots: { index: false, follow: false },
};

export default async function BrokersPage({
  searchParams,
}: {
  searchParams: Promise<{ mode?: string }>;
}) {
  const cookieStore = await cookies();
  if (verifyBrokerSession(cookieStore.get(BROKER_COOKIE)?.value)) {
    redirect('/brokers/drive');
  }

  const { mode } = await searchParams;
  const initialMode = mode === 'forgot' ? 'forgot' : 'register';

  return <BrokerAuthForm initialMode={initialMode} />;
}
