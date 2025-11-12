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

        console.log('Source and layers added');

        // const newFeatures = {
        //   type: "FeatureCollection",
        //   features: [
        //     {
        //       type: "Feature",
        //       properties: { line_color: "yellow", line_number: "0" },
        //       geometry: {
        //         type: "LineString",
        //         coordinates: [
        //             [
        //                 21.954074836144315,
        //                 -13.012260239373362
        //             ],
        //             [
        //                 22.227771193261788,
        //                 -41.194631930988656
        //             ],
        //             [
        //                 50.14479961917789,
        //                 -42.620375803950694
        //             ]
        //         ]
        //       },
        //     },
        //   ],
        // };

        // // Now set the data
        // const drawnSource = newMap.getSource("drawnFeatures");
        // if (drawnSource && typeof drawnSource.setData === "function") {
        //   drawnSource.setData(newFeatures);
        //   console.log("Data set successfully:", newFeatures);

        //   // Debug: Check if layers exist
        //   const yellowLayer = newMap.getLayer("gl-draw-line-yellow");
        //   console.log("Yellow layer exists:", !!yellowLayer);

        //   // Fit map to the feature bounds
        //   const coordinates = newFeatures.features[0].geometry.coordinates;
        //   const bounds = coordinates.reduce((bounds, coord) => {
        //     return bounds.extend(coord);
        //   }, new maplibregl.LngLatBounds(coordinates[0], coordinates[0]));

        //   newMap.fitBounds(bounds, {
        //     padding: 50
        //   });
        // } else {
        //   console.error("drawnFeatures source not found or setData not available");
        // }
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
