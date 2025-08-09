/**
 * Notifications Service
 */

import { apiClient, ApiResponse } from '@/lib/api-client'

export interface Notification {
  id: string
  type: 'info' | 'success' | 'warning' | 'error'
  category: 'property' | 'broker' | 'payment' | 'system' | 'site_scouting' | 'message'
  title: string
  message: string
  data?: Record<string, any>
  read: boolean
  actionUrl?: string
  actionText?: string
  priority: 'low' | 'medium' | 'high' | 'urgent'
  expiresAt?: string
  createdAt: string
  readAt?: string
}

export interface NotificationPreferences {
  email: {
    enabled: boolean
    frequency: 'immediate' | 'daily' | 'weekly'
    categories: {
      property: boolean
      broker: boolean
      payment: boolean
      system: boolean
      site_scouting: boolean
      message: boolean
    }
  }
  push: {
    enabled: boolean
    categories: {
      property: boolean
      broker: boolean
      payment: boolean
      system: boolean
      site_scouting: boolean
      message: boolean
    }
  }
  sms: {
    enabled: boolean
    categories: {
      payment: boolean
      system: boolean
      urgent: boolean
    }
  }
  inApp: {
    enabled: boolean
    sound: boolean
    categories: {
      property: boolean
      broker: boolean
      payment: boolean
      system: boolean
      site_scouting: boolean
      message: boolean
    }
  }
}

export interface CreateNotificationRequest {
  type: 'info' | 'success' | 'warning' | 'error'
  category: 'property' | 'broker' | 'payment' | 'system' | 'site_scouting' | 'message'
  title: string
  message: string
  recipients: string[] // User IDs
  data?: Record<string, any>
  actionUrl?: string
  actionText?: string
  priority?: 'low' | 'medium' | 'high' | 'urgent'
  expiresAt?: string
  sendEmail?: boolean
  sendPush?: boolean
  sendSms?: boolean
}

export interface NotificationFilters {
  category?: 'property' | 'broker' | 'payment' | 'system' | 'site_scouting' | 'message'
  type?: 'info' | 'success' | 'warning' | 'error'
  read?: boolean
  priority?: 'low' | 'medium' | 'high' | 'urgent'
  startDate?: string
  endDate?: string
  page?: number
  limit?: number
}

export interface NotificationStats {
  total: number
  unread: number
  byCategory: Record<string, number>
  byType: Record<string, number>
  byPriority: Record<string, number>
}

class NotificationsService {
  /**
   * Get user notifications
   */
  async getNotifications(filters: NotificationFilters = {}): Promise<ApiResponse<{
    notifications: Notification[]
    total: number
    unread: number
    page: number
    limit: number
    totalPages: number
  }>> {
    return apiClient.get('/notifications', {
      params: filters,
    })
  }

  /**
   * Get notification by ID
   */
  async getNotification(id: string): Promise<ApiResponse<Notification>> {
    return apiClient.get<Notification>(`/notifications/${id}`)
  }

  /**
   * Mark notification as read
   */
  async markAsRead(id: string): Promise<ApiResponse<void>> {
    return apiClient.patch(`/notifications/${id}/read`)
  }

  /**
   * Mark multiple notifications as read
   */
  async markMultipleAsRead(ids: string[]): Promise<ApiResponse<void>> {
    return apiClient.patch('/notifications/mark-read', { ids })
  }

  /**
   * Mark all notifications as read
   */
  async markAllAsRead(): Promise<ApiResponse<void>> {
    return apiClient.patch('/notifications/mark-all-read', {}, {
      showSuccessToast: true,
      successMessage: 'All notifications marked as read.',
    })
  }

  /**
   * Delete notification
   */
  async deleteNotification(id: string): Promise<ApiResponse<void>> {
    return apiClient.delete(`/notifications/${id}`)
  }

  /**
   * Delete multiple notifications
   */
  async deleteMultipleNotifications(ids: string[]): Promise<ApiResponse<void>> {
    return apiClient.delete('/notifications/bulk-delete', {
      data: { ids },
    })
  }

  /**
   * Clear all notifications
   */
  async clearAllNotifications(): Promise<ApiResponse<void>> {
    return apiClient.delete('/notifications/clear-all', {
      showSuccessToast: true,
      successMessage: 'All notifications cleared.',
    })
  }

  /**
   * Get notification statistics
   */
  async getNotificationStats(): Promise<ApiResponse<NotificationStats>> {
    return apiClient.get<NotificationStats>('/notifications/stats')
  }

  /**
   * Get notification preferences
   */
  async getNotificationPreferences(): Promise<ApiResponse<NotificationPreferences>> {
    return apiClient.get<NotificationPreferences>('/notifications/preferences')
  }

  /**
   * Update notification preferences
   */
  async updateNotificationPreferences(preferences: Partial<NotificationPreferences>): Promise<ApiResponse<NotificationPreferences>> {
    return apiClient.patch<NotificationPreferences>('/notifications/preferences', preferences, {
      showSuccessToast: true,
      successMessage: 'Notification preferences updated successfully.',
    })
  }

