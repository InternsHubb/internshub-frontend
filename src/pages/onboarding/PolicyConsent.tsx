import { useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';

import { useApiResource } from '@/hooks/useApiResource';
import { useAuth } from '@/hooks/useAuth';
import { apiErrorKey } from '@/lib/api/errors';
import { getDownloadUrl } from '@/lib/api/files';
import { getMyConsents, giveConsent } from '@/lib/api/me';
import { getCurrentPolicies } from '@/lib/api/policies';
import type { MyConsentDto, PolicyDto, PolicyType } from '@/lib/api/types';

// The terms checkbox of the Path step (POST /api/enrollments needs the required consents) and the
// Payment step. Ticking it records a consent (POST /api/me/consents) for every
// required policy the backend says still needs acceptance, then reloads GET /api/me so
// `requiredPoliciesAccepted` and `missingOnboardingSteps` reflect it. Accepted consents can't be
// withdrawn here, so the box stays ticked once the backend reports them.

type PolicyData = { policies: PolicyDto[]; consents: MyConsentDto[] };

const LINKED_POLICIES: PolicyType[] = ['TermsOfService', 'PrivacyPolicy'];

async function loadPolicyData(): Promise<PolicyData> {
  const [policies, consents] = await Promise.all([getCurrentPolicies(), getMyConsents()]);
  return { policies, consents };
}

// The signed download link is requested on click. The tab is opened first so the browser doesn't
// treat it as an unrequested pop-up once the link arrives.
async function openPolicyDocument(assetId: string): Promise<boolean> {
  const tab = window.open('', '_blank');
  try {
    const { url } = await getDownloadUrl(assetId);
    if (tab) {
      tab.opener = null;
      tab.location.href = url;
    }
    return true;
  } catch {
    tab?.close();
    return false;
  }
}

export function PolicyConsent() {
  const { t } = useTranslation();
  const { user, reloadUser } = useAuth();
  const { data, isLoading, error, reload } = useApiResource(loadPolicyData);
  const [isSaving, setIsSaving] = useState(false);
  const [errorKey, setErrorKey] = useState<string | null>(null);

  const pending = data?.consents.filter((consent) => consent.isRequired && consent.needsAcceptance) ?? [];
  const hasRequired = data?.consents.some((consent) => consent.isRequired) ?? false;
  const isAccepted = user?.requiredPoliciesAccepted === true || (data !== null && hasRequired && pending.length === 0);

  const accept = async () => {
    setErrorKey(null);
    setIsSaving(true);
    try {
      // One at a time so a failure leaves a clear state; each call is idempotent on the backend.
      for (const consent of pending) {
        await giveConsent(consent.policyType);
      }
    } catch (saveError) {
      setErrorKey(apiErrorKey(saveError));
      setIsSaving(false);
      reload();
      return;
    }
    await reloadUser();
    reload();
    setIsSaving(false);
  };

  const policyLink = (type: PolicyType) => {
    const policy = data?.policies.find((item) => item.policyType === type);
    const label = t(`onboarding.policies.names.${type}`);
    if (!policy) return <span className="font-bold">{label}</span>;
    const open = async () => {
      setErrorKey(null);
      if (!(await openPolicyDocument(policy.documentAssetId))) setErrorKey('onboarding.policies.documentError');
    };
    // Buttons get Tailwind's default arrow cursor; these read as links, so they show a pointer.
    return (
      <button
        type="button"
        onClick={open}
        className="underline font-bold cursor-pointer hover:text-[#3A0353] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#5C1D87] rounded-sm"
      >
        {label}
      </button>
    );
  };

  if (isLoading && !data) {
    return <p role="status" className="text-xs text-[#6B7280] pt-2">{t('onboarding.policies.loading')}</p>;
  }

  if (error && !data) {
    return (
      <div role="alert" className="text-xs text-[#B42318] pt-2 flex flex-wrap items-center gap-2">
        <span>{t(apiErrorKey(error))}</span>
        <button type="button" onClick={reload} className="underline font-bold">{t('onboarding.policies.retry')}</button>
      </div>
    );
  }

  if (!hasRequired) {
    return <p className="text-xs text-[#6B7280] pt-2">{t('onboarding.policies.empty')}</p>;
  }

  const [termsLink, privacyLink] = LINKED_POLICIES.map(policyLink);

  return (
    <div className="space-y-2 pt-2">
      <div className="flex items-start gap-2 text-xs text-[#5C1D87]">
        <input
          type="checkbox"
          id="terms"
          className="w-4 h-4 rounded mt-px shrink-0 cursor-pointer disabled:cursor-default"
          checked={isAccepted || isSaving}
          disabled={isAccepted || isSaving}
          onChange={(event) => { if (event.target.checked) void accept(); }}
          aria-describedby={errorKey ? 'terms-error' : undefined}
        />
        <label htmlFor="terms">
          <Trans
            i18nKey="onboarding.policies.label"
            // The backend publishes no refund policy document, so its name is plain text, not a dead link.
            components={{ terms: termsLink, privacy: privacyLink, refund: <span className="font-bold" /> }}
          />
        </label>
      </div>
      {isSaving && <p role="status" className="text-[11px] text-[#6B7280]">{t('onboarding.policies.saving')}</p>}
      {isAccepted && !isSaving && <p className="text-[11px] text-[#16794A]">{t('onboarding.policies.accepted')}</p>}
      {errorKey && <p id="terms-error" role="alert" className="text-[11px] text-[#B42318]">{t(errorKey)}</p>}
    </div>
  );
}
