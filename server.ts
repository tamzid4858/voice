import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: '20mb' }));

// Server-side Google GenAI initialization with User-Agent telemetry
const apiKey = process.env.GEMINI_API_KEY || '';
let ai: GoogleGenAI | null = null;
if (apiKey) {
  ai = new GoogleGenAI({
    apiKey: apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// Map voices based on gender and age
function selectGeminiVoice(gender: string, age: string, explicitVoice?: string): 'Puck' | 'Charon' | 'Kore' | 'Fenrir' | 'Zephyr' | 'Aoede' {
  if (explicitVoice && ['Puck', 'Charon', 'Kore', 'Fenrir', 'Zephyr', 'Aoede'].includes(explicitVoice)) {
    return explicitVoice as any;
  }
  if (gender === 'female') {
    switch (age) {
      case 'child':
      case 'teen':
        return 'Zephyr'; // energetic, youthful, bright
      case 'elderly':
        return 'Aoede'; // gentle, warm, mature
      case 'young_adult':
      case 'adult':
      default:
        return 'Kore'; // natural, warm, conversational, intimate
    }
  } else {
    switch (age) {
      case 'child':
      case 'teen':
        return 'Puck'; // youthful, expressive, clear
      case 'elderly':
        return 'Fenrir'; // deep, seasoned, authoritative
      case 'young_adult':
      case 'adult':
      default:
        return 'Charon'; // warm, close-mic, intimate personal voice
    }
  }
}

// Build contextual style description with close-mic WhatsApp voice note effect
function buildSpeechStylePrompt(params: {
  gender: string;
  age: string;
  style: string;
  language?: string;
  closeMicEffect?: boolean;
  addBreathing?: boolean;
}): string {
  const { gender, age, style, language, closeMicEffect = true, addBreathing = true } = params;

  const styleDescriptions: Record<string, string> = {
    natural: 'conversational, casual, easygoing, and completely unhurried',
    professional: 'clear, articulate, confident, and polished yet approachable',
    friendly: 'warm, welcoming, smiling through the voice, and cheerful',
    storytelling: 'expressive, captivating, immersive pacing with dramatic natural pauses',
    news: 'informative, steady, crisp diction, trustworthy presentation',
    narrator: 'rich, steady cadence, evocative and engrossing delivery',
    emotional: 'deeply heartfelt, authentic feeling, sensitive and resonant inflection',
    sad: 'somber, tender, soft-spoken, vulnerable, gentle melancholic sighs',
    happy: 'upbeat, joyful, bright, enthusiastic, smiling articulation',
    angry: 'intense, urgent, firm conviction, heightened emotional intensity',
    whispering: 'soft, intimate whisper, hushed close-proximity secret tone',
    motivational: 'inspirational, uplifting, passionate, energetic, encouraging',
  };

  const ageDescriptions: Record<string, string> = {
    child: 'a young child speaking enthusiastically',
    teen: 'a modern teenager with relaxed natural rhythm',
    young_adult: 'a vibrant young adult with natural clarity',
    adult: 'a mature adult with warm grounded presence',
    elderly: 'a gentle elder with rich wisdom and soft steady cadence',
  };

  const styleText = styleDescriptions[style] || styleDescriptions.natural;
  const ageText = ageDescriptions[age] || ageDescriptions.adult;

  let micEffect = '';
  if (closeMicEffect) {
    micEffect = 'RECORDING STYLE: Speaking directly into a close mobile microphone, exactly like a personal WhatsApp voice message or voicemail note to a dear friend. Warm proximity effect, intimate presence, crisp diction with zero room echo and no studio artificiality.';
  }

  let breathingNote = '';
  if (addBreathing) {
    breathingNote = 'Include subtle, organic breathing sounds before phrases, realistic micro-pauses at punctuation, and natural human vocal dynamics.';
  }

  let langNote = '';
  if (language === 'bn' || language === 'Bangla') {
    langNote = 'LANGUAGE REQUIREMENT: Native Bangla (বাংলা) pronunciation with authentic Bengali cadence, sweet melodic tone, and genuine colloquial naturalness.';
  } else if (language === 'hi' || language === 'Hindi') {
    langNote = 'LANGUAGE REQUIREMENT: Native Hindi (हिंदी) pronunciation with pure diction, warmth, and natural colloquial phrasing.';
  }

  return `Speaker Persona: ${gender} voice of ${ageText}. Delivery Style: ${styleText}. ${micEffect} ${breathingNote} ${langNote}`.trim();
}

// Split long text into natural punctuation-aware chunks
function splitTextIntoChunks(text: string, maxChunkLength = 350): string[] {
  const clean = text.trim();
  if (!clean) return [];
  if (clean.length <= maxChunkLength) return [clean];

  // Split on paragraphs first
  const paragraphs = clean.split(/\n+/);
  const chunks: string[] = [];

  for (const para of paragraphs) {
    const pTrim = para.trim();
    if (!pTrim) continue;

    if (pTrim.length <= maxChunkLength) {
      chunks.push(pTrim);
      continue;
    }

    // Split on sentence terminators (. ! ? । etc.)
    const sentenceMatches = pTrim.match(/[^.!?।\n]+[.!?।]+|[^.!?।\n]+$/g) || [pTrim];
    let currentChunk = '';

    for (const sentence of sentenceMatches) {
      const sTrim = sentence.trim();
      if (!sTrim) continue;

      if ((currentChunk + ' ' + sTrim).trim().length <= maxChunkLength) {
        currentChunk = (currentChunk + ' ' + sTrim).trim();
      } else {
        if (currentChunk) chunks.push(currentChunk);

        // If a single sentence exceeds maxChunkLength, split by commas/semicolons
        if (sTrim.length > maxChunkLength) {
          const subClauses = sTrim.split(/([,;:]\s*)/);
          let subChunk = '';
          for (const clause of subClauses) {
            if ((subChunk + clause).length <= maxChunkLength) {
              subChunk += clause;
            } else {
              if (subChunk.trim()) chunks.push(subChunk.trim());
              subChunk = clause;
            }
          }
          if (subChunk.trim()) currentChunk = subChunk.trim();
          else currentChunk = '';
        } else {
          currentChunk = sTrim;
        }
      }
    }

    if (currentChunk.trim()) {
      chunks.push(currentChunk.trim());
    }
  }

  return chunks.filter(c => c.length > 0);
}

// Build standard 44-byte WAV header
function buildWavHeader(dataLength: number, sampleRate = 24000, numChannels = 1, bitsPerSample = 16): Buffer {
  const header = Buffer.alloc(44);
  header.write('RIFF', 0);
  header.writeUInt32LE(36 + dataLength, 4);
  header.write('WAVE', 8);
  header.write('fmt ', 12);
  header.writeUInt32LE(16, 16); // Subchunk1Size
  header.writeUInt16LE(1, 20); // PCM format
  header.writeUInt16LE(numChannels, 22);
  header.writeUInt32LE(sampleRate, 24);
  header.writeUInt32LE(sampleRate * numChannels * (bitsPerSample / 8), 28); // ByteRate
  header.writeUInt16LE(numChannels * (bitsPerSample / 8), 32); // BlockAlign
  header.writeUInt16LE(bitsPerSample, 34);
  header.write('data', 36);
  header.writeUInt32LE(dataLength, 40);
  return header;
}

// Concatenate multiple WAV buffers into one unified WAV
function concatenateWavBuffers(wavBuffers: Buffer[]): Buffer {
  if (wavBuffers.length === 0) return Buffer.alloc(0);
  if (wavBuffers.length === 1) return wavBuffers[0];

  const pcmList: Buffer[] = [];
  let totalPcmLength = 0;

  for (const buf of wavBuffers) {
    if (buf.length > 44) {
      // Find 'data' chunk offset or default to 44
      let dataOffset = 44;
      const dataIdx = buf.indexOf('data');
      if (dataIdx !== -1 && dataIdx + 8 <= buf.length) {
        dataOffset = dataIdx + 8;
      }
      const pcmData = buf.subarray(dataOffset);
      pcmList.push(pcmData);
      totalPcmLength += pcmData.length;
    }
  }

  const sampleRate = 24000;
  const header = buildWavHeader(totalPcmLength, sampleRate, 1, 16);
  return Buffer.concat([header, ...pcmList]);
}

// API: Health / Secret status
app.get('/api/health', (req, res) => {
  const hasKey = Boolean(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY.trim().length > 0);
  res.json({
    status: 'ok',
    hasApiKey: hasKey,
    model: 'gemini-3.8-flash-lite-tts',
    appName: 'VoiceCraft AI',
  });
});

// API: Quick Voice Preview
app.post('/api/tts/preview', async (req, res) => {
  try {
    if (!ai) {
      return res.status(500).json({
        error: 'Gemini API key is not configured. Please check Settings > Secrets.',
      });
    }

    const {
      gender = 'female',
      age = 'adult',
      style = 'natural',
      language = 'en',
      voiceName,
    } = req.body;

    const selectedVoice = selectGeminiVoice(gender, age, voiceName);
    const stylePrompt = buildSpeechStylePrompt({
      gender,
      age,
      style,
      language,
      closeMicEffect: true,
      addBreathing: true,
    });

    let previewPhrase = "Hey there! This is how I sound right now. How do you like this voice?";
    if (language === 'bn' || language === 'Bangla') {
      previewPhrase = "হ্যালো! শুনুন, এটা আমার আসল কণ্ঠস্বর। কেমন লাগছে আপনার?";
    } else if (language === 'hi' || language === 'Hindi') {
      previewPhrase = "नमस्ते! सुनिए, यह मेरी आवाज़ है। आपको यह अंदाज़ कैसा लगा?";
    }

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash-lite-tts',
      contents: [
        {
          role: 'user',
          parts: [
            {
              text: previewPhrase,
              speechMetadata: {
                style: stylePrompt,
              },
            },
          ],
        },
      ],
      config: {
        responseModalities: ['AUDIO'],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: selectedVoice },
          },
        },
      },
    });

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    if (!base64Audio) {
      throw new Error('No audio data received from Gemini TTS.');
    }

    res.json({
      audioBase64: base64Audio,
      voiceName: selectedVoice,
      phrase: previewPhrase,
    });
  } catch (error: any) {
    console.error('Preview TTS error:', error);
    res.status(500).json({
      error: error?.message || 'Failed to generate voice preview.',
    });
  }
});

