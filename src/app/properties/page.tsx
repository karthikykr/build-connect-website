'use client';

import { useState, useEffect } from 'react';
import { MainLayout } from '@/components/layout';
import { PropertyCard } from '@/components/features/properties/PropertyCard';
import { PropertyFilters, PropertyFilters as FilterType } from '@/components/features/properties/PropertyFilters';
import { Button } from '@/components/ui/Button';
import { Loading } from '@/components/ui/Loading';
import { Breadcrumb } from '@/components/layout/Breadcrumb';
import { 
  Grid, 
  List, 
  SlidersHorizontal,
  Plus,
  MapPin
} from 'lucide-react';
import { Property } from '@/types';
import { useAuth } from '@/hooks/useAuth';
import Link from 'next/link';

// Mock data for demonstration
const mockProperties: Property[] = [
  {
    id: '1',
    title: 'Premium Residential Plot in Whitefield',
    description: 'Beautiful residential plot with all modern amenities and excellent connectivity.',
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
    images: [
      {
        id: '1',
        url: '/api/placeholder/400/300',
        thumbnail: '/api/placeholder/200/150',
        isPrimary: true,
      },
    ],
    amenities: ['Water Supply', 'Electricity', 'Road Access', 'Drainage'],
    features: [],
    documents: [],
    broker: {
      id: '1',
      name: 'Rajesh Kumar',
      email: 'rajesh@example.com',
      phone: '9876543210',
      role: 'broker',
      isVerified: true,
      createdAt: '2024-01-01',
      updatedAt: '2024-01-01',
      experience: 5,
      serviceAreas: ['Bangalore'],
      specializations: ['residential_plot'],
      rating: 4.5,
      reviewCount: 25,
      totalSales: 50,
      commission: 2,
      portfolio: [],
      isApproved: true,
    },
    status: 'available',
    isVerified: true,
    views: 245,
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z',
  },
  // Add more mock properties...
];

export default function PropertiesPage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [filteredProperties, setFilteredProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [savedProperties, setSavedProperties] = useState<string[]>([]);
  const { isAuthenticated, isBroker } = useAuth();

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setProperties(mockProperties);
      setFilteredProperties(mockProperties);
      setLoading(false);
    }, 1000);
  }, []);

  const handleFiltersChange = (filters: FilterType) => {
    let filtered = [...properties];

    // Apply search filter
    if (filters.search) {
      filtered = filtered.filter(property =>
        property.title.toLowerCase().includes(filters.search!.toLowerCase()) ||
        property.location.city.toLowerCase().includes(filters.search!.toLowerCase())
      );
    }

    // Apply location filter
    if (filters.location) {
      filtered = filtered.filter(property =>
        property.location.city.toLowerCase().includes(filters.location!.toLowerCase()) ||
        property.location.street.toLowerCase().includes(filters.location!.toLowerCase())
      );
    }

    // Apply property type filter
    if (filters.propertyType) {
      filtered = filtered.filter(property => property.type === filters.propertyType);
    }

    // Apply price filters
    if (filters.minPrice) {
      filtered = filtered.filter(property => property.price >= filters.minPrice!);
    }
    if (filters.maxPrice) {
      filtered = filtered.filter(property => property.price <= filters.maxPrice!);
    }

    // Apply area filters
    if (filters.minArea) {
      filtered = filtered.filter(property => property.area >= filters.minArea!);
    }
    if (filters.maxArea) {
      filtered = filtered.filter(property => property.area <= filters.maxArea!);
    }

    // Apply verified filter
    if (filters.isVerified) {
      filtered = filtered.filter(property => property.isVerified);
    }

    // Apply amenities filter
    if (filters.amenities && filters.amenities.length > 0) {
      filtered = filtered.filter(property =>
        filters.amenities!.every(amenity => property.amenities.includes(amenity))
      );
    }

    setFilteredProperties(filtered);
  };

  const handleSaveProperty = (propertyId: string) => {
    setSavedProperties(prev =>
      prev.includes(propertyId)
        ? prev.filter(id => id !== propertyId)
        : [...prev, propertyId]
    );
  };

  const handleShareProperty = (propertyId: string) => {
    // Implement share functionality
    navigator.share?.({
      title: 'Property Listing',
      url: `${window.location.origin}/properties/${propertyId}`,
    });
  };

  const breadcrumbs = [
    { label: 'Properties', current: true }
  ];

  if (loading) {
    return (
      <MainLayout>
        <div className="container-custom py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <Loading size="lg" text="Loading properties..." />
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="container-custom py-8">
        {/* Breadcrumbs */}
        <Breadcrumb items={breadcrumbs} className="mb-6" />

        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-text-primary mb-2">
              Properties
            </h1>
            <p className="text-text-secondary">
              Discover {filteredProperties.length} properties available for you
            </p>
          </div>
          
          <div className="flex items-center space-x-3 mt-4 sm:mt-0">
            {/* View Mode Toggle */}
            <div className="flex items-center bg-gray-light rounded-lg p-1">
              <Button
                variant={viewMode === 'grid' ? 'primary' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('grid')}
              >
                <Grid className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'primary' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('list')}
              >
                <List className="w-4 h-4" />
              </Button>
            </div>

            {/* Filters Toggle */}
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              leftIcon={<SlidersHorizontal className="w-4 h-4" />}
            >
              Filters
            </Button>

            {/* Map View */}
            <Link href="/map">
              <Button variant="outline" leftIcon={<MapPin className="w-4 h-4" />}>
                Map View
              </Button>
            </Link>

            {/* Add Property (for brokers) */}
            {isAuthenticated && isBroker() && (
              <Link href="/properties/add">
                <Button variant="primary" leftIcon={<Plus className="w-4 h-4" />}>
                  Add Property
                </Button>
              </Link>
            )}
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          {showFilters && (
            <div className="lg:w-80">
              <PropertyFilters onFiltersChange={handleFiltersChange} />
            </div>
          )}

          {/* Properties Grid/List */}
          <div className="flex-1">
            {filteredProperties.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-24 h-24 bg-gray-light rounded-full flex items-center justify-center mx-auto mb-4">
                  <MapPin className="w-12 h-12 text-text-secondary" />
                </div>
                <h3 className="text-xl font-semibold text-text-primary mb-2">
                  No properties found
                </h3>
                <p className="text-text-secondary mb-6">
                  Try adjusting your filters or search criteria
                </p>
                <Button variant="primary" onClick={() => handleFiltersChange({})}>
                  Clear Filters
                </Button>
              </div>
            ) : (
              <div className={
                viewMode === 'grid'
                  ? 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6'
                  : 'space-y-6'
              }>
                {filteredProperties.map((property) => (
                  <PropertyCard
                    key={property.id}
                    property={property}
                    onSave={handleSaveProperty}
                    onShare={handleShareProperty}
                    isSaved={savedProperties.includes(property.id)}
                    className={viewMode === 'list' ? 'flex' : ''}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
