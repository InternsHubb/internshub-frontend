import { useRef, useState, type FormEvent } from 'react';
import { useTranslation } from 'react-i18next';

import calendarIcon from '@/assets/onboarding/calendar.svg';
import lockMutedIcon from '@/assets/onboarding/lock-muted.svg';
import shieldWhiteIcon from '@/assets/onboarding/shield-white.svg';
import { useAuth, type AuthUser as MeDto } from '@/shared/auth';
import { apiErrorKey, completeProfile, getValidationErrors } from '@/features/onboarding/services/onboardingService';
import {
  latestAllowedBirthDate,
  toCalendarDate,
  validateProfile,
  type ProfileFieldErrors,
} from '@/features/onboarding/schemas/profileValidation';

// Step 02 "Let's Get to Know You": saves full name and date of birth with PUT /api/me/profile, then
// reloads GET /api/me and moves on only when the backend no longer lists CompleteProfile as missing.
// The backend keeps the date of birth once saved, so a saved one is shown read-only.

type ProfileStepProps = {
  onBack: () => void;
  onContinue: () => void;
};

type ProfileField = keyof ProfileFieldErrors;

const FIELD =
  'w-full h-[52px] px-4 rounded-[12px] border bg-[#FAF9FB] text-xs outline-none placeholder:text-slate-400 focus:border-[#5C1D87] read-only:opacity-70';
const FIELD_BORDER = { valid: 'border-[#E3DCE6]', invalid: 'border-[#B42318]/60' };
// The native picker button is kept but made invisible over the Figma calendar icon, so clicking the
// icon still opens the picker.
const DATE_PICKER_BUTTON = '[&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:cursor-pointer';
const ENABLED_BUTTON = 'bg-gradient-to-r from-[#4C0585] to-[#3A0353] text-white';
const DISABLED_BUTTON = 'bg-[#ECEAED] text-[#9A939E] cursor-not-allowed';

// The backend has saved the profile once GET /api/me no longer lists CompleteProfile. If the list is
// absent, the saved values themselves are checked.
function isProfileSaved(user: MeDto): boolean {
  if (user.missingOnboardingSteps) return !user.missingOnboardingSteps.includes('CompleteProfile');
  return Boolean(user.fullName?.trim() && user.dateOfBirth);
}

// ASP.NET validation keys name the request property ("FullName", "DateOfBirth"); only the field is
// flagged, the server's own wording is not shown.
function serverInvalidFields(error: unknown): ProfileField[] {
  const keys = Object.keys(getValidationErrors(error) ?? {}).map((key) => key.toLowerCase());
  const fields: ProfileField[] = [];
  if (keys.some((key) => key.includes('fullname'))) fields.push('fullName');
  if (keys.some((key) => key.includes('dateofbirth'))) fields.push('dateOfBirth');
  return fields;
}

