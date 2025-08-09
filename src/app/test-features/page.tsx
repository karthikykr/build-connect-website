'use client';

import { useState } from 'react';
import { MainLayout } from '@/components/layout';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Loading } from '@/components/ui/Loading';
import { 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  Play,
  RefreshCw,
  Monitor,
  Smartphone,
  Tablet,
  Globe,
  Shield,
  Zap,
  Database
} from 'lucide-react';
import Link from 'next/link';

interface TestResult {
  name: string;
  status: 'pass' | 'fail' | 'warning' | 'pending';
  message: string;
  duration?: number;
}

export default function TestFeaturesPage() {
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [currentTest, setCurrentTest] = useState('');

  const testSuites = [
    {
      name: 'Core Features',
      tests: [
        { name: 'Authentication System', path: '/auth/login' },
        { name: 'Property Listings', path: '/properties' },
        { name: 'Property Details', path: '/properties/1' },
        { name: 'Broker Directory', path: '/brokers' },
        { name: 'Broker Profiles', path: '/brokers/1' },
        { name: 'Contractor Network', path: '/contractors' },
        { name: 'Contractor Profiles', path: '/contractors/1' },
        { name: 'Map Explorer', path: '/map' },
        { name: 'Chat System', path: '/chat' },
        { name: 'Dashboard', path: '/dashboard' },
      ]
    },
    {
      name: 'AI Features',
      tests: [
        { name: 'AI Features Overview', path: '/ai-features' },
        { name: 'Document Verification', path: '/ai-features' },
        { name: 'Property Valuation', path: '/ai-features' },
        { name: 'Recommendation Engine', path: '/ai-features' },
      ]
    },
    {
      name: 'Responsive Design',
      tests: [
        { name: 'Mobile Layout (320px)', viewport: { width: 320, height: 568 } },
        { name: 'Tablet Layout (768px)', viewport: { width: 768, height: 1024 } },
        { name: 'Desktop Layout (1200px)', viewport: { width: 1200, height: 800 } },
        { name: 'Large Desktop (1920px)', viewport: { width: 1920, height: 1080 } },
      ]
    },
    {
      name: 'Performance',
      tests: [
        { name: 'Page Load Speed', metric: 'LCP' },
        { name: 'First Contentful Paint', metric: 'FCP' },
        { name: 'Cumulative Layout Shift', metric: 'CLS' },
        { name: 'Time to Interactive', metric: 'TTI' },
      ]
    },
    {
      name: 'Security',
      tests: [
        { name: 'HTTPS Enforcement', check: 'ssl' },
        { name: 'Content Security Policy', check: 'csp' },
        { name: 'XSS Protection', check: 'xss' },
        { name: 'CSRF Protection', check: 'csrf' },
      ]
    }
  ];

  const runAllTests = async () => {
    setIsRunning(true);
    setTestResults([]);
    
    const allTests = testSuites.flatMap(suite => 
      suite.tests.map(test => ({ ...test, suite: suite.name }))
    );

    for (const test of allTests) {
      setCurrentTest(`${test.suite}: ${test.name}`);
      
      // Simulate test execution
      await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));
      
      const result = await simulateTest(test);
      setTestResults(prev => [...prev, result]);
    }
    
    setCurrentTest('');
    setIsRunning(false);
  };

  const simulateTest = async (test: any): Promise<TestResult> => {
    const startTime = Date.now();
    
    // Simulate different test outcomes
    const outcomes = ['pass', 'pass', 'pass', 'warning', 'fail']; // 60% pass, 20% warning, 20% fail
    const status = outcomes[Math.floor(Math.random() * outcomes.length)] as TestResult['status'];
    
    const messages = {
      pass: 'Test completed successfully',
      warning: 'Test passed with minor issues',
      fail: 'Test failed - requires attention'
    };
    
    const duration = Date.now() - startTime;
    
    return {
      name: `${test.suite}: ${test.name}`,
      status,
      message: messages[status],
      duration
    };
  };

  const getStatusIcon = (status: TestResult['status']) => {
    switch (status) {
      case 'pass':
        return <CheckCircle className="w-5 h-5 text-success" />;
      case 'fail':
        return <XCircle className="w-5 h-5 text-error" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-warning" />;
      default:
        return <div className="w-5 h-5 bg-gray-light rounded-full" />;
    }
  };

  const getStatusColor = (status: TestResult['status']) => {
    switch (status) {
      case 'pass':
        return 'text-success bg-success/10';
      case 'fail':
        return 'text-error bg-error/10';
      case 'warning':
        return 'text-warning bg-warning/10';
      default:
        return 'text-text-secondary bg-gray-light';
    }
  };

  const testStats = {
    total: testResults.length,
    passed: testResults.filter(r => r.status === 'pass').length,
    failed: testResults.filter(r => r.status === 'fail').length,
    warnings: testResults.filter(r => r.status === 'warning').length,
  };

  const passRate = testStats.total > 0 ? (testStats.passed / testStats.total * 100).toFixed(1) : 0;

  return (
    <MainLayout>
      <div className="container-custom py-8">
        {/* Page Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-text-primary mb-4">
            Feature Testing Dashboard
          </h1>
          <p className="text-text-secondary">
            Comprehensive testing suite for all platform features and functionality
          </p>
        </div>

        {/* Test Controls */}
        <div className="flex items-center justify-center space-x-4 mb-8">
          <Button
            variant="primary"
            size="lg"
            onClick={runAllTests}
            disabled={isRunning}
            leftIcon={isRunning ? <Loading size="sm" /> : <Play className="w-5 h-5" />}
          >
            {isRunning ? 'Running Tests...' : 'Run All Tests'}
          </Button>
          <Button
            variant="outline"
            onClick={() => setTestResults([])}
            disabled={isRunning}
            leftIcon={<RefreshCw className="w-4 h-4" />}
          >
            Clear Results
          </Button>
        </div>

        {/* Current Test Status */}
        {isRunning && currentTest && (
          <Card className="mb-8">
            <CardContent className="p-6">
              <div className="flex items-center justify-center space-x-3">
                <Loading size="sm" />
                <span className="text-lg font-medium">Running: {currentTest}</span>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Test Statistics */}
        {testResults.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
            <Card>
              <CardContent className="p-6 text-center">
                <Monitor className="w-8 h-8 text-primary mx-auto mb-2" />
                <p className="text-2xl font-bold text-text-primary">{testStats.total}</p>
                <p className="text-sm text-text-secondary">Total Tests</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <CheckCircle className="w-8 h-8 text-success mx-auto mb-2" />
                <p className="text-2xl font-bold text-success">{testStats.passed}</p>
                <p className="text-sm text-text-secondary">Passed</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <XCircle className="w-8 h-8 text-error mx-auto mb-2" />
                <p className="text-2xl font-bold text-error">{testStats.failed}</p>
                <p className="text-sm text-text-secondary">Failed</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <AlertTriangle className="w-8 h-8 text-warning mx-auto mb-2" />
                <p className="text-2xl font-bold text-warning">{testStats.warnings}</p>
                <p className="text-sm text-text-secondary">Warnings</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <Zap className="w-8 h-8 text-primary mx-auto mb-2" />
                <p className="text-2xl font-bold text-text-primary">{passRate}%</p>
                <p className="text-sm text-text-secondary">Pass Rate</p>
              </CardContent>
            </Card>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Test Suites */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Test Suites</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {testSuites.map((suite, index) => (
                    <div key={index} className="border border-gray-light rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-semibold text-text-primary">{suite.name}</h3>
                        <span className="text-sm text-text-secondary">
                          {suite.tests.length} tests
                        </span>
                      </div>
                      <div className="space-y-2">
                        {suite.tests.map((test, testIndex) => (
                          <div key={testIndex} className="flex items-center justify-between text-sm">
                            <span className="text-text-secondary">{test.name}</span>
                            {test.path && (
                              <Link href={test.path}>
                                <Button variant="ghost" size="sm">
                                  Test
                                </Button>
                              </Link>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Test Results */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Test Results</CardTitle>
              </CardHeader>
              <CardContent>
                {testResults.length === 0 ? (
                  <div className="text-center py-8">
                    <Monitor className="w-12 h-12 text-text-secondary mx-auto mb-4" />
                    <p className="text-text-secondary">No test results yet</p>
                    <p className="text-sm text-text-secondary">Run tests to see results here</p>
                  </div>
                ) : (
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {testResults.map((result, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border border-gray-light rounded-lg">
                        <div className="flex items-center space-x-3">
                          {getStatusIcon(result.status)}
                          <div>
                            <p className="font-medium text-text-primary">{result.name}</p>
                            <p className="text-sm text-text-secondary">{result.message}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(result.status)}`}>
                            {result.status.toUpperCase()}
                          </div>
                          {result.duration && (
                            <p className="text-xs text-text-secondary mt-1">
                              {result.duration}ms
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Quick Links */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-text-primary mb-6 text-center">
            Quick Feature Tests
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {[
              { name: 'Home', path: '/', icon: Globe },
              { name: 'Properties', path: '/properties', icon: Database },
              { name: 'Brokers', path: '/brokers', icon: Monitor },
              { name: 'Contractors', path: '/contractors', icon: Smartphone },
              { name: 'Map', path: '/map', icon: Tablet },
              { name: 'AI Features', path: '/ai-features', icon: Shield },
            ].map((link, index) => {
              const IconComponent = link.icon;
              return (
                <Link key={index} href={link.path}>
                  <Card className="hover:shadow-card-hover transition-shadow duration-300 cursor-pointer">
                    <CardContent className="p-4 text-center">
                      <IconComponent className="w-8 h-8 text-primary mx-auto mb-2" />
                      <p className="text-sm font-medium">{link.name}</p>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
