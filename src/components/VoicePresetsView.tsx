import React from 'react';
import { User, Users, Play, Mic, Sparkles, Radio, Check, Volume2 } from 'lucide-react';
import { VoiceGender, VoiceAge, VoiceStyle } from '../types/tts';

export interface PersonaCard {
  id: string;
  name: string;
  gender: VoiceGender;
  age: VoiceAge;
  style: VoiceStyle;
  languages: string[];
  geminiVoice: 'Puck' | 'Charon' | 'Kore' | 'Fenrir' | 'Zephyr' | 'Aoede';
  tagline: string;
  avatarGradient: string;
  recommendedText: string;
}

const PERSONAS: PersonaCard[] = [
  {
    id: 'aria-bn-intimate',
    name: 'Aria (সুরভি)',
    gender: 'female',
    age: 'young_adult',
    style: 'natural',
    languages: ['Bangla (বাংলা)', 'English'],
    geminiVoice: 'Kore',
    tagline: 'Sweet, intimate Bengali voice message with natural breathing pauses',
    avatarGradient: 'from-pink-500 to-rose-500',
    recommendedText: 'শুনছো? আমি এইমাত্র অফিস থেকে বের হলাম। আসার সময় তোমার পছন্দের মিষ্টি নিয়ে আসছি, দশ মিনিটের মধ্যেই পৌঁছাবো!',
  },
  {
    id: 'rohan-bn-conversational',
    name: 'Rohan (রোহান)',
    gender: 'male',
    age: 'young_adult',
    style: 'friendly',
    languages: ['Bangla (বাংলা)', 'English'],
    geminiVoice: 'Charon',
    tagline: 'Warm close-mic phone note, direct and natural Bengali speech',
    avatarGradient: 'from-blue-600 to-indigo-600',
    recommendedText: 'হ্যালো দোস্ত! কী খবর? কালকের প্ল্যানটা কিন্তু একদম পাকা। আমি সময়মতো চলে আসবো, রেডি থেকো!',
  },
  {
    id: 'maya-en-story',
    name: 'Maya',
    gender: 'female',
    age: 'adult',
    style: 'storytelling',
    languages: ['English', 'Hindi (हिंदी)'],
    geminiVoice: 'Kore',
    tagline: 'Rich, expressive storytelling with cinematic cadence and nuance',
    avatarGradient: 'from-purple-600 to-indigo-600',
    recommendedText: 'The morning mist clung to the valleys as the first amber rays pierced the autumn sky, painting the lake in molten gold.',
  },
  {
    id: 'kabir-hi-warm',
    name: 'Kabir (कबीर)',
    gender: 'male',
    age: 'adult',
    style: 'natural',
    languages: ['Hindi (हिंदी)', 'English'],
    geminiVoice: 'Charon',
    tagline: 'Heartfelt, grounded Hindi conversation with close-mic intimacy',
    avatarGradient: 'from-amber-600 to-orange-600',
    recommendedText: 'अरे सुनो! मैं अभी रास्ते में हूँ और ट्रैफिक थोड़ा ज़्यादा है। करीब पंद्रহ मिनट में पहुँचता हूँ, गरमा-गरम चाय तैयार रखना!',
  },
  {
    id: 'zara-en-youthful',
    name: 'Zara',
    gender: 'female',
    age: 'teen',
    style: 'happy',
    languages: ['English'],
    geminiVoice: 'Zephyr',
    tagline: 'Lively, joyful, and modern cadence for social clips & voice notes',
    avatarGradient: 'from-teal-500 to-emerald-500',
    recommendedText: 'Hey everyone! You won’t believe what just happened today. It was honestly the most unexpected surprise of the year!',
  },
  {
    id: 'vikram-elderly-narrator',
    name: 'Vikram',
    gender: 'male',
    age: 'elderly',
    style: 'narrator',
    languages: ['English', 'Bangla (বাংলা)', 'Hindi (हिंदी)'],
    geminiVoice: 'Fenrir',
    tagline: 'Deep, seasoned gravelly cadence with wise, comforting warmth',
    avatarGradient: 'from-slate-700 to-slate-900',
    recommendedText: 'Patience, my friend, is not the ability to wait, but the ability to keep a good attitude while waiting.',
  },
];

interface VoicePresetsViewProps {
  onSelectPersona: (persona: PersonaCard) => void;
  onPreviewPersona: (persona: PersonaCard) => void;
  isPreviewingId: string | null;
}

export const VoicePresetsView: React.FC<VoicePresetsViewProps> = ({
  onSelectPersona,
  onPreviewPersona,
  isPreviewingId,
}) => {
  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-purple-900/20 via-indigo-900/20 to-slate-900/20 border border-purple-500/20 rounded-2xl p-6">
        <div className="max-w-2xl space-y-2">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 text-xs font-semibold">
            <Radio className="w-3.5 h-3.5" />
            <span>Master AI Voice Personas</span>
          </div>
          <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">
            Curated Voice Talents for Realistic Speech
          </h2>
          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            Each persona is tailored with specialized acoustic prompting, close-mic proximity effect, natural breathing, and native language nuances. Audition any voice or load it directly into your studio.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {PERSONAS.map(persona => {
          const isAuditioning = isPreviewingId === persona.id;

          return (
            <div
              key={persona.id}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs hover:border-purple-300 dark:hover:border-purple-600 transition-all flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${persona.avatarGradient} text-white flex items-center justify-center font-bold text-lg shadow-sm`}
                  >
                    {persona.gender === 'female' ? (
                      <Users className="w-6 h-6" />
                    ) : (
                      <User className="w-6 h-6" />
                    )}
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-slate-900 dark:text-white">
                      {persona.name}
                    </h3>
                    <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 capitalize">
                      <span>{persona.gender}</span>
                      <span aria-hidden="true">·</span>
                      <span>{persona.age.replace('_', ' ')}</span>
                      <span aria-hidden="true">·</span>
                      <span>{persona.style}</span>
                    </div>
                  </div>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-sans">
                  {persona.tagline}
                </p>

                {/* Languages */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {persona.languages.map(l => (
                    <span
                      key={l}
                      className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
                    >
                      {l}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => onPreviewPersona(persona)}
                  disabled={isAuditioning}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 text-xs font-semibold rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-colors disabled:opacity-50"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>{isAuditioning ? 'Playing...' : 'Audition'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => onSelectPersona(persona)}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 text-xs font-bold rounded-xl bg-purple-600 hover:bg-purple-500 text-white shadow-xs transition-colors"
                >
                  <span>Select Voice</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
