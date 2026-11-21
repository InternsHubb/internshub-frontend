// Normalised integrity signals (research §11). Names describe what the browser observed —
// PAGE_HIDDEN, never "tab switch"; WINDOW_FOCUS_LOST, never "app switch". Severity is not part of
// a signal: the server will derive it from policy. Nothing here is a verdict about the candidate.

export type SignalKind = 'INTERVAL' | 'SNAPSHOT';

export type IntervalType =
  | 'PAGE_HIDDEN'
  | 'WINDOW_FOCUS_LOST'
  | 'FULLSCREEN_EXITED'
  | 'CAMERA_UNAVAILABLE'
  | 'MICROPHONE_UNAVAILABLE'
  | 'SCREEN_CAPTURE_UNAVAILABLE';

export type SnapshotType = 'CAPABILITIES' | 'DISPLAY_ENVIRONMENT' | 'SCREEN_SURFACE';

export type SignalDetail = Readonly<Record<string, string | number | boolean | null>>;

export type IntegritySignal = Readonly<{
  sequence: number;
  kind: SignalKind;
  type: IntervalType | SnapshotType;
  // The browser API that produced it, e.g. "visibilitychange" or "track.mute".
  source: string;
  observation: 'DIRECT';
  // Milliseconds from the monotonic clock, relative to the start of monitoring.
  startedAtMs: number;
  // UTC wall-clock time, for display only.
  startedAtClient: string;
  // null while still open when the session ended.
  endedAtMs: number | null;
  durationMs: number | null;
  detail: SignalDetail;
}>;

export type DisplayEnvironment =
  | { status: 'DETECTED' | 'NOT_DETECTED'; reason: null }
  | { status: 'UNKNOWN'; reason: 'api_unsupported' };
