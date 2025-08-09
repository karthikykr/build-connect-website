'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { 
  Search, 
  Filter, 
  X, 
  MapPin,
  Home,
  DollarSign,
  Maximize
} from 'lucide-react';
import { PROPERTY_TYPES, AREA_UNITS, INDIAN_STATES } from '@/lib/constants';

interface PropertyFiltersProps {
  onFiltersChange: (filters: PropertyFilters) => void;
  className?: string;
}

export interface PropertyFilters {
  search?: string;
  location?: string;
  state?: string;
  propertyType?: string;
  minPrice?: number;
  maxPrice?: number;
  minArea?: number;
  maxArea?: number;
  areaUnit?: string;
  isVerified?: boolean;
  amenities?: string[];
}

export function PropertyFilters({ onFiltersChange, className }: PropertyFiltersProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [filters, setFilters] = useState<PropertyFilters>({});

  const updateFilters = (newFilters: Partial<PropertyFilters>) => {
    const updatedFilters = { ...filters, ...newFilters };
    setFilters(updatedFilters);
    onFiltersChange(updatedFilters);
  };

  const clearFilters = () => {
    setFilters({});
    onFiltersChange({});
  };

  const hasActiveFilters = Object.keys(filters).some(key => 
    filters[key as keyof PropertyFilters] !== undefined && 
    filters[key as keyof PropertyFilters] !== ''
  );

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center">
            <Filter className="w-5 h-5 mr-2" />
            Filters
          </CardTitle>
          <div className="flex items-center space-x-2">
            {hasActiveFilters && (
              <Button variant="ghost" size="sm" onClick={clearFilters}>
                <X className="w-4 h-4 mr-1" />
                Clear
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              {isExpanded ? 'Less' : 'More'} Filters
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        {/* Search */}
        <div className="mb-4">
          <Input
            placeholder="Search properties..."
            leftIcon={<Search className="w-4 h-4" />}
            value={filters.search || ''}
            onChange={(e) => updateFilters({ search: e.target.value })}
          />
        </div>

        {/* Quick Filters */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          {/* Location */}
          <div>
            <label className="form-label">Location</label>
            <Input
              placeholder="City, Area..."
              leftIcon={<MapPin className="w-4 h-4" />}
              value={filters.location || ''}
              onChange={(e) => updateFilters({ location: e.target.value })}
            />
          </div>

          {/* Property Type */}
          <div>
            <label className="form-label">Property Type</label>
            <select
              className="form-input"
              value={filters.propertyType || ''}
              onChange={(e) => updateFilters({ propertyType: e.target.value })}
            >
              <option value="">All Types</option>
              {PROPERTY_TYPES.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>

          {/* Price Range */}
          <div>
            <label className="form-label">Max Price</label>
            <Input
              type="number"
              placeholder="Max price"
              leftIcon={<DollarSign className="w-4 h-4" />}
              value={filters.maxPrice || ''}
              onChange={(e) => updateFilters({ maxPrice: Number(e.target.value) || undefined })}
            />
          </div>

          {/* Area */}
          <div>
            <label className="form-label">Max Area</label>
            <Input
              type="number"
              placeholder="Max area"
              leftIcon={<Maximize className="w-4 h-4" />}
              value={filters.maxArea || ''}
              onChange={(e) => updateFilters({ maxArea: Number(e.target.value) || undefined })}
            />
          </div>
        </div>

        {/* Expanded Filters */}
        {isExpanded && (
          <div className="border-t border-gray-light pt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
              {/* State */}
              <div>
                <label className="form-label">State</label>
                <select
                  className="form-input"
                  value={filters.state || ''}
                  onChange={(e) => updateFilters({ state: e.target.value })}
                >
                  <option value="">All States</option>
                  {INDIAN_STATES.map((state) => (
                    <option key={state} value={state}>
                      {state}
                    </option>
                  ))}
                </select>
              </div>

              {/* Min Price */}
              <div>
                <label className="form-label">Min Price</label>
                <Input
                  type="number"
                  placeholder="Min price"
                  leftIcon={<DollarSign className="w-4 h-4" />}
                  value={filters.minPrice || ''}
                  onChange={(e) => updateFilters({ minPrice: Number(e.target.value) || undefined })}
                />
              </div>

              {/* Min Area */}
              <div>
                <label className="form-label">Min Area</label>
                <Input
                  type="number"
                  placeholder="Min area"
                  leftIcon={<Maximize className="w-4 h-4" />}
                  value={filters.minArea || ''}
                  onChange={(e) => updateFilters({ minArea: Number(e.target.value) || undefined })}
                />
              </div>

              {/* Area Unit */}
              <div>
                <label className="form-label">Area Unit</label>
                <select
                  className="form-input"
                  value={filters.areaUnit || ''}
                  onChange={(e) => updateFilters({ areaUnit: e.target.value })}
                >
                  <option value="">All Units</option>
                  {AREA_UNITS.map((unit) => (
                    <option key={unit.value} value={unit.value}>
                      {unit.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Verified Only */}
              <div className="flex items-center">
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filters.isVerified || false}
                    onChange={(e) => updateFilters({ isVerified: e.target.checked })}
                    className="mr-2"
                  />
                  <span className="text-sm font-medium text-text-primary">
                    Verified Properties Only
                  </span>
                </label>
              </div>
            </div>

            {/* Common Amenities */}
            <div>
              <label className="form-label">Amenities</label>
              <div className="flex flex-wrap gap-2">
                {[
                  'Water Supply',
                  'Electricity',
                  'Road Access',
                  'Drainage',
                  'Security',
                  'Garden',
                  'Parking',
                  'Club House'
                ].map((amenity) => (
                  <label key={amenity} className="flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filters.amenities?.includes(amenity) || false}
                      onChange={(e) => {
                        const currentAmenities = filters.amenities || [];
                        const updatedAmenities = e.target.checked
                          ? [...currentAmenities, amenity]
                          : currentAmenities.filter(a => a !== amenity);
                        updateFilters({ amenities: updatedAmenities });
                      }}
                      className="mr-1"
                    />
                    <span className="text-sm text-text-primary">{amenity}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
