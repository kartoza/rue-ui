import { useSelector } from 'react-redux';
import type { RootState } from '../store.ts';

type ProjectState = {
  currentProject: string | null;
};

export function useCurrentProject() {
  return useSelector((state: RootState) => (state.project as ProjectState).currentProject);
}
