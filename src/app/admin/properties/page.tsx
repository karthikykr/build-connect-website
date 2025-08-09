'use client';

import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/layout';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Loading } from '@/components/ui/Loading';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { 
  Home, 
  Search, 
  Filter,
  Eye,
  CheckCircle,
  XCircle,
  AlertTriangle,
  MapPin,
  Calendar,
  DollarSign,
  User,
  Flag,
  Edit,
  Trash2
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { formatCurrency } from '@/lib/utils';

interface PropertyListing {
  id: string;
  title: string;
  type: string;
  price: number;
  area: number;
  unit: string;
  location: {
    city: string;
    state: string;
  };
  status: 'pending' | 'approved' | 'rejected' | 'flagged';
  broker: {
    name: string;
    email: string;
  };
  createdAt: string;
  images: number;
  reports: number;
  views: number;
}

export default function PropertyModeration() {
  const [properties, setProperties] = useState<PropertyListing[]>([]);
  const [filteredProperties, setFilteredProperties] = useState<PropertyListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [selectedProperties, setSelectedProperties] = useState<string[]>([]);
  const { isAdmin } = useAuth();

  useEffect(() => {
    // Simulate API call to fetch properties
    setTimeout(() => {
      const mockProperties: PropertyListing[] = [
        {
          id: '1',
          title: 'Premium Residential Plot in Whitefield',
          type: 'residential_plot',
          price: 2500000,
          area: 1200,
          unit: 'sqft',
          location: { city: 'Bangalore', state: 'Karnataka' },
          status: 'pending',
          broker: { name: 'Rajesh Kumar', email: 'rajesh@example.com' },
          createdAt: '2024-01-20T10:00:00Z',
          images: 5,
          reports: 0,
          views: 45
        },
        {
          id: '2',
          title: 'Commercial Plot in Electronic City',
          type: 'commercial_plot',
          price: 5000000,
          area: 2400,
          unit: 'sqft',
          location: { city: 'Bangalore', state: 'Karnataka' },
          status: 'approved',
          broker: { name: 'Priya Sharma', email: 'priya@example.com' },
          createdAt: '2024-01-18T14:30:00Z',
          images: 8,
          reports: 0,
          views: 123
        },
        {
          id: '3',
          title: 'Suspicious Property Listing',
          type: 'villa',
          price: 500000,
          area: 3000,
          unit: 'sqft',
          location: { city: 'Mumbai', state: 'Maharashtra' },
          status: 'flagged',
          broker: { name: 'Unknown User', email: 'fake@example.com' },
          createdAt: '2024-01-19T16:45:00Z',
          images: 2,
          reports: 3,
          views: 12
        },
        {
          id: '4',
          title: 'Rejected Property - Incomplete Info',
          type: 'apartment',
          price: 1800000,
          area: 1000,
          unit: 'sqft',
          location: { city: 'Pune', state: 'Maharashtra' },
          status: 'rejected',
          broker: { name: 'Test Broker', email: 'test@example.com' },
          createdAt: '2024-01-17T09:15:00Z',
          images: 1,
          reports: 0,
          views: 8
        }
      ];

      setProperties(mockProperties);
      setFilteredProperties(mockProperties);
      setLoading(false);
    }, 1000);
  }, []);

  useEffect(() => {
    let filtered = [...properties];

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(property =>
        property.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        property.location.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
        property.broker.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(property => property.status === statusFilter);
    }

    // Apply type filter
    if (typeFilter !== 'all') {
      filtered = filtered.filter(property => property.type === typeFilter);
    }

    setFilteredProperties(filtered);
  }, [properties, searchTerm, statusFilter, typeFilter]);

  const handlePropertyAction = (propertyId: string, action: 'approve' | 'reject' | 'flag') => {
    setProperties(prev => prev.map(property => {
      if (property.id === propertyId) {
        switch (action) {
          case 'approve':
            return { ...property, status: 'approved' as const };
          case 'reject':
            return { ...property, status: 'rejected' as const };
          case 'flag':
            return { ...property, status: 'flagged' as const };
          default:
            return property;
        }
      }
      return property;
    }));
  };

  const handleBulkAction = (action: 'approve' | 'reject' | 'delete') => {
    selectedProperties.forEach(propertyId => {
      if (action === 'delete') {
        setProperties(prev => prev.filter(p => p.id !== propertyId));
      } else {
        handlePropertyAction(propertyId, action);
      }
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

  const selectAllProperties = () => {
    if (selectedProperties.length === filteredProperties.length) {
      setSelectedProperties([]);
    } else {
      setSelectedProperties(filteredProperties.map(property => property.id));
    }
  };

  const getStatusBadge = (status: PropertyListing['status']) => {
    const styles = {
      pending: 'bg-warning/10 text-warning',
      approved: 'bg-success/10 text-success',
      rejected: 'bg-error/10 text-error',
      flagged: 'bg-red-100 text-red-800'
    };

    const icons = {
      pending: <AlertTriangle className="w-3 h-3" />,
      approved: <CheckCircle className="w-3 h-3" />,
      rejected: <XCircle className="w-3 h-3" />,
      flagged: <Flag className="w-3 h-3" />
    };

    return (
      <span className={`inline-flex items-center space-x-1 px-2 py-1 rounded-lg text-xs font-medium ${styles[status]}`}>
        {icons[status]}
        <span className="capitalize">{status}</span>
      </span>
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const breadcrumbs = [
    { label: 'Admin', href: '/admin' },
    { label: 'Property Moderation', current: true }
  ];

  if (!isAdmin()) {
    return <div>Access Denied</div>;
  }

  return (
    <ProtectedRoute>
      <DashboardLayout
        breadcrumbs={breadcrumbs}
        title="Property Moderation"
        description="Review and moderate property listings"
        actions={
          <div className="flex items-center space-x-2">
            <Button variant="outline" leftIcon={<Filter className="w-4 h-4" />}>
              Export
            </Button>
            <Button variant="primary" leftIcon={<Home className="w-4 h-4" />}>
              Add Property
            </Button>
          </div>
        }
      >
        {loading ? (
          <div className="flex items-center justify-center min-h-[400px]">
            <Loading size="lg" text="Loading properties..." />
          </div>
        ) : (
          <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4 text-center">
                  <AlertTriangle className="w-6 h-6 text-warning mx-auto mb-2" />
                  <p className="text-lg font-bold text-text-primary">
                    {properties.filter(p => p.status === 'pending').length}
                  </p>
                  <p className="text-sm text-text-secondary">Pending Review</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <CheckCircle className="w-6 h-6 text-success mx-auto mb-2" />
                  <p className="text-lg font-bold text-text-primary">
                    {properties.filter(p => p.status === 'approved').length}
                  </p>
                  <p className="text-sm text-text-secondary">Approved</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <Flag className="w-6 h-6 text-error mx-auto mb-2" />
                  <p className="text-lg font-bold text-text-primary">
                    {properties.filter(p => p.status === 'flagged').length}
                  </p>
                  <p className="text-sm text-text-secondary">Flagged</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <XCircle className="w-6 h-6 text-text-secondary mx-auto mb-2" />
                  <p className="text-lg font-bold text-text-primary">
                    {properties.filter(p => p.status === 'rejected').length}
                  </p>
                  <p className="text-sm text-text-secondary">Rejected</p>
                </CardContent>
              </Card>
            </div>

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
                      <option value="pending">Pending</option>
                      <option value="approved">Approved</option>
                      <option value="rejected">Rejected</option>
                      <option value="flagged">Flagged</option>
                    </select>
                    
                    <select
                      className="form-input"
                      value={typeFilter}
                      onChange={(e) => setTypeFilter(e.target.value)}
                    >
                      <option value="all">All Types</option>
                      <option value="residential_plot">Residential Plot</option>
                      <option value="commercial_plot">Commercial Plot</option>
                      <option value="villa">Villa</option>
                      <option value="apartment">Apartment</option>
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
                        onClick={() => handleBulkAction('approve')}
                      >
                        Approve
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleBulkAction('reject')}
                      >
                        Reject
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Properties Table */}
            <Card>
              <CardHeader>
                <CardTitle>
                  Properties ({filteredProperties.length})
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-light">
                      <tr>
                        <th className="text-left p-4">
                          <input
                            type="checkbox"
                            checked={selectedProperties.length === filteredProperties.length && filteredProperties.length > 0}
                            onChange={selectAllProperties}
                          />
                        </th>
                        <th className="text-left p-4 font-medium">Property</th>
                        <th className="text-left p-4 font-medium">Type</th>
                        <th className="text-left p-4 font-medium">Price</th>
                        <th className="text-left p-4 font-medium">Status</th>
                        <th className="text-left p-4 font-medium">Broker</th>
                        <th className="text-left p-4 font-medium">Reports</th>
                        <th className="text-left p-4 font-medium">Created</th>
                        <th className="text-left p-4 font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredProperties.map((property) => (
                        <tr key={property.id} className="border-b border-gray-light hover:bg-gray-light/50">
                          <td className="p-4">
                            <input
                              type="checkbox"
                              checked={selectedProperties.includes(property.id)}
                              onChange={() => togglePropertySelection(property.id)}
                            />
                          </td>
                          <td className="p-4">
                            <div className="flex items-center space-x-3">
                              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                                <Home className="w-6 h-6 text-primary" />
                              </div>
                              <div>
                                <p className="font-medium text-text-primary line-clamp-1">
                                  {property.title}
                                </p>
                                <div className="flex items-center text-sm text-text-secondary">
                                  <MapPin className="w-3 h-3 mr-1" />
                                  {property.location.city}, {property.location.state}
                                </div>
                                <p className="text-xs text-text-secondary">
                                  {property.area} {property.unit} • {property.images} images • {property.views} views
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="p-4">
                            <span className="px-2 py-1 bg-gray-light rounded text-xs">
                              {property.type.replace('_', ' ').toUpperCase()}
                            </span>
                          </td>
                          <td className="p-4 font-medium text-text-primary">
                            {formatCurrency(property.price)}
                          </td>
                          <td className="p-4">
                            {getStatusBadge(property.status)}
                          </td>
                          <td className="p-4">
                            <div className="flex items-center space-x-2">
                              <User className="w-4 h-4 text-text-secondary" />
                              <div>
                                <p className="text-sm font-medium">{property.broker.name}</p>
                                <p className="text-xs text-text-secondary">{property.broker.email}</p>
                              </div>
                            </div>
                          </td>
                          <td className="p-4">
                            {property.reports > 0 ? (
                              <span className="text-error font-medium">{property.reports}</span>
                            ) : (
                              <span className="text-text-secondary">0</span>
                            )}
                          </td>
                          <td className="p-4 text-sm text-text-secondary">
                            {formatDate(property.createdAt)}
                          </td>
                          <td className="p-4">
                            <div className="flex items-center space-x-1">
                              <Button variant="ghost" size="icon" title="View">
                                <Eye className="w-4 h-4" />
                              </Button>
                              {property.status === 'pending' && (
                                <>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    title="Approve"
                                    onClick={() => handlePropertyAction(property.id, 'approve')}
                                  >
                                    <CheckCircle className="w-4 h-4 text-success" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    title="Reject"
                                    onClick={() => handlePropertyAction(property.id, 'reject')}
                                  >
                                    <XCircle className="w-4 h-4 text-error" />
                                  </Button>
                                </>
                              )}
                              <Button variant="ghost" size="icon" title="Edit">
                                <Edit className="w-4 h-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </DashboardLayout>
    </ProtectedRoute>
  );
}
