'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useUserProfile } from '@/hooks/useUserProfile';
import { Button } from '@/components/ui/Button';

export function UserProfileDisplay() {
  const { data: session } = useSession();
  const { profile, loading, error, refreshProfile } = useUserProfile();
  const [testResult, setTestResult] = useState<any>(null);
  const [testing, setTesting] = useState(false);

  const testBackendConnection = async () => {
    if (!session?.user?.accessToken) {
      setTestResult({ error: 'No access token available' });
      return;
    }

    setTesting(true);
    try {
      const response = await fetch('/api/test-backend', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          accessToken: session.user.accessToken,
          sessionId: session.user.sessionId || session.user.id,
        }),
      });

      const result = await response.json();
      setTestResult(result);
    } catch (error) {
      setTestResult({ error: error instanceof Error ? error.message : 'Test failed' });
    } finally {
      setTesting(false);
    }
  };

  if (!session) {
    return (
      <div className="p-4 bg-gray-100 rounded-lg">
        <p className="text-gray-600">Not logged in</p>
      </div>
    );
  }

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-900">User Profile</h2>
        <div className="space-x-2">
          <Button
            onClick={testBackendConnection}
            disabled={testing}
            variant="outline"
            size="sm"
          >
            {testing ? 'Testing...' : 'Test Backend'}
          </Button>
          <Button
            onClick={refreshProfile}
            disabled={loading}
            variant="outline"
            size="sm"
          >
            {loading ? 'Refreshing...' : 'Refresh Profile'}
          </Button>
        </div>
      </div>



      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-3">Session Data</h3>
          <div className="space-y-2 text-sm">
            <p><strong>ID:</strong> {session.user.id}</p>
            <p><strong>Name:</strong> {session.user.name}</p>
            <p><strong>Email:</strong> {session.user.email}</p>
            <p><strong>Phone:</strong> {session.user.phone || 'Not set'}</p>
            <p><strong>Role:</strong> {session.user.role}</p>
            <p><strong>Email Verified:</strong> {session.user.isEmailVerified ? 'Yes' : 'No'}</p>
            <p><strong>Phone Verified:</strong> {session.user.isPhoneVerified ? 'Yes' : 'No'}</p>
            <p><strong>Available:</strong> {session.user.isAvailable ? 'Yes' : 'No'}</p>
            <p><strong>Partnership Request:</strong> {session.user.partnershipRequest}</p>
            <p><strong>Location:</strong> {session.user.location?.join(', ') || 'Not set'}</p>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-3">Profile Data</h3>
          {loading ? (
            <p className="text-gray-600">Loading profile...</p>
          ) : profile ? (
            <div className="space-y-2 text-sm">
              <p><strong>ID:</strong> {profile.id}</p>
              <p><strong>Name:</strong> {profile.name}</p>
              <p><strong>Email:</strong> {profile.email}</p>
              <p><strong>Phone:</strong> {profile.phone || 'Not set'}</p>
              <p><strong>Role:</strong> {profile.role}</p>
              <p><strong>Email Verified:</strong> {profile.isEmailVerified ? 'Yes' : 'No'}</p>
              <p><strong>Phone Verified:</strong> {profile.isPhoneVerified ? 'Yes' : 'No'}</p>
              <p><strong>Available:</strong> {profile.isAvailable ? 'Yes' : 'No'}</p>
              <p><strong>Partnership Request:</strong> {profile.partnershipRequest}</p>
              <p><strong>Location:</strong> {profile.location?.join(', ') || 'Not set'}</p>
              <p><strong>Avatar:</strong> {profile.avatar || 'Not set'}</p>
              <p><strong>Created:</strong> {profile.createdAt ? new Date(profile.createdAt).toLocaleDateString() : 'Not set'}</p>
              <p><strong>Updated:</strong> {profile.updatedAt ? new Date(profile.updatedAt).toLocaleDateString() : 'Not set'}</p>
            </div>
          ) : (
            <p className="text-gray-600">No profile data available</p>
          )}
        </div>
      </div>

      {testResult && (
        <div className="mt-6">
          <h3 className="text-lg font-medium text-gray-900 mb-3">Backend Test Result</h3>
          <div className="bg-gray-100 p-3 rounded text-xs">
            <pre>{JSON.stringify(testResult, null, 2)}</pre>
          </div>
        </div>
      )}

      <div className="mt-6">
        <h3 className="text-lg font-medium text-gray-900 mb-3">Debug Information</h3>
        <div className="bg-gray-100 p-3 rounded text-xs">
          <p><strong>Access Token:</strong> {session.user.accessToken ? 'Present' : 'Missing'}</p>
          <p><strong>API Base URL:</strong> {process.env.NEXT_PUBLIC_API_BASE_URL}</p>
          <p><strong>Profile Endpoint:</strong> {process.env.NEXT_PUBLIC_API_BASE_URL}/user-service/api/v1/user/profile</p>
          <p><strong>Root Endpoint:</strong> {process.env.NEXT_PUBLIC_API_BASE_URL}/user-service/api/v1/</p>
        </div>
      </div>
    </div>
  );
}
