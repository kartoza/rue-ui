import { useEffect } from 'react';
import { useCurrentProjectState } from '../../redux/selectors/projectSelector.ts';
import type { Project, ProjectState } from '../../redux/reducers/project';

export default function StepControl() {
  const currentProjectState: ProjectState = useCurrentProjectState();
  const currentProject: Project | null = currentProjectState.project;

  // Site
  useEffect(() => {
    if (currentProject?.steps?.site?.step?.result) {
      console.log(currentProject?.steps?.site?.step?.result);
    }
  }, [currentProject?.steps?.site?.step?.result]);

  return null;
}
