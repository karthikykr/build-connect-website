/**
 * Admin Service - Comprehensive Admin Management Service Integration
 */

import { apiClient, ApiResponse } from '@/lib/api-client'
import { 
  AdminDashboardStats, 
  AdminUser, 
  BrokerApplication, 
  ContractorApplication,
  User,
  BrokerProfile,
  ContractorProfile,
  Site,
  Project
} from '@/types'

// Dashboard Analytics Interfaces
export interface DashboardAnalytics {
  stats: AdminDashboardStats
  revenue: RevenueAnalytics
  userGrowth: UserGrowthMetrics
  transactions: TransactionAnalytics
}

export interface RevenueAnalytics {
  totalRevenue: number
  monthlyRevenue: number
  yearlyRevenue: number
  revenueGrowth: number
  revenueByCategory: Array<{
    category: string
    amount: number
    percentage: number
  }>
  monthlyRevenueData: Array<{
    month: string
    revenue: number
    growth: number
  }>
}

export interface UserGrowthMetrics {
  totalUsers: number
  newUsersThisMonth: number
  userGrowthRate: number
  usersByRole: Array<{
    role: string
    count: number
    percentage: number
  }>
  monthlyUserGrowth: Array<{
    month: string
    users: number
    growth: number
  }>
}

export interface TransactionAnalytics {
  totalTransactions: number
  successfulTransactions: number
  failedTransactions: number
  averageTransactionValue: number
  transactionsByType: Array<{
    type: string
    count: number
    amount: number
  }>
}

// User Management Interfaces
export interface UserFilters extends Record<string, unknown> {
  search?: string
  role?: 'user' | 'broker' | 'contractor' | 'admin'
  status?: 'active' | 'inactive' | 'suspended'
  verificationStatus?: 'pending' | 'verified' | 'rejected'
  dateFrom?: string
  dateTo?: string
  sortBy?: 'createdAt' | 'name' | 'email' | 'lastLogin'
  sortOrder?: 'asc' | 'desc'
  page?: number
  limit?: number
}

export interface UserListResponse {
  users: AdminUser[]
  total: number
  page: number
  limit: number
  totalPages: number
  filters: UserFilters
}

// Verification Interfaces
export interface VerificationRequest {
  id: string
  type: 'broker' | 'contractor'
  userId: string
  userName: string
  email: string
  applicationData: BrokerApplication | ContractorApplication
  status: 'pending' | 'approved' | 'rejected'
  submittedAt: string
  reviewedAt?: string
  reviewedBy?: string
  notes?: string
}

export interface VerificationAction {
  status: 'approved' | 'rejected'
  notes?: string
  verifiedDocuments?: string[]
}

// System Settings Interfaces
export interface SystemSettings {
  general: {
    siteName: string
    siteDescription: string
    contactEmail: string
    supportEmail: string
    maintenanceMode: boolean
  }
  features: {
    enableChat: boolean
    enableVideoCall: boolean
    enableAIFeatures: boolean
    enableSiteScouting: boolean
    enableCommissionTracking: boolean
  }
  payments: {
    enablePayments: boolean
    defaultCurrency: string
    supportedCurrencies: string[]
    paymentGateways: string[]
  }
  notifications: {
    enableEmailNotifications: boolean
    enableSMSNotifications: boolean
    enablePushNotifications: boolean
  }
}

export interface CommissionSettings {
  brokerCommission: number
  contractorCommission: number
  platformFee: number
  minimumCommission: number
  maximumCommission: number
  commissionTiers: Array<{
    minAmount: number
    maxAmount: number
    percentage: number
  }>
}

class AdminService {
  /**
   * Get dashboard statistics
   */
  async getDashboardStats(): Promise<ApiResponse<AdminDashboardStats>> {
    return apiClient.get<AdminDashboardStats>('/admin-service/api/v1/dashboard/stats')
  }

  /**
   * Get revenue analytics
   */
  async getRevenueAnalytics(dateRange?: {
    startDate: string
    endDate: string
  }): Promise<ApiResponse<RevenueAnalytics>> {
    return apiClient.get<RevenueAnalytics>('/admin-service/api/v1/dashboard/revenue', {
      params: dateRange,
    })
  }

  /**
   * Get user growth metrics
   */
  async getUserGrowthMetrics(dateRange?: {
    startDate: string
    endDate: string
  }): Promise<ApiResponse<UserGrowthMetrics>> {
    return apiClient.get<UserGrowthMetrics>('/admin-service/api/v1/dashboard/user-growth', {
      params: dateRange,
    })
  }

  /**
   * Get transaction analytics
   */
  async getTransactionAnalytics(dateRange?: {
    startDate: string
    endDate: string
  }): Promise<ApiResponse<TransactionAnalytics>> {
    return apiClient.get<TransactionAnalytics>('/admin-service/api/v1/dashboard/transactions', {
      params: dateRange,
    })
  }

