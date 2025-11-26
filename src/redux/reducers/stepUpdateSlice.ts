import axios from 'axios';
import { createAsyncThunk, createSlice, type SerializedError } from '@reduxjs/toolkit';
import type { FeatureCollection } from 'geojson';
import type { StepType } from './stepSlice.ts';

const API_URL: string = import.meta.env.VITE_API_URL;

export interface StepUpdateState {
  lastRequest: number | null;
  loading: boolean;
  error: SerializedError | null;
}

const initialState: StepUpdateState = {
  lastRequest: null,
  loading: false,
  error: null,
};

// Update step of project
export const updateStep = createAsyncThunk(
  'project/get',
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
    // FOR DEMO
    // -----------------------------
    if (!API_URL) {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return null;
    }
    // -----------------------------
    const token = localStorage.getItem('token');
    try {
      const response = await axios.put(
        API_URL + `projects/${uuid}/${step}`,
        { geojson: geojson },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return response.data;
    } catch (error) {
      let errorMessage = 'Unknown error';
      if (axios.isAxiosError(error) && error.response) {
        const data = error.response.data as { detail?: string };
        errorMessage = data.detail || JSON.stringify(data);
      }
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
        state.error = action.error as SerializedError;
      });
  },
});

export default stepUpdateSlice.reducer;
