import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from 'react';
import { TransitionLink } from '@/components/motion/TransitionLink';
import { cn } from '@/lib/utils';

export type ButtonVariant = 'primary' | 'secondary' | 'link';
export type ButtonSize = 'md' | 'lg';

/*
 * Pill buttons. Primary is bone-on-ink with a signal-orange fill that wipes up
 * from below on hover; secondary is a hairline pill; link draws its underline.
 */
const base =
  'group/btn relative isolate inline-flex items-center justify-center gap-2 overflow-hidden rounded-full font-body font-medium tracking-[-0.01em] transition-[color,border-color,transform] duration-500 ease-out active:scale-[0.98]';

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    'bg-textPrimary text-canvas hover:text-accentFg before:absolute before:inset-0 before:-z-10 before:translate-y-full before:rounded-full before:bg-accent before:transition-transform before:duration-500 before:ease-out hover:before:translate-y-0',
  secondary:
    'border border-surfaceBorderStrong bg-transparent text-textPrimary hover:border-textPrimary before:absolute before:inset-0 before:-z-10 before:translate-y-full before:rounded-full before:bg-surfaceRaised before:transition-transform before:duration-500 before:ease-out hover:before:translate-y-0',
  link: 'link-draw rounded-none text-textPrimary hover:text-accent',
};

// Every size meets the 44px minimum touch target.
const sizeClasses: Record<ButtonSize, string> = {
  md: 'min-h-11 px-5 text-small',
  lg: 'min-h-14 px-7 text-base',
};

export function buttonClasses(
  variant: ButtonVariant = 'primary',
  size: ButtonSize = 'md',
  className?: string,
): string {
  return cn(base, variantClasses[variant], variant === 'link' ? 'min-h-11 overflow-visible' : sizeClasses[size], className);
}

type CommonProps = {
  children: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
};

export type ButtonProps = CommonProps & ButtonHTMLAttributes<HTMLButtonElement>;

export function Button({
  children,
  className,
  size = 'md',
  type = 'button',
  variant = 'primary',
  ...props
}: ButtonProps) {
  return (
    <button className={buttonClasses(variant, size, className)} type={type} {...props}>
      {children}
    </button>
  );
}

export type ButtonLinkProps = CommonProps &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> & { href: string };

/** A real link that looks like a button, so navigation stays an <a>. */
export function ButtonLink({
  children,
  className,
  href,
  size = 'md',
  variant = 'primary',
  ...props
}: ButtonLinkProps) {
  const external = href.startsWith('http') || href.startsWith('mailto:');

  if (external) {
    return (
      <a
        className={buttonClasses(variant, size, className)}
        href={href}
        rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
        target={href.startsWith('http') ? '_blank' : undefined}
        {...props}
      >
        {children}
      </a>
    );
  }

  return (
    <TransitionLink className={buttonClasses(variant, size, className)} href={href} {...props}>
      {children}
    </TransitionLink>
  );
}
