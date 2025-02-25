import React from 'react';
import { Task, TaskPriority } from '../types/task';

/**
 * 番茄钟模态框组件的属性接口
 */
interface PomodoroModalProps {
  task: Task;                  // 当前正在进行的任务
  timeLeft: number;            // 剩余时间（毫秒）
  isRunning: boolean;          // 番茄钟是否正在运行
  onPause: () => void;         // 暂停番茄钟的回调函数
  onResume: () => void;        // 继续番茄钟的回调函数
  onStop: () => void;          // 停止番茄钟的回调函数
}

/**
 * 格式化毫秒时间为分:秒格式
 * @param ms - 毫秒数
 * @returns 格式化后的时间字符串（MM:SS）
 */
const formatTime = (ms: number) => {
  const minutes = Math.floor(ms / 60000);
  const seconds = Math.floor((ms % 60000) / 1000);
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
};

/**
 * 格式化时间戳为本地日期时间字符串
 * @param timestamp - 时间戳（毫秒）
 * @returns 格式化后的日期时间字符串
 */
const formatDateTime = (timestamp: number | undefined) => {
  if (!timestamp) return '未开始';
  return new Date(timestamp).toLocaleString('zh-CN', {
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  });
};

/**
 * 根据任务优先级获取象限名称
 * @param priority - 任务优先级
 * @returns 对应的象限名称
 */
const getQuadrantName = (priority: TaskPriority) => {
  switch (priority) {
    case TaskPriority.URGENT_IMPORTANT:
      return '紧急且重要';
    case TaskPriority.NOT_URGENT_IMPORTANT:
      return '重要不紧急';
    case TaskPriority.URGENT_NOT_IMPORTANT:
      return '紧急不重要';
    case TaskPriority.NOT_URGENT_NOT_IMPORTANT:
      return '不紧急不重要';
  }
};

/**
 * 番茄钟模态框组件
 * 显示当前正在进行的任务信息、剩余时间和控制按钮
 */
export const PomodoroModal: React.FC<PomodoroModalProps> = ({
  task,
  timeLeft,
  isRunning,
  onPause,
  onResume,
  onStop
}) => {
  return (
    <div className="pomodoro-modal-overlay">
      <div className="pomodoro-modal">
        <div className="quadrant-indicator">{getQuadrantName(task.priority)}</div>
        <h2>{task.title}</h2>
        <div className="pomodoro-info">
          <p>已使用番茄钟：{task.pomodoroCount} 个</p>
          <p>开始时间：{formatDateTime(task.startTime)}</p>
        </div>
        <div className="pomodoro-timer">
          <span className="time">{formatTime(timeLeft)}</span>
        </div>
        <div className="pomodoro-controls">
          {isRunning ? (
            <button onClick={onPause}>暂停</button>
          ) : (
            <button onClick={onResume}>继续</button>
          )}
          <button onClick={onStop}>停止</button>
        </div>
      </div>
    </div>
  );
};

export default PomodoroModal;