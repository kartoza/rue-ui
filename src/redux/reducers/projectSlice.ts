import type { SerializedError } from '@reduxjs/toolkit';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { STEP_LABELS, type StepType } from './stepSlice';
import { TaskStatus } from './task';
import type { ProjectPayload, ProjectState } from './project';

const API_URL: string = import.meta.env.VITE_API_URL;

const initialState: ProjectState = {
  project: null,
  loading: false,
  error: null,
};

// Async thunk for project
export const createProject = createAsyncThunk(
  'project/create',
  async (parameters: ProjectPayload, thunkAPI) => {
    // -----------------------------
    // FOR DEMO
    // -----------------------------
    if (!API_URL) {
      const token = 'Demo token';
      localStorage.setItem('token', token);
      return {
        uuid: '00000000-0000-0000-0000-000000000000',
        name: parameters.name,
        parameters: parameters.parameters,
      };
    }
    // -----------------------------
    const token = localStorage.getItem('token');
    try {
      const response = await axios.post(API_URL + 'projects', parameters, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return {
        ...response.data,
        parameters: parameters.parameters,
      };
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
// Async thunk for project
export const getStepStatus = createAsyncThunk(
  'project/get',
  async (
    {
      uuid,
      step,
    }: {
      uuid: string;
      step: StepType;
    },
    thunkAPI
  ) => {
    // -----------------------------
    // FOR DEMO
    // -----------------------------
    if (!API_URL) {
      const index = Object.keys(STEP_LABELS).indexOf(step);
      const result = await import(
        `../../assets/dummy-data/${String(index).padStart(2, '0')}-${step}/outputs/data.json`
      );
      return {
        file:
          location.origin +
          `/src/assets/dummy-data/${String(index).padStart(2, '0')}-${step}/outputs/${step}.geojson`,
        task: {
          task_id: '00000000-0000-0000-0000-000000000000',
          status: TaskStatus.success,
          message: '',
        },
        result: result.default,
      };
    }
    // -----------------------------
    const token = localStorage.getItem('token');
    try {
      const response = await axios.get(API_URL + `projects/${uuid}/${step}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
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

const projectSlice = createSlice({
  name: 'project',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createProject.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createProject.fulfilled, (state, action) => {
        state.loading = false;
        state.project = { ...action.payload, steps: {} };
      })
      .addCase(createProject.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error as SerializedError;
      })

      // ----------------------------------
      // getStepStatus
      // ----------------------------------
      .addCase(getStepStatus.pending, (state, action) => {
        const { uuid, step } = action.meta.arg;
        if (!state.project || state.project.uuid !== uuid) return;
        // @ts-expect-error: Save by step
        state.project.steps[step] = {
          loading: true,
          error: null,
        };
      })
      .addCase(getStepStatus.fulfilled, (state, action) => {
        const { uuid, step } = action.meta.arg;
        if (!state.project || state.project.uuid !== uuid) return;
        // @ts-expect-error: Save by step
        state.project.steps[step] = {
          loading: false,
          step: action.payload,
        };
      })
      .addCase(getStepStatus.rejected, (state, action) => {
        const { uuid, step } = action.meta.arg;
        if (!state.project || state.project.uuid !== uuid) return;
        // @ts-expect-error: Save by step
        state.project.steps[step] = {
          loading: false,
          error: action.error as SerializedError,
        };
      });
  },
});

export default projectSlice.reducer;
