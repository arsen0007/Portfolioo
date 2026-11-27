import { FooterCta } from '@/components/layout/FooterCta';
import { LocalTime } from '@/components/layout/LocalTime';
import { Mark } from '@/components/layout/Wordmark';
import { Magnetic } from '@/components/motion/Magnetic';
import { TransitionLink } from '@/components/motion/TransitionLink';
import { navigationItems } from '@/lib/constants/navigation';

const socialLinks = [
  { href: 'mailto:tousifarsen@gmail.com', label: 'Email' },
  { href: 'https://www.linkedin.com/in/tousif-ali--/', label: 'LinkedIn' },
  { href: 'https://github.com/arsen0007', label: 'GitHub' },
] as const;

const linkClass =
  'link-draw inline-flex min-h-11 items-center text-small text-textSecondary transition-colors duration-300 hover:text-textPrimary';

export function Footer() {
  return (
    <footer className="relative z-10 overflow-hidden border-t border-surfaceBorder bg-canvas">
      <div className="mx-auto w-full max-w-page px-[var(--gutter)] pt-[clamp(4rem,10vw,8rem)]">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <FooterCta
              fallback={
                <div>
                  <p className="flex items-center gap-3 text-textPrimary">
                    <Mark animate={false} className="h-[26px]" />
                    <span className="flex items-baseline gap-[0.3em] text-xl leading-none">
                      <span className="font-semibold tracking-[-0.035em]">Tousif</span>
                      <span className="font-serif text-[1.3em] italic">Ali</span>
                    </span>
                  </p>
                  <p className="mt-3 max-w-sm text-textSecondary">
                    AI systems that replace manual work, built from the seat where the work happens.{' '}
                    <span className="font-serif italic text-textPrimary">Bengaluru.</span>
                  </p>
                </div>
              }
            >
            <p className="label flex items-center gap-2 text-textMuted">
              <span aria-hidden="true" className="live-dot" /> Available for the right problem · 2026
            </p>
            <p className="mt-6 text-balance text-h1 font-medium text-textPrimary">
              Got work your team still does{' '}
              <span className="font-serif font-normal italic tracking-[-0.02em] text-accent">by hand?</span>
            </p>
            <div className="mt-10">
              <Magnetic>
                <TransitionLink
                  className="group relative inline-flex min-h-14 items-center gap-3 overflow-hidden rounded-full bg-textPrimary px-8 text-base font-medium text-canvas"
                  data-cursor="link"
                  href="/contact"
                >
                  <span
                    aria-hidden="true"
                    className="absolute inset-0 translate-y-full rounded-full bg-accent transition-transform duration-500 ease-out group-hover:translate-y-0"
                  />
                  <span className="relative">Start a conversation</span>
                  <span aria-hidden="true" className="relative transition-transform duration-500 ease-out group-hover:translate-x-1">
                    →
                  </span>
                </TransitionLink>
              </Magnetic>
            </div>
            </FooterCta>
          </div>

          <div className="grid grid-cols-2 gap-8 lg:col-span-4 lg:col-start-9">
            <nav aria-label="Footer">
              <p className="label text-textMuted">Index</p>
              <ul className="mt-3">
                <li>
                  <TransitionLink className={linkClass} href="/">
                    Home
                  </TransitionLink>
                </li>
                {navigationItems.map((item) => (
                  <li key={item.href}>
                    <TransitionLink className={linkClass} href={item.href}>
                      {item.label}
                    </TransitionLink>
                  </li>
                ))}
                <li>
                  <TransitionLink className={linkClass} href="/colophon">
                    Colophon
                  </TransitionLink>
                </li>
              </ul>
            </nav>
            <div>
              <p className="label text-textMuted">Elsewhere</p>
              <ul className="mt-3">
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
                        {external ? <span aria-hidden="true" className="ml-1 text-textMuted">↗</span> : null}
                      </a>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        </div>

        <div className="label mt-20 flex flex-wrap items-center justify-between gap-4 border-t border-surfaceBorder py-6 text-textMuted">
          <p>© {new Date().getFullYear()} Tousif Ali · Bengaluru, India</p>
          <LocalTime />
          <a className="link-draw inline-flex min-h-11 items-center hover:text-textPrimary" href="#main-content">
            Back to top ↑
          </a>
        </div>
      </div>

      <p
        aria-hidden="true"
        className="text-outline pointer-events-none -mb-[0.2em] select-none whitespace-nowrap text-center text-[19vw] font-semibold leading-[0.8] tracking-[-0.07em]"
      >
        TOUSIF ALI
      </p>
    </footer>
  );
}
