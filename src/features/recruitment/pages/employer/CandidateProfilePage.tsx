import { useState } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import {
  ArrowRight,
  Award,
  Bookmark,
  Check,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

import {
  candidates,
  getShortlist,
  saveShortlist,
} from '@/features/recruitment/data/employer/employerDirectoryData';

import { EMPLOYER_ROUTES } from '@/app/routes';

export default function CandidateProfile() {
  const { candidateId } = useParams();

  const candidate = candidates.find(
    (item) => String(item.id) === candidateId
  );

  const [savedIds, setSavedIds] = useState<number[]>(() =>
    getShortlist()
  );

  const isSaved = candidate
    ? savedIds.includes(Number(candidate.id))
    : false;

  function toggleShortlist() {
    if (!candidate) return;

    const id = Number(candidate.id);

    const updated = isSaved
      ? savedIds.filter((savedId) => savedId !== id)
      : [...savedIds, id];

    setSavedIds(updated);
    saveShortlist(updated);
  }

  if (!candidate) {
    return <Navigate to={EMPLOYER_ROUTES.talent} replace />;
  }

  // Fallbacks مطابقة للديزاين
  const scoreBreakdown = (candidate as any).scoreBreakdown || [
    { label: 'Technical Skills', score: 94, gradient: 'from-[#6366F1] to-[#8B5CF6]' },
    { label: 'Internship Performance', score: 90, gradient: 'from-[#6D28D9] to-[#9333EA]' },
    { label: 'Course Performance', score: 91, gradient: 'from-[#7C3AED] to-[#A855F7]' },
    { label: 'Mentorship', score: 89, gradient: 'from-[#8B5CF6] to-[#C026D3]' },
  ];

  const certificates = (candidate as any).certificates || [
    { name: 'JavaScript Advanced', issuer: 'InternsHub Academy' },
    { name: 'React Certification', issuer: 'InternsHub Academy' },
    { name: 'TypeScript Fundamentals', issuer: 'InternsHub Academy' },
  ];

  const projects = (candidate as any).projects || [
    {
      title: 'CloudBase UI Component Library',
      tags: ['React', 'TypeScript'],
    },
    {
      title: 'Internal Analytics Dashboard',
      tags: ['Next.js', 'Tailwind'],
    },
  ];

  const compositeScore = candidate.score || 91;

  return (
    <div className="w-full space-y-4 pb-28 text-slate-800">
      
      {/* Back Link to Talent Directory */}
      <div className="pb-1">
        <Link
          to={EMPLOYER_ROUTES.talent}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 transition-colors hover:text-slate-800"
        >
          <ChevronLeft size={16} strokeWidth={2.2} />
          <span>Talent Directory</span>
        </Link>
      </div>

      {/* 1. Hero Summary Card */}
      <section className="flex w-full flex-col gap-5 rounded-[22px] border border-slate-100 bg-white p-6 shadow-[0_2px_10px_rgba(0,0,0,0.02)] sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-5">
          {/* Avatar */}
          <div
            className={`flex size-16 shrink-0 items-center justify-center rounded-[18px] text-xl font-bold text-white shadow-sm ${
              candidate.color || 'bg-[#009FB7]'
            }`}
          >
            {candidate.initials || 'AH'}
          </div>

          {/* Candidate Details */}
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              {candidate.name}
            </h1>
            <p className="mt-0.5 text-sm font-normal text-slate-500">
              {candidate.role || 'Frontend Developer'} · {(candidate as any).track || 'Frontend Development'}
            </p>

            {/* Sub-meta details */}
            <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-slate-400">
              <span>{(candidate as any).cohort || 'Cohort 12 · 2024'}</span>
              <span>·</span>
              <span>{(candidate as any).internship || 'Interned at CloudBase Inc.'}</span>
              <span>·</span>
              <span className="inline-flex items-center gap-1.5 font-medium text-slate-600">
                <span className="size-2 rounded-full bg-amber-500" />
                {(candidate as any).availabilityDate || 'Available Nov 2024'}
              </span>
            </div>
          </div>
        </div>

        {/* Composite Score */}
        <div className="border-t border-slate-100 pt-3 text-left sm:border-0 sm:pt-0 sm:text-right sm:pr-2">
          <p className="text-4xl font-extrabold leading-none tracking-tight text-[#2F0646]">
            {compositeScore}%
          </p>
          <p className="mt-1 text-xs font-medium text-slate-400">
            Composite Score
          </p>
        </div>
      </section>

      {/* 2. About Card */}
      <section className="w-full rounded-[22px] border border-slate-100 bg-white p-6 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
        <h2 className="text-[11px] font-bold tracking-[0.16em] text-slate-400 uppercase">
          ABOUT
        </h2>
        <p className="mt-3 text-sm font-normal leading-relaxed text-slate-600">
          {candidate.about ||
            'Frontend developer focused on performance and accessibility. Built 3 production React apps during his internship and contributed to an open-source component library used by 3k+ developers.'}
        </p>
      </section>

      {/* 3. Skills Card */}
      <section className="w-full rounded-[22px] border border-slate-100 bg-white p-6 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
        <h2 className="text-[11px] font-bold tracking-[0.16em] text-slate-400 uppercase">
          SKILLS
        </h2>
        <div className="mt-3.5 flex flex-wrap gap-2">
          {candidate.skills && candidate.skills.length > 0 ? (
            candidate.skills.map((skill) => (
              <span
                key={skill}
                className="rounded-lg bg-[#F3F1F6] px-3.5 py-1.5 text-xs font-medium text-slate-700"
              >
                {skill}
              </span>
            ))
          ) : (
            ['React', 'TypeScript', 'Next.js', 'Tailwind CSS', 'REST APIs', 'Git'].map(
              (skill) => (
                <span
                  key={skill}
                  className="rounded-lg bg-[#F3F1F6] px-3.5 py-1.5 text-xs font-medium text-slate-700"
                >
                  {skill}
                </span>
              )
            )
          )}
        </div>
      </section>

      {/* 4. Score Breakdown Card */}
      <section className="w-full rounded-[22px] border border-slate-100 bg-white p-6 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
        <h2 className="mb-4 text-[11px] font-bold tracking-[0.16em] text-slate-400 uppercase">
          SCORE BREAKDOWN
        </h2>
        <div className="space-y-3.5">
          {scoreBreakdown.map((item: any) => (
            <div key={item.label} className="flex items-center gap-4">
              <span className="w-44 shrink-0 text-xs font-medium text-slate-500">
                {item.label}
              </span>

              {/* Progress bar track */}
              <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-100">
                <div
                  className={`h-full rounded-full bg-gradient-to-r ${item.gradient}`}
                  style={{ width: `${item.score}%` }}
                />
              </div>

              <span className="w-10 text-right text-xs font-bold text-slate-900">
                {item.score}%
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* 5. Certificates Card */}
      <section className="w-full rounded-[22px] border border-slate-100 bg-white p-6 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
        <h2 className="mb-4 text-[11px] font-bold tracking-[0.16em] text-slate-400 uppercase">
          CERTIFICATES
        </h2>
        <div className="space-y-4">
          {certificates.map((cert: any) => (
            <div
              key={cert.name}
              className="flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <Award size={18} strokeWidth={1.8} className="text-slate-400" />
                <span className="text-sm font-medium text-slate-800">
                  {cert.name}
                </span>
              </div>
              <span className="text-xs font-normal text-slate-400">
                {cert.issuer}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* 6. Projects Card */}
      <section className="w-full rounded-[22px] border border-slate-100 bg-white p-6 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
        <h2 className="mb-4 text-[11px] font-bold tracking-[0.16em] text-slate-400 uppercase">
          PROJECTS
        </h2>
        <div className="space-y-4">
          {projects.map((project: any, index: number) => (
            <div
              key={project.title}
              className={`group cursor-pointer ${
                index > 0 ? 'border-t border-slate-100 pt-3.5' : ''
              }`}
            >
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-slate-800 transition-colors group-hover:text-purple-700">
                  {project.title}
                </h3>
                <ChevronRight
                  size={16}
                  strokeWidth={2}
                  className="text-slate-400 transition-transform group-hover:translate-x-0.5"
                />
              </div>
              <div className="mt-2 flex items-center gap-2">
                {project.tags.map((tag: string) => (
                  <span
                    key={tag}
                    className="rounded-md bg-[#F3F1F6] px-2.5 py-1 text-[11px] font-medium text-slate-600"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Floating Bottom Action Bar */}
      <div className="fixed bottom-6 right-8 z-30 flex items-center gap-3">
        {/* Toggle Shortlist Button */}
        <button
          type="button"
          onClick={toggleShortlist}
          className={`flex items-center gap-2 rounded-2xl px-5 py-2.5 text-sm font-semibold shadow-sm transition-all duration-150 ${
            isSaved
              ? 'bg-[#F2EBF9] text-[#551072] hover:bg-[#EBDFF5]'
              : 'border border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
          }`}
        >
          {isSaved ? (
            <Check size={16} strokeWidth={2.5} />
          ) : (
            <Bookmark size={16} strokeWidth={2} />
          )}
          <span>{isSaved ? 'Shortlisted' : 'Add to Shortlist'}</span>
        </button>

        {/* Send Opportunity Button */}
        <Link
          to={`${EMPLOYER_ROUTES.sendOpportunity}?candidate=${candidate.id}`}
          className="flex items-center gap-2 rounded-2xl bg-[#350549] px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-purple-950/20 transition-all hover:bg-[#480863]"
        >
          <span>Send Opportunity</span>
          <ArrowRight size={16} strokeWidth={2.2} />
        </Link>
      </div>

    </div>
  );
}