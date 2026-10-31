import React, { useState } from 'react';
import { X, BookOpen, MessageSquare, Briefcase, Zap, Check } from 'lucide-react';
import { SAMPLE_TEXTS, SampleTextItem } from '../utils/audioUtils';

interface SampleTextModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectSample: (text: string, langCode: string) => void;
}

export const SampleTextModal: React.FC<SampleTextModalProps> = ({
  isOpen,
  onClose,
  onSelectSample,
}) => {
  const [selectedLanguage, setSelectedLanguage] = useState<string>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  if (!isOpen) return null;

  const filteredSamples = SAMPLE_TEXTS.filter(item => {
    if (selectedLanguage === 'all') return true;
    return item.langCode === selectedLanguage;
  });

  const getCategoryIcon = (category: SampleTextItem['category']) => {
    switch (category) {
      case 'Voice Message':
        return <MessageSquare className="w-4 h-4 text-emerald-500" />;
      case 'Story':
        return <BookOpen className="w-4 h-4 text-amber-500" />;
      case 'Professional':
        return <Briefcase className="w-4 h-4 text-blue-500" />;
      case 'Motivational':
        return <Zap className="w-4 h-4 text-purple-500" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in">
      <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Sample Voice Prompts
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Select a realistic script optimized for close-mic voice messages & natural speech
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Language Tabs */}
        <div className="p-3 bg-slate-50 dark:bg-slate-950/50 border-b border-slate-200 dark:border-slate-800 flex items-center gap-2 overflow-x-auto">
          {[
            { id: 'all', label: 'All Samples' },
            { id: 'bn', label: 'বাংলা (Bangla)' },
            { id: 'en', label: 'English' },
            { id: 'hi', label: 'हिंदी (Hindi)' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setSelectedLanguage(tab.id)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-colors ${
                selectedLanguage === tab.id
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200/60 dark:hover:bg-slate-800'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* List */}
        <div className="p-4 space-y-3 overflow-y-auto flex-1">
          {filteredSamples.map(sample => (
            <div
              key={sample.id}
              onClick={() => {
                onSelectSample(sample.text, sample.langCode);
                onClose();
              }}
              className="group p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-purple-400 dark:hover:border-purple-500 hover:shadow-md cursor-pointer transition-all"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  {getCategoryIcon(sample.category)}
                  <span className="font-semibold text-sm text-slate-900 dark:text-white">
                    {sample.title}
                  </span>
                  <span className="text-xs text-slate-400 dark:text-slate-500">·</span>
                  <span className="text-xs text-slate-500 dark:text-slate-400">
                    {sample.language}
                  </span>
                </div>
                <span className="text-xs font-medium text-purple-600 dark:text-purple-400 group-hover:underline">
                  Use this text →
                </span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-sans line-clamp-3">
                {sample.text}
              </p>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/40 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-200/60 dark:hover:bg-slate-800 rounded-lg transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
