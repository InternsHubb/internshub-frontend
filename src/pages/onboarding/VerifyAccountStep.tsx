import { useEffect, useRef, useState, type ClipboardEvent, type KeyboardEvent } from 'react';
import { useTranslation } from 'react-i18next';

import idCardPurpleIcon from '../../assets/onboarding/id-card-purple.svg';
import lockPurpleIcon from '../../assets/onboarding/lock-purple.svg';
import shieldPurpleIcon from '../../assets/onboarding/shield-purple.svg';
import ResendConfirmation from '@/components/auth/ResendConfirmation';
import { useAuth } from '@/hooks/useAuth';
import { confirmPhoneCode, sendPhoneConfirmationCode } from '@/lib/api/me';
import type { MeDto } from '@/lib/api/types';
import { phoneVerificationErrorKey } from '@/lib/auth/errorMessages';

// Step 01 "Verify Your Account". All statuses come from GET /api/me.
// - Email is confirmed only through the link in the confirmation email, which opens the backend's
//   GET /api/auth/confirmEmail directly; this page just reads `emailConfirmed` back.
// - Phone is confirmed with an SMS code through the /api/me/phone endpoints.
// - The backend has no National ID verification, so that card stays visible but inactive and never
//   shows a verified state.

const CODE_LENGTH = 6;
const RESEND_COOLDOWN_SECONDS = 60;
const SECOND_MS = 1000;
const DEFAULT_COUNTRY_CODE = '+20';
// E.164: "+", a country code that does not start with 0, then up to 15 digits in total.
const E164_PATTERN = /^\+[1-9]\d{7,14}$/;

const CARD = 'bg-white/92 p-6 rounded-[28px] border border-[#3A0353]/10 shadow-sm flex flex-col justify-between';
const ICON_TILE = 'w-[42px] h-[42px] shrink-0 bg-[#F3E9FA] rounded-[12px] flex items-center justify-center';
const FIELD =
  'w-full h-[52px] px-4 border border-[#D9D1DD] rounded-[10px] text-xs bg-[#FAF9FB] outline-none focus:border-[#5C1D87] disabled:opacity-70';
const PRIMARY_BUTTON =
  'min-h-[50px] px-6 bg-gradient-to-r from-[#4C0585] to-[#3A0353] text-white font-bold text-[13px] rounded-[13px] shadow-[0_10px_22px_rgba(58,3,83,0.2)] mb-3 disabled:bg-none disabled:bg-[#ECEAED] disabled:text-[#9A939E] disabled:shadow-none';
const TEXT_BUTTON = 'text-xs text-[#5C1D87] underline disabled:no-underline disabled:text-[#9A939E]';

type BadgeState = 'pending' | 'verified' | 'unavailable';

const BADGE_CLASSES: Record<BadgeState, string> = {
  pending: 'bg-[#F1EEF2] text-[#685F6D]',
  verified: 'bg-[#EAF8F0] text-[#16794A]',
  unavailable: 'bg-[#F1EEF2] text-[#9A939E]',
};

// Local numbers are usually typed with the trunk prefix (01001234567), which is dropped after the
// default country code; numbers typed with "+" are taken as already international.
function toInternationalNumber(raw: string): string | null {
  const trimmed = raw.trim();
  const value = trimmed.startsWith('+')
    ? `+${trimmed.slice(1).replace(/\D/g, '')}`
    : `${DEFAULT_COUNTRY_CODE}${trimmed.replace(/\D/g, '').replace(/^0+/, '')}`;
  return E164_PATTERN.test(value) ? value : null;
}

function maskEmail(email: string): string {
  const [name, domain] = email.split('@');
  return domain ? `${name.slice(0, 1)}***@${domain}` : email;
}

function maskPhone(phone: string): string {
  return phone.length > 7 ? `${phone.slice(0, 3)} ••• ••• ${phone.slice(-4)}` : phone;
}

function useCooldown() {
  const [secondsLeft, setSecondsLeft] = useState(0);
  useEffect(() => {
    if (secondsLeft <= 0) return undefined;
    const id = window.setTimeout(() => setSecondsLeft((seconds) => seconds - 1), SECOND_MS);
    return () => window.clearTimeout(id);
  }, [secondsLeft]);
  return { secondsLeft, start: () => setSecondsLeft(RESEND_COOLDOWN_SECONDS) };
}

function StatusBadge({ state }: { state: BadgeState }) {
  const { t } = useTranslation();
  return (
    <span className={`shrink-0 px-2.5 py-1 text-[9px] font-bold rounded-full ${BADGE_CLASSES[state]}`}>
      {t(`onboarding.verify.badge.${state}`)}
    </span>
  );
}

type CardHeaderProps = {
  icon: string;
  title: string;
  subtitle: string | null;
  badge: BadgeState;
  isSubtitleLtr?: boolean;
};

