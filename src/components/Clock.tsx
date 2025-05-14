
import { useState, useEffect } from 'react';
import { useSettings } from '@/contexts/SettingsContext';

const Clock = () => {
  const [time, setTime] = useState(new Date());
  const { settings } = useSettings();

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  if (!settings.showClock) return null;

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit', 
      hour12: true 
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString([], { 
      weekday: 'long', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  return (
    <div className="fixed top-6 left-1/2 transform -translate-x-1/2 text-center z-20 animate-fade-in">
      <div className="glass-panel px-6 py-3">
        <div className="text-4xl font-light text-gray-800 dark:text-white">
          {formatTime(time)}
        </div>
        <div className="text-sm text-gray-600 dark:text-gray-300 mt-1">
          {formatDate(time)}
        </div>
      </div>
    </div>
  );
};

export default Clock;
