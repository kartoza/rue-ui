import { useSelector } from 'react-redux';
import type { RootState } from '../store.ts';
import type { FeatureCollection, LineString, Polygon } from 'geojson';
import type { ProjectParameters } from '../reducers/project';

export function useCurrentProjectInputRoads(): FeatureCollection<LineString> | null {
  return useSelector((state: RootState) => state.projectInput.roads);
}

export function useCurrentProjectInputSite(): FeatureCollection<Polygon> | null {
  return useSelector((state: RootState) => state.projectInput.site);
}

export function useCurrentProjectInputParameters(): ProjectParameters {
  return useSelector((state: RootState) => state.projectInput.parameters);
}
