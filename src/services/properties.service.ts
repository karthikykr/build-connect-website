/**
 * Properties Service
 */

import { apiClient, ApiResponse } from '@/lib/api-client'
import { Property } from '@/types'

export interface PropertyFilters {
  search?: string
  city?: string
  state?: string
  propertyType?: string
  minPrice?: number
  maxPrice?: number
  minArea?: number
  maxArea?: number
  amenities?: string[]
  features?: string[]
  status?: 'available' | 'sold' | 'rented'
  verified?: boolean
  brokerId?: string
  sortBy?: 'price' | 'area' | 'createdAt' | 'updatedAt'
  sortOrder?: 'asc' | 'desc'
  page?: number
  limit?: number
}

export interface PropertyListResponse {
  properties: Property[]
  total: number
  page: number
  limit: number
  totalPages: number
  filters: PropertyFilters
}

export interface CreatePropertyRequest {
  title: string
  description: string
  price: number
  area: number
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
  propertyType: string
  amenities: string[]
  features: string[]
  images?: File[]
  documents?: File[]
  specifications?: Record<string, any>
  contactInfo?: {
    phone?: string
    email?: string
    preferredContactTime?: string
  }
}

export interface UpdatePropertyRequest extends Partial<CreatePropertyRequest> {
  status?: 'available' | 'sold' | 'rented'
}

export interface PropertyAnalytics {
  views: number
  inquiries: number
  favorites: number
  shares: number
  conversionRate: number
  averageTimeOnPage: number
  viewsOverTime: Array<{
    date: string
    views: number
  }>
  inquiriesOverTime: Array<{
    date: string
    inquiries: number
  }>
  demographics: {
    ageGroups: Record<string, number>
    locations: Record<string, number>
    interests: Record<string, number>
  }
}

export interface PropertyInquiry {
  id: string
  propertyId: string
  userId: string
  userName: string
  userEmail: string
  userPhone?: string
  message: string
  status: 'new' | 'responded' | 'closed'
  createdAt: string
  respondedAt?: string
}

export interface PropertyComparison {
  properties: Property[]
  comparison: {
    [key: string]: {
      [propertyId: string]: any
    }
  }
}

class PropertiesService {
  /**
   * Get properties with filters and pagination
   */
  async getProperties(filters: PropertyFilters = {}): Promise<ApiResponse<PropertyListResponse>> {
    return apiClient.get<PropertyListResponse>('/properties', {
      params: filters,
    })
  }

  /**
   * Get property by ID
   */
  async getProperty(id: string): Promise<ApiResponse<Property>> {
    return apiClient.get<Property>(`/properties/${id}`)
  }

  /**
   * Create new property
   */
  async createProperty(propertyData: CreatePropertyRequest): Promise<ApiResponse<Property>> {
    // If images are provided, upload them first
    if (propertyData.images && propertyData.images.length > 0) {
      const imageUrls = await this.uploadPropertyImages(propertyData.images)
      propertyData = {
        ...propertyData,
        images: imageUrls as any, // Convert File[] to string[]
      }
    }

    return apiClient.post<Property>('/properties', propertyData, {
      showSuccessToast: true,
      successMessage: 'Property created successfully.',
    })
  }

  /**
   * Update property
   */
  async updateProperty(id: string, propertyData: UpdatePropertyRequest): Promise<ApiResponse<Property>> {
    return apiClient.patch<Property>(`/properties/${id}`, propertyData, {
      showSuccessToast: true,
      successMessage: 'Property updated successfully.',
    })
  }

  /**
   * Delete property
   */
  async deleteProperty(id: string): Promise<ApiResponse<void>> {
    return apiClient.delete(`/properties/${id}`, {
      showSuccessToast: true,
      successMessage: 'Property deleted successfully.',
    })
  }

  /**
   * Upload property images
   */
  async uploadPropertyImages(images: File[]): Promise<string[]> {
    const uploadPromises = images.map(image => 
      apiClient.upload<{ url: string }>('/properties/upload-image', image)
    )

    const responses = await Promise.all(uploadPromises)
    return responses
      .filter(response => response.success && response.data)
      .map(response => response.data!.url)
  }

  /**
   * Upload property documents
   */
  async uploadPropertyDocuments(propertyId: string, documents: File[]): Promise<ApiResponse<{ urls: string[] }>> {
    const formData = new FormData()
    documents.forEach((doc, index) => {
      formData.append(`document_${index}`, doc)
    })

    return apiClient.upload<{ urls: string[] }>(`/properties/${propertyId}/documents`, documents[0], {
      // Additional documents will be handled by the backend
    })
  }

  /**
   * Get property analytics
   */
  async getPropertyAnalytics(propertyId: string, dateRange?: {
    startDate: string
    endDate: string
  }): Promise<ApiResponse<PropertyAnalytics>> {
    return apiClient.get<PropertyAnalytics>(`/properties/${propertyId}/analytics`, {
      params: dateRange,
    })
  }

  /**
   * Get property inquiries
   */
  async getPropertyInquiries(propertyId: string): Promise<ApiResponse<PropertyInquiry[]>> {
    return apiClient.get<PropertyInquiry[]>(`/properties/${propertyId}/inquiries`)
  }

