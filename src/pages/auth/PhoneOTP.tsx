
import './PhoneOTP.css';
import React, { useState } from 'react';
import PhoneInputStep from '../../components/auth/PhoneInputStep';
import OtpVerificationStep from '../../components/auth/OtpVerificationStep';
import SuccessStep from '../../components/auth/SuccessStep';

export default function PhoneOTP() {
  const [step, setStep] = useState<'phone' | 'otp' | 'success'>('phone');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [countryCode, setCountryCode] = useState('+20');
  const [error, setError] = useState('');
  const [otpValues, setOtpValues] = useState<string[]>(Array(6).fill(''));

  const handlePhoneSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const digits = phoneNumber.replace(/\D/g, '');

    if (digits.length < 8) {
      setError('Please enter a valid phone number');
      return;
    }

    setError('');
    setOtpValues(Array(6).fill(''));
    setStep('otp');
  };

  const handleOtpChange = (value: string, index: number) => {
    if (!/^\d*$/.test(value)) return;

    const nextOtp = [...otpValues];
    nextOtp[index] = value.slice(-1);
    setOtpValues(nextOtp);

    if (value && index < 5) {
      document.getElementById(`otp-input-${index + 1}`)?.focus();
    }
  };

  const handleVerify = () => {
    if (otpValues.every((digit) => digit !== '')) {
      setStep('success');
    }
  };

  const handleChangePhone = () => {
    setOtpValues(Array(6).fill(''));
    setError('');
    setStep('phone');
  };

  return (
    <main className="phone-auth-page">
      <section className="phone-brand-panel">
        <div className="brand-orb brand-orb-one" />
        <div className="brand-orb brand-orb-two" />
        <div className="brand-orb brand-orb-three" />
        <div className="brand-wave brand-wave-one" />
        <div className="brand-wave brand-wave-two" />


<header className="brand-header">
  <div className="brand-identity">
    
<div className="brand-logo">ih</div>

    <span className="brand-name">
  Interns<span>Hub</span>
</span>
    <span className="brand-badge">EDTECH</span>
  </div>
</header>


        <div className="brand-content">
          <div className="phone-illustration-area">
            <div className="phone-ring phone-ring-one" />
            <div className="phone-ring phone-ring-two" />

            <div className="phone-mockup">
              <div className="phone-speaker" />

              <div className="phone-lock">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  className="lock-icon"
                  aria-hidden="true"
                >
                  <rect x="5" y="10" width="14" height="11" rx="2" />
                  <path d="M8 10V7a4 4 0 0 1 8 0v3" />
                </svg>
              </div>

              <p className="phone-screen-title">Secure phone access</p>

              <div className="phone-code-preview">
                {[1, 2, 3, 4, 5, 6].map((item) => (
                  <span key={item} />
                ))}
              </div>

              <p className="phone-screen-caption">
                One-time verification
              </p>
            </div>

            <div className="security-tooltip">
              <div className="security-icon">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  aria-hidden="true"
                >
                  <path d="M12 22s8-4 8-11V5l-8-3-8 3v6c0 7 8 11 8 11Z" />
                  <path d="m9 12 2 2 4-4" />
                </svg>
              </div>

              <div className="security-copy">
                <p>Protected sign-in</p>
                <span>Five attempts before temporary lockout</span>
              </div>
            </div>
          </div>

          <div className="brand-message">
            <p className="brand-eyebrow">SECURE PHONE LOGIN</p>
            <h1>One code. One secure step.</h1>
            <p className="brand-description">
              Use your phone number to return to your
              InternsHub journey safely.
            </p>
          </div>
        </div>

        <footer className="brand-footer">
          <span>Private</span>
          <i />
          <span>Verified</span>
          <i />
          <span>Secure</span>
        </footer>
      </section>

      <section className="phone-form-panel">
        <div className="auth-content">
          {step === 'phone' && (
            <PhoneInputStep
              phoneNumber={phoneNumber}
              setPhoneNumber={setPhoneNumber}
              countryCode={countryCode}
              setCountryCode={setCountryCode}
              error={error}
              onSubmit={handlePhoneSubmit}
              onBackToLogin={() => window.history.back()}
            />
          )}

          {step === 'otp' && (
            <OtpVerificationStep
              phoneNumber={`${countryCode} ${phoneNumber}`}
              otpValues={otpValues}
              onOtpChange={handleOtpChange}
              onVerify={handleVerify}
              onChangePhone={handleChangePhone}
            />
          )}

          {step === 'success' && (
            <SuccessStep onBackToLogin={handleChangePhone} />
          )}
        </div>

        <footer className="form-footer">
          <span>Need help signing in?</span>
          <a href="/help">Visit Help Center</a>
        </footer>
      </section>
    </main>
  );
}
