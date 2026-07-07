import type { AccentColor } from '@/lib/constants/colors';

export type TopTierRecognition = {
  id: string;
  title: string;
  source: string;
  date: string;
  quote: string;
  link: string;
};

export type LeadershipRecognition = {
  id: string;
  name: string;
  role: string;
  highlight: string;
  quote: string;
  kudoImage?: string;
  isAction?: boolean;
};

export type CourseItem = {
  name: string;
  level: 'Intermediate' | 'Advanced' | 'Expert';
  completed: boolean;
};

export type CredentialRecognition = {
  id: string;
  title: string;
  subtitle: string;
  color: AccentColor;
  courses?: CourseItem[];
};

export type RecognitionData = {
  topTier: TopTierRecognition;
  leadershipTier: LeadershipRecognition[];
  credentialsTier: CredentialRecognition[];
};

export const recognition: RecognitionData = {
  topTier: {
    id: 'blog',
    title: 'Pitch-It Summer 2025: Innovation from the Inside Out',
    source: 'Workplace Options Blog',
    date: 'July 2025',
    quote:
      'Tousif saw an opportunity to streamline and optimize legal case intake. He leveraged his AI expertise and developed a custom tool that enhances note-taking and categorization, saving time and boosting team productivity.',
    link: 'https://www.workplaceoptions.com/blog/pitch-it-summer-2025-innovation-from-the-inside-out/',
  },
  leadershipTier: [
    {
      id: 'ceo',
      name: 'Alan King',
      role: 'CEO, Workplace Options',
      highlight: 'Awarded $5,000 Product School scholarship',
      quote:
        'I think it is extraordinary — not just the work, but the dedication to trying to do something better and to make the organisation better and to make life for your colleagues better. You blew me away first thing in the morning.',
    },
    {
      id: 'fernando',
      name: 'Fernando Figueiredo',
      role: 'Direct Manager, Workplace Options',
      highlight: 'Excellence · January 2026',
      quote: "Tousif's brain needs to be uploaded into the cloud and shared with everyone.",
      kudoImage: '/recognition.png',
    },
    {
      id: 'ciso',
      name: 'Arun Raj',
      role: 'CISO, Workplace Options',
      highlight: 'Called the idea "Extraordinary" publicly',
      quote: 'The idea is fantastic. It saves a lot of time.',
    },
    {
      id: 'cto',
      name: 'Praveen Kodikkambrath',
      role: 'CTO, Workplace Options',
      highlight: 'Embedded CaseWise into UCMS (Core System)',
      quote: 'Paired with Senior System Architect and AI Team Lead for production development.',
      isAction: true,
    },
  ],
  credentialsTier: [
    {
      id: 'hackathon',
      title: 'Global Hackathon Winner',
      subtitle: 'Le Mans T2 · Real-time ML racing system',
      color: 'amber',
    },
    {
      id: 'productschool',
      title: 'Product School',
      subtitle: 'CEO-sponsored curriculum',
      color: 'purple',
      courses: [
        { name: 'Product Management', level: 'Intermediate', completed: true },
        { name: 'AI Evals', level: 'Advanced', completed: true },
        { name: 'AI Product Management', level: 'Intermediate', completed: true },
        { name: 'Advanced AI Agents', level: 'Advanced', completed: true },
        { name: 'Go-to-Market', level: 'Advanced', completed: false },
        { name: 'Vibe Coding', level: 'Advanced', completed: true },
        { name: 'Product Experimentation', level: 'Advanced', completed: false },
        { name: 'Product Leadership', level: 'Expert', completed: false },
        { name: 'Claude Code', level: 'Advanced', completed: true },
      ],
    },
  ],
};
