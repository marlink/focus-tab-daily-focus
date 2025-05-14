
import { useState } from 'react';
import { useTasks } from '@/contexts/TaskContext';
import { Task } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Check, ArrowUp, ArrowDown, Trash } from 'lucide-react';
import { cn } from '@/lib/utils';

const TaskItem = ({ task }: { task: Task }) => {
  const { toggleComplete, removeTask, markAsPriority, moveTaskUp, moveTaskDown } = useTasks();

  return (
    <div 
      className={cn(
        "group flex items-center justify-between p-3 mb-2 rounded-md transition-all duration-200",
        "bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200 dark:border-gray-700",
        task.completed && "opacity-60"
      )}
    >
      <div className="flex items-center gap-3 flex-1">
        <button
          onClick={() => toggleComplete(task.id)}
          className={cn(
            "w-5 h-5 rounded-full flex items-center justify-center border transition-colors",
            task.completed 
              ? "bg-focusBlue border-focusBlue text-white" 
              : "border-gray-400 dark:border-gray-500 hover:border-focusBlue dark:hover:border-focusBlue"
          )}
        >
          {task.completed && <Check size={12} className="text-white" />}
        </button>
        
        <span 
          className={cn(
            "flex-1 text-left text-sm md:text-base transition-all",
            task.completed && "line-through text-gray-500 dark:text-gray-400"
          )}
        >
          {task.text}
        </span>
      </div>
      
      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-7 w-7"
          onClick={() => moveTaskUp(task.id)}
        >
          <ArrowUp size={16} />
        </Button>
        
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-7 w-7"
          onClick={() => moveTaskDown(task.id)}
        >
          <ArrowDown size={16} />
        </Button>
        
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-7 w-7 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30"
          onClick={() => removeTask(task.id)}
        >
          <Trash size={16} />
        </Button>
      </div>
      
      {!task.isPriority && (
        <Button
          variant="outline"
          size="sm"
          className="ml-2 text-xs bg-transparent hover:bg-focusBlue hover:text-white border-focusBlue text-focusBlue"
          onClick={() => markAsPriority(task.id)}
        >
          Set Focus
        </Button>
      )}
      
      {task.isPriority && (
        <span className="ml-2 px-2 py-1 text-xs bg-focusBlue/10 text-focusBlue rounded-md border border-focusBlue/20">
          Focus Task
        </span>
      )}
    </div>
  );
};

const TaskList = () => {
  const { tasks, addTask, clearAllTasks } = useTasks();
  const [newTaskText, setNewTaskText] = useState('');

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTaskText.trim()) {
      addTask(newTaskText.trim());
      setNewTaskText('');
    }
  };

  return (
    <div className="glass-panel p-6 w-full max-w-md animate-slide-up">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-800 dark:text-white">Today's Focus</h1>
        {tasks.length > 0 && (
          <Button 
            variant="outline" 
            size="sm"
            onClick={clearAllTasks}
            className="text-xs"
          >
            Clear All
          </Button>
        )}
      </div>
      
      <form onSubmit={handleAddTask} className="mb-6 flex gap-2">
        <Input
          type="text"
          placeholder="Add a new task (max 5)"
          value={newTaskText}
          onChange={(e) => setNewTaskText(e.target.value)}
          className="bg-white/70 dark:bg-gray-800/70"
          maxLength={100}
          disabled={tasks.length >= 5}
        />
        <Button 
          type="submit" 
          disabled={!newTaskText.trim() || tasks.length >= 5}
        >
          Add
        </Button>
      </form>
      
      <div className="space-y-2">
        {tasks.length === 0 ? (
          <p className="text-center text-gray-500 dark:text-gray-400 py-4">
            No tasks yet. Add up to 5 tasks for today.
          </p>
        ) : (
          tasks.map(task => <TaskItem key={task.id} task={task} />)
        )}
      </div>
    </div>
  );
};

export default TaskList;