// API: Full Text-to-Speech generation with chunking and audio stitching
app.post('/api/tts/generate', async (req, res) => {
  try {
    if (!ai) {
      return res.status(500).json({
        error: 'Gemini API key is missing. Please ensure your API key is configured in Settings > Secrets.',
      });
    }

    const {
      text,
      gender = 'female',
      age = 'adult',
      style = 'natural',
      language = 'en',
      voiceName,
      closeMicEffect = true,
      addBreathing = true,
    } = req.body;

    if (!text || typeof text !== 'string' || !text.trim()) {
      return res.status(400).json({ error: 'Please provide valid text to synthesize.' });
    }

    const trimmedText = text.trim();
    const selectedVoice = selectGeminiVoice(gender, age, voiceName);
    const stylePrompt = buildSpeechStylePrompt({
      gender,
      age,
      style,
      language,
      closeMicEffect,
      addBreathing,
    });

    // Chunk text for seamless long text handling
    const chunks = splitTextIntoChunks(trimmedText, 350);
    console.log(`[TTS] Synthesizing ${trimmedText.length} chars across ${chunks.length} chunks with voice ${selectedVoice}...`);

    const wavBuffers: Buffer[] = [];

    // Synthesize each chunk
    for (let i = 0; i < chunks.length; i++) {
      const chunkText = chunks[i];
      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash-lite-tts',
        contents: [
          {
            role: 'user',
            parts: [
              {
                text: chunkText,
                speechMetadata: {
                  style: stylePrompt,
                },
              },
            ],
          },
        ],
        config: {
          responseModalities: ['AUDIO'],
          speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: { voiceName: selectedVoice },
            },
          },
        },
      });

      const chunkBase64 = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
      if (!chunkBase64) {
        throw new Error(`Failed synthesizing audio chunk ${i + 1}/${chunks.length}.`);
      }
      wavBuffers.push(Buffer.from(chunkBase64, 'base64'));
    }

    // Seamlessly concatenate WAV chunks
    const masterWav = concatenateWavBuffers(wavBuffers);
    const masterBase64 = masterWav.toString('base64');

    // Estimate duration based on PCM bytes: 24000 samples/sec * 1 channel * 2 bytes/sample = 48000 bytes/sec
    const pcmLength = masterWav.length > 44 ? masterWav.length - 44 : 0;
    const durationSeconds = Math.round((pcmLength / 48000) * 10) / 10;

    res.json({
      audioBase64: masterBase64,
      mimeType: 'audio/wav',
      durationEstimateSeconds: durationSeconds,
      charCount: trimmedText.length,
      chunkCount: chunks.length,
      voiceName: selectedVoice,
      sampleRate: 24000,
    });
  } catch (error: any) {
    console.error('TTS Generation error:', error);
    res.status(500).json({
      error: error?.message || 'Text-to-Speech generation failed. Please try again.',
    });
  }
});

