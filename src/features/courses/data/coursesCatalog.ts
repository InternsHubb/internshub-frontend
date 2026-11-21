export interface CourseAttachment {
  id: string;
  title: string;
  fileType: string;
  iconSrc: string;
}

export interface CourseCatalogLesson {
  id: string;
  title: string;
  duration: string;
  videoUrl: string;
  lessonNumber: string;
  description?: string;
}

export interface CourseCatalogModule {
  id: number;
  title: string;
  lessons: CourseCatalogLesson[];
  attachments?: CourseAttachment[];
}

export interface CourseCatalogItem {
  id: string;
  title: string;
  trackName: string;
  instructor: string;
  instructorAvatar: string;
  description: string;
  duration: string;
  lessonsCount: number;
  rating: number;
  primaryVideoUrl: string;
  heroImage: string;
  attachments: CourseAttachment[];
  modules: CourseCatalogModule[];
}

export const COURSES_CATALOG: Record<string, CourseCatalogItem> = {
  // ── 1. UI/UX DESIGN ────────────────────────────────────────────────────────
  'landing-course-1': {
    id: 'landing-course-1',
    title: 'Advanced Design Systems & Component Libraries',
    trackName: 'UI/UX Design',
    instructor: 'Elena Vasquez',
    instructorAvatar: '/images/course-avatar-elena.webp',
    description:
      'Learn how to architect, maintain, and scale professional design systems in Figma. Master design tokens, auto-layout, interactive components, and developer handoff workflows.',
    duration: '22 hours',
    lessonsCount: 11,
    rating: 4.8,
    primaryVideoUrl: 'https://www.youtube.com/embed/jwCmIBJ8Jtc',
    heroImage: '/images/course-detail-hero.png',
    attachments: [
      {
        id: 'att-1',
        title: 'What is UI/UX Design?',
        fileType: 'pdf file',
        iconSrc: '/images/video/simple-red.svg',
      },
      {
        id: 'att-2',
        title: 'Understanding User-Centered Design',
        fileType: 'html file',
        iconSrc: '/images/video/code-icon.svg',
      },
      {
        id: 'att-3',
        title: 'Tools of the Trade: Figma Basics',
        fileType: 'power point slides',
        iconSrc: '/images/video/powerpoint-icon.svg',
      },
    ],
    modules: [
      {
        id: 1,
        title: 'Module 1: Foundations & Design Tokens',
        lessons: [
          {
            id: '1-1',
            title: 'Intro to UX Thinking & Design Systems',
            duration: '14 min',
            videoUrl: 'https://www.youtube.com/embed/jwCmIBJ8Jtc',
            lessonNumber: '01',
            description: 'Understand the core principles of scalable design systems and atomic design hierarchy.',
          },
          {
            id: '1-2',
            title: 'Color Palettes, Typography & Tokens',
            duration: '18 min',
            videoUrl: 'https://www.youtube.com/embed/jwCmIBJ8Jtc',
            lessonNumber: '02',
            description: 'Setting up semantic color tokens, responsive typographic scales, and elevation values in Figma.',
          },
        ],
      },
      {
        id: 2,
        title: 'Module 2: Wireframing & Components',
        lessons: [
          {
            id: '2-1',
            title: 'Auto-Layout & Flexible Components',
            duration: '20 min',
            videoUrl: 'https://www.youtube.com/embed/jwCmIBJ8Jtc',
            lessonNumber: '03',
            description: 'Master auto-layout 5.0, nesting frames, and building buttons, inputs, and card components.',
          },
          {
            id: '2-2',
            title: 'Component Variants & Property Controls',
            duration: '24 min',
            videoUrl: 'https://www.youtube.com/embed/jwCmIBJ8Jtc',
            lessonNumber: '04',
            description: 'Creating component sets, boolean properties, instance swap properties, and component variants.',
          },
        ],
      },
      {
        id: 3,
        title: 'Module 3: Interactive Prototyping',
        lessons: [
          {
            id: '3-1',
            title: 'Prototyping Principles & Transitions',
            duration: '16 min',
            videoUrl: 'https://www.youtube.com/embed/jwCmIBJ8Jtc',
            lessonNumber: '05',
            description: 'Connecting frames, trigger events, easing functions, and page navigation flows.',
          },
          {
            id: '3-2',
            title: 'Building Interactive Prototypes in Figma',
            duration: '22 min',
            videoUrl: 'https://www.youtube.com/embed/jwCmIBJ8Jtc',
            lessonNumber: '06',
            description: 'Creating dynamic micro-interactions, dropdown animations, and realistic multi-state flows.',
          },
          {
            id: '3-3',
            title: 'Overlays, Modals & Smart Animate',
            duration: '18 min',
            videoUrl: 'https://www.youtube.com/embed/jwCmIBJ8Jtc',
            lessonNumber: '07',
            description: 'Designing centered overlays, sliding side drawers, and smart animate transitions.',
          },
          {
            id: '3-4',
            title: 'Usability Testing with Prototypes',
            duration: '15 min',
            videoUrl: 'https://www.youtube.com/embed/jwCmIBJ8Jtc',
            lessonNumber: '08',
            description: 'Conducting remote user testing sessions and recording feedback using Figma share links.',
          },
        ],
      },
      {
        id: 4,
        title: 'Module 4: Dev Handoff & Governance',
        lessons: [
          {
            id: '4-1',
            title: 'Design Specs, Redlines & Dev Mode',
            duration: '19 min',
            videoUrl: 'https://www.youtube.com/embed/jwCmIBJ8Jtc',
            lessonNumber: '09',
            description: 'Using Figma Dev Mode, inspecting CSS/SVG code, and writing developer redline specifications.',
          },
          {
            id: '4-2',
            title: 'Design System Governance & Versioning',
            duration: '25 min',
            videoUrl: 'https://www.youtube.com/embed/jwCmIBJ8Jtc',
            lessonNumber: '10',
            description: 'Publishing library updates, deprecating legacy components, and collaborating with engineers.',
          },
        ],
      },
      {
        id: 5,
        title: 'Final Assessment',
        lessons: [
          {
            id: '5-1',
            title: 'Design Systems Final Certification Quiz',
            duration: 'Unlimited attempts - 70% to pass',
            videoUrl: 'https://www.youtube.com/embed/jwCmIBJ8Jtc',
            lessonNumber: '11',
            description: 'Prove your expertise in design systems, Figma components, and prototyping to unlock your certificate.',
          },
        ],
      },
    ],
  },

  // ── 2. FRONTEND DEVELOPMENT ────────────────────────────────────────────────
  'landing-course-2': {
    id: 'landing-course-2',
    title: 'Frontend Web Development with React & Tailwind',
    trackName: 'Web Development',
    instructor: 'Ahmed Hassan',
    instructorAvatar: '/images/mentor-ahmed-figma.webp',
    description:
      'Master modern frontend engineering from the ground up. Build lightning-fast, production-ready web apps with React 19, modern JavaScript ES6+, and responsive Tailwind CSS utility classes.',
    duration: '30 hours',
    lessonsCount: 11,
    rating: 4.9,
    primaryVideoUrl: 'https://www.youtube.com/embed/x4rFhThSX04',
    heroImage: '/images/course-thumb-2.webp',
    attachments: [
      {
        id: 'att-1',
        title: 'React 19 & Component Architecture Guide',
        fileType: 'pdf file',
        iconSrc: '/images/video/simple-red.svg',
      },
      {
        id: 'att-2',
        title: 'Tailwind CSS Utility Cheatsheet',
        fileType: 'html file',
        iconSrc: '/images/video/code-icon.svg',
      },
      {
        id: 'att-3',
        title: 'Modern JavaScript ES6+ Workbook',
        fileType: 'power point slides',
        iconSrc: '/images/video/powerpoint-icon.svg',
      },
    ],
    modules: [
      {
        id: 1,
        title: 'Module 1: Modern HTML5 & Responsive CSS',
        lessons: [
          {
            id: '1-1',
            title: 'Semantic HTML5 Architecture',
            duration: '16 min',
            videoUrl: 'https://www.youtube.com/embed/mU6anWqZJcc',
            lessonNumber: '01',
            description: 'Semantic markup, accessibility standards (a11y), SEO tags, and modern web document layout.',
          },
          {
            id: '1-2',
            title: 'Modern CSS Flexbox & Grid Systems',
            duration: '22 min',
            videoUrl: 'https://www.youtube.com/embed/OXGznpKZ_sA',
            lessonNumber: '02',
            description: 'Mastering 1D and 2D responsive page layouts using Flexbox alignments and CSS Grid areas.',
          },
        ],
      },
      {
        id: 2,
        title: 'Module 2: Tailwind CSS from Scratch',
        lessons: [
          {
            id: '2-1',
            title: 'Tailwind Utility-First Fundamentals',
            duration: '25 min',
            videoUrl: 'https://www.youtube.com/embed/dFgzHOX84xQ',
            lessonNumber: '03',
            description: 'Configuration, spacing scales, colors, responsive breakpoints, and dark mode variants.',
          },
          {
            id: '2-2',
            title: 'Building Modern Responsive UI Components',
            duration: '28 min',
            videoUrl: 'https://www.youtube.com/embed/dFgzHOX84xQ',
            lessonNumber: '04',
            description: 'Crafting responsive hero banners, interactive navbar menus, cards, and modal dialogs with Tailwind.',
          },
        ],
      },
      {
        id: 3,
        title: 'Module 3: JavaScript ES6+ & Async Programming',
        lessons: [
          {
            id: '3-1',
            title: 'Modern JavaScript Core & Array Methods',
            duration: '24 min',
            videoUrl: 'https://www.youtube.com/embed/PkZQtbi2zGE',
            lessonNumber: '05',
            description: 'Arrow functions, destructuring, spread operators, map, filter, reduce, and immutable patterns.',
          },
          {
            id: '3-2',
            title: 'Async/Await, Promises & Fetching REST APIs',
            duration: '26 min',
            videoUrl: 'https://www.youtube.com/embed/PkZQtbi2zGE',
            lessonNumber: '06',
            description: 'Mastering async/await, error handling with try/catch, and consuming real-world REST APIs.',
          },
          {
            id: '3-3',
            title: 'DOM Manipulation & Event Handling',
            duration: '20 min',
            videoUrl: 'https://www.youtube.com/embed/PkZQtbi2zGE',
            lessonNumber: '07',
            description: 'Event delegation, form validation, debouncing, and throttling interactive user inputs.',
          },
          {
            id: '3-4',
            title: 'Vite Build Tool & Modern Bundling',
            duration: '18 min',
            videoUrl: 'https://www.youtube.com/embed/x4rFhThSX04',
            lessonNumber: '08',
            description: 'Setting up high-performance Vite projects, environment variables, and module aliases.',
          },
        ],
      },
      {
        id: 4,
        title: 'Module 4: React Components & Hooks',
        lessons: [
          {
            id: '4-1',
            title: 'React Fundamentals: JSX, Props & State',
            duration: '32 min',
            videoUrl: 'https://www.youtube.com/embed/x4rFhThSX04',
            lessonNumber: '09',
            description: 'Component architecture, passing props, state isolation, and conditional rendering patterns.',
          },
          {
            id: '4-2',
            title: 'Hooks in Depth: useState, useEffect & Custom Hooks',
            duration: '35 min',
            videoUrl: 'https://www.youtube.com/embed/x4rFhThSX04',
            lessonNumber: '10',
            description: 'Managing side effects, cleanup functions, memoization, and extracting reusable custom hooks.',
          },
        ],
      },
      {
        id: 5,
        title: 'Final Assessment',
        lessons: [
          {
            id: '5-1',
            title: 'Frontend Web Development Certification Quiz',
            duration: 'Unlimited attempts - 70% to pass',
            videoUrl: 'https://www.youtube.com/embed/x4rFhThSX04',
            lessonNumber: '11',
            description: 'Test your understanding of React, JavaScript ES6+, and Tailwind to claim your credential.',
          },
        ],
      },
    ],
  },

  // ── 3. FULL-STACK / BACKEND ────────────────────────────────────────────────
  'landing-course-3': {
    id: 'landing-course-3',
    title: 'Full-Stack Web Applications & REST APIs',
    trackName: 'Web Development',
    instructor: 'Nadia Mansour',
    instructorAvatar: '/images/mentor-nadia-figma.webp',
    description:
      'Learn how to architect, develop, and deploy enterprise-grade backend services and full-stack web applications using Node.js, Express, relational databases, and RESTful architectures.',
    duration: '28 hours',
    lessonsCount: 11,
    rating: 4.8,
    primaryVideoUrl: 'https://www.youtube.com/embed/RLtyhwFtXQA',
    heroImage: '/images/course-thumb-3.webp',
    attachments: [
      {
        id: 'att-1',
        title: 'Node.js & Express REST API Architecture',
        fileType: 'pdf file',
        iconSrc: '/images/video/simple-red.svg',
      },
      {
        id: 'att-2',
        title: 'SQL Relational Schema & Queries Cheatsheet',
        fileType: 'html file',
        iconSrc: '/images/video/code-icon.svg',
      },
      {
        id: 'att-3',
        title: 'Docker & Microservices Deployment Deck',
        fileType: 'power point slides',
        iconSrc: '/images/video/powerpoint-icon.svg',
      },
    ],
    modules: [
      {
        id: 1,
        title: 'Module 1: Node.js Runtime Fundamentals',
        lessons: [
          {
            id: '1-1',
            title: 'Node Architecture, Event Loop & File System',
            duration: '22 min',
            videoUrl: 'https://www.youtube.com/embed/RLtyhwFtXQA',
            lessonNumber: '01',
            description: 'Understanding non-blocking asynchronous I/O, Node core modules, streams, and file system operations.',
          },
          {
            id: '1-2',
            title: 'NPM, Package Management & Modules',
            duration: '18 min',
            videoUrl: 'https://www.youtube.com/embed/RLtyhwFtXQA',
            lessonNumber: '02',
            description: 'Managing package.json dependencies, semantic versioning, scripts, and ECMAScript modules in Node.',
          },
        ],
      },
      {
        id: 2,
        title: 'Module 2: Express.js & REST API Design',
        lessons: [
          {
            id: '2-1',
            title: 'Express Routing, Middleware & Controllers',
            duration: '26 min',
            videoUrl: 'https://www.youtube.com/embed/RLtyhwFtXQA',
            lessonNumber: '03',
            description: 'Building robust HTTP servers, route parameters, custom middleware pipelines, and error handling.',
          },
          {
            id: '2-2',
            title: 'RESTful API Standards & Request Validation',
            duration: '25 min',
            videoUrl: 'https://www.youtube.com/embed/RLtyhwFtXQA',
            lessonNumber: '04',
            description: 'Designing idempotent REST endpoints, status codes, query pagination, and schema validation with Joi.',
          },
        ],
      },
      {
        id: 3,
        title: 'Module 3: Relational Databases & SQL',
        lessons: [
          {
            id: '3-1',
            title: 'Relational Schema Design & Table Structures',
            duration: '28 min',
            videoUrl: 'https://www.youtube.com/embed/HXV3zeQKqGY',
            lessonNumber: '05',
            description: 'Primary keys, foreign keys, database normalization (1NF-3NF), and ER diagram modeling.',
          },
          {
            id: '3-2',
            title: 'Writing Complex SQL Queries, Joins & Aggregates',
            duration: '30 min',
            videoUrl: 'https://www.youtube.com/embed/HXV3zeQKqGY',
            lessonNumber: '06',
            description: 'Mastering INNER, LEFT, RIGHT joins, GROUP BY, HAVING, subqueries, and indexing for speed.',
          },
          {
            id: '3-3',
            title: 'Transactions, ACID Properties & Migrations',
            duration: '22 min',
            videoUrl: 'https://www.youtube.com/embed/HXV3zeQKqGY',
            lessonNumber: '07',
            description: 'Ensuring atomic database transactions, handling rollbacks, and running automated schema migrations.',
          },
          {
            id: '3-4',
            title: 'Connecting Node.js to Databases with ORMs',
            duration: '24 min',
            videoUrl: 'https://www.youtube.com/embed/RLtyhwFtXQA',
            lessonNumber: '08',
            description: 'Connecting database pools, writing type-safe queries, handling connection leaks, and pagination.',
          },
        ],
      },
      {
        id: 4,
        title: 'Module 4: Authentication & Cloud Deployment',
        lessons: [
          {
            id: '4-1',
            title: 'JWT Authentication, Password Hashing & RBAC',
            duration: '27 min',
            videoUrl: 'https://www.youtube.com/embed/RLtyhwFtXQA',
            lessonNumber: '09',
            description: 'Securing APIs with bcrypt password hashing, signed JSON Web Tokens, and role-based permissions.',
          },
          {
            id: '4-2',
            title: 'Dockerizing Backend Apps & Production Deploy',
            duration: '29 min',
            videoUrl: 'https://www.youtube.com/embed/fqMOX6JJhGo',
            lessonNumber: '10',
            description: 'Writing multi-stage Dockerfiles, managing container environments, and deploying to cloud servers.',
          },
        ],
      },
      {
        id: 5,
        title: 'Final Assessment',
        lessons: [
          {
            id: '5-1',
            title: 'Full-Stack Engineering Certification Quiz',
            duration: 'Unlimited attempts - 70% to pass',
            videoUrl: 'https://www.youtube.com/embed/RLtyhwFtXQA',
            lessonNumber: '11',
            description: 'Demonstrate your knowledge of Node.js, REST APIs, SQL, and security to get certified.',
          },
        ],
      },
    ],
  },

  // ── 4. MOBILE DEVELOPMENT (FLUTTER) ────────────────────────────────────────
  'landing-course-4': {
    id: 'landing-course-4',
    title: 'Mobile App Development with Flutter & Dart',
    trackName: 'Mobile Development',
    instructor: 'Elena Vasquez',
    instructorAvatar: '/images/course-avatar-elena.webp',
    description:
      'Build beautiful, natively compiled applications for iOS and Android from a single Dart codebase. Master Flutter widgets, reactive state management, animations, and camera/storage APIs.',
    duration: '24 hours',
    lessonsCount: 11,
    rating: 4.7,
    primaryVideoUrl: 'https://www.youtube.com/embed/VPvVD8t02U8',
    heroImage: '/images/course-thumb-4.webp',
    attachments: [
      {
        id: 'att-1',
        title: 'Flutter Widget Tree & Lifecycle Guide',
        fileType: 'pdf file',
        iconSrc: '/images/video/simple-red.svg',
      },
      {
        id: 'att-2',
        title: 'Dart 3 Syntax & Null-Safety Cheatsheet',
        fileType: 'html file',
        iconSrc: '/images/video/code-icon.svg',
      },
      {
        id: 'att-3',
        title: 'Cross-Platform Mobile Architecture Slides',
        fileType: 'power point slides',
        iconSrc: '/images/video/powerpoint-icon.svg',
      },
    ],
    modules: [
      {
        id: 1,
        title: 'Module 1: Dart Programming Language',
        lessons: [
          {
            id: '1-1',
            title: 'Dart Fundamentals, Types & Control Flow',
            duration: '20 min',
            videoUrl: 'https://www.youtube.com/embed/VPvVD8t02U8',
            lessonNumber: '01',
            description: 'Static typing, variables, null safety, collections, and control flow in Dart.',
          },
          {
            id: '1-2',
            title: 'Object-Oriented Dart & Asynchronous Code',
            duration: '24 min',
            videoUrl: 'https://www.youtube.com/embed/VPvVD8t02U8',
            lessonNumber: '02',
            description: 'Classes, mixins, abstract classes, futures, streams, and async programming in Dart.',
          },
        ],
      },
      {
        id: 2,
        title: 'Module 2: Flutter Widgets & Adaptive UI',
        lessons: [
          {
            id: '2-1',
            title: 'Stateless vs Stateful Widgets Lifecycle',
            duration: '26 min',
            videoUrl: 'https://www.youtube.com/embed/VPvVD8t02U8',
            lessonNumber: '03',
            description: 'Understanding the widget tree, element tree, and render tree in Flutter architecture.',
          },
          {
            id: '2-2',
            title: 'Building Responsive Layouts & Custom Themes',
            duration: '28 min',
            videoUrl: 'https://www.youtube.com/embed/VPvVD8t02U8',
            lessonNumber: '04',
            description: 'Rows, Columns, Stack, MediaQuery, LayoutBuilder, and Material 3 theme configurations.',
          },
        ],
      },
      {
        id: 3,
        title: 'Module 3: Navigation, Forms & State',
        lessons: [
          {
            id: '3-1',
            title: 'Screen Navigation & Deep Linking',
            duration: '22 min',
            videoUrl: 'https://www.youtube.com/embed/VPvVD8t02U8',
            lessonNumber: '05',
            description: 'Navigator 2.0, named routes, passing data between screens, and deep link setup.',
          },
          {
            id: '3-2',
            title: 'Form Validation & User Input Handling',
            duration: '24 min',
            videoUrl: 'https://www.youtube.com/embed/VPvVD8t02U8',
            lessonNumber: '06',
            description: 'GlobalKey, FormField validation, text editing controllers, and custom keyboard inputs.',
          },
          {
            id: '3-3',
            title: 'Reactive State Management Patterns',
            duration: '30 min',
            videoUrl: 'https://www.youtube.com/embed/VPvVD8t02U8',
            lessonNumber: '07',
            description: 'Comparing Provider, Riverpod, and BLoC for clean, testable state management.',
          },
          {
            id: '3-4',
            title: 'REST API Integration & JSON Serialization',
            duration: '25 min',
            videoUrl: 'https://www.youtube.com/embed/VPvVD8t02U8',
            lessonNumber: '08',
            description: 'Using http and dio packages, caching network requests, and handling offline connectivity.',
          },
        ],
      },
      {
        id: 4,
        title: 'Module 4: Device APIs & App Publishing',
        lessons: [
          {
            id: '4-1',
            title: 'Local Storage, SharedPrefs & SQLite',
            duration: '25 min',
            videoUrl: 'https://www.youtube.com/embed/VPvVD8t02U8',
            lessonNumber: '09',
            description: 'Persisting user sessions with SharedPreferences, Hive, and SQLite embedded databases.',
          },
          {
            id: '4-2',
            title: 'App Store & Google Play Release Preparation',
            duration: '28 min',
            videoUrl: 'https://www.youtube.com/embed/VPvVD8t02U8',
            lessonNumber: '10',
            description: 'App icons, splash screens, signing Android APK/AAB and iOS IPA release bundles.',
          },
        ],
      },
      {
        id: 5,
        title: 'Final Assessment',
        lessons: [
          {
            id: '5-1',
            title: 'Mobile App Development Certification Quiz',
            duration: 'Unlimited attempts - 70% to pass',
            videoUrl: 'https://www.youtube.com/embed/VPvVD8t02U8',
            lessonNumber: '11',
            description: 'Pass the comprehensive Flutter assessment to earn your official mobile developer certificate.',
          },
        ],
      },
    ],
  },

  // ── 5. DATA SCIENCE / PYTHON / SQL ─────────────────────────────────────────
  'landing-course-5': {
    id: 'landing-course-5',
    title: 'Data Analysis with Python & SQL',
    trackName: 'Data Science',
    instructor: 'Elena Vasquez',
    instructorAvatar: '/images/avatar-elena-figma.jpg',
    description:
      'Learn data analysis, statistical modeling, and data manipulation using Python, Pandas, and SQL. Transform raw, messy real-world datasets into actionable business intelligence.',
    duration: '22 hours',
    lessonsCount: 11,
    rating: 4.7,
    primaryVideoUrl: 'https://www.youtube.com/embed/r-uOLxNrNk8',
    heroImage: '/images/course-data-ai.jpg',
    attachments: [
      {
        id: 'att-1',
        title: 'Python Data Analysis & Pandas Cheatsheet',
        fileType: 'pdf file',
        iconSrc: '/images/video/simple-red.svg',
      },
      {
        id: 'att-2',
        title: 'SQL Data Extraction & Joins Reference',
        fileType: 'html file',
        iconSrc: '/images/video/code-icon.svg',
      },
      {
        id: 'att-3',
        title: 'Data Cleaning & Statistical Analysis Guide',
        fileType: 'power point slides',
        iconSrc: '/images/video/powerpoint-icon.svg',
      },
    ],
    modules: [
      {
        id: 1,
        title: 'Module 1: Python for Data Analysis',
        lessons: [
          {
            id: '1-1',
            title: 'Python Core Data Structures & Comprehensions',
            duration: '22 min',
            videoUrl: 'https://www.youtube.com/embed/rfscVS0vtbw',
            lessonNumber: '01',
            description: 'Lists, dictionaries, sets, tuples, list comprehensions, and functional programming in Python.',
          },
          {
            id: '1-2',
            title: 'NumPy Arrays & Vectorized Calculations',
            duration: '25 min',
            videoUrl: 'https://www.youtube.com/embed/rfscVS0vtbw',
            lessonNumber: '02',
            description: 'Multi-dimensional arrays, matrix operations, indexing, and high-performance vectorization.',
          },
        ],
      },
      {
        id: 2,
        title: 'Module 2: Pandas Data Wrangling & Cleaning',
        lessons: [
          {
            id: '2-1',
            title: 'Pandas Series, DataFrames & File Ingestion',
            duration: '28 min',
            videoUrl: 'https://www.youtube.com/embed/r-uOLxNrNk8',
            lessonNumber: '03',
            description: 'Reading CSV, Excel, and JSON files, DataFrame indexing, filtering, and conditional selection.',
          },
          {
            id: '2-2',
            title: 'Handling Missing Values & Data Transformation',
            duration: '26 min',
            videoUrl: 'https://www.youtube.com/embed/r-uOLxNrNk8',
            lessonNumber: '04',
            description: 'Imputing null values, type casting, string transformations, and applying custom functions.',
          },
        ],
      },
      {
        id: 3,
        title: 'Module 3: SQL for Data Analytics',
        lessons: [
          {
            id: '3-1',
            title: 'SQL Data Extraction & Multi-Table Joins',
            duration: '27 min',
            videoUrl: 'https://www.youtube.com/embed/HXV3zeQKqGY',
            lessonNumber: '05',
            description: 'Writing SELECT queries, WHERE filters, INNER/OUTER joins, and aggregating business metrics.',
          },
          {
            id: '3-2',
            title: 'Advanced Window Functions & Cohort Analysis',
            duration: '30 min',
            videoUrl: 'https://www.youtube.com/embed/HXV3zeQKqGY',
            lessonNumber: '06',
            description: 'Using OVER, PARTITION BY, RANK, DENSE_RANK, LAG, and LEAD for trend analysis.',
          },
          {
            id: '3-3',
            title: 'Subqueries, CTEs & Query Optimization',
            duration: '24 min',
            videoUrl: 'https://www.youtube.com/embed/HXV3zeQKqGY',
            lessonNumber: '07',
            description: 'Common Table Expressions (WITH clauses), correlated subqueries, and query execution plans.',
          },
          {
            id: '3-4',
            title: 'Exporting Cleaned Data Pipelines to Databases',
            duration: '20 min',
            videoUrl: 'https://www.youtube.com/embed/r-uOLxNrNk8',
            lessonNumber: '08',
            description: 'Connecting Pandas with SQLAlchemy and writing automated data pipelines.',
          },
        ],
      },
      {
        id: 4,
        title: 'Module 4: Visualization & Machine Learning',
        lessons: [
          {
            id: '4-1',
            title: 'Data Visualization with Matplotlib & Seaborn',
            duration: '28 min',
            videoUrl: 'https://www.youtube.com/embed/r-uOLxNrNk8',
            lessonNumber: '09',
            description: 'Line plots, heatmaps, distribution plots, scatter plots, and dashboard storytelling.',
          },
          {
            id: '4-2',
            title: 'Intro to Applied Machine Learning with Scikit-Learn',
            duration: '32 min',
            videoUrl: 'https://www.youtube.com/embed/NWONeJKn9Kc',
            lessonNumber: '10',
            description: 'Feature engineering, linear regression, classification, and evaluating predictive model accuracy.',
          },
        ],
      },
      {
        id: 5,
        title: 'Final Assessment',
        lessons: [
          {
            id: '5-1',
            title: 'Data Analytics & Python Certification Quiz',
            duration: 'Unlimited attempts - 70% to pass',
            videoUrl: 'https://www.youtube.com/embed/r-uOLxNrNk8',
            lessonNumber: '11',
            description: 'Validate your SQL and Python data analytics skills to receive your verified certificate.',
          },
        ],
      },
    ],
  },
};

