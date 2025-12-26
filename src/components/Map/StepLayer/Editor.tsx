import { useCallback, useEffect, useRef } from 'react';
import type { Map } from 'maplibre-gl';
import type { FeatureCollection } from 'geojson';
import { HStack, IconButton } from '@chakra-ui/react';
import { MdArrowBack, MdSave } from 'react-icons/md';
import { useIsDrawSiteMode } from '../../../redux/selectors/globalSelector.ts';
import MapEditor, { type MapLayerEditorRef } from '../MapEditor.tsx';
import { ConfirmDialog } from '../../ConfirmDialog';

import 'maplibre-gl-draw/dist/mapbox-gl-draw.css';

interface MapStepLayerEditorProps {
  map: Map | null;
  geojson: FeatureCollection | null;
  isEditing: boolean;
  cancelEditing: () => void;
  enableVertexDragging?: boolean;
  apply: (geojson: FeatureCollection | null) => void;
  confirmDialogTitle: string;
  confirmDialogMessage: string;
  // Hide layers when editing
  hideRoadLayer: boolean;
}

/**
 * Editor component for the GEOJSON_ID_FILL layer in Index
 * Provides click-to-edit functionality with save/cancel controls
 */
export default function StepLayerEditor({
  map,
  geojson,
  isEditing,
  cancelEditing,
  enableVertexDragging,
  apply,
  confirmDialogTitle,
  confirmDialogMessage,
  hideRoadLayer,
}: MapStepLayerEditorProps) {
  const isDrawSite = useIsDrawSiteMode();
  const editorRef = useRef<MapLayerEditorRef | null>(null);

  /** Save edited features */
  const saveEdits = useCallback(() => {
    ConfirmDialog.confirm(confirmDialogTitle, confirmDialogMessage, () => {
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
      cancelEditing();

      apply({
        type: 'FeatureCollection',
        features: allDrawFeatures.features,
      });
    });
  }, [apply, cancelEditing, confirmDialogMessage, confirmDialogTitle]);

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
  return (
    <>
      <MapEditor
        map={map}
        defaultGeojson={geojson}
        enabled={isEditing}
        activeByDefault={true}
        enableVertexDragging={enableVertexDragging}
        ref={editorRef}
        hideRoadLayer={hideRoadLayer}
      />
      {isEditing && (
        <HStack className="editor-section">
          <IconButton
            onClick={saveEdits}
            size="md"
            // @ts-expect-error: A custom variant
            variant="primary.outline"
            title={`Apply changes to API permanently.`}
          >
            <MdSave />
          </IconButton>
          <IconButton
            onClick={cancelEditing}
            size="md"
            // @ts-expect-error: A custom variant
            variant="base"
          >
            <MdArrowBack />
          </IconButton>
        </HStack>
      )}
    </>
  );
}
