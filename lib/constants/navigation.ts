export type NavigationItem = {
  href: string;
  label: string;
};

export const navigationItems: NavigationItem[] = [
  { href: '/about', label: 'About' },
  { href: '/projects', label: 'Work' },
  { href: '/recognition', label: 'Recognition' },
  { href: '/contact', label: 'Contact' },
];
