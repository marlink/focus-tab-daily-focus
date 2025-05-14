
import { useTasks } from '@/contexts/TaskContext';
import { useSettings } from '@/contexts/SettingsContext';
import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';

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

  return (
    <div 
      className={cn(
        "fixed z-30 glass-panel px-4 py-2 shadow-lg animate-fade-in",
        positionClasses[settings.taskPosition]
      )}
    >
      <div className="flex items-center gap-3">
        <button
          onClick={() => toggleComplete(priorityTask.id)}
          className={cn(
            "w-5 h-5 rounded-full flex items-center justify-center border flex-shrink-0 transition-colors",
            priorityTask.completed 
              ? "bg-focusBlue border-focusBlue text-white" 
              : "border-gray-500 hover:border-focusBlue"
          )}
        >
          {priorityTask.completed && <Check size={12} className="text-white" />}
        </button>
        
        <span 
          className={cn(
            "font-medium text-gray-800 dark:text-white transition-all",
            fontSizeClasses[settings.fontSize],
            priorityTask.completed && "line-through text-gray-500 dark:text-gray-400"
          )}
        >
          {priorityTask.text}
        </span>
      </div>
    </div>
  );
};

export default PriorityTask;
