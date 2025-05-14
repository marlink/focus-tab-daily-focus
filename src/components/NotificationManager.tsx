
import { useEffect, useRef } from 'react';
import { useSettings } from '@/contexts/SettingsContext';
import { useTasks } from '@/contexts/TaskContext';
import { useToast } from '@/hooks/use-toast';
import { BellRing } from 'lucide-react';

const NotificationManager = () => {
  const { settings } = useSettings();
  const { tasks } = useTasks();
  const { toast } = useToast();
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  
  // Clear existing timer when component unmounts or settings change
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, []);

  // Set up daily reminder
  useEffect(() => {
    const checkDailyReminder = () => {
      if (settings.reminderTime) {
        const now = new Date();
        const [hours, minutes] = settings.reminderTime.split(':').map(Number);
        
        const reminderDate = new Date();
        reminderDate.setHours(hours, minutes, 0, 0);
        
        // If the reminder time is within the last minute
        const diffMs = Math.abs(now.getTime() - reminderDate.getTime());
        if (diffMs < 60000) { 
          const priorityTask = tasks.find(task => task.isPriority);
          
          toast({
            title: "Daily Reminder",
            description: priorityTask 
              ? `Focus on: ${priorityTask.text}`
              : "Set your priority task for today",
            duration: 5000,
          });
        }
      }
    };

    // Check once on mount and then every minute
    checkDailyReminder();
    const dailyInterval = setInterval(checkDailyReminder, 60000);
    
    return () => clearInterval(dailyInterval);
  }, [settings.reminderTime, tasks, toast]);

  // Set up recurring reminders
  useEffect(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    
    if (settings.reminderInterval !== 'off') {
      const intervalMinutes = parseInt(settings.reminderInterval, 10);
      const intervalMs = intervalMinutes * 60 * 1000;
      
      timerRef.current = setInterval(() => {
        const priorityTask = tasks.find(task => task.isPriority);
        if (priorityTask) {
          toast({
            title: "Focus Reminder",
            description: `Focus on: ${priorityTask.text}`,
            duration: 5000,
            icon: <BellRing className="h-4 w-4" />,
          });
        }
      }, intervalMs);
    }
    
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [settings.reminderInterval, tasks, toast]);

  // This is a notification manager that doesn't render anything
  return null;
};

export default NotificationManager;
