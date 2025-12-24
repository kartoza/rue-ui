import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';
import type { FeatureCollection, LineString, Polygon } from 'geojson';
import type { ProjectParameters } from './project';
import projectParametersDefault from '../../general_input.json';

export interface ProjectInputState {
  site: FeatureCollection<Polygon> | null;
  roads: FeatureCollection<LineString> | null;
  parameters: ProjectParameters;
}

const initialState: ProjectInputState = {
  site: null,
  roads: null,
  parameters: JSON.parse(JSON.stringify(projectParametersDefault)),
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
    updateInputParameters: (state: ProjectInputState, action: PayloadAction<ProjectParameters>) => {
      // Only assign if payload is different from current parameters
      const newParametersString = JSON.stringify(action.payload);
      if (JSON.stringify(state.parameters) !== newParametersString) {
        state.parameters = JSON.parse(newParametersString);
      }
    },
  },
});

export const { updateSite, updateRoads, updateBatch, updateInputParameters } =
  projectInputSlice.actions;
export default projectInputSlice.reducer;
