import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import googleIcon from '@/assets/auth/google.svg';
import microsoftIcon from '@/assets/auth/microsoft.svg';
import phoneIcon from '@/assets/auth/phone-purple.svg';
import {
  FIELD_INPUT,
  FIELD_LABEL,
  FieldError,
  FormAlert,
  PasswordToggle,
  SubmitButton,
  TEXT_LINK,
  fieldShellClass,
} from '@/components/auth/AuthFormParts';
import LoginLayout from '@/components/auth/LoginLayout';
import { ROUTES } from '@/constants/routes';
import { useAuth } from '@/hooks/useAuth';
import { login, signInWithGoogle } from '@/lib/api/auth';
import { externalSignInErrorKey, loginErrorKey } from '@/lib/auth/errorMessages';
import { GoogleSignInError, requestGoogleIdToken } from '@/lib/auth/googleIdentity';
import { MicrosoftSignInError, startMicrosoftSignIn } from '@/lib/auth/microsoftIdentity';
import { postSignInPath, redirectFromState } from '@/lib/auth/redirect';

// Messages are translation keys, resolved at render time so they follow the active language.
const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, 'auth.common.errors.emailRequired')
    .email('auth.common.errors.emailInvalid'),
  password: z.string().min(1, 'auth.common.errors.passwordRequired'),
});
type LoginForm = z.infer<typeof loginSchema>;

const SOCIAL_BUTTON =
  'inline-flex min-h-12 items-center justify-center gap-[9px] rounded-[13px] border border-[#ccb8d8] bg-white px-3.5 text-[11px] font-bold tracking-[0.01em] text-ink-deep transition hover:bg-[#faf6fc] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-primary disabled:cursor-not-allowed disabled:opacity-60';

// Shown when the Microsoft callback page sends the user back here with a failure.
export type LoginLocationState = {
  from?: string;
  errorKey?: string;
};

