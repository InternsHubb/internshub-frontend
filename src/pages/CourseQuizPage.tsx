import React, { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ROUTES } from '@/constants/routes';

interface QuizQuestion {
  id: number;
  question: string;
  options: { key: string; label: string }[];
  correctAnswer: string;
  explanation?: string;
}

const MOCK_QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    question: 'What is the main purpose of Data Analysis?',
    options: [
      { key: 'A', label: 'To store large amounts of data' },
      { key: 'B', label: 'To transform raw data into meaningful insights' },
      { key: 'C', label: 'To design websites and applications' },
      { key: 'D', label: 'To write computer operating systems' },
    ],
    correctAnswer: 'B',
    explanation: 'Data analysis transforms raw data into meaningful, actionable insights for decision-making.',
  },
  {
    id: 2,
    question: 'Which statistical measure represents the middle value separating the higher half from the lower half of a dataset?',
    options: [
      { key: 'A', label: 'Arithmetic Mean' },
      { key: 'B', label: 'Median' },
      { key: 'C', label: 'Mode' },
      { key: 'D', label: 'Standard Deviation' },
    ],
    correctAnswer: 'B',
    explanation: 'The median is the exact middle value in a sorted dataset, robust to extreme outliers.',
  },
  {
    id: 3,
    question: 'In SQL database querying, which clause is specifically used to filter aggregated group results?',
    options: [
      { key: 'A', label: 'WHERE' },
      { key: 'B', label: 'HAVING' },
      { key: 'C', label: 'GROUP BY' },
      { key: 'D', label: 'ORDER BY' },
    ],
    correctAnswer: 'B',
    explanation: 'The HAVING clause filters records after aggregation (GROUP BY), whereas WHERE filters before aggregation.',
  },
  {
    id: 4,
    question: 'What type of data visualization is most effective for displaying the composition or proportions of a whole?',
    options: [
      { key: 'A', label: 'Scatter plot' },
      { key: 'B', label: 'Pie or donut chart' },
      { key: 'C', label: 'Line trend chart' },
      { key: 'D', label: 'Box-and-whisker plot' },
    ],
    correctAnswer: 'B',
    explanation: 'Pie and donut charts are specifically designed to illustrate proportional compositions of a total.',
  },
  {
    id: 5,
    question: 'In Excel and Google Sheets, which function searches for a lookup value in the first column and returns a value in the same row?',
    options: [
      { key: 'A', label: 'VLOOKUP' },
      { key: 'B', label: 'HLOOKUP' },
      { key: 'C', label: 'COUNTIF' },
      { key: 'D', label: 'CONCATENATE' },
    ],
    correctAnswer: 'A',
    explanation: 'VLOOKUP (Vertical Lookup) searches down the first column and retrieves a cell across the matched row.',
  },
  {
    id: 6,
    question: 'What is the fundamental distinction between quantitative and qualitative data?',
    options: [
      { key: 'A', label: 'Quantitative data is numerical, while qualitative data is descriptive or categorical' },
      { key: 'B', label: 'Qualitative data is always collected via automated hardware sensors' },
      { key: 'C', label: 'Quantitative data cannot be used in statistical hypothesis testing' },
      { key: 'D', label: 'There is no analytical difference between the two forms' },
    ],
    correctAnswer: 'A',
    explanation: 'Quantitative data deals with countable numbers and measurements, whereas qualitative data deals with descriptions and categories.',
  },
  {
    id: 7,
    question: 'In Python data analysis workflows, which open-source library provides the primary DataFrame structure for data wrangling?',
    options: [
      { key: 'A', label: 'Matplotlib' },
      { key: 'B', label: 'Pandas' },
      { key: 'C', label: 'Pygame' },
      { key: 'D', label: 'Requests' },
    ],
    correctAnswer: 'B',
    explanation: 'Pandas is the core Python data manipulation library that introduces the two-dimensional DataFrame structure.',
  },
  {
    id: 8,
    question: 'What is an outlier in a dataset and why must data analysts evaluate it carefully?',
    options: [
      { key: 'A', label: 'A duplicate row that should always be silently deleted' },
      { key: 'B', label: 'A data point that diverges significantly from the overall distribution and may distort analytical results' },
      { key: 'C', label: 'The mean average calculated across all numeric columns' },
      { key: 'D', label: 'The primary key column of a relational database table' },
    ],
    correctAnswer: 'B',
    explanation: 'Outliers deviate strongly from standard trends and can heavily skew summary statistics like the mean.',
  },
  {
    id: 9,
    question: 'In Power BI and modern BI dashboards, which visual element enables users to slice and filter report pages dynamically?',
    options: [
      { key: 'A', label: 'Slicer Visual' },
      { key: 'B', label: 'DAX Formula Bar' },
      { key: 'C', label: 'Power Query M Script' },
      { key: 'D', label: 'Gateway Config' },
    ],
    correctAnswer: 'A',
    explanation: 'A Slicer is an on-canvas interactive filter that users click to partition dashboard reports dynamically.',
  },
  {
    id: 10,
    question: 'When presenting findings to executive decision-makers, what should a data analyst prioritize?',
    options: [
      { key: 'A', label: 'Unfiltered raw database logs and unprocessed query outputs' },
      { key: 'B', label: 'Actionable business insights, strategic impact, and clear visual storytelling' },
      { key: 'C', label: 'Obscure statistical terminology to maximize academic authority' },
      { key: 'D', label: 'Omitting any context regarding data limitations or caveats' },
    ],
    correctAnswer: 'B',
    explanation: 'Executive stakeholders need clear, high-impact business narratives supported by clean visuals and actionable takeaways.',
  },
];

