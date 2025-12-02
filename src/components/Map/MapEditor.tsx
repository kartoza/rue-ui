import { forwardRef, type RefObject, useEffect, useImperativeHandle, useRef } from 'react';
import type { Map } from 'maplibre-gl';
import maplibregl from 'maplibre-gl';
import type { FeatureCollection } from 'geojson';
import MaplibreDraw from 'maplibre-gl-draw';
import { hasLayer } from '../../utils/maplibre.tsx';
import layerStyle from './layer_style.json';
import { ROAD_ID } from './SiteLayer';

export const GEOJSON_ID_FILL: string = 'task-layer-fill';
export const GEOJSON_ID_LINE: string = 'task-layer-line';

interface Props {
  map: Map | null;
  defaultGeojson: FeatureCollection | null;
  enabled: boolean;
  activeByDefault: boolean;
  onFeaturesChanged?: () => void;
  hideRoad: boolean;
}

export interface MapLayerEditorRef {
  deleteSelected: () => void;
  getDrawRef: () => RefObject<MaplibreDraw | null>;
}

/** This is editor for layer editor */
const MapEditor = forwardRef<MapLayerEditorRef, Props>(
  ({ map, defaultGeojson, enabled, activeByDefault, onFeaturesChanged, hideRoad }, ref) => {
    const drawRef = useRef<MaplibreDraw | null>(null);

    // Expose deleteSelected method to parent components
    useImperativeHandle(
      ref,
      () => ({
        deleteSelected: () => {
          if (!drawRef.current) return;

          const selectedFeatures = drawRef.current.getSelected();
          if (selectedFeatures.features.length === 0) {
            return;
          }

          // Delete selected features
          selectedFeatures.features.forEach((feature) => {
            if (feature.id) {
              drawRef.current!.delete(feature.id.toString());
            }
          });
        },
        getDrawRef: () => {
          return drawRef;
        },
      }),
      []
    );

    /** On change is editing */
    useEffect(() => {
      if (!map) return;

      // Hide road layer
      if (hasLayer(map, ROAD_ID) && enabled && hideRoad) {
        map.setLayoutProperty(ROAD_ID, 'visibility', 'none');
      }

      if (!hasLayer(map, GEOJSON_ID_FILL)) return;
      if (!hasLayer(map, GEOJSON_ID_LINE)) return;
      if (enabled) {
        map.setLayoutProperty(GEOJSON_ID_FILL, 'visibility', 'none');
        map.setLayoutProperty(GEOJSON_ID_LINE, 'visibility', 'none');
      } else {
        if (hasLayer(map, ROAD_ID)) {
          map.setLayoutProperty(ROAD_ID, 'visibility', 'visible');
        }
        map.setLayoutProperty(GEOJSON_ID_FILL, 'visibility', 'visible');
        map.setLayoutProperty(GEOJSON_ID_LINE, 'visibility', 'visible');
      }
    }, [map, enabled]);

    /** Create/remove MaplibreDraw control based on isEditing state */
    useEffect(() => {
      if (!map) return;

      // Only create draw control when editing is active and not in draw site mode
      if (!enabled) {
        // Clean up draw control if it exists
        if (drawRef.current) {
          const drawControl = drawRef.current;

          // Get all layers from the map
          const mapStyle = map.getStyle();
          if (mapStyle && mapStyle.layers) {
            // Remove all layers that belong to MaplibreDraw
            const layersToRemove = mapStyle.layers
              .filter((layer) => {
                const layerId = layer.id;
                // Remove MaplibreDraw's internal layers (start with gl-draw-)
                return layerId.startsWith('gl-draw-');
              })
              .map((layer) => layer.id);

            // Remove all these layers
            layersToRemove.forEach((layerId) => {
              try {
                if (map.getLayer(layerId)) {
                  map.removeLayer(layerId);
                }
              } catch (e) {
                console.warn(`Error removing layer ${layerId}:`, e);
              }
            });
          }

          // Remove the draw control
          try {
            map.removeControl(drawControl as unknown as maplibregl.IControl);
          } catch (e) {
            console.warn('Error removing draw control:', e);
          }

          // Remove all draw-related sources
          const sources = map.getStyle()?.sources;
          if (sources) {
            Object.keys(sources).forEach((sourceId) => {
              if (sourceId.startsWith('mapbox-gl-draw-')) {
                try {
                  if (map.getSource(sourceId)) {
                    map.removeSource(sourceId);
                  }
                } catch (e) {
                  console.warn(`Error removing source ${sourceId}:`, e);
                }
              }
            });
          }

          drawRef.current = null;
        }
        return;
      }

      // Create draw control if it doesn't exist and editing is active
      if (!drawRef.current) {
        const draw = new MaplibreDraw({
          displayControlsDefault: false,
          userProperties: true,
          controls: {},
          styles: [
            // Polygon being cut - highest priority
            {
              id: 'gl-draw-polygon-fill-cutting',
              type: 'fill',
              filter: ['all', ['==', '$type', 'Polygon'], ['==', 'user_cutting', true]],
              paint: {
                'fill-color': '#fbb03b',
                'fill-opacity': 0.5,
                'fill-outline-color': '#ff6b35',
              },
            },
            {
              id: 'gl-draw-polygon-stroke-cutting',
              type: 'line',
              filter: ['all', ['==', '$type', 'Polygon'], ['==', 'user_cutting', true]],
              paint: { 'line-color': '#ff6b35', 'line-width': 3 },
            },
            // Inactive polygon fill
            {
              id: 'gl-draw-polygon-fill-inactive',
              type: 'fill',
              filter: [
                'all',
                ['==', '$type', 'Polygon'],
                ['!=', 'active', 'true'],
                ['!=', 'user_cutting', true],
              ],
              paint: {
                'fill-color': '#ff6b35',
                'fill-opacity': 0.3,
                'fill-outline-color': '#ff6b35',
              },
            },
            // Active polygon fill
            {
              id: 'gl-draw-polygon-fill-active',
              type: 'fill',
              filter: [
                'all',
                ['==', '$type', 'Polygon'],
                ['==', 'active', 'true'],
                ['!=', 'user_cutting', true],
              ],
              paint: {
                'fill-color': '#fbb03b',
                'fill-outline-color': '#000000',
                'fill-opacity': 0.5,
              },
            },
            // Inactive polygon stroke
            {
              id: 'gl-draw-polygon-stroke-inactive',
              type: 'line',
              filter: [
                'all',
                ['==', '$type', 'Polygon'],
                ['!=', 'active', 'true'],
                ['!=', 'user_cutting', true],
              ],
              paint: { 'line-color': '#ff6b35' },
              layout: {
                'line-join': 'round',
                'line-cap': 'round',
              },
            },
            // Active polygon stroke
            {
              id: 'gl-draw-polygon-stroke-active',
              type: 'line',
              filter: [
                'all',
                ['==', '$type', 'Polygon'],
                ['==', 'active', 'true'],
                ['!=', 'user_cutting', true],
              ],
              paint: { 'line-color': '#fbb03b', 'line-width': 3 },
              layout: {
                'line-join': 'round',
                'line-cap': 'round',
              },
            },
            // Inactive line
            {
              id: 'gl-draw-line-inactive',
              type: 'line',
              filter: ['all', ['==', '$type', 'LineString'], ['!=', 'active', 'true']],
              paint: {
                'line-color': layerStyle.road_color,
                'line-width': layerStyle.road_width,
              },
              layout: {
                'line-join': 'round',
                'line-cap': 'round',
              },
            },
            // Active line
            {
              id: 'gl-draw-line-active',
              type: 'line',
              filter: ['all', ['==', '$type', 'LineString'], ['==', 'active', 'true']],
              paint: {
                'line-color': layerStyle.road_color,
                'line-width': layerStyle.road_width,
              },
              layout: {
                'line-join': 'round',
                'line-cap': 'round',
              },
            },
            // Symbol line label
            {
              id: 'gl-draw-line-label',
              type: 'symbol',
              filter: ['==', '$type', 'LineString'],
              layout: {
                'symbol-placement': 'line',
                'text-field': ['coalesce', ['get', 'road_pcent'], ['get', 'user_road_pcent']],
                'text-size': 14,
                'text-allow-overlap': true,
              },
              paint: {
                'text-color': '#FFFFFF',
                'text-halo-color': '#555555',
                'text-halo-width': 1,
              },
            },
            // Vertex points
            {
              id: 'gl-draw-polygon-and-line-vertex-active',
              type: 'circle',
              filter: ['all', ['==', 'meta', 'vertex'], ['==', '$type', 'Point']],
              paint: {
                'circle-radius': 5,
                'circle-color': '#FFFFFF',
                'circle-stroke-width': 2,
                'circle-stroke-color': '#000000',
              },
            },
            {
              id: 'gl-draw-polygon-and-line-midpoint',
              type: 'circle',
              filter: ['all', ['==', '$type', 'Point'], ['==', 'meta', 'midpoint']],
              paint: {
                'circle-radius': 4,
                'circle-color': '#FFFFFF',
                'circle-opacity': 0.8,
                'circle-stroke-width': 1,
                'circle-stroke-color': '#000000',
              },
            },
          ],
        });

        map.addControl(draw as unknown as maplibregl.IControl);
        drawRef.current = draw;

        // Load geojson features into draw control if available
        if (defaultGeojson) {
          defaultGeojson.features.forEach((f) => {
            draw.add(f);
          });
          if (activeByDefault) {
            draw.changeMode('simple_select');
          }
        }

        // Set up event listeners for feature changes
        if (onFeaturesChanged) {
          map.on('draw.update', onFeaturesChanged);
          map.on('draw.delete', onFeaturesChanged);
        }
      }

      return () => {
        // Clean up event listeners
        if (onFeaturesChanged) {
          map.off('draw.update', onFeaturesChanged);
          map.off('draw.delete', onFeaturesChanged);
        }

        // Clean up draw control
        if (drawRef.current) {
          const drawControl = drawRef.current;

          // Get all layers from the map
          const mapStyle = map.getStyle();
          if (mapStyle && mapStyle.layers) {
            // Remove all layers that belong to MaplibreDraw
            const layersToRemove = mapStyle.layers
              .filter((layer) => {
                const layerId = layer.id;
                // Remove MaplibreDraw's internal layers (start with gl-draw-)
                return layerId.startsWith('gl-draw-');
              })
              .map((layer) => layer.id);

            // Remove all these layers
            layersToRemove.forEach((layerId) => {
              try {
                if (map.getLayer(layerId)) {
                  map.removeLayer(layerId);
                }
              } catch (e) {
                console.warn(`Error removing layer ${layerId}:`, e);
              }
            });
          }

          // Remove the draw control
          try {
            map.removeControl(drawControl as unknown as maplibregl.IControl);
          } catch (e) {
            console.warn('Error removing draw control:', e);
          }

          // Remove all draw-related sources
          const sources = map.getStyle()?.sources;
          if (sources) {
            Object.keys(sources).forEach((sourceId) => {
              if (sourceId.startsWith('mapbox-gl-draw-')) {
                try {
                  if (map.getSource(sourceId)) {
                    map.removeSource(sourceId);
                  }
                } catch (e) {
                  console.warn(`Error removing source ${sourceId}:`, e);
                }
              }
            });
          }

          drawRef.current = null;
        }
      };
    }, [map, defaultGeojson, enabled]);

    return null;
  }
);

export default MapEditor;
