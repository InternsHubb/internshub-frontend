import { detectCapabilities, readDisplayEnvironment } from '@/features/onboarding/components/interview/integrity/capabilities';
import { exitFullscreen, isFullscreenOn, isFullscreenSupported, requestFullscreen } from '@/features/onboarding/components/interview/integrity/fullscreen';
import { APP_PROMPT_GRACE_MS, FOCUS_LOSS_MIN_MS, FULLSCREEN_MODE, MAX_SIGNALS } from '@/features/onboarding/components/interview/integrity/policy';
import type { IntegritySignal, IntervalType, SignalDetail, SnapshotType } from '@/features/onboarding/components/interview/integrity/types';

// One integrity monitor per interview attempt (research §18.1): plain TypeScript outside React,
// listeners registered once, and a small external store the UI reads with useSyncExternalStore.
//
// It observes page visibility, window focus and fullscreen, and keeps device outages reported by
// the media checks as intervals. Signals stay in memory in this tab: there is no interview API, so
// nothing is sent, stored or recorded, and no signal is ever treated as misconduct.

export type FullscreenState =
  // Not in use: the mode is off, or the candidate never entered fullscreen (unsupported browser).
  | 'off'
  | 'active'
  | 'exited';

export type IntegritySnapshot = Readonly<{
  running: boolean;
  fullscreen: FullscreenState;
  // The candidate left fullscreen during the interview and must return before it continues.
  fullscreenWarning: boolean;
  signals: readonly IntegritySignal[];
  droppedSignals: number;
}>;

export type EnterFullscreenResult = 'entered' | 'unsupported' | 'failed';

export type DeviceSignal = 'CAMERA_UNAVAILABLE' | 'MICROPHONE_UNAVAILABLE' | 'SCREEN_CAPTURE_UNAVAILABLE';

type OpenInterval = { startedAtMs: number; startedAtClient: string; source: string; detail: SignalDetail };

const IDLE: IntegritySnapshot = {
  running: false,
  fullscreen: 'off',
  fullscreenWarning: false,
  signals: [],
  droppedSignals: 0,
};

export class IntegrityMonitor {
  private snapshot: IntegritySnapshot = IDLE;
  private readonly listeners = new Set<() => void>();
  private readonly open = new Map<IntervalType, OpenInterval>();
  private sequence = 0;
  private origin = 0;
  private promptDepth = 0;
  private promptEndedAt = Number.NEGATIVE_INFINITY;
  // True once the app put the interview container in fullscreen for this attempt.
  private ownsFullscreen = false;
  private target: Element | null = null;
  private detach: (() => void) | null = null;

  subscribe = (listener: () => void): (() => void) => {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  };

  getSnapshot = (): IntegritySnapshot => this.snapshot;

  // Starts monitoring (the question screens). Fullscreen is separate: it starts with the Start
  // Interview click and lasts until release().
  start(): void {
    if (this.detach) return;
    // The log, sequence and clock origin belong to the whole attempt: going back to the device
    // check and starting again continues them rather than starting a new log.
    if (this.sequence === 0) this.origin = performance.now();
    this.open.clear();
    this.update({ running: true });

    const onVisibility = () => this.handleVisibility();
    const onBlur = () => this.openInterval('WINDOW_FOCUS_LOST', 'blur', { duringAppPrompt: this.inAppPrompt() });
    const onFocus = () => this.handleFocus();
    const onFullscreen = () => this.syncFullscreen();
    const onScreenChange = () => this.recordDisplayEnvironment();
    // Screen is an EventTarget with the Window Management API (Chromium) only.
    const screenEvents = window.screen as unknown as Partial<EventTarget>;
    document.addEventListener('visibilitychange', onVisibility);
    document.addEventListener('fullscreenchange', onFullscreen);
    window.addEventListener('blur', onBlur);
    window.addEventListener('focus', onFocus);
    screenEvents.addEventListener?.('change', onScreenChange);
    this.detach = () => {
      document.removeEventListener('visibilitychange', onVisibility);
      document.removeEventListener('fullscreenchange', onFullscreen);
      window.removeEventListener('blur', onBlur);
      window.removeEventListener('focus', onFocus);
      screenEvents.removeEventListener?.('change', onScreenChange);
    };

    this.record('CAPABILITIES', 'capability-detection', detectCapabilities());
    this.recordDisplayEnvironment();
    if (document.visibilityState === 'hidden') this.openInterval('PAGE_HIDDEN', 'visibilitychange');
    if (!document.hasFocus()) this.openInterval('WINDOW_FOCUS_LOST', 'blur', { duringAppPrompt: false });
    this.syncFullscreen();
  }

  // Ends monitoring. Intervals still open are kept with no end time (§18.3). Fullscreen is left
  // as it is, so going back to the device check doesn't drop out of fullscreen.
  stop(): void {
    if (!this.detach) return;
    this.detach();
    this.detach = null;
    for (const [type, interval] of this.open) {
      this.commit('INTERVAL', type, { ...interval, detail: { ...interval.detail, closedBy: 'session_ended' } }, null);
    }
    this.open.clear();
    this.update({ running: false, fullscreen: 'off', fullscreenWarning: false });
  }

  // The attempt is over (finished, or the candidate left Step 07): exit the fullscreen the app
  // entered. Monitoring has already stopped, so this app-initiated exit never shows a warning.
  release(): void {
    if (!this.ownsFullscreen) return;
    const target = this.target;
    this.ownsFullscreen = false;
    this.target = null;
    if (isFullscreenOn(target)) void exitFullscreen();
  }

