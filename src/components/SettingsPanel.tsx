
import { useState } from 'react';
import { useSettings } from '@/contexts/SettingsContext';
import { Button } from '@/components/ui/button';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Settings } from 'lucide-react';

const SettingsPanel = () => {
  const { settings, updateSettings, resetSettings } = useSettings();
  const [isOpen, setIsOpen] = useState(false);
  const [tempSettings, setTempSettings] = useState(settings);

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (open) {
      setTempSettings(settings);
    }
  };

  const handleSave = () => {
    updateSettings(tempSettings);
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="fixed bottom-6 right-6 rounded-full h-10 w-10 glass-panel z-20"
        >
          <Settings size={20} />
        </Button>
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Settings</DialogTitle>
        </DialogHeader>

        <div className="grid gap-6 py-4">
          {/* Theme */}
          <div className="space-y-2">
            <Label>Theme</Label>
            <RadioGroup
              value={tempSettings.theme}
              onValueChange={(value) => 
                setTempSettings(prev => ({ ...prev, theme: value as 'light' | 'dark' | 'system' }))
              }
              className="flex space-x-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="light" id="theme-light" />
                <Label htmlFor="theme-light">Light</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="dark" id="theme-dark" />
                <Label htmlFor="theme-dark">Dark</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="system" id="theme-system" />
                <Label htmlFor="theme-system">System</Label>
              </div>
            </RadioGroup>
          </div>

          {/* Background Mode */}
          <div className="space-y-2">
            <Label>Background</Label>
            <RadioGroup
              value={tempSettings.backgroundMode}
              onValueChange={(value) => 
                setTempSettings(prev => ({ ...prev, backgroundMode: value as 'image' | 'color' }))
              }
              className="flex space-x-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="image" id="bg-image" />
                <Label htmlFor="bg-image">Image</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="color" id="bg-color" />
                <Label htmlFor="bg-color">Solid Color</Label>
              </div>
            </RadioGroup>
          </div>

          {/* Background Color */}
          {tempSettings.backgroundMode === 'color' && (
            <div className="space-y-2">
              <Label htmlFor="bg-color-picker">Background Color</Label>
              <div className="flex items-center gap-3">
                <Input 
                  id="bg-color-picker"
                  type="color"
                  value={tempSettings.backgroundColor}
                  onChange={(e) => 
                    setTempSettings(prev => ({ ...prev, backgroundColor: e.target.value }))
                  }
                  className="w-16 h-8 p-0 overflow-hidden border"
                />
                <Input 
                  type="text"
                  value={tempSettings.backgroundColor}
                  onChange={(e) => 
                    setTempSettings(prev => ({ ...prev, backgroundColor: e.target.value }))
                  }
                  placeholder="#RRGGBB"
                  className="flex-1"
                />
              </div>
            </div>
          )}

          {/* Show Clock */}
          <div className="flex items-center justify-between">
            <Label htmlFor="show-clock">Show Clock</Label>
            <Switch 
              id="show-clock"
              checked={tempSettings.showClock}
              onCheckedChange={(checked) => 
                setTempSettings(prev => ({ ...prev, showClock: checked }))
              }
            />
          </div>

          {/* Task Position */}
          <div className="space-y-2">
            <Label>Task Position</Label>
            <RadioGroup
              value={tempSettings.taskPosition}
              onValueChange={(value) => 
                setTempSettings(prev => ({ 
                  ...prev, 
                  taskPosition: value as 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' 
                }))
              }
              className="grid grid-cols-2 gap-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="top-left" id="pos-tl" />
                <Label htmlFor="pos-tl">Top Left</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="top-right" id="pos-tr" />
                <Label htmlFor="pos-tr">Top Right</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="bottom-left" id="pos-bl" />
                <Label htmlFor="pos-bl">Bottom Left</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="bottom-right" id="pos-br" />
                <Label htmlFor="pos-br">Bottom Right</Label>
              </div>
            </RadioGroup>
          </div>

          {/* Font Size */}
          <div className="space-y-2">
            <Label>Font Size</Label>
            <RadioGroup
              value={tempSettings.fontSize}
              onValueChange={(value) => 
                setTempSettings(prev => ({ ...prev, fontSize: value as 'small' | 'medium' | 'large' }))
              }
              className="flex space-x-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="small" id="font-sm" />
                <Label htmlFor="font-sm">Small</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="medium" id="font-md" />
                <Label htmlFor="font-md">Medium</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="large" id="font-lg" />
                <Label htmlFor="font-lg">Large</Label>
              </div>
            </RadioGroup>
          </div>

          {/* Reminder Time */}
          <div className="space-y-2">
            <Label htmlFor="reminder-time">Daily Reminder</Label>
            <Input 
              id="reminder-time"
              type="time"
              value={tempSettings.reminderTime || ''}
              onChange={(e) => 
                setTempSettings(prev => ({ ...prev, reminderTime: e.target.value || null }))
              }
              className="w-full"
            />
            <p className="text-xs text-muted-foreground">
              Set a daily time to be reminded of your focus tasks.
            </p>
          </div>
        </div>

        <DialogFooter className="sm:justify-between">
          <Button 
            variant="outline" 
            onClick={resetSettings}
            type="button"
          >
            Reset Defaults
          </Button>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              onClick={() => setIsOpen(false)}
              type="button"
            >
              Cancel
            </Button>
            <Button onClick={handleSave} type="button">Save</Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SettingsPanel;
