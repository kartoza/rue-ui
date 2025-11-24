import { useSelector } from 'react-redux';
import type { RootState } from '../store.ts';
import type { StepState, StepType } from '../reducers/stepSlice';

export function useCurrentStep(): StepType {
  return useSelector((state: RootState) => (state.step as StepState).currentStep);
}
