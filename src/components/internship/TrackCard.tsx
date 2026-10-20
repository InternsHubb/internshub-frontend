import { useTranslation } from 'react-i18next'
import iconClock from '../../assets/internship/icon-clock.svg'
import iconLessons from '../../assets/internship/icon-lessons.svg'
import iconLevel from '../../assets/internship/icon-level.svg'
import instructorAvatar from '../../assets/internship/instructor-avatar.webp'
import squadAvatar from '../../assets/internship/squad-avatar.png'
import star1 from '../../assets/internship/star-1.svg'
import star2 from '../../assets/internship/star-2.svg'
import star3 from '../../assets/internship/star-3.svg'
import star4 from '../../assets/internship/star-4.svg'
import type { Track } from './mockData'

interface TrackCardProps {
  track: Track
  onSelect: (trackId: string) => void
}

// Star row exported from Figma; every card in the design uses the same sequence.
const STAR_ICONS: ReadonlyArray<string> = [star1, star2, star2, star3, star4]
const SQUAD_PREVIEW_COUNT = 4

function TrackCard({ track, onSelect }: TrackCardProps) {
  const { t } = useTranslation()
  const reviewCount = track.reviewCount.toLocaleString('en-US')
  const content = `internshipPage.tracks.items.${track.contentKey}`

  return (
    <article className="flex h-[363px] w-full flex-col overflow-hidden rounded-xl border border-[#e5e7eb] bg-white shadow-[0_3px_12px_0_rgba(0,0,0,0.06)] transition-shadow hover:shadow-[0_8px_24px_0_rgba(90,25,143,0.15)]">
      <div className="relative h-[155px] shrink-0 overflow-hidden">
        <img src={track.image} alt="" className="size-full object-cover" loading="lazy" />
        <span className="absolute start-[13px] top-[117px] flex h-[27px] items-center rounded-full bg-[rgba(255,37,233,0.76)] px-[9px] text-[9px] leading-3 font-bold text-[#5a198f]">
          {t(`${content}.tag`)}
        </span>
      </div>

      <div className="flex flex-1 flex-col gap-[10px] px-[15px] pt-[15px] pb-[11px]">
        <h3 className="line-clamp-2 min-h-[35px] text-[13px] leading-[17px] font-medium text-[#111827]">
          {t(`${content}.title`)}
        </h3>

        <div className="flex items-center gap-[7px]">
          <img src={instructorAvatar} alt="" className="size-[23px] rounded-full object-cover" loading="lazy" />
          <p className="text-[10px] leading-[15px] font-medium text-[#475569]">{t(`${content}.instructor`)}</p>
        </div>

        <div className="flex items-center gap-1">
          <span className="flex items-center gap-px" aria-hidden="true">
            {STAR_ICONS.map((icon, index) => (
              <img key={index} alt="" src={icon} />
            ))}
          </span>
          <span className="sr-only">{t('internshipPage.tracks.card.rated')}</span>
          <span className="text-[10px] leading-[15px] font-semibold text-[#334155]">{track.rating}</span>
          <span className="text-[9px] leading-3 text-[#94a3b8]">({reviewCount})</span>
        </div>

        <dl className="flex items-center justify-between border-b border-[#f1f5f9] pt-[3px] pb-3 text-[9px] leading-[13px] font-medium text-[#64748b]">
          <div className="flex items-center gap-1">
            <dt>
              <img alt={t('internshipPage.tracks.card.duration')} src={iconClock} />
            </dt>
            <dd>{t('internshipPage.tracks.card.hours', { count: track.hours })}</dd>
          </div>
          <div className="flex items-center gap-1">
            <dt>
              <img alt={t('internshipPage.tracks.card.level')} src={iconLevel} />
            </dt>
            <dd>{t(`internshipPage.tracks.card.levels.${track.level}`)}</dd>
          </div>
          <div className="flex items-center gap-1">
            <dt>
              <img alt={t('internshipPage.tracks.card.lessonsLabel')} src={iconLessons} />
            </dt>
            <dd>{t('internshipPage.tracks.card.lessons', { count: track.lessons })}</dd>
          </div>
        </dl>

        <div className="mt-auto flex items-center justify-between gap-[19px]">
          <div className="flex items-center" aria-label={t('internshipPage.tracks.card.squadMembers', { value: SQUAD_PREVIEW_COUNT + track.extraMembers })}
          >
            {Array.from({ length: SQUAD_PREVIEW_COUNT }, (_, index) => (
              <img
                key={index}
                alt=""
                src={squadAvatar}
                width={28}
                height={28}
                className="-me-[7px] size-7 rounded-full"
              />
            ))}
            <span className="flex size-7 items-center justify-center rounded-full bg-[#d8adfb] text-[10px] leading-5 font-medium text-[#3a0353]">
              +{track.extraMembers}
            </span>
          </div>
          <button
            type="button"
            onClick={() => onSelect(track.id)}
            className="w-[137px] rounded-full bg-[#5a198f] px-[15px] py-[14px] text-[10px] leading-[15px] font-bold text-white transition-colors hover:bg-[#3b0454] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#5a198f]"
          >
            {t('internshipPage.tracks.card.select')}
          </button>
        </div>
      </div>
    </article>
  )
}

export default TrackCard
