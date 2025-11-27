import { Map } from 'maplibre-gl';
import type { ProjectParameters } from '../../redux/reducers/project';
import { useEffect, useState } from 'react';
import { useCurrentProjectState } from '../../redux/selectors/projectSelector';
import type { FeatureCollection, LineString } from 'geojson';
import { getAuthHeaders } from '../../utils/api';
import { removeSource } from '../../utils/maplibre';

import './style.scss';
import 'maplibre-gl-draw/dist/mapbox-gl-draw.css';

const API_URL: string = import.meta.env.VITE_API_URL;
export const ROAD_ID: string = 'road-layer';

export default function MapSiteLayer({ map }: { map: Map | null }) {
  const currentProjectState = useCurrentProjectState();
  const [roads, setRoads] = useState<FeatureCollection<LineString> | null>(null);

  const parameters: ProjectParameters | undefined = currentProjectState?.project?.parameters;
  const uuid = currentProjectState?.project?.uuid;

  /** Fetch roads geojson from API */
  useEffect(() => {
    if (!uuid) {
      setRoads(null);
      return;
    }

    if (!API_URL) return;
    if (!parameters) return;
    if (currentProjectState.loading) return;

    setRoads(null);

    const roadsUrl = `${API_URL}projects/${uuid}/roads.geojson`;
    fetch(roadsUrl, {
      headers: getAuthHeaders(),
    })
      .then((res) => res.json())
      .then((data: FeatureCollection<LineString>) => {
        setRoads(data);
      })
      .catch((err) => {
        console.error('Failed to load roads:', err);
      });
  }, [uuid, currentProjectState.loading]);

  /** Render roads layer */
  useEffect(() => {
    if (!map) return;

    // Remove existing layer and source
    removeSource(map, ROAD_ID);
    const arteries = parameters?.neighbourhood?.public_roads?.width_of_arteries_m;
    const secondaries = parameters?.neighbourhood?.public_roads?.width_of_secondaries_m;

    if (!arteries || !secondaries) return;

    if (roads) {
      // Add source
      map.addSource(ROAD_ID, {
        type: 'geojson',
        data: roads,
      });

      // Add line layer
      map.addLayer({
        id: ROAD_ID,
        type: 'line',
        source: ROAD_ID,
        paint: {
          'line-color': [
            'match',
            ['get', 'road_type'],
            'road_art',
            'rgb(237,150,143)',
            'road_sec',
            'rgb(250,191,150)',
            '#00000000',
          ],
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
      });
    }

    return () => {
      if (map) {
        removeSource(map, ROAD_ID);
      }
    };
  }, [map, roads, parameters]);

  return null;
}
