import { useTranslation } from 'react-i18next';

import githubIcon from '@/assets/dashboard/ic-github.svg';
import googleIcon from '@/assets/dashboard/ic-google.svg';
import { EMPTY_SEAT_AVATAR, type SquadMember, type TrackTone } from '@/features/internships/data/internshipDashboard';
import { cn } from '@/shared/utils/cn';

// Squad member column: round avatar, name, track badge and (on the squad screen) GitHub and
// Gmail rows. `member: null` is an unfilled seat, shown with Figma's placeholder texts.

const TRACK_TONES: Record<TrackTone, string> = {
  uiux: 'bg-[#fff3e8] text-[#d06f15]',
  frontend: 'bg-[#c7eaee] text-[#09565c]',
  backend: 'bg-[#fff3e8] text-[#a92055]',
  ai: 'bg-[#b3ead3] text-[#0d6b44]',
  other: 'bg-[#fff3e8] text-[#a92055]',
};

export function TrackBadge({ label, tone, size = 'sm' }: { label: string; tone: TrackTone | 'leader'; size?: 'sm' | 'md' }) {
  const toneClass = tone === 'leader' ? 'bg-[#f6ebff] font-semibold text-[#3b0454]' : `${TRACK_TONES[tone]} font-bold`;
  return (
    <span
      className={cn(
        'inline-flex items-center justify-center whitespace-nowrap rounded-full p-2.5 tracking-[0.13px]',
        size === 'md' ? 'text-xs' : 'text-[11px]',
        toneClass,
      )}
    >
      <bdi>{label}</bdi>
    </span>
  );
}

export function MemberAvatar({ src, photo }: { src?: string; photo?: string }) {
  if (photo) {
    return (
      <span className="flex h-[140px] w-[142px] shrink-0 items-end justify-center overflow-hidden rounded-full bg-[#c0c0c0] shadow-[0_4px_8px_rgba(0,0,0,0.25)] sm:h-[183px] sm:w-[186px]">
        <img src={photo} alt="" className="h-full w-auto max-w-none object-cover" />
      </span>
    );
  }
  return (
    <span className="flex h-[140px] w-[142px] shrink-0 items-center justify-center rounded-full bg-white shadow-[0_4px_4px_rgba(0,0,0,0.25)] sm:h-[183px] sm:w-[186px]">
      <img src={src} alt="" className="h-auto w-[96px] sm:w-[126px]" />
    </span>
  );
}

type SquadMemberCardProps = {
  member: SquadMember | null;
  seatNumber: number;
  showContacts?: boolean;
};

export function SquadMemberCard({ member, seatNumber, showContacts = true }: SquadMemberCardProps) {
  const { t } = useTranslation();
  const name = member?.name ?? t('dashboard.squad.emptySeatName', { number: seatNumber });
  const track = member?.track ?? t('dashboard.squad.emptySeatTrack', { number: seatNumber });
  // Empty seats show Figma's placeholder texts; a member's missing contact row is left out.
  const github = member ? member.github : t('dashboard.squad.emptySeatGithub');
  const email = member ? member.email : t('dashboard.squad.emptySeatEmail');

  return (
    <li className="flex w-full max-w-[209px] flex-col items-center gap-6">
      <MemberAvatar src={member?.avatar ?? EMPTY_SEAT_AVATAR} />
      <div className="flex flex-col items-center gap-[13px]">
        <p className="text-center text-base font-bold tracking-[0.13px] text-black"><bdi>{name}</bdi></p>
        <TrackBadge label={track} tone={member?.trackTone ?? 'other'} size={showContacts ? 'sm' : 'md'} />
      </div>
      {showContacts && (github || email) && (
        <dl className="flex w-full flex-col gap-2 text-sm font-medium tracking-[0.13px] text-black">
          {github && (
            <div className="flex items-center gap-2">
              <dt className="shrink-0">
                <img src={githubIcon} alt={t('dashboard.squad.github')} className="size-6" />
              </dt>
              <dd className="truncate"><bdi>{github}</bdi></dd>
            </div>
          )}
          {email && (
            <div className="flex items-center gap-2.5">
              <dt className="shrink-0">
                <img src={googleIcon} alt={t('dashboard.squad.gmail')} className="size-6" />
              </dt>
              <dd className="truncate"><bdi>{email}</bdi></dd>
            </div>
          )}
        </dl>
      )}
    </li>
  );
}

export default SquadMemberCard;
