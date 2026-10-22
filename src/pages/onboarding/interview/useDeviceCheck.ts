import { useCallback, useEffect, useRef, useState } from 'react';

// Pre-flight checks for the camera, microphone, screen sharing and network, using only browser
// APIs. Nothing captured here is recorded or sent anywhere; streams live only for previews and
// stop when the Setup step unmounts.
//
// States follow the Interview Integrity research (§18.2): a check is either observed (ready,
// shared, stopped), failed for a known reason, or not run yet. A capability the browser does not
// report — such as which surface was shared in Firefox or Safari — is `unknown`, never a pass or a
// fail.

export type DeviceFailure =
  | 'permission_denied'
  | 'not_found'
  | 'not_readable'
  | 'unsupported'
  | 'insecure_context'
  | 'error';

export type MediaCheck =
  | { status: 'idle' }
  | { status: 'checking' }
  | { status: 'ready'; deviceId: string }
  | { status: 'stopped' }
  | { status: 'failed'; reason: DeviceFailure };

export type DisplaySurface = 'monitor' | 'window' | 'browser' | 'unknown';

export type ScreenCheck =
  | { status: 'idle' }
  | { status: 'checking' }
  | { status: 'shared'; surface: DisplaySurface }
  | { status: 'stopped' }
  | { status: 'failed'; reason: DeviceFailure };

export type ConnectionCheck = 'idle' | 'online' | 'offline';

// `label` is empty until the user grants permission; the UI shows a numbered fallback.
export type DeviceOption = { deviceId: string; label: string };

const LEVEL_UPDATE_MS = 100;
// Normal speech peaks around 0.1–0.3 RMS; the gain spreads it across the meter.
const METER_GAIN = 4;

// Hints only: browsers that do not support them ignore them (§18.5).
const DISPLAY_MEDIA_OPTIONS = {
  video: { displaySurface: 'monitor' },
  audio: false,
  selfBrowserSurface: 'exclude',
  surfaceSwitching: 'exclude',
  monitorTypeSurfaces: 'include',
} as DisplayMediaStreamOptions;

export function isScreenAccepted(screen: ScreenCheck): boolean {
  // Chromium reports the surface and must be the entire screen. Other browsers do not report it;
  // that stays `unknown` and is not held against the candidate.
  return screen.status === 'shared' && (screen.surface === 'monitor' || screen.surface === 'unknown');
}

export function canShareScreen(): boolean {
  return typeof navigator.mediaDevices?.getDisplayMedia === 'function';
}

function failureFrom(error: unknown): DeviceFailure {
  const name = error instanceof Error || error instanceof DOMException ? error.name : '';
  switch (name) {
    case 'NotAllowedError':
    case 'SecurityError':
      return 'permission_denied';
    case 'NotFoundError':
    case 'OverconstrainedError':
      return 'not_found';
    case 'NotReadableError':
    case 'AbortError':
      return 'not_readable';
    case 'NotSupportedError':
      return 'unsupported';
    default:
      return 'error';
  }
}

function captureBlocker(): DeviceFailure | null {
  if (!window.isSecureContext) return 'insecure_context';
  if (typeof navigator.mediaDevices?.getUserMedia !== 'function') return 'unsupported';
  return null;
}

function surfaceOf(track: MediaStreamTrack): DisplaySurface {
  const surface = (track.getSettings() as { displaySurface?: string }).displaySurface;
  return surface === 'monitor' || surface === 'window' || surface === 'browser' ? surface : 'unknown';
}

function stopStream(stream: MediaStream | null): void {
  stream?.getTracks().forEach((track) => track.stop());
}

type Streams = { camera: MediaStream | null; microphone: MediaStream | null; screen: MediaStream | null };
type Meter = { context: AudioContext; frame: number };

