/**
 * API Middleware for Backend Integration
 */

import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import jwt from 'jsonwebtoken'

// Types
export interface AuthenticatedRequest extends NextRequest {
  user?: {
    id: string
    email: string
    role: string
    isVerified: boolean
  }
}

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
    timestamp: string
    requestId: string
  }
}

// Error classes
export class ApiError extends Error {
  constructor(
    message: string,
    public statusCode: number = 500,
    public code?: string,
    public details?: any
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

export class ValidationError extends ApiError {
  constructor(message: string, public errors: Record<string, string[]>) {
    super(message, 400, 'VALIDATION_ERROR')
    this.name = 'ValidationError'
  }
}

export class AuthenticationError extends ApiError {
  constructor(message: string = 'Authentication required') {
    super(message, 401, 'AUTHENTICATION_ERROR')
    this.name = 'AuthenticationError'
  }
}

export class AuthorizationError extends ApiError {
  constructor(message: string = 'Insufficient permissions') {
    super(message, 403, 'AUTHORIZATION_ERROR')
    this.name = 'AuthorizationError'
  }
}

export class NotFoundError extends ApiError {
  constructor(message: string = 'Resource not found') {
    super(message, 404, 'NOT_FOUND_ERROR')
    this.name = 'NotFoundError'
  }
}

// Utility functions
export function generateRequestId(): string {
  return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}

export function createApiResponse<T>(
  data?: T,
  message?: string,
  meta?: any
): ApiResponse<T> {
  return {
    success: true,
    data,
    message,
    meta: {
      ...meta,
      timestamp: new Date().toISOString(),
      requestId: generateRequestId(),
    },
  }
}

export function createErrorResponse(
  error: string | ApiError,
  statusCode: number = 500,
  errors?: Record<string, string[]>
): NextResponse {
  const errorMessage = typeof error === 'string' ? error : error.message
  const code = error instanceof ApiError ? error.code : undefined
  const details = error instanceof ApiError ? error.details : undefined
  
  const response: ApiResponse = {
    success: false,
    error: errorMessage,
    errors,
    meta: {
      timestamp: new Date().toISOString(),
      requestId: generateRequestId(),
    },
  }
  
  if (code) {
    response.meta!.code = code
  }
  
  if (details) {
    response.meta!.details = details
  }
  
  return NextResponse.json(response, { status: statusCode })
}

// Authentication middleware
export async function authenticateRequest(request: NextRequest): Promise<AuthenticatedRequest> {
  const authHeader = request.headers.get('authorization')
  const cookieToken = request.cookies.get('access-token')?.value
  
  const token = authHeader?.replace('Bearer ', '') || cookieToken
  
  if (!token) {
    throw new AuthenticationError('No authentication token provided')
  }
  
  try {
    const decoded = jwt.verify(token, 'build-connect-jwt-secret-for-development') as any

    // Verify token with backend if needed
    const verificationResponse = await fetch('http://localhost:8080/auth/verify', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'X-API-Key': '',
      },
    })
    
    if (!verificationResponse.ok) {
      throw new AuthenticationError('Invalid or expired token')
    }
    
    const userData = await verificationResponse.json()
    
    // Attach user data to request
    const authenticatedRequest = request as AuthenticatedRequest
    authenticatedRequest.user = {
      id: userData.id,
      email: userData.email,
      role: userData.role,
      isVerified: userData.isVerified,
    }
    
    return authenticatedRequest
    
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      throw new AuthenticationError('Invalid token')
    }
    if (error instanceof jwt.TokenExpiredError) {
      throw new AuthenticationError('Token expired')
    }
    throw error
  }
}

// Authorization middleware
export function requireRole(allowedRoles: string[]) {
  return (request: AuthenticatedRequest) => {
    if (!request.user) {
      throw new AuthenticationError()
    }
    
    if (!allowedRoles.includes(request.user.role)) {
      throw new AuthorizationError(`Access denied. Required roles: ${allowedRoles.join(', ')}`)
    }
  }
}

export function requireVerification(request: AuthenticatedRequest) {
  if (!request.user) {
    throw new AuthenticationError()
  }
  
  if (!request.user.isVerified) {
    throw new AuthorizationError('Email verification required')
  }
}

