import { useState, useEffect } from 'react';
import { Task, TaskPriority, TimeUnit } from '../types/task';

const TASKS_STORAGE_KEY = 'timequad_tasks';

export const useTasks = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    try {
      const storedTasks = localStorage.getItem(TASKS_STORAGE_KEY);
      if (storedTasks) {
        const parsedTasks = JSON.parse(storedTasks);
        if (Array.isArray(parsedTasks)) {
          setTasks(parsedTasks);
        } else {
          console.error('存储的任务数据格式不正确');
          setTasks([]);
        }
      }
    } catch (error) {
      console.error('读取任务数据时出错:', error);
      setTasks([]);
    } finally {
      setIsInitialized(true);
    }
  }, []);

  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(tasks));
    }
  }, [tasks, isInitialized]);

  const addTask = (title: string, priority: TaskPriority, estimatedMinutes: number, timeUnit: TimeUnit, pomodoroMinutes: number) => {
    const newTask: Task = {
      id: Date.now().toString(),
      title,
      priority,
      completed: false,
      pomodoroCount: 0,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      estimatedMinutes,
      timeUnit,
      pomodoroMinutes
    };
    setTasks([...tasks, newTask]);
  };

  const updateTask = (taskId: string, updates: Partial<Task>) => {
    setTasks(tasks.map(task =>
      task.id === taskId
        ? { 
            ...task, 
            ...updates, 
            updatedAt: Date.now(),
            completedAt: updates.completed ? Date.now() : task.completedAt 
          }
        : task
    ));
  };

  const deleteTask = (taskId: string) => {
    setTasks(tasks.filter(task => task.id !== taskId));
  };

  const incrementPomodoroCount = (taskId: string) => {
    setTasks(tasks.map(task =>
      task.id === taskId
        ? { ...task, pomodoroCount: task.pomodoroCount + 1, updatedAt: Date.now(), endTime: Date.now() }
        : task
    ));
  };

  const startTask = (taskId: string) => {
    setTasks(tasks.map(task =>
      task.id === taskId
        ? { ...task, startTime: task.startTime || Date.now() }
        : task
    ));
  };

  const getTasksByQuadrant = () => {
    const incompleteTasks = tasks.filter(task => !task.completed);
    return {
      urgentImportant: incompleteTasks.filter(task => task.priority === TaskPriority.URGENT_IMPORTANT),
      notUrgentImportant: incompleteTasks.filter(task => task.priority === TaskPriority.NOT_URGENT_IMPORTANT),
      urgentNotImportant: incompleteTasks.filter(task => task.priority === TaskPriority.URGENT_NOT_IMPORTANT),
      notUrgentNotImportant: incompleteTasks.filter(task => task.priority === TaskPriority.NOT_URGENT_NOT_IMPORTANT)
    };
  };

  const getCompletedTasks = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return tasks
      .filter(task => task.completed && task.completedAt && task.completedAt >= today.getTime())
      .sort((a, b) => (b.updatedAt || 0) - (a.updatedAt || 0));
  };

  const getAllCompletedTasks = () => {
    return tasks
      .filter(task => task.completed)
      .sort((a, b) => (b.updatedAt || 0) - (a.updatedAt || 0));
  };

  return {
    tasks,
    addTask,
    updateTask,
    deleteTask,
    incrementPomodoroCount,
    getTasksByQuadrant,
    getCompletedTasks,
    getAllCompletedTasks,
    startTask
  };
};