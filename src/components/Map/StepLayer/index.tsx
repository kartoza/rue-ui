import { useEffect, useState } from 'react';
import maplibregl, { Map } from 'maplibre-gl';
import { useDispatch } from 'react-redux';
import type { FeatureCollection } from 'geojson';
import { HStack, IconButton, Spinner } from '@chakra-ui/react';
import {
  useCurrentProjectStep,
  useCurrentProjectUUID,
} from '../../../redux/selectors/projectSelector';
import { useCurrentStep } from '../../../redux/selectors/stepSelector.ts';
import { hasLayer, removeLayer, removeSource } from '../../../utils/maplibre.tsx';
import { StepType } from '../../../redux/reducers/stepSlice.ts';
import { useCurrentStepUpdate } from '../../../redux/selectors/stepUpdateSelector.ts';
import { updateStep } from '../../../redux/reducers/stepUpdateSlice.ts';
import type { AppDispatch } from '../../../redux/store.ts';
import { resetStepAfter } from '../../../redux/reducers/projectSlice.ts';
import { Toaster } from '../../Toaster/toaster.ts';
import { getAuthHeaders } from '../../../utils/api';
import MapStepLayerEditor from './Editor.tsx';
import { ROAD_ID } from '../SiteDefinitionLayer';

import layerStyle from '../layer_style.json';
import { MdSave } from 'react-icons/md';
import { useCurrentDrawMode } from '../../../redux/selectors/globalSelector.ts';
import { DrawingMode } from '../../../redux/reducers/global.ts';

const GL_DRAW_POLYGON: string = 'gl-draw-polygon-fill';
const GLTF_ID: string = '3d-model';
const GEOJSON_ID: string = 'task-layer';
export const GEOJSON_ID_FILL: string = 'task-layer-fill';
export const GEOJSON_ID_LINE: string = 'task-layer-line';

let globalCurrentStep: string = '';

export default function StepLayer({ map }: { map: Map | null }) {
  const isDrawSite = useCurrentDrawMode() == DrawingMode.DRAW_SITE;
  const dispatch = useDispatch<AppDispatch>();
  const currentStep = useCurrentStep();
  const currentStepState = useCurrentProjectStep(currentStep);
  const currentUUID = useCurrentProjectUUID();
  const currentStepUpdate = useCurrentStepUpdate();

  const [geojson, setGeojson] = useState<FeatureCollection | null>(null);
  const [isUpdated, setIsUpdated] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);

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
    setIsUpdated(false);

    // Load files
    const geojsonUrl = currentStepState?.step?.file?.replace('gltf', 'geojson');
    const gltfUrl = currentStepState?.step?.file?.replace('geojson', 'gltf');
    if (geojsonUrl && gltfUrl) {
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
  }, [map, currentStepState]);

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
    }
  }, [currentStepUpdate.lastRequest]);

  /** When current step update fails, show error toast */
  useEffect(() => {
    if (currentStepUpdate.error) {
      Toaster.error('Failed', currentStepUpdate.error);
    }
  }, [currentStepUpdate.error]);

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
  const apply = () => {
    if (!currentUUID) return;
    if (!geojson) return;
    dispatch(
      updateStep({
        uuid: currentUUID,
        step: currentStep,
        geojson: geojson,
      })
    );
  };

  if (!(geojson && geojson.features.length > 0)) {
    return null;
  }
  if (isDrawSite) {
    return null;
  }
  return (
    <HStack className="editor-stack" borderRadius="md" boxShadow="md">
      {isUpdated && !isEditing && (
        <IconButton
          onClick={apply}
          size="md"
          // @ts-expect-error: A custom variant
          variant="primary"
          title={`Apply changes to API permanently.`}
          posisition="relative"
        >
          <MdSave />{' '}
          {currentStepUpdate.loading && (
            <Spinner position="absolute" top="2px" left="2px" size="lg" />
          )}
        </IconButton>
      )}
      <MapStepLayerEditor
        map={map}
        geojson={geojson}
        setGeojson={(geojson) => {
          setIsUpdated(true);
          setGeojson(geojson);
        }}
        isEditing={isEditing}
        setIsEditing={setIsEditing}
      />
    </HStack>
  );
}
