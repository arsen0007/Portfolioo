import type { AccentColor } from './colors';

export type SectionId =
  | 'home'
  | 'projects'
  | 'about'
  | 'recognition'
  | 'contact'
  | 'learning'
  | 'architecture';

export const sectionColors = {
  home: 'blue',
  projects: 'green',
  about: 'cyan',
  recognition: 'amber',
  contact: 'blue',
  learning: 'purple',
  architecture: 'purple',
} satisfies Record<SectionId, AccentColor>;

export type NavigationItem = {
  href: string;
  label: string;
  section: Exclude<SectionId, 'home' | 'learning'>;
};


export const navigationItems: NavigationItem[] = [
  { href: '/about', label: 'About', section: 'about' },
  { href: '/projects', label: 'Projects', section: 'projects' },
  { href: '/architecture', label: 'Architecture', section: 'architecture' },
  { href: '/recognition', label: 'Recognition', section: 'recognition' },
  { href: '/contact', label: 'Contact', section: 'contact' },
];
