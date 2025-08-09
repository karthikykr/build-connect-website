/**
 * Site Scouting Service
 */

import { apiClient, ApiResponse } from '@/lib/api-client'

export interface SiteScoutRequest {
  id: string
  title: string
  description: string
  location: {
    address: string
    city: string
    state: string
    pincode: string
    coordinates?: {
      lat: number
      lng: number
    }
  }
  budget: {
    min: number
    max: number
  }
  requirements: {
    propertyType: string
    minArea: number
    maxArea: number
    amenities: string[]
    features: string[]
  }
  status: 'open' | 'assigned' | 'in_progress' | 'completed' | 'cancelled'
  priority: 'low' | 'medium' | 'high' | 'urgent'
  requestedBy: {
    id: string
    name: string
    email: string
    phone: string
  }
  assignedTo?: {
    id: string
    name: string
    email: string
    phone: string
  }
  deadline: string
  createdAt: string
  updatedAt: string
  responses: SiteScoutResponse[]
}

export interface SiteScoutResponse {
  id: string
  scoutId: string
  scoutName: string
  properties: Array<{
    id: string
    title: string
    address: string
    price: number
    area: number
    images: string[]
    notes: string
    rating: number
    pros: string[]
    cons: string[]
    coordinates?: {
      lat: number
      lng: number
    }
  }>
  summary: string
  recommendations: string
  submittedAt: string
  status: 'draft' | 'submitted' | 'approved' | 'rejected'
}

export interface CreateSiteScoutRequest {
  title: string
  description: string
  location: {
    address: string
    city: string
    state: string
    pincode: string
    coordinates?: {
      lat: number
      lng: number
    }
  }
  budget: {
    min: number
    max: number
  }
  requirements: {
    propertyType: string
    minArea: number
    maxArea: number
    amenities: string[]
    features: string[]
  }
  priority: 'low' | 'medium' | 'high' | 'urgent'
  deadline: string
  preferredScouts?: string[]
}

export interface SiteScoutFilters {
  status?: 'open' | 'assigned' | 'in_progress' | 'completed' | 'cancelled'
  priority?: 'low' | 'medium' | 'high' | 'urgent'
  city?: string
  propertyType?: string
  minBudget?: number
  maxBudget?: number
  assignedTo?: string
  requestedBy?: string
  dateRange?: {
    startDate: string
    endDate: string
  }
  page?: number
  limit?: number
}

export interface SiteScoutListResponse {
  requests: SiteScoutRequest[]
  total: number
  page: number
  limit: number
  totalPages: number
}

class SiteScoutingService {
  /**
   * Get site scout requests with filters
   */
  async getSiteScoutRequests(filters: SiteScoutFilters = {}): Promise<ApiResponse<SiteScoutListResponse>> {
    return apiClient.get<SiteScoutListResponse>('/site-scouting/requests', {
      params: filters,
    })
  }

  /**
   * Get site scout request by ID
   */
  async getSiteScoutRequest(id: string): Promise<ApiResponse<SiteScoutRequest>> {
    return apiClient.get<SiteScoutRequest>(`/site-scouting/requests/${id}`)
  }

  /**
   * Create new site scout request
   */
  async createSiteScoutRequest(requestData: CreateSiteScoutRequest): Promise<ApiResponse<SiteScoutRequest>> {
    return apiClient.post<SiteScoutRequest>('/site-scouting/requests', requestData, {
      showSuccessToast: true,
      successMessage: 'Site scout request created successfully. We will assign a scout soon.',
    })
  }

  /**
   * Update site scout request
   */
  async updateSiteScoutRequest(id: string, updates: Partial<CreateSiteScoutRequest>): Promise<ApiResponse<SiteScoutRequest>> {
    return apiClient.patch<SiteScoutRequest>(`/site-scouting/requests/${id}`, updates, {
      showSuccessToast: true,
      successMessage: 'Site scout request updated successfully.',
    })
  }

  /**
   * Cancel site scout request
   */
  async cancelSiteScoutRequest(id: string, reason?: string): Promise<ApiResponse<void>> {
    return apiClient.patch(`/site-scouting/requests/${id}/cancel`, {
      reason,
    }, {
      showSuccessToast: true,
      successMessage: 'Site scout request cancelled successfully.',
    })
  }

