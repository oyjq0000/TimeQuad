export enum TaskPriority {
  URGENT_IMPORTANT = 'URGENT_IMPORTANT',
  NOT_URGENT_IMPORTANT = 'NOT_URGENT_IMPORTANT',
  URGENT_NOT_IMPORTANT = 'URGENT_NOT_IMPORTANT',
  NOT_URGENT_NOT_IMPORTANT = 'NOT_URGENT_NOT_IMPORTANT'
}

export enum TimeUnit {
  MINUTES = 'MINUTES',
  HOURS = 'HOURS'
}

export interface Task {
  id: string;
  title: string;
  priority: TaskPriority;
  completed: boolean;
  pomodoroCount: number;
  createdAt: number;
  updatedAt: number;
  startTime?: number;
  endTime?: number;
  estimatedMinutes: number;
  timeUnit: TimeUnit;
  completedAt?: number;
  pomodoroMinutes: number;
}

export interface ActivePomodoro {
  taskId: string;
  startTime: number;
  pausedTime?: number;
  totalPausedTime: number;
  isRunning: boolean;
}