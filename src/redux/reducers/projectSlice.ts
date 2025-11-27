import type { PayloadAction } from '@reduxjs/toolkit';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { STEP_LABELS, type StepType } from './stepSlice';
import { TaskStatus } from './task';
import type { ProjectPayload, ProjectState } from './project';
import type { Step } from './step';
import * as api from '../../utils/api';

const API_URL: string = import.meta.env.VITE_API_URL;

const initialState: ProjectState = {
  project: null,
  loading: false,
  error: null,
};

// Async thunk for project
export const createProject = createAsyncThunk(
  'project/create',
  async (payload: ProjectPayload, thunkAPI) => {
    // -----------------------------
    // FOR DEMO
    // -----------------------------
    if (!API_URL) {
      const token = 'Demo token';
      localStorage.setItem('token', token);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return {
        uuid: '00000000-0000-0000-0000-000000000000',
        name: payload.name,
        parameters: payload.parameters,
      };
    }
    // -----------------------------
    try {
      const data = await api.post<{
        uuid: string;
        name: string;
      }>('projects', payload);
      return {
        ...data,
        parameters: payload.parameters,
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      return thunkAPI.rejectWithValue(errorMessage);
    }
  }
);

// Async thunk for project
export const getProject = createAsyncThunk(
  'project/get',
  // @ts-expect-error: Name is for args
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async ({ uuid, name }: { uuid: string; name: string }, thunkAPI) => {
    // -----------------------------
    try {
      return await api.get('projects/' + uuid);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      return thunkAPI.rejectWithValue(errorMessage);
    }
  }
);

// Async thunk for project
export const getStepStatus = createAsyncThunk(
  'project/step/get',
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
      const result = await fetch(
        `/src/assets/dummy-data/${String(index).padStart(2, '0')}-${step}/outputs/result.json`
      );
      return {
        file:
          location.origin +
          `/src/assets/dummy-data/${String(index).padStart(2, '0')}-${step}/outputs/${step}.gltf`,
        task: {
          task_id: '00000000-0000-0000-0000-000000000000',
          status: TaskStatus.success,
          message: '',
        },
        result: await result.json(),
      };
    }
    // -----------------------------
    try {
      return await api.get<Step>(`projects/${uuid}/${step}`);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      return thunkAPI.rejectWithValue(errorMessage);
    }
  }
);

const projectSlice = createSlice({
  name: 'project',
  initialState,
  reducers: {
    resetProject: (state: ProjectState) => {
      state.project = null;
    },
    resetStepAfter: (state: ProjectState, action: PayloadAction<StepType>) => {
      if (!state.project) return;

      const stepKeys = Object.keys(STEP_LABELS) as StepType[];
      const currentStepIndex = stepKeys.indexOf(action.payload);

      // Get all steps after the current step
      const stepsToReset = stepKeys.slice(currentStepIndex + 1);

      // Delete those steps from the project
      stepsToReset.forEach((step) => {
        delete state.project!.steps[step];
      });
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createProject.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createProject.fulfilled, (state, action) => {
        state.loading = false;
        // @ts-expect-error: Save by step
        state.project = { ...action.payload, steps: {} };
      })
      .addCase(createProject.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // ----------------------------------
      // getProject
      // ----------------------------------
      .addCase(getProject.pending, (state, action) => {
        const { uuid, name } = action.meta.arg;
        // @ts-expect-error: Save by step
        state.project = { uuid, name, parameters: null, steps: {} };
        state.loading = true;
        state.error = null;
      })
      .addCase(getProject.fulfilled, (state, action) => {
        state.loading = false;
        // @ts-expect-error: Save by step
        state.project = { ...action.payload, steps: {} };
      })
      .addCase(getProject.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
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
        state.project.steps[step] = {
          loading: false,
          // @ts-expect-error: Save by step
          step: action.payload,
        };
      })
      .addCase(getStepStatus.rejected, (state, action) => {
        const { uuid, step } = action.meta.arg;
        if (!state.project || state.project.uuid !== uuid) return;
        // @ts-expect-error: Save by step
        state.project.steps[step] = {
          loading: false,
          error: action.payload as string,
        };
      });
  },
});

export const { resetStepAfter, resetProject } = projectSlice.actions;
export default projectSlice.reducer;
