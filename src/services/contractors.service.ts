/**
 * Contractors Service - Aligned with Backend User Management Service
 */

import { apiClient, ApiResponse } from '@/lib/api-client'
import { ContractorProfile, ProjectPortfolio, ContractorApplication } from '@/types'

// Backend-aligned Contractor Application Request
export interface ContractorApplicationRequest {
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
  specializations: string[]
  experience: number
}

// Portfolio item creation request
export interface CreatePortfolioItemRequest {
  title: string
  description: string
  images: File[]
  type: string
  duration: string
  cost: number
  completedAt: string
}

export interface UpdatePortfolioItemRequest {
  title?: string
  description?: string
  images?: File[]
  type?: string
  duration?: string
  cost?: number
  completedAt?: string
}

export interface ContractorFilters extends Record<string, unknown> {
  search?: string
  city?: string
  state?: string
  specializations?: string[]
  minRating?: number
  minExperience?: number
  verified?: boolean
  sortBy?: 'rating' | 'experience' | 'totalProjects' | 'createdAt'
  sortOrder?: 'asc' | 'desc'
  page?: number
  limit?: number
}

export interface ContractorListResponse {
  contractors: ContractorProfile[]
  total: number
  page: number
  limit: number
  totalPages: number
  filters: ContractorFilters
}

class ContractorsService {
  /**
   * Get contractors with filters and pagination
   */
  async getContractors(filters: ContractorFilters = {}): Promise<ApiResponse<ContractorListResponse>> {
    return apiClient.get<ContractorListResponse>('/user-service/api/v1/contractors/all', {
      params: filters,
    })
  }

  /**
   * Get contractor by ID
   */
  async getContractor(id: string): Promise<ApiResponse<ContractorProfile>> {
    return apiClient.get<ContractorProfile>(`/user-service/api/v1/contractors/profile/${id}`)
  }

  /**
   * Get contractor application status
   */
  async getContractorApplication(): Promise<ApiResponse<ContractorApplication>> {
    return apiClient.get<ContractorApplication>('/user-service/api/v1/contractors/application')
  }

  /**
   * Apply to become contractor
   */
  async applyToContractor(applicationData: ContractorApplicationRequest): Promise<ApiResponse<{
    applicationId: string
    message: string
  }>> {
    const formData = new FormData()

    // Add text fields according to backend schema
    formData.append('aadhaarNumber', applicationData.aadhaarNumber)
    formData.append('nameOnAadhaar', applicationData.nameOnAadhaar)
    formData.append('dateOfBirth', applicationData.dateOfBirth)
    formData.append('gender', applicationData.gender)
    formData.append('address', applicationData.address)
    formData.append('panNumber', applicationData.panNumber)
    formData.append('nameOnPAN', applicationData.nameOnPAN)
    formData.append('serviceAreas', JSON.stringify(applicationData.serviceAreas))
    formData.append('specializations', JSON.stringify(applicationData.specializations))
    formData.append('experience', applicationData.experience.toString())

    // Add document files
    formData.append('aadhaarDocument', applicationData.aadhaarDocument)
    formData.append('panDocument', applicationData.panDocument)

    return apiClient.upload('/user-service/api/v1/contractors', formData, {
      showSuccessToast: true,
      successMessage: 'Contractor application submitted successfully. We will review it within 3-5 business days.',
    })
  }

  /**
   * Update contractor application
   */
  async updateContractorApplication(applicationData: Partial<ContractorApplicationRequest>): Promise<ApiResponse<{
    message: string
  }>> {
    const formData = new FormData()

    // Add updated fields
    Object.entries(applicationData).forEach(([key, value]) => {
      if (value !== undefined) {
        if (key === 'serviceAreas' || key === 'specializations') {
          formData.append(key, JSON.stringify(value))
        } else if (value instanceof File) {
          formData.append(key, value)
        } else {
          formData.append(key, String(value))
        }
      }
    })

    return apiClient.patch('/user-service/api/v1/contractors/application', formData, {
      showSuccessToast: true,
      successMessage: 'Application updated successfully.',
    })
  }

