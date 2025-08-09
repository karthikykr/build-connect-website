/**
 * Login API Route
 */

import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

// Validation schema
const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  rememberMe: z.boolean().optional(),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate request body
    const validatedData = loginSchema.parse(body)
    
    // Connect to your backend API via API Gateway
    const backendResponse = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/user-service/api/v1/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      mode: 'cors',
      credentials: 'omit',
      body: JSON.stringify({
        email: validatedData.email,
        password: validatedData.password,
      }),
    })
    
    if (!backendResponse.ok) {
      const errorData = await backendResponse.json()
      return NextResponse.json(
        { 
          success: false, 
          error: errorData.message || 'Login failed' 
        },
        { status: backendResponse.status }
      )
    }
    
    const data = await backendResponse.json()
    
    // Create response with secure cookies
    const response = NextResponse.json({
      success: true,
      message: data.message || 'Login successful',
      data: {
        accessToken: data.accessToken,
        sessionId: data.sessionId,
        // Note: Backend doesn't return user object in login response
      },
    })
    
    // Set secure HTTP-only cookies
    if (data.accessToken) {
      response.cookies.set('access-token', data.accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 3600, // 1 hour default
        path: '/',
      })
    }

    if (data.sessionId) {
      response.cookies.set('session-id', data.sessionId, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60, // 7 days
        path: '/',
      })
    }
    
    return response
    
  } catch (error) {
    console.error('Login API error:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid request data',
          errors: error.errors.reduce((acc: Record<string, string>, err: z.ZodIssue) => {
            acc[err.path.join('.')] = err.message
            return acc
          }, {} as Record<string, string>)
        },
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      { 
        success: false, 
        error: 'Internal server error' 
      },
      { status: 500 }
    )
  }
}

// Handle preflight requests
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  })
}
