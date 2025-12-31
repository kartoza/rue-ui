import {
  forwardRef,
  type RefObject,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import type { Map } from 'maplibre-gl';
import maplibregl from 'maplibre-gl';
import type { FeatureCollection, LineString, Polygon } from 'geojson';
import MaplibreDraw from 'maplibre-gl-draw';
import { hasLayer } from '../../utils/maplibre.tsx';
import layerStyle from './layer_style.json';
import { Box, HStack, IconButton } from '@chakra-ui/react';
import { FaScissors } from 'react-icons/fa6';
import { MdDelete, MdDeleteSweep, MdHelp } from 'react-icons/md';
import polygonToLine from '@turf/polygon-to-line';
import lineSplit from '@turf/line-split';
import { polygon as turfPolygon } from '@turf/helpers';
import { Toaster } from '../Toaster/toaster.ts';
import { ConfirmDialog } from '../ConfirmDialog';
import {
  type DraggedVertex,
  findMatchedVertices,
  getCoordinatesFromPath,
  updateCoordinatesAtPath,
} from './MapEditorUtilis';

export const GEOJSON_ID_FILL: string = 'task-layer-fill';
export const GEOJSON_ID_LINE: string = 'task-layer-line';

interface Props {
  map: Map | null;
  defaultGeojson: FeatureCollection | null;
  enabled: boolean;
  activeByDefault: boolean;
  enableVertexDragging?: boolean;
  onFeaturesChanged?: () => void;
  additionalHelp?: React.ReactNode;
}

export interface MapLayerEditorRef {
  getDrawRef: () => RefObject<MaplibreDraw | null>;
}

/** This is editor for layer editor */
const MapEditor = forwardRef<MapLayerEditorRef, Props>(
  (
    {
      map,
      defaultGeojson,
      enabled,
      activeByDefault,
      onFeaturesChanged,
      additionalHelp,
      enableVertexDragging = false,
    },
    ref
  ) => {
    const drawRef = useRef<MaplibreDraw | null>(null);
    const [showHelp, setShowHelp] = useState(true);

    // Expose deleteSelected method to parent components
    useImperativeHandle(
      ref,
      () => ({
        getDrawRef: () => {
          return drawRef;
        },
      }),
      []
    );

    /** On change is editing */
    useEffect(() => {
      if (!map) return;

      if (!hasLayer(map, GEOJSON_ID_FILL)) return;
      if (!hasLayer(map, GEOJSON_ID_LINE)) return;
      if (enabled) {
        map.setLayoutProperty(GEOJSON_ID_FILL, 'visibility', 'none');
        map.setLayoutProperty(GEOJSON_ID_LINE, 'visibility', 'none');
      } else {
        map.setLayoutProperty(GEOJSON_ID_FILL, 'visibility', 'visible');
        map.setLayoutProperty(GEOJSON_ID_LINE, 'visibility', 'visible');
      }
    }, [map, enabled]);

    /** Create/remove MaplibreDraw control based on isEditing state */
    useEffect(() => {
      if (!map) return;

      // Track which vertex is being dragged
      let draggedVertex: DraggedVertex | null = null;

      // Handle mousedown on vertex to track which one is being dragged
      const handleVertexMouseDown = (e: maplibregl.MapMouseEvent) => {
        const features = map.queryRenderedFeatures(e.point, {
          layers: [
            'gl-draw-polygon-and-line-vertex-active.hot',
            'gl-draw-polygon-and-line-vertex-active.cold',
          ],
        });
        if (features && features.length > 0) {
          const vertex = features[0];
          if (vertex.geometry.type === 'Point') {
            const coordPath = vertex.properties?.coord_path || '';
            const featureId = vertex.properties?.parent || '';
            const vertexCoords = vertex.geometry.coordinates as number[];

            // Find all features that have a vertex at the same coordinates
            const matchedVertices = findMatchedVertices(drawRef.current, vertexCoords, featureId);

            draggedVertex = {
              coordinates: vertexCoords,
              coordPath: coordPath,
              featureId: featureId,
              matchedVertices: matchedVertices,
            };
          }
        }
      };

      // Handle mouseup to clear dragged vertex
      const handleVertexMouseUp = () => {
        if (draggedVertex) {
          draggedVertex = null;
        }
      };

      // Handle vertex dragging in real-time
      const handleVertexDrag = () => {
        if (!draggedVertex) return;
        // This fires continuously while dragging
        if (drawRef.current) {
          // Get all features and find the current feature being dragged
          const allFeatures = drawRef.current.getAll();
          const currentFeature = allFeatures.features.find(
            // @ts-expect-error : featureId is a string
            (f) => f.id?.toString() === draggedVertex.featureId.toString()
          );
          if (!currentFeature) return;

          // Get the new coordinates from the dragged vertex
          const newCoords = getCoordinatesFromPath(currentFeature, draggedVertex.coordPath);
          if (!newCoords) return;

          // If we found the new coordinates, update all matched vertices
          if (draggedVertex.matchedVertices.length > 0) {
            draggedVertex.matchedVertices.forEach((matchedVertex) => {
              const feature = allFeatures.features.find(
                (f) => f.id?.toString() === matchedVertex.featureId
              );
              if (!feature) return;

              // Update coordinates at the matched vertex path
              updateCoordinatesAtPath(feature, matchedVertex.coordPath, newCoords);

              // Update the feature in the draw control
              drawRef.current!.add(feature);
            });
          }
        }
      };

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
                'circle-stroke-width': 3,
                'circle-stroke-color': '#fbb03b',
              },
            },
            {
              id: 'gl-draw-polygon-and-line-midpoint',
              type: 'circle',
              filter: ['all', ['==', '$type', 'Point'], ['==', 'meta', 'midpoint']],
              paint: {
                'circle-radius': 3,
                'circle-color': '#FFFFFF',
                'circle-opacity': 0.8,
                'circle-stroke-width': 1,
                'circle-stroke-color': '#555555',
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

        // Track vertex drag start and end only if vertex dragging is enabled
        if (enableVertexDragging) {
          map.on('mousedown', handleVertexMouseDown);
          map.on('mouseup', handleVertexMouseUp);

          // Handle vertex dragging in real-time
          map.on('draw.render', handleVertexDrag);
        }
      }

      return () => {
        // Clean up event listeners
        if (onFeaturesChanged) {
          map.off('draw.update', onFeaturesChanged);
          map.off('draw.delete', onFeaturesChanged);
        }

        // Clean up vertex dragging event listeners if they were enabled
        if (enableVertexDragging) {
          map.off('mousedown', handleVertexMouseDown);
          map.off('mouseup', handleVertexMouseUp);
          map.off('draw.render', handleVertexDrag);
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
    }, [map, defaultGeojson, enabled, enableVertexDragging]);

    /** Delete selected features **/
    const deleteSelected = useCallback(() => {
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
      if (onFeaturesChanged) {
        onFeaturesChanged();
      }
    }, [onFeaturesChanged]);

    /** Delete all features **/
    const deleteAll = useCallback(() => {
      if (!drawRef.current) return;
      ConfirmDialog.danger(
        'Delete all features',
        `Are you sure you want to delete all features? This action cannot be undone.`,
        () => {
          if (!drawRef.current) return;
          const allFeatures = drawRef.current.getAll();
          if (allFeatures.features.length === 0) {
            return;
          }

          // Delete all features
          allFeatures.features.forEach((feature) => {
            if (feature.id) {
              drawRef.current!.delete(feature.id.toString());
            }
          });
          if (onFeaturesChanged) {
            onFeaturesChanged();
          }
        }
      );
    }, [onFeaturesChanged]);

    /** Handle keyboard events for delete */
    useEffect(() => {
      if (!enabled || !map) return;

      const handleKeyDown = (event: KeyboardEvent) => {
        // Check if Delete or Backspace key is pressed
        if (event.key === 'Delete' || event.key === 'Backspace') {
          // Prevent default browser behavior for Backspace
          event.preventDefault();
          deleteSelected();
        }
      };

      // Add event listener
      document.addEventListener('keydown', handleKeyDown);

      // Cleanup
      return () => {
        document.removeEventListener('keydown', handleKeyDown);
      };
    }, [enabled, map, deleteSelected]);

    /** Handle right-click on vertex to delete it */
    useEffect(() => {
      if (!enabled || !map || !drawRef.current) return;

      const handleContextMenu = (e: maplibregl.MapMouseEvent) => {
        e.preventDefault();

        // Query for vertex features at the click point
        const features = map.queryRenderedFeatures(e.point, {
          layers: [
            'gl-draw-polygon-and-line-vertex-active.hot',
            'gl-draw-polygon-and-line-vertex-active.cold',
          ],
        });

        if (features.length === 0) return;

        const vertexFeature = features[0];
        const draw = drawRef.current;
        if (!draw) return;

        // Get the parent feature ID from the vertex properties
        const parentId = vertexFeature.properties?.parent;
        if (!parentId) return;

        // Get the parent feature
        const allFeatures = draw.getAll();
        const parentFeature = allFeatures.features.find((f) => f.id === parentId);
        if (!parentFeature) return;

        // Get vertex coordinate path from properties
        const coordPath = vertexFeature.properties?.coord_path;
        if (!coordPath) return;

        // Ensure we're working with a supported geometry type
        if (
          parentFeature.geometry.type !== 'Polygon' &&
          parentFeature.geometry.type !== 'LineString'
        ) {
          return;
        }

        // Parse the coordinate path (format: "0.1" means first ring, second coordinate)
        const pathParts = coordPath.split('.');
        const coords = JSON.parse(
          JSON.stringify((parentFeature.geometry as Polygon | LineString).coordinates)
        );

        // Determine minimum vertices based on geometry type
        let minVertices = 0;
        if (parentFeature.geometry.type === 'Polygon') {
          minVertices = 4; // Minimum 4 vertices for a valid polygon (including closing vertex)
        } else if (parentFeature.geometry.type === 'LineString') {
          minVertices = 2; // Minimum 2 vertices for a valid line
        }

        // Get the current vertex count based on geometry type
        let currentVertexCount = 0;
        if (parentFeature.geometry.type === 'Polygon') {
          currentVertexCount = coords[0].length;
        } else if (parentFeature.geometry.type === 'LineString') {
          currentVertexCount = coords.length;
        }

        // Check if we can delete this vertex
        if (currentVertexCount <= minVertices) {
          Toaster.warning(
            'Cannot delete vertex',
            `A ${parentFeature.geometry.type.toLowerCase()} must have at least ${minVertices - (parentFeature.geometry.type === 'Polygon' ? 1 : 0)} vertices`
          );
          return;
        }

        // Remove the vertex based on geometry type
        if (parentFeature.geometry.type === 'Polygon') {
          const ringIndex = parseInt(pathParts[0], 10);
          const vertexIndex = parseInt(pathParts[1], 10);
          coords[ringIndex].splice(vertexIndex, 1);

          // For polygons, ensure first and last coordinates are still the same
          if (coords[ringIndex].length > 0) {
            coords[ringIndex][coords[ringIndex].length - 1] = coords[ringIndex][0];
          }
        } else if (parentFeature.geometry.type === 'LineString') {
          const vertexIndex = parseInt(pathParts[0], 10);
          coords.splice(vertexIndex, 1);
        }

        // Create updated feature
        const updatedFeature = {
          ...parentFeature,
          geometry: {
            ...parentFeature.geometry,
            coordinates: coords,
          },
        } as typeof parentFeature;

        // Delete old feature and add updated one
        draw.delete(parentId);
        draw.add(updatedFeature);

        // Reselect the feature to keep it active
        draw.changeMode('direct_select', { featureId: parentId });

        // Trigger features changed callback
        if (onFeaturesChanged) {
          onFeaturesChanged();
        }
      };

      // Add event listener for right-click
      map.on('contextmenu', handleContextMenu);

      // Cleanup
      return () => {
        map.off('contextmenu', handleContextMenu);
      };
    }, [enabled, map, onFeaturesChanged]);

    /** cut polygon with line **/
    const cutPolygonWithLine = () => {
      const drawControl = drawRef.current;
      if (!drawControl) return;

      // Get selected features (polygons only)
      const selectedFeatures = drawControl.getSelected();
      const polygons = selectedFeatures.features.filter((f) => f.geometry.type === 'Polygon');
      if (polygons.length === 0) {
        Toaster.warning('Cutting error', 'No polygon selected');
        return;
      }

      // Get ALL lines from the entire geojson
      const allFeatures = drawControl.getAll();
      const lines = allFeatures.features.filter((f) => f.geometry.type === 'LineString');

      if (lines.length === 0) {
        Toaster.warning('Cutting error', 'No roads found in the map');
        return;
      }

      // Cut each selected polygon with each selected line
      polygons.forEach((polygon) => {
        let wasSplit = false;
        const newPolygons: GeoJSON.Feature<Polygon>[] = [];

        lines.forEach((line) => {
          try {
            const polygonFeature = polygon as GeoJSON.Feature<Polygon>;
            const lineFeature = line as GeoJSON.Feature<LineString>;

            // Get the exterior ring of the polygon as a LineString
            const polygonRingResult = polygonToLine(polygonFeature);

            if (!polygonRingResult) {
              Toaster.warning('Cutting error', 'Could not convert polygon to line');
              return;
            }

            // polygonToLine can return either a Feature or FeatureCollection
            // For polygons with holes, it returns FeatureCollection
            // We'll use the first feature (exterior ring) for splitting
            let polygonRing: GeoJSON.Feature<LineString>;
            if (polygonRingResult.type === 'FeatureCollection') {
              if (polygonRingResult.features.length === 0) {
                Toaster.warning('Cutting error', 'No line features found from polygon');
                return;
              }
              polygonRing = polygonRingResult.features[0] as GeoJSON.Feature<LineString>;
            } else {
              polygonRing = polygonRingResult as GeoJSON.Feature<LineString>;
            }

            // Split the polygon's exterior ring with the cutting line
            const splitRing = lineSplit(polygonRing, lineFeature);

            if (splitRing && splitRing.features.length >= 2) {
              wasSplit = true;

              // For each split segment, try to create a new polygon
              // This is a simplified approach - combine the split segments with the cutting line
              splitRing.features.forEach((ringSegment: GeoJSON.Feature<LineString>) => {
                try {
                  // Get coordinates from the ring segment
                  const segmentCoords = ringSegment.geometry.coordinates;
                  const lineCoords = lineFeature.geometry.coordinates;

                  // Create a closed ring by combining segment with part of the cutting line
                  // This is a simplified approach and may need refinement based on your specific needs
                  const newCoords = [...segmentCoords];

                  // Try to close the polygon by adding line coordinates if needed
                  if (
                    newCoords[0][0] !== newCoords[newCoords.length - 1][0] ||
                    newCoords[0][1] !== newCoords[newCoords.length - 1][1]
                  ) {
                    // Add line coordinates to close the polygon
                    const closingCoords = [...lineCoords];
                    newCoords.push(...closingCoords, newCoords[0]);
                  }

                  const newPolygon = turfPolygon([newCoords]);
                  newPolygons.push(newPolygon);
                } catch (error) {
                  Toaster.error('Cutting error', `Error creating split polygon segment:${error}`);
                }
              });
            } else {
              Toaster.warning(
                'Cutting error',
                `Line does not intersect polygon sufficiently for splitting`
              );
            }
          } catch (error) {
            Toaster.error('Cutting error', `Error splitting polygon:${error}`);
          }
        });

        // After processing all lines, delete the original and add all new polygons
        if (wasSplit && newPolygons.length > 0) {
          // Get existing feature IDs before adding new ones
          const existingIds = drawControl.getAll().features.map((f) => f.id as string);

          // Delete the original polygon
          if (polygon.id) {
            drawControl.delete(polygon.id as string);
          }

          // Add all new split polygons
          newPolygons.forEach((newPolygon) => {
            drawControl.add(newPolygon);
          });

          // Get all feature IDs after adding new polygons
          const allIds = drawControl.getAll().features.map((f) => f.id as string);

          // Find the newly added IDs (difference between allIds and existingIds)
          const newPolygonIds = allIds.filter((id) => !existingIds.includes(id));

          // Auto-select the newly created polygons
          if (newPolygonIds.length > 0) {
            drawControl.changeMode('simple_select', { featureIds: newPolygonIds });
          }
        }
      });

      // Update the features in Redux
      requestAnimationFrame(() => {
        if (onFeaturesChanged) {
          onFeaturesChanged();
        }
      });
    };

    if (!enabled) return null;
    return (
      <>
        <HStack className="editor-section">
          {/* Cut polygon with roads */}
          {/*TODO: Need to fix this */}
          <IconButton
            display={'none'}
            onClick={cutPolygonWithLine}
            size="md"
            // @ts-expect-error: A custom variant
            variant="danger.basic"
            title={`Cut polygon with roads`}
          >
            <FaScissors />
          </IconButton>
          {/* DELETE selected button */}
          <IconButton
            onClick={deleteSelected}
            size="md"
            // @ts-expect-error: A custom variant
            variant="danger.basic"
            title={`Delete selected features`}
          >
            <MdDelete />
          </IconButton>
          {/* DELETE all button */}
          <IconButton
            onClick={deleteAll}
            size="md"
            // @ts-expect-error: A custom variant
            variant="danger.basic"
            title={`Delete all features`}
          >
            <MdDeleteSweep />
          </IconButton>
          <IconButton
            onClick={() => setShowHelp(!showHelp)}
            // @ts-expect-error: A custom variant
            variant={showHelp ? 'base' : 'primary.outline'}
            size="md"
            title={showHelp ? 'Hide help' : 'Show help'}
          >
            <MdHelp />
          </IconButton>
        </HStack>
        {showHelp && (
          <Box
            className="editor-help"
            bg="blue.50"
            borderLeft="4px solid"
            borderColor="blue.400"
            p={3}
            borderRadius="md"
            fontSize="sm"
            maxWidth={60}
            onClick={() => setShowHelp(false)}
            cursor="pointer"
            _hover={{ bg: 'blue.100' }}
          >
            <Box fontWeight="semibold" mb={2} color="blue.700">
              <MdHelp style={{ display: 'inline', marginRight: '8px' }} />
              Quick Help
            </Box>
            <Box as="ul" pl={4} spaceY={1}>
              <Box as="li" mb={1}>
                Select a feature by clicking on it.
              </Box>
              <Box as="li" mb={1}>
                Make multiple selections by holding down Shift and clicking additional features, or
                use the box selection tool by clicking and dragging on the map.
              </Box>
              <Box as="li">
                <IconButton
                  size="md"
                  // @ts-expect-error: A custom variant
                  variant="danger.basic"
                  display="inline-flex"
                  verticalAlign="middle"
                  mr={-2}
                >
                  <MdDelete />
                </IconButton>{' '}
                Deletes selected features.
              </Box>
              <Box as="li">You can also press the Delete key to delete selected features.</Box>
              <Box as="li">
                <IconButton
                  size="md"
                  // @ts-expect-error: A custom variant
                  variant="danger.basic"
                  display="inline-flex"
                  verticalAlign="middle"
                >
                  <MdDeleteSweep />
                </IconButton>{' '}
                Deletes all features.
              </Box>
              <Box as="li">
                To delete a vertex, select a feature and right-click on any vertex (shown as{' '}
                <span
                  style={{
                    display: 'inline-block',
                    width: '12px',
                    height: '12px',
                    borderRadius: '50%',
                    border: '3px solid #fbb03b',
                    backgroundColor: '#FFFFFF',
                    verticalAlign: 'middle',
                  }}
                />
                ) to remove it.
              </Box>
              {additionalHelp}
            </Box>
          </Box>
        )}
      </>
    );
  }
);

export default MapEditor;
