/**
 * Authentication Service
 */

import { apiClient, ApiResponse } from '@/lib/api-client'
import { User, RefreshTokenResponse } from '@/types'

export interface LoginRequest {
  email: string
  password: string
  rememberMe?: boolean
}

export interface LoginResponse {
  user?: User
  accessToken: string
  sessionId: string
  message: string
}

export interface RegisterRequest {
  name: string
  email: string
  password: string
  confirmPassword?: string
  role?: 'user' | 'broker' | 'contractor'
  phone?: string
  acceptTerms?: boolean
  avatar?: File
}

export interface RegisterResponse {
  user: User
  accessToken: string
  sessionId: string
  message: string
}

export interface ForgotPasswordRequest {
  email: string
}

export interface ResetPasswordRequest {
  token: string
  password: string
  confirmPassword: string
}

export interface ChangePasswordRequest {
  currentPassword: string
  newPassword: string
  confirmPassword: string
}

export interface VerifyEmailRequest {
  token: string
}

export interface ResendVerificationRequest {
  email: string
}

export interface RefreshTokenRequest {
  refreshToken: string
}

export interface SocialLoginRequest {
  provider: 'google' | 'facebook' | 'apple'
  token: string
  userData?: {
    name?: string
    email?: string
    avatar?: string
  }
}

class AuthService {
  /**
   * Login with email and password
   */
  async login(credentials: LoginRequest): Promise<ApiResponse<LoginResponse>> {
    const response = await apiClient.post<LoginResponse>('/user-service/api/v1/login', credentials, {
      showSuccessToast: true,
      successMessage: 'Login successful! Welcome back.',
    })

    if (response.success && response.data) {
      // Set authentication tokens - backend returns accessToken and sessionId
      apiClient.setAuth(response.data.accessToken, response.data.sessionId)
    }

    return response
  }

  /**
   * Register new user
   */
  async register(userData: RegisterRequest): Promise<ApiResponse<RegisterResponse>> {
    // Handle file upload for avatar if provided
    let requestData: FormData | RegisterRequest = userData

    if (userData.avatar) {
      const formData = new FormData()
      Object.entries(userData).forEach(([key, value]) => {
        if (key === 'avatar' && value instanceof File) {
          formData.append('avatar', value)
        } else if (value !== undefined) {
          formData.append(key, String(value))
        }
      })
      requestData = formData
    }

    const response = await apiClient.post<RegisterResponse>('/user-service/api/v1/signup', requestData, {
      showSuccessToast: true,
      successMessage: 'Registration successful! Please verify your email.',
    })

    if (response.success && response.data) {
      // Set authentication tokens
      apiClient.setAuth(response.data.accessToken, response.data.sessionId)
    }

    return response
  }

  /**
   * Logout user
   */
  async logout(): Promise<ApiResponse<void>> {
    try {
      await apiClient.post('/auth/logout', {}, {
        showSuccessToast: true,
        successMessage: 'Logged out successfully.',
      })
    } catch (error) {
      // Continue with logout even if API call fails
      console.warn('Logout API call failed:', error)
    } finally {
      // Always clear local authentication
      apiClient.clearAuth()
    }

    return { success: true }
  }

  /**
   * Refresh authentication token
   */
  async refreshToken(): Promise<ApiResponse<RefreshTokenResponse>> {
    const response = await apiClient.post<RefreshTokenResponse>('/user-service/api/v1/refresh', {}, {
      showErrorToast: false, // Handle errors silently for token refresh
    })

    if (response.success && response.data) {
      // Keep existing sessionId, only update accessToken
      const sessionId = apiClient.getToken() // This should get sessionId from tokenManager
      if (sessionId) {
        apiClient.setAuth(response.data.accessToken, sessionId)
      }
    }

    return response
  }

  /**
   * Forgot password - send reset email
   */
  async forgotPassword(data: ForgotPasswordRequest): Promise<ApiResponse<{ message: string }>> {
    return apiClient.post('/auth/forgot-password', data, {
      showSuccessToast: true,
      successMessage: 'Password reset email sent. Please check your inbox.',
    })
  }

  /**
   * Reset password with token
   */
  async resetPassword(data: ResetPasswordRequest): Promise<ApiResponse<{ message: string }>> {
    return apiClient.post('/auth/reset-password', data, {
      showSuccessToast: true,
      successMessage: 'Password reset successful. You can now login with your new password.',
    })
  }

