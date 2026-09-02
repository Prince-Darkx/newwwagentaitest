// Browser Speech Synthesis & Recognition Helper

export interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
  resultIndex: number;
}

export interface SpeechRecognitionResultList {
  length: number;
  item(index: number): SpeechRecognitionResult;
  [index: number]: SpeechRecognitionResult;
}

export interface SpeechRecognitionResult {
  isFinal: boolean;
  length: number;
  item(index: number): SpeechRecognitionAlternative;
  [index: number]: SpeechRecognitionAlternative;
}

export interface SpeechRecognitionAlternative {
  transcript: string;
  confidence: number;
}

export interface SpeechRecognitionInstance extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start: () => void;
  stop: () => void;
  abort: () => void;
  onstart: ((this: SpeechRecognitionInstance, ev: Event) => any) | null;
  onresult: ((this: SpeechRecognitionInstance, ev: SpeechRecognitionEvent) => any) | null;
  onerror: ((this: SpeechRecognitionInstance, ev: any) => any) | null;
  onend: ((this: SpeechRecognitionInstance, ev: Event) => any) | null;
}

export function isSpeechRecognitionSupported(): boolean {
  return typeof window !== 'undefined' && ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window);
}

export function createSpeechRecognition(): SpeechRecognitionInstance | null {
  if (typeof window === 'undefined') return null;
  const SpeechRecognitionClass = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
  if (!SpeechRecognitionClass) return null;
  const recognition = new SpeechRecognitionClass() as SpeechRecognitionInstance;
  recognition.continuous = false;
  recognition.interimResults = true;
  return recognition;
}

export function speakText(
  text: string,
  options?: {
    lang?: string;
    rate?: number;
    pitch?: number;
    voiceName?: string;
    onStart?: () => void;
    onEnd?: () => void;
    onError?: (e: any) => void;
  }
): SpeechSynthesisUtterance | null {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    options?.onEnd?.();
    return null;
  }

  // Cancel any ongoing speech
  window.speechSynthesis.cancel();

  // Clean text from any special symbols
  const clean = text
    .replace(/[*#_`~]/g, '')
    .replace(/\s+/g, ' ')
    .trim();

  if (!clean) {
    options?.onEnd?.();
    return null;
  }

  const utterance = new SpeechSynthesisUtterance(clean);
  utterance.lang = options?.lang || 'en-US';
  utterance.rate = options?.rate || 1.0;
  utterance.pitch = options?.pitch || 1.0;

  const voices = window.speechSynthesis.getVoices();
  if (voices && voices.length > 0) {
    // Try to find natural female or English voice
    let selectedVoice = voices.find(v => v.lang.startsWith(utterance.lang.substring(0, 2)) && (v.name.includes('Google') || v.name.includes('Natural') || v.name.includes('Samantha') || v.name.includes('Zira') || v.name.includes('Female')));
    if (!selectedVoice) {
      selectedVoice = voices.find(v => v.lang.startsWith(utterance.lang.substring(0, 2)));
    }
    if (selectedVoice) {
      utterance.voice = selectedVoice;
    }
  }

  utterance.onstart = () => {
    options?.onStart?.();
  };

  utterance.onend = () => {
    options?.onEnd?.();
  };

  utterance.onerror = (e) => {
    console.warn('Speech synthesis error:', e);
    options?.onError?.(e);
    options?.onEnd?.();
  };

  try {
    window.speechSynthesis.speak(utterance);
  } catch (e) {
    console.warn('speak failed:', e);
    options?.onEnd?.();
  }

  return utterance;
}

export function stopSpeaking() {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
}

// Generate Sound Wave simulation data for visualizers
export function generateWaveformLevels(active: boolean, seed: number = 0): number[] {
  if (!active) {
    return [0.15, 0.2, 0.15, 0.25, 0.18, 0.22, 0.15, 0.2, 0.18, 0.25, 0.15, 0.2];
  }
  const bars = 16;
  const result: number[] = [];
  for (let i = 0; i < bars; i++) {
    const val = 0.25 + 0.65 * Math.abs(Math.sin((seed * 0.2) + i * 0.5));
    result.push(Number(val.toFixed(2)));
  }
  return result;
}
