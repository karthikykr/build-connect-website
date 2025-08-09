'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Loading } from '@/components/ui/Loading';
import {
  Hammer,
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
  Briefcase,
  Home,
  Wrench,
} from 'lucide-react';
import { contractorsService, ContractorProfile, ContractorStats } from '@/services/contractors.service';
import { formatCurrency, formatRelativeTime } from '@/lib/utils';
import Link from 'next/link';

interface ContractorDashboardProps {
  user: any;
}

export function ContractorDashboard({ user }: ContractorDashboardProps) {
  const [contractorProfile, setContractorProfile] = useState<ContractorProfile | null>(null);
  const [contractorStats, setContractorStats] = useState<ContractorStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadContractorData();
  }, []);

  const loadContractorData = async () => {
    try {
      setIsLoading(true);
      const [profileResponse, statsResponse] = await Promise.all([
        contractorsService.getContractorApplication(),
        contractorsService.getContractorStats(),
      ]);

      if (profileResponse.success && profileResponse.data) {
        setContractorProfile(profileResponse.data);
      }

      if (statsResponse.success && statsResponse.data) {
        setContractorStats(statsResponse.data);
      }
    } catch (error) {
      console.error('Error loading contractor data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <Loading />;
  }

  const mockStats = {
    totalProjects: 18,
    activeProjects: 12,
    completedProjects: 6,
    totalRevenue: 4250000,
    averageRating: 4.7,
    totalReviews: 89,
    responseTime: '3 hours',
    successRate: 92,
    monthlyStats: [
      { month: 'Jan', projects: 2, completed: 1, revenue: 650000 },
      { month: 'Feb', projects: 3, completed: 2, revenue: 820000 },
      { month: 'Mar', projects: 4, completed: 3, revenue: 1200000 },
    ]
  };

  const stats = contractorStats || mockStats;

  const statCards = [
    {
      title: 'Total Projects',
      value: stats.totalProjects,
      subtitle: `${stats.activeProjects} active`,
      icon: Briefcase,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
    },
    {
      title: 'Completed Projects',
      value: stats.completedProjects,
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
      title: 'Browse Projects',
      description: 'Find new construction projects to bid on',
      icon: Briefcase,
      href: '/projects',
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
    },
    {
      title: 'Manage Portfolio',
      description: 'Update your portfolio and showcase work',
      icon: FileText,
      href: '/contractor/portfolio',
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      title: 'Client Messages',
      description: 'Respond to client inquiries and messages',
      icon: MessageSquare,
      href: '/contractor/messages',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
    {
      title: 'Schedule Work',
      description: 'Manage your project timeline and schedule',
      icon: Calendar,
      href: '/contractor/schedule',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Verification Status Banner */}
      {contractorProfile?.status === 'pending' && (
        <Card className="border-yellow-200 bg-yellow-50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                <Clock className="w-4 h-4 text-yellow-600" />
              </div>
              <div>
                <h3 className="font-medium text-yellow-900">Application Under Review</h3>
                <p className="text-sm text-yellow-800">
                  Your contractor application is being reviewed. You'll receive an email once approved.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {contractorProfile?.status === 'approved' && (
        <Card className="border-green-200 bg-green-50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="w-4 h-4 text-green-600" />
              </div>
              <div>
                <h3 className="font-medium text-green-900">Verified Contractor</h3>
                <p className="text-sm text-green-800">
                  You're a verified contractor on BUILD-CONNECT. Start bidding on projects and growing your business!
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
              <span className="text-sm text-gray-600">Project Success Rate</span>
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
                  <p className="text-sm font-medium">Project completed in Whitefield</p>
                  <p className="text-xs text-gray-500">4 hours ago</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <MessageSquare className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium">New project inquiry received</p>
                  <p className="text-xs text-gray-500">8 hours ago</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                  <Briefcase className="w-4 h-4 text-orange-600" />
                </div>
                <div>
                  <p className="text-sm font-medium">Started new project in HSR Layout</p>
                  <p className="text-xs text-gray-500">2 days ago</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Profile Summary */}
      {contractorProfile && (
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
                <p className="text-sm text-gray-600">{contractorProfile.experience} years in construction</p>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Specializations</h4>
                <div className="flex flex-wrap gap-1">
                  {contractorProfile.specializations.slice(0, 3).map((spec, index) => (
                    <span key={index} className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                      {spec.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </span>
                  ))}
                  {contractorProfile.specializations.length > 3 && (
                    <span className="text-xs text-gray-500">+{contractorProfile.specializations.length - 3} more</span>
                  )}
                </div>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Service Areas</h4>
                <div className="flex flex-wrap gap-1">
                  {contractorProfile.serviceAreas.slice(0, 2).map((area, index) => (
                    <span key={index} className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
                      {area}
                    </span>
                  ))}
                  {contractorProfile.serviceAreas.length > 2 && (
                    <span className="text-xs text-gray-500">+{contractorProfile.serviceAreas.length - 2} more</span>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