// Aliases for alternate route params
COURSES_CATALOG['popular-landing-1'] = COURSES_CATALOG['landing-course-1'];
COURSES_CATALOG['popular-landing-2'] = {
  ...COURSES_CATALOG['landing-course-1'],
  id: 'popular-landing-2',
  title: 'Modern UI/UX Design & Prototyping in Figma',
};
COURSES_CATALOG['design-systems'] = COURSES_CATALOG['landing-course-1'];
COURSES_CATALOG['uiux'] = COURSES_CATALOG['landing-course-1'];

COURSES_CATALOG['react-basics-advanced'] = COURSES_CATALOG['landing-course-2'];
COURSES_CATALOG['frontend'] = COURSES_CATALOG['landing-course-2'];

COURSES_CATALOG['popular-landing-3'] = {
  ...COURSES_CATALOG['landing-course-3'],
  id: 'popular-landing-3',
  title: 'Full-Stack Development with Node.js & React',
};
COURSES_CATALOG['fullstack-dev'] = COURSES_CATALOG['landing-course-3'];
COURSES_CATALOG['backend'] = COURSES_CATALOG['landing-course-3'];

COURSES_CATALOG['flutter'] = COURSES_CATALOG['landing-course-4'];
COURSES_CATALOG['mobile'] = COURSES_CATALOG['landing-course-4'];

