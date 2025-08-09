'use client';

import { useState, useEffect } from 'react';
import { MainLayout } from '@/components/layout';
import { MapView } from '@/components/features/map/MapView';
import { PropertyCard } from '@/components/features/properties/PropertyCard';
import { PropertyFilters, PropertyFilters as FilterType } from '@/components/features/properties/PropertyFilters';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Loading } from '@/components/ui/Loading';
import { Breadcrumb } from '@/components/layout/Breadcrumb';
import { 
  Search, 
  Filter, 
  MapPin,
  List,
  Grid,
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
  Maximize,
  Minimize
} from 'lucide-react';
import { Property } from '@/types';
import { useAuth } from '@/hooks/useAuth';
import Link from 'next/link';

// Mock data for demonstration
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
    images: [
      {
        id: '1',
        url: '/api/placeholder/400/300',
        thumbnail: '/api/placeholder/200/150',
        isPrimary: true,
      },
    ],
    amenities: ['Water Supply', 'Electricity', 'Road Access'],
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
    images: [
      {
        id: '2',
        url: '/api/placeholder/400/300',
        thumbnail: '/api/placeholder/200/150',
        isPrimary: true,
      },
    ],
    amenities: ['Water Supply', 'Electricity', 'Road Access'],
    features: [],
    documents: [],
    broker: {
      id: '2',
      name: 'Priya Sharma',
      email: 'priya@example.com',
      phone: '9876543211',
      role: 'broker',
      isVerified: true,
      createdAt: '2024-01-01',
      updatedAt: '2024-01-01',
      experience: 8,
      serviceAreas: ['Bangalore'],
      specializations: ['commercial_plot'],
      rating: 4.8,
      reviewCount: 42,
      totalSales: 85,
      commission: 2.5,
      portfolio: [],
      isApproved: true,
    },
    status: 'available',
    isVerified: true,
    views: 189,
    createdAt: '2024-01-10T10:00:00Z',
    updatedAt: '2024-01-10T10:00:00Z',
  },
];

