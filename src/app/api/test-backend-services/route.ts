import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const services = [
    {
      name: 'User Management Service',
      url: 'http://localhost:3007/user-service/api/v1/',
      endpoints: [
        'http://localhost:3007/user-service/api/v1/admin/users',
        'http://localhost:3007/user-service/api/v1/admin/stats',
        'http://localhost:3007/user-service/api/v1/brokers/all',
        'http://localhost:3007/user-service/api/v1/contractors/all'
      ]
    },
    {
      name: 'Admin Management Service',
      url: 'http://localhost:3001/admin-service/api/v1/',
      endpoints: [
        'http://localhost:3001/admin-service/api/v1/users',
        'http://localhost:3001/admin-service/api/v1/users/stats',
        'http://localhost:3001/admin-service/api/v1/analytics'
      ]
    },
    {
      name: 'API Gateway',
      url: 'http://localhost:8080/',
      endpoints: [
        'http://localhost:8080/user-service/api/v1/',
        'http://localhost:8080/admin-service/api/v1/'
      ]
    }
  ];

  const results = [];

  for (const service of services) {
    console.log(`Testing ${service.name}...`);
    
    const serviceResult = {
      name: service.name,
      baseUrl: service.url,
      status: 'unknown',
      error: null,
      endpoints: []
    };

    try {
      // Test base URL
      const baseResponse = await fetch(service.url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        signal: AbortSignal.timeout(5000) // 5 second timeout
      });

      serviceResult.status = baseResponse.ok ? 'online' : 'error';
      if (!baseResponse.ok) {
        serviceResult.error = `HTTP ${baseResponse.status}`;
      }

      // Test specific endpoints
      for (const endpoint of service.endpoints) {
        try {
          const endpointResponse = await fetch(endpoint, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              // Add mock auth headers for testing
              'Authorization': 'Bearer test-token',
              'Session': 'test-session'
            },
            signal: AbortSignal.timeout(3000) // 3 second timeout
          });

          serviceResult.endpoints.push({
            url: endpoint,
            status: endpointResponse.status,
            ok: endpointResponse.ok,
            error: endpointResponse.ok ? null : `HTTP ${endpointResponse.status}`
          });
        } catch (endpointError) {
          serviceResult.endpoints.push({
            url: endpoint,
            status: 0,
            ok: false,
            error: endpointError instanceof Error ? endpointError.message : 'Unknown error'
          });
        }
      }

    } catch (error) {
      serviceResult.status = 'offline';
      serviceResult.error = error instanceof Error ? error.message : 'Unknown error';
    }

    results.push(serviceResult);
  }

  return NextResponse.json({
    success: true,
    message: 'Backend services test completed',
    timestamp: new Date().toISOString(),
    services: results,
    summary: {
      total: services.length,
      online: results.filter(r => r.status === 'online').length,
      offline: results.filter(r => r.status === 'offline').length,
      error: results.filter(r => r.status === 'error').length
    }
  });
}
