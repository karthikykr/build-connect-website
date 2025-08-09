/**
 * Authentication API Hooks
 */

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { toast } from 'react-hot-toast'
import { authService, LoginRequest, RegisterRequest } from '@/services/auth.service'
import { User } from '@/types'

// Query Keys
export const authKeys = {
  all: ['auth'] as const,
  user: () => [...authKeys.all, 'user'] as const,
  sessions: () => [...authKeys.all, 'sessions'] as const,
}

/**
 * Get current user hook
 */
export function useCurrentUser() {
  return useQuery({
    queryKey: authKeys.user(),
    queryFn: async () => {
      const response = await authService.getCurrentUser()
      return response.data
    },
    enabled: authService.isAuthenticated(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: (failureCount, error: any) => {
      // Don't retry on 401 errors
      if (error?.status === 401) return false
      return failureCount < 3
    },
  })
}

/**
 * Login mutation hook
 */
export function useLogin() {
  const router = useRouter()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (credentials: LoginRequest) => authService.login(credentials),
    onSuccess: (response) => {
      if (response.success && response.data) {
        // Update user cache
        queryClient.setQueryData(authKeys.user(), response.data.user)
        
        // Redirect to dashboard or intended page
        const redirectTo = new URLSearchParams(window.location.search).get('redirect') || '/dashboard'
        router.push(redirectTo)
        
        toast.success('Welcome back!')
      }
    },
    onError: (error: any) => {
      toast.error(error.message || 'Login failed. Please try again.')
    },
  })
}

/**
 * Register mutation hook
 */
export function useRegister() {
  const router = useRouter()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (userData: RegisterRequest) => authService.register(userData),
    onSuccess: (response) => {
      if (response.success && response.data) {
        // Update user cache
        queryClient.setQueryData(authKeys.user(), response.data.user)
        
        // Redirect to dashboard
        router.push('/dashboard')
        
        toast.success('Account created successfully!')
      }
    },
    onError: (error: any) => {
      toast.error(error.message || 'Registration failed. Please try again.')
    },
  })
}

/**
 * Logout mutation hook
 */
export function useLogout() {
  const router = useRouter()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () => authService.logout(),
    onSuccess: () => {
      // Clear all cached data
      queryClient.clear()
      
      // Redirect to login page
      router.push('/auth/login')
      
      toast.success('Logged out successfully')
    },
    onError: (error: any) => {
      // Still clear cache and redirect even if API call fails
      queryClient.clear()
      router.push('/auth/login')
      
      console.error('Logout error:', error)
    },
  })
}

/**
 * Update profile mutation hook
 */
export function useUpdateProfile() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (userData: Partial<User>) => authService.updateProfile(userData),
    onSuccess: (response) => {
      if (response.success && response.data) {
        // Update user cache
        queryClient.setQueryData(authKeys.user(), response.data)
        
        // Invalidate related queries
        queryClient.invalidateQueries({ queryKey: authKeys.user() })
        
        toast.success('Profile updated successfully!')
      }
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to update profile')
    },
  })
}

/**
 * Upload avatar mutation hook
 */
export function useUploadAvatar() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (file: File) => authService.uploadAvatar(file),
    onSuccess: (response) => {
      if (response.success && response.data) {
        // Update user cache with new avatar URL
        queryClient.setQueryData(authKeys.user(), (oldData: User | undefined) => {
          if (oldData) {
            return {
              ...oldData,
              avatar: response.data!.avatarUrl,
            }
          }
          return oldData
        })
        
        toast.success('Avatar updated successfully!')
      }
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to upload avatar')
    },
  })
}

/**
 * Change password mutation hook
 */
export function useChangePassword() {
  return useMutation({
    mutationFn: (data: {
      currentPassword: string
      newPassword: string
      confirmPassword: string
    }) => authService.changePassword(data),
    onSuccess: () => {
      toast.success('Password changed successfully!')
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to change password')
    },
  })
}

/**
 * Forgot password mutation hook
 */
export function useForgotPassword() {
  return useMutation({
    mutationFn: (email: string) => authService.forgotPassword({ email }),
    onSuccess: () => {
      toast.success('Password reset email sent. Please check your inbox.')
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to send reset email')
    },
  })
}

/**
 * Reset password mutation hook
 */
export function useResetPassword() {
  const router = useRouter()

  return useMutation({
    mutationFn: (data: {
      token: string
      password: string
      confirmPassword: string
    }) => authService.resetPassword(data),
    onSuccess: () => {
      toast.success('Password reset successfully! You can now login.')
      router.push('/auth/login')
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to reset password')
    },
  })
}

/**
 * Verify email mutation hook
 */
export function useVerifyEmail() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (token: string) => authService.verifyEmail({ token }),
    onSuccess: () => {
      // Invalidate user query to refresh verification status
      queryClient.invalidateQueries({ queryKey: authKeys.user() })
      
      toast.success('Email verified successfully!')
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to verify email')
    },
  })
}

/**
 * Resend verification email mutation hook
 */
export function useResendVerification() {
  return useMutation({
    mutationFn: (email: string) => authService.resendVerification({ email }),
    onSuccess: () => {
      toast.success('Verification email sent. Please check your inbox.')
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to send verification email')
    },
  })
}

/**
 * Get user sessions hook
 */
export function useUserSessions() {
  return useQuery({
    queryKey: authKeys.sessions(),
    queryFn: async () => {
      const response = await authService.getSessions()
      return response.data
    },
    enabled: authService.isAuthenticated(),
    staleTime: 2 * 60 * 1000, // 2 minutes
  })
}

/**
 * Revoke session mutation hook
 */
export function useRevokeSession() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (sessionId: string) => authService.revokeSession(sessionId),
    onSuccess: () => {
      // Invalidate sessions query
      queryClient.invalidateQueries({ queryKey: authKeys.sessions() })
      
      toast.success('Session revoked successfully')
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to revoke session')
    },
  })
}

/**
 * Revoke all sessions mutation hook
 */
export function useRevokeAllSessions() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () => authService.revokeAllSessions(),
    onSuccess: () => {
      // Invalidate sessions query
      queryClient.invalidateQueries({ queryKey: authKeys.sessions() })
      
      toast.success('All sessions revoked successfully')
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to revoke sessions')
    },
  })
}

/**
 * Social login mutation hook
 */
export function useSocialLogin() {
  const router = useRouter()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: {
      provider: 'google' | 'facebook' | 'apple'
      token: string
      userData?: {
        name?: string
        email?: string
        avatar?: string
      }
    }) => authService.socialLogin(data),
    onSuccess: (response) => {
      if (response.success && response.data) {
        // Update user cache
        queryClient.setQueryData(authKeys.user(), response.data.user)
        
        // Redirect to dashboard
        router.push('/dashboard')
        
        toast.success('Login successful!')
      }
    },
    onError: (error: any) => {
      toast.error(error.message || 'Social login failed')
    },
  })
}

/**
 * Delete account mutation hook
 */
export function useDeleteAccount() {
  const router = useRouter()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (password: string) => authService.deleteAccount(password),
    onSuccess: () => {
      // Clear all cached data
      queryClient.clear()
      
      // Redirect to home page
      router.push('/')
      
      toast.success('Account deleted successfully')
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to delete account')
    },
  })
}
