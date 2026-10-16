
import React, { useState } from 'react';

interface Props {
  phoneNumber: string;
  otpValues: string[];
  onOtpChange: (value: string, index: number) => void;
  onVerify: () => void;
  onChangePhone: () => void;
}

export default function OtpVerificationStep({
  phoneNumber,
  otpValues,
  onOtpChange,
  onVerify,
  onChangePhone,
}: Props) {
  const [otpError, setOtpError] = useState(false);


const [callingCode, ...phoneParts] = phoneNumber.split(' ');
const localDigits = phoneParts.join('').replace(/\D/g, '');

const maskedPhone =
  localDigits.length > 4
    ? `${callingCode} ${'•'.repeat(localDigits.length - 4)}${localDigits.slice(-4)}`
    : phoneNumber;


  const handleVerify = () => {
    if (otpValues.some((digit) => digit === '')) {
      setOtpError(true);
      return;
    }

    setOtpError(false);
    onVerify();
  };

  const handleOtpInput = (value: string, index: number) => {
    setOtpError(false);
    onOtpChange(value, index);
  };

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
          <strong className="masked-phone">{maskedPhone}</strong>.
        </p>
      </div>

      {otpError && (
        <div className="otp-error-box" role="alert">
          <span className="otp-error-icon">!</span>
          <div>
            <p className="otp-error-title">Invalid verification code</p>
            <p className="otp-error-description">
              Please enter all six digits and try again.
            </p>
          </div>
        </div>
      )}

      <label className="otp-label">6-digit verification code</label>

      <div className="otp-inputs">
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
            onChange={(e) => handleOtpInput(e.target.value, index)}
            onKeyDown={(e) => {
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
            className={`otp-input ${otpError ? 'has-error' : ''}`}
          />
        ))}
      </div>

      <button
        type="button"
        onClick={handleVerify}
        className="send-code-button otp-verify-button"
      >
        <span>Verify and continue</span>
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
        <button type="button" onClick={onChangePhone}>
          Change phone number
        </button>

        <button
          type="button"
          onClick={() => window.alert('Code resent!')}
        >
          Resend code
        </button>
      </div>

      <p className="otp-prototype-note">
        Prototype only. No real SMS message will be sent.
      </p>
    </div>
  );
}
