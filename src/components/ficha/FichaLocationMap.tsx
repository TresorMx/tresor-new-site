'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Map as MapIcon } from 'lucide-react';
import LocationMap from '@/components/LocationMap';
import LocationModal from '@/components/LocationModal';

// Celda del mapa en la ficha — dos modos, elegidos por si Sanity trae
// `location.image`:
//   - CON imagen: se muestra la foto (16:9 o 1:1, elegido en Sanity) con un
//     botón "Ver Google Maps" abajo a la derecha; el mapa interactivo real
//     se abre en el mismo popup que ya usa /agenda (LocationModal).
//   - SIN imagen (default): el mapa interactivo de siempre, sin cambios.
// 100% opcional — un desarrollo sin `location.image` se comporta exactamente
// igual que antes de este componente existir.
export default function FichaLocationMap({
  lat, lng, address, image, imageAspect = '16:9', mapStyle, locale,
}: {
  lat: number;
  lng: number;
  address: string;
  image?: string;
  imageAspect?: '16:9' | '1:1';
  mapStyle?: 'tresor' | 'earth';
  locale: string;
}) {
  const [open, setOpen] = useState(false);
  const isEs = locale !== 'en';

  if (!image) {
    return <LocationMap lat={lat} lng={lng} address={address} mapStyle={mapStyle} />;
  }

  return (
    <>
      <div className={`relative w-full overflow-hidden rounded-lg border border-line bg-bg-soft ${imageAspect === '1:1' ? 'aspect-square' : 'aspect-video'}`}>
        <Image
          src={image}
          alt={isEs ? `Ubicación — ${address}` : `Location — ${address}`}
          fill
          sizes="(max-width:768px) 100vw, 60vw"
          className="object-cover"
        />
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="btn btn-glass-solid absolute bottom-4 right-4 shadow-md"
        >
          <MapIcon size={14} strokeWidth={1.8} />
          {isEs ? 'Ver Google Maps' : 'View Google Maps'}
        </button>
      </div>

      <LocationModal
        open={open}
        onClose={() => setOpen(false)}
        lat={lat}
        lng={lng}
        address={address}
        title={isEs ? 'Ubicación' : 'Location'}
        mapStyle={mapStyle}
      />
    </>
  );
}
