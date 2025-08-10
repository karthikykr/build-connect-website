import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  // Test backend connection
  let backendStatus = 'Unknown';
  let backendError = null;

  try {
    const backendResponse = await fetch('http://localhost:8080/user-service/api/v1/', {
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
      NODE_ENV: 'development',
      NEXTAUTH_SECRET: 'Hardcoded for development',
      NEXTAUTH_URL: 'http://localhost:3000',
      API_BASE_URL: 'http://localhost:8080',
      JWT_SECRET: 'Hardcoded for development',
    },
    backend: {
      status: backendStatus,
      error: backendError,
      url: 'http://localhost:8080/user-service/api/v1/',
    },
    timestamp: new Date().toISOString(),
  });
}
