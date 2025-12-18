
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
    description: 'A journey that started with simple scripts and evolved into building complex distributed systems. Driven by curiosity and the thrill of creation.'
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
    title: 'AWS Certified Developer',
    issuer: 'Amazon Web Services',
    year: '2024',
    importance: 'Validates cloud-native architecture skills and deployment best practices.',
    application: 'Used to optimize infrastructure costs and scalability for various side projects.',
    image: 'https://picsum.photos/seed/aws/400/600'
  },
  {
    id: '2',
    title: 'Meta Frontend Professional',
    issuer: 'Meta',
    year: '2023',
    importance: 'Comprehensive mastery of React ecosystem and modern UX principles.',
    application: 'Applied in creating highly performant, accessible web applications.',
    image: 'https://picsum.photos/seed/meta/400/600'
  },
  {
    id: '3',
    title: 'Google Cloud Engineer',
    issuer: 'Google',
    year: '2023',
    importance: 'Expertise in managing distributed data pipelines and storage solutions.',
    application: 'Informed the data architecture of large-scale hackathon winners.',
    image: 'https://picsum.photos/seed/google/400/600'
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