export default function Login() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const { reloadUser } = useAuth();

  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [formErrorKey, setFormErrorKey] = useState<string | null>(
    () => (location.state as LoginLocationState | null)?.errorKey ?? null,
  );
  const [isGoogleBusy, setIsGoogleBusy] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginForm>({ resolver: zodResolver(loginSchema), mode: 'onSubmit', reValidateMode: 'onChange' });

  const finishSignIn = async () => {
    const user = await reloadUser();
    navigate(redirectFromState(location.state) ?? postSignInPath(user), { replace: true });
  };

  // Leaves the app for the Microsoft sign-in page; MicrosoftCallback finishes the sign-in.
  const handleMicrosoft = () => {
    setFormErrorKey(null);
    try {
      startMicrosoftSignIn(redirectFromState(location.state));
    } catch (error) {
      setFormErrorKey(
        error instanceof MicrosoftSignInError && error.reason === 'unavailable'
          ? 'auth.login.errors.microsoftUnavailable'
          : 'auth.login.errors.microsoftFailed',
      );
    }
  };

  const onSubmit = async (values: LoginForm) => {
    setFormErrorKey(null);
    try {
      await login({ email: values.email, password: values.password });
    } catch (error) {
      setFormErrorKey(loginErrorKey(error));
      return;
    }
    await finishSignIn();
  };

  const handleGoogle = async () => {
    setFormErrorKey(null);
    setIsGoogleBusy(true);
    try {
      const idToken = await requestGoogleIdToken();
      await signInWithGoogle(idToken);
    } catch (error) {
      setIsGoogleBusy(false);
      if (error instanceof GoogleSignInError) {
        setFormErrorKey(
          error.reason === 'unavailable' ? 'auth.login.errors.googleUnavailable' : 'auth.login.errors.googleFailed',
        );
      } else {
        setFormErrorKey(externalSignInErrorKey(error, 'google'));
      }
      return;
    }
    await finishSignIn();
  };

  const isBusy = isSubmitting || isGoogleBusy;
  const emailError = errors.email?.message;
  const passwordError = errors.password?.message;

  return (
    <LoginLayout>
      {formErrorKey ? <FormAlert title={t('auth.login.errorTitle')} message={t(formErrorKey)} /> : null}

      <form className="flex flex-col" onSubmit={handleSubmit(onSubmit)} noValidate>
        <label htmlFor="login-email" className={FIELD_LABEL}>
          {t('auth.common.emailLabel')}
        </label>
        <div className={fieldShellClass(Boolean(emailError))}>
          <input
            id="login-email"
            type="email"
            dir="ltr"
            autoComplete="username"
            placeholder={t('auth.common.emailPlaceholder')}
            aria-invalid={Boolean(emailError)}
            aria-describedby={emailError ? 'login-email-error' : undefined}
            className={`${FIELD_INPUT} rtl:text-right`}
            {...register('email')}
          />
        </div>
        <FieldError id="login-email-error" message={emailError ? t(emailError) : undefined} />

        <div className="mt-[15px] mb-2 flex items-center justify-between gap-3">
          <label htmlFor="login-password" className="text-xs text-[#111827]">
            {t('auth.common.passwordLabel')}
          </label>
          <Link to={ROUTES.forgotPassword} className={`${TEXT_LINK} text-[11px]`}>
            {t('auth.login.forgotPassword')}
          </Link>
        </div>
        <div className={fieldShellClass(Boolean(passwordError))}>
          <input
            id="login-password"
            type={isPasswordVisible ? 'text' : 'password'}
            autoComplete="current-password"
            placeholder={t('auth.login.passwordPlaceholder')}
            aria-invalid={Boolean(passwordError)}
            aria-describedby={passwordError ? 'login-password-error' : undefined}
            className={FIELD_INPUT}
            {...register('password')}
          />
          <PasswordToggle
            isVisible={isPasswordVisible}
            onToggle={() => setIsPasswordVisible((visible) => !visible)}
            showLabel={t('auth.common.showPassword')}
            hideLabel={t('auth.common.hidePassword')}
          />
        </div>
        <FieldError id="login-password-error" message={passwordError ? t(passwordError) : undefined} />

        <div className="mt-5">
          <SubmitButton
            isSubmitting={isSubmitting}
            label={t('auth.login.submit')}
            submittingLabel={t('auth.login.submitting')}
          />
        </div>
      </form>

      <div className="flex items-center pt-[23px]" aria-hidden="true">
        <span className="h-px flex-1 bg-[#e8e2ec]" />
        <span className="px-3 text-[10px] tracking-[0.14em] text-[#9a919e]">{t('auth.login.divider')}</span>
        <span className="h-px flex-1 bg-[#e8e2ec]" />
      </div>

      <div className="grid grid-cols-1 gap-2.5 pt-[17px] sm:grid-cols-2">
        <button type="button" onClick={handleGoogle} disabled={isBusy} className={SOCIAL_BUTTON}>
          {isGoogleBusy ? (
            <span
              aria-hidden="true"
              className="size-4 animate-spin rounded-full border-2 border-ink-deep border-t-transparent"
            />
          ) : (
            <img alt="" src={googleIcon} className="size-4" />
          )}
          {t('auth.login.google')}
        </button>
        <Link to={ROUTES.phoneOtp} className={SOCIAL_BUTTON}>
          <img alt="" src={phoneIcon} className="size-4" />
          {t('auth.login.phoneOtp')}
        </Link>
      </div>

      {/* Figma's full-width Microsoft row, enabled with the same treatment as the Google button. */}
      <button type="button" onClick={handleMicrosoft} disabled={isBusy} className={`${SOCIAL_BUTTON} mt-2.5 w-full`}>
        <img alt="" src={microsoftIcon} className="size-4" />
        {t('auth.login.microsoft')}
      </button>

      <p className="pt-[22px] text-center text-[11px] text-muted">
        {t('auth.login.newHere')}{' '}
        <Link to={ROUTES.register} className={TEXT_LINK}>
          {t('auth.login.createAccount')}
        </Link>
      </p>
    </LoginLayout>
  );
}
