/**
 * API Client for BUILD-CONNECT Backend Integration
 */

import { toast } from 'react-hot-toast'

// API Configuration
const API_CONFIG = {
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080',
  timeout: 30000,
  retries: 3,
  retryDelay: 1000,
}

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  message?: string
  error?: string
  errors?: Record<string, string[]>
  meta?: {
    pagination?: {
      page: number
      limit: number
      total: number
      totalPages: number
    }
    filters?: Record<string, any>
    sort?: string
  }
}

export interface ApiError {
  message: string
  status: number
  code?: string
  details?: unknown
}

// Request Configuration
export interface RequestConfig {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'
  headers?: Record<string, string>
  params?: Record<string, unknown>
  data?: unknown
  timeout?: number
  retries?: number
  showErrorToast?: boolean
  showSuccessToast?: boolean
  successMessage?: string
}

// Authentication Token Management
class TokenManager {
  private static instance: TokenManager
  private token: string | null = null
  private sessionId: string | null = null

  static getInstance(): TokenManager {
    if (!TokenManager.instance) {
      TokenManager.instance = new TokenManager()
    }
    return TokenManager.instance
  }

  setAuth(accessToken: string, sessionId: string) {
    this.token = accessToken
    this.sessionId = sessionId

    if (typeof window !== 'undefined') {
      localStorage.setItem('auth-token', accessToken)
      localStorage.setItem('session-id', sessionId)
    }
  }

  getToken(): string | null {
    if (!this.token && typeof window !== 'undefined') {
      this.token = localStorage.getItem('auth-token')
    }
    return this.token
  }

  getSessionId(): string | null {
    if (!this.sessionId && typeof window !== 'undefined') {
      this.sessionId = localStorage.getItem('session-id')
    }
    return this.sessionId
  }

  clearAuth() {
    this.token = null
    this.sessionId = null

    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth-token')
      localStorage.removeItem('session-id')
    }
  }

  isTokenExpired(token: string): boolean {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]))
      return payload.exp * 1000 < Date.now()
    } catch {
      return true
    }
  }
}

// API Client Class
class ApiClient {
  private baseURL: string
  private timeout: number
  private retries: number
  private retryDelay: number
  private tokenManager: TokenManager

  constructor() {
    this.baseURL = API_CONFIG.baseURL
    this.timeout = API_CONFIG.timeout
    this.retries = API_CONFIG.retries
    this.retryDelay = API_CONFIG.retryDelay
    this.tokenManager = TokenManager.getInstance()
  }

