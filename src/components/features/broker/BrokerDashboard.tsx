'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Loading } from '@/components/ui/Loading';
import {
  Home,
  Users,
  Calendar,
  MessageSquare,
  TrendingUp,
  DollarSign,
  Eye,
  Star,
  Phone,
  Mail,
  FileText,
  Clock,
  CheckCircle,
  AlertTriangle,
  BarChart3,
  PieChart,
  Activity,
  Target,
  MapPin,
  Award,
} from 'lucide-react';
import { brokersService, BrokerProfile, BrokerStats } from '@/services/brokers.service';
import { formatCurrency, formatRelativeTime } from '@/lib/utils';
import Link from 'next/link';

interface BrokerDashboardProps {
  user: any;
}

export function BrokerDashboard({ user }: BrokerDashboardProps) {
  const [brokerProfile, setBrokerProfile] = useState<BrokerProfile | null>(null);
  const [brokerStats, setBrokerStats] = useState<BrokerStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadBrokerData();
  }, []);

  const loadBrokerData = async () => {
    try {
      setIsLoading(true);
      const [profileResponse, statsResponse] = await Promise.all([
        brokersService.getBrokerApplication(),
        brokersService.getBrokerStats(),
      ]);

      if (profileResponse.success && profileResponse.data) {
        setBrokerProfile(profileResponse.data);
      }

      if (statsResponse.success && statsResponse.data) {
        setBrokerStats(statsResponse.data);
      }
    } catch (error) {
      console.error('Error loading broker data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <Loading />;
  }

  const mockStats = {
    totalProperties: 24,
    activeListings: 18,
    propertiesSold: 6,
    totalRevenue: 2850000,
    averageRating: 4.8,
    totalReviews: 156,
    responseTime: '2 hours',
    successRate: 85,
    monthlyStats: [
      { month: 'Jan', properties: 3, sales: 2, revenue: 450000 },
      { month: 'Feb', properties: 4, sales: 1, revenue: 320000 },
      { month: 'Mar', properties: 5, sales: 3, revenue: 680000 },
    ]
  };

  const stats = brokerStats || mockStats;

  const statCards = [
    {
      title: 'Total Properties',
      value: stats.totalProperties,
      subtitle: `${stats.activeListings} active`,
      icon: Home,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      title: 'Properties Sold',
      value: stats.propertiesSold,
      subtitle: 'this month',
      icon: CheckCircle,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      title: 'Total Revenue',
      value: formatCurrency(stats.totalRevenue),
      subtitle: 'lifetime earnings',
      icon: DollarSign,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
    {
      title: 'Average Rating',
      value: stats.averageRating,
      subtitle: `${stats.totalReviews} reviews`,
      icon: Star,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
    },
  ];

  const quickActions = [
    {
      title: 'Add New Property',
      description: 'List a new property for sale or rent',
      icon: Home,
      href: '/properties/add',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      title: 'Manage Listings',
      description: 'View and edit your property listings',
      icon: FileText,
      href: '/broker/listings',
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      title: 'Client Inquiries',
      description: 'Respond to client messages and inquiries',
      icon: MessageSquare,
      href: '/broker/inquiries',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
    {
      title: 'Schedule Viewing',
      description: 'Schedule property viewings with clients',
      icon: Calendar,
      href: '/broker/schedule',
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Verification Status Banner */}
      {brokerProfile?.status === 'pending' && (
        <Card className="border-yellow-200 bg-yellow-50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                <Clock className="w-4 h-4 text-yellow-600" />
              </div>
              <div>
                <h3 className="font-medium text-yellow-900">Application Under Review</h3>
                <p className="text-sm text-yellow-800">
                  Your broker application is being reviewed. You'll receive an email once approved.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {brokerProfile?.status === 'approved' && (
        <Card className="border-green-200 bg-green-50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="w-4 h-4 text-green-600" />
              </div>
              <div>
                <h3 className="font-medium text-green-900">Verified Broker</h3>
                <p className="text-sm text-green-800">
                  You're a verified broker on BUILD-CONNECT. Start listing properties and connecting with clients!
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => {
          const IconComponent = stat.icon;
          return (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                    <p className="text-xs text-gray-500">{stat.subtitle}</p>
                  </div>
                  <div className={`p-3 rounded-full ${stat.bgColor}`}>
                    <IconComponent className={`w-6 h-6 ${stat.color}`} />
                  </div>
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickActions.map((action, index) => {
              const IconComponent = action.icon;
              return (
                <Link key={index} href={action.href}>
                  <div className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow cursor-pointer">
                    <div className={`w-10 h-10 rounded-full ${action.bgColor} flex items-center justify-center mb-3`}>
                      <IconComponent className={`w-5 h-5 ${action.color}`} />
                    </div>
                    <h3 className="font-medium text-gray-900 mb-1">{action.title}</h3>
                    <p className="text-sm text-gray-600">{action.description}</p>
                  </div>
                </Link>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Performance Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              Performance Metrics
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Success Rate</span>
              <span className="font-medium">{stats.successRate}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-green-600 h-2 rounded-full" 
                style={{ width: `${stats.successRate}%` }}
              ></div>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Response Time</span>
              <span className="font-medium">{stats.responseTime}</span>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Client Satisfaction</span>
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 text-yellow-500 fill-current" />
                <span className="font-medium">{stats.averageRating}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="w-5 h-5" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-medium">Property sold in Whitefield</p>
                  <p className="text-xs text-gray-500">2 hours ago</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <MessageSquare className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium">New inquiry for Koramangala property</p>
                  <p className="text-xs text-gray-500">5 hours ago</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                  <Home className="w-4 h-4 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm font-medium">New property listed in HSR Layout</p>
                  <p className="text-xs text-gray-500">1 day ago</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Profile Summary */}
      {brokerProfile && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              Profile Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Experience</h4>
                <p className="text-sm text-gray-600">{brokerProfile.experience} years in real estate</p>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Service Areas</h4>
                <div className="flex flex-wrap gap-1">
                  {brokerProfile.serviceAreas.slice(0, 3).map((area, index) => (
                    <span key={index} className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
                      {area}
                    </span>
                  ))}
                  {brokerProfile.serviceAreas.length > 3 && (
                    <span className="text-xs text-gray-500">+{brokerProfile.serviceAreas.length - 3} more</span>
                  )}
                </div>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Status</h4>
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                  brokerProfile.status === 'approved' 
                    ? 'bg-green-100 text-green-800' 
                    : brokerProfile.status === 'pending'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-red-100 text-red-800'
                }`}>
                  {brokerProfile.status === 'approved' && <CheckCircle className="w-3 h-3 mr-1" />}
                  {brokerProfile.status === 'pending' && <Clock className="w-3 h-3 mr-1" />}
                  {brokerProfile.status === 'rejected' && <AlertTriangle className="w-3 h-3 mr-1" />}
                  {brokerProfile.status.charAt(0).toUpperCase() + brokerProfile.status.slice(1)}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
