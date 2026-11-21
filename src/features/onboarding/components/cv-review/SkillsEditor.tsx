import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  addMySkill,
  apiErrorKey,
  searchSkills,
  updateMySkill,
} from '@/features/onboarding/services/onboardingService';
import type { ProfileSkillDto, ProficiencyLevel, SkillDto } from '@/features/onboarding/types/onboarding.types';

const LEVELS: ProficiencyLevel[] = ['Beginner', 'Intermediate', 'Advanced', 'Expert'];

function LevelSelect({ value, onChange, disabled }: { value: string; onChange: (level: ProficiencyLevel | null) => void; disabled?: boolean }) {
  const { t } = useTranslation();
  return <select aria-label={t('onboarding.cvReview.level')} value={value} disabled={disabled} onChange={(event) => onChange((event.target.value || null) as ProficiencyLevel | null)} className="rounded-lg border border-[#dacde1] bg-white p-2 text-xs"><option value="">{t('onboarding.cvReview.unspecified')}</option>{LEVELS.map((level) => <option key={level} value={level}>{t(`onboarding.cvReview.levels.${level}`)}</option>)}</select>;
}

function SkillRow({ skill, onSaved }: { skill: ProfileSkillDto; onSaved: () => void }) {
  const { t } = useTranslation();
  const [level, setLevel] = useState(skill.proficiencyLevel);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  async function save() {
    setBusy(true); setError(null);
    try { await updateMySkill(skill.skillId, level); onSaved(); }
    catch (failure) { setError(apiErrorKey(failure)); }
    finally { setBusy(false); }
  }
  return <div className="rounded-xl bg-[#faf8fb] p-3"><div className="flex flex-wrap items-center justify-between gap-3"><span className="text-sm font-medium" dir="auto">{skill.name}</span><div className="flex items-center gap-2"><LevelSelect value={level ?? ''} onChange={setLevel} disabled={busy} /><button type="button" disabled={busy || level === skill.proficiencyLevel} onClick={() => void save()} className="rounded-lg px-3 py-2 text-xs font-semibold text-[#5c1d87] disabled:opacity-40">{t(busy ? 'onboarding.cvReview.saving' : 'onboarding.cvReview.save')}</button></div></div>{error && <p role="alert" className="mt-2 text-xs text-red-700">{t(error)}</p>}</div>;
}

export function SkillsEditor({ skills, onSaved }: { skills: ProfileSkillDto[]; onSaved: () => void }) {
  const { t } = useTranslation();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SkillDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchError, setSearchError] = useState<string | null>(null);
  useEffect(() => {
    let active = true;
    if (!query.trim()) { setResults([]); setLoading(false); setSearchError(null); return; }
    setLoading(true); setResults([]); setSearchError(null);
    const timer = window.setTimeout(() => {
      searchSkills({ search: query.trim(), limit: 12 }).then((items) => { if (active) setResults(items.filter((skill) => skill.isActive)); }).catch((failure: unknown) => { if (active) setSearchError(apiErrorKey(failure)); }).finally(() => { if (active) setLoading(false); });
    }, 300);
    return () => { active = false; window.clearTimeout(timer); };
  }, [query]);
  async function add(skill: SkillDto) {
    setBusy(true); setError(null);
    try { await addMySkill({ skillId: skill.id, proficiencyLevel: null }); setQuery(''); onSaved(); }
    catch (failure) { setError(apiErrorKey(failure)); }
    finally { setBusy(false); }
  }
  return <div className="space-y-3">
    {skills.length === 0 && <p className="text-sm text-[#817184]">{t('onboarding.cvReview.empty.skills')}</p>}
    {skills.map((skill) => <SkillRow key={`${skill.skillId}:${skill.proficiencyLevel}`} skill={skill} onSaved={onSaved} />)}
    <label className="block pt-3 text-sm font-semibold">{t('onboarding.cvReview.add.skills')}<input type="search" value={query} disabled={busy} onChange={(event) => setQuery(event.target.value)} placeholder={t('onboarding.cvReview.searchSkills')} className="mt-2 w-full rounded-xl border border-[#dacde1] bg-white p-3 text-sm font-normal" /></label>
    {loading && <p role="status" className="text-xs text-[#817184]">{t('onboarding.cvReview.loading')}</p>}
    {searchError && <p role="alert" className="text-xs text-red-700">{t(searchError)}</p>}
    {!loading && !searchError && query.trim() && results.filter((item) => !skills.some((skill) => skill.skillId === item.id)).length === 0 && <p className="text-xs text-[#817184]">{t('onboarding.cvReview.noSkills')}</p>}
    <div className="flex flex-wrap gap-2">{results.filter((item) => !skills.some((skill) => skill.skillId === item.id)).map((skill) => <button key={skill.id} type="button" disabled={busy} onClick={() => void add(skill)} className="rounded-full bg-[#f3e9fa] px-3 py-2 text-xs text-[#5c1d87] disabled:opacity-50">+ {skill.name}</button>)}</div>
    {error && <p role="alert" className="text-xs text-red-700">{t(error)}</p>}
  </div>;
}
