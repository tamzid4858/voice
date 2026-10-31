import React from 'react';
import {
  User,
  Users,
  Sparkles,
  Volume2,
  Smile,
  Heart,
  Frown,
  Flame,
  Radio,
  BookOpen,
  Briefcase,
  Mic,
  Award,
  Coffee,
  MessageCircle,
  Play,
  Loader2,
} from 'lucide-react';
import { VoiceGender, VoiceAge, VoiceStyle } from '../types/tts';

interface VoiceSelectorProps {
  gender: VoiceGender;
  setGender: (g: VoiceGender) => void;
  age: VoiceAge;
  setAge: (a: VoiceAge) => void;
  style: VoiceStyle;
  setStyle: (s: VoiceStyle) => void;
  onPreviewVoice: () => void;
  isPreviewing: boolean;
}

const AGE_OPTIONS: { id: VoiceAge; label: string; desc: string }[] = [
  { id: 'child', label: 'Child', desc: 'Young, curious & bright' },
  { id: 'teen', label: 'Teenager', desc: 'Casual, relaxed cadence' },
  { id: 'young_adult', label: 'Young Adult', desc: 'Vibrant, clear & modern' },
  { id: 'adult', label: 'Middle-aged Adult', desc: 'Warm, grounded & natural' },
  { id: 'elderly', label: 'Elderly Voice', desc: 'Gentle, wise & steady' },
];

const STYLE_OPTIONS: {
  id: VoiceStyle;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  accent: string;
  desc: string;
}[] = [
  {
    id: 'natural',
    label: 'Normal / Natural',
    icon: Coffee,
    accent: 'text-emerald-500',
    desc: 'Conversational & authentic',
  },
  {
    id: 'professional',
    label: 'Professional',
    icon: Briefcase,
    accent: 'text-blue-500',
    desc: 'Clear, articulate & poised',
  },
  {
    id: 'friendly',
    label: 'Friendly',
    icon: Smile,
    accent: 'text-amber-500',
    desc: 'Warm & welcoming smile',
  },
  {
    id: 'storytelling',
    label: 'Storytelling',
    icon: BookOpen,
    accent: 'text-indigo-500',
    desc: 'Immersive & captivating',
  },
  {
    id: 'news',
    label: 'News Presenter',
    icon: Radio,
    accent: 'text-cyan-500',
    desc: 'Steady, broadcast-ready',
  },
  {
    id: 'narrator',
    label: 'Narrator',
    icon: Volume2,
    accent: 'text-teal-500',
    desc: 'Deep cinematic cadence',
  },
  {
    id: 'emotional',
    label: 'Emotional',
    icon: Heart,
    accent: 'text-pink-500',
    desc: 'Resonant & sensitive',
  },
  {
    id: 'sad',
    label: 'Sad / Tender',
    icon: Frown,
    accent: 'text-slate-400',
    desc: 'Soft melancholic sigh',
  },
  {
    id: 'happy',
    label: 'Happy / Joyful',
    icon: Sparkles,
    accent: 'text-yellow-500',
    desc: 'Upbeat & cheerful energy',
  },
  {
    id: 'angry',
    label: 'Angry / Intense',
    icon: Flame,
    accent: 'text-rose-500',
    desc: 'Firm conviction & drive',
  },
  {
    id: 'whispering',
    label: 'Whispering',
    icon: MessageCircle,
    accent: 'text-violet-400',
    desc: 'Intimate close whisper',
  },
  {
    id: 'motivational',
    label: 'Motivational',
    icon: Award,
    accent: 'text-orange-500',
    desc: 'Inspiring & uplifting power',
  },
];

