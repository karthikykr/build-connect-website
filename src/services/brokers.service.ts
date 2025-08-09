/**
 * Brokers Service
 */

import { apiClient, ApiResponse } from '@/lib/api-client'
import { BrokerProfile } from '@/types'

export interface BrokerFilters extends Record<string, unknown> {
  search?: string
  city?: string
  state?: string
  specializations?: string[]
  minRating?: number
  minExperience?: number
  verified?: boolean
  sortBy?: 'rating' | 'experience' | 'totalSales' | 'createdAt'
  sortOrder?: 'asc' | 'desc'
  page?: number
  limit?: number
}

export interface BrokerListResponse {
  brokers: BrokerProfile[]
  total: number
  page: number
  limit: number
  totalPages: number
  filters: BrokerFilters
}

// Backend-aligned Broker Application Request
export interface BrokerApplicationRequest {
  aadhaarNumber: string
  nameOnAadhaar: string
  dateOfBirth: string
  gender: 'male' | 'female' | 'other'
  address: string
  aadhaarDocument: File
  panNumber: string
  nameOnPAN: string
  panDocument: File
  serviceAreas: string[]
  experience: number
}

export interface BrokerVerificationRequest {
  brokerId: string
  status: 'pending' | 'verified' | 'rejected'
  notes?: string
  verifiedDocuments?: string[]
}

export interface BrokerReview {
  id: string
  brokerId: string
  userId: string
  userName: string
  rating: number
  comment: string
  propertyId?: string
  propertyTitle?: string
  createdAt: string
  response?: {
    message: string
    createdAt: string
  }
}

export interface BrokerStats {
  totalProperties: number
  activeListings: number
  propertiesSold: number
  totalRevenue: number
  averageRating: number
  totalReviews: number
  responseTime: string
  successRate: number
  monthlyStats: Array<{
    month: string
    properties: number
    sales: number
    revenue: number
  }>
}

class BrokersService {
  /**
   * Get brokers with filters and pagination
   */
  async getBrokers(filters: BrokerFilters = {}): Promise<ApiResponse<BrokerListResponse>> {
    return apiClient.get<BrokerListResponse>('/user-service/api/v1/brokers/all', {
      params: filters,
    })
  }

  /**
   * Get broker by ID
   */
  async getBroker(id: string): Promise<ApiResponse<BrokerProfile>> {
    return apiClient.get<BrokerProfile>(`/user-service/api/v1/brokers/profile/${id}`)
  }

  /**
   * Apply to become a broker
   */
  async applyToBroker(applicationData: BrokerApplicationRequest): Promise<ApiResponse<{
    applicationId: string
    message: string
  }>> {
    // Create FormData for file uploads
    const formData = new FormData()

    // Add text fields
    formData.append('aadhaarNumber', applicationData.aadhaarNumber)
    formData.append('nameOnAadhaar', applicationData.nameOnAadhaar)
    formData.append('dateOfBirth', applicationData.dateOfBirth)
    formData.append('gender', applicationData.gender)
    formData.append('address', applicationData.address)
    formData.append('panNumber', applicationData.panNumber)
    formData.append('nameOnPAN', applicationData.nameOnPAN)
    formData.append('serviceAreas', JSON.stringify(applicationData.serviceAreas))
    formData.append('experience', applicationData.experience.toString())

    // Add document files
    formData.append('aadhaarDocument', applicationData.aadhaarDocument)
    formData.append('panDocument', applicationData.panDocument)

    return apiClient.upload('/user-service/api/v1/brokers', formData, {
      showSuccessToast: true,
      successMessage: 'Broker application submitted successfully. We will review it within 3-5 business days.',
    })
  }

  /**
   * Get broker application status
   */
  async getApplicationStatus(): Promise<ApiResponse<{
    status: 'pending' | 'approved' | 'rejected' | 'under_review'
    submittedAt: string
    reviewedAt?: string
    notes?: string
    missingDocuments?: string[]
  }>> {
    return apiClient.get('/user-service/api/v1/brokers/application')
  }

