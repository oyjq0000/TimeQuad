import React from 'react';
import { Task } from '../types/task';

interface TaskCardProps {
  task: Task;
  onUpdate: (taskId: string, updates: Partial<Task>) => void;
  onDelete: (taskId: string) => void;
  onStartPomodoro: (taskId: string) => void;
  isActive: boolean;
}

export const TaskCard: React.FC<TaskCardProps> = ({
  task,
  onUpdate,
  onDelete,
  onStartPomodoro,
  isActive
}) => {
  return (
    <div className={`task-card ${isActive ? 'active' : ''}`}>
      <div className="task-header">
        <input
          type="checkbox"
          checked={task.completed}
          onChange={(e) => onUpdate(task.id, { completed: e.target.checked })}
        />
        <span className={task.completed ? 'completed' : ''}>{task.title}</span>
      </div>
      <div className="task-footer">
        <span className="pomodoro-count">🍅 {task.pomodoroCount}</span>
        <div className="task-actions">
          {!isActive && (
            <button onClick={() => onStartPomodoro(task.id)}>开始专注</button>
          )}
          <button onClick={() => onDelete(task.id)}>删除</button>
        </div>
      </div>
    </div>
  );
};

export default TaskCard;