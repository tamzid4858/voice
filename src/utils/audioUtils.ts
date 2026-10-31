import { Mp3Encoder } from '@breezystack/lamejs';

// Convert base64 data to Blob
export function base64ToBlob(base64: string, mimeType = 'audio/wav'): Blob {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return new Blob([bytes], { type: mimeType });
}

// Convert base64 string to ArrayBuffer
export function base64ToArrayBuffer(base64: string): ArrayBuffer {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes.buffer;
}

// Decode WAV ArrayBuffer into AudioBuffer using Web Audio API
export async function decodeWavToAudioBuffer(arrayBuffer: ArrayBuffer): Promise<AudioBuffer> {
  const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
  const bufferCopy = arrayBuffer.slice(0);
  const decoded = await audioCtx.decodeAudioData(bufferCopy);
  await audioCtx.close();
  return decoded;
}

// Convert 16-bit PCM WAV to MP3 using @breezystack/lamejs with automatic server-side fallback
export async function convertWavToMp3Blob(
  wavArrayBuffer: ArrayBuffer,
  audioBase64Fallback?: string
): Promise<Blob> {
  try {
    const wavBytes = new Uint8Array(wavArrayBuffer);
    const view = new DataView(wavArrayBuffer);
    let channels = 1;
    let sampleRate = 24000;
    let dataOffset = 44;

    try {
      channels = view.getUint16(22, true);
      sampleRate = view.getUint32(24, true);

      // Find data chunk
      for (let i = 12; i < wavBytes.length - 8; i++) {
        if (
          wavBytes[i] === 0x64 && // 'd'
          wavBytes[i + 1] === 0x61 && // 'a'
          wavBytes[i + 2] === 0x74 && // 't'
          wavBytes[i + 3] === 0x61 // 'a'
        ) {
          dataOffset = i + 8;
          break;
        }
      }
    } catch (err) {
      console.warn('Could not parse WAV header fully, using standard 24kHz mono defaults:', err);
    }

    // Get raw 16-bit PCM samples
    const pcmBytes = wavArrayBuffer.slice(dataOffset);
    const sampleCount = Math.floor(pcmBytes.byteLength / 2);
    const samples = new Int16Array(pcmBytes, 0, sampleCount);

    const mp3encoder = new Mp3Encoder(channels, sampleRate, 128); // 128 kbps
    const mp3Data: Uint8Array[] = [];
    const sampleBlockSize = 1152;

    for (let i = 0; i < samples.length; i += sampleBlockSize) {
      const chunk = samples.subarray(i, i + sampleBlockSize);
      const mp3buf = mp3encoder.encodeBuffer(chunk);
      if (mp3buf.length > 0) {
        mp3Data.push(new Uint8Array(mp3buf.buffer, mp3buf.byteOffset, mp3buf.length));
      }
    }

    const endBuf = mp3encoder.flush();
    if (endBuf.length > 0) {
      mp3Data.push(new Uint8Array(endBuf.buffer, endBuf.byteOffset, endBuf.length));
    }

    if (mp3Data.length > 0) {
      return new Blob(mp3Data as any, { type: 'audio/mp3' });
    }
    throw new Error('Empty MP3 data generated.');
  } catch (clientErr) {
    console.warn('Client-side MP3 conversion encountered an issue, trying server-side conversion...', clientErr);

    // Fallback: call server endpoint
    let b64 = audioBase64Fallback;
    if (!b64) {
      const uint8 = new Uint8Array(wavArrayBuffer);
      let binary = '';
      for (let i = 0; i < uint8.length; i++) {
        binary += String.fromCharCode(uint8[i]);
      }
      b64 = btoa(binary);
    }

    const resp = await fetch('/api/tts/convert-mp3', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ audioBase64: b64 }),
    });

    if (!resp.ok) {
      throw new Error('MP3 conversion failed.');
    }
    return await resp.blob();
  }
}

// Trigger browser download for a blob
export function triggerDownload(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

// Format seconds into MM:SS
export function formatAudioTime(seconds: number): string {
  if (isNaN(seconds) || seconds < 0) return '0:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

// Sample texts categorized by language and genre
export interface SampleTextItem {
  id: string;
  language: string;
  langCode: string;
  title: string;
  category: 'Voice Message' | 'Conversational' | 'Story' | 'Professional' | 'Motivational';
  text: string;
}

export const SAMPLE_TEXTS: SampleTextItem[] = [
  {
    id: 'bn-voice-msg-1',
    language: 'Bangla (বাংলা)',
    langCode: 'bn',
    title: 'প্রিয় মানুষের কাছে ভয়েস মেসেজ',
    category: 'Voice Message',
    text: 'শুনছো? আমি এইমাত্র অফিস থেকে বের হলাম। বাইরে হালকা বাতাস আর কী চমৎকার মিষ্টি রোদ! আসার সময় তোমার পছন্দের মিষ্টি নিয়ে আসছি। দশ মিনিটের মধ্যেই পৌঁছাবো, সাবধানে থেকো কেমন?',
  },
  {
    id: 'bn-story-1',
    language: 'Bangla (বাংলা)',
    langCode: 'bn',
    title: 'গ্রামের সন্ধ্যার গল্প',
    category: 'Story',
    text: 'সূর্যটা যখন পদ্মার ওপারে ধীরে ধীরে ডুবে যাচ্ছিল, রক্তিম আভায় চারপাশ যেন এক মায়াবী আলোয় ভরে উঠল। দূরে মেঠোপথ ধরে হেঁটে আসছিল রাখাল বালক, হাতে তার বাশের বাঁশি।',
  },
  {
    id: 'en-voice-msg-1',
    language: 'English',
    langCode: 'en',
    title: 'Quick WhatsApp Voice Note',
    category: 'Voice Message',
    text: 'Hey! Just leaving the studio now. Honestly, today was such a breakthrough on the project. I cannot wait to show you the progress. Give me a call as soon as you get this, talk soon!',
  },
  {
    id: 'en-motivational-1',
    language: 'English',
    langCode: 'en',
    title: 'Morning Motivation',
    category: 'Motivational',
    text: 'Every single morning is a brand new canvas. Forget about yesterday’s doubts. Focus on what you can build today, step by step, with courage and steady focus.',
  },
  {
    id: 'en-professional-1',
    language: 'English',
    langCode: 'en',
    title: 'Executive Update',
    category: 'Professional',
    text: 'Good afternoon, team. We have successfully completed phase one ahead of schedule. The preliminary feedback from our test group shows high customer satisfaction and outstanding system stability.',
  },
  {
    id: 'hi-voice-msg-1',
    language: 'Hindi (हिंदी)',
    langCode: 'hi',
    title: 'व्हाट्सएप वॉइस मैसेज',
    category: 'Voice Message',
    text: 'अरे सुनो! मैं अभी रास्ते में हूँ और ट्रैफिक थोड़ा ज़्यादा है। करीब पंद्रह मिनट में पहुँचता हूँ। गरमा-गरम चाय तैयार रखना, बहुत ज़रूरी बात करनी है!',
  },
  {
    id: 'hi-story-1',
    language: 'Hindi (हिंदी)',
    langCode: 'hi',
    title: 'पहाड़ों की सुबह',
    category: 'Story',
    text: 'सुबह की पहली किरण जब बर्फीली चोटियों पर पड़ी, तो पूरा आसमान सुनहरे रंग में रंग गया। ठंडी हवा में देवदार के पेड़ों की खुशबू एक नई ताजगी भर रही थी।',
  },
];