// API: Server-side WAV to MP3 conversion
app.post('/api/tts/convert-mp3', async (req, res) => {
  try {
    const { audioBase64 } = req.body;
    if (!audioBase64) {
      return res.status(400).json({ error: 'Missing audioBase64 payload.' });
    }
    const { Mp3Encoder } = await import('@breezystack/lamejs');
    const wavBuffer = Buffer.from(audioBase64, 'base64');

    let channels = 1;
    let sampleRate = 24000;
    let dataOffset = 44;

    if (wavBuffer.length > 44) {
      channels = wavBuffer.readUInt16LE(22);
      sampleRate = wavBuffer.readUInt32LE(24);
      const dataIdx = wavBuffer.indexOf('data');
      if (dataIdx !== -1 && dataIdx + 8 <= wavBuffer.length) {
        dataOffset = dataIdx + 8;
      }
    }

    const pcmBytes = wavBuffer.subarray(dataOffset);
    const int16Samples = new Int16Array(
      pcmBytes.buffer,
      pcmBytes.byteOffset,
      Math.floor(pcmBytes.length / 2)
    );

    const encoder = new Mp3Encoder(channels, sampleRate, 128);
    const mp3Chunks: Buffer[] = [];
    const blockSize = 1152;

    for (let i = 0; i < int16Samples.length; i += blockSize) {
      const chunk = int16Samples.subarray(i, i + blockSize);
      const encChunk = encoder.encodeBuffer(chunk);
      if (encChunk.length > 0) {
        mp3Chunks.push(Buffer.from(encChunk));
      }
    }
    const flushed = encoder.flush();
    if (flushed.length > 0) {
      mp3Chunks.push(Buffer.from(flushed));
    }

    const mp3Buffer = Buffer.concat(mp3Chunks);
    res.setHeader('Content-Type', 'audio/mp3');
    res.send(mp3Buffer);
  } catch (err: any) {
    console.error('Server MP3 conversion error:', err);
    res.status(500).json({ error: err?.message || 'Failed converting audio to MP3' });
  }
});

// Vite middleware or static serving
async function setupServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, () => {
    console.log(`VoiceCraft AI server running on http://0.0.0.0:${PORT}`);
  });
}

setupServer().catch(err => {
  console.error('Server startup failed:', err);
  process.exit(1);
});
