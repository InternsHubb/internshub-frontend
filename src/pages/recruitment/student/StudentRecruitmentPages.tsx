import { useMemo, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Bell,
  BriefcaseBusiness,
  Building2,
  CalendarCheck,
  CalendarDays,
  Check,
  CheckCircle2,
  ChevronRight,
  CircleCheck,
  Clock3,
  Code2,
  Eye,
  FileBadge2,
  FileText,
  GraduationCap,
  Inbox,
  MapPin,
  Search,
  Sparkles,
  Star,
  UserRound,
  Video,
  X,
} from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";

import {
  profile,
  projectDescriptions,
  scoreCategories,
} from "@/features/student-recruitment/data/mockRecruitmentData";
import {
  opportunities,
  type Opportunity,
  type OpportunityType,
  type WorkMode,
} from "@/features/student-recruitment/data/opportunities";
import { ROUTES } from "@/constants/routes";

const card =
  "rounded-[30px] border border-white/80 bg-white shadow-[0_12px_28px_-16px_rgba(49,18,67,0.32)]";
const purpleButton =
  "inline-flex min-h-10 items-center justify-center gap-2 rounded-xl bg-[#3B0454] px-4 text-[15px] font-semibold text-white transition hover:bg-[#57206e]";
const paleButton =
  "inline-flex min-h-10 items-center justify-center gap-2 rounded-xl bg-[#F1E5FA] px-4 text-[15px] font-semibold text-[#3B0454] transition hover:bg-[#E8D7F4]";
const tag =
  "rounded-md bg-[#F1E5FA] px-2 py-1 text-[13px] font-medium text-[#4A285D]";

function PageTitle({
  title,
  subtitle,
  action,
}: {
  title: string;
  subtitle: string;
  action?: React.ReactNode;
}) {
  const { t } = useTranslation();
  const titles: Record<string, string> = {
    Recruitment: "dashboard.title",
    "Recruitment Eligibility": "eligibility.title",
    "Talent Profile": "profile.title",
    Opportunities: "opportunities.title",
    "My Applications": "applications.title",
    "Interview Details": "interview.title",
    Agreement: "agreementScreen.title",
    Notifications: "notifications.title",
    "You're all set!": "completion.title",
  };
  const subtitles: Record<string, string> = {
    "Turn your InternsHub experience into your next opportunity.": "dashboard.subtitle",
    "Your score breakdown and employer visibility status.": "eligibility.subtitle",
    "This is what employers see when they discover you.": "profile.subtitle",
    "Explore opportunities that match your skills.": "opportunities.subtitle",
    "Track your recruitment interactions.": "applications.subtitle",
    "Your upcoming interview information.": "interview.subtitle",
    "Review and sign the liability agreement before the project begins.": "agreementScreen.subtitle",
  };
  return (
    <header className="mb-5 flex flex-wrap items-end justify-between gap-3">
      <div>
        <h1 className="text-[32px] font-bold tracking-[-0.04em] text-[#171222] sm:text-[36px]">
          {titles[title] ? t(`recruitment.studentScreens.${titles[title]}`) : title}
        </h1>
        <p className="mt-1 text-[14px] text-[#777183]">{subtitles[subtitle] ? t(`recruitment.studentScreens.${subtitles[subtitle]}`) : subtitle}</p>
      </div>
      {action}
    </header>
  );
}

function Panel({
  title,
  children,
  className = "",
}: {
  title?: string;
  children: React.ReactNode;
  className?: string;
}) {
  const { t } = useTranslation();
  const panelTitles: Record<string, string> = {
    "Your InternsHub Journey": "dashboard.journey",
    "Recommended Opportunities": "dashboard.recommended",
    "Recent Activity": "dashboard.recentActivity",
    "Quick Actions": "dashboard.quickActions",
    "Score Breakdown": "eligibility.scoreBreakdown",
    "Track & Training": "profile.trackTraining",
    About: "profile.about",
    Skills: "profile.skills",
    "Internship Experience": "profile.experience",
    Projects: "profile.projects",
    Certificates: "profile.certificates",
    "Score Details": "profile.scoreDetails",
    Description: "opportunityDetails.description",
    Responsibilities: "opportunityDetails.responsibilities",
    Requirements: "opportunityDetails.requirements",
    "Required Skills": "opportunityDetails.requiredSkills",
    "Application Progress": "applicationDetails.progress",
    "Preparation Tips": "interview.preparationTips",
    "What's Next?": "completion.whatsNext",
  };
  return (
    <section className={`${card} p-5 sm:p-6 ${className}`}>
      {title ? (
        <h2 className="mb-5 text-[16px] font-bold text-[#21172C]">{panelTitles[title] ? t(`recruitment.studentScreens.${panelTitles[title]}`) : title}</h2>
      ) : null}
      {children}
    </section>
  );
}

function ScoreCircle({
  score,
  size = 106,
  light = false,
}: {
  score: number;
  size?: number;
  light?: boolean;
}) {
  const { t } = useTranslation();
  const radius = 43;
  const length = Math.PI * 2 * radius;
  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <svg
        viewBox="0 0 100 100"
        className="size-full -rotate-90"
        aria-label={`Composite score ${score}%`}
      >
        <circle
          cx="50"
          cy="50"
          r={radius}
          fill="none"
          stroke={light ? "rgba(255,255,255,0.22)" : "#EFE4F6"}
          strokeWidth="7"
        />
        <circle
          cx="50"
          cy="50"
          r={radius}
          fill="none"
          stroke={light ? "#FFFFFF" : "#9256AE"}
          strokeWidth="7"
          strokeLinecap="round"
          strokeDasharray={length}
          strokeDashoffset={length * (1 - score / 100)}
        />
      </svg>
      <span
        className={`absolute inset-0 flex flex-col items-center justify-center tracking-tight ${light ? "text-white" : "text-[#171222]"}`}
      >
        <b className="text-[24px] font-bold leading-none">{score}%</b>
        {light ? (
          <small className="mt-1 text-[12px] text-white/80">{t("recruitment.studentScreens.eligibility.score")}</small>
        ) : null}
      </span>
    </div>
  );
}

function QuickAction({
  to,
  children,
}: {
  to: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      to={to}
      className="flex min-h-9 items-center justify-between rounded-lg bg-[#F4EAF9] px-3 text-[14px] font-medium text-[#332342] transition hover:bg-[#EDE0F5]"
    >
      {children}
      <ChevronRight className="size-3.5" />
    </Link>
  );
}

function OpportunityCard({
  item,
  compact = false,
}: {
  item: Opportunity;
  compact?: boolean;
}) {
  const { t } = useTranslation();
  const opportunityKey: Record<string, string> = {
    "novatech-frontend": "novatechFrontend",
    "designcraft-ui-ux": "designcraftUiux",
    "startupflow-product": "startupflowProduct",
    "cloudbase-react": "cloudbaseReact",
  };
  const dataKey = opportunityKey[item.id];
  const localized = (field: string, fallback: string) =>
    t(`recruitment.studentScreens.opportunityData.${dataKey}.${field}`, {
      defaultValue: fallback,
    });
  return (
    <article
      className={`${card} flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between ${compact ? "min-h-[116px]" : ""}`}
    >
      <div className="flex min-w-0 items-start gap-3">
        <span
          className="flex size-10 shrink-0 items-center justify-center rounded-xl text-sm font-bold text-white"
          style={{ backgroundColor: item.color }}
        >
          {item.company[0]}
        </span>
        <div className="min-w-0">
          <h3 className="text-[16px] font-bold text-[#21172C]">{item.title}</h3>
          <p className="mt-0.5 text-[14px] text-[#675C70]">
            {item.company} · {localized("location", item.location)}
          </p>
          {!compact ? (
            <p className="mt-2 max-w-[720px] text-[14px] leading-5 text-[#655D6D]">
              {localized("description", item.description)}
            </p>
          ) : null}
          <div className="mt-2 flex flex-wrap gap-1.5">
            {item.skills.map((skill) => (
              <span key={skill} className={tag}>
                {skill}
              </span>
            ))}
          </div>
        </div>
      </div>
      <div className="flex shrink-0 flex-wrap items-center justify-end gap-2 sm:max-w-[190px]">
        <span className={tag}>{t(`recruitment.studentScreens.common.${({"Full-time":"fullTime", Internship:"internship", "Part-time":"partTime"} as Record<string,string>)[item.type]}`, { defaultValue: item.type })}</span>
        <span className={tag}>{t(`recruitment.studentScreens.common.${({Remote:"remote", Hybrid:"hybrid", "On-site":"onsite"} as Record<string,string>)[item.mode]}`, { defaultValue: item.mode })}</span>
        {!compact ? (
          <div className="flex w-full items-center justify-end gap-3 pt-1">
            <span className="text-[13px] text-[#766C7D]">
              {t("recruitment.studentScreens.common.posted", { time: item.posted })}
            </span>
            <Link
              to={`${ROUTES.recruitment}/opportunities/${item.id}`}
              className={`${purpleButton} min-h-8 px-3 text-[13px]`}
            >
              {t("recruitment.studentScreens.opportunities.viewOpportunity")}
            </Link>
          </div>
        ) : (
          <Link
            to={`${ROUTES.recruitment}/opportunities/${item.id}`}
            className="mt-1 text-[13px] font-semibold text-[#4C0D64]"
          >
            {t("recruitment.studentScreens.opportunities.viewOpportunity")} <ArrowUpRight className="inline size-3 rtl:rotate-180" />
          </Link>
        )}
      </div>
    </article>
  );
}

