import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  // Test backend connection
  let backendStatus = 'Unknown';
  let backendError = null;

  try {
    const backendResponse = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/user-service/api/v1/`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (backendResponse.status === 401) {
      backendStatus = 'Connected (401 Unauthorized - Expected)';
    } else if (backendResponse.ok) {
      backendStatus = 'Connected (200 OK)';
    } else {
      backendStatus = `Connected (${backendResponse.status})`;
    }
  } catch (error) {
    backendStatus = 'Connection Failed';
    backendError = error instanceof Error ? error.message : 'Unknown error';
  }

  return NextResponse.json({
    environment: {
      NODE_ENV: process.env.NODE_ENV,
      NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET ? 'Set' : 'Not set',
      NEXTAUTH_URL: process.env.NEXTAUTH_URL,
      NEXT_PUBLIC_API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL,
      JWT_SECRET: process.env.JWT_SECRET ? 'Set' : 'Not set',
    },
    backend: {
      status: backendStatus,
      error: backendError,
      url: `${process.env.NEXT_PUBLIC_API_BASE_URL}/user-service/api/v1/`,
    },
    timestamp: new Date().toISOString(),
  });
}