function CardHeader({ icon, title, subtitle, badge, isSubtitleLtr = false }: CardHeaderProps) {
  return (
    <div className="flex items-start gap-3 mb-6">
      <div className={ICON_TILE}><img src={icon} alt="" aria-hidden="true" width={20} height={20} /></div>
      <div className="min-w-0 flex-1 pt-0.5">
        <h3 className="text-base font-normal text-[#111827]">{title}</h3>
        {subtitle && (
          <p className="text-[11px] text-[#6B7280] mt-1 break-words" dir={isSubtitleLtr ? 'ltr' : undefined}>
            {subtitle}
          </p>
        )}
      </div>
      <StatusBadge state={badge} />
    </div>
  );
}

// The confirmation link opens the backend directly and never returns to this app, so the status
// is re-read when the page opens, when the user comes back to the tab, and on "Check status".
function EmailCard({ user }: { user: MeDto }) {
  const { t } = useTranslation();
  const { reloadUser } = useAuth();
  const [isChecking, setIsChecking] = useState(false);
  const [noticeKey, setNoticeKey] = useState<string | null>(null);
  // Strict check: a missing or non-boolean value from the API never counts as confirmed.
  const isConfirmed = user.emailConfirmed === true;

  useEffect(() => {
    if (isConfirmed) return undefined;
    void reloadUser();
    const refreshWhenVisible = () => {
      if (document.visibilityState === 'visible') void reloadUser();
    };
    document.addEventListener('visibilitychange', refreshWhenVisible);
    window.addEventListener('focus', refreshWhenVisible);
    return () => {
      document.removeEventListener('visibilitychange', refreshWhenVisible);
      window.removeEventListener('focus', refreshWhenVisible);
    };
  }, [isConfirmed, reloadUser]);

  const subtitle = user.email ? maskEmail(user.email) : t('onboarding.verify.email.noEmail');

  if (isConfirmed) {
    return (
      <div className={CARD}>
        <CardHeader icon={shieldPurpleIcon} title={t('onboarding.verify.email.title')} subtitle={subtitle} badge="verified" isSubtitleLtr />
        <p className="text-[11px] text-[#16794A]">{t('onboarding.verify.email.verified')}</p>
      </div>
    );
  }

  // A failed reload leaves the user record empty, which the step shows as an error; the card never
  // turns verified from anything but a reloaded record with emailConfirmed: true.
  const handleCheck = async () => {
    setNoticeKey(null);
    setIsChecking(true);
    const reloaded = await reloadUser();
    setIsChecking(false);
    if (reloaded && reloaded.emailConfirmed !== true) setNoticeKey('onboarding.verify.email.stillPending');
  };

  return (
    <div className={CARD}>
      <div>
        <CardHeader
          icon={shieldPurpleIcon}
          title={t('onboarding.verify.email.title')}
          subtitle={subtitle}
          badge="pending"
          isSubtitleLtr={Boolean(user.email)}
        />
        <p className="text-[11px] text-[#111827] mb-5">
          {t(user.email ? 'onboarding.verify.email.instructions' : 'onboarding.verify.email.noEmailHelp')}
        </p>
      </div>
      <div>
        <button
          type="button"
          className={PRIMARY_BUTTON}
          disabled={isChecking}
          aria-busy={isChecking}
          onClick={() => void handleCheck()}
        >
          {t(isChecking ? 'onboarding.verify.email.checking' : 'onboarding.verify.email.checkStatus')}
        </button>
        {noticeKey && <p role="status" className="text-[11px] text-[#5C5C5C] mb-3">{t(noticeKey)}</p>}
        {user.email && <ResendConfirmation email={user.email} />}
      </div>
    </div>
  );
}

type CodeInputProps = {
  value: string[];
  disabled: boolean;
  onChange: (value: string[]) => void;
};

