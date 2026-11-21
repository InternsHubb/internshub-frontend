import { useEffect, useState } from 'react';

// The interviewer reads each question (and the closing text) aloud as soon as it is shown:
// - With audioBase64, a new <audio> element plays it. The element is handed to the 3D avatar first,
//   so its lip sync is attached before playback starts.
// - Without audio, window.speechSynthesis speaks it sentence by sentence (Chrome stops a single
//   utterance after about 15 s), in ar-SA when the text has Arabic script, else en-US.
// - If neither can play (autoplay blocked, no matching voice, an error), the question stays on
//   screen for a reading delay instead.
// `spoken` turns true when the reading is over, on any error, or after a safety timeout, so the
// recording that waits for it can never be held up for good. Pausing (enabled = false), a new
// question and unmounting stop the audio and cancel the speech; after a pause, a question that
// wasn't finished is read again.

const READING_DELAY_MS = 2500;
const READING_MS_PER_WORD = 60;
// Audio: its duration plus this margin. Speech: at least SPEECH_SAFETY_MS, longer for long texts.
const AUDIO_SAFETY_MARGIN_MS = 2000;
const AUDIO_SAFETY_BEFORE_METADATA_MS = 20000;
const SPEECH_SAFETY_MS = 20000;
const SPEECH_SAFETY_MS_PER_WORD = 400;
const VOICES_WAIT_MS = 1000;
// Lets the avatar attach its lip sync to the new element before it plays.
const PLAY_DELAY_MS = 60;

const ARABIC_SCRIPT = /[؀-ۿݐ-ݿࢠ-ࣿ]/;
const SILENT_WAV = 'data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEAQB8AAIA+AAACABAAZGF0YQAAAAA=';

export type SpeechSource = {
  // Changes for every new text to read; null when there is nothing to read.
  id: string | null;
  text: string;
  audioBase64: string | null;
  audioMimeType: string | null;
  enabled: boolean;
};

export type QuestionSpeech = {
  spoken: boolean;
  audioElement: HTMLAudioElement | null;
  speakingWithoutAudio: boolean;
};

function wordCount(text: string) {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

function readingDelay(text: string) {
  return READING_DELAY_MS + wordCount(text) * READING_MS_PER_WORD;
}

function speechApi(): SpeechSynthesis | null {
  return typeof window !== 'undefined' && 'speechSynthesis' in window ? window.speechSynthesis : null;
}

function sentences(text: string): string[] {
  return text
    .split(/(?<=[.!?؟])\s+|\n+/)
    .map((part) => part.trim())
    .filter(Boolean);
}

function voiceFor(synth: SpeechSynthesis, lang: string): SpeechSynthesisVoice | undefined {
  const prefix = lang.slice(0, 2).toLowerCase();
  const voices = synth.getVoices();
  return (
    voices.find((voice) => voice.lang.replace('_', '-').toLowerCase() === lang.toLowerCase()) ??
    voices.find((voice) => voice.lang.toLowerCase().startsWith(prefix))
  );
}

/**
 * Call from the Start Interview click: plays a silent clip inside the user gesture and warms the
 * voice list, so the questions can be read aloud later without a play button.
 */
export function unlockInterviewAudio() {
  try {
    const clip = new Audio(SILENT_WAV);
    void clip.play().catch(() => undefined);
  } catch {
    // No audio support: the questions fall back to the reading delay.
  }
  speechApi()?.getVoices();
}

export function useQuestionSpeech({ id, text, audioBase64, audioMimeType, enabled }: SpeechSource): QuestionSpeech {
  const [spokenId, setSpokenId] = useState<string | null>(null);
  const [audioElement, setAudioElement] = useState<HTMLAudioElement | null>(null);
  const [speakingWithoutAudio, setSpeakingWithoutAudio] = useState(false);
  const spoken = id !== null && spokenId === id;

  useEffect(() => {
    if (id === null || !enabled || spoken) return;
    let active = true;
    const timers = new Set<ReturnType<typeof setTimeout>>();
    let audio: HTMLAudioElement | null = null;
    let usedSpeech = false;

    const later = (fn: () => void, ms: number) => {
      const timer = setTimeout(() => {
        timers.delete(timer);
        if (active) fn();
      }, ms);
      timers.add(timer);
      return timer;
    };
    const clearTimers = () => {
      timers.forEach(clearTimeout);
      timers.clear();
    };
    const stopAudio = () => {
      if (!audio) return;
      audio.onended = null;
      audio.onerror = null;
      audio.onloadedmetadata = null;
      audio.pause();
      audio.removeAttribute('src');
      audio.load();
      audio = null;
      setAudioElement(null);
    };
    const stopSpeech = () => {
      if (!usedSpeech) return;
      usedSpeech = false;
      speechApi()?.cancel();
      setSpeakingWithoutAudio(false);
    };
    const stopAll = () => {
      clearTimers();
      stopAudio();
      stopSpeech();
    };
    const finish = () => {
      if (!active) return;
      active = false;
      stopAll();
      setSpokenId(id);
    };
    // Nothing could be played: leave time to read the text, then go on.
    const fallBackToReading = () => {
      if (!active) return;
      stopAll();
      later(finish, readingDelay(text));
    };

    const speak = () => {
      const synth = speechApi();
      const parts = sentences(text);
      if (!synth || parts.length === 0) {
        fallBackToReading();
        return;
      }
      const lang = ARABIC_SCRIPT.test(text) ? 'ar-SA' : 'en-US';
      let started = false;
      const start = () => {
        if (!active || started) return;
        started = true;
        const voice = voiceFor(synth, lang);
        if (!voice) {
          fallBackToReading();
          return;
        }
        synth.cancel();
        usedSpeech = true;
        setSpeakingWithoutAudio(true);
        later(finish, Math.max(SPEECH_SAFETY_MS, wordCount(text) * SPEECH_SAFETY_MS_PER_WORD));
        parts.forEach((part, index) => {
          const utterance = new SpeechSynthesisUtterance(part);
          utterance.lang = lang;
          utterance.voice = voice;
          utterance.onerror = () => {
            if (active && usedSpeech) fallBackToReading();
          };
          if (index === parts.length - 1) utterance.onend = finish;
          synth.speak(utterance);
        });
      };
      if (synth.getVoices().length > 0) {
        start();
        return;
      }
      // Voices load asynchronously; wait for them briefly.
      const onVoices = () => start();
      synth.addEventListener('voiceschanged', onVoices, { once: true });
      later(() => {
        synth.removeEventListener('voiceschanged', onVoices);
        start();
      }, VOICES_WAIT_MS);
    };

    const mimeType = audioMimeType ?? '';
    if (audioBase64 && mimeType.startsWith('audio/')) {
      const element = new Audio(`data:${mimeType};base64,${audioBase64}`);
      element.preload = 'auto';
      audio = element;
      const safety = later(finish, AUDIO_SAFETY_BEFORE_METADATA_MS);
      element.onloadedmetadata = () => {
        if (!Number.isFinite(element.duration)) return;
        clearTimeout(safety);
        timers.delete(safety);
        later(finish, element.duration * 1000 + AUDIO_SAFETY_MARGIN_MS);
      };
      element.onended = finish;
      element.onerror = fallBackToReading;
      setAudioElement(element);
      later(() => {
        element.play().catch(fallBackToReading);
      }, PLAY_DELAY_MS);
    } else if (text.trim()) {
      speak();
    } else {
      finish();
    }

    return () => {
      active = false;
      stopAll();
    };
  }, [id, enabled, spoken, text, audioBase64, audioMimeType]);

  return { spoken, audioElement, speakingWithoutAudio };
}
