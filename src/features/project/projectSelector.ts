import { useSelector } from 'react-redux';
import type { RootState } from '../../app/store';

// Define the shape of the project state
type ProjectState = {
  currentProject: string | null; // Replace 'any' with a more specific type if known
};

export function useCurrentProject() {
  return useSelector((state: RootState) => (state.project as ProjectState).currentProject);
}
