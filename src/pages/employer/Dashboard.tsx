import { Link } from 'react-router-dom';
import {
  Users,
  BookmarkCheck,
  CalendarDays,
  Send,
  ArrowUpRight,
  Star,
} from 'lucide-react';
import { candidates } from '@/components/employer/employerData';
import { EMPLOYER_ROUTES } from '@/constants/routes';

const stats = [
  {
    label: 'Total Candidates',
    value: '248',
    note: 'Available in talent pool',
    icon: Users,
  },
  {
    label: 'Shortlisted',
    value: '18',
    note: 'Candidates saved',
    icon: BookmarkCheck,
  },
  {
    label: 'Upcoming Interviews',
    value: '6',
    note: 'Ready for your review',
    icon: CalendarDays,
  },
  {
    label: 'Opportunities Sent',
    value: '12',
    note: 'Candidate invitations',
    icon: Send,
  },
];

export default function Dashboard() {
  return (
    <div className="space-y-8">
      {/* رأس الصفحة مع الاسم المخصص */}
      <div>
        <p className="text-sm font-semibold tracking-wider text-purple-700">
          EMPLOYER WORKSPACE
        </p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
          Welcome back, Sarah
        </h1>
        <p className="mt-2 text-slate-500">
          Here’s an overview of your recruitment activity.
        </p>
      </div>

      {/* قسم الإحصائيات (Stats Cards) */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map(({ label, value, note, icon: Icon }) => (
          <div
            key={label}
            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-slate-500">{label}</span>
              <span className="rounded-xl bg-purple-50 p-2 text-purple-700">
                <Icon size={20} />
              </span>
            </div>
            <p className="mt-4 text-3xl font-bold text-slate-900">
              {value}
            </p>
            <p className="mt-2 text-xs text-slate-400">{note}</p>
          </div>
        ))}
      </div>

      {/* المحتوى الرئيسي (المرشحون الموصى بهم + الإجراءات السريعة) */}
      <div className="grid gap-6 xl:grid-cols-[1.5fr_1fr]">
        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-100 p-5">
            <div>
              <h2 className="font-bold text-slate-900">
                Recommended candidates
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Explore top talent for your opportunities.
              </p>
            </div>
            <Link
              to={EMPLOYER_ROUTES.talent}
              className="flex items-center gap-1 text-sm font-semibold text-purple-700 hover:text-purple-900"
            >
              View all <ArrowUpRight size={16} />
            </Link>
          </div>

          <div className="divide-y divide-slate-100">
            {candidates.slice(0, 4).map((candidate) => (
              <Link
                key={candidate.id}
                to={EMPLOYER_ROUTES.candidate(candidate.id)}
                className="flex items-center gap-4 p-4 transition hover:bg-slate-50"
              >
                <div
                  className={`flex size-11 shrink-0 items-center justify-center rounded-full font-semibold text-white ${candidate.color || 'bg-purple-900'}`}
                >
                  {candidate.initials}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-semibold text-slate-900">
                    {candidate.name}
                  </p>
                  <p className="truncate text-sm text-slate-500">
                    {candidate.role}
                  </p>
                </div>
                <div className="flex items-center gap-1 rounded-lg bg-amber-50 px-2.5 py-1 text-sm font-semibold text-amber-700">
                  <Star size={14} className="fill-amber-400 text-amber-400" />
                  {candidate.score}
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* قائمة الإجراءات السريعة */}
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="font-bold text-slate-900">Quick actions</h2>
          <p className="mt-1 text-sm text-slate-500">
            Continue managing your recruitment process.
          </p>

          <div className="mt-5 space-y-3">
            {[
              {
                title: 'Explore talent directory',
                description: 'Find candidates matching your needs.',
                to: EMPLOYER_ROUTES.talent,
                icon: Users,
              },
              {
                title: 'Review shortlist',
                description: 'View the candidates you saved.',
                to: EMPLOYER_ROUTES.shortlist,
                icon: BookmarkCheck,
              },
              {
                title: 'Manage pipeline',
                description: 'Track candidates through each stage.',
                to: EMPLOYER_ROUTES.pipeline,
                icon: CalendarDays,
              },
              {
                title: 'Send an opportunity',
                description: 'Invite a candidate to a role.',
                to: EMPLOYER_ROUTES.sendOpportunity,
                icon: Send,
              },
            ].map(({ title, description, to, icon: Icon }) => (
              <Link
                key={title}
                to={to}
                className="flex items-center gap-3 rounded-xl border border-slate-200 p-4 transition hover:border-purple-300 hover:bg-purple-50/50"
              >
                <span className="rounded-lg bg-purple-100 p-2 text-purple-800">
                  <Icon size={19} />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block font-semibold text-slate-800">
                    {title}
                  </span>
                  <span className="mt-1 block text-sm text-slate-500">
                    {description}
                  </span>
                </span>
                <ArrowUpRight size={17} className="text-slate-400" />
              </Link>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}