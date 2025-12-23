import { Map } from 'maplibre-gl';
import type { FeatureCollection, LineString, Polygon } from 'geojson';
import { useEffect } from 'react';
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
import { useCurrentProjectUUID } from '../../../redux/selectors/projectSelector.ts';
import { siteDefinition } from '../../../redux/reducers/stepSlice.ts';
import { useCurrentStep } from '../../../redux/selectors/stepSelector.ts';

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
    }

    return () => {
      if (map) {
        removeSource(map, ROAD_ID);
      }
    };
  }, [map, roads, parameters]);

  /** Render site layer */
  useEffect(() => {
    if (!map) return;
    if (!site) return;
    if (currentStep !== siteDefinition) return;

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
          'fill-color': '#088',
          'fill-opacity': 0.3,
        },
      },
      before
    );

    // Add outline layer
    map.addLayer(
      {
        id: `${SITE_ID}-outline`,
        type: 'line',
        source: SITE_ID,
        paint: {
          'line-color': '#088',
          'line-width': 2,
        },
      },
      before
    );

    return () => {
      if (map) {
        removeSource(map, SITE_ID);
      }
    };
  }, [map, site, currentStep]);

  return null;
  // // Merge site and roads into a single geojson
  // const geojson: FeatureCollection | null =
  //   site || roads
  //     ? {
  //         type: 'FeatureCollection',
  //         features: [...(roads?.features || []), ...(site?.features || [])],
  //       }
  //     : null;
  //
  // return <SiteEditor map={map} geojson={geojson} />;
}
