import { Map } from 'maplibre-gl';
import type { FeatureCollection, LineString, Polygon } from 'geojson';
import { useEffect, useState } from 'react';
import { Box, HStack, IconButton, Spinner } from '@chakra-ui/react';
import { MdArrowBack, MdModeEdit, MdSave } from 'react-icons/md';
import { getAuthHeaders } from '../../../utils/api';
import { hasLayer, removeSource } from '../../../utils/maplibre';
import layerStyle from '../layer_style.json';
import { Toaster } from '../../Toaster/toaster.ts';
import {
  useCurrentProjectInputParameters,
  useCurrentProjectInputRoads,
  useCurrentProjectInputSite,
} from '../../../redux/selectors/projectInputSelector.ts';
import { updateRoads, updateSite } from '../../../redux/reducers/projectInputSlice.ts';
import { useDispatch } from 'react-redux';
import type { AppDispatch } from '../../../redux/store.ts';
import turf from 'turf';
import {
  useCurrentProjectDone,
  useCurrentProjectUUID,
} from '../../../redux/selectors/projectSelector.ts';
import { siteDefinition } from '../../../redux/reducers/stepSlice.ts';
import { useCurrentStep } from '../../../redux/selectors/stepSelector.ts';
import { patchProject } from '../../../redux/reducers/projectSlice.ts';
import { useCurrentDrawMode, useIsDrawSiteMode } from '../../../redux/selectors/globalSelector.ts';
import { DrawingMode, setDrawingMode } from '../../../redux/reducers/global.ts';
import SiteEditor from './Editor.tsx';

const GL_DRAW_POLYGON: string = 'gl-draw-polygon-fill';

const API_URL: string = import.meta.env.VITE_API_URL;
export const ROAD_ID: string = 'road-layer';
export const SITE_ID: string = 'site-layer';

