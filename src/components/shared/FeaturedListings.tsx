'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { ChevronLeft, ChevronRight, MapPin, Home, Eye } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import { propertiesService } from '@/services/properties.service';

interface Property {
  id: string;
  title: string;
  price: number;
  location: string;
  type: string;
  area: number;
  unit: string;
  image: string;
  views: number;
  isVerified: boolean;
}

interface FeaturedListingsProps {
  properties?: Property[];
  className?: string;
}

// Hook to fetch featured properties from backend
const useFeaturedProperties = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeaturedProperties = async () => {
      try {
        setLoading(true);
        const response = await propertiesService.getFeaturedProperties(6);

        if (response.success && response.data) {
          // Transform backend property data to component format
          const transformedProperties = response.data.map((property: any) => ({
            id: property._id || property.id,
            title: property.title || property.name,
            price: property.price || 0,
            location:
              property.location?.address ||
              property.location ||
              'Location not specified',
            type: property.propertyType || property.type || 'Property',
            area: property.area || 0,
            unit: property.areaUnit || 'sqft',
            image: property.images?.[0] || '/api/placeholder/400/300',
            views: property.views || 0,
            isVerified: property.isVerified || false,
          }));
          setProperties(transformedProperties);
        } else {
          setProperties([]);
        }
      } catch (error) {
        console.error('Error fetching featured properties:', error);
        setProperties([]);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedProperties();
  }, []);

  return { properties, loading };
};

export function FeaturedListings({
  properties: propProperties,
  className,
}: FeaturedListingsProps) {
  const { properties: fetchedProperties, loading } = useFeaturedProperties();

  // Use provided properties or fetched properties
  const properties = propProperties || fetchedProperties;
  const [currentIndex, setCurrentIndex] = useState(0);
  const itemsPerView = 3;
  const maxIndex = Math.max(0, properties.length - itemsPerView);

  const nextSlide = () => {
    setCurrentIndex(prev => Math.min(prev + 1, maxIndex));
  };

  const prevSlide = () => {
    setCurrentIndex(prev => Math.max(prev - 1, 0));
  };

  return (
    <div className={className}>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="mb-2 text-2xl font-bold text-text-primary">
            Featured Properties
          </h2>
          <p className="text-text-secondary">
            Discover premium properties near you
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="icon"
            onClick={prevSlide}
            disabled={currentIndex === 0}
            className="h-10 w-10"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={nextSlide}
            disabled={currentIndex >= maxIndex}
            className="h-10 w-10"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="overflow-hidden">
        <div
          className="flex transition-transform duration-300 ease-in-out"
          style={{
            transform: `translateX(-${currentIndex * (100 / itemsPerView)}%)`,
          }}
        >
          {properties.map(property => (
            <div key={property.id} className="w-1/3 flex-shrink-0 px-3">
              <Card className="overflow-hidden transition-shadow duration-300 hover:shadow-card-hover">
                <div className="relative">
                  <div className="relative aspect-video overflow-hidden bg-gray-light">
                    {/* Placeholder for property image */}
                    <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-primary/20 to-secondary/20">
                      <Home className="h-12 w-12 text-primary/50" />
                    </div>

                    {/* Verification Badge */}
                    {property.isVerified && (
                      <div className="absolute left-3 top-3 rounded-lg bg-success px-2 py-1 text-xs font-medium text-white">
                        ✓ Verified
                      </div>
                    )}

                    {/* Views Count */}
                    <div className="absolute right-3 top-3 flex items-center rounded-lg bg-black/50 px-2 py-1 text-xs text-white">
                      <Eye className="mr-1 h-3 w-3" />
                      {property.views}
                    </div>
                  </div>
                </div>

                <CardContent className="p-4">
                  <div className="mb-3">
                    <h3 className="mb-1 line-clamp-1 font-semibold text-text-primary">
                      {property.title}
                    </h3>
                    <div className="mb-2 flex items-center text-sm text-text-secondary">
                      <MapPin className="mr-1 h-4 w-4" />
                      {property.location}
                    </div>
                    <p className="inline-block rounded bg-gray-light px-2 py-1 text-xs text-text-secondary">
                      {property.type}
                    </p>
                  </div>

                  <div className="mb-4 flex items-center justify-between">
                    <div>
                      <p className="text-lg font-bold text-primary">
                        {formatCurrency(property.price)}
                      </p>
                      <p className="text-sm text-text-secondary">
                        {property.area} {property.unit}
                      </p>
                    </div>
                  </div>

                  <Link href={`/properties/${property.id}`}>
                    <Button variant="primary" className="w-full">
                      View Details
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      </div>

      {/* View All Button */}
      <div className="mt-6 text-center">
        <Link href="/properties">
          <Button variant="outline">View All Properties</Button>
        </Link>
      </div>
    </div>
  );
}
