export interface CourseLesson {
  title: string;
  titleAr: string;
  duration: string;
  durationAr: string;
}

export interface CourseItem {
  id: string;
  categoryId: string;
  title: string;
  titleAr: string;
  duration: string;
  durationAr: string;
  level: string;
  levelAr: string;
  enrolledCount?: string;
  enrolledCountAr?: string;
  certificate: string;
  certificateAr: string;
  thumbnailType: 'react' | 'js' | 'htmlcss' | 'tailwind' | 'node' | 'python' | 'figma' | 'flutter';
  description: string;
  descriptionAr: string;
  learningOutcomes: string[];
  learningOutcomesAr: string[];
  skills: string[];
  prerequisites?: string[];
  prerequisitesAr?: string[];
  curriculum?: CourseLesson[];
  enrollUrl: string;
}

export interface CourseCategory {
  id: string;
  name: string;
  nameAr: string;
  fullName: string;
  fullNameAr: string;
  courseCount: number;
  iconType: 'code' | 'server' | 'palette' | 'chart' | 'mobile';
  courses: CourseItem[];
}

export const COURSE_CATEGORIES: CourseCategory[] = [
  {
    id: 'frontend',
    name: 'Frontend',
    nameAr: 'الواجهات الأمامية',
    fullName: 'Frontend Development',
    fullNameAr: 'تطوير الواجهات الأمامية',
    courseCount: 12,
    iconType: 'code',
    courses: [
      {
        id: 'react-basics-advanced',
        categoryId: 'frontend',
        title: 'React Basics to Advanced',
        titleAr: 'أساسيات واحتراف React',
        duration: '8 hours',
        durationAr: '8 ساعات',
        level: 'Beginner',
        levelAr: 'مبتدئ',
        enrolledCount: '12,450 enrolled',
        enrolledCountAr: '12,450 مسجل',
        certificate: 'Yes',
        certificateAr: 'نعم',
        thumbnailType: 'react',
        description:
          'Learn React from scratch and build modern, interactive web applications. This course covers everything from basics to advanced concepts like hooks, context, and state management.',
        descriptionAr:
          'تعلم React من البداية وابنِ تطبيقات ويب تفاعلية حديثة. تغطي هذه الدورة كل شيء بدءاً من الأساسيات وصولاً للمفاهيم المتقدمة مثل Hooks وإدارة الحالة.',
        learningOutcomes: [
          'Understand React fundamentals and components',
          'Work with hooks and context API',
          'Build real-world projects',
          'Deploy your app to production',
        ],
        learningOutcomesAr: [
          'فهم أساسيات ومكونات React',
          'التعامل مع Hooks وواجهة Context API',
          'بناء مشاريع واقعية متكاملة',
          'نشر التطبيق على بيئات الإنتاج الحية',
        ],
        prerequisites: ['HTML & CSS basics', 'Modern JavaScript (ES6+) knowledge'],
        prerequisitesAr: ['أساسيات HTML وCSS', 'معرفة جيدة بجافاسكريبت الحديثة (ES6+)'],
        curriculum: [
          { title: 'Introduction to React & JSX Architecture', titleAr: 'مقدمة إلى React وبنية JSX', duration: '45m', durationAr: '45 دقيقة' },
          { title: 'Components, Props & State Lifecycle', titleAr: 'المكونات وتمرير الخصائص ودورة الحالة', duration: '60m', durationAr: '60 دقيقة' },
          { title: 'Deep Dive into useState & useEffect', titleAr: 'التعمق في useState وuseEffect', duration: '55m', durationAr: '55 دقيقة' },
          { title: 'Context API & Global State Management', titleAr: 'إدارة الحالة العامة عبر Context API', duration: '50m', durationAr: '50 دقيقة' },
          { title: 'Building & Deploying an E-Commerce SPA', titleAr: 'بناء ونشر متجر إلكتروني تفاعلي', duration: '90m', durationAr: '90 دقيقة' },
        ],
        skills: ['React 19', 'Components', 'Hooks', 'Context API', 'Vite'],
        enrollUrl: '/register',
      },
      {
        id: 'js-fundamentals',
        categoryId: 'frontend',
        title: 'JavaScript Fundamentals',
        titleAr: 'أساسيات جافاسكريبت الشاملة',
        duration: '6 hours',
        durationAr: '6 ساعات',
        level: 'Beginner',
        levelAr: 'مبتدئ',
        enrolledCount: '18,200 enrolled',
        enrolledCountAr: '18,200 مسجل',
        certificate: 'Yes',
        certificateAr: 'نعم',
        thumbnailType: 'js',
        description:
          'Master modern JavaScript (ES6+), DOM manipulation, async/await, closures, and the event loop with real coding exercises and challenges.',
        descriptionAr:
          'أتقن لغة JavaScript الحديثة (ES6+)، والتعامل مع DOM، والبرمجة غير المتزامنة async/await، ودورة الأحداث Event Loop من خلال تمارين برمجية عملية.',
        learningOutcomes: [
          'Deeply understand JavaScript execution and scope',
          'Handle asynchronous requests and fetch APIs',
          'Manipulate DOM nodes efficiently',
          'Write clean, modular ES6+ syntax',
        ],
        learningOutcomesAr: [
          'فهم آلية تنفيذ الأكواد ونطاق المتغيرات في جافاسكريبت',
          'التعامل مع الطلبات غير المتزامنة واستدعاء واجهات APIs',
          'التحكم في عناصر صفحة الويب DOM بكفاءة',
          'كتابة كود معياري نظيف وفق معايير ES6+',
        ],
        prerequisites: ['Basic computer literacy', 'Curiosity to learn programming'],
        prerequisitesAr: ['استخدام الحاسوب الأساسي', 'الشغف بتعلم البرمجة'],
        curriculum: [
          { title: 'Variables, Data Types & Control Flow', titleAr: 'المتغيرات وأنواع البيانات والجمل الشرطية', duration: '40m', durationAr: '40 دقيقة' },
          { title: 'Functions, Scopes & Closures Explained', titleAr: 'الدوال ونطاق المتغيرات والـ Closures', duration: '50m', durationAr: '50 دقيقة' },
          { title: 'DOM Events & Interactive UI Manipulation', titleAr: 'أحداث المتصفح والتحكم التفاعلي بالصفحة', duration: '60m', durationAr: '60 دقيقة' },
          { title: 'Promises, Async/Await & Fetching Data', titleAr: 'الوعود البرمجية واستدعاء البيانات الخارجية', duration: '55m', durationAr: '55 دقيقة' },
        ],
        skills: ['JavaScript ES6+', 'Async/Await', 'DOM API', 'Closures'],
        enrollUrl: '/register',
      },
      {
        id: 'html-css-modern-web',
        categoryId: 'frontend',
        title: 'HTML & CSS for Modern Web',
        titleAr: 'HTML وCSS للويب الحديث',
        duration: '7 hours',
        durationAr: '7 ساعات',
        level: 'Beginner',
        levelAr: 'مبتدئ',
        enrolledCount: '15,400 enrolled',
        enrolledCountAr: '15,400 مسجل',
        certificate: 'Yes',
        certificateAr: 'نعم',
        thumbnailType: 'htmlcss',
        description:
          'Build responsive, semantic, and accessible web layouts from scratch using HTML5, modern CSS Grid, Flexbox, and CSS custom properties.',
        descriptionAr:
          'بناء مواقع ويب متجاوبة وسهلة الوصول من الصفر باستخدام HTML5 الدلالية، وشبكات CSS Grid، وFlexbox، والمتغيرات القياسية.',
        learningOutcomes: [
          'Structure web pages with semantic HTML5',
          'Master CSS Flexbox and 2D CSS Grid layouts',
          'Implement mobile-first responsive media queries',
          'Adhere to WCAG accessibility best practices',
        ],
        learningOutcomesAr: [
          'هيكلة صفحات الويب باستخدام وسوم HTML5 الدلالية',
          'إتقان تخطيطات CSS Flexbox وشبكات CSS Grid',
          'بناء تصاميم متجاوبة تركز على الهواتف الذكية أولاً',
          'تطبيق معايير إمكانية الوصول العالمية WCAG',
        ],
        prerequisites: ['No prior coding experience required'],
        prerequisitesAr: ['لا يشترط وجود أي خبرة برمجية مسبقة'],
        curriculum: [
          { title: 'Semantic HTML5 Elements & Page Structure', titleAr: 'هيكلة الصفحات وعناصر HTML5 الدلالية', duration: '45m', durationAr: '45 دقيقة' },
          { title: 'CSS Box Model, Typography & Colors', titleAr: 'نموذج الصندوق في CSS والخطوط والألوان', duration: '50m', durationAr: '50 دقيقة' },
          { title: 'Flexbox: 1-Dimensional Flow Control', titleAr: 'تخطيط Flexbox أحادي البعد وتوزيع العناصر', duration: '55m', durationAr: '55 دقيقة' },
          { title: 'CSS Grid: 2D Complex Layout Systems', titleAr: 'شبكات CSS Grid ثنائية الأبعاد لبناء الصفحات', duration: '60m', durationAr: '60 دقيقة' },
        ],
        skills: ['HTML5', 'CSS3', 'Flexbox', 'CSS Grid', 'Responsive Design'],
        enrollUrl: '/register',
      },
      {
        id: 'tailwind-css-mastery',
        categoryId: 'frontend',
        title: 'Tailwind CSS Mastery',
        titleAr: 'احتراف وتطبيق Tailwind CSS',
        duration: '5 hours',
        durationAr: '5 ساعات',
        level: 'Intermediate',
        levelAr: 'متوسط',
        enrolledCount: '9,850 enrolled',
        enrolledCountAr: '9,850 مسجل',
        certificate: 'Yes',
        certificateAr: 'نعم',
        thumbnailType: 'tailwind',
        description:
          'Speed up your frontend workflow by building custom, production-ready interfaces rapidly with utility-first Tailwind CSS, theme tokens, and component abstractions.',
        descriptionAr:
          'سرّع وتيرة تطوير الواجهات الأمامية عبر بناء واجهات مستخدم احترافية بالاعتماد على Tailwind CSS، وتخصيص السمات والمكونات.',
        learningOutcomes: [
          'Design pixel-perfect interfaces without leaving HTML',
          'Configure design tokens and custom theme variants',
          'Build responsive layouts and dark mode toggles',
          'Optimize production CSS bundles for peak speed',
        ],
        learningOutcomesAr: [
          'تصميم واجهات دقيقة دون كتابة ملفات CSS تقليدية',
          'تكوين رموز التصميم والسمات المخصصة',
          'بناء تصاميم متجاوبة ودعم الوضع الداكن بسلاسة',
          'تحسين حجم حزم CSS للحصول على أقصى سرعة تحميل',
        ],
        prerequisites: ['HTML and CSS fundamentals'],
        prerequisitesAr: ['معرفة بأساسيات HTML وCSS'],
        curriculum: [
          { title: 'Utility-First Philosophy & Core Concepts', titleAr: 'فلسفة Utility-First ومفاهيم Tailwind', duration: '35m', durationAr: '35 دقيقة' },
          { title: 'Responsive Breakpoints & State Modifiers', titleAr: 'نقاط التجاوب Responsive وتعديل الحالات', duration: '45m', durationAr: '45 دقيقة' },
          { title: 'Theme Customization & Design Tokens', titleAr: 'تخصيص السمات ورموز التصميم القياسية', duration: '40m', durationAr: '40 دقيقة' },
          { title: 'Production Purging & Performance Optimization', titleAr: 'ضغط ملفات CSS للإنتاج وتحسين السرعة', duration: '30m', durationAr: '30 دقيقة' },
        ],
        skills: ['Tailwind CSS', 'Responsive UI', 'Dark Mode', 'Design Tokens'],
        enrollUrl: '/register',
      },
    ],
  },
  {
    id: 'backend',
    name: 'Backend',
    nameAr: 'الواجهات الخلفية',
    fullName: 'Backend Development',
    fullNameAr: 'تطوير الواجهات الخلفية',
    courseCount: 8,
    iconType: 'server',
    courses: [
      {
        id: 'node-apis-databases',
        categoryId: 'backend',
        title: 'Node.js & Express REST APIs',
        titleAr: 'تطوير واجهات برمجة التطبيقات Node.js وExpress',
        duration: '9 hours',
        durationAr: '9 ساعات',
        level: 'Intermediate',
        levelAr: 'متوسط',
        enrolledCount: '11,200 enrolled',
        enrolledCountAr: '11,200 مسجل',
        certificate: 'Yes',
        certificateAr: 'نعم',
        thumbnailType: 'node',
        description:
          'Design and deploy production-ready RESTful APIs with Node.js, Express, PostgreSQL, secure JWT authentication, and automated endpoint testing.',
        descriptionAr:
          'تصميم ونشر واجهات برمجة تطبيقات REST احترافية باستخدام Node.js وExpress وقواعد بيانات PostgreSQL وحلول الأمان.',
        learningOutcomes: [
          'Architect RESTful API endpoints and middleware',
          'Manage database queries and migrations with PostgreSQL',
          'Implement secure user authentication and encryption',
          'Write automated integration tests',
        ],
        learningOutcomesAr: [
          'هندسة واجهات برمجية RESTful والـ Middleware',
          'إدارة استعلامات وترحيل بيانات PostgreSQL',
          'تطبيق المصادقة الأمنية وتشفير كلمات المرور',
          'كتابة اختبارات تكامل برمجية مؤتمتة',
        ],
        prerequisites: ['JavaScript core proficiency'],
        prerequisitesAr: ['إتقان أساسيات JavaScript'],
        curriculum: [
          { title: 'Node.js Architecture & HTTP Server Basics', titleAr: 'بنية Node.js وبناء خوادم HTTP الأساسية', duration: '50m', durationAr: '50 دقيقة' },
          { title: 'Express Routing, Middleware & Error Handling', titleAr: 'توجيه المسارات والـ Middleware ومعالجة الأخطاء', duration: '60m', durationAr: '60 دقيقة' },
          { title: 'PostgreSQL Relational Storage & Knex Migrations', titleAr: 'تخزين البيانات في PostgreSQL وترحيل الجداول', duration: '65m', durationAr: '65 دقيقة' },
          { title: 'JWT Authentication & Security Best Practices', titleAr: 'المصادقة عبر JWT وأفضل الممارسات الأمنية', duration: '55m', durationAr: '55 دقيقة' },
        ],
        skills: ['Node.js', 'Express', 'PostgreSQL', 'JWT', 'REST APIs'],
        enrollUrl: '/register',
      },
      {
        id: 'python-django-apis',
        categoryId: 'backend',
        title: 'Python & Django REST Framework',
        titleAr: 'تطوير واجهات برمجة التطبيقات عبر Python وDjango',
        duration: '8 hours',
        durationAr: '8 ساعات',
        level: 'Intermediate',
        levelAr: 'متوسط',
        enrolledCount: '8,940 enrolled',
        enrolledCountAr: '8,940 مسجل',
        certificate: 'Yes',
        certificateAr: 'نعم',
        thumbnailType: 'python',
        description:
          'Build scalable web backends with Django and Django REST Framework. Learn ORM modeling, serializers, token authentication, and background Celery tasks.',
        descriptionAr:
          'بناء خوادم ويب قابلة للتوسع باستخدام Django وDjango REST Framework. تعلم نمذجة البيانات عبر ORM، والتسلسل Serializers، والمصادقة بالرموز.',
        learningOutcomes: [
          'Model relational databases with Django ORM',
          'Build secure API endpoints with DRF Serializers',
          'Implement permissions, throttles, and authentication',
          'Handle file uploads and asynchronous background tasks',
        ],
        learningOutcomesAr: [
          'نمذجة قواعد البيانات العلاقية عبر Django ORM',
          'بناء واجهات برمجية آمنة باستخدام DRF Serializers',
          'تطبيق أذونات الوصول والتحكم بمعدل الطلبات Throttling',
          'إدارة رفع الملفات والمهام الخلفية غير المتزامنة',
        ],
        prerequisites: ['Python basics and fundamental SQL knowledge'],
        prerequisitesAr: ['أساسيات لغة بايثون ومعرفة بمبادئ SQL'],
        curriculum: [
          { title: 'Django Project Setup & MVT Architecture', titleAr: 'إعداد مشروع Django وهيكلية MVT', duration: '40m', durationAr: '40 دقيقة' },
          { title: 'Models, Migrations & Database Relationships', titleAr: 'النماذج وترحيل البيانات وعلاقات الجداول', duration: '55m', durationAr: '55 دقيقة' },
          { title: 'DRF Serializers & ViewSets Deep Dive', titleAr: 'تسلسل البيانات Serializers ومجموعات العرض ViewSets', duration: '60m', durationAr: '60 دقيقة' },
          { title: 'JWT Auth & Production Deployment', titleAr: 'المصادقة عبر JWT والنشر على خوادم الإنتاج', duration: '45m', durationAr: '45 دقيقة' },
        ],
        skills: ['Python', 'Django', 'Django REST Framework', 'PostgreSQL', 'ORM'],
        enrollUrl: '/register',
      },
      {
        id: 'postgresql-database-architecture',
        categoryId: 'backend',
        title: 'PostgreSQL Database Architecture & Query Tuning',
        titleAr: 'هندسة وتحسين أداء قواعد بيانات PostgreSQL',
        duration: '7 hours',
        durationAr: '7 ساعات',
        level: 'Advanced',
        levelAr: 'متقدم',
        enrolledCount: '6,450 enrolled',
        enrolledCountAr: '6,450 مسجل',
        certificate: 'Yes',
        certificateAr: 'نعم',
        thumbnailType: 'node',
        description:
          'Deep dive into PostgreSQL indexing, schema normalization, ACID transactions, locking mechanisms, query execution plans, and performance tuning.',
        descriptionAr:
          'تعمق في فهرسة قواعد بيانات PostgreSQL، وتطبيع الجداول، ومعاملات ACID، وآليات القفل، وتحليل خطط تنفيذ الاستعلامات لتحقيق أقصى أداء.',
        learningOutcomes: [
          'Design scalable database schemas with foreign keys and constraints',
          'Analyze EXPLAIN ANALYZE execution query trees',
          'Implement B-Tree, GIN, and GiST indexes effectively',
          'Manage database connection pooling and replication',
        ],
        learningOutcomesAr: [
          'تصميم مخططات قواعد بيانات قابلة للتوسع مع القيود والمفاتيح',
          'تحليل خطط الاستعلام عبر EXPLAIN ANALYZE لمعالجة الاختناقات',
          'تطبيق أنواع الفهارس المختلفة B-Tree وGIN بكفاءة',
          'إدارة تجميع الاتصالات وتكرار البيانات Replication',
        ],
        prerequisites: ['Familiarity with basic SQL queries'],
        prerequisitesAr: ['معرفة جيدة باستعلامات SQL الأساسية'],
        curriculum: [
          { title: 'Relational Modeling & Normal Forms', titleAr: 'النمذجة العلاقية والأشكال المعيارية Normalization', duration: '45m', durationAr: '45 دقيقة' },
          { title: 'Indexing Strategies & B-Tree Mechanics', titleAr: 'استراتيجيات الفهرسة وآلية عمل B-Tree', duration: '50m', durationAr: '50 دقيقة' },
          { title: 'Analyzing Query Plans with EXPLAIN', titleAr: 'تحليل خطط الاستعلام واكتشاف البطء عبر EXPLAIN', duration: '60m', durationAr: '60 دقيقة' },
          { title: 'Transactions, ACID & Locking Concurrency', titleAr: 'المعاملات والتزامن وإدارة الأقفال Lockings', duration: '55m', durationAr: '55 دقيقة' },
        ],
        skills: ['PostgreSQL', 'SQL Optimization', 'Indexing', 'Database Design'],
        enrollUrl: '/register',
      },
    ],
  },
  {
    id: 'uiux',
    name: 'UI/UX Design',
    nameAr: 'تصميم الواجهات',
    fullName: 'UI/UX & Product Design',
    fullNameAr: 'تصميم تجربة وواجهة المستخدم',
    courseCount: 10,
    iconType: 'palette',
    courses: [
      {
        id: 'figma-mastery-prototyping',
        categoryId: 'uiux',
        title: 'Figma Mastery: UI Systems & Prototyping',
        titleAr: 'احتراف Figma: أنظمة التصميم والنماذج التفاعلية',
        duration: '8 hours',
        durationAr: '8 ساعات',
        level: 'Beginner to Intermediate',
        levelAr: 'مبتدئ إلى متوسط',
        enrolledCount: '14,300 enrolled',
        enrolledCountAr: '14,300 مسجل',
        certificate: 'Yes',
        certificateAr: 'نعم',
        thumbnailType: 'figma',
        description:
          'From wireframes to interactive high-fidelity prototypes. Master Figma Auto-Layout, variables, component variants, and design token handoff.',
        descriptionAr:
          'من التخطيط الأولي إلى النماذج الأولية عالية الدقة. أتقن Auto-Layout ومتغيرات Figma والمكونات التفاعلية وتسليم التصاميم للمطورين.',
        learningOutcomes: [
          'Build responsive layouts using nested Auto-Layout',
          'Create reusable component systems with variants and tokens',
          'Design interactive prototypes with realistic transitions',
          'Conduct usability testing and iterate based on user data',
        ],
        learningOutcomesAr: [
          'بناء تصاميم متجاوبة باستخدام Auto-Layout المتداخل',
          'إنشاء أنظمة مكونات قابلة لإعادة الاستخدام مع المتغيرات',
          'تصميم نماذج أولية تفاعلية تحاكي التطبيقات الحقيقية',
          'إجراء اختبارات قابلية الاستخدام وتحسين التصاميم',
        ],
        prerequisites: ['Basic digital literacy and an eye for design'],
        prerequisitesAr: ['معرفة رقمية أولية وحس تصميمي'],
        curriculum: [
          { title: 'User Research & Wireframing Essentials', titleAr: 'أبحاث المستخدم وأساسيات التخطيط السلكي Wireframes', duration: '45m', durationAr: '45 دقيقة' },
          { title: 'Auto-Layout 5.0 & Responsive Components', titleAr: 'ميزة Auto-Layout المتقدمة والمكونات المتجاوبة', duration: '60m', durationAr: '60 دقيقة' },
          { title: 'Design Tokens, Variables & Color Systems', titleAr: 'رموز التصميم والمتغيرات وأنظمة الألوان', duration: '55m', durationAr: '55 دقيقة' },
          { title: 'Interactive Micro-Animations & Prototyping', titleAr: 'التحريك التفاعلي الدقيق وبناء النماذج الحية', duration: '50m', durationAr: '50 دقيقة' },
        ],
        skills: ['Figma', 'Auto-Layout', 'Design Systems', 'Prototyping', 'UX Research'],
        enrollUrl: '/register',
      },
      {
        id: 'ux-research-design-thinking',
        categoryId: 'uiux',
        title: 'UX Research & Design Thinking',
        titleAr: 'أبحاث تجربة المستخدم والتفكير التصميمي',
        duration: '6 hours',
        durationAr: '6 ساعات',
        level: 'Beginner',
        levelAr: 'مبتدئ',
        enrolledCount: '8,120 enrolled',
        enrolledCountAr: '8,120 مسجل',
        certificate: 'Yes',
        certificateAr: 'نعم',
        thumbnailType: 'figma',
        description:
          'Conduct user interviews, persona mapping, customer journey maps, and heuristic evaluations to build products that solve genuine user problems.',
        descriptionAr:
          'إجراء مقابلات المستخدمين، وبناء الشخصيات الافتراضية Personas، وخرائط رحلة العميل، والتقييم الإرشادي لبناء منتجات تحل المشاكل الحقيقية.',
        learningOutcomes: [
          'Plan and execute qualitative user interviews',
          'Synthesize findings into affinity maps and empathy maps',
          'Identify usability bottlenecks through heuristic audits',
          'Validate prototypes with moderated usability testing',
        ],
        learningOutcomesAr: [
          'تخطيط وتنفيذ المقابلات النوعية مع المستخدمين',
          'صياغة النتائج في خرائط تقارب وخرائط تعاطف واضحة',
          'اكتشاف معوقات الاستخدام عبر التقييمات الإرشادية',
          'التحقق من صحة النماذج الأولية عبر اختبارات الاستخدام',
        ],
        prerequisites: ['No technical prerequisites required'],
        prerequisitesAr: ['لا تتطلب أي متطلبات برمجية مسبقة'],
        curriculum: [
          { title: 'Design Thinking Phases & Empathy', titleAr: 'مراحل التفكير التصميمي وبناء التعاطف مع المستخدم', duration: '40m', durationAr: '40 دقيقة' },
          { title: 'Interviewing Users & Asking the Right Questions', titleAr: 'إجراء المقابلات وطرح الأسئلة الاستكشافية الصحيحة', duration: '50m', durationAr: '50 دقيقة' },
          { title: 'User Journey Mapping & Information Architecture', titleAr: 'خرائط رحلة المستخدم وهندسة المعلومات IA', duration: '55m', durationAr: '55 دقيقة' },
          { title: 'Usability Testing & Iterative Feedback Loops', titleAr: 'اختبارات قابلية الاستخدام وحلقات التغذية الراجعة', duration: '45m', durationAr: '45 دقيقة' },
        ],
        skills: ['UX Research', 'User Interviews', 'Personas', 'Journey Mapping', 'Design Thinking'],
        enrollUrl: '/register',
      },
    ],
  },
  {
    id: 'datascience',
    name: 'Data Science',
    nameAr: 'علم البيانات',
    fullName: 'Data Science & Analytics',
    fullNameAr: 'علم وتحليل البيانات',
    courseCount: 7,
    iconType: 'chart',
    courses: [
      {
        id: 'python-data-analytics',
        categoryId: 'datascience',
        title: 'Python for Data Analysis & Pandas',
        titleAr: 'تحليل البيانات باستخدام بايثون وPandas',
        duration: '9 hours',
        durationAr: '9 ساعات',
        level: 'Intermediate',
        levelAr: 'متوسط',
        enrolledCount: '10,900 enrolled',
        enrolledCountAr: '10,900 مسجل',
        certificate: 'Yes',
        certificateAr: 'نعم',
        thumbnailType: 'python',
        description:
          'Analyze real business datasets with Python, Pandas, NumPy, and Seaborn. Learn data cleaning, exploratory analysis, and visual dashboard generation.',
        descriptionAr:
          'تحليل مجموعات بيانات حقيقية باستخدام Python وPandas وNumPy. تعلم تنظيف البيانات، والتحليل الاستكشافي، وتوليد الرسوم البيانية التفاعلية.',
        learningOutcomes: [
          'Clean, transform, and aggregate raw datasets',
          'Perform statistical analysis on real-world numbers',
          'Create compelling data visualizations',
          'Automate data preparation pipelines',
        ],
        learningOutcomesAr: [
          'تنظيف ومعالجة وتجميع البيانات الخام بكفاءة',
          'إجراء التحليلات الإحصائية على بيانات واقعية',
          'تصميم رسوم بيانية تفاعلية تدعم اتخاذ القرار',
          'أتمتة خطوط تجهيز وتحضير البيانات',
        ],
        prerequisites: ['Basic Python programming syntax'],
        prerequisitesAr: ['أساسيات لغة بايثون البرمجية'],
        curriculum: [
          { title: 'Python Refresher for Data Practitioners', titleAr: 'مراجعة سريعة لبايثون لمحللي البيانات', duration: '40m', durationAr: '40 دقيقة' },
          { title: 'Pandas DataFrames, Series & Data Cleaning', titleAr: 'مكتبة Pandas وتنظيف وتجهيز البيانات', duration: '65m', durationAr: '65 دقيقة' },
          { title: 'Statistical Aggregations & Pivot Tables', titleAr: 'التحليلات الإحصائية والجداول المحورية', duration: '55m', durationAr: '55 دقيقة' },
          { title: 'Exploratory Visualization with Seaborn', titleAr: 'التحليل الاستكشافي المرئي عبر Seaborn', duration: '50m', durationAr: '50 دقيقة' },
        ],
        skills: ['Python', 'Pandas', 'NumPy', 'Data Cleaning', 'Data Viz'],
        enrollUrl: '/register',
      },
      {
        id: 'machine-learning-foundations',
        categoryId: 'datascience',
        title: 'Machine Learning Foundations with Scikit-Learn',
        titleAr: 'أساسيات تعلم الآلة باستخدام Scikit-Learn',
        duration: '8 hours',
        durationAr: '8 ساعات',
        level: 'Intermediate',
        levelAr: 'متوسط',
        enrolledCount: '7,340 enrolled',
        enrolledCountAr: '7,340 مسجل',
        certificate: 'Yes',
        certificateAr: 'نعم',
        thumbnailType: 'python',
        description:
          'Understand machine learning algorithms from regression and classification to clustering, model evaluation, cross-validation, and hyperparameter tuning.',
        descriptionAr:
          'فهم خوارزميات تعلم الآلة من الانحدار والتصنيف إلى التجميع العنقودي، وتقييم النماذج، وضبط المعلمات الفائقة Hyperparameters.',
        learningOutcomes: [
          'Implement supervised classification and regression models',
          'Evaluate models using Precision, Recall, F1, and ROC-AUC',
          'Perform feature engineering and feature scaling',
          'Tune hyperparameters with GridSearchCV',
        ],
        learningOutcomesAr: [
          'بناء وتدريب نماذج التعلم الخاضع للإشراف Supervised Learning',
          'تقييم أداء النماذج عبر مقاييس Precision وRecall وROC-AUC',
          'هندسة وتجهيز الخصائص Feature Scaling بكفاءة',
          'ضبط المعلمات الفائقة للنماذج عبر GridSearchCV',
        ],
        prerequisites: ['Python basics and basic statistics understanding'],
        prerequisitesAr: ['معرفة بأساسيات بايثون والمبادئ الإحصائية'],
        curriculum: [
          { title: 'ML Pipeline & Supervised vs Unsupervised', titleAr: 'مسار بناء نماذج تعلم الآلة وأنواع التعلم', duration: '45m', durationAr: '45 دقيقة' },
          { title: 'Linear & Logistic Regression Implementations', titleAr: 'الانحدار الخطي واللوجستي وتطبيقاتهما', duration: '55m', durationAr: '55 دقيقة' },
          { title: 'Decision Trees, Random Forests & Ensemble Methods', titleAr: 'أشجار القرار والغابات العشوائية Random Forests', duration: '60m', durationAr: '60 دقيقة' },
          { title: 'Model Evaluation Metrics & Cross-Validation', titleAr: 'مقاييس تقييم النماذج والتحقق المتقاطع CV', duration: '50m', durationAr: '50 دقيقة' },
        ],
        skills: ['Machine Learning', 'Scikit-Learn', 'Classification', 'Regression'],
        enrollUrl: '/register',
      },
    ],
  },
  {
    id: 'mobile',
    name: 'Mobile',
    nameAr: 'تطبيقات الهاتف',
    fullName: 'Mobile App Development',
    fullNameAr: 'تطوير تطبيقات الهواتف',
    courseCount: 6,
    iconType: 'mobile',
    courses: [
      {
        id: 'flutter-cross-platform',
        categoryId: 'mobile',
        title: 'Flutter & Dart: Cross-Platform Apps',
        titleAr: 'برمجة تطبيقات الهاتف عبر Flutter وDart',
        duration: '10 hours',
        durationAr: '10 ساعات',
        level: 'Beginner to Intermediate',
        levelAr: 'مبتدئ إلى متوسط',
        enrolledCount: '8,750 enrolled',
        enrolledCountAr: '8,750 مسجل',
        certificate: 'Yes',
        certificateAr: 'نعم',
        thumbnailType: 'flutter',
        description:
          'Build beautiful native iOS and Android apps with a single codebase using Flutter, widget state management, offline storage, and REST APIs.',
        descriptionAr:
          'بناء تطبيقات هواتف ذكية مميزة لنظامي iOS وAndroid بقاعدة شيفرة موحدة باستخدام Flutter وإدارة الحالة والربط مع الخوادم.',
        learningOutcomes: [
          'Construct responsive mobile UIs with Flutter widgets',
          'Manage application state with Provider or Riverpod',
          'Fetch and cache remote data over HTTP APIs',
          'Prepare apps for deployment to the App Store and Google Play',
        ],
        learningOutcomesAr: [
          'بناء واجهات هواتف متجاوبة وسلسة عبر Widgets',
          'إدارة حالة التطبيق باستخدام أحدث الحلول',
          'استدعاء وتخزين البيانات السحابية محلياً',
          'تجهيز التطبيقات للنشر على App Store وGoogle Play',
        ],
        prerequisites: ['Basic object-oriented programming concepts'],
        prerequisitesAr: ['مبادئ البرمجة كائنية التوجه (OOP)'],
        curriculum: [
          { title: 'Dart Fundamentals & The Widget Hierarchy', titleAr: 'أساسيات Dart وهيكلية شجرة الـ Widgets', duration: '45m', durationAr: '45 دقيقة' },
          { title: 'Stateful vs Stateless Widgets & Animation', titleAr: 'المكونات متغيرة وثابتة الحالة والتحريك', duration: '55m', durationAr: '55 دقيقة' },
          { title: 'Connecting REST APIs & Local SQLite Storage', titleAr: 'ربط واجهات APIs والتخزين المحلي عبر SQLite', duration: '60m', durationAr: '60 دقيقة' },
          { title: 'Native Builds for Android & iOS Production', titleAr: 'إنتاج حزم التطبيقات لنظامي أندرويد وiOS', duration: '50m', durationAr: '50 دقيقة' },
        ],
        skills: ['Flutter', 'Dart', 'State Management', 'Mobile UI', 'REST APIs'],
        enrollUrl: '/register',
      },
      {
        id: 'react-native-mobile-apps',
        categoryId: 'mobile',
        title: 'React Native & Expo: Native Apps',
        titleAr: 'تطوير تطبيقات الهواتف عبر React Native وExpo',
        duration: '9 hours',
        durationAr: '9 ساعات',
        level: 'Intermediate',
        levelAr: 'متوسط',
        enrolledCount: '9,100 enrolled',
        enrolledCountAr: '9,100 مسجل',
        certificate: 'Yes',
        certificateAr: 'نعم',
        thumbnailType: 'react',
        description:
          'Leverage your React skills to build native mobile experiences with React Native, Expo Router, device sensors, camera access, and push notifications.',
        descriptionAr:
          'وظّف خبرتك في React لبناء تطبيقات هواتف ذكية حقيقية باستخدام React Native وExpo Router والحساسات والإشعارات الفورية.',
        learningOutcomes: [
          'Build cross-platform screens with React Native primitives',
          'Implement file-based navigation with Expo Router',
          'Access device camera, location, and storage APIs',
          'Deliver smooth 60fps animations with Reanimated',
        ],
        learningOutcomesAr: [
          'بناء شاشات متوافقة مع النظامين بمكونات React Native الأصلية',
          'تطبيق التوجيه القائم على الملفات عبر Expo Router',
          'استخدام كاميرا الجهاز، والموقع الجغرافي، والتخزين المحلي',
          'إنشاء تحريكات فائقة السلاسة بمعدل 60 إطار في الثانية',
        ],
        prerequisites: ['Solid React and JavaScript fundamentals'],
        prerequisitesAr: ['معرفة متينة بـ React وجافاسكريبت'],
        curriculum: [
          { title: 'Expo Tooling & Project Architecture', titleAr: 'بيئة عمل Expo وهيكلية مشاريع التطبيقات', duration: '40m', durationAr: '40 دقيقة' },
          { title: 'Native Components & Flexbox Layouts', titleAr: 'المكونات الأصلية وتخطيطات Flexbox للشاشات', duration: '50m', durationAr: '50 دقيقة' },
          { title: 'Expo Router & Deep Linking Navigation', titleAr: 'التوجيه عبر Expo Router والروابط العميقة', duration: '55m', durationAr: '55 دقيقة' },
          { title: 'AsyncStorage & Native Device APIs', titleAr: 'التخزين المحلي وواجهات أجهزة الهواتف الذكية', duration: '50m', durationAr: '50 دقيقة' },
        ],
        skills: ['React Native', 'Expo', 'Mobile Navigation', 'Mobile APIs'],
        enrollUrl: '/register',
      },
    ],
  },
];
