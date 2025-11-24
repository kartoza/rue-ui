import { useSelector } from 'react-redux';
import type { RootState } from '../store.ts';
import type { S1DB, S2DB, S3DB, S4DB, S5DB, S6DB, Spider } from '../reducers/luckySheet';

export function useS1DB(): S1DB | null {
  return useSelector((state: RootState) => state.luckySheet?.S1DB);
}

export function useS2DB(): S2DB | null {
  return useSelector((state: RootState) => state.luckySheet?.S2DB);
}

export function useS3DB(): S3DB | null {
  return useSelector((state: RootState) => state.luckySheet?.S3DB);
}

export function useS4DB(): S4DB | null {
  return useSelector((state: RootState) => state.luckySheet?.S4DB);
}

export function useS5DB(): S5DB | null {
  return useSelector((state: RootState) => state.luckySheet?.S5DB);
}

export function useS6DB(): S6DB | null {
  return useSelector((state: RootState) => state.luckySheet?.S6DB);
}

export function useSpider(): Spider | null {
  return useSelector((state: RootState) => state.luckySheet?.Spider);
}
