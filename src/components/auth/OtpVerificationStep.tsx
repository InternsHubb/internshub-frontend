interface Props {
  // International format, as sent to the backend (e.g. +201001234567).
  phoneNumber: string;
  otpValues: string[];
  error: string;
  notice: string;
  isVerifying: boolean;
  isResending: boolean;
  // Seconds until another code may be requested; 0 when resend is available.
  resendIn: number;
  onOtpChange: (value: string, index: number) => void;
  onOtpPaste: (text: string) => void;
  onVerify: () => void;
  onResend: () => void;
  onChangePhone: () => void;
}

const VISIBLE_DIGITS = 4;
// "+20" and the start of the number stay visible so the user can tell which number it was.
const VISIBLE_PREFIX = 3;

function maskPhone(phoneNumber: string): string {
  if (phoneNumber.length <= VISIBLE_PREFIX + VISIBLE_DIGITS) return phoneNumber;
  const hidden = phoneNumber.length - VISIBLE_PREFIX - VISIBLE_DIGITS;
  return `${phoneNumber.slice(0, VISIBLE_PREFIX)} ${'•'.repeat(hidden)}${phoneNumber.slice(-VISIBLE_DIGITS)}`;
}

export default function OtpVerificationStep({
  phoneNumber,
  otpValues,
  error,
  notice,
  isVerifying,
  isResending,
  resendIn,
  onOtpChange,
  onOtpPaste,
  onVerify,
  onResend,
  onChangePhone,
}: Props) {
  const maskedPhone = maskPhone(phoneNumber);
  let resendLabel = 'Resend code';
  if (isResending) resendLabel = 'Sending…';
  else if (resendIn > 0) resendLabel = `Resend code in ${resendIn}s`;

  return (
    <div className="otp-step">
      <div className="auth-progress">
        <div className="progress-step completed">
          <span className="progress-number">✓</span>
          <span>Phone number</span>
        </div>

        <div className="progress-line completed-line" />

        <div className="progress-step active">
          <span className="progress-number">2</span>
          <span>Verification</span>
        </div>
      </div>

      <div className="auth-heading">
        <span className="auth-eyebrow">VERIFY PHONE</span>
        <h2>Enter verification code</h2>
        <p>
          We sent a verification code to{' '}
          <strong className="masked-phone" dir="ltr">{maskedPhone}</strong>.
        </p>
      </div>

      {error && (
        <div className="otp-error-box" role="alert">
          <span className="otp-error-icon">!</span>
          <div>
            <p className="otp-error-title">Verification failed</p>
            <p className="otp-error-description">{error}</p>
          </div>
        </div>
      )}

      {notice && !error && (
        <p className="otp-prototype-note" role="status">
          {notice}
        </p>
      )}

      <label className="otp-label">6-digit verification code</label>

      <div className="otp-inputs" dir="ltr">
        {otpValues.map((digit, index) => (
          <input
            key={index}
            id={`otp-input-${index}`}
            type="text"
            inputMode="numeric"
            autoComplete={index === 0 ? 'one-time-code' : 'off'}
            maxLength={1}
            aria-label={`Verification digit ${index + 1}`}
            value={digit}
            disabled={isVerifying}
            onChange={(e) => onOtpChange(e.target.value, index)}
            onPaste={(e) => {
              e.preventDefault();
              onOtpPaste(e.clipboardData.getData('text'));
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                onVerify();
                return;
              }
              if (
                e.key === 'Backspace' &&
                !otpValues[index] &&
                index > 0
              ) {
                document
                  .getElementById(`otp-input-${index - 1}`)
                  ?.focus();
              }
            }}
            className={`otp-input ${error ? 'has-error' : ''}`}
          />
        ))}
      </div>

      <button
        type="button"
        onClick={onVerify}
        disabled={isVerifying}
        aria-busy={isVerifying}
        className="send-code-button otp-verify-button"
      >
        <span>{isVerifying ? 'Verifying…' : 'Verify and continue'}</span>
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          aria-hidden="true"
        >
          <path d="M5 12h14M13 6l6 6-6 6" />
        </svg>
      </button>

      <div className="otp-actions">
        <button type="button" onClick={onChangePhone} disabled={isVerifying}>
          Change phone number
        </button>

        <button
          type="button"
          onClick={onResend}
          disabled={isVerifying || isResending || resendIn > 0}
        >
          {resendLabel}
        </button>
      </div>
    </div>
  );
}
