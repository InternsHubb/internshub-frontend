// Client-side integrity settings. In the research these come from server configuration
// (§17.6); there is no interview API yet, so they live here until the backend sends them.

// Off · Requested (ask; continue if the browser can't) · Required (supported browsers must enter
// fullscreen to start). Required is the owner's request; the research leaves this to Product
// (§17.9 #1, open question Q15). Browsers without the Fullscreen API always fall back to a normal
// window, because blocking them would make a browser capability a condition of the interview.
export type FullscreenMode = 'off' | 'requested' | 'required';
export const FULLSCREEN_MODE: FullscreenMode = 'required';

// A fullscreen exit or focus loss within this window after an app-opened prompt (screen-share
// picker, device re-acquire) is tagged as app-initiated (§17.5, AppInitiatedGraceMs).
export const APP_PROMPT_GRACE_MS = 2000;

// Shorter focus losses are almost always browser UI (address bar, prompts) and are not kept (§3.5).
export const FOCUS_LOSS_MIN_MS = 500;

// Safari can fire spurious mute/unmute pairs; a track must stay muted this long to count (§4.6).
export const MUTE_DEBOUNCE_MS = 1500;

// The in-memory signal log is capped; older entries are dropped and counted (§18.9).
export const MAX_SIGNALS = 500;