COURSES_CATALOG['landing-course-6'] = {
  ...COURSES_CATALOG['landing-course-5'],
  id: 'landing-course-6',
  title: 'Data Cleaning & Exploratory Data Analysis',
};
COURSES_CATALOG['data-analysis-fundamentals'] = COURSES_CATALOG['landing-course-5'];
COURSES_CATALOG['data_analysis'] = COURSES_CATALOG['landing-course-5'];
COURSES_CATALOG['data-ai'] = COURSES_CATALOG['landing-course-5'];

/**
 * Helper to resolve the course catalog entry by ID or by fuzzy keyword in ID
 */
export function getCourseCatalogItem(id?: string | null): CourseCatalogItem {
  if (!id) return COURSES_CATALOG['landing-course-1'];

  // Direct match
  if (COURSES_CATALOG[id]) return COURSES_CATALOG[id];

  const lower = id.toLowerCase();

  if (lower.includes('front') || lower.includes('react') || lower.includes('tailwind') || lower.includes('web') || lower === '2') {
    return COURSES_CATALOG['landing-course-2'];
  }
  if (lower.includes('back') || lower.includes('full') || lower.includes('node') || lower.includes('api') || lower === '3') {
    return COURSES_CATALOG['landing-course-3'];
  }
  if (lower.includes('mobile') || lower.includes('flutter') || lower.includes('dart') || lower.includes('android') || lower.includes('ios') || lower === '4') {
    return COURSES_CATALOG['landing-course-4'];
  }
  if (lower.includes('data') || lower.includes('python') || lower.includes('sql') || lower.includes('ai') || lower.includes('analys') || lower === '5' || lower === '6') {
    return COURSES_CATALOG['landing-course-5'];
  }

  // Default to UI/UX course
  return COURSES_CATALOG['landing-course-1'];
}

