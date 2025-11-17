import { useSelector } from 'react-redux';
import type { RootState } from '../../app/store';
import type { TaskState } from './taskSlice';

export function useCurrentTask() {
  return useSelector((state: RootState) => (state.task as TaskState).currentTask);
}
