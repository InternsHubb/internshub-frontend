import { useState, type FormEvent } from 'react';
import { useTranslation } from 'react-i18next';

import dislikeIcon from '@/assets/dashboard/ic-dislike.svg';
import githubIcon from '@/assets/dashboard/ic-github.svg';
import { ACTION_BUTTON, IconHeading, OUTLINE_CARD, PURPLE_GRADIENT } from '@/components/dashboard/primitives';
import type { GithubStatus } from '@/data/internshipDashboard';
import { cn } from '@/lib/cn';

const VALID_USERNAME = /^[a-z\d](?:[a-z\d]|-(?=[a-z\d])){0,38}$/i;

export function GithubUsernameCard({ initialStatus, initialUsername, onStatusChange }: { initialStatus: GithubStatus; initialUsername: string; onStatusChange?: (status: GithubStatus, username: string) => void }) {
  const { t } = useTranslation();
  const [status, setStatus] = useState(initialStatus);
  const [username, setUsername] = useState(initialUsername);
  const invalid = status === 'invalid';

  function saveUsername(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmedUsername = username.trim();
    setUsername(trimmedUsername);
    const nextStatus = VALID_USERNAME.test(trimmedUsername) ? 'saved' : 'invalid';
    setStatus(nextStatus);
    onStatusChange?.(nextStatus, trimmedUsername);
  }

  return (
    <section aria-labelledby="github-title" className={cn(OUTLINE_CARD, 'p-6', invalid && 'border-[3px] border-[#c53131]')}>
      <IconHeading icon={githubIcon} className="gap-2">
        <h2 id="github-title" className={cn('text-base font-semibold', invalid ? 'text-[#a10000]' : 'text-[#42046b]')}>
          {t(`dashboard.github.${status}.title`)}
        </h2>
      </IconHeading>
      <p role={invalid ? 'alert' : 'status'} id="github-feedback" className="mt-2 ps-8 text-xs font-semibold leading-[18px] text-[#828282]">
        {t(`dashboard.github.${status}.hint`)}
      </p>
      <form onSubmit={saveUsername} className="mt-3 flex flex-col gap-4 sm:ps-[30px]">
        <div className={cn(status !== 'add' && 'flex flex-wrap items-center justify-between gap-2 py-2')}>
          <label htmlFor="github-username" className={cn('text-xs font-semibold', status === 'add' ? 'sr-only' : invalid ? 'flex items-center gap-2 text-[#a10000]' : 'text-[#828282]')}>
            {invalid && <img src={dislikeIcon} alt="" className="h-auto w-6" />}
            {t('dashboard.github.usernameLabel')}
          </label>
          <input
            id="github-username"
            dir="ltr"
            value={username}
            placeholder={t('dashboard.github.placeholder')}
            onChange={(event) => setUsername(event.target.value)}
            readOnly={status !== 'add'}
            aria-invalid={invalid}
            aria-describedby={invalid ? 'github-feedback github-error' : 'github-feedback'}
            autoCapitalize="none"
            autoCorrect="off"
            spellCheck={false}
            className={cn('min-w-0 text-sm outline-none focus-visible:ring-2 focus-visible:ring-[#5a198f]', status === 'add' ? 'w-full rounded-[13px] bg-[#e7e7e7] px-6 py-[15px]' : 'w-full rounded-sm bg-transparent text-end sm:w-1/2', invalid && 'text-[#a10000]')}
          />
          {invalid && <p id="github-error" className="w-full text-xs font-medium text-[#828282]">{t('dashboard.github.invalid.error')}</p>}
        </div>
        {status === 'add' ? (
          // Keys stop React from reusing one <button> for both, which would flip `type` mid-click.
          <button key="save" type="submit" className={`${ACTION_BUTTON} ${PURPLE_GRADIENT} text-white shadow-[0_10px_22px_rgba(58,3,83,0.2)]`}>{t('dashboard.github.save')}</button>
        ) : (
          <button
            key="edit"
            type="button"
            onClick={() => { setStatus('add'); onStatusChange?.('add', username); }}
            className={cn(ACTION_BUTTON, invalid ? 'bg-[#a10000] text-white shadow-[0_10px_22px_rgba(58,3,83,0.2)]' : 'border-2 border-[#42046b] text-black')}
          >
            {t('dashboard.github.edit')}
          </button>
        )}
      </form>
    </section>
  );
}
