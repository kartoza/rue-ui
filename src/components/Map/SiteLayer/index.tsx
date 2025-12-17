import { Map } from 'maplibre-gl';
import type { FeatureCollection, LineString, Polygon } from 'geojson';
import type { ProjectParameters } from '../../../redux/reducers/project';
import { useEffect, useState } from 'react';
import {
  useCurrentProjectDone,
  useCurrentProjectState,
  useCurrentProjectStep,
} from '../../../redux/selectors/projectSelector';
import { getAuthHeaders } from '../../../utils/api';
import { hasLayer, removeSource } from '../../../utils/maplibre';
import layerStyle from '../layer_style.json';
import SiteEditor from './Editor.tsx';
import { Toaster } from '../../Toaster/toaster.ts';
import { StepType } from '../../../redux/reducers/stepSlice.ts';
import { TaskStatus } from '../../../redux/reducers/task.ts';

const GL_DRAW_POLYGON: string = 'gl-draw-polygon-fill';

const API_URL: string = import.meta.env.VITE_API_URL;
export const ROAD_ID: string = 'road-layer';

export default function SiteLayer({ map }: { map: Map | null }) {
  const isProjectDone = useCurrentProjectDone();
  const currentProjectState = useCurrentProjectState();
  const [roads, setRoads] = useState<FeatureCollection<LineString> | null>(null);
  const [site, setSite] = useState<FeatureCollection<Polygon> | null>(null);
  const [roadsBuffer, setRoadBuffer] = useState<FeatureCollection<Polygon> | null>(null);

  const projectStep = useCurrentProjectStep(StepType.site);

  const parameters: ProjectParameters | undefined = currentProjectState?.project?.parameters;
  const uuid = currentProjectState?.project?.uuid;

  /** Fetch roads geojson from API */
  useEffect(() => {
    if (!uuid) {
      setRoads(null);
      return;
    }

    if (!API_URL) return;
    if (!isProjectDone) return;

    setRoads(null);
    setSite(null);
    fetch(`${API_URL}projects/${uuid}/roads_input.geojson`, {
      headers: getAuthHeaders(),
    })
      .then((res) => res.json())
      .then((data: FeatureCollection<LineString>) => {
        setRoads(data);
      })
      .catch((err) => {
        Toaster.error('Failed to load roads', err);
      });
    fetch(`${API_URL}projects/${uuid}/site_input.geojson`, {
      headers: getAuthHeaders(),
    })
      .then((res) => res.json())
      .then((data: FeatureCollection<Polygon>) => {
        setSite(data);
      })
      .catch((err) => {
        Toaster.error('Failed to load site', err);
      });
  }, [uuid, currentProjectState.loading, isProjectDone]);

  let roadURL = '';
  if (projectStep?.step?.task?.status === TaskStatus.success) {
    roadURL = `${API_URL}projects/${uuid}/${StepType.site}/file/roads.geojson#${currentProjectState.project?.updated_at}`;
  }
  /** Fetch roads buffer geojson from API */
  useEffect(() => {
    if (!uuid) {
      setRoadBuffer(null);
      return;
    }

    if (!roadURL) return;
    console.log(roadURL);
    fetch(roadURL, {
      headers: getAuthHeaders(),
    })
      .then((res) => res.json())
      .then((data: FeatureCollection<Polygon>) => {
        setRoadBuffer(data);
      })
      .catch((err) => {
        Toaster.error('Failed to load roads buffer', err);
      });
  }, [uuid, roadURL]);

  /** Render roads layer */
  useEffect(() => {
    if (!map) return;
    if (!parameters) return;

    // Remove existing layer and source
    removeSource(map, ROAD_ID);

    let before: string | undefined = undefined;
    if (hasLayer(map, GL_DRAW_POLYGON)) {
      before = GL_DRAW_POLYGON;
    }
    if (roadsBuffer) {
      // Add source
      map.addSource(ROAD_ID, {
        type: 'geojson',
        data: roadsBuffer,
      });

      // Add line layer
      map.addLayer(
        {
          id: ROAD_ID,
          type: 'fill',
          source: ROAD_ID,
          paint: {
            // @ts-expect-error: Custom style function
            'fill-color': layerStyle.road_color,
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
  }, [map, roadsBuffer]);

  // Merge site and roads into a single geojson
  const geojson: FeatureCollection | null =
    site || roads
      ? {
          type: 'FeatureCollection',
          features: [...(roads?.features || []), ...(site?.features || [])],
        }
      : null;

  return <SiteEditor map={map} geojson={geojson} />;
}