export const CourseQuizPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id?: string }>();
  const courseId = id || 'data_analysis';

  // Active question index (0 to 9)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);

  // Selected answers: { [questionId]: 'A' | 'B' | 'C' | 'D' }
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, string>>({});

  // Submission & Scoring State
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const [isReviewing, setIsReviewing] = useState<boolean>(false);
  const [showCertificateModal, setShowCertificateModal] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const currentQ = MOCK_QUESTIONS[currentQuestionIndex];
  const answeredCount = Object.keys(selectedAnswers).length;
  const progressPercent = Math.round((answeredCount / MOCK_QUESTIONS.length) * 100);
  const scorePercent = Math.round((score / MOCK_QUESTIONS.length) * 100);
  const isPassed = scorePercent >= 70; // 70% passing threshold (7/10)

  const handleSelectOption = (optionKey: string) => {
    if (isReviewing) return; // Read-only in review mode
    setSelectedAnswers((prev) => ({
      ...prev,
      [currentQ.id]: optionKey,
    }));
  };

  const handleNext = () => {
    if (currentQuestionIndex < MOCK_QUESTIONS.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    } else {
      handleSubmitQuiz();
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    }
  };

  const handleSubmitQuiz = () => {
    let calculatedScore = 0;
    MOCK_QUESTIONS.forEach((q) => {
      if (selectedAnswers[q.id] === q.correctAnswer) {
        calculatedScore += 1;
      }
    });

    setScore(calculatedScore);
    setIsSubmitted(true);
    setIsReviewing(false);

    // Threshold: 70% (7 out of 10)
    if (calculatedScore >= 7) {
      try {
        localStorage.setItem(`course_quiz_passed_${courseId}`, 'true');
        localStorage.setItem(`course_progress_${courseId}`, '19');
        localStorage.setItem(`course_completed_${courseId}`, 'true');
      } catch {}
      showToast('🎉 Congratulations! You passed the Final Quiz!');
    } else {
      showToast('Keep going! You can review the lessons and retake the quiz anytime.');
    }
  };

  const handleRetakeQuiz = () => {
    setSelectedAnswers({});
    setCurrentQuestionIndex(0);
    setIsSubmitted(false);
    setIsReviewing(false);
    setShowCertificateModal(false);
  };

  const handleStartReview = () => {
    setIsReviewing(true);
    setCurrentQuestionIndex(0);
  };

  const handleBackToCourses = () => {
    navigate(`/courses/${courseId}?enrolled=true`);
  };

  // Reusable Top Navigation Bar matching Figma
  const renderHeader = () => (
    <header className="flex items-center justify-between w-full py-2">
      {/* Left: Logo & Breadcrumbs */}
      <div className="flex items-center gap-6 sm:gap-8 flex-wrap">
        <Link
          to={ROUTES.home}
          className="font-bold text-[22px] sm:text-[24px] text-[#22023C] tracking-tight hover:opacity-90 transition-opacity"
        >
          Interns HUB
        </Link>

        {/* Breadcrumb Navigation (Figma node 112:12887 / 112:20132 / 112:21377 / 112:21524 / 112:21669) */}
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

            <Link
              to={`/courses/${courseId}?enrolled=true`}
              className="text-[#94A3B8] hover:text-[#5A198F] transition-colors whitespace-nowrap"
            >
              Data Analysis Fundamentals
            </Link>

            <img
              src="/images/video/chevron-right.svg"
              alt=""
              className="w-[7.5px] h-[12px] opacity-70"
            />

            <span className="text-[#3A0353] font-semibold whitespace-nowrap">
              Final Quiz
            </span>
          </div>
        </div>
      </div>

      {/* Right: Settings & User Capsule */}
      <div className="flex items-center gap-4 sm:gap-6 shrink-0">
        <button
          type="button"
          className="size-[27px] rounded-[6px] border border-[rgba(0,0,0,0.16)] bg-[rgba(0,0,0,0.01)] flex items-center justify-center hover:bg-black/5 transition-colors cursor-pointer"
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
              AI track - 6 Month Plan
            </span>
          </div>
        </div>
      </div>
    </header>
  );

  return (
    <div className="bg-[#FEFEFE] min-h-screen relative w-full overflow-x-hidden text-[#1E293B] font-['Plus_Jakarta_Sans'] pb-24 flow-page-enter">
      {/* Figma Ambient Purple Glows */}
      <div className="absolute bottom-[410px] left-[-94px] w-[265px] h-[264px] pointer-events-none z-0 flex items-center justify-center">
        <div className="rotate-[-44.58deg]">
          <div className="w-[240px] h-[134px] bg-[#C693FD] opacity-20 blur-[29px] rounded-full" />
        </div>
      </div>
      <div className="absolute bottom-[-127px] left-[809px] w-[289px] h-[286px] pointer-events-none z-0 flex items-center justify-center">
        <div className="rotate-[-44.58deg]">
          <div className="w-[337px] h-[70px] bg-[#C693FD] opacity-20 blur-[29px] rounded-full" />
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

      {/* Main Page Container */}
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 pt-3 relative z-10 flex flex-col gap-6">
        {renderHeader()}

        {/* ------------------------------------------------------------- */}
        {/* CASE 1: RESULT SCREEN - FAIL (SCORE < 70%)                    */}
        {/* FIGMA DESIGN: node 112:20125 ("the quizscore failed")         */}
        {/* ------------------------------------------------------------- */}
        {isSubmitted && !isPassed && !isReviewing && (
          <div className="relative w-full min-h-[780px] flex flex-col items-center pt-2 flow-scale-in">
            {/* Back Arrow Button (Figma node 112:21369) */}
            <div className="w-full flex items-center justify-start pb-2">
              <button
                type="button"
                onClick={handleBackToCourses}
                className="w-[34px] h-[34px] rounded-full flex items-center justify-center text-[#22023C] hover:bg-black/5 transition-colors cursor-pointer"
                title="Back to Course"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
              </button>
            </div>

            {/* Floating Top Right Score Card (Figma node 112:20167: x=1157, y=112, w=259, h=230) */}
            <div className="w-full lg:absolute lg:top-4 lg:right-0 lg:w-[259px] flex justify-center mb-6 lg:mb-0 z-20">
              <div className="bg-[#F4F4F4] rounded-[36px] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] w-[259px] h-[230px] flex flex-col items-center justify-center px-6 text-center select-none border border-slate-100 flow-badge-pop">
                {/* Red Failure Badge Icon */}
                <div className="size-[93px] rounded-full flex items-center justify-center mb-3">
                  <img
                    src="/images/quiz/fail-icon.png"
                    alt="Failed"
                    className="size-[93px] object-contain drop-shadow-sm"
                  />
                </div>

                {/* Score Text */}
                <p className="font-semibold text-[24px] text-black leading-none mb-2">
                  Your Score: {scorePercent}%
                </p>
                <p className="font-semibold text-[20px] text-[#6B7280] leading-none">
                  Passing Score: 70%
                </p>
              </div>
            </div>

            {/* Center Content Column (Figma node 112:20170: x=221, y=192, w=998) */}
            <div className="w-full max-w-[998px] mx-auto flex flex-col items-center text-center gap-6 z-10 pt-2 lg:pt-6">
              {/* Stressed Student Illustration (Figma node 112:20172) */}
              <div className="w-full max-w-[527px] h-auto flex items-center justify-center">
                <img
                  src="/images/quiz/quiz-fail.jpg"
                  alt="Don't Give Up"
                  className="w-full max-h-[380px] object-contain rounded-[24px] flow-float-gentle drop-shadow-md"
                />
              </div>

              {/* Headings & Texts (Figma node 112:21358) */}
              <div className="flex flex-col items-center gap-3 w-full">
                <h1 className="font-extrabold text-[36px] sm:text-[40px] text-black leading-[1.2] tracking-tight">
                  Don't Give Up!
                </h1>

                <p className="font-medium text-[20px] sm:text-[24px] text-[#242424] leading-snug max-w-[900px]">
                  You scored {scorePercent}%, but you're not there yet. You need at least 70% to earn your certificate.
                </p>

                <p className="font-normal text-[16px] sm:text-[20px] text-[#5A5A5A] leading-relaxed max-w-[850px]">
                  Don't worry! You have unlimited attempts. Review the lessons and try again when you're ready.
                </p>
              </div>

              {/* Action Buttons (Figma node 112:21362) */}
              <div className="w-full max-w-[998px] flex flex-col gap-4 sm:gap-5 pt-3">
                <button
                  type="button"
                  onClick={handleRetakeQuiz}
                  className="w-full h-[44px] rounded-full bg-[#5A198F] hover:bg-[#471273] active:scale-[0.99] text-white font-bold text-[15px] sm:text-[16px] flex items-center justify-center shadow-md transition-all cursor-pointer flow-glow-pulse"
                >
                  Take The Quiz Again
                </button>

                <button
                  type="button"
                  onClick={handleStartReview}
                  className="w-full h-[44px] rounded-full border border-[#3B0454] hover:bg-purple-50 active:scale-[0.99] text-black font-bold text-[15px] sm:text-[16px] flex items-center justify-center transition-all cursor-pointer bg-transparent"
                >
                  Review Your Answers
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* CASE 2: RESULT SCREEN - PASS (SCORE >= 70%)                   */}
        {/* FIGMA DESIGN: node 112:21370 ("the quizscore successed")      */}
        {/* ------------------------------------------------------------- */}
        {isSubmitted && isPassed && !isReviewing && (
          <div className="relative w-full min-h-[780px] flex flex-col items-center pt-2 flow-scale-in">
            {/* Back Arrow Button */}
            <div className="w-full flex items-center justify-start pb-2">
              <button
                type="button"
                onClick={handleBackToCourses}
                className="w-[34px] h-[34px] rounded-full flex items-center justify-center text-[#22023C] hover:bg-black/5 transition-colors cursor-pointer"
                title="Back to Course"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
              </button>
            </div>

            {/* Floating Top Right Score Card (Figma node 112:21412: x=1157, y=112, w=259, h=230) */}
            <div className="w-full lg:absolute lg:top-4 lg:right-0 lg:w-[259px] flex justify-center mb-6 lg:mb-0 z-20">
              <div className="bg-[#F4F4F4] rounded-[36px] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] w-[259px] h-[230px] flex flex-col items-center justify-center px-6 text-center select-none border border-slate-100 flow-badge-pop">
                {/* Green Success Badge Icon */}
                <div className="size-[93px] rounded-full flex items-center justify-center mb-3">
                  <img
                    src="/images/quiz/pass-icon.png"
                    alt="Passed"
                    className="size-[93px] object-contain drop-shadow-sm"
                  />
                </div>

                {/* Score Text */}
                <p className="font-semibold text-[24px] text-black leading-none mb-2">
                  Your Score: {scorePercent}%
                </p>
                <p className="font-semibold text-[20px] text-[#6B7280] leading-none">
                  Passing Score: 70%
                </p>
              </div>
            </div>

            {/* Center Content Column (Figma node 112:21415: x=194, y=128, w=1053) */}
            <div className="w-full max-w-[1053px] mx-auto flex flex-col items-center text-center gap-6 z-10 pt-2 lg:pt-6">
              {/* Graduate Illustration */}
              <div className="w-full max-w-[440px] h-auto flex items-center justify-center">
                <img
                  src="/images/quiz/quiz-pass.jpg"
                  alt="Congratulations! You Passed!"
                  className="w-full max-h-[400px] object-contain rounded-[24px] flow-float-gentle drop-shadow-md"
                />
              </div>

              {/* Headings & Texts */}
              <div className="flex flex-col items-center gap-3 w-full">
                <h1 className="font-extrabold text-[36px] sm:text-[40px] text-black leading-[1.2] tracking-tight">
                  Congratulations! You Passed!
                </h1>

                <p className="font-medium text-[20px] sm:text-[24px] text-[#242424] leading-snug max-w-[950px]">
                  Amazing work! You've successfully passed the final quiz and completed the course. Your certificate is now ready to claim.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="w-full max-w-[996px] flex flex-col gap-4 sm:gap-5 pt-3">
                <button
                  type="button"
                  onClick={() => setShowCertificateModal(true)}
                  className="w-full h-[44px] rounded-full bg-[#5A198F] hover:bg-[#471273] active:scale-[0.99] text-white font-bold text-[15px] sm:text-[16px] flex items-center justify-center shadow-md transition-all cursor-pointer flow-glow-pulse"
                >
                  Get My Certificate
                </button>

                <button
                  type="button"
                  onClick={handleStartReview}
                  className="w-full h-[44px] rounded-full border border-[#5A198F] hover:bg-purple-50 active:scale-[0.99] text-black font-bold text-[15px] sm:text-[16px] flex items-center justify-center transition-all cursor-pointer bg-transparent"
                >
                  Review Your Answers
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* CASE 3: REVIEW ANSWERS - FAILED (SCORE < 70%)                 */}
        {/* FIGMA DESIGN: node 112:21517 ("review the quiz failed")       */}
        {/* ------------------------------------------------------------- */}
        {isSubmitted && !isPassed && isReviewing && (
          <div className="flex flex-col lg:flex-row items-start justify-between gap-8 lg:gap-12 w-full pt-4 flow-scale-in">
            {/* LEFT COLUMN: Question, Answers & Review Buttons (Figma node 112:21560) */}
            <div className="flex-1 w-full max-w-full lg:max-w-[996px] flex flex-col gap-8">
              <div className="flex flex-col gap-6 w-full">
                {/* Title (Figma node 112:21564) */}
                <h1 className="font-extrabold text-[36px] sm:text-[44px] lg:text-[48px] text-[#0F172A] leading-[1.2] tracking-[-1.2px]">
                  Master Data Analysis Quiz
                </h1>

                {/* Questions bar (Figma node 112:21565) */}
                <div className="flex flex-col gap-2 w-full">
                  <div className="flex items-center justify-between w-full text-[16px] font-medium text-[#3B0454]">
                    <span>You answered {answeredCount} / {MOCK_QUESTIONS.length}</span>
                    <span>{MOCK_QUESTIONS.length} questions</span>
                  </div>

                  {/* Gradient Progress Bar for Failed Review */}
                  <div className="bg-[#F4F0F8] border border-[#AE8FC8] h-[15px] rounded-full overflow-hidden w-full relative">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-[#804A8A] via-[#B91C1C] to-[#A70000] transition-all duration-300"
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                </div>

                {/* Question Text (Figma node 112:21573) */}
                <div className="pt-2">
                  <h2 className="font-medium text-[22px] sm:text-[24px] text-black leading-snug">
                    {currentQ.question}
                  </h2>
                </div>

                {/* Answers Options (Figma node 112:21574) */}
                <div className="flex flex-col gap-4 sm:gap-6 w-full pt-2">
                  {currentQ.options.map((opt) => {
                    const isSelected = selectedAnswers[currentQ.id] === opt.key;
                    const isCorrect = opt.key === currentQ.correctAnswer;
                    const isWrongSelection = isSelected && !isCorrect;

                    let optionClasses = 'bg-[#F2EEF6] border-2 border-transparent';

                    if (isCorrect) {
                      // Correct answer: green bg (Figma node 112:21577: bg-[#d8fdd1])
                      optionClasses = 'bg-[#D8FDD1] border-2 border-transparent';
                    } else if (isWrongSelection) {
                      // User's wrong answer: light red bg with dark red border (Figma node 112:21579: bg-[#fceae8] border-3 border-[#a70000])
                      optionClasses = 'bg-[#FCEAE8] border-[3px] border-[#A70000]';
                    }

                    return (
                      <div
                        key={opt.key}
                        className={`h-[70px] rounded-[36px] px-8 flex items-center justify-between transition-all select-none ${optionClasses}`}
                      >
                        <span className="font-normal text-[18px] sm:text-[20px] text-black leading-none">
                          {opt.key}. {opt.label}
                        </span>
                      </div>
                    );
                  })}
                </div>

                {/* Action Buttons for Failed Review (Figma node 112:21583) */}
                <div className="flex flex-col gap-4 sm:gap-6 w-full pt-6">
                  {/* Button 1: Take The Quiz Again (Figma node 112:21584) */}
                  <button
                    type="button"
                    onClick={handleRetakeQuiz}
                    className="w-full h-[39px] rounded-full bg-[#5A198F] hover:bg-[#471273] active:scale-[0.99] text-white font-bold text-[14px] flex items-center justify-center shadow-md transition-all cursor-pointer"
                  >
                    Take The Quiz Again
                  </button>

                  {/* Button 2: Back To The Courses (Figma node 112:21587) */}
                  <button
                    type="button"
                    onClick={handleBackToCourses}
                    className="w-full h-[39px] rounded-full border border-[#5A198F] hover:bg-purple-50 active:scale-[0.99] text-black font-bold text-[14px] flex items-center justify-center transition-all cursor-pointer bg-transparent"
                  >
                    Back To The Courses
                  </button>
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN: Big Score Card & Question Navigator Pills (Figma node 112:21590) */}
            <div className="w-full lg:w-[286px] flex flex-col gap-6 shrink-0">
              {/* Big Score Card (Figma node 112:21591) */}
              <div className="bg-[#F4F4F4] h-[230px] rounded-[36px] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] flex flex-col items-center justify-center px-4 text-center select-none border border-slate-100 flow-badge-pop">
                <div className="font-semibold text-[64px] text-black leading-none mb-3">
                  {scorePercent} %
                </div>
                <div className="font-normal text-[24px] text-[#888888] leading-none">
                  Your Score
                </div>
              </div>

              {/* Question Pills List (Figma node 112:21595) */}
              <div className="flex flex-col gap-4 sm:gap-5 w-full">
                {MOCK_QUESTIONS.map((q, idx) => {
                  const isCurrent = idx === currentQuestionIndex;
                  const isCorrect = selectedAnswers[q.id] === q.correctAnswer;
                  const paddedNum = (idx + 1).toString().padStart(2, '0');

                  // Figma styles for Failed Review Pills:
                  // Correct pill: bg-[#d8fdd1], badge bg-[#ecffe8] border-[#116701]
                  // Wrong pill: bg-[#fceae8], badge bg-[#fdf7f6] border-[#a70000]
                  // Active pill gets a 2px colored border
                  let pillBg = 'bg-[#FCEAE8]';
                  let pillBorder = isCurrent ? 'border-2 border-[#A70000]' : 'border-2 border-transparent';
                  let badgeBg = 'bg-[#FDF7F6] border border-[#A70000]';

                  if (isCorrect) {
                    pillBg = 'bg-[#D8FDD1]';
                    pillBorder = isCurrent ? 'border-2 border-[#116701]' : 'border-2 border-transparent';
                    badgeBg = 'bg-[#ECFFE8] border border-[#116701]';
                  }

                  return (
                    <div
                      key={q.id}
                      onClick={() => setCurrentQuestionIndex(idx)}
                      className={`${pillBg} ${pillBorder} h-[62px] sm:h-[70px] rounded-[36px] px-6 sm:px-7 flex items-center gap-3 transition-all cursor-pointer select-none`}
                      title={`Go to Question ${idx + 1}`}
                    >
                      <div className={`size-[26px] ${badgeBg} rounded-[6px] flex items-center justify-center shrink-0`}>
                        <span className="font-semibold text-[12px] text-black tracking-wide">
                          {paddedNum}
                        </span>
                      </div>
                      <span className="font-medium text-[18px] sm:text-[20px] text-black truncate">
                        Question {idx + 1}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* CASE 4: REVIEW ANSWERS - PASSED (SCORE >= 70%)                */}
        {/* FIGMA DESIGN: node 112:21662 ("review the quiz passed")       */}
        {/* ------------------------------------------------------------- */}
        {isSubmitted && isPassed && isReviewing && (
          <div className="flex flex-col lg:flex-row items-start justify-between gap-8 lg:gap-12 w-full pt-4 flow-scale-in">
            {/* LEFT COLUMN: Question, Answers & Take Your Certificate Button (Figma node 112:21705) */}
            <div className="flex-1 w-full max-w-full lg:max-w-[993px] flex flex-col gap-8">
              <div className="flex flex-col gap-6 w-full">
                {/* Title (Figma node 112:21709) */}
                <h1 className="font-extrabold text-[36px] sm:text-[44px] lg:text-[48px] text-[#0F172A] leading-[1.2] tracking-[-1.2px]">
                  Master Data Analysis Quiz
                </h1>

                {/* Questions bar (Figma node 112:21710) */}
                <div className="flex flex-col gap-2 w-full">
                  <div className="flex items-center justify-between w-full text-[16px] font-medium text-[#3B0454]">
                    <span>You answered {answeredCount} / {MOCK_QUESTIONS.length}</span>
                    <span>{MOCK_QUESTIONS.length} questions</span>
                  </div>

                  {/* Gradient Progress Bar for Passed Review */}
                  <div className="bg-[#F4F0F8] border border-[#AE8FC8] h-[15px] rounded-full overflow-hidden w-full relative">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-[#4ADE80] to-[#16A34A] transition-all duration-300"
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                </div>

                {/* Question Text (Figma node 112:21718) */}
                <div className="pt-2">
                  <h2 className="font-medium text-[22px] sm:text-[24px] text-black leading-snug">
                    {currentQ.question}
                  </h2>
                </div>

                {/* Answers Options (Figma node 112:21719) */}
                <div className="flex flex-col gap-4 sm:gap-6 w-full pt-2">
                  {currentQ.options.map((opt) => {
                    const isSelected = selectedAnswers[currentQ.id] === opt.key;
                    const isCorrect = opt.key === currentQ.correctAnswer;
                    const isWrongSelection = isSelected && !isCorrect;

                    let optionClasses = 'bg-[#F2EEF6] border-2 border-transparent';

                    if (isCorrect) {
                      // Correct option: green bg with dark green border (Figma node 112:21722: bg-[#d8fdd1] border-2 border-[#2a5223])
                      optionClasses = 'bg-[#D8FDD1] border-2 border-[#2A5223]';
                    } else if (isWrongSelection) {
                      // Wrong selection if any: light red
                      optionClasses = 'bg-[#FCEAE8] border-2 border-[#A70000]';
                    }

                    return (
                      <div
                        key={opt.key}
                        className={`h-[70px] rounded-[36px] px-8 flex items-center justify-between transition-all select-none ${optionClasses}`}
                      >
                        <span className="font-normal text-[18px] sm:text-[20px] text-black leading-none">
                          {opt.key}. {opt.label}
                        </span>
                      </div>
                    );
                  })}
                </div>

                {/* Action Button for Passed Review (Figma node 112:21728) */}
                <div className="w-full pt-6">
                  {/* Take Your Certificate Button */}
                  <button
                    type="button"
                    onClick={() => setShowCertificateModal(true)}
                    className="w-full h-[39px] rounded-full bg-[#5A198F] hover:bg-[#471273] active:scale-[0.99] text-white font-bold text-[14px] flex items-center justify-center shadow-md transition-all cursor-pointer flow-glow-pulse"
                  >
                    Take Your Certificate
                  </button>
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN: Big Score Card & Question Navigator Pills (Figma node 112:21731) */}
            <div className="w-full lg:w-[286px] flex flex-col gap-6 shrink-0">
              {/* Big Score Card (Figma node 112:21732) */}
              <div className="bg-[#F4F4F4] h-[230px] rounded-[36px] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] flex flex-col items-center justify-center px-4 text-center select-none border border-slate-100 flow-badge-pop">
                <div className="font-semibold text-[64px] text-black leading-none mb-3">
                  {scorePercent} %
                </div>
                <div className="font-normal text-[24px] text-[#888888] leading-none">
                  Your Score
                </div>
              </div>

              {/* Question Pills List (Figma node 112:21736) */}
              <div className="flex flex-col gap-4 sm:gap-5 w-full">
                {MOCK_QUESTIONS.map((q, idx) => {
                  const isCurrent = idx === currentQuestionIndex;
                  const isCorrect = selectedAnswers[q.id] === q.correctAnswer;
                  const paddedNum = (idx + 1).toString().padStart(2, '0');

                  let pillBg = 'bg-[#D8FDD1]';
                  let pillBorder = isCurrent ? 'border-2 border-[#2A5223]' : 'border-2 border-transparent';
                  let badgeBg = 'bg-[#ECFFE8] border border-[#116701]';

                  if (!isCorrect && selectedAnswers[q.id] !== undefined) {
                    pillBg = 'bg-[#FCEAE8]';
                    pillBorder = isCurrent ? 'border-2 border-[#A70000]' : 'border-2 border-transparent';
                    badgeBg = 'bg-[#FDF7F6] border border-[#A70000]';
                  }

                  return (
                    <div
                      key={q.id}
                      onClick={() => setCurrentQuestionIndex(idx)}
                      className={`${pillBg} ${pillBorder} h-[62px] sm:h-[70px] rounded-[36px] px-6 sm:px-7 flex items-center gap-3 transition-all cursor-pointer select-none`}
                      title={`Go to Question ${idx + 1}`}
                    >
                      <div className={`size-[26px] ${badgeBg} rounded-[6px] flex items-center justify-center shrink-0`}>
                        <span className="font-semibold text-[12px] text-black tracking-wide">
                          {paddedNum}
                        </span>
                      </div>
                      <span className="font-medium text-[18px] sm:text-[20px] text-black truncate">
                        Question {idx + 1}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* CASE 5: QUIZ IN PROGRESS                                      */}
        {/* FIGMA DESIGN: node 112:12876                                  */}
        {/* ------------------------------------------------------------- */}
        {!isSubmitted && (
          <div className="flex flex-col lg:flex-row items-start justify-between gap-8 lg:gap-12 w-full pt-4">
            {/* LEFT COLUMN: Quiz Question & Answers (Figma node 112:12923) */}
            <div className="flex-1 w-full max-w-full lg:max-w-[1048px] flex flex-col gap-8">
              <div className="flex flex-col gap-6 w-full">
                {/* Title (Figma node 112:12928) */}
                <h1 className="font-extrabold text-[36px] sm:text-[44px] lg:text-[48px] text-[#0F172A] leading-[1.2] tracking-[-1.2px]">
                  Master Data Analysis Quiz
                </h1>

                {/* Progress Bar Row (Figma node 112:12929) */}
                <div className="flex flex-col gap-2 w-full">
                  <div className="flex items-center justify-between w-full text-[16px] font-medium text-[#3B0454]">
                    <span>You answered {answeredCount} / {MOCK_QUESTIONS.length}</span>
                    <span>{MOCK_QUESTIONS.length} questions</span>
                  </div>

                  <div className="bg-[#F4F0F8] border border-[#AE8FC8] h-[15px] rounded-full overflow-hidden w-full relative">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-[#3B0454] to-[#804A8A] flow-progress-bar"
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                </div>

                {/* Animated Question & Answers Block */}
                <div key={currentQuestionIndex} className="flow-question-in flex flex-col gap-6 w-full">
                  {/* Question Text (Figma node 112:12937) */}
                  <div className="pt-2">
                    <h2 className="font-medium text-[22px] sm:text-[24px] text-black leading-snug">
                      {currentQuestionIndex + 1}. {currentQ.question}
                    </h2>
                  </div>

                  {/* Answers Options (Figma node 112:12938) */}
                  <div className="flex flex-col gap-4 sm:gap-5 w-full">
                    {currentQ.options.map((opt) => {
                      const isSelected = selectedAnswers[currentQ.id] === opt.key;

                      return (
                        <div
                          key={opt.key}
                          onClick={() => handleSelectOption(opt.key)}
                          className={`h-[68px] sm:h-[70px] rounded-[36px] px-6 sm:px-8 flex items-center transition-all cursor-pointer select-none ${
                            isSelected
                              ? 'bg-[#E4DAED] border-2 border-[#3A0353] shadow-xs scale-[1.005]'
                              : 'bg-[#F2EEF6] hover:bg-[#EAE2F2]/60 hover:scale-[1.003] border-2 border-transparent'
                          }`}
                        >
                          <span className="font-normal text-[18px] sm:text-[20px] text-black leading-none">
                            {opt.key}. {opt.label}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Action Buttons: Previous & Next/Submit (Figma node 112:12947) */}
                <div className="flex items-center justify-end gap-5 pt-3">
                  <button
                    type="button"
                    onClick={handlePrevious}
                    disabled={currentQuestionIndex === 0}
                    className="w-[150px] h-[39px] rounded-full border border-[#5A198F] text-[#5A198F] font-bold text-[14px] flex items-center justify-center hover:bg-purple-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer"
                  >
                    Previous
                  </button>

                  <button
                    type="button"
                    onClick={handleNext}
                    className="w-[150px] h-[39px] rounded-full bg-[#5A198F] hover:bg-[#471273] active:scale-95 text-white font-bold text-[14px] flex items-center justify-center shadow-md transition-all cursor-pointer"
                  >
                    {currentQuestionIndex === MOCK_QUESTIONS.length - 1 ? 'Submit' : 'Next'}
                  </button>
                </div>

                {/* Footer Rules & Instructions (Figma node 112:12954) */}
                <div className="font-normal text-[16px] sm:text-[18px] text-[#6F6E70] pt-4">
                  <ul className="list-disc pl-6 space-y-1">
                    <li>Passing Score: You must achieve at least 70% to earn your certificate.</li>
                    <li>Unlimited Attempts: You can retake the quiz as many times as needed until you pass.</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN: Question Navigator Pills (Figma node 112:12955) */}
            <div className="w-full lg:w-[286px] flex flex-col gap-4 shrink-0">
              <div className="flex flex-col gap-3.5 w-full">
                {MOCK_QUESTIONS.map((q, idx) => {
                  const isCurrent = idx === currentQuestionIndex;
                  const isAnswered = selectedAnswers[q.id] !== undefined;
                  const paddedNum = (idx + 1).toString().padStart(2, '0');

                  let pillBg = 'bg-[#E2E2E2] hover:bg-[#d6d6d6]';
                  let textColor = 'text-black';

                  if (isCurrent) {
                    pillBg = 'bg-[#5A198F] shadow-sm';
                    textColor = 'text-white';
                  } else if (isAnswered) {
                    pillBg = 'bg-[#D8FDD1] hover:bg-[#c9f9c0]';
                    textColor = 'text-black';
                  }

                  return (
                    <div
                      key={q.id}
                      onClick={() => setCurrentQuestionIndex(idx)}
                      className={`${pillBg} h-[58px] sm:h-[62px] rounded-[36px] px-5 sm:px-6 flex items-center gap-3 transition-all cursor-pointer select-none group`}
                      title={`Go to Question ${idx + 1}`}
                    >
                      <div className="size-[26px] bg-[#F4F0F8] border border-[#AE8FC8] rounded-[6px] flex items-center justify-center shrink-0">
                        <span className="font-semibold text-[12px] text-black tracking-wide">
                          {paddedNum}
                        </span>
                      </div>
                      <span className={`font-medium text-[18px] sm:text-[20px] ${textColor} truncate`}>
                        Question {idx + 1}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ------------------------------------------------------------- */}
      {/* CERTIFICATE MODAL (When clicking "Get My Certificate" or       */}
      {/* "Take Your Certificate")                                      */}
      {/* ------------------------------------------------------------- */}
      {showCertificateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-[28px] max-w-[660px] w-full p-6 sm:p-8 shadow-2xl border border-purple-100 flex flex-col items-center gap-6 text-center flow-scale-in relative">
            <button
              type="button"
              onClick={() => setShowCertificateModal(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer text-xl"
            >
              ✕
            </button>

            <div className="flex flex-col gap-1 items-center">
              <span className="text-xs font-bold text-[#5A198F] uppercase tracking-widest">
                Certificate of Completion
              </span>
              <h2 className="text-[28px] sm:text-[32px] font-extrabold text-[#0F172A]">
                Official Graduation Credential
              </h2>
            </div>

            {/* Certificate Preview Card */}
            <div className="w-full bg-gradient-to-br from-[#22023C] via-[#3B0454] to-[#5A198F] rounded-[24px] p-8 text-white flex flex-col items-center gap-4 shadow-2xl border-4 border-amber-300/40 relative overflow-hidden">
              <div className="size-16 rounded-full bg-amber-400/20 border-2 border-amber-300 flex items-center justify-center text-3xl shadow-inner">
                🎓
              </div>

              <div className="flex flex-col gap-1">
                <span className="text-[12px] font-bold uppercase tracking-widest text-amber-300">
                  Interns HUB Academy
                </span>
                <p className="text-xs text-purple-200">This certifies that</p>
                <h3 className="text-[28px] font-extrabold tracking-tight text-white">
                  Maya Johnson
                </h3>
                <p className="text-xs text-purple-200 max-w-[380px] mx-auto">
                  has demonstrated verified mastery and passed the final evaluation in
                </p>
                <span className="text-base font-bold text-amber-200 mt-1">
                  Data Analysis Fundamentals
                </span>
              </div>

              <div className="w-full border-t border-white/20 pt-4 mt-2 flex items-center justify-between text-[11px] text-purple-200">
                <div className="flex flex-col items-start">
                  <span className="font-semibold text-white">Credential ID:</span>
                  <span>#IH-2026-9842</span>
                </div>
                <div className="flex flex-col items-end">
                  <span className="font-semibold text-white">Issued:</span>
                  <span>October 2026</span>
                </div>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex flex-wrap items-center justify-center gap-4 w-full pt-2">
              <button
                type="button"
                onClick={() => {
                  showToast('📄 Maya_Johnson_Certificate.pdf downloaded successfully!');
                  setShowCertificateModal(false);
                }}
                className="px-7 py-3 rounded-full bg-[#5A198F] hover:bg-[#471273] active:scale-95 text-white font-bold text-sm shadow-md transition-all cursor-pointer flex items-center gap-2"
              >
                <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Download Certificate (PDF)
              </button>

              <button
                type="button"
                onClick={() => {
                  navigate(`/courses/${courseId}?enrolled=true`);
                }}
                className="px-6 py-3 rounded-full border border-slate-300 text-slate-700 hover:bg-slate-50 font-semibold text-sm transition-colors cursor-pointer"
              >
                Return to Course
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CourseQuizPage;


