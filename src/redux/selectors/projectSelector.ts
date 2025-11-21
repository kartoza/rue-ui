import { useSelector } from 'react-redux';
import type { RootState } from '../store.ts';
import type { ProjectState } from '../reducers/project';
import type { StepType } from '../reducers/stepSlice.ts';
import type { StepState } from '../reducers/step';

export function useCurrentProject() {
  return useSelector((state: RootState) => (state.project as ProjectState).project);
}
export function useCurrentProjectState() {
  return useSelector((state: RootState) => state.project as ProjectState);
}

export function useCurrentProjectUUID() {
  return useSelector((state: RootState) => (state.project as ProjectState).project?.uuid);
}

export function useCurrentProjectStep(step: StepType): StepState {
  return useSelector(
    (state: RootState) =>
      (state.project as ProjectState).project?.steps[step] as unknown as StepState
  );
}
