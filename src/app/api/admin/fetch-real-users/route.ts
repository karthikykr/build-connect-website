import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const results = [];
  
  // Direct API calls to backend services to fetch real user data
  const endpoints = [
    {
      name: 'User Service - Admin Users',
      url: 'http://localhost:3007/user-service/api/v1/admin/users',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer admin-token',
        'Session': 'admin-session'
      }
    },
    {
      name: 'User Service - Admin Stats',
      url: 'http://localhost:3007/user-service/api/v1/admin/stats',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer admin-token',
        'Session': 'admin-session'
      }
    },
    {
      name: 'User Service - All Brokers',
      url: 'http://localhost:3007/user-service/api/v1/brokers/all',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer admin-token'
      }
    },
    {
      name: 'User Service - All Contractors',
      url: 'http://localhost:3007/user-service/api/v1/contractors/all',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer admin-token'
      }
    },
    {
      name: 'Admin Service - Users',
      url: 'http://localhost:3001/admin-service/api/v1/users',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer admin-token'
      }
    },
    {
      name: 'API Gateway - User Service',
      url: 'http://localhost:8080/user-service/api/v1/admin/users',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer admin-token'
      }
    }
  ];

  for (const endpoint of endpoints) {
    const result = {
      name: endpoint.name,
      url: endpoint.url,
      status: 'unknown',
      data: null,
      error: null,
      responseTime: 0
    };

    try {
      console.log(`Testing ${endpoint.name}: ${endpoint.url}`);
      const startTime = Date.now();
      
      const response = await fetch(endpoint.url, {
        method: 'GET',
        headers: endpoint.headers,
        signal: AbortSignal.timeout(10000) // 10 second timeout
      });

      result.responseTime = Date.now() - startTime;
      result.status = response.status.toString();

      if (response.ok) {
        const data = await response.json();
        result.data = data;
        
        // Log successful responses
        console.log(`✅ ${endpoint.name} SUCCESS:`, {
          status: response.status,
          dataKeys: Object.keys(data || {}),
          hasUsers: !!(data?.users || data?.data?.users),
          userCount: data?.users?.length || data?.data?.users?.length || 0,
          totalUsers: data?.total || data?.totalUsers || data?.stats?.totalUsers
        });
      } else {
        result.error = `HTTP ${response.status}: ${response.statusText}`;
        console.log(`❌ ${endpoint.name} ERROR: ${result.error}`);
      }

    } catch (error) {
      result.status = 'error';
      result.error = error instanceof Error ? error.message : 'Unknown error';
      console.log(`❌ ${endpoint.name} FAILED: ${result.error}`);
    }

    results.push(result);
  }

  // Summary
  const successful = results.filter(r => r.status === '200');
  const withUserData = results.filter(r => r.data && (r.data.users || r.data.data?.users));
  
  console.log('\n=== BACKEND SERVICES TEST SUMMARY ===');
  console.log(`Total endpoints tested: ${results.length}`);
  console.log(`Successful responses: ${successful.length}`);
  console.log(`Endpoints with user data: ${withUserData.length}`);
  
  if (withUserData.length > 0) {
    console.log('\n✅ FOUND REAL USER DATA:');
    withUserData.forEach(endpoint => {
      const users = endpoint.data?.users || endpoint.data?.data?.users || [];
      console.log(`- ${endpoint.name}: ${users.length} users`);
    });
  }

  return NextResponse.json({
    success: true,
    message: 'Real user data fetch test completed',
    timestamp: new Date().toISOString(),
    summary: {
      totalEndpoints: results.length,
      successfulResponses: successful.length,
      endpointsWithUserData: withUserData.length,
      realUserDataFound: withUserData.length > 0
    },
    results,
    recommendations: withUserData.length > 0 
      ? `✅ Found real user data! Use ${withUserData[0].name} endpoint for production.`
      : '❌ No real user data found. Backend services may not be running or may need authentication.'
  });
}
