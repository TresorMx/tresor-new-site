import { sanityClient } from '@/lib/sanity/client';

// Lookup de perfil por id, para mostrar el nombre (header, saludo del
// Drive) — no es una lectura crítica de seguridad como login/registro, así
// que puede ir por el cliente normal (con CDN).
export async function getBrokerFullName(brokerId: string): Promise<string | null> {
  try {
    const doc = await sanityClient.fetch<{ fullName: string } | null>(
      `*[_type == "brokerAccount" && _id == $id][0]{ fullName }`,
      { id: brokerId },
    );
    return doc?.fullName ?? null;
  } catch (e) {
    console.error('[broker/profile] getBrokerFullName falló', e);
    return null;
  }
}