  // Must be called synchronously from a click handler (the user gesture is consumed by the
  // request). Resolves 'entered' only when `element` really is the fullscreen element.
  async enterFullscreen(element: Element | null): Promise<EnterFullscreenResult> {
    if (FULLSCREEN_MODE === 'off' || !element || !isFullscreenSupported()) return 'unsupported';
    if (!isFullscreenOn(element)) {
      try {
        await requestFullscreen(element);
      } catch {
        return 'failed';
      }
      if (!isFullscreenOn(element)) return 'failed';
    }
    this.target = element;
    this.ownsFullscreen = true;
    this.syncFullscreen();
    return 'entered';
  }

  // Wraps an app-opened browser prompt (screen-share picker, device re-acquire) so the focus loss
  // or fullscreen exit it causes is tagged as app-initiated (§17.5, §18.3).
  async withAppPrompt<T>(prompt: () => Promise<T>): Promise<T> {
    this.promptDepth += 1;
    try {
      return await prompt();
    } finally {
      this.promptDepth -= 1;
      this.promptEndedAt = performance.now();
    }
  }

  // Device outages come from the media checks. `cause` is null when the device is available.
  reportDevice(type: DeviceSignal, cause: string | null): void {
    if (!this.detach) return;
    if (cause === null) this.closeInterval(type);
    else this.openInterval(type, 'track', { cause });
  }

  // `unknown` means the browser did not report the surface; it is not a pass or a failure.
  recordScreenSurface(surface: string): void {
    if (!this.detach) return;
    this.record('SCREEN_SURFACE', 'track.getSettings', { surface, verified: surface !== 'unknown' });
  }

  private handleVisibility(): void {
    if (document.visibilityState === 'hidden') this.openInterval('PAGE_HIDDEN', 'visibilitychange');
    else this.closeInterval('PAGE_HIDDEN');
    // Coming back to the tab: re-check the real fullscreen state instead of assuming it.
    this.syncFullscreen();
  }

  private handleFocus(): void {
    this.closeInterval('WINDOW_FOCUS_LOST');
    this.syncFullscreen();
  }

  // Idempotent: compares the document's real fullscreen state with what is recorded, so repeated
  // or missed `fullscreenchange` events never open a second interval or a second warning. Focus
  // loss alone never counts as leaving fullscreen.
  private syncFullscreen(): void {
    if (!this.detach) return;
    if (isFullscreenOn(this.target)) {
      this.closeInterval('FULLSCREEN_EXITED');
      this.update({ fullscreen: this.ownsFullscreen ? 'active' : 'off', fullscreenWarning: false });
      return;
    }
    if (!this.ownsFullscreen || FULLSCREEN_MODE === 'off') {
      this.update({ fullscreen: 'off', fullscreenWarning: false });
      return;
    }
    this.openInterval('FULLSCREEN_EXITED', 'fullscreenchange', { appInitiated: this.inAppPrompt(), warningShown: true });
    this.update({ fullscreen: 'exited', fullscreenWarning: true });
  }

  private recordDisplayEnvironment(): void {
    const environment = readDisplayEnvironment();
    this.record('DISPLAY_ENVIRONMENT', 'screen.isExtended', {
      status: environment.status,
      reason: environment.reason,
      displayCount: null,
    });
  }

  private inAppPrompt(): boolean {
    return this.promptDepth > 0 || performance.now() - this.promptEndedAt < APP_PROMPT_GRACE_MS;
  }

  private now(): number {
    return performance.now() - this.origin;
  }

  private openInterval(type: IntervalType, source: string, detail: SignalDetail = {}): void {
    if (this.open.has(type)) return;
    this.open.set(type, { startedAtMs: this.now(), startedAtClient: new Date().toISOString(), source, detail });
  }

  // Closing an interval is the recovery event; there is no separate "restored" signal (§11.1).
  private closeInterval(type: IntervalType): void {
    const interval = this.open.get(type);
    if (!interval) return;
    this.open.delete(type);
    const endedAtMs = this.now();
    if (type === 'WINDOW_FOCUS_LOST' && endedAtMs - interval.startedAtMs < FOCUS_LOSS_MIN_MS) return;
    this.commit('INTERVAL', type, interval, endedAtMs);
  }

  private record(type: SnapshotType, source: string, detail: SignalDetail): void {
    this.commit('SNAPSHOT', type, { startedAtMs: this.now(), startedAtClient: new Date().toISOString(), source, detail }, null);
  }

  private commit(
    kind: 'INTERVAL' | 'SNAPSHOT',
    type: IntervalType | SnapshotType,
    interval: OpenInterval,
    endedAtMs: number | null,
  ): void {
    this.sequence += 1;
    const signal: IntegritySignal = {
      sequence: this.sequence,
      kind,
      type,
      source: interval.source,
      observation: 'DIRECT',
      startedAtMs: Math.round(interval.startedAtMs),
      startedAtClient: interval.startedAtClient,
      endedAtMs: endedAtMs === null ? null : Math.round(endedAtMs),
      durationMs: endedAtMs === null ? null : Math.round(endedAtMs - interval.startedAtMs),
      detail: interval.detail,
    };
    const signals = [...this.snapshot.signals, signal];
    const overflow = Math.max(0, signals.length - MAX_SIGNALS);
    this.update({ signals: signals.slice(overflow), droppedSignals: this.snapshot.droppedSignals + overflow });
  }

  private update(patch: Partial<IntegritySnapshot>): void {
    const keys = Object.keys(patch) as (keyof IntegritySnapshot)[];
    if (keys.every((key) => patch[key] === this.snapshot[key])) return;
    this.snapshot = { ...this.snapshot, ...patch };
    this.listeners.forEach((listener) => listener());
  }
}
