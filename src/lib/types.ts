
export interface Task {
  id: string;
  text: string;
  completed: boolean;
  isPriority: boolean;
}

export interface Settings {
  theme: 'light' | 'dark' | 'system';
  backgroundMode: 'image' | 'color';
  backgroundColor: string;
  showClock: boolean;
  taskPosition: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
  fontSize: 'small' | 'medium' | 'large';
  reminderTime: string | null;
}
