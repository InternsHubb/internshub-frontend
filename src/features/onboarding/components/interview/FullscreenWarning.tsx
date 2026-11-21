import { useEffect, useId, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Maximize } from 'lucide-react';
import { BODY_TEXT, CARD, IconTile, PrimaryButton, TITLE_TEXT } from '@/features/onboarding/components/interview/parts';

// Fullscreen warning (research §17.4): replaces the question and answer area, so the question is
// hidden and answering is disabled until the candidate returns. Neutral wording; it makes no claim
// about why fullscreen was left. Returning needs a click — browsers don't allow automatic re-entry.
// No exit limit is shown: that limit is server policy and there is no interview API yet.

type FullscreenWarningProps = { onReturn: () => Promise<boolean> };

export function FullscreenWarning({ onReturn }: FullscreenWarningProps) {
  const { t } = useTranslation();
  const k = (key: string) => t(`onboarding.interview.fullscreen.${key}`);
  const titleId = useId();
  const bodyId = useId();
  const actions = useRef<HTMLDivElement>(null);
  const [busy, setBusy] = useState(false);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    actions.current?.querySelector('button')?.focus();
  }, []);

  const handleReturn = async () => {
    setBusy(true);
    const entered = await onReturn();
    setBusy(false);
    setFailed(!entered);
  };

  return (
    <section
      role="alertdialog"
      aria-labelledby={titleId}
      aria-describedby={bodyId}
      className={`${CARD} flex flex-col items-center px-6 py-10 text-center sm:px-10`}
    >
      <IconTile icon={Maximize} size="lg" solid />
      <h2 id={titleId} className={`mt-4 text-xl font-semibold ${TITLE_TEXT}`}>
        {k('warningTitle')}
      </h2>
      <p id={bodyId} className={`mt-2 max-w-[460px] text-sm leading-[1.6] ${BODY_TEXT}`}>
        {k('warningBody')}
      </p>
      <div ref={actions} className="mt-6">
        <PrimaryButton size="lg" disabled={busy} onClick={() => void handleReturn()}>
          {k('return')}
        </PrimaryButton>
      </div>
      <p role="status" className="mt-3 min-h-[18px] text-xs text-[#be123c]">
        {failed ? k('restoreFailed') : ''}
      </p>
    </section>
  );
}