function CodeInput({ value, disabled, onChange }: CodeInputProps) {
  const { t } = useTranslation();
  const refs = useRef<Array<HTMLInputElement | null>>([]);

  const setDigit = (index: number, raw: string) => {
    const digit = raw.replace(/\D/g, '').slice(-1);
    onChange(value.map((current, i) => (i === index ? digit : current)));
    if (digit && index < CODE_LENGTH - 1) refs.current[index + 1]?.focus();
  };

  const handleKeyDown = (index: number, event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Backspace' && !value[index] && index > 0) refs.current[index - 1]?.focus();
  };

  const handlePaste = (event: ClipboardEvent<HTMLInputElement>) => {
    const digits = event.clipboardData.getData('text').replace(/\D/g, '').slice(0, CODE_LENGTH);
    if (!digits) return;
    event.preventDefault();
    onChange(Array.from({ length: CODE_LENGTH }, (_, i) => digits[i] ?? ''));
    refs.current[Math.min(digits.length, CODE_LENGTH - 1)]?.focus();
  };

  return (
    <div className="flex gap-1.5 mb-5" dir="ltr">
      {value.map((digit, index) => (
        <input
          // The six boxes are fixed positions of one code, so the index is a stable key.
          key={index}
          ref={(element) => {
            refs.current[index] = element;
          }}
          type="text"
          inputMode="numeric"
          autoComplete={index === 0 ? 'one-time-code' : 'off'}
          maxLength={1}
          value={digit}
          disabled={disabled}
          aria-label={t('onboarding.verify.codeDigit', { index: index + 1, total: CODE_LENGTH })}
          onChange={(event) => setDigit(index, event.target.value)}
          onKeyDown={(event) => handleKeyDown(index, event)}
          onPaste={handlePaste}
          className="w-11 min-w-0 shrink h-[52px] text-center border border-[#D9D1DD] rounded-[10px] text-base font-bold bg-[#FAF9FB] outline-none focus:border-[#5C1D87] disabled:opacity-70"
        />
      ))}
    </div>
  );
}

const emptyCode = () => Array<string>(CODE_LENGTH).fill('');

function PhoneCard({ user }: { user: MeDto }) {
  const { t } = useTranslation();
  const { reloadUser } = useAuth();
  const cooldown = useCooldown();
  const [phone, setPhone] = useState(user.phoneNumber ?? '');
  // The number the last code was requested for; the code is confirmed against it.
  const [sentTo, setSentTo] = useState<string | null>(null);
  const [code, setCode] = useState(emptyCode);
  const [isBusy, setIsBusy] = useState(false);
  const [errorKey, setErrorKey] = useState<string | null>(null);
  const [noticeKey, setNoticeKey] = useState<string | null>(null);

  if (user.phoneNumberConfirmed) {
    return (
      <div className={CARD}>
        <CardHeader
          icon={lockPurpleIcon}
          title={t('onboarding.verify.phone.title')}
          subtitle={user.phoneNumber ? maskPhone(user.phoneNumber) : null}
          badge="verified"
          isSubtitleLtr
        />
        <p className="text-[11px] text-[#16794A]">{t('onboarding.verify.phone.verified')}</p>
      </div>
    );
  }

  const isCodeComplete = code.every((digit) => digit !== '');

  const handlePhoneChange = (value: string) => {
    setPhone(value);
    setSentTo(null);
    setCode(emptyCode());
    setErrorKey(null);
    setNoticeKey(null);
  };

  const handleSend = async () => {
    const target = toInternationalNumber(phone);
    setNoticeKey(null);
    if (!target) {
      setErrorKey('onboarding.verify.errors.phoneInvalid');
      return;
    }
    setErrorKey(null);
    setIsBusy(true);
    try {
      await sendPhoneConfirmationCode(target);
      setSentTo(target);
      setCode(emptyCode());
      setNoticeKey('onboarding.verify.phone.requested');
      cooldown.start();
    } catch (error) {
      const key = phoneVerificationErrorKey(error, 'send');
      setErrorKey(key);
      if (key.endsWith('.tooMany')) cooldown.start();
    } finally {
      setIsBusy(false);
    }
  };

  const handleConfirm = async () => {
    if (!sentTo || !isCodeComplete) return;
    setErrorKey(null);
    setNoticeKey(null);
    setIsBusy(true);
    try {
      await confirmPhoneCode(sentTo, code.join(''));
      const reloaded = await reloadUser();
      // Only the reloaded account decides the status; on success this card re-renders as verified.
      if (!reloaded || !reloaded.phoneNumberConfirmed) setNoticeKey('onboarding.verify.notConfirmedYet');
    } catch (error) {
      setErrorKey(phoneVerificationErrorKey(error, 'confirm'));
    } finally {
      setIsBusy(false);
    }
  };

  const sendLabel =
    cooldown.secondsLeft > 0
      ? t('onboarding.verify.resendIn', { seconds: cooldown.secondsLeft })
      : t(sentTo ? 'onboarding.verify.resend' : 'onboarding.verify.sendCode');

  return (
    <div className={CARD}>
      <div>
        <CardHeader
          icon={lockPurpleIcon}
          title={t('onboarding.verify.phone.title')}
          subtitle={sentTo ? t('onboarding.verify.requestedFor', { address: maskPhone(sentTo) }) : t('onboarding.verify.phone.subtitle')}
          badge="pending"
          isSubtitleLtr={Boolean(sentTo)}
        />

        <label className="block text-[11px] text-[#111827] mb-2" htmlFor="verify-phone">
          {t('onboarding.verify.phone.addressLabel')}
        </label>
        <input
          id="verify-phone"
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          dir="ltr"
          value={phone}
          disabled={isBusy}
          placeholder={t('onboarding.verify.phone.addressPlaceholder')}
          onChange={(event) => handlePhoneChange(event.target.value)}
          className={`${FIELD} mb-2`}
        />
        <div className="mb-4">
          <button type="button" className={TEXT_BUTTON} disabled={isBusy || cooldown.secondsLeft > 0} onClick={() => void handleSend()}>
            {sendLabel}
          </button>
        </div>

        <p className="text-[11px] text-[#111827] mb-3">{t('onboarding.verify.phone.instructions')}</p>
        <CodeInput value={code} disabled={!sentTo || isBusy} onChange={setCode} />
      </div>

      <div>
        <button
          type="button"
          className={PRIMARY_BUTTON}
          disabled={!sentTo || !isCodeComplete || isBusy}
          onClick={() => void handleConfirm()}
        >
          {t('onboarding.verify.phone.verify')}
        </button>
        {errorKey && <p role="alert" className="text-[11px] text-[#B42318] mb-2">{t(errorKey)}</p>}
        {noticeKey && <p role="status" className="text-[11px] text-[#5C5C5C] mb-2">{t(noticeKey)}</p>}
      </div>
    </div>
  );
}

