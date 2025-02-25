import { useState, useEffect, useCallback } from 'react';
import { ActivePomodoro } from '../types/task';

// 本地存储的键名
const STORAGE_KEY = 'active_pomodoro';
const SETTINGS_KEY = 'pomodoro_settings';

// 默认番茄钟时长（分钟）
const DEFAULT_POMODORO_MINUTES = 25;

// 从本地存储获取番茄钟时长设置
const getPomodoroMinutes = () => {
  const settings = localStorage.getItem(SETTINGS_KEY);
  return settings ? JSON.parse(settings).minutes : DEFAULT_POMODORO_MINUTES;
};

// 保存番茄钟时长设置到本地存储
const savePomodoroMinutes = (minutes: number) => {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify({ minutes }));
};

// 获取番茄钟持续时间（毫秒）
const getPomorodoDuration = (minutes: number) => minutes * 60 * 1000;

/**
 * 番茄钟计时器钩子
 * 管理番茄钟的状态、计时和持久化存储
 * @param onPomodoroComplete - 番茄钟完成时的回调函数
 */
export const usePomodoro = (onPomodoroComplete: (taskId: string) => void) => {
  // 番茄钟时长（分钟）
  const [pomodoroMinutes, setPomodoroMinutes] = useState(getPomodoroMinutes());
  // 当前活动的番茄钟状态
  const [activePomodoro, setActivePomodoro] = useState<ActivePomodoro | null>(null);
  // 剩余时间（毫秒）
  const [timeLeft, setTimeLeft] = useState<number>(0);

  // 从本地存储恢复番茄钟状态
  useEffect(() => {
    const storedPomodoro = localStorage.getItem(STORAGE_KEY);
    if (storedPomodoro) {
      const parsed = JSON.parse(storedPomodoro);
      setActivePomodoro(parsed);
      if (parsed.isRunning) {
        // 计算已经过去的时间，并设置剩余时间
        const elapsed = Date.now() - parsed.startTime - parsed.totalPausedTime;
        setTimeLeft(Math.max(0, getPomorodoDuration(pomodoroMinutes) - elapsed));
      }
    }
  }, []);

  // 将番茄钟状态保存到本地存储
  useEffect(() => {
    if (activePomodoro) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(activePomodoro));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, [activePomodoro]);

  // 番茄钟计时器
  useEffect(() => {
    let timer: number;
    if (activePomodoro?.isRunning) {
      timer = window.setInterval(() => {
        // 计算已经过去的时间
        const elapsed = Date.now() - activePomodoro.startTime - (activePomodoro.totalPausedTime || 0);
        const remaining = Math.max(0, getPomorodoDuration(pomodoroMinutes) - elapsed);
        setTimeLeft(remaining || 0);

        // 番茄钟完成时的处理
        if (remaining === 0) {
          onPomodoroComplete(activePomodoro.taskId);
          setActivePomodoro(null);
        }
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [activePomodoro, onPomodoroComplete]);

  /**
   * 开始一个新的番茄钟
   * @param taskId - 任务ID
   */
  const startPomodoro = useCallback((taskId: string) => {
    setActivePomodoro({
      taskId,
      startTime: Date.now(),
      totalPausedTime: 0,
      isRunning: true
    });
    setTimeLeft(getPomorodoDuration(pomodoroMinutes));
  }, [pomodoroMinutes]);

  /**
   * 暂停当前番茄钟
   */
  const pausePomodoro = useCallback(() => {
    if (activePomodoro?.isRunning) {
      setActivePomodoro(prev => prev ? {
        ...prev,
        isRunning: false,
        pausedTime: Date.now()
      } : null);
    }
  }, [activePomodoro]);

  /**
   * 继续当前番茄钟
   */
  const resumePomodoro = useCallback(() => {
    if (activePomodoro && !activePomodoro.isRunning && activePomodoro.pausedTime) {
      // 计算暂停的时间并更新总暂停时间
      const additionalPausedTime = Date.now() - activePomodoro.pausedTime;
      setActivePomodoro(prev => prev ? {
        ...prev,
        isRunning: true,
        pausedTime: undefined,
        totalPausedTime: prev.totalPausedTime + additionalPausedTime
      } : null);
    }
  }, [activePomodoro]);

  /**
   * 停止当前番茄钟
   */
  const stopPomodoro = useCallback(() => {
    setActivePomodoro(null);
    setTimeLeft(0);
  }, []);

  // 更新番茄钟时长设置
  const updatePomodoroMinutes = useCallback((minutes: number) => {
    setPomodoroMinutes(minutes);
    savePomodoroMinutes(minutes);
  }, []);

  return {
    activePomodoro,
    timeLeft,
    startPomodoro,
    pausePomodoro,
    resumePomodoro,
    stopPomodoro,
    pomodoroMinutes,
    updatePomodoroMinutes
  };
};