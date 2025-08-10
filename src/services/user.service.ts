/**
 * User Service
 */

import { ApiResponse } from '@/lib/api-client'

export interface UserProfile {
  id: string
  name: string
  email: string
  phone?: string
  role: string
  location?: string[]
  isEmailVerified: boolean
  isPhoneVerified: boolean
  isAvailable: boolean
  partnershipRequest: string
  avatar?: string
  createdAt?: string
  updatedAt?: string
}

export interface UpdateProfileRequest {
  name?: string
  phone?: string
  location?: string[]
  avatar?: File
}

class UserService {
  /**
   * Get current user profile
   */
  async getProfile(accessToken: string, sessionId: string): Promise<ApiResponse<UserProfile>> {
    try {
      const response = await fetch('http://localhost:8080/user-service/api/v1/user/profile', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Session': sessionId,
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        mode: 'cors', // Explicitly set CORS mode
        credentials: 'omit', // Don't send cookies
        signal: AbortSignal.timeout(10000), // 10 second timeout
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Profile fetch failed: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      const userData = data.user || data;

      return {
        success: true,
        data: {
          id: userData.id || userData._id,
          name: userData.name,
          email: userData.email,
          phone: userData.phone,
          role: userData.role,
          location: userData.location || [],
          isEmailVerified: userData.isEmailVerified || false,
          isPhoneVerified: userData.isPhoneVerified || false,
          isAvailable: userData.isAvailable !== undefined ? userData.isAvailable : true,
          partnershipRequest: userData.partnershipRequest || 'NONE',
          avatar: userData.avatar,
          createdAt: userData.createdAt,
          updatedAt: userData.updatedAt,
        },
      };
    } catch (error) {

      // Check if it's a network error
      if (error instanceof TypeError && error.message === 'Failed to fetch') {
        return {
          success: false,
          error: 'Backend connection failed. Please ensure the backend server is running on port 3007.',
        };
      }

      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch profile',
      };
    }
  }

  /**
   * Get user data from root endpoint (fallback)
   */
  async getUserFromRoot(accessToken: string, sessionId: string): Promise<ApiResponse<UserProfile>> {
    try {
      const response = await fetch('http://localhost:8080/user-service/api/v1/', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Session': sessionId,
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        mode: 'cors', // Explicitly set CORS mode
        credentials: 'omit', // Don't send cookies
        signal: AbortSignal.timeout(10000), // 10 second timeout
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Root endpoint failed: ${response.status} - ${errorText}`);
      }

      const userData = await response.json();

      return {
        success: true,
        data: {
          id: userData.id,
          name: userData.name,
          email: userData.email,
          phone: userData.phone,
          role: userData.role,
          location: userData.location || [],
          isEmailVerified: userData.isEmailVerified || false,
          isPhoneVerified: userData.isPhoneVerified || false,
          isAvailable: userData.isAvailable !== undefined ? userData.isAvailable : true,
          partnershipRequest: userData.partnershipRequest || 'NONE',
          avatar: userData.avatar,
          createdAt: userData.createdAt,
          updatedAt: userData.updatedAt,
        },
      };
    } catch (error) {

      // Check if it's a network error
      if (error instanceof TypeError && error.message === 'Failed to fetch') {
        return {
          success: false,
          error: 'Backend connection failed. Please ensure the backend server is running on port 3007.',
        };
      }

      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch user data',
      };
    }
  }

  /**
   * Update user profile
   */
  async updateProfile(
    profileData: UpdateProfileRequest,
    accessToken: string,
    sessionId: string
  ): Promise<ApiResponse<{ message: string }>> {
    try {
      let requestData: FormData | UpdateProfileRequest = profileData;

      // Handle file upload for avatar if provided
      if (profileData.avatar) {
        const formData = new FormData();
        Object.entries(profileData).forEach(([key, value]) => {
          if (key === 'avatar' && value instanceof File) {
            formData.append('avatar', value);
          } else if (value !== undefined) {
            formData.append(key, String(value));
          }
        });
        requestData = formData;
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/user-service/api/v1/user/profile`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'X-Session-ID': sessionId,
          ...(!(requestData instanceof FormData) && { 'Content-Type': 'application/json' }),
        },
        body: requestData instanceof FormData ? requestData : JSON.stringify(requestData),
      });

      if (!response.ok) {
        throw new Error(`Profile update failed: ${response.status}`);
      }

      const data = await response.json();

      return {
        success: true,
        data: {
          message: data.message || 'Profile updated successfully',
        },
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to update profile',
      };
    }
  }
}

export const userService = new UserService();