  /**
   * Get all users with filters
   */
  async getUsers(filters: UserFilters = {}): Promise<ApiResponse<UserListResponse>> {
    return apiClient.get<UserListResponse>('/admin-service/api/v1/users', {
      params: filters,
    })
  }

  /**
   * Get user by ID
   */
  async getUser(userId: string): Promise<ApiResponse<AdminUser>> {
    return apiClient.get<AdminUser>(`/admin-service/api/v1/users/${userId}`)
  }

  /**
   * Update user status
   */
  async updateUserStatus(userId: string, status: 'active' | 'inactive' | 'suspended'): Promise<ApiResponse<void>> {
    return apiClient.put(`/admin-service/api/v1/users/${userId}/status`, { status }, {
      showSuccessToast: true,
      successMessage: `User status updated to ${status}.`,
    })
  }

  /**
   * Verify user
   */
  async verifyUser(userId: string): Promise<ApiResponse<void>> {
    return apiClient.put(`/admin-service/api/v1/users/${userId}/verify`, {}, {
      showSuccessToast: true,
      successMessage: 'User verified successfully.',
    })
  }

  /**
   * Delete user
   */
  async deleteUser(userId: string): Promise<ApiResponse<void>> {
    return apiClient.delete(`/admin-service/api/v1/users/${userId}`, {
      showSuccessToast: true,
      successMessage: 'User deleted successfully.',
    })
  }

  /**
   * Get all brokers
   */
  async getBrokers(filters?: UserFilters): Promise<ApiResponse<BrokerProfile[]>> {
    return apiClient.get<BrokerProfile[]>('/admin-service/api/v1/brokers', {
      params: filters,
    })
  }

  /**
   * Get broker applications
   */
  async getBrokerApplications(status?: 'pending' | 'approved' | 'rejected'): Promise<ApiResponse<VerificationRequest[]>> {
    return apiClient.get<VerificationRequest[]>('/admin-service/api/v1/brokers/applications', {
      params: status ? { status } : {},
    })
  }

  /**
   * Approve broker application
   */
  async approveBrokerApplication(applicationId: string, notes?: string): Promise<ApiResponse<void>> {
    return apiClient.post(`/admin-service/api/v1/brokers/applications/${applicationId}/approve`, {
      notes,
    }, {
      showSuccessToast: true,
      successMessage: 'Broker application approved successfully.',
    })
  }

  /**
   * Reject broker application
   */
  async rejectBrokerApplication(applicationId: string, notes: string): Promise<ApiResponse<void>> {
    return apiClient.post(`/admin-service/api/v1/brokers/applications/${applicationId}/reject`, {
      notes,
    }, {
      showSuccessToast: true,
      successMessage: 'Broker application rejected.',
    })
  }

  /**
   * Update broker commission
   */
  async updateBrokerCommission(brokerId: string, commission: number): Promise<ApiResponse<void>> {
    return apiClient.put(`/admin-service/api/v1/brokers/${brokerId}/commission`, {
      commission,
    }, {
      showSuccessToast: true,
      successMessage: 'Broker commission updated successfully.',
    })
  }

  /**
   * Get all contractors
   */
  async getContractors(filters?: UserFilters): Promise<ApiResponse<ContractorProfile[]>> {
    return apiClient.get<ContractorProfile[]>('/admin-service/api/v1/contractors', {
      params: filters,
    })
  }

  /**
   * Get contractor applications
   */
  async getContractorApplications(status?: 'pending' | 'approved' | 'rejected'): Promise<ApiResponse<VerificationRequest[]>> {
    return apiClient.get<VerificationRequest[]>('/admin-service/api/v1/contractors/applications', {
      params: status ? { status } : {},
    })
  }

  /**
   * Approve contractor application
   */
  async approveContractorApplication(applicationId: string, notes?: string): Promise<ApiResponse<void>> {
    return apiClient.post(`/admin-service/api/v1/contractors/applications/${applicationId}/approve`, {
      notes,
    }, {
      showSuccessToast: true,
      successMessage: 'Contractor application approved successfully.',
    })
  }

  /**
   * Reject contractor application
   */
  async rejectContractorApplication(applicationId: string, notes: string): Promise<ApiResponse<void>> {
    return apiClient.post(`/admin-service/api/v1/contractors/applications/${applicationId}/reject`, {
      notes,
    }, {
      showSuccessToast: true,
      successMessage: 'Contractor application rejected.',
    })
  }

  /**
   * Update contractor rating
   */
  async updateContractorRating(contractorId: string, rating: number): Promise<ApiResponse<void>> {
    return apiClient.put(`/admin-service/api/v1/contractors/${contractorId}/rating`, {
      rating,
    }, {
      showSuccessToast: true,
      successMessage: 'Contractor rating updated successfully.',
    })
  }

