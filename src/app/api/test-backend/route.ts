import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const backendUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  
  if (!backendUrl) {
    return NextResponse.json({
      success: false,
      error: 'NEXT_PUBLIC_API_BASE_URL not configured',
    }, { status: 500 });
  }

  try {
    // Test basic connectivity
    const testUrl = `${backendUrl}/user-service/api/v1/`;
    console.log('Testing backend connectivity to:', testUrl);

    const response = await fetch(testUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      mode: 'cors',
      credentials: 'omit',
      // Add timeout
      signal: AbortSignal.timeout(5000),
    });

    const responseText = await response.text();
    
    return NextResponse.json({
      success: true,
      backend: {
        url: testUrl,
        status: response.status,
        statusText: response.statusText,
        headers: Object.fromEntries(response.headers.entries()),
        body: responseText,
        ok: response.ok,
      },
      timestamp: new Date().toISOString(),
    });

  } catch (error) {
    console.error('Backend test error:', error);
    
    return NextResponse.json({
      success: false,
      error: {
        message: error instanceof Error ? error.message : 'Unknown error',
        type: error?.constructor?.name || 'Unknown',
        backend_url: backendUrl,
      },
      timestamp: new Date().toISOString(),
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const backendUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  
  try {
    const body = await request.json();
    const { accessToken, sessionId } = body;

    if (!accessToken || !sessionId) {
      return NextResponse.json({
        success: false,
        error: 'accessToken and sessionId are required',
      }, { status: 400 });
    }

    // Test authenticated request
    const testUrl = `${backendUrl}/user-service/api/v1/user/profile`;
    console.log('Testing authenticated request to:', testUrl);

    const response = await fetch(testUrl, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Session': sessionId,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      mode: 'cors',
      credentials: 'omit',
      signal: AbortSignal.timeout(5000),
    });

    const responseText = await response.text();
    
    return NextResponse.json({
      success: true,
      authenticated_request: {
        url: testUrl,
        status: response.status,
        statusText: response.statusText,
        headers: Object.fromEntries(response.headers.entries()),
        body: responseText,
        ok: response.ok,
      },
      timestamp: new Date().toISOString(),
    });

  } catch (error) {
    console.error('Authenticated backend test error:', error);
    
    return NextResponse.json({
      success: false,
      error: {
        message: error instanceof Error ? error.message : 'Unknown error',
        type: error?.constructor?.name || 'Unknown',
      },
      timestamp: new Date().toISOString(),
    }, { status: 500 });
  }
}
