// Mock content for the Internship page. Replace with API data once the backend is available.
// Visible text lives in the locale files under `internshipPage`; entries here hold the ids that pick it.
import trackFrontend from '@/assets/internship/track-frontend.webp'
import trackProduct from '@/assets/internship/track-product.webp'
import trackUiux from '@/assets/internship/track-uiux.webp'
import trackUiux2 from '@/assets/internship/track-uiux-2.webp'
import testimonialJason from '@/assets/internship/testimonial-jason.webp'
import testimonialLina from '@/assets/internship/testimonial-lina.webp'
import testimonialPriya from '@/assets/internship/testimonial-priya.webp'

export type TrackCategory = 'frontend' | 'backend' | 'mobile' | 'data' | 'design' | 'product'

export type TrackFilter = 'all' | 'frontend' | 'backend' | 'mobile' | 'data'

export type TrackLevel = 'beginner' | 'intermediate' | 'advanced'

// Key under internshipPage.tracks.items holding the track's title, tag and instructor.
export type TrackContentKey = 'designSystems' | 'react' | 'agile'

export interface Track {
  id: string
  contentKey: TrackContentKey
  category: TrackCategory
  image: string
  rating: number
  reviewCount: number
  hours: number
  level: TrackLevel
  lessons: number
  extraMembers: number
}

// Key under internshipPage.steps.
export type ProgramStepId = 'signup' | 'interview' | 'squad' | 'certify'

export interface ProgramStep {
  id: ProgramStepId
}

// Key under internshipPage.testimonials.items.
export type TestimonialId = 'lina' | 'jason' | 'priya'

export interface Testimonial {
  id: TestimonialId
  avatar: string
  rating: number
}

// Key under internshipPage.faq.items.
export type FaqItemId = 'whoCanJoin' | 'uploadCv' | 'aiInterview' | 'whenPay' | 'packageStart' | 'certificates'

export interface FaqItem {
  id: FaqItemId
}

export const TRACK_FILTERS: ReadonlyArray<TrackFilter> = ['all', 'frontend', 'backend', 'mobile', 'data']

const DESIGN_TRACK_ROW: ReadonlyArray<Omit<Track, 'id'>> = [
  {
    contentKey: 'designSystems',
    category: 'design',
    image: trackUiux,
    rating: 4.7,
    reviewCount: 1802,
    hours: 22,
    level: 'advanced',
    lessons: 40,
    extraMembers: 6,
  },
  {
    contentKey: 'react',
    category: 'frontend',
    image: trackFrontend,
    rating: 4.8,
    reviewCount: 3012,
    hours: 25,
    level: 'advanced',
    lessons: 50,
    extraMembers: 7,
  },
  {
    contentKey: 'designSystems',
    category: 'design',
    image: trackUiux2,
    rating: 4.7,
    reviewCount: 1802,
    hours: 22,
    level: 'advanced',
    lessons: 40,
    extraMembers: 6,
  },
  {
    contentKey: 'agile',
    category: 'product',
    image: trackProduct,
    rating: 4.9,
    reviewCount: 2134,
    hours: 18,
    level: 'intermediate',
    lessons: 35,
    extraMembers: 4,
  },
]

// The Figma frame repeats the same row of four cards twice.
export const TRACKS: ReadonlyArray<Track> = [0, 1].flatMap((row) =>
  DESIGN_TRACK_ROW.map((track, index) => ({ ...track, id: `track-${row}-${index}` })),
)

export const PROGRAM_STEPS: ReadonlyArray<ProgramStep> = [
  { id: 'signup' },
  { id: 'interview' },
  { id: 'squad' },
  { id: 'certify' },
]

export const TESTIMONIALS: ReadonlyArray<Testimonial> = [
  { id: 'lina', avatar: testimonialLina, rating: 4 },
  { id: 'jason', avatar: testimonialJason, rating: 5 },
  { id: 'priya', avatar: testimonialPriya, rating: 5 },
]

// Only the first answer is defined in Figma; the others are placeholders based on the page copy
// and must be confirmed by the content owner.
export const FAQ_ITEMS: ReadonlyArray<FaqItem> = [
  { id: 'whoCanJoin' },
  { id: 'uploadCv' },
  { id: 'aiInterview' },
  { id: 'whenPay' },
  { id: 'packageStart' },
  { id: 'certificates' },
]
