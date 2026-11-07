import Link from 'next/link';
import { Container } from '@/components/ui/Container';
import { navigationItems } from '@/lib/constants/navigation';

// Résumé link removed until public/resume.pdf is a real document (see forresume.md).
const socialLinks = [
  { href: 'mailto:tousifarsen@gmail.com', label: 'Email' },
  { href: 'https://www.linkedin.com/in/tousif-ali--/', label: 'LinkedIn' },
  { href: 'https://github.com/arsen0007', label: 'GitHub' },
] as const;

const linkClass =
  'inline-flex min-h-11 items-center text-small text-textSecondary transition-colors duration-200 hover:text-textPrimary';

export function Footer() {
  return (
    <footer className="border-t border-surfaceBorder">
      <Container className="py-10">
        <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
          <div>
            <p className="font-display text-xl font-medium tracking-tight text-textPrimary">
              Tousif Ali
            </p>
            <p className="mt-1 max-w-xs text-small text-textMuted">
              Building AI systems in production. Bengaluru, India.
            </p>
          </div>

          <nav aria-label="Footer" className="flex flex-wrap gap-x-6">
            {navigationItems.map((item) => (
              <Link className={linkClass} href={item.href} key={item.href}>
                {item.label}
              </Link>
            ))}
          </nav>

          <ul className="flex flex-wrap gap-x-6">
            {socialLinks.map((link) => {
              const external = link.href.startsWith('http');

              return (
                <li key={link.label}>
                  <a
                    className={linkClass}
                    href={link.href}
                    rel={external ? 'noopener noreferrer' : undefined}
                    target={external ? '_blank' : undefined}
                  >
                    {link.label}
                  </a>
                </li>
              );
            })}
          </ul>
        </div>

        <div className="mt-8 flex items-center justify-between border-t border-surfaceBorder pt-6 text-caption text-textMuted">
          <p>© {new Date().getFullYear()} Tousif Ali</p>
          <a className="inline-flex min-h-11 items-center hover:text-textPrimary" href="#main-content">
            Back to top
          </a>
        </div>
      </Container>
    </footer>
  );
}
