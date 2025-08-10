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

// Verification Interfaces - shaped for UI consumption
export interface VerificationRequest {
  _id: string
  type: 'broker' | 'contractor'
  applicantName: string
  email: string
  phone?: string
  status: 'pending' | 'approved' | 'rejected'
  submittedAt: string
  reviewedAt?: string
  reviewedBy?: string
  documents: Array<{ type: string; url: string; verified: boolean }>
  experience?: number
  specializations: string[]
  serviceAreas: string[]
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
   * Get dashboard statistics - map from unified analytics endpoint
   */
  async getDashboardStats(): Promise<ApiResponse<AdminDashboardStats>> {
    const res = await apiClient.get<any>('/admin-service/api/v1/analytics')
    const analytics = res as any
    const stats: AdminDashboardStats = {
      totalUsers: analytics?.overview?.totalUsers ?? 0,
      totalBrokers: analytics?.users?.brokers ?? 0,
      totalContractors: analytics?.users?.contractors ?? 0,
      totalSites: analytics?.overview?.totalSites ?? 0,
      totalProjects: analytics?.sites?.totalProjects ?? 0,
      pendingVerifications: analytics?.verifications?.pending ?? 0,
      totalRevenue: analytics?.transactions?.totalAmount ?? 0,
      monthlyGrowth: 0,
    }
    return { success: true, data: stats }
  }

  /**
   * Get revenue analytics - derived from unified analytics endpoint
   */
  async getRevenueAnalytics(dateRange?: { startDate: string; endDate: string; }): Promise<ApiResponse<RevenueAnalytics>> {
    const res = await apiClient.get<any>('/admin-service/api/v1/analytics', { params: dateRange })
    const analytics = res as any
    const revenue: RevenueAnalytics = {
      totalRevenue: analytics?.transactions?.totalAmount ?? 0,
      monthlyRevenue: analytics?.transactions?.monthlyRevenue ?? analytics?.transactions?.totalAmount ?? 0,
      yearlyRevenue: analytics?.transactions?.yearlyRevenue ?? analytics?.transactions?.totalAmount ?? 0,
      revenueGrowth: analytics?.transactions?.growth ?? 0,
      revenueByCategory: analytics?.transactions?.revenueByType ?? [],
      monthlyRevenueData: analytics?.transactions?.monthlyTransactionData ?? [],
    }
    return { success: true, data: revenue }
  }

  /**
   * Get user growth metrics - derived from unified analytics endpoint
   */
  async getUserGrowthMetrics(dateRange?: { startDate: string; endDate: string; }): Promise<ApiResponse<UserGrowthMetrics>> {
    const res = await apiClient.get<any>('/admin-service/api/v1/analytics', { params: dateRange })
    const analytics = res as any
    const userGrowth: UserGrowthMetrics = {
      totalUsers: analytics?.users?.totalUsers ?? analytics?.overview?.totalUsers ?? 0,
      newUsersThisMonth: analytics?.users?.newUsers ?? 0,
      userGrowthRate: analytics?.users?.growth ?? 0,
      usersByRole: [
        { role: 'site_owner', count: analytics?.users?.regularUsers ?? 0, percentage: 0 },
        { role: 'contractor', count: analytics?.users?.contractors ?? 0, percentage: 0 },
        { role: 'broker', count: analytics?.users?.brokers ?? 0, percentage: 0 },
      ],
      monthlyUserGrowth: analytics?.users?.monthlyUserGrowth ?? [],
    }
    return { success: true, data: userGrowth }
  }

  /**
   * Get transaction analytics - derived from unified analytics endpoint
   */
  async getTransactionAnalytics(dateRange?: { startDate: string; endDate: string; }): Promise<ApiResponse<TransactionAnalytics>> {
    const res = await apiClient.get<any>('/admin-service/api/v1/analytics', { params: dateRange })
    const analytics = res as any
    const tx: TransactionAnalytics = {
      totalTransactions: analytics?.transactions?.totalTransactions ?? 0,
      successfulTransactions: analytics?.transactions?.successfulTransactions ?? 0,
      failedTransactions: analytics?.transactions?.failedTransactions ?? 0,
      averageTransactionValue: analytics?.transactions?.averageAmount ?? 0,
      transactionsByType: analytics?.transactions?.transactionsByType ?? [],
    }
    return { success: true, data: tx }
  }

