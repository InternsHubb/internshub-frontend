import './PhoneOTP.css';
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ROUTES } from '@/app/routes';
import { useAuth } from '@/shared/auth';
import { phoneOtpError, sendPhoneSignInCode, signInWithPhoneCode, type PhoneOtpError } from '@/features/authentication/services/authService';
import { postSignInPath, redirectFromState } from '@/shared/auth';
import PhoneInputStep from '@/features/authentication/components/PhoneInputStep';
import OtpVerificationStep from '@/features/authentication/components/OtpVerificationStep';
import lockWhiteIcon from '@/assets/auth/lock-white.svg';
import shieldCheckGreenIcon from '@/assets/auth/shield-check-green.svg';

const CODE_LENGTH = 6;
const RESEND_COOLDOWN_SECONDS = 60;
const SECOND_MS = 1000;
// E.164: "+", a country code that does not start with 0, then up to 15 digits in total.
const E164_PATTERN = /^\+[1-9]\d{7,14}$/;

const ERROR_MESSAGES: Record<PhoneOtpError, string> = {
  phoneInvalid: 'Enter a valid mobile number for the selected country.',
  codeInvalid: 'That code is not valid or has expired. Check the SMS or request a new code.',
  tooMany: 'Too many attempts. Please wait a few minutes and try again.',
  network: "We couldn't reach InternsHub. Check your connection and try again.",
  server: 'Something went wrong on our side. Please try again shortly.',
  rejected: "We couldn't complete that request. Please try again.",
};

// The backend only accepts international format (+201001234567). Local numbers are usually typed
// with the trunk prefix (01001234567), which is dropped after the country code.
function toInternationalNumber(countryCode: string, localNumber: string): string | null {
  const digits = localNumber.replace(/\D/g, '').replace(/^0+/, '');
  const value = `${countryCode}${digits}`;
  return E164_PATTERN.test(value) ? value : null;
}

const emptyCode = () => Array<string>(CODE_LENGTH).fill('');

export default function PhoneOTP() {
  const navigate = useNavigate();
  const location = useLocation();
  const { reloadUser } = useAuth();
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [countryCode, setCountryCode] = useState('+20');
  // The number the code was sent to, in the exact format the backend received it.
  const [sentTo, setSentTo] = useState('');
  const [error, setError] = useState('');
  const [otpError, setOtpError] = useState('');
  const [otpValues, setOtpValues] = useState<string[]>(emptyCode);
  const [isSending, setIsSending] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [resendIn, setResendIn] = useState(0);
  const [resendNotice, setResendNotice] = useState('');

  useEffect(() => {
    if (resendIn <= 0) return undefined;
    const timer = window.setTimeout(() => setResendIn((seconds) => seconds - 1), SECOND_MS);
    return () => window.clearTimeout(timer);
  }, [resendIn]);

  const requestCode = async (number: string): Promise<boolean> => {
    setIsSending(true);
    try {
      await sendPhoneSignInCode(number);
      setResendIn(RESEND_COOLDOWN_SECONDS);
      return true;
    } catch (err) {
      const message = ERROR_MESSAGES[phoneOtpError(err)];
      if (step === 'phone') setError(message);
      else setOtpError(message);
      return false;
    } finally {
      setIsSending(false);
    }
  };

  const handlePhoneSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isSending) return;

    const number = toInternationalNumber(countryCode, phoneNumber);
    if (!number) {
      setError(ERROR_MESSAGES.phoneInvalid);
      return;
    }

    setError('');
    if (!(await requestCode(number))) return;
    setSentTo(number);
    setOtpValues(emptyCode());
    setOtpError('');
    setResendNotice('');
    setStep('otp');
  };

  const handleOtpChange = (value: string, index: number) => {
    if (!/^\d*$/.test(value)) return;

    const nextOtp = [...otpValues];
    nextOtp[index] = value.slice(-1);
    setOtpValues(nextOtp);
    setOtpError('');

    if (value && index < CODE_LENGTH - 1) {
      document.getElementById(`otp-input-${index + 1}`)?.focus();
    }
  };

  // Pasting the code from the SMS fills every box at once.
  const handleOtpPaste = (text: string) => {
    const digits = text.replace(/\D/g, '').slice(0, CODE_LENGTH);
    if (!digits) return;
    setOtpValues(emptyCode().map((_, index) => digits[index] ?? ''));
    setOtpError('');
    document.getElementById(`otp-input-${Math.min(digits.length, CODE_LENGTH - 1)}`)?.focus();
  };

  const handleVerify = async () => {
    if (isVerifying) return;
    if (otpValues.some((digit) => digit === '')) {
      setOtpError(`Enter all ${CODE_LENGTH} digits of the code we sent.`);
      return;
    }

    setOtpError('');
    setIsVerifying(true);
    try {
      await signInWithPhoneCode(sentTo, otpValues.join(''));
    } catch (err) {
      setIsVerifying(false);
      setOtpError(ERROR_MESSAGES[phoneOtpError(err)]);
      return;
    }
    const user = await reloadUser();
    navigate(postSignInPath(user, redirectFromState(location.state)), { replace: true });
  };

  const handleResend = async () => {
    if (isSending || resendIn > 0) return;
    setOtpError('');
    setResendNotice('');
    if (await requestCode(sentTo)) {
      setOtpValues(emptyCode());
      setResendNotice('A new code is on its way.');
    }
  };

  const handleChangePhone = () => {
    setOtpValues(emptyCode());
    setError('');
    setOtpError('');
    setResendNotice('');
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
              isSending={isSending}
              onSubmit={handlePhoneSubmit}
              onBackToLogin={() => navigate(ROUTES.login)}
            />
          )}

          {step === 'otp' && (
            <OtpVerificationStep
              phoneNumber={sentTo}
              otpValues={otpValues}
              error={otpError}
              notice={resendNotice}
              isVerifying={isVerifying}
              isResending={isSending}
              resendIn={resendIn}
              onOtpChange={handleOtpChange}
              onOtpPaste={handleOtpPaste}
              onVerify={handleVerify}
              onResend={handleResend}
              onChangePhone={handleChangePhone}
            />
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
