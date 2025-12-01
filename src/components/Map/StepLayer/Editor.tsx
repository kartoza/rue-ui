import { useCallback, useEffect, useRef } from 'react';
import type { Map } from 'maplibre-gl';
import type { FeatureCollection } from 'geojson';
import { Box, Button, Flex, Text } from '@chakra-ui/react';
import { useCurrentDrawMode } from '../../../redux/selectors/globalSelector.ts';
import { DrawingMode } from '../../../redux/reducers/global.ts';
import MapEditor, { type MapLayerEditorRef } from '../MapEditor.tsx';

import 'maplibre-gl-draw/dist/mapbox-gl-draw.css';

interface MapStepLayerEditorProps {
  map: Map | null;
  geojson: FeatureCollection | null;
  setGeojson: (updatedGeojson: FeatureCollection) => void;
  isEditing: boolean;
  setIsEditing: (isEditing: boolean) => void;
}

/**
 * Editor component for the GEOJSON_ID_FILL layer in Index
 * Provides click-to-edit functionality with save/cancel controls
 */
export default function StepLayerEditor({
  map,
  geojson,
  setGeojson,
  isEditing,
  setIsEditing,
}: MapStepLayerEditorProps) {
  const isDrawSite = useCurrentDrawMode() == DrawingMode.DRAW_SITE;
  const editorRef = useRef<MapLayerEditorRef | null>(null);

  /** Enable editing for the whole layer (all features) */
  const enableEditing = () => {
    // Just set isEditing to true - the useEffect will create the draw control and load features
    setIsEditing(true);
  };

  /** Cancel editing */
  const cancelEditing = useCallback(() => {
    // Just set isEditing to false - the useEffect will clean up the draw control
    setIsEditing(false);
  }, [setIsEditing]);

  /** Save edited features */
  const saveEdits = useCallback(() => {
    const drawRef = editorRef.current?.getDrawRef();
    if (!drawRef?.current) return;

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
  if (isDrawSite) {
    return null;
  }
  geojson.features = geojson.features.filter((f) =>
    ['Polygon', 'MultiPolygon'].includes(f.geometry?.type)
  );
  return (
    <Box bg="white" borderRadius="md" boxShadow="md" p={2} zIndex={1}>
      <MapEditor
        map={map}
        defaultGeojson={geojson}
        enabled={isEditing}
        activeByDefault={true}
        ref={editorRef}
      />
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
          <Text fontSize="xs" color="gray.500" mb={2}>
            Click features to select. Drag vertices to edit.
          </Text>
          <Flex gap={2} mb={2}>
            <Button
              colorScheme="red"
              variant="outline"
              size="sm"
              onClick={() => {
                editorRef?.current?.deleteSelected();
              }}
              flex={1}
            >
              🗑️ Delete Selected
            </Button>
          </Flex>
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
