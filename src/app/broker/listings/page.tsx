'use client';

import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/layout';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Loading } from '@/components/ui/Loading';
import {
  Home,
  Plus,
  Search,
  Filter,
  Edit,
  Eye,
  Trash2,
  MapPin,
  Calendar,
  DollarSign,
  MoreVertical,
  Star,
  MessageSquare,
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { sitesService } from '@/services/sites.service';
import { formatCurrency, formatRelativeTime } from '@/lib/utils';
import Link from 'next/link';

interface Property {
  _id: string;
  name: string;
  location: string;
  price: number;
  propertyType: string;
  status: 'active' | 'sold' | 'rented' | 'inactive';
  images: string[];
  createdAt: string;
  views: number;
  inquiries: number;
  description: string;
}

const PROPERTY_STATUS_CONFIG = {
  active: { label: 'Active', color: 'text-green-600', bgColor: 'bg-green-50' },
  sold: { label: 'Sold', color: 'text-blue-600', bgColor: 'bg-blue-50' },
  rented: {
    label: 'Rented',
    color: 'text-purple-600',
    bgColor: 'bg-purple-50',
  },
  inactive: {
    label: 'Inactive',
    color: 'text-gray-600',
    bgColor: 'bg-gray-50',
  },
};

export default function BrokerListingsPage() {
  const { user } = useAuth();
  const [properties, setProperties] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  useEffect(() => {
    loadProperties();
  }, []);

  const loadProperties = async () => {
    try {
      setIsLoading(true);

      // First try to get broker's properties from the backend
      const response = await sitesService.getSites();
      if (response.success && response.data && response.data.length > 0) {
        // Transform sites data to properties format
        const transformedProperties: Property[] = response.data.map(
          (site: any) => ({
            _id: site._id || site.id,
            name: site.name || site.title,
            location: site.location || `${site.city}, ${site.state}`,
            price: site.price || site.budget || 0,
            propertyType: site.propertyType || site.type || 'Residential',
            status: site.status || 'active',
            images: site.images || ['/api/placeholder/400/300'],
            createdAt: site.createdAt || new Date().toISOString(),
            views: site.views || 0,
            inquiries: site.inquiries || 0,
            description:
              site.description || 'Property description not available',
          })
        );
        setProperties(transformedProperties);
      } else {
        // If no sites data, show empty state
        setProperties([]);
        toast.info(
          'No properties found. Start by adding your first property listing.'
        );
      }
    } catch (error) {
      console.error('Error loading properties:', error);
      toast.error('Failed to load properties. Please try again.');
      setProperties([]);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredProperties = properties.filter(property => {
    const matchesSearch =
      property.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      property.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === 'all' || property.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const breadcrumbs = [
    { label: 'Broker Dashboard', href: '/broker/dashboard' },
    { label: 'My Listings', current: true },
  ];

  if (isLoading) {
    return (
      <ProtectedRoute allowedRoles={['broker']}>
        <DashboardLayout
          breadcrumbs={breadcrumbs}
          title="My Property Listings"
          description="Manage your property listings and track performance"
        >
          <Loading />
        </DashboardLayout>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute allowedRoles={['broker']}>
      <DashboardLayout
        breadcrumbs={breadcrumbs}
        title="My Property Listings"
        description="Manage your property listings and track performance"
        actions={
          <Link href="/properties/add">
            <Button variant="primary">
              <Plus className="mr-2 h-4 w-4" />
              Add New Property
            </Button>
          </Link>
        }
      >
        <div className="space-y-6">
          {/* Stats Overview */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm font-medium">
                      Total Listings
                    </p>
                    <p className="text-gray-900 text-2xl font-bold">
                      {properties.length}
                    </p>
                  </div>
                  <Home className="h-8 w-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm font-medium">
                      Active Listings
                    </p>
                    <p className="text-gray-900 text-2xl font-bold">
                      {properties.filter(p => p.status === 'active').length}
                    </p>
                  </div>
                  <Star className="h-8 w-8 text-green-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm font-medium">
                      Total Views
                    </p>
                    <p className="text-gray-900 text-2xl font-bold">
                      {properties.reduce((sum, p) => sum + p.views, 0)}
                    </p>
                  </div>
                  <Eye className="text-purple-600 h-8 w-8" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm font-medium">
                      Total Inquiries
                    </p>
                    <p className="text-gray-900 text-2xl font-bold">
                      {properties.reduce((sum, p) => sum + p.inquiries, 0)}
                    </p>
                  </div>
                  <MessageSquare className="h-8 w-8 text-orange-600" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Filters */}
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-col gap-4 sm:flex-row">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="text-gray-400 absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform" />
                    <Input
                      placeholder="Search properties..."
                      value={searchQuery}
                      onChange={e => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <div className="sm:w-48">
                  <select
                    value={statusFilter}
                    onChange={e => setStatusFilter(e.target.value)}
                    className="border-gray-300 focus:ring-primary-500 w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-2"
                  >
                    <option value="all">All Status</option>
                    <option value="active">Active</option>
                    <option value="sold">Sold</option>
                    <option value="rented">Rented</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Properties List */}
          {filteredProperties.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <div className="bg-gray-100 mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full">
                  <Home className="text-gray-400 h-8 w-8" />
                </div>
                <h3 className="text-gray-900 mb-2 text-lg font-semibold">
                  {properties.length === 0
                    ? 'No properties listed yet'
                    : 'No properties found'}
                </h3>
                <p className="text-gray-600 mb-6">
                  {properties.length === 0
                    ? 'Start by adding your first property listing to attract potential buyers.'
                    : 'Try adjusting your search or filters.'}
                </p>
                {properties.length === 0 && (
                  <Link href="/properties/add">
                    <Button variant="primary">Add Your First Property</Button>
                  </Link>
                )}
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-6">
              {filteredProperties.map(property => {
                const statusConfig = PROPERTY_STATUS_CONFIG[property.status];
                return (
                  <Card
                    key={property._id}
                    className="transition-shadow hover:shadow-md"
                  >
                    <CardContent className="p-6">
                      <div className="flex items-start gap-6">
                        {/* Property Image */}
                        <div className="bg-gray-200 h-24 w-32 flex-shrink-0 overflow-hidden rounded-lg">
                          {property.images[0] ? (
                            <img
                              src={property.images[0]}
                              alt={property.name}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center">
                              <Home className="text-gray-400 h-8 w-8" />
                            </div>
                          )}
                        </div>

                        {/* Property Details */}
                        <div className="flex-1">
                          <div className="flex items-start justify-between">
                            <div>
                              <div className="mb-2 flex items-center gap-3">
                                <h3 className="text-gray-900 text-lg font-semibold">
                                  {property.name}
                                </h3>
                                <span
                                  className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${statusConfig.color} ${statusConfig.bgColor}`}
                                >
                                  {statusConfig.label}
                                </span>
                              </div>

                              <div className="text-gray-600 mb-2 flex items-center gap-4 text-sm">
                                <div className="flex items-center gap-1">
                                  <MapPin className="h-4 w-4" />
                                  {property.location}
                                </div>
                                <div className="flex items-center gap-1">
                                  <Calendar className="h-4 w-4" />
                                  Listed{' '}
                                  {formatRelativeTime(property.createdAt)}
                                </div>
                              </div>

                              <p className="text-gray-900 mb-2 text-2xl font-bold">
                                {formatCurrency(property.price)}
                              </p>

                              <p className="text-gray-600 mb-3 line-clamp-2">
                                {property.description}
                              </p>

                              <div className="text-gray-600 flex items-center gap-4 text-sm">
                                <div className="flex items-center gap-1">
                                  <Eye className="h-4 w-4" />
                                  {property.views} views
                                </div>
                                <div className="flex items-center gap-1">
                                  <MessageSquare className="h-4 w-4" />
                                  {property.inquiries} inquiries
                                </div>
                              </div>
                            </div>

                            <div className="ml-4 flex items-center gap-2">
                              <Link href={`/properties/${property._id}`}>
                                <Button variant="outline" size="sm">
                                  <Eye className="mr-1 h-4 w-4" />
                                  View
                                </Button>
                              </Link>
                              <Link href={`/properties/${property._id}/edit`}>
                                <Button variant="outline" size="sm">
                                  <Edit className="mr-1 h-4 w-4" />
                                  Edit
                                </Button>
                              </Link>
                              <Button variant="outline" size="sm">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
