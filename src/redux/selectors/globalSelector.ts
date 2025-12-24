import { useSelector } from 'react-redux';
import type { RootState } from '../store.ts';
import type { GlobalState } from '../reducers/global.ts';
import { DrawingMode } from '../reducers/global.ts';

export function useCurrentRightSideOpened(): boolean {
  return useSelector((state: RootState) => (state.global as GlobalState).rightSideOpened);
}

export function useCurrentDrawMode(): DrawingMode | null {
  return useSelector((state: RootState) => (state.global as GlobalState).drawingMode);
}

export function useIsDrawSiteMode(): boolean {
  return useSelector((state: RootState) =>
    [DrawingMode.DRAW_SITE, DrawingMode.UPDATE_SITE].includes(
      // @ts-expect-error: This is correct
      (state.global as GlobalState).drawingMode
    )
  );
}
