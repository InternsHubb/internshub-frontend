import { useMemo, type ReactNode } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { CalendarCheck, Check, Info } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { z } from 'zod';

import { EmployerJobCard } from '@/components/employer/EmployerJobCard';
import { EmployerPageHeader } from '@/components/employer/EmployerPageHeader';
import {
  employerCardClass,
  employerFieldClass,
  employerLabelClass,
  employerPrimaryButtonClass,
  employerSecondaryButtonClass,
  employerTextareaClass,
  EmployerError,
  EmployerLoading,
  StatusBadge,
} from '@/components/employer/ui';
import { EMPLOYER_ROUTES } from '@/constants/routes';
import { useEmployerResource } from '@/hooks/useEmployerResource';
import { getEmployerContext } from '@/lib/employer/employerService';
import { formatEmployerDate, formatEmployerTimeRange } from '@/lib/employer/format';
import { getInterview, scheduleInterview } from '@/lib/employer/interviewService';
import type { InterviewDetails, InterviewFormValues } from '@/lib/employer/types';
import { cn } from '@/lib/cn';

type InterviewFormProps = {
  applicationId: string;
  interview: InterviewDetails;
};

function InterviewForm({ applicationId, interview }: InterviewFormProps) {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const staff = interview;

  const schema = useMemo(
    () =>
      z.object({
        date: z.string().min(1, t('schedule.errors.date')),
        startTime: z.string().min(1, t('schedule.errors.startTime')),
        timezone: z.string().min(1, t('schedule.errors.timezone')),
        duration: z.string().min(1, t('schedule.errors.duration')),
        mode: z.string().min(1, t('schedule.errors.mode')),
        interviewer: z.string().trim().min(1, t('schedule.errors.interviewer')),
        meetingLink: z.string().trim().url(t('schedule.errors.meetingLink')),
        notes: z.string(),
      }),
    [t],
  );

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting, isValid },
  } = useForm<InterviewFormValues>({
    resolver: zodResolver(schema),
    mode: 'onChange',
    defaultValues: {
      date: staff.date,
      startTime: staff.startTime,
      timezone: staff.timezone,
      duration: staff.duration,
      mode: staff.mode,
      interviewer: staff.interviewer,
      meetingLink: staff.meetingLink,
      notes: staff.notes,
    },
  });

  const values = watch();
  const complete =
    isValid ||
    Boolean(
      values.date &&
        values.startTime &&
        values.timezone &&
        values.duration &&
        values.mode &&
        values.interviewer?.trim() &&
        values.meetingLink?.trim() &&
        schema.safeParse(values).success,
    );

  const submit = handleSubmit(async (formValues) => {
    await scheduleInterview(applicationId, formValues);
    navigate(EMPLOYER_ROUTES.pipeline);
  });

  return (
    <form onSubmit={submit} noValidate>
      <div className={cn('mt-4 p-4 sm:p-5', employerCardClass)}>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-[8px] font-bold tracking-[1.2px] text-[#3A0353] uppercase">
              {t('schedule.eyebrow')}
            </p>
            <h2 className="mt-2 text-[16px] font-bold leading-tight text-[#111827]">{t('schedule.heading')}</h2>
          </div>
          <StatusBadge tone="info">{t('common.required')}</StatusBadge>
        </div>

        <div className="mt-5 grid grid-cols-1 gap-x-4 gap-y-4 md:grid-cols-2">
          <Field label={t('schedule.date')} error={errors.date?.message} htmlFor="interview-date">
            <input id="interview-date" type="date" className={employerFieldClass} {...register('date')} />
          </Field>

          <Field label={t('schedule.startTime')} error={errors.startTime?.message} htmlFor="interview-start">
            <input
              id="interview-start"
              type="time"
              className={employerFieldClass}
              {...register('startTime')}
            />
          </Field>

          <Field label={t('schedule.timeZone')} error={errors.timezone?.message} htmlFor="interview-zone">
            <select id="interview-zone" className={employerFieldClass} {...register('timezone')}>
              <option value="EET (UTC+2)">{t('schedule.timeZoneValue')}</option>
            </select>
          </Field>

          <Field label={t('schedule.duration')} error={errors.duration?.message} htmlFor="interview-duration">
            <select id="interview-duration" className={employerFieldClass} {...register('duration')}>
              <option value="45 minutes">{t('schedule.durationValue')}</option>
            </select>
          </Field>

          <Field label={t('schedule.mode')} error={errors.mode?.message} htmlFor="interview-mode">
            <select id="interview-mode" className={employerFieldClass} {...register('mode')}>
              <option value="Google Meet">{t('schedule.modeValue')}</option>
            </select>
          </Field>

          <Field
            label={t('schedule.interviewer')}
            error={errors.interviewer?.message}
            htmlFor="interview-interviewer"
          >
            <input
              id="interview-interviewer"
              type="text"
              className={employerFieldClass}
              {...register('interviewer')}
            />
          </Field>

          <div className="md:col-span-2">
            <Field
              label={t('schedule.meetingLink')}
              error={errors.meetingLink?.message}
              htmlFor="interview-link"
            >
              <input
                id="interview-link"
                type="url"
                className={employerFieldClass}
                {...register('meetingLink')}
              />
            </Field>
          </div>

          <div className="md:col-span-2">
            <Field label={t('schedule.notes')} error={errors.notes?.message} htmlFor="interview-notes">
              <textarea id="interview-notes" className={employerTextareaClass} {...register('notes')} />
            </Field>
          </div>
        </div>

        <div
          className={cn(
            'mt-5 flex min-h-[37px] items-center gap-2 rounded-[10px] border px-3 py-2 text-[9px] leading-4',
            complete
              ? 'border-[#DFF8ED] bg-[#EDFAF5] text-[#087A50]'
              : 'border-[#FFF1D7] bg-[#FFF9ED] text-[#A05A08]',
          )}
          role="status"
        >
          {complete ? (
            <Check className="size-3.5 shrink-0" strokeWidth={2.2} />
          ) : (
            <Info className="size-3.5 shrink-0" strokeWidth={2} />
          )}
          <span>
            {complete
              ? t('schedule.complete', {
                  date: formatEmployerDate(values.date, i18n.language),
                  time: formatEmployerTimeRange(values.startTime, staff.endTime, i18n.language),
                })
              : t('schedule.incomplete')}
          </span>
        </div>

        <div className="mt-5 flex flex-wrap items-center gap-3">
          <button type="submit" className={employerPrimaryButtonClass} disabled={isSubmitting}>
            <CalendarCheck className="size-3.5" strokeWidth={2} />
            {t('schedule.submit')}
          </button>
          <button
            type="button"
            onClick={() => navigate(EMPLOYER_ROUTES.pipeline)}
            className={employerSecondaryButtonClass}
          >
            {t('common.cancel')}
          </button>
        </div>
      </div>
    </form>
  );
}

