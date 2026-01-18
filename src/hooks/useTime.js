import { useState, useEffect } from 'react';

export const useTime = () => {
  const [time, setTime] = useState({ clock: '00:00', date: '--' });

  useEffect(() => {
    const update = () => {
      const now = new Date();
      setTime({
        clock: now.toLocaleTimeString('en-AU', { hour: '2-digit', minute: '2-digit' }),
        date: now.toLocaleDateString('en-AU', { weekday: 'long', day: 'numeric', month: 'long' })
      });
    };
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, []);

  return time;
};