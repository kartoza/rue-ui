import { useSelector } from 'react-redux';
import type { RootState } from '../store.ts';
import type { TaskState } from '../reducers/taskSlice';

export function useCurrentTask() {
  return useSelector((state: RootState) => (state.task as TaskState).currentTask);
}