/**
 * Returns a verified working video URL for a given lesson, honoring the course track
 */
export function resolveLessonVideo(courseItem: CourseCatalogItem, lessonId: string, lessonTitle?: string): string {
  // Check modules in this course catalog
  for (const module of courseItem.modules) {
    const lesson = module.lessons.find((l) => l.id === lessonId);
    if (lesson?.videoUrl) return lesson.videoUrl;
  }

  // If lessonTitle contains specific topic keywords, match accordingly
  if (lessonTitle) {
    const lower = lessonTitle.toLowerCase();
    if (lower.includes('html') || lower.includes('css')) return 'https://www.youtube.com/embed/mU6anWqZJcc';
    if (lower.includes('tailwind')) return 'https://www.youtube.com/embed/dFgzHOX84xQ';
    if (lower.includes('javascript') || lower.includes('js')) return 'https://www.youtube.com/embed/PkZQtbi2zGE';
    if (lower.includes('react')) return 'https://www.youtube.com/embed/x4rFhThSX04';
    if (lower.includes('node') || lower.includes('express')) return 'https://www.youtube.com/embed/RLtyhwFtXQA';
    if (lower.includes('sql') || lower.includes('database')) return 'https://www.youtube.com/embed/HXV3zeQKqGY';
    if (lower.includes('docker')) return 'https://www.youtube.com/embed/fqMOX6JJhGo';
    if (lower.includes('flutter') || lower.includes('dart') || lower.includes('mobile')) return 'https://www.youtube.com/embed/VPvVD8t02U8';
    if (lower.includes('pandas') || lower.includes('data analysis')) return 'https://www.youtube.com/embed/r-uOLxNrNk8';
    if (lower.includes('python')) return 'https://www.youtube.com/embed/rfscVS0vtbw';
    if (lower.includes('machine learning')) return 'https://www.youtube.com/embed/NWONeJKn9Kc';
    if (lower.includes('figma') || lower.includes('ui/ux') || lower.includes('wireframe') || lower.includes('prototype')) {
      return 'https://www.youtube.com/embed/jwCmIBJ8Jtc';
    }
  }

  // Fallback to the course's own primary video
  return courseItem.primaryVideoUrl;
}

