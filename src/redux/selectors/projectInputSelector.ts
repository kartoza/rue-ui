import { useSelector } from 'react-redux';
import type { RootState } from '../store.ts';
import type { ProjectInputState } from '../reducers/projectInputSlice.ts';

export function useCurrentProjectInput(): ProjectInputState {
  return useSelector((state: RootState) => state.projectInput);
}
