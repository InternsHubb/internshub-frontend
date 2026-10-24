import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { ROUTES } from '@/constants/routes';

interface AttachmentItem {
  id: string;
  title: string;
  fileType: string;
  iconSrc: string;
  fileSize?: string;
}

interface VideoLesson {
  id: string;
  title: string;
  duration: string;
  status: 'completed' | 'active' | 'unstarted' | 'locked';
  remainingText?: string;
  lessonNumber?: string;
}

interface ModuleSection {
  id: number;
  title: string;
  status: 'completed' | 'active' | 'locked';
  subtitle?: string;
  lessons: VideoLesson[];
}

const MODULES_DATA: ModuleSection[] = [
  {
    id: 1,
    title: 'Module 1: Foundations',
    status: 'completed',
    lessons: [
      { id: '1-1', title: 'Intro to UX Thinking', duration: '8 min', status: 'completed', lessonNumber: '01' },
      { id: '1-2', title: 'User Research Basics', duration: '15 min', status: 'completed', lessonNumber: '02' },
    ],
  },
  {
    id: 2,
    title: 'Module 2: Wireframing',
    status: 'completed',
    lessons: [
      { id: '2-1', title: 'Low-Fidelity Sketches', duration: '12 min', status: 'completed', lessonNumber: '03' },
      { id: '2-2', title: 'Digital Wireframes', duration: '20 min', status: 'completed', lessonNumber: '04' },
    ],
  },
  {
    id: 3,
    title: 'Module 3: Prototyping',
    status: 'active',
    lessons: [
      { id: '3-1', title: 'Prototyping Principles', duration: '10 min', status: 'completed', lessonNumber: '03' },
      {
        id: '3-2',
        title: 'Building Interactive Prototypes',
        duration: '10 min',
        status: 'active',
        remainingText: '10 min · Remaining',
        lessonNumber: '04',
      },
      {
        id: '3-3',
        title: 'Overlays & Micro-interactions',
        duration: '18 min',
        status: 'unstarted',
        lessonNumber: '04',
      },
      {
        id: '3-4',
        title: 'Prototype Testing',
        duration: '14 min',
        status: 'unstarted',
        lessonNumber: '05',
      },
    ],
  },
  {
    id: 4,
    title: 'Module 4: Handoff & Dev',
    status: 'locked',
    lessons: [
      { id: '4-1', title: 'Design Specs & Tokens', duration: '16 min', status: 'locked', lessonNumber: '06' },
      { id: '4-2', title: 'Developer Collaboration', duration: '22 min', status: 'locked', lessonNumber: '07' },
    ],
  },
  {
    id: 5,
    title: 'Final Quiz',
    status: 'locked',
    subtitle: 'unlimited attempts - must score 70 % or above',
    lessons: [
      {
        id: '5-1',
        title: 'Final Quiz',
        duration: 'unlimited attempts - must score 70 % or above',
        status: 'locked',
      },
    ],
  },
];

const MODULE_3_LESSON_IDS = ['3-1', '3-2', '3-3', '3-4'];
const MODULE_4_LESSON_IDS = ['4-1', '4-2'];
const ALL_VIDEO_LESSON_IDS = ['1-1', '1-2', '2-1', '2-2', '3-1', '3-2', '3-3', '3-4', '4-1', '4-2'];

const ATTACHMENTS_DATA: AttachmentItem[] = [
  {
    id: 'att-1',
    title: 'What is UI/UX Design?',
    fileType: 'pdf file',
    iconSrc: '/images/video/simple-red.svg',
  },
  {
    id: 'att-2',
    title: 'Understanding User-Centered Design',
    fileType: 'html file',
    iconSrc: '/images/video/code-icon.svg',
  },
  {
    id: 'att-3',
    title: 'Tools of the Trade: Figma Basics',
    fileType: 'power point slides',
    iconSrc: '/images/video/powerpoint-icon.svg',
  },
];