  /**
   * Accept site scout request (for scouts/brokers)
   */
  async acceptSiteScoutRequest(id: string): Promise<ApiResponse<SiteScoutRequest>> {
    return apiClient.post<SiteScoutRequest>(`/site-scouting/requests/${id}/accept`, {}, {
      showSuccessToast: true,
      successMessage: 'Site scout request accepted. You can now start working on it.',
    })
  }

  /**
   * Submit site scout response
   */
  async submitSiteScoutResponse(requestId: string, response: {
    properties: Array<{
      title: string
      address: string
      price: number
      area: number
      images: File[]
      notes: string
      rating: number
      pros: string[]
      cons: string[]
      coordinates?: {
        lat: number
        lng: number
      }
    }>
    summary: string
    recommendations: string
  }): Promise<ApiResponse<SiteScoutResponse>> {
    // Upload images for each property
    const processedProperties = await Promise.all(
      response.properties.map(async (property) => {
        if (property.images && property.images.length > 0) {
          const imageUrls = await this.uploadPropertyImages(property.images)
          return {
            ...property,
            images: imageUrls,
          }
        }
        return {
          ...property,
          images: [],
        }
      })
    )

    const payload = {
      ...response,
      properties: processedProperties,
    }

    return apiClient.post<SiteScoutResponse>(`/site-scouting/requests/${requestId}/responses`, payload, {
      showSuccessToast: true,
      successMessage: 'Site scout response submitted successfully.',
    })
  }

  /**
   * Upload property images for site scouting
   */
  private async uploadPropertyImages(images: File[]): Promise<string[]> {
    const uploadPromises = images.map(image => 
      apiClient.upload<{ url: string }>('/site-scouting/upload-image', image)
    )

    const responses = await Promise.all(uploadPromises)
    return responses
      .filter(response => response.success && response.data)
      .map(response => response.data!.url)
  }

  /**
   * Get site scout responses for a request
   */
  async getSiteScoutResponses(requestId: string): Promise<ApiResponse<SiteScoutResponse[]>> {
    return apiClient.get<SiteScoutResponse[]>(`/site-scouting/requests/${requestId}/responses`)
  }

  /**
   * Approve site scout response
   */
  async approveSiteScoutResponse(responseId: string, feedback?: string): Promise<ApiResponse<void>> {
    return apiClient.post(`/site-scouting/responses/${responseId}/approve`, {
      feedback,
    }, {
      showSuccessToast: true,
      successMessage: 'Site scout response approved successfully.',
    })
  }

  /**
   * Reject site scout response
   */
  async rejectSiteScoutResponse(responseId: string, reason: string): Promise<ApiResponse<void>> {
    return apiClient.post(`/site-scouting/responses/${responseId}/reject`, {
      reason,
    }, {
      showSuccessToast: true,
      successMessage: 'Site scout response rejected.',
    })
  }

  /**
   * Get my site scout requests (for users)
   */
  async getMySiteScoutRequests(filters: SiteScoutFilters = {}): Promise<ApiResponse<SiteScoutListResponse>> {
    return apiClient.get<SiteScoutListResponse>('/site-scouting/my-requests', {
      params: filters,
    })
  }

  /**
   * Get assigned site scout requests (for scouts/brokers)
   */
  async getAssignedSiteScoutRequests(filters: SiteScoutFilters = {}): Promise<ApiResponse<SiteScoutListResponse>> {
    return apiClient.get<SiteScoutListResponse>('/site-scouting/assigned-requests', {
      params: filters,
    })
  }

  /**
   * Get available site scout requests (for scouts/brokers)
   */
  async getAvailableSiteScoutRequests(filters: SiteScoutFilters = {}): Promise<ApiResponse<SiteScoutListResponse>> {
    return apiClient.get<SiteScoutListResponse>('/site-scouting/available-requests', {
      params: filters,
    })
  }

