import { useState, type FormEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { apiErrorKey } from '@/lib/api/errors';
import { addEducation, addExperience, updateEducation, updateExperience } from '@/lib/api/profile';
import type { EducationDto, WorkExperienceDto } from '@/lib/api/types';

type Props = { onSaved: () => void } & (
  | { kind: 'education'; record?: EducationDto }
  | { kind: 'experience'; record?: WorkExperienceDto }
);

export function RecordEditor(props: Props) {
  const { t } = useTranslation();
  const [editing, setEditing] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { kind, record, onSaved } = props;
  const fields = kind === 'education'
    ? ['institution', 'degree', 'fieldOfStudy'] as const
    : ['companyName', 'jobTitle', 'description'] as const;
  const initial = (key: string) => record && key in record ? String(record[key as keyof typeof record] ?? '') : '';

  async function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const text = (key: string) => String(data.get(key) ?? '').trim();
    const startDate = text('startDate');
    const endDate = text('endDate') || null;
    if (!text(fields[0]) || !text(fields[1]) || (endDate && endDate < startDate)) {
      setError('onboarding.cvReview.invalidRecord');
      return;
    }
    setBusy(true);
    setError(null);
    try {
      if (kind === 'education') {
        const body = { institution: text('institution'), degree: text('degree'), fieldOfStudy: text('fieldOfStudy') || null, startDate, endDate };
        if (record) await updateEducation(record.id, body);
        else await addEducation(body);
      } else {
        const body = { companyName: text('companyName'), jobTitle: text('jobTitle'), description: text('description') || null, startDate, endDate };
        if (record) await updateExperience(record.id, body);
        else await addExperience(body);
      }
      setEditing(false);
      onSaved();
    } catch (failure) { setError(apiErrorKey(failure)); }
    finally { setBusy(false); }
  }

  if (!editing) return <button type="button" onClick={() => setEditing(true)} className="rounded-lg border border-[#dacde1] px-3 py-2 text-xs font-semibold text-[#5c1d87]">{t(record ? 'onboarding.cvReview.edit' : `onboarding.cvReview.add.${kind}`)}</button>;

  return (
    <form onSubmit={(event) => void save(event)} className="mt-3 space-y-4 rounded-xl border border-[#dacde1] bg-[#fcf8fd] p-4">
      <fieldset disabled={busy} className="grid gap-4 sm:grid-cols-2">
        {fields.map((field, index) => <label key={field} className={`text-xs text-[#685f6d] ${index === 2 ? 'sm:col-span-2' : ''}`}>
          {t(`onboarding.cvReview.fields.${field}`)}
          <input name={field} defaultValue={initial(field)} required={index < 2} maxLength={field === 'description' ? 4000 : 256} className="mt-2 w-full rounded-lg border border-[#dacde1] bg-white p-3 text-sm text-[#211927]" />
        </label>)}
        {['startDate', 'endDate'].map((field) => <label key={field} className="text-xs text-[#685f6d]">{t(`onboarding.cvReview.fields.${field}`)}<input type="date" name={field} defaultValue={initial(field).slice(0, 10)} required={field === 'startDate'} className="mt-2 w-full rounded-lg border border-[#dacde1] bg-white p-3 text-sm text-[#211927]" /></label>)}
      </fieldset>
      {error && <p role="alert" className="text-xs text-red-700">{t(error)}</p>}
      <div className="flex gap-3"><button disabled={busy} type="submit" className="rounded-lg bg-[#4c0585] px-4 py-2 text-sm text-white disabled:opacity-50">{t(busy ? 'onboarding.cvReview.saving' : 'onboarding.cvReview.save')}</button><button disabled={busy} type="button" onClick={() => { setEditing(false); setError(null); }} className="text-sm text-[#5c1d87]">{t('onboarding.cvReview.cancel')}</button></div>
    </form>
  );
}
