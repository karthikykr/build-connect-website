'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { MapSelector } from '@/components/features/map/MapSelector';
import {
  Upload,
  X,
  MapPin,
  Home,
  DollarSign,
  FileText,
  Image as ImageIcon,
  Trash2,
} from 'lucide-react';
import { Site } from '@/types';
import { CreateSiteRequest } from '@/services/sites.service';

interface PropertyFormProps {
  site?: Site;
  onSubmit: (data: CreateSiteRequest) => void;
  isSubmitting?: boolean;
  mode: 'create' | 'edit';
}

// Backend-aligned form data structure
interface FormData {
  name: string;
  addressLine1: string;
  addressLine2: string;
  location: string;
  pincode: string;
  state: string;
  district: string;
  plotArea: string;
  price: string;
  latitude: number;
  longitude: number;
  images: File[];
  documents: File[];
}

const PROPERTY_TYPES = [
  { value: 'residential_plot', label: 'Residential Plot' },
  { value: 'commercial_plot', label: 'Commercial Plot' },
  { value: 'villa', label: 'Villa' },
  { value: 'apartment', label: 'Apartment' },
  { value: 'house', label: 'Independent House' },
  { value: 'office', label: 'Office Space' },
  { value: 'shop', label: 'Shop/Retail' },
  { value: 'warehouse', label: 'Warehouse' },
];

const COMMON_AMENITIES = [
  'Water Supply',
  'Electricity',
  'Road Access',
  'Drainage',
  'Security',
  'Parking',
  'Garden',
  'Swimming Pool',
  'Gym',
  'Club House',
  'Children Play Area',
  'Power Backup',
];

// Indian states for dropdown
const INDIAN_STATES = [
  'Andhra Pradesh',
  'Arunachal Pradesh',
  'Assam',
  'Bihar',
  'Chhattisgarh',
  'Goa',
  'Gujarat',
  'Haryana',
  'Himachal Pradesh',
  'Jharkhand',
  'Karnataka',
  'Kerala',
  'Madhya Pradesh',
  'Maharashtra',
  'Manipur',
  'Meghalaya',
  'Mizoram',
  'Nagaland',
  'Odisha',
  'Punjab',
  'Rajasthan',
  'Sikkim',
  'Tamil Nadu',
  'Telangana',
  'Tripura',
  'Uttar Pradesh',
  'Uttarakhand',
  'West Bengal',
  'Delhi',
  'Jammu and Kashmir',
  'Ladakh',
  'Puducherry',
  'Chandigarh',
  'Dadra and Nagar Haveli and Daman and Diu',
  'Lakshadweep',
  'Andaman and Nicobar Islands',
];

