import { useEffect } from 'react';
import maplibregl, { type Map } from 'maplibre-gl';
import { Box } from '@chakra-ui/react';
import MapLocation from './MapLocation';
import BaseMaps from './BaseMaps';
import SiteDefinitionLayer from './SiteDefinitionLayer';
import StepLayer from './StepLayer';

import 'maplibre-gl/dist/maplibre-gl.css';
import './style.scss';
import LocalStreetLayer from './LocalStreetLayer';

interface Props {
  map: Map | null;
  setMap: (map: Map | null) => void;
}

/** MapLibre component. */
export default function MapLibre({ map, setMap }: Props) {
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
          layers: [],
          glyphs: '/static/fonts/{fontstack}/{range}.pbf',
          sprite: '',
        },
        center: [0, 0],
        zoom: 1,
        attributionControl: false,
      });

      newMap.addControl(new maplibregl.NavigationControl(), 'bottom-left');

      newMap.once('load', () => {
        setMap(newMap);
      });
    }, 100);
    return () => clearTimeout(timer);
  }, [map]);

  return (
    <Box position="relative" width="100%" height="100%" minHeight="400px">
      <Box id="map" width="100%" height="100%" />
      {map && <SiteDefinitionLayer map={map} />}
      {map && <LocalStreetLayer map={map} />}
      {map && <StepLayer map={map} />}
      {map && <MapLocation map={map} />}
      {map && <BaseMaps map={map} />}
    </Box>
  );
}
