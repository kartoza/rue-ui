import { useEffect, useState } from 'react';
import maplibregl, { Map as MapLibreMap } from 'maplibre-gl';
import { Box } from '@chakra-ui/react';
import { layers, sources } from './data.ts';
import MapDrawing from './MapDrawing.tsx';
import MapLocation from './MapLocation.tsx';
import BaseMaps from './BaseMaps';
import MapTaskDisplay from './MapTaskDisplay.tsx';
import 'maplibre-gl/dist/maplibre-gl.css';
import './style.scss';

/** MapLibre component. */

interface MapLibreProps {
  currentDefinition: string;
  currentTask: string;
}

export default function MapLibre({ currentDefinition, currentTask }: MapLibreProps) {
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
      // Create basic style with only OSM
      const customStyle = {
        version: 8,
        sources: {
          osm: sources.osm,
        },
        layers: [
          layers[0], // osm-background layer
        ],
        glyphs: '/static/fonts/{fontstack}/{range}.pbf',
        sprite: '',
      };

      const newMap = new maplibregl.Map({
        container: 'map',
        style: customStyle,
        center: [0, 0],
        zoom: 1,
        attributionControl: false,
      });

      newMap.addControl(new maplibregl.NavigationControl(), 'bottom-left');

      newMap.on('load', () => {
        console.log('Map loaded successfully');

        // Manually add the drawnFeatures source
        newMap.addSource('drawnFeatures', {
          type: 'geojson',
          data: {
            type: 'FeatureCollection',
            features: [],
          },
        });

        // Manually add all the drawnFeatures layers
        const drawnLayers = layers.slice(1); // Skip the OSM background layer
        drawnLayers.forEach((layer) => {
          newMap.addLayer(layer);
        });
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
      {map && <MapDrawing map={map} currentDefinition={currentDefinition} />}
      {map && <MapTaskDisplay map={map} currentTask={currentTask} />}
      {map && <MapLocation map={map} />}
      {map && <BaseMaps map={map} />}
    </Box>
  );
}
