
import { TaskProvider } from '@/contexts/TaskContext';
import { SettingsProvider } from '@/contexts/SettingsContext';
import { useState } from 'react';
import Background from '@/components/Background';
import TaskList from '@/components/TaskList';
import PriorityTask from '@/components/PriorityTask';
import Clock from '@/components/Clock';
import SettingsPanel from '@/components/SettingsPanel';
import { Button } from '@/components/ui/button';
import { List, X } from 'lucide-react';
import { useSettings } from '@/contexts/SettingsContext';

const Dashboard = () => {
  const [showTaskList, setShowTaskList] = useState(false);
  const { settings } = useSettings();
  
  return (
    <div className="min-h-screen w-full overflow-hidden">
      <Background mode={settings.backgroundMode} colorTheme={settings.backgroundColor} />
      
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center">
        <Clock />
        
        <div 
          className={`transition-all duration-300 ease-in-out transform ${
            showTaskList ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'
          }`}
        >
          <TaskList />
        </div>
      </div>
      
      <PriorityTask />
      
      <Button
        variant="outline" 
        size="icon"
        onClick={() => setShowTaskList(!showTaskList)}
        className="fixed bottom-6 left-6 rounded-full h-10 w-10 glass-panel z-20"
      >
        {showTaskList ? (
          <X size={20} />
        ) : (
          <List size={20} />
        )}
      </Button>
      
      <SettingsPanel />
    </div>
  );
};

const Index = () => {
  return (
    <SettingsProvider>
      <TaskProvider>
        <Dashboard />
      </TaskProvider>
    </SettingsProvider>
  );
};

export default Index;
