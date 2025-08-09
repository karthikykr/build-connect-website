'use client';

import { useAuth } from '@/hooks/useAuth';
import { useDashboardStats, useRecentActivity } from '@/hooks/useDashboard';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { DashboardLayout } from '@/components/layout';
import { StatCard } from '@/components/shared/StatCard';
import { RecentActivity } from '@/components/shared/RecentActivity';
import { Button } from '@/components/ui/Button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/Card';
import {
  Home,
  MapPin,
  Users,
  Wrench,
  MessageCircle,
  Settings,
  LogOut,
  Eye,
  Heart,
  FileText,
  TrendingUp,
  Calendar,
  Bell,
} from 'lucide-react';
import Link from 'next/link';

export default function DashboardPage() {
  const { user, logout, getRedirectPath } = useAuth();
  const { stats, isLoading: statsLoading } = useDashboardStats();
  const { activities, isLoading: activitiesLoading } = useRecentActivity();

  const quickActions = [
    {
      title: 'Browse Properties',
      description: 'Explore available properties',
      icon: Home,
      href: '/properties',
      color: 'bg-blue-500',
    },
    {
      title: 'Find Brokers',
      description: 'Connect with site scouts',
      icon: Users,
      href: '/brokers',
      color: 'bg-green-500',
    },
    {
      title: 'Hire Contractors',
      description: 'Find construction professionals',
      icon: Wrench,
      href: '/contractors',
      color: 'bg-orange-500',
    },
    {
      title: 'Map Explorer',
      description: 'Explore properties on map',
      icon: MapPin,
      href: '/map',
      color: 'bg-purple-500',
    },
    {
      title: 'Messages',
      description: 'Your conversations',
      icon: MessageCircle,
      href: '/chat',
      color: 'bg-pink-500',
    },
    {
      title: 'Settings',
      description: 'Account settings',
      icon: Settings,
      href: '/profile',
      color: 'bg-gray-500',
    },
  ];

  const getRoleSpecificActions = () => {
    switch (user?.role) {
      case 'broker':
        return [
          {
            title: 'Broker Dashboard',
            description: 'Manage your listings and clients',
            href: '/brokers/dashboard',
          },
          {
            title: 'Add Property',
            description: 'List a new property',
            href: '/properties/add',
          },
        ];
      case 'contractor':
        return [
          {
            title: 'Contractor Dashboard',
            description: 'Manage your projects and portfolio',
            href: '/contractors/dashboard',
          },
          {
            title: 'Project Management',
            description: 'Track your ongoing projects',
            href: '/contractors/projects',
          },
        ];
      case 'admin':
        return [
          {
            title: 'Admin Dashboard',
            description: 'Platform management and analytics',
            href: '/admin/dashboard',
          },
          {
            title: 'User Management',
            description: 'Manage users and applications',
            href: '/admin/users',
          },
        ];
      default:
        return [];
    }
  };

  const roleSpecificActions = getRoleSpecificActions();

  const breadcrumbs = [{ label: 'Dashboard', current: true }];

  return (
    <ProtectedRoute>
      <DashboardLayout
        breadcrumbs={breadcrumbs}
        title={`Welcome back, ${user?.name}!`}
        description={`Role: ${
          user?.role
            ? user.role.charAt(0).toUpperCase() + user.role.slice(1)
            : 'N/A'
        } ${user?.isEmailVerified ? '✓ Verified' : '⚠ Pending Verification'}`}
        actions={
          <Button
            variant="outline"
            onClick={logout}
            leftIcon={<LogOut className="h-4 w-4" />}
          >
            Logout
          </Button>
        }
      >
        {/* Dashboard Statistics */}
        <div className="mb-8">
          <h2 className="mb-6 text-2xl font-bold text-text-primary">
            Your Overview
          </h2>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            <StatCard
              title="Properties Viewed"
              value={statsLoading ? "..." : (stats?.propertiesViewed?.toString() || "0")}
              change={{ value: 20, type: 'increase' }}
              icon={<Eye className="h-5 w-5" />}
              trend="up"
            />
            <StatCard
              title="Saved Properties"
              value={statsLoading ? "..." : (stats?.savedProperties?.toString() || "0")}
              change={{ value: 3, type: 'increase' }}
              icon={<Heart className="h-5 w-5" />}
              trend="up"
            />
            <StatCard
              title="Messages"
              value={statsLoading ? "..." : (stats?.messages?.toString() || "0")}
              change={{ value: 5, type: 'increase' }}
              icon={<MessageCircle className="h-5 w-5" />}
              trend="up"
            />
            <StatCard
              title="Profile Views"
              value={statsLoading ? "..." : (stats?.profileViews?.toString() || "0")}
              change={{ value: 12, type: 'increase' }}
              icon={<TrendingUp className="h-5 w-5" />}
              trend="up"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            {/* Role-specific Actions */}
            {roleSpecificActions.length > 0 && (
              <div className="mb-8">
                <h2 className="mb-6 text-2xl font-bold text-text-primary">
                  Quick Actions
                </h2>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  {roleSpecificActions.map((action, index) => (
                    <Card key={index} hover>
                      <CardHeader>
                        <CardTitle>{action.title}</CardTitle>
                        <CardDescription>{action.description}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <Link href={action.href}>
                          <Button variant="primary" className="w-full">
                            Go to {action.title}
                          </Button>
                        </Link>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* General Actions */}
            <div>
              <h2 className="mb-6 text-2xl font-bold text-text-primary">
                Explore Platform
              </h2>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {quickActions.map((action, index) => {
                  const IconComponent = action.icon;
                  return (
                    <Card key={index} hover>
                      <CardHeader>
                        <div className="flex items-center space-x-3">
                          <div
                            className={`rounded-lg p-2 ${action.color} text-white`}
                          >
                            <IconComponent className="h-6 w-6" />
                          </div>
                          <div>
                            <CardTitle className="text-lg">
                              {action.title}
                            </CardTitle>
                            <CardDescription>
                              {action.description}
                            </CardDescription>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <Link href={action.href}>
                          <Button variant="outline" className="w-full">
                            Explore
                          </Button>
                        </Link>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Recent Activity Sidebar */}
          <div className="space-y-6">
            <RecentActivity
              activities={activitiesLoading ? undefined : activities}
            />
          </div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
