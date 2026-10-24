export type Language = "en" | "ar";

export type RecruitmentPage =
  | "dashboard"
  | "eligibility"
  | "profile"
  | "opportunities"
  | "applications"
  | "interview"
  | "agreement"
  | "notifications";

export type BilingualText = Record<Language, string>;

export interface RecruitmentProfile {
  name: string;
  title: string;
  initials: string;
  score: number;
  percentile: number;
  visibleToEmployers: boolean;
  primaryTrack: string;
  cohort: string;
  mentor: string;
  certificates: string[];
  skills: string[];
  about: BilingualText;
}

export interface NavigationItem {
  id: RecruitmentPage;
  label: BilingualText;
  count?: number;
}