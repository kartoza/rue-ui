export const TaskStatus = {
  pending: 'pending',
  running: 'running',
  success: 'success',
  failed: 'failed',
} as const;

export type TaskStatus = (typeof TaskStatus)[keyof typeof TaskStatus];

export interface Task {
  task_id: string;
  status: TaskStatus;
  message: string;
}
