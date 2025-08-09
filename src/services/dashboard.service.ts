/**
 * Dashboard Service - Fetch real user dashboard data
 */

import { apiClient, ApiResponse } from '@/lib/api-client'

export interface DashboardStats {
  propertiesViewed: number
  savedProperties: number
  messages: number
  profileViews: number
  totalListings?: number
  activeProjects?: number
  completedProjects?: number
  totalRevenue?: number
}

export interface ActivityItem {
  id: string
  type: 'property_view' | 'message' | 'broker_contact' | 'application' | 'listing' | 'project_update'
  title: string
  description: string
  timestamp: string
  link?: string
  user?: {
    name: string
    role: string
  }
}

export interface DashboardData {
  stats: DashboardStats
  recentActivity: ActivityItem[]
  notifications: {
    unread: number
    items: Array<{
      id: string
      title: string
      message: string
      type: 'info' | 'warning' | 'success' | 'error'
      timestamp: string
      read: boolean
    }>
  }
}

class DashboardService {
  /**
   * Get user dashboard data
   */
  async getDashboardData(): Promise<ApiResponse<DashboardData>> {
    try {
      // Try to fetch real dashboard data from backend
      const response = await apiClient.get<DashboardData>('/user-service/api/v1/user/dashboard')

      if (response.success && response.data) {
        return response
      }

      // Fallback to basic stats if dashboard endpoint doesn't exist
      const [statsResponse, activityResponse] = await Promise.allSettled([
        this.getUserStats(),
        this.getUserActivity()
      ])

      const stats = statsResponse.status === 'fulfilled' && statsResponse.value.success
        ? statsResponse.value.data
        : this.getDefaultStats()

      const recentActivity = activityResponse.status === 'fulfilled' && activityResponse.value.success
        ? activityResponse.value.data
        : []

      return {
        success: true,
        data: {
          stats,
          recentActivity,
          notifications: {
            unread: 0,
            items: []
          }
        }
      }
    } catch (error) {
      // Silently return default data if backend is not available
      return {
        success: true,
        data: {
          stats: this.getDefaultStats(),
          recentActivity: [],
          notifications: {
            unread: 0,
            items: []
          }
        }
      }
    }
  }

  /**
   * Get user statistics
   */
  async getUserStats(): Promise<ApiResponse<DashboardStats>> {
    try {
      return await apiClient.get<DashboardStats>('/user-service/api/v1/user/stats')
    } catch (error) {
      return { success: false, error: 'Stats not available' }
    }
  }

  /**
   * Get user recent activity
   */
  async getUserActivity(): Promise<ApiResponse<ActivityItem[]>> {
    try {
      return await apiClient.get<ActivityItem[]>('/user-service/api/v1/user/activity')
    } catch (error) {
      return { success: false, error: 'Activity not available' }
    }
  }

  /**
   * Get default stats when API is unavailable
   */
  private getDefaultStats(): DashboardStats {
    return {
      propertiesViewed: 0,
      savedProperties: 0,
      messages: 0,
      profileViews: 0
    }
  }

  /**
   * Mark notification as read
   */
  async markNotificationRead(notificationId: string): Promise<ApiResponse<void>> {
    return apiClient.patch<void>(`/user-service/api/v1/user/notifications/${notificationId}/read`)
  }

  /**
   * Get user notifications
   */
  async getNotifications(): Promise<ApiResponse<DashboardData['notifications']>> {
    return apiClient.get<DashboardData['notifications']>('/user-service/api/v1/user/notifications')
  }
}

export const dashboardService = new DashboardService()
