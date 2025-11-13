import { useSelector } from 'react-redux';

export function useCurrentTask() {
  return useSelector((state) => state.task.currentTask);
}
