import type { PillTone } from './parts';
import { isScreenAccepted } from './useDeviceCheck';
import type { ConnectionCheck, DeviceFailure, MediaCheck, ScreenCheck } from './useDeviceCheck';

// Turns a device check state into the pill and guidance text shown for it, so the Setup, Device
// Check and Interview screens always describe the same state the same way. Wording follows the
// research's candidate UX (§18.6): calm, specific, and never a verdict about the candidate.

export type CheckDisplay = { tone: PillTone; labelKey: string; messageKey?: string };
export type MediaKind = 'camera' | 'microphone';

const PREFIX = 'onboarding.interview';

const FAILURE_LABEL: Record<DeviceFailure, string> = {
  permission_denied: `${PREFIX}.status.blocked`,
  not_found: `${PREFIX}.status.notFound`,
  not_readable: `${PREFIX}.status.inUse`,
  unsupported: `${PREFIX}.status.unsupported`,
  insecure_context: `${PREFIX}.status.unsupported`,
  error: `${PREFIX}.status.error`,
};

type RequiredChecks = { camera: MediaCheck; microphone: MediaCheck; screen: ScreenCheck };

// Camera, microphone and screen gate the interview. The connection check is informative only:
// `navigator.onLine` can't tell whether the interview service is reachable.
export function requiredChecksReady({ camera, microphone, screen }: RequiredChecks): boolean {
  return camera.status === 'ready' && microphone.status === 'ready' && isScreenAccepted(screen);
}

const NOT_CHECKED: CheckDisplay = { tone: 'neutral', labelKey: `${PREFIX}.status.notChecked` };
const CHECKING: CheckDisplay = { tone: 'brand', labelKey: `${PREFIX}.status.checking` };

export function mediaDisplay(kind: MediaKind, check: MediaCheck): CheckDisplay {
  switch (check.status) {
    case 'idle':
      return NOT_CHECKED;
    case 'checking':
      return CHECKING;
    case 'ready':
      return { tone: 'success', labelKey: `${PREFIX}.status.${kind}Ready` };
    case 'stopped':
      return { tone: 'danger', labelKey: `${PREFIX}.status.stopped`, messageKey: `${PREFIX}.failures.stopped.${kind}` };
    case 'failed':
      return {
        tone: 'danger',
        labelKey: FAILURE_LABEL[check.reason],
        messageKey: `${PREFIX}.failures.${kind}.${check.reason}`,
      };
  }
}

export function screenDisplay(check: ScreenCheck): CheckDisplay {
  switch (check.status) {
    case 'idle':
      return NOT_CHECKED;
    case 'checking':
      return CHECKING;
    case 'shared':
      if (check.surface === 'monitor') return { tone: 'success', labelKey: `${PREFIX}.status.screenShared` };
      // The browser did not say what was shared: report that plainly, not as a verified full screen.
      if (check.surface === 'unknown') {
        return {
          tone: 'success',
          labelKey: `${PREFIX}.status.screenSharedUnknown`,
          messageKey: `${PREFIX}.deviceCheck.surfaceUnknown`,
        };
      }
      return { tone: 'warning', labelKey: `${PREFIX}.status.screenWrongSurface`, messageKey: `${PREFIX}.failures.wrongSurface` };
    case 'stopped':
      return { tone: 'danger', labelKey: `${PREFIX}.status.stopped`, messageKey: `${PREFIX}.failures.stopped.screen` };
    case 'failed':
      return {
        tone: 'danger',
        labelKey: FAILURE_LABEL[check.reason],
        messageKey: `${PREFIX}.failures.screen.${check.reason}`,
      };
  }
}

export function connectionDisplay(check: ConnectionCheck): CheckDisplay {
  if (check === 'online') {
    return { tone: 'success', labelKey: `${PREFIX}.status.online`, messageKey: `${PREFIX}.setup.connectionOnline` };
  }
  if (check === 'offline') {
    return { tone: 'warning', labelKey: `${PREFIX}.status.offline`, messageKey: `${PREFIX}.setup.connectionOffline` };
  }
  return NOT_CHECKED;
}

// Label for the button that (re)runs a camera or microphone check.
export function mediaActionKey(kind: MediaKind, check: MediaCheck): string {
  if (check.status === 'stopped') return `${PREFIX}.actions.reconnect_${kind}`;
  if (check.status === 'failed') return `${PREFIX}.actions.retry`;
  if (check.status === 'ready') return `${PREFIX}.actions.checkAgain`;
  return `${PREFIX}.actions.runCheck`;
}

export function screenActionKey(check: ScreenCheck): string {
  if (check.status === 'shared') {
    return check.surface === 'window' || check.surface === 'browser'
      ? `${PREFIX}.actions.shareAgain`
      : `${PREFIX}.actions.changeScreen`;
  }
  if (check.status === 'stopped') return `${PREFIX}.actions.resumeSharing`;
  return `${PREFIX}.actions.shareScreen`;
}