  /**
   * Create property inquiry
   */
  async createInquiry(propertyId: string, inquiry: {
    message: string
    phone?: string
    preferredContactTime?: string
  }): Promise<ApiResponse<PropertyInquiry>> {
    return apiClient.post<PropertyInquiry>(`/properties/${propertyId}/inquiries`, inquiry, {
      showSuccessToast: true,
      successMessage: 'Inquiry sent successfully. The broker will contact you soon.',
    })
  }

  /**
   * Respond to property inquiry
   */
  async respondToInquiry(inquiryId: string, response: {
    message: string
    status?: 'responded' | 'closed'
  }): Promise<ApiResponse<PropertyInquiry>> {
    return apiClient.patch<PropertyInquiry>(`/inquiries/${inquiryId}`, response, {
      showSuccessToast: true,
      successMessage: 'Response sent successfully.',
    })
  }

  /**
   * Add property to favorites
   */
  async addToFavorites(propertyId: string): Promise<ApiResponse<void>> {
    return apiClient.post(`/properties/${propertyId}/favorite`, {}, {
      showSuccessToast: true,
      successMessage: 'Property added to favorites.',
    })
  }

  /**
   * Remove property from favorites
   */
  async removeFromFavorites(propertyId: string): Promise<ApiResponse<void>> {
    return apiClient.delete(`/properties/${propertyId}/favorite`, {
      showSuccessToast: true,
      successMessage: 'Property removed from favorites.',
    })
  }

  /**
   * Get user's favorite properties
   */
  async getFavoriteProperties(): Promise<ApiResponse<Property[]>> {
    return apiClient.get<Property[]>('/properties/favorites')
  }

  /**
   * Share property
   */
  async shareProperty(propertyId: string, shareData: {
    method: 'email' | 'sms' | 'whatsapp' | 'link'
    recipients?: string[]
    message?: string
  }): Promise<ApiResponse<{ shareUrl: string }>> {
    return apiClient.post<{ shareUrl: string }>(`/properties/${propertyId}/share`, shareData, {
      showSuccessToast: true,
      successMessage: 'Property shared successfully.',
    })
  }

  /**
   * Compare properties
   */
  async compareProperties(propertyIds: string[]): Promise<ApiResponse<PropertyComparison>> {
    return apiClient.post<PropertyComparison>('/properties/compare', {
      propertyIds,
    })
  }

  /**
   * Get similar properties
   */
  async getSimilarProperties(propertyId: string, limit = 5): Promise<ApiResponse<Property[]>> {
    return apiClient.get<Property[]>(`/properties/${propertyId}/similar`, {
      params: { limit },
    })
  }

  /**
   * Get property recommendations
   */
  async getRecommendations(filters?: {
    budget?: number
    location?: string
    propertyType?: string
    limit?: number
  }): Promise<ApiResponse<Property[]>> {
    return apiClient.get<Property[]>('/properties/recommendations', {
      params: filters,
    })
  }

  /**
   * Get featured properties
   */
  async getFeaturedProperties(limit = 6): Promise<ApiResponse<Property[]>> {
    return apiClient.get<Property[]>('/properties/featured', {
      params: { limit },
    })
  }

  /**
   * Search properties with advanced filters
   */
  async searchProperties(query: string, filters: PropertyFilters = {}): Promise<ApiResponse<PropertyListResponse>> {
    return apiClient.get<PropertyListResponse>('/properties/search', {
      params: {
        q: query,
        ...filters,
      },
    })
  }

  /**
   * Get property statistics
   */
  async getPropertyStats(): Promise<ApiResponse<{
    totalProperties: number
    availableProperties: number
    soldProperties: number
    averagePrice: number
    averageArea: number
    popularLocations: Array<{
      city: string
      count: number
    }>
    propertyTypes: Array<{
      type: string
      count: number
    }>
  }>> {
    return apiClient.get('/properties/stats')
  }

  /**
   * Get my properties (for brokers)
   */
  async getMyProperties(filters: PropertyFilters = {}): Promise<ApiResponse<PropertyListResponse>> {
    return apiClient.get<PropertyListResponse>('/properties/my-properties', {
      params: filters,
    })
  }

  /**
   * Bulk update properties
   */
  async bulkUpdateProperties(updates: Array<{
    id: string
    data: UpdatePropertyRequest
  }>): Promise<ApiResponse<Property[]>> {
    return apiClient.patch<Property[]>('/properties/bulk-update', { updates }, {
      showSuccessToast: true,
      successMessage: 'Properties updated successfully.',
    })
  }

  /**
   * Export properties data
   */
  async exportProperties(filters: PropertyFilters = {}, format: 'csv' | 'excel' = 'csv'): Promise<ApiResponse<{ downloadUrl: string }>> {
    return apiClient.get<{ downloadUrl: string }>('/properties/export', {
      params: {
        ...filters,
        format,
      },
    })
  }

  /**
   * Import properties from file
   */
  async importProperties(file: File): Promise<ApiResponse<{
    imported: number
    failed: number
    errors: string[]
  }>> {
    return apiClient.upload<{
      imported: number
      failed: number
      errors: string[]
    }>('/properties/import', file, {
      showSuccessToast: true,
      successMessage: 'Properties import completed.',
    })
  }
}

// Create singleton instance
export const propertiesService = new PropertiesService()

// Export for testing
export { PropertiesService }
