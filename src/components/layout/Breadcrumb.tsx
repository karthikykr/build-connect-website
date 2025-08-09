import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';

interface BreadcrumbItem {
  label: string;
  href?: string;
  current?: boolean;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  showHome?: boolean;
  className?: string;
}

export function Breadcrumb({ items, showHome = true, className = '' }: BreadcrumbProps) {
  const allItems = showHome 
    ? [{ label: 'Home', href: '/' }, ...items]
    : items;

  return (
    <nav className={`flex items-center space-x-2 text-sm ${className}`} aria-label="Breadcrumb">
      {allItems.map((item, index) => {
        const isLast = index === allItems.length - 1;
        const isHome = index === 0 && showHome;

        return (
          <div key={index} className="flex items-center">
            {index > 0 && (
              <ChevronRight className="w-4 h-4 text-text-secondary mx-2" />
            )}
            
            {item.href && !isLast ? (
              <Link
                href={item.href}
                className="flex items-center text-text-secondary hover:text-primary transition-colors duration-200"
              >
                {isHome && <Home className="w-4 h-4 mr-1" />}
                {item.label}
              </Link>
            ) : (
              <span 
                className={`flex items-center ${
                  isLast 
                    ? 'text-text-primary font-medium' 
                    : 'text-text-secondary'
                }`}
              >
                {isHome && <Home className="w-4 h-4 mr-1" />}
                {item.label}
              </span>
            )}
          </div>
        );
      })}
    </nav>
  );
}
