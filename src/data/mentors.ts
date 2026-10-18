export interface Mentor {
  id: string
  nameKey: string
  nameEn: string
  nameAr: string
  roleEn: string
  roleAr: string
  company: string
  yearsExperience: number
  sessions: number
  rating: number
  image: string
  tags: string[]
}

export const mentors: Mentor[] = [
  {
    id: 'nadia-meazz',
    nameKey: 'nadia',
    nameEn: 'Nadia Meazz',
    nameAr: 'نادية معز',
    roleEn: 'Senior Product Designer',
    roleAr: 'كبير مصممي المنتجات',
    company: 'Stripe',
    yearsExperience: 10,
    sessions: 420,
    rating: 4.95,
    image: '/images/mentor-nadia.jpg',
    tags: ['UI/UX', 'Product Design', 'Figma'],
  },
  {
    id: 'ahmed-adel',
    nameKey: 'ahmed',
    nameEn: 'Ahmed Adel',
    nameAr: 'أحمد عادل',
    roleEn: 'Lead Software Engineer',
    roleAr: 'مهندس برمجيات رئيسي',
    company: 'Careem',
    yearsExperience: 8,
    sessions: 510,
    rating: 5.0,
    image: '/images/mentor-ahmed.jpg',
    tags: ['Frontend', 'TypeScript', 'System Design'],
  },
  {
    id: 'sarah-jenkins',
    nameKey: 'sarah',
    nameEn: 'Sarah Jenkins',
    nameAr: 'سارة جنكينز',
    roleEn: 'Principal UX Researcher',
    roleAr: 'باحثة تجربة مستخدم رئيسية',
    company: 'Spotify',
    yearsExperience: 11,
    sessions: 380,
    rating: 4.9,
    image: '/images/mentor-nadia.jpg',
    tags: ['User Research', 'Design Systems', 'Strategy'],
  },
  {
    id: 'karim-mostafa',
    nameKey: 'karim',
    nameEn: 'Karim Mostafa',
    nameAr: 'كريم مصطفى',
    roleEn: 'VP of Engineering',
    roleAr: 'نائب رئيس الهندسة',
    company: 'FinTech Hub',
    yearsExperience: 12,
    sessions: 640,
    rating: 4.98,
    image: '/images/mentor-ahmed.jpg',
    tags: ['Full Stack', 'Cloud & DevOps', 'Career Coaching'],
  },
]
