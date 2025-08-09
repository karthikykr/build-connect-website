import { ReactNode } from 'react';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { Breadcrumb } from './Breadcrumb';

interface BreadcrumbItem {
  label: string;
  href?: string;
  current?: boolean;
}

interface DashboardLayoutProps {
  children: ReactNode;
  breadcrumbs?: BreadcrumbItem[];
  title?: string;
  description?: string;
  actions?: ReactNode;
  className?: string;
}

export function DashboardLayout({
  children,
  breadcrumbs,
  title,
  description,
  actions,
  className = '',
}: DashboardLayoutProps) {
  return (
    <div className="bg-background min-h-screen">
      <Header />

      <div className="flex">
        <Sidebar className="fixed top-16 hidden h-[calc(100vh-4rem)] lg:block" />

        <main className="flex-1 lg:ml-64">
          <div className={`p-6 ${className}`}>
            {/* Page Header */}
            {(breadcrumbs || title || description || actions) && (
              <div className="mb-6">
                {breadcrumbs && (
                  <Breadcrumb items={breadcrumbs} className="mb-4" />
                )}

                {(title || description || actions) && (
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      {title && (
                        <h1 className="text-text-primary mb-2 text-2xl font-bold">
                          {title}
                        </h1>
                      )}
                      {description && (
                        <p className="text-text-secondary">{description}</p>
                      )}
                    </div>

                    {actions && <div className="mt-4 sm:mt-0">{actions}</div>}
                  </div>
                )}
              </div>
            )}

            {/* Page Content */}
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
