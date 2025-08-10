'use client';

import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/layout';
import { StatCard } from '@/components/shared/StatCard';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Loading } from '@/components/ui/Loading';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { 
  BarChart3, 
  TrendingUp,
  TrendingDown,
  Users,
  Home,
  DollarSign,
  Eye,
  MessageCircle,
  Calendar,
  Download,
  RefreshCw,
  Filter
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

interface AnalyticsData {
  overview: {
    totalUsers: number;
    totalProperties: number;
    totalRevenue: number;
    totalViews: number;
    userGrowth: number;
    propertyGrowth: number;
    revenueGrowth: number;
    viewsGrowth: number;
  };
  userStats: {
    newUsers: number;
    activeUsers: number;
    retentionRate: number;
    avgSessionDuration: number;
  };
  propertyStats: {
    newListings: number;
    totalViews: number;
    avgPrice: number;
    conversionRate: number;
  };
  revenueStats: {
    monthlyRevenue: number;
    commissions: number;
    subscriptions: number;
    avgDealValue: number;
  };
}

export default function AdminAnalytics() {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('30d');
  const { isAdmin } = useAuth();

  useEffect(() => {
    loadAnalyticsData();
  }, [timeRange]);

  const loadAnalyticsData = async () => {
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      const mockData: AnalyticsData = {
        overview: {
          totalUsers: 12847,
          totalProperties: 3256,
          totalRevenue: 2450000,
          totalViews: 156789,
          userGrowth: 12.5,
          propertyGrowth: 8.3,
          revenueGrowth: 15.7,
          viewsGrowth: 22.1
        },
        userStats: {
          newUsers: 234,
          activeUsers: 1567,
          retentionRate: 68.5,
          avgSessionDuration: 12.5
        },
        propertyStats: {
          newListings: 89,
          totalViews: 45678,
          avgPrice: 2850000,
          conversionRate: 3.2
        },
        revenueStats: {
          monthlyRevenue: 125000,
          commissions: 85000,
          subscriptions: 40000,
          avgDealValue: 2500000
        }
      };

      setAnalyticsData(mockData);
      setLoading(false);
    }, 1000);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  const breadcrumbs = [
    { label: 'Admin', href: '/admin' },
    { label: 'Analytics', current: true }
  ];

  if (!isAdmin()) {
    return <div>Access Denied</div>;
  }

  return (
    <ProtectedRoute>
      <DashboardLayout
        breadcrumbs={breadcrumbs}
        title="Analytics Dashboard"
        description="Platform performance and insights"
        actions={
          <div className="flex items-center space-x-2">
            <select
              className="form-input"
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
            >
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
              <option value="90d">Last 90 days</option>
              <option value="1y">Last year</option>
            </select>
            <Button variant="outline" leftIcon={<RefreshCw className="w-4 h-4" />}>
              Refresh
            </Button>
            <Button variant="primary" leftIcon={<Download className="w-4 h-4" />}>
              Export
            </Button>
          </div>
        }
      >
        {loading ? (
          <div className="flex items-center justify-center min-h-[400px]">
            <Loading size="lg" text="Loading analytics..." />
          </div>
        ) : analyticsData ? (
          <div className="space-y-8">
            {/* Overview Stats */}
            <div>
              <h2 className="text-xl font-semibold text-text-primary mb-4">Overview</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                  title="Total Users"
                  value={formatNumber(analyticsData.overview.totalUsers)}
                  change={{ value: analyticsData.overview.userGrowth, type: 'increase' }}
                  icon={<Users className="w-6 h-6" />}
                  trend="up"
                />
                <StatCard
                  title="Total Properties"
                  value={formatNumber(analyticsData.overview.totalProperties)}
                  change={{ value: analyticsData.overview.propertyGrowth, type: 'increase' }}
                  icon={<Home className="w-6 h-6" />}
                  trend="up"
                />
                <StatCard
                  title="Total Revenue"
                  value={formatCurrency(analyticsData.overview.totalRevenue)}
                  change={{ value: analyticsData.overview.revenueGrowth, type: 'increase' }}
                  icon={<DollarSign className="w-6 h-6" />}
                  trend="up"
                />
                <StatCard
                  title="Total Views"
                  value={formatNumber(analyticsData.overview.totalViews)}
                  change={{ value: analyticsData.overview.viewsGrowth, type: 'increase' }}
                  icon={<Eye className="w-6 h-6" />}
                  trend="up"
                />
              </div>
            </div>

            {/* Detailed Analytics */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* User Analytics */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Users className="w-5 h-5 mr-2" />
                    User Analytics
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-text-secondary">New Users</span>
                      <span className="font-semibold">{analyticsData.userStats.newUsers}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-text-secondary">Active Users</span>
                      <span className="font-semibold">{analyticsData.userStats.activeUsers.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-text-secondary">Retention Rate</span>
                      <span className="font-semibold text-success">{analyticsData.userStats.retentionRate}%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-text-secondary">Avg Session</span>
                      <span className="font-semibold">{analyticsData.userStats.avgSessionDuration}m</span>
                    </div>
                  </div>
                  
                  {/* Mock Chart */}
                  <div className="mt-6 h-32 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-lg flex items-end justify-center">
                    <div className="text-sm text-text-secondary">User Growth Chart</div>
                  </div>
                </CardContent>
              </Card>

              {/* Property Analytics */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Home className="w-5 h-5 mr-2" />
                    Property Analytics
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-text-secondary">New Listings</span>
                      <span className="font-semibold">{analyticsData.propertyStats.newListings}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-text-secondary">Total Views</span>
                      <span className="font-semibold">{formatNumber(analyticsData.propertyStats.totalViews)}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-text-secondary">Avg Price</span>
                      <span className="font-semibold">{formatCurrency(analyticsData.propertyStats.avgPrice)}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-text-secondary">Conversion Rate</span>
                      <span className="font-semibold text-primary">{analyticsData.propertyStats.conversionRate}%</span>
                    </div>
                  </div>
                  
                  {/* Mock Chart */}
                  <div className="mt-6 h-32 bg-gradient-to-r from-success/20 to-primary/20 rounded-lg flex items-end justify-center">
                    <div className="text-sm text-text-secondary">Property Views Chart</div>
                  </div>
                </CardContent>
              </Card>

              {/* Revenue Analytics */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <DollarSign className="w-5 h-5 mr-2" />
                    Revenue Analytics
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-text-secondary">Monthly Revenue</span>
                      <span className="font-semibold">{formatCurrency(analyticsData.revenueStats.monthlyRevenue)}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-text-secondary">Commissions</span>
                      <span className="font-semibold">{formatCurrency(analyticsData.revenueStats.commissions)}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-text-secondary">Subscriptions</span>
                      <span className="font-semibold">{formatCurrency(analyticsData.revenueStats.subscriptions)}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-text-secondary">Avg Deal Value</span>
                      <span className="font-semibold text-success">{formatCurrency(analyticsData.revenueStats.avgDealValue)}</span>
                    </div>

                  {/* Mock Chart */}
                  <div className="mt-6 h-32 bg-gradient-to-r from-warning/20 to-success/20 rounded-lg flex items-end justify-center">
                    <div className="text-sm text-text-secondary">Revenue Chart</div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-text-secondary">No analytics data available</p>
          </div>
        )}
      </DashboardLayout>
    </ProtectedRoute>
  );
}