  /**
   * Get all users with filters - normalize to ApiResponse shape
   */
  async getUsers(filters: UserFilters = {}): Promise<ApiResponse<UserListResponse>> {
    const raw = await apiClient.get<any>('/admin-service/api/v1/users', { params: filters })
    const users = (raw as any)?.users ?? []
    const pagination = (raw as any)?.pagination ?? {}
    const data: UserListResponse = {
      users,
      total: pagination.totalCount ?? users.length,
      page: pagination.currentPage ?? 1,
      limit: pagination.limit ?? (filters.limit as number) ?? 20,
      totalPages: pagination.totalPages ?? 1,
      filters,
    }
    return { success: true, data }
  }

  /**
   * Get user by ID
   */
  async getUser(userId: string): Promise<ApiResponse<AdminUser>> {
    const raw = await apiClient.get<any>(`/admin-service/api/v1/users/${userId}`)
    return { success: true, data: (raw as any) }
  }

  /**
   * Update user status (maps to boolean isActive)
   */
  async updateUserStatus(userId: string, status: 'active' | 'inactive' | 'suspended', reason?: string): Promise<ApiResponse<void>> {
    const isActive = status === 'active'
    await apiClient.patch(`/admin-service/api/v1/users/${userId}/status`, { isActive, reason })
    return { success: true }
  }

  /**
   * Verify user (no direct endpoint in admin service; keep for future)
   */
  async verifyUser(_userId: string): Promise<ApiResponse<void>> {
    return { success: true }
  }

  /**
   * Delete user (not exposed via admin service currently)
   */
  async deleteUser(_userId: string): Promise<ApiResponse<void>> {
    return { success: true }
  }

  /**
   * Get all brokers
   */
  async getBrokers(filters?: UserFilters): Promise<ApiResponse<BrokerProfile[]>> {
    const raw = await apiClient.get<any>('/admin-service/api/v1/brokers', { params: filters })
    return { success: true, data: (raw as any)?.brokers ?? (raw as any) ?? [] }
  }

  /**
   * Get broker applications (proxy to verifications?type=broker)
   */
  async getBrokerApplications(status?: 'pending' | 'approved' | 'rejected'): Promise<ApiResponse<VerificationRequest[]>> {
    const raw = await apiClient.get<any>('/admin-service/api/v1/verifications', { params: { type: 'broker', ...(status ? { status } : {}) } })
    const items = (raw as any)?.verificationRequests ?? []
    const mapped: VerificationRequest[] = items.map((v: any) => {
      const ed = v.entityData || {}
      const docs: Array<{ type: string; url: string; verified: boolean }> = []
      if (ed.aadhaarDocument) docs.push({ type: 'aadhaar', url: ed.aadhaarDocument, verified: false })
      if (ed.panDocument) docs.push({ type: 'pan', url: ed.panDocument, verified: false })
      if (ed.licenseDocument) docs.push({ type: 'license', url: ed.licenseDocument, verified: false })
      return {
        _id: v._id,
        type: v.type,
        applicantName: ed.nameOnAadhaar || ed.name || 'Applicant',
        email: ed.email || '',
        phone: ed.phone || '',
        status: v.status,
        submittedAt: v.createdAt,
        reviewedAt: v.processedAt,
        reviewedBy: v.verifiedBy,
        documents: docs,
        experience: ed.experience || 0,
        specializations: ed.specializations || [],
        serviceAreas: ed.serviceAreas || [],
        notes: v.notes || '',
      }
    })
    return { success: true, data: mapped }
  }