export default function SiteDefinitionLayer({ map }: { map: Map | null }) {
  const dispatch = useDispatch<AppDispatch>();
  const uuid = useCurrentProjectUUID();
  const parameters = useCurrentProjectInputParameters();
  const roads = useCurrentProjectInputRoads();
  const site = useCurrentProjectInputSite();
  const currentStep = useCurrentStep();
  const isUpdateSite = useCurrentDrawMode() == DrawingMode.UPDATE_SITE;
  const isDrawSite = useIsDrawSiteMode();
  const isProjectDone = useCurrentProjectDone();

  const [defaultRoads, setDefaultRoads] = useState<FeatureCollection<LineString> | null>(null);
  const [defaultSite, setDefaultSite] = useState<FeatureCollection<Polygon> | null>(null);

  /** Fetch roads geojson from API */
  useEffect(() => {
    if (!map) return;
    if (!uuid) {
      dispatch(updateSite(null));
      dispatch(updateRoads(null));
      return;
    }

    dispatch(updateSite(null));
    dispatch(updateRoads(null));

    const abortController = new AbortController();

    // Fetch the roads input
    fetch(`${API_URL}projects/${uuid}/roads_input.geojson`, {
      headers: getAuthHeaders(),
      signal: abortController.signal,
    })
      .then((res) => res.json())
      .then((data: FeatureCollection<LineString>) => {
        dispatch(updateRoads(data));

        // Zoom to the roads
        const bbox = turf.bbox(data);
        map.fitBounds(
          [
            [bbox[0], bbox[1]],
            [bbox[2], bbox[3]],
          ],
          {
            padding: 50,
            duration: 1000,
          }
        );
      })
      .catch((err) => {
        if (err.name !== 'AbortError') {
          Toaster.error('Failed to load roads', err);
        }
      });
    fetch(`${API_URL}projects/${uuid}/site_input.geojson`, {
      headers: getAuthHeaders(),
      signal: abortController.signal,
    })
      .then((res) => res.json())
      .then((data: FeatureCollection<Polygon>) => {
        dispatch(updateSite(data));
      })
      .catch((err) => {
        if (err.name !== 'AbortError') {
          Toaster.error('Failed to load site', err);
        }
      });

    return () => {
      abortController.abort();
    };
  }, [map, uuid]);

  /** Render roads layer */
  useEffect(() => {
    if (!map) return;
    if (!parameters) return;
    if (isDrawSite) {
      map.setLayoutProperty(ROAD_ID, 'visibility', 'none');
      return;
    }
    // Remove existing layer and source
    const arteries = parameters?.neighbourhood?.public_roads?.width_of_arteries_m;
    const secondaries = parameters?.neighbourhood?.public_roads?.width_of_secondaries_m;

    if (!arteries || !secondaries) return;

    let before: string | undefined = undefined;
    if (hasLayer(map, GL_DRAW_POLYGON)) {
      before = GL_DRAW_POLYGON;
    }
    if (roads) {
      // Add source
      map.addSource(ROAD_ID, {
        type: 'geojson',
        data: roads,
      });

      // Add line layer
      map.addLayer(
        {
          id: ROAD_ID,
          type: 'line',
          source: ROAD_ID,
          paint: {
            // @ts-expect-error: Custom style function
            'line-color': layerStyle.road_color,
            'line-width': [
              'interpolate',
              ['exponential', 2],
              ['zoom'],
              0,
              [
                'match',
                ['get', 'road_type'],
                'road_art',
                arteries * 0.00001,
                'road_sec',
                secondaries * 0.00001,
                0,
              ],
              22,
              [
                'match',
                ['get', 'road_type'],
                'road_art',
                arteries * 50,
                'road_sec',
                secondaries * 50,
                0,
              ],
            ],
          },
          layout: {
            'line-join': 'round',
            'line-cap': 'round',
          },
        },
        before
      );
      if (uuid) {
        map.setLayoutProperty(ROAD_ID, 'visibility', 'visible');
      }
    }

    return () => {
      if (map) {
        removeSource(map, ROAD_ID);
      }
    };
  }, [map, roads, parameters, currentStep, isDrawSite]);

  /** Render site layer */
  useEffect(() => {
    if (!map) return;
    if (!site) return;
    if (currentStep !== siteDefinition) return;
    if (isDrawSite) {
      map.setLayoutProperty(ROAD_ID, 'visibility', 'none');
      return;
    }

    let before: string | undefined = undefined;
    if (hasLayer(map, ROAD_ID)) {
      before = ROAD_ID;
    }

    // Add source
    map.addSource(SITE_ID, {
      type: 'geojson',
      data: site,
    });

    // Add fill layer
    map.addLayer(
      {
        id: SITE_ID,
        type: 'fill',
        source: SITE_ID,
        paint: {
          'fill-color': '#7FBA7F',
          'fill-outline-color': 'rgba(0, 0, 0, 1)',
        },
      },
      before
    );

    return () => {
      if (map) {
        removeSource(map, SITE_ID);
      }
    };
  }, [map, site, currentStep, isDrawSite]);

  // Merge site and roads into a single geojson
  const geojson: FeatureCollection | null =
    site || roads
      ? {
          type: 'FeatureCollection',
          features: [...(roads?.features || []), ...(site?.features || [])],
        }
      : null;

  // Apply the form
  const apply = () => {
    if (!uuid) return;
    if (!geojson) return;
    dispatch(setDrawingMode(null));
    dispatch(
      patchProject({
        uuid: uuid,
        payload: {
          roads: roads,
          site: site,
        },
      })
    );
  };

  return (
    <HStack className="editor-stack" borderRadius="md" boxShadow="md">
      <SiteEditor key="editor" map={map} geojsonInput={geojson} />
      {currentStep == siteDefinition && uuid && (
        <HStack className="editor-section">
          {!isProjectDone && (
            <Box>
              <Spinner size="lg" />
            </Box>
          )}

          {isProjectDone && !isUpdateSite && (
            <IconButton
              onClick={() => {
                dispatch(setDrawingMode(DrawingMode.UPDATE_SITE));
                setDefaultRoads(roads);
                setDefaultSite(site);
              }}
              size="md"
              disabled={!map}
              title={`Edit site definition`}
              // @ts-expect-error: A custom variant
              variant={'base'}
            >
              <MdModeEdit /> Edit site definition
            </IconButton>
          )}
          {isProjectDone && isUpdateSite && (
            <>
              <IconButton
                onClick={apply}
                size="md"
                // @ts-expect-error: A custom variant
                variant="primary.outline"
                title={`Apply changes to API permanently.`}
                posisition="relative"
              >
                <MdSave />
              </IconButton>
              <IconButton
                onClick={() => {
                  dispatch(setDrawingMode(null));
                  dispatch(updateSite(defaultSite));
                  dispatch(updateRoads(defaultRoads));
                }}
                // @ts-expect-error: A custom variant
                variant="base"
                size="md"
                title={`Cancel.`}
                posisition="relative"
              >
                <MdArrowBack />
              </IconButton>
            </>
          )}
        </HStack>
      )}
    </HStack>
  );
}