  // Build URL with query parameters
  private buildURL(endpoint: string, params?: Record<string, unknown>): string {
    const url = new URL(endpoint, this.baseURL)

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          if (Array.isArray(value)) {
            value.forEach(v => url.searchParams.append(key, String(v)))
          } else {
            url.searchParams.append(key, String(value))
          }
        }
      })
    }

    return url.toString()
  }

  // Get default headers
  private getDefaultHeaders(): Record<string, string> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    }

    const token = this.tokenManager.getToken()
    const sessionId = this.tokenManager.getSessionId()

    if (token) {
      headers['Authorization'] = `Bearer ${token}`
    }

    if (sessionId) {
      headers['Session'] = sessionId
    }

    return headers
  }

  // Handle token refresh
  private async refreshAccessToken(): Promise<boolean> {
    const sessionId = this.tokenManager.getSessionId()
    if (!sessionId) {
      return false
    }

    try {
      const response = await fetch(`${this.baseURL}/user-service/api/v1/refresh`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Session': sessionId,
        },
      })

      if (response.ok) {
        const data = await response.json()
        // Backend returns new accessToken, keep existing sessionId
        this.tokenManager.setAuth(data.accessToken, sessionId)
        return true
      }
    } catch (error) {
      console.error('Token refresh failed:', error)
    }

    return false
  }

  // Make HTTP request with retry logic
  private async makeRequest<T>(
    endpoint: string,
    config: RequestConfig = {}
  ): Promise<ApiResponse<T>> {
    const {
      method = 'GET',
      headers = {},
      params,
      data,
      timeout = this.timeout,
      retries = this.retries,
      showErrorToast = true,
      showSuccessToast = false,
      successMessage,
    } = config

    const url = this.buildURL(endpoint, params)
    const requestHeaders = { ...this.getDefaultHeaders(), ...headers }

    const requestConfig: RequestInit = {
      method,
      headers: requestHeaders,
      signal: AbortSignal.timeout(timeout),
    }

    if (data && method !== 'GET') {
      if (data instanceof FormData) {
        delete requestHeaders['Content-Type'] // Let browser set it for FormData
        requestConfig.body = data
      } else {
        requestConfig.body = JSON.stringify(data)
      }
    }

    let lastError: ApiError | null = null

    for (let attempt = 0; attempt <= retries; attempt++) {
      try {
        const response = await fetch(url, requestConfig)
        
        // Handle 401 Unauthorized - try to refresh token
        if (response.status === 401 && attempt === 0) {
          const refreshed = await this.refreshAccessToken()
          if (refreshed) {
            // Update headers with new token and retry
            requestHeaders['Authorization'] = `Bearer ${this.tokenManager.getToken()}`
            requestConfig.headers = requestHeaders
            continue
          } else {
            // Refresh failed, clear tokens and redirect to login
            this.tokenManager.clearAuth()
            if (typeof window !== 'undefined') {
              window.location.href = '/auth/login'
            }
            throw new Error('Authentication failed')
          }
        }

        const responseData = await response.json()

        if (!response.ok) {
          const error: ApiError = {
            message: responseData.message || responseData.error || 'Request failed',
            status: response.status,
            code: responseData.code,
            details: responseData.errors || responseData.details,
          }

          if (showErrorToast) {
            toast.error(error.message)
          }

          throw error
        }

        // Success response
        if (showSuccessToast && successMessage) {
          try {
            toast.success(successMessage)
          } catch (toastError) {
            console.error('Toast error:', toastError)
          }
        }

        return responseData

      } catch (error) {
        lastError = error instanceof Error 
          ? { message: error.message, status: 0 }
          : error as ApiError

        // Don't retry on client errors (4xx) except 401
        if (lastError.status >= 400 && lastError.status < 500 && lastError.status !== 401) {
          break
        }

        // Wait before retry (exponential backoff)
        if (attempt < retries) {
          await new Promise(resolve => 
            setTimeout(resolve, this.retryDelay * Math.pow(2, attempt))
          )
        }
      }
    }

    // All retries failed
    if (lastError && showErrorToast) {
      try {
        toast.error(lastError.message)
      } catch (toastError) {
        console.error('Toast error:', toastError)
      }
    }

    throw lastError || new Error('Request failed')
  }

  // Public API methods
  async get<T>(endpoint: string, config?: Omit<RequestConfig, 'method' | 'data'>): Promise<ApiResponse<T>> {
    return this.makeRequest<T>(endpoint, { ...config, method: 'GET' })
  }

  async post<T>(endpoint: string, data?: unknown, config?: Omit<RequestConfig, 'method'>): Promise<ApiResponse<T>> {
    return this.makeRequest<T>(endpoint, { ...config, method: 'POST', data })
  }

  async put<T>(endpoint: string, data?: unknown, config?: Omit<RequestConfig, 'method'>): Promise<ApiResponse<T>> {
    return this.makeRequest<T>(endpoint, { ...config, method: 'PUT', data })
  }

  async patch<T>(endpoint: string, data?: unknown, config?: Omit<RequestConfig, 'method'>): Promise<ApiResponse<T>> {
    return this.makeRequest<T>(endpoint, { ...config, method: 'PATCH', data })
  }

  async delete<T>(endpoint: string, config?: Omit<RequestConfig, 'method' | 'data'>): Promise<ApiResponse<T>> {
    return this.makeRequest<T>(endpoint, { ...config, method: 'DELETE' })
  }

  // File upload method
  async upload<T>(endpoint: string, fileOrFormData: File | FormData, additionalData?: Record<string, unknown>): Promise<ApiResponse<T>> {
    let formData: FormData

    if (fileOrFormData instanceof FormData) {
      formData = fileOrFormData
    } else {
      formData = new FormData()
      formData.append('file', fileOrFormData)
    }

    if (additionalData) {
      Object.entries(additionalData).forEach(([key, value]) => {
        formData.append(key, String(value))
      })
    }

    return this.makeRequest<T>(endpoint, {
      method: 'POST',
      data: formData,
      showSuccessToast: true,
      successMessage: 'File uploaded successfully',
    })
  }

  // Batch requests
  async batch<T>(requests: Array<{ endpoint: string; config?: RequestConfig }>): Promise<Array<ApiResponse<T> | { error: ApiError }>> {
    const promises = requests.map(({ endpoint, config }) =>
      this.makeRequest<T>(endpoint, config).catch((error: ApiError) => ({ error }))
    )

    return Promise.all(promises)
  }

  // Set authentication tokens
  setAuth(accessToken: string, sessionId: string) {
    this.tokenManager.setAuth(accessToken, sessionId)
  }

  // Clear authentication
  clearAuth() {
    this.tokenManager.clearAuth()
  }

  // Get current token
  getToken() {
    return this.tokenManager.getToken()
  }
}

// Create singleton instance
export const apiClient = new ApiClient()

// Export token manager for direct access if needed
export const tokenManager = TokenManager.getInstance()

// Utility function for handling API errors
export const handleApiError = (error: unknown, fallbackMessage = 'An error occurred') => {
  if (error && typeof error === 'object' && 'message' in error) {
    return (error as { message: string }).message
  }
  if (typeof error === 'string') {
    return error
  }
  return fallbackMessage
}
