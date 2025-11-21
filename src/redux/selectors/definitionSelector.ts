import { useSelector } from 'react-redux';
import type { RootState } from '../store.ts';
import type { DefinitionState, DefinitionType } from '../reducers/definitionSlice.ts';

export function useCurrentDefinition(): DefinitionType {
  return useSelector(
    (state: RootState) => (state.definition as DefinitionState).selectedDefinition
  );
}