export function StudentRecruitmentDashboard() {
  const { t } = useTranslation();
  const recommended = [opportunities[0], opportunities[1], opportunities[2]];
  return (
    <div>
      <PageTitle
        title={t("recruitment.studentScreens.dashboard.title")}
        subtitle="Turn your InternsHub experience into your next opportunity."
      />
      <section className="relative mb-5 flex min-h-[230px] flex-col justify-center gap-6 overflow-hidden rounded-[22px] bg-[linear-gradient(105deg,#3D0057_0%,#642477_52%,#99569F_100%)] px-7 py-9 text-white sm:flex-row sm:items-center sm:justify-between sm:px-10 sm:py-10">
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 h-[58px] overflow-hidden"
          aria-hidden="true"
        >
          <div className="absolute -bottom-8 start-[-3%] h-16 w-[110%] rotate-[-2deg] rounded-[50%] bg-[#CB7D9B]/35" />
          <div className="absolute -bottom-10 start-[-4%] h-14 w-[110%] rotate-[1deg] rounded-[50%] bg-[#D996A7]/35" />
        </div>
        <div
          className="pointer-events-none absolute end-[17%] top-1/2 size-[260px] -translate-y-1/2 rounded-full border border-white/10"
          aria-hidden="true"
        >
          <div className="absolute inset-[24px] rounded-full border border-white/15" />
        </div>
        <div className="relative z-10 flex-1">
          <p className="max-w-[570px] text-[27px] font-bold leading-[1.2] sm:text-[30px]">
            {t("recruitment.studentScreens.dashboard.heroTitle")}
          </p>
          <p className="mt-4 max-w-[700px] text-[16px] leading-6 text-white/85">
            {t("recruitment.studentScreens.dashboard.heroBody")}
          </p>
        </div>
        <div className="relative z-10 flex flex-wrap items-center gap-6">
          <ScoreCircle score={profile.score} size={120} light />
          <div className="flex min-w-[250px] flex-col gap-3">
            <Link
              className="rounded-xl bg-white px-5 py-4 text-center text-[15px] font-bold text-[#43105C]"
              to={`${ROUTES.recruitment}/profile`}
            >
              {t("recruitment.studentScreens.dashboard.viewProfile")}
            </Link>
            <Link
              className="rounded-xl border border-white/35 bg-white/10 px-5 py-4 text-center text-[15px] font-semibold text-white"
              to={`${ROUTES.recruitment}/opportunities`}
            >
              {t("recruitment.studentScreens.dashboard.browseOpportunities")}
            </Link>
          </div>
        </div>
        <Sparkles className="absolute end-[42%] top-12 size-7 text-[#E5B5F4]" />
        <Sparkles className="absolute end-[33%] bottom-14 size-5 text-[#F4B874]" />
        <Sparkles className="absolute start-[54%] top-10 size-5 text-[#F4B874]" />
      </section>
      <div className="mb-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Stat
          icon={<Star />}
          value="87%"
          title={t("recruitment.studentScreens.dashboard.compositeScore")}
          foot={t("recruitment.studentScreens.dashboard.monthlyIncrease")}
          tone="purple"
        />
        <Stat
          icon={<Eye />}
          value={t("recruitment.studentScreens.dashboard.visible")}
          title={t("recruitment.studentScreens.dashboard.talentDirectory")}
          foot={t("recruitment.studentScreens.dashboard.activeSince")}
          tone="green"
        />
        <Stat
          icon={<FileBadge2 />}
          value={t("recruitment.studentScreens.dashboard.certificatesEarned")}
          title={t("recruitment.studentScreens.dashboard.certificates")}
          foot={t("recruitment.studentScreens.dashboard.certificateNames")}
          tone="amber"
        />
        <Stat
          icon={<BriefcaseBusiness />}
          value={t("recruitment.studentScreens.dashboard.openOpportunities")}
          title={t("recruitment.studentScreens.dashboard.opportunities")}
          foot={t("recruitment.studentScreens.dashboard.newThisWeek")}
          tone="blue"
        />
      </div>
      <Panel className="mb-5 px-6 py-6 sm:px-8" title={t("recruitment.studentScreens.dashboard.journey")}>
        <div className="relative grid grid-cols-2 gap-4 pt-2 sm:grid-cols-5">
          <div className="absolute start-[10%] end-[10%] top-[24px] hidden h-1 bg-[#602179] sm:block" />
          {[
            t("recruitment.studentScreens.dashboard.courses"),
            t("recruitment.studentScreens.dashboard.internship"),
            t("recruitment.studentScreens.dashboard.mentorship"),
            t("recruitment.studentScreens.dashboard.certification"),
            t("recruitment.studentScreens.dashboard.recruitment"),
          ].map((step, i) => (
            <div
              key={step}
              className="relative z-10 flex flex-col items-center gap-2 text-center"
            >
              <span
                className={`flex size-11 items-center justify-center rounded-full text-[14px] font-bold text-white ring-4 ring-white ${i === 4 ? "bg-[#3B0454]" : "bg-[#8B5199]"}`}
              >
                {i < 4 ? <Check className="size-4" /> : "5"}
              </span>
              <span className="text-[13px] font-semibold text-[#362A3D]">
                {step}
              </span>
            </div>
          ))}
        </div>
      </Panel>
      <div className="grid gap-4 xl:grid-cols-[1.6fr_1fr]">
        <Panel title={t("recruitment.studentScreens.dashboard.recommended")}>
          <div className="space-y-3">
            {recommended.map((item) => (
              <OpportunityCard key={item.id} item={item} compact />
            ))}
          </div>
          <Link
            to={`${ROUTES.recruitment}/opportunities`}
            className="mt-3 inline-flex items-center gap-1 text-[14px] font-bold text-[#4A0D62]"
          >
            {t("recruitment.studentScreens.dashboard.viewAll")} <ArrowRight className="size-3 rtl:rotate-180" />
          </Link>
        </Panel>
        <div className="space-y-4">
          <Panel title={t("recruitment.studentScreens.dashboard.recentActivity")}>
            <div className="divide-y divide-[#EEE7F2]">
              {[
                [
                  t("recruitment.studentScreens.dashboard.activityProfileViewed"),
                  t("recruitment.studentScreens.dashboard.twoHoursAgo"),
                  <Eye key="eye" />,
                ],
                [
                  t("recruitment.studentScreens.dashboard.activityNewOpportunity"),
                  t("recruitment.studentScreens.dashboard.fiveHoursAgo"),
                  <BriefcaseBusiness key="brief" />,
                ],
                [
                  t("recruitment.studentScreens.dashboard.activityInterview"),
                  t("recruitment.studentScreens.common.yesterday"),
                  <CalendarDays key="calendar" />,
                ],
                [
                  t("recruitment.studentScreens.dashboard.activityCertificate"),
                  t("recruitment.studentScreens.dashboard.threeDaysAgo"),
                  <GraduationCap key="grad" />,
                ],
              ].map(([title, time, icon]) => (
                <div
                  key={String(title)}
                  className="flex items-center gap-3 py-3 first:pt-0 last:pb-0"
                >
                  <span className="flex size-8 items-center justify-center rounded-lg bg-[#F3E9F8] text-[#58216E]">
                    {icon}
                  </span>
                  <div>
                    <p className="text-[13px] font-semibold text-[#2A2033]">
                      {title}
                    </p>
                    <p className="mt-1 text-[12px] text-[#817687]">{time}</p>
                  </div>
                </div>
              ))}
            </div>
          </Panel>
          <Panel title={t("recruitment.studentScreens.dashboard.quickActions")}>
            <div className="space-y-2">
              <QuickAction to={`${ROUTES.recruitment}/eligibility`}>
                {t("recruitment.studentScreens.dashboard.checkEligibility")}
              </QuickAction>
              <QuickAction
                to={`${ROUTES.recruitment}/applications/designcraft-ui-ux`}
              >
                {t("recruitment.studentScreens.dashboard.viewApplications")}
              </QuickAction>
              <QuickAction to={`${ROUTES.recruitment}/profile`}>
                {t("recruitment.studentScreens.dashboard.updateProfile")}
              </QuickAction>
            </div>
          </Panel>
        </div>
      </div>
    </div>
  );
}

function Stat({
  icon,
  value,
  title,
  foot,
  tone,
}: {
  icon: React.ReactNode;
  value: string;
  title: string;
  foot: string;
  tone: string;
}) {
  const tones: Record<string, string> = {
    purple: "bg-[#F1E5FA] text-[#57206E]",
    green: "bg-[#DDF8EA] text-[#008A58]",
    amber: "bg-[#FFF1C9] text-[#AA7300]",
    blue: "bg-[#DDF4FC] text-[#087999]",
  };
  return (
    <div className={`${card} p-5 sm:p-6`}>
      <span
        className={`flex size-10 items-center justify-center rounded-xl ${tones[tone]}`}
      >
        {icon}
      </span>
      <p className="mt-4 text-[26px] font-bold text-[#1E1526]">{value}</p>
      <p className="text-[15px] font-semibold text-[#3B3044]">{title}</p>
      <p className="mt-1 text-[13px] text-[#706677]">{foot}</p>
    </div>
  );
}

export function StudentRecruitmentEligibility() {
  const { t } = useTranslation();
  const sampleScore = 74;
  const threshold = 80;
  const pointsBelow = threshold - sampleScore;

  return (
    <div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-[11px] font-bold tracking-[1.5px] text-[#7C3AED] uppercase">
            {t('recruitment.shell.brandName', 'RECRUITMENT')}
          </p>
          <h1 className="mt-1 text-[26px] font-bold tracking-[-0.02em] text-[#111827] sm:text-[30px]">
            Eligibility review
          </h1>
          <p className="mt-1 text-[14px] text-[#64748B]">
            See how your profile measures against Talent Directory requirements.
          </p>
        </div>
        <div className="shrink-0 pt-1">
          <span className="inline-flex min-h-[28px] items-center justify-center rounded-full bg-[#FEE2E2] px-4 text-[12px] font-bold text-[#DC2626]">
            Not eligible
          </span>
        </div>
      </div>

      {/* Main Eligibility Hero Card */}
      <section className="mt-6 rounded-[24px] border border-white/80 bg-white p-6 shadow-[0_12px_32px_-16px_rgba(49,18,67,0.18)] sm:p-8">
        <div className="flex flex-col items-center gap-6 md:flex-row md:items-center md:gap-8">
          {/* Score Donut */}
          <div className="relative flex size-[140px] shrink-0 items-center justify-center rounded-full bg-[#FAF5FF] p-3 shadow-inner">
            <svg className="size-full -rotate-90" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="40"
                fill="none"
                stroke="#F1E8FA"
                strokeWidth="10"
              />
              <circle
                cx="50"
                cy="50"
                r="40"
                fill="none"
                stroke="url(#purpleRedGrad)"
                strokeWidth="10"
                strokeDasharray="251.2"
                strokeDashoffset={251.2 - (251.2 * sampleScore) / 100}
                strokeLinecap="round"
              />
              <defs>
                <linearGradient id="purpleRedGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#7C3AED" />
                  <stop offset="50%" stopColor="#C084FC" />
                  <stop offset="100%" stopColor="#F43F5E" />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <span className="text-[32px] font-bold leading-none text-[#111827]">{sampleScore}%</span>
              <span className="mt-1 text-[11px] font-medium text-[#64748B]">Sample score</span>
            </div>
          </div>

          {/* Right Info and Progress */}
          <div className="min-w-0 flex-1">
            <p className="text-[11px] font-bold tracking-[1.4px] text-[#7C3AED] uppercase">
              MERNA ADEL · COMPOSITE SCORE
            </p>
            <h2 className="mt-1 text-[20px] font-bold text-[#111827] sm:text-[22px]">
              You are {pointsBelow} percentage points below the threshold
            </h2>
            <p className="mt-2 text-[14px] leading-relaxed text-[#64748B]">
              Talent Directory visibility requires a Composite Score of at least 80% and your recorded consent. This clearly labeled sample does not represent your real score.
            </p>

            <div className="mt-5">
              <div className="h-3 w-full overflow-hidden rounded-full bg-[#F3E8FF]">
                <div
                  className="h-full rounded-full bg-[linear-gradient(90deg,#7C3AED_0%,#C084FC_50%,#F43F5E_100%)]"
                  style={{ width: `${sampleScore}%` }}
                />
              </div>
              <div className="mt-2 flex items-center justify-between text-[12px] font-medium text-[#64748B]">
                <span>Sample: {sampleScore}%</span>
                <span>Eligibility threshold: {threshold}%</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3 Action Cards */}
      <div className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-3">
        <div className="rounded-[20px] border border-white/80 bg-white p-6 shadow-[0_12px_28px_-16px_rgba(49,18,67,0.14)]">
          <span className="inline-flex size-8 items-center justify-center rounded-[8px] bg-[#FAF5FF] text-[13px] font-bold text-[#7C3AED]">
            01
          </span>
          <h3 className="mt-4 text-[16px] font-bold text-[#111827]">Complete recommended courses</h3>
          <p className="mt-2 text-[13px] leading-relaxed text-[#64748B]">
            Build the role-specific skills highlighted in your learning plan.
          </p>
        </div>

        <div className="rounded-[20px] border border-white/80 bg-white p-6 shadow-[0_12px_28px_-16px_rgba(49,18,67,0.14)]">
          <span className="inline-flex size-8 items-center justify-center rounded-[8px] bg-[#FAF5FF] text-[13px] font-bold text-[#7C3AED]">
            02
          </span>
          <h3 className="mt-4 text-[16px] font-bold text-[#111827]">Strengthen performance</h3>
          <p className="mt-2 text-[13px] leading-relaxed text-[#64748B]">
            Use internship feedback to improve delivery, teamwork, and consistency.
          </p>
        </div>

        <div className="rounded-[20px] border border-white/80 bg-white p-6 shadow-[0_12px_28px_-16px_rgba(49,18,67,0.14)]">
          <span className="inline-flex size-8 items-center justify-center rounded-[8px] bg-[#FAF5FF] text-[13px] font-bold text-[#7C3AED]">
            03
          </span>
          <h3 className="mt-4 text-[16px] font-bold text-[#111827]">Meet your mentor</h3>
          <p className="mt-2 text-[13px] leading-relaxed text-[#64748B]">
            Set practical goals and review progress before your next eligibility check.
          </p>
        </div>
      </div>

      {/* What happens next Card */}
      <section className="mt-6 flex flex-col gap-4 rounded-[20px] border border-white/80 bg-white p-6 shadow-[0_12px_28px_-16px_rgba(49,18,67,0.14)] sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0 flex-1">
          <h2 className="text-[17px] font-bold text-[#111827]">What happens next?</h2>
          <p className="mt-1 text-[14px] text-[#64748B]">
            Keep using InternsHub normally. Your eligibility can be reviewed again as your profile improves.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Link
            to={`${ROUTES.recruitment}/talent-directory`}
            className="inline-flex min-h-[44px] items-center justify-center rounded-full bg-[linear-gradient(135deg,#7C3AED_0%,#9333EA_100%)] px-6 text-[14px] font-semibold text-white shadow-[0_6px_18px_rgba(124,58,237,0.25)] transition hover:brightness-110"
          >
            Review directory consent
          </Link>
          <Link
            to={ROUTES.recruitment}
            className="inline-flex min-h-[44px] items-center justify-center rounded-full border border-[#D8C6E8] bg-white px-6 text-[14px] font-semibold text-[#111827] transition hover:bg-[#FAF7FD]"
          >
            Return to dashboard
          </Link>
        </div>
      </section>
    </div>
  );
}


