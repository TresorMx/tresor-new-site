import type { Metadata } from 'next';
import { cookies } from 'next/headers';
import AsesoresIndex from '@/components/asesor/AsesoresIndex';
import BrokerGate from '@/components/broker/BrokerGate';
import { buildDriveGroups } from '@/lib/asesor/driveGroups';
import { verifyBrokerSession, BROKER_COOKIE } from '@/lib/broker/session';
import { getBrokerFullName } from '@/lib/broker/profile';

export const metadata: Metadata = {
  title: 'Drive de Ventas · Brokers',
  robots: { index: false, follow: false },
};

export default async function BrokerDrivePage() {
  const cookieStore = await cookies();
  const brokerId = verifyBrokerSession(cookieStore.get(BROKER_COOKIE)?.value);
  const [groups, fullName] = await Promise.all([
    buildDriveGroups(),
    brokerId ? getBrokerFullName(brokerId) : Promise.resolve(null),
  ]);

  const firstName = fullName?.split(' ')[0];

  return (
    <AsesoresIndex
      groups={groups}
      gate={BrokerGate}
      hrefBase="/brokers/drive"
      greeting={firstName ? { firstName } : undefined}
    />
  );
}
