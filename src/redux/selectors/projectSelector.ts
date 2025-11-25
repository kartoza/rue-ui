import { useSelector } from 'react-redux';
import type { RootState } from '../store.ts';
import type { ProjectState } from '../reducers/project';
import { StepType } from '../reducers/stepSlice.ts';
import type { StepState } from '../reducers/step';
import { TaskStatus } from '../reducers/task.ts';

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

export function useCurrentProjectDone(): boolean {
  return useSelector((state: RootState) => {
    const projectState = state.project as ProjectState;
    if (projectState.error) return true;

    const currentProject = projectState?.project;
    if (!currentProject?.uuid) return true;
    if (!currentProject) return false;
    return Object.values(StepType).every(
      (step) => currentProject.steps[step]?.step?.task?.status === TaskStatus.success
    );
  });
}
