import type { ComponentType } from 'react';
import {
  Bell,
  BookOpen,
  BriefcaseBusiness,
  CalendarDays,
  CheckCircle2,
  ClipboardCheck,
  ClipboardList,
  Clock,
  FileText,
  FolderKanban,
  House,
  Star,
  UserRound,
} from 'lucide-react';

import certificateIcon from '@/assets/dashboard/sb-certificate.svg';
import chatIcon from '@/assets/dashboard/sb-chat.svg';
import coursesIcon from '@/assets/dashboard/sb-courses.svg';
import dashboardIcon from '@/assets/dashboard/sb-dashboard.svg';
import internshipIcon from '@/assets/dashboard/sb-internship.svg';
import navMentorshipIcon from '@/assets/dashboard/nav-mentorship.svg';
import progressIcon from '@/assets/dashboard/sb-progress.svg';
import recruitmentIcon from '@/assets/dashboard/sb-recruitment.svg';
import sprintsIcon from '@/assets/dashboard/sb-sprints.svg';
import squadIcon from '@/assets/dashboard/sb-squad.svg';
import { ROUTES } from '@/constants/routes';

// Items of the shared sidebar (Figma component "Sidebar", "Nav (compact)"), used by the
// student dashboard and the student recruitment flow. `to` is omitted for sections that have
// no screen yet: they render as disabled items. Add a route here when a section is built;
// every page using the sidebar picks it up.
export type SidebarSubItem = {
  id: string;
  labelKey: string;
  icon: ComponentType<{ className?: string; 'aria-hidden'?: boolean }>;
  to: string;
  end?: boolean;
  // Count pill shown at the end of the row (Figma "Opportunities 4", "Interview 1", ...).
  badge?: string;
};

export type SidebarNavItem = {
  id: string;
  labelKey: string;
  icon: string;
  to?: string;
  // Match the path exactly (the Dashboard home would otherwise be active on every page).
  end?: boolean;
  // Nested menu that expands inside the sidebar (Figma recruitment frames, e.g.
  // "01 - Recruitment Dashboard", 50:47444). `to` is then the group's root: it is where the
  // icon-only rail links to, and any path under it opens the group.
  children?: ReadonlyArray<SidebarSubItem>;
};

// Sub-items of the Internship dropdown group (journey stages)
export const INTERNSHIP_ITEMS: ReadonlyArray<SidebarSubItem> = [
  {
    id: 'internship-courses',
    labelKey: 'dashboard.journey.courses',
    icon: BookOpen,
    to: `${ROUTES.dashboardInternship}?step=courses`,
  },
  {
    id: 'internship-technical-interview',
    labelKey: 'dashboard.journey.technicalInterview',
    icon: ClipboardCheck,
    to: `${ROUTES.dashboardInternship}?step=technicalInterview`,
  },
  {
    id: 'internship-waiting-for-squad',
    labelKey: 'dashboard.journey.waitingForSquad',
    icon: Clock,
    to: `${ROUTES.dashboardInternship}?step=waitingForSquad`,
  },
  {
    id: 'internship-squad-ready',
    labelKey: 'dashboard.journey.squadReady',
    icon: CheckCircle2,
    to: `${ROUTES.dashboardInternship}?step=squadReady`,
  },
  {
    id: 'internship-project',
    labelKey: 'dashboard.journey.project',
    icon: FolderKanban,
    to: ROUTES.dashboardProject,
  },
];

// Sample counts carried over from the recruitment flow's sidebar (PR #31); there is no
// notifications API yet.
const RECRUITMENT_ITEMS: ReadonlyArray<SidebarSubItem> = [
  { id: 'recruitment-dashboard', labelKey: 'recruitment.nav.dashboard', icon: House, to: ROUTES.recruitment, end: true },
  { id: 'recruitment-eligibility', labelKey: 'recruitment.nav.eligibility', icon: Star, to: ROUTES.recruitmentEligibility },
  { id: 'recruitment-profile', labelKey: 'recruitment.nav.talentProfile', icon: UserRound, to: `${ROUTES.recruitment}/profile` },
  {
    id: 'recruitment-opportunities',
    labelKey: 'recruitment.nav.opportunities',
    icon: BriefcaseBusiness,
    to: `${ROUTES.recruitment}/opportunities`,
    badge: '4',
  },
  { id: 'recruitment-applications', labelKey: 'recruitment.nav.applications', icon: FileText, to: ROUTES.recruitmentApplications },
  { id: 'recruitment-interview', labelKey: 'recruitment.nav.interview', icon: CalendarDays, to: `${ROUTES.recruitment}/interview`, badge: '1' },
  { id: 'recruitment-agreement', labelKey: 'recruitment.nav.agreement', icon: ClipboardList, to: ROUTES.recruitmentAgreements },
  {
    id: 'recruitment-notifications',
    labelKey: 'recruitment.nav.notifications',
    icon: Bell,
    to: `${ROUTES.recruitment}/notifications`,
    badge: '2',
  },
];

export const SIDEBAR_NAV_ITEMS: ReadonlyArray<SidebarNavItem> = [
  { id: 'dashboard', labelKey: 'dashboard.sidebar.dashboard', icon: dashboardIcon, to: ROUTES.dashboard, end: true },
  {
    id: 'internship',
    labelKey: 'dashboard.sidebar.internship',
    icon: internshipIcon,
    to: ROUTES.dashboardInternship,
    children: INTERNSHIP_ITEMS,
  },
  { id: 'squad', labelKey: 'dashboard.sidebar.mySquad', icon: squadIcon },
  { id: 'courses', labelKey: 'dashboard.sidebar.courses', icon: coursesIcon, to: ROUTES.dashboardCourses },
  {
    id: 'mentorship',
    labelKey: 'dashboard.sidebar.mentorship',
    icon: navMentorshipIcon,
    to: ROUTES.mentorship,
  },
  {
    id: 'recruitment',
    labelKey: 'dashboard.sidebar.recruitment',
    icon: recruitmentIcon,
    to: ROUTES.recruitment,
    children: RECRUITMENT_ITEMS,
  },
  { id: 'sprints', labelKey: 'dashboard.sidebar.sprints', icon: sprintsIcon },
  { id: 'progress', labelKey: 'dashboard.sidebar.progress', icon: progressIcon },
  { id: 'chat', labelKey: 'dashboard.sidebar.chat', icon: chatIcon },
  { id: 'certificate', labelKey: 'dashboard.sidebar.certificate', icon: certificateIcon },
];
