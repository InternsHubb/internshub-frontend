/**
 * Warm up the 3D interviewer (three.js chunk + model + poster) while the candidate is still on the
 * setup / device-check screens, so the session opens with the character already loaded.
 */
let started = false;

export function preloadInterviewerAvatar() {
  if (started || typeof window === 'undefined') return;
  started = true;
  const run = () => {
    import('./interviewerStage')
      .then((m) => {
        const img = new Image();
        img.src = m.INTERVIEWER_POSTER_URL;
        return m.loadInterviewerModel();
      })
      .catch(() => {
        started = false; // try again next time
      });
  };
  if ('requestIdleCallback' in window) window.requestIdleCallback(run, { timeout: 1500 });
  else setTimeout(run, 200);
}
