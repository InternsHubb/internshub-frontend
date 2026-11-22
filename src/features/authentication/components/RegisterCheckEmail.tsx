import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

import { ROUTES } from '@/app/routes';
import ResendConfirmation from '@/features/authentication/components/ResendConfirmation';

// Why the new account could not be signed in straight away:
// - confirm: the backend answered "NotAllowed", i.e. the email must be confirmed first.
// - signInFailed: the account was created but the follow-up login failed for another reason.
export type RegisterCheckEmailReason = 'confirm' | 'signInFailed';

type RegisterCheckEmailProps = {
  email: string;
  reason: RegisterCheckEmailReason;
};

export default function RegisterCheckEmail({ email, reason }: RegisterCheckEmailProps) {
  const { t } = useTranslation();
  const isConfirm = reason === 'confirm';

  return (
    <section aria-live="polite" className="flex flex-col gap-4">
      <div className="rounded-xl border border-[#cfe8da] bg-[#f3faf6] px-4 py-3.5">
        <p className="text-[13px] font-bold text-[#16794a]">
          {t(isConfirm ? 'auth.register.successTitle' : 'auth.register.createdTitle')}
        </p>
        <p className="mt-1 text-xs leading-5 text-ink">
          {t(isConfirm ? 'auth.register.successBody' : 'auth.register.createdBody', { email })}
        </p>
      </div>

      <ResendConfirmation email={email} />

      <Link
        to={ROUTES.login}
        className="inline-flex min-h-[50px] w-full items-center justify-center rounded-[13px] bg-[linear-gradient(173deg,#4c0585_0%,#3a0353_100%)] px-6 text-[13px] font-bold text-white shadow-[0_10px_22px_rgba(58,3,83,0.2)] transition hover:brightness-110 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-primary"
      >
        {t('auth.register.goToLogin')}
      </Link>
    </section>
  );
}
