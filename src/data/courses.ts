export interface Course {
  id: string
  titleEn: string
  titleAr: string
  categoryEn: string
  categoryAr: string
  instructorEn: string
  instructorAr: string
  instructorAvatar: string
  rating: number
  reviewsCount: number
  durationEn: string
  durationAr: string
  levelEn: string
  levelAr: string
  thumbnail: string
  tag: string
}

export const courses: Course[] = [
  {
    id: 'design-systems',
    titleEn: 'Advanced Design Systems & Components',
    titleAr: 'أنظمة التصميم المتقدمة ومكتبات المكونات',
    categoryEn: 'UI / UX Design',
    categoryAr: 'تصميم واجهات وتجربة المستخدم',
    instructorEn: 'Nadia Meazz',
    instructorAr: 'نادية معز',
    instructorAvatar: '/images/mentor-nadia.jpg',
    rating: 4.9,
    reviewsCount: 1240,
    durationEn: '8 Weeks',
    durationAr: '8 أسابيع',
    levelEn: 'Intermediate',
    levelAr: 'متوسط',
    thumbnail: '/images/course-ui.svg',
    tag: 'UI/UX',
  },
  {
    id: 'fullstack-dev',
    titleEn: 'Full Stack Engineering with React & Node',
    titleAr: 'هندسة الويب المتكاملة مع React و Node',
    categoryEn: 'Web Development',
    categoryAr: 'تطوير الويب المتكامل',
    instructorEn: 'Ahmed Adel',
    instructorAr: 'أحمد عادل',
    instructorAvatar: '/images/mentor-ahmed.jpg',
    rating: 4.95,
    reviewsCount: 2180,
    durationEn: '10 Weeks',
    durationAr: '10 أسابيع',
    levelEn: 'All Levels',
    levelAr: 'كافة المستويات',
    thumbnail: '/images/course-code.svg',
    tag: 'Coding',
  },
  {
    id: 'data-ai',
    titleEn: 'Data Science & Applied Machine Learning',
    titleAr: 'علم البيانات وتطبيقات الذكاء الاصطناعي',
    categoryEn: 'Data & AI',
    categoryAr: 'البيانات والذكاء الاصطناعي',
    instructorEn: 'Sarah Jenkins',
    instructorAr: 'سارة جنكينز',
    instructorAvatar: '/images/mentor-nadia.jpg',
    rating: 4.88,
    reviewsCount: 940,
    durationEn: '12 Weeks',
    durationAr: '12 أسبوعاً',
    levelEn: 'Advanced',
    levelAr: 'متقدم',
    thumbnail: '/images/course-dark.svg',
    tag: 'Data',
  },
  {
    id: 'agile-delivery',
    titleEn: 'Agile Product Management & Team Sprint Delivery',
    titleAr: 'إدارة المنتجات الرقمية والتسليم السريع',
    categoryEn: 'Product & Agile',
    categoryAr: 'المنتجات وإدارة الفرق',
    instructorEn: 'Karim Mostafa',
    instructorAr: 'كريم مصطفى',
    instructorAvatar: '/images/mentor-ahmed.jpg',
    rating: 4.92,
    reviewsCount: 860,
    durationEn: '6 Weeks',
    durationAr: '6 أسابيع',
    levelEn: 'Intermediate',
    levelAr: 'متوسط',
    thumbnail: '/images/course-team.svg',
    tag: 'Management',
  },
]
