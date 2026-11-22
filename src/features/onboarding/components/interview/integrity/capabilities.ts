import { isFullscreenSupported } from '@/features/onboarding/components/interview/integrity/fullscreen';
import type { DisplayEnvironment, SignalDetail } from '@/features/onboarding/components/interview/integrity/types';

// Runtime feature detection (research §12, §18.5). No behaviour branches on the browser name or
// user-agent string; a missing API means "unknown", never a reassuring default.

type ExtendedScreen = Screen & { isExtended?: boolean };

export function detectCapabilities(): SignalDetail {
  const mediaDevices = navigator.mediaDevices;
  const supported = (typeof mediaDevices?.getSupportedConstraints === 'function'
    ? mediaDevices.getSupportedConstraints()
    : {}) as Record<string, boolean | undefined>;
  return {
    secureContext: window.isSecureContext,
    visibilityApi: typeof document.visibilityState === 'string',
    fullscreenApi: isFullscreenSupported(),
    getUserMedia: typeof mediaDevices?.getUserMedia === 'function',
    getDisplayMedia: typeof mediaDevices?.getDisplayMedia === 'function',
    displaySurfaceConstraint: supported.displaySurface === true,
    permissionsQuery: typeof navigator.permissions?.query === 'function',
    windowManagementIsExtended: 'isExtended' in window.screen,
    windowManagementScreenDetails: 'getScreenDetails' in window,
    keyboardLock: 'keyboard' in navigator,
  };
}

// Uses `screen.isExtended` only. `getScreenDetails()` would give a display count but shows a
// permission prompt, which no current requirement justifies (§13 "Optional"). NOT_DETECTED cannot
// rule out a mirrored display (§6.4), and DETECTED is context for a reviewer, not a violation.
export function readDisplayEnvironment(): DisplayEnvironment {
  const extended = (window.screen as ExtendedScreen).isExtended;
  if (typeof extended !== 'boolean') return { status: 'UNKNOWN', reason: 'api_unsupported' };
  return { status: extended ? 'DETECTED' : 'NOT_DETECTED', reason: null };
}