export function ProfileStep({ onBack, onContinue }: ProfileStepProps) {
  const { t } = useTranslation();
  const { user, reloadUser } = useAuth();
  const savedDateOfBirth = user?.dateOfBirth ?? null;
  const [fullName, setFullName] = useState(user?.fullName ?? '');
  const [dateOfBirth, setDateOfBirth] = useState(savedDateOfBirth ?? '');
  const [fieldErrors, setFieldErrors] = useState<ProfileFieldErrors>({});
  const [invalidFromServer, setInvalidFromServer] = useState<ProfileField[]>([]);
  const [formErrorKey, setFormErrorKey] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const fullNameInput = useRef<HTMLInputElement>(null);
  const dateOfBirthInput = useRef<HTMLInputElement>(null);

  const isFilled = fullName.trim() !== '' && dateOfBirth !== '';
  const isInvalid = (field: ProfileField) => Boolean(fieldErrors[field]) || invalidFromServer.includes(field);
  const clearFieldError = (field: ProfileField) => {
    setFieldErrors((current) => ({ ...current, [field]: undefined }));
    setInvalidFromServer((current) => current.filter((item) => item !== field));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isSaving) return;
    const errors = validateProfile(fullName, dateOfBirth);
    setFieldErrors(errors);
    setInvalidFromServer([]);
    setFormErrorKey(null);
    if (errors.fullName) return fullNameInput.current?.focus();
    if (errors.dateOfBirth) return dateOfBirthInput.current?.focus();

    setIsSaving(true);
    try {
      await completeProfile({
        fullName: fullName.trim(),
        dateOfBirth,
        // Not edited on this step: the current values are sent back unchanged.
        preferredLocale: user?.preferredLocale ?? null,
        timeZone: user?.timeZone ?? null,
      });
    } catch (error) {
      setInvalidFromServer(serverInvalidFields(error));
      setFormErrorKey(apiErrorKey(error));
      setIsSaving(false);
      return;
    }

    const reloaded = await reloadUser();
    setIsSaving(false);
    if (!reloaded) {
      setFormErrorKey('api.errors.unknown');
      return;
    }
    if (!isProfileSaved(reloaded)) {
      setFormErrorKey('onboarding.profile.errors.notSaved');
      return;
    }
    onContinue();
  };

  const fieldError = (field: ProfileField) => {
    const key = fieldErrors[field];
    return key ? (
      <p id={`profile-${field}-error`} role="alert" className="text-[11px] text-[#B42318] mt-1">
        {t(`onboarding.profile.errors.${key}`)}
      </p>
    ) : null;
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-[36px] sm:text-[46px] lg:text-[58px] leading-[1.08] font-extrabold text-[#21062E] tracking-[-0.045em] text-balance">{t('onboarding.profile.title')}</h1>
        <p className="text-[#69616D] text-base mt-2">{t('onboarding.profile.subtitle')}</p>
      </div>

      <div className="bg-white/92 rounded-[28px] border border-[#3A0353]/10 max-w-[1020px] grid grid-cols-1 md:grid-cols-3 overflow-hidden shadow-xl">
        <div className="p-8 bg-gradient-to-b from-[#551683] via-[#481170] to-[#2E054D] text-white flex flex-col justify-between relative overflow-hidden min-h-[420px]">
          <div className="absolute -right-16 -top-16 w-64 h-64 border-[24px] border-white/5 rounded-full pointer-events-none"></div>
          <div className="absolute right-4 top-20 w-36 h-36 border border-white/10 rounded-full pointer-events-none"></div>

          <div className="w-[52px] h-[52px] bg-white/12 border border-white/15 rounded-[14px] flex items-center justify-center font-extrabold text-sm tracking-wide z-10 text-white">
            18+
          </div>

          <div className="z-10 pb-2">
            <h4 className="text-[20px] font-normal text-white leading-snug">
              {t('onboarding.profile.asideTitleLine1')}<br />
              {t('onboarding.profile.asideTitleLine2')}
            </h4>
          </div>
        </div>

        <form noValidate onSubmit={handleSubmit} className="md:col-span-2 p-8 space-y-6 bg-white flex flex-col justify-between">
          <div className="space-y-5">
            <div className="flex items-center justify-between border-b border-[#E8E2EC] pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 shrink-0 bg-[#3A0353] rounded-[12px] flex items-center justify-center"><img src={shieldWhiteIcon} alt="" aria-hidden="true" width={20} height={20} /></div>
                <div>
                  <span className="text-[9px] font-bold text-[#8B5DB0] uppercase tracking-[0.9px]">{t('onboarding.profile.eyebrow')}</span>
                  <h3 className="text-[18px] font-normal text-[#111827]">{t('onboarding.profile.cardTitle')}</h3>
                </div>
              </div>
              <span className="px-3 py-1 bg-[#F3E9FA] text-[#5C1D87] text-[9px] font-bold rounded-full tracking-[0.72px] uppercase">{t('onboarding.profile.requiredBadge')}</span>
            </div>

            <div className="bg-[#FFF7E6] p-4 rounded-[14px] border border-[#9A5700]/20 flex gap-3 text-xs text-[#9A5700]">
              <span aria-hidden="true" className="mt-px flex h-[22px] w-[22px] shrink-0 items-center justify-center rounded-full border border-current text-[13px] leading-none">i</span>
              <div>
                <p className="font-bold">{t('onboarding.profile.ageTitle')}</p>
                <p className="text-[11px] mt-0.5">{t('onboarding.profile.ageText')}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="profile-fullName" className="block text-[11px] text-[#34303A] mb-1 font-medium">{t('onboarding.profile.fullName')}</label>
                <input
                  ref={fullNameInput}
                  id="profile-fullName"
                  type="text"
                  autoComplete="name"
                  required
                  value={fullName}
                  disabled={isSaving}
                  onChange={(event) => { setFullName(event.target.value); clearFieldError('fullName'); }}
                  placeholder={t('onboarding.profile.fullNamePlaceholder')}
                  aria-invalid={isInvalid('fullName') || undefined}
                  aria-describedby={fieldErrors.fullName ? 'profile-fullName-error' : undefined}
                  className={`${FIELD} ${isInvalid('fullName') ? FIELD_BORDER.invalid : FIELD_BORDER.valid}`}
                />
                {fieldError('fullName')}
              </div>
              <div>
                <label htmlFor="profile-dateOfBirth" className="block text-[11px] text-[#34303A] mb-1 font-medium">{t('onboarding.profile.dateOfBirth')}</label>
                <div className="relative flex items-center">
                  <input
                    ref={dateOfBirthInput}
                    id="profile-dateOfBirth"
                    type="date"
                    autoComplete="bday"
                    required
                    value={dateOfBirth}
                    readOnly={savedDateOfBirth !== null}
                    disabled={isSaving}
                    max={latestAllowedBirthDate(toCalendarDate(new Date()))}
                    onChange={(event) => { setDateOfBirth(event.target.value); clearFieldError('dateOfBirth'); }}
                    placeholder={t('onboarding.profile.dateOfBirthPlaceholder')}
                    aria-invalid={isInvalid('dateOfBirth') || undefined}
                    aria-describedby={fieldErrors.dateOfBirth ? 'profile-dateOfBirth-error' : 'profile-dateOfBirth-note'}
                    className={`${FIELD} pe-12 ${DATE_PICKER_BUTTON} ${isInvalid('dateOfBirth') ? FIELD_BORDER.invalid : FIELD_BORDER.valid}`}
                  />
                  <span className="absolute end-4 flex pointer-events-none"><img src={calendarIcon} alt="" aria-hidden="true" width={18} height={18} /></span>
                </div>
                {fieldError('dateOfBirth')}
              </div>
            </div>

            <div className="flex items-center gap-2 text-[#6B7280] text-[11px] pt-1">
              <img src={lockMutedIcon} alt="" aria-hidden="true" width={16} height={16} />
              <p id="profile-dateOfBirth-note">
                {t(savedDateOfBirth ? 'onboarding.profile.dateOfBirthSaved' : 'onboarding.profile.dateOfBirthNote')}
              </p>
            </div>

            {formErrorKey && (
              <div role="alert" className="bg-[#FEF0EF] p-4 rounded-[14px] text-xs text-[#B42318]">{t(formErrorKey)}</div>
            )}
          </div>

          <div className="flex flex-wrap justify-end items-center gap-4 pt-4">
            <button type="button" onClick={onBack} disabled={isSaving} className="font-bold text-sm text-[#5C1D87] disabled:text-[#9A939E]">{t('onboarding.profile.back')}</button>
            <button
              type="submit"
              disabled={isSaving}
              aria-busy={isSaving || undefined}
              className={`px-7 py-3.5 font-bold text-sm rounded-[13px] flex items-center gap-2 ${isFilled && !isSaving ? `${ENABLED_BUTTON} shadow` : DISABLED_BUTTON}`}
            >
              {t(isSaving ? 'onboarding.profile.saving' : 'onboarding.profile.save')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
