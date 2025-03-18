import React from 'react';
import { Moon, Sun } from 'lucide-react';
import { ThemeSettings } from '../types';

interface ThemeToggleProps {
  settings: ThemeSettings;
  onToggle: (newSettings: ThemeSettings) => void;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ settings, onToggle }) => {
  const toggleTheme = () => {
    onToggle({
      ...settings,
      theme: settings.theme === 'light' ? 'dark' : 'light'
    });
  };

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
      aria-label="Toggle theme"
    >
      {settings.theme === 'light' ? (
        <Moon size={20} className="text-gray-800" />
      ) : (
        <Sun size={20} className="text-yellow-400" />
      )}
    </button>
  );
};