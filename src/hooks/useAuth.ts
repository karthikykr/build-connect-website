import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { UserRole } from '@/types';
import { getRedirectUrl } from '@/utils/auth-redirects';

export function useAuth() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const user = session?.user;
  const isLoading = status === 'loading';
  const isAuthenticated = status === 'authenticated';

  const hasRole = (allowedRoles: UserRole[]): boolean => {
    if (!user?.role) return false;
    return allowedRoles.includes(user.role);
  };

  const isAdmin = (): boolean => {
    return user?.role === 'admin';
  };

  const isBroker = (): boolean => {
    return user?.role === 'broker';
  };

  const isContractor = (): boolean => {
    return user?.role === 'contractor';
  };

  const isBuyer = (): boolean => {
    return user?.role === 'user';
  };

  const logout = async () => {
    await signOut({
      callbackUrl: '/',
      redirect: true,
    });
  };

  const requireAuth = (redirectTo: string = '/auth/login') => {
    if (!isLoading && !isAuthenticated) {
      router.push(`${redirectTo}?callbackUrl=${window.location.pathname}`);
      return false;
    }
    return isAuthenticated;
  };

  const requireRole = (allowedRoles: UserRole[], redirectTo: string = '/dashboard') => {
    if (!isAuthenticated) {
      router.push('/auth/login');
      return false;
    }

    if (!hasRole(allowedRoles)) {
      router.push(redirectTo);
      return false;
    }

    return true;
  };

  const getRedirectPath = (): string => {
    if (!user?.role) return '/dashboard';

    switch (user.role) {
      case 'admin':
        return '/admin/dashboard';
      case 'broker':
        return '/brokers/dashboard';
      case 'contractor':
        return '/contractors/dashboard';
      default:
        return '/dashboard';
    }
  };

  return {
    user,
    isLoading,
    isAuthenticated,
    hasRole,
    isAdmin,
    isBroker,
    isContractor,
    isBuyer,
    logout,
    requireAuth,
    requireRole,
    getRedirectPath,
  };
}
