import { useSelector } from 'react-redux';
import type { RootState } from '../store.ts';
import type { ProjectState, StepState } from '../reducers/project';
import type { StepType } from '../reducers/stepSlice.ts';

export function useCurrentProjectState() {
  return useSelector((state: RootState) => state.project as ProjectState);
}

export function useCurrentProjectUUID() {
  return useSelector((state: RootState) => (state.project as ProjectState).project?.uuid);
}

export function useCurrentProjectStep(step: StepType): StepState {
  return useSelector((state: RootState) => (state.project as ProjectState).project?.steps[step]);
}
