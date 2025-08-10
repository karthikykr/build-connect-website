'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';

interface BackendStatusProps {
  className?: string;
}

export function BackendStatus({ className }: BackendStatusProps) {
  const [status, setStatus] = useState<'checking' | 'connected' | 'disconnected'>('checking');
  const [details, setDetails] = useState<string>('');
  const [lastCheck, setLastCheck] = useState<Date | null>(null);

  const checkBackendStatus = async () => {
    setStatus('checking');
    setDetails('Checking backend connection...');

    try {
      // First check if we can reach the test endpoint
      const testResponse = await fetch('/api/test-env', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (testResponse.ok) {
        const testData = await testResponse.json();
        
        if (testData.backend?.status?.includes('Connected')) {
          setStatus('connected');
          setDetails(`Backend is reachable: ${testData.backend.status}`);
        } else {
          setStatus('disconnected');
          setDetails(`Backend check failed: ${testData.backend?.error || 'Unknown error'}`);
        }
      } else {
        setStatus('disconnected');
        setDetails(`Test endpoint failed: ${testResponse.status}`);
      }
    } catch (error) {
      setStatus('disconnected');
      setDetails(`Connection error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }

    setLastCheck(new Date());
  };

  useEffect(() => {
    checkBackendStatus();
  }, []);

  const getStatusColor = () => {
    switch (status) {
      case 'connected':
        return 'text-green-600 bg-green-100';
      case 'disconnected':
        return 'text-red-600 bg-red-100';
      case 'checking':
        return 'text-yellow-600 bg-yellow-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = () => {
    switch (status) {
      case 'connected':
        return '✅';
      case 'disconnected':
        return '❌';
      case 'checking':
        return '🔄';
      default:
        return '❓';
    }
  };

  return (
    <div className={`p-4 rounded-lg border ${className}`}>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-semibold text-gray-900">Backend Status</h3>
        <Button
          onClick={checkBackendStatus}
          disabled={status === 'checking'}
          variant="outline"
          size="sm"
        >
          {status === 'checking' ? 'Checking...' : 'Refresh'}
        </Button>
      </div>

      <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor()}`}>
        <span className="mr-2">{getStatusIcon()}</span>
        {status === 'checking' ? 'Checking...' : status === 'connected' ? 'Connected' : 'Disconnected'}
      </div>

      <p className="mt-2 text-sm text-gray-600">{details}</p>

      {lastCheck && (
        <p className="mt-1 text-xs text-gray-500">
          Last checked: {lastCheck.toLocaleTimeString()}
        </p>
      )}

      {status === 'disconnected' && (
        <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded">
          <h4 className="text-sm font-medium text-yellow-800 mb-2">Troubleshooting Steps:</h4>
          <ul className="text-xs text-yellow-700 space-y-1">
            <li>1. Make sure the backend server is running on port 3007</li>
            <li>2. Check if MongoDB and Redis are running</li>
            <li>3. Verify the API_BASE_URL in environment variables</li>
            <li>4. Check for CORS configuration in the backend</li>
          </ul>
        </div>
      )}

      <div className="mt-3 text-xs text-gray-500">
        <p><strong>API Base URL:</strong> http://localhost:8080</p>
        <p><strong>Target Endpoint:</strong> http://localhost:8080/user-service/api/v1/</p>
      </div>
    </div>
  );
}
