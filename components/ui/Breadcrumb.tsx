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
        'flex items-center gap-2 px-10 pt-20 font-mono text-[11px] font-normal',
        className,
      )}
    >
      {items.map((item, index) => {
        const isLast = index === items.length - 1;

        return (
          <span className="inline-flex items-center gap-2" key={`${item.label}-${index}`}>
            {item.href && !isLast ? (
              <Link
                className="text-textMuted transition-colors duration-200 hover:text-textSecondary"
                href={item.href}
              >
                {item.label}
              </Link>
            ) : (
              <span className={isLast ? 'text-textSecondary' : 'text-textMuted'}>
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
