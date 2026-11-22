export type WorkMode = 'Remote' | 'Hybrid' | 'On-site';
export type OpportunityType = 'Full-time' | 'Internship' | 'Part-time';

export type Opportunity = {
  id: string;
  title: string;
  company: string;
  location: string;
  mode: WorkMode;
  type: OpportunityType;
  description: string;
  skills: string[];
  posted: string;
  color: string;
  companySize: string;
  founded: string;
  responsibilities: string[];
  requirements: string[];
  companyDescription: string;
};

export const opportunities: Opportunity[] = [
  {
    id: 'novatech-frontend',
    title: 'Frontend Developer',
    company: 'NovaTech Solutions',
    location: 'Cairo, Egypt',
    mode: 'Remote',
    type: 'Full-time',
    description: 'Join our engineering team to build modern, performant web applications used by 50k+ users.',
    skills: ['React', 'TypeScript', 'Tailwind CSS', 'Git'],
    posted: '2 days ago',
    color: '#3B0454',
    companySize: '50–150 employees',
    founded: '2019',
    responsibilities: [
      'Build reusable, accessible React components with TypeScript',
      'Collaborate with designers to implement pixel-perfect, responsive UIs',
      'Optimize application performance, LCP, and CLS metrics',
      'Write unit and integration tests using Vitest and Testing Library',
      'Participate in code reviews, sprint planning, and technical discussions',
    ],
    requirements: [
      '1+ year of experience with React and TypeScript',
      'Strong command of CSS, Flexbox, Grid, and Tailwind',
      'Familiarity with Git, CI/CD pipelines, and PR workflows',
      'Clear written communication in English or Arabic',
      'A portfolio with at least one shipped, real-world project',
    ],
    companyDescription: 'NovaTech Solutions is a product-led tech company building tools for the modern workforce. Founded in 2019, we serve 50k+ users across the MENA region.',
  },
  {
    id: 'designcraft-uiux',
    title: 'UI/UX Designer',
    company: 'DesignCraft Agency',
    location: 'Alexandria, Egypt',
    mode: 'Hybrid',
    type: 'Internship',
    description: 'Help shape user experiences for our client portfolio of SaaS and e-commerce products.',
    skills: ['Figma', 'User Research', 'Prototyping', 'Wireframing'],
    posted: '3 days ago',
    color: '#0796B4',
    companySize: '20–50 employees',
    founded: '2017',
    responsibilities: ['Create user flows and interactive prototypes', 'Conduct usability sessions and synthesize findings', 'Work closely with product and engineering teams'],
    requirements: ['A portfolio showing thoughtful UX decisions', 'Working knowledge of Figma and design systems', 'Curiosity, clear communication, and a collaborative mindset'],
    companyDescription: 'DesignCraft is an independent product design studio partnering with ambitious teams to make digital products easier to use.',
  },
  {
    id: 'startupflow-product',
    title: 'Product Designer',
    company: 'StartupFlow',
    location: 'Remote',
    mode: 'Remote',
    type: 'Part-time',
    description: 'Own the product design for a fast-growing fintech startup. End-to-end responsibility from research to delivery.',
    skills: ['Figma', 'Design Systems', 'UX Writing', 'Analytics'],
    posted: '1 week ago',
    color: '#0A9D72',
    companySize: '10–20 employees',
    founded: '2021',
    responsibilities: ['Lead discovery and translate insights into product improvements', 'Design and maintain a consistent component library', 'Partner with product managers to shape the roadmap'],
    requirements: ['Experience designing responsive web products', 'Strong interaction design and prototyping skills', 'Comfort working in a fast-moving startup environment'],
    companyDescription: 'StartupFlow helps small teams understand their finances with clear, approachable software.',
  },
  {
    id: 'cloudbase-react',
    title: 'React Developer',
    company: 'CloudBase Inc.',
    location: 'Giza, Egypt',
    mode: 'On-site',
    type: 'Internship',
    description: 'Build internal tools and customer-facing dashboards using React and our design system.',
    skills: ['React', 'JavaScript', 'CSS', 'REST APIs'],
    posted: '4 days ago',
    color: '#E67B00',
    companySize: '150–300 employees',
    founded: '2016',
    responsibilities: ['Build and maintain React interfaces for cloud products', 'Integrate REST APIs and handle loading and error states', 'Work with QA to resolve issues before release'],
    requirements: ['Comfort with JavaScript and React fundamentals', 'Understanding of responsive CSS and accessibility', 'A willingness to learn and work as part of a team'],
    companyDescription: 'CloudBase builds dependable infrastructure and collaboration products for businesses throughout the region.',
  },
];