export function useDeviceCheck() {
  const [camera, setCamera] = useState<MediaCheck>({ status: 'idle' });
  const [microphone, setMicrophone] = useState<MediaCheck>({ status: 'idle' });
  const [screen, setScreen] = useState<ScreenCheck>({ status: 'idle' });
  const [connection, setConnection] = useState<ConnectionCheck>('idle');
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const [cameras, setCameras] = useState<DeviceOption[]>([]);
  const [microphones, setMicrophones] = useState<DeviceOption[]>([]);
  const [micLevel, setMicLevel] = useState(0);

  const streams = useRef<Streams>({ camera: null, microphone: null, screen: null });
  const meter = useRef<Meter | null>(null);
  const mounted = useRef(true);

  const stopMeter = useCallback(() => {
    if (!meter.current) return;
    cancelAnimationFrame(meter.current.frame);
    void meter.current.context.close();
    meter.current = null;
    setMicLevel(0);
  }, []);

  // The level meter is a UX aid for "can we hear you"; it measures nothing that is kept.
  const startMeter = useCallback(
    (stream: MediaStream) => {
      stopMeter();
      const AudioContextClass =
        window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (!AudioContextClass) return;
      const context = new AudioContextClass();
      void context.resume();
      const analyser = context.createAnalyser();
      analyser.fftSize = 512;
      context.createMediaStreamSource(stream).connect(analyser);
      const samples = new Uint8Array(analyser.fftSize);
      const state: Meter = { context, frame: 0 };
      let lastUpdate = 0;
      const tick = (time: number) => {
        if (time - lastUpdate >= LEVEL_UPDATE_MS) {
          lastUpdate = time;
          analyser.getByteTimeDomainData(samples);
          let sum = 0;
          for (const sample of samples) {
            const centered = (sample - 128) / 128;
            sum += centered * centered;
          }
          setMicLevel(Math.min(1, Math.sqrt(sum / samples.length) * METER_GAIN));
        }
        state.frame = requestAnimationFrame(tick);
      };
      state.frame = requestAnimationFrame(tick);
      meter.current = state;
    },
    [stopMeter],
  );

  const refreshDevices = useCallback(async () => {
    if (typeof navigator.mediaDevices?.enumerateDevices !== 'function') return;
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      if (!mounted.current) return;
      const pick = (kind: MediaDeviceKind) =>
        devices.filter((d) => d.kind === kind && d.deviceId).map((d) => ({ deviceId: d.deviceId, label: d.label }));
      setCameras(pick('videoinput'));
      setMicrophones(pick('audioinput'));
    } catch {
      // The device list only fills the pickers; the check itself already succeeded.
    }
  }, []);

  const checkCamera = useCallback(
    async (deviceId?: string) => {
      const blocker = captureBlocker();
      if (blocker) {
        setCamera({ status: 'failed', reason: blocker });
        return;
      }
      setCamera({ status: 'checking' });
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: deviceId ? { deviceId: { exact: deviceId } } : true,
          audio: false,
        });
        if (!mounted.current) {
          stopStream(stream);
          return;
        }
        stopStream(streams.current.camera);
        streams.current.camera = stream;
        const [track] = stream.getVideoTracks();
        track.addEventListener('ended', () => {
          if (streams.current.camera !== stream) return;
          streams.current.camera = null;
          setCameraStream(null);
          setCamera({ status: 'stopped' });
        });
        setCameraStream(stream);
        setCamera({ status: 'ready', deviceId: track.getSettings().deviceId ?? '' });
        void refreshDevices();
      } catch (error) {
        if (mounted.current) setCamera({ status: 'failed', reason: failureFrom(error) });
      }
    },
    [refreshDevices],
  );

  const checkMicrophone = useCallback(
    async (deviceId?: string) => {
      const blocker = captureBlocker();
      if (blocker) {
        setMicrophone({ status: 'failed', reason: blocker });
        return;
      }
      setMicrophone({ status: 'checking' });
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: deviceId ? { deviceId: { exact: deviceId } } : true,
          video: false,
        });
        if (!mounted.current) {
          stopStream(stream);
          return;
        }
        stopStream(streams.current.microphone);
        streams.current.microphone = stream;
        const [track] = stream.getAudioTracks();
        track.addEventListener('ended', () => {
          if (streams.current.microphone !== stream) return;
          streams.current.microphone = null;
          stopMeter();
          setMicrophone({ status: 'stopped' });
        });
        startMeter(stream);
        setMicrophone({ status: 'ready', deviceId: track.getSettings().deviceId ?? '' });
        void refreshDevices();
      } catch (error) {
        if (mounted.current) setMicrophone({ status: 'failed', reason: failureFrom(error) });
      }
    },
    [refreshDevices, startMeter, stopMeter],
  );

  const shareScreen = useCallback(async () => {
    if (!window.isSecureContext) {
      setScreen({ status: 'failed', reason: 'insecure_context' });
      return;
    }
    if (!canShareScreen()) {
      setScreen({ status: 'failed', reason: 'unsupported' });
      return;
    }
    setScreen({ status: 'checking' });
    try {
      const stream = await navigator.mediaDevices.getDisplayMedia(DISPLAY_MEDIA_OPTIONS);
      if (!mounted.current) {
        stopStream(stream);
        return;
      }
      stopStream(streams.current.screen);
      streams.current.screen = stream;
      const [track] = stream.getVideoTracks();
      track.addEventListener('ended', () => {
        if (streams.current.screen !== stream) return;
        streams.current.screen = null;
        setScreen({ status: 'stopped' });
      });
      setScreen({ status: 'shared', surface: surfaceOf(track) });
    } catch (error) {
      if (mounted.current) setScreen({ status: 'failed', reason: failureFrom(error) });
    }
  }, []);

  // `navigator.onLine` only says the device has a network. It says nothing about whether the
  // interview service is reachable, and the UI does not claim that.
  const checkConnection = useCallback(() => {
    setConnection(navigator.onLine ? 'online' : 'offline');
  }, []);

  useEffect(() => {
    if (connection === 'idle') return;
    const update = () => setConnection(navigator.onLine ? 'online' : 'offline');
    window.addEventListener('online', update);
    window.addEventListener('offline', update);
    return () => {
      window.removeEventListener('online', update);
      window.removeEventListener('offline', update);
    };
  }, [connection]);

  useEffect(() => {
    const mediaDevices = navigator.mediaDevices;
    if (typeof mediaDevices?.addEventListener !== 'function') return;
    const onChange = () => void refreshDevices();
    mediaDevices.addEventListener('devicechange', onChange);
    return () => mediaDevices.removeEventListener('devicechange', onChange);
  }, [refreshDevices]);

  const stopAll = useCallback(() => {
    stopStream(streams.current.camera);
    stopStream(streams.current.microphone);
    stopStream(streams.current.screen);
    // Clear the fields rather than replacing the object: the unmount cleanup holds this object.
    streams.current.camera = null;
    streams.current.microphone = null;
    streams.current.screen = null;
    stopMeter();
    setCameraStream(null);
    setCamera({ status: 'idle' });
    setMicrophone({ status: 'idle' });
    setScreen({ status: 'idle' });
  }, [stopMeter]);

  useEffect(() => {
    mounted.current = true;
    const current = streams.current;
    return () => {
      mounted.current = false;
      stopStream(current.camera);
      stopStream(current.microphone);
      stopStream(current.screen);
      if (meter.current) {
        cancelAnimationFrame(meter.current.frame);
        void meter.current.context.close();
        meter.current = null;
      }
    };
  }, []);

  return {
    camera,
    microphone,
    screen,
    connection,
    cameraStream,
    cameras,
    microphones,
    micLevel,
    checkCamera,
    checkMicrophone,
    shareScreen,
    checkConnection,
    stopAll,
  };
}

export type DeviceCheckApi = ReturnType<typeof useDeviceCheck>;
