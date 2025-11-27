import { useSelector } from 'react-redux';
import type { RootState } from '../store.ts';
import type { ProjectsState } from '../reducers/projectsSlice.ts';

export function useCurrentProjects(): ProjectsState {
  return useSelector((state: RootState) => state.projects);
}
