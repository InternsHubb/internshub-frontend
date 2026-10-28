export type SeniorCategory = 'all' | 'frontend' | 'fullstack' | 'design' | 'devops';

export interface CareerStorySection {
  title: string;
  titleAr?: string;
  content: string;
  contentAr?: string;
  keyHighlight?: string;
  keyHighlightAr?: string;
}

export interface CareerStory {
  beginning: CareerStorySection;
  challenges: CareerStorySection;
  turningPoint: CareerStorySection;
  growth: CareerStorySection;
  whereNow: CareerStorySection;
  adviceForBeginners: CareerStorySection;
}

export type MilestoneType = 'start' | 'learning' | 'challenge' | 'internship' | 'breakthrough' | 'current';

export interface TimelineMilestone {
  stage: string;
  stageAr?: string;
  period: string;
  periodAr?: string;
  title: string;
  titleAr?: string;
  role?: string;
  roleAr?: string;
  companyOrOrg?: string;
  companyOrOrgAr?: string;
  description: string;
  descriptionAr?: string;
  type: MilestoneType;
  skillsAcquired: string[];
}

export interface FeaturedProject {
  title: string;
  titleAr?: string;
  description: string;
  descriptionAr?: string;
  techStack: string[];
  impact: string;
  impactAr?: string;
  role: string;
  roleAr?: string;
  demoUrl?: string;
  githubUrl?: string;
}

export interface TopAdvice {
  title: string;
  titleAr?: string;
  description: string;
  descriptionAr?: string;
}

export interface SeniorProfile {
  id: string;
  name: string;
  nameAr: string;
  role: string;
  roleAr: string;
  company: string;
  companyAr: string;
  category: SeniorCategory;
  specialization: string;
  specializationAr: string;
  yearsOfExperience: number;
  location: string;
  locationAr: string;
  avatar: string;
  avatarFallback: string;
  shortBio: string;
  shortBioAr: string;
  skills: string[];
  toolsAndTech: string[];
  linkedinUrl: string;
  portfolioUrl?: string;
  githubUrl?: string;
  highlightQuote: string;
  highlightQuoteAr?: string;
  stats: {
    yearsExp: number;
    projectsCompleted: number;
    menteesGuided: number;
  };
  story: CareerStory;
  timeline: TimelineMilestone[];
  featuredProjects: FeaturedProject[];
  topAdvice: TopAdvice[];
}