  /**
   * Update broker application
   */
  async updateBrokerApplication(applicationData: Partial<BrokerApplicationRequest>): Promise<ApiResponse<{
    message: string
  }>> {
    const formData = new FormData()

    // Add updated fields
    Object.entries(applicationData).forEach(([key, value]) => {
      if (value !== undefined) {
        if (key === 'serviceAreas' && Array.isArray(value)) {
          formData.append(key, JSON.stringify(value))
        } else if (value instanceof File) {
          formData.append(key, value)
        } else {
          formData.append(key, String(value))
        }
      }
    })

    return apiClient.patch('/user-service/api/v1/brokers/application', formData, {
      showSuccessToast: true,
      successMessage: 'Application updated successfully.',
    })
  }

  /**
   * Update broker profile (for approved brokers)
   */
  async updateBrokerProfile(profileData: Partial<BrokerProfile>): Promise<ApiResponse<BrokerProfile>> {
    return apiClient.patch<BrokerProfile>('/user-service/api/v1/user/profile', profileData, {
      showSuccessToast: true,
      successMessage: 'Profile updated successfully.',
    })
  }

  /**
   * Get professionals for project requests (brokers)
   */
  async getProfessionalBrokers(filters?: {
    location?: string
    experience?: number
    specializations?: string[]
  }): Promise<ApiResponse<BrokerProfile[]>> {
    return apiClient.get<BrokerProfile[]>('/user-service/api/v1/professionals/brokers', {
      params: filters,
    })
  }

  /**
   * Get broker statistics
   */
  async getBrokerStats(brokerId?: string): Promise<ApiResponse<BrokerStats>> {
    const endpoint = brokerId ? `/brokers/${brokerId}/stats` : '/brokers/my-stats'
    return apiClient.get<BrokerStats>(endpoint)
  }

  /**
   * Get broker reviews
   */
  async getBrokerReviews(brokerId: string, page = 1, limit = 10): Promise<ApiResponse<{
    reviews: BrokerReview[]
    total: number
    averageRating: number
    ratingDistribution: Record<number, number>
  }>> {
    return apiClient.get(`/brokers/${brokerId}/reviews`, {
      params: { page, limit },
    })
  }

  /**
   * Add review for broker
   */
  async addBrokerReview(brokerId: string, review: {
    rating: number
    comment: string
    propertyId?: string
  }): Promise<ApiResponse<BrokerReview>> {
    return apiClient.post<BrokerReview>(`/brokers/${brokerId}/reviews`, review, {
      showSuccessToast: true,
      successMessage: 'Review submitted successfully.',
    })
  }

  /**
   * Respond to broker review
   */
  async respondToReview(reviewId: string, response: string): Promise<ApiResponse<BrokerReview>> {
    return apiClient.post<BrokerReview>(`/brokers/reviews/${reviewId}/respond`, {
      response,
    }, {
      showSuccessToast: true,
      successMessage: 'Response added successfully.',
    })
  }

  /**
   * Contact broker
   */
  async contactBroker(brokerId: string, message: {
    subject: string
    message: string
    propertyId?: string
    phone?: string
    preferredContactTime?: string
  }): Promise<ApiResponse<{ messageId: string }>> {
    return apiClient.post<{ messageId: string }>(`/brokers/${brokerId}/contact`, message, {
      showSuccessToast: true,
      successMessage: 'Message sent successfully. The broker will contact you soon.',
    })
  }

  /**
   * Get broker messages/inquiries
   */
  async getBrokerMessages(status?: 'new' | 'responded' | 'closed'): Promise<ApiResponse<Array<{
    id: string
    fromUserId: string
    fromUserName: string
    fromUserEmail: string
    subject: string
    message: string
    propertyId?: string
    propertyTitle?: string
    status: 'new' | 'responded' | 'closed'
    createdAt: string
    response?: {
      message: string
      createdAt: string
    }
  }>>> {
    return apiClient.get('/brokers/messages', {
      params: status ? { status } : {},
    })
  }

  /**
   * Respond to broker message
   */
  async respondToMessage(messageId: string, response: string): Promise<ApiResponse<void>> {
    return apiClient.post(`/brokers/messages/${messageId}/respond`, {
      response,
    }, {
      showSuccessToast: true,
      successMessage: 'Response sent successfully.',
    })
  }

