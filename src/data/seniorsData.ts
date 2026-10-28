import type { SeniorProfile } from '@/types/senior';

export const SENIORS_DATA: SeniorProfile[] = [
  {
    id: 'elena-chen',
    name: 'Elena Chen',
    nameAr: 'إيلينا تشن',
    role: 'Staff Frontend Architect',
    roleAr: 'كبيرة مهندسي الواجهات الأمامية',
    company: 'CloudScale Systems (Demo)',
    companyAr: 'أنظمة كلاود سكيل (تجريبي)',
    category: 'frontend',
    specialization: 'Design Systems & Modern React Architecture',
    specializationAr: 'أنظمة التصميم وبنية تطبيقات React المتقدمة',
    yearsOfExperience: 6,
    location: 'San Francisco, CA (Remote)',
    locationAr: 'سان فرانسيسكو، كاليفورنيا (عن بُعد)',
    avatar: '/images/avatar-elena-figma.png',
    avatarFallback: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=80',
    shortBio:
      'Pioneered scalable frontend architectures and component systems used by 250k+ daily developers. Passionate about web performance and accessibility.',
    shortBioAr:
      'قادت بناء بنى الواجهات الأمامية المتقدمة وأنظمة المكونات التي يعتمد عليها أكثر من 250 ألف مطور يومياً. شغوفة بأداء الويب وإمكانية الوصول.',
    skills: ['React 19', 'TypeScript', 'Next.js', 'Tailwind CSS', 'Performance Optimization', 'Design Systems'],
    toolsAndTech: ['React', 'TypeScript', 'Vite', 'GraphQL', 'Storybook', 'Vitest', 'Figma', 'Radix UI'],
    linkedinUrl: 'https://www.linkedin.com/in/fictional-elena-chen',
    portfolioUrl: 'https://demo-portfolio.internshub.dev/elena-chen',
    githubUrl: 'https://github.com/fictional-elena-chen',
    highlightQuote:
      'Frameworks come and go every few years, but deep mastery of the browser DOM and JavaScript event loop never expires.',
    highlightQuoteAr:
      'أطر العمل تتغير باستمرار، ولكن فهمك العميق لكيفية عمل المتصفح ومحرك جافاسكريبت هو الاستثمار الذي لا يفقد قيمته أبداً.',
    stats: {
      yearsExp: 6,
      projectsCompleted: 34,
      menteesGuided: 19,
    },
    story: {
      beginning: {
        title: 'The Beginning: From Stumbling into HTML to Building My First Site',
        titleAr: 'البداية: من التعثر في HTML إلى إطلاق أول موقع',
        content:
          'I graduated with a degree in environmental science, but felt magnetically drawn to how websites communicated scientific data to the public. I began self-studying HTML and CSS during late evenings after my day job. My very first website was an interactive carbon footprint calculator—it was buggy, messy, and broke completely on mobile screens, but seeing code render into an interactive visual in the browser was the spark that ignited my career change.',
        contentAr:
          'تخرجت في تخصص العلوم البيئية، لكنني شعرت بانجذاب كبير نحو كيفية توصيل البيانات العلمية للمستخدمين عبر الويب. بدأت التعلم الذاتي لتقنيات HTML وCSS في المساء بعد انتهاء دوامي. كان أول موقع صنعته حاسبة تفاعلية للبصمة الكربونية؛ كانت مليئة بالأخطاء وتتعطل على شاشات الهواتف، ولكن رؤية السطور البرمجية تتحول إلى تجربة حية على الشاشة كانت الشرارة الأولى.',
        keyHighlight: 'Started with zero computer science background, driven entirely by curiosity.',
        keyHighlightAr: 'بدأت دون أي خلفية أكاديمية في علوم الحاسوب، وكان الفضول والشغف هما الدافع الأكبر.',
      },
      challenges: {
        title: 'The Challenges: The Wall of Imposter Syndrome and State Management',
        titleAr: 'التحديات: صدمة متلازمة المحتال وتعقيدات إدارة الحالة',
        content:
          'When I moved beyond simple HTML and CSS into JavaScript and React, I hit what felt like an impossible wall. Props drilling, asynchronous data fetching, and re-rendering loops caused bugs I could not explain. I remember staring at an unresponsive screen before a mock technical interview, convinced I was not smart enough for tech. I failed three junior interviews in a row because I could not explain the difference between the virtual DOM and the browser DOM.',
        contentAr:
          'عندما انتقلت من الأساسيات البسيطة إلى JavaScript وReact، اصطدمت بحاجز بدا مستحيلاً. تسببت تعقيدات تمرير البيانات والطلبات غير المتزامنة وحلقات إعادة الرندرة في أخطاء لم أستطع تفسيرها. رُفضت في 3 مقابلات عمل متتالية لأنني عجزت عن شرح آلية عمل Virtual DOM مقارنة بـ Real DOM.',
        keyHighlight: 'Failing early interviews forced me to stop copying snippets and truly understand mechanics.',
        keyHighlightAr: 'الفشل في المقابلات الأولى دفعني للتوقف عن نسخ الأكواد والبدء في فهم الأسس العميقة.',
      },
      turningPoint: {
        title: 'The Turning Point: My First Open-Source Pull Request and a Mentor’s Review',
        titleAr: 'نقطة التحول: أول مساهمة مفتوحة المصدر ومراجعة كود غيرت مساري',
        content:
          'The turning point came when I joined an open-source UI accessibility library. I submitted a tiny pull request to fix keyboard focus trapping in modal dialogs. The project maintainer gave me a 15-comment code review that tore apart my code with incredible kindness and precision. Instead of feeling defensive, I spent an entire weekend studying their feedback. That interaction showed me how professional software engineers think about edge cases, defensive coding, and maintainability.',
        contentAr:
          'حدثت نقطة التحول عندما انضممت لمكتبة مفتوحة المصدر تركز على إمكانية الوصول (Accessibility). قدمت مساهمة برمجية لإصلاح تنقل لوحة المفاتيح داخل النوافذ المنبثقة. كتب لي المشرف 15 ملاحظة برمجية دقيقة بروح توجيهية ملهمة. دراسة تلك الملاحظات علمتني كيف يفكر المهندسون المحترفون في الحالات الاستثنائية وجودة الشيفرة.',
        keyHighlight: 'Receiving honest, rigorous code reviews transformed how I structured application code.',
        keyHighlightAr: 'المراجعات البرمجية الحقيقية علمتني بناء بنى برمجية قابلة للتوسع والصيانة.',
      },
      growth: {
        title: 'The Growth: Scaling From Junior Builder to Systems Thinker',
        titleAr: 'مرحلة النمو: الانتقال من مطور مبتدئ إلى مهندس أنظمة متكاملة',
        content:
          'I landed my first full-time engineering role at a 20-person B2B startup. I took ownership of our messy CSS files and proposed unifying them into a clean Tailwind and token-based design system. Over the next two years, I led the migration of a legacy single-page app to Next.js with Server Components, slashing page load times from 4.2 seconds to 800 milliseconds and boosting user engagement by 40%.',
        contentAr:
          'حصلت على أول وظيفة بدوام كامل في شركة ناشئة تضم 20 موظفاً. بادرت بتنظيم ملفات التنسيق الفوضوية واقترحت توحيدها في نظام تصميم مبني على Tailwind والرموز القياسية. على مدار عامين، قدت عملية تحديث تطبيق كامل إلى Next.js، مما خفض وقت التحميل من 4.2 ثانية إلى 800 مللي ثانية.',
        keyHighlight: 'Measurable business impact (speed, conversion, team velocity) matters more than shiny libraries.',
        keyHighlightAr: 'الأثر الحقيقي على سرعة النظام وإنتاجية الفريق أهم بكثير من مجرد تجربة أحدث الأدوات.',
      },
      whereNow: {
        title: 'Where I Am Today: Leading Architectural Decisions and Mentoring',
        titleAr: 'أين أقف اليوم: قيادة القرارات المعمارية وتوجيه الجيل الجديد',
        content:
          'Today, I work as a Staff Frontend Architect at CloudScale. I spend half my week designing architectural patterns for 40+ product engineers, reviewing cross-team RFCs, and establishing accessibility standards. The other half is spent 1-on-1 mentoring early-career engineers and running workshop labs on modern React internals.',
        contentAr:
          'أعمل اليوم ككبيرة مهندسي الواجهات في CloudScale. أقضي نصف وقتي في تصميم البنى التحتية والتأكد من معايير إمكانية الوصول لأكثر من 40 مهندساً، والنصف الآخر في التوجيه الفردي للكوادر الصاعدة وإقامة ورش العمل التخصصية.',
        keyHighlight: 'Seniority is measured by how much you elevate the engineers around you.',
        keyHighlightAr: 'تقاس الخبرة الحقيقية بمدى قدرتك على مساعدة الفريق المحيط بك على النجاح والنمو.',
      },
      adviceForBeginners: {
        title: 'Advice for Beginners: Five Rules I Wish Someone Told Me on Day 1',
        titleAr: 'نصائح للمبتدئين: قواعد ذهبية تمنيت لو عرفتها في بداية مشواري',
        content:
          '1. Master JavaScript fundamentals before diving into heavy frameworks.\n2. Never code in isolation—share your small projects publicly and ask for code reviews.\n3. Learn to read error traces line-by-line instead of immediately copying errors into search engines.\n4. Build things with accessibility in mind from day one; it makes you a dramatically better engineer.\n5. Consistency beats weekend cramming every single time.',
        contentAr:
          '1. أتقن أساسيات JavaScript العميقة قبل القفز لأحدث أطر العمل.\n2. لا تبرمج بمفردك في الظل—شارك مشاريعك الصغيرة واطلب مراجعات الكود.\n3. تعلم قراءة رسائل الأخطاء سطرًا بسطر لفهم جذر المشكلة.\n4. صمم وبرمج مع مراعاة إمكانية الوصول لجميع المستخدمين منذ اليوم الأول.\n5. الالتزام اليومي لمدة 45 دقيقة يتفوق دائماً على الدراسة المتقطعة لعدة ساعات.',
        keyHighlight: 'Treat debugging as a detective story, not a frustrating chore.',
        keyHighlightAr: 'انظر لاكتشاف الأخطاء كتحقيق شيّق يبني خبرتك التراكمية.',
      },
    },
    timeline: [
      {
        stage: 'Stage 1: Discovery',
        stageAr: 'المرحلة 1: الاكتشاف',
        period: '2019',
        periodAr: '2019',
        title: 'First Code & Self-Taught Foundations',
        titleAr: 'أول سطر برمجي والتعلم الذاتي',
        role: 'Self-Taught Student',
        roleAr: 'متعلمة ذاتية',
        companyOrOrg: 'Self-Study & FreeCodeCamp',
        companyOrOrgAr: 'دراسة ذاتية ومصادر مفتوحة',
        description: 'Learned HTML, CSS, and basic JavaScript by building small utility calculators and landing pages.',
        descriptionAr: 'تعلمت أساسيات الويب عبر بناء حاسبات بسيطة وصفحات هبوط تفاعلية.',
        type: 'start',
        skillsAcquired: ['HTML5', 'CSS3', 'Basic JS', 'Git'],
      },
      {
        stage: 'Stage 2: The Crucible',
        stageAr: 'المرحلة 2: التجربة والتحدي',
        period: '2020',
        periodAr: '2020',
        title: 'First Interactive Web Apps & Setbacks',
        titleAr: 'أول تطبيق ويب تفاعلي ومواجهة العقبات',
        role: 'Frontend Apprentice',
        roleAr: 'متدربة واجهات أمامية',
        companyOrOrg: 'Community Projects',
        companyOrOrgAr: 'مشاريع مجتمعية مفتوحة',
        description: 'Encountered state management bugs, conquered React hooks, and built accessible modal components.',
        descriptionAr: 'واجهت تحديات إدارة الحالة وأتقنت React Hooks مع تطبيق معايير إمكانية الوصول.',
        type: 'challenge',
        skillsAcquired: ['React', 'JavaScript ES6+', 'DOM API', 'Accessibility (a11y)'],
      },
      {
        stage: 'Stage 3: First Real Role',
        stageAr: 'المرحلة 3: أول خطوة مهنية',
        period: '2021 - 2022',
        periodAr: '2021 - 2022',
        title: 'Junior Frontend Developer',
        titleAr: 'مطورة واجهات أمامية مبتدئة',
        companyOrOrg: 'Nexus B2B SaaS',
        companyOrOrgAr: 'نيكسوس للحلول السحابية',
        description: 'Contributed to client dashboards, built responsive tables, and advocated for automated frontend testing.',
        descriptionAr: 'شاركت في بناء لوحات التحكم للمستخدمين، وتطوير الجداول التفاعلية واختبارات الواجهات.',
        type: 'internship',
        skillsAcquired: ['TypeScript', 'Tailwind CSS', 'React Query', 'Jest'],
      },
      {
        stage: 'Stage 4: Architecture & Speed',
        stageAr: 'المرحلة 4: هندسة النظم والأداء',
        period: '2023 - 2024',
        periodAr: '2023 - 2024',
        title: 'Senior Frontend Engineer',
        titleAr: 'مهندسة واجهات أولى',
        companyOrOrg: 'Verve Technologies',
        companyOrOrgAr: 'تقنيات فيرف',
        description: 'Led modern Next.js migration, reduced LCP by 68%, and designed shared component system.',
        descriptionAr: 'قادت الانتقال إلى Next.js وخفضت أوقات تحميل الصفحات بنسبة 68% وصممت مكتبة مكونات مشتركة.',
        type: 'breakthrough',
        skillsAcquired: ['Next.js', 'Core Web Vitals', 'Design Tokens', 'Storybook'],
      },
      {
        stage: 'Stage 5: High Impact Today',
        stageAr: 'المرحلة 5: الأثر القيادي الحالي',
        period: '2025 - Present',
        periodAr: '2025 - حتى الآن',
        title: 'Staff Frontend Architect',
        titleAr: 'كبيرة مهندسي الواجهات الأمامية',
        companyOrOrg: 'CloudScale Systems',
        companyOrOrgAr: 'أنظمة كلاود سكيل',
        description: 'Shapes enterprise frontend standards, leads multi-team frontend RFCs, and mentors junior talent.',
        descriptionAr: 'تحدد المعايير البرمجية للمؤسسة، وتقود مراجعات البنية التحتية، وتوجه الجيل الجديد من المهندسين.',
        type: 'current',
        skillsAcquired: ['System Architecture', 'Mentorship', 'React 19 Server Components', 'Web Performance'],
      },
    ],
    featuredProjects: [
      {
        title: 'CloudScale Design System',
        titleAr: 'نظام تصميم كلاود سكيل الموحد',
        description:
          'A multi-brand, fully accessible component library with 45+ enterprise-ready components, 100% test coverage, and automatic WCAG contrast validation.',
        descriptionAr:
          'مكتبة مكونات متعددة العلامات التجارية ومتوافقة بالكامل مع إمكانية الوصول، تضم أكثر من 45 عنصراً قابلاً لإعادة الاستخدام.',
        techStack: ['React', 'TypeScript', 'Tailwind CSS', 'Radix UI', 'Storybook'],
        impact: 'Cut frontend feature delivery times by 35% across 8 autonomous engineering squads.',
        impactAr: 'خفضت وقت إطلاق الميزات بنسبة 35% عبر 8 فرق هندسية مختلفة.',
        role: 'Lead Architect & Designer Liaison',
        roleAr: 'كبير المعماريين وحلقة الوصل مع فريق التصميم',
      },
      {
        title: 'Real-Time Telemetry Dashboard',
        titleAr: 'لوحة تحكم بيانات المراقبة الفورية',
        description:
          'High-throughput data visualization console rendering live websocket server health metrics at 60fps without browser jank.',
        descriptionAr:
          'منصة مرئية للبيانات الفورية تستقبل آلاف الإشارات عبر WebSocket وتعرض الرسوم البيانية بسلاسة تامة.',
        techStack: ['Next.js', 'Canvas / WebGL', 'WebSockets', 'Zustand'],
        impact: 'Enabled operations engineers to detect production anomalies 4x faster during high-load events.',
        impactAr: 'مكّنت مهندسي العمليات من رصد الأعطال أسرع بـ 4 أضعاف أثناء ضغط الخوادم.',
        role: 'Senior Performance Engineer',
        roleAr: 'مهندسة أداء أولى',
      },
    ],
    topAdvice: [
      {
        title: 'Don’t just copy components—understand their internals',
        titleAr: 'لا تكتفِ بنسخ المكونات بل افهم كيف تعمل داخلياً',
        description:
          'Take a day to build a dropdown or a modal with pure JavaScript and keyboard focus trapping. You will gain a superpower in every framework interview.',
        descriptionAr:
          'خصص يوماً لبناء قائمة منسدلة أو نافذة منبثقة بـ JavaScript خام ولوحة المفاتيح؛ هذا الفهم يمنحك أفضلية حاسمة في أي مقابلة تقنية.',
      },
      {
        title: 'Seek constructive feedback early and often',
        titleAr: 'ابحث عن النقد البنّاء مبكراً وبشكل مستمر',
        description:
          'Nothing accelerates growth like a senior engineer walking through your pull request and explaining *why* a particular pattern will fail at scale.',
        descriptionAr:
          'لا شيء يسرع تطورك مثل قيام مهندس خبير بمراجعة كودك وشرح أسباب فشل بعض الأنماط عند زيادة حجم الاستخدام.',
      },
    ],
  },
  {
    id: 'tariq-mansoor',
    name: 'Tariq Mansoor',
    nameAr: 'طارق منصور',
    role: 'Staff Full-Stack & Systems Engineer',
    roleAr: 'كبير مهندسي النظم والتطوير الشامل',
    company: 'NovaPay Financial (Demo)',
    companyAr: 'نوفا باي للمدفوعات (تجريبي)',
    category: 'fullstack',
    specialization: 'Distributed Backend Systems, Node.js & Resilient APIs',
    specializationAr: 'الأنظمة الموزعة، بيئة Node.js والواجهات البرمجية المرنة',
    yearsOfExperience: 7,
    location: 'Austin, TX (Hybrid)',
    locationAr: 'أوستن، تكساس (هجين)',
    avatar: '/images/mentor-ahmed-figma.webp',
    avatarFallback: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
    shortBio:
      'Engineered payment processing microservices handling $12M+ monthly transaction volume with 99.99% availability. Passionate about database indexing and defensive API design.',
    shortBioAr:
      'قام بهندسة خدمات الدفع المصغرة التي تعالج أكثر من 12 مليون دولار شهرياً بنسبة توافر 99.99%. شغوف بفهرسة قواعد البيانات وتصميم الواجهات البرمجية الآمنة.',
    skills: ['Node.js', 'PostgreSQL', 'TypeScript', 'Docker', 'Redis', 'Microservices'],
    toolsAndTech: ['Go', 'Node.js', 'Express', 'PostgreSQL', 'Docker', 'Kubernetes', 'Redis', 'AWS'],
    linkedinUrl: 'https://www.linkedin.com/in/fictional-tariq-mansoor',
    portfolioUrl: 'https://demo-portfolio.internshub.dev/tariq-mansoor',
    githubUrl: 'https://github.com/fictional-tariq-mansoor',
    highlightQuote:
      'Building for the happy path is easy; exceptional engineers distinguish themselves by how elegantly their systems fail and recover.',
    highlightQuoteAr:
      'البرمجة للظروف المثالية أمر سهل؛ لكن المهندس المتميز يبرز في كيفية تعامل أنظمته مع الأعطال واستعادتها للتوازن بسلاسة.',
    stats: {
      yearsExp: 7,
      projectsCompleted: 42,
      menteesGuided: 24,
    },
    story: {
      beginning: {
        title: 'The Beginning: Building Discord Bots and Curious Server Experiments',
        titleAr: 'البداية: برمجة بوتات الديسكورد وتجارب الخوادم الأولى',
        content:
          'My tech journey started in my college dorm room when I wanted to build a Discord bot to manage gaming tournaments among friends. I had learned basic C++ in class, but writing a Node.js server that listened to webhook events and responded within milliseconds completely mesmerized me. I stayed up until sunrise figuring out asynchronous event loops, JSON endpoints, and how data persisted across restarts.',
        contentAr:
          'بدأت رحلتي التقنية في السكن الجامعي عندما أردت برمجة بوت ديسكورد لتنظيم بطولات الألعاب بين الأصدقاء. درست C++ في الجامعة، ولكن بناء خادم بـ Node.js يستمع لأحداث Webhooks ويرد فورياً كان تجربة ساحرة. سهرت حتى الفجر لأفهم حلقات الأحداث واستمرارية البيانات في قواعد البيانات.',
        keyHighlight: 'Turned a hobby project into a masterclass on client-server networking.',
        keyHighlightAr: 'حوّل شغف الألعاب البسيط إلى رحلة استكشاف عميقة لبروتوكولات الخوادم والشبكات.',
      },
      challenges: {
        title: 'The Challenges: Database Deadlocks and Crashing Under Load',
        titleAr: 'التحديات: اختناقات قواعد البيانات وانهيار الخوادم تحت الضغط',
        content:
          'Early on, I believed building full-stack apps simply meant writing an API route for every button. During my first real contract, 500 concurrent users joined a flash sale on an app I built. The PostgreSQL database ground to a complete halt due to unindexed queries and unpooled connections. The customer was furious, and I spent 36 consecutive hours untangling connection pools and reading database execution plans.',
        contentAr:
          'كنت أظن في البداية أن التطوير الشامل مجرد كتابة مسار API لكل زر في الشاشة. في أول مشروع تجاري، دخل 500 مستخدم في وقت واحد؛ توقفت قاعدة بيانات PostgreSQL تماماً بسبب غياب الفهارس وسوء إدارة الاتصالات. كانت أزمة قاسية دفعتني لقضاء 36 ساعة متواصلة في تحليل خطط استعلامات SQL.',
        keyHighlight: 'A catastrophic production outage taught me humility and the paramount importance of database fundamentals.',
        keyHighlightAr: 'علمني توقف النظام المفاجئ التواضع وأهمية فهم هندسة قواعد البيانات من الجذور.',
      },
      turningPoint: {
        title: 'The Turning Point: Pairing With a Senior Database Reliability Engineer',
        titleAr: 'نقطة التحول: جلسات البرمجة الزوجية مع خبير موثوقية قواعد البيانات',
        content:
          'After that near-disaster, I requested pairing sessions with a Staff Site Reliability Engineer at my company. He spent two weeks showing me how to read `EXPLAIN ANALYZE` outputs, how B-tree indexes actually balance on disk, and how to write idempotent API operations with transaction boundaries. That mentorship demystified backend engineering from guessing to deterministic engineering.',
        contentAr:
          'بعد تلك الأزمة، طلبت جلسات عمل مع مهندس موثوقية نظم أول في الشركة. قضى معي أسبوعين يشرح لي قراءة مخرجات EXPLAIN ANALYZE، وكيفية عمل فهارس B-tree على القرص الصلب، وبناء عمليات متكررة آمنة (Idempotent APIs). نقلني ذلك من مرحلة التخمين إلى الهندسة الدقيقة.',
        keyHighlight: 'Mentorship transformed my anxiety into rigorous engineering curiosity.',
        keyHighlightAr: 'التوجيه المباشر حوّل قلقي وتوتري إلى شغف هندسي بالتحليل والدقة.',
      },
      growth: {
        title: 'The Growth: Moving From Monoliths to Event-Driven Microservices',
        titleAr: 'مرحلة النمو: الانتقال من البنى الأحادية إلى الخدمات المصغرة المبنية على الأحداث',
        content:
          'Over the following four years, I led the architectural transition of our core transaction engine. I introduced Redis caching layers, implemented asynchronous background job workers with BullMQ, and decoupled fragile HTTP dependencies using message queues. We scaled throughput from 80 requests/sec to over 4,500 requests/sec with zero downtime.',
        contentAr:
          'خلال السنوات الأربع التالية، قدت التحول المعماري لمحرك المعاملات المالية بالشركة. أدخلت طبقات التخزين المؤقت عبر Redis، ونفذت طوابير المهام الخلفية، وفصلت الاعتماديات عبر Message Queues، لترتفع قدرة المعالجة من 80 طلباً إلى أكثر من 4500 طلب في الثانية دون أي توقف.',
        keyHighlight: 'Simplicity and observability trump premature complexity every time.',
        keyHighlightAr: 'بساطة الحل وقابلية مراقبته ورصده أهم بكثير من تعقيد البنية قبل أوانها.',
      },
      whereNow: {
        title: 'Where I Am Today: Staff Engineer & Guardian of Platform Resilience',
        titleAr: 'أين أقف اليوم: مهندس نظم أول وحامي استقرار المنصة',
        content:
          'At NovaPay, I oversee the financial integration platform. I write architectural design docs, review database schema migrations, and design disaster recovery drills (Chaos Engineering). I also mentor five junior and mid-level engineers each quarter, helping them build intuition for backend debugging and secure code practices.',
        contentAr:
          'أشرف اليوم في NovaPay على منصة الربط المالي. أكتب وثائق التصميم المعماري، وأراجع تحديثات قواعد البيانات، وأشرف على محاكاة سيناريوهات الأعطال لضمان الصمود. كما أوجه 5 مهندسين كل ثلاثة أشهر لاكتساب مهارات البرمجة الآمنة.',
        keyHighlight: 'Great backend engineers build systems that let everyone on the team sleep soundly at night.',
        keyHighlightAr: 'المهندس المتميز هو من يبني أنظمة تجعل أعضاء الفريق ينامون باطمئنان دون خوف من انهيار السيرفرات.',
      },
      adviceForBeginners: {
        title: 'Advice for Beginners: Concrete Rules for Aspiring Backend & Full-Stack Developers',
        titleAr: 'نصائح للمبتدئين: توجيهات عملية لكل من يطمح للتخصص في الباك إند',
        content:
          '1. Don’t rush past raw SQL—ORMs are great tools, but you cannot optimize what you do not understand.\n2. Write unit and integration tests early; they are your safety harness when refactoring.\n3. Learn HTTP status codes, headers, and idempotency keys inside and out.\n4. Run your applications locally inside Docker containers so your environment mirrors production.\n5. Always ask: "What happens if this database or third-party API is down for 10 minutes?"',
        contentAr:
          '1. لا تهمل تعلم SQL الخام؛ أطر ORM ممتازة لكنك لن تتمكن من تسريع ما لا تفهمه.\n2. اكتب الاختبارات البرمجية من البداية، فهي صمام أمانك عند تعديل الكود.\n3. افهم بروتوكول HTTP وأكواد الاستجابة والتعامل مع العمليات المتكررة بعمق.\n4. شغّل تطبيقاتك داخل Docker محلياً لتشابه بيئة الإنتاج الحقيقية.\n5. اسأل نفسك دائماً: "ماذا سيحدث لنظامي إذا توقفت الخدمة الخارجية أو قاعدة البيانات لمدة 10 دقائق؟"',
        keyHighlight: 'Design for failure from the very first line of code.',
        keyHighlightAr: 'صمم نظامك ليتعامل مع الأعطال منذ اللحظة الأولى لكتابة الكود.',
      },
    },
    timeline: [
      {
        stage: 'Stage 1: The Spark',
        stageAr: 'المرحلة 1: الشرارة الأولى',
        period: '2018',
        periodAr: '2018',
        title: 'Scripting, Bots & First Web APIs',
        titleAr: 'البرمجة النصية وبناء البوتات والواجهات البرمجية',
        role: 'Student Programmer',
        roleAr: 'مبرمج جامعي',
        companyOrOrg: 'Self-Directed & Campus Projects',
        companyOrOrgAr: 'مشاريع جامعية وتطوير شخصي',
        description: 'Built automated web scrapers and Discord bot backends with Node.js and SQLite.',
        descriptionAr: 'برمج أدوات جمع بيانات آلية وبوتات ديسكورد معتمدة على Node.js وSQLite.',
        type: 'start',
        skillsAcquired: ['Node.js', 'Express', 'JavaScript', 'SQLite', 'Git'],
      },
      {
        stage: 'Stage 2: The Fire Test',
        stageAr: 'المرحلة 2: اختبار النيران',
        period: '2019 - 2020',
        periodAr: '2019 - 2020',
        title: 'Junior Backend Developer',
        titleAr: 'مطور واجهات خلفية مبتدئ',
        companyOrOrg: 'OmniCart E-Commerce',
        companyOrOrgAr: 'أومني كارت للتجارة الإلكترونية',
        description: 'Survived major database scaling bottlenecks during holiday traffic, mastered SQL indexing and transactions.',
        descriptionAr: 'تجاوز أزمات ضغط الزوار الكثيف في مواسم التسوق وأتقن فهارس SQL والمعاملات المالية.',
        type: 'challenge',
        skillsAcquired: ['PostgreSQL', 'SQL Indexing', 'Redis', 'Connection Pooling'],
      },
      {
        stage: 'Stage 3: Full-Stack Expansion',
        stageAr: 'المرحلة 3: التطوير الشامل',
        period: '2021 - 2022',
        periodAr: '2021 - 2022',
        title: 'Full-Stack Software Engineer',
        titleAr: 'مهندس برمجيات شامل (Full-Stack)',
        companyOrOrg: 'FinTech Pulse',
        companyOrOrgAr: 'فين تك بلس',
        description: 'Built end-to-end payment dashboards with React and Node.js microservices, introduced Dockerized CI workflows.',
        descriptionAr: 'بنى لوحات مدفوعات متكاملة بـ React وخدمات Node.js مع بيئات عمل مؤتمتة عبر Docker.',
        type: 'breakthrough',
        skillsAcquired: ['TypeScript', 'Docker', 'GraphQL', 'AWS ECS', 'Jest & Supertest'],
      },
      {
        stage: 'Stage 4: Distributed Systems',
        stageAr: 'المرحلة 4: الأنظمة الموزعة',
        period: '2023 - 2024',
        periodAr: '2023 - 2024',
        title: 'Senior Systems Engineer',
        titleAr: 'مهندس نظم أول',
        companyOrOrg: 'NovaPay Financial',
        companyOrOrgAr: 'نوفا باي المالية',
        description: 'Designed event-driven message architectures with Kafka and Redis Streams, achieving sub-40ms P99 latency.',
        descriptionAr: 'صمم بنى قائمة على الأحداث عبر Kafka وRedis Streams محققاً سرعة استجابة فائقة تحت 40 مللي ثانية.',
        type: 'breakthrough',
        skillsAcquired: ['Distributed Systems', 'Apache Kafka', 'Go', 'Kubernetes'],
      },
      {
        stage: 'Stage 5: High Scale Leadership',
        stageAr: 'المرحلة 5: القيادة التقنية والموثوقية',
        period: '2025 - Present',
        periodAr: '2025 - حتى الآن',
        title: 'Staff Full-Stack & Systems Engineer',
        titleAr: 'كبير مهندسي النظم والتطوير الشامل',
        companyOrOrg: 'NovaPay Financial',
        companyOrOrgAr: 'نوفا باي المالية',
        description: 'Sets system reliability standards, reviews high-risk database migrations, and mentors engineering teams.',
        descriptionAr: 'يضع معايير استقرار المنصة، ويشرف على ترحيل قواعد البيانات الكبرى، ويدرب المهندسين.',
        type: 'current',
        skillsAcquired: ['System Reliability', 'Capacity Planning', 'Technical Mentorship', 'API Security'],
      },
    ],
    featuredProjects: [
      {
        title: 'NovaPay Instant Settlement Engine',
        titleAr: 'محرك التسويات الفورية في نوفا باي',
        description:
          'Distributed, double-entry ledger settlement service processing over 150,000 transactions daily with atomic balance guarantees.',
        descriptionAr:
          'نظام تسويات دفترية مزدوجة موزع يعالج أكثر من 150 ألف معاملة مالية يومياً مع ضمان كامل لدقة الأرصدة.',
        techStack: ['Node.js', 'PostgreSQL', 'Redis', 'Docker', 'BullMQ'],
        impact: 'Reduced transaction dispute resolution times from 4 hours to less than 90 seconds.',
        impactAr: 'خفض زمن تسوية النزاعات المالية من 4 ساعات إلى أقل من 90 ثانية.',
        role: 'Lead Architect',
        roleAr: 'كبير المعماريين التقنيين',
      },
      {
        title: 'Resilient Webhook Gateway',
        titleAr: 'بوابة إشعارات الويب هوك المرنة',
        description:
          'Fault-tolerant webhook delivery pipeline with exponential backoff retries, signature verification, and automated dead-letter alerting.',
        descriptionAr:
          'منظومة لتسليم إشعارات Webhook مع إعادة المحاولة الذكية والتحقق من التوقيع الرقمي والتنبيه التلقائي.',
        techStack: ['TypeScript', 'Express', 'Redis Streams', 'PostgreSQL'],
        impact: 'Maintained 99.999% webhook delivery success across 400+ partner merchants.',
        impactAr: 'حققت نسبة نجاح تسليم 99.999% عبر أكثر من 400 متجر شريك.',
        role: 'Senior Backend Engineer',
        roleAr: 'مهندس واجهات خلفية أول',
      },
    ],
    topAdvice: [
      {
        title: 'Understand the lifecycle of a single network request',
        titleAr: 'افهم دورة حياة طلب الشبكة بدقة من المتصفح إلى القرص',
        description:
          'Track a request from DNS lookup, SSL handshake, reverse proxy, API middleware, SQL query, to JSON serialization. You will be able to diagnose any production bug.',
        descriptionAr:
          'تتبع الطلب من فحص DNS ومصافحة SSL وعبر الخادم الوسيط واستعلام SQL حتى إرجاع النتيجة. هذا الفهم يمكنك من حل أي عطل مستعصٍ.',
      },
      {
        title: 'Write code for the human engineer who will debug it at 3 AM',
        titleAr: 'اكتب الكود للمهندس الذي سيقوم بفحصه في الثالثة فجراً',
        description:
          'Clever, deeply nested one-liners look smart today and cause disasters during next week’s incident. Clear and readable is always better than clever.',
        descriptionAr:
          'الأكواد المعقدة والمختصرة بذكاء تبدو مبهرة اليوم ولكنها تسبب كوارث عند حدوث خلل؛ البساطة والوضوح يتفوقان دائماً.',
      },
    ],
  },
  {
    id: 'maya-lin',
    name: 'Maya Lin',
    nameAr: 'مايا لين',
    role: 'Lead Product & Interaction Designer',
    roleAr: 'قائدة تصميم المنتجات والتفاعل الرقمي',
    company: 'Apex Design Studio (Demo)',
    companyAr: 'استوديو أبيكس للتصميم (تجريبي)',
    category: 'design',
    specialization: 'Design Systems, User Research & Design-to-Code Feasibility',
    specializationAr: 'أنظمة التصميم، أبحاث المستخدم ومواءمة التصميم مع الكود',
    yearsOfExperience: 5,
    location: 'New York, NY (Hybrid)',
    locationAr: 'نيويورك، نيويورك (هجين)',
    avatar: '/images/avatar-maya-figma.png',
    avatarFallback: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=600&q=80',
    shortBio:
      'Transforms complex business workflows into delightful, human-centered digital interfaces. Bridges the gap between visual craft and frontend engineering reality.',
    shortBioAr:
      'تحول إجراءات الأعمال المعقدة إلى واجهات رقمية سهلة وممتعة للمستخدم. تبني الجسور بين الجماليات البصرية والجدوى الهندسية للواجهات.',
    skills: ['Figma', 'Design Systems', 'User Research', 'Design Tokens', 'Prototyping', 'Accessibility (WCAG)'],
    toolsAndTech: ['Figma', 'FigJam', 'Tokens Studio', 'HTML/CSS', 'Miro', 'UserTesting', 'Principle'],
    linkedinUrl: 'https://www.linkedin.com/in/fictional-maya-lin',
    portfolioUrl: 'https://demo-portfolio.internshub.dev/maya-lin',
    githubUrl: 'https://github.com/fictional-maya-lin',
    highlightQuote:
      'A design is not finished when there is nothing left to add, but when there is nothing left that confuses the user or burdens the developer.',
    highlightQuoteAr:
      'لا يكتمل التصميم عندما لا يتبقى شيء لتضيفه، بل عندما لا يتبقى شيء يُربك المستخدم أو يُثقل كاهل المطور.',
    stats: {
      yearsExp: 5,
      projectsCompleted: 28,
      menteesGuided: 16,
    },
    story: {
      beginning: {
        title: 'The Beginning: From Graphic Posters to Interactive Digital Products',
        titleAr: 'البداية: من الملصقات المطبوعة إلى واجهات المنتجات الرقمية',
        content:
          'I studied graphic design and typography in college, crafting print posters and brand identities. While I loved visual balance and color harmony, I felt frustrated by how static print felt. In 2020, I watched a friend struggle with an incomprehensible hospital booking app. That sparked an obsession: why are so many everyday digital tools confusing? I opened Figma, started redesigning that healthcare workflow, and fell in love with interaction design.',
        contentAr:
          'درست التصميم الجرافيكي والخطوط في الجامعة وصممت الهويات البصرية والملصقات المطبوعة. ورغم حبي للتوازن البصري، أحسست بمحدودية المطبوعات الثابتة. في 2020، رأيت صديقاً يعاني لحجز موعد في تطبيق طبي معقد؛ دفعني ذلك للتساؤل: لماذا الأدوات الرقمية صعبة الاستخدام؟ فتحت Figma وأعدت تصميم تجربة الحجز، وبدأت رحلتي مع تصميم تجربة المستخدم.',
        keyHighlight: 'Driven by empathy for real people struggling with confusing software.',
        keyHighlightAr: 'انطلقت مدفوعة بالتعاطف مع المستخدمين الذين يواجهون صعوبة في البرامج المعقدة.',
      },
      challenges: {
        title: 'The Challenges: Pretty Dribbble Concepts vs. Real Engineering Constraints',
        titleAr: 'التحديات: تصاميم دريبل الجذابة في مواجهة واقع البرمجة الحقيقي',
        content:
          'My early portfolio was full of gorgeous, gradient-heavy Dribbble mockups with floating glass cards and microscopic gray text. When I got my first junior contract, the senior developer looked at my Figma file and said: "This looks lovely, but none of these contrast ratios pass accessibility standards, and this animation will melt the user\'s mobile processor." I felt heartbroken and embarrassed, but that critique was the single most valuable lesson of my career.',
        contentAr:
          'كان معرض أعمالي الأول مليئاً بتصاميم جذابة بنمط Dribbble مع خلفيات زجاجية ونصوص رمادية دقيقة. في أول مشروع فعلي، نظر المطور إلى ملف Figma وقال بصدق: "التصميم جميل، لكن تباين الألوان غير متوافق مع إمكانية الوصول، وهذه المؤثرات ستثقل معالج الهواتف." كان درساً قاسياً لكنه شكّل نقطة فارقة في نضجي المهني.',
        keyHighlight: 'Discovered that aesthetics without usability and technical feasibility is merely decoration.',
        keyHighlightAr: 'أدركت أن الجمال البصري دون مراعاة لسهولة الاستخدام والجدوى البرمجية ليس سوى زخرفة غير عملية.',
      },
      turningPoint: {
        title: 'The Turning Point: Learning to Code HTML & Flexbox to Speak Developer',
        titleAr: 'نقطة التحول: تعلم أساسيات HTML وCSS للتحدث بلغة المطورين',
        content:
          'Instead of remaining defensive, I spent three months learning basic HTML, CSS Flexbox, Grid, and browser devtools. That changed everything. Suddenly, I stopped designing arbitrary pixel paddings and started designing with standard spacing scales, responsive auto-layout frames, and reusable component tokens. Developers immediately loved working with me because my Figma files matched how code actually renders.',
        contentAr:
          'قررت قضاء ثلاثة أشهر في تعلم أساسيات HTML وCSS ومفاهيم Flexbox وأدوات فحص المتصفح. غير ذلك كل شيء؛ توقفت عن وضع مسافات عشوائية وبدأت أصمم بأنظمة قياسية ومقاييس مسافات موحدة ومكونات متجاوبة. أصبح المطورون يفضلون العمل معي لأن تصاميمي أصبحت تحاكي بنية الكود البرمجي تماماً.',
        keyHighlight: 'Speaking the developers\' language made me 5x more effective as a product designer.',
        keyHighlightAr: 'التحدث بلغة المطورين وفهم طريقة تفكيرهم ضاعف فاعليتي ونجاح تصاميمي أضعافاً.',
      },
      growth: {
        title: 'The Growth: Leading User Research and Multi-Platform Design Systems',
        titleAr: 'مرحلة النمو: قيادة أبحاث المستخدم وأنظمة التصميم عبر المنصات',
        content:
          'I advanced to Lead Designer at Apex Studio, leading UX strategy for a suite of enterprise productivity tools. I conducted over 60 moderated user usability sessions, mapped customer journey frictions, and built a centralized Figma component library synchronized with our engineering team’s GitHub repository via design tokens.',
        contentAr:
          'ترقيت إلى رائدة التصميم في استوديو Apex، حيث قدت استراتيجية التجربة لمجموعة من أدوات الإنتاجية للشركات. أجريت أكثر من 60 جلسة اختبار مستخدم، وبنيت مكتبة مكونات مركزية في Figma مرتبطة مباشرة بمستودع GitHub للمطورين عبر Design Tokens.',
        keyHighlight: 'Tied user research insights directly to product metrics and engineering velocity.',
        keyHighlightAr: 'ربطت نتائج أبحاث المستخدم مباشرة بمؤشرات أداء المنتج وسرعة إطلاق الميزات البرمجية.',
      },
      whereNow: {
        title: 'Where I Am Today: Directing Product Experience and Nurturing Juniors',
        titleAr: 'أين أقف اليوم: إدارة تجربة المنتج وتدريب المصممين الصاعدين',
        content:
          'Today, I direct design initiatives across three product squads, run cross-functional design sprints with product managers and lead engineers, and mentor emerging designers. I focus heavily on ensuring inclusive, accessible experiences for users with varying visual and motor capabilities.',
        contentAr:
          'أقود اليوم مبادرات التصميم عبر ثلاثة فرق منتجات، وأنظم ورش Design Sprints المشتركة، وأوجه المصممين الجدد. أركز بشكل خاص على ضمان تجارب شاملة ومتاحة لذوي الاحتياجات الخاصة ومختلف فئات المستخدمين.',
        keyHighlight: 'Design is not about your personal taste—it is about empowering your users.',
        keyHighlightAr: 'التصميم ليس مسألة ذوق شخصي للمصمم—بل هو تمكين المستخدمين من إنجاز أهدافهم بسهولة.',
      },
      adviceForBeginners: {
        title: 'Advice for Beginners: Principles for Building a Standout UI/UX Career',
        titleAr: 'نصائح للمبتدئين: مبادئ أساسية لبناء مسيرة مهنية مميزة في UI/UX',
        content:
          '1. Never present a design without explaining the problem it solves and why you chose this path.\n2. Learn Figma Auto Layout and component variants inside out—it is the industry standard.\n3. Test your designs with real people early, even if it is just asking a non-tech friend to complete a task.\n4. Treat accessibility (WCAG color contrast, touch target sizes) as non-negotiable foundations, not optional polish.\n5. Learn basic frontend code; knowing the constraints of CSS will make your designs 10x more implementable.',
        contentAr:
          '1. لا تقدم تصميماً دون شرح المشكلة التي يحلها والسبب وراء اتخاذك لهذا القرار.\n2. أتقن Auto Layout ومكونات Figma المتغيرة بعمق؛ فهي المعيار الأساسي في الشركات.\n3. اختبر تصاميمك مع مستخدمين حقيقيين مبكراً، حتى لو كان مجرد صديق غير تقني يحاول إكمال مهمة.\n4. اجعل إمكانية الوصول وتباين الألوان أساساً غير قابل للمساومة في كل شاشة تصنعها.\n5. تعلم أساسيات كود الويب؛ فمعرفة حدود CSS تجعل تصاميمك قابلة للتنفيذ بنجاح وسلاسة.',
        keyHighlight: 'Curiosity, active listening, and user empathy are your most powerful design tools.',
        keyHighlightAr: 'الفضول والاستماع الفعّال والتعاطف مع المستخدم هي أقوى أدواتك كمصمم محترف.',
      },
    },
    timeline: [
      {
        stage: 'Stage 1: The Transition',
        stageAr: 'المرحلة 1: نقطة التحول',
        period: '2020',
        periodAr: '2020',
        title: 'From Graphic Print to UI Prototypes',
        titleAr: 'من المطبوعات إلى النماذج التفاعلية',
        role: 'Junior Visual Designer',
        roleAr: 'مصممة بصرية مبتدئة',
        companyOrOrg: 'Freelance & Redesign Case Studies',
        companyOrOrgAr: 'عمل حر ودراسات حالة شخصية',
        description: 'Transitioned from graphic branding to Figma prototypes and UX wireframes.',
        descriptionAr: 'انتقلت من تصميم الهويات المطبوعة إلى نماذج Figma ومخططات تجربة المستخدم.',
        type: 'start',
        skillsAcquired: ['Figma', 'Wireframing', 'Color Theory', 'Typography'],
      },
      {
        stage: 'Stage 2: Reality Check',
        stageAr: 'المرحلة 2: مواجهة الواقع الهندسي',
        period: '2021',
        periodAr: '2021',
        title: 'Associate UI/UX Designer',
        titleAr: 'مصممة واجهات وتجربة مستخدم مساعدة',
        companyOrOrg: 'Kite Digital Agency',
        companyOrOrgAr: 'وكالة كايت الرقمية',
        description: 'Learned CSS flexbox and WCAG contrast rules to bridge the gap with developers.',
        descriptionAr: 'تعلمت أساسيات CSS Flexbox ومعايير تباين WCAG لردم الفجوة مع المطورين.',
        type: 'challenge',
        skillsAcquired: ['HTML/CSS Basics', 'Auto Layout', 'WCAG Accessibility', 'Design Specs'],
      },
      {
        stage: 'Stage 3: Systems & Research',
        stageAr: 'المرحلة 3: النظم والأبحاث',
        period: '2022 - 2023',
        periodAr: '2022 - 2023',
        title: 'Product Designer',
        titleAr: 'مصممة منتجات رقمية',
        companyOrOrg: 'PulseWave SaaS',
        companyOrOrgAr: 'نبض SaaS',
        description: 'Conducted 50+ user testing sessions, overhauled mobile navigation, and standardized design components.',
        descriptionAr: 'أجرت أكثر من 50 جلسة اختبار، وأعادت تصميم تنقل الهواتف، ووحدت مكونات النظام.',
        type: 'breakthrough',
        skillsAcquired: ['Usability Testing', 'Design Systems', 'Micro-interactions', 'Information Architecture'],
      },
      {
        stage: 'Stage 4: Strategic Impact',
        stageAr: 'المرحلة 4: الأثر الاستراتيجي',
        period: '2024 - Present',
        periodAr: '2024 - حتى الآن',
        title: 'Lead Product & Interaction Designer',
        titleAr: 'قائدة تصميم المنتجات والتفاعل',
        companyOrOrg: 'Apex Design Studio',
        companyOrOrgAr: 'استوديو أبيكس للتصميم',
        description: 'Directs design vision across enterprise tools, synchronizes tokens with GitHub, and mentors 10+ designers.',
        descriptionAr: 'تقود رؤية التصميم لأدوات الشركات، وتربط رموز التصميم بـ GitHub، وتدرب فريق المصممين.',
        type: 'current',
        skillsAcquired: ['Design Leadership', 'Design Tokens', 'Cross-functional Collaboration', 'Product Strategy'],
      },
    ],
    featuredProjects: [
      {
        title: 'Apex Enterprise Design System',
        titleAr: 'نظام تصميم أبيكس للمؤسسات',
        description:
          'Unified design library covering light/dark modes, RTL support, and multi-brand token styling with automated Figma-to-code syncing.',
        descriptionAr:
          'نظام تصميم شامل يدعم الوضع الليلي/النهاري، واللغة العربية (RTL)، والمزامنة التلقائية مع مستودعات الكود.',
        techStack: ['Figma Variables', 'Tokens Studio', 'Style Dictionary', 'Storybook'],
        impact: 'Decreased design-to-development handoff friction by 50% and eliminated duplicate design components.',
        impactAr: 'خفض زمن تسليم التصاميم للمطورين بنسبة 50% وقضى تماماً على تكرار المكونات.',
        role: 'Design System Lead',
        roleAr: 'قائدة نظام التصميم',
      },
      {
        title: 'Collaborative Workspace Redesign',
        titleAr: 'إعادة تصميم بيئة العمل التشاركية',
        description:
          'Redesigned complex project management canvas into an intuitive, modular workspace tailored for non-technical team members.',
        descriptionAr:
          'إعادة تصميم مساحة إدارة المشاريع المعقدة إلى واجهة تفاعلية مرنة وبسيطة لجميع أعضاء الفرق.',
        techStack: ['Figma', 'User Research', 'Interactive Prototyping', 'Miro'],
        impact: 'Increased user onboarding completion rates from 44% to 81% within the first month.',
        impactAr: 'رفعت نسبة إكمال المستخدمين لمراحل التهيئة الأولى من 44% إلى 81% في الشهر الأول.',
        role: 'Lead UX Researcher & Designer',
        roleAr: 'قائدة أبحاث وتصميم تجربة المستخدم',
      },
    ],
    topAdvice: [
      {
        title: 'Fall in love with the user’s problem, not your first visual idea',
        titleAr: 'اعشق المشكلة التي يواجهها المستخدم، وليس فكرتك البصرية الأولى',
        description:
          'Be willing to throw away three days of mockup work if user testing shows it causes friction. Iteration is where true craft lives.',
        descriptionAr:
          'كن مستعداً للتخلي عن تصميم عملت عليه لأيام إذا أظهرت اختبارات المستخدمين وجود صعوبة؛ فالإتقان الحقيقي يكمن في التحسين المستمر.',
      },
      {
        title: 'Build genuine empathy with your frontend engineers',
        titleAr: 'ابنِ علاقة تعاون وثيقة وتعاطف حقيقي مع مهندسي الواجهات',
        description:
          'Sit with your developers during sprint planning. Ask them what makes your design hard to code and find elegant compromises together.',
        descriptionAr:
          'اجلس مع المطورين أثناء التخطيط البرمجي، واسألهم عن التحديات في تصميمك وتعاونوا معاً للوصول لحلول أنيقة وفعالة.',
      },
    ],
  },
  {
    id: 'zayd-al-hassan',
    name: 'Zayd Al-Hassan',
    nameAr: 'زيد الحسن',
    role: 'Senior Platform & Cloud Engineer',
    roleAr: 'مهندس أول للبنى السحابية والمنصات',
    company: 'QuantumCore Labs (Demo)',
    companyAr: 'مختبرات كوانتوم كور (تجريبي)',
    category: 'devops',
    specialization: 'Cloud Infrastructure, Kubernetes & Developer Productivity',
    specializationAr: 'البنية التحتية السحابية، Kubernetes وإنتاجية المطورين',
    yearsOfExperience: 6,
    location: 'Chicago, IL (Remote)',
    locationAr: 'شيكاغو، إلينوي (عن بُعد)',
    avatar: '/images/avatar-maya.jpg',
    avatarFallback: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80',
    shortBio:
      'Empowers 120+ engineers to deploy reliably dozens of times a day. Automates infrastructure with Terraform and guarantees high uptime across distributed clusters.',
    shortBioAr:
      'يمكّن أكثر من 120 مهندساً من إطلاق التحديثات البرمجية بأمان عدة مرات يومياً. يؤتمت البنية التحتية باستخدام Terraform ويضمن استقرار الخدمات السحابية.',
    skills: ['Kubernetes', 'AWS', 'Terraform', 'CI/CD Pipelines', 'Docker', 'Linux & Bash'],
    toolsAndTech: ['AWS', 'Kubernetes', 'Terraform', 'GitHub Actions', 'Prometheus', 'Grafana', 'Go', 'Python'],
    linkedinUrl: 'https://www.linkedin.com/in/fictional-zayd-hassan',
    portfolioUrl: 'https://demo-portfolio.internshub.dev/zayd-hassan',
    githubUrl: 'https://github.com/fictional-zayd-hassan',
    highlightQuote:
      'Never automate a process you cannot successfully perform manually with paper and pencil first.',
    highlightQuoteAr:
      'إياك أن تؤتمت عملية برمجية لا تفهم خطوات تنفيذها يدوياً بدقة وتفصيل أولاً.',
    stats: {
      yearsExp: 6,
      projectsCompleted: 38,
      menteesGuided: 18,
    },
    story: {
      beginning: {
        title: 'The Beginning: Linux Home Servers and Curiosity Behind the Cloud',
        titleAr: 'البداية: خوادم لينكس المنزلية والفضول نحو عالم السحابة',
        content:
          'I started by turning an old discarded desktop computer into an Ubuntu home server running Plex and local file sharing. While other students were focusing only on frontend code, I was fascinated by the mysterious black screen of the Linux terminal, SSH keys, network ports, and file permissions. I loved knowing what actually happened when a packet left my computer and traversed the internet.',
        contentAr:
          'بدأت بتحويل حاسوب قديم مهمل إلى خادم منزلي يعمل بنظام Ubuntu لمشاركة الملفات. بينما كان زملائي يركزون على الواجهات، كنت مشدوداً لسحر الطرفية (Terminal) في لينكس، ومفاتيح SSH، والمنافذ الشبكية، وكيف تنتقل حزم البيانات عبر الإنترنت.',
        keyHighlight: 'Gained intuitive systems curiosity by tinkering directly with physical hardware and Linux.',
        keyHighlightAr: 'بنى خبرته عبر التجربة العملية المباشرة مع عتاد الحاسوب وأنظمة تشغيل لينكس.',
      },
      challenges: {
        title: 'The Challenges: Subnetting Confusion and Cloud Cost Surprises',
        titleAr: 'التحديات: تعقيدات الشبكات وتكاليف السحابة غير المتوقعة',
        content:
          'When I moved to public cloud providers like AWS, I got hit with a steep learning curve. I accidentally left an elastic load balancer and three NAT gateways running over a long holiday weekend, receiving a massive surprise bill that took my entire student budget. Worse, I struggled with VPC CIDR blocks, security groups, and routing tables—frequently locking myself out of my own servers.',
        contentAr:
          'عندما بدأت استخدام منصات السحابة كـ AWS، واجهت تحديات صعبة. تركت خوادم تجريبية تعمل طوال عطلة نهاية الأسبوع وتفاجأت بفاتورة استهلكت ميزانيتي كطالب. كما تعثرت في فهم تقسيم الشبكات الفرعية (CIDR) وجدران الحماية، وغلقت خوادمي بالخطأ مراراً.',
        keyHighlight: 'Early cloud configuration mistakes taught me the vital importance of Infrastructure as Code.',
        keyHighlightAr: 'أخطاء التكوين السحابي المبكرة علمتني أهمية إدارة البنية التحتية عبر الكود (IaC).',
      },
      turningPoint: {
        title: 'The Turning Point: Saving a Hackathon Team With Automated CI/CD',
        titleAr: 'نقطة التحول: إنقاذ فريق الهاكاثون بنظام نشر مؤتمت وفوري',
        content:
          'During a major 48-hour university hackathon, my team’s developers were constantly overwriting each other’s backend code over manual SSH FTP uploads. I stepped in and built a GitHub Actions pipeline that automatically ran unit tests, built a Docker container, and deployed seamlessly to AWS whenever anyone pushed to `main`. We shipped four times faster than any competing team and took first place.',
        contentAr:
          'خلال هاكاثون مدته 48 ساعة، كان المطورون في فريقي يتصارعون مع رفع التعديلات يدوياً عبر SSH ومسح أكواد بعضهم. تدخلت وبنيت خط أنابيب GitHub Actions يقوم بالفحص التلقائي وتجهيز حاويات Docker ونشرها على AWS عند كل تعديل. ضاعف ذلك سرعتنا 4 مرات وفزنا بالمركز الأول.',
        keyHighlight: 'Realized that unblocking developers and removing friction is the ultimate superpower.',
        keyHighlightAr: 'أدرك أن إزالة العوائق وتسريع وتيرة عمل المطورين هي القوة الخارقة الحقيقية لأي فريق تقني.',
      },
      growth: {
        title: 'The Growth: Mastering Kubernetes Orchestration and Terraform',
        titleAr: 'مرحلة النمو: احتراف إدارة الحاويات عبر Kubernetes وأتمتة Terraform',
        content:
          'I joined an enterprise logistics company as a Junior DevOps Engineer. I committed to mastering Infrastructure as Code with Terraform and container orchestration with Kubernetes. Over three years, I rebuilt our brittle, hand-crafted cloud environments into reproducible, declarative infrastructure that could be torn down and rebuilt in under 20 minutes.',
        contentAr:
          'انضممت لشركة لوجستية كبرى كمهندس DevOps مبتدئ. كرست جهدي لاحتراف Terraform وإدارة حاويات Kubernetes. خلال 3 سنوات، حولت بيئات السحابة الهشة والمعدة يدوياً إلى بنية تحتية مؤتمتة ومعلنة كودياً يمكن إعادة بنائها بالكامل في أقل من 20 دقيقة.',
        keyHighlight: 'Turned chaotic manual operations into deterministic, version-controlled infrastructure.',
        keyHighlightAr: 'حوّل العمليات اليدوية الفوضوية إلى بنية تحتية دقيقة وخاضعة لنظام التحكم في الإصدارات Git.',
      },
      whereNow: {
        title: 'Where I Am Today: Senior Platform Engineer Scaling Global Infrastructure',
        titleAr: 'أين أقف اليوم: مهندس منصات أول يدير بنى تحتية عالمية',
        content:
          'At QuantumCore Labs, I manage multi-region Kubernetes clusters supporting 120+ microservices. I focus on developer experience (DevEx), giving developers self-service preview environments with zero wait time, alongside comprehensive monitoring with Prometheus and Grafana alerts that catch issues before users ever notice.',
        contentAr:
          'أدير اليوم في مختبرات QuantumCore مجموعات Kubernetes موزعة جغرافياً تدعم أكثر من 120 خدمة مصغرة. أركز على تحسين تجربة المطورين وتوفير بيئات معاينة فورية مع أنظمة مراقبة ترصد أي خلل قبل أن يشعر به المستخدم.',
        keyHighlight: 'Platform engineering is about turning infrastructure into a seamless, joyful internal product.',
        keyHighlightAr: 'هندسة المنصات تعني تحويل البنية التحتية إلى منتج داخلي سلس وموثوق يخدم المطورين.',
      },
      adviceForBeginners: {
        title: 'Advice for Beginners: Hard-Won Wisdom for Cloud & DevOps Engineers',
        titleAr: 'نصائح للمبتدئين: حكمة عملية للمهتمين بالحوسبة السحابية وDevOps',
        content:
          '1. Get comfortable living inside the Linux command line; master grep, awk, curl, and bash scripting.\n2. Understand networking fundamentals: DNS, TCP/IP, subnets, and HTTP before chasing cloud certifications.\n3. Always treat infrastructure as code—never click around AWS or Azure consoles for production changes.\n4. Build a home lab or use free-tier cloud credits with billing alerts set to $5 on day one.\n5. The greatest platform engineers possess endless patience and communicate with empathy.',
        contentAr:
          '1. تأقلم مع سطر أوامر لينكس؛ أتقن أوامر grep وcurl وكتابة سكربتات bash.\n2. افهم أسس الشبكات: DNS وTCP/IP والشبكات الفرعية قبل التسرع في جمع الشهادات السحابية.\n3. اجعل كود البنية التحتية مقدساً (IaC)؛ لا تقم بتعديلات يدوية عبر واجهات السحابة في بيئات العمل.\n4. أنشئ مختبر تجارب محلياً أو استخدم الحسابات السحابية المجانية مع ضبط تنبيه الفواتير على 5 دولارات.\n5. أهم ميزة لمهندس المنصات الناجح هي الصبر اللامحدود والقدرة على التواصل الفعّال مع المطورين.',
        keyHighlight: 'A solid foundation in Linux and networking will carry you through every cloud trend.',
        keyHighlightAr: 'الأساس القوي في لينكس والشبكات هو سلاحك الثابت مهما تغيرت موضات الأدوات السحابية.',
      },
    },
    timeline: [
      {
        stage: 'Stage 1: The Terminal',
        stageAr: 'المرحلة 1: عالم الطرفية',
        period: '2019',
        periodAr: '2019',
        title: 'Linux Foundations & Home Labs',
        titleAr: 'أسس لينكس والخوادم المنزلية',
        role: 'Curious Tinkerer',
        roleAr: 'مهتم بالأنظمة',
        companyOrOrg: 'Self-Hosted Labs',
        companyOrOrgAr: 'مختبر تجارب منزلي',
        description: 'Built home file servers on Ubuntu, learned bash scripting and system administration.',
        descriptionAr: 'بنى خوادم منزلية على أوبونتو، وتعلم سكربتات bash وإدارة النظم.',
        type: 'start',
        skillsAcquired: ['Linux / Ubuntu', 'Bash Scripting', 'SSH', 'Networking Basics'],
      },
      {
        stage: 'Stage 2: The Cloud Leap',
        stageAr: 'المرحلة 2: القفزة السحابية',
        period: '2020 - 2021',
        periodAr: '2020 - 2021',
        title: 'Cloud Associate & Intern',
        titleAr: 'متدرب حوسبة سحابية',
        companyOrOrg: 'Stratum Cloud Services',
        companyOrOrgAr: 'خدمات ستراتوم السحابية',
        description: 'Configured AWS VPCs, EC2 instances, and learned painful lessons in cloud billing and IAM security.',
        descriptionAr: 'قام بتهيئة شبكات AWS VPC وخوادم EC2 وأتقن معايير الأمان وإدارة الهويات IAM.',
        type: 'challenge',
        skillsAcquired: ['AWS (EC2, VPC, S3)', 'Docker', 'IAM Security', 'Billing Governance'],
      },
      {
        stage: 'Stage 3: Infrastructure as Code',
        stageAr: 'المرحلة 3: البنية التحتية ككود',
        period: '2022 - 2023',
        periodAr: '2022 - 2023',
        title: 'DevOps & CI/CD Engineer',
        titleAr: 'مهندس DevOps وخطوط أنابيب CI/CD',
        companyOrOrg: 'DataFlow Logistics',
        companyOrOrgAr: 'داتا فلو للخدمات اللوجستية',
        description: 'Replaced manual deployments with automated Terraform scripts and multi-stage GitHub Actions workflows.',
        descriptionAr: 'استبدل النشر اليدوي بسكربتات Terraform المؤتمتة وتدفقات عمل GitHub Actions.',
        type: 'breakthrough',
        skillsAcquired: ['Terraform', 'GitHub Actions', 'CI/CD Automation', 'Python'],
      },
      {
        stage: 'Stage 4: Kubernetes at Scale',
        stageAr: 'المرحلة 4: الحاويات على نطاق واسع',
        period: '2024 - Present',
        periodAr: '2024 - حتى الآن',
        title: 'Senior Platform & Cloud Engineer',
        titleAr: 'مهندس أول للبنى السحابية والمنصات',
        companyOrOrg: 'QuantumCore Labs',
        companyOrOrgAr: 'مختبرات كوانتوم كور',
        description: 'Architects multi-region Kubernetes clusters, implements Prometheus observability, and drives internal DevEx.',
        descriptionAr: 'يصمم عناقيد Kubernetes موزعة جغرافياً، وينفذ أنظمة المراقبة مع تحسين تجربة المطورين.',
        type: 'current',
        skillsAcquired: ['Kubernetes', 'Helm', 'Prometheus & Grafana', 'Site Reliability (SRE)'],
      },
    ],
    featuredProjects: [
      {
        title: 'Self-Service Developer Preview Environments',
        titleAr: 'بيئات المعاينة الذاتية للمطورين',
        description:
          'Ephemeral Kubernetes namespace provisioning triggered by GitHub pull requests, giving engineers instant production-like test URLs.',
        descriptionAr:
          'نظام لإنشاء بيئات اختبار سحابية مؤقتة تلقائياً عند فتح كل طلب مراجعة كود (Pull Request) في غضون دقيقتين.',
        techStack: ['Kubernetes', 'Terraform', 'GitHub Actions', 'AWS EKS', 'ArgoCD'],
        impact: 'Cut pre-release QA testing bottlenecks by 65% across 18 development teams.',
        impactAr: 'خفض زمن انتظار اختبارات الجودة بنسبة 65% عبر 18 فريق عمل مختلف.',
        role: 'Lead Infrastructure Engineer',
        roleAr: 'كبير مهندسي البنية التحتية',
      },
      {
        title: 'Zero-Downtime Multi-Region Migration',
        titleAr: 'الترحيل السحابي متعدد المناطق دون أي توقف',
        description:
          'Migrated legacy monolithic services to an active-passive multi-region Kubernetes architecture with automated Route53 health checks.',
        descriptionAr:
          'ترحيل الأنظمة القديمة إلى بنية سحابية موزعة جغرافياً مع التحويل التلقائي لحركة المرور في حال حدوث أي عطل.',
        techStack: ['AWS', 'Kubernetes', 'Route53', 'Prometheus', 'Terraform'],
        impact: 'Maintained 99.995% service uptime and cut disaster recovery RTO from 3 hours to 4 minutes.',
        impactAr: 'حافظ على استمرارية الخدمة بنسبة 99.995% وخفض زمن التعافي من الكوارث من 3 ساعات إلى 4 دقائق.',
        role: 'Senior Platform Architect',
        roleAr: 'معماري منصات أول',
      },
    ],
    topAdvice: [
      {
        title: 'Never fear breaking things in a safe, isolated sandbox',
        titleAr: 'لا تخف من تعطل الأشياء داخل بيئة تجريبية معزولة',
        description:
          'Spin up a virtual machine, break its network routing, and spend the afternoon recovering it. That is how true systems intuition is formed.',
        descriptionAr:
          'شغل خادماً افتراضياً، وتلاعب بإعدادات شبكته، ثم حاول إصلاحه بنفسك؛ هكذا تتكون الخبرة العميقة للمهندس الحقيقي.',
      },
      {
        title: 'Measure developer happiness and time spent waiting',
        titleAr: 'قس سعادة المطورين والوقت الضائع في انتظار أدواتك',
        description:
          'The real metric of a platform engineer is not how fancy the Kubernetes YAML is—it is whether your teammates can ship with confidence.',
        descriptionAr:
          'مقياس نجاح مهندس المنصات ليس تعقيد ملفات التكوين، بل هو قدرة زملائك على إطلاق ميزاتهم البرمجية بثقة وسلاسة.',
      },
    ],
  },
];

export function getAllSeniors(): SeniorProfile[] {
  return SENIORS_DATA;
}

export function getSeniorById(id: string): SeniorProfile | undefined {
  return SENIORS_DATA.find((senior) => senior.id === id);
}

export function getSeniorsByCategory(category: string): SeniorProfile[] {
  if (!category || category === 'all') {
    return SENIORS_DATA;
  }
  return SENIORS_DATA.filter((senior) => senior.category === category);
}

