import { useState, useEffect } from 'react';
import { Task, TaskPriority } from '../types/task';

const TASKS_STORAGE_KEY = 'pomodoro_tasks';

export const useTasks = () => {
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    const storedTasks = localStorage.getItem(TASKS_STORAGE_KEY);
    if (storedTasks) {
      setTasks(JSON.parse(storedTasks));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(tasks));
  }, [tasks]);

  const addTask = (title: string, priority: TaskPriority) => {
    const newTask: Task = {
      id: Date.now().toString(),
      title,
      priority,
      completed: false,
      pomodoroCount: 0,
      createdAt: Date.now(),
      updatedAt: Date.now()
    };
    setTasks([...tasks, newTask]);
  };

  const updateTask = (taskId: string, updates: Partial<Task>) => {
    setTasks(tasks.map(task =>
      task.id === taskId
        ? { ...task, ...updates, updatedAt: Date.now() }
        : task
    ));
  };

  const deleteTask = (taskId: string) => {
    setTasks(tasks.filter(task => task.id !== taskId));
  };

  const incrementPomodoroCount = (taskId: string) => {
    setTasks(tasks.map(task =>
      task.id === taskId
        ? { ...task, pomodoroCount: task.pomodoroCount + 1, updatedAt: Date.now() }
        : task
    ));
  };

  const getTasksByQuadrant = () => {
    return {
      urgentImportant: tasks.filter(task => task.priority === TaskPriority.URGENT_IMPORTANT),
      notUrgentImportant: tasks.filter(task => task.priority === TaskPriority.NOT_URGENT_IMPORTANT),
      urgentNotImportant: tasks.filter(task => task.priority === TaskPriority.URGENT_NOT_IMPORTANT),
      notUrgentNotImportant: tasks.filter(task => task.priority === TaskPriority.NOT_URGENT_NOT_IMPORTANT)
    };
  };

  return {
    tasks,
    addTask,
    updateTask,
    deleteTask,
    incrementPomodoroCount,
    getTasksByQuadrant
  };
};