export const VoiceSelector: React.FC<VoiceSelectorProps> = ({
  gender,
  setGender,
  age,
  setAge,
  style,
  setStyle,
  onPreviewVoice,
  isPreviewing,
}) => {
  return (
    <div className="space-y-6">
      {/* 1. Voice Gender Selection Cards */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            1. Select Voice Gender
          </label>
          <button
            type="button"
            onClick={onPreviewVoice}
            disabled={isPreviewing}
            className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-lg bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800 hover:bg-purple-100 dark:hover:bg-purple-900/50 transition-colors disabled:opacity-50"
          >
            {isPreviewing ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Auditioning...</span>
              </>
            ) : (
              <>
                <Play className="w-3 h-3 fill-current" />
                <span>Audition This Voice</span>
              </>
            )}
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Male Voice Card */}
          <div
            onClick={() => setGender('male')}
            className={`relative p-4 rounded-2xl border cursor-pointer transition-all ${
              gender === 'male'
                ? 'border-purple-600 dark:border-purple-500 bg-purple-50/50 dark:bg-purple-950/20 shadow-md ring-2 ring-purple-500/20'
                : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300 dark:hover:border-slate-700'
            }`}
          >
            <div className="flex items-start gap-3.5">
              <div
                className={`w-12 h-12 rounded-xl flex items-center justify-center text-lg font-bold transition-all ${
                  gender === 'male'
                    ? 'bg-gradient-to-tr from-blue-600 to-indigo-600 text-white shadow-md'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                }`}
              >
                <User className="w-6 h-6" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                    Male Voice
                  </h4>
                  {gender === 'male' && (
                    <span className="text-xs font-bold text-purple-600 dark:text-purple-400">
                      Active
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-1">
                  Warm, rich resonance & natural close-mic intimacy
                </p>
                <div className="flex items-center gap-2 mt-2 text-xs text-slate-400 dark:text-slate-500">
                  <span>Charon / Puck / Fenrir</span>
                  <span aria-hidden="true">·</span>
                  <span>Deep presence</span>
                </div>
              </div>
            </div>
          </div>

          {/* Female Voice Card */}
          <div
            onClick={() => setGender('female')}
            className={`relative p-4 rounded-2xl border cursor-pointer transition-all ${
              gender === 'female'
                ? 'border-purple-600 dark:border-purple-500 bg-purple-50/50 dark:bg-purple-950/20 shadow-md ring-2 ring-purple-500/20'
                : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300 dark:hover:border-slate-700'
            }`}
          >
            <div className="flex items-start gap-3.5">
              <div
                className={`w-12 h-12 rounded-xl flex items-center justify-center text-lg font-bold transition-all ${
                  gender === 'female'
                    ? 'bg-gradient-to-tr from-purple-600 to-pink-600 text-white shadow-md'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                }`}
              >
                <Users className="w-6 h-6" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                    Female Voice
                  </h4>
                  {gender === 'female' && (
                    <span className="text-xs font-bold text-purple-600 dark:text-purple-400">
                      Active
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-1">
                  Natural, warm clarity with authentic human pauses
                </p>
                <div className="flex items-center gap-2 mt-2 text-xs text-slate-400 dark:text-slate-500">
                  <span>Kore / Zephyr / Aoede</span>
                  <span aria-hidden="true">·</span>
                  <span>Silky clarity</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Voice Age Selection */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3">
          2. Voice Age Character
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
          {AGE_OPTIONS.map(opt => (
            <button
              key={opt.id}
              type="button"
              onClick={() => setAge(opt.id)}
              className={`p-3 rounded-xl border text-left transition-all ${
                age === opt.id
                  ? 'border-purple-600 dark:border-purple-500 bg-purple-50 dark:bg-purple-950/30 text-purple-900 dark:text-purple-200 shadow-xs ring-1 ring-purple-500/30'
                  : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-700'
              }`}
            >
              <div className="text-xs font-bold whitespace-nowrap">
                {opt.label}
              </div>
              <div className="text-xs text-slate-400 dark:text-slate-500 mt-0.5 line-clamp-1">
                {opt.desc}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* 3. Voice Style and Emotion */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3">
          3. Voice Style & Emotion
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2.5">
          {STYLE_OPTIONS.map(opt => {
            const Icon = opt.icon;
            const isSelected = style === opt.id;
            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => setStyle(opt.id)}
                className={`p-3 rounded-xl border text-left transition-all flex flex-col justify-between min-h-[74px] ${
                  isSelected
                    ? 'border-purple-600 dark:border-purple-500 bg-purple-50/70 dark:bg-purple-950/40 text-purple-900 dark:text-purple-100 shadow-xs ring-1 ring-purple-500/30'
                    : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between w-full mb-1">
                  <Icon
                    className={`w-4 h-4 ${
                      isSelected ? 'text-purple-600 dark:text-purple-400' : opt.accent
                    }`}
                  />
                  {isSelected && (
                    <div className="w-1.5 h-1.5 rounded-full bg-purple-600 dark:bg-purple-400" />
                  )}
                </div>
                <div>
                  <div className="text-xs font-semibold leading-tight line-clamp-1">
                    {opt.label}
                  </div>
                  <div className="text-xs text-slate-400 dark:text-slate-500 mt-0.5 line-clamp-1">
                    {opt.desc}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
