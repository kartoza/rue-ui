import { useSelector } from 'react-redux';
import type { RootState } from '../store.ts';
import type { StepUpdateState } from '../reducers/stepUpdateSlice.ts';

export function useCurrentStepUpdate(): StepUpdateState {
  return useSelector((state: RootState) => state.stepUpdate as StepUpdateState);
}

export function useCurrentStepUpdateLoading(): boolean {
  return useSelector((state: RootState) => state.stepUpdate.loading);
}