  /**
   * Update contractor profile (for approved contractors)
   */
  async updateContractorProfile(profileData: Partial<ContractorProfile>): Promise<ApiResponse<ContractorProfile>> {
    return apiClient.patch<ContractorProfile>('/user-service/api/v1/user/profile', profileData, {
      showSuccessToast: true,
      successMessage: 'Profile updated successfully.',
    })
  }

  /**
   * Add portfolio item
   */
  async addPortfolioItem(portfolioData: CreatePortfolioItemRequest): Promise<ApiResponse<ProjectPortfolio>> {
    const formData = new FormData()

    formData.append('title', portfolioData.title)
    formData.append('description', portfolioData.description)
    formData.append('type', portfolioData.type)
    formData.append('duration', portfolioData.duration)
    formData.append('cost', portfolioData.cost.toString())
    formData.append('completedAt', portfolioData.completedAt)

    portfolioData.images.forEach((image) => {
      formData.append('images', image)
    })

    return apiClient.upload<ProjectPortfolio>('/user-service/api/v1/contractors/portfolio', formData, {
      showSuccessToast: true,
      successMessage: 'Portfolio item added successfully.',
    })
  }

  /**
   * Update portfolio item
   */
  async updatePortfolioItem(portfolioItemId: string, portfolioData: UpdatePortfolioItemRequest): Promise<ApiResponse<ProjectPortfolio>> {
    const formData = new FormData()

    Object.entries(portfolioData).forEach(([key, value]) => {
      if (value !== undefined) {
        if (key === 'images' && Array.isArray(value)) {
          value.forEach((image) => {
            formData.append('images', image)
          })
        } else {
          formData.append(key, String(value))
        }
      }
    })

    return apiClient.patch<ProjectPortfolio>(`/user-service/api/v1/contractors/portfolio/${portfolioItemId}`, formData, {
      showSuccessToast: true,
      successMessage: 'Portfolio item updated successfully.',
    })
  }

  /**
   * Delete portfolio item
   */
  async deletePortfolioItem(portfolioItemId: string): Promise<ApiResponse<void>> {
    return apiClient.delete(`/user-service/api/v1/contractors/portfolio/${portfolioItemId}`, {
      showSuccessToast: true,
      successMessage: 'Portfolio item deleted successfully.',
    })
  }

  /**
   * Get contractor portfolio
   */
  async getContractorPortfolio(contractorId: string): Promise<ApiResponse<ProjectPortfolio[]>> {
    return apiClient.get<ProjectPortfolio[]>(`/user-service/api/v1/contractors/${contractorId}/portfolio`)
  }

  /**
   * Get contractors for project service requests
   */
  async getContractorsForProjects(): Promise<ApiResponse<ContractorProfile[]>> {
    return apiClient.get<ContractorProfile[]>('/user-service/api/v1/professionals/contractors')
  }

  /**
   * Search contractors
   */
  async searchContractors(query: string, filters: ContractorFilters = {}): Promise<ApiResponse<ContractorListResponse>> {
    return apiClient.get<ContractorListResponse>('/user-service/api/v1/contractors/search', {
      params: {
        q: query,
        ...filters,
      },
    })
  }

  /**
   * Get featured contractors
   */
  async getFeaturedContractors(limit = 6): Promise<ApiResponse<ContractorProfile[]>> {
    return apiClient.get<ContractorProfile[]>('/user-service/api/v1/contractors/featured', {
      params: { limit },
    })
  }

  /**
   * Contact contractor
   */
  async contactContractor(contractorId: string, message: {
    subject: string
    message: string
    projectId?: string
    phone?: string
    preferredContactTime?: string
  }): Promise<ApiResponse<{ messageId: string }>> {
    return apiClient.post<{ messageId: string }>(`/user-service/api/v1/contractors/${contractorId}/contact`, message, {
      showSuccessToast: true,
      successMessage: 'Message sent successfully. The contractor will contact you soon.',
    })
  }

  /**
   * Rate contractor
   */
  async rateContractor(contractorId: string, rating: {
    rating: number
    review: string
    projectId?: string
  }): Promise<ApiResponse<void>> {
    return apiClient.post(`/user-service/api/v1/contractors/${contractorId}/rate`, rating, {
      showSuccessToast: true,
      successMessage: 'Rating submitted successfully.',
    })
  }
}

// Create singleton instance
export const contractorsService = new ContractorsService()

// Export for testing
export { ContractorsService }
