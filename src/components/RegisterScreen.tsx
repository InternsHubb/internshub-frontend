import { useCallback, useState, type InputHTMLAttributes, type ReactNode } from 'react';
import { useForm, type UseFormRegisterReturn } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import chevronDown from '@/assets/auth/chevron-down-purple.svg';
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
import RegisterCheckEmail, { type RegisterCheckEmailReason } from '@/components/auth/RegisterCheckEmail';
import RegisterLayout from '@/components/auth/RegisterLayout';
import { ROUTES } from '@/constants/routes';
import { useAuth } from '@/hooks/useAuth';
import { ApiError } from '@/lib/api/client';
import { login, register as registerAccount } from '@/lib/api/auth';
import { registerErrorResult } from '@/lib/auth/errorMessages';
import LegalModal from './LegalModal';

const NATIONAL_ID_LENGTH = 14;
const PASSWORD_MIN_LENGTH = 8;
const PHONE_PATTERN = /^\d{10,11}$/;
const HTTP_UNAUTHORIZED = 401;

// Mirrors the backend's ASP.NET Identity password policy (RequiredLength 8, upper, lower, digit,
// non-alphanumeric), so most weak passwords are caught before the request.
const passwordSchema = z
  .string()
  .min(1, 'auth.common.errors.passwordRequired')
  .min(PASSWORD_MIN_LENGTH, 'auth.register.errors.passwordWeak')
  .regex(/[A-Z]/, 'auth.register.errors.passwordWeak')
  .regex(/[a-z]/, 'auth.register.errors.passwordWeak')
  .regex(/\d/, 'auth.register.errors.passwordWeak')
  .regex(/[^A-Za-z0-9]/, 'auth.register.errors.passwordWeak');

// Messages are translation keys, resolved at render time so they follow the active language.
const registerSchema = z
  .object({
    fullName: z.string().trim().min(1, 'auth.register.errors.fullNameRequired'),
    email: z
      .string()
      .trim()
      .min(1, 'auth.common.errors.emailRequired')
      .email('auth.common.errors.emailInvalid'),
    phone: z
      .string()
      .trim()
      .min(1, 'auth.register.errors.phoneRequired')
      .refine((value) => PHONE_PATTERN.test(value.replace(/\s+/g, '')), 'auth.register.errors.phoneInvalid'),
    nationalId: z
      .string()
      .trim()
      .min(1, 'auth.register.errors.nationalIdRequired')
      .regex(/^\d+$/, 'auth.register.errors.nationalIdDigits')
      .length(NATIONAL_ID_LENGTH, 'auth.register.errors.nationalIdLength'),
    password: passwordSchema,
    confirmPassword: z.string().min(1, 'auth.register.errors.confirmRequired'),
    agreeTerms: z.boolean().refine((value) => value, 'auth.register.errors.termsRequired'),
  })
  .refine((values) => values.password === values.confirmPassword, {
    path: ['confirmPassword'],
    message: 'auth.register.errors.passwordMismatch',
    // Compare as soon as both passwords are typed, even if other fields are still invalid.
    when: (payload) => {
      const value = payload.value as { password?: unknown; confirmPassword?: unknown };
      return typeof value.password === 'string' && typeof value.confirmPassword === 'string' && value.confirmPassword.length > 0;
    },
  });
type RegisterForm = z.infer<typeof registerSchema>;

type LegalDoc = 'terms' | 'privacy';

type FieldProps = {
  id: string;
  label: string;
  error?: string;
  className?: string;
  children: ReactNode;
};

function Field({ id, label, error, className = '', children }: FieldProps) {
  return (
    <div className={className}>
      <label htmlFor={id} className={FIELD_LABEL}>
        {label}
      </label>
      <div className={fieldShellClass(Boolean(error))}>{children}</div>
      <FieldError id={`${id}-error`} message={error} />
    </div>
  );
}

type TextInputProps = InputHTMLAttributes<HTMLInputElement> & {
  id: string;
  hasError: boolean;
  registration: UseFormRegisterReturn;
};

function TextInput({ id, hasError, registration, className = '', ...rest }: TextInputProps) {
  return (
    <input
      id={id}
      aria-invalid={hasError}
      aria-describedby={hasError ? `${id}-error` : undefined}
      className={`${FIELD_INPUT} ${className}`}
      {...rest}
      {...registration}
    />
  );
}

