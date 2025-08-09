'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { Button } from '@/components/ui/Button';

export function DirectBackendTest() {
  const { data: session } = useSession();
  const [results, setResults] = useState<any[]>([]);
  const [testing, setTesting] = useState(false);

  const addResult = (test: string, result: any) => {
    setResults(prev => [...prev, { test, result, timestamp: new Date().toISOString() }]);
  };

  const clearResults = () => {
    setResults([]);
  };

  const testDirectConnection = async () => {
    if (!session?.user?.accessToken) {
      addResult('Direct Connection', { error: 'No access token available' });
      return;
    }

    setTesting(true);

    try {
      // Test 1: Basic connectivity (no auth)
      console.log('Testing basic connectivity...');
      try {
        const basicResponse = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/user-service/api/v1/`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          mode: 'cors',
          credentials: 'omit',
        });
        
        addResult('Basic Connectivity', {
          status: basicResponse.status,
          statusText: basicResponse.statusText,
          ok: basicResponse.ok,
          headers: Object.fromEntries(basicResponse.headers.entries()),
        });
      } catch (error) {
        addResult('Basic Connectivity', { error: error.message });
      }

      // Test 2: Profile endpoint with Session header
      console.log('Testing profile endpoint with Session header...');
      try {
        const profileResponse1 = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/user-service/api/v1/user/profile`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${session.user.accessToken}`,
            'Session': session.user.id,
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          mode: 'cors',
          credentials: 'omit',
        });
        
        const profileData1 = await profileResponse1.text();
        addResult('Profile with Session Header', {
          status: profileResponse1.status,
          statusText: profileResponse1.statusText,
          ok: profileResponse1.ok,
          data: profileData1,
        });
      } catch (error) {
        addResult('Profile with Session Header', { error: error.message });
      }

      // Test 3: Profile endpoint with Session header
      console.log('Testing profile endpoint with Session header...');
      try {
        const profileResponse2 = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/user-service/api/v1/user/profile`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${session.user.accessToken}`,
            'Session': session.user.id,
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          mode: 'cors',
          credentials: 'omit',
        });
        
        const profileData2 = await profileResponse2.text();
        addResult('Profile with Session', {
          status: profileResponse2.status,
          statusText: profileResponse2.statusText,
          ok: profileResponse2.ok,
          data: profileData2,
        });
      } catch (error) {
        addResult('Profile with Session', { error: error.message });
      }

      // Test 4: Root endpoint with auth
      console.log('Testing root endpoint with auth...');
      try {
        const rootResponse = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/user-service/api/v1/`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${session.user.accessToken}`,
            'Session': session.user.id,
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          mode: 'cors',
          credentials: 'omit',
        });
        
        const rootData = await rootResponse.text();
        addResult('Root with Auth', {
          status: rootResponse.status,
          statusText: rootResponse.statusText,
          ok: rootResponse.ok,
          data: rootData,
        });
      } catch (error) {
        addResult('Root with Auth', { error: error.message });
      }

    } finally {
      setTesting(false);
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-900">Direct Backend Test</h2>
        <div className="space-x-2">
          <Button
            onClick={clearResults}
            variant="outline"
            size="sm"
          >
            Clear Results
          </Button>
          <Button
            onClick={testDirectConnection}
            disabled={testing || !session?.user?.accessToken}
            variant="primary"
            size="sm"
          >
            {testing ? 'Testing...' : 'Run Tests'}
          </Button>
        </div>
      </div>

      {!session?.user?.accessToken && (
        <div className="mb-4 p-3 bg-yellow-100 border border-yellow-400 text-yellow-700 rounded">
          <p>Please log in first to run authenticated tests.</p>
        </div>
      )}

      <div className="space-y-4">
        {results.map((result, index) => (
          <div key={index} className="border rounded p-3">
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-semibold text-gray-900">{result.test}</h3>
              <span className="text-xs text-gray-500">{new Date(result.timestamp).toLocaleTimeString()}</span>
            </div>
            <pre className="bg-gray-100 p-2 rounded text-xs overflow-auto">
              {JSON.stringify(result.result, null, 2)}
            </pre>
          </div>
        ))}
      </div>

      {results.length === 0 && (
        <div className="text-center text-gray-500 py-8">
          No test results yet. Click "Run Tests" to start testing.
        </div>
      )}
    </div>
  );
}
