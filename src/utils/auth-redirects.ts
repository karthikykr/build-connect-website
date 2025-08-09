/**
 * Authentication Redirect Utilities
 * Handles role-based redirects after login
 */

import { UserRole } from '@/types';

export interface RedirectConfig {
  role: UserRole;
  defaultPath: string;
  dashboardPath: string;
  onboardingPath?: string;
}

// Role-based redirect configuration
export const ROLE_REDIRECTS: Record<UserRole, RedirectConfig> = {
  user: {
    role: 'user',
    defaultPath: '/dashboard',
    dashboardPath: '/dashboard',
    onboardingPath: '/onboarding/user'
  },
  broker: {
    role: 'broker',
    defaultPath: '/broker/dashboard',
    dashboardPath: '/broker/dashboard',
    onboardingPath: '/onboarding/broker'
  },
  contractor: {
    role: 'contractor',
    defaultPath: '/contractor/dashboard',
    dashboardPath: '/contractor/dashboard',
    onboardingPath: '/onboarding/contractor'
  },
  admin: {
    role: 'admin',
    defaultPath: '/admin/dashboard',
    dashboardPath: '/admin/dashboard'
  }
};

/**
 * Get redirect URL based on user role and verification status
 */
export function getRedirectUrl(
  role: UserRole,
  isVerified: boolean = false,
  callbackUrl?: string
): string {
  const config = ROLE_REDIRECTS[role];
  
  if (!config) {
    console.warn(`Unknown role: ${role}, redirecting to default dashboard`);
    return '/dashboard';
  }

  // If there's a callback URL, use it (but validate it's safe)
  if (callbackUrl && isValidCallbackUrl(callbackUrl)) {
    return callbackUrl;
  }

  // For unverified users, redirect to onboarding if available
  if (!isVerified && config.onboardingPath) {
    return config.onboardingPath;
  }

  // Default to role-specific dashboard
  return config.dashboardPath;
}

/**
 * Validate callback URL to prevent open redirects
 */
function isValidCallbackUrl(url: string): boolean {
  try {
    // Allow relative URLs
    if (url.startsWith('/') && !url.startsWith('//')) {
      return true;
    }

    // Allow same-origin URLs
    const urlObj = new URL(url);
    const currentOrigin = typeof window !== 'undefined' 
      ? window.location.origin 
      : process.env.NEXTAUTH_URL || 'http://localhost:3008';
    
    return urlObj.origin === currentOrigin;
  } catch {
    return false;
  }
}

/**
 * Get dashboard URL for a specific role
 */
export function getDashboardUrl(role: UserRole): string {
  const config = ROLE_REDIRECTS[role];
  return config?.dashboardPath || '/dashboard';
}

/**
 * Get onboarding URL for a specific role
 */
export function getOnboardingUrl(role: UserRole): string {
  const config = ROLE_REDIRECTS[role];
  return config?.onboardingPath || '/onboarding';
}

/**
 * Check if user should be redirected to onboarding
 */
export function shouldRedirectToOnboarding(
  role: UserRole,
  isVerified: boolean,
  hasCompletedOnboarding: boolean = false
): boolean {
  const config = ROLE_REDIRECTS[role];
  
  // No onboarding path configured
  if (!config?.onboardingPath) {
    return false;
  }

  // User is not verified and hasn't completed onboarding
  return !isVerified && !hasCompletedOnboarding;
}

/**
 * Get role-specific navigation items
 */
export function getRoleNavigation(role: UserRole) {
  switch (role) {
    case 'user':
      return [
        { label: 'Dashboard', href: '/dashboard' },
        { label: 'Browse Properties', href: '/properties' },
        { label: 'Find Brokers', href: '/brokers' },
        { label: 'Find Contractors', href: '/contractors' },
        { label: 'My Inquiries', href: '/inquiries' },
        { label: 'Saved Properties', href: '/saved' },
      ];
    
    case 'broker':
      return [
        { label: 'Dashboard', href: '/broker/dashboard' },
        { label: 'My Listings', href: '/broker/listings' },
        { label: 'Leads', href: '/broker/leads' },
        { label: 'Clients', href: '/broker/clients' },
        { label: 'Analytics', href: '/broker/analytics' },
        { label: 'Profile', href: '/broker/profile' },
      ];
    
    case 'contractor':
      return [
        { label: 'Dashboard', href: '/contractor/dashboard' },
        { label: 'Projects', href: '/contractor/projects' },
        { label: 'Portfolio', href: '/contractor/portfolio' },
        { label: 'Leads', href: '/contractor/leads' },
        { label: 'Schedule', href: '/contractor/schedule' },
        { label: 'Profile', href: '/contractor/profile' },
      ];
    
    case 'admin':
      return [
        { label: 'Dashboard', href: '/admin/dashboard' },
        { label: 'Users', href: '/admin/users' },
        { label: 'Properties', href: '/admin/properties' },
        { label: 'Brokers', href: '/admin/brokers' },
        { label: 'Contractors', href: '/admin/contractors' },
        { label: 'Analytics', href: '/admin/analytics' },
        { label: 'Settings', href: '/admin/settings' },
      ];
    
    default:
      return [
        { label: 'Dashboard', href: '/dashboard' },
      ];
  }
}

/**
 * Check if user has access to a specific route
 */
export function hasRouteAccess(
  userRole: UserRole,
  routePath: string,
  isVerified: boolean = false
): boolean {
  // Public routes
  const publicRoutes = ['/', '/about', '/contact', '/properties', '/brokers', '/contractors'];
  if (publicRoutes.some(route => routePath.startsWith(route))) {
    return true;
  }

  // Auth routes (only for unauthenticated users)
  if (routePath.startsWith('/auth/')) {
    return false; // Assuming user is authenticated if we're checking access
  }

  // Role-specific routes
  if (routePath.startsWith('/admin/')) {
    return userRole === 'admin';
  }

  if (routePath.startsWith('/broker/')) {
    return userRole === 'broker' && isVerified;
  }

  if (routePath.startsWith('/contractor/')) {
    return userRole === 'contractor' && isVerified;
  }

  // General dashboard access
  if (routePath.startsWith('/dashboard')) {
    return true; // All authenticated users can access general dashboard
  }

  // Default: allow access
  return true;
}
