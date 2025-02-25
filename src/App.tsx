import { useState } from 'react';
import { TaskPriority } from './types/task';
import { useTasks } from './hooks/useTasks';
import { usePomodoro } from './hooks/usePomodoro';
import TaskCard from './components/TaskCard';
import './App.css';

function App() {
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [selectedPriority, setSelectedPriority] = useState<TaskPriority>(TaskPriority.URGENT_IMPORTANT);
  const { tasks, addTask, updateTask, deleteTask, incrementPomodoroCount, getTasksByQuadrant } = useTasks();
  const { activePomodoro, timeLeft, startPomodoro, pausePomodoro, resumePomodoro, stopPomodoro } = usePomodoro(incrementPomodoroCount);

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTaskTitle.trim()) {
      addTask(newTaskTitle.trim(), selectedPriority);
      setNewTaskTitle('');
    }
  };

  const formatTime = (ms: number) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const quadrants = getTasksByQuadrant();

  return (
    <div className="app">
      <header className="header">
        <h1>四象限任务管理</h1>
        {activePomodoro && (
          <div className="pomodoro-timer">
            <span>{formatTime(timeLeft)}</span>
            {activePomodoro.isRunning ? (
              <button onClick={pausePomodoro}>暂停</button>
            ) : (
              <button onClick={resumePomodoro}>继续</button>
            )}
            <button onClick={stopPomodoro}>停止</button>
          </div>
        )}
      </header>

      <form className="task-form" onSubmit={handleAddTask}>
        <input
          type="text"
          value={newTaskTitle}
          onChange={(e) => setNewTaskTitle(e.target.value)}
          placeholder="输入新任务..."
        />
        <select
          value={selectedPriority}
          onChange={(e) => setSelectedPriority(e.target.value as TaskPriority)}
        >
          <option value={TaskPriority.URGENT_IMPORTANT}>紧急且重要</option>
          <option value={TaskPriority.NOT_URGENT_IMPORTANT}>重要不紧急</option>
          <option value={TaskPriority.URGENT_NOT_IMPORTANT}>紧急不重要</option>
          <option value={TaskPriority.NOT_URGENT_NOT_IMPORTANT}>不紧急不重要</option>
        </select>
        <button type="submit">添加任务</button>
      </form>

      <div className="grid-container">
        <div className="quadrant">
          <h2>紧急且重要</h2>
          {quadrants.urgentImportant.map(task => (
            <TaskCard
              key={task.id}
              task={task}
              onUpdate={updateTask}
              onDelete={deleteTask}
              onStartPomodoro={startPomodoro}
              isActive={activePomodoro?.taskId === task.id}
            />
          ))}
        </div>
        <div className="quadrant">
          <h2>重要不紧急</h2>
          {quadrants.notUrgentImportant.map(task => (
            <TaskCard
              key={task.id}
              task={task}
              onUpdate={updateTask}
              onDelete={deleteTask}
              onStartPomodoro={startPomodoro}
              isActive={activePomodoro?.taskId === task.id}
            />
          ))}
        </div>
        <div className="quadrant">
          <h2>紧急不重要</h2>
          {quadrants.urgentNotImportant.map(task => (
            <TaskCard
              key={task.id}
              task={task}
              onUpdate={updateTask}
              onDelete={deleteTask}
              onStartPomodoro={startPomodoro}
              isActive={activePomodoro?.taskId === task.id}
            />
          ))}
        </div>
        <div className="quadrant">
          <h2>不紧急不重要</h2>
          {quadrants.notUrgentNotImportant.map(task => (
            <TaskCard
              key={task.id}
              task={task}
              onUpdate={updateTask}
              onDelete={deleteTask}
              onStartPomodoro={startPomodoro}
              isActive={activePomodoro?.taskId === task.id}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
