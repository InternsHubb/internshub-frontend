// Fullscreen API adapter. Unprefixed API only (Chrome 71, Edge 79, Firefox 64, Safari 16.4 —
// research §3.1); anything older, or a frame without fullscreen permission, is "unsupported".
//
// This is element fullscreen, the closest a website can get to the browser's own F11 mode: the
// interview container covers the whole screen and the browser hides its tabs and toolbars. A page
// cannot press F11 or put the browser window itself into F11 mode, and it can't stop the candidate
// leaving with Esc. Fullscreen also doesn't stop Alt+Tab, other applications, a second monitor or
// a second device (§17.2, §17.11).

export function isFullscreenSupported(): boolean {
  return document.fullscreenEnabled === true && typeof Element.prototype.requestFullscreen === 'function';
}

// True only when `element` itself is the fullscreen element — not when the browser window is in
// F11 mode (that doesn't set `document.fullscreenElement`) or some other element is fullscreen.
export function isFullscreenOn(element: Element | null): boolean {
  return element !== null && document.fullscreenElement === element;
}

// Must be called synchronously inside a click handler: browsers reject it without a user gesture.
export function requestFullscreen(element: Element): Promise<void> {
  return element.requestFullscreen({ navigationUI: 'hide' });
}

export async function exitFullscreen(): Promise<void> {
  if (!document.fullscreenElement || typeof document.exitFullscreen !== 'function') return;
  try {
    await document.exitFullscreen();
  } catch {
    // Already left (for example with Esc) between the check and the call.
  }
}
