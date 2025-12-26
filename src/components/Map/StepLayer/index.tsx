import { useCallback, useEffect, useState } from 'react';
import maplibregl, { Map } from 'maplibre-gl';
import { useDispatch } from 'react-redux';
import type { FeatureCollection } from 'geojson';
import { Box, HStack, IconButton, Spinner } from '@chakra-ui/react';
import {
  useCurrentProjectDone,
  useCurrentProjectStep,
  useCurrentProjectUpdate,
  useCurrentProjectUUID,
} from '../../../redux/selectors/projectSelector';
import { useCurrentStep } from '../../../redux/selectors/stepSelector.ts';
import { hasLayer, removeLayer, removeSource } from '../../../utils/maplibre.tsx';
import { siteDefinition, STEP_LABELS, StepType } from '../../../redux/reducers/stepSlice.ts';
import { useCurrentStepUpdate } from '../../../redux/selectors/stepUpdateSelector.ts';
import { updateStep } from '../../../redux/reducers/stepUpdateSlice.ts';
import type { AppDispatch } from '../../../redux/store.ts';
import { resetStepAfter } from '../../../redux/reducers/projectSlice.ts';
import { Toaster } from '../../Toaster/toaster.ts';
import { getAuthHeaders } from '../../../utils/api';
import MapStepLayerEditor from './Editor.tsx';
import { ROAD_ID } from '../SiteDefinitionLayer';

import layerStyle from '../layer_style.json';
import { useIsDrawSiteMode } from '../../../redux/selectors/globalSelector.ts';
import { TaskStatus } from '../../../redux/reducers/task.ts';
import { MdModeEdit } from 'react-icons/md';
import { ConfirmDialog } from '../../ConfirmDialog';

const GL_DRAW_POLYGON: string = 'gl-draw-polygon-fill';
const GLTF_ID: string = '3d-model';
const GEOJSON_ID: string = 'task-layer';
export const GEOJSON_ID_FILL: string = 'task-layer-fill';
export const GEOJSON_ID_LINE: string = 'task-layer-line';

let globalCurrentStep: string = '';

export const EditingMode = {
  output: 'output',
  localStreets: 'local_streets',
} as const;
export type EditingMode = (typeof EditingMode)[keyof typeof EditingMode];

