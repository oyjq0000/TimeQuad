import { useState, useEffect, useCallback } from 'react';
import { ActivePomodoro } from '../types/task';

const POMODORO_DURATION = 25 * 60 * 1000; // 25分钟，单位毫秒
const STORAGE_KEY = 'active_pomodoro';

export const usePomodoro = (onPomodoroComplete: (taskId: string) => void) => {
  const [activePomodoro, setActivePomodoro] = useState<ActivePomodoro | null>(null);
  const [timeLeft, setTimeLeft] = useState<number>(0);

  useEffect(() => {
    const storedPomodoro = localStorage.getItem(STORAGE_KEY);
    if (storedPomodoro) {
      const parsed = JSON.parse(storedPomodoro);
      setActivePomodoro(parsed);
      if (parsed.isRunning) {
        const elapsed = Date.now() - parsed.startTime - parsed.totalPausedTime;
        setTimeLeft(Math.max(0, POMODORO_DURATION - elapsed));
      }
    }
  }, []);

  useEffect(() => {
    if (activePomodoro) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(activePomodoro));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, [activePomodoro]);

  useEffect(() => {
    let timer: number;
    if (activePomodoro?.isRunning) {
      timer = window.setInterval(() => {
        const elapsed = Date.now() - activePomodoro.startTime - activePomodoro.totalPausedTime;
        const remaining = Math.max(0, POMODORO_DURATION - elapsed);
        setTimeLeft(remaining);

        if (remaining === 0) {
          onPomodoroComplete(activePomodoro.taskId);
          setActivePomodoro(null);
        }
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [activePomodoro, onPomodoroComplete]);

  const startPomodoro = useCallback((taskId: string) => {
    setActivePomodoro({
      taskId,
      startTime: Date.now(),
      totalPausedTime: 0,
      isRunning: true
    });
    setTimeLeft(POMODORO_DURATION);
  }, []);

  const pausePomodoro = useCallback(() => {
    if (activePomodoro?.isRunning) {
      setActivePomodoro(prev => prev ? {
        ...prev,
        isRunning: false,
        pausedTime: Date.now()
      } : null);
    }
  }, [activePomodoro]);

  const resumePomodoro = useCallback(() => {
    if (activePomodoro && !activePomodoro.isRunning && activePomodoro.pausedTime) {
      const additionalPausedTime = Date.now() - activePomodoro.pausedTime;
      setActivePomodoro(prev => prev ? {
        ...prev,
        isRunning: true,
        pausedTime: undefined,
        totalPausedTime: prev.totalPausedTime + additionalPausedTime
      } : null);
    }
  }, [activePomodoro]);

  const stopPomodoro = useCallback(() => {
    setActivePomodoro(null);
    setTimeLeft(0);
  }, []);

  return {
    activePomodoro,
    timeLeft,
    startPomodoro,
    pausePomodoro,
    resumePomodoro,
    stopPomodoro
  };
};