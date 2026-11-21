import { useEffect, useRef, useState } from 'react';

// Voice activity from the microphone level that useDeviceCheck measures (RMS × gain, 0–1, ~10 Hz).
// Speech starts once the level reaches SPEECH_START and ends only after it has stayed below
// SPEECH_STOP for HANGOVER_MS, so the short pauses between words don't make the indicator flicker
// and steady room noise below SPEECH_STOP never counts as speaking.
const SPEECH_START = 0.14;
const SPEECH_STOP = 0.08;
const HANGOVER_MS = 400;

export function useSpeaking(level: number, active: boolean): boolean {
  const [speaking, setSpeaking] = useState(false);
  const quietTimer = useRef<number | null>(null);

  useEffect(() => {
    const clearQuietTimer = () => {
      if (quietTimer.current === null) return;
      window.clearTimeout(quietTimer.current);
      quietTimer.current = null;
    };
    if (!active) {
      clearQuietTimer();
      setSpeaking(false);
      return;
    }
    if (level >= SPEECH_START) {
      clearQuietTimer();
      setSpeaking(true);
    } else if (level >= SPEECH_STOP) {
      // Between the thresholds the current state holds.
      clearQuietTimer();
    } else if (quietTimer.current === null) {
      // A timer, not the next level update: a silent microphone reports the same level each time,
      // which doesn't re-render.
      quietTimer.current = window.setTimeout(() => {
        quietTimer.current = null;
        setSpeaking(false);
      }, HANGOVER_MS);
    }
  }, [level, active]);

  useEffect(
    () => () => {
      if (quietTimer.current !== null) window.clearTimeout(quietTimer.current);
    },
    []
  );

  return active && speaking;
}