  /**
   * Subscribe to push notifications
   */
  async subscribeToPushNotifications(subscription: {
    endpoint: string
    keys: {
      p256dh: string
      auth: string
    }
  }): Promise<ApiResponse<void>> {
    return apiClient.post('/notifications/push/subscribe', subscription, {
      showSuccessToast: true,
      successMessage: 'Push notifications enabled successfully.',
    })
  }

  /**
   * Unsubscribe from push notifications
   */
  async unsubscribeFromPushNotifications(): Promise<ApiResponse<void>> {
    return apiClient.delete('/notifications/push/unsubscribe', {
      showSuccessToast: true,
      successMessage: 'Push notifications disabled successfully.',
    })
  }

  /**
   * Test notification delivery
   */
  async testNotification(channels: {
    email?: boolean
    push?: boolean
    sms?: boolean
    inApp?: boolean
  }): Promise<ApiResponse<void>> {
    return apiClient.post('/notifications/test', channels, {
      showSuccessToast: true,
      successMessage: 'Test notifications sent successfully.',
    })
  }

  /**
   * Create notification (admin only)
   */
  async createNotification(notification: CreateNotificationRequest): Promise<ApiResponse<Notification>> {
    return apiClient.post<Notification>('/notifications/create', notification, {
      showSuccessToast: true,
      successMessage: 'Notification created and sent successfully.',
    })
  }

  /**
   * Send bulk notifications (admin only)
   */
  async sendBulkNotifications(notifications: CreateNotificationRequest[]): Promise<ApiResponse<{
    sent: number
    failed: number
    errors: string[]
  }>> {
    return apiClient.post('/notifications/bulk-send', { notifications }, {
      showSuccessToast: true,
      successMessage: 'Bulk notifications sent successfully.',
    })
  }

  /**
   * Get notification templates (admin only)
   */
  async getNotificationTemplates(): Promise<ApiResponse<Array<{
    id: string
    name: string
    category: string
    subject: string
    body: string
    variables: string[]
    channels: string[]
  }>>> {
    return apiClient.get('/notifications/templates')
  }

  /**
   * Create notification template (admin only)
   */
  async createNotificationTemplate(template: {
    name: string
    category: string
    subject: string
    body: string
    variables: string[]
    channels: string[]
  }): Promise<ApiResponse<void>> {
    return apiClient.post('/notifications/templates', template, {
      showSuccessToast: true,
      successMessage: 'Notification template created successfully.',
    })
  }

  /**
   * Get notification delivery status
   */
  async getDeliveryStatus(notificationId: string): Promise<ApiResponse<{
    email: {
      sent: boolean
      delivered: boolean
      opened: boolean
      error?: string
    }
    push: {
      sent: boolean
      delivered: boolean
      clicked: boolean
      error?: string
    }
    sms: {
      sent: boolean
      delivered: boolean
      error?: string
    }
    inApp: {
      delivered: boolean
      read: boolean
    }
  }>> {
    return apiClient.get(`/notifications/${notificationId}/delivery-status`)
  }

  /**
   * Get notification analytics
   */
  async getNotificationAnalytics(dateRange?: {
    startDate: string
    endDate: string
  }): Promise<ApiResponse<{
    totalSent: number
    totalDelivered: number
    totalRead: number
    deliveryRate: number
    readRate: number
    clickRate: number
    byChannel: {
      email: {
        sent: number
        delivered: number
        opened: number
        clicked: number
      }
      push: {
        sent: number
        delivered: number
        clicked: number
      }
      sms: {
        sent: number
        delivered: number
      }
      inApp: {
        delivered: number
        read: number
      }
    }
    byCategory: Record<string, {
      sent: number
      read: number
      readRate: number
    }>
    trendsOverTime: Array<{
      date: string
      sent: number
      delivered: number
      read: number
    }>
  }>> {
    return apiClient.get('/notifications/analytics', {
      params: dateRange,
    })
  }

  /**
   * Schedule notification
   */
  async scheduleNotification(notification: CreateNotificationRequest & {
    scheduledAt: string
  }): Promise<ApiResponse<{
    scheduledId: string
    scheduledAt: string
  }>> {
    return apiClient.post('/notifications/schedule', notification, {
      showSuccessToast: true,
      successMessage: 'Notification scheduled successfully.',
    })
  }

  /**
   * Cancel scheduled notification
   */
  async cancelScheduledNotification(scheduledId: string): Promise<ApiResponse<void>> {
    return apiClient.delete(`/notifications/scheduled/${scheduledId}`, {
      showSuccessToast: true,
      successMessage: 'Scheduled notification cancelled.',
    })
  }

  /**
   * Get scheduled notifications
   */
  async getScheduledNotifications(): Promise<ApiResponse<Array<{
    id: string
    notification: CreateNotificationRequest
    scheduledAt: string
    status: 'pending' | 'sent' | 'cancelled'
    createdAt: string
  }>>> {
    return apiClient.get('/notifications/scheduled')
  }

  /**
   * Export notifications data
   */
  async exportNotifications(filters: NotificationFilters = {}, format: 'csv' | 'excel' = 'csv'): Promise<ApiResponse<{ downloadUrl: string }>> {
    return apiClient.get<{ downloadUrl: string }>('/notifications/export', {
      params: {
        ...filters,
        format,
      },
    })
  }
}

// Create singleton instance
export const notificationsService = new NotificationsService()

// Export for testing
export { NotificationsService }
