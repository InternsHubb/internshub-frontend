import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { ROUTES } from '@/constants/routes';
import { getCourseById } from '@/lib/api/courses';
import type { CourseDetailDto } from '@/lib/api/types';
import { getCourseCatalogItem } from '@/data/coursesCatalog';
// Slim sidebar glyphs: the same Figma icons the dashboard sidebar uses ("course details" Frame 10).
import slimCertificate from '@/assets/dashboard/sb-certificate.svg';
import slimChat from '@/assets/dashboard/sb-chat.svg';
import slimCourses from '@/assets/dashboard/sb-courses.svg';
import slimWaves from '@/assets/dashboard/sb-collapsed-waves.svg';
import slimInternship from '@/assets/dashboard/sb-internship.svg';
import slimProgress from '@/assets/dashboard/sb-progress.svg';
import slimSprints from '@/assets/dashboard/sb-sprints.svg';
import slimSquad from '@/assets/dashboard/sb-squad.svg';

function formatDuration(totalSeconds: number): string {
  if (!totalSeconds || totalSeconds <= 0) return 'Self-paced';
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''}${minutes > 0 ? ` ${minutes}m` : ''}`;
  return `${minutes} min`;
}

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

  const [courseDetail, setCourseDetail] = useState<CourseDetailDto | null>(null);
  const [isLoadingDetail, setIsLoadingDetail] = useState<boolean>(true);
  const [detailError, setDetailError] = useState<string | null>(null);

  // Catalog item fallback for all course tracks
  const catalogItem = useMemo(() => getCourseCatalogItem(id), [id]);

  const loadCourseDetail = useCallback(async () => {
    if (!id) {
      setIsLoadingDetail(false);
      return;
    }
    setIsLoadingDetail(true);
    setDetailError(null);
    try {
      const detail = await getCourseById(id);
      setCourseDetail(detail);
      if (detail.isEntitled) {
        setIsEnrolled(true);
      }
    } catch (err) {
      console.warn('Backend course detail unavailable, using catalog fallback:', err);
      if (!catalogItem) {
        setDetailError('Unable to load course details. Please verify your course access or try again.');
      }
    } finally {
      setIsLoadingDetail(false);
    }
  }, [id, catalogItem]);

  useEffect(() => {
    void loadCourseDetail();
  }, [loadCourseDetail]);

  const activeModules = useMemo<EnrolledModule[]>(() => {
    if (courseDetail?.lessons && courseDetail.lessons.length > 0) {
      return [
        {
          id: 1,
          title: courseDetail.title,
          lessonsCount: courseDetail.lessons.length,
          duration: formatDuration(courseDetail.totalDurationSeconds),
          lessons: courseDetail.lessons.map((l) => ({
            id: l.id,
            title: l.title,
            type: 'Video Lesson',
            duration: formatDuration(l.durationSeconds),
            status: l.isCompleted ? 'completed' : 'unstarted',
          })),
        },
      ];
    }
    if (catalogItem?.modules && catalogItem.modules.length > 0) {
      return catalogItem.modules.map((m) => ({
        id: m.id,
        title: m.title,
        lessonsCount: m.lessons.length,
        duration: `${m.lessons.length * 20}m`,
        lessons: m.lessons.map((l, idx) => ({
          id: l.id,
          title: l.title,
          type: 'Video Lesson',
          duration: l.duration,
          status: idx === 0 ? 'completed' : idx === 1 ? 'in-progress' : 'unstarted',
        })),
      }));
    }
    return ENROLLED_MODULES;
  }, [courseDetail, catalogItem]);

  const courseTitle = courseDetail?.title || catalogItem.title;
  const courseTrack = courseDetail?.trackName || catalogItem.trackName;
  const courseDuration = courseDetail ? formatDuration(courseDetail.totalDurationSeconds) : catalogItem.duration;
  const totalLessonsCount = courseDetail ? courseDetail.lessons.length : catalogItem.lessonsCount;

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
    <div className="min-h-screen bg-[#FEFEFE] relative overflow-x-clip font-['Plus_Jakarta_Sans'] pb-16 antialiased selection:bg-[#5A198F]/20 selection:text-[#5A198F] flex flex-col items-start flow-page-enter">
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
      <header className="w-full max-w-[1560px] mx-auto pl-1.5 sm:pl-2 lg:pl-6 pr-4 sm:pr-6 lg:pr-6 pt-3 pb-2 flex flex-wrap xl:flex-nowrap items-center justify-between gap-4">
        {/* Left: Logo & Breadcrumbs */}
        <div className="flex min-w-0 max-w-full items-center gap-6 sm:gap-8 flex-wrap">
          <Link
            to={ROUTES.home}
            className="font-bold text-[24px] leading-none text-[#22023C] hover:opacity-90 transition-opacity whitespace-nowrap"
          >
            Interns HUB
          </Link>

          {/* Breadcrumbs Row */}
          <div className="flex min-w-0 max-w-full items-center gap-2">
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
            <nav className="flex min-w-0 items-center gap-2 text-[14px] font-medium leading-[20px] whitespace-nowrap overflow-x-auto">
              <Link
                to={ROUTES.courses6m}
                className="text-[#94A3B8] hover:text-[#5A198F] transition-colors"
              >
                Courses
              </Link>
              <svg width="8" height="12" viewBox="0 0 8 12" fill="none" className="shrink-0">
                <path d="M1.5 1.5L6 6L1.5 10.5" stroke="#94A3B8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>

              <span className="text-[#94A3B8]">{courseTrack}</span>
              <svg width="8" height="12" viewBox="0 0 8 12" fill="none" className="shrink-0">
                <path d="M1.5 1.5L6 6L1.5 10.5" stroke="#94A3B8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>

              <span className="text-[#4C0585] font-semibold">{courseTitle}</span>
            </nav>
          </div>
        </div>

        {/* Right: Quick Controls & Profile Pill */}
        <div className="flex max-w-full flex-wrap items-center justify-end gap-3 sm:gap-4 xl:shrink-0 xl:flex-nowrap">
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
          <div className="w-[240px] max-w-full sm:w-[261px] h-[62px] bg-[#F4F4F4] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] rounded-[999px] px-[16px] flex items-center gap-[12px] shrink-0 hover:bg-gray-100 transition-colors cursor-pointer">
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

      {/* Loading & Error Status for Course Details */}
      {isLoadingDetail && (
        <div className="w-full max-w-[1560px] mx-auto px-6 py-6 flex items-center justify-center">
          <div className="size-8 animate-spin rounded-full border-3 border-[#5A198F] border-t-transparent" />
        </div>
      )}
      {detailError && (
        <div className="w-full max-w-[1560px] mx-auto px-6 py-3 my-2 bg-[#FFF1F0] border border-[#FFA39E] rounded-xl flex items-center justify-between text-[#CF1322] text-sm">
          <span>{detailError}</span>
          <button
            type="button"
            onClick={() => void loadCourseDetail()}
            className="px-3 py-1 bg-[#5A198F] text-white rounded-md text-xs font-semibold hover:bg-[#471273]"
          >
            Retry
          </button>
        </div>
      )}

      {/* Main Container: Slim Sidebar + Content Layout */}
      <div className="w-full max-w-[1560px] mx-auto pl-1.5 sm:pl-2 lg:pl-6 pr-4 sm:pr-6 lg:pr-6 pt-3 flex gap-[24px] items-start">
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
              <img src={slimInternship} alt="" aria-hidden="true" className="h-[36px] w-auto" />
            </button>

            <button
              type="button"
              onClick={() => setActiveNav('squad')}
              className={`size-[44px] flex items-center justify-center transition-colors cursor-pointer ${
                activeNav === 'squad' ? 'text-white' : 'text-white/80 hover:text-white'
              }`}
              title="My Squad"
            >
              <img src={slimSquad} alt="" aria-hidden="true" className="size-[44px]" />
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveNav('courses');
                navigate(ROUTES.dashboardCourses);
              }}
              className={`w-[44px] h-[43px] rounded-[8px] flex items-center justify-center shadow-md cursor-pointer transition-all ${
                activeNav === 'courses' ? 'bg-gradient-to-r from-[#3A0353] to-[#804A8A]' : 'hover:bg-white/10'
              }`}
              title="Courses"
            >
              <img src={slimCourses} alt="" aria-hidden="true" className="size-[36px]" />
            </button>

            <button
              type="button"
              onClick={() => setActiveNav('sprints')}
              className="size-[36px] flex items-center justify-center text-white/80 hover:text-white transition-colors cursor-pointer"
              title="Sprints"
            >
              <img src={slimSprints} alt="" aria-hidden="true" className="size-[36px]" />
            </button>

            <button
              type="button"
              onClick={() => setActiveNav('progress')}
              className="size-[36px] flex items-center justify-center text-white/80 hover:text-white transition-colors cursor-pointer"
              title="Progress"
            >
              <img src={slimProgress} alt="" aria-hidden="true" className="size-[36px]" />
            </button>

            <button
              type="button"
              onClick={() => setActiveNav('chat')}
              className="size-[44px] flex items-center justify-center text-white/80 hover:text-white transition-colors cursor-pointer"
              title="Chat"
            >
              <img src={slimChat} alt="" aria-hidden="true" className="w-[37px] h-auto" />
            </button>

            <button
              type="button"
              onClick={() => setActiveNav('certificate')}
              className="size-[44px] flex items-center justify-center text-white/80 hover:text-white transition-colors cursor-pointer"
              title="Certificate"
            >
              <img src={slimCertificate} alt="" aria-hidden="true" className="w-[37px] h-auto" />
            </button>
          </nav>

          {/* Theme waves, positioned as in Figma (289×209, overflowing the 118px column). */}
          <img
            src={slimWaves}
            alt=""
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-[66px] -start-[83px] h-[209px] w-[289px] max-w-none rtl:-scale-x-100"
          />
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
                        : `Progress: ${progressPercent}% (${isCompleted ? totalLessonsCount : Math.min(completedCount, totalLessonsCount)}/${totalLessonsCount} lessons) • Click to advance`}
                    </span>
                    <svg className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" viewBox="0 0 16 16" fill="currentColor">
                      <path fillRule="evenodd" d="M6.22 3.22a.75.75 0 0 1 1.06 0l4.25 4.25a.75.75 0 0 1 0 1.06l-4.25 4.25a.75.75 0 0 1-1.06-1.06L9.94 8 6.22 4.28a.75.75 0 0 1 0-1.06z" clipRule="evenodd" />
                    </svg>
                  </div>

                  <h1 className="font-extrabold text-[36px] sm:text-[44px] lg:text-[48px] leading-[44px] sm:leading-[52px] lg:leading-[60px] text-[#0F172A] tracking-[-1.2px]">
                    {courseTitle}
                  </h1>

                  <p className="font-normal text-[16px] sm:text-[18px] leading-[26px] sm:leading-[29.25px] text-[#64748B]">
                    {courseDetail?.description || catalogItem.description}
                  </p>

                  {/* Instructor Row */}
                  <div className="flex items-center gap-[7.25px] h-[23px]">
                    <img
                      src={catalogItem.instructorAvatar || '/images/enrolled/elena-avatar.png'}
                      alt={catalogItem.instructor}
                      className="size-[23px] rounded-full object-cover shrink-0 border border-slate-200"
                    />
                    <span className="font-medium text-[10.15px] sm:text-[11px] leading-[14.5px] text-[#475569] tracking-[0.02px]">
                      {catalogItem.instructor} - Lead Instructor
                    </span>
                  </div>
                </div>

                {/* Course Curriculum Header */}
                <div className="flex flex-col gap-[11px] w-full max-w-[624px] pt-2">
                  <h2 className="font-extrabold text-[28px] sm:text-[30px] leading-[36px] text-[#0F172A] tracking-[0.0293px]">
                    Course Curriculum
                  </h2>
                  <p className="font-normal text-[16px] leading-[24px] text-[#536278]">
                    {activeModules.length} module{activeModules.length > 1 ? 's' : ''} • {totalLessonsCount} lessons • {courseDuration} total length
                  </p>
                </div>
              </div>

              {/* Videos / Modules Accordion List */}
              <div className="flex flex-col gap-[20px] sm:gap-[30px] w-full">
                {activeModules.map((mod) => {
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
                                  navigate(`/courses/${courseDetail ? courseDetail.id : (id || 'data_analysis')}/video?lesson=${lesson.id}`);
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
                          {isCompleted ? `${totalLessonsCount}/${totalLessonsCount} lessons` : `${Math.min(completedCount, totalLessonsCount)}/${totalLessonsCount} lessons`}
                        </span>
                      </div>

                      <div className="bg-[#F4F0F8] border border-[#AE8FC8] h-[8px] rounded-full overflow-hidden w-full relative">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-[#3B0454] to-[#804A8A] transition-all duration-500"
                          style={{ width: `${isCompleted ? 100 : Math.round((Math.min(completedCount, totalLessonsCount) / (totalLessonsCount || 1)) * 100)}%` }}
                        />
                      </div>
                    </>
                  )}
                </div>

                {/* Modules Checklist */}
                {isCourseContentOpen && (
                  <div className="flex flex-col gap-[20px] w-full font-['Inter']">
                    {activeModules.map((module, mIdx) => {
                      const isModDone = isCompleted || mIdx === 0;
                      return (
                        <div key={module.id} className="flex flex-col gap-[10px] w-full">
                          <div className="flex items-center gap-[8px]">
                            <div className={`size-[20px] rounded-full flex items-center justify-center shrink-0 ${isModDone ? 'bg-[#D2C1E1] border border-[rgba(174,143,200,0.67)]' : 'bg-[#F4F0F8] border border-[#8B5DB0]'}`}>
                              {isModDone ? (
                                <img src="/images/enrolled/module-check-circle.svg" alt="" className="w-[8px] h-[9px]" />
                              ) : (
                                <div className="size-1.5 bg-[#8B5DB0] rounded-full" />
                              )}
                            </div>
                            <h4 className="font-semibold text-[14px] leading-[20px] text-[#8B5DB0]">
                              {module.title}
                            </h4>
                          </div>

                          <div className="flex flex-col gap-[4px] pl-[4px]">
                            {module.lessons.map((lesson, lIdx) => {
                              const isDone = isCompleted || (mIdx === 0) || (mIdx === 1 && lIdx === 0);
                              const isCurrent = !isCompleted && (activeContentLesson === lesson.id || (!activeContentLesson && mIdx === 1 && lIdx === 1));

                              return (
                                <div
                                  key={lesson.id}
                                  onClick={() => {
                                    setActiveContentLesson(lesson.id);
                                    navigate(`/courses/${courseDetail ? courseDetail.id : (id || 'data-analysis-fundamentals')}/video?lesson=${lesson.id}`);
                                  }}
                                  className={`p-[10px] rounded-[8px] flex items-center gap-[12px] transition-colors cursor-pointer group ${
                                    isCurrent ? 'bg-[rgba(124,92,255,0.1)] border border-[rgba(124,92,255,0.3)] shadow-2xs' : 'hover:bg-black/5'
                                  }`}
                                  title={`Watch ${lesson.title}`}
                                >
                                  {isDone ? (
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
                                  ) : isCurrent ? (
                                    <div className="size-[32px] bg-[#5A198F] rounded-[6px] flex items-center justify-center shrink-0 shadow-xs">
                                      <img src="/images/enrolled/module-play-square.svg" alt="" className="w-[11px] h-[12px]" />
                                    </div>
                                  ) : (
                                    <div className="size-[32px] bg-[#F4F0F8] border border-[#8B5DB0] rounded-[6px] flex items-center justify-center shrink-0">
                                      <img src="/images/enrolled/module-lock-square.svg" alt="" className="w-[11px] h-[12px]" />
                                    </div>
                                  )}

                                  <div className="flex flex-col flex-1 min-w-0">
                                    <span className="text-[14px] text-[#22023C] group-hover:text-[#5A198F] font-normal leading-[20px] truncate transition-colors">
                                      {lesson.title}
                                    </span>
                                    <span className="text-[12px] text-[#4B5563] leading-[16px]">
                                      {lesson.duration} {isDone ? '· Completed' : isCurrent ? '· Remaining' : ''}
                                    </span>
                                  </div>

                                  {isCurrent && (
                                    <div className="flex items-end gap-[2px] h-[16px] shrink-0">
                                      <div className="w-[2px] h-[8px] bg-[#22023C] rounded-full animate-pulse" />
                                      <div className="w-[2px] h-[16px] bg-[#22023C] rounded-full animate-pulse [animation-delay:150ms]" />
                                      <div className="w-[2px] h-[12px] bg-[#22023C] rounded-full animate-pulse [animation-delay:300ms]" />
                                    </div>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}
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
                  {courseTitle}
                </h1>

                {/* Description & Instructor */}
                <div className="flex flex-col gap-[16px]">
                  <p className="font-normal text-[16px] sm:text-[18px] leading-[26px] sm:leading-[29.25px] text-[#64748B]">
                    {courseDetail?.description || catalogItem.description}
                  </p>

                  <div className="flex items-center gap-[7.25px]">
                    <img
                      src={catalogItem.instructorAvatar || '/images/enrolled/elena-avatar.png'}
                      alt={catalogItem.instructor}
                      className="size-[23px] rounded-full object-cover shrink-0 border border-slate-200"
                    />
                    <span className="font-medium text-[11px] sm:text-[12px] leading-[14.5px] text-[#475569]">
                      {catalogItem.instructor} - Lead Track Specialist
                    </span>
                  </div>
                </div>

                {/* Badges Row */}
                <div className="flex flex-wrap items-center gap-3">
                  <div className="bg-[#EFF6FF] rounded-full px-[16px] py-[8px] flex items-center gap-[8px] shrink-0">
                    <img src="/images/enrolled/clock-icon.svg" alt="" className="size-[14px]" />
                    <span className="font-semibold text-[14px] leading-[20px] text-[#8B5DB0]">
                      {courseDuration}
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
                      {courseTrack}
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
              <div className="w-full min-w-0 xl:flex-1 xl:max-w-[674px] relative">
                <div className="absolute -top-[24px] -right-[24px] size-[128px] bg-[#8B5DB0] rounded-full opacity-60 blur-2xl pointer-events-none" />
                <div className="absolute -bottom-[32px] -left-[32px] size-[160px] bg-[#D2C1E1] rounded-full opacity-60 blur-3xl pointer-events-none" />

                <div
                  onClick={() => navigate(`/courses/${courseDetail ? courseDetail.id : (id || 'data_analysis')}/video`)}
                  className="w-full h-[320px] sm:h-[420px] rounded-[24px] shadow-[0px_25px_50px_-12px_rgba(0,0,0,0.25)] overflow-hidden relative border border-slate-100 bg-[#0E1626] cursor-pointer group"
                  title="Watch course video"
                >
                  <img
                    src={catalogItem.heroImage || '/images/course-data-ai.jpg'}
                    alt={`${courseTitle} Preview`}
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
                        {totalLessonsCount} Video Lessons
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
                  {activeModules.length} module{activeModules.length > 1 ? 's' : ''} • {totalLessonsCount} lessons • {courseDuration} total length
                </p>
              </div>

              {/* Modules Accordion List */}
              <div className="flex flex-col gap-[16px] w-full">
                {activeModules.map((mod) => {
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
                  Ready to start your {courseTrack.toLowerCase()} journey?
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
