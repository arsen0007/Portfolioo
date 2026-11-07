import Link from 'next/link';
import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from 'react';
import { cn } from '@/lib/utils';

export type ButtonVariant = 'primary' | 'secondary' | 'link';
export type ButtonSize = 'md' | 'lg';

const base =
  'inline-flex items-center justify-center gap-2 rounded-control font-body font-medium transition-colors duration-200';

const variantClasses: Record<ButtonVariant, string> = {
  primary: 'bg-accent text-accentFg hover:opacity-90',
  secondary:
    'border border-surfaceBorderStrong bg-transparent text-textPrimary hover:border-textMuted',
  link: 'text-accent underline decoration-1 underline-offset-4 hover:decoration-2',
};

// Every size meets the 44px minimum touch target.
const sizeClasses: Record<ButtonSize, string> = {
  md: 'min-h-11 px-5 text-small',
  lg: 'min-h-12 px-6 text-base',
};

export function buttonClasses(
  variant: ButtonVariant = 'primary',
  size: ButtonSize = 'md',
  className?: string,
): string {
  return cn(base, variantClasses[variant], variant === 'link' ? 'min-h-11' : sizeClasses[size], className);
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
    <Link className={buttonClasses(variant, size, className)} href={href} {...props}>
      {children}
    </Link>
  );
}
