import { useSelector } from 'react-redux';
import type { RootState } from '../store.ts';

type DefinitionState = {
  selectedDefinition: string;
};

export function useCurrentDefinition(): string {
  return useSelector(
    (state: RootState) => (state.definition as DefinitionState).selectedDefinition
  );
}
