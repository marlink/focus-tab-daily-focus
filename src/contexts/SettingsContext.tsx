
import { createContext, useContext, useState, useEffect } from 'react';
import { Settings } from '../lib/types';

interface SettingsContextType {
  settings: Settings;
  updateSettings: (newSettings: Partial<Settings>) => void;
  resetSettings: () => void;
}

const defaultSettings: Settings = {
  theme: 'system',
  backgroundMode: 'image',
  backgroundColor: '#f1f0fb',
  showClock: true,
  taskPosition: 'top-right',
  fontSize: 'medium',
  reminderTime: null
};

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider = ({ children }: { children: React.ReactNode }) => {
  const [settings, setSettings] = useState<Settings>(defaultSettings);

  // Load settings from local storage on initial load
  useEffect(() => {
    const savedSettings = localStorage.getItem('focustab-settings');
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    } else {
      // Set theme based on system preference if no saved settings
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      updateSettings({ theme: prefersDark ? 'dark' : 'light' });
    }
  }, []);

  // Apply theme when it changes
  useEffect(() => {
    const applyTheme = () => {
      const { theme } = settings;
      
      if (theme === 'system') {
        const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        document.documentElement.classList.toggle('dark', systemPrefersDark);
      } else {
        document.documentElement.classList.toggle('dark', theme === 'dark');
      }
    };

    applyTheme();

    // Listen for system theme changes if using system preference
    if (settings.theme === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handleChange = () => applyTheme();
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
  }, [settings.theme]);

  const updateSettings = (newSettings: Partial<Settings>) => {
    setSettings(prev => {
      const updated = { ...prev, ...newSettings };
      localStorage.setItem('focustab-settings', JSON.stringify(updated));
      return updated;
    });
  };

  const resetSettings = () => {
    setSettings(defaultSettings);
    localStorage.setItem('focustab-settings', JSON.stringify(defaultSettings));
  };

  return (
    <SettingsContext.Provider value={{ settings, updateSettings, resetSettings }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};
