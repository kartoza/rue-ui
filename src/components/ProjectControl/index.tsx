import { useEffect } from 'react';
import { useCurrentProjectState } from '../../redux/selectors/projectSelector.ts';
import { StepType } from '../../redux/reducers/stepSlice.ts';
import type { Project, ProjectState, StepState } from '../../redux/reducers/project';
import { TaskStatus } from '../../redux/reducers/task.ts';
import { getStepStatus } from '../../redux/reducers/projectSlice.ts';
import { useDispatch } from 'react-redux';
import type { AppDispatch } from '../../redux/store.ts';

export default function ProjectControl() {
  const dispatch = useDispatch<AppDispatch>();
  const currentProjectState: ProjectState = useCurrentProjectState();
  const currentProject: Project | null = currentProjectState.project;

  let firstUndefinedStep: StepType | undefined = undefined;
  if (currentProject?.uuid && currentProject?.steps) {
    firstUndefinedStep = Object.values(StepType).find(
      (step) =>
        !currentProject.steps[step] ||
        currentProject.steps[step].step?.task?.status !== TaskStatus.success
    );
  }
  let step: StepState | undefined = undefined;
  if (firstUndefinedStep) {
    step = currentProject?.steps[firstUndefinedStep];
  }

  useEffect(() => {
    if (!currentProjectState.loading && firstUndefinedStep) {
      if (step && !step?.loading) {
        setTimeout(() => {
          if (currentProject?.uuid) {
            dispatch(
              getStepStatus({
                uuid: currentProject.uuid,
                step: firstUndefinedStep,
              })
            );
          }
        }, 3000);
      } else if (!step) {
        if (currentProject?.uuid) {
          dispatch(
            getStepStatus({
              uuid: currentProject.uuid,
              step: firstUndefinedStep,
            })
          );
        }
      }
    }
  }, [currentProjectState.loading, currentProject?.uuid, step]);

  return null;
}
