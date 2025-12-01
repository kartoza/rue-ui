import { useEffect, useState } from 'react';
import maplibregl, { Map as MapLibreMap } from 'maplibre-gl';
import { Box } from '@chakra-ui/react';
import MapLocation from './MapLocation';
import BaseMaps from './BaseMaps';
import MapSiteLayer from './MapSiteLayer.tsx';
import MapSiteEditor from './MapSiteEditor.tsx';
import MapStepLayer from './MapStepLayer.tsx';

import 'maplibre-gl/dist/maplibre-gl.css';
import './style.scss';

/** MapLibre component. */
export default function MapLibre() {
  const [map, setMap] = useState<MapLibreMap | null>(null);

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
          sources: {
            osm: {
              type: 'raster',
              tiles: ['https://tile.openstreetmap.org/{z}/{x}/{y}.png'],
              tileSize: 256,
            },
          },
          layers: [
            {
              id: 'osm-background',
              type: 'raster',
              source: 'osm',
              minzoom: 0,
              maxzoom: 19,
            }, // osm-background layer
          ],
          glyphs: '/static/fonts/{fontstack}/{range}.pbf',
          sprite: '',
        },
        center: [0, 0],
        zoom: 1,
        attributionControl: false,
      });

      newMap.addControl(new maplibregl.NavigationControl(), 'bottom-left');
      setMap(newMap);
    }, 100);
    return () => clearTimeout(timer);
  }, [map]);

  return (
    <Box position="relative" width="100%" height="100%" minHeight="400px">
      <Box id="map" width="100%" height="100%" />
      {map && <MapSiteLayer map={map} />}
      {map && <MapSiteEditor map={map} />}
      {map && <MapStepLayer map={map} />}
      {map && <MapLocation map={map} />}
      {map && <BaseMaps map={map} />}
    </Box>
  );
}
