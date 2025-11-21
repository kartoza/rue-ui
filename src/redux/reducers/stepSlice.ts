import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';

export const StepType = {
  site: 'site',
  streets: 'streets',
  clusters: 'clusters',
  public: 'public',
  subdivision: 'subdivision',
  footprint: 'footprint',
  building_start: 'building_start',
  building_max: 'building_max',
} as const;

export type StepType = (typeof StepType)[keyof typeof StepType];

export const STEP_LABELS: Record<StepType, string> = {
  site: 'Site',
  streets: 'Streets',
  clusters: 'Clusters',
  public: 'Public',
  subdivision: 'Subdivision',
  footprint: 'Footprint',
  building_start: 'Starter building',
  building_max: 'Consolidated buildings',
};

export interface StepState {
  currentStep: StepType;
}

const initialState: StepState = {
  currentStep: StepType.site,
};

const stepSlice = createSlice({
  name: 'step',
  initialState,
  reducers: {
    setCurrentStep: (state, action: PayloadAction<StepType>) => {
      state.currentStep = action.payload;
    },
  },
});

export const { setCurrentStep } = stepSlice.actions;
export default stepSlice.reducer;
