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
  Mail
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
        sortOrder: 'desc'
      });

      if (response.success && response.data) {
        setBrokers(response.data.brokers);
        toast.success(`Loaded ${response.data.brokers.length} brokers`);
      } else {
        setError('Failed to load brokers');
        toast.error('Failed to load brokers');
        setBrokers([]);
      }
    } catch (error) {
      console.error('Error loading brokers:', error);
      setError('Failed to connect to backend. Please ensure the backend is running.');
      toast.error('Failed to connect to backend');
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
        broker.address?.city?.toLowerCase().includes(filters.city!.toLowerCase())
      );
    }

    if (filters.verified !== undefined) {
      filtered = filtered.filter(broker => broker.isVerified === filters.verified);
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
          <div className="flex items-center justify-center min-h-[400px]">
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
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Find Brokers</h1>
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
                <Grid className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'primary' : 'outline'}
                size="sm"
                onClick={() => setViewMode('list')}
              >
                <List className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Search and Filters */}
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col lg:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      placeholder="Search brokers by name or email..."
                      value={filters.search || ''}
                      onChange={(e) => handleFilterChange({ search: e.target.value })}
                      className="pl-10"
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <Input
                    placeholder="City"
                    value={filters.city || ''}
                    onChange={(e) => handleFilterChange({ city: e.target.value })}
                    className="w-32"
                  />
                  <select
                    value={filters.verified?.toString() || ''}
                    onChange={(e) => handleFilterChange({ 
                      verified: e.target.value === '' ? undefined : e.target.value === 'true' 
                    })}
                    className="px-3 py-2 border border-gray-300 rounded-md text-sm"
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
                  <AlertCircle className="w-5 h-5" />
                  <div>
                    <h3 className="font-medium">Unable to load brokers</h3>
                    <p className="text-sm text-red-600 mt-1">{error}</p>
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
              <div className="flex justify-between items-center">
                <p className="text-gray-600">
                  {filteredBrokers.length} broker{filteredBrokers.length !== 1 ? 's' : ''} found
                </p>
              </div>

              {filteredBrokers.length === 0 ? (
                <Card>
                  <CardContent className="p-12 text-center">
                    <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No brokers found</h3>
                    <p className="text-gray-600 mb-4">
                      {brokers.length === 0 
                        ? "No brokers are currently available. Please check back later."
                        : "Try adjusting your search criteria to find more brokers."
                      }
                    </p>
                    {filters.search || filters.city || filters.verified !== undefined ? (
                      <Button variant="outline" onClick={clearFilters}>
                        Clear Filters
                      </Button>
                    ) : null}
                  </CardContent>
                </Card>
              ) : (
                <div className={`grid gap-6 ${
                  viewMode === 'grid' 
                    ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' 
                    : 'grid-cols-1'
                }`}>
                  {filteredBrokers.map((broker) => (
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
    <Card className="hover:shadow-lg transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
            {broker.avatar ? (
              <img 
                src={broker.avatar} 
                alt={broker.name}
                className="w-16 h-16 rounded-full object-cover"
              />
            ) : (
              <UserCheck className="w-8 h-8 text-gray-400" />
            )}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-semibold text-gray-900">{broker.name}</h3>
              {broker.isVerified && (
                <Shield className="w-4 h-4 text-green-500" />
              )}
            </div>
            <div className="flex items-center gap-1 mb-2">
              <Star className="w-4 h-4 text-yellow-400 fill-current" />
              <span className="text-sm font-medium">{broker.rating.toFixed(1)}</span>
              <span className="text-sm text-gray-500">({broker.totalReviews} reviews)</span>
            </div>
            <p className="text-sm text-gray-600 mb-3">{broker.bio}</p>
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <div className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                <span>{broker.address?.city}, {broker.address?.state}</span>
              </div>
              <div className="flex items-center gap-1">
                <Award className="w-4 h-4" />
                <span>{broker.experience} years</span>
              </div>
            </div>
            <div className="flex gap-2 mt-4">
              <Button size="sm" variant="primary">
                <Phone className="w-4 h-4 mr-1" />
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
