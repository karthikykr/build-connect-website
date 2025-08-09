'use client';

import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/layout';
import { PropertyCard } from '@/components/features/properties/PropertyCard';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Loading } from '@/components/ui/Loading';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { 
  Plus,
  Search,
  Filter,
  Eye,
  Edit,
  Trash2,
  MoreVertical,
  TrendingUp,
  Calendar,
  DollarSign,
  Home,
  CheckCircle,
  Clock,
  XCircle,
  AlertTriangle
} from 'lucide-react';
import { Property } from '@/types';
import { useAuth } from '@/hooks/useAuth';
import Link from 'next/link';

interface PropertyStats {
  total: number;
  active: number;
  pending: number;
  sold: number;
  totalViews: number;
  totalInquiries: number;
  averagePrice: number;
}

export default function MyListingsPage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [filteredProperties, setFilteredProperties] = useState<Property[]>([]);
  const [stats, setStats] = useState<PropertyStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedProperties, setSelectedProperties] = useState<string[]>([]);
  const { user, isBroker } = useAuth();

  useEffect(() => {
    loadMyProperties();
  }, [user]);

  useEffect(() => {
    filterProperties();
  }, [properties, searchTerm, statusFilter]);

  const loadMyProperties = async () => {
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      const mockProperties: Property[] = [
        {
          id: '1',
          title: 'Premium Residential Plot in Whitefield',
          description: 'Beautiful residential plot with all modern amenities.',
          type: 'residential_plot',
          price: 2500000,
          area: 1200,
          unit: 'sqft',
          location: {
            street: 'Whitefield Main Road',
            city: 'Bangalore',
            state: 'Karnataka',
            pincode: '560066',
            country: 'India',
            latitude: 12.9698,
            longitude: 77.7500,
          },
          images: [{
            id: '1',
            url: '/api/placeholder/400/300',
            thumbnail: '/api/placeholder/200/150',
            isPrimary: true,
          }],
          amenities: ['Water Supply', 'Electricity', 'Road Access'],
          features: [],
          documents: [],
          status: 'active',
          createdAt: '2024-01-15T10:00:00Z',
          updatedAt: '2024-01-20T14:30:00Z',
          views: 156,
          inquiries: 12,
          broker: {
            id: user?.id || '',
            name: user?.name || '',
            email: user?.email || '',
            phone: '+91 9876543210',
            verified: true,
          },
        },
        {
          id: '2',
          title: 'Commercial Plot in Electronic City',
          description: 'Prime commercial plot in IT hub.',
          type: 'commercial_plot',
          price: 5000000,
          area: 2400,
          unit: 'sqft',
          location: {
            street: 'Electronic City Phase 1',
            city: 'Bangalore',
            state: 'Karnataka',
            pincode: '560100',
            country: 'India',
            latitude: 12.8456,
            longitude: 77.6603,
          },
          images: [{
            id: '2',
            url: '/api/placeholder/400/300',
            thumbnail: '/api/placeholder/200/150',
            isPrimary: true,
          }],
          amenities: ['Road Access', 'Electricity', 'Water Supply'],
          features: [],
          documents: [],
          status: 'pending',
          createdAt: '2024-01-18T14:30:00Z',
          updatedAt: '2024-01-18T14:30:00Z',
          views: 89,
          inquiries: 7,
          broker: {
            id: user?.id || '',
            name: user?.name || '',
            email: user?.email || '',
            phone: '+91 9876543210',
            verified: true,
          },
        },
        {
          id: '3',
          title: 'Luxury Villa in HSR Layout',
          description: 'Spacious villa with modern amenities.',
          type: 'villa',
          price: 8500000,
          area: 3200,
          unit: 'sqft',
          location: {
            street: 'HSR Layout Sector 2',
            city: 'Bangalore',
            state: 'Karnataka',
            pincode: '560102',
            country: 'India',
            latitude: 12.9116,
            longitude: 77.6473,
          },
          images: [{
            id: '3',
            url: '/api/placeholder/400/300',
            thumbnail: '/api/placeholder/200/150',
            isPrimary: true,
          }],
          amenities: ['Swimming Pool', 'Garden', 'Parking', 'Security'],
          features: [],
          documents: [],
          status: 'sold',
          createdAt: '2024-01-10T09:15:00Z',
          updatedAt: '2024-01-25T16:45:00Z',
          views: 234,
          inquiries: 18,
          soldDate: '2024-01-25T16:45:00Z',
          broker: {
            id: user?.id || '',
            name: user?.name || '',
            email: user?.email || '',
            phone: '+91 9876543210',
            verified: true,
          },
        }
      ];

      const mockStats: PropertyStats = {
        total: mockProperties.length,
        active: mockProperties.filter(p => p.status === 'active').length,
        pending: mockProperties.filter(p => p.status === 'pending').length,
        sold: mockProperties.filter(p => p.status === 'sold').length,
        totalViews: mockProperties.reduce((sum, p) => sum + (p.views || 0), 0),
        totalInquiries: mockProperties.reduce((sum, p) => sum + (p.inquiries || 0), 0),
        averagePrice: mockProperties.reduce((sum, p) => sum + p.price, 0) / mockProperties.length,
      };

      setProperties(mockProperties);
      setStats(mockStats);
      setLoading(false);
    }, 1000);
  };

  const filterProperties = () => {
    let filtered = [...properties];

    if (searchTerm) {
      filtered = filtered.filter(property =>
        property.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        property.location.city.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(property => property.status === statusFilter);
    }

    setFilteredProperties(filtered);
  };

  const handlePropertyAction = (propertyId: string, action: 'edit' | 'delete' | 'activate' | 'deactivate') => {
    switch (action) {
      case 'edit':
        // Navigate to edit page
        window.location.href = `/properties/${propertyId}/edit`;
        break;
      case 'delete':
        if (confirm('Are you sure you want to delete this property?')) {
          setProperties(prev => prev.filter(p => p.id !== propertyId));
        }
        break;
      case 'activate':
        setProperties(prev => prev.map(p => 
          p.id === propertyId ? { ...p, status: 'active' as const } : p
        ));
        break;
      case 'deactivate':
        setProperties(prev => prev.map(p => 
          p.id === propertyId ? { ...p, status: 'inactive' as const } : p
        ));
        break;
    }
  };

  const handleBulkAction = (action: 'delete' | 'activate' | 'deactivate') => {
    if (selectedProperties.length === 0) return;

    if (action === 'delete' && !confirm(`Delete ${selectedProperties.length} properties?`)) {
      return;
    }

    selectedProperties.forEach(propertyId => {
      handlePropertyAction(propertyId, action);
    });
    
    setSelectedProperties([]);
  };

  const togglePropertySelection = (propertyId: string) => {
    setSelectedProperties(prev =>
      prev.includes(propertyId)
        ? prev.filter(id => id !== propertyId)
        : [...prev, propertyId]
    );
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      active: 'bg-success/10 text-success',
      pending: 'bg-warning/10 text-warning',
      inactive: 'bg-gray-light text-text-secondary',
      sold: 'bg-blue-100 text-blue-800',
      rejected: 'bg-error/10 text-error'
    };

    const icons = {
      active: <CheckCircle className="w-3 h-3" />,
      pending: <Clock className="w-3 h-3" />,
      inactive: <XCircle className="w-3 h-3" />,
      sold: <CheckCircle className="w-3 h-3" />,
      rejected: <AlertTriangle className="w-3 h-3" />
    };

    return (
      <span className={`inline-flex items-center space-x-1 px-2 py-1 rounded-lg text-xs font-medium ${styles[status as keyof typeof styles]}`}>
        {icons[status as keyof typeof icons]}
        <span className="capitalize">{status}</span>
      </span>
    );
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
    { label: 'My Listings', current: true }
  ];

  if (!isBroker()) {
    return (
      <DashboardLayout
        breadcrumbs={breadcrumbs}
        title="Access Denied"
        description="Only brokers can access property listings"
      >
        <div className="text-center py-12">
          <h3 className="text-xl font-semibold text-text-primary mb-2">
            Access Restricted
          </h3>
          <p className="text-text-secondary">
            You need to be a verified broker to manage property listings.
          </p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <ProtectedRoute>
      <DashboardLayout
        breadcrumbs={breadcrumbs}
        title="My Property Listings"
        description="Manage your property listings and track performance"
        actions={
          <Link href="/properties/add">
            <Button variant="primary" leftIcon={<Plus className="w-4 h-4" />}>
              Add Property
            </Button>
          </Link>
        }
      >
        {loading ? (
          <div className="flex items-center justify-center min-h-[400px]">
            <Loading size="lg" text="Loading your properties..." />
          </div>
        ) : (
          <div className="space-y-8">
            {/* Stats Cards */}
            {stats && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card>
                  <CardContent className="p-6 text-center">
                    <Home className="w-8 h-8 text-primary mx-auto mb-3" />
                    <p className="text-2xl font-bold text-text-primary">{stats.total}</p>
                    <p className="text-sm text-text-secondary">Total Properties</p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-6 text-center">
                    <CheckCircle className="w-8 h-8 text-success mx-auto mb-3" />
                    <p className="text-2xl font-bold text-text-primary">{stats.active}</p>
                    <p className="text-sm text-text-secondary">Active Listings</p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-6 text-center">
                    <Eye className="w-8 h-8 text-blue-500 mx-auto mb-3" />
                    <p className="text-2xl font-bold text-text-primary">{stats.totalViews}</p>
                    <p className="text-sm text-text-secondary">Total Views</p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-6 text-center">
                    <DollarSign className="w-8 h-8 text-warning mx-auto mb-3" />
                    <p className="text-2xl font-bold text-text-primary">
                      {formatCurrency(stats.averagePrice)}
                    </p>
                    <p className="text-sm text-text-secondary">Average Price</p>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Filters and Search */}
            <Card>
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
                  <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-4">
                    <Input
                      placeholder="Search properties..."
                      leftIcon={<Search className="w-4 h-4" />}
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="md:w-80"
                    />
                    
                    <select
                      className="form-input"
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                    >
                      <option value="all">All Status</option>
                      <option value="active">Active</option>
                      <option value="pending">Pending</option>
                      <option value="inactive">Inactive</option>
                      <option value="sold">Sold</option>
                    </select>
                  </div>
                  
                  {selectedProperties.length > 0 && (
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-text-secondary">
                        {selectedProperties.length} selected
                      </span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleBulkAction('activate')}
                      >
                        Activate
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleBulkAction('deactivate')}
                      >
                        Deactivate
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleBulkAction('delete')}
                      >
                        Delete
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Properties List */}
            {filteredProperties.length === 0 ? (
              <div className="text-center py-12">
                <Home className="w-16 h-16 text-text-secondary mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-text-primary mb-2">
                  No properties found
                </h3>
                <p className="text-text-secondary mb-6">
                  {properties.length === 0 
                    ? "You haven't listed any properties yet."
                    : "Try adjusting your search or filters."
                  }
                </p>
                <Link href="/properties/add">
                  <Button variant="primary">
                    Add Your First Property
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredProperties.map((property) => (
                  <Card key={property.id} className="overflow-hidden">
                    <CardContent className="p-0">
                      <div className="flex items-center justify-between p-4">
                        <div className="flex items-center space-x-4">
                          <input
                            type="checkbox"
                            checked={selectedProperties.includes(property.id)}
                            onChange={() => togglePropertySelection(property.id)}
                          />
                          
                          <div className="flex items-center space-x-4">
                            <div className="w-20 h-20 bg-gray-light rounded-lg overflow-hidden">
                              <img
                                src={property.images[0]?.thumbnail || '/api/placeholder/80/80'}
                                alt={property.title}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            
                            <div>
                              <h3 className="font-semibold text-text-primary">{property.title}</h3>
                              <p className="text-sm text-text-secondary">
                                {property.location.city}, {property.location.state}
                              </p>
                              <div className="flex items-center space-x-4 mt-1">
                                <span className="text-lg font-bold text-primary">
                                  {formatCurrency(property.price)}
                                </span>
                                <span className="text-sm text-text-secondary">
                                  {property.area} {property.unit}
                                </span>
                                {getStatusBadge(property.status || 'active')}
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-4">
                          <div className="text-right text-sm text-text-secondary">
                            <div className="flex items-center space-x-1">
                              <Eye className="w-3 h-3" />
                              <span>{property.views || 0} views</span>
                            </div>
                            <div className="flex items-center space-x-1 mt-1">
                              <TrendingUp className="w-3 h-3" />
                              <span>{property.inquiries || 0} inquiries</span>
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-1">
                            <Link href={`/properties/${property.id}`}>
                              <Button variant="ghost" size="icon" title="View">
                                <Eye className="w-4 h-4" />
                              </Button>
                            </Link>
                            <Link href={`/properties/${property.id}/edit`}>
                              <Button variant="ghost" size="icon" title="Edit">
                                <Edit className="w-4 h-4" />
                              </Button>
                            </Link>
                            <Button
                              variant="ghost"
                              size="icon"
                              title="Delete"
                              onClick={() => handlePropertyAction(property.id, 'delete')}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}
      </DashboardLayout>
    </ProtectedRoute>
  );
}
