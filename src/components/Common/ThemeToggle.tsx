"use client";
import React from 'react';
import { useTheme } from 'next-themes';
import Icons from './Icons';

export default function ThemeToggle() {
  const { setTheme, theme } = useTheme();

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <button onClick={toggleTheme} className="btn">
      {theme === 'dark' ? (
        <div className="flex items-center">
          <Icons.SunMedium className="h-5 w-5 text-orange-500" />
        </div>
      ) : (
        <div className="flex items-center">
          <Icons.Moon className="h-5 w-5 text-blue-500" />
        </div>
      )}
    </button>
  );
}
