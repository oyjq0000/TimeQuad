import React, { useState, useEffect } from 'react';
import { TaskPriority, TimeUnit } from '../types/task';
import './TaskFormModal.css';

/**
 * 任务表单模态框组件的属性接口
 */
interface TaskFormModalProps {
  isOpen: boolean;                  // 模态框是否打开
  onClose: () => void;              // 关闭模态框的回调函数
  onSubmit: (title: string, priority: TaskPriority, estimatedMinutes: number, timeUnit: TimeUnit) => void;  // 提交表单的回调函数
  pomodoroMinutes: number;          // 每个番茄钟的时长（分钟）
}

/**
 * 任务表单模态框组件
 * 用于创建新任务，包含任务标题、优先级和预估时间的输入表单
 */
export const TaskFormModal: React.FC<TaskFormModalProps> = ({ isOpen, onClose, onSubmit, pomodoroMinutes }) => {
  const [title, setTitle] = useState('');
  const [priority, setPriority] = useState<TaskPriority>(TaskPriority.URGENT_IMPORTANT);
  const [estimatedMinutes, setEstimatedMinutes] = useState<number>(pomodoroMinutes);
  const [timeUnit, setTimeUnit] = useState<TimeUnit>(TimeUnit.MINUTES);

  // 当番茄钟时长设置改变时，更新预估时间的默认值
  useEffect(() => {
    setEstimatedMinutes(pomodoroMinutes);
  }, [pomodoroMinutes]);

  // 处理表单提交
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim()) {
      onSubmit(title.trim(), priority, estimatedMinutes, timeUnit);
      setTitle('');
      setEstimatedMinutes(25);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>添加新任务</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="title">任务标题</label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="输入任务标题..."
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="priority">优先级</label>
            <select
              id="priority"
              value={priority}
              onChange={(e) => setPriority(e.target.value as TaskPriority)}
            >
              <option value={TaskPriority.URGENT_IMPORTANT}>紧急且重要</option>
              <option value={TaskPriority.NOT_URGENT_IMPORTANT}>重要不紧急</option>
              <option value={TaskPriority.URGENT_NOT_IMPORTANT}>紧急不重要</option>
              <option value={TaskPriority.NOT_URGENT_NOT_IMPORTANT}>不紧急不重要</option>
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="estimatedTime">预估时间</label>
            <div className="time-input-group">
              <input
                id="estimatedTime"
                type="number"
                min="1"
                value={estimatedMinutes}
                onChange={(e) => setEstimatedMinutes(Math.max(1, parseInt(e.target.value) || 25))}
                required
              />
              <select
                value={timeUnit}
                onChange={(e) => setTimeUnit(e.target.value as TimeUnit)}
              >
                <option value={TimeUnit.MINUTES}>分钟</option>
                <option value={TimeUnit.HOURS}>小时</option>
              </select>
            </div>
          </div>
          <div className="modal-actions">
            <button type="button" onClick={onClose}>取消</button>
            <button type="submit">添加</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskFormModal;