import React from 'react';
import { Task, TaskPriority } from '../types/task';
import './StatisticsModal.css';

/**
 * 统计模态框组件的属性接口
 */
interface StatisticsModalProps {
  isOpen: boolean;                  // 模态框是否打开
  onClose: () => void;              // 关闭模态框的回调函数
  tasks: Task[];                    // 任务列表
}

/**
 * 象限统计数据接口
 */
interface QuadrantStats {
  total: number;          // 总任务数
  completed: number;      // 已完成任务数
  completionRate: number; // 完成率
}

/**
 * 不同时间范围的统计数据接口
 */
interface TimeRangeStats {
  daily: {
    [key in TaskPriority]: QuadrantStats;  // 每日统计
  };
  weekly: {
    [key in TaskPriority]: QuadrantStats;  // 每周统计
  };
  monthly: {
    [key in TaskPriority]: QuadrantStats;  // 每月统计
  };
}

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
 * 计算指定时间段内的任务统计数据
 * @param tasks - 任务列表
 * @param startTime - 统计起始时间戳
 * @returns 各象限的统计数据
 */
const calculateStats = (tasks: Task[], startTime: number): { [key in TaskPriority]: QuadrantStats } => {
  const stats: { [key in TaskPriority]: QuadrantStats } = {
    [TaskPriority.URGENT_IMPORTANT]: { total: 0, completed: 0, completionRate: 0 },
    [TaskPriority.NOT_URGENT_IMPORTANT]: { total: 0, completed: 0, completionRate: 0 },
    [TaskPriority.URGENT_NOT_IMPORTANT]: { total: 0, completed: 0, completionRate: 0 },
    [TaskPriority.NOT_URGENT_NOT_IMPORTANT]: { total: 0, completed: 0, completionRate: 0 }
  };

  const periodTasks = tasks.filter(task => task.createdAt >= startTime);

  periodTasks.forEach(task => {
    stats[task.priority].total++;
    if (task.completed) {
      stats[task.priority].completed++;
    }
  });

  // 计算完成率
  Object.values(stats).forEach(stat => {
    stat.completionRate = stat.total > 0 ? (stat.completed / stat.total) * 100 : 0;
  });

  return stats;
};

/**
 * 根据统计数据生成改进建议
 * @param stats - 各象限的统计数据
 * @returns 改进建议列表
 */
const generateSuggestions = (stats: { [key in TaskPriority]: QuadrantStats }) => {
  const suggestions: string[] = [];

  // 紧急且重要的任务建议
  const urgentImportant = stats[TaskPriority.URGENT_IMPORTANT];
  if (urgentImportant.total > 0 && urgentImportant.completionRate < 70) {
    suggestions.push('紧急且重要的任务完成率较低，建议优先处理这些关键任务，避免影响重要目标的达成。');
  }

  // 重要不紧急的任务建议
  const notUrgentImportant = stats[TaskPriority.NOT_URGENT_IMPORTANT];
  if (notUrgentImportant.total > 0 && notUrgentImportant.completionRate < 50) {
    suggestions.push('重要不紧急的任务需要及时规划，建议合理分配时间，避免这些任务转变为紧急任务。');
  }

  // 紧急不重要的任务建议
  const urgentNotImportant = stats[TaskPriority.URGENT_NOT_IMPORTANT];
  if (urgentNotImportant.total > urgentImportant.total) {
    suggestions.push('紧急不重要的任务较多，建议考虑任务委派或优化工作流程，避免过多琐事影响重要工作。');
  }

  // 不紧急不重要的任务建议
  const notUrgentNotImportant = stats[TaskPriority.NOT_URGENT_NOT_IMPORTANT];
  if (notUrgentNotImportant.completed > notUrgentImportant.completed) {
    suggestions.push('注意力可能过多集中在不重要的任务上，建议重新评估任务优先级，将更多时间投入到重要任务中。');
  }

  return suggestions;
};

/**
 * 统计模态框组件
 * 用于显示任务完成情况的统计数据和改进建议
 * 支持按日、周、月查看各象限的任务统计
 */
export const StatisticsModal: React.FC<StatisticsModalProps> = ({ isOpen, onClose, tasks }) => {
  if (!isOpen) return null;

  const now = Date.now();
  const oneDayAgo = now - 24 * 60 * 60 * 1000;
  const oneWeekAgo = now - 7 * 24 * 60 * 60 * 1000;
  const oneMonthAgo = now - 30 * 24 * 60 * 60 * 1000;

  const dailyStats = calculateStats(tasks, oneDayAgo);
  const weeklyStats = calculateStats(tasks, oneWeekAgo);
  const monthlyStats = calculateStats(tasks, oneMonthAgo);

  const suggestions = generateSuggestions(monthlyStats);

  return (
    <div className="modal-overlay">
      <div className="modal-content statistics-modal">
        <div className="modal-header">
          <h2>任务统计</h2>
          <button className="close-button" onClick={onClose}>×</button>
        </div>
        <div className="statistics-content">
          <div className="time-range-section">
            <h3>今日统计</h3>
            <div className="quadrant-stats">
              {Object.entries(dailyStats).map(([priority, stats]) => (
                <div key={priority} className="quadrant-stat-item">
                  <h4>{getQuadrantName(priority as TaskPriority)}</h4>
                  <p>总任务数：{stats.total}</p>
                  <p>已完成：{stats.completed}</p>
                  <p>完成率：{stats.completionRate.toFixed(1)}%</p>
                </div>
              ))}
            </div>
          </div>

          <div className="time-range-section">
            <h3>本周统计</h3>
            <div className="quadrant-stats">
              {Object.entries(weeklyStats).map(([priority, stats]) => (
                <div key={priority} className="quadrant-stat-item">
                  <h4>{getQuadrantName(priority as TaskPriority)}</h4>
                  <p>总任务数：{stats.total}</p>
                  <p>已完成：{stats.completed}</p>
                  <p>完成率：{stats.completionRate.toFixed(1)}%</p>
                </div>
              ))}
            </div>
          </div>

          <div className="time-range-section">
            <h3>本月统计</h3>
            <div className="quadrant-stats">
              {Object.entries(monthlyStats).map(([priority, stats]) => (
                <div key={priority} className="quadrant-stat-item">
                  <h4>{getQuadrantName(priority as TaskPriority)}</h4>
                  <p>总任务数：{stats.total}</p>
                  <p>已完成：{stats.completed}</p>
                  <p>完成率：{stats.completionRate.toFixed(1)}%</p>
                </div>
              ))}
            </div>
          </div>

          <div className="suggestions-section">
            <h3>改进建议</h3>
            <ul className="suggestions-list">
              {suggestions.map((suggestion, index) => (
                <li key={index}>{suggestion}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatisticsModal;