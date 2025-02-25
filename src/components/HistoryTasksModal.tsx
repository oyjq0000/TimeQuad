import React from 'react';
import { Task } from '../types/task';
import TaskCard from './TaskCard';
import './HistoryTasksModal.css';

/**
 * 历史任务模态框组件的属性接口
 */
interface HistoryTasksModalProps {
  isOpen: boolean;                  // 模态框是否打开
  onClose: () => void;              // 关闭模态框的回调函数
  tasks: Task[];                    // 历史任务列表
  onUpdate: (taskId: string, updates: Partial<Task>) => void;    // 更新任务的回调函数
  onDelete: (taskId: string) => void;                           // 删除任务的回调函数
  onStartPomodoro: (taskId: string) => void;                    // 开始任务番茄钟的回调函数
  activeTaskId?: string;                                        // 当前活动任务的ID
}

/**
 * 历史任务模态框组件
 * 用于显示和管理已完成的历史任务列表
 * 支持查看、编辑、删除和重新开始任务
 */
export const HistoryTasksModal: React.FC<HistoryTasksModalProps> = ({
  isOpen,
  onClose,
  tasks,
  onUpdate,
  onDelete,
  onStartPomodoro,
  activeTaskId
}) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content history-tasks-modal">
        <div className="modal-header">
          <h2>历史任务</h2>
          <button className="close-button" onClick={onClose}>×</button>
        </div>
        <div className="history-tasks-list">
          {tasks.length > 0 ? (
            tasks.map(task => (
              <TaskCard
                key={task.id}
                task={task}
                onUpdate={onUpdate}
                onDelete={onDelete}
                onStartPomodoro={onStartPomodoro}
                isActive={activeTaskId === task.id}
              />
            ))
          ) : (
            <p className="no-tasks-message">暂无历史任务</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default HistoryTasksModal;