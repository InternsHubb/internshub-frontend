import React, { useState } from 'react';
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { ROUTES } from '@/constants/routes';

interface EnrolledLesson {
  id: string;
  title: string;
  type: string;
  duration: string;
  status: 'completed' | 'in-progress' | 'unstarted';
}

interface Attachment {
  id: string;
  title: string;
  typeText: string;
  iconSrc: string;
}

interface EnrolledModule {
  id: number;
  title: string;
  lessonsCount: number;
  duration: string;
  lessons: EnrolledLesson[];
  attachments?: Attachment[];
}

const ENROLLED_MODULES: EnrolledModule[] = [
  {
    id: 1,
    title: 'Module 1: Introduction to UI/UX',
    lessonsCount: 5,
    duration: '1h 20m',
    lessons: [
      { id: '1-1', title: 'What is UI/UX Design?', type: 'Video Lesson', duration: '12:30', status: 'completed' },
      { id: '1-2', title: 'History of Digital Design', type: 'Video Lesson', duration: '08:45', status: 'completed' },
      { id: '1-3', title: 'Understanding User-Centered Design', type: 'Video Lesson • In Progress', duration: '15:10', status: 'in-progress' },
      { id: '1-4', title: 'The Design Thinking Process', type: 'Video Lesson', duration: '18:20', status: 'unstarted' },
      { id: '1-5', title: 'Tools of the Trade: Figma Basics', type: 'Video Lesson', duration: '25:00', status: 'unstarted' },
    ],
    attachments: [
      { id: 'att-1-1', title: 'UI/UX Fundamentals Slide Deck', typeText: 'pdf file', iconSrc: '/images/enrolled/pdf-icon.svg' },
      { id: 'att-1-2', title: 'Design Thinking Starter Kit', typeText: 'html file', iconSrc: '/images/enrolled/code-icon.svg' },
    ],
  },
  {
    id: 2,
    title: 'Module 2: Design Principles',
    lessonsCount: 6,
    duration: '2h 05m',
    lessons: [
      { id: '2-1', title: 'What is UI/UX Design?', type: 'Video Lesson', duration: '12:30', status: 'in-progress' },
      { id: '2-2', title: 'History of Digital Design', type: 'Video Lesson', duration: '08:45', status: 'unstarted' },
      { id: '2-3', title: 'Understanding User-Centered Design', type: 'Video Lesson • In Progress', duration: '15:10', status: 'unstarted' },
      { id: '2-4', title: 'The Design Thinking Process', type: 'Video Lesson', duration: '18:20', status: 'unstarted' },
      { id: '2-5', title: 'Tools of the Trade: Figma Basics', type: 'Video Lesson', duration: '25:00', status: 'unstarted' },
    ],
    attachments: [
      { id: 'att-2-1', title: 'What is UI/UX Design?', typeText: 'pdf file', iconSrc: '/images/enrolled/pdf-icon.svg' },
      { id: 'att-2-2', title: 'Understanding User-Centered Design', typeText: 'html file', iconSrc: '/images/enrolled/code-icon.svg' },
      { id: 'att-2-3', title: 'Tools of the Trade: Figma Basics', typeText: 'power point slides', iconSrc: '/images/enrolled/powerpoint-icon.svg' },
    ],
  },
  {
    id: 3,
    title: 'Module 3: User Research & Personas',
    lessonsCount: 5,
    duration: '1h 45m',
    lessons: [
      { id: '3-1', title: 'Conducting User Interviews', type: 'Video Lesson', duration: '24:10', status: 'unstarted' },
      { id: '3-2', title: 'Building Empathy Maps', type: 'Video Lesson', duration: '18:45', status: 'unstarted' },
      { id: '3-3', title: 'Creating Actionable Personas', type: 'Video Lesson', duration: '21:50', status: 'unstarted' },
    ],
  },
  {
    id: 4,
    title: 'Module 4: Wireframing & Prototyping',
    lessonsCount: 7,
    duration: '3h 10m',
    lessons: [
      { id: '4-1', title: 'Low-Fidelity Wireframes in Figma', type: 'Video Lesson', duration: '28:15', status: 'unstarted' },
      { id: '4-2', title: 'Interactive Clickable Prototypes', type: 'Video Lesson', duration: '31:20', status: 'unstarted' },
      { id: '4-3', title: 'User Testing with Prototypes', type: 'Video Lesson', duration: '26:00', status: 'unstarted' },
    ],
  },
  {
    id: 5,
    title: 'Module 5: Visual Design & Typography',
    lessonsCount: 5,
    duration: '2h 30m',
    lessons: [
      { id: '5-1', title: 'Design Systems & Tokens', type: 'Video Lesson', duration: '27:40', status: 'unstarted' },
      { id: '5-2', title: 'Component Libraries & Variants', type: 'Video Lesson', duration: '32:15', status: 'unstarted' },
      { id: '5-3', title: 'Responsive Grid Layouts', type: 'Video Lesson', duration: '25:10', status: 'unstarted' },
    ],
  },
  {
    id: 6,
    title: 'Module 6: Portfolio & Career Prep',
    lessonsCount: 4,
    duration: '1h 30m',
    lessons: [
      { id: '6-1', title: 'Case Study Storytelling', type: 'Video Lesson', duration: '23:30', status: 'unstarted' },
      { id: '6-2', title: 'Presenting Work to Stakeholders', type: 'Video Lesson', duration: '20:15', status: 'unstarted' },
      { id: '6-3', title: 'Job Search & Interview Prep', type: 'Video Lesson', duration: '26:45', status: 'unstarted' },
    ],
  },
];

