
import { useState } from 'react';
import type { FormEvent } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowLeft, Send } from 'lucide-react';
import { EMPLOYER_ROUTES } from '@/constants/routes';
import { candidates } from '@/components/employer/employerData';

export default function OpportunityForm() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const initialCandidate =
    searchParams.get('candidate') || String(candidates[0].id);

  const [form, setForm] = useState({
    candidate: initialCandidate,
    title: 'Frontend Developer Intern',
    type: 'Internship',
    mode: 'Hybrid',
    startDate: '',
    duration: '3 months',
    description: '',
    requirements: '',
  });

  const update = (key: keyof typeof form, value: string) => {
    setForm((previous) => ({ ...previous, [key]: value }));
  };

  const field =
    'mt-2 w-full rounded-xl border border-slate-200 bg-white px-3.5 py-3 text-sm text-slate-700 outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100';

  const label = 'block text-sm font-semibold text-slate-700';

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const selectedCandidate = candidates.find(
      (candidate) => candidate.id === Number(form.candidate)
    );

    sessionStorage.setItem(
      'employer-opportunity',
      JSON.stringify({
        ...form,
        candidateName: selectedCandidate?.name || 'Candidate',
      })
    );

    navigate(EMPLOYER_ROUTES.opportunitySent);
  };

  return (
    <form
      onSubmit={submit}
      className="mx-auto max-w-4xl rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-8"
    >
      <button
        type="button"
        onClick={() => navigate(-1)}
        className="mb-6 flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-violet-700"
      >
        <ArrowLeft size={16} />
        Back
      </button>

      <div className="mb-7">
        <h2 className="text-lg font-bold">Opportunity details</h2>
        <p className="mt-1 text-sm text-slate-500">
          Share the role details so the candidate knows what to expect.
        </p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <label className={label}>
          Candidate
          <select
            required
            value={form.candidate}
            onChange={(event) => update('candidate', event.target.value)}
            className={field}
          >
            {candidates.map((candidate) => (
              <option key={candidate.id} value={candidate.id}>
                {candidate.name}
              </option>
            ))}
          </select>
        </label>

        <label className={label}>
          Position title
          <input
            required
            value={form.title}
            onChange={(event) => update('title', event.target.value)}
            className={field}
            placeholder="e.g. Product Design Intern"
          />
        </label>

        <label className={label}>
          Opportunity type
          <select
            value={form.type}
            onChange={(event) => update('type', event.target.value)}
            className={field}
          >
            <option>Internship</option>
            <option>Full-time</option>
            <option>Part-time</option>
            <option>Freelance</option>
          </select>
        </label>

        <label className={label}>
          Work mode
          <select
            value={form.mode}
            onChange={(event) => update('mode', event.target.value)}
            className={field}
          >
            <option>Hybrid</option>
            <option>On-site</option>
            <option>Remote</option>
          </select>
        </label>

        <label className={label}>
          Expected start date
          <input
            type="date"
            value={form.startDate}
            onChange={(event) => update('startDate', event.target.value)}
            className={field}
          />
        </label>

        <label className={label}>
          Duration
          <select
            value={form.duration}
            onChange={(event) => update('duration', event.target.value)}
            className={field}
          >
            <option>1 month</option>
            <option>3 months</option>
            <option>6 months</option>
            <option>12 months</option>
          </select>
        </label>

        <label className={`${label} sm:col-span-2`}>
          Opportunity description
          <textarea
            required
            rows={4}
            value={form.description}
            onChange={(event) => update('description', event.target.value)}
            className={field}
            placeholder="Describe the role, team, and responsibilities..."
          />
        </label>

        <label className={`${label} sm:col-span-2`}>
          Requirements
          <textarea
            rows={3}
            value={form.requirements}
            onChange={(event) => update('requirements', event.target.value)}
            className={field}
            placeholder="List the key skills or qualifications..."
          />
        </label>
      </div>

      <div className="mt-8 flex flex-col-reverse justify-end gap-3 border-t border-slate-100 pt-5 sm:flex-row">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-600"
        >
          Cancel
        </button>

        <button
          type="submit"
          className="flex items-center justify-center gap-2 rounded-xl bg-violet-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-violet-200 hover:bg-violet-700"
        >
          <Send size={16} />
          Send opportunity
        </button>
      </div>
    </form>
  );
}
