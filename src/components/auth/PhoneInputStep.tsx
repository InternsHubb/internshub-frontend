
import React from 'react';
import arrowRightWhiteIcon from '../../assets/auth/arrow-right-white.svg';
import chevronDownIcon from '../../assets/auth/chevron-down-purple.svg';
import shieldCheckPurpleIcon from '../../assets/auth/shield-check-purple.svg';

interface Props {
  phoneNumber: string;
  setPhoneNumber: (value: string) => void;
  countryCode: string;
  setCountryCode: (value: string) => void;
  error: string;
  isSending: boolean;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  onBackToLogin: () => void;
}

export default function PhoneInputStep({
  phoneNumber,
  setPhoneNumber,
  countryCode,
  setCountryCode,
  error,
  isSending,
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
        <h2>Log in with your phone</h2>
        <p>
          Enter your phone number to receive a verification code.
        </p>
      </div>

      <form className="phone-login-form" onSubmit={onSubmit} noValidate>
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

            <img src={chevronDownIcon} alt="" aria-hidden="true" width={10} height={6} />
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

        <button type="submit" className="send-code-button" disabled={isSending} aria-busy={isSending}>
          <span>{isSending ? 'Sending code…' : 'Send verification code'}</span>
          <img src={arrowRightWhiteIcon} alt="" aria-hidden="true" width={20} height={20} />
        </button>
      </form>

      <button
        type="button"
        className="back-to-login"
        onClick={onBackToLogin}
      >
        <span className="back-to-login-arrow" aria-hidden="true">←</span>
        <span>Back to login</span>
      </button>

      <div className="privacy-note">
        <img src={shieldCheckPurpleIcon} alt="" aria-hidden="true" width={17} height={20} />
        <p>We use your number only to text you this sign-in code.</p>
      </div>
    </>
  );
}
