import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Calendar, Clock, Info, ArrowRight, ChevronLeft, ChevronRight, CheckCircle2, Users, UserRound } from 'lucide-react';

import { MentorAvatar, MentorshipNotice, useTimeZoneLabel } from '@/features/mentorship/components/MentorshipParts';
import { ROUTES } from '@/app/routes';
import { useMentorship } from '@/features/mentorship/context/MentorshipContext';
import type { Mentor, MentorSlot } from '@/features/mentorship/types/mentorship';

const PRIMARY = 'flex min-h-12 items-center justify-center gap-2 rounded-xl bg-[linear-gradient(163deg,rgba(106,42,138,.92),rgba(59,4,84,.96)_71.43%)] px-6 py-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50';
const DAYS_PER_PAGE = 6;

function NoAvailableSlots({ mentor }: { mentor: Mentor }) {
  const { t } = useTranslation();
  return (
    <div className="mx-auto max-w-[1020px] space-y-6">
      <Link to={ROUTES.mentorship} className="text-sm text-[#3b0454]">{t('mentorship.booking.back')}</Link>
      <header><h1 className="text-[32px] font-semibold text-[#211927]">{t('mentorship.booking.title')}</h1><p className="mt-1 text-sm text-[#4d444f]">{t('mentorship.booking.checkAvailability')}</p></header>
      <section className="overflow-hidden rounded-xl bg-white shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4 bg-[#f7f1f9] p-8">
          <div className="flex items-center gap-4"><MentorAvatar name={mentor.name} className="size-16 rounded-full text-xl" /><div><h2 className="font-semibold"><bdi>{mentor.name}</bdi></h2>{mentor.trackNames.length > 0 && <p className="mt-1 text-xs text-[#4d444f]">{mentor.trackNames.join(' · ')}</p>}</div></div>
          <Link to={ROUTES.mentorshipMentorProfile.replace(':id', mentor.id)} className="text-xs font-semibold text-[#3b0454]">{t('mentorship.booking.viewProfile')} →</Link>
        </div>
        <div className="flex flex-col items-center gap-6 px-6 py-16 text-center sm:px-16">
          <span className="flex size-20 items-center justify-center rounded-full bg-[#f2eaf5]"><Calendar className="size-8 text-[#817184]" /></span>
          <div><h2 className="text-[22px] font-semibold text-[#211927]">{t('mentorship.booking.noSlots')}</h2><p className="mx-auto mt-2 max-w-[440px] text-sm leading-6 text-[#4d444f]">{t(mentor.slotsError ? 'mentorship.live.slotsError' : 'mentorship.booking.noSlotsDescription')}</p></div>
          <p className="flex items-center gap-2 rounded-lg bg-[#fbf0fe] p-4 text-xs text-[#817184]"><Info className="size-4 shrink-0" />{t('mentorship.booking.updatedAvailability')}</p>
          <div className="mt-8 grid w-full gap-4 sm:grid-cols-2"><Link to={ROUTES.mentorshipMentors} className={PRIMARY}><Users className="size-4" />{t('mentorship.booking.otherMentors')}</Link><Link to={ROUTES.mentorshipMentorProfile.replace(':id', mentor.id)} className="flex items-center justify-center gap-2 rounded-lg bg-[#f2eaf5] px-6 py-3 text-sm text-[#3b0454]"><UserRound className="size-4" />{t('mentorship.booking.viewProfile')}</Link></div>
        </div>
      </section>
    </div>
  );
}

// The first slot of each local day; slots are already in time order.
function firstSlotPerDay(slots: MentorSlot[]): MentorSlot[] {
  const days = new Map<string, MentorSlot>();
  for (const slot of slots) {
    if (!days.has(slot.dayKey)) days.set(slot.dayKey, slot);
  }
  return [...days.values()];
}

