import { useSelector } from 'react-redux';
import type { RootState } from '../store.ts';
import type { GlobalState } from '../reducers/global.ts';

export function useCurrentRightSideOpened(): boolean {
  return useSelector((state: RootState) => (state.global as GlobalState).rightSideOpened);
}
