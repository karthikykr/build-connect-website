/**
 * Sites Service - Aligned with Backend Site Management Service
 */

import { apiClient, ApiResponse } from '@/lib/api-client'
import { Site, Project, ServiceRequest, ProgressLog } from '@/types'

// Backend-aligned Site interfaces
export interface CreateSiteRequest {
  name: string
  addressLine1: string
  addressLine2?: string
  location: string
  pincode: string
  state: string
  district: string
  plotArea: number // in sq ft
  price: number // in INR
  latitude: number
  longitude: number
  images?: File[]
  documents?: File[]
}

export interface UpdateSiteRequest {
  name?: string
  addressLine1?: string
  addressLine2?: string
  location?: string
  pincode?: string
  state?: string
  district?: string
  plotArea?: number
  price?: number
  latitude?: number
  longitude?: number
  images?: File[]
  documents?: File[]
}

// Project-related interfaces
export interface CreateProjectRequest {
  projectName: string
  siteId?: string
  requirements: ProjectRequirement[]
  budget?: number
  timeline?: string
  description?: string
}

export interface ProjectRequirement {
  title: string
  description: string
  category: string
  priority: 'low' | 'medium' | 'high'
  estimatedCost?: number
}

// Service Request interfaces
export interface CreateServiceRequestRequest {
  toUserId: string
  message: string
  projectType?: string
  budget?: number
  timeline?: string
}

export interface UpdateServiceRequestRequest {
  status: 'accepted' | 'rejected'
  message?: string
  proposedBudget?: number
  proposedTimeline?: string
}

// Progress Log interfaces
export interface CreateProgressLogRequest {
  title: string
  description: string
  stage: string
  images?: File[]
  status?: 'in_progress' | 'completed' | 'on_hold'
}

export interface UpdateProgressLogRequest {
  title?: string
  description?: string
  stage?: string
  status?: 'in_progress' | 'completed' | 'on_hold'
}

export interface SiteFilters extends Record<string, unknown> {
  search?: string
  location?: string
  state?: string
  district?: string
  minPrice?: number
  maxPrice?: number
  minPlotArea?: number
  maxPlotArea?: number
  status?: 'pending' | 'approved' | 'rejected'
  sortBy?: 'price' | 'plotArea' | 'createdAt'
  sortOrder?: 'asc' | 'desc'
  page?: number
  limit?: number
}

export interface SiteListResponse {
  sites: Site[]
  total: number
  page: number
  limit: number
  totalPages: number
  filters: SiteFilters
}

class SitesService {
  /**
   * Get sites with filters and pagination
   */
  async getSites(filters: SiteFilters = {}): Promise<ApiResponse<SiteListResponse>> {
    return apiClient.get<SiteListResponse>('/site-service/api/v1/sites', {
      params: filters,
    })
  }

  /**
   * Get site by ID
   */
  async getSite(id: string): Promise<ApiResponse<Site>> {
    return apiClient.get<Site>(`/site-service/api/v1/sites/${id}`)
  }

  /**
   * Get user's sites
   */
  async getUserSites(): Promise<ApiResponse<Site[]>> {
    return apiClient.get<Site[]>('/site-service/api/v1/user/sites')
  }

  /**
   * Create new site
   */
  async createSite(siteData: CreateSiteRequest): Promise<ApiResponse<Site>> {
    const formData = new FormData()

    // Add basic site data according to backend schema
    formData.append('name', siteData.name)
    formData.append('addressLine1', siteData.addressLine1)
    if (siteData.addressLine2) {
      formData.append('addressLine2', siteData.addressLine2)
    }
    formData.append('location', siteData.location)
    formData.append('pincode', siteData.pincode)
    formData.append('state', siteData.state)
    formData.append('district', siteData.district)
    formData.append('plotArea', siteData.plotArea.toString())
    formData.append('price', siteData.price.toString())
    formData.append('latitude', siteData.latitude.toString())
    formData.append('longitude', siteData.longitude.toString())

    // Add images
    if (siteData.images) {
      siteData.images.forEach((image) => {
        formData.append('images', image)
      })
    }

    // Add documents
    if (siteData.documents) {
      siteData.documents.forEach((document) => {
        formData.append('documents', document)
      })
    }

    return apiClient.upload<Site>('/site-service/api/v1/sites', formData, {
      showSuccessToast: true,
      successMessage: 'Site created successfully.',
    })
  }

  /**
   * Update site
   */
  async updateSite(id: string, siteData: UpdateSiteRequest): Promise<ApiResponse<Site>> {
    const formData = new FormData()

    // Add updated fields according to backend schema
    Object.entries(siteData).forEach(([key, value]) => {
      if (value !== undefined) {
        if (key === 'images' && Array.isArray(value)) {
          value.forEach((image) => {
            formData.append('images', image)
          })
        } else if (key === 'documents' && Array.isArray(value)) {
          value.forEach((document) => {
            formData.append('documents', document)
          })
        } else {
          formData.append(key, String(value))
        }
      }
    })

    return apiClient.patch<Site>(`/site-service/api/v1/sites/${id}`, formData, {
      showSuccessToast: true,
      successMessage: 'Site updated successfully.',
    })
  }

