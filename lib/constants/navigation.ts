import type { AccentColor } from './colors';

export type SectionId =
  | 'home'
  | 'projects'
  | 'about'
  | 'recognition'
  | 'contact'
  | 'learning'
  | 'architecture'
  | 'certifications'
  | 'skills';

export const sectionColors = {
  home: 'blue',
  projects: 'green',
  about: 'cyan',
  recognition: 'amber',
  contact: 'blue',
  learning: 'purple',
  architecture: 'purple',
  certifications: 'amber',
  skills: 'purple',
} satisfies Record<SectionId, AccentColor>;

export type NavigationItem = {
  href: string;
  label: string;
  section: Exclude<SectionId, 'home' | 'learning' | 'architecture'>;
};


export const navigationItems: NavigationItem[] = [
  { href: '/about', label: 'About', section: 'about' },
  { href: '/projects', label: 'Projects', section: 'projects' },
  { href: '/certifications', label: 'Certifications', section: 'certifications' },
  { href: '/recognition', label: 'Recognition', section: 'recognition' },
  { href: '/contact', label: 'Contact', section: 'contact' },
];
