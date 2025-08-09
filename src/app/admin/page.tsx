'use client';

import { DashboardLayout } from '@/components/layout';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { AdminDashboard } from '@/components/features/admin/AdminDashboard';
import { Button } from '@/components/ui/Button';
import { Settings, BarChart3, Download, Users, Shield } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import Link from 'next/link';

export default function AdminDashboardPage() {
  const { user, isAdmin } = useAuth();

  const breadcrumbs = [{ label: 'Admin Dashboard', current: true }];

  return (
    <ProtectedRoute allowedRoles={['admin']}>
      <DashboardLayout
        breadcrumbs={breadcrumbs}
        title="Admin Dashboard"
        description={`Welcome back, ${user?.name || 'Admin'}! Here's your platform overview.`}
        actions={
          <div className="flex gap-3">
            <Link href="/admin/analytics">
              <Button variant="outline">
                <BarChart3 className="mr-2 h-4 w-4" />
                Analytics
              </Button>
            </Link>
            <Link href="/admin/settings">
              <Button variant="outline">
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </Button>
            </Link>
            <Button variant="primary">
              <Download className="mr-2 h-4 w-4" />
              Export Report
            </Button>
          </div>
        }
      >
        <AdminDashboard user={user} />
      </DashboardLayout>
    </ProtectedRoute>
  );
}
          description: 'New property listed in Whitefield',
          timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
          status: 'success',
          user: 'Rajesh Kumar',
        },
        {
          id: '3',
          type: 'verification_request',
          description: 'Broker verification request submitted',
          timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
          status: 'pending',
          user: 'Priya Sharma',
        },
        {
          id: '4',
          type: 'payment',
          description: 'Commission payment processed',
          timestamp: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
          status: 'success',
          user: 'System',
        },
        {
          id: '5',
          type: 'report',
          description: 'Property reported for review',
          timestamp: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
          status: 'pending',
          user: 'Anonymous',
        },
      ];

      setStats(mockStats);
      setRecentActivity(mockActivity);
      setLoading(false);
    }, 1000);
  }, []);

  const getActivityIcon = (type: RecentActivity['type']) => {
    switch (type) {
      case 'user_registration':
        return <Users className="h-4 w-4" />;
      case 'property_listing':
        return <Home className="h-4 w-4" />;
      case 'verification_request':
        return <Shield className="h-4 w-4" />;
      case 'payment':
        return <DollarSign className="h-4 w-4" />;
      case 'report':
        return <AlertTriangle className="h-4 w-4" />;
      default:
        return <Activity className="h-4 w-4" />;
    }
  };

  const getStatusIcon = (status: RecentActivity['status']) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="h-4 w-4 text-success" />;
      case 'pending':
        return <Clock className="h-4 w-4 text-warning" />;
      case 'failed':
        return <XCircle className="h-4 w-4 text-error" />;
      default:
        return <Clock className="h-4 w-4 text-text-secondary" />;
    }
  };

  const formatRelativeTime = (timestamp: string) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffInMinutes = Math.floor(
      (now.getTime() - time.getTime()) / (1000 * 60)
    );

    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  const breadcrumbs = [{ label: 'Admin', current: true }];

  if (!isAdmin()) {
    return (
      <DashboardLayout
        breadcrumbs={breadcrumbs}
        title="Access Denied"
        description="You don't have permission to access this area"
      >
        <Card>
          <CardContent className="p-12 text-center">
            <Shield className="mx-auto mb-4 h-16 w-16 text-error" />
            <h3 className="mb-2 text-xl font-semibold text-text-primary">
              Admin Access Required
            </h3>
            <p className="mb-6 text-text-secondary">
              You need administrator privileges to access this dashboard.
            </p>
            <Link href="/dashboard">
              <Button variant="primary">Back to Dashboard</Button>
            </Link>
          </CardContent>
        </Card>
      </DashboardLayout>
    );
  }

  return (
    <ProtectedRoute>
      <DashboardLayout
        breadcrumbs={breadcrumbs}
        title="Admin Dashboard"
        description="System overview and management tools"
        actions={
          <div className="flex items-center space-x-2">
            <Link href="/admin/settings">
              <Button
                variant="outline"
                leftIcon={<Settings className="h-4 w-4" />}
              >
                Settings
              </Button>
            </Link>
            <Link href="/admin/analytics">
              <Button
                variant="primary"
                leftIcon={<BarChart3 className="h-4 w-4" />}
              >
                Analytics
              </Button>
            </Link>
          </div>
        }
      >
        {loading ? (
          <div className="flex min-h-[400px] items-center justify-center">
            <Loading size="lg" text="Loading admin dashboard..." />
          </div>
        ) : (
          <div className="space-y-8">
            {/* System Health Alert */}
            {stats?.systemHealth !== 'healthy' && (
              <Card className="border-warning bg-warning/5">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3">
                    <AlertTriangle className="h-5 w-5 text-warning" />
                    <div>
                      <p className="font-medium text-warning">
                        System Health Warning
                      </p>
                      <p className="text-sm text-text-secondary">
                        Some services are experiencing issues. Check system
                        status for details.
                      </p>
                    </div>
                    <Button variant="outline" size="sm">
                      View Details
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Key Metrics */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
              <StatCard
                title="Total Users"
                value={stats?.totalUsers.toLocaleString() || '0'}
                change={{ value: 12, type: 'increase' }}
                icon={<Users className="h-6 w-6" />}
                trend="up"
              />
              <StatCard
                title="Properties Listed"
                value={stats?.totalProperties.toLocaleString() || '0'}
                change={{ value: 8, type: 'increase' }}
                icon={<Home className="h-6 w-6" />}
                trend="up"
              />
              <StatCard
                title="Pending Verifications"
                value={stats?.pendingVerifications.toString() || '0'}
                change={{ value: 5, type: 'decrease' }}
                icon={<Shield className="h-6 w-6" />}
                trend="down"
              />
              <StatCard
                title="Monthly Revenue"
                value={`₹${(stats?.monthlyRevenue || 0).toLocaleString()}`}
                change={{ value: 15, type: 'increase' }}
                icon={<DollarSign className="h-6 w-6" />}
                trend="up"
              />
            </div>

            {/* Quick Actions */}
            <div>
              <h2 className="mb-4 text-xl font-semibold text-text-primary">
                Quick Actions
              </h2>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Link href="/admin/users">
                  <Card className="cursor-pointer transition-shadow duration-300 hover:shadow-card-hover">
                    <CardContent className="p-6 text-center">
                      <Users className="mx-auto mb-3 h-8 w-8 text-primary" />
                      <h3 className="mb-1 font-semibold text-text-primary">
                        User Management
                      </h3>
                      <p className="text-sm text-text-secondary">
                        Manage users and roles
                      </p>
                    </CardContent>
                  </Card>
                </Link>

                <Link href="/admin/properties">
                  <Card className="cursor-pointer transition-shadow duration-300 hover:shadow-card-hover">
                    <CardContent className="p-6 text-center">
                      <Home className="mx-auto mb-3 h-8 w-8 text-primary" />
                      <h3 className="mb-1 font-semibold text-text-primary">
                        Property Moderation
                      </h3>
                      <p className="text-sm text-text-secondary">
                        Review and moderate listings
                      </p>
                    </CardContent>
                  </Card>
                </Link>

                <Link href="/admin/verifications">
                  <Card className="cursor-pointer transition-shadow duration-300 hover:shadow-card-hover">
                    <CardContent className="p-6 text-center">
                      <Shield className="mx-auto mb-3 h-8 w-8 text-primary" />
                      <h3 className="mb-1 font-semibold text-text-primary">
                        Verifications
                      </h3>
                      <p className="text-sm text-text-secondary">
                        Process verification requests
                      </p>
                    </CardContent>
                  </Card>
                </Link>

                <Link href="/admin/analytics">
                  <Card className="cursor-pointer transition-shadow duration-300 hover:shadow-card-hover">
                    <CardContent className="p-6 text-center">
                      <BarChart3 className="mx-auto mb-3 h-8 w-8 text-primary" />
                      <h3 className="mb-1 font-semibold text-text-primary">
                        Analytics
                      </h3>
                      <p className="text-sm text-text-secondary">
                        View detailed reports
                      </p>
                    </CardContent>
                  </Card>
                </Link>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
              {/* Recent Activity */}
              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentActivity.map(activity => (
                      <div
                        key={activity.id}
                        className="flex items-center space-x-3"
                      >
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                          {getActivityIcon(activity.type)}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium text-text-primary">
                            {activity.description}
                          </p>
                          <div className="mt-1 flex items-center space-x-2">
                            <span className="text-xs text-text-secondary">
                              {formatRelativeTime(activity.timestamp)}
                            </span>
                            {activity.user && (
                              <span className="text-xs text-text-secondary">
                                by {activity.user}
                              </span>
                            )}
                          </div>
                        </div>
                        {getStatusIcon(activity.status)}
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 border-t border-gray-light pt-4">
                    <Link href="/admin/activity">
                      <Button variant="ghost" className="w-full">
                        View All Activity
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>

              {/* System Status */}
              <Card>
                <CardHeader>
                  <CardTitle>System Status</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Database</span>
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-success" />
                        <span className="text-sm text-success">Healthy</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">API Services</span>
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-success" />
                        <span className="text-sm text-success">
                          Operational
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">File Storage</span>
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-success" />
                        <span className="text-sm text-success">Available</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Email Service</span>
                      <div className="flex items-center space-x-2">
                        <AlertTriangle className="h-4 w-4 text-warning" />
                        <span className="text-sm text-warning">Degraded</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">
                        Payment Gateway
                      </span>
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-success" />
                        <span className="text-sm text-success">Connected</span>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 border-t border-gray-light pt-4">
                    <Link href="/admin/system-status">
                      <Button variant="ghost" className="w-full">
                        View Detailed Status
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </DashboardLayout>
    </ProtectedRoute>
  );
}