// No backend endpoint verifies a National ID, so nothing typed here is sent or marked verified.
function NationalIdCard() {
  const { t } = useTranslation();
  return (
    <div className={`${CARD} opacity-70`}>
      <div>
        <CardHeader
          icon={idCardPurpleIcon}
          title={t('onboarding.verify.nationalId.title')}
          subtitle={t('onboarding.verify.nationalId.subtitle')}
          badge="unavailable"
        />
        <p className="text-[11px] text-[#111827] mb-3">{t('onboarding.verify.nationalId.instructions')}</p>
        <input
          type="text"
          disabled
          aria-label={t('onboarding.verify.nationalId.placeholder')}
          placeholder={t('onboarding.verify.nationalId.placeholder')}
          className={`${FIELD} mb-5`}
        />
      </div>
      <div>
        <button type="button" disabled className={PRIMARY_BUTTON}>{t('onboarding.verify.nationalId.verify')}</button>
        <p className="text-[10px] text-[#6B7280]">{t('onboarding.verify.nationalId.unavailable')}</p>
      </div>
    </div>
  );
}

type VerifyAccountStepProps = {
  onBack: () => void;
  onContinue: () => void;
};

export function VerifyAccountStep({ onBack, onContinue }: VerifyAccountStepProps) {
  const { t } = useTranslation();
  const { user, reloadUser } = useAuth();
  const [isRetrying, setIsRetrying] = useState(false);

  const handleRetry = async () => {
    setIsRetrying(true);
    await reloadUser();
    setIsRetrying(false);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-[36px] sm:text-[46px] lg:text-[58px] leading-[1.08] font-extrabold text-[#21062E] tracking-[-0.045em] text-balance">
        {t('onboarding.verify.title')}
      </h1>
      <p className="text-[#69616D] text-base">{t('onboarding.verify.subtitle')}</p>

      <div className="bg-[#FBF7FE] p-4 rounded-[14px] border border-[#4C0585]/10 flex items-start gap-3">
        <div className="w-[22px] h-[22px] shrink-0 rounded-full border border-[#3A0353] flex items-center justify-center text-[#3A0353] text-xs font-serif italic">i</div>
        <div className="text-xs text-[#3A0353]">
          <p className="font-bold">{t('onboarding.verify.noticeTitle')}</p>
          <p className="text-[11px] mt-0.5">{t('onboarding.verify.noticeBody')}</p>
        </div>
      </div>

      {user ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <EmailCard user={user} />
          <PhoneCard user={user} />
          <NationalIdCard />
        </div>
      ) : (
        <div role="alert" className="bg-[#FEF0EF] p-4 rounded-[14px] text-xs text-[#B42318] flex flex-wrap items-center gap-3">
          <span>{t('onboarding.verify.errors.statusUnavailable')}</span>
          <button type="button" className="font-bold underline" disabled={isRetrying} onClick={() => void handleRetry()}>
            {t('onboarding.verify.retry')}
          </button>
        </div>
      )}

      <div className="flex justify-end items-center gap-4 pt-6">
        <button type="button" onClick={onBack} className="font-bold text-sm text-[#5C1D87] hover:underline">
          {t('onboarding.verify.back')}
        </button>
        <button type="button" onClick={onContinue} className="px-7 py-3.5 bg-gradient-to-r from-[#4C0585] to-[#3A0353] text-white font-bold text-sm rounded-[13px] shadow">
          {t('onboarding.verify.continue')}
        </button>
      </div>
    </div>
  );
}

export default VerifyAccountStep;
