import { useEffect, useState } from 'react';
import maplibregl from 'maplibre-gl';
import { Box } from '@chakra-ui/react';
import { layers, sources } from './data';
import MapDrawing from './MapDrawing';
import MapLocation from './MapLocation';
import BaseMaps from './BaseMaps';
import 'maplibre-gl/dist/maplibre-gl.css';
import './style.scss';

/** MapLibre component. */

export default function MapLibre() {
  const [map, setMap] = useState(null);

  // Initialize map
  useEffect(() => {
    if (map) return;
    const timer = setTimeout(() => {
      const container = document.getElementById('map');
      if (!container) {
        console.error('Map container not found');
        return;
      }
      const newMap = new maplibregl.Map({
        container: 'map',
        style: {
          version: 8,
          sources: sources,
          layers: layers,
          glyphs: '/static/fonts/{fontstack}/{range}.pbf',
        },
        center: [0, 0],
        zoom: 1,
        attributionControl: false,
      });
      newMap.addControl(new maplibregl.NavigationControl(), 'bottom-left');
      newMap.on('load', () => {
        console.log('Map loaded successfully');
      });
      newMap.on('error', (e) => {
        console.error('Map error:', e);
      });
      setMap(newMap);
    }, 100);
    return () => clearTimeout(timer);
  }, [map]);

  return (
    <Box position="relative" width="100%" height="100%" minHeight="400px">
      <Box id="map" width="100%" height="100%" />
      {map && <MapDrawing map={map} />}
      {map && <MapLocation map={map} />}
      {map && <BaseMaps map={map} />}
    </Box>
  );
}
