import { useSelector } from 'react-redux';

export function useCurrentProject() {
  return useSelector((state) => state.project.currentProject);
}
