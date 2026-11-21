
export type Candidate = {
  id: number;
  name: string;
  role: string;
  track: string;
  score: number;
  availability: string;
  experience: string;
  initials: string;
  color: string;
  email: string;
  about: string;
  skills: string[];
  education: string;
  status: string;
};

export const candidates: Candidate[] = [
  {
    id: 1,
    name: 'Merna Adel',
    role: 'UI/UX Designer',
    track: 'UI/UX Design',
    score: 87,
    availability: 'Immediately',
    experience: '3 years',
    initials: 'MA',
    color: 'bg-[#561D86] text-white',
    email: 'merna.adel@example.com',
    about:
      'UI/UX designer focused on creating intuitive digital experiences and user-centered interfaces.',
    skills: ['UI Design', 'UX Research', 'Figma', 'Prototyping'],
    education: 'Design',
    status: 'Saved',
  },
  {
    id: 2,
    name: 'Ahmed Hassan',
    role: 'Frontend Developer',
    track: 'Frontend Development',
    score: 91,
    availability: 'Nov 2024',
    experience: '4 years',
    initials: 'AH',
    color: 'bg-[#63C7E8] text-[#14344A]',
    email: 'ahmed.hassan@example.com',
    about:
      'Frontend developer experienced in building responsive and accessible web applications.',
    skills: ['React', 'TypeScript', 'JavaScript', 'CSS'],
    education: 'Computer Science',
    status: 'Saved',
  },
  {
    id: 3,
    name: 'Sara Khalil',
    role: 'Data Analyst',
    track: 'Data Science',
    score: 85,
    availability: 'Immediately',
    experience: '2 years',
    initials: 'SK',
    color: 'bg-[#176B4D] text-white',
    email: 'sara.khalil@example.com',
    about:
      'Data analyst who turns complex datasets into useful business insights.',
    skills: ['SQL', 'Python', 'Excel', 'Power BI'],
    education: 'Statistics',
    status: 'Available',
  },
  {
    id: 4,
    name: 'Omar Youssef',
    role: 'React Developer',
    track: 'Frontend Development',
    score: 88,
    availability: 'Dec 2024',
    experience: '3 years',
    initials: 'OY',
    color: 'bg-[#F39A45] text-[#4B2608]',
    email: 'omar.youssef@example.com',
    about:
      'React developer focused on reusable components and performant user interfaces.',
    skills: ['React', 'Redux', 'TypeScript', 'REST APIs'],
    education: 'Computer Science',
    status: 'Saved',
  },
  {
    id: 5,
    name: 'Nour Ibrahim',
    role: 'Product Designer',
    track: 'UI/UX Design',
    score: 83,
    availability: 'Immediately',
    experience: '2 years',
    initials: 'NI',
    color: 'bg-[#7770D9] text-white',
    email: 'nour.ibrahim@example.com',
    about:
      'Product designer passionate about solving user problems through thoughtful design.',
    skills: ['Product Design', 'Figma', 'Wireframing', 'Prototyping'],
    education: 'Product Design',
    status: 'Available',
  },
];

const SHORTLIST_KEY = 'employer-shortlist';
const DEFAULT_SHORTLIST = [1, 2, 4];

export function getShortlist(): number[] {
  if (typeof window === 'undefined') {
    return [...DEFAULT_SHORTLIST];
  }

  try {
    const stored = localStorage.getItem(SHORTLIST_KEY);

    if (stored === null) {
      return [...DEFAULT_SHORTLIST];
    }

    const parsed: unknown = JSON.parse(stored);

    if (
      Array.isArray(parsed) &&
      parsed.every(
        (id): id is number =>
          typeof id === 'number' &&
          candidates.some((candidate) => candidate.id === id)
      )
    ) {
      return parsed;
    }

    return [...DEFAULT_SHORTLIST];
  } catch {
    return [...DEFAULT_SHORTLIST];
  }
}

export function saveShortlist(ids: number[]) {
  if (typeof window === 'undefined') return;

  try {
    localStorage.setItem(
      SHORTLIST_KEY,
      JSON.stringify(ids)
    );
  } catch {
    // Local storage may be unavailable.
  }
}