  /**
   * Delete site
   */
  async deleteSite(id: string): Promise<ApiResponse<void>> {
    return apiClient.delete(`/site-service/api/v1/sites/${id}`, {
      showSuccessToast: true,
      successMessage: 'Site deleted successfully.',
    })
  }

  /**
   * Delete site asset
   */
  async deleteSiteAsset(siteId: string, assetId: string): Promise<ApiResponse<void>> {
    return apiClient.delete(`/site-service/api/v1/sites/${siteId}/assets/${assetId}`, {
      showSuccessToast: true,
      successMessage: 'Asset deleted successfully.',
    })
  }

  /**
   * Create project with requirements
   */
  async createProject(projectData: CreateProjectRequest): Promise<ApiResponse<Project>> {
    return apiClient.post<Project>('/site-service/api/v1/projects', projectData, {
      showSuccessToast: true,
      successMessage: 'Project created successfully.',
    })
  }

  /**
   * Update project
   */
  async updateProject(projectId: string, updates: Partial<CreateProjectRequest>): Promise<ApiResponse<Project>> {
    return apiClient.patch<Project>(`/site-service/api/v1/projects/${projectId}`, updates, {
      showSuccessToast: true,
      successMessage: 'Project updated successfully.',
    })
  }

  /**
   * Get project by ID
   */
  async getProject(projectId: string): Promise<ApiResponse<Project>> {
    return apiClient.get<Project>(`/site-service/api/v1/projects/${projectId}`)
  }

  /**
   * Get user's projects
   */
  async getProjects(): Promise<ApiResponse<Project[]>> {
    return apiClient.get<Project[]>('/site-service/api/v1/projects')
  }

  /**
   * Create service request
   */
  async createServiceRequest(projectId: string, data: CreateServiceRequestRequest): Promise<ApiResponse<ServiceRequest>> {
    return apiClient.post<ServiceRequest>(`/site-service/api/v1/projects/${projectId}/service-requests`, data, {
      showSuccessToast: true,
      successMessage: 'Service request sent successfully.',
    })
  }

  /**
   * Get received service requests
   */
  async getServiceRequests(): Promise<ApiResponse<ServiceRequest[]>> {
    return apiClient.get<ServiceRequest[]>('/site-service/api/v1/service-requests')
  }

  /**
   * Get sent service requests
   */
  async getSentServiceRequests(): Promise<ApiResponse<ServiceRequest[]>> {
    return apiClient.get<ServiceRequest[]>('/site-service/api/v1/service-requests/sent')
  }

  /**
   * Update service request status
   */
  async updateServiceRequest(requestId: string, data: UpdateServiceRequestRequest): Promise<ApiResponse<ServiceRequest>> {
    return apiClient.patch<ServiceRequest>(`/site-service/api/v1/service-requests/${requestId}`, data, {
      showSuccessToast: true,
      successMessage: `Service request ${data.status} successfully.`,
    })
  }

  /**
   * Add progress log
   */
  async addProgressLog(projectId: string, data: CreateProgressLogRequest): Promise<ApiResponse<ProgressLog>> {
    const formData = new FormData()
    formData.append('title', data.title)
    formData.append('description', data.description)
    formData.append('stage', data.stage)

    if (data.status) {
      formData.append('status', data.status)
    }

    if (data.images) {
      data.images.forEach((image) => {
        formData.append('images', image)
      })
    }

    return apiClient.upload<ProgressLog>(`/site-service/api/v1/projects/${projectId}/progress`, formData, {
      showSuccessToast: true,
      successMessage: 'Progress log added successfully.',
    })
  }

  /**
   * Get progress logs
   */
  async getProgressLogs(projectId: string): Promise<ApiResponse<ProgressLog[]>> {
    return apiClient.get<ProgressLog[]>(`/site-service/api/v1/projects/${projectId}/progress`)
  }

  /**
   * Update progress log
   */
  async updateProgressLog(projectId: string, logId: string, data: UpdateProgressLogRequest): Promise<ApiResponse<ProgressLog>> {
    return apiClient.patch<ProgressLog>(`/site-service/api/v1/projects/${projectId}/progress/${logId}`, data, {
      showSuccessToast: true,
      successMessage: 'Progress log updated successfully.',
    })
  }

  /**
   * Delete progress log
   */
  async deleteProgressLog(projectId: string, logId: string): Promise<ApiResponse<void>> {
    return apiClient.delete(`/site-service/api/v1/projects/${projectId}/progress/${logId}`, {
      showSuccessToast: true,
      successMessage: 'Progress log deleted successfully.',
    })
  }
}

// Create singleton instance
export const sitesService = new SitesService()

// Export for testing
export { SitesService }