type FieldProps = {
  label: string;
  error?: string;
  htmlFor: string;
  children: ReactNode;
};

function Field({ label, error, htmlFor, children }: FieldProps) {
  return (
    <div>
      <label htmlFor={htmlFor} className={employerLabelClass}>
        {label}
      </label>
      <div className="mt-2">{children}</div>
      {error ? <p className="mt-1.5 text-[8px] text-[#B42331]">{error}</p> : null}
    </div>
  );
}

export function ScheduleInterviewPage() {
  const { t } = useTranslation();
  const { applicationId = '' } = useParams();

  const { data, loading, error, reload } = useEmployerResource(
    () => Promise.all([getEmployerContext(), getInterview(applicationId)]),
    [applicationId],
  );

  if (loading) return <EmployerLoading label={t('common.loading')} />;
  if (error || !data) {
    return <EmployerError label={t('common.error')} retryLabel={t('common.retry')} onRetry={reload} />;
  }

  const [context, interview] = data;

  return (
    <div>
      <EmployerPageHeader
        breadcrumb={t('header.breadcrumb')}
        title={t('schedule.title')}
        description={t('schedule.subtitle')}
      />
      <div className="mt-7">
        <EmployerJobCard candidate={context.candidate} opportunity={context.opportunity} />
      </div>
      <InterviewForm applicationId={applicationId} interview={interview} />
    </div>
  );
}