export default function MapPage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [filteredProperties, setFilteredProperties] = useState<Property[]>([]);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [showPropertyList, setShowPropertyList] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [savedProperties, setSavedProperties] = useState<string[]>([]);
  const { isAuthenticated } = useAuth();

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

    setFilteredProperties(filtered);
  };

  const handlePropertySelect = (property: Property) => {
    setSelectedProperty(property);
  };

  const handleSaveProperty = (propertyId: string) => {
    setSavedProperties(prev =>
      prev.includes(propertyId)
        ? prev.filter(id => id !== propertyId)
        : [...prev, propertyId]
    );
  };

  const handleShareProperty = (propertyId: string) => {
    navigator.share?.({
      title: 'Property Listing',
      url: `${window.location.origin}/properties/${propertyId}`,
    });
  };

  const breadcrumbs = [
    { label: 'Map Explorer', current: true }
  ];

  if (loading) {
    return (
      <MainLayout>
        <div className="container-custom py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <Loading size="lg" text="Loading map..." />
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className={`${isFullscreen ? 'fixed inset-0 z-50 bg-white' : 'container-custom py-8'}`}>
        {!isFullscreen && (
          <>
            {/* Breadcrumbs */}
            <Breadcrumb items={breadcrumbs} className="mb-6" />

            {/* Page Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
              <div>
                <h1 className="text-3xl font-bold text-text-primary mb-2">
                  Map Explorer
                </h1>
                <p className="text-text-secondary">
                  Explore {filteredProperties.length} properties on the map
                </p>
              </div>
              
              <div className="flex items-center space-x-3 mt-4 sm:mt-0">
                {/* Filters Toggle */}
                <Button
                  variant="outline"
                  onClick={() => setShowFilters(!showFilters)}
                  leftIcon={<SlidersHorizontal className="w-4 h-4" />}
                >
                  Filters
                </Button>

                {/* Property List Toggle */}
                <Button
                  variant="outline"
                  onClick={() => setShowPropertyList(!showPropertyList)}
                  leftIcon={showPropertyList ? <Minimize className="w-4 h-4" /> : <List className="w-4 h-4" />}
                >
                  {showPropertyList ? 'Hide' : 'Show'} List
                </Button>

                {/* Fullscreen Toggle */}
                <Button
                  variant="outline"
                  onClick={() => setIsFullscreen(!isFullscreen)}
                  leftIcon={<Maximize className="w-4 h-4" />}
                >
                  Fullscreen
                </Button>

                {/* Properties Link */}
                <Link href="/properties">
                  <Button variant="primary" leftIcon={<Grid className="w-4 h-4" />}>
                    Grid View
                  </Button>
                </Link>
              </div>
            </div>
          </>
        )}

        <div className={`flex ${isFullscreen ? 'h-screen' : 'h-[600px]'} gap-4`}>
          {/* Filters Sidebar */}
          {showFilters && !isFullscreen && (
            <div className="w-80 flex-shrink-0">
              <PropertyFilters onFiltersChange={handleFiltersChange} />
            </div>
          )}

          {/* Map Container */}
          <div className="flex-1 relative">
            <MapView
              properties={filteredProperties}
              selectedProperty={selectedProperty}
              onPropertySelect={handlePropertySelect}
              className="w-full h-full"
            />

            {/* Fullscreen Controls */}
            {isFullscreen && (
              <div className="absolute top-4 left-4 flex items-center space-x-2">
                <Button
                  variant="outline"
                  onClick={() => setIsFullscreen(false)}
                  leftIcon={<Minimize className="w-4 h-4" />}
                >
                  Exit Fullscreen
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setShowPropertyList(!showPropertyList)}
                  leftIcon={showPropertyList ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
                >
                  {showPropertyList ? 'Hide' : 'Show'} Properties
                </Button>
              </div>
            )}
          </div>

          {/* Property List Sidebar */}
          {showPropertyList && (
            <div className={`${isFullscreen ? 'w-96' : 'w-80'} flex-shrink-0 flex flex-col`}>
              <Card className="h-full">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>Properties ({filteredProperties.length})</span>
                    {selectedProperty && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedProperty(null)}
                      >
                        Clear Selection
                      </Button>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex-1 overflow-y-auto p-0">
                  {filteredProperties.length === 0 ? (
                    <div className="p-6 text-center">
                      <MapPin className="w-12 h-12 text-text-secondary mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-text-primary mb-2">
                        No properties found
                      </h3>
                      <p className="text-text-secondary">
                        Try adjusting your filters or search area
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4 p-4">
                      {filteredProperties.map((property) => (
                        <div
                          key={property.id}
                          className={`cursor-pointer transition-all duration-200 ${
                            selectedProperty?.id === property.id
                              ? 'ring-2 ring-primary rounded-lg'
                              : 'hover:shadow-md'
                          }`}
                          onClick={() => handlePropertySelect(property)}
                        >
                          <PropertyCard
                            property={property}
                            onSave={handleSaveProperty}
                            onShare={handleShareProperty}
                            isSaved={savedProperties.includes(property.id)}
                            className="border-0 shadow-sm"
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          )}
        </div>

        {/* Selected Property Details */}
        {selectedProperty && !isFullscreen && (
          <div className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Selected Property</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold mb-1">
                      {selectedProperty.title}
                    </h3>
                    <p className="text-text-secondary flex items-center">
                      <MapPin className="w-4 h-4 mr-1" />
                      {selectedProperty.location.street}, {selectedProperty.location.city}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-bold text-primary">
                      ₹{selectedProperty.price.toLocaleString()}
                    </p>
                    <Link href={`/properties/${selectedProperty.id}`}>
                      <Button variant="primary" size="sm">
                        View Details
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </MainLayout>
  );
}
