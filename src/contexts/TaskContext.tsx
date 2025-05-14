import { createContext, useContext, useState, useEffect } from 'react';
import { Task } from '../lib/types';
import { toast } from '@/components/ui/use-toast';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';

interface TaskContextType {
  tasks: Task[];
  addTask: (text: string) => void;
  removeTask: (id: string) => void;
  toggleComplete: (id: string) => void;
  markAsPriority: (id: string) => void; // Renamed from setPriorityTask to avoid conflict
  moveTaskUp: (id: string) => void;
  moveTaskDown: (id: string) => void;
  clearAllTasks: () => void;
  priorityTask: Task | null;
}

const MAX_TASKS = 5;

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export const TaskProvider = ({ children }: { children: React.ReactNode }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [priorityTask, setPriorityTask] = useState<Task | null>(null);
  const [showNotificationDialog, setShowNotificationDialog] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [reminderInterval, setReminderInterval] = useState<string>('off');

  // Load tasks from local storage on initial load
  useEffect(() => {
    const savedTasks = localStorage.getItem('focustab-tasks');
    if (savedTasks) {
      const parsedTasks = JSON.parse(savedTasks);
      setTasks(parsedTasks);

      // Find priority task if it exists
      const priority = parsedTasks.find((task: Task) => task.isPriority);
      setPriorityTask(priority || null);
    }
  }, []);

  // Save tasks to local storage when they change
  useEffect(() => {
    localStorage.setItem('focustab-tasks', JSON.stringify(tasks));
    
    // Update priority task when tasks change
    const priority = tasks.find(task => task.isPriority);
    setPriorityTask(priority || null);
  }, [tasks]);

  // Check if a day has passed to clear tasks (at midnight)
  useEffect(() => {
    const checkDate = () => {
      const lastUpdate = localStorage.getItem('focustab-last-update');
      const today = new Date().toDateString();
      
      if (lastUpdate && lastUpdate !== today) {
        // Clear tasks at midnight
        clearAllTasks();
        toast({
          title: "Good morning!",
          description: "Your tasks have been cleared for a fresh start.",
        });
      }
      
      localStorage.setItem('focustab-last-update', today);
    };
    
    // Check on load
    checkDate();
    
    // Set up a timer to check every minute
    const interval = setInterval(checkDate, 60000);
    return () => clearInterval(interval);
  }, []);

  const addTask = (text: string) => {
    if (tasks.length >= MAX_TASKS) {
      toast({
        title: "Maximum tasks reached",
        description: `You can only have ${MAX_TASKS} tasks. Complete or remove a task first.`,
        variant: "destructive",
      });
      return;
    }
    
    const newTask: Task = {
      id: Date.now().toString(),
      text,
      completed: false,
      isPriority: tasks.length === 0, // First task is priority by default
    };
    
    setTasks(prev => [...prev, newTask]);
    
    if (tasks.length === 0) {
      setPriorityTask(newTask);
    }
  };

  const removeTask = (id: string) => {
    const taskToRemove = tasks.find(task => task.id === id);
    setTasks(prev => prev.filter(task => task.id !== id));
    
    if (taskToRemove?.isPriority && tasks.length > 1) {
      // If we removed priority task, make the first remaining task the priority
      const newTasks = tasks.filter(task => task.id !== id);
      const newPriorityTask = { ...newTasks[0], isPriority: true };
      
      setTasks(prev => 
        prev.map(task => 
          task.id === newPriorityTask.id 
            ? newPriorityTask 
            : task
        )
      );
    }
  };

  const toggleComplete = (id: string) => {
    setTasks(prev => 
      prev.map(task => 
        task.id === id 
          ? { ...task, completed: !task.completed } 
          : task
      )
    );
  };

  const markAsPriority = (id: string) => { // Renamed from setPriorityTask
    setSelectedTaskId(id);
    setShowNotificationDialog(true);
  };
  
  const confirmPriority = () => {
    if (!selectedTaskId) return;
    
    setTasks(prev => 
      prev.map(task => ({
        ...task,
        isPriority: task.id === selectedTaskId
      }))
    );
    
    // Update settings with new reminder interval
    if (reminderInterval !== 'off') {
      const settingsString = localStorage.getItem('focustab-settings');
      if (settingsString) {
        const settings = JSON.parse(settingsString);
        settings.reminderInterval = reminderInterval;
        localStorage.setItem('focustab-settings', JSON.stringify(settings));
      }
      
      toast({
        title: "Focus Task Set",
        description: `Reminders set for every ${reminderInterval} minutes`,
        duration: 3000,
      });
    }
    
    // Close dialog and reset state
    setShowNotificationDialog(false);
    setSelectedTaskId(null);
  };

  const cancelPriority = () => {
    setShowNotificationDialog(false);
    setSelectedTaskId(null);
  };

  const moveTaskUp = (id: string) => {
    const index = tasks.findIndex(task => task.id === id);
    if (index > 0) {
      const newTasks = [...tasks];
      [newTasks[index], newTasks[index - 1]] = [newTasks[index - 1], newTasks[index]];
      setTasks(newTasks);
    }
  };

  const moveTaskDown = (id: string) => {
    const index = tasks.findIndex(task => task.id === id);
    if (index < tasks.length - 1) {
      const newTasks = [...tasks];
      [newTasks[index], newTasks[index + 1]] = [newTasks[index + 1], newTasks[index]];
      setTasks(newTasks);
    }
  };

  const clearAllTasks = () => {
    setTasks([]);
    setPriorityTask(null);
  };

  return (
    <TaskContext.Provider value={{
      tasks,
      addTask,
      removeTask,
      toggleComplete,
      markAsPriority, // Renamed from setPriorityTask
      moveTaskUp,
      moveTaskDown,
      clearAllTasks,
      priorityTask
    }}>
      {children}
      
      <Dialog open={showNotificationDialog} onOpenChange={setShowNotificationDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Set Reminder Frequency</DialogTitle>
          </DialogHeader>
          
          <div className="py-4 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="reminder-interval">How often would you like to be reminded?</Label>
              <Select
                value={reminderInterval}
                onValueChange={setReminderInterval}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Choose reminder frequency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="off">No reminders</SelectItem>
                  <SelectItem value="2">Every 2 minutes</SelectItem>
                  <SelectItem value="5">Every 5 minutes</SelectItem>
                  <SelectItem value="10">Every 10 minutes</SelectItem>
                  <SelectItem value="15">Every 15 minutes</SelectItem>
                  <SelectItem value="20">Every 20 minutes</SelectItem>
                  <SelectItem value="30">Every 30 minutes</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={cancelPriority}>Cancel</Button>
            <Button onClick={confirmPriority}>Set Focus</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </TaskContext.Provider>
  );
};

export const useTasks = () => {
  const context = useContext(TaskContext);
  if (context === undefined) {
    throw new Error('useTasks must be used within a TaskProvider');
  }
  return context;
};
