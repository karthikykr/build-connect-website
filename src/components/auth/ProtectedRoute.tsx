'use client';

import { useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { UserRole } from '@/types';
import { Loading } from '@/components/ui/Loading';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
  requireAuth?: boolean;
  fallback?: React.ReactNode;
}

export function ProtectedRoute({
  children,
  allowedRoles,
  requireAuth = true,
  fallback,
}: ProtectedRouteProps) {
  const { isLoading, isAuthenticated, hasRole, requireAuth: authRequire, requireRole } = useAuth();

  useEffect(() => {
    if (!isLoading) {
      if (requireAuth && !isAuthenticated) {
        authRequire();
        return;
      }

      if (allowedRoles && isAuthenticated && !hasRole(allowedRoles)) {
        requireRole(allowedRoles);
        return;
      }
    }
  }, [isLoading, isAuthenticated, requireAuth, allowedRoles, authRequire, hasRole, requireRole]);

  // Show loading while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loading size="lg" text="Loading..." />
      </div>
    );
  }

  // Show fallback if not authenticated and auth is required
  if (requireAuth && !isAuthenticated) {
    return fallback || (
      <div className="min-h-screen flex items-center justify-center">
        <Loading size="lg" text="Redirecting..." />
      </div>
    );
  }

  // Show fallback if authenticated but doesn't have required role
  if (allowedRoles && isAuthenticated && !hasRole(allowedRoles)) {
    return fallback || (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-text-primary mb-4">
            Access Denied
          </h1>
          <p className="text-text-secondary">
            You don't have permission to access this page.
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
