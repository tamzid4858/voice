import React, { useRef, useState, useEffect } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  Download,
  FileAudio,
  Check,
  Share2,
  Sliders,
  Sparkles,
  Loader2,
} from 'lucide-react';
import { formatAudioTime, convertWavToMp3Blob, triggerDownload, base64ToArrayBuffer, base64ToBlob } from '../utils/audioUtils';

interface AudioPlayerProps {
  audioBase64: string;
  durationSeconds: number;
  sampleRate: number;
  voiceName: string;
  language: string;
  gender: string;
  style: string;
  textSnippet: string;
  playbackSpeed: number;
  onSpeedChange: (speed: number) => void;
  onRegenerate?: () => void;
}

export const AudioPlayer: React.FC<AudioPlayerProps> = ({
  audioBase64,
  durationSeconds,
  sampleRate,
  voiceName,
  language,
  gender,
  style,
  textSnippet,
  playbackSpeed,
  onSpeedChange,
  onRegenerate,
}) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [actualDuration, setActualDuration] = useState(durationSeconds || 0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [customFileName, setCustomFileName] = useState('');
  const [isExportingMp3, setIsExportingMp3] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState<'mp3' | 'wav' | null>(null);
  const [audioUrl, setAudioUrl] = useState<string>('');

  // Default custom filename based on timestamp
  useEffect(() => {
    const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const cleanSnippet = textSnippet.slice(0, 15).trim().replace(/[^a-zA-Z0-9]/g, '_') || 'audio';
    setCustomFileName(`VoiceCraft_${gender}_${cleanSnippet}_${dateStr}`);
  }, [gender, textSnippet]);

  // Create Object URL from base64
  useEffect(() => {
    if (!audioBase64) return;
    const blob = base64ToBlob(audioBase64, 'audio/wav');
    const url = URL.createObjectURL(blob);
    setAudioUrl(url);

    return () => {
      URL.revokeObjectURL(url);
    };
  }, [audioBase64]);

  // Synchronize playback speed
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.playbackRate = playbackSpeed;
    }
  }, [playbackSpeed]);

  // Synchronize volume
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  // Draw simulated waveform representation on canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    ctx.clearRect(0, 0, width, height);

    const barCount = 48;
    const barWidth = 4;
    const gap = (width - barCount * barWidth) / (barCount - 1);
    const progressPercent = actualDuration > 0 ? currentTime / actualDuration : 0;

    // Use deterministic pattern based on audio length
    for (let i = 0; i < barCount; i++) {
      const fraction = i / barCount;
      // create varied heights representing natural speech frequencies
      const sinVal = Math.sin(fraction * Math.PI * 4 + 1.2);
      const cosVal = Math.cos(fraction * Math.PI * 7 + 0.4);
      let normHeight = Math.abs(sinVal * 0.6 + cosVal * 0.4);
      normHeight = Math.max(0.15, Math.min(0.95, normHeight));
      const barHeight = normHeight * (height - 8);

      const x = i * (barWidth + gap);
      const y = (height - barHeight) / 2;

      // Color based on whether playhead has passed this bar
      const isPlayed = fraction <= progressPercent;
      if (isPlayed) {
        ctx.fillStyle = '#9333ea'; // vibrant purple
      } else {
        ctx.fillStyle = '#64748b'; // slate
      }

      ctx.beginPath();
      ctx.roundRect(x, y, barWidth, barHeight, 2);
      ctx.fill();
    }
  }, [currentTime, actualDuration]);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(err => console.warn('Audio playback error:', err));
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current && !isNaN(audioRef.current.duration)) {
      setActualDuration(audioRef.current.duration);
    }
  };

  const handleEnded = () => {
    setIsPlaying(false);
    setCurrentTime(0);
  };

  const handleReplay = () => {
    if (!audioRef.current) return;
    audioRef.current.currentTime = 0;
    audioRef.current.play();
    setIsPlaying(true);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const targetTime = parseFloat(e.target.value);
    setCurrentTime(targetTime);
    if (audioRef.current) {
      audioRef.current.currentTime = targetTime;
    }
  };

  // Download WAV directly
  const handleDownloadWav = () => {
    try {
      const blob = base64ToBlob(audioBase64, 'audio/wav');
      const filename = `${customFileName.trim() || 'voicecraft_audio'}.wav`;
      triggerDownload(blob, filename);
      setDownloadSuccess('wav');
      setTimeout(() => setDownloadSuccess(null), 2500);
    } catch (e) {
      console.error('WAV download failed:', e);
    }
  };

  // Download MP3 via lamejs client-side encoder
  const handleDownloadMp3 = async () => {
    try {
      setIsExportingMp3(true);
      // Wait a tick for UI update
      await new Promise(r => setTimeout(r, 50));
      const arrayBuf = base64ToArrayBuffer(audioBase64);
      const mp3Blob = await convertWavToMp3Blob(arrayBuf, audioBase64);
      const filename = `${customFileName.trim() || 'voicecraft_audio'}.mp3`;
      triggerDownload(mp3Blob, filename);
      setDownloadSuccess('mp3');
      setTimeout(() => setDownloadSuccess(null), 2500);
    } catch (e) {
      console.error('MP3 encoding failed:', e);
    } finally {
      setIsExportingMp3(false);
    }
  };

  // Calculate file sizes
  const wavBytesCount = Math.round((audioBase64.length * 3) / 4);
  const wavSizeMb = (wavBytesCount / (1024 * 1024)).toFixed(2);
  const estMp3SizeMb = ((actualDuration * 16000) / (1024 * 1024)).toFixed(2); // ~128kbps = 16KB/sec

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-md space-y-6">
      {/* Hidden native audio element */}
      {audioUrl && (
        <audio
          ref={audioRef}
          src={audioUrl}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={handleLoadedMetadata}
          onEnded={handleEnded}
        />
      )}

      {/* Top Banner: Voice Meta & Badges */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Generated Voice Audio
            </h3>
            <span className="text-xs px-2 py-0.5 rounded-md bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 font-semibold">
              Voice: {voiceName}
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-1">
            "{textSnippet}"
          </p>
        </div>

        {onRegenerate && (
          <button
            type="button"
            onClick={onRegenerate}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Regenerate</span>
          </button>
        )}
      </div>

      {/* Waveform Canvas */}
      <div className="relative bg-slate-50 dark:bg-slate-950/80 rounded-xl p-4 border border-slate-200 dark:border-slate-800 flex items-center justify-center">
        <canvas
          ref={canvasRef}
          width={480}
          height={64}
          className="w-full max-w-lg h-16 cursor-pointer"
          onClick={e => {
            const rect = e.currentTarget.getBoundingClientRect();
            const clickX = e.clientX - rect.left;
            const clickFraction = clickX / rect.width;
            if (audioRef.current && actualDuration > 0) {
              const newTime = clickFraction * actualDuration;
              audioRef.current.currentTime = newTime;
              setCurrentTime(newTime);
            }
          }}
        />
      </div>

      {/* Scrub Bar & Timestamps */}
      <div className="space-y-1.5">
        <input
          type="range"
          min="0"
          max={actualDuration || 1}
          step="0.05"
          value={currentTime}
          onChange={handleSeek}
          className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-purple-600"
        />
        <div className="flex justify-between text-xs font-mono text-slate-500 dark:text-slate-400 tabular-nums">
          <span>{formatAudioTime(currentTime)}</span>
          <span>{formatAudioTime(actualDuration)}</span>
        </div>
      </div>

      {/* Main Controls Row */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        {/* Playback Buttons */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={togglePlay}
            className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white flex items-center justify-center shadow-md shadow-purple-500/25 transition-all transform active:scale-95"
            aria-label={isPlaying ? 'Pause voice' : 'Play voice'}
          >
            {isPlaying ? (
              <Pause className="w-5 h-5 fill-current" />
            ) : (
              <Play className="w-5 h-5 fill-current ml-0.5" />
            )}
          </button>

          <button
            type="button"
            onClick={handleReplay}
            className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title="Replay from start"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          {/* Speed Selector */}
          <div className="flex items-center gap-1 border border-slate-200 dark:border-slate-800 rounded-xl p-1 bg-slate-50 dark:bg-slate-950/40">
            {[0.75, 1.0, 1.25, 1.5].map(spd => (
              <button
                key={spd}
                type="button"
                onClick={() => onSpeedChange(spd)}
                className={`px-2 py-1 text-xs font-mono font-medium rounded-lg transition-colors ${
                  playbackSpeed === spd
                    ? 'bg-purple-600 text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {spd}x
              </button>
            ))}
          </div>
        </div>

        {/* Volume Controls */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsMuted(!isMuted)}
            className="p-2 rounded-lg text-slate-500 hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
          >
            {isMuted || volume === 0 ? (
              <VolumeX className="w-4 h-4 text-rose-500" />
            ) : (
              <Volume2 className="w-4 h-4" />
            )}
          </button>
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={isMuted ? 0 : volume}
            onChange={e => {
              setVolume(parseFloat(e.target.value));
              if (isMuted) setIsMuted(false);
            }}
            className="w-20 sm:w-24 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-purple-600"
          />
        </div>
      </div>

      {/* Download Section with Custom File Naming */}
      <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-4">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="flex-1">
            <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">
              Custom File Name:
            </label>
            <input
              type="text"
              value={customFileName}
              onChange={e => setCustomFileName(e.target.value)}
              placeholder="e.g. voice_message_ria"
              className="w-full text-xs font-mono bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <div className="flex items-end gap-2 pt-1 sm:pt-0">
            {/* Download MP3 */}
            <button
              type="button"
              onClick={handleDownloadMp3}
              disabled={isExportingMp3}
              className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 rounded-xl shadow-sm transition-all disabled:opacity-50"
            >
              {isExportingMp3 ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Encoding MP3...</span>
                </>
              ) : downloadSuccess === 'mp3' ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-300" />
                  <span>Saved MP3!</span>
                </>
              ) : (
                <>
                  <Download className="w-3.5 h-3.5" />
                  <span>Download MP3</span>
                  <span className="text-[10px] opacity-75 font-mono">({estMp3SizeMb} MB)</span>
                </>
              )}
            </button>

            {/* Download WAV */}
            <button
              type="button"
              onClick={handleDownloadWav}
              className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-4 py-2 text-xs font-bold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl border border-slate-200 dark:border-slate-700 transition-all"
            >
              {downloadSuccess === 'wav' ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Saved WAV!</span>
                </>
              ) : (
                <>
                  <FileAudio className="w-3.5 h-3.5 text-blue-500" />
                  <span>Download WAV</span>
                  <span className="text-[10px] opacity-75 font-mono">({wavSizeMb} MB)</span>
                </>
              )}
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between text-[11px] text-slate-400 dark:text-slate-500">
          <span>Format: 24kHz Mono 16-bit PCM • Lossless audio studio quality</span>
          <span>Commercial & Personal Use Allowed</span>
        </div>
      </div>
    </div>
  );
};
