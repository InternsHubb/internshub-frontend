import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/shared/auth';
import { useResource } from '@/shared/hooks/useResource';
import { apiErrorKey, getCareerProfile } from '@/features/onboarding/services/onboardingService';
import type { CvDto } from '@/features/onboarding/types/onboarding.types';
import { isCvParsing } from '@/features/onboarding/hooks/useMyCv';
import { RecordEditor } from '@/features/onboarding/components/cv-review/RecordEditor';
import { SkillsEditor } from '@/features/onboarding/components/cv-review/SkillsEditor';

const PANEL = 'rounded-[19px] border border-[#e8e2ec] bg-white p-6 shadow-sm';

export function CvReview({ cv, onBack }: { cv: CvDto | null; onBack: () => void }) {
  const { t } = useTranslation();
  const { user } = useAuth();
  const profile = useResource(getCareerProfile, [cv?.id, cv?.parseStatus]);
  const [saved, setSaved] = useState(false);
  function onSaved() { setSaved(true); profile.reload(); }
  const pending = isCvParsing(cv);

  return <div className="min-h-screen bg-[#f8f6fa] text-[#211927]">
    <header className="border-b border-[#e8e2ec] bg-white"><div className="mx-auto flex max-w-[1146px] items-center justify-between gap-4 px-5 py-5"><span className="text-xl font-bold text-[#3a0353]">Interns Hub</span><button type="button" onClick={onBack} className="rounded-xl border border-[#dacde1] px-4 py-2 text-sm text-[#5c1d87]">{t('onboarding.cvReview.back')}</button></div></header>
    <main className="mx-auto max-w-[1146px] space-y-6 px-5 py-10">
      <div><h1 className="text-3xl font-bold tracking-tight sm:text-[42px]">{t('onboarding.cvReview.title')}</h1><p className="mt-3 text-sm text-[#69616d]">{t('onboarding.cvReview.description')}</p></div>
      {cv?.parsedSummary && <p className="rounded-xl border border-[#dacde1] bg-[#fbf7fe] p-4 text-sm leading-6" dir="auto">{cv.parsedSummary}</p>}
      <section className={PANEL}><h2 className="text-lg font-semibold">{t('onboarding.cvReview.personal')}</h2><p className="mt-2 text-xs text-[#817184]">{t('onboarding.cvReview.personalHint')}</p><dl className="mt-4 grid gap-4 sm:grid-cols-2">{[['name', user?.fullName], ['email', user?.email], ['phone', user?.phoneNumber]].map(([key, value]) => <div key={key} className="rounded-xl bg-[#faf8fb] p-4"><dt className="text-xs text-[#817184]">{t(`onboarding.cvReview.fields.${key}`)}</dt><dd className="mt-2 break-words text-sm"><bdi>{value || t('onboarding.cvReview.notProvided')}</bdi></dd></div>)}</dl></section>
      {pending ? <p role="status" className={PANEL}>{t('onboarding.cv.parsing')}</p> : profile.isLoading ? <p role="status" className={PANEL}>{t('onboarding.cvReview.loading')}</p> : profile.error ? <div role="alert" className={PANEL}><p className="text-sm text-red-700">{t(apiErrorKey(profile.error))}</p><button type="button" onClick={profile.reload} className="mt-3 text-sm font-semibold text-[#5c1d87]">{t('onboarding.cv.retry')}</button></div> : profile.data && <>
        {cv?.parseStatus === 'Failed' && <p role="alert" className="rounded-xl bg-amber-50 p-4 text-sm text-amber-800">{t('onboarding.cvReview.manualFallback')}</p>}
        {saved && <p role="status" className="rounded-xl bg-emerald-50 p-4 text-sm text-emerald-800">{t('onboarding.cvReview.saved')}</p>}
        <section className={PANEL}><h2 className="mb-5 text-lg font-semibold">{t('onboarding.cvReview.skills')}</h2><SkillsEditor skills={profile.data.skills} onSaved={onSaved} /></section>
        <section className={`${PANEL} space-y-5`}><h2 className="text-lg font-semibold">{t('onboarding.cvReview.education')}</h2>{profile.data.education.length === 0 && <p className="text-sm text-[#817184]">{t('onboarding.cvReview.empty.education')}</p>}{profile.data.education.map((item) => <article key={item.id} className="space-y-2 rounded-xl bg-[#faf8fb] p-4"><h3 className="text-sm font-semibold" dir="auto">{item.institution}</h3><p className="text-sm" dir="auto">{item.degree}{item.fieldOfStudy ? ` · ${item.fieldOfStudy}` : ''}</p><p className="text-xs text-[#817184]"><bdi>{item.startDate} — {item.endDate || t('onboarding.cvReview.present')}</bdi></p><RecordEditor kind="education" record={item} onSaved={onSaved} /></article>)}<RecordEditor kind="education" onSaved={onSaved} /></section>
        <section className={`${PANEL} space-y-5`}><h2 className="text-lg font-semibold">{t('onboarding.cvReview.experience')}</h2>{profile.data.workExperience.length === 0 && <p className="text-sm text-[#817184]">{t('onboarding.cvReview.empty.experience')}</p>}{profile.data.workExperience.map((item) => <article key={item.id} className="space-y-2 rounded-xl bg-[#faf8fb] p-4"><h3 className="text-sm font-semibold" dir="auto">{item.jobTitle}</h3><p className="text-sm" dir="auto">{item.companyName}</p><p className="text-xs text-[#817184]"><bdi>{item.startDate} — {item.endDate || t('onboarding.cvReview.present')}</bdi></p>{item.description && <p className="whitespace-pre-wrap text-sm leading-6" dir="auto">{item.description}</p>}<RecordEditor kind="experience" record={item} onSaved={onSaved} /></article>)}<RecordEditor kind="experience" onSaved={onSaved} /></section>
      </>}
      <div className="flex justify-end"><button type="button" onClick={onBack} className="rounded-xl bg-[#4c0585] px-6 py-3 text-sm font-semibold text-white">{t('onboarding.cvReview.done')}</button></div>
    </main>
  </div>;
}
