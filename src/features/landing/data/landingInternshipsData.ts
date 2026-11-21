export interface InternshipOpportunity {
  id: string;
  title: string;
  titleAr: string;
  company: string;
  companyAr: string;
  category: 'frontend' | 'backend' | 'design' | 'data' | 'mobile';
  categoryLabel: string;
  categoryLabelAr: string;
  location: string;
  locationAr: string;
  workMode: 'Remote' | 'Hybrid' | 'On-site';
  workModeAr: string;
  duration: string;
  durationAr: string;
  level: string;
  levelAr: string;
  compensation: string;
  compensationAr: string;
  isPaid: boolean;
  isSample: boolean;
  shortDescription: string;
  shortDescriptionAr: string;
  overview: {
    team: string;
    teamAr: string;
    projectScope: string;
    projectScopeAr: string;
  };
  responsibilities: string[];
  responsibilitiesAr: string[];
  requirements: string[];
  requirementsAr: string[];
  skills: string[];
  learningOutcomes: string[];
  learningOutcomesAr: string[];
  applicationUrl: string;
}

export const LANDING_INTERNSHIPS: InternshipOpportunity[] = [
  {
    id: 'opp-fe-react',
    title: 'Frontend React & TypeScript Intern',
    titleAr: 'متدرب واجهات أمامية React وTypeScript',
    company: 'NovaTech Solutions (Simulated Partner)',
    companyAr: 'نوفاتك للحلول البرمجية (شريك افتراضي)',
    category: 'frontend',
    categoryLabel: 'Frontend Development',
    categoryLabelAr: 'تطوير الواجهات الأمامية',
    location: 'Cairo, Egypt (Remote Available)',
    locationAr: 'القاهرة، مصر (عن بُعد متاح)',
    workMode: 'Remote',
    workModeAr: 'عن بُعد',
    duration: '3 Months',
    durationAr: '3 أشهر',
    level: 'Students & Recent Grads',
    levelAr: 'الطلاب وحديثو التخرج',
    compensation: 'Paid Monthly Stipend (Sample Listing)',
    compensationAr: 'مكافأة شهرية تدريبية (فرصة تجريبية)',
    isPaid: true,
    isSample: true,
    shortDescription: 'Collaborate with senior engineers to build accessible React components and optimize frontend load times.',
    shortDescriptionAr: 'التعاون مع مهندسي الواجهات لبناء مكونات React تفاعلية وتحسين سرعة استجابة التطبيقات.',
    overview: {
      team: 'Core Web Platform Engineering Squad',
      teamAr: 'فريق هندسة منصات الويب الأساسية',
      projectScope: 'Modernizing internal client portal and creating responsive dashboard widgets.',
      projectScopeAr: 'تطوير بوابة العملاء وبناء لوحات تحكم تفاعلية متجاوبة مع كافة الشاشات.',
    },
    responsibilities: [
      'Implement reusable UI components matching Figma design specifications',
      'Integrate RESTful API endpoints and handle loading, error, and offline states',
      'Participate in daily Agile standups and two-week sprint planning sessions',
      'Submit code through GitHub pull requests with unit test coverage',
    ],
    responsibilitiesAr: [
      'برمجة مكونات واجهات قابلة لإعادة الاستخدام مطابقة لمواصفات Figma',
      'ربط واجهات برمجة التطبيقات REST والتعامل مع حالات التحميل والأخطاء',
      'المشاركة في الاجتماعات اليومية وتخطيط دورات التطوير البرمجي (Sprints)',
      'تقديم الأكواد عبر Pull Requests مع تغطيتها بالاختبارات البرمجية',
    ],
    requirements: [
      'Basic familiarity with JavaScript (ES6+), React hooks, and CSS Tailwind',
      'Understanding of Git branching workflows (commit, push, pull requests)',
      'Passion for software quality and proactive problem-solving',
    ],
    requirementsAr: [
      'معرفة جيدة بلغة JavaScript وReact Hooks ومكتبة Tailwind CSS',
      'فهم التعامل مع Git وسير العمل الجماعي عبر GitHub',
      'شغف بجودة البرمجيات والبحث عن حلول للمشكلات التقنية',
    ],
    skills: ['React', 'TypeScript', 'Tailwind CSS', 'Git', 'REST APIs'],
    learningOutcomes: [
      'Gain production git workflow experience in a multi-developer repository',
      'Master responsive cross-browser layout debugging and accessibility (a11y)',
      'Receive weekly 1-on-1 code reviews from senior frontend mentors',
    ],
    learningOutcomesAr: [
      'اكتساب خبرة عملية حقيقية في بيئة عمل برمجية جماعية',
      'إتقان بناء واجهات متجاوبة ومتوافقة مع معايير الوصول العالمية',
      'الحصول على مراجعات كود فردية أسبوعية من مهندسين محترفين',
    ],
    applicationUrl: '/internship',
  },
  {
    id: 'opp-uiux-design',
    title: 'UI/UX Product Design Intern',
    titleAr: 'متدرب تصميم واجهات وتجربة المستخدم',
    company: 'DesignCraft Agency (Simulated Partner)',
    companyAr: 'وكالة ديزاين كرافت (شريك افتراضي)',
    category: 'design',
    categoryLabel: 'UI/UX & Product Design',
    categoryLabelAr: 'تصميم تجربة وواجهة المستخدم',
    location: 'Alexandria, Egypt (Hybrid)',
    locationAr: 'الإسكندرية، مصر (هجين)',
    workMode: 'Hybrid',
    workModeAr: 'هجين',
    duration: '3 Months',
    durationAr: '3 أشهر',
    level: 'Beginner to Intermediate',
    levelAr: 'مبتدئ إلى متوسط',
    compensation: 'Certificate + Project Mentorship',
    compensationAr: 'شهادة إتمام وتوجيه مهني عملي',
    isPaid: false,
    isSample: true,
    shortDescription: 'Conduct usability sessions, build component variants in Figma, and design intuitive mobile interfaces.',
    shortDescriptionAr: 'إجراء جلسات اختبار قابلية الاستخدام، وتصميم مكونات Figma المتقدمة وتطبيقات الهاتف.',
    overview: {
      team: 'Product Discovery & Experience Lab',
      teamAr: 'مختبر أبحاث وتجربة المنتجات الرقمية',
      projectScope: 'Redesigning onboarding flows and streamlining student portfolio presentations.',
      projectScopeAr: 'إعادة تصميم مسارات تسجيل المستخدمين وعرض نماذج الأعمال الشخصية.',
    },
    responsibilities: [
      'Create high-fidelity wireframes, interactive prototypes, and user journey maps',
      'Synthesize customer feedback from qualitative usability testing sessions',
      'Maintain the shared design system components and token consistency in Figma',
      'Prepare developer-ready design specifications and asset exports',
    ],
    responsibilitiesAr: [
      'تصميم نماذج أولية تفاعلية ومخططات رحلة المستخدم (User Journeys)',
      'تحليل وتلخيص ملاحظات المستخدمين من جلسات الاختبار الميدانية',
      'المحافظة على تناسق عناصر نظام التصميم والمكتبات في Figma',
      'تسليم ملفات التصميم للمطورين بمواصفات دقيقة وعناصر جاهزة',
    ],
    requirements: [
      'Familiarity with Figma tools (Auto Layout, Components, Variants)',
      'Basic understanding of UX principles and user empathy methods',
      'A portfolio or case study showing process (university projects welcome)',
    ],
    requirementsAr: [
      'إلمام بأدوات Figma الأساسية (Auto Layout والمكونات التفاعلية)',
      'فهم مبادئ تجربة المستخدم وعلم نفس التفاعل البشري',
      'ملف أعمال أو دراسة حالة توضح منهجية التفكير في حل المشكلات',
    ],
    skills: ['Figma', 'User Research', 'Wireframing', 'Prototyping', 'Design Systems'],
    learningOutcomes: [
      'Build end-to-end case studies ready to showcase to top tech employers',
      'Learn how to bridge design decisions with technical feasibility and engineering constraints',
      'Master presentation skills by pitching design solutions to product managers',
    ],
    learningOutcomesAr: [
      'بناء دراسات حالة متكاملة تعزز سيرتك المهنية أمام مسؤولي التوظيف',
      'تعلم التنسيق الفعّال بين القرارات التصميمية والقيود البرمجية',
      'تطوير مهارات الإقناع وعرض الحلول التصميمية أمام قيادات المنتج',
    ],
    applicationUrl: '/internship',
  },
  {
    id: 'opp-be-node',
    title: 'Backend Systems & API Intern',
    titleAr: 'متدرب تطوير الخوادم وقواعد البيانات',
    company: 'CloudBase Systems (Simulated Partner)',
    companyAr: 'أنظمة كلاود بيس (شريك افتراضي)',
    category: 'backend',
    categoryLabel: 'Backend Development',
    categoryLabelAr: 'تطوير الواجهات الخلفية',
    location: 'Giza, Egypt (On-site / Hybrid)',
    locationAr: 'الجيزة، مصر (حضوري / هجين)',
    workMode: 'On-site',
    workModeAr: 'حضوري',
    duration: '6 Months',
    durationAr: '6 أشهر',
    level: 'Students & Recent Grads',
    levelAr: 'الطلاب وحديثو التخرج',
    compensation: 'Paid Monthly Stipend (Sample Listing)',
    compensationAr: 'مكافأة شهرية تدريبية (فرصة تجريبية)',
    isPaid: true,
    isSample: true,
    shortDescription: 'Write robust backend APIs, configure SQL queries, and implement Redis caching for high-load systems.',
    shortDescriptionAr: 'برمجة واجهات خلفية متينة، وتحسين استعلامات SQL، وتطبيق التخزين المؤقت للأنظمة سريعة الاستجابة.',
    overview: {
      team: 'Infrastructure & Data Services Squad',
      teamAr: 'فريق البنية التحتية وخدمات البيانات',
      projectScope: 'Scaling authentication pipelines and building automated reporting services.',
      projectScopeAr: 'تطوير مسارات المصادقة الأمنية وبناء خدمات التقارير الإحصائية المؤتمتة.',
    },
    responsibilities: [
      'Develop modular RESTful API controllers with comprehensive unit tests',
      'Write optimized SQL migrations and manage relational constraints in PostgreSQL',
      'Implement JWT token authentication and role-based access control (RBAC)',
      'Monitor error tracking logs and participate in blameless post-mortems',
    ],
    responsibilitiesAr: [
      'برمجة وحدات RESTful آمنة ومختبرة برمجياً ضد الأخطاء',
      'كتابة استعلامات SQL متقدمة وضبط جداول قواعد بيانات PostgreSQL',
      'تطبيق أنظمة المصادقة عبر JWT وصلاحيات المستخدمين المختلفة',
      'متابعة سجلات الخوادم واكتشاف وحل مشكلات الأداء البرمجي',
    ],
    requirements: [
      'Working knowledge of Node.js, Express, or similar backend technologies',
      'Basic relational database concepts (primary keys, foreign keys, joins)',
      'Eagerness to learn defensive coding, error handling, and cloud architectures',
    ],
    requirementsAr: [
      'معرفة بلغة Node.js وأطر العمل مثل Express أو بيئات مشابهة',
      'فهم أساسيات قواعد البيانات العلائقية ومفاهيم الربط (Joins)',
      'الرغبة في تعلم البرمجة الدفاعية ومعالجة الاستثناءات والخدمات السحابية',
    ],
    skills: ['Node.js', 'PostgreSQL', 'Redis', 'Docker', 'REST APIs', 'Unit Testing'],
    learningOutcomes: [
      'Understand how high-scale microservices handle concurrent traffic and data locking',
      'Master database indexing and execution plan inspection for query optimization',
      'Gain real hands-on experience using Docker containers in development environments',
    ],
    learningOutcomesAr: [
      'فهم كيفية تعامل الخوادم مع آلاف الطلبات المتزامنة وتوزيع الأحمال',
      'إتقان تحليل استعلامات قواعد البيانات وتسريع وقت الاستجابة',
      'التعامل العملي مع بيئات Docker في تطوير ونشر البرمجيات',
    ],
    applicationUrl: '/internship',
  },
  {
    id: 'opp-data-analyst',
    title: 'Data Science & Analytics Intern',
    titleAr: 'متدرب علم وتحليل البيانات',
    company: 'HyperInsight Analytics (Simulated Partner)',
    companyAr: 'هايبر إنسايت للتحليلات (شريك افتراضي)',
    category: 'data',
    categoryLabel: 'Data Science & AI',
    categoryLabelAr: 'علم البيانات والذكاء الاصطناعي',
    location: 'Remote (MENA Region)',
    locationAr: 'عن بُعد (الشرق الأوسط وشمال إفريقيا)',
    workMode: 'Remote',
    workModeAr: 'عن بُعد',
    duration: '3 Months',
    durationAr: '3 أشهر',
    level: 'Students & Recent Grads',
    levelAr: 'الطلاب وحديثو التخرج',
    compensation: 'Academic Project Sponsorship',
    compensationAr: 'رعاية مشاريع تخرج وتوجيه تخصصي',
    isPaid: false,
    isSample: true,
    shortDescription: 'Clean complex datasets, build automated dashboard pipelines, and uncover actionable user retention patterns.',
    shortDescriptionAr: 'معالجة وتنظيف البيانات، وبناء لوحات المؤشرات التفاعلية، ودراسة أنماط سلوك المستخدمين.',
    overview: {
      team: 'Business Intelligence & Growth Analytics',
      teamAr: 'فريق ذكاء الأعمال وتحليلات النمو',
      projectScope: 'Building predictive cohort retention dashboards and student completion analytics.',
      projectScopeAr: 'بناء مؤشرات تفاعلية لقياس استمرارية الطلاب ومعدلات إكمال المسارات التعليمية.',
    },
    responsibilities: [
      'Extract, clean, and transform messy user engagement logs using Python and Pandas',
      'Formulate analytical SQL queries to compute conversion and drop-off funnels',
      'Construct interactive visual dashboards for cross-departmental stakeholders',
      'Document data definitions and anomalies in the company data catalog',
    ],
    responsibilitiesAr: [
      'استخراج ومعالجة بيانات تفاعل المستخدمين عبر Python وPandas',
      'صياغة استعلامات SQL التحليلية لحساب معدلات التحويل والانسحاب',
      'تصميم لوحات مؤشرات تفاعلية لدعم فرق العمل المختلفة',
      'توثيق تعريفات البيانات ومصطلحات القياس المعتمدة',
    ],
    requirements: [
      'Familiarity with Python syntax and data libraries (Pandas, Matplotlib/Seaborn)',
      'Basic knowledge of SQL SELECT, GROUP BY, and JOIN queries',
      'Curiosity for uncovering stories and patterns behind raw numbers',
    ],
    requirementsAr: [
      'معرفة بلغة بايثون ومكتبات التعامل مع البيانات (Pandas)',
      'إلمام باستعلامات SQL الأساسية والتجميعية والربط',
      'شغف باكتشاف الأنماط والدلالات العملية خلف الأرقام والإحصائيات',
    ],
    skills: ['Python', 'SQL', 'Pandas', 'Data Visualization', 'Business Intelligence'],
    learningOutcomes: [
      'Transform textbook theoretical data knowledge into applied commercial problem-solving',
      'Master automated data pipeline creation and scheduled reporting',
      'Present findings concisely to non-technical leaders and stakeholders',
    ],
    learningOutcomesAr: [
      'تحويل المعرفة النظرية إلى حلول وتطبيقات عملية تواكب سوق العمل',
      'إتقان إنشاء خطوط معالجة البيانات وجدولة التقارير الآلية',
      'تطوير مهارة عرض وتوصيل النتائج الإحصائية بوضوح للقيادات الإدارية',
    ],
    applicationUrl: '/internship',
  },
];

export const getInternshipById = (id: string): InternshipOpportunity | undefined => {
  return LANDING_INTERNSHIPS.find((opp) => opp.id === id);
};
