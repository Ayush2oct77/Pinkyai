// Voice Assistant Engine supporting Multilingual Speech-to-Text & Text-to-Speech (English & Hindi)

export type VoiceLanguage = 'en-US' | 'hi-IN';

export class VoiceAssistantEngine {
  private recognition: any = null;
  private isListening = false;
  private onResultCallback: ((transcript: string, isFinal: boolean) => void) | null = null;
  private onStateChangeCallback: ((listening: boolean) => void) | null = null;
  private languageSubscribers: Set<(lang: VoiceLanguage) => void> = new Set();
  private availableVoices: SpeechSynthesisVoice[] = [];

  public voiceSpeed = 1.0;
  public voicePitch = 1.1; // Futuristic tone for Pinky
  public currentLanguage: VoiceLanguage = 'hi-IN'; // Default to Hindi as requested

  constructor() {
    this.initVoices();
    this.initRecognition();
  }

  private initVoices() {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;

    const loadVoices = () => {
      this.availableVoices = window.speechSynthesis.getVoices();
    };

    loadVoices();
    if (window.speechSynthesis.onvoiceschanged !== undefined) {
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }
  }

  public subscribeLanguage(callback: (lang: VoiceLanguage) => void): () => void {
    this.languageSubscribers.add(callback);
    return () => this.languageSubscribers.delete(callback);
  }

  public setLanguage(lang: VoiceLanguage) {
    if (this.currentLanguage === lang) return;
    this.currentLanguage = lang;

    const wasListening = this.isListening;
    if (this.recognition) {
      if (wasListening) {
        try {
          this.recognition.stop();
        } catch {
          // ignore
        }
      }
      this.recognition.lang = lang;
      if (wasListening) {
        setTimeout(() => {
          try {
            this.recognition.start();
          } catch {
            // ignore
          }
        }, 150);
      }
    }

    // Notify all UI subscribers
    this.languageSubscribers.forEach((cb) => cb(lang));
  }

  private initRecognition() {
    if (typeof window === 'undefined') return;

    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (SpeechRecognition) {
      try {
        this.recognition = new SpeechRecognition();
        this.recognition.continuous = true;
        this.recognition.interimResults = true;
        this.recognition.lang = this.currentLanguage;

        this.recognition.onstart = () => {
          this.isListening = true;
          this.onStateChangeCallback?.(true);
        };

        this.recognition.onend = () => {
          this.isListening = false;
          this.onStateChangeCallback?.(false);
        };

        this.recognition.onresult = (event: any) => {
          let interimTranscript = '';
          let finalTranscript = '';

          for (let i = event.resultIndex; i < event.results.length; ++i) {
            if (event.results[i].isFinal) {
              finalTranscript += event.results[i][0].transcript;
            } else {
              interimTranscript += event.results[i][0].transcript;
            }
          }

          const transcript = finalTranscript || interimTranscript;
          if (transcript) {
            this.onResultCallback?.(transcript, Boolean(finalTranscript));
          }
        };

        this.recognition.onerror = (err: any) => {
          console.warn('Speech recognition status:', err.error);
          this.isListening = false;
          this.onStateChangeCallback?.(false);
        };
      } catch (e) {
        console.warn('SpeechRecognition initialization error:', e);
      }
    }
  }

  public isSupported(): boolean {
    return Boolean(this.recognition);
  }

  public startListening(
    onResult: (transcript: string, isFinal: boolean) => void,
    onStateChange: (listening: boolean) => void,
    lang?: VoiceLanguage
  ) {
    if (lang && lang !== this.currentLanguage) {
      this.setLanguage(lang);
    }
    this.onResultCallback = onResult;
    this.onStateChangeCallback = onStateChange;

    if (!this.recognition) {
      this.isListening = true;
      onStateChange(true);
      return;
    }

    try {
      this.recognition.lang = this.currentLanguage;
      this.recognition.start();
    } catch (e) {
      console.warn('Recognition start exception:', e);
    }
  }

  public stopListening() {
    this.isListening = false;
    this.onStateChangeCallback?.(false);
    if (this.recognition) {
      try {
        this.recognition.stop();
      } catch {
        // Ignore
      }
    }
  }

  public speak(text: string, onEnd?: () => void, customLang?: VoiceLanguage) {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;

    window.speechSynthesis.cancel();

    const targetLang = customLang || this.currentLanguage;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = this.voiceSpeed;
    utterance.pitch = this.voicePitch;
    utterance.lang = targetLang;

    // Detect if text contains Hindi Devanagari characters or target is hi-IN
    const hasDevanagari = /[\u0900-\u097F]/.test(text);
    const isHindi = targetLang === 'hi-IN' || hasDevanagari;

    const voices = this.availableVoices.length > 0 ? this.availableVoices : window.speechSynthesis.getVoices();

    if (isHindi) {
      utterance.lang = 'hi-IN';
      // Find dedicated Hindi voice
      const hindiVoice = voices.find(
        (v) =>
          v.lang.toLowerCase().replace('_', '-').startsWith('hi') ||
          v.name.includes('Hindi') ||
          v.name.includes('हिन्दी') ||
          v.name.includes('Lekha') ||
          v.name.includes('Swara') ||
          v.name.includes('Madhur') ||
          v.name.includes('Google हिन्दी')
      );
      if (hindiVoice) {
        utterance.voice = hindiVoice;
      }
    } else {
      utterance.lang = 'en-US';
      const preferredEnglishVoice = voices.find(
        (v) =>
          v.lang.toLowerCase().startsWith('en') &&
          (v.name.includes('Female') ||
            v.name.includes('Natural') ||
            v.name.includes('Google') ||
            v.name.includes('Samantha') ||
            v.name.includes('Zira'))
      ) || voices.find((v) => v.lang.toLowerCase().startsWith('en'));

      if (preferredEnglishVoice) {
        utterance.voice = preferredEnglishVoice;
      }
    }

    if (onEnd) {
      utterance.onend = () => onEnd();
      utterance.onerror = () => onEnd();
    }

    window.speechSynthesis.speak(utterance);
  }

  public stopSpeaking() {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
  }

  public getAvailableHindiVoices(): SpeechSynthesisVoice[] {
    const voices = this.availableVoices.length > 0 ? this.availableVoices : window.speechSynthesis?.getVoices() || [];
    return voices.filter(
      (v) =>
        v.lang.toLowerCase().replace('_', '-').startsWith('hi') ||
        v.name.includes('Hindi') ||
        v.name.includes('हिन्दी')
    );
  }
}

export const voiceEngine = new VoiceAssistantEngine();
