import { Map } from 'maplibre-gl';
import type { FeatureCollection, LineString } from 'geojson';
import { useCallback, useEffect, useState } from 'react';
import {
  useCurrentProjectStep,
  useCurrentProjectUpdate,
  useCurrentProjectUUID,
} from '../../../redux/selectors/projectSelector.ts';
import { siteDefinition, StepType } from '../../../redux/reducers/stepSlice.ts';
import { TaskStatus } from '../../../redux/reducers/task.ts';
import { getAuthHeaders } from '../../../utils/api.tsx';
import { Toaster } from '../../Toaster/toaster.ts';
import { useCurrentProjectInputParameters } from '../../../redux/selectors/projectInputSelector.ts';
import { hasLayer, removeSource } from '../../../utils/maplibre.tsx';
import { ROAD_ID } from '../SiteDefinitionLayer';
import { useCurrentStep } from '../../../redux/selectors/stepSelector.ts';
import MapStepLayerEditor from '../StepLayer/Editor.tsx';
import { HStack } from '@chakra-ui/react';
import { useCurrentDrawMode } from '../../../redux/selectors/globalSelector.ts';
import { DrawingMode, setDrawingMode } from '../../../redux/reducers/global.ts';
import { ConfirmDialog } from '../../ConfirmDialog';
import { useDispatch } from 'react-redux';
import type { AppDispatch } from '../../../redux/store.ts';
import { updateLocalStreet } from '../../../redux/reducers/stepUpdateSlice.ts';

const API_URL: string = import.meta.env.VITE_API_URL;
export const LOCAL_ROAD_ID: string = 'local-road-layer';

export default function LocalStreetLayer({ map }: { map: Map }) {
  const dispatch = useDispatch<AppDispatch>();
  const uuid = useCurrentProjectUUID();
  const currentUUID = useCurrentProjectUUID();
  const parameters = useCurrentProjectInputParameters();
  const streetStep = useCurrentProjectStep(StepType.streets);
  const [localRoads, setLocalRoads] = useState<FeatureCollection<LineString> | null>(null);
  const currentProjectUpdate = useCurrentProjectUpdate();
  const currentStep = useCurrentStep();
  const isSuccess = streetStep?.step?.task?.status === TaskStatus.success;

  const drawMode = useCurrentDrawMode();
  const isEditing = drawMode === DrawingMode.LOCAL_STREET_UPDATE;

  const drawVisibility = useCallback(
    (map: Map) => {
      if (!hasLayer(map, LOCAL_ROAD_ID)) return;
      if ([StepType.site, siteDefinition].includes(currentStep)) {
        map.setLayoutProperty(LOCAL_ROAD_ID, 'visibility', 'none');
      } else {
        map.setLayoutProperty(LOCAL_ROAD_ID, 'visibility', 'visible');
      }
    },
    [currentStep]
  );

  useEffect(() => {
    drawVisibility(map);
  }, [map, currentStep, drawVisibility]);

  useEffect(() => {}, [currentStep]);

  /** Fetch roads geojson from API */
  useEffect(() => {
    if (!map) return;
    if (!uuid) {
      setLocalRoads(null);
      return;
    }

    setLocalRoads(null);
    const abortController = new AbortController();

    if (isSuccess) {
      // Fetch the roads input
      fetch(
        `${API_URL}projects/${uuid}/streets/file/local_streets.geojson?` + currentProjectUpdate,
        {
          headers: getAuthHeaders(),
          signal: abortController.signal,
        }
      )
        .then((res) => res.json())
        .then((data: FeatureCollection<LineString>) => {
          setLocalRoads(data);
        })
        .catch((err) => {
          if (err.name !== 'AbortError') {
            Toaster.error('Failed to load local roads', err);
          }
        });
    }

    return () => {
      abortController.abort();
    };
  }, [map, uuid, isSuccess, currentProjectUpdate]);

  /** Render roads layer */
  const localRoadsWidth = parameters?.neighbourhood?.public_roads?.width_of_locals_m;
  useEffect(() => {
    if (!map) return;
    if (!localRoadsWidth) return;
    if (!localRoads) return;

    let before: string | undefined = undefined;
    if (hasLayer(map, ROAD_ID)) {
      before = ROAD_ID;
    }

    // Add source
    map.addSource(LOCAL_ROAD_ID, {
      type: 'geojson',
      data: localRoads,
    });

    // Add fill layer
    // Add line layer
    map.addLayer(
      {
        id: LOCAL_ROAD_ID,
        type: 'line',
        source: LOCAL_ROAD_ID,
        paint: {
          'line-color': '#FFFFFF',
          'line-width': [
            'interpolate',
            ['exponential', 2],
            ['zoom'],
            0,
            localRoadsWidth * 0.00001,
            22,
            localRoadsWidth * 50,
          ],
        },
        layout: {
          'line-join': 'round',
          'line-cap': 'round',
        },
      },
      before
    );
    drawVisibility(map);

    return () => {
      if (map) {
        removeSource(map, LOCAL_ROAD_ID);
      }
    };
  }, [map, localRoads, localRoadsWidth, drawVisibility]);

  /** Cancel edited features */
  const cancelEditing = useCallback(() => {
    ConfirmDialog.confirm('Cancel editing', `Are you sure want to discard your changes?`, () => {
      dispatch(setDrawingMode(null));
    });
  }, [dispatch]);

  // Apply the form
  const apply = (geojson: FeatureCollection | null) => {
    if (!currentUUID) return;
    if (!geojson) return;
    if (currentStep !== StepType.streets) return;
    dispatch(setDrawingMode(null));
    // @ts-expect-error: This is correct
    setLocalRoads(geojson);
    dispatch(
      updateLocalStreet({
        uuid: currentUUID,
        geojson: geojson,
      })
    );
  };

  const confirmDialogTitle = 'Update local street';
  const confirmDialogMessage = `This will change the current local streets and rerun streets and all subsequent steps. Are you sure you want to save to the backend? This action cannot be undone.`;

  if (!localRoads) return null;
  return (
    <HStack className="editor-stack" borderRadius="md" boxShadow="md">
      {isEditing && (
        <MapStepLayerEditor
          map={map}
          geojson={localRoads}
          isEditing={isEditing}
          cancelEditing={cancelEditing}
          apply={apply}
          enableVertexDragging={true}
          /* Confirm dialog */
          confirmDialogTitle={confirmDialogTitle}
          confirmDialogMessage={confirmDialogMessage}
        />
      )}
    </HStack>
  );
}
