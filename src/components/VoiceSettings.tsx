import React from 'react';
import {
  Sliders,
  Gauge,
  Music2,
  Volume2,
  Sparkles,
  Radio,
  Wind,
  RotateCcw,
} from 'lucide-react';

interface VoiceSettingsProps {
  speed: number;
  setSpeed: (val: number) => void;
  pitch: number;
  setPitch: (val: number) => void;
  volume: number;
  setVolume: (val: number) => void;
  clarity: number;
  setClarity: (val: number) => void;
  closeMicEffect: boolean;
  setCloseMicEffect: (val: boolean) => void;
  addBreathing: boolean;
  setAddBreathing: (val: boolean) => void;
  onReset: () => void;
}

export const VoiceSettings: React.FC<VoiceSettingsProps> = ({
  speed,
  setSpeed,
  pitch,
  setPitch,
  volume,
  setVolume,
  clarity,
  setClarity,
  closeMicEffect,
  setCloseMicEffect,
  addBreathing,
  setAddBreathing,
  onReset,
}) => {
  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <Sliders className="w-4 h-4 text-purple-600 dark:text-purple-400" />
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">
            Acoustic & Persona Settings
          </h3>
        </div>
        <button
          type="button"
          onClick={onReset}
          className="flex items-center gap-1 text-xs text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition-colors"
          title="Reset to default acoustic values"
        >
          <RotateCcw className="w-3 h-3" />
          <span>Reset Defaults</span>
        </button>
      </div>

      {/* Special Feature 1: Close-Mic WhatsApp Voice Note Effect */}
      <div className="p-4 rounded-xl border border-purple-200 dark:border-purple-800/60 bg-gradient-to-r from-purple-500/5 via-indigo-500/5 to-transparent flex items-start justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Radio className="w-4 h-4 text-purple-600 dark:text-purple-400 animate-pulse" />
            <span className="text-xs font-bold text-slate-900 dark:text-white">
              Close-Microphone / Voice Message Effect
            </span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 font-semibold text-[10px]">
              Recommended
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            Renders speech as if recorded directly into a phone microphone (like a WhatsApp or Telegram voice message), producing an intimate, warm tone with zero artificial studio reverb.
          </p>
        </div>

        <label className="relative inline-flex items-center cursor-pointer shrink-0 mt-1">
          <input
            type="checkbox"
            checked={closeMicEffect}
            onChange={e => setCloseMicEffect(e.target.checked)}
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
        </label>
      </div>

      {/* Special Feature 2: Natural Breathing & Micro-Pauses */}
      <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 flex items-start justify-between gap-4">
        <div className="space-y-0.5">
          <div className="flex items-center gap-2">
            <Wind className="w-4 h-4 text-indigo-500" />
            <span className="text-xs font-bold text-slate-900 dark:text-white">
              Organic Breathing & Realistic Pauses
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Injects subtle natural human breath sounds before key phrases and lifelike conversational cadences.
          </p>
        </div>

        <label className="relative inline-flex items-center cursor-pointer shrink-0 mt-0.5">
          <input
            type="checkbox"
            checked={addBreathing}
            onChange={e => setAddBreathing(e.target.checked)}
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
        </label>
      </div>

      {/* 4 Core Sliders */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-1">
        {/* Speed */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold">
            <span className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300">
              <Gauge className="w-3.5 h-3.5 text-purple-500" />
              Speaking Speed
            </span>
            <span className="font-mono text-purple-600 dark:text-purple-400 tabular-nums">
              {speed.toFixed(2)}x
            </span>
          </div>
          <input
            type="range"
            min="0.5"
            max="1.75"
            step="0.05"
            value={speed}
            onChange={e => setSpeed(parseFloat(e.target.value))}
            className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-purple-600"
          />
          <div className="flex justify-between text-[11px] text-slate-400 dark:text-slate-500">
            <span>Slow (0.5x)</span>
            <span>Normal (1.0x)</span>
            <span>Fast (1.75x)</span>
          </div>
        </div>

        {/* Pitch */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold">
            <span className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300">
              <Music2 className="w-3.5 h-3.5 text-blue-500" />
              Voice Pitch
            </span>
            <span className="font-mono text-blue-600 dark:text-blue-400 tabular-nums">
              {pitch > 0 ? `+${pitch}` : pitch} semitones
            </span>
          </div>
          <input
            type="range"
            min="-6"
            max="6"
            step="1"
            value={pitch}
            onChange={e => setPitch(parseInt(e.target.value, 10))}
            className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
          />
          <div className="flex justify-between text-[11px] text-slate-400 dark:text-slate-500">
            <span>Deeper (-6)</span>
            <span>Neutral (0)</span>
            <span>Higher (+6)</span>
          </div>
        </div>

        {/* Volume */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold">
            <span className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300">
              <Volume2 className="w-3.5 h-3.5 text-emerald-500" />
              Master Volume
            </span>
            <span className="font-mono text-emerald-600 dark:text-emerald-400 tabular-nums">
              {volume}%
            </span>
          </div>
          <input
            type="range"
            min="20"
            max="100"
            step="5"
            value={volume}
            onChange={e => setVolume(parseInt(e.target.value, 10))}
            className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-600"
          />
          <div className="flex justify-between text-[11px] text-slate-400 dark:text-slate-500">
            <span>Soft (20%)</span>
            <span>Balanced (80%)</span>
            <span>Full (100%)</span>
          </div>
        </div>

        {/* Voice Clarity / Atmosphere */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold">
            <span className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              Presence & Clarity
            </span>
            <span className="font-mono text-amber-600 dark:text-amber-400 tabular-nums">
              {clarity}%
            </span>
          </div>
          <input
            type="range"
            min="10"
            max="100"
            step="5"
            value={clarity}
            onChange={e => setClarity(parseInt(e.target.value, 10))}
            className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-amber-600"
          />
          <div className="flex justify-between text-[11px] text-slate-400 dark:text-slate-500">
            <span>Warm & Intimate</span>
            <span>Balanced</span>
            <span>Crisp Studio</span>
          </div>
        </div>
      </div>
    </div>
  );
};
