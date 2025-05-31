
import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface TickerSettings {
  textColor: string;
  backgroundColor: string;
  borderColor: string;
  textSize: string;
  height: string;
  speed: number;
  position: 'header' | 'footer';
}

interface TickerCustomizerProps {
  settings: TickerSettings;
  onSettingsChange: (settings: TickerSettings) => void;
}

const TickerCustomizer: React.FC<TickerCustomizerProps> = ({
  settings,
  onSettingsChange
}) => {
  const handleChange = (key: keyof TickerSettings, value: string | number) => {
    onSettingsChange({
      ...settings,
      [key]: value
    });
  };

  const resetToDefaults = () => {
    onSettingsChange({
      textColor: '#ffffff',
      backgroundColor: '#ff6b35',
      borderColor: '#e55a2b',
      textSize: '14px',
      height: '48px',
      speed: 10,
      position: 'header'
    });
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Ticker Customization</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">Text Color</label>
          <div className="flex gap-2">
            <Input
              type="color"
              value={settings.textColor}
              onChange={(e) => handleChange('textColor', e.target.value)}
              className="w-16 h-10 p-1"
            />
            <Input
              type="text"
              value={settings.textColor}
              onChange={(e) => handleChange('textColor', e.target.value)}
              placeholder="#ffffff"
              className="flex-1"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Background Color</label>
          <div className="flex gap-2">
            <Input
              type="color"
              value={settings.backgroundColor}
              onChange={(e) => handleChange('backgroundColor', e.target.value)}
              className="w-16 h-10 p-1"
            />
            <Input
              type="text"
              value={settings.backgroundColor}
              onChange={(e) => handleChange('backgroundColor', e.target.value)}
              placeholder="#ff6b35"
              className="flex-1"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Border Color</label>
          <div className="flex gap-2">
            <Input
              type="color"
              value={settings.borderColor}
              onChange={(e) => handleChange('borderColor', e.target.value)}
              className="w-16 h-10 p-1"
            />
            <Input
              type="text"
              value={settings.borderColor}
              onChange={(e) => handleChange('borderColor', e.target.value)}
              placeholder="#e55a2b"
              className="flex-1"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Text Size</label>
          <Input
            type="text"
            value={settings.textSize}
            onChange={(e) => handleChange('textSize', e.target.value)}
            placeholder="14px"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Bar Height</label>
          <Input
            type="text"
            value={settings.height}
            onChange={(e) => handleChange('height', e.target.value)}
            placeholder="48px"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Animation Speed</label>
          <Input
            type="number"
            value={settings.speed}
            onChange={(e) => handleChange('speed', parseInt(e.target.value))}
            min="10"
            max="200"
            step="10"
          />
          <p className="text-xs text-gray-500 mt-1">Higher = faster scrolling</p>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Position</label>
          <select
            value={settings.position}
            onChange={(e) => handleChange('position', e.target.value as 'header' | 'footer')}
            className="w-full p-2 border rounded-md"
          >
            <option value="header">Below Header</option>
            <option value="footer">Above Footer</option>
          </select>
        </div>

        <Button onClick={resetToDefaults} variant="outline" className="w-full">
          Reset to Defaults
        </Button>
      </CardContent>
    </Card>
  );
};

export default TickerCustomizer;
