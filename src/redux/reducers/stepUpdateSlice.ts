import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import type { FeatureCollection } from 'geojson';
import type { StepType } from './stepSlice.ts';
import * as api from '../../utils/api.tsx';

export interface StepUpdateState {
  lastRequest: number | null;
  loading: boolean;
  error: string | null;
}

const initialState: StepUpdateState = {
  lastRequest: null,
  loading: false,
  error: null,
};

// Update step of project
export const updateStep = createAsyncThunk(
  'step/update',
  async (
    {
      uuid,
      step,
      geojson,
    }: {
      uuid: string;
      step: StepType;
      geojson: FeatureCollection;
    },
    thunkAPI
  ) => {
    // -----------------------------
    try {
      return await api.put(`projects/${uuid}/${step}`, { geojson });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      return thunkAPI.rejectWithValue(errorMessage);
    }
  }
);

const stepUpdateSlice = createSlice({
  name: 'step',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(updateStep.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.lastRequest = null;
      })
      .addCase(updateStep.fulfilled, (state) => {
        state.loading = false;
        state.lastRequest = new Date().getTime();
      })
      .addCase(updateStep.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.lastRequest = new Date().getTime();
      });
  },
});

export default stepUpdateSlice.reducer;
