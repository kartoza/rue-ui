import { useSelector } from 'react-redux';
import type { RootState } from '../store.ts';
import type { S1DB, S2DB, S6DB } from '../reducers/luckySheet';

export function useS1DB(): S1DB | null {
  return useSelector((state: RootState) => state.luckySheet?.S1DB);
}

export function useS2DB(): S2DB | null {
  return useSelector((state: RootState) => state.luckySheet?.S2DB);
}

export function useS6DB(): S6DB | null {
  return useSelector((state: RootState) => state.luckySheet?.S6DB);
}
