'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { UserProfileDisplay } from '@/components/UserProfileDisplay';
import { BackendStatus } from '@/components/BackendStatus';
import { DirectBackendTest } from '@/components/DirectBackendTest';

export default function TestAuthPage() {
  const { data: session } = useSession();
  const [loginResult, setLoginResult] = useState<any>(null);
  const [signupResult, setSignupResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const testLogin = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: 'test@example.com',
          password: 'testpassword123',
        }),
      });

      const data = await response.json();
      setLoginResult(data);
    } catch (error) {
      setLoginResult({ error: error.message });
    } finally {
      setLoading(false);
    }
  };

  const testSignup = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: 'Test User',
          email: `test${Date.now()}@example.com`,
          password: 'testpassword123',
          phone: '+1234567890',
          role: 'buyer',
        }),
      });

      const data = await response.json();
      setSignupResult(data);
    } catch (error) {
      setSignupResult({ error: error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Backend Status Check */}
        <BackendStatus />

        <div className="bg-white rounded-lg shadow-md p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Authentication Test</h1>

          <div className="space-y-4">
            <button
              onClick={testSignup}
              disabled={loading}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? 'Testing...' : 'Test Signup'}
            </button>

            <button
              onClick={testLogin}
              disabled={loading}
              className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 disabled:opacity-50"
            >
              {loading ? 'Testing...' : 'Test Login'}
            </button>
          </div>

          {signupResult && (
            <div className="mt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Signup Result:</h3>
              <pre className="bg-gray-100 p-3 rounded text-sm overflow-auto">
                {JSON.stringify(signupResult, null, 2)}
              </pre>
            </div>
          )}

          {loginResult && (
            <div className="mt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Login Result:</h3>
              <pre className="bg-gray-100 p-3 rounded text-sm overflow-auto">
                {JSON.stringify(loginResult, null, 2)}
              </pre>
            </div>
          )}

          <div className="mt-6 text-sm text-gray-600">
            <p><strong>Environment Check:</strong></p>
            <p>API Base URL: {process.env.NEXT_PUBLIC_API_BASE_URL || 'Not set'}</p>
            <p>NextAuth URL: {process.env.NEXTAUTH_URL || 'Not set'}</p>
            <p>NextAuth Secret: {process.env.NEXTAUTH_SECRET ? 'Set' : 'Not set'}</p>
          </div>
        </div>

        {/* Direct Backend Test */}
        <DirectBackendTest />

        {/* User Profile Display */}
        {session && (
          <UserProfileDisplay />
        )}
      </div>
    </div>
  );
}
