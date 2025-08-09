'use client';

import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/layout';
import { StatCard } from '@/components/shared/StatCard';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Loading } from '@/components/ui/Loading';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { 
  Home,
  TrendingUp,
  Eye,
  MessageCircle,
  DollarSign,
  Calendar,
  Users,
  MapPin,
  Plus,
  Filter,
  Download,
  BarChart3,
  Activity,
  Clock,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import Link from 'next/link';

interface PropertyDashboardData {
  overview: {
    totalProperties: number;
    activeListings: number;
    totalViews: number;
    totalInquiries: number;
    averagePrice: number;
    totalRevenue: number;
  };
  recentActivity: {
    id: string;
    type: 'view' | 'inquiry' | 'listing' | 'sale';
    description: string;
    timestamp: string;
    propertyTitle?: string;
    amount?: number;
  }[];
  topPerformingProperties: {
    id: string;
    title: string;
    views: number;
    inquiries: number;
    price: number;
    image: string;
  }[];
  monthlyStats: {
    month: string;
    listings: number;
    views: number;
    inquiries: number;
    sales: number;
  }[];
}

export default function PropertyDashboard() {
  const [dashboardData, setDashboardData] = useState<PropertyDashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('30d');
  const { user, isBroker } = useAuth();

  useEffect(() => {
    loadDashboardData();
  }, [timeRange]);

  const loadDashboardData = async () => {
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      const mockData: PropertyDashboardData = {
        overview: {
          totalProperties: 15,
          activeListings: 12,
          totalViews: 2456,
          totalInquiries: 89,
          averagePrice: 3200000,
          totalRevenue: 450000,
        },
        recentActivity: [
          {
            id: '1',
            type: 'inquiry',
            description: 'New inquiry for Premium Villa in HSR Layout',
            timestamp: '2024-01-20T14:30:00Z',
            propertyTitle: 'Premium Villa in HSR Layout'
          },
          {
            id: '2',
            type: 'view',
            description: '15 new views on Commercial Plot in Electronic City',
            timestamp: '2024-01-20T12:15:00Z',
            propertyTitle: 'Commercial Plot in Electronic City'
          },
          {
            id: '3',
            type: 'sale',
            description: 'Property sold successfully',
            timestamp: '2024-01-19T16:45:00Z',
            propertyTitle: 'Residential Plot in Whitefield',
            amount: 2500000
          },
          {
            id: '4',
            type: 'listing',
            description: 'New property listed',
            timestamp: '2024-01-19T10:20:00Z',
            propertyTitle: 'Luxury Apartment in Koramangala'
          }
        ],
        topPerformingProperties: [
          {
            id: '1',
            title: 'Premium Villa in HSR Layout',
            views: 234,
            inquiries: 18,
            price: 8500000,
            image: '/api/placeholder/100/80'
          },
          {
            id: '2',
            title: 'Commercial Plot in Electronic City',
            views: 189,
            inquiries: 12,
            price: 5000000,
            image: '/api/placeholder/100/80'
          },
          {
            id: '3',
            title: 'Residential Plot in Whitefield',
            views: 156,
            inquiries: 9,
            price: 2500000,
            image: '/api/placeholder/100/80'
          }
        ],
        monthlyStats: [
          { month: 'Oct', listings: 3, views: 456, inquiries: 23, sales: 1 },
          { month: 'Nov', listings: 5, views: 789, inquiries: 34, sales: 2 },
          { month: 'Dec', listings: 4, views: 623, inquiries: 28, sales: 1 },
          { month: 'Jan', listings: 3, views: 588, inquiries: 24, sales: 1 }
        ]
      };

      setDashboardData(mockData);
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

  const formatRelativeTime = (timestamp: string) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffInMinutes = Math.floor((now.getTime() - time.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'view':
        return <Eye className="w-4 h-4 text-blue-500" />;
      case 'inquiry':
        return <MessageCircle className="w-4 h-4 text-green-500" />;
      case 'listing':
        return <Home className="w-4 h-4 text-primary" />;
      case 'sale':
        return <DollarSign className="w-4 h-4 text-success" />;
      default:
        return <Activity className="w-4 h-4 text-text-secondary" />;
    }
  };

  const breadcrumbs = [
    { label: 'Properties', href: '/properties' },
    { label: 'Dashboard', current: true }
  ];

  if (!isBroker()) {
    return (
      <DashboardLayout
        breadcrumbs={breadcrumbs}
        title="Access Denied"
        description="Only brokers can access the property dashboard"
      >
        <div className="text-center py-12">
          <h3 className="text-xl font-semibold text-text-primary mb-2">
            Access Restricted
          </h3>
          <p className="text-text-secondary">
            You need to be a verified broker to access the property dashboard.
          </p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <ProtectedRoute>
      <DashboardLayout
        breadcrumbs={breadcrumbs}
        title="Property Dashboard"
        description="Monitor your property performance and analytics"
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
            <Button variant="outline" leftIcon={<Download className="w-4 h-4" />}>
              Export
            </Button>
            <Link href="/properties/add">
              <Button variant="primary" leftIcon={<Plus className="w-4 h-4" />}>
                Add Property
              </Button>
            </Link>
          </div>
        }
      >
        {loading ? (
          <div className="flex items-center justify-center min-h-[400px]">
            <Loading size="lg" text="Loading dashboard..." />
          </div>
        ) : dashboardData ? (
          <div className="space-y-8">
            {/* Overview Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <StatCard
                title="Total Properties"
                value={dashboardData.overview.totalProperties.toString()}
                change={{ value: 12, type: 'increase' }}
                icon={<Home className="w-6 h-6" />}
                trend="up"
              />
              <StatCard
                title="Active Listings"
                value={dashboardData.overview.activeListings.toString()}
                change={{ value: 8, type: 'increase' }}
                icon={<CheckCircle className="w-6 h-6" />}
                trend="up"
              />
              <StatCard
                title="Total Views"
                value={dashboardData.overview.totalViews.toLocaleString()}
                change={{ value: 15, type: 'increase' }}
                icon={<Eye className="w-6 h-6" />}
                trend="up"
              />
              <StatCard
                title="Total Inquiries"
                value={dashboardData.overview.totalInquiries.toString()}
                change={{ value: 22, type: 'increase' }}
                icon={<MessageCircle className="w-6 h-6" />}
                trend="up"
              />
              <StatCard
                title="Average Price"
                value={formatCurrency(dashboardData.overview.averagePrice)}
                change={{ value: 5, type: 'increase' }}
                icon={<DollarSign className="w-6 h-6" />}
                trend="up"
              />
              <StatCard
                title="Total Revenue"
                value={formatCurrency(dashboardData.overview.totalRevenue)}
                change={{ value: 18, type: 'increase' }}
                icon={<TrendingUp className="w-6 h-6" />}
                trend="up"
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Recent Activity */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Activity className="w-5 h-5 mr-2" />
                    Recent Activity
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {dashboardData.recentActivity.map((activity) => (
                      <div key={activity.id} className="flex items-start space-x-3">
                        <div className="w-8 h-8 bg-gray-light rounded-lg flex items-center justify-center">
                          {getActivityIcon(activity.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-text-primary">
                            {activity.description}
                          </p>
                          {activity.propertyTitle && (
                            <p className="text-xs text-text-secondary">
                              {activity.propertyTitle}
                            </p>
                          )}
                          <p className="text-xs text-text-secondary">
                            {formatRelativeTime(activity.timestamp)}
                          </p>
                        </div>
                        {activity.amount && (
                          <span className="text-sm font-semibold text-success">
                            {formatCurrency(activity.amount)}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 pt-4 border-t border-gray-light">
                    <Link href="/properties/activity">
                      <Button variant="ghost" className="w-full">
                        View All Activity
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>

              {/* Top Performing Properties */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <TrendingUp className="w-5 h-5 mr-2" />
                    Top Performing Properties
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {dashboardData.topPerformingProperties.map((property, index) => (
                      <div key={property.id} className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                          <span className="text-white text-sm font-bold">{index + 1}</span>
                        </div>
                        <div className="w-16 h-12 bg-gray-light rounded overflow-hidden">
                          <img
                            src={property.image}
                            alt={property.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-text-primary line-clamp-1">
                            {property.title}
                          </p>
                          <div className="flex items-center space-x-4 text-xs text-text-secondary">
                            <span>{property.views} views</span>
                            <span>{property.inquiries} inquiries</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-semibold text-primary">
                            {formatCurrency(property.price)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 pt-4 border-t border-gray-light">
                    <Link href="/properties/my-listings">
                      <Button variant="ghost" className="w-full">
                        View All Properties
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Monthly Performance Chart */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BarChart3 className="w-5 h-5 mr-2" />
                  Monthly Performance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <BarChart3 className="w-12 h-12 text-text-secondary mx-auto mb-2" />
                    <p className="text-text-secondary">Performance Chart</p>
                    <p className="text-xs text-text-secondary">Chart visualization would be implemented here</p>
                  </div>
                </div>
                <div className="mt-4 grid grid-cols-4 gap-4">
                  {dashboardData.monthlyStats.map((stat) => (
                    <div key={stat.month} className="text-center">
                      <p className="text-sm font-medium text-text-primary">{stat.month}</p>
                      <div className="space-y-1 mt-2">
                        <p className="text-xs text-text-secondary">{stat.listings} listings</p>
                        <p className="text-xs text-text-secondary">{stat.views} views</p>
                        <p className="text-xs text-text-secondary">{stat.inquiries} inquiries</p>
                        <p className="text-xs text-success">{stat.sales} sales</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <Link href="/properties/add">
                    <Card className="hover:shadow-card-hover transition-shadow duration-300 cursor-pointer">
                      <CardContent className="p-6 text-center">
                        <Plus className="w-8 h-8 text-primary mx-auto mb-3" />
                        <h3 className="font-semibold text-text-primary mb-1">Add Property</h3>
                        <p className="text-sm text-text-secondary">List a new property</p>
                      </CardContent>
                    </Card>
                  </Link>

                  <Link href="/properties/my-listings">
                    <Card className="hover:shadow-card-hover transition-shadow duration-300 cursor-pointer">
                      <CardContent className="p-6 text-center">
                        <Home className="w-8 h-8 text-primary mx-auto mb-3" />
                        <h3 className="font-semibold text-text-primary mb-1">My Listings</h3>
                        <p className="text-sm text-text-secondary">Manage your properties</p>
                      </CardContent>
                    </Card>
                  </Link>

                  <Link href="/chat">
                    <Card className="hover:shadow-card-hover transition-shadow duration-300 cursor-pointer">
                      <CardContent className="p-6 text-center">
                        <MessageCircle className="w-8 h-8 text-primary mx-auto mb-3" />
                        <h3 className="font-semibold text-text-primary mb-1">Messages</h3>
                        <p className="text-sm text-text-secondary">Check inquiries</p>
                      </CardContent>
                    </Card>
                  </Link>

                  <Link href="/commissions">
                    <Card className="hover:shadow-card-hover transition-shadow duration-300 cursor-pointer">
                      <CardContent className="p-6 text-center">
                        <DollarSign className="w-8 h-8 text-primary mx-auto mb-3" />
                        <h3 className="font-semibold text-text-primary mb-1">Commissions</h3>
                        <p className="text-sm text-text-secondary">Track earnings</p>
                      </CardContent>
                    </Card>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        ) : null}
      </DashboardLayout>
    </ProtectedRoute>
  );
}
