
import { createContext, useContext, useState, useEffect } from 'react';
import { Task } from '../lib/types';
import { toast } from '@/components/ui/use-toast';

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
    setTasks(prev => 
      prev.map(task => ({
        ...task,
        isPriority: task.id === id
      }))
    );
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