export default function StepLayer({ map }: { map: Map | null }) {
  const isDrawSite = useIsDrawSiteMode();
  const dispatch = useDispatch<AppDispatch>();
  const currentStep = useCurrentStep();
  const currentStepState = useCurrentProjectStep(currentStep);
  const currentUUID = useCurrentProjectUUID();
  const currentStepUpdate = useCurrentStepUpdate();
  const currentProjectUpdate = useCurrentProjectUpdate();
  const isProjectDone = useCurrentProjectDone();

  const isRunning: boolean = [TaskStatus.running, TaskStatus.pending, undefined].includes(
    // @ts-expect-error: Current step is a string
    currentStepState?.step?.task?.status
  );

  const [geojson, setGeojson] = useState<FeatureCollection | null>(null);
  const [isEditingMode, setIsEditingMode] = useState<EditingMode | null>(null);
  const isEditing =
    isEditingMode !== null &&
    [EditingMode.output, EditingMode.localStreets].includes(isEditingMode);

  const style = () => {
    switch (currentStep) {
      case StepType.streets.toString(): {
        return {
          'fill-color': layerStyle.grid_type,
          'fill-outline-color': 'rgba(0, 0, 0, 1)',
        };
      }
      case StepType.public.toString():
      case StepType.clusters.toString(): {
        return {
          'fill-color': layerStyle.cluster_fill,
          'fill-outline-color': 'rgba(0, 0, 0, 1)',
        };
      }
    }

    return {
      'fill-color': '#7FBA7F',
      'fill-outline-color': 'rgba(0, 0, 0, 1)',
    };
  };

  /** Initiate the layer */
  const doInit = () => {
    if (!map) return;

    setGeojson(null);
    if (isRunning) return;

    // Load files
    let geojsonUrl = currentStepState?.step?.file?.replace('gltf', 'geojson');
    if (geojsonUrl) {
      geojsonUrl += '?' + currentProjectUpdate;
      const step = currentStep;
      globalCurrentStep = step;
      fetch(geojsonUrl, {
        headers: getAuthHeaders(),
      })
        .then((res) => res.json())
        .then((data: FeatureCollection) => {
          if (globalCurrentStep !== step) return;
          setGeojson(data);
        });
    }
  };

  /** When map or current step changes, load GeoJSON */
  useEffect(() => {
    doInit();
  }, [map, currentStepState, isRunning]);

  /** When map or current step changes, load GeoJSON */
  useEffect(() => {
    setIsEditingMode(null);
  }, [currentStep]);

  /** Render geojson */
  useEffect(() => {
    if (!map) return;

    removeSource(map, GEOJSON_ID);
    if (geojson) {
      let before: string | undefined = undefined;
      if (hasLayer(map, GLTF_ID)) {
        before = GLTF_ID;
      }
      if (hasLayer(map, GL_DRAW_POLYGON)) {
        before = GL_DRAW_POLYGON;
      }
      if (hasLayer(map, ROAD_ID)) {
        before = ROAD_ID;
      }
      map.addSource(GEOJSON_ID, {
        type: 'geojson',
        data: geojson,
      });
      map.addLayer(
        {
          id: GEOJSON_ID_FILL,
          type: 'fill',
          source: GEOJSON_ID,
          filter: ['in', ['geometry-type'], ['literal', ['Polygon', 'MultiPolygon']]],
          // @ts-expect-error: Custom style function
          paint: style(),
        },
        before
      );
      map.addLayer(
        {
          id: GEOJSON_ID_LINE,
          type: 'line',
          source: GEOJSON_ID,
          filter: ['in', ['geometry-type'], ['literal', ['LineString', 'MultiLineString']]],
          paint: {
            'line-color': '#000000',
            'line-width': 1,
          },
        },
        before
      );
    }
  }, [map, geojson]);

  /** Check current step update status */
  useEffect(() => {
    if (currentStepUpdate.lastRequest) {
      dispatch(resetStepAfter(currentStep));
      doInit();
    } else if (currentProjectUpdate) {
      doInit();
    }
  }, [currentStepUpdate.lastRequest, currentProjectUpdate]);

  /** When current step update fails, show error toast */
  useEffect(() => {
    if (currentStepUpdate.error) {
      Toaster.error('Failed', currentStepUpdate.error);
    }
  }, [currentStepUpdate.error]);

  /** When draw site, set editing */
  useEffect(() => {
    if (isDrawSite) {
      setIsEditingMode(null);
    }
  }, [isDrawSite]);

  /** Add click handler to show feature properties */
  useEffect(() => {
    if (!map) return;

    /** Handle click on a feature */
    const handleClick = (e: maplibregl.MapMouseEvent) => {
      // Don't show popup when in editing mode
      if (isEditing) return;

      const features = map.queryRenderedFeatures(e.point, {
        layers: [GEOJSON_ID_FILL],
      });

      if (!features.length) return;

      const feature = features[0];
      const properties = feature.properties || {};

      // Create HTML content from properties
      const content = Object.entries(properties)
        .map(([key, value]) => `<strong>${key}:</strong> ${value}`)
        .join('<br>');

      new maplibregl.Popup().setLngLat(e.lngLat).setHTML(content).addTo(map);
    };

    const handleMouseEnter = () => {
      // Don't change cursor when in editing mode
      if (isEditing) return;
      map.getCanvas().style.cursor = 'pointer';
    };

    const handleMouseLeave = () => {
      // Don't change cursor when in editing mode
      if (isEditing) return;
      map.getCanvas().style.cursor = '';
    };

    map.on('click', GEOJSON_ID_FILL, handleClick);
    map.on('mouseenter', GEOJSON_ID_FILL, handleMouseEnter);
    map.on('mouseleave', GEOJSON_ID_FILL, handleMouseLeave);

    return () => {
      map.off('click', GEOJSON_ID_FILL, handleClick);
      map.off('mouseenter', GEOJSON_ID_FILL, handleMouseEnter);
      map.off('mouseleave', GEOJSON_ID_FILL, handleMouseLeave);
    };
  }, [map, isEditing]);

  /** Render gltf */
  useEffect(() => {
    if (!map) return;
    if (!geojson) return;
    removeSource(map, GLTF_ID);
    removeLayer(map, GLTF_ID);
  }, [map, geojson]);

  // Apply the form
  const apply = (geojson: FeatureCollection | null) => {
    if (!currentUUID) return;
    if (!geojson) return;
    setIsEditingMode(null);
    setGeojson(geojson);
    dispatch(
      updateStep({
        uuid: currentUUID,
        step: currentStep,
        geojson: geojson,
      })
    );
  };

  /** Cancel edited features */
  const cancelEditing = useCallback(() => {
    ConfirmDialog.confirm('Cancel editing', `Are you sure want to discard your changes?`, () => {
      setIsEditingMode(null);
    });
  }, [setIsEditingMode]);

  if (currentStep === siteDefinition) return;
  if (geojson === null || isRunning || !isProjectDone) {
    return (
      <HStack className="editor-stack" borderRadius="md" boxShadow="md">
        <Box>
          <Spinner size="lg" />
        </Box>
      </HStack>
    );
  }
  if (!(geojson && geojson.features.length > 0)) return null;
  let geojsonUsed = geojson;
  let confirmDialogTitle = 'Update step';
  let confirmDialogMessage = `This will change the output of the current step and rerun all subsequent steps. Are you sure you want to save to the backend? This action cannot be undone.`;
  if (isEditingMode === EditingMode.localStreets) {
    geojsonUsed = JSON.parse(JSON.stringify(geojson)) as FeatureCollection;
    geojsonUsed = {
      type: 'FeatureCollection',
      features: geojsonUsed.features.filter((feature) => feature.properties?.type === 'road_local'),
    };
    confirmDialogTitle = 'Update local street';
    confirmDialogMessage = `This will change the current local streets and rerun streets and all subsequent steps. Are you sure you want to save to the backend? This action cannot be undone.`;
  }
  return (
    <HStack className="editor-stack" borderRadius="md" boxShadow="md">
      <MapStepLayerEditor
        map={map}
        geojson={geojsonUsed}
        isEditing={isEditing}
        cancelEditing={cancelEditing}
        enableVertexDragging={isEditingMode === EditingMode.localStreets}
        apply={apply}
        /* Confirm dialog */
        confirmDialogTitle={confirmDialogTitle}
        confirmDialogMessage={confirmDialogMessage}
        /* Hide others */
        hideRoadLayer={isEditingMode !== EditingMode.localStreets}
      />
      {!isEditing && (
        <>
          {currentStep === StepType.streets.toString() && (
            <HStack className="editor-section">
              <IconButton
                onClick={() => {
                  setIsEditingMode(EditingMode.localStreets);
                }}
                size="md"
                disabled={!map}
                title={'Edit local streets'}
                // @ts-expect-error: A custom variant
                variant={'base'}
              >
                <MdModeEdit />
                {'Edit local streets'}
              </IconButton>
            </HStack>
          )}

          <HStack className="editor-section">
            <IconButton
              onClick={() => {
                setIsEditingMode(EditingMode.output);
              }}
              size="md"
              disabled={!map}
              title={'Edit ' + STEP_LABELS[currentStep].toLowerCase() + ' output'}
              // @ts-expect-error: A custom variant
              variant={'base'}
            >
              <MdModeEdit />
              {'Edit ' + STEP_LABELS[currentStep].toLowerCase() + ' output'}
            </IconButton>
          </HStack>
        </>
      )}
    </HStack>
  );
}
