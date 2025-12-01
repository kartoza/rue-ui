import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';
import type { FeatureCollection, LineString, Polygon } from 'geojson';

export interface ProjectInputState {
  site: FeatureCollection<Polygon> | null;
  roads: FeatureCollection<LineString> | null;
}

const initialState: ProjectInputState = {
  site: null,
  roads: null,
};

const projectInputSlice = createSlice({
  name: 'projectInput',
  initialState,
  reducers: {
    updateSite: (
      state: ProjectInputState,
      action: PayloadAction<FeatureCollection<Polygon> | null>
    ) => {
      state.site = action.payload;
    },
    updateRoads: (
      state: ProjectInputState,
      action: PayloadAction<FeatureCollection<LineString> | null>
    ) => {
      state.roads = action.payload;
    },
    updateBatch: (state: ProjectInputState, action: PayloadAction<ProjectInputState>) => {
      state.site = action.payload.site;
      state.roads = action.payload.roads;
    },
  },
});

export const { updateSite, updateRoads, updateBatch } = projectInputSlice.actions;
export default projectInputSlice.reducer;
