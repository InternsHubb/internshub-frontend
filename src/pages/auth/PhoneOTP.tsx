
import './PhoneOTP.css';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '@/constants/routes';
import PhoneInputStep from '../../components/auth/PhoneInputStep';
import OtpVerificationStep from '../../components/auth/OtpVerificationStep';
import SuccessStep from '../../components/auth/SuccessStep';
import lockWhiteIcon from '../../assets/auth/lock-white.svg';
import shieldCheckGreenIcon from '../../assets/auth/shield-check-green.svg';

export default function PhoneOTP() {
  const navigate = useNavigate();
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
        <div className="brand-circle" />

        <header className="brand-header">
          <div className="brand-identity">
            <div className="brand-lockup">
              <div className="brand-logo">ih</div>
              <span className="brand-name">
                Interns<span>Hub</span>
              </span>
            </div>
            <span className="brand-badge">EDTECH</span>
          </div>
        </header>

        <div className="brand-content">
          <div className="phone-illustration-area">
            <div className="phone-illustration">
              <div className="phone-ring phone-ring-solid" />
              <div className="phone-ring phone-ring-dashed" />

              <div className="phone-mockup">
                <div className="phone-speaker" />

                <div className="phone-screen">
                  <div className="phone-lock">
                    <img src={lockWhiteIcon} alt="" aria-hidden="true" width={29} height={29} />
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
              </div>

              <div className="security-tooltip">
                <img src={shieldCheckGreenIcon} alt="" aria-hidden="true" width={20} height={20} />

                <div className="security-copy">
                  <p>Protected sign-in</p>
                  <span>Five attempts before temporary lockout</span>
                </div>
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
              onBackToLogin={() => navigate(ROUTES.login)}
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
