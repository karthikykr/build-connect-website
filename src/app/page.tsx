'use client';

import { Button } from '@/components/ui/Button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/Card';
import { useTheme } from '@/context/ThemeContext';
import { useAuth } from '@/hooks/useAuth';
import { useDashboardStats, useRecentActivity } from '@/hooks/useDashboard';
import { MainLayout } from '@/components/layout';
import { StatCard } from '@/components/shared/StatCard';
import { FeaturedListings } from '@/components/shared/FeaturedListings';
import { RecentActivity } from '@/components/shared/RecentActivity';
import {
  Home,
  MapPin,
  Users,
  Wrench,
  MessageCircle,
  HelpCircle,
  Eye,
  Heart,
} from 'lucide-react';
import Link from 'next/link';

export default function HomePage() {
  const { theme, toggleTheme, isDarkMode } = useTheme();
  const { isAuthenticated, user } = useAuth();
  const { stats, isLoading: statsLoading } = useDashboardStats();
  const { activities, isLoading: activitiesLoading } = useRecentActivity();

  const quickAccessItems = [
    {
      id: 1,
      name: 'Sites',
      icon: Home,
      description: 'Browse available properties',
      route: '/properties',
    },
    {
      id: 2,
      name: 'Contractors',
      icon: Wrench,
      description: 'Find trusted contractors',
      route: '/contractors',
    },
    {
      id: 3,
      name: 'Site Scouts',
      icon: Users,
      description: 'Connect with brokers',
      route: '/brokers',
    },
    {
      id: 4,
      name: 'Map Explorer',
      icon: MapPin,
      description: 'Explore properties on map',
      route: '/map',
    },
    {
      id: 5,
      name: 'Chats',
      icon: MessageCircle,
      description: 'Your conversations',
      route: '/chat',
    },
    {
      id: 6,
      name: 'Support',
      icon: HelpCircle,
      description: 'Get help and support',
      route: '/support',
    },
  ];

  return (
    <MainLayout>
      {/* Hero Section */}
      <section className="gradient-primary py-20 text-white">
        <div className="container-custom">
          <div className="text-center">
            <h1 className="font-playwrite mb-6 text-4xl font-bold md:text-6xl">
              BUILD-CONNECT
            </h1>
            <p className="mb-8 text-xl opacity-90 md:text-2xl">
              Your Gateway to Real Estate Excellence
            </p>
            <p className="mx-auto mb-8 max-w-2xl text-lg opacity-80">
              Connect with property buyers, sellers, brokers, and contractors.
              Find your dream property or grow your real estate business.
            </p>
            <div className="flex flex-col justify-center gap-4 sm:flex-row">
              {isAuthenticated ? (
                <Link href="/dashboard">
                  <Button size="lg" variant="secondary">
                    Go to Dashboard
                  </Button>
                </Link>
              ) : (
                <>
                  <Link href="/auth/register">
                    <Button size="lg" variant="secondary">
                      Get Started
                    </Button>
                  </Link>
                  <Link href="/auth/login">
                    <Button
                      size="lg"
                      variant="outline"
                      className="hover:text-primary border-white text-white hover:bg-white"
                    >
                      Sign In
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-16 bg-card">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard
              title="Total Properties"
              value="2,847"
              change={{ value: 12, type: 'increase' }}
              icon={<Home className="w-6 h-6" />}
              trend="up"
            />
            <StatCard
              title="Active Brokers"
              value="156"
              change={{ value: 8, type: 'increase' }}
              icon={<Users className="w-6 h-6" />}
              trend="up"
            />
            <StatCard
              title="Verified Contractors"
              value="89"
              change={{ value: 5, type: 'increase' }}
              icon={<Wrench className="w-6 h-6" />}
              trend="up"
            />
            <StatCard
              title="Successful Deals"
              value="1,234"
              change={{ value: 15, type: 'increase' }}
              icon={<HelpCircle className="w-6 h-6" />}
              trend="up"
            />
          </div>
        </div>
      </section>

      {/* Quick Access Section */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold md:text-4xl">
              Quick Access
            </h2>
            <p className="text-text-secondary mx-auto max-w-2xl text-lg">
              Everything you need for your real estate journey, all in one place
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {quickAccessItems.map(item => {
              const IconComponent = item.icon;
              return (
                <Card key={item.id} hover className="text-center">
                  <CardHeader>
                    <div className="bg-primary/10 mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl">
                      <IconComponent className="text-primary h-8 w-8" />
                    </div>
                    <CardTitle>{item.name}</CardTitle>
                    <CardDescription>{item.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Link href={item.route}>
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
      </section>

      {/* Featured Listings Section */}
      <section className="section-padding">
        <div className="container-custom">
          <FeaturedListings />
        </div>
      </section>

      {/* Recent Activity Section */}
      {isAuthenticated && (
        <section className="py-16 bg-accent/30">
          <div className="container-custom">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <h2 className="text-2xl font-bold text-text-primary mb-6">
                  Your Dashboard Overview
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  <StatCard
                    title="Properties Viewed"
                    value={statsLoading ? "..." : (stats?.propertiesViewed?.toString() || "0")}
                    change={{ value: 20, type: 'increase' }}
                    icon={<Eye className="w-5 h-5" />}
                    trend="up"
                  />
                  <StatCard
                    title="Saved Properties"
                    value={statsLoading ? "..." : (stats?.savedProperties?.toString() || "0")}
                    change={{ value: 3, type: 'increase' }}
                    icon={<Heart className="w-5 h-5" />}
                    trend="up"
                  />
                </div>
              </div>
              <div>
                <RecentActivity
                  activities={activitiesLoading ? undefined : activities}
                />
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Theme Toggle Section */}
      <section className="bg-accent/30 py-16">
        <div className="container-custom text-center">
          <h3 className="mb-4 text-2xl font-bold">Theme Preferences</h3>
          <p className="text-text-secondary mb-6">
            Current theme: {isDarkMode ? 'Dark' : 'Light'} Mode
          </p>
          <Button onClick={toggleTheme} variant="primary">
            Switch to {isDarkMode ? 'Light' : 'Dark'} Mode
          </Button>
        </div>
      </section>
    </MainLayout>
  );
}
