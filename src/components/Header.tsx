import React from 'react';
import { Sparkles, Moon, Sun, Mic, ShieldCheck, Info } from 'lucide-react';

interface HeaderProps {
  darkMode: boolean;
  setDarkMode: (val: boolean) => void;
  activeTab: 'generator' | 'presets' | 'history' | 'about';
  setActiveTab: (tab: 'generator' | 'presets' | 'history' | 'about') => void;
  historyCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  darkMode,
  setDarkMode,
  activeTab,
  setActiveTab,
  historyCount,
}) => {
  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-950/90 backdrop-blur-md transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Brand title wordmark */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-blue-500 flex items-center justify-center shadow-md shadow-purple-500/20 text-white">
            <Mic className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-purple-600 via-indigo-500 to-blue-500 bg-clip-text text-transparent">
              VoiceCraft AI
            </span>
          </div>
        </div>

        {/* Zone 2: Navigation links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600 dark:text-slate-300">
          <button
            onClick={() => setActiveTab('generator')}
            className={`transition-colors whitespace-nowrap shrink-0 hover:text-purple-600 dark:hover:text-purple-400 ${
              activeTab === 'generator'
                ? 'text-purple-600 dark:text-purple-400 font-semibold'
                : ''
            }`}
          >
            Studio Generator
          </button>
          <button
            onClick={() => setActiveTab('presets')}
            className={`transition-colors whitespace-nowrap shrink-0 hover:text-purple-600 dark:hover:text-purple-400 ${
              activeTab === 'presets'
                ? 'text-purple-600 dark:text-purple-400 font-semibold'
                : ''
            }`}
          >
            Voice Personas
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0 hover:text-purple-600 dark:hover:text-purple-400 ${
              activeTab === 'history'
                ? 'text-purple-600 dark:text-purple-400 font-semibold'
                : ''
            }`}
          >
            History
            {historyCount > 0 && (
              <span className="text-xs px-1.5 py-0.2 rounded-full bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300 font-mono">
                {historyCount}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('about')}
            className={`transition-colors whitespace-nowrap shrink-0 hover:text-purple-600 dark:hover:text-purple-400 ${
              activeTab === 'about'
                ? 'text-purple-600 dark:text-purple-400 font-semibold'
                : ''
            }`}
          >
            Close-Mic Guide
          </button>
        </nav>

        {/* Zone 3: Primary action & theme switch */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => setDarkMode(!darkMode)}
            aria-label="Toggle color theme"
            className="p-2 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors"
          >
            {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
          </button>

          <button
            onClick={() => setActiveTab('generator')}
            className="px-4 py-2 text-xs font-semibold text-white bg-gradient-to-r from-purple-600 to-indigo-600 rounded-lg hover:from-purple-500 hover:to-indigo-500 shadow-sm transition-all whitespace-nowrap shrink-0"
          >
            Create Speech
          </button>
        </div>
      </div>
    </header>
  );
};
