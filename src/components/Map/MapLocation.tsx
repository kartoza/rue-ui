import { useState } from 'react';
import { HStack, IconButton } from '@chakra-ui/react';
import { MdOutlineZoomIn } from 'react-icons/md';
import { Map } from 'maplibre-gl';

import 'maplibre-gl-draw/dist/mapbox-gl-draw.css';
import './style.scss';

interface MapLocationProps {
  map?: Map | null;
}

export default function MapLocation({ map }: MapLocationProps) {
  const [lat, setLat] = useState<string>('');
  const [lng, setLng] = useState<string>('');
  const [error, setError] = useState<string>('');

  const handleZoom = () => {
    const latitude = parseFloat(lat);
    const longitude = parseFloat(lng);

    if (
      isNaN(latitude) ||
      isNaN(longitude) ||
      latitude < -90 ||
      latitude > 90 ||
      longitude < -180 ||
      longitude > 180
    ) {
      setError('Please enter valid latitude (-90 to 90) and longitude (-180 to 180)');
      return;
    }

    setError('');

    if (map) {
      map.flyTo({ center: [longitude, latitude], zoom: 14 });
    }
  };

  return (
    <HStack
      position="absolute"
      top="10px"
      left="10px"
      bg="white"
      borderRadius="md"
      boxShadow="md"
      p={2}
      zIndex={1}
    >
      <input
        type="number"
        step="any"
        placeholder="Latitude"
        value={lat}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setLat(e.target.value)}
        style={{ width: '120px', padding: '4px' }}
      />
      <input
        type="number"
        step="any"
        placeholder="Longitude"
        value={lng}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setLng(e.target.value)}
        style={{ width: '120px', padding: '4px' }}
      />
      <IconButton
        aria-label="Zoom to location"
        onClick={handleZoom}
        size="md"
        disabled={!map}
        bg="white"
        color="black"
        padding={2}
      >
        <MdOutlineZoomIn />
      </IconButton>

      {error && <span style={{ color: 'red', fontSize: '12px' }}>{error}</span>}
    </HStack>
  );
}
