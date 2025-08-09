'use client';

import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/layout';
import { PropertyCard } from '@/components/features/properties/PropertyCard';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Loading } from '@/components/ui/Loading';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import {
  Star,
  MapPin,
  User,
  MessageCircle,
  Phone,
  Mail,
  Shield,
  Award,
  Clock,
  Eye,
  DollarSign,
  Home,
  TrendingUp,
  Calendar,
  CheckCircle,
  Users,
  Globe,
  FileText,
  Send,
} from 'lucide-react';
import { Property } from '@/types';

interface BrokerProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  profileImage?: string;
  verified: boolean;
  rating: number;
  reviewCount: number;
  experience: string;
  specializations: string[];
  location: {
    city: string;
    state: string;
    areas: string[];
  };
  stats: {
    totalProperties: number;
    propertiesSold: number;
    activeListings: number;
    totalRevenue: number;
  };
  certifications: string[];
  languages: string[];
  description: string;
  joinedDate: string;
  lastActive: string;
  responseTime: string;
  successRate: number;
  reviews: {
    id: string;
    rating: number;
    comment: string;
    reviewerName: string;
    date: string;
  }[];
  properties: Property[];
}

interface BrokerDetailPageProps {
  params: {
    id: string;
  };
}

export default function BrokerDetailPage({ params }: BrokerDetailPageProps) {
  const [broker, setBroker] = useState<BrokerProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<
    'overview' | 'properties' | 'reviews'
  >('overview');
  const [contactMessage, setContactMessage] = useState('');
  const [showContactForm, setShowContactForm] = useState(false);

  useEffect(() => {
    // Simulate API call to fetch broker details
    setTimeout(() => {
      const mockBroker: BrokerProfile = {
        id: brokerId,
        name: 'Rajesh Kumar',
        email: 'rajesh@example.com',
        phone: '9876543210',
        role: 'broker',
        isVerified: true,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
        experience: 5,
        serviceAreas: [
          'Bangalore',
          'Whitefield',
          'Electronic City',
          'Sarjapur',
        ],
        specializations: ['residential_plot', 'commercial_plot', 'villa'],
        rating: 4.5,
        reviewCount: 25,
        totalSales: 50,
        commission: 2,
        portfolio: [],
        isApproved: true,
        approvedAt: '2024-01-01T00:00:00Z',
        licenseNumber: 'RERA/KA/2024/001234',
        address: {
          street: '123 Main Street',
          city: 'Bangalore',
          state: 'Karnataka',
          pincode: '560001',
          country: 'India',
        },
      };

      setBroker(mockBroker);
      setProperties([]); // Mock empty properties for now
      setLoading(false);
    }, 1000);
  }, [brokerId]);

  if (loading) {
    return (
      <MainLayout>
        <div className="container-custom py-8">
          <div className="flex min-h-[400px] items-center justify-center">
            <Loading size="lg" text="Loading broker profile..." />
          </div>
        </div>
      </MainLayout>
    );
  }

  if (!broker) {
    return (
      <MainLayout>
        <div className="container-custom py-8">
          <div className="py-12 text-center">
            <h1 className="text-text-primary mb-4 text-2xl font-bold">
              Broker Not Found
            </h1>
            <p className="text-text-secondary mb-6">
              The broker profile you're looking for doesn't exist.
            </p>
            <Link href="/brokers">
              <Button variant="primary">Back to Brokers</Button>
            </Link>
          </div>
        </div>
      </MainLayout>
    );
  }

  const breadcrumbs = [
    { label: 'Brokers', href: '/brokers' },
    { label: broker.name, current: true },
  ];

  return (
    <MainLayout>
      <div className="container-custom py-8">
        {/* Breadcrumbs */}
        <Breadcrumb items={breadcrumbs} className="mb-6" />

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Broker Header */}
            <Card className="mb-8">
              <CardContent className="p-8">
                <div className="flex flex-col items-start md:flex-row md:items-center">
                  <div className="bg-primary mb-4 mr-6 flex h-24 w-24 items-center justify-center rounded-full md:mb-0">
                    {broker.avatar ? (
                      <img
                        src={broker.avatar}
                        alt={broker.name}
                        className="h-full w-full rounded-full object-cover"
                      />
                    ) : (
                      <User className="h-12 w-12 text-white" />
                    )}
                  </div>

                  <div className="flex-1">
                    <div className="mb-2 flex items-center">
                      <h1 className="text-text-primary mr-3 text-3xl font-bold">
                        {broker.name}
                      </h1>
                      {broker.isVerified && (
                        <Verified className="text-success h-6 w-6" />
                      )}
                    </div>

                    <div className="mb-3 flex items-center">
                      <Star className="text-warning mr-1 h-5 w-5 fill-current" />
                      <span className="mr-2 text-lg font-medium">
                        {broker.rating}
                      </span>
                      <span className="text-text-secondary">
                        ({broker.reviewCount} reviews)
                      </span>
                    </div>

                    <div className="text-text-secondary mb-4 flex items-center">
                      <MapPin className="mr-1 h-4 w-4" />
                      <span>
                        {broker.address?.city}, {broker.address?.state}
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {broker.specializations.map((spec, index) => (
                        <span
                          key={index}
                          className="bg-primary/10 text-primary rounded-lg px-3 py-1 text-sm font-medium"
                        >
                          {spec.replace('_', ' ').toUpperCase()}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Statistics */}
            <div className="mb-8 grid grid-cols-2 gap-4 md:grid-cols-4">
              <Card>
                <CardContent className="p-6 text-center">
                  <TrendingUp className="text-primary mx-auto mb-2 h-8 w-8" />
                  <p className="text-text-primary text-2xl font-bold">
                    {broker.totalSales}
                  </p>
                  <p className="text-text-secondary text-sm">Properties Sold</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6 text-center">
                  <Home className="text-primary mx-auto mb-2 h-8 w-8" />
                  <p className="text-text-primary text-2xl font-bold">
                    {broker.portfolio.length}
                  </p>
                  <p className="text-text-secondary text-sm">Active Listings</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6 text-center">
                  <Clock className="text-primary mx-auto mb-2 h-8 w-8" />
                  <p className="text-text-primary text-2xl font-bold">
                    {broker.experience}+
                  </p>
                  <p className="text-text-secondary text-sm">
                    Years Experience
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6 text-center">
                  <Award className="text-primary mx-auto mb-2 h-8 w-8" />
                  <p className="text-text-primary text-2xl font-bold">
                    {broker.commission}%
                  </p>
                  <p className="text-text-secondary text-sm">Commission</p>
                </CardContent>
              </Card>
            </div>

            {/* Tabs */}
            <div className="mb-6">
              <div className="border-gray-light border-b">
                <nav className="flex space-x-8">
                  {[
                    { id: 'overview', label: 'Overview' },
                    { id: 'listings', label: 'Listings' },
                    { id: 'reviews', label: 'Reviews' },
                  ].map(tab => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as any)}
                      className={`border-b-2 px-1 py-4 text-sm font-medium ${
                        activeTab === tab.id
                          ? 'border-primary text-primary'
                          : 'text-text-secondary hover:text-text-primary border-transparent'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </nav>
              </div>
            </div>

            {/* Tab Content */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                {/* About */}
                <Card>
                  <CardHeader>
                    <CardTitle>About</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-text-secondary mb-4 leading-relaxed">
                      Experienced real estate professional with{' '}
                      {broker.experience}+ years in the industry. Specializing
                      in residential and commercial properties across Bangalore.
                      Committed to providing exceptional service and helping
                      clients find their perfect property.
                    </p>

                    {/* Service Areas */}
                    <div className="mb-4">
                      <h4 className="mb-2 font-semibold">Service Areas</h4>
                      <div className="flex flex-wrap gap-2">
                        {broker.serviceAreas.map((area, index) => (
                          <span
                            key={index}
                            className="bg-gray-light rounded-lg px-3 py-1 text-sm"
                          >
                            {area}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* License Info */}
                    {broker.licenseNumber && (
                      <div className="text-text-secondary flex items-center text-sm">
                        <CheckCircle className="text-success mr-2 h-4 w-4" />
                        RERA License: {broker.licenseNumber}
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Recent Activity */}
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Activity</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center">
                        <div className="bg-success mr-3 h-2 w-2 rounded-full"></div>
                        <span className="text-sm">
                          Listed new property in Whitefield
                        </span>
                        <span className="text-text-secondary ml-auto text-xs">
                          2 days ago
                        </span>
                      </div>
                      <div className="flex items-center">
                        <div className="bg-primary mr-3 h-2 w-2 rounded-full"></div>
                        <span className="text-sm">
                          Completed sale in Electronic City
                        </span>
                        <span className="text-text-secondary ml-auto text-xs">
                          1 week ago
                        </span>
                      </div>
                      <div className="flex items-center">
                        <div className="bg-warning mr-3 h-2 w-2 rounded-full"></div>
                        <span className="text-sm">
                          Updated profile information
                        </span>
                        <span className="text-text-secondary ml-auto text-xs">
                          2 weeks ago
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {activeTab === 'listings' && (
              <div>
                {properties.length === 0 ? (
                  <Card>
                    <CardContent className="p-12 text-center">
                      <Home className="text-text-secondary mx-auto mb-4 h-16 w-16" />
                      <h3 className="text-text-primary mb-2 text-xl font-semibold">
                        No Active Listings
                      </h3>
                      <p className="text-text-secondary">
                        This broker doesn't have any active property listings at
                        the moment.
                      </p>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    {properties.map(property => (
                      <PropertyCard key={property.id} property={property} />
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'reviews' && (
              <Card>
                <CardContent className="p-12 text-center">
                  <Star className="text-text-secondary mx-auto mb-4 h-16 w-16" />
                  <h3 className="text-text-primary mb-2 text-xl font-semibold">
                    Reviews Coming Soon
                  </h3>
                  <p className="text-text-secondary">
                    Review system will be available in the next update.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div>
            {/* Contact Card */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Contact {broker.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Button variant="primary" className="w-full">
                    <MessageCircle className="mr-2 h-4 w-4" />
                    Send Message
                  </Button>
                  <Button variant="outline" className="w-full">
                    <Phone className="mr-2 h-4 w-4" />
                    Call Now
                  </Button>
                  <Button variant="outline" className="w-full">
                    <Mail className="mr-2 h-4 w-4" />
                    Email
                  </Button>
                </div>

                <div className="border-gray-light mt-4 border-t pt-4">
                  <p className="text-text-secondary mb-2 text-sm">
                    Response Time
                  </p>
                  <p className="text-sm font-medium">
                    Usually responds within 2 hours
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Verification Status */}
            <Card>
              <CardHeader>
                <CardTitle>Verification Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Identity Verified</span>
                    <CheckCircle className="text-success h-4 w-4" />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">RERA Licensed</span>
                    <CheckCircle className="text-success h-4 w-4" />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Background Checked</span>
                    <CheckCircle className="text-success h-4 w-4" />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Phone Verified</span>
                    <CheckCircle className="text-success h-4 w-4" />
                  </div>
                </div>

                <div className="border-gray-light mt-4 border-t pt-4">
                  <p className="text-text-secondary text-xs">
                    Member since {formatRelativeTime(broker.createdAt)}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
