import { useCallback, useEffect, useRef } from 'react';
import type { Map } from 'maplibre-gl';
import maplibregl from 'maplibre-gl';
import type { FeatureCollection } from 'geojson';
import MaplibreDraw from 'maplibre-gl-draw';
import { Box, Button, Flex, Text } from '@chakra-ui/react';

interface MapStepLayerEditorProps {
  map: Map | null;
  geojson: FeatureCollection | null;
  setGeojson: (updatedGeojson: FeatureCollection) => void;
  isEditing: boolean;
  setIsEditing: (isEditing: boolean) => void;
}

/**
 * Editor component for the GEOJSON_ID_FILL layer in MapStepLayer
 * Provides click-to-edit functionality with save/cancel controls
 */
export default function MapStepLayerEditor({
  map,
  geojson,
  setGeojson,
  isEditing,
  setIsEditing,
}: MapStepLayerEditorProps) {
  const drawRef = useRef<MaplibreDraw | null>(null);

  /** Initialize MaplibreDraw control */
  useEffect(() => {
    if (!map) return;
    if (drawRef.current) return;

    const draw = new MaplibreDraw({
      displayControlsDefault: false,
      controls: {},
      styles: [
        // Inactive polygon fill
        {
          id: 'gl-draw-polygon-fill-inactive',
          type: 'fill',
          filter: ['all', ['==', '$type', 'Polygon'], ['!=', 'active', 'true']],
          paint: { 'fill-color': '#3bb2d0', 'fill-opacity': 0.1 },
        },
        // Active polygon fill
        {
          id: 'gl-draw-polygon-fill-active',
          type: 'fill',
          filter: ['all', ['==', '$type', 'Polygon'], ['==', 'active', 'true']],
          paint: { 'fill-color': '#fbb03b', 'fill-opacity': 0.3 },
        },
        // Inactive polygon stroke
        {
          id: 'gl-draw-polygon-stroke-inactive',
          type: 'line',
          filter: ['all', ['==', '$type', 'Polygon'], ['!=', 'active', 'true']],
          paint: { 'line-color': '#3bb2d0', 'line-width': 1 },
        },
        // Active polygon stroke
        {
          id: 'gl-draw-polygon-stroke-active',
          type: 'line',
          filter: ['all', ['==', '$type', 'Polygon'], ['==', 'active', 'true']],
          paint: { 'line-color': '#fbb03b', 'line-width': 3 },
        },
        // Inactive line
        {
          id: 'gl-draw-line-inactive',
          type: 'line',
          filter: ['all', ['==', '$type', 'LineString'], ['!=', 'active', 'true']],
          paint: { 'line-color': '#3bb2d0', 'line-width': 2 },
        },
        // Active line
        {
          id: 'gl-draw-line-active',
          type: 'line',
          filter: ['all', ['==', '$type', 'LineString'], ['==', 'active', 'true']],
          paint: { 'line-color': '#fbb03b', 'line-width': 3 },
        },
        // Vertex points
        {
          id: 'gl-draw-polygon-and-line-vertex-active',
          type: 'circle',
          filter: ['all', ['==', 'meta', 'vertex'], ['==', '$type', 'Point']],
          paint: {
            'circle-radius': 6,
            'circle-color': '#fbb03b',
            'circle-stroke-width': 2,
            'circle-stroke-color': '#fff',
          },
        },
        // Midpoint handles
        {
          id: 'gl-draw-polygon-and-line-midpoint',
          type: 'circle',
          filter: ['all', ['==', '$type', 'Point'], ['==', 'meta', 'midpoint']],
          paint: {
            'circle-radius': 5,
            'circle-color': '#fbb03b',
            'circle-opacity': 0.8,
            'circle-stroke-width': 1,
            'circle-stroke-color': '#fff',
          },
        },
      ],
    });

    map.addControl(draw as unknown as maplibregl.IControl);
    drawRef.current = draw;

    return () => {
      if (drawRef.current) {
        try {
          map.removeControl(drawRef.current as unknown as maplibregl.IControl);
        } catch (e) {
          console.error('Error removing draw control:', e);
        }
        drawRef.current = null;
      }
    };
  }, [map]);

  /** Enable editing for the whole layer (all features) */
  const enableEditing = () => {
    if (!drawRef.current || !geojson) return;
    if (!map) return;

    // Clear any existing features in draw
    // @ts-expect-error: Delete all features
    drawRef.current.deleteAll();

    // Add all features to draw control
    geojson.features
      .filter((f) => ['Polygon', 'MultiPolygon'].includes(f.geometry?.type))
      .forEach((f) => {
        drawRef.current!.add(f);
      });

    // Use direct_select mode - this allows vertex editing but prevents feature dragging
    // Users click on a feature to select it, then can edit vertices
    drawRef.current.changeMode('simple_select');

    setIsEditing(true);
  };

  /** Cancel editing */
  const cancelEditing = useCallback(() => {
    if (!drawRef.current) return;

    // @ts-expect-error: Delete all features
    drawRef.current.deleteAll();
    setIsEditing(false);
  }, []);

  /** Save edited features */
  const saveEdits = useCallback(() => {
    if (!drawRef.current) return;

    const allDrawFeatures = drawRef.current.getAll();

    if (allDrawFeatures.features.length === 0) {
      console.warn('No edited features found');
      cancelEditing();
      return;
    }

    // Clear draw control
    // @ts-expect-error: Delete all features
    drawRef.current.deleteAll();
    setIsEditing(false);

    // Call update callback with draw geojson
    setGeojson({
      type: 'FeatureCollection',
      features: allDrawFeatures.features,
    });
  }, [setGeojson, cancelEditing]);

  /** Cancel editing */
  useEffect(() => {
    if (!geojson) {
      cancelEditing();
    }
  }, [geojson, cancelEditing]);

  if (!(geojson && geojson.features.length > 0)) {
    return null;
  }
  return (
    <Box bg="white" borderRadius="md" boxShadow="md" p={2} zIndex={1}>
      {/* Edit Whole Layer Button - shown when not editing */}
      {!isEditing && (
        <Button
          size="sm"
          backgroundColor="white"
          color="inherit"
          onClick={enableEditing}
          fontWeight="semibold"
          width="100%"
        >
          ✏️ Edit Layer
        </Button>
      )}

      {/* Edit Controls - shown when editing */}
      {isEditing && (
        <>
          <Text fontSize="xs" color="gray.500" mb={3}>
            Click features to select. Drag vertices to edit.
          </Text>
          <Flex gap={2}>
            {/* @ts-expect-error: A custom variant */}
            <Button variant="primary" size="sm" onClick={saveEdits} flex={1}>
              ✓ Save
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={cancelEditing}
              fontWeight="semibold"
              flex={1}
            >
              ✕ Cancel
            </Button>
          </Flex>
        </>
      )}
    </Box>
  );
}