  /**
   * Approve broker application (maps to PATCH /verifications/:id/approve)
   */
  async approveBrokerApplication(applicationId: string, notes?: string): Promise<ApiResponse<void>> {
    await apiClient.patch(`/admin-service/api/v1/verifications/${applicationId}/approve`, { reasonForApproval: notes || 'Approved by admin', notes })
    return { success: true }
  }

  /**
   * Reject broker application (maps to PATCH /verifications/:id/reject)
   */
  async rejectBrokerApplication(applicationId: string, notes: string): Promise<ApiResponse<void>> {
    await apiClient.patch(`/admin-service/api/v1/verifications/${applicationId}/reject`, { reasonForRejection: notes || 'Rejected by admin', notes })
    return { success: true }
  }

  /**
   * Helper used by UI: update broker application status
   */
  async updateBrokerApplicationStatus(applicationId: string, status: 'approved' | 'rejected', notes?: string): Promise<ApiResponse<void>> {
    if (status === 'approved') {
      return this.approveBrokerApplication(applicationId, notes)
    }
    return this.rejectBrokerApplication(applicationId, notes || 'Rejected by admin')
  }

  /**
   * Get all contractors
   */
  async getContractors(filters?: UserFilters): Promise<ApiResponse<ContractorProfile[]>> {
    const raw = await apiClient.get<any>('/admin-service/api/v1/contractors', { params: filters })
    return { success: true, data: (raw as any)?.contractors ?? (raw as any) ?? [] }
  }

  /**
   * Get contractor applications (proxy to verifications?type=contractor)
   */
  async getContractorApplications(status?: 'pending' | 'approved' | 'rejected'): Promise<ApiResponse<VerificationRequest[]>> {
    const raw = await apiClient.get<any>('/admin-service/api/v1/verifications', { params: { type: 'contractor', ...(status ? { status } : {}) } })
    const items = (raw as any)?.verificationRequests ?? []
    const mapped: VerificationRequest[] = items.map((v: any) => {
      const ed = v.entityData || {}
      const docs: Array<{ type: string; url: string; verified: boolean }> = []
      if (ed.aadhaarDocument) docs.push({ type: 'aadhaar', url: ed.aadhaarDocument, verified: false })
      if (ed.panDocument) docs.push({ type: 'pan', url: ed.panDocument, verified: false })
      return {
        _id: v._id,
        type: v.type,
        applicantName: ed.nameOnAadhaar || ed.name || 'Applicant',
        email: ed.email || '',
        phone: ed.phone || '',
        status: v.status,
        submittedAt: v.createdAt,
        reviewedAt: v.processedAt,
        reviewedBy: v.verifiedBy,
        documents: docs,
        experience: ed.experience || 0,
        specializations: ed.specializations || [],
        serviceAreas: ed.serviceAreas || [],
        notes: v.notes || '',
      }
    })
    return { success: true, data: mapped }
  }

  /**
   * Approve contractor application
   */
  async approveContractorApplication(applicationId: string, notes?: string): Promise<ApiResponse<void>> {
    await apiClient.patch(`/admin-service/api/v1/verifications/${applicationId}/approve`, { reasonForApproval: notes || 'Approved by admin', notes })
    return { success: true }
  }

  /**
   * Reject contractor application
   */
  async rejectContractorApplication(applicationId: string, notes: string): Promise<ApiResponse<void>> {
    await apiClient.patch(`/admin-service/api/v1/verifications/${applicationId}/reject`, { reasonForRejection: notes || 'Rejected by admin', notes })
    return { success: true }
  }

  /**
   * Helper used by UI: update contractor application status
   */
  async updateContractorApplicationStatus(applicationId: string, status: 'approved' | 'rejected', notes?: string): Promise<ApiResponse<void>> {
    if (status === 'approved') {
      return this.approveContractorApplication(applicationId, notes)
    }
    return this.rejectContractorApplication(applicationId, notes || 'Rejected by admin')
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
