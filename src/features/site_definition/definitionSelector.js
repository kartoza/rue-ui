import { useSelector } from 'react-redux';

export function useCurrentDefinition() {
  return useSelector((state) => state.definition.selectedDefinition);
}
