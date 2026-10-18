// Mock content for the Internship page. Replace with API data once the backend is available.
import trackFrontend from '../../assets/internship/track-frontend.jpg'
import trackProduct from '../../assets/internship/track-product.jpg'
import trackUiux from '../../assets/internship/track-uiux.jpg'
import trackUiux2 from '../../assets/internship/track-uiux-2.jpg'
import testimonialJason from '../../assets/internship/testimonial-jason.jpg'
import testimonialLina from '../../assets/internship/testimonial-lina.jpg'
import testimonialPriya from '../../assets/internship/testimonial-priya.jpg'

export type TrackCategory = 'frontend' | 'backend' | 'mobile' | 'data' | 'design' | 'product'

export type TrackFilter = 'all' | 'frontend' | 'backend' | 'mobile' | 'data'

export type TrackLevel = 'Beginner' | 'Intermediate' | 'Advanced'

export interface Track {
  id: string
  title: string
  tag: string
  category: TrackCategory
  image: string
  instructor: string
  rating: number
  reviewCount: number
  hours: number
  level: TrackLevel
  lessons: number
  extraMembers: number
}

export interface ProgramStep {
  title: string
  description: string
}

export interface Testimonial {
  id: string
  quote: string
  name: string
  role: string
  avatar: string
  rating: number
}

export interface FaqItem {
  id: string
  question: string
  answer: string
}

export const TRACK_FILTERS: ReadonlyArray<{ value: TrackFilter; label: string }> = [
  { value: 'all', label: 'All' },
  { value: 'frontend', label: 'Frontend' },
  { value: 'backend', label: 'Backend' },
  { value: 'mobile', label: 'Mobile' },
  { value: 'data', label: 'Data' },
]

const DESIGN_TRACK_ROW: ReadonlyArray<Omit<Track, 'id'>> = [
  {
    title: 'Advanced Design Systems & Component Libraries',
    tag: 'UI/UX Design',
    category: 'design',
    image: trackUiux,
    instructor: 'Senior Alaa Khamis',
    rating: 4.7,
    reviewCount: 1802,
    hours: 22,
    level: 'Advanced',
    lessons: 40,
    extraMembers: 6,
  },
  {
    title: 'React & Redux: From Basics to Advanced',
    tag: 'Frontend Development',
    category: 'frontend',
    image: trackFrontend,
    instructor: 'Instructor Mia Chen',
    rating: 4.8,
    reviewCount: 3012,
    hours: 25,
    level: 'Advanced',
    lessons: 50,
    extraMembers: 7,
  },
  {
    title: 'Advanced Design Systems & Component Libraries',
    tag: 'UI/UX Design',
    category: 'design',
    image: trackUiux2,
    instructor: 'Senior Alaa Khamis',
    rating: 4.7,
    reviewCount: 1802,
    hours: 22,
    level: 'Advanced',
    lessons: 40,
    extraMembers: 6,
  },
  {
    title: 'Mastering Agile & Lean Methodologies',
    tag: 'Product Management',
    category: 'product',
    image: trackProduct,
    instructor: 'Lead Jordan Smith',
    rating: 4.9,
    reviewCount: 2134,
    hours: 18,
    level: 'Intermediate',
    lessons: 35,
    extraMembers: 4,
  },
]

// The Figma frame repeats the same row of four cards twice.
export const TRACKS: ReadonlyArray<Track> = [0, 1].flatMap((row) =>
  DESIGN_TRACK_ROW.map((track, index) => ({ ...track, id: `track-${row}-${index}` })),
)

export const PROGRAM_STEPS: ReadonlyArray<ProgramStep> = [
  {
    title: 'Sign Up & CV',
    description: 'Verify email & phone, upload your CV, pick package and track.',
  },
  {
    title: 'AI Interview',
    description: 'Desktop only: camera, mic and screen share. Level set by AI.',
  },
  {
    title: 'Pay & Join a Squad',
    description: 'Pay after your result. Squad starts when full, led by a Senior.',
  },
  {
    title: 'Sprint & Certify',
    description: 'Weekly sprints, Senior-approved PRs, then a verifiable certificate.',
  },
]

export const TESTIMONIALS: ReadonlyArray<Testimonial> = [
  {
    id: 'lina',
    quote:
      'The internship gave me hands-on experience with live projects, which made learning much more engaging and practical.',
    name: 'Lina S.',
    role: 'Marketing Intern',
    avatar: testimonialLina,
    rating: 4,
  },
  {
    id: 'jason',
    quote:
      'I appreciated the mentorship from senior staff; their guidance helped me grow both technically and professionally.',
    name: 'Jason M.',
    role: 'Software Engineering Intern',
    avatar: testimonialJason,
    rating: 5,
  },
  {
    id: 'priya',
    quote:
      'The team was welcoming and inclusive, creating an environment where I felt comfortable asking questions and contributing ideas.',
    name: 'Priya K.',
    role: 'Design Intern',
    avatar: testimonialPriya,
    rating: 5,
  },
]

// Only the first answer is defined in Figma; the others are placeholders based on the page copy
// and must be confirmed by the content owner.
export const FAQ_ITEMS: ReadonlyArray<FaqItem> = [
  {
    id: 'who-can-join',
    question: 'Who can join InternsHub?',
    answer:
      'Anyone aged 18 or older. Verify your email and phone, upload your CV, and choose a package and a track.',
  },
  {
    id: 'upload-cv',
    question: 'Do I need to upload a CV?',
    answer: 'Yes. Uploading your CV is part of the sign-up step, before you pick your package and track.',
  },
  {
    id: 'ai-interview',
    question: 'How does the AI interview work?',
    answer:
      'The interview runs on desktop only and uses your camera, microphone and screen share. Your level is set by AI.',
  },
  {
    id: 'when-pay',
    question: 'When do I pay?',
    answer: 'You pay after you receive your interview result.',
  },
  {
    id: 'package-start',
    question: 'When does my package time start?',
    answer: 'Your squad starts once it is full, led by a Senior Team Leader.',
  },
  {
    id: 'certificates',
    question: 'Which certificates will I get?',
    answer: 'After your weekly sprints and Senior-approved PRs, you receive a verifiable certificate.',
  },
]
