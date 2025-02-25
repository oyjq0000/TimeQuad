import React from 'react';
import { Task, TimeUnit } from '../types/task';
import './TaskCard.css';

/**
 * 格式化时间戳为本地日期时间字符串
 * @param timestamp - 时间戳（毫秒）
 * @returns 格式化后的日期时间字符串（MM-DD HH:mm）
 */
const formatTime = (timestamp: number | undefined) => {
  if (!timestamp) return '未开始';
  return new Date(timestamp).toLocaleString('zh-CN', {
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  });
};

/**
 * TaskCard组件的属性接口
 */
interface TaskCardProps {
  task: Task;                                                    // 任务对象
  onUpdate: (taskId: string, updates: Partial<Task>) => void;    // 更新任务的回调函数
  onDelete: (taskId: string) => void;                           // 删除任务的回调函数
  onStartPomodoro: (taskId: string) => void;                    // 开始番茄钟的回调函数
  isActive: boolean;                                            // 是否是当前活动的任务
}

/**
 * 任务卡片组件
 * 显示任务的详细信息，包括标题、完成状态、番茄钟进度和时间信息
 * 提供任务操作功能：切换完成状态、开始专注和删除任务
 */
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
        {/* 显示预估时间 */}
        <div className="estimated-time">
          <span>预估时间：{task.timeUnit === TimeUnit.HOURS ? `${task.estimatedMinutes / 60}小时` : `${task.estimatedMinutes}分钟`}</span>
        </div>
        {/* 显示番茄钟完成进度 */}
        <div className="pomodoro-count">
          <span className="pomodoro-icon">🍅</span>
          <span>{task.pomodoroCount} / {task.estimatedMinutes ? Math.ceil(task.estimatedMinutes / task.pomodoroMinutes) : 0}</span>
          <span className="pomodoro-minutes">({task.pomodoroMinutes}分钟/个)</span>
        </div>
        {/* 显示任务的时间信息 */}
        <div className="time-info">
          <div>开始：{formatTime(task.startTime)}</div>
          {task.endTime && <div>结束：{formatTime(task.endTime)}</div>}
          {task.completed && task.completedAt && <div>完成：{formatTime(task.completedAt)}</div>}
        </div>
      </div>
      {/* 任务操作按钮 */}
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