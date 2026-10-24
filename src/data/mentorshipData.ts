import type { Mentor, MentorshipBalance, MentorshipSession } from '@/types/mentorship';

export const INITIAL_MENTORS: Mentor[] = [
  {
    id: 'aisha-patel',
    name: 'Dr. Aisha Patel',
    role: 'Senior Product Manager, Google • Ex-Frontend Architect',
    companySubtitle: 'Senior Product Manager, Google / Ex-Frontend Architect',
    tracks: ['Frontend Development', 'Full Stack'],
    status: 'Available Slots',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400',
    description:
      'Specializes in React component systems, career progression for junior engineers, and rigorous technical interview preparation.',
    about:
      'Dr. Patel brings 10+ years of engineering and technical product leadership experience. She guides EdTech fellows through frontend architecture, real-world project delivery, and career navigation.',
    expertise: [
      'React',
      'TypeScript',
      'Next.js',
      'Design Systems',
      'Web Performance',
      'Architecture',
    ],
    profiles: {
      linkedin: 'https://linkedin.com',
      github: 'https://github.com',
      portfolio: 'https://aishapatel.dev',
    },
    nextAvailable: 'Wed, 4:30 PM (45 min)',
    slots: [
      {
        id: 'slot-1',
        date: 'Wednesday, Oct 1, 2026',
        time: '4:30 PM – 5:15 PM',
        duration: '45 min',
        isoDateTime: '2026-10-01T16:30:00',
      },
      {
        id: 'slot-2',
        date: 'Thursday, Oct 2, 2026',
        time: '2:00 PM – 2:45 PM',
        duration: '45 min',
        isoDateTime: '2026-10-02T14:00:00',
      },
      {
        id: 'slot-3',
        date: 'Monday, Oct 6, 2026',
        time: '5:00 PM – 5:45 PM',
        duration: '45 min',
        isoDateTime: '2026-10-06T17:00:00',
      },
    ],
  },
  {
    id: 'marcus-vance',
    name: 'Marcus Vance',
    role: 'Staff Engineer, Vercel • Next.js Core Contributor',
    companySubtitle: 'Staff Engineer, Vercel • Next.js Core Contributor',
    tracks: ['Frontend Development'],
    status: 'Available Slots',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400',
    description:
      'Focuses on Next.js, web performance, CSS architecture, and navigating technical internship projects from conception to production.',
    about:
      'Marcus has built high-scale frontend systems at Vercel and mentored hundreds of developers transitioning into production engineering.',
    expertise: ['Next.js', 'React Server Components', 'CSS Architecture', 'Web Vitals', 'Tailwind CSS'],
    profiles: {
      linkedin: 'https://linkedin.com',
      github: 'https://github.com',
    },
    nextAvailable: 'Thu, 2:00 PM (45 min)',
    slots: [
      {
        id: 'slot-mv-1',
        date: 'Thursday, Oct 2, 2026',
        time: '2:00 PM – 2:45 PM',
        duration: '45 min',
        isoDateTime: '2026-10-02T14:00:00',
      },
      {
        id: 'slot-mv-2',
        date: 'Monday, Oct 6, 2026',
        time: '5:00 PM – 5:45 PM',
        duration: '45 min',
        isoDateTime: '2026-10-06T17:00:00',
      },
    ],
  },
  {
    id: 'elena-rostova',
    name: 'Elena Rostova',
    role: 'Principal UI/UX Engineer, Stripe • Design Systems Lead',
    companySubtitle: 'Principal UI/UX Engineer, Stripe • Design Systems Lead',
    tracks: ['Frontend Development'],
    status: 'No available slots',
    avatarUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=400',
    description:
      'Design systems, accessibility (a11y), and building intuitive interfaces with modern TypeScript. Currently guiding enterprise UX patterns.',
    about:
      'Elena leads design system infrastructure and accessibility governance, bridging product design and robust component architectures.',
    expertise: ['Design Systems', 'Accessibility (a11y)', 'TypeScript', 'Radix UI', 'Figma Tokens'],
    profiles: {
      linkedin: 'https://linkedin.com',
      portfolio: 'https://rostova.design',
    },
    nextAvailable: 'Check again later (45 min)',
    slots: [],
  },
];

export const INITIAL_SESSIONS: MentorshipSession[] = [
  {
    id: 'session-1',
    sessionNumber: 1,
    mentorId: 'marcus-vance',
    mentorName: 'Marcus Vance',
    mentorRole: 'Staff Engineer',
    mentorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400',
    month: 'OCT',
    day: '1',
    fullDate: 'Monday, Oct 1',
    time: '5:00 PM – 5:45 PM',
    duration: '45 mins',
    topic: 'Topic: System Architecture & Career Guidance',
    subtopic: 'Architecture & modularization focus',
    status: 'Upcoming',
    meetingLink: 'https://meet.google.com/abc-defg-hij',
    isStartingSoon: false,
  },
  {
    id: 'session-2',
    sessionNumber: 2,
    mentorId: 'marcus-vance',
    mentorName: 'Marcus Vance',
    mentorRole: 'Staff Engineer',
    mentorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400',
    month: 'OCT',
    day: '6',
    fullDate: 'Monday, Oct 6',
    time: '5:00 PM – 5:45 PM',
    duration: '45 mins',
    topic: 'Topic: System Architecture & Career Guidance',
    subtopic: 'Code Review & Performance Tuning',
    status: 'Upcoming',
    meetingLink: 'https://meet.google.com/uvw-xyza-bcd',
    isStartingSoon: false,
  },
];

export const INITIAL_BALANCE: MentorshipBalance = {
  total: 6,
  completed: 2,
  remaining: 4,
  packageName: '6-Month Package',
  active: true,
};
