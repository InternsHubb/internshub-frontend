import type { VisemeWeights } from '@/features/onboarding/ai-interviewer/avatarAnimator';

/**
 * Real-time lip sync from an <audio> element: Web Audio analyser -> loudness + spectral shape ->
 * Oculus viseme weights. No timestamps from the TTS needed, so it works with any question audio
 * the backend returns (audioBase64).
 */

let sharedCtx: AudioContext | null = null;
const sources = new WeakMap<HTMLMediaElement, MediaElementAudioSourceNode>();

function ctx(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!sharedCtx) {
    const AC = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AC) return null;
    sharedCtx = new AC();
  }
  return sharedCtx;
}

const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);

export class AudioLipSync {
  private analyser: AnalyserNode | null = null;
  private freq: Float32Array<ArrayBuffer> | null = null;
  private wave: Float32Array<ArrayBuffer> | null = null;
  private el: HTMLMediaElement | null = null;
  private peak = 0.08;
  private prevVol = 0;
  private closure = 0;

  /** Route an audio element through the analyser. Safe to call repeatedly with the same element. */
  attach(el: HTMLMediaElement | null) {
    if (el === this.el) return;
    this.el = el;
    const ac = ctx();
    if (!el || !ac) return;
    try {
      let src = sources.get(el);
      if (!src) {
        src = ac.createMediaElementSource(el);
        sources.set(el, src);
      }
      const an = ac.createAnalyser();
      an.fftSize = 1024;
      an.smoothingTimeConstant = 0.35;
      src.connect(an);
      // keep the sound audible: the element now plays through the audio graph
      src.connect(ac.destination);
      this.analyser = an;
      this.freq = new Float32Array(an.frequencyBinCount);
      this.wave = new Float32Array(an.fftSize);
    } catch {
      this.analyser = null; // e.g. CORS-tainted source: fall back to procedural talking
    }
  }

  /** Call from a user-gesture-backed code path (play) so autoplay policies allow audio. */
  resume() {
    const ac = ctx();
    if (ac && ac.state === 'suspended') void ac.resume();
  }

  get active() {
    return !!(this.analyser && this.el && !this.el.paused && !this.el.ended);
  }

  /** Returns viseme weights + loudness for this frame, or null when nothing is playing. */
  sample(): { visemes: VisemeWeights; energy: number } | null {
    const an = this.analyser;
    if (!an || !this.freq || !this.wave || !this.active) return null;
    an.getFloatTimeDomainData(this.wave);
    let sum = 0;
    for (let i = 0; i < this.wave.length; i++) sum += this.wave[i] * this.wave[i];
    const rms = Math.sqrt(sum / this.wave.length);
    // adaptive gain: follow the loudest recent level so quiet and loud TTS both animate fully
    this.peak = Math.max(rms, this.peak * 0.995, 0.02);
    const vol = clamp01((rms / this.peak - 0.12) / 0.75);

    an.getFloatFrequencyData(this.freq);
    const hzPerBin = an.context.sampleRate / an.fftSize;
    const band = (lo: number, hi: number) => {
      let e = 0;
      const a = Math.max(1, Math.floor(lo / hzPerBin));
      const b = Math.min(this.freq!.length - 1, Math.ceil(hi / hzPerBin));
      for (let i = a; i <= b; i++) e += Math.pow(10, this.freq![i] / 20);
      return e / (b - a + 1);
    };
    const low = band(90, 450);
    const mid = band(450, 1400);
    const high = band(1400, 3500);
    const sib = band(4000, 9000);
    const tot = low + mid + high + sib + 1e-9;
    const bright = clamp01(((mid + high) / tot - 0.35) / 0.45); // E / I vs O / U
    const hiss = clamp01((sib / tot - 0.12) / 0.3);

    // short drop in loudness inside speech -> lips touch (P/B/M)
    if (this.prevVol > 0.35 && vol < 0.12) this.closure = 1;
    this.closure = Math.max(0, this.closure - 0.12);
    this.prevVol = vol;

    const open = vol * (1 - hiss * 0.6);
    const visemes: VisemeWeights = {
      viseme_aa: open * (0.55 + 0.25 * (1 - Math.abs(bright - 0.5) * 2)),
      viseme_E: open * bright * 0.55,
      viseme_I: open * bright * bright * 0.35,
      viseme_O: open * (1 - bright) * 0.55,
      viseme_U: open * (1 - bright) * (1 - bright) * 0.3,
      viseme_SS: hiss * vol * 0.9,
      viseme_PP: this.closure * 0.8,
    };
    return { visemes, energy: vol };
  }
}
