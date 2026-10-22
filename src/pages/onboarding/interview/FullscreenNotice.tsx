import { useTranslation } from 'react-i18next';
import { AlertTriangle, Info, Maximize } from 'lucide-react';
import { Notice } from './parts';

// Explains fullscreen next to the button that requests it (research §17.4: the rules are shown
// before the first question), plus the recoverable states when the browser rejects the request or
// has no Fullscreen API. `intro` is off where fullscreen is normally already on (Device Check).

export type FullscreenInfo = { enabled: boolean; supported: boolean; failed: boolean };

type FullscreenNoticeProps = { fullscreen: FullscreenInfo; actionLabel: string; intro?: boolean };

export function FullscreenNotice({ fullscreen, actionLabel, intro = true }: FullscreenNoticeProps) {
  const { t } = useTranslation();
  const k = (key: string) => t(`onboarding.interview.fullscreen.${key}`, { action: actionLabel });
  if (!fullscreen.enabled) return null;
  if (!fullscreen.supported) {
    return (
      <Notice tone="neutral" icon={Info} title={k('unsupportedTitle')}>
        {k('unsupportedBody')}
      </Notice>
    );
  }
  if (!intro && !fullscreen.failed) return null;
  return (
    <div className="space-y-3">
      {intro && (
        <Notice icon={Maximize} title={k('noticeTitle')}>
          {k('noticeBody')}
        </Notice>
      )}
      {fullscreen.failed && (
        <div role="alert">
          <Notice tone="warning" icon={AlertTriangle} title={k('requestFailedTitle')}>
            {k('requestFailedBody')}
          </Notice>
        </div>
      )}
    </div>
  );
}
