export {};

declare global {
  interface SpeechRecognitionAlternativeLike {
    transcript: string;
    confidence: number;
  }

  interface SpeechRecognitionResultLike {
    readonly length: number;
    isFinal: boolean;
    [index: number]: SpeechRecognitionAlternativeLike;
  }

  interface SpeechRecognitionEventLike extends Event {
    results: ArrayLike<SpeechRecognitionResultLike>;
  }

  interface SpeechRecognitionErrorEventLike extends Event {
    error: string;
  }

  interface SpeechRecognitionLike extends EventTarget {
    lang: string;
    continuous: boolean;
    interimResults: boolean;
    onresult: ((event: SpeechRecognitionEventLike) => void) | null;
    onerror: ((event: SpeechRecognitionErrorEventLike) => void) | null;
    onend: (() => void) | null;
    start(): void;
    stop(): void;
  }

  interface Window {
    SpeechRecognition?: new () => SpeechRecognitionLike;
    webkitSpeechRecognition?: new () => SpeechRecognitionLike;
  }
}