export const CourseVideoPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id?: string }>();
  const [searchParams] = useSearchParams();
  const initialLessonFromUrl = searchParams.get('lesson');

  // Set of completed lesson IDs
  const [completedLessonIds, setCompletedLessonIds] = useState<Set<string>>(() => {
    try {
      const stored = localStorage.getItem(`course_completed_lessons_${id || 'data_analysis'}`);
      if (stored) {
        return new Set(JSON.parse(stored));
      }
    } catch {}
    return new Set(['1-1', '1-2', '2-1', '2-2', '3-1']);
  });

  // Check sequential completion status
  const isModule3Complete = MODULE_3_LESSON_IDS.every((lId) => completedLessonIds.has(lId));
  const isModule4Unlocked = isModule3Complete;
  const isModule4Complete = isModule4Unlocked && MODULE_4_LESSON_IDS.every((lId) => completedLessonIds.has(lId));
  const isQuizUnlocked = isModule4Complete;
  const isAllVideosFinished = isModule3Complete && isModule4Complete;

  // Active playing lesson state
  const [activeLessonId, setActiveLessonId] = useState<string>(() => {
    if (initialLessonFromUrl) return initialLessonFromUrl;
    try {
      const stored = localStorage.getItem(`course_completed_lessons_${id || 'data_analysis'}`);
      if (stored) {
        const parsed = new Set<string>(JSON.parse(stored));
        const allDone =
          MODULE_3_LESSON_IDS.every((l) => parsed.has(l)) &&
          MODULE_4_LESSON_IDS.every((l) => parsed.has(l));
        if (allDone) return '5-1';
      }
    } catch {}
    return '3-2';
  });

  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [playbackSpeed, setPlaybackSpeed] = useState<'1x' | '1.25x' | '1.5x' | '2x'>('1x');
  const [isSaved, setIsSaved] = useState<boolean>(false);
  const [isAttachmentsOpen, setIsAttachmentsOpen] = useState<boolean>(true);
  const [isCourseContentOpen, setIsCourseContentOpen] = useState<boolean>(true);
  const [openModuleIds, setOpenModuleIds] = useState<Record<number, boolean>>({
    1: true,
    2: true,
    3: true,
    4: true,
    5: true,
  });
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const [quizPassed] = useState<boolean>(() => {
    try {
      return localStorage.getItem(`course_quiz_passed_${id || 'data_analysis'}`) === 'true';
    } catch {
      return false;
    }
  });

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3200);
  };

  // Sync with URL parameter if it changes
  useEffect(() => {
    if (initialLessonFromUrl && initialLessonFromUrl !== activeLessonId) {
      setActiveLessonId(initialLessonFromUrl);
      const parentMod = MODULES_DATA.find((m) => m.lessons.some((l) => l.id === initialLessonFromUrl));
      if (parentMod) {
        setOpenModuleIds((prev) => ({ ...prev, [parentMod.id]: true }));
      }
    }
  }, [initialLessonFromUrl]);

  // Flat list of all lessons
  const allLessons = MODULES_DATA.flatMap((m) => m.lessons);

  const activeLesson =
    allLessons.find((l) => l.id === activeLessonId) ||
    MODULES_DATA[2].lessons[1];

  const currentIdx = allLessons.findIndex((l) => l.id === activeLessonId);

  // Dynamic progress counter: When all videos are finished, drawer shows 19/19 (100%) exactly matching Figma node 112:10464!
  const completedLessonCount = isAllVideosFinished
    ? 19
    : Math.min(18, 13 + Math.max(0, completedLessonIds.size - 5));
  const progressPercent = isAllVideosFinished
    ? 100
    : Math.min(95, Math.round((completedLessonCount / 19) * 100));

  const isQuizView = activeLessonId === '5-1';

  // Handle selecting a lesson
  const handleSelectLesson = (lesson: VideoLesson) => {
    // If target is locked Module 4
    if ((lesson.id === '4-1' || lesson.id === '4-2') && !isModule4Unlocked) {
      showToast('Module 4 is locked. Please complete all lessons in Module 3 first!');
      return;
    }
    // If target is locked Quiz
    if (lesson.id === '5-1' && !isQuizUnlocked) {
      showToast('Final Quiz is locked. Please complete Module 4 first!');
      return;
    }

    if (lesson.id === activeLessonId) {
      if (lesson.id !== '5-1') {
        setIsPlaying((prev) => !prev);
      }
      return;
    }

    // 1. Mark previous active lesson as completed & checked if it was a video
    if (activeLessonId !== '5-1') {
      setCompletedLessonIds((prev) => {
        const updated = new Set(prev);
        updated.add(activeLessonId);
        try {
          localStorage.setItem(
            `course_completed_lessons_${id || 'data_analysis'}`,
            JSON.stringify(Array.from(updated))
          );
        } catch {}

        const mod3Done = MODULE_3_LESSON_IDS.every((lId) => updated.has(lId));
        const mod4Done = mod3Done && MODULE_4_LESSON_IDS.every((lId) => updated.has(lId));
        if (mod3Done && mod4Done) {
          localStorage.setItem(`course_progress_${id || 'data_analysis'}`, '19');
        } else {
          const computedCount = Math.min(18, 13 + Math.max(0, updated.size - 5));
          localStorage.setItem(`course_progress_${id || 'data_analysis'}`, computedCount.toString());
        }
        return updated;
      });
    }

    // 2. Set new active lesson
    setActiveLessonId(lesson.id);
    setIsPlaying(true);

    // 3. Ensure the parent module of the target lesson is expanded
    const parentMod = MODULES_DATA.find((m) => m.lessons.some((l) => l.id === lesson.id));
    if (parentMod) {
      setOpenModuleIds((prev) => ({ ...prev, [parentMod.id]: true }));
    }
  };

  // Allow clicking on a checkmark icon to toggle completion
  const handleToggleLessonDone = (lessonId: string, e: React.MouseEvent) => {
    e.stopPropagation();

    if ((lessonId === '4-1' || lessonId === '4-2') && !isModule4Unlocked) {
      showToast('Module 4 is locked. Please complete Module 3 first!');
      return;
    }

    setCompletedLessonIds((prev) => {
      const updated = new Set(prev);
      if (updated.has(lessonId)) {
        updated.delete(lessonId);
      } else {
        updated.add(lessonId);
      }
      try {
        localStorage.setItem(
          `course_completed_lessons_${id || 'data_analysis'}`,
          JSON.stringify(Array.from(updated))
        );
      } catch {}

      const mod3Done = MODULE_3_LESSON_IDS.every((lId) => updated.has(lId));
      const mod4Done = mod3Done && MODULE_4_LESSON_IDS.every((lId) => updated.has(lId));

      if (mod3Done && mod4Done) {
        localStorage.setItem(`course_progress_${id || 'data_analysis'}`, '19');
        // All modules and videos completed! Automatically open the quiz celebration screen!
        setActiveLessonId('5-1');
        setOpenModuleIds((mPrev) => ({ ...mPrev, 4: true, 5: true }));
        showToast('All lessons completed! Quiz unlocked 🎉');
      } else {
        const computedCount = Math.min(18, 13 + Math.max(0, updated.size - 5));
        localStorage.setItem(`course_progress_${id || 'data_analysis'}`, computedCount.toString());
      }

      return updated;
    });
  };

  // Demo toggle helper to quickly test completing all or resetting
  const handleToggleAllLessonsDemo = () => {
    if (isAllVideosFinished) {
      const resetSet = new Set(['1-1', '1-2', '2-1', '2-2', '3-1']);
      setCompletedLessonIds(resetSet);
      setActiveLessonId('3-2');
      localStorage.setItem(`course_completed_lessons_${id || 'data_analysis'}`, JSON.stringify(Array.from(resetSet)));
      localStorage.setItem(`course_progress_${id || 'data_analysis'}`, '13');
      showToast('Progress reset to Module 3 in-progress');
    } else {
      const allSet = new Set(ALL_VIDEO_LESSON_IDS);
      setCompletedLessonIds(allSet);
      setActiveLessonId('5-1');
      setOpenModuleIds({ 1: true, 2: true, 3: true, 4: true, 5: true });
      localStorage.setItem(`course_completed_lessons_${id || 'data_analysis'}`, JSON.stringify(Array.from(allSet)));
      localStorage.setItem(`course_progress_${id || 'data_analysis'}`, '19');
      showToast('All lessons completed! Quiz celebration screen opened 🎉');
    }
  };

  const handleNextLesson = () => {
    if (currentIdx < allLessons.length - 1) {
      handleSelectLesson(allLessons[currentIdx + 1]);
    }
  };

  const handlePrevLesson = () => {
    if (currentIdx > 0) {
      handleSelectLesson(allLessons[currentIdx - 1]);
    }
  };

  const toggleModuleAccordion = (modId: number) => {
    setOpenModuleIds((prev) => ({
      ...prev,
      [modId]: !prev[modId],
    }));
  };

  const handleDownload = (filename: string) => {
    showToast(`Downloading ${filename}...`);
  };

  const handleSpeedCycle = () => {
    const speeds: ('1x' | '1.25x' | '1.5x' | '2x')[] = ['1x', '1.25x', '1.5x', '2x'];
    const nextIdx = (speeds.indexOf(playbackSpeed) + 1) % speeds.length;
    setPlaybackSpeed(speeds[nextIdx]);
  };


  return (
    <div className="bg-[#FEFEFE] min-h-screen relative w-full overflow-x-hidden text-[#1E293B] font-['Plus_Jakarta_Sans'] pb-20 flow-page-enter">
      {/* Figma Ambient Purple Glows */}
      <div className="absolute bottom-[410px] left-[-94px] w-[265px] h-[264px] pointer-events-none z-0 flex items-center justify-center">
        <div className="rotate-[-44.58deg]">
          <div className="w-[240px] h-[134px] bg-[#C693FD] opacity-20 blur-[29px] rounded-full" />
        </div>
      </div>
      <div className="absolute bottom-[-158px] right-[-50px] w-[571px] h-[569px] pointer-events-none z-0 flex items-center justify-center">
        <div className="rotate-[-44.58deg]">
          <div className="w-[514px] h-[292px] bg-[#C693FD] opacity-20 blur-[29px] rounded-full" />
        </div>
      </div>

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-6 right-6 z-50 bg-[#3B0454] text-white px-5 py-3 rounded-xl shadow-2xl flex items-center gap-3 border border-purple-400/30 animate-in fade-in slide-in-from-top-4 duration-300">
          <svg className="w-5 h-5 text-amber-300 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="text-sm font-medium">{toastMessage}</span>
        </div>
      )}

      {/* Main Container */}
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 pt-3 relative z-10 flex flex-col gap-5">
        {/* TOP BAR (Figma node 112:10106 / 112:10465) */}
        <header className="flex items-center justify-between w-full py-2">
          {/* Left: Logo & Breadcrumbs */}
          <div className="flex items-center gap-6 sm:gap-8 flex-wrap">
            <Link
              to={ROUTES.home}
              className="font-bold text-[22px] sm:text-[24px] text-[#22023C] tracking-tight hover:opacity-90 transition-opacity"
            >
              Interns HUB
            </Link>

            {/* Breadcrumb Navigation */}
            <div className="flex items-center gap-2">
              <div className="size-[36px] bg-[#F4F0F8] border border-[#AE8FC8] rounded-[8px] flex items-center justify-center shrink-0 shadow-2xs">
                <img
                  src="/images/video/grad-cap.svg"
                  alt="Courses"
                  className="w-[17.5px] h-[14px]"
                />
              </div>

              <div className="flex items-center gap-2 text-[14px] font-medium">
                <Link
                  to={ROUTES.courses6m}
                  className="text-[#94A3B8] hover:text-[#5A198F] transition-colors whitespace-nowrap"
                >
                  Courses
                </Link>

                <img
                  src="/images/video/chevron-right.svg"
                  alt=""
                  className="w-[7.5px] h-[12px] opacity-70"
                />

                <span className="text-[#94A3B8] whitespace-nowrap">
                  Artificial Intelligence
                </span>

                <img
                  src="/images/video/chevron-right.svg"
                  alt=""
                  className="w-[7.5px] h-[12px] opacity-70"
                />

                <span className="text-[#4C0585] font-semibold whitespace-nowrap">
                  Data Analysis Fundamentals
                </span>
              </div>
            </div>
          </div>

          {/* Right: Settings & User Capsule */}
          <div className="flex items-center gap-4 sm:gap-6 shrink-0">
            <button
              type="button"
              className="size-[27px] rounded-[6px] border border-[rgba(0,0,0,0.16)] bg-white/40 flex items-center justify-center hover:bg-black/5 transition-colors cursor-pointer"
              title="Settings"
            >
              <img
                src="/images/video/settings.svg"
                alt="Settings"
                className="size-[16px]"
              />
            </button>

            <div className="bg-[#F4F4F4] h-[62px] w-[261px] rounded-full shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] flex items-center px-4 gap-3 select-none">
              <div className="size-[40px] rounded-full overflow-hidden shrink-0 border border-slate-200">
                <img
                  src="/images/video/avatar-5.png"
                  alt="Maya Johnson"
                  className="size-full object-cover"
                />
              </div>
              <div className="flex flex-col min-w-0">
                <span className="font-normal text-[14px] leading-[20px] text-[#1E293B] truncate">
                  Maya Johnson
                </span>
                <span className="font-normal text-[12px] leading-[16px] text-[#6B7280] truncate">
                  AI track - 12 Month Plan
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* BACK BUTTON ROW */}
        <div className="flex items-center justify-between w-full">
          <button
            type="button"
            onClick={() => {
              if (id) {
                navigate(`/courses/${id}?enrolled=true`);
              } else {
                navigate(ROUTES.courses12m);
              }
            }}
            className="size-[34px] flex items-center justify-center rounded-full hover:bg-purple-100/60 active:scale-95 transition-all cursor-pointer group"
            title="Back to Course Details"
          >
            <img
              src="/images/video/arrow-left.svg"
              alt="Back"
              className="size-full group-hover:-translate-x-0.5 transition-transform"
            />
          </button>
        </div>

        {/* MAIN ROW: LEFT (PLAYER OR CELEBRATION) & RIGHT (COURSE CONTENT DRAWER) */}
        <div className="flex flex-col lg:flex-row items-start justify-between gap-6 lg:gap-8 w-full">
          {/* LEFT COLUMN */}
          <div className="flex-1 w-full max-w-full lg:max-w-[942px] flex flex-col gap-6">
            {isQuizView ? (
              /* FIGMA NODE 112:10464: CELEBRATION SCREEN ("take the quiz") */
              <div className="w-full flex flex-col items-center justify-center pt-2 pb-8 px-2 sm:px-6 flow-scale-in">
                <div className="w-full max-w-[865px] flex flex-col items-center text-center gap-6 sm:gap-7">
                  {/* 1. Success Illustration (Figma node 112:10669) */}
                  <div className="w-full max-w-[560px] flex items-center justify-center">
                    <img
                      src="/images/video/quiz-celebration.jpg"
                      alt="Congratulations! You've Completed All Lessons!"
                      className="w-full max-w-[500px] h-auto object-contain select-none flow-float-gentle drop-shadow-md"
                    />
                  </div>

                  {/* 2. Text Container (Figma node 112:11663) */}
                  <div className="flex flex-col items-center gap-3 w-full">
                    <h1 className="font-bold text-[28px] sm:text-[34px] lg:text-[36px] leading-[1.25] text-[#22023C] tracking-tight">
                      <span className="text-[#5A198F]">Congratulations</span>! You've Completed All Lessons!
                    </h1>
                    <p className="font-normal text-[14px] sm:text-[15px] lg:text-[16px] leading-[1.6] text-[#A4A4A4] max-w-[780px]">
                      You're one step away from earning your certificate! Take the final quiz and score at least 70% to receive your certificate. Don't worry — you have unlimited attempts to pass!
                    </p>
                  </div>

                  {/* 3. Take Your Quiz CTA Button (Figma node 112:11666) */}
                  <div className="w-full flex flex-col items-center gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => {
                        navigate(`/courses/${id || 'data_analysis'}/quiz`);
                      }}
                      className="w-full max-w-[865px] h-[48px] bg-[#5A198F] hover:bg-[#471273] active:scale-[0.99] text-white font-semibold text-[15px] rounded-[7249px] shadow-[0px_4px_24px_rgba(90,25,143,0.38)] flex items-center justify-center transition-all cursor-pointer flow-glow-pulse"
                    >
                      Take Your Quiz
                    </button>

                    {quizPassed && (
                      <button
                        type="button"
                        onClick={() => navigate(`/courses/${id || 'data_analysis'}/quiz`)}
                        className="flex items-center gap-2 text-emerald-600 hover:text-emerald-700 font-semibold text-sm pt-1 cursor-pointer transition-colors"
                      >
                        <svg className="size-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span>Official Certificate Unlocked! Click to view or retake quiz.</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              /* STANDARD VIDEO PLAYER & ATTACHMENTS VIEW (Figma node 112:10101) */
              <>
                {/* VIDEO PLAYER CONTAINER */}
                <div
                  className="bg-black border border-[#AE8FC8] rounded-[16px] shadow-[0px_25px_50px_-12px_rgba(0,0,0,0.25)] h-[380px] sm:h-[480px] lg:h-[528px] overflow-hidden relative flex flex-col justify-between select-none group/player"
                  style={{
                    backgroundImage:
                      'linear-gradient(150.77deg, rgb(26, 26, 36) 0%, rgb(13, 13, 18) 50%, rgb(0, 0, 0) 100%)',
                  }}
                >
                  <div
                    className="absolute inset-0 opacity-20 pointer-events-none"
                    style={{
                      backgroundImage:
                        "radial-gradient(circle at 30% 30%, rgba(124,92,255,0.25) 0%, transparent 60%), radial-gradient(circle at 70% 70%, rgba(91,124,255,0.2) 0%, transparent 60%)",
                    }}
                  />

                  {/* TOP OVERLAY: HD 1080p Badge */}
                  <div className="relative z-10 flex items-center justify-end p-5">
                    <div className="backdrop-blur-[2px] bg-[rgba(0,0,0,0.5)] border border-[rgba(255,255,255,0.16)] rounded-full px-3 py-1.5 flex items-center gap-2 shadow-xs">
                      <div className="size-2 rounded-full bg-[#EF4444] animate-pulse" />
                      <span className="font-['Inter'] font-medium text-[12px] leading-[16px] text-[#F4F0F8]">
                        HD 1080p
                      </span>
                    </div>
                  </div>

                  {/* CENTER PLAY BUTTON */}
                  <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
                    <button
                      type="button"
                      onClick={() => setIsPlaying((prev) => !prev)}
                      className="pointer-events-auto backdrop-blur-[6px] bg-white/10 border border-white/20 rounded-full size-[80px] flex items-center justify-center cursor-pointer shadow-2xl hover:scale-105 active:scale-95 transition-all group"
                      title={isPlaying ? 'Pause video' : 'Play video'}
                    >
                      <div className="size-[64px] rounded-full bg-gradient-to-b from-[#3A0353] to-[#804A8A] flex items-center justify-center shadow-lg group-hover:from-[#490568] group-hover:to-[#965ca1] transition-all">
                        {isPlaying ? (
                          <div className="flex items-center gap-1.5">
                            <div className="w-1.5 h-6 bg-white rounded-full" />
                            <div className="w-1.5 h-6 bg-white rounded-full" />
                          </div>
                        ) : (
                          <svg className="w-7 h-7 text-white ml-1" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M8 5v14l11-7z" />
                          </svg>
                        )}
                      </div>
                    </button>
                  </div>

                  {/* BOTTOM CONTROLS OVERLAY BAR */}
                  <div className="relative z-10 backdrop-blur-[6px] bg-black/40 border-t border-[rgba(255,255,255,0.1)] px-5 py-4 flex flex-col gap-2.5">
                    {/* Scrubbing Timeline Progress Bar */}
                    <div className="w-full flex items-center justify-between gap-3 text-[12px] text-[#F4F0F8] font-['Inter'] font-normal select-none">
                      <span>03:42</span>
                      <div className="flex-1 h-[4px] bg-[rgba(255,255,255,0.2)] rounded-full relative overflow-hidden cursor-pointer group/bar">
                        <div className="w-[37%] h-full bg-[#A262C7] rounded-full relative" />
                      </div>
                      <span>{activeLesson.duration}</span>
                    </div>

                    {/* Bottom Buttons Bar */}
                    <div className="flex items-center justify-between w-full pt-1">
                      {/* Left Controls: Prev, Play/Pause, Next, Volume */}
                      <div className="flex items-center gap-3 sm:gap-4">
                        <button
                          type="button"
                          onClick={handlePrevLesson}
                          disabled={currentIdx <= 0}
                          className="p-1 hover:opacity-80 disabled:opacity-40 disabled:cursor-not-allowed transition-opacity cursor-pointer"
                          title="Previous lesson"
                        >
                          <img
                            src="/images/video/player-prev.svg"
                            alt="Previous"
                            className="w-[11.25px] h-[18px]"
                          />
                        </button>

                        <button
                          type="button"
                          onClick={() => setIsPlaying((prev) => !prev)}
                          className="size-[40px] rounded-full bg-[#F4F0F8] flex items-center justify-center hover:bg-white active:scale-95 transition-all cursor-pointer shadow-md"
                          title={isPlaying ? 'Pause' : 'Play'}
                        >
                          {isPlaying ? (
                            <img
                              src="/images/video/player-pause.svg"
                              alt="Pause"
                              className="w-[8.75px] h-[14px]"
                            />
                          ) : (
                            <svg className="w-4 h-4 text-[#3A0353] ml-0.5" viewBox="0 0 24 24" fill="currentColor">
                              <path d="M8 5v14l11-7z" />
                            </svg>
                          )}
                        </button>

                        <button
                          type="button"
                          onClick={handleNextLesson}
                          disabled={currentIdx >= allLessons.length - 1}
                          className="p-1 hover:opacity-80 disabled:opacity-40 disabled:cursor-not-allowed transition-opacity cursor-pointer"
                          title="Next lesson"
                        >
                          <img
                            src="/images/video/player-next.svg"
                            alt="Next"
                            className="w-[11.25px] h-[18px]"
                          />
                        </button>

                        {/* Volume Row */}
                        <div className="flex items-center gap-2 pl-2">
                          <img
                            src="/images/video/player-volume.svg"
                            alt="Volume"
                            className="w-[17.5px] h-[14px]"
                          />
                          <div className="w-[80px] h-[4px] bg-[rgba(255,255,255,0.2)] rounded-full relative overflow-hidden cursor-pointer">
                            <div className="w-[66%] h-full bg-[#F4F0F8] rounded-full" />
                          </div>
                        </div>
                      </div>

                      {/* Right Controls: Speed, CC, Settings, Fullscreen */}
                      <div className="flex items-center gap-4 sm:gap-5 font-['Inter']">
                        <button
                          type="button"
                          onClick={handleSpeedCycle}
                          className="border border-[rgba(255,255,255,0.2)] rounded-[6px] px-2.5 py-1 text-[12px] font-semibold text-[#F4F0F8] hover:bg-white/10 active:scale-95 transition-all cursor-pointer"
                          title="Playback speed"
                        >
                          {playbackSpeed}
                        </button>

                        <button
                          type="button"
                          className="p-1 hover:opacity-80 transition-opacity cursor-pointer"
                          title="Subtitles"
                        >
                          <img
                            src="/images/video/player-cc.svg"
                            alt="CC"
                            className="w-[15.75px] h-[14px]"
                          />
                        </button>

                        <button
                          type="button"
                          className="p-1 hover:opacity-80 transition-opacity cursor-pointer"
                          title="Player Settings"
                        >
                          <img
                            src="/images/video/player-settings.svg"
                            alt="Settings"
                            className="size-[14px]"
                          />
                        </button>

                        <button
                          type="button"
                          className="p-1 hover:opacity-80 transition-opacity cursor-pointer"
                          title="Fullscreen"
                        >
                          <img
                            src="/images/video/player-fullscreen.svg"
                            alt="Fullscreen"
                            className="w-[12.25px] h-[14px]"
                          />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* VIDEO TITLE, DESCRIPTION & TAGS */}
                <div className="flex flex-col gap-5 w-full">
                  <div className="flex flex-col sm:flex-row items-start justify-between gap-4 w-full">
                    <div className="flex flex-col gap-2 max-w-[696px]">
                      <h1 className="font-bold text-[28px] sm:text-[34px] lg:text-[36px] leading-tight text-[#3B0454] tracking-tight">
                        {activeLesson.title === 'Building Interactive Prototypes'
                          ? 'Building Interactive Prototypes in Figma'
                          : activeLesson.title}
                      </h1>
                      <p className="font-medium text-[15px] sm:text-[16px] leading-[1.3] text-[rgba(34,2,60,0.65)]">
                        Learn how to transform static designs into interactive, clickable prototypes
                        using Figma's prototyping tools. We'll cover transitions, overlays, and smart animate.
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => setIsSaved((prev) => !prev)}
                      className={`bg-[#F4F0F8] border border-[rgba(139,93,176,0.65)] rounded-[8px] px-4 py-2.5 flex items-center gap-2 text-[#5A198F] text-[14px] font-medium font-['Inter'] hover:bg-[#EAE2F2] active:scale-95 transition-all cursor-pointer shrink-0 ${
                        isSaved ? 'ring-2 ring-purple-400 bg-purple-100' : ''
                      }`}
                    >
                      <img
                        src="/images/video/save-bookmark.svg"
                        alt=""
                        className={`w-[10.5px] h-[14px] ${isSaved ? 'opacity-100' : 'opacity-80'}`}
                      />
                      <span>{isSaved ? 'Saved' : 'Save'}</span>
                    </button>
                  </div>

                  {/* Metadata Badges Row */}
                  <div className="flex flex-wrap items-center gap-3 font-['Inter']">
                    <div className="bg-[rgba(124,92,255,0.1)] border border-[rgba(124,92,255,0.3)] rounded-full px-3 py-1.5 flex items-center gap-1.5 text-[#5A198F] text-[12px] font-medium">
                      <img src="/images/video/clock.svg" alt="" className="size-3" />
                      <span>32 min</span>
                    </div>

                    <div className="bg-[rgba(124,92,255,0.1)] border border-[rgba(124,92,255,0.3)] rounded-full px-3 py-1.5 flex items-center gap-1.5 text-[#5A198F] text-[12px] font-medium">
                      <img src="/images/video/intermediate.svg" alt="" className="w-[15px] h-[12px]" />
                      <span>Intermediate</span>
                    </div>

                    <div className="bg-[rgba(124,92,255,0.1)] border border-[rgba(124,92,255,0.3)] rounded-full px-3 py-1.5 flex items-center gap-1.5 text-[#5A198F] text-[12px] font-medium">
                      <img src="/images/video/module-icon.svg" alt="" className="w-[13.5px] h-[12px]" />
                      <span>Module 3</span>
                    </div>

                    <div className="bg-[rgba(124,92,255,0.1)] border border-[rgba(124,92,255,0.3)] rounded-full px-3 py-1.5 flex items-center gap-1.5 text-[#5A198F] text-[12px] font-medium">
                      <img src="/images/video/resources-icon.svg" alt="" className="w-[9px] h-[12px]" />
                      <span>Resources (3)</span>
                    </div>
                  </div>
                </div>

                {/* LESSON ATTACHMENTS ACCORDION */}
                <div className="bg-white border border-[rgba(0,0,0,0.22)] rounded-[16px] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] overflow-hidden w-full flex flex-col">
                  <button
                    type="button"
                    onClick={() => setIsAttachmentsOpen((prev) => !prev)}
                    className="w-full px-6 sm:px-7 py-5 flex items-center justify-between text-start cursor-pointer hover:bg-slate-50/50 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <img
                        src="/images/video/layer.svg"
                        alt=""
                        className="size-6"
                      />
                      <h3 className="font-bold text-[16px] text-[#0F172A] leading-[24px]">
                        Lesson 2: More Attachments
                      </h3>
                    </div>

                    <div className="size-[36px] bg-[#F8FAFC] rounded-full flex items-center justify-center shrink-0">
                      <img
                        src="/images/video/chevron-down.svg"
                        alt=""
                        className={`size-[14px] transition-transform duration-200 ${
                          isAttachmentsOpen ? 'rotate-180' : ''
                        }`}
                      />
                    </div>
                  </button>

                  {isAttachmentsOpen && (
                    <div className="border-t border-[#F1F5F9] px-6 sm:px-7 py-2 bg-white flex flex-col divide-y divide-[#F8FAFC]">
                      {ATTACHMENTS_DATA.map((item) => (
                        <div
                          key={item.id}
                          className="py-4 flex items-center justify-between gap-4 hover:bg-slate-50/70 px-2 rounded-lg transition-colors"
                        >
                          <div className="flex items-center gap-4">
                            <div className="size-10 flex items-center justify-center shrink-0">
                              <img
                                src={item.iconSrc}
                                alt=""
                                className="h-10 w-8 object-contain"
                              />
                            </div>
                            <div className="flex flex-col">
                              <span className="font-semibold text-[14px] text-[#1E293B] leading-[20px]">
                                {item.title}
                              </span>
                              <span className="font-normal text-[12px] text-[#94A3B8] leading-[16px]">
                                {item.fileType}
                              </span>
                            </div>
                          </div>

                          <button
                            type="button"
                            onClick={() => handleDownload(item.title)}
                            className="size-[34px] flex items-center justify-center rounded-lg hover:bg-purple-50 transition-colors cursor-pointer group shrink-0"
                            title={`Download ${item.title}`}
                          >
                            <img
                              src="/images/video/receive-square.svg"
                              alt="Download"
                              className="size-[34px] group-hover:scale-105 transition-transform"
                            />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </>
            )}
          </div>

          {/* RIGHT COLUMN: Course Content Checklist Drawer Card (Figma node 112:10294 / 112:10501) */}
          <div className="w-full lg:w-[426px] bg-[#F4F4F4] rounded-[36px] drop-shadow-[0px_4px_2px_rgba(0,0,0,0.25)] p-6 py-8 flex flex-col gap-6 shrink-0 font-['Inter']">
            {/* Drawer Header */}
            <div className="flex flex-col gap-2 w-full">
              <button
                type="button"
                onClick={() => setIsCourseContentOpen((prev) => !prev)}
                className="flex items-center justify-between w-full cursor-pointer select-none group text-left py-1"
                title={isCourseContentOpen ? 'Collapse Course Content' : 'Expand Course Content'}
              >
                <h2 className="font-bold text-[18px] leading-[28px] text-[#22023C] tracking-tight group-hover:text-[#5A198F] transition-colors">
                  Course Content
                </h2>
                <div className="size-7 flex items-center justify-center group-hover:bg-black/5 rounded-full transition-colors cursor-pointer">
                  <img
                    src="/images/video/chevron-up.svg"
                    alt=""
                    className={`w-[14px] h-[19px] transition-transform duration-300 ${
                      isCourseContentOpen ? '' : 'rotate-180'
                    }`}
                  />
                </div>
              </button>

              {isCourseContentOpen && (
                <>
                  {/* Module Progress text */}
                  <div className="flex items-center justify-between pt-1 w-full text-[12px]">
                    <div className="flex items-center gap-2">
                      <span className="text-[#672B97] font-normal">Module Progress</span>
                      <button
                        type="button"
                        onClick={handleToggleAllLessonsDemo}
                        className="text-[11px] text-[#8B5DB0] hover:text-[#5A198F] underline cursor-pointer"
                        title="Toggle all lessons to test quiz unlock flow"
                      >
                        {isAllVideosFinished ? '(Reset Progress)' : '(Complete All)'}
                      </button>
                    </div>
                    <span className="text-[#8B5DB0] font-semibold">
                      {completedLessonCount}/19 lessons
                    </span>
                  </div>

                  {/* Module Progress Bar */}
                  <div className="bg-[#F4F0F8] border border-[#AE8FC8] h-[8px] rounded-full overflow-hidden w-full relative">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-[#3B0454] to-[#804A8A] transition-all duration-500"
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                </>
              )}
            </div>

            {/* Modules and Lessons List */}
            {isCourseContentOpen && (
              <div className="flex flex-col gap-5 w-full transition-all duration-300">
                {MODULES_DATA.map((module) => {
                  const isModule1or2 = module.id === 1 || module.id === 2;
                  const isModule3 = module.id === 3;
                  const isModule4 = module.id === 4;
                  const isQuiz = module.id === 5;

                  let isModDone = false;
                  let isModLocked = false;
                  let isModActive = false;

                  if (isModule1or2) {
                    isModDone = true;
                  } else if (isModule3) {
                    isModDone = isModule3Complete;
                    isModActive = !isModDone && module.lessons.some((l) => l.id === activeLessonId);
                  } else if (isModule4) {
                    isModLocked = !isModule4Unlocked;
                    isModDone = isModule4Complete;
                    isModActive = isModule4Unlocked && !isModDone && module.lessons.some((l) => l.id === activeLessonId);
                  } else if (isQuiz) {
                    isModLocked = !isQuizUnlocked;
                    isModActive = isQuizUnlocked && activeLessonId === '5-1';
                    isModDone = isQuizUnlocked && quizPassed;
                  }

                  const isModuleExpanded = openModuleIds[module.id] ?? true;

                  return (
                    <div key={module.id} className="flex flex-col gap-3 w-full">
                      {/* Module Header Row */}
                      <div
                        onClick={() => toggleModuleAccordion(module.id)}
                        className="flex items-center justify-between w-full cursor-pointer select-none group/mod hover:opacity-90 transition-opacity"
                        title={isModuleExpanded ? 'Collapse Module' : 'Expand Module'}
                      >
                        <div className="flex items-center gap-2">
                          {isModDone ? (
                            <div className="size-5 bg-[#D2C1E1] border border-[rgba(174,143,200,0.67)] rounded-full flex items-center justify-center shrink-0">
                              <img
                                src="/images/video/check-circle.svg"
                                alt="Completed"
                                className="w-2 h-2.5"
                              />
                            </div>
                          ) : isModLocked ? (
                            <div className="size-5 bg-[#F4F0F8] border border-[#8B5DB0] rounded-full flex items-center justify-center shrink-0">
                              <img
                                src="/images/video/lock-circle.svg"
                                alt="Locked"
                                className="w-2 h-2.5"
                              />
                            </div>
                          ) : isModActive || (isQuiz && isQuizUnlocked) ? (
                            /* Active or Unlocked Quiz Purple Dot (Figma node 112:10654) */
                            <div className="size-5 bg-[rgba(124,92,255,0.15)] border border-[rgba(124,92,255,0.4)] rounded-full flex items-center justify-center shrink-0">
                              <div className="size-1.5 bg-[#22023C] rounded-full" />
                            </div>
                          ) : (
                            <div className="size-5 bg-[#F4F0F8] border border-[#8B5DB0] rounded-full flex items-center justify-center shrink-0">
                              <div className="size-1 bg-[#8B5DB0] rounded-full" />
                            </div>
                          )}

                          <h4
                            className={`font-semibold text-[14px] leading-[20px] transition-colors ${
                              isModDone
                                ? 'text-[#8B5DB0]'
                                : isModLocked
                                ? 'text-[#6B7280]'
                                : 'text-[#22023C] group-hover/mod:text-[#5A198F]'
                            }`}
                          >
                            {module.title}
                          </h4>
                        </div>

                        <svg
                          width="12"
                          height="12"
                          viewBox="0 0 12 12"
                          fill="none"
                          className={`text-[#8B5DB0] transition-transform duration-200 ${
                            isModuleExpanded ? 'rotate-180' : ''
                          }`}
                        >
                          <path
                            d="M2.5 4.5L6 8L9.5 4.5"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </div>

                      {/* Lessons List for this Module */}
                      {isModuleExpanded && (
                        <div className="flex flex-col gap-1 pl-1">
                          {module.lessons.map((lesson) => {
                            const isCurrent = lesson.id === activeLessonId;
                            const isLessonChecked = completedLessonIds.has(lesson.id);

                            // SPECIAL CASE: Final Quiz Lesson (5-1)
                            if (lesson.id === '5-1') {
                              if (!isQuizUnlocked) {
                                return (
                                  <div
                                    key={lesson.id}
                                    onClick={() => handleSelectLesson(lesson)}
                                    className="p-2.5 rounded-[8px] flex items-center gap-3 w-full cursor-not-allowed opacity-75 hover:bg-black/5 transition-colors group/quiz"
                                    title="Locked: Complete Module 4 first"
                                  >
                                    <div className="size-8 bg-[#F4F0F8] border border-[#8B5DB0] rounded-[6px] flex items-center justify-center shrink-0">
                                      <img
                                        src="/images/video/lock-square.svg"
                                        alt="Locked"
                                        className="w-2.5 h-3"
                                      />
                                    </div>
                                    <div className="flex flex-col flex-1 min-w-0">
                                      <span className="font-normal text-[14px] leading-[20px] text-[#6B7280] truncate">
                                        Final Quiz
                                      </span>
                                      <span className="font-normal text-[12px] leading-[16px] text-[#94A3B8] truncate">
                                        unlimited attempts - must score 70 % or above
                                      </span>
                                    </div>
                                  </div>
                                );
                              }

                              // Quiz is UNLOCKED (Figma node 112:10658)
                              if (isCurrent) {
                                return (
                                  <div
                                    key={lesson.id}
                                    onClick={() => handleSelectLesson(lesson)}
                                    className="bg-[rgba(124,92,255,0.1)] border border-[rgba(124,92,255,0.3)] rounded-[8px] p-2.5 flex items-center gap-3 w-full cursor-pointer shadow-2xs hover:bg-[rgba(124,92,255,0.16)] transition-all"
                                    title="Final Quiz active"
                                  >
                                    <div className="size-8 bg-[#F4F0F8] border border-[#AE8FC8] rounded-[6px] flex items-center justify-center shrink-0 text-[#5A198F]">
                                      <svg className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                      </svg>
                                    </div>

                                    <div className="flex flex-col flex-1 min-w-0">
                                      <span className="font-semibold text-[14px] leading-[20px] text-[#22023C] truncate">
                                        Final Quiz
                                      </span>
                                      <span className="font-normal text-[12px] leading-[16px] text-[#22023C] truncate">
                                        unlimited attempts - must score 70 % or above
                                      </span>
                                    </div>
                                  </div>
                                );
                              }

                              return (
                                <div
                                  key={lesson.id}
                                  onClick={() => handleSelectLesson(lesson)}
                                  className="p-2.5 rounded-[8px] flex items-center gap-3 w-full hover:bg-black/5 active:scale-[0.99] transition-all cursor-pointer group/quiz"
                                  title="Click to take the Final Quiz"
                                >
                                  <div className="size-8 bg-[#F4F0F8] border border-[#AE8FC8] group-hover/quiz:border-[#5A198F] rounded-[6px] flex items-center justify-center shrink-0 text-[#5A198F] transition-colors">
                                    <svg className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                  </div>

                                  <div className="flex flex-col flex-1 min-w-0">
                                    <span className="font-normal text-[14px] leading-[20px] text-[#22023C] truncate group-hover/quiz:text-[#5A198F] transition-colors">
                                      Final Quiz
                                    </span>
                                    <span className="font-normal text-[12px] leading-[16px] text-[#4B5563] truncate">
                                      unlimited attempts - must score 70 % or above
                                    </span>
                                  </div>
                                </div>
                              );
                            }

                            // STANDARD VIDEO LESSONS (Modules 1, 2, 3, 4)
                            if (isCurrent) {
                              return (
                                /* Active / Playing Lesson Row (Figma node 112:10384) */
                                <div
                                  key={lesson.id}
                                  onClick={() => handleSelectLesson(lesson)}
                                  className="bg-[rgba(124,92,255,0.1)] border border-[rgba(124,92,255,0.3)] rounded-[8px] p-2.5 flex items-center gap-3 w-full cursor-pointer shadow-2xs hover:bg-[rgba(124,92,255,0.16)] transition-all"
                                  title="Currently playing - click to toggle play/pause"
                                >
                                  <button
                                    type="button"
                                    onClick={(e) => handleToggleLessonDone(lesson.id, e)}
                                    className="size-8 bg-[#5A198F] hover:bg-[#471273] rounded-[6px] flex items-center justify-center shrink-0 shadow-xs cursor-pointer active:scale-95 transition-transform"
                                    title={isLessonChecked ? "Completed! Click to toggle" : "Playing - click to mark done"}
                                  >
                                    {isLessonChecked ? (
                                      <img
                                        src="/images/video/check-square.svg"
                                        alt="Completed"
                                        className="w-2.5 h-3"
                                      />
                                    ) : (
                                      <img
                                        src="/images/video/play-square.svg"
                                        alt="Playing"
                                        className="w-2.5 h-3"
                                      />
                                    )}
                                  </button>

                                  <div className="flex flex-col flex-1 min-w-0">
                                    <span className="font-semibold text-[14px] leading-[20px] text-[#22023C] truncate">
                                      {lesson.title}
                                    </span>
                                    <span className="font-normal text-[12px] leading-[16px] text-[#22023C]">
                                      {lesson.remainingText || `${lesson.duration} · Playing`}
                                    </span>
                                  </div>

                                  {/* Pulsing Equalizer Bars */}
                                  <div className="flex items-end gap-[2px] h-4 shrink-0">
                                    <div className="w-[2px] h-2 bg-[#22023C] rounded-full animate-pulse" />
                                    <div className="w-[2px] h-4 bg-[#22023C] rounded-full animate-pulse [animation-delay:150ms]" />
                                    <div className="w-[2px] h-3 bg-[#22023C] rounded-full animate-pulse [animation-delay:300ms]" />
                                  </div>
                                </div>
                              );
                            }

                            // If Module 4 is LOCKED:
                            if (module.id === 4 && !isModule4Unlocked) {
                              return (
                                <div
                                  key={lesson.id}
                                  onClick={() => handleSelectLesson(lesson)}
                                  className="p-2.5 rounded-[8px] flex items-center gap-3 w-full cursor-not-allowed opacity-75 hover:bg-black/5 transition-colors group/locked"
                                  title="Locked: Complete Module 3 first"
                                >
                                  <div className="size-8 bg-[#F4F0F8] border border-[#8B5DB0] rounded-[6px] flex items-center justify-center shrink-0">
                                    <img
                                      src="/images/video/lock-square.svg"
                                      alt="Locked"
                                      className="w-2.5 h-3"
                                    />
                                  </div>
                                  <div className="flex flex-col flex-1 min-w-0">
                                    <span className="font-normal text-[14px] leading-[20px] text-[#6B7280] truncate">
                                      {lesson.title}
                                    </span>
                                    <span className="font-normal text-[12px] leading-[16px] text-[#94A3B8] truncate">
                                      {lesson.duration} · Locked
                                    </span>
                                  </div>
                                </div>
                              );
                            }

                            // Unlocked video lessons
                            return (
                              <div
                                key={lesson.id}
                                onClick={() => handleSelectLesson(lesson)}
                                className="p-2.5 rounded-[8px] flex items-center gap-3 w-full hover:bg-black/5 active:scale-[0.99] transition-all cursor-pointer group/lesson"
                                title={`Play "${lesson.title}"`}
                              >
                                {isLessonChecked ? (
                                  <button
                                    type="button"
                                    onClick={(e) => handleToggleLessonDone(lesson.id, e)}
                                    className="size-8 bg-[#D2C1E1] hover:bg-[#c3aed4] border border-[rgba(174,143,200,0.67)] rounded-[6px] flex items-center justify-center shrink-0 shadow-2xs cursor-pointer active:scale-95 transition-transform"
                                    title="Completed! Click to toggle"
                                  >
                                    <img
                                      src="/images/video/check-square.svg"
                                      alt="Completed"
                                      className="w-2.5 h-3"
                                    />
                                  </button>
                                ) : (
                                  <button
                                    type="button"
                                    onClick={(e) => handleToggleLessonDone(lesson.id, e)}
                                    className="size-8 bg-[#F4F0F8] hover:bg-purple-100 border border-[#AE8FC8] rounded-[6px] flex items-center justify-center shrink-0 text-[#6B7280] font-semibold text-[12px] group-hover/lesson:border-[#5A198F] group-hover/lesson:text-[#5A198F] transition-colors cursor-pointer"
                                    title="Click to mark done"
                                  >
                                    {lesson.lessonNumber || '00'}
                                  </button>
                                )}

                                <div className="flex flex-col flex-1 min-w-0">
                                  <span className="font-normal text-[14px] leading-[20px] text-[#22023C] truncate group-hover/lesson:text-[#5A198F] transition-colors">
                                    {lesson.title}
                                  </span>
                                  <span className="font-normal text-[12px] leading-[16px] text-[#4B5563] truncate">
                                    {isLessonChecked ? `${lesson.duration} · Completed` : lesson.duration}
                                  </span>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>


    </div>
  );
};

export default CourseVideoPage;