export function StudentRecruitmentProfile() {
  const { t, i18n } = useTranslation();
  const locale = i18n.resolvedLanguage?.startsWith("ar") ? "ar" : "en";
  const [tab, setTab] = useState<"overview" | "score">("overview");
  return (
    <div>
      <PageTitle
        title={t("recruitment.studentScreens.profile.title")}
        subtitle="This is what employers see when they discover you."
        action={
          <>
            <button type="button" className={purpleButton}>
              <UserRound className="size-3.5" />
              {t("recruitment.studentScreens.profile.edit")}</button>
            <button type="button" className={paleButton}>
              {t("recruitment.studentScreens.profile.preview")}</button>
          </>
        }
      />
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2 rounded-xl border border-[#B8EFCF] bg-[#E0F9EA] px-4 py-3 text-[13px] font-semibold text-[#087544]">
        <span className="flex items-center gap-2">
          <span className="size-2 rounded-full bg-[#18C876]" />
          {t("recruitment.studentScreens.profile.visibility")}</span>
        <Link
          to={`${ROUTES.recruitment}/eligibility`}
          className="flex items-center gap-1"
        >
          {t("recruitment.studentScreens.profile.viewEligibility")}<ArrowRight className="size-3" />
        </Link>
      </div>
      <div className="grid gap-4 lg:grid-cols-[245px_1fr]">
        <div className="space-y-3">
          <Panel className="text-center">
            <span className="relative mx-auto flex size-[72px] items-center justify-center rounded-full bg-[linear-gradient(135deg,#8B5DB0,#DA86E2)] text-[28px] font-bold text-white">
              {profile.initials}
              <i className="absolute bottom-0 end-0 size-4 rounded-full border-2 border-white bg-[#20C979]" />
            </span>
            <h2 className="mt-2 text-[16px] font-bold">{profile.name}</h2>
            <p className="text-[13px] text-[#665A70]">{profile.title}</p>
            <span className="mt-3 inline-flex rounded-full bg-[#F1E5FA] px-3 py-1 text-[12px] font-semibold text-[#54206C]">
              {t("recruitment.studentScreens.profile.available")}</span>
            <div className="mt-3 flex justify-center gap-2">
              <span className="rounded-md bg-[#F6F2F8] p-2">
                <Code2 className="size-3.5" />
              </span>
              <span className="rounded-md bg-[#F6F2F8] p-2">
                <BriefcaseBusiness className="size-3.5" />
              </span>
              <span className="rounded-md bg-[#F6F2F8] p-2">
                <Eye className="size-3.5" />
              </span>
            </div>
          </Panel>
          <section className="rounded-[18px] bg-[linear-gradient(140deg,#532167,#9C5EAA)] p-4 text-white">
            <p className="text-[13px]">{t("recruitment.studentScreens.dashboard.compositeScore")}</p>
            <div className="mt-1 flex items-center justify-between">
              <b className="text-[32px]">87%</b>
              <span className="rounded-full bg-white/20 px-2 py-1 text-[10px]">
                {t("recruitment.studentScreens.profile.topPercent")}</span>
            </div>
            <div className="mt-2 h-1 rounded-full bg-white/35">
              <div className="h-full w-[87%] rounded-full bg-white" />
            </div>
            <div className="mt-3 space-y-1">
              {scoreCategories.map(({ label, score }) => (
                <p
                  className="flex justify-between text-[12px] text-white/80"
                  key={label[locale]}
                >
                  <span>{label[locale]}</span>
                  <span>{score}%</span>
                </p>
              ))}
            </div>
          </section>
          <Panel title={t("recruitment.studentScreens.profile.trackTraining")}>
            <ProfileFact label="Primary Track" value="UI/UX Design" />
            <ProfileFact label="Internship" value="DesignCraft Agency" />
            <ProfileFact label="Mentor" value={profile.mentor} />
            <ProfileFact label="Cohort" value={profile.cohort} />
          </Panel>
        </div>
        <div className="min-w-0">
          <div className={`${card} mb-3 flex gap-1 p-1`}>
            <button
              onClick={() => setTab("overview")}
              className={`flex-1 rounded-lg px-3 py-2 text-[13px] font-bold ${tab === "overview" ? "bg-white text-[#2B1D36] shadow-sm" : "text-[#7B7182]"}`}
            >
              {t("recruitment.studentScreens.profile.overview")}</button>
            <button
              onClick={() => setTab("score")}
              className={`flex-1 rounded-lg px-3 py-2 text-[13px] font-bold ${tab === "score" ? "bg-white text-[#2B1D36] shadow-sm" : "text-[#7B7182]"}`}
            >
              {t("recruitment.studentScreens.profile.scoreDetails")}</button>
          </div>
          {tab === "overview" ? (
            <div className="space-y-3">
              <Panel title={t("recruitment.studentScreens.profile.about")}>
                <p className="text-[14px] leading-5 text-[#655B6D]">
                  {profile.about[locale]}
                </p>
              </Panel>
              <Panel title={t("recruitment.studentScreens.profile.skills")}>
                <div className="flex flex-wrap gap-2">
                  {profile.skills.map((skill) => (
                    <span className={tag} key={skill}>
                      {skill}
                    </span>
                  ))}
                </div>
              </Panel>
              <Panel title={t("recruitment.studentScreens.profile.experience")}>
                <div className="flex items-start gap-3">
                  <span className="flex size-9 items-center justify-center rounded-lg bg-[#0796B4] text-[15px] font-bold text-white">
                    D
                  </span>
                  <div className="flex-1">
                    <div className="flex justify-between gap-3">
                      <div>
                        <h3 className="text-[14px] font-bold">
                          {t("recruitment.studentScreens.profile.role")}</h3>
                        <p className="text-[13px] text-[#6E6375]">
                          {t("recruitment.studentScreens.profile.experienceCompanyDate")}</p>
                      </div>
                      <b className="text-[16px] text-[#3B0454]">92%</b>
                    </div>
                    <p className="mt-2 text-[13px] leading-4 text-[#706779]">
                      {projectDescriptions[0].description[locale]}
                    </p>
                  </div>
                </div>
              </Panel>
              <Panel title={t("recruitment.studentScreens.profile.projects")}>
                <div className="space-y-2">
                  {projectDescriptions.map((project) => (
                    <div
                      key={project.title}
                      className="rounded-xl bg-[#F3E9F8] p-3"
                    >
                      <h3 className="text-[13px] font-bold">{project.title}</h3>
                      <p className="mt-1 text-[12px] leading-4 text-[#675B70]">
                        {project.description[locale]}
                      </p>
                      <div className="mt-2 flex gap-1.5">
                        {project.tags.map((item) => (
                          <span key={item} className={tag}>
                            {item}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </Panel>
              <Panel title={t("recruitment.studentScreens.dashboard.certificates")}>
                <div className="space-y-2">
                  {profile.certificates.map((certificate) => (
                    <div
                      className="flex items-center gap-3 rounded-lg bg-[#F3E9F8] px-3 py-2.5"
                      key={certificate}
                    >
                      <FileBadge2 className="size-4 text-[#552069]" />
                      <div className="flex-1">
                        <p className="text-[13px] font-semibold">
                          {certificate}
                        </p>
                        <p className="text-[12px] text-[#807488]">
                          {t("recruitment.studentScreens.profile.certificateIssuer")}</p>
                      </div>
                      <ChevronRight className="size-3" />
                    </div>
                  ))}
                </div>
              </Panel>
            </div>
          ) : (
            <Panel title={t("recruitment.studentScreens.profile.scoreDetails")}>
              <div className="space-y-4">
                {scoreCategories.map(({ label, score }) => (
                  <div key={label[locale]}>
                    <p className="mb-2 flex justify-between text-[14px]">
                      <span>{label[locale]}</span>
                      <b>{score}%</b>
                    </p>
                    <div className="h-2 rounded-full bg-[#F0E9F4]">
                      <div
                        className="h-full rounded-full bg-[#995BB0]"
                        style={{ width: `${score}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </Panel>
          )}
        </div>
      </div>
    </div>
  );
}

function ProfileFact({ label, value }: { label: string; value: string }) {
  return (
    <p className="flex justify-between gap-2 py-1.5 text-[12px]">
      <span className="text-[#776D7F]">{label}</span>
      <b className="text-end text-[#34273D]">{value}</b>
    </p>
  );
}

export function StudentRecruitmentOpportunities() {
  const { t } = useTranslation();
  const [mode, setMode] = useState<"All" | WorkMode>("All");
  const [type, setType] = useState<"All" | OpportunityType>("All");
  const [query, setQuery] = useState("");
  const filtered = useMemo(
    () =>
      opportunities.filter(
        (item) =>
          (mode === "All" || item.mode === mode) &&
          (type === "All" || item.type === type) &&
          `${item.title} ${item.company} ${item.skills.join(" ")}`
            .toLowerCase()
            .includes(query.toLowerCase()),
      ),
    [mode, type, query],
  );
  const filters = (
    <div className="flex flex-col gap-3">
      <div>
        <p className="mb-1.5 text-[12px] font-semibold text-[#5F5666]">
          {t("recruitment.studentScreens.opportunities.workMode")}
        </p>
        <div className="flex flex-wrap gap-1.5">
          {(["All", "Remote", "Hybrid", "On-site"] as const).map((item) => (
            <FilterPill
              active={mode === item}
              key={item}
              onClick={() => setMode(item)}
            >
              {t(`recruitment.studentScreens.common.${({All:"all", Remote:"remote", Hybrid:"hybrid", "On-site":"onsite"} as Record<string,string>)[item]}`)}
            </FilterPill>
          ))}
        </div>
      </div>
      <div>
        <p className="mb-1.5 text-[12px] font-semibold text-[#5F5666]">{t("recruitment.studentScreens.opportunities.type")}</p>
        <div className="flex flex-wrap gap-1.5">
          {(["All", "Full-time", "Internship", "Part-time"] as const).map(
            (item) => (
              <FilterPill
                active={type === item}
                key={item}
                onClick={() => setType(item)}
              >
                {t(`recruitment.studentScreens.common.${({All:"all", "Full-time":"fullTime", Internship:"internship", "Part-time":"partTime"} as Record<string,string>)[item]}`)}
              </FilterPill>
            ),
          )}
        </div>
      </div>
    </div>
  );
  return (
    <div>
      <div className="mb-2 max-w-[390px] rounded-full border border-[#EAE4EE] bg-white px-4 shadow-sm">
        <label className="flex h-10 items-center gap-2">
          <Search className="size-4 text-[#756A7E]" />
          <input
            className="w-full bg-transparent text-[14px] outline-none placeholder:text-[#92889A]"
            placeholder={t("recruitment.studentScreens.common.searchOpportunities")}
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
        </label>
      </div>
      <PageTitle
        title={t("recruitment.studentScreens.dashboard.opportunities")}
        subtitle="Explore opportunities that match your skills."
      />
      <Panel className="mb-4">{filters}</Panel>
      <p className="mb-2 text-[13px] text-[#5F5666]">
        {filtered.length}{" "}
        {t("recruitment.studentScreens.opportunities.count", { count: filtered.length })}
      </p>
      <div className="space-y-3">
        {filtered.length ? (
          filtered.map((item) => <OpportunityCard item={item} key={item.id} />)
        ) : (
          <Panel className="py-12 text-center">
            <BriefcaseBusiness className="mx-auto size-7 text-[#9467A7]" />
            <h2 className="mt-3 text-sm font-bold">{t("recruitment.studentScreens.opportunities.emptyTitle")}</h2>
            <p className="mt-1 text-[14px] text-[#766B7E]">
              {t("recruitment.studentScreens.opportunities.emptyBody")}
            </p>
            <button
              onClick={() => {
                setMode("All");
                setType("All");
                setQuery("");
              }}
              className={`${paleButton} mt-4`}
              type="button"
            >
              {t("recruitment.studentScreens.common.clearFilters")}
            </button>
          </Panel>
        )}
      </div>
    </div>
  );
}

function FilterPill({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  const { t } = useTranslation();
  const filterTranslations: Record<string, string> = {
    All: "common.all",
    Active: "applications.active",
    Interview: "applications.interview",
    Completed: "applications.completed",
    Declined: "applications.declined",
    Opportunity: "notifications.newOpportunity",
    Profile: "notifications.profileViewed",
    Certificate: "notifications.certificateAdded",
    Score: "notifications.eligibilityUnlocked",
  };
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full px-3 py-1.5 text-[13px] font-medium transition ${active ? "bg-[#3B0454] text-white" : "bg-[#F1E5FA] text-[#453252] hover:bg-[#E6D7EF]"}`}
    >
      {typeof children === "string" && filterTranslations[children]
        ? t(`recruitment.studentScreens.${filterTranslations[children]}`)
        : children}
    </button>
  );
}

type DialogType = "interest" | "decline" | "accepted" | null;
function OpportunityDialog({
  type,
  item,
  onClose,
  onConfirm,
}: {
  type: Exclude<DialogType, null>;
  item: Opportunity;
  onClose: () => void;
  onConfirm: () => void;
}) {
  const { t } = useTranslation();
  const interested = type === "interest";
  const accepted = type === "accepted";
  if (accepted)
    return (
      <div
        className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4 backdrop-blur-[3px]"
        role="presentation"
      >
        <section
          aria-labelledby="opportunity-accepted-title"
          aria-modal="true"
          className="w-full max-w-[390px] rounded-[24px] bg-white px-6 py-7 text-center shadow-2xl"
          role="dialog"
        >
          <span className="mx-auto flex size-14 items-center justify-center rounded-full bg-[linear-gradient(135deg,#8850A1,#B978D0)] text-white">
            <Check className="size-7" />
          </span>
          <h2
            className="mt-3 text-[22px] font-bold text-[#20162A]"
            id="opportunity-accepted-title"
          >
            {t("recruitment.studentScreens.opportunityDetails.acceptedTitle")}</h2>
          <p className="mx-auto mt-1 max-w-[280px] text-[14px] leading-5 text-[#62596C]">
            {t("recruitment.studentScreens.opportunityDetails.acceptedBody", { company: item.company })}
          </p>
          <div className="mt-5 flex flex-col gap-2">
            <Link
              to={`${ROUTES.recruitment}/applications`}
              className={`${purpleButton} w-full`}
            >
              {t("recruitment.studentScreens.opportunityDetails.viewApplication")}</Link>
            <button
              className="min-h-9 text-[14px] font-medium text-[#51465B]"
              onClick={onClose}
              type="button"
            >
              {t("recruitment.studentScreens.opportunityDetails.stayHere")}</button>
          </div>
        </section>
      </div>
    );
  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4 backdrop-blur-[3px]"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <section
        aria-labelledby="opportunity-dialog-title"
        aria-modal="true"
        className="w-full max-w-[360px] rounded-[22px] bg-white p-5 text-center shadow-2xl"
        role="dialog"
      >
        <button
          className="float-right rounded-full p-1 text-[#766B7E] hover:bg-[#F4EFF7]"
          type="button"
          onClick={onClose}
          aria-label={t("recruitment.studentScreens.common.close")}
        >
          <X className="size-4" />
        </button>
        {interested ? (
          <span className="mx-auto mt-2 flex size-11 items-center justify-center rounded-xl bg-[#F1E5FA] text-[#56216E]">
            <CircleCheck className="size-5" />
          </span>
        ) : null}
        <h2
          className="mt-3 text-[18px] font-bold text-[#20162A]"
          id="opportunity-dialog-title"
        >
          {interested
            ? t("recruitment.studentScreens.opportunityDetails.interestTitle")
            : t("recruitment.studentScreens.opportunityDetails.declineTitle")}
        </h2>
        <p className="mx-auto mt-2 max-w-[290px] text-[13px] leading-4 text-[#62596C]">
          {interested
            ? t("recruitment.studentScreens.opportunityDetails.interestBody", { title: item.title, company: item.company })
            : t("recruitment.studentScreens.opportunityDetails.declineBody")}
        </p>
        <div className="mt-4 flex flex-col gap-2">
          {interested ? (
            <button
              className={`${purpleButton} w-full`}
              onClick={onConfirm}
              type="button"
            >
              {t("recruitment.studentScreens.opportunityDetails.confirmInterest")}</button>
          ) : (
            <button className={paleButton} onClick={onConfirm} type="button">
              {t("recruitment.studentScreens.opportunityDetails.yesDecline")}</button>
          )}
          <button
            className={interested ? paleButton : purpleButton}
            onClick={onClose}
            type="button"
          >
            {interested
              ? t("recruitment.studentScreens.opportunityDetails.cancel")
              : t("recruitment.studentScreens.opportunityDetails.keepConsidering")}
          </button>
        </div>
      </section>
    </div>
  );
}

export function StudentRecruitmentOpportunityDetails() {
  const { t } = useTranslation();
  const { opportunityId } = useParams();
  const item = opportunities.find(
    (opportunity) => opportunity.id === opportunityId,
  );
  const [dialog, setDialog] = useState<DialogType>(null);
  const [message, setMessage] = useState("");
  if (!item)
    return (
      <Panel className="mt-8 text-center">
        <h1 className="text-lg font-bold">{t("recruitment.studentScreens.opportunityDetails.notFound")}</h1>
        <Link
          className={`${paleButton} mt-4`}
          to={`${ROUTES.recruitment}/opportunities`}
        >
          {t("recruitment.studentScreens.opportunityDetails.back")}
        </Link>
      </Panel>
    );
  const respond = (action: Exclude<DialogType, null>) => {
    if (action === "accepted") {
      setDialog(null);
      return;
    }
    setDialog(action === "interest" ? "accepted" : null);
    setMessage(action === "decline" ? "You declined this opportunity." : "");
  };
  return (
    <div>
      <Link
        className="mb-3 inline-flex items-center gap-2 text-[13px] font-medium text-[#564B5F]"
        to={`${ROUTES.recruitment}/opportunities`}
      >
        <ArrowLeft className="size-3" />
        {t("recruitment.studentScreens.opportunityDetails.back")}
      </Link>
      <Panel className="mb-3">
        <div className="flex flex-wrap items-start gap-3">
          <span
            className="flex size-10 items-center justify-center rounded-xl text-sm font-bold text-white"
            style={{ backgroundColor: item.color }}
          >
            {item.company[0]}
          </span>
          <div className="min-w-0 flex-1">
            <h1 className="text-[22px] font-bold text-[#20162A]">
              {item.title}
            </h1>
            <p className="text-[14px] text-[#6C6175]">{item.company}</p>
          </div>
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          {[item.type, item.mode, item.location].map((label, i) => (
            <span key={label} className={tag}>
              {i === 2 ? <MapPin className="me-1 inline size-3" /> : null}
              {label}
            </span>
          ))}
        </div>
        <div className="mt-4 grid gap-2 sm:grid-cols-2">
          <div className="rounded-lg bg-[#F2E8F8] p-3">
            <p className="text-[12px] text-[#73667D]">{t("recruitment.studentScreens.opportunityDetails.companySize")}</p>
            <p className="mt-1 text-[13px] font-bold">{t(`recruitment.studentScreens.opportunityData.${({"novatech-frontend":"novatechFrontend", "designcraft-ui-ux":"designcraftUiux", "startupflow-product":"startupflowProduct", "cloudbase-react":"cloudbaseReact"} as Record<string,string>)[item.id]}.companySize`, {defaultValue:item.companySize})}</p>
          </div>
          <div className="rounded-lg bg-[#F2E8F8] p-3">
            <p className="text-[12px] text-[#73667D]">{t("recruitment.studentScreens.opportunityDetails.founded")}</p>
            <p className="mt-1 text-[13px] font-bold">{item.founded}</p>
          </div>
        </div>
      </Panel>
      <Panel className="mb-3" title={t("recruitment.studentScreens.opportunityDetails.description")}>
        <p className="text-[14px] leading-5 text-[#61576A]">
          {t(`recruitment.studentScreens.opportunityData.${({"novatech-frontend":"novatechFrontend", "designcraft-ui-ux":"designcraftUiux", "startupflow-product":"startupflowProduct", "cloudbase-react":"cloudbaseReact"} as Record<string,string>)[item.id]}.description`, {defaultValue:item.description})}
        </p>
      </Panel>
      <Panel className="mb-3" title={t("recruitment.studentScreens.opportunityDetails.responsibilities")}>
        <ul className="space-y-2">
          {item.responsibilities.map((line, i) => (
            <li
              key={line}
              className="flex gap-2 text-[13px] leading-4 text-[#554B5F]"
            >
              <span className="flex size-4 shrink-0 items-center justify-center rounded-full bg-[#F1E5FA] text-[10px] font-bold text-[#59236F]">
                {i + 1}
              </span>
              {t(`recruitment.studentScreens.opportunityData.${({"novatech-frontend":"novatechFrontend", "designcraft-ui-ux":"designcraftUiux", "startupflow-product":"startupflowProduct", "cloudbase-react":"cloudbaseReact"} as Record<string,string>)[item.id]}.responsibilities.${i}`, {defaultValue:line})}
            </li>
          ))}
        </ul>
      </Panel>
      <Panel className="mb-3" title={t("recruitment.studentScreens.opportunityDetails.requirements")}>
        <ul className="space-y-2">
          {item.requirements.map((line, i) => (
            <li
              key={line}
              className="flex gap-2 text-[13px] leading-4 text-[#554B5F]"
            >
              <Check className="size-3.5 shrink-0 text-[#54206B]" />
              {t(`recruitment.studentScreens.opportunityData.${({"novatech-frontend":"novatechFrontend", "designcraft-ui-ux":"designcraftUiux", "startupflow-product":"startupflowProduct", "cloudbase-react":"cloudbaseReact"} as Record<string,string>)[item.id]}.requirements.${i}`, {defaultValue:line})}
            </li>
          ))}
        </ul>
      </Panel>
      <Panel className="mb-3" title={t("recruitment.studentScreens.opportunityDetails.requiredSkills")}>
        <div className="flex flex-wrap gap-2">
          {item.skills.map((skill) => (
            <span
              key={skill}
              className="rounded-full bg-[#F1E5FA] px-3 py-1.5 text-[13px] font-semibold text-[#432455]"
            >
              {skill}
            </span>
          ))}
        </div>
      </Panel>
      <Panel className="mb-3" title={`About ${item.company}`}>
        <p className="text-[13px] leading-5 text-[#62596B]">
          {item.companyDescription}
        </p>
      </Panel>
      {message ? (
        <div
          className="mb-3 flex items-center gap-2 rounded-xl border border-[#B8EFCF] bg-[#E0F9EA] px-4 py-3 text-[13px] font-semibold text-[#087544]"
          role="status"
        >
          <CheckCircle2 className="size-4" />
          {message}
          <button
            className="ms-auto"
            onClick={() => setMessage("")}
            type="button"
            aria-label={t("recruitment.studentScreens.common.dismiss")}
          >
            <X className="size-3.5" />
          </button>
        </div>
      ) : null}
      <div className="sticky bottom-2 flex gap-2">
        <button
          className={`${purpleButton} flex-1`}
          onClick={() => setDialog("interest")}
          type="button"
        >
          {t("recruitment.studentScreens.opportunityDetails.accept")}</button>
        <button
          className={`${card} min-h-10 px-4 text-[14px] font-semibold text-[#4D4158] hover:bg-[#F8F4FA]`}
          onClick={() => setDialog("decline")}
          type="button"
        >
          {t("recruitment.studentScreens.opportunityDetails.decline")}</button>
      </div>
      {dialog ? (
        <OpportunityDialog
          type={dialog}
          item={item}
          onClose={() => setDialog(null)}
          onConfirm={() => respond(dialog)}
        />
      ) : null}
    </div>
  );
}

type ApplicationState =
  | "Interview Scheduled"
  | "Profile Viewed"
  | "Applied"
  | "Declined"
  | "Completed";
type StudentApplication = {
  id: string;
  title: string;
  company: string;
  initials: string;
  color: string;
  state: ApplicationState;
  applied: string;
  type: string;
  mode: string;
};
const studentApplications: StudentApplication[] = [
  {
    id: "designcraft-ui-ux",
    title: "UI/UX Designer",
    company: "DesignCraft Agency",
    initials: "D",
    color: "#0796B4",
    state: "Interview Scheduled",
    applied: "Oct 14, 2024",
    type: "Internship",
    mode: "Hybrid",
  },
  {
    id: "novatech-frontend",
    title: "Frontend Developer",
    company: "NovaTech Solutions",
    initials: "N",
    color: "#3B0454",
    state: "Profile Viewed",
    applied: "Oct 10, 2024",
    type: "Full-time",
    mode: "Remote",
  },
  {
    id: "startupflow-product",
    title: "Product Designer",
    company: "StartupFlow",
    initials: "S",
    color: "#0A9D72",
    state: "Applied",
    applied: "Oct 5, 2024",
    type: "Part-time",
    mode: "Remote",
  },
  {
    id: "cloudbase-react",
    title: "React Developer",
    company: "CloudBase Inc.",
    initials: "C",
    color: "#E67B00",
    state: "Declined",
    applied: "Sep 28, 2024",
    type: "Internship",
    mode: "On-site",
  },
];
type ApplicationFilter =
  | "All"
  | "Active"
  | "Interview"
  | "Completed"
  | "Declined";

export function StudentRecruitmentApplications() {
  const { t } = useTranslation();
  const [filter, setFilter] = useState<ApplicationFilter>("All");
  const [search, setSearch] = useState("");
  const visible = studentApplications.filter((application) => {
    const matchesFilter =
      filter === "All" ||
      (filter === "Active" &&
        !["Declined", "Completed"].includes(application.state)) ||
      (filter === "Interview" && application.state === "Interview Scheduled") ||
      application.state === filter;
    return (
      matchesFilter &&
      `${application.title} ${application.company}`
        .toLowerCase()
        .includes(search.toLowerCase())
    );
  });
  const filters: ApplicationFilter[] = [
    "All",
    "Active",
    "Interview",
    "Completed",
    "Declined",
  ];
  const applicationStateKey: Record<string, string> = {
    Applied: "applicationDetails.applied",
    "Profile Viewed": "applicationDetails.profileViewed",
    "Interview Scheduled": "applicationDetails.interviewConfirmed",
    Completed: "applications.completed",
    Declined: "applications.declined",
  };
  return (
    <div>
      <div className="mb-3 max-w-[390px] rounded-full border border-[#EAE4EE] bg-white px-4 shadow-sm">
        <label className="flex h-10 items-center gap-2">
          <Search className="size-4 text-[#756A7E]" />
          <input
            aria-label="Search applications"
            className="w-full bg-transparent text-[14px] outline-none placeholder:text-[#92889A]"
            placeholder={t("recruitment.studentScreens.common.searchApplications")}
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </label>
      </div>
      <PageTitle
        title={t("recruitment.studentScreens.applications.title")}
        subtitle="Track your recruitment interactions."
      />
      <div className="mb-4 flex flex-wrap gap-2">
        {filters.map((item) => (
          <FilterPill
            key={item}
            active={filter === item}
            onClick={() => setFilter(item)}
          >
            {item}
          </FilterPill>
        ))}
      </div>
      {visible.length ? (
        <div className="space-y-3">
          {visible.map((application) => (
            <article
              className={`${card} flex flex-col justify-between gap-3 p-4 sm:flex-row sm:items-center`}
              key={application.id}
            >
              <div className="flex items-start gap-3">
                <span
                  className="flex size-10 shrink-0 items-center justify-center rounded-xl text-sm font-bold text-white"
                  style={{ background: application.color }}
                >
                  {application.initials}
                </span>
                <div>
                  <h2 className="text-[15px] font-bold">{application.title}</h2>
                  <p className="mt-0.5 text-[13px] text-[#6A5F72]">
                    {application.company}
                  </p>
                  <p className="mt-2 text-[13px] text-[#6A5F72]">
                    {t("recruitment.studentScreens.applications.applied", { date: application.applied })}
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-between gap-3 sm:flex-col sm:items-end">
                <span
                  className={`rounded-full px-3 py-1 text-[12px] font-semibold ${application.state === "Interview Scheduled" ? "bg-[#E3EAFE] text-[#45326D]" : application.state === "Declined" ? "bg-[#FDE4E2] text-[#B12B2B]" : application.state === "Profile Viewed" ? "bg-[#FFF1C9] text-[#935A00]" : "bg-[#F1E5FA] text-[#54206C]"}`}
                >
                  {t(`recruitment.studentScreens.${applicationStateKey[application.state] ?? "applications.active"}`)}
                </span>
                <Link
                  to={`${ROUTES.recruitment}/applications/${application.id}`}
                  className="text-[13px] font-semibold text-[#3B0454]"
                >
                  {t("recruitment.studentScreens.applications.viewApplication")}<ArrowRight className="inline size-3" />
                </Link>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <section
          className={`${card} flex min-h-[360px] flex-col items-center justify-center p-8 text-center`}
        >
          <span className="flex size-14 items-center justify-center rounded-xl bg-[#F1E5FA] text-[#4B245F]">
            <Inbox className="size-6" />
          </span>
          <h2 className="mt-3 text-[18px] font-bold">
            {search ? t("recruitment.studentScreens.applications.noMatches") : t("recruitment.studentScreens.applications.noneYet")}
          </h2>
          <p className="mt-1 text-[14px] text-[#62596C]">
            {search
              ? t("recruitment.studentScreens.applications.searchHint")
              : t("recruitment.studentScreens.applications.emptyHint")}
          </p>
          <Link
            to={`${ROUTES.recruitment}/opportunities`}
            className={`${purpleButton} mt-4`}
          >
            {t("recruitment.studentScreens.dashboard.browseOpportunities")}</Link>
        </section>
      )}
    </div>
  );
}

export function StudentRecruitmentApplicationDetails() {
  const { t } = useTranslation();
  const [outcome, setOutcome] = useState<'declined' | 'selected' | 'not_selected'>('declined');

  const configs = {
    declined: {
      badge: 'Declined',
      badgeClass: 'bg-[#FEE2E2] text-[#DC2626]',
      heading: 'Application declined',
      calloutBg: 'border-[#FECACA] bg-[#FEF2F2]',
      calloutIconBg: 'bg-[#FEE2E2] text-[#DC2626]',
      calloutIcon: '!',
      calloutTitle: 'Application declined',
      calloutBody: 'DesignCraft Agency has closed this application. Thank you for the time and care you put into applying.',
      nextText: 'Review other applications or speak with your mentor before applying again.',
      actionLabel: 'Back to My Applications',
      actionTo: `${ROUTES.recruitment}/applications`,
    },
    selected: {
      badge: 'Selected',
      badgeClass: 'bg-[#DCFCE7] text-[#16A34A]',
      heading: 'You have been selected',
      calloutBg: 'border-[#BBF7D0] bg-[#F0FDF4]',
      calloutIconBg: 'bg-[#DCFCE7] text-[#16A34A]',
      calloutIcon: '✓',
      calloutTitle: 'You have been selected',
      calloutBody: 'DesignCraft Agency would like to move forward. Review and sign the liability agreement to continue.',
      nextText: 'The placement is not complete yet. Both parties must sign the agreement and the required completion process must be satisfied.',
      actionLabel: 'Continue to agreement',
      actionTo: `${ROUTES.recruitment}/agreements`,
    },
    not_selected: {
      badge: 'Not selected',
      badgeClass: 'bg-[#F1F5F9] text-[#64748B]',
      heading: 'Not selected for this opportunity',
      calloutBg: 'border-[#E2E8F0] bg-[#F8FAFC]',
      calloutIconBg: 'bg-[#E2E8F0] text-[#64748B]',
      calloutIcon: 'i',
      calloutTitle: 'Not selected for this opportunity',
      calloutBody: 'Another candidate was selected after the completed review. Your profile remains active for future opportunities.',
      nextText: 'Explore matched opportunities and use this experience to strengthen your next application.',
      actionLabel: 'Explore Opportunities',
      actionTo: `${ROUTES.recruitment}/opportunities`,
    },
  };

  const current = configs[outcome];

  return (
    <div>
      {/* Top Bar / Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-[11px] font-bold tracking-[1.5px] text-[#7C3AED] uppercase">
            {t('recruitment.shell.brandName', 'RECRUITMENT')}
          </p>
          <h1 className="mt-1 text-[26px] font-bold tracking-[-0.02em] text-[#111827] sm:text-[30px]">
            {current.heading}
          </h1>
          <p className="mt-1 text-[14px] text-[#64748B]">
            Application details and next steps.
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          {/* Outcome state selector for easy testing */}
          <div className="hidden items-center rounded-full border border-[#D8C6E8] bg-white p-1 text-[11px] font-semibold sm:flex">
            <button
              type="button"
              onClick={() => setOutcome('declined')}
              className={`rounded-full px-2.5 py-1 transition ${outcome === 'declined' ? 'bg-[#3B0454] text-white' : 'text-[#64748B]'}`}
            >
              Declined
            </button>
            <button
              type="button"
              onClick={() => setOutcome('selected')}
              className={`rounded-full px-2.5 py-1 transition ${outcome === 'selected' ? 'bg-[#3B0454] text-white' : 'text-[#64748B]'}`}
            >
              Selected
            </button>
            <button
              type="button"
              onClick={() => setOutcome('not_selected')}
              className={`rounded-full px-2.5 py-1 transition ${outcome === 'not_selected' ? 'bg-[#3B0454] text-white' : 'text-[#64748B]'}`}
            >
              Not Selected
            </button>
          </div>
          <span className={`inline-flex min-h-[28px] items-center justify-center rounded-full px-4 text-[12px] font-bold ${current.badgeClass}`}>
            {current.badge}
          </span>
        </div>
      </div>

      {/* Opportunity Card */}
      <section className="mt-6 flex flex-col gap-4 rounded-[22px] border border-white/80 bg-white p-5 shadow-[0_12px_28px_-16px_rgba(49,18,67,0.12)] sm:flex-row sm:items-center">
        <div className="flex size-13 shrink-0 items-center justify-center rounded-[16px] bg-[linear-gradient(145deg,#0891B2_0%,#22B8CF_100%)] text-[18px] font-bold text-white shadow-sm">
          D
        </div>
        <div className="min-w-0 flex-1">
          <h2 className="text-[17px] font-bold text-[#111827]">UI/UX Designer</h2>
          <p className="mt-0.5 text-[14px] text-[#64748B]">DesignCraft Agency · Alexandria</p>
          <p className="mt-1 text-[13px] text-[#64748B]">
            UI/UX Designer · Internship · Hybrid · 3 months · starts Nov 1, 2026
          </p>
        </div>
      </section>

      {/* Outcome Callout Box */}
      <section className={`mt-5 flex items-start gap-4 rounded-[20px] border p-5 ${current.calloutBg}`}>
        <span className={`flex size-8 shrink-0 items-center justify-center rounded-full text-[14px] font-bold ${current.calloutIconBg}`}>
          {current.calloutIcon}
        </span>
        <div>
          <h2 className="text-[16px] font-bold text-[#111827]">{current.calloutTitle}</h2>
          <p className="mt-1 text-[14px] leading-relaxed text-[#4B5563]">{current.calloutBody}</p>
        </div>
      </section>

      {/* Application Timeline Card */}
      <section className="mt-5 rounded-[22px] border border-white/80 bg-white p-6 shadow-[0_12px_28px_-16px_rgba(49,18,67,0.12)]">
        <h2 className="text-[16px] font-bold text-[#111827]">Application timeline</h2>

        <div className="mt-6 overflow-x-auto pb-2">
          <div className="flex min-w-[620px] items-center justify-between">
            {/* Step 1: Applied */}
            <div className="flex flex-col items-center text-center">
              <span className="flex size-7 items-center justify-center rounded-full bg-[#7C3AED] text-[12px] font-bold text-white shadow-sm">
                ✓
              </span>
              <span className="mt-2 text-[12px] font-medium text-[#7C3AED]">Applied</span>
            </div>

            <div className="h-0.5 flex-1 bg-[#7C3AED]" />

            {/* Step 2: Profile Viewed */}
            <div className="flex flex-col items-center text-center">
              <span className="flex size-7 items-center justify-center rounded-full bg-[#7C3AED] text-[12px] font-bold text-white shadow-sm">
                ✓
              </span>
              <span className="mt-2 text-[12px] font-medium text-[#7C3AED]">Profile Viewed</span>
            </div>

            <div className="h-0.5 flex-1 bg-[#7C3AED]" />

            {/* Step 3: Interview */}
            <div className="flex flex-col items-center text-center">
              <span className="flex size-7 items-center justify-center rounded-full bg-[#7C3AED] text-[12px] font-bold text-white shadow-sm">
                ✓
              </span>
              <span className="mt-2 text-[12px] font-medium text-[#7C3AED]">Interview</span>
            </div>

            <div className="h-0.5 flex-1 bg-[#7C3AED]" />

            {/* Step 4: Employer Decision */}
            <div className="flex flex-col items-center text-center">
              <span className="flex size-7 items-center justify-center rounded-full bg-[#7C3AED] text-[12px] font-bold text-white shadow-sm">
                4
              </span>
              <span className="mt-2 text-[12px] font-semibold text-[#7C3AED]">Employer Decision</span>
            </div>

            <div className="h-0.5 flex-1 bg-[#E2E8F0]" />

            {/* Step 5: Agreement */}
            <div className="flex flex-col items-center text-center">
              <span className="flex size-7 items-center justify-center rounded-full border border-[#CBD5E1] bg-white text-[12px] font-medium text-[#94A3B8]">
                5
              </span>
              <span className="mt-2 text-[12px] font-medium text-[#94A3B8]">Agreement</span>
            </div>

            <div className="h-0.5 flex-1 bg-[#E2E8F0]" />

            {/* Step 6: Completed */}
            <div className="flex flex-col items-center text-center">
              <span className="flex size-7 items-center justify-center rounded-full border border-[#CBD5E1] bg-white text-[12px] font-medium text-[#94A3B8]">
                6
              </span>
              <span className="mt-2 text-[12px] font-medium text-[#94A3B8]">Completed</span>
            </div>
          </div>
        </div>
      </section>

      {/* Next Steps Card */}
      <section className="mt-5 flex flex-col gap-4 rounded-[22px] border border-white/80 bg-white p-5 shadow-[0_12px_28px_-16px_rgba(49,18,67,0.12)] sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0 flex-1">
          <h2 className="text-[16px] font-bold text-[#111827]">Next steps</h2>
          <p className="mt-1 text-[14px] text-[#64748B]">{current.nextText}</p>
        </div>
        <Link
          to={current.actionTo}
          className="inline-flex min-h-[44px] shrink-0 items-center justify-center rounded-full bg-[linear-gradient(135deg,#7C3AED_0%,#9333EA_100%)] px-6 text-[14px] font-semibold text-white shadow-[0_6px_18px_rgba(124,58,237,0.25)] transition hover:brightness-110"
        >
          {current.actionLabel}
        </Link>
      </section>
    </div>
  );
}


export function StudentRecruitmentInterview() {
  const { t } = useTranslation();
  const [added, setAdded] = useState(false);
  const downloadCalendar = () => {
    const calendar = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "BEGIN:VEVENT",
      "DTSTART:20260928T140000",
      "DTEND:20260928T144500",
      "SUMMARY:UI/UX Designer interview - DesignCraft Agency",
      "DESCRIPTION:Online interview. Meeting link will be shared one hour before.",
      "END:VEVENT",
      "END:VCALENDAR",
    ].join("\r\n");
    const url = URL.createObjectURL(
      new Blob([calendar], { type: "text/calendar" }),
    );
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "designcraft-interview.ics";
    anchor.click();
    URL.revokeObjectURL(url);
    setAdded(true);
  };
  return (
    <div>
      <PageTitle
        title={t("recruitment.studentScreens.interview.title")}
        subtitle={t("recruitment.studentScreens.interview.subtitle")}
      />
      <div className="mb-4 flex items-center justify-between gap-3 rounded-xl border border-[#D6BFE3] bg-[#F1E5FA] p-4">
        <div className="flex items-center gap-3">
          <span className="flex size-10 items-center justify-center rounded-xl bg-[#B272D0] text-white">
            <CalendarDays className="size-5" />
          </span>
          <div>
            <h2 className="text-[14px] font-bold">{t("recruitment.studentScreens.interview.scheduled")}</h2>
            <p className="text-[13px] text-[#655A6D]">
              {t("recruitment.studentScreens.interview.confirmedBody")}</p>
          </div>
        </div>
        <span className="rounded-full bg-[#E3EAFE] px-3 py-1 text-[12px] font-semibold text-[#4C326D]">
          {t("recruitment.studentScreens.interview.confirmed")}</span>
      </div>
      <Panel className="mb-4">
        <div className="flex items-center gap-3 border-b border-[#E9DDF0] pb-4">
          <span className="flex size-10 items-center justify-center rounded-xl bg-[#0796B4] text-[16px] font-bold text-white">
            D
          </span>
          <div>
            <h2 className="text-[15px] font-bold">{t("recruitment.studentScreens.profile.role")}</h2>
            <p className="text-[14px] text-[#62596C]">DesignCraft Agency</p>
          </div>
        </div>
        <div className="grid gap-3 py-4 sm:grid-cols-2">
          <InterviewInfo
            icon={<CalendarDays />}
            label={t("recruitment.studentScreens.interview.date")}
            value={t("recruitment.studentScreens.interview.dateValue")}
          />
          <InterviewInfo icon={<Clock3 />} label={t("recruitment.studentScreens.interview.time")} value={t("recruitment.studentScreens.interview.timeValue")} />
          <InterviewInfo
            icon={<Video />}
            label={t("recruitment.studentScreens.interview.type")}
            value={t("recruitment.studentScreens.interview.typeValue")}
          />
          <InterviewInfo
            icon={<Clock3 />}
            label={t("recruitment.studentScreens.interview.duration")}
            value={t("recruitment.studentScreens.interview.durationValue")}
          />
        </div>
        <div className="flex items-center gap-3 rounded-xl bg-[#F1E5FA] p-3">
          <Video className="size-4 text-[#4B1D61]" />
          <div>
            <p className="text-[13px] font-semibold">
              {t("recruitment.studentScreens.interview.meetingLinkTitle")}</p>
            <p className="text-[12px] text-[#62596C]">
              {t("recruitment.studentScreens.interview.meetingLink")}</p>
          </div>
        </div>
      </Panel>
      <Panel title={t("recruitment.studentScreens.interview.preparationTips")}>
        <ol className="space-y-2">
          {[
            t("recruitment.studentScreens.interview.tipOne"),
            t("recruitment.studentScreens.interview.tipTwo"),
            t("recruitment.studentScreens.interview.tipThree"),
            t("recruitment.studentScreens.interview.tipFour"),
            t("recruitment.studentScreens.interview.tipFive"),
          ].map((tip, index) => (
            <li
              key={tip}
              className="flex items-center gap-2 text-[13px] text-[#51465B]"
            >
              <span className="flex size-4 items-center justify-center rounded-full bg-[#F1E5FA] text-[10px] font-bold text-[#3B0454]">
                {index + 1}
              </span>
              {tip}
            </li>
          ))}
        </ol>
      </Panel>
      <div className="mt-4 flex gap-2">
        <Link
          to={`${ROUTES.recruitment}/applications/designcraft-ui-ux`}
          className={`${purpleButton} flex-1`}
        >
          {t("recruitment.studentScreens.applications.viewApplication")}</Link>
        <button type="button" className={paleButton} onClick={downloadCalendar}>
          <CalendarCheck className="size-3.5" />
          {added ? t("recruitment.studentScreens.interview.addedToCalendar") : t("recruitment.studentScreens.interview.addToCalendar")}
        </button>
      </div>
    </div>
  );
}

function InterviewInfo({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl bg-[#F1E5FA] p-3">
      <p className="flex items-center gap-1.5 text-[12px] text-[#6F637A]">
        {icon}
        {label}
      </p>
      <p className="mt-1 text-[14px] font-bold">{value}</p>
    </div>
  );
}

export function StudentRecruitmentAgreement() {
  const { t } = useTranslation();

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-[11px] font-bold tracking-[1.5px] text-[#7C3AED] uppercase">
            {t('recruitment.shell.brandName', 'RECRUITMENT')}
          </p>
          <h1 className="mt-1 text-[26px] font-bold tracking-[-0.02em] text-[#111827] sm:text-[30px]">
            Liability agreement
          </h1>
          <p className="mt-1 text-[14px] text-[#64748B]">
            Track signatures before the partner project can begin.
          </p>
        </div>
        <div className="shrink-0 pt-1">
          <span className="inline-flex min-h-[28px] items-center justify-center rounded-full bg-[#FEF3C7] px-4 text-[12px] font-bold text-[#B45309]">
            Waiting for employer signature
          </span>
        </div>
      </div>

      {/* Job & Candidate Card */}
      <section className="mt-6 flex flex-col gap-4 rounded-[22px] border border-white/80 bg-white p-5 shadow-[0_12px_28px_-16px_rgba(49,18,67,0.12)] sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4 min-w-0">
          <div className="flex size-13 shrink-0 items-center justify-center rounded-[16px] bg-[linear-gradient(145deg,#0891B2_0%,#22B8CF_100%)] text-[18px] font-bold text-white shadow-sm">
            D
          </div>
          <div className="min-w-0 flex-1">
            <h2 className="text-[17px] font-bold text-[#111827]">UI/UX Designer</h2>
            <p className="mt-0.5 text-[14px] text-[#64748B]">DesignCraft Agency · Alexandria</p>
            <p className="mt-1 text-[13px] text-[#64748B]">
              UI/UX Designer · Internship · Hybrid · 3 months · starts Nov 1, 2026
            </p>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-3 border-t border-[#E9DCF8] pt-3 sm:border-s sm:border-t-0 sm:ps-5 sm:pt-0">
          <span className="flex size-10 items-center justify-center rounded-full bg-[linear-gradient(135deg,#925DA8_0%,#C592FB_100%)] text-[13px] font-bold text-white shadow-sm">
            MA
          </span>
          <div className="flex flex-col">
            <span className="text-[14px] font-bold text-[#111827]">Merna Adel</span>
            <span className="text-[12px] text-[#64748B]">87% · Cohort 12</span>
          </div>
        </div>
      </section>

      {/* Signature Progress Card */}
      <section className="mt-5 rounded-[22px] border border-white/80 bg-white p-6 shadow-[0_12px_28px_-16px_rgba(49,18,67,0.12)]">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-[11px] font-bold tracking-[1.4px] text-[#7C3AED] uppercase">
              SIGNATURE PROGRESS
            </p>
            <h2 className="mt-1 text-[20px] font-bold text-[#111827]">One signature remaining</h2>
          </div>
          <p className="text-[13px] font-medium text-[#64748B]">1 of 2 complete</p>
        </div>

        <div className="mt-5 space-y-3">
          {/* Merna Adel row */}
          <div className="flex min-h-[64px] items-center gap-3.5 rounded-[16px] bg-[#FAF7FD] px-4 py-3 sm:px-5">
            <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-[#DCFCE7] text-[13px] font-bold text-[#16A34A]">
              ✓
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-[14px] font-bold text-[#111827]">Merna Adel</p>
              <p className="mt-0.5 text-[12px] text-[#64748B]">Student · Signed Oct 28, 2026</p>
            </div>
            <span className="inline-flex min-h-[26px] items-center justify-center rounded-full bg-[#DCFCE7] px-3.5 text-[12px] font-semibold text-[#15803D]">
              Signed
            </span>
          </div>

          {/* DesignCraft Agency row */}
          <div className="flex min-h-[64px] items-center gap-3.5 rounded-[16px] bg-[#FAF7FD] px-4 py-3 sm:px-5">
            <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-[#FEF3C7] text-[13px] font-bold text-[#D97706]">
              —
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-[14px] font-bold text-[#111827]">DesignCraft Agency</p>
              <p className="mt-0.5 text-[12px] text-[#64748B]">Employer · Signature requested</p>
            </div>
            <span className="inline-flex min-h-[26px] items-center justify-center rounded-full bg-[#FEF3C7] px-3.5 text-[12px] font-semibold text-[#B45309]">
              Pending
            </span>
          </div>
        </div>
      </section>

      {/* Legal Notice Card */}
      <section className="mt-5 flex items-start gap-4 rounded-[22px] border border-white/80 bg-white p-6 shadow-[0_12px_28px_-16px_rgba(49,18,67,0.12)]">
        <div className="w-1 self-stretch rounded-full bg-[#8B5CF6]" />
        <div>
          <span className="inline-flex items-center rounded-full bg-[#F3F4F6] px-2.5 py-0.5 text-[11px] font-semibold text-[#4B5563]">
            Legal notice
          </span>
          <h2 className="mt-2 text-[16px] font-bold text-[#111827]">Agreement text pending legal approval</h2>
          <p className="mt-1 text-[13px] leading-relaxed text-[#64748B]">
            No legal terms are displayed until approved wording is available.
          </p>
        </div>
      </section>

      {/* Project start is blocked Callout Box */}
      <section className="mt-5 rounded-[22px] border border-[#FDE68A] bg-[#FFFBEB] p-5 sm:p-6 text-[#92400E]">
        <h2 className="text-[16px] font-bold text-[#92400E]">Project start is blocked</h2>
        <p className="mt-1 text-[13px] leading-relaxed text-[#B45309]">
          The real partner project cannot start until both Merna Adel and DesignCraft Agency have signed.
        </p>
      </section>
    </div>
  );
}


type NotificationCategory =
  | "Opportunity"
  | "Interview"
  | "Profile"
  | "Certificate"
  | "Score";
type StudentNotification = {
  id: string;
  category: NotificationCategory;
  title: string;
  body: string;
  detail: string;
  time: string;
  unread: boolean;
  action: string;
  href: string;
};
const initialNotifications: StudentNotification[] = [
  {
    id: "opp",
    category: "Opportunity",
    title: "New Opportunity",
    body: "NovaTech Solutions expressed interest in your profile.",
    detail: "Frontend Developer · Remote · Full-time",
    time: "2 hours ago",
    unread: true,
    action: "View Opportunity",
    href: `${ROUTES.recruitment}/opportunities/novatech-frontend`,
  },
  {
    id: "interview",
    category: "Interview",
    title: "Interview Scheduled",
    body: "Your interview with DesignCraft Agency has been confirmed.",
    detail: "Sep 28, 2026 at 2:00 PM · Online Interview",
    time: "5 hours ago",
    unread: true,
    action: "View Interview",
    href: `${ROUTES.recruitment}/interview`,
  },
  {
    id: "profile",
    category: "Profile",
    title: "Profile Viewed",
    body: "An employer viewed your Talent Profile.",
    detail: "NovaTech Solutions · Today at 10:42 AM",
    time: "Yesterday",
    unread: false,
    action: "View Profile",
    href: `${ROUTES.recruitment}/profile`,
  },
  {
    id: "certificate",
    category: "Certificate",
    title: "Certificate Added",
    body: "Your React Advanced Patterns certificate has been added to your profile.",
    detail: "InternsHub Academy · Certificate ID: IH-2026-0441",
    time: "3 days ago",
    unread: false,
    action: "View Profile",
    href: `${ROUTES.recruitment}/profile`,
  },
  {
    id: "score",
    category: "Score",
    title: "Eligibility Unlocked",
    body: "Congratulations! Your Composite Score reached 87%. You are now visible to employers.",
    detail: "Composite Score: 87% · Threshold: 80%",
    time: "1 week ago",
    unread: false,
    action: "View Eligibility",
    href: `${ROUTES.recruitment}/eligibility`,
  },
];
const notificationTone: Record<NotificationCategory, string> = {
  Opportunity: "text-[#4B1D61] bg-[#F1E5FA]",
  Interview: "text-[#0785A2] bg-[#E4F6FA]",
  Profile: "text-[#07946B] bg-[#E3F7EF]",
  Certificate: "text-[#D47A00] bg-[#FFF4E4]",
  Score: "text-[#4B1D61] bg-[#F1E5FA]",
};

export function StudentRecruitmentNotifications() {
  const { t } = useTranslation();
  const [items, setItems] = useState(initialNotifications);
  const [category, setCategory] = useState<"All" | NotificationCategory>("All");
  const [query, setQuery] = useState("");
  const unread = items.filter((item) => item.unread).length;
  const visible = items.filter(
    (item) =>
      (category === "All" || item.category === category) &&
      `${item.title} ${item.body} ${item.detail}`
        .toLowerCase()
        .includes(query.toLowerCase()),
  );
  const markRead = (id: string) =>
    setItems((current) =>
      current.map((item) =>
        item.id === id ? { ...item, unread: false } : item,
      ),
    );
  const categories: Array<"All" | NotificationCategory> = [
    "All",
    "Opportunity",
    "Interview",
    "Profile",
    "Certificate",
    "Score",
  ];
  const toneAction: Record<NotificationCategory, string> = {
    Opportunity: "text-[#4B1D61]",
    Interview: "text-[#0785A2]",
    Profile: "text-[#07946B]",
    Certificate: "text-[#D47A00]",
    Score: "text-[#4B1D61]",
  };
  const notificationCopy: Record<string, { title: string; body: string; detail: string; action: string; time: string }> = {
    opportunity: { title: "newOpportunity", body: "opportunityBody", detail: "opportunityDetail", action: "viewOpportunity", time: "twoHours" },
    interview: { title: "scheduled", body: "interviewBody", detail: "interviewDetail", action: "viewInterview", time: "fiveHours" },
    profile: { title: "profileViewed", body: "profileBody", detail: "profileDetail", action: "viewProfile", time: "yesterday" },
    certificate: { title: "certificateAdded", body: "certificateBody", detail: "certificateDetail", action: "viewProfile", time: "threeDays" },
    score: { title: "eligibilityUnlocked", body: "eligibilityBody", detail: "eligibilityDetail", action: "viewEligibility", time: "oneWeek" },
  };
  return (
    <div>
      <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
        <div className="max-w-[390px] flex-1 rounded-full border border-[#EAE4EE] bg-white px-4 shadow-sm">
          <label className="flex h-10 items-center gap-2">
            <Search className="size-4 text-[#756A7E]" />
            <input
              aria-label="Search notifications"
              className="w-full bg-transparent text-[14px] outline-none placeholder:text-[#92889A]"
              placeholder={t("recruitment.studentScreens.common.searchNotifications")}
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
          </label>
        </div>
        <button
          className="text-[13px] font-semibold text-[#3B0454]"
          type="button"
          onClick={() =>
            setItems((current) =>
              current.map((item) => ({ ...item, unread: false })),
            )
          }
        >
          <Check className="me-1 inline size-3" />
          {t("recruitment.studentScreens.notifications.markAllRead")}</button>
      </div>
      <PageTitle
        title={t("recruitment.studentScreens.notifications.title")}
        subtitle={t("recruitment.studentScreens.notifications.subtitle", { unread, total: items.length })}
      />
      <div className="mb-4 flex flex-wrap gap-2">
        {categories.map((item) => (
          <FilterPill
            key={item}
            active={category === item}
            onClick={() => setCategory(item)}
          >
            {item}
          </FilterPill>
        ))}
      </div>
      {visible.length ? (
        <div className="space-y-3">
          {visible.map((item) => (
            <article key={item.id} className={`${card} overflow-hidden`}>
              <div className="flex items-start gap-3 p-4">
                <span
                  className={`flex size-10 shrink-0 items-center justify-center rounded-xl ${notificationTone[item.category]}`}
                >
                  {item.category === "Opportunity" ? (
                    <BriefcaseBusiness className="size-4" />
                  ) : item.category === "Interview" ? (
                    <CalendarDays className="size-4" />
                  ) : item.category === "Profile" ? (
                    <Eye className="size-4" />
                  ) : item.category === "Certificate" ? (
                    <FileBadge2 className="size-4" />
                  ) : (
                    <Star className="size-4" />
                  )}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={`rounded-full px-2 py-0.5 text-[12px] font-semibold ${notificationTone[item.category]}`}
                    >
                      {t(`recruitment.studentScreens.notifications.${notificationCopy[item.category.toLowerCase()].title}`)}
                    </span>
                    {item.unread ? (
                      <span
                        className="size-1.5 rounded-full bg-[#5B1778]"
                        aria-label={t("recruitment.studentScreens.notifications.unread")}
                      />
                    ) : null}
                  </div>
                  <h2 className="mt-1 text-[14px] font-bold">{t(`recruitment.studentScreens.notifications.${notificationCopy[item.category.toLowerCase()].title}`)}</h2>
                  <p className="mt-0.5 text-[13px] leading-4 text-[#51465B]">
                    {t(`recruitment.studentScreens.notifications.${notificationCopy[item.category.toLowerCase()].body}`)}
                  </p>
                  <p className="mt-1 text-[12px] text-[#6F637A]">
                    {t(`recruitment.studentScreens.notifications.${notificationCopy[item.category.toLowerCase()].detail}`)}
                  </p>
                </div>
                <span className="shrink-0 text-[12px] text-[#62596C]">
                  {t(`recruitment.studentScreens.notifications.${notificationCopy[item.category.toLowerCase()].time}`)}
                </span>
              </div>
              <div className="flex items-center justify-between gap-3 bg-[#F1E5FA] px-4 py-2.5">
                <Link
                  onClick={() => markRead(item.id)}
                  to={item.href}
                  className={`text-[13px] font-semibold ${toneAction[item.category]}`}
                >
                  {t(`recruitment.studentScreens.notifications.${notificationCopy[item.category.toLowerCase()].action}`)} <ChevronRight className="inline size-3 rtl:rotate-180" />
                </Link>
                {item.unread ? (
                  <button
                    type="button"
                    onClick={() => markRead(item.id)}
                    className="text-[12px] text-[#62596C]"
                  >
                    {t("recruitment.studentScreens.common.markRead")}</button>
                ) : (
                  <span className="text-[12px] text-[#8A7F91]">{t("recruitment.studentScreens.common.read")}</span>
                )}
              </div>
            </article>
          ))}
        </div>
      ) : (
        <Panel className="py-12 text-center">
          <Bell className="mx-auto size-7 text-[#9467A7]" />
          <h2 className="mt-3 text-sm font-bold">{t("recruitment.studentScreens.notifications.emptyTitle")}</h2>
          <p className="mt-1 text-[14px] text-[#766B7E]">
            {t("recruitment.studentScreens.notifications.emptyBody")}</p>
        </Panel>
      )}
    </div>
  );
}

export function StudentRecruitmentCompletion() {
  const { t } = useTranslation();
  return (
    <div>
      <Panel className="mb-4 px-5 py-8 sm:px-8 sm:py-10">
        <div className="mx-auto max-w-[760px] text-center">
          <span className="mx-auto flex size-[64px] items-center justify-center rounded-full bg-[linear-gradient(135deg,#8E51A5,#BB7ADA)] text-white">
            <CheckCircle2 className="size-8" />
          </span>
          <h1 className="mt-4 text-[28px] font-bold">{t("recruitment.studentScreens.completion.title")}</h1>
          <p className="mx-auto mt-2 max-w-[540px] text-[14px] leading-5 text-[#62596C]">
            {t("recruitment.studentScreens.completion.body")}</p>
        </div>
        <section className="mt-6 rounded-2xl bg-[#F1E5FA] p-4 sm:p-5">
          <h2 className="mb-3 text-[15px] font-bold">{t("recruitment.studentScreens.completion.summary")}</h2>
          <div className="space-y-3">
            <SummaryRow
              icon={<Building2 />}
              label={t("recruitment.studentScreens.completion.company")}
              value="DesignCraft Agency"
            />
            <SummaryRow
              icon={<BriefcaseBusiness />}
              label={t("recruitment.studentScreens.completion.position")}
              value="UI/UX Designer"
            />
            <SummaryRow
              icon={<MapPin />}
              label={t("recruitment.studentScreens.completion.opportunityType")}
              value={t("recruitment.studentScreens.completion.typeValue")}
            />
            <SummaryRow
              icon={<CheckCircle2 />}
              label={t("recruitment.studentScreens.completion.agreement")}
              value={t("recruitment.studentScreens.completion.signedCompleted")}
            />
            <SummaryRow
              icon={<Star />}
              label={t("recruitment.studentScreens.completion.status")}
              value={t("recruitment.studentScreens.completion.recruitmentCompleted")}
            />
          </div>
        </section>
        <div className="mt-4 grid gap-2 sm:grid-cols-2">
          <Link className={purpleButton} to={ROUTES.recruitment}>
            {t("recruitment.studentScreens.completion.backDashboard")}</Link>
          <Link
            className={paleButton}
            to={`${ROUTES.recruitment}/applications`}
          >
            {t("recruitment.studentScreens.completion.viewApplications")}</Link>
        </div>
      </Panel>
      <Panel title={t("recruitment.studentScreens.completion.whatsNext")}>
        <div className="space-y-3">
          <NextItem
            icon={<Bell />}
            text={t("recruitment.studentScreens.completion.onboarding")}
          />
          <NextItem
            icon={<FileText />}
            text={t("recruitment.studentScreens.completion.keepAgreement")}
          />
          <NextItem
            icon={<Star />}
            text={t("recruitment.studentScreens.completion.profileFuture")}
          />
        </div>
      </Panel>
    </div>
  );
}

function SummaryRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-2 text-[13px]">
      <span className="flex size-6 items-center justify-center rounded-lg bg-white/60 text-[#4B1D61]">
        {icon}
      </span>
      <span className="text-[#51465B]">{label}</span>
      <b className="ms-auto text-end">{value}</b>
    </div>
  );
}
function NextItem({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <p className="flex items-start gap-2 text-[13px] leading-4 text-[#51465B]">
      <span className="flex size-6 shrink-0 items-center justify-center rounded-lg bg-[#F1E5FA] text-[#4B1D61]">
        {icon}
      </span>
      {text}
    </p>
  );
}
