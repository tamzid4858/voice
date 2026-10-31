export type VoiceGender = 'male' | 'female';

export type VoiceAge = 'child' | 'teen' | 'young_adult' | 'adult' | 'elderly';

export type VoiceStyle = 
  | 'natural'
  | 'professional'
  | 'friendly'
  | 'storytelling'
  | 'news'
  | 'narrator'
  | 'emotional'
  | 'sad'
  | 'happy'
  | 'angry'
  | 'whispering'
  | 'motivational';

export type VoicePreset = {
  id: string;
  name: string;
  gender: VoiceGender;
  age: VoiceAge;
  geminiVoice: 'Puck' | 'Charon' | 'Kore' | 'Fenrir' | 'Zephyr' | 'Aoede';
  description: string;
  avatarTone: string;
  languages: string[];
};

export interface TTSRequest {
  text: string;
  gender: VoiceGender;
  age: VoiceAge;
  style: VoiceStyle;
  language?: string;
  speed?: number; // 0.5 to 2.0 (default 1.0)
  pitch?: number; // -10 to +10 (default 0)
  volume?: number; // 0 to 100 (default 100)
  clarity?: number; // 0 to 100 (intimate close-mic vs crisp studio)
  closeMicEffect?: boolean; // WhatsApp / close-mic effect
  addBreathing?: boolean;
  selectedVoiceName?: string;
}

export interface TTSResponse {
  audioBase64: string; // complete WAV audio base64
  mimeType: string;
  durationEstimateSeconds: number;
  charCount: number;
  chunkCount: number;
  voiceName: string;
  sampleRate: number;
}

export interface GenerationHistoryItem {
  id: string;
  text: string;
  language: string;
  gender: VoiceGender;
  age: VoiceAge;
  style: VoiceStyle;
  voiceName: string;
  timestamp: number;
  audioBase64: string;
  duration: number;
  fileName: string;
}