function BookingSlots({ mentor }: { mentor: Mentor }) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { draft, balance, setBookingDraft } = useMentorship();
  const timeZoneLabel = useTimeZoneLabel();
  const draftSlotId = draft?.mentor.id === mentor.id ? draft.slot.id : null;
  const [selectedId, setSelectedId] = useState(
    mentor.slots.some((slot) => slot.id === draftSlotId) ? draftSlotId : mentor.slots[0].id
  );
  const selectedSlot = mentor.slots.find((slot) => slot.id === selectedId) ?? mentor.slots[0];
  const days = firstSlotPerDay(mentor.slots);
  const [datePage, setDatePage] = useState(
    Math.floor(Math.max(0, days.findIndex((slot) => slot.dayKey === selectedSlot.dayKey)) / DAYS_PER_PAGE)
  );
  const visibleDays = days.slice(datePage * DAYS_PER_PAGE, datePage * DAYS_PER_PAGE + DAYS_PER_PAGE);
  const times = mentor.slots.filter((slot) => slot.dayKey === selectedSlot.dayKey);
  const hasNoSessionsLeft = balance !== null && balance.remaining === 0;

  function continueBooking() {
    setBookingDraft({ mentor, slot: selectedSlot });
    navigate(ROUTES.mentorshipConfirmBooking);
  }

  return (
    <div className="mentorship-booking space-y-6">
      <header><div className="flex flex-wrap items-center gap-3"><h1 className="text-[32px] font-bold tracking-[-1px] text-[#190027]">{t('mentorship.booking.title')}</h1><span className="flex items-center gap-1 rounded-full bg-[#f2d9ff] px-3 py-1 text-xs text-[#2c0844]"><Clock className="size-3" />{selectedSlot.duration}</span></div><p className="mt-2 text-sm text-[#4d444f]">{t('mentorship.booking.subtitle')}</p></header>
      <div className="grid items-start gap-8 lg:grid-cols-2 xl:gap-20">
        <div className="space-y-6">
          <section className="flex items-start gap-4 rounded-2xl bg-white p-6 shadow-sm">
            <MentorAvatar name={mentor.name} className="size-16 rounded-2xl text-xl" />
            <div className="min-w-0"><div className="flex flex-wrap items-center gap-2"><h2 className="text-xl font-semibold"><bdi>{mentor.name}</bdi></h2><span className="rounded-full bg-[#ecfdf5] px-2 py-0.5 text-[10px] text-[#047857]">{t('mentorship.booking.available')}</span></div><p className="mt-2 text-[10px] text-[#5d198f]">{[...mentor.trackNames, t('mentorship.booking.oneToOne')].join(' · ')}</p></div>
          </section>
          <p className="flex items-start gap-3 rounded-xl bg-[#ebeeff] p-4 text-xs leading-5 text-[#4d444f]"><Info className="size-5 shrink-0 text-[#190027]" /><span><strong className="block text-[#190027]">{t('mentorship.booking.rulesTitle')}</strong>{t('mentorship.booking.rules')}</span></p>
          <section className="space-y-5 rounded-2xl bg-white p-6 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-3"><h2 className="flex items-center gap-3 text-lg font-semibold"><Calendar className="size-5 text-[#3b0454]" />{t('mentorship.booking.selectDate')}</h2><div className="flex items-center gap-2"><span className="text-xs font-semibold text-[#3b0454]">{selectedSlot.date}</span><button type="button" disabled={datePage === 0} onClick={() => setDatePage((page) => page - 1)} aria-label={t('mentorship.booking.previousDates')} className="rounded-md bg-[#f1f3ff] p-1 disabled:opacity-40"><ChevronLeft className="size-4 rtl:rotate-180" /></button><button type="button" disabled={(datePage + 1) * DAYS_PER_PAGE >= days.length} onClick={() => setDatePage((page) => page + 1)} aria-label={t('mentorship.booking.nextDates')} className="rounded-md bg-[#f1f3ff] p-1 disabled:opacity-40"><ChevronRight className="size-4 rtl:rotate-180" /></button></div></div>
            <div className="grid grid-cols-3 gap-2 sm:grid-cols-6">
              {visibleDays.map((slot) => {
                const isSelected = slot.dayKey === selectedSlot.dayKey;
                return (
                  <button key={slot.dayKey} type="button" aria-pressed={isSelected} aria-label={slot.date} onClick={() => setSelectedId(slot.id)} className={`flex min-h-[88px] flex-col items-center justify-center gap-1 rounded-xl p-3 ${isSelected ? 'bg-[#803f9d] text-white shadow-md' : 'bg-[#f1f3ff] text-[#141b2b]'}`}>
                    <span className="text-[10px] uppercase">{slot.weekday}</span>
                    <span className="text-xl font-semibold">{slot.dayOfMonth}</span>
                    <span className={`size-1.5 rounded-full ${isSelected ? 'bg-white' : 'bg-[#10b981]'}`} />
                  </button>
                );
              })}
            </div>
          </section>
          <section className="space-y-5 rounded-2xl bg-white p-6 shadow-sm"><div className="flex flex-wrap items-center gap-3"><Clock className="size-5 text-[#3b0454]" /><h2 className="text-lg font-semibold">{t('mentorship.booking.timeSlots')}</h2><p className="text-[10px] text-[#4d444f]">{timeZoneLabel}</p></div><div className="grid grid-cols-2 gap-2 sm:grid-cols-3">{times.map((slot) => <button key={slot.id} type="button" aria-pressed={slot.id === selectedSlot.id} onClick={() => setSelectedId(slot.id)} className={`flex min-h-[54px] items-center justify-center gap-2 rounded-xl px-3 py-3 text-sm ${slot.id === selectedSlot.id ? 'bg-[#803f9d] font-bold text-white shadow-md' : 'bg-[#f1f3ff] text-[#141b2b]'}`}>{slot.id === selectedSlot.id && <CheckCircle2 className="size-4" />}<span>{slot.time.split('–')[0].trim()}</span><span className="text-[9px]">{t(slot.id === selectedSlot.id ? 'mentorship.booking.selected' : 'mentorship.booking.open')}</span></button>)}</div><p className="flex items-center gap-5 text-xs text-[#4d444f]"><span><span className="inline-block size-2 rounded-full bg-emerald-500" /> {t('mentorship.booking.available')}</span><span><span className="inline-block size-2 rounded-full bg-purple-600" /> {t('mentorship.booking.selected')}</span></p></section>
        </div>
        <section className="space-y-6 rounded-[24px] border border-[#f1ecf7] bg-white p-6 shadow-sm sm:p-8">
          <h2 className="text-2xl font-bold tracking-[-.6px]">{t('mentorship.booking.summary')}</h2>
          <div className="space-y-2 border-b border-[#f1f5f9] pb-4"><p className="text-xs text-[#64748b]">{t('mentorship.booking.mentor')}</p><p className="font-semibold"><bdi>{mentor.name}</bdi></p></div>
          <div className="space-y-2 border-b border-[#f1f5f9] pb-4"><p className="text-xs text-[#64748b]">{t('mentorship.booking.dateTime')}</p><div className="flex flex-wrap items-center justify-between gap-2 text-sm"><p className="font-medium">{selectedSlot.date}</p><p className="text-[#64748b]">{selectedSlot.time}</p></div></div>
          <div><p className="text-xs text-[#64748b]">{t('mentorship.booking.durationLabel')}</p><p className="mt-1 text-sm">{selectedSlot.duration}</p></div>
          {balance && <div className="space-y-3 rounded-xl border border-[#f1f5f9] bg-[#fafbfe] p-4"><div className="flex flex-wrap items-center justify-between gap-2 text-sm"><span className="font-semibold">{t('mentorship.booking.balance')}</span><span className="text-[10px]">{t('mentorship.booking.remaining', { remaining: balance.remaining, total: balance.total })}</span></div><div className="h-2 overflow-hidden rounded-full bg-[#f1f5f9]"><div className="h-full rounded-full bg-[#3b0454]" style={{ width: `${balance.total ? (balance.remaining / balance.total) * 100 : 0}%` }} /></div></div>}
          {hasNoSessionsLeft && <p role="alert" className="rounded-lg bg-[#fffbeb] p-3 text-xs text-[#b45309]">{t('mentorship.live.noSessionsLeft')}</p>}
          <button type="button" disabled={hasNoSessionsLeft} onClick={continueBooking} className={`${PRIMARY} w-full`}>{t('mentorship.booking.continue')}<ArrowRight className="size-4 rtl:rotate-180" /></button>
          <p className="text-center text-xs leading-5 text-[#64748b]">{t('mentorship.booking.cancellation')}</p>
        </section>
      </div>
    </div>
  );
}

export default function BookSessionPage() {
  const { id } = useParams();
  const { getMentorById } = useMentorship();
  const mentor = getMentorById(id ?? '');
  const { t } = useTranslation();
  if (!mentor) {
    return (
      <MentorshipNotice title={t('mentorship.live.mentorNotFound')}>
        <Link to={ROUTES.mentorshipMentors} className="text-sm font-semibold text-[#5d198f]">{t('mentorship.booking.otherMentors')}</Link>
      </MentorshipNotice>
    );
  }
  return mentor.slots.length ? <BookingSlots key={mentor.id} mentor={mentor} /> : <NoAvailableSlots mentor={mentor} />;
}
