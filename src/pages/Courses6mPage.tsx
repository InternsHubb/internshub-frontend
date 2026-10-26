import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Menu,
  X,
} from 'lucide-react';
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

const TRACK_COURSES_DATA: Course[] = [
  {
    id: 'track-1',
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
    id: 'track-2',
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
    id: 'track-3',
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
    id: 'track-4',
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
    isRequired: false,
  },
  {
    id: 'track-5',
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
];

const POPULAR_COURSES_DATA: Course[] = [
  {
    id: 'popular-1',
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
    isRequired: false,
  },
  {
    id: 'popular-2',
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
    isRequired: false,
  },
  {
    id: 'popular-3',
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
    isRequired: false,
  },
  {
    id: 'popular-4',
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
    isRequired: false,
  },
  {
    id: 'popular-5',
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

const LEVEL_FILTER_OPTIONS = [
  'Beginner',
  'Intermediate',
  'Advanced',
];

/**
 * Hook to automatically scroll horizontal container smoothly when mouse cursor
 * reaches/approaches either the left or right edge, and support intuitive drag-to-scroll.
 */
function useEdgeScroll<T extends HTMLElement>() {
  const ref = React.useRef<T>(null);

  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let animationFrameId: number | null = null;
    let scrollSpeed = 0;
    const EDGE_THRESHOLD = 180; // Distance in px from edge to start scrolling
    const MAX_SPEED = 20; // Maximum scroll speed in px per frame

    const step = () => {
      if (scrollSpeed !== 0 && el) {
        el.scrollLeft += scrollSpeed;
        animationFrameId = requestAnimationFrame(step);
      } else {
        animationFrameId = null;
      }
    };

    const startScrolling = (speed: number) => {
      scrollSpeed = speed;
      if (!animationFrameId) {
        animationFrameId = requestAnimationFrame(step);
      }
    };

    const stopScrolling = () => {
      scrollSpeed = 0;
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
        animationFrameId = null;
      }
    };

    let isDown = false;
    let startX = 0;
    let scrollLeftStart = 0;

    const handleMouseDown = (e: MouseEvent) => {
      if (e.button !== 0) return;
      const target = e.target as HTMLElement;
      if (target.closest('button, a, input, select')) return;

      isDown = true;
      startX = e.pageX - el.offsetLeft;
      scrollLeftStart = el.scrollLeft;
      el.style.cursor = 'grabbing';
      el.style.userSelect = 'none';
    };

    const handleMouseUp = () => {
      if (isDown) {
        isDown = false;
        el.style.cursor = '';
        el.style.userSelect = '';
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (isDown) {
        e.preventDefault();
        const x = e.pageX - el.offsetLeft;
        const walk = (x - startX) * 1.5;
        el.scrollLeft = scrollLeftStart - walk;
        return;
      }

      const rect = el.getBoundingClientRect();
      const mouseX = e.clientX;
      const mouseY = e.clientY;

      // Only scroll when cursor is within the vertical bounds of the carousel (with 25px leeway)
      if (mouseY < rect.top - 20 || mouseY > rect.bottom + 20) {
        stopScrolling();
        return;
      }

      // Stop if mouse is too far horizontally from the container bounds
      if (mouseX < rect.left - 60 || mouseX > rect.right + 60) {
        stopScrolling();
        return;
      }

      const distLeft = mouseX - rect.left;
      const distRight = rect.right - mouseX;

      if (distRight < EDGE_THRESHOLD) {
        // Cursor reached or approaching right edge -> smoothly scroll right
        const intensity = distRight <= 0 ? 1 : (EDGE_THRESHOLD - distRight) / EDGE_THRESHOLD;
        const speed = Math.max(3, Math.round(intensity * MAX_SPEED));
        startScrolling(speed);
      } else if (distLeft < EDGE_THRESHOLD) {
        // Cursor reached or approaching left edge -> smoothly scroll left
        const intensity = distLeft <= 0 ? 1 : (EDGE_THRESHOLD - distLeft) / EDGE_THRESHOLD;
        const speed = -Math.max(3, Math.round(intensity * MAX_SPEED));
        startScrolling(speed);
      } else {
        stopScrolling();
      }
    };

    const handleMouseLeave = () => {
      stopScrolling();
      if (isDown) {
        isDown = false;
        el.style.cursor = '';
        el.style.userSelect = '';
      }
    };

    const handleDragStart = (e: DragEvent) => {
      e.preventDefault();
    };

    el.addEventListener('mousedown', handleMouseDown);
    el.addEventListener('dragstart', handleDragStart);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('blur', handleMouseLeave);
    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      stopScrolling();
      el.removeEventListener('mousedown', handleMouseDown);
      el.removeEventListener('dragstart', handleDragStart);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('blur', handleMouseLeave);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return ref;
}

export const Courses6mPage: React.FC = () => {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOption, setSortOption] = useState<'popular' | 'rating' | 'newest'>('popular');
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const [requiredFilter, setRequiredFilter] = useState<'required' | 'all'>('required');
  const [showRequiredDropdown, setShowRequiredDropdown] = useState(false);
  const [viewMyCoursesOnly, setViewMyCoursesOnly] = useState(false);
  const [enrolledCourses, setEnrolledCourses] = useState<Record<string, boolean>>(() => {
    try {
      const saved = localStorage.getItem('enrolled_courses');
      if (saved) return JSON.parse(saved);
    } catch {}
    return { data_analysis: true };
  });
  const [activeNav, setActiveNav] = useState('courses');

  // Searchbar Filter Modal State (Figma node 112:9592)
  const [showFilterPanel, setShowFilterPanel] = useState(false);
  const [selectedTracks, setSelectedTracks] = useState<string[]>([]);
  const [selectedLevels, setSelectedLevels] = useState<string[]>([]);
  const [appliedTracks, setAppliedTracks] = useState<string[]>([]);
  const [appliedLevels, setAppliedLevels] = useState<string[]>([]);
  const [trackSectionOpen, setTrackSectionOpen] = useState(true);
  const [levelSectionOpen, setLevelSectionOpen] = useState(true);

  // Carousel edge auto-scroll and drag refs
  const trackCarouselRef = useEdgeScroll<HTMLDivElement>();
  const popularCarouselRef = useEdgeScroll<HTMLDivElement>();

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

  // Close dropdowns when clicking anywhere outside
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
        localStorage.setItem('enrolled_courses', JSON.stringify(next));
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

  const activeTrackCourses = useMemo<Course[]>(() => {
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
    return TRACK_COURSES_DATA;
  }, [backendCourses]);

  const activePopularCourses = useMemo<Course[]>(() => {
    if (backendCourses.length > 5) {
      return backendCourses.slice(5).map((c) => ({
        id: c.id,
        title: c.title,
        category: c.trackName || 'General',
        instructor: c.trackName ? `${c.trackName} Specialist` : 'Course Instructor',
        instructorAvatar: '/images/avatar-elena-figma.jpg',
        rating: 4.7,
        reviews: `(${c.lessonCount} lessons)`,
        duration: formatDuration(c.totalDurationSeconds),
        level: 'All Levels',
        lessons: `${c.lessonCount} lessons`,
        thumbnail: '/images/course-thumb-figma-2.jpg',
        isRequired: false,
      }));
    }
    return POPULAR_COURSES_DATA;
  }, [backendCourses]);

  // Top Section Courses:
  // When viewMyCoursesOnly is active, shows all added/enrolled courses in one place.
  // When normal, shows track-specific courses.
  const filteredTrackCourses = useMemo(() => {
    const sourceList = viewMyCoursesOnly
      ? [...activeTrackCourses, ...activePopularCourses].filter(
          (course) => enrolledCourses[course.id]
        )
      : activeTrackCourses;

    let result = sourceList.filter((course) => {
      const matchesSearch =
        course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.instructor.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.category.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesRequired =
        viewMyCoursesOnly || requiredFilter === 'all' || course.isRequired;

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
    }

    return result;
  }, [searchQuery, requiredFilter, viewMyCoursesOnly, enrolledCourses, appliedTracks, appliedLevels, sortOption, activeTrackCourses, activePopularCourses]);

  // Bottom Section Courses:
  // Shows popular courses, strictly excluding any course already enrolled or present in the top section
  // so no course can ever appear twice on the screen.
  const filteredPopularCourses = useMemo(() => {
    return activePopularCourses.filter((course) => {
      // If viewing my courses, popular courses only displays courses that are NOT yet enrolled
      const matchesEnrolled = !viewMyCoursesOnly || !enrolledCourses[course.id];

      const matchesSearch =
        course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.instructor.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.category.toLowerCase().includes(searchQuery.toLowerCase());

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

      // Must never duplicate any course already shown in the top section
      const notInTrack = !filteredTrackCourses.some((tc) => tc.id === course.id);

      return matchesEnrolled && matchesSearch && matchesTrack && matchesLevel && notInTrack;
    });
  }, [searchQuery, viewMyCoursesOnly, enrolledCourses, appliedTracks, appliedLevels, filteredTrackCourses]);

  return (
    <div className="min-h-screen bg-[#FEFEFE] relative overflow-hidden font-['Plus_Jakarta_Sans',sans-serif] text-slate-800 flex justify-start selection:bg-purple-200 selection:text-purple-900">
      {/* Decorative blurred background blobs matching Figma CSS */}
      <div
        className="absolute pointer-events-none w-[290px] h-[296px] left-[252px] bottom-[549px] bg-[#C693FD] opacity-20 blur-[29.0732px] rounded-[9084.46px] -rotate-[2.19deg]"
        aria-hidden="true"
      />
      <div
        className="absolute pointer-events-none w-[222.84px] h-[172.61px] left-[1253px] top-[100px] bg-[#C693FD] opacity-20 blur-[29.0732px] rounded-[9084.46px] -rotate-[129.7deg]"
        aria-hidden="true"
      />
      <div
        className="absolute pointer-events-none w-[222.84px] h-[172.61px] left-[523px] bottom-[55.39px] bg-[#C693FD] opacity-20 blur-[29.0732px] rounded-[9084.46px] -rotate-[129.7deg]"
        aria-hidden="true"
      />

      {/* Main Canvas Container - aligned closer to browser edge */}
      <div className="w-full min-h-[1024px] flex flex-col lg:flex-row pl-1.5 sm:pl-2 lg:pl-6 pr-3 sm:pr-4 lg:pr-6 py-4 lg:py-6 gap-5 lg:gap-6 relative z-10 flow-page-enter">
        {/* Mobile Header (screen < 1024px) */}
        <div className="lg:hidden flex items-center justify-between bg-[#3B0454] text-white px-5 py-4 rounded-[24px] shadow-lg mb-2">
          <Link to={ROUTES.home} className="flex items-center gap-3">
            {/* reicon:grad-cap-filled (Figma node 112:9043: exact vector) */}
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
            EXACT FIGMA SIDEBAR (Node 112:8998)
            Dimensions: width 308px, height 976px
            Background: #3B0454, Border-Radius: 34px
           ========================================================================= */}
        <aside
          className={`fixed lg:sticky top-4 lg:top-6 left-1.5 sm:left-2 lg:left-6 w-[308px] h-[976px] bg-[#3B0454] rounded-[34px] shadow-2xl z-50 flex flex-col overflow-hidden transition-transform duration-300 ease-in-out shrink-0 select-none ${
            mobileMenuOpen ? 'translate-x-0' : '-translate-x-[340px] lg:translate-x-0'
          }`}
        >
          {/* Header (Figma node 112:9041: width 222px, height 43px, left 43px, top 62px) */}
          <div className="absolute top-[62px] left-[43px] w-[222px] h-[43px] flex items-center justify-start">
            <Link
              to={ROUTES.home}
              className="flex items-center gap-[10px] text-white cursor-pointer hover:opacity-95 transition-opacity"
              title="Interns HUB"
            >
              {/* reicon:grad-cap-filled (Figma node 112:9043: exact vector) */}
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
              {/* Interns HUB Text (Figma node 112:9047: font-size 30px, weight 700) */}
              <span className="font-['Plus_Jakarta_Sans'] font-bold text-[30px] leading-none text-white tracking-tight whitespace-nowrap">
                Interns HUB
              </span>
            </Link>
          </div>

          {/* Navigation Menu (Figma node 112:8999: width 249px, left 29px, top 166px, gap 16px) */}
          <nav className="absolute top-[166px] left-[29px] w-[249px] flex flex-col gap-[16px]">
            {/* 1. Internship (Item → Button 112:9003: 248.75px × 39.96px, radius 8px) */}
            <button
              type="button"
              onClick={() => setActiveNav('internship')}
              className={`w-[248.75px] h-[39.96px] rounded-[8px] flex items-center px-[12px] gap-[12px] text-[#EDE6F3] text-[18px] font-medium leading-none font-['Plus_Jakarta_Sans'] cursor-pointer transition-all ${
                activeNav === 'internship'
                  ? 'bg-gradient-to-r from-[#3A0353] to-[#804A8A]'
                  : 'hover:bg-white/10'
              }`}
            >
              {/* fa7-solid:tasks (Exact Figma vector) */}
              <svg width="23" height="23" viewBox="0 0 23 23" fill="none" className="shrink-0">
                <path
                  d="M7.10844 3.60453C7.50016 3.87766 7.59359 4.41672 7.32047 4.80484L5.30797 7.67984C5.16062 7.88828 4.93063 8.02125 4.67547 8.04281C4.42031 8.06438 4.16875 7.97813 3.98906 7.79844L2.55156 6.36094C2.21734 6.02313 2.21734 5.47688 2.55156 5.13906C2.88578 4.80125 3.43562 4.80484 3.77344 5.13906L4.485 5.85063L5.90812 3.81656C6.18125 3.42484 6.72031 3.33141 7.10844 3.60453ZM7.10844 9.35453C7.50016 9.62766 7.59359 10.1667 7.32047 10.5548L5.30797 13.4298C5.16062 13.6383 4.93063 13.7712 4.67547 13.7928C4.42031 13.8144 4.16875 13.7281 3.98906 13.5484L2.55156 12.1109C2.21375 11.7731 2.21375 11.2269 2.55156 10.8927C2.88938 10.5584 3.43562 10.5548 3.76984 10.8927L4.48141 11.6042L5.90453 9.57016C6.17766 9.17844 6.71672 9.085 7.10484 9.35812L7.10844 9.35453ZM10.35 5.75C10.35 5.11391 10.8639 4.6 11.5 4.6H19.55C20.1861 4.6 20.7 5.11391 20.7 5.75C20.7 6.38609 20.1861 6.9 19.55 6.9H11.5C10.8639 6.9 10.35 6.38609 10.35 5.75ZM10.35 11.5C10.35 10.8639 10.8639 10.35 11.5 10.35H19.55C20.1861 10.35 20.7 10.8639 20.7 11.5C20.7 12.1361 20.1861 12.65 19.55 12.65H11.5C10.8639 12.65 10.35 12.1361 10.35 11.5ZM8.05 17.25C8.05 16.6139 8.56391 16.1 9.2 16.1H19.55C20.1861 16.1 20.7 16.6139 20.7 17.25C20.7 17.8861 20.1861 18.4 19.55 18.4H9.2C8.56391 18.4 8.05 17.8861 8.05 17.25ZM4.6 15.8125C5.39422 15.8125 6.0375 16.4558 6.0375 17.25C6.0375 18.0442 5.39422 18.6875 4.6 18.6875C3.80578 18.6875 3.1625 18.0442 3.1625 17.25C3.1625 16.4558 3.80578 15.8125 4.6 15.8125Z"
                  fill="white"
                />
              </svg>
              <span>Internship</span>
            </button>

            {/* 2. My Squad (Item → Link 112:9007: 248.75px × 39.96px, radius 8px) */}
            <button
              type="button"
              onClick={() => setActiveNav('squad')}
              className={`w-[248.75px] h-[39.96px] rounded-[8px] flex items-center px-[12px] gap-[12px] text-[#EDE6F3] text-[18px] font-medium leading-none font-['Plus_Jakarta_Sans'] cursor-pointer transition-all ${
                activeNav === 'squad'
                  ? 'bg-gradient-to-r from-[#3A0353] to-[#804A8A]'
                  : 'hover:bg-white/10'
              }`}
            >
              {/* vuesax/linear/people (Exact Figma vector) */}
              <svg width="23" height="23" viewBox="0 0 23 23" fill="none" className="shrink-0">
                <path
                  d="M17.25 6.86167C17.1925 6.85209 17.1254 6.85209 17.0679 6.86167C15.7454 6.81375 14.6913 5.73083 14.6913 4.38917C14.6913 3.01875 15.7933 1.91667 17.1637 1.91667C18.5342 1.91667 19.6362 3.02834 19.6362 4.38917C19.6267 5.73083 18.5725 6.81375 17.25 6.86167Z"
                  stroke="#FAF8F1"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M16.2629 13.8383C17.5758 14.0588 19.0229 13.8288 20.0388 13.1483C21.39 12.2475 21.39 10.7717 20.0388 9.87084C19.0133 9.19043 17.5471 8.96042 16.2342 9.19042"
                  stroke="#FAF8F1"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M5.72125 6.86167C5.77875 6.85209 5.84583 6.85209 5.90333 6.86167C7.22583 6.81375 8.28 5.73083 8.28 4.38917C8.28 3.01875 7.17792 1.91667 5.8075 1.91667C4.43708 1.91667 3.335 3.02834 3.335 4.38917C3.34458 5.73083 4.39875 6.81375 5.72125 6.86167Z"
                  stroke="#FAF8F1"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M6.70833 13.8383C5.39542 14.0588 3.94834 13.8288 2.9325 13.1483C1.58125 12.2475 1.58125 10.7717 2.9325 9.87084C3.95792 9.19043 5.42417 8.96042 6.73708 9.19042"
                  stroke="#FAF8F1"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M11.5 14.0204C11.4425 14.0108 11.3754 14.0108 11.3179 14.0204C9.99542 13.9725 8.94125 12.8896 8.94125 11.5479C8.94125 10.1775 10.0433 9.07542 11.4137 9.07542C12.7842 9.07542 13.8863 10.1871 13.8863 11.5479C13.8767 12.8896 12.8225 13.9821 11.5 14.0204Z"
                  stroke="#FAF8F1"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M8.71125 17.0392C7.36 17.94 7.36 19.4158 8.71125 20.3167C10.2446 21.3421 12.7554 21.3421 14.2888 20.3167C15.64 19.4158 15.64 17.94 14.2888 17.0392C12.765 16.0233 10.2446 16.0233 8.71125 17.0392Z"
                  stroke="#FAF8F1"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span>My Squad</span>
            </button>

            {/* 3. Courses (Active Item 112:9010: 248.75px × 40px, linear-gradient(#3A0353 -> #804A8A), radius 8px) */}
            <button
              type="button"
              onClick={() => {
                setActiveNav('courses');
                setViewMyCoursesOnly(false);
              }}
              className="w-[248.75px] h-[40px] rounded-[8px] bg-gradient-to-r from-[#3A0353] to-[#804A8A] flex items-center px-[12px] gap-[12px] text-[#EDE6F3] text-[18px] font-medium leading-none font-['Plus_Jakarta_Sans'] shadow-md cursor-pointer"
            >
              {/* vuesax/bold/book (Exact Figma vector) */}
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
              <span className="text-[#EDE6F3]">Courses</span>
            </button>

            {/* 4. Mentorship (Item → Button 112:9015: 248.75px × 39.96px, radius 8px) */}
            <button
              type="button"
              onClick={() => setActiveNav('mentorship')}
              className={`w-[248.75px] h-[39.96px] rounded-[8px] flex items-center px-[12px] gap-[12px] text-[#EDE6F3] text-[18px] font-medium leading-none font-['Plus_Jakarta_Sans'] cursor-pointer transition-all ${
                activeNav === 'mentorship'
                  ? 'bg-gradient-to-r from-[#3A0353] to-[#804A8A]'
                  : 'hover:bg-white/10'
              }`}
            >
              {/* vuesax/linear/user-octagon (Exact Figma vector) */}
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="shrink-0">
                <path
                  d="M21.08 8.58003V15.42C21.08 16.54 20.48 17.58 19.51 18.15L13.57 21.58C12.6 22.14 11.4 22.14 10.42 21.58L4.48 18.15C3.51 17.59 2.91 16.55 2.91 15.42V8.58003C2.91 7.46003 3.51 6.41999 4.48 5.84999L10.42 2.42C11.39 1.86 12.59 1.86 13.57 2.42L19.51 5.84999C20.48 6.41999 21.08 7.45003 21.08 8.58003Z"
                  stroke="white"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M14.33 8.66998C14.33 9.95681 13.2868 11 12 11C10.7132 11 9.67 9.95681 9.67 8.66998C9.67 7.38316 10.7132 6.34003 12 6.34003C13.2868 6.34003 14.33 7.38316 14.33 8.66998Z"
                  stroke="white"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M16 16.66C16 14.86 14.21 13.4 12 13.4C9.79 13.4 8 14.86 8 16.66"
                  stroke="white"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span>Mentorship</span>
            </button>

            {/* 5. Sprints (Item → Button 112:9019: 248.75px × 39.96px, radius 8px) */}
            <button
              type="button"
              onClick={() => setActiveNav('sprints')}
              className={`w-[248.75px] h-[39.96px] rounded-[8px] flex items-center px-[12px] gap-[12px] text-[#EDE6F3] text-[18px] font-medium leading-none font-['Plus_Jakarta_Sans'] cursor-pointer transition-all ${
                activeNav === 'sprints'
                  ? 'bg-gradient-to-r from-[#3A0353] to-[#804A8A]'
                  : 'hover:bg-white/10'
              }`}
            >
              {/* fluent:arrow-sprint-16-filled (Exact Figma vector) */}
              <svg width="23" height="23" viewBox="0 0 23 23" fill="none" className="shrink-0">
                <path
                  d="M11.5 7.90625C11.1223 7.90568 10.7482 7.97966 10.3991 8.12394C10.05 8.26822 9.73288 8.47997 9.4658 8.74705C9.19872 9.01413 8.98697 9.3313 8.84269 9.68036C8.69841 10.0294 8.62443 10.4035 8.625 10.7812C8.625 11.5437 8.9279 12.275 9.46707 12.8142C10.0062 13.3533 10.7375 13.6562 11.5 13.6562H17.8825L17.5663 13.34C17.3758 13.1356 17.2721 12.8653 17.2771 12.586C17.282 12.3067 17.3951 12.0402 17.5927 11.8427C17.7902 11.6451 18.0567 11.532 18.336 11.5271C18.6153 11.5221 18.8856 11.6258 19.09 11.8163L21.2463 13.9725C21.4481 14.1746 21.5616 14.4487 21.5616 14.7344C21.5616 15.0201 21.4481 15.2941 21.2463 15.4962L19.09 17.6525C18.9913 17.7584 18.8723 17.8434 18.74 17.9023C18.6078 17.9612 18.465 17.9929 18.3203 17.9955C18.1755 17.998 18.0317 17.9714 17.8975 17.9172C17.7632 17.863 17.6413 17.7822 17.5389 17.6799C17.4365 17.5775 17.3558 17.4555 17.3016 17.3213C17.2473 17.1871 17.2207 17.0433 17.2233 16.8985C17.2258 16.7537 17.2575 16.611 17.3164 16.4787C17.3754 16.3465 17.4603 16.2275 17.5663 16.1288L17.8825 15.8125H11.5C10.6203 15.8127 9.75587 15.5821 8.99303 15.1439C8.2302 14.7057 7.5956 14.0752 7.15254 13.3152C6.70947 12.5551 6.47343 11.6922 6.46796 10.8125C6.4625 9.9328 6.68779 9.06703 7.12138 8.30156C7.66878 7.33434 8.52104 6.57559 9.5451 6.14376C10.5692 5.71193 11.7074 5.63133 12.7821 5.91453C13.8568 6.19773 14.8074 6.8288 15.4857 7.70923C16.1639 8.58965 16.5316 9.66987 16.5312 10.7812V10.8172C16.1431 11.2139 15.9117 11.7084 15.8384 12.2188H13.9898C14.2421 11.7817 14.3749 11.2859 14.3749 10.7813C14.3749 10.2766 14.2421 9.78083 13.9898 9.34378C13.7374 8.90673 13.3745 8.54379 12.9375 8.29145C12.5004 8.03912 12.0047 7.90626 11.5 7.90625ZM3.95312 13.6562H5.704C6.12087 14.4943 6.71312 15.2289 7.43331 15.8125H3.95312C3.66719 15.8125 3.39296 15.6989 3.19078 15.4967C2.98859 15.2945 2.875 15.0203 2.875 14.7344C2.875 14.4484 2.98859 14.1742 3.19078 13.972C3.39296 13.7698 3.66719 13.6562 3.95312 13.6562Z"
                  fill="white"
                  fillOpacity="0.8"
                />
              </svg>
              <span>Sprints</span>
            </button>

            {/* 6. Progress (Item → Button 112:9023: 248.75px × 39.96px, radius 8px) */}
            <button
              type="button"
              onClick={() => setActiveNav('progress')}
              className={`w-[248.75px] h-[39.96px] rounded-[8px] flex items-center px-[12px] gap-[12px] text-[#EDE6F3] text-[18px] font-medium leading-none font-['Plus_Jakarta_Sans'] cursor-pointer transition-all ${
                activeNav === 'progress'
                  ? 'bg-gradient-to-r from-[#3A0353] to-[#804A8A]'
                  : 'hover:bg-white/10'
              }`}
            >
              {/* carbon:in-progress (Exact Figma vector) */}
              <svg width="23" height="23" viewBox="0 0 23 23" fill="none" className="shrink-0">
                <path
                  d="M11.5 1.4375C9.50983 1.4375 7.56434 2.02766 5.90957 3.13334C4.2548 4.23902 2.96507 5.81057 2.20346 7.64925C1.44186 9.48793 1.24258 11.5112 1.63085 13.4631C2.01911 15.415 2.97747 17.208 4.38474 18.6153C5.792 20.0225 7.58497 20.9809 9.5369 21.3692C11.4888 21.7574 13.5121 21.5581 15.3508 20.7965C17.1894 20.0349 18.761 18.7452 19.8667 17.0904C20.9723 15.4357 21.5625 13.4902 21.5625 11.5C21.5595 8.83219 20.4983 6.27453 18.6119 4.3881C16.7255 2.50167 14.1678 1.44054 11.5 1.4375ZM11.5 20.125C9.21251 20.125 7.0187 19.2163 5.4012 17.5988C3.7837 15.9813 2.875 13.7875 2.875 11.5C2.875 9.21251 3.7837 7.01871 5.4012 5.4012C7.0187 3.7837 9.21251 2.875 11.5 2.875V11.5L17.5957 17.5957C16.7964 18.3981 15.8464 19.0346 14.8003 19.4686C13.7541 19.9027 12.6326 20.1258 11.5 20.125Z"
                  fill="#E9EBF8"
                />
              </svg>
              <span>Progress</span>
            </button>

            {/* 7. Chat (Item → Button 112:9028: 248.75px × 39.96px, radius 8px) */}
            <button
              type="button"
              onClick={() => setActiveNav('chat')}
              className={`w-[248.75px] h-[39.96px] rounded-[8px] flex items-center px-[12px] gap-[12px] text-[#EDE6F3] text-[18px] font-medium leading-none font-['Plus_Jakarta_Sans'] cursor-pointer transition-all ${
                activeNav === 'chat'
                  ? 'bg-gradient-to-r from-[#3A0353] to-[#804A8A]'
                  : 'hover:bg-white/10'
              }`}
            >
              {/* akar-icons:chat-dots (Exact Figma vector) */}
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

            {/* 8. Certificate (Item → Button 112:9034: 248.75px × 39.96px, radius 8px) */}
            <button
              type="button"
              onClick={() => setActiveNav('certificate')}
              className={`w-[248.75px] h-[39.96px] rounded-[8px] flex items-center px-[12px] gap-[12px] text-[#EDE6F3] text-[18px] font-medium leading-none font-['Plus_Jakarta_Sans'] cursor-pointer transition-all ${
                activeNav === 'certificate'
                  ? 'bg-gradient-to-r from-[#3A0353] to-[#804A8A]'
                  : 'hover:bg-white/10'
              }`}
            >
              {/* icon-park-outline:certificate (Exact Figma vector) */}
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

          {/* =========================================================================
              BOTTOM GRAPHICS & SLOGAN (Exact Figma nodes 112:9048, 112:9049, 112:9050, 112:9051)
             ========================================================================= */}

          {/* 1. Peach Hill: Vector 112:9048 (#F8D299) */}
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
              <svg
                className="w-full h-full block"
                viewBox="0 0 532.709 508.657"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M508.598 228.128C490.752 298.734 465.537 310.196 414.578 366.302C363.618 422.408 318.18 508.598 253.8 508.657C189.42 508.716 142.807 422.703 92.6787 366.597C42.5503 310.491 11.5386 290.718 3.15799 228.128C-5.22265 165.537 0.647146 91.6345 50.7755 53.6461C100.904 15.6576 163.194 46.2604 253.8 38.1852C344.406 30.11 452.845 -24.7183 503.805 13.2702C554.764 51.2586 526.443 157.521 508.598 228.128Z"
                  fill="#F8D299"
                />
              </svg>
            </div>
          </div>

          {/* 2. Purple Hill: Vector 112:9049 (#8B5DB0) */}
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
              <svg
                className="w-full h-full block"
                viewBox="0 0 532.709 508.657"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
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
            MAIN CONTENT AREA (Figma node 112:9054: width: 1060px, height: 912px)
           ========================================================================= */}
        <main className="flex-1 flex flex-col min-w-0 w-full">
          {/* Top Header Row (Figma node 112:9055: width: 1060px, height: 62px, gap: 24px) */}
          <div className="flex flex-col md:flex-row md:flex-wrap items-stretch md:items-center gap-4 lg:gap-[24px] w-full mb-[24px]">
            {/* 1. Search Bar (Figma node 112:9056: width: 574px, height: 62px, bg: #F4F4F4, radius: 36px, shadow) */}
            <div className="relative w-full md:w-auto md:min-w-[240px] md:flex-1 h-[62px] bg-[#F4F4F4] shadow-[0px_4px_4px_rgba(0,0,0,0.25)] rounded-[36px] px-[24px] flex items-center justify-between gap-4 transition-all focus-within:ring-2 focus-within:ring-[#5A198F]/40 focus-within:bg-white shrink-0">
              <div className="flex items-center gap-[22px] flex-1 min-w-0">
                {/* vuesax/linear/search-normal (Exact Figma vector) */}
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  className="shrink-0"
                >
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
              {/* Filter Search Icon & Dropdown: Exact Figma node 112:9592 */}
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
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="shrink-0 transition-transform duration-300">
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
                  {/* Indicator dot when filters are applied */}
                  {(appliedTracks.length > 0 || appliedLevels.length > 0) && (
                    <span className="absolute top-1.5 right-1.5 size-2 rounded-full bg-[#5A198F] ring-2 ring-white animate-pulse" />
                  )}
                </button>

                {/* Filters Dropdown Panel (Exact Figma node 112:9592 / 112:9593 with modern spring animation) */}
                {showFilterPanel && (
                  <div
                    onClick={(e) => e.stopPropagation()}
                    className="absolute top-[68px] lg:top-[58px] start-0 lg:start-auto lg:end-0 w-[260px] max-w-[calc(100vw-24px)] bg-[#F4F4F4]/98 backdrop-blur-xl border border-white/60 shadow-[0px_20px_40px_-8px_rgba(58,4,83,0.18),0px_6px_16px_rgba(0,0,0,0.08),0px_0px_0px_1px_rgba(255,255,255,0.7)_inset] rounded-[16px] p-[24px] flex flex-col gap-[20px] z-50 animate-filter-dropdown select-none text-start"
                  >
                    {/* Header Row: Filters & Clear all (Figma node 112:9594) */}
                    <div className="flex items-center justify-between w-full">
                      <h2 className="font-['Plus_Jakarta_Sans'] font-semibold text-[18px] leading-[28px] text-[#1E293B]">
                        Filters
                      </h2>
                      {(selectedTracks.length > 0 || selectedLevels.length > 0) ? (
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

                    {/* Section 1: Track (Figma node 112:9599) */}
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
                          className={`transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] shrink-0 ${trackSectionOpen ? '' : 'rotate-180'}`}
                        >
                          <path
                            d="M5.47012 2.46973C5.76309 2.17676 6.23887 2.17676 6.53184 2.46973L11.0318 6.96973C11.3248 7.2627 11.3248 7.73848 11.0318 8.03145C10.7389 8.32441 10.2631 8.32441 9.97012 8.03145L5.9998 4.06113L2.02949 8.0291C1.73652 8.32207 1.26074 8.32207 0.967773 8.0291C0.674805 7.73613 0.674805 7.26035 0.967773 6.96738L5.46777 2.46738L5.47012 2.46973Z"
                            fill="#94A3B8"
                          />
                        </svg>
                      </button>

                      {/* Animated Accordion Height with CSS Grid */}
                      <div
                        className={`grid transition-[grid-template-rows,opacity] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                          trackSectionOpen
                            ? 'grid-rows-[1fr] opacity-100'
                            : 'grid-rows-[0fr] opacity-0 pointer-events-none'
                        }`}
                      >
                        <div className="overflow-hidden flex flex-col gap-[13px] w-full pt-1">
                          {TRACK_FILTER_OPTIONS.map((track, idx) => {
                            const isChecked = selectedTracks.includes(track);
                            return (
                              <label
                                key={track}
                                onClick={() => toggleTrack(track)}
                                style={{ animationDelay: `${idx * 22}ms` }}
                                className="flex items-center gap-[12px] cursor-pointer group animate-filter-item select-none"
                              >
                                <div
                                  className={`size-[16px] rounded-[2.5px] flex items-center justify-center transition-all duration-200 shrink-0 group-hover:scale-105 group-active:scale-90 ${
                                    isChecked
                                      ? 'bg-[#5A198F] shadow-[0_2px_6px_rgba(90,25,143,0.35)]'
                                      : 'bg-white border border-[#767676] group-hover:border-[#5A198F]'
                                  }`}
                                >
                                  {isChecked && (
                                    <svg
                                      width="10"
                                      height="8"
                                      viewBox="0 0 10 8"
                                      fill="none"
                                      xmlns="http://www.w3.org/2000/svg"
                                      className="animate-checkmark-pop"
                                    >
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
                                <span className="font-['Plus_Jakarta_Sans'] font-normal text-[14px] leading-[20px] text-[#475569] group-hover:text-[#1E293B] group-hover:translate-x-0.5 transition-all">
                                  {track}
                                </span>
                              </label>
                            );
                          })}
                        </div>
                      </div>
                    </div>

                    {/* Section 2: Level (Figma node 112:9631) */}
                    <div className="flex flex-col gap-[14px] pb-[4px] w-full">
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
                          className={`transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] shrink-0 ${levelSectionOpen ? '' : 'rotate-180'}`}
                        >
                          <path
                            d="M5.47012 2.46973C5.76309 2.17676 6.23887 2.17676 6.53184 2.46973L11.0318 6.96973C11.3248 7.2627 11.3248 7.73848 11.0318 8.03145C10.7389 8.32441 10.2631 8.32441 9.97012 8.03145L5.9998 4.06113L2.02949 8.0291C1.73652 8.32207 1.26074 8.32207 0.967773 8.0291C0.674805 7.73613 0.674805 7.26035 0.967773 6.96738L5.46777 2.46738L5.47012 2.46973Z"
                            fill="#94A3B8"
                          />
                        </svg>
                      </button>

                      {/* Animated Accordion Height with CSS Grid */}
                      <div
                        className={`grid transition-[grid-template-rows,opacity] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                          levelSectionOpen
                            ? 'grid-rows-[1fr] opacity-100'
                            : 'grid-rows-[0fr] opacity-0 pointer-events-none'
                        }`}
                      >
                        <div className="overflow-hidden flex flex-col gap-[13px] w-full pt-1">
                          {LEVEL_FILTER_OPTIONS.map((lvl, idx) => {
                            const isChecked = selectedLevels.includes(lvl);
                            return (
                              <label
                                key={lvl}
                                onClick={() => toggleLevel(lvl)}
                                style={{ animationDelay: `${idx * 22}ms` }}
                                className="flex items-center gap-[12px] cursor-pointer group animate-filter-item select-none"
                              >
                                <div
                                  className={`size-[16px] rounded-[2.5px] flex items-center justify-center transition-all duration-200 shrink-0 group-hover:scale-105 group-active:scale-90 ${
                                    isChecked
                                      ? 'bg-[#5A198F] shadow-[0_2px_6px_rgba(90,25,143,0.35)]'
                                      : 'bg-white border border-[#767676] group-hover:border-[#5A198F]'
                                  }`}
                                >
                                  {isChecked && (
                                    <svg
                                      width="10"
                                      height="8"
                                      viewBox="0 0 10 8"
                                      fill="none"
                                      xmlns="http://www.w3.org/2000/svg"
                                      className="animate-checkmark-pop"
                                    >
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
                                <span className="font-['Plus_Jakarta_Sans'] font-normal text-[14px] leading-[20px] text-[#475569] group-hover:text-[#1E293B] group-hover:translate-x-0.5 transition-all">
                                  {lvl}
                                </span>
                              </label>
                            );
                          })}
                        </div>
                      </div>
                    </div>

                    {/* Apply Filters Button (Figma node 112:9651 / 112:9710) */}
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

            {/* 2. Your Courses Pill (Figma node 112:9062: width: 190px, height: 62px, bg: #F4F4F4, radius: 999px) */}
            <button
              type="button"
              onClick={() => setViewMyCoursesOnly(!viewMyCoursesOnly)}
              className={`w-full md:w-[190px] h-[62px] bg-[#F4F4F4] shadow-[0px_4px_4px_rgba(0,0,0,0.25)] rounded-[999px] px-[25px] flex items-center justify-center gap-[16px] transition-all cursor-pointer shrink-0 active:scale-98 ${
                viewMyCoursesOnly
                  ? 'ring-2 ring-[#5A198F] bg-purple-50 text-[#5A198F]'
                  : 'hover:bg-gray-100 text-[#000000]'
              }`}
            >
              {/* SVG vuesax/bold/book (Exact Figma vector) */}
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
                Your Courses{Object.values(enrolledCourses).filter(Boolean).length > 0 ? ` (${Object.values(enrolledCourses).filter(Boolean).length})` : ''}
              </span>
            </button>

            {/* 3. User Profile Pill (Figma node 112:9067: width: 248px, height: 62px, bg: #F4F4F4, radius: 999px) */}
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
                  AI track - 6 Month Plan
                </span>
              </div>
            </div>
          </div>

          {viewMyCoursesOnly ? (
            /* =========================================================================
               Figma node 112:14702: "Your Courses" Screen with Right Required Courses Stepper
               ========================================================================= */
            <div className="flex flex-col lg:flex-row gap-[22px] items-start w-full" data-node-id="112:14783">
              {/* Left Column: 735px (Figma node 112:14784) */}
              <div className="flex-1 max-w-[735px] flex flex-col gap-[24px] w-full">
                {/* 1. Section: Your Courses (Figma node 112:14785) */}
                <section className="flex flex-col gap-[18px] w-full">
                  <div className="flex items-center justify-between w-full">
                    <h2 className="font-['Plus_Jakarta_Sans'] font-semibold text-[18px] leading-none text-black">
                      Your Courses
                    </h2>
                  </div>

                  {/* Cards Row 1 (Figma node 112:14788: gap 44px) */}
                  <div className="flex flex-col sm:flex-row items-center gap-[44px] w-full">
                    {/* Card 1: Data Cleaning and Exploratory Data Analysis (Start) */}
                    <div
                      onClick={() => navigate('/courses/data-analysis-fundamentals')}
                      className="w-[343px] h-[326px] bg-white rounded-[36px] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] relative overflow-hidden shrink-0 flex flex-col justify-between cursor-pointer flow-card-hover group"
                    >
                      {/* Top Thumbnail Image (139px) */}
                      <div className="relative w-full h-[139px] overflow-hidden bg-slate-900 shrink-0">
                        <img
                          src="/images/course-thumb-figma-1.jpg"
                          alt="Data Cleaning and Exploratory Data Analysis"
                          className="w-full h-full object-cover"
                        />
                        {/* Category Badge */}
                        <div className="absolute left-[13px] top-[17px] h-[18px] px-[8.7px] py-[2.9px] bg-[rgba(255,255,255,0.9)] rounded-[7249px] flex items-center justify-center shadow-xs">
                          <span className="font-['Plus_Jakarta_Sans'] font-bold text-[8.7px] leading-[11.6px] text-black tracking-[0.0595px] whitespace-nowrap">
                            Data Analysis
                          </span>
                        </div>
                      </div>

                      {/* Content Container (Figma node 112:14793: w: 313px) */}
                      <div className="px-[15px] pb-[15px] pt-[8px] flex flex-col gap-[10px] w-full">
                        {/* Rating Row (Figma node 112:14800) */}
                        <div className="flex items-center gap-[4.35px]">
                          <div className="flex items-center gap-[1.45px]">
                            {[...Array(5)].map((_, i) => (
                              <svg key={i} width="11" height="9" viewBox="0 0 11 9" fill="none">
                                <path
                                  d="M5.5 0L6.72456 2.48135L9.46009 2.87903L7.48005 4.80915L7.94721 7.53462L5.5 6.2475L3.05279 7.53462L3.51995 4.80915L1.53991 2.87903L4.27544 2.48135L5.5 0Z"
                                  fill="#FBBF24"
                                />
                              </svg>
                            ))}
                          </div>
                          <span className="font-['Plus_Jakarta_Sans'] font-semibold text-[10.15px] leading-[14.5px] text-[#334155] tracking-[0.1189px]">
                            4.7
                          </span>
                          <span className="font-['Plus_Jakarta_Sans'] font-normal text-[9.425px] leading-[11.6px] text-[#94A3B8] tracking-[0.0552px]">
                            (1,802)
                          </span>
                        </div>

                        {/* Heading */}
                        <h3 className="font-['Plus_Jakarta_Sans'] font-medium text-[13px] leading-[17.4px] text-[#111827] line-clamp-1">
                          Data Cleaning and Exploratory Data Analysis
                        </h3>

                        {/* Instructor Row */}
                        <div className="flex items-center gap-[7.25px]">
                          <img
                            src="/images/avatar-elena-figma.jpg"
                            alt="Elena Vasquez"
                            className="size-[23px] rounded-full object-cover shrink-0"
                          />
                          <span className="font-['Plus_Jakarta_Sans'] font-medium text-[10.15px] leading-[14.5px] text-[#475569] tracking-[0.0198px]">
                            Elena Vasquez
                          </span>
                        </div>

                        {/* Metadata Row */}
                        <div className="flex items-center gap-[35px] text-[#64748B] text-[9.425px] font-['Plus_Jakarta_Sans'] font-medium leading-[13.05px]">
                          <div className="flex items-center gap-[4.35px]">
                            <svg width="9" height="9" viewBox="0 0 9 9" fill="none">
                              <circle cx="4.5" cy="4.5" r="4" stroke="#9CA3AF" strokeWidth="1" />
                              <path d="M4.5 2.5V4.5H6" stroke="#9CA3AF" strokeWidth="1" strokeLinecap="round" />
                            </svg>
                            <span>12 hours</span>
                          </div>
                          <div className="flex items-center gap-[4.35px]">
                            <svg width="12" height="9" viewBox="0 0 12 9" fill="none">
                              <rect x="1" y="5" width="2" height="4" fill="#9CA3AF" />
                              <rect x="5" y="3" width="2" height="6" fill="#9CA3AF" />
                              <rect x="9" y="1" width="2" height="8" fill="#9CA3AF" />
                            </svg>
                            <span>Advanced</span>
                          </div>
                          <div className="flex items-center gap-[4.34px]">
                            <svg width="11" height="9" viewBox="0 0 11 9" fill="none">
                              <path d="M1 2.5H10M1 5.5H10M1 8.5H6" stroke="#9CA3AF" strokeWidth="1" strokeLinecap="round" />
                            </svg>
                            <span>10 lessons</span>
                          </div>
                        </div>

                        {/* Start Button */}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate('/courses/data-analysis-fundamentals');
                          }}
                          className="w-full h-[39px] bg-[#5A198F] hover:bg-[#471273] active:scale-98 rounded-[7249px] font-['Plus_Jakarta_Sans'] font-bold text-[10.15px] leading-[14.5px] tracking-[0.0496px] text-white flex items-center justify-center transition-all cursor-pointer shadow-xs"
                        >
                          Start
                        </button>
                      </div>
                    </div>

                    {/* Card 2: Data Cleaning and Exploratory Data Analysis (Continue) */}
                    <div
                      onClick={() => navigate('/courses/data-analysis-fundamentals')}
                      className="w-[343px] h-[326px] bg-white rounded-[36px] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] relative overflow-hidden shrink-0 flex flex-col justify-between cursor-pointer flow-card-hover group"
                    >
                      {/* Top Thumbnail Image */}
                      <div className="relative w-full h-[139px] overflow-hidden bg-slate-900 shrink-0">
                        <img
                          src="/images/course-thumb-figma-1.jpg"
                          alt="Data Cleaning and Exploratory Data Analysis"
                          className="w-full h-full object-cover"
                        />
                        {/* Category Badge */}
                        <div className="absolute left-[13px] top-[17px] h-[18px] px-[8.7px] py-[2.9px] bg-[rgba(255,255,255,0.9)] rounded-[7249px] flex items-center justify-center shadow-xs">
                          <span className="font-['Plus_Jakarta_Sans'] font-bold text-[8.7px] leading-[11.6px] text-black tracking-[0.0595px] whitespace-nowrap">
                            Data Analysis
                          </span>
                        </div>
                      </div>

                      {/* Content Area */}
                      <div className="px-[15px] flex flex-col gap-[26px] pt-[4px]">
                        <h3 className="font-['Plus_Jakarta_Sans'] font-medium text-[13px] leading-[17.4px] text-[#111827] line-clamp-1">
                          Data Cleaning and Exploratory Data Analysis
                        </h3>

                        <div className="flex flex-col gap-[18px] text-[13px] font-['Plus_Jakarta_Sans'] font-medium text-[#7C738C] leading-none">
                          <div className="flex items-center justify-between">
                            <span>Remaining</span>
                            <span>19 lessons / 13 hours</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span>Finished</span>
                            <span>13 lessons / 5 hours</span>
                          </div>
                        </div>
                      </div>

                      {/* Continue Button */}
                      <div className="p-[15px] pt-0">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate('/courses/data-analysis-fundamentals');
                          }}
                          className="w-full h-[39px] bg-[#5A198F] hover:bg-[#471273] active:scale-98 rounded-[7249px] font-['Plus_Jakarta_Sans'] font-bold text-[10.15px] leading-[14.5px] tracking-[0.0496px] text-white flex items-center justify-center transition-all cursor-pointer shadow-xs"
                        >
                          Continue
                        </button>
                      </div>
                    </div>
                  </div>
                </section>

                {/* 2. Section: Finished Courses (Figma node 112:14860) */}
                <section className="flex flex-col gap-[18px] w-full mt-[6px]">
                  <div className="flex items-center justify-between w-full">
                    <h2 className="font-['Plus_Jakarta_Sans'] font-semibold text-[18px] leading-none text-black">
                      Finished Courses
                    </h2>
                  </div>

                  {/* Cards Row 2 (Figma node 112:14863: gap 44px) */}
                  <div className="flex flex-col sm:flex-row items-center gap-[44px] w-full">
                    {/* Card 1: Python Programming (NEW UPDATE) */}
                    <div
                      onClick={() => navigate('/courses/data-analysis-fundamentals')}
                      className="w-[343px] h-[326px] bg-white rounded-[36px] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] relative overflow-hidden shrink-0 flex flex-col justify-between cursor-pointer flow-card-hover group"
                    >
                      {/* Top Thumbnail Image */}
                      <div className="relative w-full h-[139px] overflow-hidden bg-slate-900 shrink-0">
                        <img
                          src="/images/course-thumb-figma-1.jpg"
                          alt="Python Programming"
                          className="w-full h-full object-cover"
                        />
                        {/* Category Badge */}
                        <div className="absolute left-[13px] top-[17px] h-[18px] px-[8.7px] py-[2.9px] bg-[rgba(255,255,255,0.9)] rounded-[7249px] flex items-center justify-center shadow-xs">
                          <span className="font-['Plus_Jakarta_Sans'] font-bold text-[8.7px] leading-[11.6px] text-black tracking-[0.0595px] whitespace-nowrap">
                            Data Analysis
                          </span>
                        </div>
                        {/* NEW UPDATE Badge */}
                        <div className="absolute right-[13px] top-[17px] h-[18px] px-[8.7px] py-[2.9px] bg-[rgba(250,255,249,0.9)] rounded-[7249px] flex items-center justify-center shadow-xs">
                          <span className="font-['Plus_Jakarta_Sans'] font-bold text-[8.7px] leading-[11.6px] text-[#008A2E] tracking-[0.0595px] whitespace-nowrap">
                            NEW UPDATE
                          </span>
                        </div>
                      </div>

                      {/* Content Area */}
                      <div className="px-[15px] flex flex-col gap-[16px] pt-[4px]">
                        <h3 className="font-['Plus_Jakarta_Sans'] font-medium text-[16px] text-black leading-none">
                          Python Programming
                        </h3>

                        <div className="flex flex-col gap-[14px]">
                          <div className="flex items-center justify-between text-[#008A2E] font-['Plus_Jakarta_Sans'] font-semibold text-[13px] leading-none">
                            <span>New Lesson Uploaded</span>
                            <span>13 lessons / 14 lessons</span>
                          </div>
                          <div className="flex items-center justify-between text-[#7C738C] font-['Plus_Jakarta_Sans'] font-medium text-[13px] leading-none">
                            <span>Scored</span>
                            <span>90%</span>
                          </div>
                        </div>
                      </div>

                      {/* Continue Button */}
                      <div className="p-[15px] pt-0">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate('/courses/data-analysis-fundamentals');
                          }}
                          className="w-full h-[39px] bg-[#5A198F] hover:bg-[#471273] active:scale-98 rounded-[7249px] font-['Plus_Jakarta_Sans'] font-bold text-[10.15px] leading-[14.5px] tracking-[0.0496px] text-white flex items-center justify-center transition-all cursor-pointer shadow-xs"
                        >
                          Continue
                        </button>
                      </div>
                    </div>

                    {/* Card 2: Python Programming (Finished) */}
                    <div
                      onClick={() => navigate('/courses/data-analysis-fundamentals')}
                      className="w-[343px] h-[326px] bg-white rounded-[36px] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] relative overflow-hidden shrink-0 flex flex-col justify-between cursor-pointer flow-card-hover group"
                    >
                      {/* Top Thumbnail Image */}
                      <div className="relative w-full h-[139px] overflow-hidden bg-slate-900 shrink-0">
                        <img
                          src="/images/course-thumb-figma-1.jpg"
                          alt="Python Programming"
                          className="w-full h-full object-cover"
                        />
                        {/* Category Badge */}
                        <div className="absolute left-[13px] top-[17px] h-[18px] px-[8.7px] py-[2.9px] bg-[rgba(255,255,255,0.9)] rounded-[7249px] flex items-center justify-center shadow-xs">
                          <span className="font-['Plus_Jakarta_Sans'] font-bold text-[8.7px] leading-[11.6px] text-black tracking-[0.0595px] whitespace-nowrap">
                            Data Analysis
                          </span>
                        </div>
                      </div>

                      {/* Content Area */}
                      <div className="px-[15px] flex flex-col gap-[20px] pt-[4px]">
                        <h3 className="font-['Plus_Jakarta_Sans'] font-medium text-[16px] text-black leading-none">
                          Python Programming
                        </h3>

                        <div className="flex items-center justify-between text-[#7C738C] font-['Plus_Jakarta_Sans'] font-semibold text-[13px] leading-none">
                          <span>Finished</span>
                          <span>13 lessons / 13 lessons</span>
                        </div>
                      </div>

                      {/* Finished Button */}
                      <div className="p-[15px] pt-0">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate('/courses/data-analysis-fundamentals');
                          }}
                          className="w-full h-[39px] bg-[#5A198F] hover:bg-[#471273] active:scale-98 rounded-[7249px] font-['Plus_Jakarta_Sans'] font-bold text-[10.15px] leading-[14.5px] tracking-[0.0496px] text-white flex items-center justify-center transition-all cursor-pointer shadow-xs"
                        >
                          Finished
                        </button>
                      </div>
                    </div>
                  </div>
                </section>
              </div>

              {/* Right Column: Menu Panel - "Your Required Courses" (Figma node 112:14893: 303px × 470px) */}
              <div className="w-full lg:w-[303px] h-[470px] bg-[#F4F4F4] rounded-[36px] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] p-[36px] shrink-0 flex flex-col flow-scale-in">
                {/* Title (Figma node 112:14896) */}
                <h3 className="font-['Plus_Jakarta_Sans'] font-semibold text-[18px] tracking-[-0.0703px] leading-tight mb-[24px]">
                  <span className="text-black">Your </span>
                  <span className="text-[#3B0454]">Required</span>
                  <span className="text-black"> Courses</span>
                </h3>

                {/* Stepper (Figma node 112:14897) */}
                <div className="flex gap-[20px] items-start">
                  {/* Indicators Column (Figma node 112:14898: width 42px, gap 7px) */}
                  <div className="flex flex-col gap-[7px] items-center w-[42px] shrink-0">
                    {/* Badge 1 */}
                    <div className="w-[42px] h-[53px] bg-[#D8FDD1] rounded-[25px] flex items-center justify-center font-['Plus_Jakarta_Sans'] font-extrabold text-[17px] text-[#008A2E] shrink-0 select-none flow-badge-pop hover:scale-105 transition-transform">
                      1
                    </div>
                    {/* Connector 1: solid line (Figma node 112:14901: height 34px) */}
                    <div className="h-[34px] flex items-center justify-center shrink-0">
                      <svg width="2" height="34" viewBox="0 0 2 34" fill="none">
                        <line x1="1" y1="0" x2="1" y2="34" stroke="#CBD5E1" strokeWidth="1.5" />
                      </svg>
                    </div>

                    {/* Badge 2 */}
                    <div className="w-[42px] h-[53px] bg-[#5A198F] rounded-[25px] flex items-center justify-center font-['Plus_Jakarta_Sans'] font-extrabold text-[17px] text-white shrink-0 select-none shadow-sm flow-badge-pop hover:scale-105 transition-transform">
                      2
                    </div>
                    {/* Connector 2: dashed line (Figma node 112:14905: height 34px) */}
                    <div className="h-[34px] flex items-center justify-center shrink-0">
                      <svg width="2" height="34" viewBox="0 0 2 34" fill="none">
                        <line x1="1" y1="0" x2="1" y2="34" stroke="#94A3B8" strokeWidth="1.5" strokeDasharray="3 3" />
                      </svg>
                    </div>

                    {/* Badge 3 */}
                    <div className="w-[42px] h-[53px] bg-[#7F7F7F] rounded-[25px] flex items-center justify-center font-['Plus_Jakarta_Sans'] font-extrabold text-[17px] text-white shrink-0 select-none hover:scale-105 transition-transform">
                      3
                    </div>
                    {/* Connector 3: dashed line (Figma node 112:14909: height 34px) */}
                    <div className="h-[34px] flex items-center justify-center shrink-0">
                      <svg width="2" height="34" viewBox="0 0 2 34" fill="none">
                        <line x1="1" y1="0" x2="1" y2="34" stroke="#94A3B8" strokeWidth="1.5" strokeDasharray="3 3" />
                      </svg>
                    </div>

                    {/* Badge 4 */}
                    <div className="w-[42px] h-[53px] bg-[#7F7F7F] rounded-[25px] flex items-center justify-center font-['Plus_Jakarta_Sans'] font-extrabold text-[17px] text-white shrink-0 select-none hover:scale-105 transition-transform">
                      4
                    </div>
                  </div>

                  {/* Steps Content Column (Figma node 112:14913: gap 62px) */}
                  <div className="flex-1 flex flex-col gap-[62px] items-start pt-[7px]">
                    {/* Step 1 */}
                    <div className="flex flex-col gap-[4px] h-[39px] justify-center group hover:translate-x-1 transition-transform cursor-pointer">
                      <p className="font-['Plus_Jakarta_Sans'] font-medium text-[16px] text-black leading-none whitespace-nowrap">
                        Python Programming
                      </p>
                      <p className="font-['Plus_Jakarta_Sans'] font-medium text-[12px] text-[#008A2E] leading-none">
                        Completed
                      </p>
                    </div>

                    {/* Step 2 */}
                    <div className="flex flex-col gap-[4px] h-[39px] justify-center group hover:translate-x-1 transition-transform cursor-pointer">
                      <p className="font-['Plus_Jakarta_Sans'] font-medium text-[16px] text-black leading-none whitespace-nowrap">
                        Data Analysis
                      </p>
                      <p className="font-['Plus_Jakarta_Sans'] font-normal text-[12px] text-black leading-none">
                        Progress <span className="text-[#3B0454] font-medium">60%</span>
                      </p>
                    </div>

                    {/* Step 3 */}
                    <div className="flex flex-col gap-[4px] h-[39px] justify-center group hover:translate-x-1 transition-transform cursor-pointer">
                      <p className="font-['Plus_Jakarta_Sans'] font-medium text-[16px] text-black leading-none whitespace-nowrap">
                        Machine Learning
                      </p>
                      <p className="font-['Plus_Jakarta_Sans'] font-normal text-[12px] text-[#6B7280] leading-none">
                        Not Started
                      </p>
                    </div>

                    {/* Step 4 */}
                    <div className="flex flex-col gap-[4px] h-[39px] justify-center group hover:translate-x-1 transition-transform cursor-pointer">
                      <p className="font-['Plus_Jakarta_Sans'] font-medium text-[16px] text-black leading-none whitespace-nowrap">
                        Generative AI &amp; LLMs
                      </p>
                      <p className="font-['Plus_Jakarta_Sans'] font-normal text-[12px] text-[#6B7280] leading-none">
                        Not Started
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <>
              {/* Section 1: Courses Related To Your Track (Figma node 112:9076: height: 416px, gap: 24px) */}
              <section className="flex flex-col gap-[24px] mb-[24px]">
                {/* Section Header (Figma node 112:9077: height: 48px, justify-between) */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 w-full">
                  <h2 className="font-['Plus_Jakarta_Sans'] font-semibold text-[18px] leading-none text-[#000000]">
                    Courses Related To Your Track
                  </h2>

              {/* Sort & Category Filter Pills (Figma Frame 2147225693: width: 445px, height: 48px, gap: 19px) */}
              <div className="flex flex-wrap items-center gap-[19px] relative">
                {/* Pill 1: Sort : Most Popular (Figma node 159:8564: width: 181px, height: 48px, radius: 36px) */}
                <div className="relative">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowSortDropdown((prev) => !prev);
                      setShowRequiredDropdown(false);
                    }}
                    className="w-[181px] h-[48px] bg-[#F4F4F4] shadow-[0px_4px_4px_rgba(0,0,0,0.25)] rounded-[36px] px-[16px] flex items-center justify-between text-[14px] text-[#475569] font-['Plus_Jakarta_Sans'] font-normal cursor-pointer hover:bg-gray-100 transition-all"
                  >
                    <span>
                      Sort :{' '}
                      <span className="text-[#5C1D87] font-medium capitalize">
                        {sortOption === 'popular'
                          ? 'Most Popular'
                          : sortOption === 'rating'
                          ? 'Top Rated'
                          : 'Newest'}
                      </span>
                    </span>
                    {/* Exact Figma dropdown chevron (Img node 159:8572) */}
                    <svg width="14" height="10" viewBox="0 0 19 13.5" fill="none" className="shrink-0">
                      <path
                        d="M9.09227 13.1339C9.59433 13.622 10.4097 13.622 10.9117 13.1339L18.6235 5.63533C19.1255 5.14714 19.1255 4.35433 18.6235 3.86614C18.1214 3.37795 17.306 3.37795 16.804 3.86614L10 10.482L3.19603 3.87004C2.69396 3.38186 1.87861 3.38186 1.37655 3.87004C0.874484 4.35823 0.874484 5.15104 1.37655 5.63923L9.08825 13.1378L9.09227 13.1339Z"
                        fill="#94A3B8"
                      />
                    </svg>
                  </button>

                  {showSortDropdown && (
                    <div
                      onClick={(e) => e.stopPropagation()}
                      className="absolute top-[54px] start-0 w-[181px] bg-white/98 backdrop-blur-xl rounded-2xl shadow-[0px_16px_36px_-6px_rgba(58,4,83,0.16),0px_4px_12px_rgba(0,0,0,0.06)] border border-white/60 py-2 z-30 animate-filter-dropdown-start"
                    >
                      <button
                        onClick={() => {
                          setSortOption('popular');
                          setShowSortDropdown(false);
                        }}
                        className={`w-full px-4 py-2.5 text-start text-xs transition-colors cursor-pointer flex items-center justify-between ${
                          sortOption === 'popular'
                            ? 'font-bold text-[#5A198F] bg-purple-50/70'
                            : 'text-slate-700 hover:bg-purple-50/40'
                        }`}
                      >
                        <span>Most Popular</span>
                        {sortOption === 'popular' && (
                          <span className="size-1.5 rounded-full bg-[#5A198F]" />
                        )}
                      </button>
                      <button
                        onClick={() => {
                          setSortOption('rating');
                          setShowSortDropdown(false);
                        }}
                        className={`w-full px-4 py-2.5 text-start text-xs transition-colors cursor-pointer flex items-center justify-between ${
                          sortOption === 'rating'
                            ? 'font-bold text-[#5A198F] bg-purple-50/70'
                            : 'text-slate-700 hover:bg-purple-50/40'
                        }`}
                      >
                        <span>Top Rated</span>
                        {sortOption === 'rating' && (
                          <span className="size-1.5 rounded-full bg-[#5A198F]" />
                        )}
                      </button>
                    </div>
                  )}
                </div>

                {/* Pill 2: Your Required Courses (Figma node 159:8608: width: 245px, height: 48px, radius: 36px) */}
                <div className="relative">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowRequiredDropdown((prev) => !prev);
                      setShowSortDropdown(false);
                    }}
                    className="w-[245px] h-[48px] bg-[#F4F4F4] shadow-[0px_4px_4px_rgba(0,0,0,0.25)] rounded-[36px] px-[16px] flex items-center justify-between text-[16px] font-['Plus_Jakarta_Sans'] cursor-pointer hover:bg-gray-100 transition-all"
                  >
                    <span className="text-[#000000] font-normal">
                      Your{' '}
                      <strong className="font-semibold text-[#3B0454]">
                        {requiredFilter === 'required' ? 'Required' : 'All'}
                      </strong>{' '}
                      Courses
                    </span>
                    {/* Exact Figma dropdown chevron (Img node 159:8611) */}
                    <svg
                      width="14"
                      height="10"
                      viewBox="0 0 19 13.5"
                      fill="none"
                      className={`shrink-0 transition-transform duration-300 ${showRequiredDropdown ? 'rotate-180' : ''}`}
                    >
                      <path
                        d="M9.09227 13.1339C9.59433 13.622 10.4097 13.622 10.9117 13.1339L18.6235 5.63533C19.1255 5.14714 19.1255 4.35433 18.6235 3.86614C18.1214 3.37795 17.306 3.37795 16.804 3.86614L10 10.482L3.19603 3.87004C2.69396 3.38186 1.87861 3.38186 1.37655 3.87004C0.874484 4.35823 0.874484 5.15104 1.37655 5.63923L9.08825 13.1378L9.09227 13.1339Z"
                        fill="#94A3B8"
                      />
                    </svg>
                  </button>

                  {showRequiredDropdown && (
                    <div
                      onClick={(e) => e.stopPropagation()}
                      className="absolute top-[54px] end-0 w-[245px] bg-white/98 backdrop-blur-xl rounded-2xl shadow-[0px_16px_36px_-6px_rgba(58,4,83,0.16),0px_4px_12px_rgba(0,0,0,0.06)] border border-white/60 py-2 z-30 animate-filter-dropdown"
                    >
                      <button
                        onClick={() => {
                          setRequiredFilter('required');
                          setShowRequiredDropdown(false);
                        }}
                        className={`w-full px-4 py-2.5 text-start text-xs transition-colors cursor-pointer flex items-center justify-between ${
                          requiredFilter === 'required'
                            ? 'font-bold text-[#5A198F] bg-purple-50/70'
                            : 'text-slate-700 hover:bg-purple-50/40'
                        }`}
                      >
                        <span>Your Required Courses</span>
                        {requiredFilter === 'required' && (
                          <span className="size-1.5 rounded-full bg-[#5A198F]" />
                        )}
                      </button>
                      <button
                        onClick={() => {
                          setRequiredFilter('all');
                          setShowRequiredDropdown(false);
                        }}
                        className={`w-full px-4 py-2.5 text-start text-xs transition-colors cursor-pointer flex items-center justify-between ${
                          requiredFilter === 'all'
                            ? 'font-bold text-[#5A198F] bg-purple-50/70'
                            : 'text-slate-700 hover:bg-purple-50/40'
                        }`}
                      >
                        <span>All Track Courses</span>
                        {requiredFilter === 'all' && (
                          <span className="size-1.5 rounded-full bg-[#5A198F]" />
                        )}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Course Cards Row (Figma node 112:9092: height: 344px, gap: 24px) */}
            {isLoadingCourses ? (
              <div className="w-full py-12 px-6 flex items-center justify-center bg-[#F9FAFB] rounded-[16px]">
                <div className="size-8 animate-spin rounded-full border-3 border-[#5A198F] border-t-transparent" />
              </div>
            ) : courseLoadError ? (
              <div className="w-full py-8 px-6 flex flex-col items-center justify-center text-center bg-[#FFF1F0] rounded-[16px] border border-[#FFA39E] gap-2">
                <p className="text-[#CF1322] font-medium text-[14px]">{courseLoadError}</p>
                <button
                  type="button"
                  onClick={() => void fetchCourseList()}
                  className="px-4 py-1.5 bg-[#5A198F] text-white rounded-full text-xs font-semibold hover:bg-[#471273] transition-colors"
                >
                  Retry
                </button>
              </div>
            ) : filteredTrackCourses.length === 0 ? (
              <div className="w-full py-12 px-6 flex flex-col items-center justify-center text-center bg-[#F9FAFB] rounded-[16px] border border-dashed border-[#E2E8F0]">
                <p className="text-[#64748B] font-['Plus_Jakarta_Sans'] font-medium text-[14px]">
                  {viewMyCoursesOnly
                    ? 'You have not enrolled in any courses yet. Click "Enroll Now" on any course to add it to your learning plan!'
                    : 'No courses found matching your current filter criteria.'}
                </p>
              </div>
            ) : (
              <div
                ref={trackCarouselRef}
                id="track-carousel"
                className="flex items-center gap-[24px] overflow-x-auto pb-2 scroll-auto no-scrollbar select-none cursor-grab active:cursor-grabbing"
              >
              {filteredTrackCourses.map((course) => {
                const isEnrolled = enrolledCourses[course.id];
                const courseProg = parseInt(localStorage.getItem(`course_progress_${course.id}`) || '13', 10);
                const isCompleted = courseProg >= 19;
                const coursePct = isCompleted ? 100 : (courseProg === 13 ? 35 : Math.round((courseProg / 19) * 100));

                return (
                  <div
                    key={course.id}
                    onClick={() => {
                      if (isEnrolled) {
                        const storageKey = `course_progress_${course.id}`;
                        const current = parseInt(localStorage.getItem(storageKey) || '13', 10);
                        // Every time user clicks an enrolled course, advance progress towards 19 (100% completed)
                        const next = current >= 19 ? 13 : Math.min(19, current + 2);
                        localStorage.setItem(storageKey, next.toString());
                        navigate(`/courses/${course.id}?enrolled=true&progress=${next}`);
                      } else {
                        navigate(`/courses/${course.id}`);
                      }
                    }}
                    className="w-[298px] min-w-[298px] h-[344px] bg-[#FFFFFF] border-[0.725011px] border-[#E5E7EB] shadow-[0px_2.90004px_11.6002px_rgba(0,0,0,0.06)] rounded-[11.6002px] flex flex-col justify-between overflow-hidden flow-card-hover group shrink-0 cursor-pointer"
                  >
                    {/* Course Thumbnail (297px × 141px) */}
                    <div className="relative w-[297px] h-[141px] overflow-hidden bg-slate-900 shrink-0">
                      <img
                        src={course.thumbnail}
                        alt={course.title}
                        draggable={false}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 pointer-events-none select-none"
                      />
                      {/* Category Badge (Figma node 159:10769: 74px × 18px, left: 12px, top: 12px) */}
                      <div className="absolute left-[12px] top-[12px] h-[18px] px-[8.70013px] py-[2.90004px] bg-[rgba(255,255,255,0.9)] rounded-[7249.38px] flex items-center justify-center shadow-xs z-10">
                        <span className="font-['Plus_Jakarta_Sans'] font-bold text-[8.70013px] leading-[12px] text-[#5A198F] tracking-[0.0068em] whitespace-nowrap">
                          {course.category}
                        </span>
                      </div>
                    </div>

                    {/* Course Content Container (Figma node 159:10771: padding: 14.5px, gap: 10.15px) */}
                    <div className="p-[14.5002px] flex flex-col justify-between flex-1 gap-[10.15px]">
                      <div className="flex flex-col gap-[10.15px]">
                        {/* Rating Row (Figma node 159:10772) */}
                        <div className="flex items-center gap-[4.35px]">
                          {/* 5 Stars */}
                          <div className="flex items-center gap-[1.45px]">
                            {[...Array(5)].map((_, i) => (
                              <svg
                                key={i}
                                width="11"
                                height="9"
                                viewBox="0 0 11 9"
                                fill="none"
                              >
                                <path
                                  d="M5.5 0L6.72456 2.48135L9.46009 2.87903L7.48005 4.80915L7.94721 7.53462L5.5 6.2475L3.05279 7.53462L3.51995 4.80915L1.53991 2.87903L4.27544 2.48135L5.5 0Z"
                                  fill="#FBBF24"
                                />
                              </svg>
                            ))}
                          </div>
                          {/* 4.7 */}
                          <span className="font-['Plus_Jakarta_Sans'] font-semibold text-[10.1501px] leading-[15px] text-[#334155] tracking-[0.0117em]">
                            {course.rating}
                          </span>
                          {/* (1,802) */}
                          <span className="font-['Plus_Jakarta_Sans'] font-normal text-[9.42514px] leading-[12px] text-[#94A3B8] tracking-[0.0058em]">
                            {course.reviews}
                          </span>
                        </div>

                        {/* Title (Figma node 159:10793: width: 268px, height: 35px) */}
                        <h3 className="font-['Plus_Jakarta_Sans'] font-medium text-[13.0502px] leading-[17px] text-[#111827] line-clamp-2 min-h-[34px] group-hover:text-[#5A198F] transition-colors">
                          {course.title}
                        </h3>

                        {/* Instructor Row (Figma node 159:10795) */}
                        <div className="flex items-center gap-[7.25px]">
                          <img
                            src={course.instructorAvatar}
                            alt={course.instructor}
                            className="size-[23px] rounded-full object-cover shrink-0 border border-slate-100"
                          />
                          <span className="font-['Plus_Jakarta_Sans'] font-medium text-[10.1501px] leading-[15px] text-[#475569] tracking-[0.0019em]">
                            {course.instructor}
                          </span>
                        </div>

                        {/* Metadata Row (Figma node 159:10799: 268px × 29px) */}
                        <div className="border-b border-[#F1F5F9] pb-[11.6002px] pt-[2.90004px] flex items-center justify-between text-[#64748B] text-[9.42514px] font-['Plus_Jakarta_Sans'] font-medium leading-[13px]">
                          {/* Duration */}
                          <div className="flex items-center gap-[4.35px]">
                            <svg width="9" height="9" viewBox="0 0 9 9" fill="none">
                              <circle cx="4.5" cy="4.5" r="4" stroke="#9CA3AF" strokeWidth="1" />
                              <path d="M4.5 2.5V4.5H6" stroke="#9CA3AF" strokeWidth="1" strokeLinecap="round" />
                            </svg>
                            <span>{course.duration}</span>
                          </div>
                          {/* Level */}
                          <div className="flex items-center gap-[4.35px]">
                            <svg width="12" height="9" viewBox="0 0 12 9" fill="none">
                              <rect x="1" y="5" width="2" height="4" fill="#9CA3AF" />
                              <rect x="5" y="3" width="2" height="6" fill="#9CA3AF" />
                              <rect x="9" y="1" width="2" height="8" fill="#9CA3AF" />
                            </svg>
                            <span>{course.level}</span>
                          </div>
                          {/* Lessons */}
                          <div className="flex items-center gap-[4.34px]">
                            <svg width="11" height="9" viewBox="0 0 11 9" fill="none">
                              <path d="M1 2.5H10M1 5.5H10M1 8.5H6" stroke="#9CA3AF" strokeWidth="1" strokeLinecap="round" />
                            </svg>
                            <span>{course.lessons}</span>
                          </div>
                        </div>
                      </div>

                      {/* Enroll Button (Figma node 159:10819: width: 268px, height: 43px, bg: #5A198F, radius: 7249px) */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEnrollToggle(course.id);
                        }}
                        className={`w-[268px] h-[43px] rounded-[7249.38px] font-['Plus_Jakarta_Sans'] font-bold text-[10.1501px] leading-[15px] tracking-[0.0048em] text-center flex items-center justify-center transition-all duration-200 cursor-pointer active:scale-98 shadow-xs ${
                          isEnrolled
                            ? isCompleted
                              ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                              : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                            : 'bg-[#5A198F] hover:bg-[#471273] text-white hover:shadow-md'
                        }`}
                      >
                        {isEnrolled
                          ? isCompleted
                            ? 'Completed (100%)'
                            : `Enrolled (${coursePct}%)`
                          : 'Enroll Now'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
          </section>

          {/* Section 2: Popular Among Students (Figma node 112:9075 Frame 2147225643: height: 386px) - Hidden when viewing "Your Courses" */}
          {!viewMyCoursesOnly && (
            <section className="flex flex-col gap-[24px]">
              {/* Section Header */}
              <div className="flex items-center justify-between w-full">
                <h2 className="font-['Plus_Jakarta_Sans'] font-semibold text-[18px] leading-none text-[#000000]">
                  Popular Among Students
                </h2>
              </div>

              {/* Course Cards Row (Figma node 112:9075 Frame 2147225638: height: 344px) */}
              {filteredPopularCourses.length === 0 ? (
                <div className="w-full py-8 px-6 flex flex-col items-center justify-center text-center bg-[#F9FAFB] rounded-[16px] border border-dashed border-[#E2E8F0]">
                  <p className="text-[#64748B] font-['Plus_Jakarta_Sans'] font-medium text-[14px]">
                    No additional popular courses found.
                  </p>
                </div>
              ) : (
                <div
                  ref={popularCarouselRef}
                  id="popular-carousel"
                  className="flex items-center gap-[24px] overflow-x-auto pb-2 scroll-auto no-scrollbar select-none cursor-grab active:cursor-grabbing"
                >
                  {filteredPopularCourses.map((course) => {
                    const isEnrolled = enrolledCourses[course.id];
                    const courseProg = parseInt(localStorage.getItem(`course_progress_${course.id}`) || '13', 10);
                    const isCompleted = courseProg >= 19;
                    const coursePct = isCompleted ? 100 : (courseProg === 13 ? 35 : Math.round((courseProg / 19) * 100));

                    return (
                      <div
                        key={course.id}
                        onClick={() => {
                          if (isEnrolled) {
                            const storageKey = `course_progress_${course.id}`;
                            const current = parseInt(localStorage.getItem(storageKey) || '13', 10);
                            // Every time user clicks an enrolled course, advance progress towards 19 (100% completed)
                            const next = current >= 19 ? 13 : Math.min(19, current + 2);
                            localStorage.setItem(storageKey, next.toString());
                            navigate(`/courses/${course.id}?enrolled=true&progress=${next}`);
                          } else {
                            navigate(`/courses/${course.id}`);
                          }
                        }}
                        className="w-[298px] min-w-[298px] h-[344px] bg-[#FFFFFF] border-[0.725011px] border-[#E5E7EB] shadow-[0px_2.90004px_11.6002px_rgba(0,0,0,0.06)] rounded-[11.6002px] flex flex-col justify-between overflow-hidden flow-card-hover group shrink-0 cursor-pointer"
                      >
                        {/* Course Thumbnail (297px × 141px) */}
                        <div className="relative w-[297px] h-[141px] overflow-hidden bg-slate-900 shrink-0">
                          <img
                            src={course.thumbnail}
                            alt={course.title}
                            draggable={false}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 pointer-events-none select-none"
                          />
                          {/* Category Badge */}
                          <div className="absolute left-[12px] top-[12px] h-[18px] px-[8.70013px] py-[2.90004px] bg-[rgba(255,255,255,0.9)] rounded-[7249.38px] flex items-center justify-center shadow-xs z-10">
                            <span className="font-['Plus_Jakarta_Sans'] font-bold text-[8.70013px] leading-[12px] text-[#5A198F] tracking-[0.0068em] whitespace-nowrap">
                              {course.category}
                            </span>
                          </div>
                        </div>

                        {/* Course Content Container */}
                        <div className="p-[14.5002px] flex flex-col justify-between flex-1 gap-[10.15px]">
                          <div className="flex flex-col gap-[10.15px]">
                            {/* Rating Row */}
                            <div className="flex items-center gap-[4.35px]">
                              <div className="flex items-center gap-[1.45px]">
                                {[...Array(5)].map((_, i) => (
                                  <svg
                                    key={i}
                                    width="11"
                                    height="9"
                                    viewBox="0 0 11 9"
                                    fill="none"
                                  >
                                    <path
                                      d="M5.5 0L6.72456 2.48135L9.46009 2.87903L7.48005 4.80915L7.94721 7.53462L5.5 6.2475L3.05279 7.53462L3.51995 4.80915L1.53991 2.87903L4.27544 2.48135L5.5 0Z"
                                      fill="#FBBF24"
                                    />
                                  </svg>
                                ))}
                              </div>
                              <span className="font-['Plus_Jakarta_Sans'] font-semibold text-[10.1501px] leading-[15px] text-[#334155] tracking-[0.0117em]">
                                {course.rating}
                              </span>
                              <span className="font-['Plus_Jakarta_Sans'] font-normal text-[9.42514px] leading-[12px] text-[#94A3B8] tracking-[0.0058em]">
                                {course.reviews}
                              </span>
                            </div>

                            {/* Title */}
                            <h3 className="font-['Plus_Jakarta_Sans'] font-medium text-[13.0502px] leading-[17px] text-[#111827] line-clamp-2 min-h-[34px] group-hover:text-[#5A198F] transition-colors">
                              {course.title}
                            </h3>

                            {/* Instructor Row */}
                            <div className="flex items-center gap-[7.25px]">
                              <img
                                src={course.instructorAvatar}
                                alt={course.instructor}
                                className="size-[23px] rounded-full object-cover shrink-0 border border-slate-100"
                              />
                              <span className="font-['Plus_Jakarta_Sans'] font-medium text-[10.1501px] leading-[15px] text-[#475569] tracking-[0.0019em]">
                                {course.instructor}
                              </span>
                            </div>

                            {/* Metadata Row */}
                            <div className="border-b border-[#F1F5F9] pb-[11.6002px] pt-[2.90004px] flex items-center justify-between text-[#64748B] text-[9.42514px] font-['Plus_Jakarta_Sans'] font-medium leading-[13px]">
                              <div className="flex items-center gap-[4.35px]">
                                <svg width="9" height="9" viewBox="0 0 9 9" fill="none">
                                  <circle cx="4.5" cy="4.5" r="4" stroke="#9CA3AF" strokeWidth="1" />
                                  <path d="M4.5 2.5V4.5H6" stroke="#9CA3AF" strokeWidth="1" strokeLinecap="round" />
                                </svg>
                                <span>{course.duration}</span>
                              </div>
                              <div className="flex items-center gap-[4.35px]">
                                <svg width="12" height="9" viewBox="0 0 12 9" fill="none">
                                  <rect x="1" y="5" width="2" height="4" fill="#9CA3AF" />
                                  <rect x="5" y="3" width="2" height="6" fill="#9CA3AF" />
                                  <rect x="9" y="1" width="2" height="8" fill="#9CA3AF" />
                                </svg>
                                <span>{course.level}</span>
                              </div>
                              <div className="flex items-center gap-[4.34px]">
                                <svg width="11" height="9" viewBox="0 0 11 9" fill="none">
                                  <path d="M1 2.5H10M1 5.5H10M1 8.5H6" stroke="#9CA3AF" strokeWidth="1" strokeLinecap="round" />
                                </svg>
                                <span>{course.lessons}</span>
                              </div>
                            </div>
                          </div>

                          {/* Enroll Button */}
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEnrollToggle(course.id);
                            }}
                            className={`w-[268px] h-[43px] rounded-[7249.38px] font-['Plus_Jakarta_Sans'] font-bold text-[10.1501px] leading-[15px] tracking-[0.0048em] text-center flex items-center justify-center transition-all duration-200 cursor-pointer active:scale-98 shadow-xs ${
                              isEnrolled
                                ? isCompleted
                                  ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                                  : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                                : 'bg-[#5A198F] hover:bg-[#471273] text-white hover:shadow-md'
                            }`}
                          >
                            {isEnrolled
                              ? isCompleted
                                ? 'Completed (100%)'
                                : `Enrolled (${coursePct}%)`
                              : 'Enroll Now'}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </section>
          )}
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default Courses6mPage;