type CompletedRegistration = {
  email: string;
  reason: RegisterCheckEmailReason;
};

export default function RegisterScreen() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { reloadUser } = useAuth();

  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isConfirmVisible, setIsConfirmVisible] = useState(false);
  const [formErrorKey, setFormErrorKey] = useState<string | null>(null);
  const [openDoc, setOpenDoc] = useState<LegalDoc | null>(null);
  const [completed, setCompleted] = useState<CompletedRegistration | null>(null);
  const closeDoc = useCallback(() => setOpenDoc(null), []);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
    mode: 'onSubmit',
    reValidateMode: 'onChange',
    defaultValues: { agreeTerms: false },
  });

  // The register endpoint accepts only { email, password }. Full name, phone and national ID are
  // validated to match the design but are not sent: the API has no field for them at sign-up.
  const onSubmit = async (values: RegisterForm) => {
    setFormErrorKey(null);
    const credentials = { email: values.email, password: values.password };

    try {
      await registerAccount(credentials);
    } catch (error) {
      const result = registerErrorResult(error);
      if (result.formKey) setFormErrorKey(result.formKey);
      for (const [field, key] of Object.entries(result.fieldKeys)) {
        setError(field as 'email' | 'password', { message: key });
      }
      return;
    }

    // Registration does not sign the user in, so try a normal login with the same credentials.
    try {
      await login(credentials);
    } catch (error) {
      const needsConfirmation =
        error instanceof ApiError && error.status === HTTP_UNAUTHORIZED && error.problem?.detail === 'NotAllowed';
      setCompleted({ email: values.email, reason: needsConfirmation ? 'confirm' : 'signInFailed' });
      return;
    }

    await reloadUser();
    navigate(ROUTES.onboarding, { replace: true });
  };

  if (completed) {
    return (
      <RegisterLayout>
        <RegisterCheckEmail email={completed.email} reason={completed.reason} />
      </RegisterLayout>
    );
  }

  const termsError = errors.agreeTerms?.message;
  const errorText = (key?: string) => (key ? t(key) : undefined);

  return (
    <RegisterLayout>
      {formErrorKey ? <FormAlert title={t('auth.register.errorTitle')} message={t(formErrorKey)} /> : null}

      <form className="flex flex-col gap-3.5" onSubmit={handleSubmit(onSubmit)} noValidate>
        <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 sm:gap-3">
          <Field id="register-full-name" label={t('auth.register.fullNameLabel')} error={errorText(errors.fullName?.message)}>
            <TextInput
              id="register-full-name"
              type="text"
              autoComplete="name"
              placeholder={t('auth.register.fullNamePlaceholder')}
              hasError={Boolean(errors.fullName)}
              registration={register('fullName')}
            />
          </Field>
          <Field id="register-email" label={t('auth.register.emailLabel')} error={errorText(errors.email?.message)}>
            <TextInput
              id="register-email"
              type="email"
              dir="ltr"
              autoComplete="email"
              placeholder={t('auth.register.emailPlaceholder')}
              hasError={Boolean(errors.email)}
              registration={register('email')}
              className="rtl:text-right"
            />
          </Field>
        </div>

        <Field id="register-phone" label={t('auth.register.phoneLabel')} error={errorText(errors.phone?.message)}>
          {/* Egypt is the only supported country in the design; the code is shown, not selectable. */}
          <span className="flex h-full shrink-0 items-center gap-2 ps-4 pe-3 text-[11px] whitespace-nowrap text-ink-deep">
            {t('auth.register.phoneCountry')}
            <img alt="" src={chevronDown} className="h-1.5 w-2.5" />
          </span>
          <span aria-hidden="true" className="h-[27px] w-px shrink-0 bg-[#e8e2ec]" />
          <TextInput
            id="register-phone"
            type="tel"
            dir="ltr"
            inputMode="tel"
            autoComplete="tel-national"
            placeholder={t('auth.register.phonePlaceholder')}
            hasError={Boolean(errors.phone)}
            registration={register('phone')}
            className="px-3.5 rtl:text-right"
          />
        </Field>

        <Field id="register-national-id" label={t('auth.register.nationalIdLabel')} error={errorText(errors.nationalId?.message)}>
          <TextInput
            id="register-national-id"
            type="text"
            dir="ltr"
            inputMode="numeric"
            autoComplete="off"
            maxLength={NATIONAL_ID_LENGTH}
            placeholder={t('auth.register.nationalIdPlaceholder')}
            hasError={Boolean(errors.nationalId)}
            registration={register('nationalId')}
            className="rtl:text-right"
          />
        </Field>

        <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 sm:gap-3">
          <Field id="register-password" label={t('auth.common.passwordLabel')} error={errorText(errors.password?.message)}>
            <TextInput
              id="register-password"
              type={isPasswordVisible ? 'text' : 'password'}
              autoComplete="new-password"
              placeholder={t('auth.register.passwordPlaceholder')}
              hasError={Boolean(errors.password)}
              registration={register('password')}
            />
            <PasswordToggle
              isVisible={isPasswordVisible}
              onToggle={() => setIsPasswordVisible((visible) => !visible)}
              showLabel={t('auth.common.showPassword')}
              hideLabel={t('auth.common.hidePassword')}
            />
          </Field>
          <Field
            id="register-confirm-password"
            label={t('auth.register.confirmPasswordLabel')}
            error={errorText(errors.confirmPassword?.message)}
          >
            <TextInput
              id="register-confirm-password"
              type={isConfirmVisible ? 'text' : 'password'}
              autoComplete="new-password"
              placeholder={t('auth.register.confirmPasswordPlaceholder')}
              hasError={Boolean(errors.confirmPassword)}
              registration={register('confirmPassword')}
            />
            <PasswordToggle
              isVisible={isConfirmVisible}
              onToggle={() => setIsConfirmVisible((visible) => !visible)}
              showLabel={t('auth.register.showConfirmPassword')}
              hideLabel={t('auth.register.hideConfirmPassword')}
            />
          </Field>
        </div>

        {/* Figma "All Required Errors": the terms message sits inside the tinted box. */}
        <div
          className={`rounded-xl border px-[13px] py-3 ${
            termsError ? 'border-[#e2aaa5] bg-[#fff8f7]' : 'border-[#e8e2ec] bg-[#faf9fb]'
          }`}
        >
          <div className="flex items-center gap-2.5">
            <input
              id="register-terms"
              type="checkbox"
              aria-invalid={Boolean(termsError)}
              aria-describedby={termsError ? 'register-terms-error' : undefined}
              className="size-[17px] shrink-0 cursor-pointer accent-ink-deep"
              {...register('agreeTerms')}
            />
            <p className="text-[11px] leading-[15.5px] text-[#5c5c5c]">
              <label htmlFor="register-terms" className="cursor-pointer">
                {t('auth.register.agreePrefix')}
              </label>
              <button type="button" onClick={() => setOpenDoc('terms')} className={TEXT_LINK}>
                {t('auth.register.terms')}
              </button>
              {t('auth.register.agreeJoin')}
              <button type="button" onClick={() => setOpenDoc('privacy')} className={TEXT_LINK}>
                {t('auth.register.privacy')}
              </button>
              {t('auth.register.agreeSuffix')}
            </p>
          </div>
          {termsError ? (
            <p id="register-terms-error" className="mt-2 text-xs leading-[1.4] text-[#b42318]">
              {t(termsError)}
            </p>
          ) : null}
        </div>

        <SubmitButton
          isSubmitting={isSubmitting}
          label={t('auth.register.submit')}
          submittingLabel={t('auth.register.submitting')}
        />
      </form>

      <p className="mt-[15px] text-center text-[11px] text-muted">
        {t('auth.register.haveAccount')}{' '}
        <Link to={ROUTES.login} className={TEXT_LINK}>
          {t('auth.register.login')}
        </Link>
      </p>

      <LegalModal
        isOpen={openDoc !== null}
        title={openDoc === 'privacy' ? t('auth.register.privacy') : t('auth.register.terms')}
        content={openDoc === 'privacy' ? t('auth.register.privacyContent') : t('auth.register.termsContent')}
        onClose={closeDoc}
      />
    </RegisterLayout>
  );
}
