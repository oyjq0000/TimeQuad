import React from 'react';
import { Task } from '../types/task';
import './TaskCard.css';

const formatTime = (timestamp: number | undefined) => {
  if (!timestamp) return '未开始';
  return new Date(timestamp).toLocaleString('zh-CN', {
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  });
};

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
        <label className="checkbox-container">
          <input
            type="checkbox"
            checked={task.completed}
            onChange={(e) => onUpdate(task.id, { completed: e.target.checked })}
          />
          <span className="checkmark"></span>
        </label>
        <h3 className={`task-title ${task.completed ? 'completed' : ''}`}>{task.title}</h3>
      </div>
      <div className="task-info">
        <div className="pomodoro-count">
          <span className="pomodoro-icon">🍅</span>
          <span>{task.pomodoroCount} / {task.estimatedMinutes ? Math.ceil(task.estimatedMinutes / 25) : 0}</span>
        </div>
        <div className="time-info">
          <div>开始：{formatTime(task.startTime)}</div>
          {task.endTime && <div>结束：{formatTime(task.endTime)}</div>}
          {task.completed && task.completedAt && <div>完成：{formatTime(task.completedAt)}</div>}
        </div>
      </div>
      <div className="task-actions">
        {!task.completed && (
          <>
            {!isActive && (
              <button className="action-button start-button" onClick={() => onStartPomodoro(task.id)}>
                开始专注
              </button>
            )}
            <button className="action-button delete-button" onClick={() => onDelete(task.id)}>
              删除
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default TaskCard;