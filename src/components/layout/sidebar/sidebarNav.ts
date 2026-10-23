import certificateIcon from '@/assets/dashboard/sb-certificate.svg';
import chatIcon from '@/assets/dashboard/sb-chat.svg';
import coursesIcon from '@/assets/dashboard/sb-courses.svg';
import dashboardIcon from '@/assets/dashboard/sb-dashboard.svg';
import internshipIcon from '@/assets/dashboard/sb-internship.svg';
import progressIcon from '@/assets/dashboard/sb-progress.svg';
import recruitmentIcon from '@/assets/dashboard/sb-recruitment.svg';
import sprintsIcon from '@/assets/dashboard/sb-sprints.svg';
import squadIcon from '@/assets/dashboard/sb-squad.svg';
import { ROUTES } from '@/constants/routes';

// Items of the shared dashboard sidebar (Figma component "Sidebar", "Nav (compact)").
// `to` is omitted for sections that have no screen yet: they render as disabled items.
// Add a route here when a section is built; every page using the layout picks it up.
export type SidebarNavItem = {
  id: string;
  labelKey: string;
  icon: string;
  to?: string;
  // Match the path exactly (the Dashboard home would otherwise be active on every page).
  end?: boolean;
};

export const SIDEBAR_NAV_ITEMS: ReadonlyArray<SidebarNavItem> = [
  { id: 'dashboard', labelKey: 'dashboard.sidebar.dashboard', icon: dashboardIcon, to: ROUTES.dashboard, end: true },
  { id: 'internship', labelKey: 'dashboard.sidebar.internship', icon: internshipIcon, to: ROUTES.dashboardInternship },
  { id: 'squad', labelKey: 'dashboard.sidebar.mySquad', icon: squadIcon },
  { id: 'courses', labelKey: 'dashboard.sidebar.courses', icon: coursesIcon, to: ROUTES.dashboardCourses },
  { id: 'recruitment', labelKey: 'dashboard.sidebar.recruitment', icon: recruitmentIcon },
  { id: 'sprints', labelKey: 'dashboard.sidebar.sprints', icon: sprintsIcon },
  { id: 'progress', labelKey: 'dashboard.sidebar.progress', icon: progressIcon },
  { id: 'chat', labelKey: 'dashboard.sidebar.chat', icon: chatIcon },
  { id: 'certificate', labelKey: 'dashboard.sidebar.certificate', icon: certificateIcon },
];