  /**
   * Search site scout requests
   */
  async searchSiteScoutRequests(query: string, filters: SiteScoutFilters = {}): Promise<ApiResponse<SiteScoutListResponse>> {
    return apiClient.get<SiteScoutListResponse>('/site-scouting/search', {
      params: {
        q: query,
        ...filters,
      },
    })
  }

  /**
   * Get site scouting statistics
   */
  async getSiteScoutingStats(): Promise<ApiResponse<{
    totalRequests: number
    openRequests: number
    completedRequests: number
    averageCompletionTime: number
    averageRating: number
    topScouts: Array<{
      id: string
      name: string
      completedRequests: number
      averageRating: number
    }>
    requestsByLocation: Array<{
      city: string
      count: number
    }>
    requestsByType: Array<{
      type: string
      count: number
    }>
  }>> {
    return apiClient.get('/site-scouting/stats')
  }

  /**
   * Rate site scout response
   */
  async rateSiteScoutResponse(responseId: string, rating: {
    score: number
    comment?: string
    categories?: {
      accuracy: number
      timeliness: number
      communication: number
      professionalism: number
    }
  }): Promise<ApiResponse<void>> {
    return apiClient.post(`/site-scouting/responses/${responseId}/rate`, rating, {
      showSuccessToast: true,
      successMessage: 'Rating submitted successfully.',
    })
  }

  /**
   * Get site scout performance metrics
   */
  async getSiteScoutPerformance(scoutId?: string): Promise<ApiResponse<{
    totalRequests: number
    completedRequests: number
    averageRating: number
    averageCompletionTime: number
    successRate: number
    earnings: number
    performanceOverTime: Array<{
      month: string
      requests: number
      completions: number
      rating: number
    }>
    categoryRatings: {
      accuracy: number
      timeliness: number
      communication: number
      professionalism: number
    }
  }>> {
    const endpoint = scoutId ? `/site-scouting/scouts/${scoutId}/performance` : '/site-scouting/my-performance'
    return apiClient.get(endpoint)
  }

  /**
   * Get site scouting notifications
   */
  async getSiteScoutingNotifications(): Promise<ApiResponse<Array<{
    id: string
    type: 'new_request' | 'request_assigned' | 'response_submitted' | 'response_approved' | 'response_rejected'
    title: string
    message: string
    requestId: string
    read: boolean
    createdAt: string
  }>>> {
    return apiClient.get('/site-scouting/notifications')
  }

  /**
   * Mark notification as read
   */
  async markNotificationAsRead(notificationId: string): Promise<ApiResponse<void>> {
    return apiClient.patch(`/site-scouting/notifications/${notificationId}/read`)
  }

  /**
   * Get site scouting pricing
   */
  async getSiteScoutingPricing(): Promise<ApiResponse<{
    basePricing: Array<{
      propertyType: string
      basePrice: number
      pricePerProperty: number
      urgentMultiplier: number
    }>
    customPricing?: {
      enabled: boolean
      factors: string[]
    }
  }>> {
    return apiClient.get('/site-scouting/pricing')
  }

  /**
   * Calculate site scouting cost
   */
  async calculateSiteScoutingCost(request: {
    propertyType: string
    location: string
    priority: 'low' | 'medium' | 'high' | 'urgent'
    requirements: {
      minArea: number
      maxArea: number
      amenities: string[]
    }
    deadline: string
  }): Promise<ApiResponse<{
    baseCost: number
    urgencyMultiplier: number
    locationMultiplier: number
    complexityMultiplier: number
    totalCost: number
    breakdown: Array<{
      factor: string
      cost: number
      description: string
    }>
  }>> {
    return apiClient.post('/site-scouting/calculate-cost', request)
  }

  /**
   * Export site scouting data
   */
  async exportSiteScoutingData(filters: SiteScoutFilters = {}, format: 'csv' | 'excel' = 'csv'): Promise<ApiResponse<{ downloadUrl: string }>> {
    return apiClient.get<{ downloadUrl: string }>('/site-scouting/export', {
      params: {
        ...filters,
        format,
      },
    })
  }
}

// Create singleton instance
export const siteScoutingService = new SiteScoutingService()

// Export for testing
export { SiteScoutingService }
