export interface Internship {
  id: string
  titleEn: string
  titleAr: string
  companyEn: string
  companyAr: string
  locationEn: string
  locationAr: string
  typeEn: string
  typeAr: string
  durationEn: string
  durationAr: string
  stipendEn: string
  stipendAr: string
  skills: string[]
  thumbnail: string
  spotsLeft: number
}

export const internships: Internship[] = [
  {
    id: 'product-design-intern',
    titleEn: 'UI/UX Product Design Internship',
    titleAr: 'تدريب تصميم واجهات وتجربة المستخدم',
    companyEn: 'TechNova Studio',
    companyAr: 'استوديو تك نوفا',
    locationEn: 'Remote',
    locationAr: 'عن بُعد',
    typeEn: 'Paid Internship',
    typeAr: 'تدريب مدفوع',
    durationEn: '3 Months',
    durationAr: '3 أشهر',
    stipendEn: '$800/mo',
    stipendAr: '3,000 ر.س/شهر',
    skills: ['Figma', 'Prototyping', 'User Research'],
    thumbnail: '/images/course-ui.svg',
    spotsLeft: 3,
  },
  {
    id: 'frontend-intern',
    titleEn: 'Frontend React & TypeScript Intern',
    titleAr: 'تدريب تطوير الواجهات React و TypeScript',
    companyEn: 'CloudFlow Solutions',
    companyAr: 'حلول كلاود فلو',
    locationEn: 'Hybrid',
    locationAr: 'هجين',
    typeEn: 'Paid Internship',
    typeAr: 'تدريب مدفوع',
    durationEn: '4 Months',
    durationAr: '4 أشهر',
    stipendEn: '$1,000/mo',
    stipendAr: '3,800 ر.س/شهر',
    skills: ['React', 'TypeScript', 'Tailwind CSS'],
    thumbnail: '/images/course-code.svg',
    spotsLeft: 2,
  },
  {
    id: 'data-intern',
    titleEn: 'Data Analytics & Business Intelligence Intern',
    titleAr: 'تدريب تحليل البيانات وذكاء الأعمال',
    companyEn: 'Apex Analytics',
    companyAr: 'آبكس للتحليلات',
    locationEn: 'Remote',
    locationAr: 'عن بُعد',
    typeEn: 'Full-time track',
    typeAr: 'مسار توظيف كامل',
    durationEn: '3 Months',
    durationAr: '3 أشهر',
    stipendEn: '$900/mo',
    stipendAr: '3,400 ر.س/شهر',
    skills: ['Python', 'SQL', 'Power BI'],
    thumbnail: '/images/course-dark.svg',
    spotsLeft: 4,
  },
  {
    id: 'product-growth-intern',
    titleEn: 'Product Operations & Agile Associate Intern',
    titleAr: 'تدريب إدارة العمليات والمنتجات الرقمية',
    companyEn: 'GlobalVentures Labs',
    companyAr: 'مختبرات جلوبال فنشرز',
    locationEn: 'Hybrid',
    locationAr: 'هجين',
    typeEn: 'Direct Hire Pathway',
    typeAr: 'مسار توظيف مباشر',
    durationEn: '6 Months',
    durationAr: '6 أشهر',
    stipendEn: '$1,100/mo',
    stipendAr: '4,200 ر.س/شهر',
    skills: ['Scrum', 'Jira', 'Product Analytics'],
    thumbnail: '/images/course-team.svg',
    spotsLeft: 2,
  },
]
