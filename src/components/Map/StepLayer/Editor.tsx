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
  setIsEditing: (isEditing: boolean) => void;
  apply: (geojson: FeatureCollection | null) => void;
}

/**
 * Editor component for the GEOJSON_ID_FILL layer in Index
 * Provides click-to-edit functionality with save/cancel controls
 */
export default function StepLayerEditor({
  map,
  geojson,
  isEditing,
  setIsEditing,
  apply,
}: MapStepLayerEditorProps) {
  const isDrawSite = useIsDrawSiteMode();
  const editorRef = useRef<MapLayerEditorRef | null>(null);

  /** Cancel edited features */
  const cancelEditing = useCallback(() => {
    ConfirmDialog.confirm('Cancel editing', `Are you sure want to discard your changes?`, () => {
      setIsEditing(false);
    });
  }, [setIsEditing]);

  /** Save edited features */
  const saveEdits = useCallback(() => {
    ConfirmDialog.confirm(
      'Update step',
      `This will change the output of the current step and rerun all subsequent steps. Are you sure you want to save to the backend? This action cannot be undone.`,
      () => {
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

        apply({
          type: 'FeatureCollection',
          features: allDrawFeatures.features,
        });
      }
    );
  }, [cancelEditing]);

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
        ref={editorRef}
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
