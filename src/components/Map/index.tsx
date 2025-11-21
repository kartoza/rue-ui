import { useEffect, useState } from 'react';
import maplibregl, { Map as MapLibreMap } from 'maplibre-gl';
import { Box } from '@chakra-ui/react';
import { layers } from './data';
import MapDrawing from './MapDrawing';
import MapLocation from './MapLocation';
import BaseMaps from './BaseMaps';
import MapTaskDisplay from './MapTaskDisplay';
import ProjectControl from '../ProjectControl';
import StepControl from '../StepControl';

import type { DefinitionType } from '../../redux/reducers/definitionSlice';
import type { StepType } from '../../redux/reducers/stepSlice';

import 'maplibre-gl/dist/maplibre-gl.css';
import './style.scss';

/** MapLibre component. */

interface MapLibreProps {
  currentDefinition: DefinitionType;
  currentStep: StepType;
}

export default function MapLibre({ currentDefinition, currentStep }: MapLibreProps) {
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
          newMap.addLayer(layer as maplibregl.LayerSpecification);
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
      {map && <MapTaskDisplay map={map} currentStep={currentStep} />}
      {map && <MapLocation map={map} />}
      {map && <BaseMaps map={map} />}
      {map && <ProjectControl />}
      {map && <StepControl />}
    </Box>
  );
}
