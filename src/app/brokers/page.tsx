'use client';

import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/layout';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Loading } from '@/components/ui/Loading';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import {
  Search,
  Filter,
  MapPin,
  Star,
  Users,
  TrendingUp,
  Shield,
  Award,
  UserCheck,
  Grid,
  List,
  SlidersHorizontal,
  AlertCircle,
  Phone,
  Mail,
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import {
  brokersService,
  BrokerFilters as ServiceBrokerFilters,
} from '@/services/brokers.service';
import { BrokerProfile } from '@/types';
import toast from 'react-hot-toast';

interface BrokerFiltersType {
  search?: string;
  city?: string;
  specialization?: string;
  rating?: number;
  verified?: boolean;
  experience?: string;
  sortBy?: string;
}

export default function BrokersPage() {
  const [brokers, setBrokers] = useState<BrokerProfile[]>([]);
  const [filteredBrokers, setFilteredBrokers] = useState<BrokerProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<BrokerFiltersType>({});
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadBrokers();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [brokers, filters]);

  const loadBrokers = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await brokersService.getBrokers({
        page: 1,
        limit: 50,
        sortBy: 'rating',
        sortOrder: 'desc',
      });

      if (response.success && response.data) {
        setBrokers(response.data.brokers);
        toast.success(`Loaded ${response.data.brokers.length} brokers`);
      } else {
        // Check if it's an authentication error
        if (
          response.error?.includes('Not Authenticated') ||
          response.error?.includes('401')
        ) {
          setError('Please log in to view brokers');
          toast.error('Please log in to view brokers');
        } else {
          setError('Failed to load brokers');
          toast.error('Failed to load brokers');
        }
        setBrokers([]);
      }
    } catch (error: any) {
      console.error('Error loading brokers:', error);

      // Check if it's an authentication error
      if (
        error.message?.includes('401') ||
        error.message?.includes('Unauthorized')
      ) {
        setError('Please log in to view brokers');
        toast.error('Please log in to view brokers');
      } else {
        setError(
          'Failed to connect to backend. Please ensure you are logged in and the backend is running.'
        );
        toast.error('Failed to connect to backend');
      }
      setBrokers([]);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...brokers];

    if (filters.search) {
      filtered = filtered.filter(
        broker =>
          broker.name.toLowerCase().includes(filters.search!.toLowerCase()) ||
          broker.email.toLowerCase().includes(filters.search!.toLowerCase())
      );
    }

    if (filters.city) {
      filtered = filtered.filter(broker =>
        broker.address?.city
          ?.toLowerCase()
          .includes(filters.city!.toLowerCase())
      );
    }

    if (filters.verified !== undefined) {
      filtered = filtered.filter(
        broker => broker.isVerified === filters.verified
      );
    }

    if (filters.rating) {
      filtered = filtered.filter(broker => broker.rating >= filters.rating!);
    }

    setFilteredBrokers(filtered);
  };

  const handleFilterChange = (newFilters: Partial<BrokerFiltersType>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const clearFilters = () => {
    setFilters({});
  };

  if (loading) {
    return (
      <ProtectedRoute>
        <DashboardLayout>
          <div className="flex min-h-[400px] items-center justify-center">
            <Loading size="lg" />
          </div>
        </DashboardLayout>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="space-y-6">
          {/* Header */}
          <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <h1 className="text-gray-900 text-3xl font-bold">Find Brokers</h1>
              <p className="text-gray-600 mt-1">
                Connect with verified real estate brokers in your area
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant={viewMode === 'grid' ? 'primary' : 'outline'}
                size="sm"
                onClick={() => setViewMode('grid')}
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'primary' : 'outline'}
                size="sm"
                onClick={() => setViewMode('list')}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Search and Filters */}
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col gap-4 lg:flex-row">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="text-gray-400 absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform" />
                    <Input
                      placeholder="Search brokers by name or email..."
                      value={filters.search || ''}
                      onChange={e =>
                        handleFilterChange({ search: e.target.value })
                      }
                      className="pl-10"
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <Input
                    placeholder="City"
                    value={filters.city || ''}
                    onChange={e => handleFilterChange({ city: e.target.value })}
                    className="w-32"
                  />
                  <select
                    value={filters.verified?.toString() || ''}
                    onChange={e =>
                      handleFilterChange({
                        verified:
                          e.target.value === ''
                            ? undefined
                            : e.target.value === 'true',
                      })
                    }
                    className="border-gray-300 rounded-md border px-3 py-2 text-sm"
                  >
                    <option value="">All</option>
                    <option value="true">Verified</option>
                    <option value="false">Unverified</option>
                  </select>
                  <Button variant="outline" onClick={clearFilters}>
                    Clear
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Error State */}
          {error && (
            <Card className="border-red-200 bg-red-50">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 text-red-700">
                  <AlertCircle className="h-5 w-5" />
                  <div>
                    <h3 className="font-medium">Unable to load brokers</h3>
                    <p className="mt-1 text-sm text-red-600">{error}</p>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={loadBrokers}
                      className="mt-2 border-red-300 text-red-700 hover:bg-red-100"
                    >
                      Try Again
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Results */}
          {!error && (
            <>
              <div className="flex items-center justify-between">
                <p className="text-gray-600">
                  {filteredBrokers.length} broker
                  {filteredBrokers.length !== 1 ? 's' : ''} found
                </p>
              </div>

              {filteredBrokers.length === 0 ? (
                <Card>
                  <CardContent className="p-12 text-center">
                    <Users className="text-gray-400 mx-auto mb-4 h-12 w-12" />
                    <h3 className="text-gray-900 mb-2 text-lg font-medium">
                      No brokers found
                    </h3>
                    <p className="text-gray-600 mb-4">
                      {brokers.length === 0
                        ? 'No brokers are currently available. Please check back later.'
                        : 'Try adjusting your search criteria to find more brokers.'}
                    </p>
                    {filters.search ||
                    filters.city ||
                    filters.verified !== undefined ? (
                      <Button variant="outline" onClick={clearFilters}>
                        Clear Filters
                      </Button>
                    ) : null}
                  </CardContent>
                </Card>
              ) : (
                <div
                  className={`grid gap-6 ${
                    viewMode === 'grid'
                      ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
                      : 'grid-cols-1'
                  }`}
                >
                  {filteredBrokers.map(broker => (
                    <BrokerCard key={broker.id} broker={broker} />
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}

// Simple Broker Card Component (fallback if EnhancedBrokerCard doesn't work)
function BrokerCard({ broker }: { broker: BrokerProfile }) {
  return (
    <Card className="transition-shadow hover:shadow-lg">
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <div className="bg-gray-200 flex h-16 w-16 items-center justify-center rounded-full">
            {broker.avatar ? (
              <img
                src={broker.avatar}
                alt={broker.name}
                className="h-16 w-16 rounded-full object-cover"
              />
            ) : (
              <UserCheck className="text-gray-400 h-8 w-8" />
            )}
          </div>
          <div className="flex-1">
            <div className="mb-1 flex items-center gap-2">
              <h3 className="text-gray-900 font-semibold">{broker.name}</h3>
              {broker.isVerified && (
                <Shield className="h-4 w-4 text-green-500" />
              )}
            </div>
            <div className="mb-2 flex items-center gap-1">
              <Star className="h-4 w-4 fill-current text-yellow-400" />
              <span className="text-sm font-medium">
                {broker.rating.toFixed(1)}
              </span>
              <span className="text-gray-500 text-sm">
                ({broker.totalReviews} reviews)
              </span>
            </div>
            <p className="text-gray-600 mb-3 text-sm">{broker.bio}</p>
            <div className="text-gray-500 flex items-center gap-4 text-sm">
              <div className="flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                <span>
                  {broker.address?.city}, {broker.address?.state}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <Award className="h-4 w-4" />
                <span>{broker.experience} years</span>
              </div>
            </div>
            <div className="mt-4 flex gap-2">
              <Button size="sm" variant="primary">
                <Phone className="mr-1 h-4 w-4" />
                Contact
              </Button>
              <Button size="sm" variant="outline">
                View Profile
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
