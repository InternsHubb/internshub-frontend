
import React from 'react';

interface Props {
  phoneNumber: string;
  setPhoneNumber: (value: string) => void;
  countryCode: string;
  setCountryCode: (value: string) => void;
  error: string;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  onBackToLogin: () => void;
}

export default function PhoneInputStep({
  phoneNumber,
  setPhoneNumber,
  countryCode,
  setCountryCode,
  error,
  onSubmit,
  onBackToLogin,
}: Props) {
  return (
    <>
      <div className="auth-progress">
        <div className="progress-step active">
          <span className="progress-number">1</span>
          <span>Phone number</span>
        </div>

        <div className="progress-line" />

        <div className="progress-step inactive">
          <span className="progress-number">2</span>
          <span>Verification</span>
        </div>
      </div>

      <div className="auth-heading">
        <span className="auth-eyebrow">PHONE LOGIN</span>
        <h2>Login with your phone</h2>
        <p>
          Enter your phone number to receive a verification code.
        </p>
      </div>

      <form className="phone-login-form" onSubmit={onSubmit}>
        <label htmlFor="phone-number">Phone number</label>

        <div className={`phone-input-wrapper ${error ? 'has-error' : ''}`}>
          <div className="country-select-wrapper">
            <select
              aria-label="Country calling code"
              value={countryCode}
              onChange={(e) => setCountryCode(e.target.value)}
            >
              <option value="+20">Egypt (+20)</option>
              <option value="+966">Saudi Arabia (+966)</option>
              <option value="+971">UAE (+971)</option>
              <option value="+1">USA (+1)</option>
              <option value="+44">UK (+44)</option>
            </select>

            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              aria-hidden="true"
            >
              <path d="m6 9 6 6 6-6" />
            </svg>
          </div>

          <span className="input-divider" />

          <input
            id="phone-number"
            type="tel"
            inputMode="numeric"
            autoComplete="tel-national"
            placeholder="10 1234 5678"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            aria-invalid={Boolean(error)}
            aria-describedby={error ? 'phone-error' : undefined}
          />
        </div>

        {error && (
          <p id="phone-error" className="phone-error" role="alert">
            {error}
          </p>
        )}

        <button type="submit" className="send-code-button">
          <span>Send verification code</span>
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
      </form>

      <button
        type="button"
        className="back-to-login"
        onClick={onBackToLogin}
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          aria-hidden="true"
        >
          <path d="M19 12H5m6 6-6-6 6-6" />
        </svg>
        <span>Back to login</span>
      </button>

      <div className="privacy-note">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.7"
          aria-hidden="true"
        >
          <path d="M12 22s8-4 8-11V5l-8-3-8 3v6c0 7 8 11 8 11Z" />
          <path d="m9 12 2 2 4-4" />
        </svg>
        <p>Prototype only. No real SMS message will be sent.</p>
      </div>
    </>
  );
}
