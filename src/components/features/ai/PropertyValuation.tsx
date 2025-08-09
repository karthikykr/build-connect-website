'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Loading } from '@/components/ui/Loading';
import { 
  Calculator, 
  TrendingUp, 
  TrendingDown,
  MapPin,
  Home,
  BarChart3,
  DollarSign,
  Info,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';
import { PropertyValuationResult } from '@/types';
import { formatCurrency } from '@/lib/utils';

interface PropertyValuationProps {
  propertyId?: string;
  onValuationComplete?: (result: PropertyValuationResult) => void;
  className?: string;
}

export function PropertyValuation({
  propertyId,
  onValuationComplete,
  className
}: PropertyValuationProps) {
  const [formData, setFormData] = useState({
    propertyType: '',
    area: '',
    location: '',
    bedrooms: '',
    bathrooms: '',
    age: '',
    condition: '',
    amenities: [] as string[],
  });
  const [isCalculating, setIsCalculating] = useState(false);
  const [valuationResult, setValuationResult] = useState<PropertyValuationResult | null>(null);

  const propertyTypes = [
    { value: 'residential_plot', label: 'Residential Plot' },
    { value: 'commercial_plot', label: 'Commercial Plot' },
    { value: 'villa', label: 'Villa' },
    { value: 'apartment', label: 'Apartment' },
    { value: 'farmland', label: 'Farmland' },
  ];

  const conditionOptions = [
    { value: 'excellent', label: 'Excellent' },
    { value: 'good', label: 'Good' },
    { value: 'average', label: 'Average' },
    { value: 'poor', label: 'Poor' },
  ];

  const amenityOptions = [
    'Swimming Pool', 'Gym', 'Parking', 'Security', 'Garden',
    'Club House', 'Playground', 'Power Backup', 'Water Supply',
    'Elevator', 'Balcony', 'Terrace'
  ];

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleAmenityToggle = (amenity: string) => {
    setFormData(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter(a => a !== amenity)
        : [...prev.amenities, amenity]
    }));
  };

  const calculateValuation = async () => {
    setIsCalculating(true);
    
    // Simulate AI valuation calculation
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Mock valuation result
    const basePrice = parseInt(formData.area) * 2000; // Base price per sqft
    const locationMultiplier = Math.random() * 0.5 + 0.8; // 0.8 - 1.3
    const conditionMultiplier = {
      excellent: 1.2,
      good: 1.0,
      average: 0.9,
      poor: 0.7
    }[formData.condition] || 1.0;
    
    const amenityBonus = formData.amenities.length * 0.02; // 2% per amenity
    const estimatedValue = basePrice * locationMultiplier * conditionMultiplier * (1 + amenityBonus);
    
    const result: PropertyValuationResult = {
      id: Date.now().toString(),
      propertyId: propertyId || 'manual-valuation',
      estimatedValue: Math.round(estimatedValue),
      confidence: Math.random() * 0.2 + 0.8, // 80-100%
      priceRange: {
        min: Math.round(estimatedValue * 0.9),
        max: Math.round(estimatedValue * 1.1),
      },
      pricePerSqft: Math.round(estimatedValue / parseInt(formData.area)),
      marketTrend: Math.random() > 0.5 ? 'increasing' : 'decreasing',
      trendPercentage: Math.random() * 10 + 2, // 2-12%
      comparableProperties: [
        {
          id: '1',
          address: 'Similar property nearby',
          price: Math.round(estimatedValue * (0.9 + Math.random() * 0.2)),
          area: parseInt(formData.area) + Math.round((Math.random() - 0.5) * 200),
          distance: Math.random() * 2 + 0.5,
        },
        {
          id: '2',
          address: 'Another comparable property',
          price: Math.round(estimatedValue * (0.9 + Math.random() * 0.2)),
          area: parseInt(formData.area) + Math.round((Math.random() - 0.5) * 200),
          distance: Math.random() * 2 + 0.5,
        },
      ],
      factors: [
        {
          name: 'Location',
          impact: 'positive',
          weight: 0.3,
          description: 'Prime location with good connectivity'
        },
        {
          name: 'Property Condition',
          impact: formData.condition === 'excellent' ? 'positive' : 'neutral',
          weight: 0.2,
          description: `Property is in ${formData.condition} condition`
        },
        {
          name: 'Amenities',
          impact: formData.amenities.length > 5 ? 'positive' : 'neutral',
          weight: 0.15,
          description: `${formData.amenities.length} amenities available`
        },
      ],
      calculatedAt: new Date().toISOString(),
      validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days
    };
    
    setValuationResult(result);
    setIsCalculating(false);
    
    if (onValuationComplete) {
      onValuationComplete(result);
    }
  };

  const isFormValid = formData.propertyType && formData.area && formData.location;

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Calculator className="w-5 h-5 mr-2" />
          AI Property Valuation
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        {!valuationResult ? (
          <div className="space-y-6">
            {/* Property Details Form */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="form-label">Property Type *</label>
                <select
                  className="form-input"
                  value={formData.propertyType}
                  onChange={(e) => handleInputChange('propertyType', e.target.value)}
                >
                  <option value="">Select property type</option>
                  {propertyTypes.map(type => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="form-label">Area (sqft) *</label>
                <Input
                  type="number"
                  placeholder="Enter area in sqft"
                  value={formData.area}
                  onChange={(e) => handleInputChange('area', e.target.value)}
                />
              </div>
              
              <div className="md:col-span-2">
                <label className="form-label">Location *</label>
                <Input
                  placeholder="Enter property location"
                  leftIcon={<MapPin className="w-4 h-4" />}
                  value={formData.location}
                  onChange={(e) => handleInputChange('location', e.target.value)}
                />
              </div>
              
              <div>
                <label className="form-label">Bedrooms</label>
                <select
                  className="form-input"
                  value={formData.bedrooms}
                  onChange={(e) => handleInputChange('bedrooms', e.target.value)}
                >
                  <option value="">Select bedrooms</option>
                  {[1, 2, 3, 4, 5, '5+'].map(num => (
                    <option key={num} value={num}>{num}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="form-label">Bathrooms</label>
                <select
                  className="form-input"
                  value={formData.bathrooms}
                  onChange={(e) => handleInputChange('bathrooms', e.target.value)}
                >
                  <option value="">Select bathrooms</option>
                  {[1, 2, 3, 4, '4+'].map(num => (
                    <option key={num} value={num}>{num}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="form-label">Property Age (years)</label>
                <Input
                  type="number"
                  placeholder="Enter property age"
                  value={formData.age}
                  onChange={(e) => handleInputChange('age', e.target.value)}
                />
              </div>
              
              <div>
                <label className="form-label">Condition</label>
                <select
                  className="form-input"
                  value={formData.condition}
                  onChange={(e) => handleInputChange('condition', e.target.value)}
                >
                  <option value="">Select condition</option>
                  {conditionOptions.map(condition => (
                    <option key={condition.value} value={condition.value}>
                      {condition.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            
            {/* Amenities */}
            <div>
              <label className="form-label">Amenities</label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
                {amenityOptions.map(amenity => (
                  <label key={amenity} className="flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.amenities.includes(amenity)}
                      onChange={() => handleAmenityToggle(amenity)}
                      className="mr-2"
                    />
                    <span className="text-sm">{amenity}</span>
                  </label>
                ))}
              </div>
            </div>
            
            {/* Calculate Button */}
            <div className="flex justify-center">
              <Button
                variant="primary"
                size="lg"
                onClick={calculateValuation}
                disabled={!isFormValid || isCalculating}
                leftIcon={isCalculating ? <Loading size="sm" /> : <Calculator className="w-5 h-5" />}
              >
                {isCalculating ? 'Calculating Valuation...' : 'Calculate Property Value'}
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Valuation Result */}
            <div className="text-center p-6 bg-primary/5 rounded-lg">
              <h3 className="text-2xl font-bold text-text-primary mb-2">
                Estimated Property Value
              </h3>
              <p className="text-4xl font-bold text-primary mb-2">
                {formatCurrency(valuationResult.estimatedValue)}
              </p>
              <p className="text-text-secondary">
                Range: {formatCurrency(valuationResult.priceRange.min)} - {formatCurrency(valuationResult.priceRange.max)}
              </p>
              <p className="text-sm text-text-secondary mt-2">
                Confidence: {(valuationResult.confidence * 100).toFixed(1)}%
              </p>
            </div>
            
            {/* Market Trend */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-text-secondary">Price per sqft</p>
                      <p className="text-xl font-bold text-text-primary">
                        {formatCurrency(valuationResult.pricePerSqft)}
                      </p>
                    </div>
                    <DollarSign className="w-8 h-8 text-primary" />
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-text-secondary">Market Trend</p>
                      <p className={`text-xl font-bold ${
                        valuationResult.marketTrend === 'increasing' ? 'text-success' : 'text-error'
                      }`}>
                        {valuationResult.marketTrend === 'increasing' ? '+' : '-'}
                        {valuationResult.trendPercentage.toFixed(1)}%
                      </p>
                    </div>
                    {valuationResult.marketTrend === 'increasing' ? (
                      <TrendingUp className="w-8 h-8 text-success" />
                    ) : (
                      <TrendingDown className="w-8 h-8 text-error" />
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* Valuation Factors */}
            <div>
              <h4 className="text-lg font-semibold mb-4">Valuation Factors</h4>
              <div className="space-y-3">
                {valuationResult.factors.map((factor, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-light rounded-lg">
                    <div className="flex items-center space-x-3">
                      {factor.impact === 'positive' ? (
                        <CheckCircle className="w-5 h-5 text-success" />
                      ) : factor.impact === 'negative' ? (
                        <AlertTriangle className="w-5 h-5 text-error" />
                      ) : (
                        <Info className="w-5 h-5 text-text-secondary" />
                      )}
                      <div>
                        <p className="font-medium">{factor.name}</p>
                        <p className="text-sm text-text-secondary">{factor.description}</p>
                      </div>
                    </div>
                    <span className="text-sm font-medium">
                      {(factor.weight * 100).toFixed(0)}% weight
                    </span>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Comparable Properties */}
            <div>
              <h4 className="text-lg font-semibold mb-4">Comparable Properties</h4>
              <div className="space-y-3">
                {valuationResult.comparableProperties.map((property, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border border-gray-light rounded-lg">
                    <div>
                      <p className="font-medium">{property.address}</p>
                      <p className="text-sm text-text-secondary">
                        {property.area} sqft • {property.distance.toFixed(1)} km away
                      </p>
                    </div>
                    <p className="font-bold text-primary">
                      {formatCurrency(property.price)}
                    </p>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Actions */}
            <div className="flex justify-center space-x-4">
              <Button
                variant="outline"
                onClick={() => setValuationResult(null)}
              >
                Calculate Again
              </Button>
              <Button variant="primary">
                Save Valuation Report
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
