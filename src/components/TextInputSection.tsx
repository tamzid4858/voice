import React, { useState } from 'react';
import {
  Trash2,
  Sparkles,
  Clipboard,
  Copy,
  Check,
  Languages,
  Clock,
  Layers,
} from 'lucide-react';

interface TextInputSectionProps {
  text: string;
  setText: (val: string) => void;
  language: string;
  setLanguage: (val: string) => void;
  onOpenSampleModal: () => void;
}

const LANGUAGES = [
  { code: 'bn', name: 'Bangla (বাংলা)', native: 'বাংলা' },
  { code: 'en', name: 'English (US/UK)', native: 'English' },
  { code: 'hi', name: 'Hindi (हिंदी)', native: 'हिन्दी' },
  { code: 'es', name: 'Spanish (Español)', native: 'Español' },
  { code: 'ar', name: 'Arabic (العربية)', native: 'العربية' },
  { code: 'fr', name: 'French (Français)', native: 'Français' },
  { code: 'de', name: 'German (Deutsch)', native: 'Deutsch' },
  { code: 'ja', name: 'Japanese (日本語)', native: '日本語' },
];

export const TextInputSection: React.FC<TextInputSectionProps> = ({
  text,
  setText,
  language,
  setLanguage,
  onOpenSampleModal,
}) => {
  const [copied, setCopied] = useState(false);

  const charCount = text.length;
  const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;
  // Estimated speech duration: ~140 words per minute => ~2.3 words/sec
  const estSeconds = wordCount > 0 ? Math.ceil((wordCount / 140) * 60) : 0;
  const estMinutes = Math.floor(estSeconds / 60);
  const remainingSecs = estSeconds % 60;
  const estDurationStr =
    estMinutes > 0
      ? `~${estMinutes}m ${remainingSecs}s`
      : `~${remainingSecs}s speech`;

  // Estimated chunks count for long text (> 350 chars)
  const estimatedChunks = Math.ceil(Math.max(1, charCount / 350));

  const handleClear = () => {
    setText('');
  };

  const handleCopy = async () => {
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      console.warn('Failed to copy text:', e);
    }
  };

  const handlePaste = async () => {
    try {
      const clipText = await navigator.clipboard.readText();
      if (clipText) {
        setText(text ? `${text}\n${clipText}` : clipText);
      }
    } catch (e) {
      console.warn('Failed to paste from clipboard:', e);
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-4">
      {/* Top Bar of Input: Language Selection & Utilities */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800/80">
        <div className="flex items-center gap-2">
          <Languages className="w-4 h-4 text-purple-600 dark:text-purple-400" />
          <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
            Language:
          </span>
          <select
            value={language}
            onChange={e => setLanguage(e.target.value)}
            className="text-xs font-medium bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            {LANGUAGES.map(lang => (
              <option key={lang.code} value={lang.code}>
                {lang.name}
              </option>
            ))}
          </select>
        </div>

        {/* Quick action buttons */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onOpenSampleModal}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800/50 hover:bg-purple-100 dark:hover:bg-purple-900/50 transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
            <span>Sample Text</span>
          </button>

          <button
            type="button"
            onClick={handlePaste}
            className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title="Paste from clipboard"
          >
            <Clipboard className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Paste</span>
          </button>

          {text && (
            <>
              <button
                type="button"
                onClick={handleCopy}
                className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                title="Copy text"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-500" />
                    <span className="text-emerald-600 dark:text-emerald-400">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Copy</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={handleClear}
                className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium rounded-lg text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
                title="Clear text"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Clear</span>
              </button>
            </>
          )}
        </div>
      </div>

      {/* Main Textarea */}
      <div className="relative">
        <textarea
          value={text}
          onChange={e => setText(e.target.value)}
          placeholder={
            language === 'bn'
              ? 'এখানে আপনার বাংলা বার্তা বা স্ক্রিপ্ট লিখুন অথবা পেস্ট করুন... (উদা: "কেমন আছো? শুনো, আজ সন্ধ্যার চা কিন্তু আমার সাথে হচ্ছে!")'
              : language === 'hi'
              ? 'यहाँ अपना हिंदी संदेश या स्क्रिप्ट लिखें या पेस्ट करें... (उदा: "अरे सुनो! आज शाम की चाय का प्लान पक्का है ना?")'
              : 'Type or paste any text here to generate human-like speech or an intimate voice message... (e.g. "Hey! Just wanted to drop you a quick voice note before my meeting...")'
          }
          rows={6}
          className="w-full bg-slate-50/60 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 rounded-xl p-4 text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all resize-y leading-relaxed"
        />
      </div>

      {/* Bottom Counter Bar */}
      <div className="flex flex-wrap items-center justify-between text-xs text-slate-500 dark:text-slate-400 gap-2 pt-1 font-mono">
        <div className="flex items-center gap-3">
          <span className="tabular-nums font-medium text-slate-700 dark:text-slate-300">
            {charCount.toLocaleString()} chars
          </span>
          <span aria-hidden="true">·</span>
          <span className="tabular-nums">
            {wordCount.toLocaleString()} words
          </span>
          {charCount > 0 && (
            <>
              <span aria-hidden="true">·</span>
              <span className="flex items-center gap-1 text-purple-600 dark:text-purple-400">
                <Clock className="w-3.5 h-3.5" />
                <span>{estDurationStr}</span>
              </span>
            </>
          )}
        </div>

        {charCount > 350 && (
          <div className="flex items-center gap-1.5 text-xs text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/30 px-2 py-0.5 rounded-md">
            <Layers className="w-3.5 h-3.5" />
            <span>Long text auto-stitched ({estimatedChunks} segments)</span>
          </div>
        )}
      </div>
    </div>
  );
};
