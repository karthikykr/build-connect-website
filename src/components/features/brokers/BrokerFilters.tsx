'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { 
  Search, 
  MapPin, 
  Star,
  Shield,
  Award,
  Filter,
  X
} from 'lucide-react';

interface BrokerFilters {
  search?: string;
  location?: string;
  specialization?: string;
  rating?: number;
  verified?: boolean;
  experience?: string;
  sortBy?: string;
}

interface BrokerFiltersProps {
  onFiltersChange: (filters: BrokerFilters) => void;
  totalBrokers: number;
  filteredCount: number;
  className?: string;
}

export function BrokerFilters({ 
  onFiltersChange, 
  totalBrokers, 
  filteredCount, 
  className 
}: BrokerFiltersProps) {
  const [filters, setFilters] = useState<BrokerFilters>({});

  const specializations = [
    { value: 'all', label: 'All Specializations' },
    { value: 'Residential', label: 'Residential Properties' },
    { value: 'Commercial', label: 'Commercial Properties' },
    { value: 'Investment', label: 'Investment Properties' },
    { value: 'Luxury Homes', label: 'Luxury Homes' },
    { value: 'Plot Development', label: 'Plot Development' },
    { value: 'Industrial', label: 'Industrial Properties' },
  ];

  const experienceLevels = [
    { value: 'all', label: 'Any Experience' },
    { value: '1', label: '1+ Years' },
    { value: '3', label: '3+ Years' },
    { value: '5', label: '5+ Years' },
    { value: '10', label: '10+ Years' },
  ];

  const sortOptions = [
    { value: 'rating', label: 'Highest Rated' },
    { value: 'experience', label: 'Most Experienced' },
    { value: 'properties', label: 'Most Properties' },
    { value: 'recent', label: 'Recently Active' },
  ];

  const cities = [
    'Bangalore',
    'Mumbai',
    'Delhi',
    'Pune',
    'Chennai',
    'Hyderabad',
    'Kolkata',
    'Ahmedabad',
  ];

  useEffect(() => {
    onFiltersChange(filters);
  }, [filters, onFiltersChange]);

  const handleFilterChange = (key: keyof BrokerFilters, value: any) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const clearFilters = () => {
    setFilters({});
  };

  const hasActiveFilters = Object.keys(filters).some(key => {
    const value = filters[key as keyof BrokerFilters];
    return value !== undefined && value !== '' && value !== 'all';
  });

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center">
            <Filter className="w-5 h-5 mr-2" />
            Filters
          </CardTitle>
          {hasActiveFilters && (
            <Button variant="ghost" size="sm" onClick={clearFilters}>
              <X className="w-4 h-4 mr-1" />
              Clear
            </Button>
          )}
        </div>
        <div className="text-sm text-text-secondary">
          Showing {filteredCount} of {totalBrokers} brokers
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Search */}
        <div>
          <label className="block text-sm font-medium text-text-primary mb-2">
            Search
          </label>
          <Input
            placeholder="Search by name or expertise..."
            leftIcon={<Search className="w-4 h-4" />}
            value={filters.search || ''}
            onChange={(e) => handleFilterChange('search', e.target.value)}
          />
        </div>

        {/* Location */}
        <div>
          <label className="block text-sm font-medium text-text-primary mb-2">
            Location
          </label>
          <Input
            placeholder="Enter city or area"
            leftIcon={<MapPin className="w-4 h-4" />}
            value={filters.location || ''}
            onChange={(e) => handleFilterChange('location', e.target.value)}
          />
          <div className="mt-2 flex flex-wrap gap-1">
            {cities.slice(0, 4).map(city => (
              <button
                key={city}
                onClick={() => handleFilterChange('location', city)}
                className={`text-xs px-2 py-1 rounded border transition-colors ${
                  filters.location === city
                    ? 'border-primary bg-primary/10 text-primary'
                    : 'border-gray-light hover:border-primary/50'
                }`}
              >
                {city}
              </button>
            ))}
          </div>
        </div>

        {/* Specialization */}
        <div>
          <label className="block text-sm font-medium text-text-primary mb-2">
            Specialization
          </label>
          <select
            className="form-input"
            value={filters.specialization || 'all'}
            onChange={(e) => handleFilterChange('specialization', e.target.value)}
          >
            {specializations.map(spec => (
              <option key={spec.value} value={spec.value}>
                {spec.label}
              </option>
            ))}
          </select>
        </div>

        {/* Rating */}
        <div>
          <label className="block text-sm font-medium text-text-primary mb-2">
            Minimum Rating
          </label>
          <div className="space-y-2">
            {[4.5, 4.0, 3.5, 3.0].map(rating => (
              <label key={rating} className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="radio"
                  name="rating"
                  checked={filters.rating === rating}
                  onChange={() => handleFilterChange('rating', rating)}
                  className="rounded border-gray-300"
                />
                <div className="flex items-center space-x-1">
                  <Star className="w-4 h-4 text-warning fill-current" />
                  <span className="text-sm">{rating}+ Stars</span>
                </div>
              </label>
            ))}
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="radio"
                name="rating"
                checked={!filters.rating}
                onChange={() => handleFilterChange('rating', undefined)}
                className="rounded border-gray-300"
              />
              <span className="text-sm">Any Rating</span>
            </label>
          </div>
        </div>

        {/* Experience */}
        <div>
          <label className="block text-sm font-medium text-text-primary mb-2">
            Experience Level
          </label>
          <select
            className="form-input"
            value={filters.experience || 'all'}
            onChange={(e) => handleFilterChange('experience', e.target.value)}
          >
            {experienceLevels.map(level => (
              <option key={level.value} value={level.value}>
                {level.label}
              </option>
            ))}
          </select>
        </div>

        {/* Quick Filters */}
        <div>
          <label className="block text-sm font-medium text-text-primary mb-3">
            Quick Filters
          </label>
          <div className="space-y-2">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={filters.verified || false}
                onChange={(e) => handleFilterChange('verified', e.target.checked)}
                className="rounded border-gray-300"
              />
              <Shield className="w-4 h-4 text-success" />
              <span className="text-sm text-text-primary">Verified Brokers Only</span>
            </label>
          </div>
        </div>

        {/* Sort By */}
        <div>
          <label className="block text-sm font-medium text-text-primary mb-2">
            Sort By
          </label>
          <select
            className="form-input"
            value={filters.sortBy || 'rating'}
            onChange={(e) => handleFilterChange('sortBy', e.target.value)}
          >
            {sortOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Active Filters Summary */}
        {hasActiveFilters && (
          <div className="pt-4 border-t border-gray-light">
            <p className="text-sm font-medium text-text-primary mb-2">Active Filters:</p>
            <div className="flex flex-wrap gap-2">
              {filters.specialization && filters.specialization !== 'all' && (
                <span className="inline-flex items-center bg-primary/10 text-primary px-2 py-1 rounded text-xs">
                  {specializations.find(s => s.value === filters.specialization)?.label}
                  <button
                    onClick={() => handleFilterChange('specialization', 'all')}
                    className="ml-1 hover:text-primary-dark"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              {filters.location && (
                <span className="inline-flex items-center bg-primary/10 text-primary px-2 py-1 rounded text-xs">
                  {filters.location}
                  <button
                    onClick={() => handleFilterChange('location', '')}
                    className="ml-1 hover:text-primary-dark"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              {filters.rating && (
                <span className="inline-flex items-center bg-primary/10 text-primary px-2 py-1 rounded text-xs">
                  {filters.rating}+ Stars
                  <button
                    onClick={() => handleFilterChange('rating', undefined)}
                    className="ml-1 hover:text-primary-dark"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              {filters.experience && filters.experience !== 'all' && (
                <span className="inline-flex items-center bg-primary/10 text-primary px-2 py-1 rounded text-xs">
                  {experienceLevels.find(e => e.value === filters.experience)?.label}
                  <button
                    onClick={() => handleFilterChange('experience', 'all')}
                    className="ml-1 hover:text-primary-dark"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              {filters.verified && (
                <span className="inline-flex items-center bg-primary/10 text-primary px-2 py-1 rounded text-xs">
                  Verified Only
                  <button
                    onClick={() => handleFilterChange('verified', false)}
                    className="ml-1 hover:text-primary-dark"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
