import { useState } from 'react';
import { TaskPriority, TimeUnit } from './types/task';
import { useTasks } from './hooks/useTasks';
import { usePomodoro } from './hooks/usePomodoro';
import TaskCard from './components/TaskCard';
import PomodoroModal from './components/PomodoroModal';
import TaskFormModal from './components/TaskFormModal';
import './App.css';

function App() {
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [selectedPriority, setSelectedPriority] = useState<TaskPriority>(TaskPriority.URGENT_IMPORTANT);
  const [estimatedMinutes, setEstimatedMinutes] = useState<number>(25);
  const [timeUnit, setTimeUnit] = useState<TimeUnit>(TimeUnit.MINUTES);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { tasks, addTask, updateTask, deleteTask, incrementPomodoroCount, getTasksByQuadrant, getCompletedTasks, startTask } = useTasks();
  const { activePomodoro, timeLeft, startPomodoro, pausePomodoro, resumePomodoro, stopPomodoro } = usePomodoro(incrementPomodoroCount);

  const handleAddTask = (title: string, priority: TaskPriority, estimatedMinutes: number, timeUnit: TimeUnit) => {
    const minutes = timeUnit === TimeUnit.HOURS ? estimatedMinutes * 60 : estimatedMinutes;
    addTask(title, priority, minutes, timeUnit);
  };

  const quadrants = getTasksByQuadrant();

  return (
    <div className="app">
      <header className="header">
        <h1>四象限任务管理</h1>
        <button className="add-task-button" onClick={() => setIsModalOpen(true)}>添加任务</button>
      </header>
      {activePomodoro && (
        <PomodoroModal
          task={tasks.find(t => t.id === activePomodoro.taskId)!}
          timeLeft={timeLeft}
          isRunning={activePomodoro.isRunning}
          onPause={pausePomodoro}
          onResume={resumePomodoro}
          onStop={stopPomodoro}
        />
      )}

      <TaskFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleAddTask}
      />

      <div className="grid-container">
        <div className="quadrant">
          <h2>紧急且重要</h2>
          <p className="quadrant-description">需要立即处理的任务，直接影响目标达成</p>
          {quadrants.urgentImportant.map(task => (
            <TaskCard
              key={task.id}
              task={task}
              onUpdate={updateTask}
              onDelete={deleteTask}
              onStartPomodoro={(taskId) => {
                startTask(taskId);
                startPomodoro(taskId);
              }}
              isActive={activePomodoro?.taskId === task.id}
            />
          ))}
        </div>
        <div className="quadrant">
          <h2>重要不紧急</h2>
          <p className="quadrant-description">需要规划和安排的任务，对长期目标至关重要</p>
          {quadrants.notUrgentImportant.map(task => (
            <TaskCard
              key={task.id}
              task={task}
              onUpdate={updateTask}
              onDelete={deleteTask}
              onStartPomodoro={(taskId) => {
                startTask(taskId);
                startPomodoro(taskId);
              }}
              isActive={activePomodoro?.taskId === task.id}
            />
          ))}
        </div>
        <div className="quadrant">
          <h2>紧急不重要</h2>
          <p className="quadrant-description">需要及时处理但可考虑委托他人的任务</p>
          {quadrants.urgentNotImportant.map(task => (
            <TaskCard
              key={task.id}
              task={task}
              onUpdate={updateTask}
              onDelete={deleteTask}
              onStartPomodoro={(taskId) => {
                startTask(taskId);
                startPomodoro(taskId);
              }}
              isActive={activePomodoro?.taskId === task.id}
            />
          ))}
        </div>
        <div className="quadrant">
          <h2>不紧急不重要</h2>
          <p className="quadrant-description">可以考虑延后或取消的任务，避免时间浪费</p>
          {quadrants.notUrgentNotImportant.map(task => (
            <TaskCard
              key={task.id}
              task={task}
              onUpdate={updateTask}
              onDelete={deleteTask}
              onStartPomodoro={(taskId) => {
                startTask(taskId);
                startPomodoro(taskId);
              }}
              isActive={activePomodoro?.taskId === task.id}
            />
          ))}
        </div>
      </div>
      <div className="completed-tasks-section">
        <h2>已完成任务</h2>
        <div className="completed-tasks-list">
          {getCompletedTasks().map(task => (
            <TaskCard
              key={task.id}
              task={task}
              onUpdate={updateTask}
              onDelete={deleteTask}
              onStartPomodoro={(taskId) => {
                startTask(taskId);
                startPomodoro(taskId);
              }}
              isActive={activePomodoro?.taskId === task.id}
            />
          ))}
        </div>
      </div>
      <footer className="help-section">
        <div className="help-content">
          <h3>使用说明</h3>
          <div className="help-item">
            <h4>番茄工作法</h4>
            <p>番茄工作法是一种时间管理方法，每个工作时段为25分钟，称为一个"番茄钟"：</p>
            <ul>
              <li>专注工作25分钟</li>
              <li>完成后休息5分钟</li>
              <li>每完成4个番茄钟，休息15-30分钟</li>
            </ul>
          </div>
          <div className="help-item">
            <h4>四象限法则</h4>
            <p>四象限法则帮助您根据任务的紧急程度和重要程度进行分类：</p>
            <ul>
              <li><strong>紧急且重要：</strong>需要立即处理的重要任务</li>
              <li><strong>重要不紧急：</strong>需要规划和安排的重要任务</li>
              <li><strong>紧急不重要：</strong>可以委托他人的紧急任务</li>
              <li><strong>不紧急不重要：</strong>可以考虑延后或取消的任务</li>
            </ul>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