  /**
   * Search brokers
   */
  async searchBrokers(query: string, filters: BrokerFilters = {}): Promise<ApiResponse<BrokerListResponse>> {
    return apiClient.get<BrokerListResponse>('/brokers/search', {
      params: {
        q: query,
        ...filters,
      },
    })
  }

  /**
   * Get featured brokers
   */
  async getFeaturedBrokers(limit = 6): Promise<ApiResponse<BrokerProfile[]>> {
    return apiClient.get<BrokerProfile[]>('/brokers/featured', {
      params: { limit },
    })
  }

  /**
   * Get broker recommendations
   */
  async getBrokerRecommendations(filters?: {
    location?: string
    propertyType?: string
    budget?: number
    limit?: number
  }): Promise<ApiResponse<BrokerProfile[]>> {
    return apiClient.get<BrokerProfile[]>('/brokers/recommendations', {
      params: filters,
    })
  }

  /**
   * Follow/Unfollow broker
   */
  async followBroker(brokerId: string): Promise<ApiResponse<void>> {
    return apiClient.post(`/brokers/${brokerId}/follow`, {}, {
      showSuccessToast: true,
      successMessage: 'Broker followed successfully.',
    })
  }

  async unfollowBroker(brokerId: string): Promise<ApiResponse<void>> {
    return apiClient.delete(`/brokers/${brokerId}/follow`, {
      showSuccessToast: true,
      successMessage: 'Broker unfollowed successfully.',
    })
  }

  /**
   * Get followed brokers
   */
  async getFollowedBrokers(): Promise<ApiResponse<BrokerProfile[]>> {
    return apiClient.get<BrokerProfile[]>('/brokers/following')
  }

  /**
   * Admin: Get broker verification requests
   */
  async getBrokerVerificationRequests(status?: 'pending' | 'verified' | 'rejected'): Promise<ApiResponse<Array<{
    id: string
    brokerId: string
    brokerName: string
    email: string
    applicationData: BrokerApplicationRequest
    status: 'pending' | 'verified' | 'rejected'
    submittedAt: string
    reviewedAt?: string
    reviewedBy?: string
    notes?: string
  }>>> {
    return apiClient.get('/admin/broker-verifications', {
      params: status ? { status } : {},
    })
  }

  /**
   * Admin: Verify/Reject broker
   */
  async verifyBroker(verificationData: BrokerVerificationRequest): Promise<ApiResponse<void>> {
    return apiClient.post('/admin/broker-verifications/verify', verificationData, {
      showSuccessToast: true,
      successMessage: `Broker ${verificationData.status} successfully.`,
    })
  }

  /**
   * Get broker performance metrics
   */
  async getBrokerPerformance(brokerId?: string, dateRange?: {
    startDate: string
    endDate: string
  }): Promise<ApiResponse<{
    totalViews: number
    totalInquiries: number
    conversionRate: number
    averageResponseTime: number
    customerSatisfaction: number
    performanceOverTime: Array<{
      date: string
      views: number
      inquiries: number
      responses: number
    }>
  }>> {
    const endpoint = brokerId ? `/brokers/${brokerId}/performance` : '/brokers/my-performance'
    return apiClient.get(endpoint, {
      params: dateRange,
    })
  }

  /**
   * Export broker data
   */
  async exportBrokerData(format: 'csv' | 'excel' = 'csv'): Promise<ApiResponse<{ downloadUrl: string }>> {
    return apiClient.get<{ downloadUrl: string }>('/brokers/export', {
      params: { format },
    })
  }

  /**
   * Get broker availability
   */
  async getBrokerAvailability(brokerId: string): Promise<ApiResponse<{
    available: boolean
    nextAvailable?: string
    workingHours: {
      [day: string]: {
        start: string
        end: string
        available: boolean
      }
    }
  }>> {
    return apiClient.get(`/brokers/${brokerId}/availability`)
  }

  /**
   * Update broker availability
   */
  async updateBrokerAvailability(availability: {
    workingHours: {
      [day: string]: {
        start: string
        end: string
        available: boolean
      }
    }
    timeZone: string
  }): Promise<ApiResponse<void>> {
    return apiClient.patch('/brokers/availability', availability, {
      showSuccessToast: true,
      successMessage: 'Availability updated successfully.',
    })
  }
}

// Create singleton instance
export const brokersService = new BrokersService()

// Export for testing
export { BrokersService }
