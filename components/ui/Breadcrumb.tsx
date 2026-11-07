import Link from 'next/link';
import { cn } from '@/lib/utils';

export type BreadcrumbItem = {
  href?: string;
  label: string;
};

export type BreadcrumbProps = {
  items: BreadcrumbItem[];
  className?: string;
};

export function Breadcrumb({ className, items }: BreadcrumbProps) {
  return (
    <nav
      aria-label="Breadcrumb"
      className={cn(
        'mx-auto flex w-full max-w-6xl items-center gap-2 px-5 pt-[calc(var(--header-h)+1rem)] text-caption font-normal sm:px-8',
        className,
      )}
    >
      {items.map((item, index) => {
        const isLast = index === items.length - 1;

        return (
          <span className="inline-flex items-center gap-2" key={`${item.label}-${index}`}>
            {item.href && !isLast ? (
              <Link
                className="inline-flex min-h-11 items-center text-textMuted transition-colors duration-200 hover:text-textPrimary"
                href={item.href}
              >
                {item.label}
              </Link>
            ) : (
              <span aria-current={isLast ? 'page' : undefined} className={isLast ? 'text-textSecondary' : 'text-textMuted'}>
                {item.label}
              </span>
            )}
            {!isLast ? (
              <span aria-hidden="true" className="text-connectionLine">
                /
              </span>
            ) : null}
          </span>
        );
      })}
    </nav>
  );
}
