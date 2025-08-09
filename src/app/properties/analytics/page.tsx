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
  Eye,
  MessageCircle,
  DollarSign,
  Home,
  Users,
  MapPin,
  Calendar,
  Download,
  RefreshCw,
  Target,
  Clock,
  Star,
  Activity
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

interface PropertyAnalytics {
  overview: {
    totalViews: number;
    totalInquiries: number;
    conversionRate: number;
    averageTimeOnListing: number;
    totalRevenue: number;
    averagePrice: number;
  };
  performance: {
    topPerformingProperty: {
      id: string;
      title: string;
      views: number;
      inquiries: number;
      conversionRate: number;
    };
    viewsTrend: { period: string; views: number; inquiries: number }[];
    locationPerformance: { location: string; properties: number; avgViews: number; avgPrice: number }[];
  };
  insights: {
    bestPerformingType: string;
    peakViewingHours: string;
    averageDaysToSell: number;
    mostInquiredAmenities: string[];
    priceRangePerformance: { range: string; properties: number; avgViews: number }[];
  };
}

export default function PropertyAnalyticsPage() {
  const [analytics, setAnalytics] = useState<PropertyAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('30d');
  const { user, isBroker } = useAuth();

  useEffect(() => {
    loadAnalytics();
  }, [timeRange]);

  const loadAnalytics = async () => {
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      const mockAnalytics: PropertyAnalytics = {
        overview: {
          totalViews: 12456,
          totalInquiries: 234,
          conversionRate: 1.88,
          averageTimeOnListing: 45,
          totalRevenue: 2450000,
          averagePrice: 3200000,
        },
        performance: {
          topPerformingProperty: {
            id: '1',
            title: 'Premium Villa in HSR Layout',
            views: 1234,
            inquiries: 45,
            conversionRate: 3.65,
          },
          viewsTrend: [
            { period: 'Week 1', views: 2800, inquiries: 52 },
            { period: 'Week 2', views: 3200, inquiries: 61 },
            { period: 'Week 3', views: 2950, inquiries: 58 },
            { period: 'Week 4', views: 3506, inquiries: 63 },
          ],
          locationPerformance: [
            { location: 'Whitefield', properties: 5, avgViews: 890, avgPrice: 2800000 },
            { location: 'HSR Layout', properties: 3, avgViews: 1200, avgPrice: 4500000 },
            { location: 'Electronic City', properties: 4, avgViews: 750, avgPrice: 3200000 },
            { location: 'Koramangala', properties: 2, avgViews: 1100, avgPrice: 5200000 },
          ],
        },
        insights: {
          bestPerformingType: 'Villa',
          peakViewingHours: '6 PM - 9 PM',
          averageDaysToSell: 45,
          mostInquiredAmenities: ['Swimming Pool', 'Security', 'Parking', 'Garden'],
          priceRangePerformance: [
            { range: '₹20L - ₹50L', properties: 6, avgViews: 650 },
            { range: '₹50L - ₹1Cr', properties: 5, avgViews: 890 },
            { range: '₹1Cr - ₹2Cr', properties: 3, avgViews: 1200 },
            { range: 'Above ₹2Cr', properties: 1, avgViews: 1500 },
          ],
        },
      };

      setAnalytics(mockAnalytics);
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

  const breadcrumbs = [
    { label: 'Properties', href: '/properties' },
    { label: 'Analytics', current: true }
  ];

  if (!isBroker()) {
    return (
      <DashboardLayout
        breadcrumbs={breadcrumbs}
        title="Access Denied"
        description="Only brokers can access property analytics"
      >
        <div className="text-center py-12">
          <h3 className="text-xl font-semibold text-text-primary mb-2">
            Access Restricted
          </h3>
          <p className="text-text-secondary">
            You need to be a verified broker to access property analytics.
          </p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <ProtectedRoute>
      <DashboardLayout
        breadcrumbs={breadcrumbs}
        title="Property Analytics"
        description="Detailed insights into your property performance"
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
              Export Report
            </Button>
          </div>
        }
      >
        {loading ? (
          <div className="flex items-center justify-center min-h-[400px]">
            <Loading size="lg" text="Loading analytics..." />
          </div>
        ) : analytics ? (
          <div className="space-y-8">
            {/* Overview Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <StatCard
                title="Total Views"
                value={analytics.overview.totalViews.toLocaleString()}
                change={{ value: 15, type: 'increase' }}
                icon={<Eye className="w-6 h-6" />}
                trend="up"
              />
              <StatCard
                title="Total Inquiries"
                value={analytics.overview.totalInquiries.toString()}
                change={{ value: 22, type: 'increase' }}
                icon={<MessageCircle className="w-6 h-6" />}
                trend="up"
              />
              <StatCard
                title="Conversion Rate"
                value={`${analytics.overview.conversionRate}%`}
                change={{ value: 0.3, type: 'increase' }}
                icon={<Target className="w-6 h-6" />}
                trend="up"
              />
              <StatCard
                title="Avg. Time on Listing"
                value={`${analytics.overview.averageTimeOnListing} days`}
                change={{ value: 5, type: 'decrease' }}
                icon={<Clock className="w-6 h-6" />}
                trend="down"
              />
              <StatCard
                title="Total Revenue"
                value={formatCurrency(analytics.overview.totalRevenue)}
                change={{ value: 18, type: 'increase' }}
                icon={<DollarSign className="w-6 h-6" />}
                trend="up"
              />
              <StatCard
                title="Average Price"
                value={formatCurrency(analytics.overview.averagePrice)}
                change={{ value: 8, type: 'increase' }}
                icon={<Home className="w-6 h-6" />}
                trend="up"
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Top Performing Property */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Star className="w-5 h-5 mr-2" />
                    Top Performing Property
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-semibold text-text-primary">
                        {analytics.performance.topPerformingProperty.title}
                      </h3>
                      <p className="text-sm text-text-secondary">
                        Property ID: {analytics.performance.topPerformingProperty.id}
                      </p>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-4">
                      <div className="text-center">
                        <p className="text-2xl font-bold text-primary">
                          {analytics.performance.topPerformingProperty.views.toLocaleString()}
                        </p>
                        <p className="text-xs text-text-secondary">Views</p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold text-success">
                          {analytics.performance.topPerformingProperty.inquiries}
                        </p>
                        <p className="text-xs text-text-secondary">Inquiries</p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold text-warning">
                          {analytics.performance.topPerformingProperty.conversionRate}%
                        </p>
                        <p className="text-xs text-text-secondary">Conversion</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Views Trend */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <TrendingUp className="w-5 h-5 mr-2" />
                    Views & Inquiries Trend
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-lg flex items-center justify-center">
                    <div className="text-center">
                      <BarChart3 className="w-12 h-12 text-text-secondary mx-auto mb-2" />
                      <p className="text-text-secondary">Trend Chart</p>
                      <p className="text-xs text-text-secondary">Chart visualization would be implemented here</p>
                    </div>
                  </div>
                  <div className="mt-4 grid grid-cols-4 gap-2">
                    {analytics.performance.viewsTrend.map((data, index) => (
                      <div key={index} className="text-center">
                        <p className="text-xs font-medium text-text-primary">{data.period}</p>
                        <p className="text-xs text-primary">{data.views} views</p>
                        <p className="text-xs text-success">{data.inquiries} inquiries</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Location Performance */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MapPin className="w-5 h-5 mr-2" />
                  Location Performance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-light">
                        <th className="text-left py-3 font-medium">Location</th>
                        <th className="text-left py-3 font-medium">Properties</th>
                        <th className="text-left py-3 font-medium">Avg. Views</th>
                        <th className="text-left py-3 font-medium">Avg. Price</th>
                        <th className="text-left py-3 font-medium">Performance</th>
                      </tr>
                    </thead>
                    <tbody>
                      {analytics.performance.locationPerformance.map((location, index) => (
                        <tr key={index} className="border-b border-gray-light">
                          <td className="py-3 font-medium">{location.location}</td>
                          <td className="py-3">{location.properties}</td>
                          <td className="py-3">{location.avgViews.toLocaleString()}</td>
                          <td className="py-3">{formatCurrency(location.avgPrice)}</td>
                          <td className="py-3">
                            <div className="w-full bg-gray-light rounded-full h-2">
                              <div 
                                className="bg-primary h-2 rounded-full" 
                                style={{ width: `${Math.min((location.avgViews / 1500) * 100, 100)}%` }}
                              ></div>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

            {/* Insights */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Activity className="w-5 h-5 mr-2" />
                    Key Insights
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-gray-light rounded-lg">
                      <span className="text-sm font-medium">Best Performing Type</span>
                      <span className="text-sm text-primary font-semibold">
                        {analytics.insights.bestPerformingType}
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 bg-gray-light rounded-lg">
                      <span className="text-sm font-medium">Peak Viewing Hours</span>
                      <span className="text-sm text-success font-semibold">
                        {analytics.insights.peakViewingHours}
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 bg-gray-light rounded-lg">
                      <span className="text-sm font-medium">Avg. Days to Sell</span>
                      <span className="text-sm text-warning font-semibold">
                        {analytics.insights.averageDaysToSell} days
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Most Inquired Amenities</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {analytics.insights.mostInquiredAmenities.map((amenity, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <span className="text-sm font-medium">{amenity}</span>
                        <div className="flex items-center space-x-2">
                          <div className="w-24 bg-gray-light rounded-full h-2">
                            <div 
                              className="bg-primary h-2 rounded-full" 
                              style={{ width: `${100 - (index * 20)}%` }}
                            ></div>
                          </div>
                          <span className="text-xs text-text-secondary">
                            {100 - (index * 20)}%
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Price Range Performance */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <DollarSign className="w-5 h-5 mr-2" />
                  Price Range Performance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {analytics.insights.priceRangePerformance.map((range, index) => (
                    <div key={index} className="p-4 border border-gray-light rounded-lg">
                      <h4 className="font-semibold text-text-primary mb-2">{range.range}</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-text-secondary">Properties</span>
                          <span className="font-medium">{range.properties}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-text-secondary">Avg. Views</span>
                          <span className="font-medium">{range.avgViews}</span>
                        </div>
                        <div className="w-full bg-gray-light rounded-full h-2">
                          <div 
                            className="bg-primary h-2 rounded-full" 
                            style={{ width: `${(range.avgViews / 1500) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        ) : null}
      </DashboardLayout>
    </ProtectedRoute>
  );
}
