
import { JourneyItem, Credential, FreelanceProject } from './types';

export const FREELANCE_PROJECTS: FreelanceProject[] = [
  {
    id: '1',
    title: 'E-Commerce Redesign',
    description: 'A complete overhaul of a fashion retailer\'s online presence, resulting in a 150% increase in mobile conversions. Built with a focus on speed and accessibility.',
    link: 'https://example.com',
    image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80&w=1000',
    year: '2024',
    technologies: ['Next.js', 'Shopify', 'Framer Motion']
  },
  {
    id: '2',
    title: 'Corporate Dashboard',
    description: 'Internal analytical dashboard for a logistics company. Visualizes real-time fleet data and route optimization metrics.',
    link: 'https://example.com',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=1000',
    year: '2023',
    technologies: ['React', 'D3.js', 'Firebase']
  }
];

export const JOURNEY_DATA: JourneyItem[] = [
  {
    type: 'Origin',
    title: 'Beginnings',
    organization: 'DAV Sr Secondary School',
    duration: '2010 - 2024',
    focus: ['Logic', 'Problem Solving', 'Creativity'],
    description: 'Built strong foundations in logical thinking, mathematics, problem-solving, and disciplined learning through structured academic training.'
  },
  {
    type: 'Education',
    title: 'B.Tech Computer Science w/s Software Engineering',
    organization: 'SRM University',
    duration: '2024 - 2028',
    focus: ['Data Structures', 'Algorithms', 'System Design'],
    description: 'Deepening theoretical knowledge while maintaining a rigorous focus on practical, industry-standard development patterns.'
  },
  {
    type: 'Internship',
    title: 'Full Stack Engineer Intern',
    organization: 'CloudScale Solutions',
    duration: 'Summer 2023',
    focus: ['React', 'Go', 'Kubernetes'],
    description: 'Architected and implemented a real-time dashboard monitoring microservice health across multiple regions.'
  },
  {
    type: 'Internship',
    title: 'Frontend Specialist Intern',
    organization: 'PixelPerfect Labs',
    duration: 'Summer 2022',
    focus: ['TypeScript', 'Tailwind', 'Motion Design'],
    description: 'Spearheaded the design system migration, resulting in a 40% improvement in component reusability and rendering performance.'
  }
];

export const CREDENTIALS_DATA: Credential[] = [
  {
    id: '1',
    title: 'Smart India Hackathon',
    issuer: 'SIH ',
    year: '2025',
    importance: 'Smart India Hackathon bridges academic learning with real-world problem solving by encouraging students to build practical, impactful technology solutions.',
    application: 'It enables students to work on real problem statements, collaborate in teams, develop prototypes under deadlines, and present solutions to industry experts.',
    image: '/certificates/SIH Certificate.jpg'
  },
  {
    id: '2',
    title: 'Algo University',
    issuer: 'Algo',
    year: '2025',
    importance: 'The internship opportunity by Algo University provided exposure to structured technical evaluations and real-world expectations in competitive engineering environments.',
    application: 'Clearing up to the second round demonstrated strong problem-solving ability, coding fundamentals, and adaptability under assessment-based selection processes.',
    image: '/certificates/Certificate_Harini_Sai_B.jpg'
  },
  {
    id: '3',
    title: 'AI for Beginners',
    issuer: 'HP',
    year: '2025',
    importance: 'This course provided a foundational understanding of artificial intelligence, its core concepts, and its ethical and real-world impact across industries.',
    application: 'The knowledge gained helps in understanding AI-driven systems, data importance, and informed decision-making when working with or building technology-enabled solutions.',
    image: '/certificates/certificate.pdf'
  },
  {
    id: '4',
    title: 'Programming In Java',
    issuer: 'NPTEL',
    year: '2025',
    importance: 'The NPTEL Programming in Java course strengthened core object-oriented programming concepts and built a solid foundation in Java for scalable software development.',
    application: 'The course knowledge is applied in writing structured, efficient Java programs, implementing OOP principles, and solving real-world programming problems.',
    image: '/certificates/Programming In Java.pdf'
  }
];

export const NAV_LINKS = [
  { label: 'Home', path: '/' },
  { label: 'Projects', path: '/projects' },
  { label: 'Journey', path: '/journey' },
  { label: 'Credentials', path: '/credentials' },
  { label: 'Freelance', path: '/freelance' },
  { label: 'Resume', path: '/resume' }
];
