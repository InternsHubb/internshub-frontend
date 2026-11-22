import { useEffect, useState, useSyncExternalStore } from 'react';
import { IntegrityMonitor } from '@/features/onboarding/components/interview/integrity/integrityMonitor';

// Creates the attempt's monitor once and runs it only while `running` is true (the question
// screens); fullscreen is released when the component using it unmounts. React reads its state
// through useSyncExternalStore, so re-renders never register browser listeners twice.
export function useIntegrityMonitor(running: boolean) {
  const [monitor] = useState(() => new IntegrityMonitor());

  useEffect(() => {
    if (!running) return;
    monitor.start();
    return () => monitor.stop();
  }, [monitor, running]);

  // Leaving the interview steps (finish, or navigating away from Step 07) exits fullscreen.
  useEffect(() => () => monitor.release(), [monitor]);

  // Development only (removed from production builds): lets browser tests read the in-memory
  // signals, which the candidate UI deliberately doesn't show.
  useEffect(() => {
    if (!import.meta.env.DEV) return;
    const target = window as unknown as { __interviewIntegrity?: IntegrityMonitor };
    target.__interviewIntegrity = monitor;
    return () => {
      if (target.__interviewIntegrity === monitor) target.__interviewIntegrity = undefined;
    };
  }, [monitor]);

  const snapshot = useSyncExternalStore(monitor.subscribe, monitor.getSnapshot);
  return { monitor, snapshot };
}