  /**
   * Change password for authenticated user
   */
  async changePassword(data: ChangePasswordRequest): Promise<ApiResponse<{ message: string }>> {
    return apiClient.post('/auth/change-password', data, {
      showSuccessToast: true,
      successMessage: 'Password changed successfully.',
    })
  }

  /**
   * Verify email address
   */
  async verifyEmail(data: VerifyEmailRequest): Promise<ApiResponse<{ message: string }>> {
    return apiClient.post('/auth/verify-email', data, {
      showSuccessToast: true,
      successMessage: 'Email verified successfully.',
    })
  }

  /**
   * Resend email verification
   */
  async resendVerification(data: ResendVerificationRequest): Promise<ApiResponse<{ message: string }>> {
    return apiClient.post('/auth/resend-verification', data, {
      showSuccessToast: true,
      successMessage: 'Verification email sent. Please check your inbox.',
    })
  }

  /**
   * Social login (Google, Facebook, Apple)
   */
  async socialLogin(data: SocialLoginRequest): Promise<ApiResponse<LoginResponse>> {
    const response = await apiClient.post<LoginResponse>('/auth/social-login', data, {
      showSuccessToast: true,
      successMessage: 'Login successful! Welcome back.',
    })

    if (response.success && response.data) {
      apiClient.setAuth(response.data.accessToken, response.data.sessionId)
    }

    return response
  }

  /**
   * Get current user profile
   */
  async getCurrentUser(): Promise<ApiResponse<User>> {
    return apiClient.get<User>('/user-service/api/v1/user/profile')
  }

  /**
   * Update user profile
   */
  async updateProfile(userData: Partial<User>): Promise<ApiResponse<User>> {
    return apiClient.patch<User>('/user-service/api/v1/user/profile', userData, {
      showSuccessToast: true,
      successMessage: 'Profile updated successfully.',
    })
  }

  /**
   * Upload profile avatar
   */
  async uploadAvatar(file: File): Promise<ApiResponse<{ avatarUrl: string }>> {
    const formData = new FormData()
    formData.append('avatar', file)
    return apiClient.upload<{ avatarUrl: string }>('/user-service/api/v1/user/profile', formData)
  }

  /**
   * Enable two-factor authentication
   */
  async enableTwoFactor(): Promise<ApiResponse<{ qrCode: string; secret: string }>> {
    return apiClient.post('/auth/2fa/enable')
  }

  /**
   * Verify two-factor authentication setup
   */
  async verifyTwoFactor(token: string): Promise<ApiResponse<{ backupCodes: string[] }>> {
    return apiClient.post('/auth/2fa/verify', { token }, {
      showSuccessToast: true,
      successMessage: 'Two-factor authentication enabled successfully.',
    })
  }

  /**
   * Disable two-factor authentication
   */
  async disableTwoFactor(token: string): Promise<ApiResponse<{ message: string }>> {
    return apiClient.post('/auth/2fa/disable', { token }, {
      showSuccessToast: true,
      successMessage: 'Two-factor authentication disabled.',
    })
  }

  /**
   * Get user sessions
   */
  async getSessions(): Promise<ApiResponse<Array<{
    id: string
    device: string
    location: string
    lastActive: string
    current: boolean
  }>>> {
    return apiClient.get('/auth/sessions')
  }

  /**
   * Revoke user session
   */
  async revokeSession(sessionId: string): Promise<ApiResponse<{ message: string }>> {
    return apiClient.delete(`/auth/sessions/${sessionId}`, {
      showSuccessToast: true,
      successMessage: 'Session revoked successfully.',
    })
  }

  /**
   * Revoke all sessions except current
   */
  async revokeAllSessions(): Promise<ApiResponse<{ message: string }>> {
    return apiClient.post('/auth/sessions/revoke-all', {}, {
      showSuccessToast: true,
      successMessage: 'All other sessions revoked successfully.',
    })
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    const token = apiClient.getToken()
    return !!token
  }

  /**
   * Get authentication token
   */
  getToken(): string | null {
    return apiClient.getToken()
  }

  /**
   * Clear authentication
   */
  clearAuth(): void {
    apiClient.clearAuth()
  }
}

// Create singleton instance
export const authService = new AuthService()

// Export for testing
export { AuthService }