export function PropertyForm({
  site,
  onSubmit,
  isSubmitting = false,
  mode,
}: PropertyFormProps) {
  const [formData, setFormData] = useState<FormData>({
    name: site?.name || '',
    addressLine1: site?.addressLine1 || '',
    addressLine2: site?.addressLine2 || '',
    location: site?.location || '',
    pincode: site?.pincode || '',
    state: site?.state || '',
    district: site?.district || '',
    plotArea: site?.plotArea?.toString() || '',
    price: site?.price?.toString() || '',
    latitude: site?.latitude || 12.9716, // Default to Bangalore
    longitude: site?.longitude || 77.5946,
    images: [],
    documents: [],
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (field: keyof FormData, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleLocationSelect = (location: {
    latitude: number;
    longitude: number;
    address?: string;
  }) => {
    setFormData(prev => ({
      ...prev,
      latitude: location.latitude,
      longitude: location.longitude,
      // Optionally update location field with address
      ...(location.address && { location: location.address }),
    }));
  };

  const handleFileUpload = (
    type: 'images' | 'documents',
    files: FileList | null
  ) => {
    if (files) {
      const fileArray = Array.from(files);
      setFormData(prev => ({
        ...prev,
        [type]: [...prev[type], ...fileArray],
      }));
    }
  };

  const handleRemoveFile = (type: 'images' | 'documents', index: number) => {
    setFormData(prev => ({
      ...prev,
      [type]: prev[type].filter((_, i) => i !== index),
    }));
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) newErrors.name = 'Site name is required';
    if (!formData.addressLine1.trim())
      newErrors.addressLine1 = 'Address line 1 is required';
    if (!formData.location.trim()) newErrors.location = 'Location is required';
    if (!formData.pincode.trim()) newErrors.pincode = 'Pincode is required';
    if (!formData.state.trim()) newErrors.state = 'State is required';
    if (!formData.district.trim()) newErrors.district = 'District is required';
    if (!formData.plotArea || parseFloat(formData.plotArea) <= 0)
      newErrors.plotArea = 'Valid plot area is required';
    if (!formData.price || parseFloat(formData.price) <= 0)
      newErrors.price = 'Valid price is required';
    if (!formData.latitude || !formData.longitude)
      newErrors.coordinates = 'Please select location on map';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    const siteData: CreateSiteRequest = {
      name: formData.name,
      addressLine1: formData.addressLine1,
      addressLine2: formData.addressLine2,
      location: formData.location,
      pincode: formData.pincode,
      state: formData.state,
      district: formData.district,
      plotArea: parseFloat(formData.plotArea),
      price: parseFloat(formData.price),
      latitude: formData.latitude,
      longitude: formData.longitude,
      images: formData.images,
      documents: formData.documents,
    };

    onSubmit(siteData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Basic Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Home className="mr-2 h-5 w-5" />
            Basic Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-medium text-text-primary">
                Property Title *
              </label>
              <Input
                value={formData.title}
                onChange={e => handleInputChange('title', e.target.value)}
                placeholder="Enter property title"
                error={errors.title}
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-text-primary">
                Property Type *
              </label>
              <select
                className={`form-input ${errors.type ? 'border-error' : ''}`}
                value={formData.type}
                onChange={e => handleInputChange('type', e.target.value)}
              >
                <option value="">Select property type</option>
                {PROPERTY_TYPES.map(type => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
              {errors.type && (
                <p className="mt-1 text-sm text-error">{errors.type}</p>
              )}
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-text-primary">
                Price (₹) *
              </label>
              <Input
                type="number"
                value={formData.price}
                onChange={e => handleInputChange('price', e.target.value)}
                placeholder="Enter price"
                error={errors.price}
                leftIcon={<DollarSign className="h-4 w-4" />}
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-text-primary">
                Area *
              </label>
              <Input
                type="number"
                value={formData.area}
                onChange={e => handleInputChange('area', e.target.value)}
                placeholder="Enter area"
                error={errors.area}
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-text-primary">
                Unit
              </label>
              <select
                className="form-input"
                value={formData.unit}
                onChange={e => handleInputChange('unit', e.target.value)}
              >
                {AREA_UNITS.map(unit => (
                  <option key={unit.value} value={unit.value}>
                    {unit.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-text-primary">
              Description *
            </label>
            <textarea
              className={`form-input min-h-[120px] ${errors.description ? 'border-error' : ''}`}
              value={formData.description}
              onChange={e => handleInputChange('description', e.target.value)}
              placeholder="Describe your property..."
              rows={5}
            />
            {errors.description && (
              <p className="mt-1 text-sm text-error">{errors.description}</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Location */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <MapPin className="mr-2 h-5 w-5" />
            Location Details
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-medium text-text-primary">
                Street Address *
              </label>
              <Input
                value={formData.location.street}
                onChange={e => handleLocationChange('street', e.target.value)}
                placeholder="Enter street address"
                error={errors.street}
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-text-primary">
                City *
              </label>
              <Input
                value={formData.location.city}
                onChange={e => handleLocationChange('city', e.target.value)}
                placeholder="Enter city"
                error={errors.city}
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-text-primary">
                State *
              </label>
              <Input
                value={formData.location.state}
                onChange={e => handleLocationChange('state', e.target.value)}
                placeholder="Enter state"
                error={errors.state}
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-text-primary">
                Pincode *
              </label>
              <Input
                value={formData.location.pincode}
                onChange={e => handleLocationChange('pincode', e.target.value)}
                placeholder="Enter pincode"
                error={errors.pincode}
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-text-primary">
                Country
              </label>
              <Input
                value={formData.location.country}
                onChange={e => handleLocationChange('country', e.target.value)}
                placeholder="Enter country"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Amenities */}
      <Card>
        <CardHeader>
          <CardTitle>Amenities & Features</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h4 className="mb-3 font-medium text-text-primary">
              Select Amenities
            </h4>
            <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
              {COMMON_AMENITIES.map(amenity => (
                <label
                  key={amenity}
                  className="flex cursor-pointer items-center space-x-2"
                >
                  <input
                    type="checkbox"
                    checked={formData.amenities.includes(amenity)}
                    onChange={() => handleAmenityToggle(amenity)}
                    className="border-gray-300 rounded"
                  />
                  <span className="text-sm">{amenity}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <h4 className="mb-3 font-medium text-text-primary">
              Add Custom Amenity
            </h4>
            <div className="flex space-x-2">
              <Input
                value={newAmenity}
                onChange={e => setNewAmenity(e.target.value)}
                placeholder="Enter custom amenity"
                onKeyPress={e =>
                  e.key === 'Enter' &&
                  (e.preventDefault(), handleAddCustomAmenity())
                }
              />
              <Button type="button" onClick={handleAddCustomAmenity}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {formData.amenities.filter(a => !COMMON_AMENITIES.includes(a))
            .length > 0 && (
            <div>
              <h4 className="mb-3 font-medium text-text-primary">
                Custom Amenities
              </h4>
              <div className="flex flex-wrap gap-2">
                {formData.amenities
                  .filter(a => !COMMON_AMENITIES.includes(a))
                  .map(amenity => (
                    <span
                      key={amenity}
                      className="inline-flex items-center rounded-lg bg-primary/10 px-3 py-1 text-sm text-primary"
                    >
                      {amenity}
                      <button
                        type="button"
                        onClick={() => handleRemoveItem('amenities', amenity)}
                        className="hover:text-primary-dark ml-2 text-primary"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Submit Button */}
      <div className="flex justify-end space-x-4">
        <Button type="button" variant="outline">
          Save as Draft
        </Button>
        <Button
          type="submit"
          variant="primary"
          disabled={isSubmitting}
          leftIcon={isSubmitting ? <Loading size="sm" /> : undefined}
        >
          {isSubmitting
            ? 'Publishing...'
            : mode === 'create'
              ? 'Publish Property'
              : 'Update Property'}
        </Button>
      </div>
    </form>
  );
}
