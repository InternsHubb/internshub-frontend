import arrowRightWhite from '../../assets/auth/arrow-right-white.svg';
import googleIcon from '../../assets/auth/google.svg';

// Field shell shared by the Login and Register forms (Figma: #faf9fb fill, #e3dce6 border, 12px radius).
const FIELD_SHELL =
  'flex h-[50px] w-full items-center overflow-hidden rounded-xl border transition focus-within:border-[#8a48ad] focus-within:bg-white focus-within:ring-4 focus-within:ring-purple-100';
export const FIELD_INPUT =
  'h-full w-full min-w-0 bg-transparent px-[15px] text-[13px] text-ink outline-none placeholder:text-[#34303a]/50';
export const FIELD_LABEL = 'mb-2 block text-xs tracking-[0.02em] text-label';
export const TEXT_LINK =
  'rounded-sm text-brand-link underline underline-offset-2 hover:text-brand focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-primary';

// Outlined alternative sign-in button (Figma: #ccb8d8 border, 13px radius, 48px tall).
export const SOCIAL_BUTTON =
  'inline-flex min-h-12 items-center justify-center gap-[9px] rounded-[13px] border border-[#ccb8d8] bg-white px-3.5 text-[11px] font-bold tracking-[0.01em] text-ink-deep transition hover:bg-[#faf6fc] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-primary disabled:cursor-not-allowed disabled:opacity-60';

export function fieldShellClass(hasError: boolean, extra = ''): string {
  const state = hasError ? 'border-[#e2aaa5] bg-[#fff8f7]' : 'border-[#e3dce6] bg-[#faf9fb]';
  return `${FIELD_SHELL} ${state} ${extra}`;
}

type FieldErrorProps = {
  id: string;
  message?: string;
};

export function FieldError({ id, message }: FieldErrorProps) {
  if (!message) return null;
  return (
    <p id={id} className="mt-2 text-xs leading-[1.4] text-[#b42318]">
      {message}
    </p>
  );
}

type EyeIconProps = {
  isVisible: boolean;
};

// Figma eye icon; the slashed variant marks a password that is currently shown.
function EyeIcon({ isVisible }: EyeIconProps) {
  return (
    <svg aria-hidden="true" viewBox="0 0 20 20" fill="none" className="size-5">
      <path
        d="M2.083 10S5 5 10 5s7.917 5 7.917 5S15 15 10 15s-7.917-5-7.917-5Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12.083 10a2.083 2.083 0 1 1-4.166 0 2.083 2.083 0 0 1 4.166 0Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {isVisible ? (
        <path d="M3 3l14 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      ) : null}
    </svg>
  );
}

type PasswordToggleProps = {
  isVisible: boolean;
  onToggle: () => void;
  showLabel: string;
  hideLabel: string;
};

export function PasswordToggle({ isVisible, onToggle, showLabel, hideLabel }: PasswordToggleProps) {
  return (
    <button
      type="button"
      aria-label={isVisible ? hideLabel : showLabel}
      aria-pressed={isVisible}
      onClick={onToggle}
      className="inline-flex h-full min-w-11 shrink-0 items-center justify-center text-muted hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-[-3px] focus-visible:outline-brand-primary"
    >
      <EyeIcon isVisible={isVisible} />
    </button>
  );
}

type FormAlertProps = {
  title: string;
  message: string;
};

// Figma "Login · Wrong Credentials" banner.
export function FormAlert({ title, message }: FormAlertProps) {
  return (
    <div
      role="alert"
      className="mb-5 flex items-start gap-3 rounded-xl border border-[#f6d2cd] bg-[#fef3f2] px-4 py-3.5 text-[#b42318]"
    >
      <svg aria-hidden="true" viewBox="0 0 20 20" fill="none" className="mt-0.5 size-5 shrink-0">
        <circle cx="10" cy="10" r="8.25" stroke="currentColor" strokeWidth="1.5" />
        <path d="M10 6v4.5M10 13.5h.01" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
      <div>
        <p className="text-[13px] leading-5">{title}</p>
        <p className="text-xs leading-5">{message}</p>
      </div>
    </div>
  );
}

type AuthDividerProps = {
  label: string;
  className?: string;
};

// Figma "OR CONTINUE WITH" / "OR SIGN UP WITH" rule between the form and the other sign-in options.
export function AuthDivider({ label, className = '' }: AuthDividerProps) {
  return (
    <div className={`flex items-center ${className}`} aria-hidden="true">
      <span className="h-px flex-1 bg-[#e8e2ec]" />
      <span className="px-3 text-[10px] tracking-[0.14em] text-[#9a919e]">{label}</span>
      <span className="h-px flex-1 bg-[#e8e2ec]" />
    </div>
  );
}

type GoogleButtonProps = {
  label: string;
  isBusy: boolean;
  disabled: boolean;
  onClick: () => void;
  className?: string;
};

export function GoogleButton({ label, isBusy, disabled, onClick, className = '' }: GoogleButtonProps) {
  return (
    <button type="button" onClick={onClick} disabled={disabled} className={`${SOCIAL_BUTTON} ${className}`}>
      {isBusy ? (
        <span
          aria-hidden="true"
          className="size-4 animate-spin rounded-full border-2 border-ink-deep border-t-transparent"
        />
      ) : (
        <img alt="" src={googleIcon} className="size-4" />
      )}
      {label}
    </button>
  );
}

type SubmitButtonProps = {
  isSubmitting: boolean;
  label: string;
  submittingLabel: string;
};

export function SubmitButton({ isSubmitting, label, submittingLabel }: SubmitButtonProps) {
  return (
    <button
      type="submit"
      disabled={isSubmitting}
      aria-busy={isSubmitting}
      className="inline-flex min-h-[50px] w-full items-center justify-center gap-[9px] rounded-[13px] bg-[linear-gradient(173deg,#4c0585_0%,#3a0353_100%)] px-6 text-[13px] font-bold tracking-[0.01em] text-white shadow-[0_10px_22px_rgba(58,3,83,0.2)] transition hover:brightness-110 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-primary disabled:cursor-not-allowed disabled:opacity-70"
    >
      {isSubmitting ? (
        <span
          aria-hidden="true"
          className="size-4 animate-spin rounded-full border-2 border-white border-t-transparent"
        />
      ) : null}
      {isSubmitting ? submittingLabel : label}
      {isSubmitting ? null : <img alt="" src={arrowRightWhite} className="size-5 rtl:-scale-x-100" />}
    </button>
  );
}
