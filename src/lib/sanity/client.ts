import { createClient, type SanityClient } from 'next-sanity';

// Instanciación perezosa: si se creara en el top-level del módulo, cualquier
// ruta que importe (aunque sea indirectamente) este archivo forzaría la
// creación del cliente durante el build ("Collecting page data"). Si faltan
// las env vars de Sanity en ese entorno, next build entero se cae aunque la
// ruta afectada nunca llegue a usarse. Con un getter perezoso, el error solo
// ocurre cuando una request real invoca la ruta que de verdad necesita Sanity.
let _client: SanityClient | null = null;

function getClient(): SanityClient {
  if (!_client) {
    const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
    if (!projectId) {
      throw new Error(
        'Sanity no está configurado: falta NEXT_PUBLIC_SANITY_PROJECT_ID en las variables de entorno.'
      );
    }
    _client = createClient({
      projectId,
      dataset: process.env.NEXT_PUBLIC_SANITY_DATASET ?? 'production',
      apiVersion: '2024-01-01',
      useCdn: process.env.NODE_ENV === 'production',
      // Token necesario para preview y para el seeder
      token: process.env.SANITY_API_TOKEN,
    });
  }
  return _client;
}

// Proxy para que `sanityClient.fetch(...)`, `sanityClient.create(...)`, etc.
// sigan funcionando sin tocar los call sites existentes, pero sin crear el
// cliente real hasta el primer uso. Los métodos se bindean al cliente real
// (no al receiver/Proxy) porque el SDK de Sanity usa campos privados de
// clase (#a) que solo existen en la instancia real — invocarlos con `this`
// apuntando al Proxy revienta con "Cannot read private member".
export const sanityClient = new Proxy({} as SanityClient, {
  get(_target, prop) {
    const client = getClient();
    const value = Reflect.get(client, prop);
    return typeof value === 'function' ? value.bind(client) : value;
  },
});
