import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { TextInputSection } from './components/TextInputSection';
import { VoiceSelector } from './components/VoiceSelector';
import { VoiceSettings } from './components/VoiceSettings';
import { AudioPlayer } from './components/AudioPlayer';
import { HistorySection } from './components/HistorySection';
import { VoicePresetsView, PersonaCard } from './components/VoicePresetsView';
import { AboutGuideView } from './components/AboutGuideView';
import { SampleTextModal } from './components/SampleTextModal';
import { VoiceGender, VoiceAge, VoiceStyle, TTSResponse, GenerationHistoryItem } from './types/tts';
import { Sparkles, Loader2, AlertCircle, Play, Mic, Radio } from 'lucide-react';
import { base64ToBlob } from './utils/audioUtils';

const STORAGE_KEY_HISTORY = 'voicecraft_generation_history_v1';
const STORAGE_KEY_THEME = 'voicecraft_theme_mode';

export default function App() {
  // Theme state
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_THEME);
    if (saved) return saved === 'dark';
    return true; // Default to sleek modern dark mode
  });

  // Active navigation tab
  const [activeTab, setActiveTab] = useState<'generator' | 'presets' | 'history' | 'about'>('generator');

  // Studio generator parameters
  const [text, setText] = useState<string>(
    'শুনছো? আমি এইমাত্র অফিস থেকে বের হলাম। বাইরে চমৎকার মিষ্টি রোদ! আসার সময় তোমার পছন্দের মিষ্টি নিয়ে আসছি। দশ মিনিটের মধ্যেই পৌঁছাবো, সাবধানে থেকো কেমন?'
  );
  const [language, setLanguage] = useState<string>('bn');
  const [gender, setGender] = useState<VoiceGender>('female');
  const [age, setAge] = useState<VoiceAge>('adult');
  const [style, setStyle] = useState<VoiceStyle>('natural');

  // Acoustic parameters
  const [speed, setSpeed] = useState<number>(1.0);
  const [pitch, setPitch] = useState<number>(0);
  const [volume, setVolume] = useState<number>(85);
  const [clarity, setClarity] = useState<number>(80);
  const [closeMicEffect, setCloseMicEffect] = useState<boolean>(true);
  const [addBreathing, setAddBreathing] = useState<boolean>(true);

  // Playback & generation states
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [generationProgress, setGenerationProgress] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [currentAudio, setCurrentAudio] = useState<TTSResponse | null>(null);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1.0);

  // Preview audition states
  const [isPreviewing, setIsPreviewing] = useState<boolean>(false);
  const [previewPersonaId, setPreviewPersonaId] = useState<string | null>(null);
  const [auditionAudioObj, setAuditionAudioObj] = useState<HTMLAudioElement | null>(null);

  // Modals
  const [isSampleModalOpen, setIsSampleModalOpen] = useState<boolean>(false);

  // History state
  const [history, setHistory] = useState<GenerationHistoryItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_HISTORY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Failed loading history from localStorage', e);
    }
    return [];
  });

  // Theme synchronization with document element
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem(STORAGE_KEY_THEME, 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem(STORAGE_KEY_THEME, 'light');
    }
  }, [darkMode]);

  // Save history to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_HISTORY, JSON.stringify(history));
    } catch (e) {
      console.warn('Failed saving history', e);
    }
  }, [history]);

  // Reset acoustic settings
  const handleResetSettings = () => {
    setSpeed(1.0);
    setPitch(0);
    setVolume(85);
    setClarity(80);
    setCloseMicEffect(true);
    setAddBreathing(true);
  };

  // Quick Voice Preview / Audition
  const handleAuditionVoice = async (customParams?: {
    gender?: VoiceGender;
    age?: VoiceAge;
    style?: VoiceStyle;
    language?: string;
    personaId?: string;
  }) => {
    try {
      if (auditionAudioObj) {
        auditionAudioObj.pause();
      }

      setIsPreviewing(true);
      if (customParams?.personaId) {
        setPreviewPersonaId(customParams.personaId);
      }

      const res = await fetch('/api/tts/preview', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          gender: customParams?.gender || gender,
          age: customParams?.age || age,
          style: customParams?.style || style,
          language: customParams?.language || language,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Audition failed');
      }

      const blob = base64ToBlob(data.audioBase64, 'audio/wav');
      const url = URL.createObjectURL(blob);
      const audio = new Audio(url);
      audio.onended = () => {
        setIsPreviewing(false);
        setPreviewPersonaId(null);
        URL.revokeObjectURL(url);
      };
      audio.play().catch(e => console.warn('Audio play error:', e));
      setAuditionAudioObj(audio);
    } catch (err: any) {
      console.error('Audition error:', err);
      setErrorMessage(err.message || 'Could not audition voice.');
      setIsPreviewing(false);
      setPreviewPersonaId(null);
    }
  };

  // Main Text-to-Speech generation
  const handleGenerateVoice = async () => {
    if (!text.trim()) {
      setErrorMessage('Please type or paste some text before generating.');
      return;
    }

    try {
      setIsGenerating(true);
      setErrorMessage(null);
      setGenerationProgress('Connecting to Gemini AI acoustic engine...');

      const progressTimer = setTimeout(() => {
        setGenerationProgress('Applying close-mic intimacy & natural breathing nuances...');
      }, 1500);

      const progressTimer2 = setTimeout(() => {
        setGenerationProgress('Rendering lossless 24kHz audio...');
      }, 3500);

      const response = await fetch('/api/tts/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: text.trim(),
          gender,
          age,
          style,
          language,
          speed,
          pitch,
          volume,
          clarity,
          closeMicEffect,
          addBreathing,
        }),
      });

      clearTimeout(progressTimer);
      clearTimeout(progressTimer2);

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to synthesize speech.');
      }

      setCurrentAudio(data);

      // Add to history
      const historyItem: GenerationHistoryItem = {
        id: `gen_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        text: text.trim(),
        language,
        gender,
        age,
        style,
        voiceName: data.voiceName,
        timestamp: Date.now(),
        audioBase64: data.audioBase64,
        duration: data.durationEstimateSeconds,
        fileName: `VoiceCraft_${gender}_${style}_${Date.now()}`,
      };

      setHistory(prev => [historyItem, ...prev.slice(0, 49)]); // Keep last 50
    } catch (err: any) {
      console.error('Generation failed:', err);
      setErrorMessage(
        err.message || 'An unexpected error occurred during voice synthesis.'
      );
    } finally {
      setIsGenerating(false);
      setGenerationProgress('');
    }
  };

  // Select persona from Presets View
  const handleSelectPersona = (persona: PersonaCard) => {
    setGender(persona.gender);
    setAge(persona.age);
    setStyle(persona.style);
    if (persona.recommendedText) {
      setText(persona.recommendedText);
    }
    // Switch language if appropriate
    if (persona.languages.some(l => l.includes('Bangla'))) {
      setLanguage('bn');
    } else if (persona.languages.some(l => l.includes('Hindi'))) {
      setLanguage('hi');
    } else {
      setLanguage('en');
    }
    setActiveTab('generator');
  };

  // Preview persona from Presets View
  const handlePreviewPersona = (persona: PersonaCard) => {
    let lang = 'en';
    if (persona.languages.some(l => l.includes('Bangla'))) lang = 'bn';
    if (persona.languages.some(l => l.includes('Hindi'))) lang = 'hi';

    handleAuditionVoice({
      gender: persona.gender,
      age: persona.age,
      style: persona.style,
      language: lang,
      personaId: persona.id,
    });
  };

  // Load history item into studio player
  const handleSelectForPlayback = (item: GenerationHistoryItem) => {
    setCurrentAudio({
      audioBase64: item.audioBase64,
      mimeType: 'audio/wav',
      durationEstimateSeconds: item.duration,
      charCount: item.text.length,
      chunkCount: 1,
      voiceName: item.voiceName,
      sampleRate: 24000,
    });
    setText(item.text);
    setGender(item.gender);
    setAge(item.age);
    setStyle(item.style);
    setLanguage(item.language);
    setActiveTab('generator');
  };

  // Regenerate history item
  const handleRegenerateFromHistory = (item: GenerationHistoryItem) => {
    setText(item.text);
    setGender(item.gender);
    setAge(item.age);
    setStyle(item.style);
    setLanguage(item.language);
    setActiveTab('generator');
    // Give state a tick to settle then generate
    setTimeout(() => {
      handleGenerateVoice();
    }, 100);
  };

  const handleDeleteHistoryItem = (id: string) => {
    setHistory(prev => prev.filter(h => h.id !== id));
  };

  const handleClearHistory = () => {
    if (window.confirm('Are you sure you want to delete all voice generation history?')) {
      setHistory([]);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col transition-colors selection:bg-purple-600 selection:text-white">
      {/* Header adhering to the 3-Zone contract */}
      <Header
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        historyCount={history.length}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Error Alert Banner */}
        {errorMessage && (
          <div className="mb-6 p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 text-rose-800 dark:text-rose-200 flex items-start justify-between gap-3 animate-in fade-in">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-bold">Voice Generation Notice</h4>
                <p className="text-xs text-rose-700 dark:text-rose-300 mt-0.5 leading-relaxed">
                  {errorMessage}
                </p>
              </div>
            </div>
            <button
              onClick={() => setErrorMessage(null)}
              className="text-xs font-semibold text-rose-600 dark:text-rose-400 hover:underline shrink-0"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* View Switching */}
        {activeTab === 'presets' && (
          <VoicePresetsView
            onSelectPersona={handleSelectPersona}
            onPreviewPersona={handlePreviewPersona}
            isPreviewingId={previewPersonaId}
          />
        )}

        {activeTab === 'history' && (
          <HistorySection
            history={history}
            onSelectForPlayback={handleSelectForPlayback}
            onRegenerate={handleRegenerateFromHistory}
            onDeleteItem={handleDeleteHistoryItem}
            onClearHistory={handleClearHistory}
          />
        )}

        {activeTab === 'about' && <AboutGuideView />}

        {activeTab === 'generator' && (
          <div className="space-y-8">
            {/* Top Hero Strip */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2">
              <div>
                <div className="inline-flex items-center gap-2 text-xs font-semibold text-purple-600 dark:text-purple-400 mb-1">
                  <Radio className="w-3.5 h-3.5 animate-pulse" />
                  <span>Ultra-Realistic Voice Message & TTS Generator</span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                  Craft Human-Like Speech & Intimate Voice Notes
                </h1>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
                  Engineered with close-microphone proximity, natural breathing, and native Bengali, English, and Hindi nuance.
                </p>
              </div>

              {/* Status / Quick Action */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsSampleModalOpen(true)}
                  className="px-3.5 py-2 text-xs font-semibold rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-purple-300 dark:hover:border-purple-600 shadow-xs transition-all"
                >
                  Browse Scripts
                </button>
                <button
                  type="button"
                  onClick={() => handleAuditionVoice()}
                  disabled={isPreviewing}
                  className="px-3.5 py-2 text-xs font-semibold rounded-xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800 text-purple-700 dark:text-purple-300 hover:bg-purple-100 dark:hover:bg-purple-900/50 shadow-xs transition-all flex items-center gap-1.5 disabled:opacity-50"
                >
                  {isPreviewing ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Auditioning...</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-3 h-3 fill-current" />
                      <span>Audition Voice</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Grid Layout: 2 Columns on Desktop */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Left Column (7 cols): Input & Voice Characteristics */}
              <div className="lg:col-span-7 space-y-6">
                {/* 1. Text Input Area */}
                <TextInputSection
                  text={text}
                  setText={setText}
                  language={language}
                  setLanguage={setLanguage}
                  onOpenSampleModal={() => setIsSampleModalOpen(true)}
                />

                {/* 2. Voice Gender, Age & Emotion Selectors */}
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs">
                  <VoiceSelector
                    gender={gender}
                    setGender={setGender}
                    age={age}
                    setAge={setAge}
                    style={style}
                    setStyle={setStyle}
                    onPreviewVoice={() => handleAuditionVoice()}
                    isPreviewing={isPreviewing}
                  />
                </div>

                {/* 3. Primary Generate Button */}
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={handleGenerateVoice}
                    disabled={isGenerating || !text.trim()}
                    className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-extrabold text-base shadow-lg shadow-purple-500/25 transition-all transform active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                  >
                    {isGenerating ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span>Synthesizing Realistic Speech...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-5 h-5" />
                        <span>Generate Voice Audio</span>
                      </>
                    )}
                  </button>

                  {isGenerating && generationProgress && (
                    <div className="mt-3 text-center">
                      <p className="text-xs font-mono text-purple-600 dark:text-purple-400 animate-pulse">
                        {generationProgress}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Right Column (5 cols): Settings & Active Audio Player */}
              <div className="lg:col-span-5 space-y-6">
                {/* Audio Player if generated */}
                {currentAudio ? (
                  <AudioPlayer
                    audioBase64={currentAudio.audioBase64}
                    durationSeconds={currentAudio.durationEstimateSeconds}
                    sampleRate={currentAudio.sampleRate}
                    voiceName={currentAudio.voiceName}
                    language={language}
                    gender={gender}
                    style={style}
                    textSnippet={text}
                    playbackSpeed={playbackSpeed}
                    onSpeedChange={setPlaybackSpeed}
                    onRegenerate={handleGenerateVoice}
                  />
                ) : (
                  <div className="bg-white dark:bg-slate-900 border border-dashed border-slate-300 dark:border-slate-800 rounded-2xl p-8 text-center space-y-3">
                    <div className="w-12 h-12 rounded-2xl bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 flex items-center justify-center mx-auto">
                      <Mic className="w-6 h-6" />
                    </div>
                    <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">
                      Audio Player Standby
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed max-w-xs mx-auto">
                      Type your script and click <strong>Generate Voice Audio</strong> to listen, adjust speed, and export high-fidelity MP3 and WAV files.
                    </p>
                  </div>
                )}

                {/* Voice & Acoustic Settings */}
                <VoiceSettings
                  speed={speed}
                  setSpeed={setSpeed}
                  pitch={pitch}
                  setPitch={setPitch}
                  volume={volume}
                  setVolume={setVolume}
                  clarity={clarity}
                  setClarity={setClarity}
                  closeMicEffect={closeMicEffect}
                  setCloseMicEffect={setCloseMicEffect}
                  addBreathing={addBreathing}
                  setAddBreathing={setAddBreathing}
                  onReset={handleResetSettings}
                />
              </div>
            </div>

            {/* Quick History Strip below the fold if items exist */}
            {history.length > 0 && (
              <div className="pt-6 border-t border-slate-200 dark:border-slate-800">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    Recent Voice Creations
                  </h3>
                  <button
                    onClick={() => setActiveTab('history')}
                    className="text-xs font-semibold text-purple-600 dark:text-purple-400 hover:underline"
                  >
                    View All ({history.length}) →
                  </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {history.slice(0, 3).map(item => (
                    <div
                      key={item.id}
                      onClick={() => handleSelectForPlayback(item)}
                      className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-purple-400 dark:hover:border-purple-600 cursor-pointer transition-all space-y-1.5"
                    >
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-slate-900 dark:text-white">
                          {item.voiceName} ({item.gender})
                        </span>
                        <span className="text-slate-400 dark:text-slate-500 font-mono">
                          {Math.round(item.duration)}s
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2">
                        "{item.text}"
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Sample Text Modal */}
      <SampleTextModal
        isOpen={isSampleModalOpen}
        onClose={() => setIsSampleModalOpen(false)}
        onSelectSample={(sampleText, langCode) => {
          setText(sampleText);
          if (langCode) setLanguage(langCode);
        }}
      />
    </div>
  );
}