  /**
   * Get all transactions
   */
  async getTransactions(filters?: {
    status?: 'pending' | 'completed' | 'failed' | 'cancelled'
    type?: 'commission' | 'subscription' | 'listing_fee' | 'premium_feature'
    dateFrom?: string
    dateTo?: string
    page?: number
    limit?: number
  }): Promise<ApiResponse<any[]>> {
    return apiClient.get('/admin-service/api/v1/transactions', {
      params: filters,
    })
  }

  /**
   * Get transaction details
   */
  async getTransaction(transactionId: string): Promise<ApiResponse<any>> {
    return apiClient.get(`/admin-service/api/v1/transactions/${transactionId}`)
  }

  /**
   * Process refund
   */
  async processRefund(transactionId: string, amount?: number, reason?: string): Promise<ApiResponse<void>> {
    return apiClient.post(`/admin-service/api/v1/transactions/${transactionId}/refund`, {
      amount,
      reason,
    }, {
      showSuccessToast: true,
      successMessage: 'Refund processed successfully.',
    })
  }

  /**
   * Handle dispute
   */
  async handleDispute(transactionId: string, action: 'resolve' | 'escalate', notes?: string): Promise<ApiResponse<void>> {
    return apiClient.post(`/admin-service/api/v1/transactions/${transactionId}/dispute`, {
      action,
      notes,
    }, {
      showSuccessToast: true,
      successMessage: `Dispute ${action}d successfully.`,
    })
  }

  /**
   * Get system settings
   */
  async getSystemSettings(): Promise<ApiResponse<SystemSettings>> {
    return apiClient.get<SystemSettings>('/admin-service/api/v1/settings/system')
  }

  /**
   * Update system settings
   */
  async updateSystemSettings(settings: Partial<SystemSettings>): Promise<ApiResponse<void>> {
    return apiClient.put('/admin-service/api/v1/settings/system', settings, {
      showSuccessToast: true,
      successMessage: 'System settings updated successfully.',
    })
  }

  /**
   * Get commission settings
   */
  async getCommissionSettings(): Promise<ApiResponse<CommissionSettings>> {
    return apiClient.get<CommissionSettings>('/admin-service/api/v1/settings/commission')
  }

  /**
   * Update commission settings
   */
  async updateCommissionSettings(settings: Partial<CommissionSettings>): Promise<ApiResponse<void>> {
    return apiClient.put('/admin-service/api/v1/settings/commission', settings, {
      showSuccessToast: true,
      successMessage: 'Commission settings updated successfully.',
    })
  }

  /**
   * Get all sites for admin review
   */
  async getSites(filters?: {
    status?: 'pending' | 'approved' | 'rejected'
    location?: string
    state?: string
    page?: number
    limit?: number
  }): Promise<ApiResponse<Site[]>> {
    return apiClient.get<Site[]>('/admin-service/api/v1/sites', {
      params: filters,
    })
  }

  /**
   * Approve/Reject site
   */
  async updateSiteStatus(siteId: string, status: 'approved' | 'rejected', notes?: string): Promise<ApiResponse<void>> {
    return apiClient.put(`/admin-service/api/v1/sites/${siteId}/status`, {
      status,
      notes,
    }, {
      showSuccessToast: true,
      successMessage: `Site ${status} successfully.`,
    })
  }

  /**
   * Get all projects for admin overview
   */
  async getProjects(filters?: {
    status?: 'Initiated' | 'Planning' | 'In Progress' | 'On Hold' | 'Completed' | 'Cancelled'
    userId?: string
    contractorId?: string
    brokerId?: string
    page?: number
    limit?: number
  }): Promise<ApiResponse<Project[]>> {
    return apiClient.get<Project[]>('/admin-service/api/v1/projects', {
      params: filters,
    })
  }

  /**
   * Export data
   */
  async exportData(type: 'users' | 'brokers' | 'contractors' | 'sites' | 'projects' | 'transactions', format: 'csv' | 'excel' = 'csv'): Promise<ApiResponse<{ downloadUrl: string }>> {
    return apiClient.get<{ downloadUrl: string }>(`/admin-service/api/v1/export/${type}`, {
      params: { format },
    })
  }

  /**
   * Get platform analytics
   */
  async getPlatformAnalytics(dateRange?: {
    startDate: string
    endDate: string
  }): Promise<ApiResponse<{
    totalUsers: number
    activeUsers: number
    totalRevenue: number
    totalTransactions: number
    averageTransactionValue: number
    topPerformingBrokers: any[]
    topPerformingContractors: any[]
    popularLocations: any[]
    revenueByMonth: any[]
    userGrowthByMonth: any[]
  }>> {
    return apiClient.get('/admin-service/api/v1/analytics', {
      params: dateRange,
    })
  }
}

// Create singleton instance
export const adminService = new AdminService()

// Export for testing
export { AdminService }
