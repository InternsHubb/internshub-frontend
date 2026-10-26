import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import microsoftIcon from '@/assets/auth/microsoft.svg';
import phoneIcon from '@/assets/auth/phone-purple.svg';
import {
  AuthDivider,
  FIELD_INPUT,
  FIELD_LABEL,
  FieldError,
  FormAlert,
  GoogleButton,
  PasswordToggle,
  SOCIAL_BUTTON,
  SubmitButton,
  TEXT_LINK,
  fieldShellClass,
} from '@/components/auth/AuthFormParts';
import LoginLayout from '@/components/auth/LoginLayout';
import ResendConfirmation from '@/components/auth/ResendConfirmation';
import { ROUTES } from '@/constants/routes';
import { useAuth } from '@/hooks/useAuth';
import { useGoogleSignIn } from '@/hooks/useGoogleSignIn';
import { login } from '@/lib/api/auth';
import { isEmailNotConfirmedError, loginErrorKey } from '@/lib/auth/errorMessages';
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

// Shown when the Microsoft callback page sends the user back here with a failure.
export type LoginLocationState = {
  from?: string;
  errorKey?: string;
};

export default function Login() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const { status, user, reloadUser } = useAuth();

  useEffect(() => {
    if (status === 'authenticated' && user) {
      navigate(postSignInPath(user, redirectFromState(location.state)), { replace: true });
    }
  }, [status, user, navigate, location.state]);

  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [formErrorKey, setFormErrorKey] = useState<string | null>(
    () => (location.state as LoginLocationState | null)?.errorKey ?? null,
  );
  // Set when the login was refused because this address is not confirmed yet, so the user can ask
  // for a new confirmation email from here instead of only after sign-up.
  const [unconfirmedEmail, setUnconfirmedEmail] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginForm>({ resolver: zodResolver(loginSchema), mode: 'onSubmit', reValidateMode: 'onChange' });

  const finishSignIn = async () => {
    const loggedUser = await reloadUser();
    navigate(postSignInPath(loggedUser, redirectFromState(location.state)), { replace: true });
  };

  const google = useGoogleSignIn({ onError: setFormErrorKey, onSignedIn: finishSignIn });

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
    setUnconfirmedEmail(null);
    try {
      await login({ email: values.email, password: values.password });
    } catch (error) {
      setFormErrorKey(loginErrorKey(error));
      if (isEmailNotConfirmedError(error)) setUnconfirmedEmail(values.email);
      return;
    }
    await finishSignIn();
  };

  const handleGoogle = () => {
    setFormErrorKey(null);
    void google.signIn();
  };

  const isBusy = isSubmitting || google.isBusy;
  const emailError = errors.email?.message;
  const passwordError = errors.password?.message;

  return (
    <LoginLayout>
      {formErrorKey ? <FormAlert title={t('auth.login.errorTitle')} message={t(formErrorKey)} /> : null}
      {unconfirmedEmail ? (
        <div className="mb-4">
          <ResendConfirmation key={unconfirmedEmail} email={unconfirmedEmail} />
        </div>
      ) : null}

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

      <AuthDivider label={t('auth.login.divider')} className="pt-[23px]" />

      <div className="grid grid-cols-1 gap-2.5 pt-[17px] sm:grid-cols-2">
        <GoogleButton
          label={t('auth.login.google')}
          isBusy={google.isBusy}
          disabled={isBusy}
          onClick={handleGoogle}
        />
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
