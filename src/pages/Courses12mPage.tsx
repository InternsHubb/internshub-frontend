import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, Lock } from 'lucide-react';
import { ROUTES } from '@/constants/routes';
import { getCourses } from '@/lib/api/courses';
import type { CourseSummaryDto } from '@/lib/api/types';

function formatDuration(totalSeconds: number): string {
  if (!totalSeconds || totalSeconds <= 0) return 'Self-paced';
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''}${minutes > 0 ? ` ${minutes}m` : ''}`;
  return `${minutes} min`;
}

interface Course {
  id: string;
  title: string;
  category: string;
  instructor: string;
  instructorAvatar: string;
  rating: number;
  reviews: string;
  duration: string;
  level: string;
  lessons: string;
  thumbnail: string;
  isRequired?: boolean;
}

const COURSES_12M_CATALOG: Course[] = [
  {
    id: 'course-1',
    title: 'Data Analysis with Python & SQL',
    category: 'Data & AI',
    instructor: 'Elena Vasquez',
    instructorAvatar: '/images/avatar-elena-figma.jpg',
    rating: 4.7,
    reviews: '(1,802)',
    duration: '22 hours',
    level: 'Advanced',
    lessons: '40 lessons',
    thumbnail: '/images/course-thumb-figma-2.jpg',
    isRequired: true,
  },
  {
    id: 'course-2',
    title: 'Advanced Design Systems & Component Libraries',
    category: 'UI/UX Design',
    instructor: 'Elena Vasquez',
    instructorAvatar: '/images/avatar-elena-figma.jpg',
    rating: 4.8,
    reviews: '(1,420)',
    duration: '18 hours',
    level: 'Intermediate',
    lessons: '32 lessons',
    thumbnail: '/images/course-thumb-figma-1.jpg',
    isRequired: true,
  },
  {
    id: 'course-3',
    title: 'Machine Learning Fundamentals with Scikit-Learn',
    category: 'Data Science',
    instructor: 'Dr. Marcus Vance',
    instructorAvatar: '/images/avatar-elena-figma.jpg',
    rating: 4.9,
    reviews: '(2,150)',
    duration: '28 hours',
    level: 'Advanced',
    lessons: '48 lessons',
    thumbnail: '/images/course-data-ai.jpg',
    isRequired: true,
  },
  {
    id: 'course-4',
    title: 'Full-Stack Web Architecture with React & Node',
    category: 'Web Development',
    instructor: 'Sarah Connor',
    instructorAvatar: '/images/avatar-elena-figma.jpg',
    rating: 4.8,
    reviews: '(1,920)',
    duration: '34 hours',
    level: 'Advanced',
    lessons: '52 lessons',
    thumbnail: '/images/course-thumb-figma-2.jpg',
    isRequired: false,
  },
  {
    id: 'course-5',
    title: 'Generative AI & LLMs in Production',
    category: 'Data & AI',
    instructor: 'Dr. Aisha Patel',
    instructorAvatar: '/images/avatar-elena-figma.jpg',
    rating: 4.9,
    reviews: '(2,410)',
    duration: '26 hours',
    level: 'Advanced',
    lessons: '38 lessons',
    thumbnail: '/images/course-thumb-figma-2.jpg',
    isRequired: true,
  },
  {
    id: 'course-6',
    title: 'Product Discovery & User Journey Mapping',
    category: 'Product Management',
    instructor: 'Alex Rivera',
    instructorAvatar: '/images/avatar-elena-figma.jpg',
    rating: 4.7,
    reviews: '(1,150)',
    duration: '16 hours',
    level: 'Intermediate',
    lessons: '28 lessons',
    thumbnail: '/images/course-thumb-figma-1.jpg',
    isRequired: false,
  },
  {
    id: 'course-7',
    title: 'Cross-Platform Mobile Apps with React Native',
    category: 'Mobile Development',
    instructor: 'David Kim',
    instructorAvatar: '/images/avatar-elena-figma.jpg',
    rating: 4.6,
    reviews: '(980)',
    duration: '24 hours',
    level: 'Intermediate',
    lessons: '36 lessons',
    thumbnail: '/images/course-thumb-figma-2.jpg',
    isRequired: false,
  },
  {
    id: 'course-8',
    title: 'Cloud Infrastructure & DevOps for Developers',
    category: 'Web Development',
    instructor: 'James Wilson',
    instructorAvatar: '/images/avatar-elena-figma.jpg',
    rating: 4.8,
    reviews: '(1,670)',
    duration: '30 hours',
    level: 'Advanced',
    lessons: '44 lessons',
    thumbnail: '/images/course-data-ai.jpg',
    isRequired: false,
  },
];

const TRACK_FILTER_OPTIONS = [
  'Web Development',
  'Data Science',
  'UI/UX Design',
  'Product Management',
  'Marketing',
  'Mobile Development',
];

const LEVEL_FILTER_OPTIONS = ['Beginner', 'Intermediate', 'Advanced'];

export const Courses12mPage: React.FC = () => {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOption, setSortOption] = useState<'popular' | 'rating' | 'newest'>('popular');
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const [requiredFilter, setRequiredFilter] = useState<'required' | 'all'>('all');
  const [showRequiredDropdown, setShowRequiredDropdown] = useState(false);
  const [viewMyCoursesOnly, setViewMyCoursesOnly] = useState(false);
  const [enrolledCourses, setEnrolledCourses] = useState<Record<string, boolean>>(() => {
    try {
      const saved = localStorage.getItem('enrolled_courses_12m');
      if (saved) return JSON.parse(saved);
    } catch {}
    return { 'course-1': true, 'course-2': true };
  });
  const [activeNav, setActiveNav] = useState('courses');

  // Searchbar Filter Modal State (Figma node 112:17092: "filters for 12m")
  const [showFilterPanel, setShowFilterPanel] = useState(false);
  const [selectedTracks, setSelectedTracks] = useState<string[]>([]);
  const [selectedLevels, setSelectedLevels] = useState<string[]>([]);
  const [appliedTracks, setAppliedTracks] = useState<string[]>([]);
  const [appliedLevels, setAppliedLevels] = useState<string[]>([]);
  const [trackSectionOpen, setTrackSectionOpen] = useState(true);
  const [levelSectionOpen, setLevelSectionOpen] = useState(true);

  const toggleTrack = (track: string) => {
    setSelectedTracks((prev) =>
      prev.includes(track) ? prev.filter((t) => t !== track) : [...prev, track]
    );
  };

  const toggleLevel = (lvl: string) => {
    setSelectedLevels((prev) =>
      prev.includes(lvl) ? prev.filter((l) => l !== lvl) : [...prev, lvl]
    );
  };

  const handleApplyFilters = () => {
    setAppliedTracks(selectedTracks);
    setAppliedLevels(selectedLevels);
    setShowFilterPanel(false);
  };

  const handleClearFilters = () => {
    setSelectedTracks([]);
    setSelectedLevels([]);
    setAppliedTracks([]);
    setAppliedLevels([]);
  };

  // Close dropdowns on document click
  useEffect(() => {
    const handleDocumentClick = () => {
      setShowSortDropdown(false);
      setShowRequiredDropdown(false);
      setShowFilterPanel(false);
    };

    if (showSortDropdown || showRequiredDropdown || showFilterPanel) {
      document.addEventListener('click', handleDocumentClick);
    }
    return () => {
      document.removeEventListener('click', handleDocumentClick);
    };
  }, [showSortDropdown, showRequiredDropdown, showFilterPanel]);

  // Close dropdowns on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setShowSortDropdown(false);
        setShowRequiredDropdown(false);
        setShowFilterPanel(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleEnrollToggle = (courseId: string) => {
    setEnrolledCourses((prev) => {
      const next = {
        ...prev,
        [courseId]: !prev[courseId],
      };
      try {
        localStorage.setItem('enrolled_courses_12m', JSON.stringify(next));
      } catch {}
      return next;
    });
  };

  const [backendCourses, setBackendCourses] = useState<CourseSummaryDto[]>([]);
  const [isLoadingCourses, setIsLoadingCourses] = useState<boolean>(true);
  const [courseLoadError, setCourseLoadError] = useState<string | null>(null);

  const fetchCourseList = useCallback(async () => {
    setIsLoadingCourses(true);
    setCourseLoadError(null);
    try {
      const dtos = await getCourses();
      setBackendCourses(dtos);
    } catch {
      setCourseLoadError('Unable to load courses from the server. Please try again.');
    } finally {
      setIsLoadingCourses(false);
    }
  }, []);

  useEffect(() => {
    void fetchCourseList();
  }, [fetchCourseList]);

  const activeCatalog = useMemo<Course[]>(() => {
    if (backendCourses.length > 0) {
      return backendCourses.map((c) => ({
        id: c.id,
        title: c.title,
        category: c.trackName || 'General',
        instructor: c.trackName ? `${c.trackName} Specialist` : 'Course Instructor',
        instructorAvatar: '/images/avatar-elena-figma.jpg',
        rating: 4.8,
        reviews: c.completedLessonsCount !== null ? `(${c.completedLessonsCount} completed)` : `(${c.lessonCount} lessons)`,
        duration: formatDuration(c.totalDurationSeconds),
        level: 'All Levels',
        lessons: `${c.lessonCount} lessons`,
        thumbnail: '/images/course-thumb-figma-2.jpg',
        isRequired: c.order <= 3,
      }));
    }
    return COURSES_12M_CATALOG;
  }, [backendCourses]);

  // Filtered courses for 12m catalog
  const filteredCourses = useMemo(() => {
    let result = activeCatalog.filter((course) => {
      const matchesSearch =
        course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.instructor.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.category.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesRequired =
        requiredFilter === 'all' || course.isRequired;

      const matchesTrack =
        appliedTracks.length === 0 ||
        appliedTracks.some((t) => {
          if (t === 'Data Science' && course.category.includes('Data')) return true;
          return (
            course.category.toLowerCase().includes(t.toLowerCase()) ||
            course.title.toLowerCase().includes(t.toLowerCase())
          );
        });

      const matchesLevel =
        appliedLevels.length === 0 || appliedLevels.includes(course.level);

      return matchesSearch && matchesRequired && matchesTrack && matchesLevel;
    });

    if (sortOption === 'rating') {
      result = [...result].sort((a, b) => b.rating - a.rating);
    } else if (sortOption === 'newest') {
      result = [...result].reverse();
    }
    return result;
  }, [activeCatalog, searchQuery, sortOption, requiredFilter, appliedTracks, appliedLevels]);

  return (
    <div className="min-h-screen bg-[#FEFEFE] relative overflow-hidden font-['Plus_Jakarta_Sans',sans-serif] text-slate-800 flex justify-start selection:bg-purple-200 selection:text-purple-900">
      {/* Decorative blurred background blobs matching Figma node 112:16549, 112:16550, 112:16551 */}
      <div
        className="absolute pointer-events-none w-[301px] h-[306px] left-[252px] top-[190px] bg-[#C693FD] opacity-20 blur-[29px] rounded-full"
        aria-hidden="true"
      />
      <div
        className="absolute pointer-events-none w-[275px] h-[281px] right-[-100px] top-[332px] bg-[#C693FD] opacity-20 blur-[29px] rounded-full"
        aria-hidden="true"
      />
      <div
        className="absolute pointer-events-none w-[275px] h-[281px] left-[665px] bottom-[-80px] bg-[#C693FD] opacity-20 blur-[29px] rounded-full"
        aria-hidden="true"
      />

      {/* Main Container */}
      <div className="w-full min-h-[1024px] flex flex-col lg:flex-row pl-1.5 sm:pl-2 lg:pl-6 pr-3 sm:pr-4 lg:pr-6 py-4 lg:py-6 gap-5 lg:gap-6 relative z-10 flow-page-enter">
        {/* Mobile Header (< 1024px) */}
        <div className="lg:hidden flex items-center justify-between bg-[#3B0454] text-white px-5 py-4 rounded-[24px] shadow-lg mb-2">
          <Link to={ROUTES.home} className="flex items-center gap-3">
            <svg width="34" height="26" viewBox="0 0 43 32" fill="none" className="shrink-0">
              <path
                d="M22.4981 0.122721C21.54 -0.040907 20.561 -0.040907 19.6028 0.122721C18.517 0.309054 17.4976 0.773096 15.912 1.49155L4.02067 6.88805C3.13559 7.28939 2.39026 7.62622 1.83484 7.93976C1.29734 8.24435 0.681007 8.65643 0.34059 9.32114C0.116757 9.75681 0 10.2396 0 10.7294C0 11.2192 0.116757 11.702 0.34059 12.1376C0.681007 12.8023 1.29734 13.2162 1.83663 13.519C2.39205 13.8326 3.13559 14.1712 4.02246 14.5725L15.9155 19.9672C17.4994 20.6875 18.5188 21.1497 19.6046 21.3361C20.5628 21.4997 21.5417 21.4997 22.4999 21.3361C23.5857 21.1497 24.6051 20.6875 26.1908 19.9672L37.6252 14.7803V23.2711C37.6252 23.6274 37.7667 23.9692 38.0187 24.2212C38.2707 24.4732 38.6125 24.6148 38.9689 24.6148C39.3253 24.6148 39.6671 24.4732 39.9191 24.2212C40.1711 23.9692 40.3127 23.6274 40.3127 23.2711V13.4921C40.8412 13.1911 41.4325 12.7826 41.7639 12.1358C41.9878 11.7002 42.1045 11.2174 42.1045 10.7276C42.1045 10.2378 41.9878 9.75502 41.7639 9.31935C41.4235 8.65643 40.8072 8.24076 40.2679 7.93797C39.7125 7.62443 38.9689 7.2876 38.082 6.88626L26.189 1.48976C24.6051 0.771304 23.5857 0.307263 22.4999 0.120929"
                fill="white"
              />
              <path
                d="M15.2096 21.7392L7.16505 18.2562V23.7315C7.16505 25.4873 7.8638 27.3489 9.52646 28.4418C11.6872 29.8644 15.611 31.7815 21.0505 31.7815C26.49 31.7815 30.4137 29.8644 32.5745 28.4418C34.2353 27.3489 34.9359 25.4873 34.9359 23.7315V18.2562L26.8913 21.7392C25.4544 22.3627 24.2056 22.9038 22.8493 23.1259C21.658 23.3214 20.4429 23.3214 19.2516 23.1259C17.8953 22.9038 16.6465 22.3627 15.2096 21.7392Z"
                fill="white"
              />
            </svg>
            <span className="font-bold text-2xl tracking-tight">Interns HUB</span>
          </Link>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
            aria-label="Toggle navigation"
          >
            {mobileMenuOpen ? <X className="size-6" /> : <Menu className="size-6" />}
          </button>
        </div>

        {/* Mobile Backdrop */}
        {mobileMenuOpen && (
          <div
            onClick={() => setMobileMenuOpen(false)}
            className="fixed inset-0 bg-black/50 backdrop-blur-xs z-40 lg:hidden"
          />
        )}

        {/* =========================================================================
            EXACT FIGMA 12M SIDEBAR (Node 112:16553)
            Items: Courses, Mentorship, Progress, Chat, Certificate
            Dimensions: width 308px, height 976px
            Background: #3B0454, Border-Radius: 34px
           ========================================================================= */}
        <aside
          className={`fixed lg:sticky top-4 lg:top-6 left-1.5 sm:left-2 lg:left-6 w-[308px] h-[976px] bg-[#3B0454] rounded-[34px] shadow-2xl z-50 flex flex-col overflow-hidden transition-transform duration-300 ease-in-out shrink-0 select-none ${
            mobileMenuOpen ? 'translate-x-0' : '-translate-x-[340px] lg:translate-x-0'
          }`}
        >
          {/* Header (Figma node 112:16585: left 43px, top 62px) */}
          <div className="absolute top-[62px] left-[43px] w-[222px] h-[43px] flex items-center justify-start">
            <Link
              to={ROUTES.home}
              className="flex items-center gap-[10px] text-white cursor-pointer hover:opacity-95 transition-opacity"
              title="Interns HUB"
            >
              <svg
                width="43"
                height="32"
                viewBox="0 0 43 32"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="shrink-0"
              >
                <path
                  d="M22.4981 0.122721C21.54 -0.040907 20.561 -0.040907 19.6028 0.122721C18.517 0.309054 17.4976 0.773096 15.912 1.49155L4.02067 6.88805C3.13559 7.28939 2.39026 7.62622 1.83484 7.93976C1.29734 8.24435 0.681007 8.65643 0.34059 9.32114C0.116757 9.75681 0 10.2396 0 10.7294C0 11.2192 0.116757 11.702 0.34059 12.1376C0.681007 12.8023 1.29734 13.2162 1.83663 13.519C2.39205 13.8326 3.13559 14.1712 4.02246 14.5725L15.9155 19.9672C17.4994 20.6875 18.5188 21.1497 19.6046 21.3361C20.5628 21.4997 21.5417 21.4997 22.4999 21.3361C23.5857 21.1497 24.6051 20.6875 26.1908 19.9672L37.6252 14.7803V23.2711C37.6252 23.6274 37.7667 23.9692 38.0187 24.2212C38.2707 24.4732 38.6125 24.6148 38.9689 24.6148C39.3253 24.6148 39.6671 24.4732 39.9191 24.2212C40.1711 23.9692 40.3127 23.6274 40.3127 23.2711V13.4921C40.8412 13.1911 41.4325 12.7826 41.7639 12.1358C41.9878 11.7002 42.1045 11.2174 42.1045 10.7276C42.1045 10.2378 41.9878 9.75502 41.7639 9.31935C41.4235 8.65643 40.8072 8.24076 40.2679 7.93797C39.7125 7.62443 38.9689 7.2876 38.082 6.88626L26.189 1.48976C24.6051 0.771304 23.5857 0.307263 22.4999 0.120929"
                  fill="white"
                />
                <path
                  d="M15.2096 21.7392L7.16505 18.2562V23.7315C7.16505 25.4873 7.8638 27.3489 9.52646 28.4418C11.6872 29.8644 15.611 31.7815 21.0505 31.7815C26.49 31.7815 30.4137 29.8644 32.5745 28.4418C34.2353 27.3489 34.9359 25.4873 34.9359 23.7315V18.2562L26.8913 21.7392C25.4544 22.3627 24.2056 22.9038 22.8493 23.1259C21.658 23.3214 20.4429 23.3214 19.2516 23.1259C17.8953 22.9038 16.6465 22.3627 15.2096 21.7392Z"
                  fill="white"
                />
              </svg>
              <span className="font-['Plus_Jakarta_Sans'] font-bold text-[30px] leading-none text-white tracking-tight whitespace-nowrap">
                Interns HUB
              </span>
            </Link>
          </div>

          {/* Navigation Menu (Figma node 112:16554: 249px width, top 166px, left 29px) */}
          <nav className="absolute top-[166px] left-[29px] w-[249px] flex flex-col gap-[16px]">
            {/* 1. Courses (Active) */}
            <button
              type="button"
              onClick={() => {
                setActiveNav('courses');
                setViewMyCoursesOnly(false);
              }}
              className={`w-[248.75px] h-[40px] rounded-[8px] flex items-center px-[12px] gap-[12px] text-[#EDE6F3] text-[18px] font-medium leading-none font-['Plus_Jakarta_Sans'] cursor-pointer transition-all ${
                activeNav === 'courses' && !viewMyCoursesOnly
                  ? 'bg-gradient-to-r from-[#3A0353] to-[#804A8A]'
                  : 'hover:bg-white/10'
              }`}
            >
              {/* vuesax/bold/book icon */}
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="shrink-0">
                <path
                  d="M22 4.85V16.74C22 17.71 21.21 18.6 20.24 18.72L19.93 18.76C18.29 18.98 15.98 19.66 14.12 20.44C13.47 20.71 12.75 20.22 12.75 19.51V5.6C12.75 5.23 12.96 4.89 13.29 4.71C15.12 3.72 17.89 2.84 19.77 2.68H19.83C21.03 2.68 22 3.65 22 4.85Z"
                  fill="white"
                />
                <path
                  d="M10.71 4.71C8.88 3.72 6.11 2.84 4.23 2.68H4.16C2.96 2.68 1.99 3.65 1.99 4.85V16.74C1.99 17.71 2.78 18.6 3.75 18.72L4.06 18.76C5.7 18.98 8.01 19.66 9.87 20.44C10.52 20.71 11.24 20.22 11.24 19.51V5.6C11.24 5.22 11.04 4.89 10.71 4.71ZM5 7.74H7.25C7.66 7.74 8 8.08 8 8.49C8 8.91 7.66 9.24 7.25 9.24H5C4.59 9.24 4.25 8.91 4.25 8.49C4.25 8.08 4.59 7.74 5 7.74ZM8 12.24H5C4.59 12.24 4.25 11.91 4.25 11.49C4.25 11.08 4.59 10.74 5 10.74H8C8.41 10.74 8.75 11.08 8.75 11.49C8.75 11.91 8.41 12.24 8 12.24Z"
                  fill="white"
                />
              </svg>
              <span>Courses</span>
            </button>

            {/* 2. Mentorship */}
            <Link
              to={ROUTES.mentorship}
              onClick={() => setActiveNav('mentorship')}
              className={`w-[248.75px] h-[40px] rounded-[8px] flex items-center px-[12px] gap-[12px] text-[#EDE6F3] text-[18px] font-medium leading-none font-['Plus_Jakarta_Sans'] cursor-pointer transition-all ${
                activeNav === 'mentorship'
                  ? 'bg-gradient-to-r from-[#3A0353] to-[#804A8A]'
                  : 'hover:bg-white/10'
              }`}
            >
              {/* vuesax/linear/user-octagon icon */}
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="shrink-0">
                <path
                  d="M12 2L19.07 4.93L22 12L19.07 19.07L12 22L4.93 19.07L2 12L4.93 4.93L12 2Z"
                  stroke="#EDE6F3"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M12 11C13.1046 11 14 10.1046 14 9C14 7.89543 13.1046 7 12 7C10.8954 7 10 7.89543 10 9C10 10.1046 10.8954 11 12 11Z"
                  stroke="#EDE6F3"
                  strokeWidth="1.5"
                />
                <path
                  d="M8.5 16.5C8.5 14.5 10 13.5 12 13.5C14 13.5 15.5 14.5 15.5 16.5"
                  stroke="#EDE6F3"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
              <span>Mentorship</span>
            </Link>

            {/* 3. Progress */}
            <button
              type="button"
              onClick={() => setActiveNav('progress')}
              className={`w-[248.75px] h-[40px] rounded-[8px] flex items-center px-[12px] gap-[12px] text-[#EDE6F3] text-[18px] font-medium leading-none font-['Plus_Jakarta_Sans'] cursor-pointer transition-all ${
                activeNav === 'progress'
                  ? 'bg-gradient-to-r from-[#3A0353] to-[#804A8A]'
                  : 'hover:bg-white/10'
              }`}
            >
              {/* carbon:in-progress icon */}
              <svg width="23" height="23" viewBox="0 0 23 23" fill="none" className="shrink-0">
                <path
                  d="M11.5 1.4375C9.50983 1.4375 7.56434 2.02766 5.90957 3.13334C4.2548 4.23902 2.96507 5.81057 2.20346 7.64925C1.44186 9.48793 1.24258 11.5112 1.63085 13.4631C2.01911 15.415 2.97747 17.208 4.38474 18.6153C5.792 20.0225 7.58497 20.9809 9.5369 21.3692C11.4888 21.7574 13.5121 21.5581 15.3508 20.7965C17.1894 20.0349 18.761 18.7452 19.8667 17.0904C20.9723 15.4357 21.5625 13.4902 21.5625 11.5C21.5595 8.83219 20.4983 6.27453 18.6119 4.3881C16.7255 2.50167 14.1678 1.44054 11.5 1.4375ZM11.5 20.125C9.21251 20.125 7.0187 19.2163 5.4012 17.5988C3.7837 15.9813 2.875 13.7875 2.875 11.5C2.875 9.21251 3.7837 7.01871 5.4012 5.4012C7.0187 3.7837 9.21251 2.875 11.5 2.875V11.5L17.5957 17.5957C16.7964 18.3981 15.8464 19.0346 14.8003 19.4686C13.7541 19.9027 12.6326 20.1258 11.5 20.125Z"
                  fill="#EDE6F3"
                />
              </svg>
              <span>Progress</span>
            </button>

            {/* 4. Chat */}
            <button
              type="button"
              onClick={() => setActiveNav('chat')}
              className={`w-[248.75px] h-[40px] rounded-[8px] flex items-center px-[12px] gap-[12px] text-[#EDE6F3] text-[18px] font-medium leading-none font-['Plus_Jakarta_Sans'] cursor-pointer transition-all ${
                activeNav === 'chat'
                  ? 'bg-gradient-to-r from-[#3A0353] to-[#804A8A]'
                  : 'hover:bg-white/10'
              }`}
            >
              {/* akar-icons:chat-dots */}
              <svg width="22" height="20" viewBox="0 0 22 20" fill="none" className="shrink-0">
                <path
                  d="M12.5 16.3333C16.1139 16.3333 17.9213 16.3333 19.0435 15.2102C20.1657 14.087 20.1667 12.2805 20.1667 8.66667C20.1667 5.05279 20.1667 3.24538 19.0435 2.12317C17.9203 1.00096 16.1139 1 12.5 1H8.66667C5.05279 1 3.24538 1 2.12317 2.12317C1.00096 3.24633 1 5.05279 1 8.66667C1 12.2805 1 14.088 2.12317 15.2102C2.74896 15.8369 3.5875 16.1139 4.83333 16.2356"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M10.5833 8.66667V8.67625M6.75 8.66667V8.67625M14.4167 8.66667V8.67625M12.5 16.3333C11.3155 16.3333 10.0103 16.8125 8.81904 17.4306L8.81415 17.4332C6.90266 18.4253 5.94652 18.9215 5.47542 18.6046C5.00392 18.2874 5.09304 17.306 5.27225 15.3424L5.3125 14.8958"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
              <span>Chat</span>
            </button>

            {/* 5. Certificate */}
            <button
              type="button"
              onClick={() => setActiveNav('certificate')}
              className={`w-[248.75px] h-[40px] rounded-[8px] flex items-center px-[12px] gap-[12px] text-[#EDE6F3] text-[18px] font-medium leading-none font-['Plus_Jakarta_Sans'] cursor-pointer transition-all ${
                activeNav === 'certificate'
                  ? 'bg-gradient-to-r from-[#3A0353] to-[#804A8A]'
                  : 'hover:bg-white/10'
              }`}
            >
              {/* icon-park-outline:certificate */}
              <svg width="22" height="20" viewBox="0 0 22 20" fill="none" className="shrink-0">
                <path
                  d="M11.5417 15.375H1.95833C1.70417 15.375 1.46041 15.274 1.28069 15.0943C1.10097 14.9146 1 14.6708 1 14.4167V1.95833C1 1.70417 1.10097 1.46041 1.28069 1.28069C1.46041 1.10097 1.70417 1 1.95833 1H19.2083C19.4625 1 19.7063 1.10097 19.886 1.28069C20.0657 1.46041 20.1667 1.70417 20.1667 1.95833V14.4167C20.1667 14.6708 20.0657 14.9146 19.886 15.0943C19.7063 15.274 19.4625 15.375 19.2083 15.375H15.375M4.83333 4.83333H16.3333M4.83333 8.1875H7.70833M4.83333 11.5417H6.75"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M13.4583 13.9375C14.2208 13.9375 14.9521 13.6346 15.4913 13.0954C16.0304 12.5563 16.3333 11.825 16.3333 11.0625C16.3333 10.3 16.0304 9.56873 15.4913 9.02957C14.9521 8.4904 14.2208 8.1875 13.4583 8.1875C12.6958 8.1875 11.9646 8.4904 11.4254 9.02957C10.8862 9.56873 10.5833 10.3 10.5833 11.0625C10.5833 11.825 10.8862 12.5563 11.4254 13.0954C11.9646 13.6346 12.6958 13.9375 13.4583 13.9375Z"
                  stroke="white"
                  strokeWidth="2"
                />
                <path
                  d="M13.4583 17.2917L15.375 18.25V13.2053C15.375 13.2053 14.8288 13.9375 13.4583 13.9375C12.0879 13.9375 11.5417 13.2188 11.5417 13.2188V18.25L13.4583 17.2917Z"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span>Certificate</span>
            </button>
          </nav>

          {/* Bottom Wavy Graphics & Slogan (Figma nodes 112:16592, 112:16593, 112:16594, 112:16595) */}
          <div
            className="absolute flex items-center justify-center pointer-events-none"
            style={{
              top: '609px',
              left: '-192px',
              width: '763px',
              height: '666px',
            }}
          >
            <div
              className="flex-none"
              style={{
                width: '532.71px',
                height: '508.66px',
                transform: 'rotate(-28.02deg) skewX(7.12deg)',
              }}
            >
              <svg className="w-full h-full block" viewBox="0 0 532.709 508.657" fill="none">
                <path
                  d="M508.598 228.128C490.752 298.734 465.537 310.196 414.578 366.302C363.618 422.408 318.18 508.598 253.8 508.657C189.42 508.716 142.807 422.703 92.6787 366.597C42.5503 310.491 11.5386 290.718 3.15799 228.128C-5.22265 165.537 0.647146 91.6345 50.7755 53.6461C100.904 15.6576 163.194 46.2604 253.8 38.1852C344.406 30.11 452.845 -24.7183 503.805 13.2702C554.764 51.2586 526.443 157.521 508.598 228.128Z"
                  fill="#F8D299"
                />
              </svg>
            </div>
          </div>

          <div
            className="absolute flex items-center justify-center pointer-events-none"
            style={{
              top: '617.6px',
              left: '-316.8px',
              width: '763px',
              height: '666px',
            }}
          >
            <div
              className="flex-none"
              style={{
                width: '532.71px',
                height: '508.66px',
                transform: 'rotate(-28.02deg) skewX(7.12deg)',
              }}
            >
              <svg className="w-full h-full block" viewBox="0 0 532.709 508.657" fill="none">
                <path
                  d="M508.598 228.128C490.752 298.734 465.537 310.196 414.578 366.302C363.618 422.408 318.18 508.598 253.8 508.657C189.42 508.716 142.807 422.703 92.6787 366.597C42.5503 310.491 11.5386 290.718 3.15799 228.128C-5.22265 165.537 0.647146 91.6345 50.7755 53.6461C100.904 15.6576 163.194 46.2604 253.8 38.1852C344.406 30.11 452.845 -24.7183 503.805 13.2702C554.764 51.2586 526.443 157.521 508.598 228.128Z"
                  fill="#8B5DB0"
                />
              </svg>
            </div>
          </div>

          {/* 3. Golden-Orange Wave: Vector 112:9050 (#F59E51) */}
          <div
            className="absolute flex items-center justify-center pointer-events-none"
            style={{
              top: '770.2px',
              left: '-229.1px',
              width: '556.6px',
              height: '492.2px',
            }}
          >
            <div
              className="flex-none"
              style={{
                width: '551.34px',
                height: '487.69px',
                transform: 'rotate(-0.47deg) skewX(0.15deg)',
              }}
            >
              <svg
                className="w-full h-full block"
                viewBox="0 0 551.337 487.686"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M526.383 218.722C507.914 286.418 481.817 297.407 429.075 351.2C376.334 404.993 329.306 487.629 262.675 487.686C196.044 487.742 147.801 405.275 95.9196 351.483C44.0383 297.69 11.9421 278.732 3.26842 218.722C-5.40528 158.712 0.669776 87.8566 52.5511 51.4343C104.432 15.0121 168.901 44.3531 262.675 36.6109C356.449 28.8686 468.681 -23.6992 521.422 12.7231C574.164 49.1453 544.852 151.027 526.383 218.722Z"
                  fill="#F59E51"
                />
              </svg>
            </div>
          </div>

          {/* 4. Bottom Title Frame (Figma node 112:9051: top 859px, left calc(50% - 4px), width 214px) */}
          <div
            className="-translate-x-1/2 absolute flex flex-col gap-[18px] items-center text-center left-[calc(50%-4px)] top-[859px] w-[214px] pointer-events-none z-10"
          >
            <div className="flex flex-col font-['Plus_Jakarta_Sans'] font-bold justify-center text-[#3A0353] text-[32px] text-center w-full leading-none">
              <p className="leading-none">Interns HUB</p>
            </div>
            <div className="flex flex-col font-['Plus_Jakarta_Sans'] font-medium justify-center text-[16px] text-white text-center w-full leading-none tracking-normal">
              <p className="leading-none">LEARN - GROW - SUCCESS</p>
            </div>
          </div>
        </aside>

        {/* =========================================================================
            MAIN CONTENT AREA
           ========================================================================= */}
        <main className="flex-1 flex flex-col min-w-0 w-full">
          {/* Top Header Row (Figma node 112:16599) */}
          <div className="flex flex-col md:flex-row md:flex-wrap items-stretch md:items-center gap-4 lg:gap-[24px] w-full mb-[24px]">
            {/* Search Bar */}
            <div className="relative w-full md:w-auto md:min-w-[240px] md:flex-1 h-[62px] bg-[#F4F4F4] shadow-[0px_4px_4px_rgba(0,0,0,0.25)] rounded-[36px] px-[24px] flex items-center justify-between gap-4 transition-all focus-within:ring-2 focus-within:ring-[#5A198F]/40 focus-within:bg-white shrink-0">
              <div className="flex items-center gap-[22px] flex-1 min-w-0">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="shrink-0">
                  <path
                    d="M21 11.5C21 16.7467 16.7467 21 11.5 21C6.25329 21 2 16.7467 2 11.5C2 6.25329 6.25329 2 11.5 2C16.7467 2 21 6.25329 21 11.5Z"
                    stroke="#6B7280"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M22 22L20 20"
                    stroke="#6B7280"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search courses, topics, instructors..."
                  className="w-full bg-transparent border-none outline-hidden text-[#1E293B] placeholder-[#6B7280] text-[14px] font-['Plus_Jakarta_Sans'] font-medium leading-[18px]"
                />
              </div>

              {/* Filter Search Button & Modal (Figma node 112:17092: "filters for 12m") */}
              <div className="lg:relative shrink-0">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowFilterPanel((prev) => !prev);
                    setShowSortDropdown(false);
                    setShowRequiredDropdown(false);
                  }}
                  className={`p-2 rounded-full transition-all duration-300 transform cursor-pointer relative shrink-0 ${
                    showFilterPanel || appliedTracks.length > 0 || appliedLevels.length > 0
                      ? 'text-[#5A198F] bg-purple-100 ring-2 ring-[#5A198F]/25 shadow-xs scale-105'
                      : 'text-[#6B7280] hover:text-[#5A198F] hover:bg-gray-200 active:scale-95'
                  }`}
                  title="Filter courses"
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="shrink-0">
                    <path
                      d="M14.32 19.07C14.32 19.68 13.92 20.48 13.41 20.79L12 21.7C10.69 22.51 8.87 21.6 8.87 19.98V14.63C8.87 13.92 8.47 13.01 8.06 12.51L4.21997 8.47C3.70997 7.96 3.31 7.06001 3.31 6.45001V4.13C3.31 2.92 4.22002 2.01001 5.33002 2.01001H18.67C19.78 2.01001 20.69 2.92 20.69 4.03V6.25C20.69 7.06 20.18 8.07001 19.68 8.57001"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeMiterlimit="10"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M19.27 13.32C19.27 15.0873 17.8373 16.52 16.07 16.52C14.3027 16.52 12.87 15.0873 12.87 13.32C12.87 11.5527 14.3027 10.12 16.07 10.12C17.8373 10.12 19.27 11.5527 19.27 13.32Z"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M19.87 17.12L18.87 16.12"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  {(appliedTracks.length > 0 || appliedLevels.length > 0) && (
                    <span className="absolute top-1.5 right-1.5 size-2 rounded-full bg-[#5A198F] ring-2 ring-white animate-pulse" />
                  )}
                </button>

                {/* Filter Modal Panel */}
                {showFilterPanel && (
                  <div
                    onClick={(e) => e.stopPropagation()}
                    className="absolute top-[68px] lg:top-[58px] start-0 lg:start-auto lg:end-0 w-[270px] max-w-[calc(100vw-24px)] bg-[#F4F4F4]/98 backdrop-blur-xl border border-white/60 shadow-[0px_20px_40px_-8px_rgba(58,4,83,0.18),0px_6px_16px_rgba(0,0,0,0.08)] rounded-[16px] p-[24px] flex flex-col gap-[20px] z-50 animate-filter-dropdown select-none text-start"
                  >
                    <div className="flex items-center justify-between w-full">
                      <h2 className="font-['Plus_Jakarta_Sans'] font-semibold text-[18px] leading-[28px] text-[#1E293B]">
                        Filters
                      </h2>
                      {selectedTracks.length > 0 || selectedLevels.length > 0 ? (
                        <button
                          type="button"
                          onClick={handleClearFilters}
                          className="font-['Plus_Jakarta_Sans'] font-medium text-[12px] leading-[16px] text-[#5A198F] hover:text-[#471273] hover:underline cursor-pointer transition-all active:scale-95"
                        >
                          Clear all
                        </button>
                      ) : (
                        <div className="w-[45px] h-[16px]" />
                      )}
                    </div>

                    {/* Track Section */}
                    <div className="border-[#E2E8F0] border-b border-solid flex flex-col gap-[14px] pb-[18px] w-full">
                      <button
                        type="button"
                        onClick={() => setTrackSectionOpen((prev) => !prev)}
                        className="flex items-center justify-between w-full cursor-pointer group"
                      >
                        <span className="font-['Plus_Jakarta_Sans'] font-medium text-[14px] leading-[20px] text-[#334155] group-hover:text-[#1E293B] transition-colors">
                          Track
                        </span>
                        <svg
                          width="12"
                          height="12"
                          viewBox="0 0 12 12"
                          fill="none"
                          className={`transition-transform duration-300 shrink-0 ${trackSectionOpen ? '' : 'rotate-180'}`}
                        >
                          <path
                            d="M5.47012 2.46973C5.76309 2.17676 6.23887 2.17676 6.53184 2.46973L11.0318 6.96973C11.3248 7.2627 11.3248 7.73848 11.0318 8.03145C10.7389 8.32441 10.2631 8.32441 9.97012 8.03145L5.9998 4.06113L2.02949 8.0291C1.73652 8.32207 1.26074 8.32207 0.967773 8.0291C0.674805 7.73613 0.674805 7.26035 0.967773 6.96738L5.46777 2.46738L5.47012 2.46973Z"
                            fill="#94A3B8"
                          />
                        </svg>
                      </button>

                      {trackSectionOpen && (
                        <div className="flex flex-col gap-[13px] w-full pt-1">
                          {TRACK_FILTER_OPTIONS.map((track) => {
                            const isChecked = selectedTracks.includes(track);
                            return (
                              <label
                                key={track}
                                onClick={() => toggleTrack(track)}
                                className="flex items-center gap-[12px] cursor-pointer group select-none"
                              >
                                <div
                                  className={`size-[16px] rounded-[2.5px] flex items-center justify-center transition-all duration-200 shrink-0 ${
                                    isChecked
                                      ? 'bg-[#5A198F] shadow-[0_2px_6px_rgba(90,25,143,0.35)]'
                                      : 'bg-white border border-[#767676] group-hover:border-[#5A198F]'
                                  }`}
                                >
                                  {isChecked && (
                                    <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                                      <path
                                        d="M1 4.2L3.5 6.7L9 1.2"
                                        stroke="white"
                                        strokeWidth="1.8"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                      />
                                    </svg>
                                  )}
                                </div>
                                <span className="font-['Plus_Jakarta_Sans'] font-normal text-[14px] leading-[20px] text-[#475569] group-hover:text-[#1E293B] transition-all">
                                  {track}
                                </span>
                              </label>
                            );
                          })}
                        </div>
                      )}
                    </div>

                    {/* Level Section */}
                    <div className="flex flex-col gap-[14px] w-full">
                      <button
                        type="button"
                        onClick={() => setLevelSectionOpen((prev) => !prev)}
                        className="flex items-center justify-between w-full cursor-pointer group"
                      >
                        <span className="font-['Plus_Jakarta_Sans'] font-medium text-[14px] leading-[20px] text-[#334155] group-hover:text-[#1E293B] transition-colors">
                          Level
                        </span>
                        <svg
                          width="12"
                          height="12"
                          viewBox="0 0 12 12"
                          fill="none"
                          className={`transition-transform duration-300 shrink-0 ${levelSectionOpen ? '' : 'rotate-180'}`}
                        >
                          <path
                            d="M5.47012 2.46973C5.76309 2.17676 6.23887 2.17676 6.53184 2.46973L11.0318 6.96973C11.3248 7.2627 11.3248 7.73848 11.0318 8.03145C10.7389 8.32441 10.2631 8.32441 9.97012 8.03145L5.9998 4.06113L2.02949 8.0291C1.73652 8.32207 1.26074 8.32207 0.967773 8.0291C0.674805 7.73613 0.674805 7.26035 0.967773 6.96738L5.46777 2.46738L5.47012 2.46973Z"
                            fill="#94A3B8"
                          />
                        </svg>
                      </button>

                      {levelSectionOpen && (
                        <div className="flex flex-col gap-[13px] w-full pt-1">
                          {LEVEL_FILTER_OPTIONS.map((lvl) => {
                            const isChecked = selectedLevels.includes(lvl);
                            return (
                              <label
                                key={lvl}
                                onClick={() => toggleLevel(lvl)}
                                className="flex items-center gap-[12px] cursor-pointer group select-none"
                              >
                                <div
                                  className={`size-[16px] rounded-[2.5px] flex items-center justify-center transition-all duration-200 shrink-0 ${
                                    isChecked
                                      ? 'bg-[#5A198F] shadow-[0_2px_6px_rgba(90,25,143,0.35)]'
                                      : 'bg-white border border-[#767676] group-hover:border-[#5A198F]'
                                  }`}
                                >
                                  {isChecked && (
                                    <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                                      <path
                                        d="M1 4.2L3.5 6.7L9 1.2"
                                        stroke="white"
                                        strokeWidth="1.8"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                      />
                                    </svg>
                                  )}
                                </div>
                                <span className="font-['Plus_Jakarta_Sans'] font-normal text-[14px] leading-[20px] text-[#475569] group-hover:text-[#1E293B] transition-all">
                                  {lvl}
                                </span>
                              </label>
                            );
                          })}
                        </div>
                      )}
                    </div>

                    {/* Apply Filters Button */}
                    <button
                      type="button"
                      disabled={selectedTracks.length === 0 && selectedLevels.length === 0}
                      onClick={handleApplyFilters}
                      className={`w-full py-[12px] rounded-[83px] flex items-center justify-center font-['Plus_Jakarta_Sans'] font-bold text-[12px] leading-[20px] transition-all duration-200 ${
                        selectedTracks.length > 0 || selectedLevels.length > 0
                          ? 'bg-[#5A198F] hover:bg-[#471273] text-white shadow-sm hover:shadow-md hover:scale-[1.01] active:scale-[0.98] cursor-pointer'
                          : 'bg-[rgba(173,173,173,0.41)] text-[#838383] shadow-[0px_1px_2px_rgba(0,0,0,0.05)] cursor-not-allowed'
                      }`}
                    >
                      Apply Filters
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Your Courses Pill Button */}
            <button
              type="button"
              onClick={() => setViewMyCoursesOnly(!viewMyCoursesOnly)}
              className={`w-full md:w-[190px] h-[62px] bg-[#F4F4F4] shadow-[0px_4px_4px_rgba(0,0,0,0.25)] rounded-[999px] px-[25px] flex items-center justify-center gap-[16px] transition-all cursor-pointer shrink-0 active:scale-98 ${
                viewMyCoursesOnly
                  ? 'ring-2 ring-[#5A198F] bg-purple-50 text-[#5A198F]'
                  : 'hover:bg-gray-100 text-[#000000]'
              }`}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="shrink-0">
                <path
                  d="M22 4.85V16.74C22 17.71 21.21 18.6 20.24 18.72L19.93 18.76C18.29 18.98 15.98 19.66 14.12 20.44C13.47 20.71 12.75 20.22 12.75 19.51V5.6C12.75 5.23 12.96 4.89 13.29 4.71C15.12 3.72 17.89 2.84 19.77 2.68H19.83C21.03 2.68 22 3.65 22 4.85Z"
                  fill={viewMyCoursesOnly ? '#5A198F' : '#6B7280'}
                />
                <path
                  d="M10.71 4.71C8.88 3.72 6.11 2.84 4.23 2.68H4.16C2.96 2.68 1.99 3.65 1.99 4.85V16.74C1.99 17.71 2.78 18.6 3.75 18.72L4.06 18.76C5.7 18.98 8.01 19.66 9.87 20.44C10.52 20.71 11.24 20.22 11.24 19.51V5.6C11.24 5.22 11.04 4.89 10.71 4.71ZM5 7.74H7.25C7.66 7.74 8 8.08 8 8.49C8 8.91 7.66 9.24 7.25 9.24H5C4.59 9.24 4.25 8.91 4.25 8.49C4.25 8.08 4.59 7.74 5 7.74ZM8 12.24H5C4.59 12.24 4.25 11.91 4.25 11.49C4.25 11.08 4.59 10.74 5 10.74H8C8.41 10.74 8.75 11.08 8.75 11.49C8.75 11.91 8.41 12.24 8 12.24Z"
                  fill={viewMyCoursesOnly ? '#5A198F' : '#6B7280'}
                />
              </svg>
              <span className="font-['Plus_Jakarta_Sans'] font-normal text-[16px] leading-[24px] whitespace-nowrap text-[#000000]">
                Your Courses
              </span>
            </button>

            {/* Maya Johnson - AI track - 12 Month Plan (Figma node 112:16611) */}
            <div className="w-full md:w-[248px] h-[62px] bg-[#F4F4F4] shadow-[0px_4px_4px_rgba(0,0,0,0.25)] rounded-[999px] px-[16px] flex items-center gap-[12px] shrink-0 hover:bg-gray-100 transition-colors cursor-pointer">
              <img
                src="/images/avatar-maya-figma.jpg"
                alt="Maya Johnson"
                className="size-[40px] rounded-full object-cover shadow-xs border border-white shrink-0"
              />
              <div className="flex flex-col text-start justify-center">
                <span className="font-['Plus_Jakarta_Sans'] font-normal text-[14px] leading-[20px] text-[#1E293B]">
                  Maya Johnson
                </span>
                <span className="font-['Plus_Jakarta_Sans'] font-normal text-[12px] leading-[16px] text-[#6B7280] flex items-center gap-1.5">
                  <span className="size-1.5 rounded-full bg-emerald-500 inline-block" />
                  AI track - 12 Month Plan
                </span>
              </div>
            </div>
          </div>

          {/* =========================================================================
              VIEW 1: "ALL COURSES" CATALOG (Figma node 112:16548)
             ========================================================================= */}
          {!viewMyCoursesOnly ? (
            <div className="flex flex-col gap-[24px] w-full">
              {/* Section Header with Heading and Dropdowns */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 w-full">
                <h1 className="font-['Plus_Jakarta_Sans'] font-semibold text-[20px] sm:text-[22px] leading-tight text-black">
                  All Courses
                </h1>

                {/* Dropdowns */}
                <div className="flex items-center gap-[12px] shrink-0">
                  {/* Sort Dropdown */}
                  <div className="relative">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowSortDropdown((prev) => !prev);
                        setShowRequiredDropdown(false);
                        setShowFilterPanel(false);
                      }}
                      className="h-[48px] px-[18px] bg-[#F4F4F4] shadow-[0px_2px_4px_rgba(0,0,0,0.1)] rounded-[999px] flex items-center gap-[8px] text-[14px] font-medium text-[#1E293B] hover:bg-gray-200 transition-all cursor-pointer"
                    >
                      <span>
                        Sort :{' '}
                        {sortOption === 'popular'
                          ? 'Most Popular'
                          : sortOption === 'rating'
                          ? 'Highest Rated'
                          : 'Newest'}
                      </span>
                      <svg
                        width="12"
                        height="8"
                        viewBox="0 0 12 8"
                        fill="none"
                        className={`transition-transform duration-200 ${showSortDropdown ? 'rotate-180' : ''}`}
                      >
                        <path
                          d="M1 1.5L6 6.5L11 1.5"
                          stroke="#6B7280"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </button>

                    {showSortDropdown && (
                      <div
                        onClick={(e) => e.stopPropagation()}
                        className="absolute start-0 sm:start-auto sm:end-0 top-[54px] w-[180px] bg-white rounded-[16px] shadow-xl border border-gray-100 py-2 z-30"
                      >
                        <button
                          type="button"
                          onClick={() => {
                            setSortOption('popular');
                            setShowSortDropdown(false);
                          }}
                          className={`w-full text-left px-4 py-2 text-[14px] transition-colors cursor-pointer ${
                            sortOption === 'popular'
                              ? 'bg-purple-50 text-[#5A198F] font-semibold'
                              : 'text-gray-700 hover:bg-gray-50'
                          }`}
                        >
                          Most Popular
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setSortOption('rating');
                            setShowSortDropdown(false);
                          }}
                          className={`w-full text-left px-4 py-2 text-[14px] transition-colors cursor-pointer ${
                            sortOption === 'rating'
                              ? 'bg-purple-50 text-[#5A198F] font-semibold'
                              : 'text-gray-700 hover:bg-gray-50'
                          }`}
                        >
                          Highest Rated
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setSortOption('newest');
                            setShowSortDropdown(false);
                          }}
                          className={`w-full text-left px-4 py-2 text-[14px] transition-colors cursor-pointer ${
                            sortOption === 'newest'
                              ? 'bg-purple-50 text-[#5A198F] font-semibold'
                              : 'text-gray-700 hover:bg-gray-50'
                          }`}
                        >
                          Newest
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Your Required Courses Dropdown */}
                  <div className="relative">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowRequiredDropdown((prev) => !prev);
                        setShowSortDropdown(false);
                        setShowFilterPanel(false);
                      }}
                      className="h-[48px] px-[18px] bg-[#F4F4F4] shadow-[0px_2px_4px_rgba(0,0,0,0.1)] rounded-[999px] flex items-center gap-[8px] text-[14px] font-medium text-[#1E293B] hover:bg-gray-200 transition-all cursor-pointer"
                    >
                      <span>
                        Your <strong className="text-[#5A198F] font-semibold">Required</strong>{' '}
                        Courses
                      </span>
                      <svg
                        width="12"
                        height="8"
                        viewBox="0 0 12 8"
                        fill="none"
                        className={`transition-transform duration-200 ${showRequiredDropdown ? 'rotate-180' : ''}`}
                      >
                        <path
                          d="M1 1.5L6 6.5L11 1.5"
                          stroke="#6B7280"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </button>

                    {showRequiredDropdown && (
                      <div
                        onClick={(e) => e.stopPropagation()}
                        className="absolute right-0 top-[54px] w-[210px] bg-white rounded-[16px] shadow-xl border border-gray-100 py-2 z-30"
                      >
                        <button
                          type="button"
                          onClick={() => {
                            setRequiredFilter('all');
                            setShowRequiredDropdown(false);
                          }}
                          className={`w-full text-left px-4 py-2 text-[14px] transition-colors cursor-pointer ${
                            requiredFilter === 'all'
                              ? 'bg-purple-50 text-[#5A198F] font-semibold'
                              : 'text-gray-700 hover:bg-gray-50'
                          }`}
                        >
                          All Courses
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setRequiredFilter('required');
                            setShowRequiredDropdown(false);
                          }}
                          className={`w-full text-left px-4 py-2 text-[14px] transition-colors cursor-pointer ${
                            requiredFilter === 'required'
                              ? 'bg-purple-50 text-[#5A198F] font-semibold'
                              : 'text-gray-700 hover:bg-gray-50'
                          }`}
                        >
                          Required Only
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* 4-Column Responsive Grid (Matching Figma 112:16548) */}
              {isLoadingCourses ? (
                <div className="w-full py-16 flex items-center justify-center bg-[#F9FAFB] rounded-[28px]">
                  <div className="size-8 animate-spin rounded-full border-3 border-[#5A198F] border-t-transparent" />
                </div>
              ) : courseLoadError ? (
                <div className="w-full py-8 px-6 flex flex-col items-center justify-center text-center bg-[#FFF1F0] rounded-[28px] border border-[#FFA39E] gap-2">
                  <p className="text-[#CF1322] font-medium text-[14px]">{courseLoadError}</p>
                  <button
                    type="button"
                    onClick={() => void fetchCourseList()}
                    className="px-4 py-1.5 bg-[#5A198F] text-white rounded-full text-xs font-semibold hover:bg-[#471273] transition-colors"
                  >
                    Retry
                  </button>
                </div>
              ) : filteredCourses.length === 0 ? (
                <div className="w-full py-12 px-6 flex flex-col items-center justify-center text-center bg-[#F9FAFB] rounded-[28px] border border-dashed border-[#E2E8F0]">
                  <p className="text-[#64748B] font-medium text-[14px]">
                    No courses found matching your current filter criteria.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-[repeat(auto-fill,minmax(min(100%,240px),1fr))] gap-[20px] w-full">
                  {filteredCourses.map((course) => {
                    const isEnrolled = !!enrolledCourses[course.id];
                  return (
                    <div
                      key={course.id}
                      onClick={() => navigate(`/courses/${course.id}`)}
                      className="bg-white rounded-[28px] shadow-[0px_4px_8px_rgba(0,0,0,0.08)] hover:shadow-[0px_10px_20px_rgba(90,25,143,0.12)] border border-gray-100 overflow-hidden flex flex-col justify-between cursor-pointer transition-all duration-300 hover:-translate-y-1 group"
                    >
                      {/* Top Thumbnail with Category Pill */}
                      <div className="relative w-full h-[150px] overflow-hidden bg-slate-900 shrink-0">
                        <img
                          src={course.thumbnail}
                          alt={course.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute left-[12px] top-[12px] px-[10px] py-[3px] bg-white/90 backdrop-blur-xs rounded-full shadow-xs">
                          <span className="font-['Plus_Jakarta_Sans'] font-bold text-[10px] text-black">
                            {course.category}
                          </span>
                        </div>
                      </div>

                      {/* Content Area */}
                      <div className="p-[16px] flex flex-col gap-[10px] flex-1 justify-between">
                        <div>
                          {/* Rating Row */}
                          <div className="flex items-center gap-1.5 mb-1.5">
                            <div className="flex items-center gap-0.5">
                              {[...Array(5)].map((_, i) => (
                                <svg key={i} width="11" height="9" viewBox="0 0 11 9" fill="none">
                                  <path
                                    d="M5.5 0L6.72456 2.48135L9.46009 2.87903L7.48005 4.80915L7.94721 7.53462L5.5 6.2475L3.05279 7.53462L3.51995 4.80915L1.53991 2.87903L4.27544 2.48135L5.5 0Z"
                                    fill="#FBBF24"
                                  />
                                </svg>
                              ))}
                            </div>
                            <span className="font-semibold text-[11px] text-[#334155]">
                              {course.rating}
                            </span>
                            <span className="text-[10px] text-[#94A3B8]">
                              {course.reviews}
                            </span>
                          </div>

                          {/* Course Title */}
                          <h3 className="font-['Plus_Jakarta_Sans'] font-medium text-[14px] leading-[19px] text-[#111827] line-clamp-2">
                            {course.title}
                          </h3>
                        </div>

                        <div>
                          {/* Instructor */}
                          <div className="flex items-center gap-2 mb-3">
                            <img
                              src={course.instructorAvatar}
                              alt={course.instructor}
                              className="size-[22px] rounded-full object-cover shrink-0"
                            />
                            <span className="text-[12px] text-[#475569] font-medium truncate">
                              {course.instructor}
                            </span>
                          </div>

                          {/* Meta Details: Hours, Level, Lessons */}
                          <div className="flex items-center justify-between text-[11px] text-[#64748B] pt-2 border-t border-gray-100">
                            <span>{course.duration}</span>
                            <span>·</span>
                            <span>{course.level}</span>
                            <span>·</span>
                            <span>{course.lessons}</span>
                          </div>
                        </div>
                      </div>

                      {/* Enroll Button */}
                      <div className="px-[16px] pb-[16px]">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEnrollToggle(course.id);
                          }}
                          className={`w-full h-[40px] rounded-full font-['Plus_Jakarta_Sans'] font-bold text-[13px] flex items-center justify-center transition-all cursor-pointer shadow-sm active:scale-98 ${
                            isEnrolled
                              ? 'bg-purple-100 text-[#5A198F] border border-[#5A198F]/40 hover:bg-purple-200'
                              : 'bg-[#5A198F] hover:bg-[#471273] text-white hover:shadow-md'
                          }`}
                        >
                          {isEnrolled ? 'Enrolled' : 'Enroll Now'}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
              )}
            </div>
          ) : (
            /* =========================================================================
                VIEW 2: "YOUR COURSES" SCREEN (Figma node 112:22726 "courses cart")
               ========================================================================= */
            <div className="flex flex-col lg:flex-row gap-[24px] items-start w-full">
              {/* Left Column: Your Courses & Finished Courses */}
              <div className="flex-1 max-w-[735px] flex flex-col gap-[28px] w-full">
                {/* 1. Section: Your Courses */}
                <section className="flex flex-col gap-[16px] w-full">
                  <h2 className="font-['Plus_Jakarta_Sans'] font-semibold text-[20px] text-black">
                    Your Courses
                  </h2>

                  <div className="flex flex-col sm:flex-row items-center gap-[24px] w-full">
                    {/* Card 1: Start */}
                    <div
                      onClick={() => navigate('/courses/data-analysis-fundamentals')}
                      className="w-full sm:w-[343px] h-[326px] bg-white rounded-[32px] shadow-[0px_4px_12px_rgba(0,0,0,0.08)] border border-gray-100 overflow-hidden shrink-0 flex flex-col justify-between cursor-pointer hover:shadow-lg transition-all group"
                    >
                      <div className="relative w-full h-[140px] overflow-hidden bg-slate-900 shrink-0">
                        <img
                          src="/images/course-data-ai.jpg"
                          alt="Data Cleaning and Exploratory Data Analysis"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute left-[13px] top-[14px] px-[10px] py-[3px] bg-white/90 backdrop-blur-xs rounded-full">
                          <span className="font-bold text-[10px] text-black">
                            Data Analysis
                          </span>
                        </div>
                      </div>

                      <div className="px-[16px] pt-[8px] flex flex-col gap-[8px]">
                        <div className="flex items-center gap-1">
                          <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                              <svg key={i} width="11" height="9" viewBox="0 0 11 9" fill="none">
                                <path
                                  d="M5.5 0L6.72456 2.48135L9.46009 2.87903L7.48005 4.80915L7.94721 7.53462L5.5 6.2475L3.05279 7.53462L3.51995 4.80915L1.53991 2.87903L4.27544 2.48135L5.5 0Z"
                                  fill="#FBBF24"
                                />
                              </svg>
                            ))}
                          </div>
                          <span className="font-semibold text-[11px] text-[#334155]">4.7</span>
                          <span className="text-[10px] text-[#94A3B8]">(1,802)</span>
                        </div>
                        <h3 className="font-medium text-[14px] text-[#111827] line-clamp-1">
                          Data Cleaning and Exploratory Data Analysis
                        </h3>
                        <div className="flex items-center gap-2">
                          <img
                            src="/images/avatar-elena-figma.jpg"
                            alt="Elena Vasquez"
                            className="size-[22px] rounded-full object-cover shrink-0"
                          />
                          <span className="text-[12px] text-[#475569]">Elena Vasquez</span>
                        </div>
                      </div>

                      <div className="p-[16px] pt-0">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate('/courses/data-analysis-fundamentals');
                          }}
                          className="w-full h-[40px] bg-[#5A198F] hover:bg-[#471273] active:scale-98 rounded-full font-bold text-[13px] text-white flex items-center justify-center transition-all cursor-pointer shadow-sm"
                        >
                          Start
                        </button>
                      </div>
                    </div>

                    {/* Card 2: Continue */}
                    <div
                      onClick={() => navigate('/courses/data-analysis-fundamentals/video')}
                      className="w-full sm:w-[343px] h-[326px] bg-white rounded-[32px] shadow-[0px_4px_12px_rgba(0,0,0,0.08)] border border-gray-100 overflow-hidden shrink-0 flex flex-col justify-between cursor-pointer hover:shadow-lg transition-all group"
                    >
                      <div className="relative w-full h-[140px] overflow-hidden bg-slate-900 shrink-0">
                        <img
                          src="/images/course-data-ai.jpg"
                          alt="Data Cleaning and Exploratory Data Analysis"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute left-[13px] top-[14px] px-[10px] py-[3px] bg-white/90 backdrop-blur-xs rounded-full">
                          <span className="font-bold text-[10px] text-black">
                            Data Analysis
                          </span>
                        </div>
                      </div>

                      <div className="px-[16px] pt-[8px] flex flex-col gap-[12px]">
                        <h3 className="font-medium text-[14px] text-[#111827] line-clamp-1">
                          Data Cleaning and Exploratory Data Analysis
                        </h3>
                        <div className="flex flex-col gap-[8px]">
                          <div className="flex items-center justify-between text-[12px] text-[#475569]">
                            <span>Remaining</span>
                            <span className="font-semibold text-[#111827]">19 lessons / 13 hours</span>
                          </div>
                          <div className="flex items-center justify-between text-[12px] text-[#475569]">
                            <span>Finished</span>
                            <span className="font-semibold text-[#111827]">13 lessons / 5 hours</span>
                          </div>
                        </div>
                      </div>

                      <div className="p-[16px] pt-0">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate('/courses/data-analysis-fundamentals/video');
                          }}
                          className="w-full h-[40px] bg-[#5A198F] hover:bg-[#471273] active:scale-98 rounded-full font-bold text-[13px] text-white flex items-center justify-center transition-all cursor-pointer shadow-sm"
                        >
                          Continue
                        </button>
                      </div>
                    </div>
                  </div>
                </section>

                {/* 2. Section: Finished Courses */}
                <section className="flex flex-col gap-[16px] w-full">
                  <h2 className="font-['Plus_Jakarta_Sans'] font-semibold text-[20px] text-black">
                    Finished Courses
                  </h2>

                  <div className="flex flex-col sm:flex-row items-center gap-[24px] w-full">
                    {/* Finished Card 1: Python with NEW UPDATE */}
                    <div
                      onClick={() => navigate('/courses/data-analysis-fundamentals')}
                      className="w-full sm:w-[343px] h-[326px] bg-white rounded-[32px] shadow-[0px_4px_12px_rgba(0,0,0,0.08)] border border-gray-100 overflow-hidden shrink-0 flex flex-col justify-between cursor-pointer hover:shadow-lg transition-all group"
                    >
                      <div className="relative w-full h-[140px] overflow-hidden bg-slate-900 shrink-0">
                        <img
                          src="/images/course-data-ai.jpg"
                          alt="Python Programming"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute left-[13px] top-[14px] px-[10px] py-[3px] bg-white/90 backdrop-blur-xs rounded-full">
                          <span className="font-bold text-[10px] text-black">
                            Data Analysis
                          </span>
                        </div>
                        <div className="absolute right-[13px] top-[14px] px-[10px] py-[3px] bg-[#EAFAEA] rounded-full border border-[#008A2E]/30">
                          <span className="font-bold text-[10px] text-[#008A2E]">
                            NEW UPDATE
                          </span>
                        </div>
                      </div>

                      <div className="px-[16px] pt-[8px] flex flex-col gap-[12px]">
                        <h3 className="font-medium text-[15px] text-black">
                          Python Programming
                        </h3>
                        <div className="flex flex-col gap-[6px]">
                          <div className="flex items-center justify-between text-[#008A2E] font-semibold text-[12px]">
                            <span>New Lesson Uploaded</span>
                            <span>13 lessons / 14 lessons</span>
                          </div>
                          <div className="flex items-center justify-between text-[#64748B] text-[12px]">
                            <span>Scored</span>
                            <span className="font-semibold text-gray-900">90%</span>
                          </div>
                        </div>
                      </div>

                      <div className="p-[16px] pt-0">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate('/courses/data-analysis-fundamentals');
                          }}
                          className="w-full h-[40px] bg-[#5A198F] hover:bg-[#471273] active:scale-98 rounded-full font-bold text-[13px] text-white flex items-center justify-center transition-all cursor-pointer shadow-sm"
                        >
                          Continue
                        </button>
                      </div>
                    </div>

                    {/* Finished Card 2: Python 100% completed */}
                    <div className="w-full sm:w-[343px] h-[326px] bg-white rounded-[32px] shadow-[0px_4px_12px_rgba(0,0,0,0.08)] border border-gray-100 overflow-hidden shrink-0 flex flex-col justify-between">
                      <div className="relative w-full h-[140px] overflow-hidden bg-slate-900 shrink-0">
                        <img
                          src="/images/course-data-ai.jpg"
                          alt="Python Programming"
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute left-[13px] top-[14px] px-[10px] py-[3px] bg-white/90 backdrop-blur-xs rounded-full">
                          <span className="font-bold text-[10px] text-black">
                            Data Analysis
                          </span>
                        </div>
                      </div>

                      <div className="px-[16px] pt-[8px] flex flex-col gap-[12px]">
                        <h3 className="font-medium text-[15px] text-black">
                          Python Programming
                        </h3>
                        <div className="flex items-center justify-between text-[#64748B] text-[12px]">
                          <span>Finished</span>
                          <span className="font-semibold text-gray-900">13 lessons / 13 lessons</span>
                        </div>
                      </div>

                      <div className="p-[16px] pt-0">
                        <button
                          type="button"
                          disabled
                          className="w-full h-[40px] bg-[#5A198F]/50 text-white rounded-full font-bold text-[13px] flex items-center justify-center cursor-default"
                        >
                          Finished
                        </button>
                      </div>
                    </div>
                  </div>
                </section>
              </div>

              {/* Right Column: 2 Cards (Matching Figma node 112:22879 and 112:22915) */}
              <div className="w-full lg:w-[310px] flex flex-col gap-[20px] shrink-0">
                {/* Card 1: 3-Stage Progress Card (Exact Figma node 112:22879) */}
                <div className="bg-[#F4F4F4] rounded-[32px] p-[24px] shadow-[0px_4px_12px_rgba(0,0,0,0.08)] flex flex-col gap-[20px]">
                  {/* Stage 1 - Courses (Active) */}
                  <div className="flex flex-col gap-[10px]">
                    <div className="flex items-center gap-[10px]">
                      <div className="size-[10px] rounded-full bg-[#5A198F] ring-4 ring-[#5A198F]/20" />
                      <h4 className="font-['Plus_Jakarta_Sans'] font-bold text-[15px] text-[#111827]">
                        Stage 1 - Courses
                      </h4>
                    </div>
                    <div className="pl-[20px] flex flex-col gap-[8px]">
                      <div className="flex items-center justify-between text-[11px] text-[#475569] font-medium">
                        <span>First 6 months · Required track courses</span>
                        <span className="font-bold text-[#5A198F]">65%</span>
                      </div>
                      {/* Gradient Progress Bar */}
                      <div className="w-full h-[7px] bg-[#E2E8F0] rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-[#5A198F] to-[#A855F7] rounded-full w-[65%]" />
                      </div>
                      <p className="text-[11px] text-[#64748B] leading-relaxed">
                        Continue learning your required courses.
                      </p>
                    </div>
                  </div>

                  {/* Stage 2 - Internship (Locked) */}
                  <div className="flex flex-col gap-[8px] pt-[14px] border-t border-gray-200/80">
                    <div className="flex items-center gap-[10px]">
                      <div className="size-[10px] rounded-full bg-[#94A3B8]" />
                      <h4 className="font-['Plus_Jakarta_Sans'] font-semibold text-[14px] text-[#475569]">
                        Stage 2 — Internship
                      </h4>
                    </div>
                    <div className="pl-[20px] flex items-start gap-2 bg-white/70 p-3 rounded-2xl border border-gray-100">
                      <Lock className="size-4 text-[#64748B] shrink-0 mt-0.5" />
                      <div>
                        <p className="text-[11px] font-semibold text-[#334155]">
                          Unlocks after completing required courses
                        </p>
                        <p className="text-[10px] text-[#64748B] leading-relaxed mt-0.5">
                          Your internship and squad become available here.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Stage 3 - Graduation (Locked) */}
                  <div className="flex flex-col gap-[8px] pt-[14px] border-t border-gray-200/80">
                    <div className="flex items-center gap-[10px]">
                      <div className="size-[10px] rounded-full bg-[#94A3B8]" />
                      <h4 className="font-['Plus_Jakarta_Sans'] font-semibold text-[14px] text-[#475569]">
                        Stage 3 — Graduation
                      </h4>
                    </div>
                    <div className="pl-[20px] flex items-start gap-2 bg-white/70 p-3 rounded-2xl border border-gray-100">
                      <Lock className="size-4 text-[#64748B] shrink-0 mt-0.5" />
                      <div>
                        <p className="text-[11px] font-semibold text-[#334155]">
                          Final stage
                        </p>
                        <p className="text-[10px] text-[#64748B] leading-relaxed mt-0.5">
                          Collect your course, internship and mentorship certificates.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Card 2: Your Required Courses Stepper (Exact Figma node 112:22915) */}
                <div className="bg-[#F4F4F4] rounded-[32px] p-[24px] shadow-[0px_4px_12px_rgba(0,0,0,0.08)] flex flex-col">
                  <h3 className="font-['Plus_Jakarta_Sans'] font-semibold text-[17px] mb-[20px]">
                    <span className="text-black">Your </span>
                    <span className="text-[#3B0454] font-bold">Required</span>
                    <span className="text-black"> Courses</span>
                  </h3>

                  <div className="flex gap-[16px] items-start">
                    {/* Badges Column */}
                    <div className="flex flex-col gap-[6px] items-center w-[38px] shrink-0">
                      {/* Step 1 */}
                      <div className="size-[36px] bg-[#D8FDD1] rounded-full flex items-center justify-center font-extrabold text-[15px] text-[#008A2E] shrink-0">
                        1
                      </div>
                      <div className="h-[28px] w-0.5 bg-[#CBD5E1]" />

                      {/* Step 2 */}
                      <div className="size-[36px] bg-[#5A198F] rounded-full flex items-center justify-center font-extrabold text-[15px] text-white shrink-0 shadow-sm">
                        2
                      </div>
                      <div className="h-[28px] w-0.5 border-l-2 border-dashed border-[#CBD5E1]" />

                      {/* Step 3 */}
                      <div className="size-[36px] bg-[#E2E8F0] rounded-full flex items-center justify-center font-extrabold text-[15px] text-[#64748B] shrink-0">
                        3
                      </div>
                      <div className="h-[28px] w-0.5 border-l-2 border-dashed border-[#CBD5E1]" />

                      {/* Step 4 */}
                      <div className="size-[36px] bg-[#E2E8F0] rounded-full flex items-center justify-center font-extrabold text-[15px] text-[#64748B] shrink-0">
                        4
                      </div>
                    </div>

                    {/* Text Details Column */}
                    <div className="flex flex-col gap-[24px] pt-1">
                      <div>
                        <h4 className="font-medium text-[14px] text-black leading-tight">
                          Python Programming
                        </h4>
                        <span className="font-semibold text-[11px] text-[#008A2E]">
                          Completed
                        </span>
                      </div>

                      <div>
                        <h4 className="font-medium text-[14px] text-black leading-tight">
                          Data Analysis
                        </h4>
                        <span className="font-semibold text-[11px] text-[#5A198F]">
                          Progress 60%
                        </span>
                      </div>

                      <div>
                        <h4 className="font-medium text-[14px] text-[#475569] leading-tight">
                          Machine Learning
                        </h4>
                        <span className="font-medium text-[11px] text-[#94A3B8]">
                          Not Started
                        </span>
                      </div>

                      <div>
                        <h4 className="font-medium text-[14px] text-[#475569] leading-tight">
                          Generative AI & LLMs
                        </h4>
                        <span className="font-medium text-[11px] text-[#94A3B8]">
                          Not Started
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Courses12mPage;
