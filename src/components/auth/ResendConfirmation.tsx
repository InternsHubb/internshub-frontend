import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { resendConfirmationEmail } from '@/lib/api/auth';
import { genericErrorKey } from '@/lib/auth/errorMessages';
import { FormAlert } from './AuthFormParts';

type ResendConfirmationProps = {
  email: string;
};

type ResendState = 'idle' | 'sending' | 'sent';

// "Resend confirmation email" for an account whose email is not confirmed yet. Shown after sign-up
// and when a login is refused with NotAllowed. The backend answers 200 for every address, so
// success only means the request was accepted, not that an email was delivered.
export default function ResendConfirmation({ email }: ResendConfirmationProps) {
  const { t } = useTranslation();
  const [resendState, setResendState] = useState<ResendState>('idle');
  const [resendErrorKey, setResendErrorKey] = useState<string | null>(null);

  const handleResend = async () => {
    setResendErrorKey(null);
    setResendState('sending');
    try {
      await resendConfirmationEmail(email);
      setResendState('sent');
    } catch (error) {
      setResendState('idle');
      setResendErrorKey(genericErrorKey(error));
    }
  };

  return (
    <div className="flex flex-col gap-3">
      {resendErrorKey ? (
        <FormAlert title={t('auth.register.resendFailedTitle')} message={t(resendErrorKey)} />
      ) : null}

      {resendState === 'sent' ? (
        <p role="status" className="text-xs text-[#16794a]">
          {t('auth.register.resent')}
        </p>
      ) : null}

      <button
        type="button"
        onClick={handleResend}
        disabled={resendState !== 'idle'}
        aria-busy={resendState === 'sending'}
        className="inline-flex min-h-12 w-full items-center justify-center rounded-[13px] border border-[#ccb8d8] bg-white px-4 text-[13px] font-bold text-ink-deep transition hover:bg-[#faf6fc] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-primary disabled:cursor-not-allowed disabled:opacity-60"
      >
        {resendState === 'sending' ? t('auth.register.resending') : t('auth.register.resend')}
      </button>
    </div>
  );
}
