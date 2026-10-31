import React, { useState } from 'react';
import {
  History,
  Trash2,
  Play,
  Pause,
  Download,
  Copy,
  Check,
  RotateCcw,
  Clock,
  User,
  Sparkles,
} from 'lucide-react';
import { GenerationHistoryItem } from '../types/tts';
import { base64ToBlob, triggerDownload, formatAudioTime, convertWavToMp3Blob, base64ToArrayBuffer } from '../utils/audioUtils';

interface HistorySectionProps {
  history: GenerationHistoryItem[];
  onSelectForPlayback: (item: GenerationHistoryItem) => void;
  onRegenerate: (item: GenerationHistoryItem) => void;
  onDeleteItem: (id: string) => void;
  onClearHistory: () => void;
}

export const HistorySection: React.FC<HistorySectionProps> = ({
  history,
  onSelectForPlayback,
  onRegenerate,
  onDeleteItem,
  onClearHistory,
}) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [audioObj, setAudioObj] = useState<HTMLAudioElement | null>(null);

  const handleCopy = async (id: string, text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (e) {
      console.warn('Copy failed:', e);
    }
  };

  const handlePlayHistoryAudio = (item: GenerationHistoryItem) => {
    if (playingId === item.id) {
      if (audioObj) {
        audioObj.pause();
        setPlayingId(null);
      }
      return;
    }

    if (audioObj) {
      audioObj.pause();
    }

    const blob = base64ToBlob(item.audioBase64, 'audio/wav');
    const url = URL.createObjectURL(blob);
    const newAudio = new Audio(url);
    newAudio.onended = () => {
      setPlayingId(null);
      URL.revokeObjectURL(url);
    };
    newAudio.play().catch(e => console.warn('History play error:', e));
    setAudioObj(newAudio);
    setPlayingId(item.id);
  };

  const handleDownloadWav = (item: GenerationHistoryItem) => {
    const blob = base64ToBlob(item.audioBase64, 'audio/wav');
    triggerDownload(blob, `${item.fileName || 'voicecraft_audio'}.wav`);
  };

  const handleDownloadMp3 = async (item: GenerationHistoryItem) => {
    try {
      const arrayBuf = base64ToArrayBuffer(item.audioBase64);
      const mp3Blob = await convertWavToMp3Blob(arrayBuf, item.audioBase64);
      triggerDownload(mp3Blob, `${item.fileName || 'voicecraft_audio'}.mp3`);
    } catch (e) {
      console.error('History MP3 download error:', e);
    }
  };

  if (history.length === 0) {
    return (
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-8 text-center space-y-3">
        <div className="w-12 h-12 rounded-2xl bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 flex items-center justify-center mx-auto">
          <History className="w-6 h-6" />
        </div>
        <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">
          No Speech History Yet
        </h4>
        <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
          Generate realistic speech in Bangla, English, or Hindi to automatically record your audio creations here for instant playback and downloads.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <History className="w-4 h-4 text-purple-600 dark:text-purple-400" />
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">
            Generation History ({history.length})
          </h3>
        </div>
        <button
          type="button"
          onClick={onClearHistory}
          className="flex items-center gap-1.5 text-xs text-rose-600 dark:text-rose-400 hover:text-rose-700 dark:hover:text-rose-300 transition-colors"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Clear All</span>
        </button>
      </div>

      {/* History Items List */}
      <div className="space-y-3">
        {history.map(item => {
          const isPlaying = playingId === item.id;
          const dateStr = new Date(item.timestamp).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          });

          return (
            <div
              key={item.id}
              className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40 hover:border-slate-300 dark:hover:border-slate-700 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              {/* Text & Meta */}
              <div className="space-y-1.5 flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                  <span className="font-semibold text-slate-900 dark:text-slate-200">
                    {item.voiceName} ({item.gender})
                  </span>
                  <span aria-hidden="true">·</span>
                  <span className="capitalize">{item.age.replace('_', ' ')}</span>
                  <span aria-hidden="true">·</span>
                  <span className="capitalize">{item.style}</span>
                  <span aria-hidden="true">·</span>
                  <span className="font-mono">{formatAudioTime(item.duration)}</span>
                  <span aria-hidden="true">·</span>
                  <span className="text-[11px]">{dateStr}</span>
                </div>

                <p className="text-xs text-slate-700 dark:text-slate-300 font-sans line-clamp-2 leading-relaxed">
                  "{item.text}"
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 shrink-0">
                {/* Play / Pause button */}
                <button
                  type="button"
                  onClick={() => handlePlayHistoryAudio(item)}
                  className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all ${
                    isPlaying
                      ? 'bg-purple-600 text-white shadow-xs'
                      : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700'
                  }`}
                  title={isPlaying ? 'Pause' : 'Play audio'}
                >
                  {isPlaying ? (
                    <Pause className="w-4 h-4 fill-current" />
                  ) : (
                    <Play className="w-4 h-4 fill-current ml-0.5" />
                  )}
                </button>

                {/* Load into studio player */}
                <button
                  type="button"
                  onClick={() => onSelectForPlayback(item)}
                  className="px-2.5 py-1.5 text-xs font-semibold rounded-lg bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800 hover:bg-purple-100 dark:hover:bg-purple-900/50 transition-colors"
                  title="Open in studio audio player"
                >
                  Open in Player
                </button>

                {/* Regenerate with same settings */}
                <button
                  type="button"
                  onClick={() => onRegenerate(item)}
                  className="p-2 rounded-lg text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  title="Regenerate voice"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>

                {/* Copy text */}
                <button
                  type="button"
                  onClick={() => handleCopy(item.id, item.text)}
                  className="p-2 rounded-lg text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  title="Copy text snippet"
                >
                  {copiedId === item.id ? (
                    <Check className="w-3.5 h-3.5 text-emerald-500" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                </button>

                {/* Download MP3 */}
                <button
                  type="button"
                  onClick={() => handleDownloadMp3(item)}
                  className="px-2 py-1 text-xs font-mono font-medium rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-200/60 dark:hover:bg-slate-800 transition-colors"
                  title="Download MP3"
                >
                  MP3
                </button>

                {/* Download WAV */}
                <button
                  type="button"
                  onClick={() => handleDownloadWav(item)}
                  className="px-2 py-1 text-xs font-mono font-medium rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-200/60 dark:hover:bg-slate-800 transition-colors"
                  title="Download WAV"
                >
                  WAV
                </button>

                {/* Delete Item */}
                <button
                  type="button"
                  onClick={() => onDeleteItem(item.id)}
                  className="p-2 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/20 transition-colors"
                  title="Delete from history"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
