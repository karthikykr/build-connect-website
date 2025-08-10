'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Loading } from '@/components/ui/Loading';
import {
  Users,
  Home,
  Shield,
  TrendingUp,
  DollarSign,
  Eye,
  Star,
  MessageSquare,
  FileText,
  Clock,
  CheckCircle,
  AlertTriangle,
  BarChart3,
  Activity,
  UserCheck,
  Building,
  Hammer,
  Briefcase,
  Settings,
  Download,
  RefreshCw,
} from 'lucide-react';
import { adminService, DashboardAnalytics } from '@/services/admin.service';
import { formatCurrency, formatRelativeTime } from '@/lib/utils';
import Link from 'next/link';
import toast from 'react-hot-toast';

interface AdminDashboardProps {
  user: any;
}

export function AdminDashboard({ user }: AdminDashboardProps) {
  const [dashboardData, setDashboardData] = useState<DashboardAnalytics | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setIsLoading(true);
      const [
        statsResponse,
        revenueResponse,
        userGrowthResponse,
        transactionResponse,
      ] = await Promise.all([
        adminService.getDashboardStats(),
        adminService.getRevenueAnalytics(),
        adminService.getUserGrowthMetrics(),
        adminService.getTransactionAnalytics(),
      ]);

      if (
        statsResponse.success &&
        revenueResponse.success &&
        userGrowthResponse.success &&
        transactionResponse.success
      ) {
        setDashboardData({
          stats: statsResponse.data,
          revenue: revenueResponse.data,
          userGrowth: userGrowthResponse.data,
          transactions: transactionResponse.data,
        });
      }
    } catch (error) {
      console.error('Error loading dashboard data:', error);
      // Show error state instead of mock data
      toast.error(
        'Failed to load dashboard data. Please check your connection and try again.'
      );
      setDashboardData(null);
      // Optionally use fallback data for development
      if (process.env.NODE_ENV === 'development') {
        setDashboardData({
          stats: {
            totalUsers: 12450,
            activeUsers: 8920,
            totalBrokers: 340,
            verifiedBrokers: 280,
            totalContractors: 890,
            verifiedContractors: 720,
            totalSites: 5680,
            activeSites: 3240,
            totalProjects: 2150,
            activeProjects: 890,
            pendingVerifications: 45,
            totalRevenue: 15600000,
            monthlyRevenue: 2850000,
            systemHealth: 'healthy',
          },
          revenue: {
            totalRevenue: 15600000,
            monthlyRevenue: 2850000,
            yearlyRevenue: 34200000,
            revenueGrowth: 15.2,
            revenueByCategory: [
              { category: 'Site Listings', amount: 8500000, percentage: 54.5 },
              {
                category: 'Project Management',
                amount: 4200000,
                percentage: 26.9,
              },
              {
                category: 'Professional Services',
                amount: 2900000,
                percentage: 18.6,
              },
            ],
            monthlyRevenueData: [],
          },
          userGrowth: {
            totalUsers: 12450,
            newUsersThisMonth: 890,
            userGrowthRate: 12.5,
            activeUsersRate: 71.6,
            usersByRole: [
              { role: 'site_owner', count: 8920, percentage: 71.6 },
              { role: 'contractor', count: 2340, percentage: 18.8 },
              { role: 'broker', count: 1190, percentage: 9.6 },
            ],
            monthlyUserGrowth: [],
          },
          transactions: {
            totalTransactions: 8450,
            successfulTransactions: 8120,
            failedTransactions: 330,
            pendingTransactions: 45,
            totalTransactionValue: 15600000,
            averageTransactionValue: 1846,
            transactionGrowthRate: 18.3,
            transactionsByType: [],
            monthlyTransactionData: [],
          },
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await loadDashboardData();
    setIsRefreshing(false);
  };

  if (isLoading) {
    return <Loading />;
  }

  if (!dashboardData) {
    return (
      <div className="py-12 text-center">
        <AlertTriangle className="text-gray-400 mx-auto mb-4 h-16 w-16" />
        <h3 className="text-gray-900 mb-2 text-lg font-semibold">
          Failed to Load Dashboard
        </h3>
        <p className="text-gray-600 mb-6">
          Unable to load dashboard data. Please try again.
        </p>
        <Button onClick={loadDashboardData}>Retry</Button>
      </div>
    );
  }

  const { stats, revenue, userGrowth, transactions } = dashboardData;

  const statCards = [
    {
      title: 'Total Users',
      value: stats.totalUsers.toLocaleString(),
      subtitle: `${userGrowth.newUsersThisMonth?.toLocaleString?.() || userGrowth.newUsersThisMonth} new this month`,
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      trend: userGrowth.userGrowthRate,
    },
    {
      title: 'Total Revenue',
      value: formatCurrency(stats.totalRevenue),
      subtitle: `${formatCurrency(revenue.monthlyRevenue)} this month`,
      icon: DollarSign,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      trend: revenue.revenueGrowth,
    },
    {
      title: 'Pending Verifications',
      value: stats.pendingVerifications,
      subtitle: 'Require attention',
      icon: Shield,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      trend: -8.2,
    },
    {
      title: 'Total Projects',
      value: (stats.totalProjects ?? 0).toLocaleString(),
      subtitle: `${stats.totalSites?.toLocaleString?.() || stats.totalSites || 0} sites`,
      icon: Briefcase,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      trend: 12.8,
    },
  ];

  const quickActions = [
    {
      title: 'User Management',
      description: 'Manage users, roles, and permissions',
      icon: Users,
      href: '/admin/users',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      title: 'Verifications',
      description: 'Review broker and contractor applications',
      icon: Shield,
      href: '/admin/verifications',
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      badge:
        stats.pendingVerifications > 0 ? stats.pendingVerifications : undefined,
    },
    {
      title: 'Properties',
      description: 'Manage site listings and properties',
      icon: Home,
      href: '/admin/properties',
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      title: 'Analytics',
      description: 'View detailed platform analytics',
      icon: BarChart3,
      href: '/admin/analytics',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
    {
      title: 'Transactions',
      description: 'Monitor payments and transactions',
      icon: DollarSign,
      href: '/admin/transactions',
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50',
    },
    {
      title: 'System Settings',
      description: 'Configure platform settings',
      icon: Settings,
      href: '/admin/settings',
      color: 'text-gray-600',
      bgColor: 'bg-gray-50',
    },
  ];

  const recentActivities = [
    {
      id: '1',
      type: 'verification',
      description: 'New contractor application submitted',
      user: 'Rajesh Kumar',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      status: 'pending',
    },
    {
      id: '2',
      type: 'user',
      description: 'New user registration',
      user: 'Priya Sharma',
      timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
      status: 'success',
    },
    {
      id: '3',
      type: 'property',
      description: 'New site listing created',
      user: 'Amit Patel',
      timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
      status: 'success',
    },
    {
      id: '4',
      type: 'transaction',
      description: 'Payment processed successfully',
      user: 'Tech Solutions Pvt Ltd',
      timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
      status: 'success',
    },
  ];

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'verification':
        return Shield;
      case 'user':
        return Users;
      case 'property':
        return Home;
      case 'transaction':
        return DollarSign;
      default:
        return Activity;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success':
        return 'text-green-600 bg-green-50';
      case 'pending':
        return 'text-yellow-600 bg-yellow-50';
      case 'failed':
        return 'text-red-600 bg-red-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <div className="space-y-6">
      {/* System Health Banner */}
      <Card
        className={`border-2 ${stats.systemHealth === 'healthy' ? 'border-green-200 bg-green-50' : 'border-yellow-200 bg-yellow-50'}`}
      >
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-full ${stats.systemHealth === 'healthy' ? 'bg-green-100' : 'bg-yellow-100'}`}
              >
                {stats.systemHealth === 'healthy' ? (
                  <CheckCircle className="h-4 w-4 text-green-600" />
                ) : (
                  <AlertTriangle className="h-4 w-4 text-yellow-600" />
                )}
              </div>
              <div>
                <h3
                  className={`font-medium ${stats.systemHealth === 'healthy' ? 'text-green-900' : 'text-yellow-900'}`}
                >
                  System Status:{' '}
                  {stats.systemHealth === 'healthy'
                    ? 'All Systems Operational'
                    : 'Minor Issues Detected'}
                </h3>
                <p
                  className={`text-sm ${stats.systemHealth === 'healthy' ? 'text-green-800' : 'text-yellow-800'}`}
                >
                  Platform is running smoothly with no critical issues
                </p>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              disabled={isRefreshing}
            >
              <RefreshCw
                className={`mr-2 h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`}
              />
              Refresh
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat, index) => {
          const IconComponent = stat.icon;
          return (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm font-medium">
                      {stat.title}
                    </p>
                    <p className="text-gray-900 text-2xl font-bold">
                      {stat.value}
                    </p>
                    <p className="text-gray-500 text-xs">{stat.subtitle}</p>
                  </div>
                  <div className={`rounded-full p-3 ${stat.bgColor}`}>
                    <IconComponent className={`h-6 w-6 ${stat.color}`} />
                  </div>
                </div>
                <div className="mt-4 flex items-center">
                  <TrendingUp
                    className={`mr-1 h-4 w-4 ${stat.trend > 0 ? 'text-green-600' : 'text-red-600'}`}
                  />
                  <span
                    className={`text-sm font-medium ${stat.trend > 0 ? 'text-green-600' : 'text-red-600'}`}
                  >
                    {stat.trend > 0 ? '+' : ''}
                    {stat.trend}%
                  </span>
                  <span className="text-gray-500 ml-1 text-sm">
                    vs last month
                  </span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {quickActions.map((action, index) => {
              const IconComponent = action.icon;
              return (
                <Link key={index} href={action.href}>
                  <div className="border-gray-200 relative cursor-pointer rounded-lg border p-4 transition-shadow hover:shadow-md">
                    <div
                      className={`h-10 w-10 rounded-full ${action.bgColor} mb-3 flex items-center justify-center`}
                    >
                      <IconComponent className={`h-5 w-5 ${action.color}`} />
                    </div>
                    <h3 className="text-gray-900 mb-1 font-medium">
                      {action.title}
                    </h3>
                    <p className="text-gray-600 text-sm">
                      {action.description}
                    </p>
                    {action.badge && (
                      <div className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-xs text-white">
                        {action.badge}
                      </div>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Platform Overview */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Platform Metrics
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-600 text-sm">User Growth Rate</span>
              <span className="font-medium">{userGrowth.userGrowthRate}%</span>
            </div>
            <div className="bg-gray-200 h-2 w-full rounded-full">
              <div
                className="h-2 rounded-full bg-blue-600"
                style={{ width: `${userGrowth.userGrowthRate}%` }}
              ></div>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-gray-600 text-sm">Revenue Growth</span>
              <span className="font-medium">{revenue.revenueGrowth}%</span>
            </div>
            <div className="bg-gray-200 h-2 w-full rounded-full">
              <div
                className="h-2 rounded-full bg-green-600"
                style={{ width: `${revenue.revenueGrowth}%` }}
              ></div>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-gray-600 text-sm">
                Transaction Success Rate
              </span>
              <span className="font-medium">
                {(
                  (transactions.successfulTransactions /
                    transactions.totalTransactions) *
                  100
                ).toFixed(1)}
                %
              </span>
            </div>
            <div className="bg-gray-200 h-2 w-full rounded-full">
              <div
                className="bg-purple-600 h-2 rounded-full"
                style={{
                  width: `${(transactions.successfulTransactions / transactions.totalTransactions) * 100}%`,
                }}
              ></div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.map(activity => {
                const ActivityIcon = getActivityIcon(activity.type);
                return (
                  <div key={activity.id} className="flex items-start gap-3">
                    <div
                      className={`flex h-8 w-8 items-center justify-center rounded-full ${getStatusColor(activity.status)}`}
                    >
                      <ActivityIcon className="h-4 w-4" />
                    </div>
                    <div className="flex-1">
                      <p className="text-gray-900 text-sm font-medium">
                        {activity.description}
                      </p>
                      <p className="text-gray-500 text-xs">
                        by {activity.user} •{' '}
                        {formatRelativeTime(activity.timestamp)}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
