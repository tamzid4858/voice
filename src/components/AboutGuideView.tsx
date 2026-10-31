import React from 'react';
import { Mic, Radio, Wind, Sparkles, CheckCircle2, Shield, Heart, FileAudio } from 'lucide-react';

export const AboutGuideView: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-purple-900/30 via-indigo-900/30 to-slate-900/30 border border-purple-500/20 rounded-3xl p-8 space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300 text-xs font-semibold">
          <Radio className="w-3.5 h-3.5" />
          <span>Acoustic Craftsmanship</span>
        </div>
        <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">
          The Intimate Close-Microphone & Voice Note Effect
        </h2>
        <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          Traditional text-to-speech tools often sound artificial, overly dramatic, or trapped in hollow studio reverb. VoiceCraft AI is engineered around the intimacy of personal communication—simulating the direct proximity, subtle breathing, and natural cadences of someone leaving a personal voice message on WhatsApp or Telegram.
        </p>
      </div>

      {/* 3 Core Principles */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 space-y-2.5">
          <div className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center font-bold">
            <Mic className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-sm text-slate-900 dark:text-white">
            Proximity Effect
          </h3>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            By modeling the warm bass frequencies that occur when a human voice speaks within 2–4 inches of a condenser or smartphone capsule, the speech feels physically close and genuine.
          </p>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 space-y-2.5">
          <div className="w-10 h-10 rounded-xl bg-indigo-100 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold">
            <Wind className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-sm text-slate-900 dark:text-white">
            Organic Micro-Breathing
          </h3>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            Real humans inhale softly before initiating thoughts and pause naturally between sentence clauses. VoiceCraft AI cues micro-breaths for maximum realism.
          </p>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 space-y-2.5">
          <div className="w-10 h-10 rounded-xl bg-pink-100 dark:bg-pink-950/60 text-pink-600 dark:text-pink-400 flex items-center justify-center font-bold">
            <Heart className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-sm text-slate-900 dark:text-white">
            Bangla & Multilingual Flow
          </h3>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            Deep acoustic optimization for Bengali (বাংলা) sweet phonetic inflection alongside English and Hindi, avoiding robotic syllabic cutting.
          </p>
        </div>
      </div>

      {/* Pro Tips for Best Output */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 space-y-4">
        <h3 className="font-bold text-base text-slate-900 dark:text-white">
          How to get the most natural voice output:
        </h3>
        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
            <div className="text-xs text-slate-700 dark:text-slate-300">
              <strong className="text-slate-900 dark:text-white">Punctuate naturally:</strong> Use commas, ellipses (…), exclamation marks, and periods. In Bengali, use Dariy (।) for clean sentence separation.
            </div>
          </div>
          <div className="flex items-start gap-3">
            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
            <div className="text-xs text-slate-700 dark:text-slate-300">
              <strong className="text-slate-900 dark:text-white">Choose the right emotion:</strong> Matching the emotion (e.g. "Storytelling" for narrative books, "Friendly" for personal notes, "Whispering" for ASMR/bedtime stories) enriches inflection.
            </div>
          </div>
          <div className="flex items-start gap-3">
            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
            <div className="text-xs text-slate-700 dark:text-slate-300">
              <strong className="text-slate-900 dark:text-white">Seamless Long Text:</strong> Pasting multi-paragraph scripts automatically splits the text across optimal sentence boundaries and seamlessly stitches the lossless WAV chunks into one unified audio file.
            </div>
          </div>
        </div>
      </div>

      {/* Export Specifications */}
      <div className="bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center">
            <FileAudio className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-900 dark:text-white">
              Studio Export Specs
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              24,000 Hz • 16-bit Mono PCM • Instant MP3 and Lossless WAV Downloads
            </p>
          </div>
        </div>
        <div className="text-xs text-slate-500 dark:text-slate-400">
          Commercial and Personal Use Ready
        </div>
      </div>
    </div>
  );
};
