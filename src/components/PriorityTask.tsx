
import { useTasks } from '@/contexts/TaskContext';
import { useSettings } from '@/contexts/SettingsContext';
import { cn } from '@/lib/utils';
import { Check, Clock } from 'lucide-react';

const PriorityTask = () => {
  const { priorityTask, toggleComplete } = useTasks();
  const { settings } = useSettings();

  if (!priorityTask) return null;

  const positionClasses = {
    'top-right': 'top-6 right-6',
    'top-left': 'top-6 left-6',
    'bottom-right': 'bottom-6 right-6',
    'bottom-left': 'bottom-6 left-6',
  };

  const fontSizeClasses = {
    'small': 'text-sm',
    'medium': 'text-base',
    'large': 'text-lg',
  };

  const reminderText = settings.reminderInterval !== 'off' && settings.reminderInterval 
    ? `Reminding every ${settings.reminderInterval} minutes` 
    : '';

  return (
    <div 
      className={cn(
        "fixed z-30 glass-panel px-5 py-3 shadow-lg animate-fade-in transition-smooth",
        "border border-focusBlue/30", 
        !priorityTask.completed && "pulse-focus",
        positionClasses[settings.taskPosition]
      )}
    >
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-3">
          <button
            onClick={() => toggleComplete(priorityTask.id)}
            className={cn(
              "w-6 h-6 rounded-full flex items-center justify-center border-2 flex-shrink-0 transition-colors",
              priorityTask.completed 
                ? "bg-focusBlue border-focusBlue text-white" 
                : "border-focusBlue/70 hover:border-focusBlue hover:bg-focusBlue/10"
            )}
          >
            {priorityTask.completed && <Check size={14} className="text-white" />}
          </button>
          
          <span 
            className={cn(
              "font-semibold text-gray-800 dark:text-white transition-all",
              fontSizeClasses[settings.fontSize],
              priorityTask.completed && "line-through text-gray-500 dark:text-gray-400"
            )}
          >
            {priorityTask.text}
          </span>
        </div>
        
        {reminderText && (
          <div className="text-xs text-gray-600 dark:text-gray-400 flex items-center gap-1 ml-1 pl-8">
            <Clock size={12} />
            <span>{reminderText}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default PriorityTask;
