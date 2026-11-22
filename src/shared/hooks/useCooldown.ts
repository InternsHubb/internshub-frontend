import { useCallback, useEffect, useState } from 'react';

export function useCooldown(defaultSeconds = 60) {
  const [secondsLeft, setSecondsLeft] = useState(0);

  useEffect(() => {
    if (secondsLeft <= 0) return undefined;
    const timer = window.setTimeout(() => setSecondsLeft((s) => Math.max(0, s - 1)), 1000);
    return () => window.clearTimeout(timer);
  }, [secondsLeft]);

  const start = useCallback(
    (seconds = defaultSeconds) => {
      setSecondsLeft(seconds);
    },
    [defaultSeconds]
  );

  const reset = useCallback(() => setSecondsLeft(0), []);

  return { secondsLeft, isCoolingDown: secondsLeft > 0, start, reset };
}