// Validation middleware
export function validateRequest<T>(schema: z.ZodSchema<T>) {
  return async (request: NextRequest): Promise<T> => {
    try {
      const body = await request.json()
      return schema.parse(body)
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errors = error.errors.reduce((acc, err) => {
          const path = err.path.join('.')
          if (!acc[path]) acc[path] = []
          acc[path].push(err.message)
          return acc
        }, {} as Record<string, string[]>)
        
        throw new ValidationError('Validation failed', errors)
      }
      throw new ApiError('Invalid JSON in request body', 400)
    }
  }
}

// Rate limiting middleware
const rateLimitStore = new Map<string, { count: number; resetTime: number }>()

export function rateLimit(maxRequests: number = 100, windowMs: number = 15 * 60 * 1000) {
  return (request: NextRequest) => {
    const clientIp = request.ip || request.headers.get('x-forwarded-for') || 'unknown'
    const now = Date.now()
    const windowStart = now - windowMs
    
    // Clean up old entries
    for (const [key, value] of rateLimitStore.entries()) {
      if (value.resetTime < now) {
        rateLimitStore.delete(key)
      }
    }
    
    const current = rateLimitStore.get(clientIp)
    
    if (!current || current.resetTime < now) {
      rateLimitStore.set(clientIp, { count: 1, resetTime: now + windowMs })
      return
    }
    
    if (current.count >= maxRequests) {
      throw new ApiError('Rate limit exceeded', 429, 'RATE_LIMIT_EXCEEDED')
    }
    
    current.count++
  }
}

// CORS middleware
export function corsMiddleware(request: NextRequest) {
  const origin = request.headers.get('origin')
  const allowedOrigins = ['http://localhost:3000']
  
  if (origin && !allowedOrigins.includes(origin)) {
    throw new ApiError('CORS policy violation', 403, 'CORS_ERROR')
  }
}

// Request logging middleware
export function logRequest(request: NextRequest) {
  const startTime = Date.now()
  const method = request.method
  const url = request.url
  const userAgent = request.headers.get('user-agent')
  const ip = request.ip || request.headers.get('x-forwarded-for')
  
  console.log(`[${new Date().toISOString()}] ${method} ${url} - IP: ${ip} - UA: ${userAgent}`)
  
  return () => {
    const duration = Date.now() - startTime
    console.log(`[${new Date().toISOString()}] ${method} ${url} - ${duration}ms`)
  }
}

// Error handling wrapper
export function withErrorHandling(handler: (request: NextRequest) => Promise<NextResponse>) {
  return async (request: NextRequest): Promise<NextResponse> => {
    const logEnd = logRequest(request)
    
    try {
      const response = await handler(request)
      logEnd()
      return response
      
    } catch (error) {
      logEnd()
      console.error('API Error:', error)
      
      if (error instanceof ValidationError) {
        return createErrorResponse(error, 400, error.errors)
      }
      
      if (error instanceof ApiError) {
        return createErrorResponse(error, error.statusCode)
      }
      
      // Log unexpected errors for monitoring
      // Always log errors in development
      console.error('Unexpected API error:', error)
      
      return createErrorResponse('Internal server error', 500)
    }
  }
}

// Middleware composer
export function composeMiddleware(...middlewares: Array<(request: any) => void | Promise<void>>) {
  return async (request: NextRequest) => {
    for (const middleware of middlewares) {
      await middleware(request)
    }
  }
}

// Backend API proxy
export async function proxyToBackend(
  endpoint: string,
  options: {
    method?: string
    body?: any
    headers?: Record<string, string>
    params?: Record<string, string>
  } = {}
) {
  const { method = 'GET', body, headers = {}, params } = options
  
  const url = new URL(endpoint, 'http://localhost:8080')

  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.append(key, value)
    })
  }

  const requestHeaders = {
    'Content-Type': 'application/json',
    'X-API-Key': '',
    ...headers,
  }
  
  const requestOptions: RequestInit = {
    method,
    headers: requestHeaders,
  }
  
  if (body && method !== 'GET') {
    requestOptions.body = typeof body === 'string' ? body : JSON.stringify(body)
  }
  
  const response = await fetch(url.toString(), requestOptions)
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    throw new ApiError(
      errorData.message || `Backend API error: ${response.status}`,
      response.status,
      errorData.code
    )
  }
  
  return response.json()
}