export const CourseDetailsPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id?: string }>();
  const [searchParams, setSearchParams] = useSearchParams();

  const courseStorageKey = `course_progress_${id || 'data_analysis'}`;

  // Default is false (pre-enrollment Course Details preview).
  // When user clicks "Start Learning" or "Enroll Now", it transitions to true (enrolled view).
  const [isEnrolled, setIsEnrolled] = useState<boolean>(() => {
    const p = searchParams.get('enrolled');
    if (p === 'true') return true;
    try {
      const enrolledSaved = JSON.parse(localStorage.getItem('enrolled_courses') || '{}');
      if (id && enrolledSaved[id]) return true;
    } catch {}
    return false;
  });

  // Dynamic progress count: 13 lessons (35% - enrolled node 112:15294) up to 19 lessons (100% completed node 112:15799)
  const [completedCount, setCompletedCount] = useState<number>(() => {
    const p = searchParams.get('progress');
    if (p) return parseInt(p, 10);
    const stored = localStorage.getItem(courseStorageKey);
    return stored ? parseInt(stored, 10) : 13;
  });

  const isCompleted = completedCount >= 19;
  const progressPercent = isCompleted ? 100 : (completedCount === 13 ? 35 : Math.round((completedCount / 19) * 100));

  const [activeNav, setActiveNav] = useState('courses');
  const [isCourseContentOpen, setIsCourseContentOpen] = useState<boolean>(true);
  const [openModules, setOpenModules] = useState<Record<number, boolean>>({ 1: true, 2: true });
  const [openAttachments, setOpenAttachments] = useState<Record<number, boolean>>({ 1: false, 2: true });
  const [activeContentLesson, setActiveContentLesson] = useState<string>('interactive-proto');
  const [downloadSuccess, setDownloadSuccess] = useState<string | null>(null);

  // Advance progress on user interaction until completed (and cycles back on click when at 100%)
  const advanceProgress = () => {
    setCompletedCount((prev) => {
      const next = prev >= 19 ? 13 : Math.min(19, prev + 2);
      localStorage.setItem(courseStorageKey, next.toString());
      setSearchParams({ enrolled: 'true', progress: next.toString() });
      return next;
    });
  };

  const handleEnroll = () => {
    setIsEnrolled(true);
    try {
      const enrolledSaved = JSON.parse(localStorage.getItem('enrolled_courses') || '{}');
      if (id) {
        enrolledSaved[id] = true;
        localStorage.setItem('enrolled_courses', JSON.stringify(enrolledSaved));
      }
    } catch {}
    setSearchParams({ enrolled: 'true', progress: completedCount.toString() });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const toggleModule = (id: number) => {
    setOpenModules((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const toggleAttachments = (id: number) => {
    setOpenAttachments((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleDownload = (filename: string) => {
    setDownloadSuccess(`Downloading ${filename}...`);
    setTimeout(() => setDownloadSuccess(null), 3000);
  };

  return (
    <div className="min-h-screen bg-[#FEFEFE] relative font-['Plus_Jakarta_Sans'] pb-16 antialiased selection:bg-[#5A198F]/20 selection:text-[#5A198F] flex flex-col items-start flow-page-enter">
      {/* Toast Notification */}
      {downloadSuccess && (
        <div className="fixed top-5 right-5 z-50 bg-[#3B0454] text-white px-5 py-3 rounded-xl shadow-xl flex items-center gap-3 animate-fade-in text-sm font-medium">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" y1="15" x2="12" y2="3" />
          </svg>
          {downloadSuccess}
        </div>
      )}

      {/* Top Header / Breadcrumbs Bar (Figma node 112:15295 / 112:15801) */}
      <header className="w-full max-w-[1560px] pl-1.5 sm:pl-2 lg:pl-1.5 pr-4 sm:pr-6 pt-3 pb-2 flex items-center justify-between gap-4">
        {/* Left: Logo & Breadcrumbs */}
        <div className="flex items-center gap-6 sm:gap-8 flex-wrap">
          <Link
            to={ROUTES.home}
            className="font-bold text-[24px] leading-none text-[#22023C] hover:opacity-90 transition-opacity whitespace-nowrap"
          >
            Interns HUB
          </Link>

          {/* Breadcrumbs Row */}
          <div className="flex items-center gap-2">
            {/* Purple Icon Box */}
            <div className="size-[36px] bg-[#F4F0F8] border border-[#AE8FC8] rounded-[8px] flex items-center justify-center shrink-0 shadow-xs">
              <svg width="18" height="14" viewBox="0 0 18 14" fill="none">
                <path d="M9 1L1 5L9 9L17 5L9 1Z" fill="#5A198F" />
                <path
                  d="M4 6.5V10.5C4 10.5 6 12.5 9 12.5C12 12.5 14 10.5 14 10.5V6.5"
                  stroke="#5A198F"
                  strokeWidth="1.2"
                  strokeLinecap="round"
                />
              </svg>
            </div>

            {/* Breadcrumb Steps */}
            <nav className="flex items-center gap-2 text-[14px] font-medium leading-[20px] whitespace-nowrap overflow-x-auto">
              <Link
                to={ROUTES.courses6m}
                className="text-[#94A3B8] hover:text-[#5A198F] transition-colors"
              >
                Courses
              </Link>
              <svg width="8" height="12" viewBox="0 0 8 12" fill="none" className="shrink-0">
                <path d="M1.5 1.5L6 6L1.5 10.5" stroke="#94A3B8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>

              <span className="text-[#94A3B8]">Artificial Intelligence</span>
              <svg width="8" height="12" viewBox="0 0 8 12" fill="none" className="shrink-0">
                <path d="M1.5 1.5L6 6L1.5 10.5" stroke="#94A3B8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>

              <span className="text-[#4C0585] font-semibold">Data Analysis Fundamentals</span>
            </nav>
          </div>
        </div>

        {/* Right: Quick Controls & Profile Pill */}
        <div className="flex items-center gap-3 sm:gap-4 shrink-0">
          {/* Progress Advance Trigger Pill */}
          {isEnrolled && (
            <button
              type="button"
              onClick={advanceProgress}
              className={`text-xs px-3 py-1.5 rounded-full border transition-all cursor-pointer font-semibold shadow-xs flex items-center gap-1.5 ${
                isCompleted
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-700 hover:bg-emerald-100'
                  : 'bg-purple-50 border-purple-300 text-[#5A198F] hover:bg-purple-100'
              }`}
              title="Click to advance progress until complete"
            >
              <span className={`size-2 rounded-full ${isCompleted ? 'bg-emerald-500 animate-pulse' : 'bg-[#5A198F]'}`} />
              {isCompleted ? '100% Completed (Click to reset)' : `Progress: ${progressPercent}% (Click +20%)`}
            </button>
          )}

          {/* Mode Switch Pill (Enrolled vs Preview) */}
          <button
            type="button"
            onClick={() => {
              const nextState = !isEnrolled;
              setIsEnrolled(nextState);
              if (nextState) {
                setSearchParams({ enrolled: 'true', progress: completedCount.toString() });
              } else {
                setSearchParams({});
              }
            }}
            className="hidden sm:flex text-xs px-2.5 py-1 rounded-full border border-purple-200 text-[#5A198F] bg-purple-50 hover:bg-purple-100 transition-colors cursor-pointer"
            title="Toggle between Enrolled view and Preview view"
          >
            {isEnrolled ? 'Enrolled View (Click for Preview)' : 'Preview Mode'}
          </button>

          {/* Settings Button (Figma node 112:15318) */}
          <button
            type="button"
            className="size-[27px] bg-[rgba(0,0,0,0.01)] border border-[rgba(0,0,0,0.16)] rounded-[6px] flex items-center justify-center hover:bg-black/5 transition-colors cursor-pointer"
            title="Settings"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path
                d="M6.3 1H9.7L10.1 2.8C10.6 3 11 3.2 11.4 3.5L13.1 2.8L14.8 5.7L13.4 7C13.5 7.3 13.5 7.7 13.5 8C13.5 8.3 13.5 8.7 13.4 9L14.8 10.3L13.1 13.2L11.4 12.5C11 12.8 10.6 13 10.1 13.2L9.7 15H6.3L5.9 13.2C5.4 13 5 12.8 4.6 12.5L2.9 13.2L1.2 10.3L2.6 9C2.5 8.7 2.5 8.3 2.5 8C2.5 7.7 2.5 7.3 2.6 7L1.2 5.7L2.9 2.8L4.6 3.5C5 3.2 5.4 3 5.9 2.8L6.3 1Z"
                stroke="#64748B"
                strokeWidth="1.2"
                strokeLinejoin="round"
              />
              <circle cx="8" cy="8" r="2.5" stroke="#64748B" strokeWidth="1.2" />
            </svg>
          </button>

          {/* User Profile Pill (Figma node 112:15321: 261px × 62px) */}
          <div className="w-[240px] sm:w-[261px] h-[62px] bg-[#F4F4F4] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] rounded-[999px] px-[16px] flex items-center gap-[12px] shrink-0 hover:bg-gray-100 transition-colors cursor-pointer">
            <img
              src="/images/avatar-maya-figma.jpg"
              alt="Maya Johnson"
              className="size-[40px] rounded-full object-cover shadow-xs border border-white shrink-0"
            />
            <div className="flex flex-col text-start justify-center">
              <span className="font-normal text-[14px] leading-[20px] text-[#1E293B]">
                Maya Johnson
              </span>
              <span className="font-normal text-[12px] leading-[16px] text-[#6B7280]">
                AI track - 12 Month Plan
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Container: Slim Sidebar + Content Layout */}
      <div className="w-full max-w-[1560px] pl-1.5 sm:pl-2 lg:pl-1.5 pr-4 sm:pr-6 pt-3 flex gap-[24px] items-start">
        {/* Slim Left Sidebar (Figma node 112:15329) */}
        <aside className="hidden lg:flex w-[118px] h-[976px] bg-[#3B0454] rounded-[34px] flex-col items-center pt-[61px] relative overflow-hidden shrink-0 select-none shadow-xl">
          {/* Top Logo / Graduation Cap */}
          <Link
            to={ROUTES.home}
            className="size-[44px] flex items-center justify-center hover:scale-105 transition-transform"
            title="Interns HUB"
          >
            <svg width="43" height="32" viewBox="0 0 43 32" fill="none">
              <path
                d="M22.4981 0.122721C21.54 -0.040907 20.561 -0.040907 19.6028 0.122721C18.517 0.309054 17.4976 0.773096 15.912 1.49155L4.02067 6.88805C3.13559 7.28939 2.39026 7.62622 1.83484 7.93976C1.29734 8.24435 0.681007 8.65643 0.34059 9.32114C0.116757 9.75681 0 10.2396 0 10.7294C0 11.2192 0.116757 11.702 0.34059 12.1376C0.681007 12.8023 1.29734 13.2162 1.83663 13.519C2.39205 13.8326 3.13559 14.1712 4.02246 14.5725L15.9155 19.9672C17.4994 20.6875 18.5188 21.1497 19.6046 21.3361C20.5628 21.4997 21.5417 21.4997 22.4999 21.3361C23.5857 21.1497 24.6051 20.6875 26.1908 19.9672L37.6252 14.7803V23.2711C37.6252 23.6274 37.7667 23.9692 38.0187 24.2212C38.2707 24.4732 38.6125 24.6148 38.9689 24.6148C39.3253 24.6148 39.6671 24.4732 39.9191 24.2212C40.1711 23.9692 40.3127 23.6274 40.3127 23.2711V13.4921C40.8412 13.1911 41.4325 12.7826 41.7639 12.1358C41.9878 11.7002 42.1045 11.2174 42.1045 10.7276C42.1045 10.2378 41.9878 9.75502 41.7639 9.31935C41.4235 8.65643 40.8072 8.24076 40.2679 7.93797C39.7125 7.62443 38.9689 7.2876 38.082 6.88626L26.189 1.48976C24.6051 0.771304 23.5857 0.307263 22.4999 0.120929"
                fill="white"
              />
              <path
                d="M15.2096 21.7392L7.16505 18.2562V23.7315C7.16505 25.4873 7.8638 27.3489 9.52646 28.4418C11.6872 29.8644 15.611 31.7815 21.0505 31.7815C26.49 31.7815 30.4137 29.8644 32.5745 28.4418C34.2353 27.3489 34.9359 25.4873 34.9359 23.7315V18.2562L26.8913 21.7392C25.4544 22.3627 24.2056 22.9038 22.8493 23.1259C21.658 23.3214 20.4429 23.3214 19.2516 23.1259C17.8953 22.9038 16.6465 22.3627 15.2096 21.7392Z"
                fill="white"
              />
            </svg>
          </Link>

          {/* Navigation Icons */}
          <nav className="flex flex-col gap-[24px] items-center mt-[72px] w-[44px]">
            <button
              type="button"
              onClick={() => setActiveNav('internship')}
              className={`size-[36px] flex items-center justify-center transition-colors cursor-pointer ${
                activeNav === 'internship' ? 'text-white' : 'text-white/80 hover:text-white'
              }`}
              title="Internship Tasks"
            >
              <svg width="24" height="24" viewBox="0 0 23 23" fill="none">
                <path
                  d="M7.1 3.6C7.5 3.9 7.6 4.4 7.3 4.8L5.3 7.7C5.2 7.9 4.9 8 4.7 8C4.4 8.1 4.2 8 4 7.8L2.6 6.4C2.2 6 2.2 5.5 2.6 5.1C2.9 4.8 3.4 4.8 3.8 5.1L4.5 5.9L5.9 3.8C6.2 3.4 6.7 3.3 7.1 3.6ZM10.4 5.8H19.6C20.2 5.8 20.7 6.3 20.7 7C20.7 7.6 20.2 8.1 19.6 8.1H10.4C9.8 8.1 9.3 7.6 9.3 7C9.3 6.3 9.8 5.8 10.4 5.8ZM10.4 11.5H19.6C20.2 11.5 20.7 12 20.7 12.6C20.7 13.3 20.2 13.8 19.6 13.8H10.4C9.8 13.8 9.3 13.3 9.3 12.6C9.3 12 9.8 11.5 10.4 11.5ZM8.1 17.3H19.6C20.2 17.3 20.7 17.8 20.7 18.4C20.7 19.1 20.2 19.6 19.6 19.6H8.1C7.5 19.6 7 19.1 7 18.4C7 17.8 7.5 17.3 8.1 17.3Z"
                  fill="white"
                />
              </svg>
            </button>

            <button
              type="button"
              onClick={() => setActiveNav('squad')}
              className={`size-[36px] flex items-center justify-center transition-colors cursor-pointer ${
                activeNav === 'squad' ? 'text-white' : 'text-white/80 hover:text-white'
              }`}
              title="My Squad"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path
                  d="M17.25 6.86C17.19 6.85 17.13 6.85 17.07 6.86C15.75 6.81 14.69 5.73 14.69 4.39C14.69 3.02 15.79 1.92 17.16 1.92C18.53 1.92 19.64 3.03 19.64 4.39C19.63 5.73 18.57 6.81 17.25 6.86Z"
                  stroke="#FAF8F1"
                  strokeWidth="1.5"
                />
                <path
                  d="M11.5 14.02C11.44 14.01 11.38 14.01 11.32 14.02C9.99 13.97 8.94 12.89 8.94 11.55C8.94 10.18 10.04 9.08 11.41 9.08C12.78 9.08 13.89 10.19 13.89 11.55C13.88 12.89 12.82 13.98 11.5 14.02Z"
                  stroke="#FAF8F1"
                  strokeWidth="1.5"
                />
                <path
                  d="M8.71 17.04C7.36 17.94 7.36 19.42 8.71 20.32C10.24 21.34 12.76 21.34 14.29 20.32C15.64 19.42 15.64 17.94 14.29 17.04C12.77 16.02 10.24 16.02 8.71 17.04Z"
                  stroke="#FAF8F1"
                  strokeWidth="1.5"
                />
              </svg>
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveNav('courses');
                navigate(ROUTES.courses6m);
              }}
              className={`w-[44px] h-[43px] rounded-[8px] flex items-center justify-center shadow-md cursor-pointer transition-all ${
                activeNav === 'courses' ? 'bg-gradient-to-r from-[#3A0353] to-[#804A8A]' : 'hover:bg-white/10'
              }`}
              title="Courses"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path
                  d="M22 4.85V16.74C22 17.71 21.21 18.6 20.24 18.72L19.93 18.76C18.29 18.98 15.98 19.66 14.12 20.44C13.47 20.71 12.75 20.22 12.75 19.51V5.6C12.75 5.23 12.96 4.89 13.29 4.71C15.12 3.72 17.89 2.84 19.77 2.68H19.83C21.03 2.68 22 3.65 22 4.85Z"
                  fill="white"
                />
                <path
                  d="M10.71 4.71C8.88 3.72 6.11 2.84 4.23 2.68H4.16C2.96 2.68 1.99 3.65 1.99 4.85V16.74C1.99 17.71 2.78 18.6 3.75 18.72L4.06 18.76C5.7 18.98 8.01 19.66 9.87 20.44C10.52 20.71 11.24 20.22 11.24 19.51V5.6C11.24 5.22 11.04 4.89 10.71 4.71ZM5 7.74H7.25C7.66 7.74 8 8.08 8 8.49C8 8.91 7.66 9.24 7.25 9.24H5C4.59 9.24 4.25 8.91 4.25 8.49C4.25 8.08 4.59 7.74 5 7.74ZM8 12.24H5C4.59 12.24 4.25 11.91 4.25 11.49C4.25 11.08 4.59 10.74 5 10.74H8C8.41 10.74 8.75 11.08 8.75 11.49C8.75 11.91 8.41 12.24 8 12.24Z"
                  fill="white"
                />
              </svg>
            </button>

            <button
              type="button"
              onClick={() => setActiveNav('sprints')}
              className="size-[36px] flex items-center justify-center text-white/80 hover:text-white transition-colors cursor-pointer"
              title="Sprints"
            >
              <svg width="23" height="23" viewBox="0 0 23 23" fill="none">
                <path
                  d="M12.4583 2.875C7.16833 2.875 2.875 7.16833 2.875 12.4583C2.875 17.7483 7.16833 22.0417 12.4583 22.0417C17.7483 22.0417 22.0417 17.7483 22.0417 12.4583C22.0417 7.16833 17.7483 2.875 12.4583 2.875ZM15.525 13.225L11.5 17.25L10.1483 15.8983L12.9283 13.1183H7.66667V11.2H12.9283L10.1483 8.42L11.5 7.06833L15.525 11.0933C15.8217 11.39 16.0133 11.7825 16.0133 12.1692C16.0133 12.5558 15.8217 12.9283 15.525 13.225Z"
                  fill="white"
                />
              </svg>
            </button>

            <button
              type="button"
              onClick={() => setActiveNav('progress')}
              className="size-[36px] flex items-center justify-center text-white/80 hover:text-white transition-colors cursor-pointer"
              title="Progress"
            >
              <svg width="23" height="23" viewBox="0 0 23 23" fill="none">
                <path
                  d="M11.5 1.91667C6.20813 1.91667 1.91667 6.20813 1.91667 11.5C1.91667 16.7919 6.20813 21.0833 11.5 21.0833C16.7919 21.0833 21.0833 16.7919 21.0833 11.5C21.0833 6.20813 16.7919 1.91667 11.5 1.91667ZM11.5 3.83333V11.5H19.1667C19.1667 15.7335 15.7335 19.1667 11.5 19.1667C7.26646 19.1667 3.83333 15.7335 3.83333 11.5C3.83333 7.26646 7.26646 3.83333 11.5 3.83333Z"
                  fill="white"
                />
              </svg>
            </button>

            <button
              type="button"
              onClick={() => setActiveNav('chat')}
              className="size-[36px] flex items-center justify-center text-white/80 hover:text-white transition-colors cursor-pointer"
              title="Chat"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path
                  d="M12 2C6.48 2 2 6.03 2 11C2 13.87 3.48 16.41 5.78 17.98C5.64 19.24 5.09 20.91 3.5 22C5.55 21.95 7.82 21.04 9.38 19.78C10.22 19.92 11.1 20 12 20C17.52 20 22 15.97 22 11C22 6.03 17.52 2 12 2Z"
                  stroke="white"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>

            <button
              type="button"
              onClick={() => setActiveNav('certificate')}
              className="size-[36px] flex items-center justify-center text-white/80 hover:text-white transition-colors cursor-pointer"
              title="Certificate"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <rect x="3" y="4" width="18" height="15" rx="2" stroke="white" strokeWidth="1.5" />
                <path d="M12 8V12" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
                <circle cx="12" cy="14" r="1" fill="white" />
              </svg>
            </button>
          </nav>

          <div className="absolute bottom-0 left-0 right-0 pointer-events-none opacity-90">
            <img
              src="/images/sidebar-slim-bottom.svg"
              alt=""
              className="w-full object-cover"
            />
          </div>
        </aside>

        {/* Dynamic Main Body: Check if Enrolled View or Pre-Enrollment View */}
        {isEnrolled ? (
          /* ========================================================================= */
          /* ENROLLED VIEW (Figma node 112:15294 In-Progress & 112:15799 Completed)   */
          /* ========================================================================= */
          <main className="flex-1 max-w-[1250px] flex flex-col xl:flex-row gap-[24px] xl:gap-[32px] items-start w-full flow-scale-in">
            {/* Left Column: Course Details & Curriculum Accordions (max-w-[782px]) */}
            <div className="flex-1 w-full max-w-full lg:max-w-[782px] flex flex-col gap-[29px]">
              {/* Upper Course Details Header */}
              <div className="flex flex-col gap-[24px] w-full">
                <div className="flex flex-col gap-[24px] w-full max-w-[576px]">
                  {/* Interactive Progress Indicator & Stepper Trigger */}
                  <div
                    onClick={advanceProgress}
                    className="inline-flex items-center gap-2 self-start bg-purple-50 hover:bg-purple-100 border border-purple-200 text-[#5A198F] px-3.5 py-1.5 rounded-full text-[13px] font-semibold cursor-pointer transition-all shadow-2xs group select-none"
                    title="Click to advance progress"
                  >
                    <span className={`size-2 rounded-full ${isCompleted ? 'bg-emerald-500' : 'bg-[#5A198F]'} animate-pulse`} />
                    <span>
                      {isCompleted
                        ? '🎉 Course Completed (100%) - Click to Re-test'
                        : `Progress: ${progressPercent}% (${completedCount}/19 lessons) • Click to advance`}
                    </span>
                    <svg className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" viewBox="0 0 16 16" fill="currentColor">
                      <path fillRule="evenodd" d="M6.22 3.22a.75.75 0 0 1 1.06 0l4.25 4.25a.75.75 0 0 1 0 1.06l-4.25 4.25a.75.75 0 0 1-1.06-1.06L9.94 8 6.22 4.28a.75.75 0 0 1 0-1.06z" clipRule="evenodd" />
                    </svg>
                  </div>

                  <h1 className="font-extrabold text-[36px] sm:text-[44px] lg:text-[48px] leading-[44px] sm:leading-[52px] lg:leading-[60px] text-[#0F172A] tracking-[-1.2px]">
                    Master Data Analysis from Scratch to Insights
                  </h1>

                  <p className="font-normal text-[16px] sm:text-[18px] leading-[26px] sm:leading-[29.25px] text-[#64748B]">
                    Learn how to analyze data, create interactive dashboards, and turn raw data into meaningful insights using Excel, SQL, Python, and Power BI.
                  </p>

                  {/* Instructor Row */}
                  <div className="flex items-center gap-[7.25px] h-[23px]">
                    <img
                      src="/images/enrolled/elena-avatar.png"
                      alt="Elena Vasquez"
                      className="size-[23px] rounded-full object-cover shrink-0 border border-slate-200"
                    />
                    <span className="font-medium text-[10.15px] sm:text-[11px] leading-[14.5px] text-[#475569] tracking-[0.02px]">
                      Elena Vasquez - Head of Open Source Applications of aaa Company
                    </span>
                  </div>
                </div>

                {/* Course Curriculum Header */}
                <div className="flex flex-col gap-[11px] w-full max-w-[624px] pt-2">
                  <h2 className="font-extrabold text-[28px] sm:text-[30px] leading-[36px] text-[#0F172A] tracking-[0.0293px]">
                    Course Curriculum
                  </h2>
                  <p className="font-normal text-[16px] leading-[24px] text-[#536278]">
                    6 modules • {isCompleted ? '19' : '32'} lessons • 18 hours total length
                  </p>
                </div>
              </div>

              {/* Videos / Modules Accordion List */}
              <div className="flex flex-col gap-[20px] sm:gap-[30px] w-full">
                {ENROLLED_MODULES.map((mod) => {
                  const isOpen = !!openModules[mod.id];
                  const isAttachmentsOpen = !!openAttachments[mod.id];

                  return (
                    <div
                      key={mod.id}
                      className="bg-white border border-[rgba(0,0,0,0.22)] rounded-[16px] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] overflow-hidden transition-all duration-200 flex flex-col w-full"
                    >
                      {/* Module Header Bar */}
                      <button
                        type="button"
                        onClick={() => toggleModule(mod.id)}
                        className="w-full px-[24px] sm:px-[28px] py-[20px] sm:py-[24px] flex items-center justify-between text-start cursor-pointer hover:bg-slate-50/50 transition-colors"
                      >
                        <div className="flex items-center gap-[16px]">
                          {/* Module Number Badge */}
                          <div
                            className={`size-[40px] rounded-full flex items-center justify-center font-bold text-[14px] shrink-0 transition-colors ${
                              isOpen && mod.id === 1
                                ? 'bg-[#5A198F] text-white shadow-xs'
                                : 'bg-[#F1F5F9] border border-[rgba(0,0,0,0.08)] text-[#64748B]'
                            }`}
                          >
                            {mod.id}
                          </div>

                          {/* Title, Subtitle, and optional "New" badge for Module 5 in Completed state */}
                          <div className="flex items-center gap-3">
                            <div className="flex flex-col gap-[4px]">
                              <h3 className="font-bold text-[15px] sm:text-[16px] leading-[24px] text-[#0F172A] tracking-[0.0156px]">
                                {mod.title}
                              </h3>
                              <span className="font-normal text-[13px] sm:text-[14px] leading-[20px] text-[#94A3B8]">
                                {mod.lessonsCount} lessons • {mod.duration}
                              </span>
                            </div>

                            {/* Module 5 New Pill in Completed Figma Node 112:16127 */}
                            {mod.id === 5 && isCompleted && (
                              <div className="bg-[#DFFFE9] rounded-[8px] px-[8px] py-[4px] flex items-center justify-center shrink-0">
                                <span className="font-bold text-[13px] sm:text-[14px] leading-none text-[#008A2E]">
                                  New
                                </span>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Chevron Collapse Indicator */}
                        <div
                          className={`size-[36px] rounded-full flex items-center justify-center shrink-0 transition-transform duration-200 ${
                            isOpen ? 'bg-[#EFF6FF]' : 'bg-[#F8FAFC]'
                          }`}
                        >
                          <svg
                            width="14"
                            height="14"
                            viewBox="0 0 14 14"
                            fill="none"
                            className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                          >
                            <path
                              d="M2.5 5.5L7 10L11.5 5.5"
                              stroke={isOpen ? '#5A198F' : '#94A3B8'}
                              strokeWidth="1.8"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </div>
                      </button>

                      {/* Expanded Lessons Content */}
                      {isOpen && mod.lessons && mod.lessons.length > 0 && (
                        <div className="border-t border-[#F1F5F9] px-[20px] sm:px-[28px] py-[8px] bg-white flex flex-col divide-y divide-[#F8FAFC]">
                          {mod.lessons.map((lesson) => {
                            // If completed state is active, all module lessons are checked!
                            const isLessonDone = isCompleted || lesson.status === 'completed';

                            return (
                              <div
                                key={lesson.id}
                                onClick={() => {
                                  advanceProgress();
                                  navigate(`/courses/${id || 'data_analysis'}/video`);
                                }}
                                className="py-[16px] flex items-center justify-between gap-4 hover:bg-slate-50/60 px-2 rounded-lg transition-colors cursor-pointer group"
                                title="Click to watch video lesson"
                              >
                                <div className="flex items-center gap-[16px]">
                                  {/* Status Icon */}
                                  {isLessonDone ? (
                                    <div className="size-[36px] bg-[#F0FDF4] border border-[rgba(0,0,0,0.08)] rounded-[8px] flex items-center justify-center shrink-0 shadow-xs">
                                      <img
                                        src="/images/enrolled/lesson-check-green.svg"
                                        alt="Completed"
                                        className="w-[13px] h-[14px]"
                                      />
                                    </div>
                                  ) : lesson.status === 'in-progress' ? (
                                    <div className="size-[36px] bg-[#EFF6FF] border border-[rgba(0,0,0,0.08)] rounded-[8px] flex items-center justify-center shrink-0 shadow-xs">
                                      <img
                                        src="/images/enrolled/lesson-play-blue.svg"
                                        alt="In Progress"
                                        className="w-[11px] h-[14px]"
                                      />
                                    </div>
                                  ) : (
                                    <div className="size-[36px] bg-[#F1F5F9] border border-[rgba(0,0,0,0.08)] rounded-[8px] flex items-center justify-center shrink-0 shadow-xs">
                                      <img
                                        src="/images/enrolled/lesson-cam-gray.svg"
                                        alt="Video Lesson"
                                        className="w-[16px] h-[14px]"
                                      />
                                    </div>
                                  )}

                                  <div className="flex flex-col gap-[2px]">
                                    <span
                                      className={`font-semibold text-[14px] leading-[20px] transition-colors ${
                                        isLessonDone
                                          ? 'text-[#1E293B] group-hover:text-[#5A198F]'
                                          : 'text-[#475569] group-hover:text-[#1E293B]'
                                      }`}
                                    >
                                      {lesson.title}
                                    </span>
                                    <span className="font-normal text-[12px] leading-[16px] text-[#94A3B8]">
                                      {isLessonDone ? 'Video Lesson • Completed' : lesson.type}
                                    </span>
                                  </div>
                                </div>

                                <span className="font-medium text-[14px] leading-[20px] text-[#94A3B8] tracking-[0.2px] shrink-0">
                                  {lesson.duration}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      )}

                      {/* Sub-Accordion: More Attachments */}
                      {isOpen && mod.attachments && mod.attachments.length > 0 && (
                        <div className="border-t border-[rgba(0,0,0,0.15)] flex flex-col w-full bg-[#FAFAFC]/40">
                          <button
                            type="button"
                            onClick={() => toggleAttachments(mod.id)}
                            className="w-full px-[24px] sm:px-[28px] py-[18px] sm:py-[20px] flex items-center justify-between text-start cursor-pointer hover:bg-slate-100/50 transition-colors"
                          >
                            <div className="flex items-center gap-[16px]">
                              <img
                                src="/images/enrolled/layer-icon.svg"
                                alt=""
                                className="size-[24px] shrink-0"
                              />
                              <h4 className="font-bold text-[15px] sm:text-[16px] leading-[24px] text-[#0F172A] tracking-[0.0313px]">
                                Module {mod.id}: More Attachments
                              </h4>
                            </div>

                            <div
                              className={`size-[36px] rounded-full flex items-center justify-center shrink-0 transition-transform duration-200 ${
                                isAttachmentsOpen ? 'bg-[#EFF6FF]' : 'bg-[#F8FAFC]'
                              }`}
                            >
                              <svg
                                width="14"
                                height="14"
                                viewBox="0 0 14 14"
                                fill="none"
                                className={`transition-transform duration-200 ${isAttachmentsOpen ? 'rotate-180' : ''}`}
                              >
                                <path
                                  d="M2.5 5.5L7 10L11.5 5.5"
                                  stroke={isAttachmentsOpen ? '#5A198F' : '#94A3B8'}
                                  strokeWidth="1.8"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                              </svg>
                            </div>
                          </button>

                          {isAttachmentsOpen && (
                            <div className="border-t border-[#F1F5F9] px-[20px] sm:px-[28px] py-[8px] bg-white flex flex-col divide-y divide-[#F8FAFC]">
                              {mod.attachments.map((att) => (
                                <div
                                  key={att.id}
                                  className="py-[16px] flex items-center justify-between gap-4 hover:bg-slate-50/60 px-2 rounded-lg transition-colors"
                                >
                                  <div className="flex items-center gap-[16px]">
                                    <div className="size-[36px] sm:size-[40px] flex items-center justify-center shrink-0">
                                      <img
                                        src={att.iconSrc}
                                        alt={att.typeText}
                                        className="h-[36px] w-[32px] object-contain"
                                      />
                                    </div>

                                    <div className="flex flex-col gap-[2px]">
                                      <span className="font-semibold text-[14px] leading-[20px] text-[#1E293B]">
                                        {att.title}
                                      </span>
                                      <span className="font-normal text-[12px] leading-[16px] text-[#94A3B8]">
                                        {att.typeText}
                                      </span>
                                    </div>
                                  </div>

                                  <button
                                    type="button"
                                    onClick={() => handleDownload(att.title)}
                                    className="size-[34px] flex items-center justify-center rounded-lg hover:bg-purple-50 transition-colors cursor-pointer group shrink-0"
                                    title={`Download ${att.title}`}
                                  >
                                    <img
                                      src="/images/enrolled/download-icon.svg"
                                      alt="Download"
                                      className="size-[34px] group-hover:scale-105 transition-transform"
                                    />
                                  </button>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right Column: "You're Enrolled / Finished" Gauge Card & "Course Content" Checklist Card */}
            <div className="w-full lg:w-[416px] xl:w-[444px] shrink-0 flex flex-col gap-[37px]">
              {/* CARD 1: DYNAMIC PROGRESS CARD */}
              {isCompleted ? (
                /* ========================================================================= */
                /* COMPLETED STATE: "You're Finished" (Figma node 112:15799 / 112:16134)     */
                /* ========================================================================= */
                <div className="bg-[#F4F4F4] rounded-[36px] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] p-[24px] sm:p-[28px] flex flex-col gap-[28px] relative overflow-hidden w-full flow-scale-in">
                  {/* Header: You're Finished + Star Icon (Figma node 112:16138) */}
                  <div className="flex items-center justify-between w-full">
                    <h2 className="font-bold text-[34px] sm:text-[40px] leading-none text-black tracking-tight">
                      You're Finished
                    </h2>
                    <img
                      src="/images/enrolled/star-icon.svg"
                      alt=""
                      className="size-[32px] shrink-0"
                    />
                  </div>

                  {/* Green Donut Gauge Progress Ring with "Completed" text (Figma node 112:16141) */}
                  <div
                    onClick={advanceProgress}
                    className="relative mx-auto size-[236px] flex items-center justify-center my-2 cursor-pointer group hover:scale-102 transition-transform"
                    title="Click to cycle / reset progress"
                  >
                    <img
                      src="/images/enrolled/donut-completed-green.svg"
                      alt="Completed Course gauge: 100%"
                      className="size-full object-contain pointer-events-none select-none"
                    />
                    {/* Gauge Center Text */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-center select-none">
                      <span className="font-bold text-[24px] leading-[1.2] text-black">
                        Completed
                      </span>
                    </div>
                  </div>

                  {/* Finished & Scored Metrics (Figma node 112:16146) */}
                  <div className="flex flex-col gap-[24px] w-full text-[17px] sm:text-[18px] font-medium text-black">
                    <div className="flex items-center justify-between w-full">
                      <span>Finished</span>
                      <span className="text-end font-semibold text-[#1E293B]">19 lessons / 18 hours</span>
                    </div>
                    <div className="flex items-center justify-between w-full">
                      <span>Scored</span>
                      <span className="text-end font-semibold text-[#1E293B]">95 %</span>
                    </div>
                  </div>

                  {/* Badges Row (Figma node 112:16153) */}
                  <div className="flex flex-wrap items-center gap-[8px] pt-2">
                    <div className="bg-[#EFF6FF] rounded-full px-[16px] py-[8px] flex items-center gap-[8px] shrink-0">
                      <img src="/images/enrolled/clock-icon.svg" alt="" className="size-[14px]" />
                      <span className="font-semibold text-[14px] leading-[20px] text-[#8B5DB0]">
                        8 Weeks
                      </span>
                    </div>

                    <div className="bg-[#EFF6FF] rounded-full px-[16px] py-[8px] flex items-center gap-[8px] shrink-0">
                      <img src="/images/enrolled/signal-icon.svg" alt="" className="h-[14px] w-[12px]" />
                      <span className="font-semibold text-[14px] leading-[20px] text-[#8B5DB0]">
                        Intermediate
                      </span>
                    </div>

                    <div className="bg-[#EFF6FF] rounded-full px-[16px] py-[8px] flex items-center gap-[8px] shrink-0">
                      <img src="/images/enrolled/tag-layer-icon.svg" alt="" className="size-[14px]" />
                      <span className="font-semibold text-[14px] leading-[20px] text-[#8B5DB0]">
                        Data Analytics
                      </span>
                    </div>
                  </div>
                </div>
              ) : (
                /* ========================================================================= */
                /* IN-PROGRESS STATE: "You're Enrolled" (Figma node 159:12028)               */
                /* ========================================================================= */
                <div className="bg-[#F4F4F4] rounded-[36px] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] p-[24px] sm:p-[28px] flex flex-col gap-[28px] relative overflow-hidden w-full flow-scale-in">
                  {/* Header: You're Enrolled + Star Icon */}
                  <div className="flex items-center justify-between w-full">
                    <h2 className="font-bold text-[34px] sm:text-[40px] leading-none text-black tracking-tight">
                      You're Enrolled
                    </h2>
                    <img
                      src="/images/enrolled/star-icon.svg"
                      alt=""
                      className="size-[32px] shrink-0"
                    />
                  </div>

                  {/* Donut Gauge Progress Ring */}
                  <div
                    onClick={advanceProgress}
                    className="relative mx-auto size-[236px] flex items-center justify-center my-2 cursor-pointer group hover:scale-102 transition-transform"
                    title="Click to advance progress"
                  >
                    <img
                      src="/images/enrolled/donut-progress-chart.svg"
                      alt={`Course completion gauge: ${completedCount} / 32 Lessons completed`}
                      className="size-full object-contain pointer-events-none select-none"
                    />
                    {/* Gauge Center Text */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-center select-none">
                      <span className="font-bold text-[22px] sm:text-[24px] leading-[1.2] text-black">
                        {completedCount} / 32
                      </span>
                      <span className="font-bold text-[15px] sm:text-[16px] leading-[1.2] text-black">
                        Lesson Completed
                      </span>
                    </div>
                  </div>

                  {/* Course Progress Bar & Metrics */}
                  <div className="flex flex-col gap-[24px] w-full">
                    <div className="flex flex-col gap-[14px] w-full">
                      <h3 className="font-bold text-[24px] leading-[1.2] text-[#3B0454]">
                        Course Progress
                      </h3>

                      {/* Progress Bar Row */}
                      <div className="flex items-center gap-[12px] w-full">
                        <div className="bg-[#F4F0F8] border border-[#AE8FC8] h-[12px] rounded-full overflow-hidden flex-1 relative">
                          <div
                            className="h-full rounded-full bg-gradient-to-r from-[#3B0454] to-[#804A8A] flow-progress-bar"
                            style={{ width: `${progressPercent}%` }}
                          />
                        </div>
                        <span className="font-medium text-[24px] leading-none text-[#5C1D87] shrink-0 w-[58px] text-end">
                          {progressPercent}%
                        </span>
                      </div>
                    </div>

                    {/* Remaining / Finished Breakdown */}
                    <div className="flex flex-col gap-[16px] w-full text-[17px] sm:text-[18px] font-medium text-black">
                      <div className="flex items-center justify-between w-full">
                        <span>Remaining</span>
                        <span className="text-end font-semibold text-[#1E293B]">
                          {Math.max(0, 32 - completedCount)} lessons / {Math.max(1, Math.round(18 * (1 - progressPercent / 100)))} hours
                        </span>
                      </div>
                      <div className="flex items-center justify-between w-full">
                        <span>Finished</span>
                        <span className="text-end font-semibold text-[#1E293B]">
                          {completedCount} lessons / {Math.max(1, Math.round(18 * (progressPercent / 100)))} hours
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Badges Row */}
                  <div className="flex flex-wrap items-center gap-[8px] pt-2">
                    <div className="bg-[#EFF6FF] rounded-full px-[16px] py-[8px] flex items-center gap-[8px] shrink-0">
                      <img src="/images/enrolled/clock-icon.svg" alt="" className="size-[14px]" />
                      <span className="font-semibold text-[14px] leading-[20px] text-[#8B5DB0]">
                        8 Weeks
                      </span>
                    </div>

                    <div className="bg-[#EFF6FF] rounded-full px-[16px] py-[8px] flex items-center gap-[8px] shrink-0">
                      <img src="/images/enrolled/signal-icon.svg" alt="" className="h-[14px] w-[12px]" />
                      <span className="font-semibold text-[14px] leading-[20px] text-[#8B5DB0]">
                        Intermediate
                      </span>
                    </div>

                    <div className="bg-[#EFF6FF] rounded-full px-[16px] py-[8px] flex items-center gap-[8px] shrink-0">
                      <img src="/images/enrolled/tag-layer-icon.svg" alt="" className="size-[14px]" />
                      <span className="font-semibold text-[14px] leading-[20px] text-[#8B5DB0]">
                        Data Analytics
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* CARD 2: Course Content Checklist Drawer Card */}
              <div className="bg-[#F4F4F4] rounded-[36px] drop-shadow-[0px_4px_2px_rgba(0,0,0,0.25)] p-[24px] sm:p-[28px] flex flex-col gap-[24px] w-full">
                {/* Course Content Header */}
                <div className="flex flex-col gap-[8px] w-full">
                  <button
                    type="button"
                    onClick={() => setIsCourseContentOpen((prev) => !prev)}
                    className="flex items-center justify-between w-full cursor-pointer select-none group text-left"
                    title={isCourseContentOpen ? 'Collapse Course Content' : 'Expand Course Content'}
                  >
                    <h3 className="font-bold text-[18px] leading-[28px] text-[#22023C] font-['Inter'] group-hover:text-[#5A198F] transition-colors">
                      Course Content
                    </h3>
                    <div className="size-[24px] flex items-center justify-center group-hover:bg-black/5 rounded-full transition-colors cursor-pointer">
                      <img
                        src="/images/enrolled/chevron-down-purple.svg"
                        alt=""
                        className={`w-[14px] h-[19px] transition-transform duration-300 ${
                          isCourseContentOpen ? 'rotate-180' : ''
                        }`}
                      />
                    </div>
                  </button>

                  {/* Module Progress text & Bar */}
                  {isCourseContentOpen && (
                    <>
                      <div className="flex items-center justify-between pt-[4px] w-full text-[12px] font-['Inter']">
                        <span className="text-[#672B97] font-normal">Module Progress</span>
                        <span className="text-[#8B5DB0] font-semibold">
                          {isCompleted ? '19/19 lessons' : `${completedCount}/19 lessons`}
                        </span>
                      </div>

                      <div className="bg-[#F4F0F8] border border-[#AE8FC8] h-[8px] rounded-full overflow-hidden w-full relative">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-[#3B0454] to-[#804A8A] transition-all duration-500"
                          style={{ width: `${isCompleted ? 100 : Math.round((completedCount / 19) * 100)}%` }}
                        />
                      </div>
                    </>
                  )}
                </div>

                {/* Modules Checklist */}
                {isCourseContentOpen && (
                  <div className="flex flex-col gap-[20px] w-full font-['Inter']">
                    {/* Module 1: Foundations (Completed) */}
                    <div className="flex flex-col gap-[10px] w-full">
                      <div className="flex items-center gap-[8px]">
                        <div className="size-[20px] bg-[#D2C1E1] border border-[rgba(174,143,200,0.67)] rounded-full flex items-center justify-center shrink-0">
                          <img src="/images/enrolled/module-check-circle.svg" alt="" className="w-[8px] h-[9px]" />
                        </div>
                        <h4 className="font-semibold text-[14px] leading-[20px] text-[#8B5DB0]">
                          Module 1: Foundations
                        </h4>
                      </div>

                      <div className="flex flex-col gap-[4px] pl-[4px]">
                        <div
                          onClick={() => navigate(`/courses/${id || 'data-analysis-fundamentals'}/video?lesson=1-1`)}
                          className="p-[10px] rounded-[8px] flex items-center gap-[12px] hover:bg-black/5 transition-colors cursor-pointer group"
                          title="Watch Intro to UX Thinking"
                        >
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              advanceProgress();
                            }}
                            className="size-[32px] bg-[#D2C1E1] hover:bg-[#c3aed4] border border-[rgba(174,143,200,0.67)] rounded-[6px] flex items-center justify-center shrink-0 cursor-pointer active:scale-95 transition-all"
                            title="Completed - click to toggle"
                          >
                            <img src="/images/enrolled/module-check-square.svg" alt="" className="w-[11px] h-[12px]" />
                          </button>
                          <div className="flex flex-col flex-1 min-w-0">
                            <span className="text-[14px] text-[#22023C] group-hover:text-[#5A198F] font-normal leading-[20px] truncate transition-colors">
                              Intro to UX Thinking
                            </span>
                            <span className="text-[12px] text-[#4B5563] leading-[16px]">8 min · Completed</span>
                          </div>
                        </div>

                        <div
                          onClick={() => navigate(`/courses/${id || 'data-analysis-fundamentals'}/video?lesson=1-2`)}
                          className="p-[10px] rounded-[8px] flex items-center gap-[12px] hover:bg-black/5 transition-colors cursor-pointer group"
                          title="Watch User Research Basics"
                        >
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              advanceProgress();
                            }}
                            className="size-[32px] bg-[#D2C1E1] hover:bg-[#c3aed4] border border-[rgba(174,143,200,0.67)] rounded-[6px] flex items-center justify-center shrink-0 cursor-pointer active:scale-95 transition-all"
                            title="Completed - click to toggle"
                          >
                            <img src="/images/enrolled/module-check-square.svg" alt="" className="w-[11px] h-[12px]" />
                          </button>
                          <div className="flex flex-col flex-1 min-w-0">
                            <span className="text-[14px] text-[#22023C] group-hover:text-[#5A198F] font-normal leading-[20px] truncate transition-colors">
                              User Research Basics
                            </span>
                            <span className="text-[12px] text-[#4B5563] leading-[16px]">15 min · Completed</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Module 2: Wireframing (Completed) */}
                    <div className="flex flex-col gap-[10px] w-full">
                      <div className="flex items-center gap-[8px]">
                        <div className="size-[20px] bg-[#D2C1E1] border border-[rgba(174,143,200,0.67)] rounded-full flex items-center justify-center shrink-0">
                          <img src="/images/enrolled/module-check-circle.svg" alt="" className="w-[8px] h-[9px]" />
                        </div>
                        <h4 className="font-semibold text-[14px] leading-[20px] text-[#22023C]">
                          Module 2: Wireframing
                        </h4>
                      </div>

                      <div className="flex flex-col gap-[4px] pl-[4px]">
                        <div
                          onClick={() => navigate(`/courses/${id || 'data-analysis-fundamentals'}/video?lesson=2-1`)}
                          className="p-[10px] rounded-[8px] flex items-center gap-[12px] hover:bg-black/5 transition-colors cursor-pointer group"
                          title="Watch Low-Fidelity Sketches"
                        >
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              advanceProgress();
                            }}
                            className="size-[32px] bg-[#D2C1E1] hover:bg-[#c3aed4] border border-[rgba(174,143,200,0.67)] rounded-[6px] flex items-center justify-center shrink-0 cursor-pointer active:scale-95 transition-all"
                            title="Completed - click to toggle"
                          >
                            <img src="/images/enrolled/module-check-square.svg" alt="" className="w-[11px] h-[12px]" />
                          </button>
                          <div className="flex flex-col flex-1 min-w-0">
                            <span className="text-[14px] text-[#22023C] group-hover:text-[#5A198F] font-normal leading-[20px] truncate transition-colors">
                              Low-Fidelity Sketches
                            </span>
                            <span className="text-[12px] text-[#4B5563] leading-[16px]">12 min · Completed</span>
                          </div>
                        </div>

                        <div
                          onClick={() => navigate(`/courses/${id || 'data-analysis-fundamentals'}/video?lesson=2-2`)}
                          className="p-[10px] rounded-[8px] flex items-center gap-[12px] hover:bg-black/5 transition-colors cursor-pointer group"
                          title="Watch Digital Wireframes"
                        >
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              advanceProgress();
                            }}
                            className="size-[32px] bg-[#D2C1E1] hover:bg-[#c3aed4] border border-[rgba(174,143,200,0.67)] rounded-[6px] flex items-center justify-center shrink-0 cursor-pointer active:scale-95 transition-all"
                            title="Completed - click to toggle"
                          >
                            <img src="/images/enrolled/module-check-square.svg" alt="" className="w-[11px] h-[12px]" />
                          </button>
                          <div className="flex flex-col flex-1 min-w-0">
                            <span className="text-[14px] text-[#22023C] group-hover:text-[#5A198F] font-normal leading-[20px] truncate transition-colors">
                              Digital Wireframes
                            </span>
                            <span className="text-[12px] text-[#4B5563] leading-[16px]">20 min · Completed</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Module 3: Prototyping */}
                    <div className="flex flex-col gap-[10px] w-full">
                      <div className="flex items-center gap-[8px]">
                        <div className="size-[20px] bg-[rgba(124,92,255,0.15)] border border-[rgba(124,92,255,0.4)] rounded-full flex items-center justify-center shrink-0">
                          <div className="size-[6px] bg-[#22023C] rounded-full" />
                        </div>
                        <h4 className="font-semibold text-[14px] leading-[20px] text-[#22023C]">
                          Module 3: Prototyping
                        </h4>
                      </div>

                      <div className="flex flex-col gap-[4px] pl-[4px]">
                        {/* Lesson 1 */}
                        <div
                          onClick={() => navigate(`/courses/${id || 'data-analysis-fundamentals'}/video?lesson=3-1`)}
                          className="p-[10px] rounded-[8px] flex items-center gap-[12px] hover:bg-black/5 transition-colors cursor-pointer group"
                          title="Watch Prototyping Principles"
                        >
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              advanceProgress();
                            }}
                            className="size-[32px] bg-[#D2C1E1] hover:bg-[#c3aed4] border border-[rgba(174,143,200,0.67)] rounded-[6px] flex items-center justify-center shrink-0 cursor-pointer active:scale-95 transition-all"
                            title="Completed - click to toggle"
                          >
                            <img src="/images/enrolled/module-check-square.svg" alt="" className="w-[11px] h-[12px]" />
                          </button>
                          <div className="flex flex-col flex-1 min-w-0">
                            <span className="text-[14px] text-[#22023C] group-hover:text-[#5A198F] font-normal leading-[20px] truncate transition-colors">
                              Prototyping Principles
                            </span>
                            <span className="text-[12px] text-[#4B5563] leading-[16px]">10 min · Completed</span>
                          </div>
                        </div>

                        {/* Lesson 2 (Active Playing Lesson or Completed) */}
                        {isCompleted ? (
                          <div
                            onClick={() => navigate(`/courses/${id || 'data-analysis-fundamentals'}/video?lesson=3-2`)}
                            className="p-[10px] rounded-[8px] flex items-center gap-[12px] hover:bg-black/5 transition-colors cursor-pointer group"
                            title="Watch Building Interactive Prototypes"
                          >
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                advanceProgress();
                              }}
                              className="size-[32px] bg-[#D2C1E1] hover:bg-[#c3aed4] border border-[rgba(174,143,200,0.67)] rounded-[6px] flex items-center justify-center shrink-0 cursor-pointer active:scale-95 transition-all"
                              title="Completed - click to toggle"
                            >
                              <img src="/images/enrolled/module-check-square.svg" alt="" className="w-[11px] h-[12px]" />
                            </button>
                            <div className="flex flex-col flex-1 min-w-0">
                              <span className="text-[14px] text-[#22023C] group-hover:text-[#5A198F] font-normal leading-[20px] truncate transition-colors">
                                Building Interactive Prototypes
                              </span>
                              <span className="text-[12px] text-[#4B5563] leading-[16px]">10 min · Completed</span>
                            </div>
                          </div>
                        ) : (
                          <div
                            onClick={() => {
                              setActiveContentLesson('interactive-proto');
                              navigate(`/courses/${id || 'data-analysis-fundamentals'}/video?lesson=3-2`);
                            }}
                            className={`p-[10px] rounded-[8px] flex items-center gap-[12px] transition-all cursor-pointer ${
                              activeContentLesson === 'interactive-proto'
                                ? 'bg-[rgba(124,92,255,0.1)] border border-[rgba(124,92,255,0.3)] shadow-xs'
                                : 'hover:bg-purple-50/50'
                            }`}
                            title="Click to watch this active lesson"
                          >
                            <div className="size-[32px] bg-[#5A198F] rounded-[6px] flex items-center justify-center shrink-0 shadow-xs">
                              <img src="/images/enrolled/module-play-square.svg" alt="Playing" className="w-[9px] h-[12px]" />
                            </div>

                            <div className="flex flex-col flex-1 min-w-0">
                              <span className="text-[14px] text-[#22023C] font-semibold leading-[20px] truncate">
                                Building Interactive Prototypes
                              </span>
                              <span className="text-[12px] text-[#22023C] font-normal leading-[16px]">
                                10 min · Remaining
                              </span>
                            </div>

                            <div className="flex items-end gap-[2px] h-[16px] shrink-0">
                              <div className="w-[2px] h-[8px] bg-[#22023C] rounded-full animate-pulse" />
                              <div className="w-[2px] h-[16px] bg-[#22023C] rounded-full animate-pulse [animation-delay:150ms]" />
                              <div className="w-[2px] h-[12px] bg-[#22023C] rounded-full animate-pulse [animation-delay:300ms]" />
                            </div>
                          </div>
                        )}

                        {/* Lesson 3 */}
                        <div
                          onClick={() => navigate(`/courses/${id || 'data-analysis-fundamentals'}/video?lesson=3-3`)}
                          className="p-[10px] rounded-[8px] flex items-center gap-[12px] hover:bg-black/5 transition-colors cursor-pointer group"
                          title="Watch Overlays & Micro-interactions"
                        >
                          {isCompleted ? (
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                advanceProgress();
                              }}
                              className="size-[32px] bg-[#D2C1E1] hover:bg-[#c3aed4] border border-[rgba(174,143,200,0.67)] rounded-[6px] flex items-center justify-center shrink-0 cursor-pointer active:scale-95 transition-all"
                            >
                              <img src="/images/enrolled/module-check-square.svg" alt="" className="w-[11px] h-[12px]" />
                            </button>
                          ) : (
                            <div className="size-[32px] bg-[#F4F0F8] border border-[#AE8FC8] rounded-[6px] flex items-center justify-center shrink-0 font-semibold text-[12px] text-[#6B7280]">
                              04
                            </div>
                          )}
                          <div className="flex flex-col flex-1 min-w-0">
                            <span className="text-[14px] text-[#22023C] group-hover:text-[#5A198F] font-normal leading-[20px] truncate transition-colors">
                              Overlays & Micro-interactions
                            </span>
                            <span className="text-[12px] text-[#4B5563] leading-[16px]">
                              18 min
                            </span>
                          </div>
                        </div>

                        {/* Lesson 4 */}
                        <div
                          onClick={() => navigate(`/courses/${id || 'data-analysis-fundamentals'}/video?lesson=3-4`)}
                          className="p-[10px] rounded-[8px] flex items-center gap-[12px] hover:bg-black/5 transition-colors cursor-pointer group"
                          title="Watch Prototype Testing"
                        >
                          {isCompleted ? (
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                advanceProgress();
                              }}
                              className="size-[32px] bg-[#D2C1E1] hover:bg-[#c3aed4] border border-[rgba(174,143,200,0.67)] rounded-[6px] flex items-center justify-center shrink-0 cursor-pointer active:scale-95 transition-all"
                            >
                              <img src="/images/enrolled/module-check-square.svg" alt="" className="w-[11px] h-[12px]" />
                            </button>
                          ) : (
                            <div className="size-[32px] bg-[#F4F0F8] border border-[#AE8FC8] rounded-[6px] flex items-center justify-center shrink-0 font-semibold text-[12px] text-[#6B7280]">
                              05
                            </div>
                          )}
                          <div className="flex flex-col flex-1 min-w-0">
                            <span className="text-[14px] text-[#22023C] group-hover:text-[#5A198F] font-normal leading-[20px] truncate transition-colors">
                              Prototype Testing
                            </span>
                            <span className="text-[12px] text-[#4B5563] leading-[16px]">
                              14 min
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Module 4: Handoff & Dev */}
                    <div className="flex flex-col gap-[10px] w-full">
                      <div className="flex items-center gap-[8px]">
                        {isCompleted ? (
                          <div className="size-[20px] bg-[rgba(124,92,255,0.15)] border border-[rgba(124,92,255,0.4)] rounded-full flex items-center justify-center shrink-0">
                            <div className="size-[6px] bg-[#22023C] rounded-full" />
                          </div>
                        ) : (
                          <div className="size-[20px] bg-[#F4F0F8] border border-[#8B5DB0] rounded-full flex items-center justify-center shrink-0">
                            <img src="/images/enrolled/module-lock-circle.svg" alt="" className="w-[8px] h-[9px]" />
                          </div>
                        )}
                        <h4 className="font-semibold text-[14px] leading-[20px] text-[#22023C]">
                          Module 4: Handoff & Dev
                        </h4>
                      </div>

                      <div className={`flex flex-col gap-[4px] pl-[4px] ${isCompleted ? '' : 'opacity-80'}`}>
                        {/* Lesson 1 */}
                        <div
                          onClick={() => navigate(`/courses/${id || 'data-analysis-fundamentals'}/video?lesson=4-1`)}
                          className="p-[10px] rounded-[8px] flex items-center gap-[12px] hover:bg-black/5 transition-colors cursor-pointer group"
                          title="Watch Design Specs & Tokens"
                        >
                          {isCompleted ? (
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                advanceProgress();
                              }}
                              className="size-[32px] bg-[#D2C1E1] hover:bg-[#c3aed4] border border-[rgba(174,143,200,0.67)] rounded-[6px] flex items-center justify-center shrink-0 cursor-pointer active:scale-95 transition-all"
                            >
                              <img src="/images/enrolled/module-check-square.svg" alt="" className="w-[11px] h-[12px]" />
                            </button>
                          ) : (
                            <div className="size-[32px] bg-[#F4F0F8] border border-[#8B5DB0] rounded-[6px] flex items-center justify-center shrink-0">
                              <img src="/images/enrolled/module-lock-square.svg" alt="" className="w-[11px] h-[12px]" />
                            </div>
                          )}
                          <div className="flex flex-col flex-1 min-w-0">
                            <span className="text-[14px] text-[#22023C] group-hover:text-[#5A198F] font-normal leading-[20px] truncate transition-colors">
                              Design Specs & Tokens
                            </span>
                            <span className="text-[12px] text-[#4B5563] leading-[16px]">
                              16 min
                            </span>
                          </div>
                        </div>

                        {/* Lesson 2 */}
                        <div
                          onClick={() => navigate(`/courses/${id || 'data-analysis-fundamentals'}/video?lesson=4-2`)}
                          className="p-[10px] rounded-[8px] flex items-center gap-[12px] hover:bg-black/5 transition-colors cursor-pointer group"
                          title="Watch Developer Collaboration"
                        >
                          {isCompleted ? (
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                advanceProgress();
                              }}
                              className="size-[32px] bg-[#D2C1E1] hover:bg-[#c3aed4] border border-[rgba(174,143,200,0.67)] rounded-[6px] flex items-center justify-center shrink-0 cursor-pointer active:scale-95 transition-all"
                            >
                              <img src="/images/enrolled/module-check-square.svg" alt="" className="w-[11px] h-[12px]" />
                            </button>
                          ) : (
                            <div className="size-[32px] bg-[#F4F0F8] border border-[#8B5DB0] rounded-[6px] flex items-center justify-center shrink-0">
                              <img src="/images/enrolled/module-lock-square.svg" alt="" className="w-[11px] h-[12px]" />
                            </div>
                          )}
                          <div className="flex flex-col flex-1 min-w-0">
                            <span className="text-[14px] text-[#22023C] group-hover:text-[#5A198F] font-normal leading-[20px] truncate transition-colors">
                              Developer Collaboration
                            </span>
                            <span className="text-[12px] text-[#4B5563] leading-[16px]">
                              22 min
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </main>
        ) : (
          /* ========================================================================= */
          /* PRE-ENROLLMENT VIEW (Figma node 112:9768)                                   */
          /* ========================================================================= */
          <main className="flex-1 max-w-[1250px] flex flex-col gap-[36px] w-full flow-scale-in">
            {/* Top Hero Section: Left Text + Right Video Showcase (Figma node 112:9801) */}
            <section className="flex flex-col xl:flex-row items-center xl:items-end justify-between gap-8 w-full">
              {/* Left Column (Figma node 112:9803: width 576px) */}
              <div className="flex-1 max-w-[576px] flex flex-col gap-[24px]">
                {/* Heading 1 */}
                <h1 className="font-extrabold text-[36px] sm:text-[44px] lg:text-[48px] leading-[44px] sm:leading-[52px] lg:leading-[60px] text-[#0F172A] tracking-[-1.2px]">
                  Master Data Analysis from Scratch to Insights
                </h1>

                {/* Description & Instructor */}
                <div className="flex flex-col gap-[16px]">
                  <p className="font-normal text-[16px] sm:text-[18px] leading-[26px] sm:leading-[29.25px] text-[#64748B]">
                    Learn how to analyze data, create interactive dashboards, and turn raw data into meaningful insights using Excel, SQL, Python, and Power BI.
                  </p>

                  <div className="flex items-center gap-[7.25px]">
                    <img
                      src="/images/enrolled/elena-avatar.png"
                      alt="Elena Vasquez"
                      className="size-[23px] rounded-full object-cover shrink-0 border border-slate-200"
                    />
                    <span className="font-medium text-[11px] sm:text-[12px] leading-[14.5px] text-[#475569]">
                      Elena Vasquez - Head of Open Source Applications of aaa Company
                    </span>
                  </div>
                </div>

                {/* Badges Row */}
                <div className="flex flex-wrap items-center gap-3">
                  <div className="bg-[#EFF6FF] rounded-full px-[16px] py-[8px] flex items-center gap-[8px] shrink-0">
                    <img src="/images/enrolled/clock-icon.svg" alt="" className="size-[14px]" />
                    <span className="font-semibold text-[14px] leading-[20px] text-[#8B5DB0]">
                      8 Weeks
                    </span>
                  </div>

                  <div className="bg-[#EFF6FF] rounded-full px-[16px] py-[8px] flex items-center gap-[8px] shrink-0">
                    <img src="/images/enrolled/signal-icon.svg" alt="" className="h-[14px] w-[12px]" />
                    <span className="font-semibold text-[14px] leading-[20px] text-[#8B5DB0]">
                      Intermediate
                    </span>
                  </div>

                  <div className="bg-[#EFF6FF] rounded-full px-[16px] py-[8px] flex items-center gap-[8px] shrink-0">
                    <img src="/images/enrolled/tag-layer-icon.svg" alt="" className="size-[14px]" />
                    <span className="font-semibold text-[14px] leading-[20px] text-[#8B5DB0]">
                      Data Analytics
                    </span>
                  </div>
                </div>

                {/* Social Proof Row: Students & Rating */}
                <div className="flex items-center gap-[16px] flex-wrap pt-[8px]">
                  <div className="flex items-center">
                    <img
                      src="/images/student-avatar-1.png"
                      alt="Student 1"
                      className="size-[40px] rounded-full object-cover border-2 border-white -mr-3 shrink-0 shadow-xs"
                    />
                    <img
                      src="/images/student-avatar-2.png"
                      alt="Student 2"
                      className="size-[40px] rounded-full object-cover border-2 border-white -mr-3 shrink-0 shadow-xs"
                    />
                    <img
                      src="/images/student-avatar-3.png"
                      alt="Student 3"
                      className="size-[40px] rounded-full object-cover border-2 border-white shrink-0 shadow-xs"
                    />
                  </div>

                  <div className="text-[14px] leading-[20px] text-[#1E293B]">
                    <span className="font-bold">4,230+</span>{' '}
                    <span className="font-normal text-[#64748B]">students enrolled</span>
                  </div>

                  <div className="flex items-center gap-[4px]">
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <svg key={i} width="16" height="14" viewBox="0 0 16 14" fill="none">
                          <path
                            d="M8 0L9.8 4.6L14.7 5.1L11.1 8.3L12.1 13.2L8 10.7L3.9 13.2L4.9 8.3L1.3 5.1L6.2 4.6L8 0Z"
                            fill="#FBBF24"
                          />
                        </svg>
                      ))}
                    </div>
                    <span className="font-semibold text-[14px] leading-[20px] text-[#475569] pl-1">
                      4.8
                    </span>
                  </div>
                </div>

                {/* Start Learning CTA Button */}
                <button
                  type="button"
                  onClick={handleEnroll}
                  className="w-[200px] h-[53px] bg-[#3B0454] hover:bg-[#2B023E] active:scale-98 rounded-[7249px] drop-shadow-[0px_4px_2px_rgba(0,0,0,0.25)] flex items-center justify-center gap-[8px] text-white font-semibold text-[16px] leading-[24px] tracking-[0.0625px] transition-all cursor-pointer shadow-md mt-2 flow-glow-pulse"
                >
                  <span>Start Learning</span>
                  <svg width="14" height="16" viewBox="0 0 14 16" fill="none">
                    <path d="M1 8H13M13 8L7 2M13 8L7 14" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
              </div>

              {/* Right Column: Hero Graphic Preview */}
              <div className="w-full xl:w-[674px] relative shrink-0">
                <div className="absolute -top-[24px] -right-[24px] size-[128px] bg-[#8B5DB0] rounded-full opacity-60 blur-2xl pointer-events-none" />
                <div className="absolute -bottom-[32px] -left-[32px] size-[160px] bg-[#D2C1E1] rounded-full opacity-60 blur-3xl pointer-events-none" />

                <div
                  onClick={() => navigate(`/courses/${id || 'data_analysis'}/video`)}
                  className="w-full h-[320px] sm:h-[420px] rounded-[24px] shadow-[0px_25px_50px_-12px_rgba(0,0,0,0.25)] overflow-hidden relative border border-slate-100 bg-[#0E1626] cursor-pointer group"
                  title="Watch course video"
                >
                  <img
                    src="/images/course-detail-hero.png"
                    alt="Modern UI/UX Design System Course Preview"
                    className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500"
                  />

                  <div className="absolute bottom-[24px] left-[24px] backdrop-blur-[6px] bg-white/70 border border-white/80 shadow-[0px_20px_25px_-5px_rgba(0,0,0,0.1),0px_8px_10px_-6px_rgba(0,0,0,0.1)] rounded-[16px] px-[20px] py-[16px] flex items-center gap-[12px]">
                    <div className="size-[44px] bg-[#EFF6FF] rounded-[12px] flex items-center justify-center shrink-0 shadow-xs group-hover:bg-[#5A198F] transition-colors">
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="group-hover:text-white transition-colors">
                        <path d="M4 2.5L13.5 8L4 13.5V2.5Z" fill="currentColor" className="text-[#5A198F] group-hover:text-white" />
                      </svg>
                    </div>

                    <div className="flex flex-col">
                      <span className="font-bold text-[14px] leading-[20px] text-[#1E293B] whitespace-nowrap">
                        32 Video Lessons
                      </span>
                      <span className="font-normal text-[12px] leading-[16px] text-[#6B6D6F] whitespace-nowrap">
                        Lifetime access
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Course Curriculum Section */}
            <section className="flex flex-col gap-[24px] w-full pt-4">
              <div className="flex flex-col gap-[8px]">
                <h2 className="font-extrabold text-[28px] sm:text-[30px] leading-[36px] text-[#0F172A] tracking-[0.0293px]">
                  Course Curriculum
                </h2>
                <p className="font-normal text-[16px] leading-[24px] text-[#536278]">
                  6 modules • 32 lessons • 18 hours total length
                </p>
              </div>

              {/* Modules Accordion List */}
              <div className="flex flex-col gap-[16px] w-full">
                {ENROLLED_MODULES.map((mod) => {
                  const isOpen = !!openModules[mod.id];

                  return (
                    <div
                      key={mod.id}
                      className="bg-white border border-[rgba(0,0,0,0.22)] rounded-[16px] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] overflow-hidden transition-all duration-200"
                    >
                      <button
                        type="button"
                        onClick={() => toggleModule(mod.id)}
                        className="w-full px-[24px] sm:px-[28px] py-[20px] sm:py-[24px] flex items-center justify-between text-start cursor-pointer hover:bg-slate-50/60 transition-colors"
                      >
                        <div className="flex items-center gap-[16px]">
                          <div
                            className={`size-[40px] rounded-full flex items-center justify-center font-bold text-[14px] shrink-0 transition-colors ${
                              isOpen
                                ? 'bg-[#5A198F] text-white shadow-xs'
                                : 'bg-[#F1F5F9] border border-[rgba(0,0,0,0.08)] text-[#64748B]'
                            }`}
                          >
                            {mod.id}
                          </div>

                          <div className="flex flex-col gap-[4px]">
                            <h3 className="font-bold text-[15px] sm:text-[16px] leading-[24px] text-[#0F172A]">
                              {mod.title}
                            </h3>
                            <span className="font-normal text-[13px] sm:text-[14px] leading-[20px] text-[#94A3B8]">
                              {mod.lessonsCount} lessons • {mod.duration}
                            </span>
                          </div>
                        </div>

                        <div
                          className={`size-[36px] rounded-full flex items-center justify-center shrink-0 transition-transform duration-200 ${
                            isOpen ? 'bg-[#EFF6FF]' : 'bg-[#F8FAFC]'
                          }`}
                        >
                          <svg
                            width="14"
                            height="14"
                            viewBox="0 0 14 14"
                            fill="none"
                            className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                          >
                            <path
                              d="M2.5 5.5L7 10L11.5 5.5"
                              stroke={isOpen ? '#5A198F' : '#94A3B8'}
                              strokeWidth="1.8"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </div>
                      </button>

                      {isOpen && mod.lessons && mod.lessons.length > 0 && (
                        <div className="border-t border-[#F1F5F9] px-[24px] sm:px-[28px] py-[8px] bg-white flex flex-col divide-y divide-[#F8FAFC]">
                          {mod.lessons.map((lesson) => (
                            <div
                              key={lesson.id}
                              onClick={() => navigate(`/courses/${id || 'data_analysis'}/video`)}
                              className="py-[16px] flex items-center justify-between gap-4 hover:bg-slate-50/60 px-2 rounded-lg transition-colors cursor-pointer group"
                              title="Watch video lesson"
                            >
                              <div className="flex items-center gap-[16px]">
                                <div className="size-[36px] bg-[#F1F5F9] border border-[rgba(0,0,0,0.08)] rounded-[8px] flex items-center justify-center shrink-0">
                                  <svg width="16" height="14" viewBox="0 0 16 14" fill="none">
                                    <rect x="1" y="2" width="10" height="10" rx="2" stroke="#94A3B8" strokeWidth="1.2" />
                                    <path d="M11 5.5L15 3V11L11 8.5" stroke="#94A3B8" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                                  </svg>
                                </div>

                                <div className="flex flex-col gap-[2px]">
                                  <span className="font-semibold text-[14px] leading-[20px] text-[#475569]">
                                    {lesson.title}
                                  </span>
                                  <span className="font-normal text-[12px] leading-[16px] text-[#94A3B8]">
                                    {lesson.type}
                                  </span>
                                </div>
                              </div>

                              <span className="font-medium text-[14px] leading-[20px] text-[#94A3B8] tracking-[0.2px] shrink-0">
                                {lesson.duration}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </section>

            {/* Bottom Banner: Ready to start your design journey? */}
            <div className="w-full bg-[#3C0555] rounded-[24px] sm:rounded-[999px] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] px-6 sm:px-12 lg:px-16 py-6 sm:py-0 sm:h-[130px] flex flex-col sm:flex-row items-center justify-between gap-6">
              <div className="flex flex-col gap-[4px] text-center sm:text-start">
                <h3 className="font-extrabold text-[18px] sm:text-[20px] leading-[28px] sm:leading-[32px] text-white">
                  Ready to start your design journey?
                </h3>
                <p className="font-normal text-[14px] sm:text-[16px] leading-[22px] sm:leading-[24px] text-[#DBEAFE]">
                  Enroll Now To Be Able To See The Videos
                </p>
              </div>

              <button
                type="button"
                onClick={handleEnroll}
                className="bg-white hover:bg-slate-100 active:scale-98 rounded-[999px] px-[32px] py-[16px] flex items-center gap-[12px] text-[#3C0555] font-bold text-[16px] leading-[24px] tracking-[0.0313px] transition-all cursor-pointer shadow-md shrink-0 whitespace-nowrap"
              >
                <span>Enroll Now</span>
                <svg width="14" height="16" viewBox="0 0 14 16" fill="none">
                  <path d="M1 8H13M13 8L7 2M13 8L7 14" stroke="#3C0555" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>
          </main>
        )}
      </div>
    </div>
  );
};

export default CourseDetailsPage;
