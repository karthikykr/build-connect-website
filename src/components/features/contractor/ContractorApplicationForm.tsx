'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import {
  User,
  FileText,
  Upload,
  CheckCircle,
  AlertTriangle,
  MapPin,
  Calendar,
  Phone,
  Mail,
  Building,
  Award,
  Hammer,
  Wrench,
  Home,
  Palette,
  Zap,
  Droplets,
  Trees,
} from 'lucide-react';
import { ContractorApplicationRequest } from '@/services/contractors.service';

interface ContractorApplicationFormProps {
  onSubmit: (data: ContractorApplicationRequest) => void;
  isSubmitting?: boolean;
}

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

const MAJOR_CITIES = [
  'Mumbai',
  'Delhi',
  'Bangalore',
  'Hyderabad',
  'Chennai',
  'Kolkata',
  'Pune',
  'Ahmedabad',
  'Surat',
  'Jaipur',
  'Lucknow',
  'Kanpur',
  'Nagpur',
  'Indore',
  'Thane',
  'Bhopal',
  'Visakhapatnam',
  'Pimpri-Chinchwad',
  'Patna',
  'Vadodara',
  'Ghaziabad',
  'Ludhiana',
  'Agra',
  'Nashik',
  'Faridabad',
  'Meerut',
  'Rajkot',
  'Kalyan-Dombivli',
  'Vasai-Virar',
  'Varanasi',
  'Srinagar',
  'Aurangabad',
  'Dhanbad',
  'Amritsar',
  'Navi Mumbai',
  'Allahabad',
  'Ranchi',
  'Howrah',
  'Coimbatore',
  'Jabalpur',
  'Gwalior',
  'Vijayawada',
  'Jodhpur',
  'Madurai',
  'Raipur',
  'Kota',
  'Guwahati',
  'Chandigarh',
  'Solapur',
  'Hubballi-Dharwad',
];

const SPECIALIZATIONS = [
  {
    value: 'residential_construction',
    label: 'Residential Construction',
    icon: Home,
  },
  {
    value: 'commercial_construction',
    label: 'Commercial Construction',
    icon: Building,
  },
  { value: 'interior_design', label: 'Interior Design', icon: Palette },
  { value: 'landscaping', label: 'Landscaping', icon: Trees },
  { value: 'renovation', label: 'Renovation', icon: Hammer },
  { value: 'electrical', label: 'Electrical Work', icon: Zap },
  { value: 'plumbing', label: 'Plumbing', icon: Droplets },
  { value: 'painting', label: 'Painting', icon: Palette },
];

export function ContractorApplicationForm({
  onSubmit,
  isSubmitting = false,
}: ContractorApplicationFormProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<ContractorApplicationRequest>({
    aadhaarNumber: '',
    nameOnAadhaar: '',
    dateOfBirth: '',
    gender: 'male',
    address: '',
    aadhaarDocument: null as any,
    panNumber: '',
    nameOnPAN: '',
    panDocument: null as any,
    serviceAreas: [],
    specializations: [],
    experience: 0,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (
    field: keyof ContractorApplicationRequest,
    value: any
  ) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleFileUpload = (
    field: 'aadhaarDocument' | 'panDocument',
    file: File
  ) => {
    setFormData(prev => ({ ...prev, [field]: file }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleServiceAreaToggle = (area: string) => {
    setFormData(prev => ({
      ...prev,
      serviceAreas: prev.serviceAreas.includes(area)
        ? prev.serviceAreas.filter(a => a !== area)
        : [...prev.serviceAreas, area],
    }));
  };

  const handleSpecializationToggle = (specialization: string) => {
    setFormData(prev => ({
      ...prev,
      specializations: prev.specializations.includes(specialization)
        ? prev.specializations.filter(s => s !== specialization)
        : [...prev.specializations, specialization],
    }));
  };

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};

    if (step === 1) {
      if (!formData.aadhaarNumber.trim())
        newErrors.aadhaarNumber = 'Aadhaar number is required';
      if (!formData.nameOnAadhaar.trim())
        newErrors.nameOnAadhaar = 'Name on Aadhaar is required';
      if (!formData.dateOfBirth)
        newErrors.dateOfBirth = 'Date of birth is required';
      if (!formData.address.trim()) newErrors.address = 'Address is required';
      if (!formData.aadhaarDocument)
        newErrors.aadhaarDocument = 'Aadhaar document is required';
    }

    if (step === 2) {
      if (!formData.panNumber.trim())
        newErrors.panNumber = 'PAN number is required';
      if (!formData.nameOnPAN.trim())
        newErrors.nameOnPAN = 'Name on PAN is required';
      if (!formData.panDocument)
        newErrors.panDocument = 'PAN document is required';
    }

    if (step === 3) {
      if (formData.serviceAreas.length === 0)
        newErrors.serviceAreas = 'At least one service area is required';
      if (formData.specializations.length === 0)
        newErrors.specializations = 'At least one specialization is required';
      if (formData.experience < 0)
        newErrors.experience = 'Experience cannot be negative';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    setCurrentStep(prev => prev - 1);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateStep(currentStep)) {
      onSubmit(formData);
    }
  };

  const steps = [
    { number: 1, title: 'Personal Information', icon: User },
    { number: 2, title: 'PAN Details', icon: FileText },
    { number: 3, title: 'Professional Details', icon: Hammer },
  ];

  const renderStepIndicator = () => (
    <div className="mb-8 flex items-center justify-center">
      {steps.map((step, index) => {
        const StepIcon = step.icon;
        const isActive = currentStep === step.number;
        const isCompleted = currentStep > step.number;

        return (
          <div key={step.number} className="flex items-center">
            <div
              className={`flex h-10 w-10 items-center justify-center rounded-full border-2 ${
                isCompleted
                  ? 'border-green-500 bg-green-500 text-white'
                  : isActive
                    ? 'bg-primary-500 border-primary-500 text-white'
                    : 'bg-gray-100 border-gray-300 text-gray-400'
              }`}
            >
              {isCompleted ? (
                <CheckCircle className="h-5 w-5" />
              ) : (
                <StepIcon className="h-5 w-5" />
              )}
            </div>
            <div className="ml-3 text-sm">
              <p
                className={`font-medium ${isActive ? 'text-primary-600' : 'text-gray-500'}`}
              >
                Step {step.number}
              </p>
              <p
                className={`${isActive ? 'text-primary-600' : 'text-gray-500'}`}
              >
                {step.title}
              </p>
            </div>
            {index < steps.length - 1 && (
              <div
                className={`mx-4 h-0.5 w-12 ${
                  currentStep > step.number ? 'bg-green-500' : 'bg-gray-300'
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );

  const renderStep1 = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="h-5 w-5" />
          Personal Information & Aadhaar Details
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div>
            <label className="text-gray-700 mb-2 block text-sm font-medium">
              Aadhaar Number *
            </label>
            <Input
              value={formData.aadhaarNumber}
              onChange={e => handleInputChange('aadhaarNumber', e.target.value)}
              placeholder="Enter 12-digit Aadhaar number"
              maxLength={12}
              error={errors.aadhaarNumber}
            />
          </div>

          <div>
            <label className="text-gray-700 mb-2 block text-sm font-medium">
              Name on Aadhaar *
            </label>
            <Input
              value={formData.nameOnAadhaar}
              onChange={e => handleInputChange('nameOnAadhaar', e.target.value)}
              placeholder="Enter name as on Aadhaar"
              error={errors.nameOnAadhaar}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div>
            <label className="text-gray-700 mb-2 block text-sm font-medium">
              Date of Birth *
            </label>
            <Input
              type="date"
              value={formData.dateOfBirth}
              onChange={e => handleInputChange('dateOfBirth', e.target.value)}
              error={errors.dateOfBirth}
            />
          </div>

          <div>
            <label className="text-gray-700 mb-2 block text-sm font-medium">
              Gender *
            </label>
            <select
              value={formData.gender}
              onChange={e => handleInputChange('gender', e.target.value)}
              className="border-gray-300 focus:ring-primary-500 w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-2"
            >
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>
        </div>

        <div>
          <label className="text-gray-700 mb-2 block text-sm font-medium">
            Address *
          </label>
          <textarea
            className={`border-gray-300 focus:ring-primary-500 w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-2 ${errors.address ? 'border-red-500' : ''}`}
            value={formData.address}
            onChange={e => handleInputChange('address', e.target.value)}
            placeholder="Enter complete address"
            rows={3}
          />
          {errors.address && (
            <p className="mt-1 text-sm text-red-600">{errors.address}</p>
          )}
        </div>

        <div>
          <label className="text-gray-700 mb-2 block text-sm font-medium">
            Aadhaar Document *
          </label>
          <div className="border-gray-300 rounded-lg border-2 border-dashed p-6">
            <div className="text-center">
              <Upload className="text-gray-400 mx-auto mb-4 h-12 w-12" />
              <div className="text-gray-600 flex text-sm">
                <label className="text-primary-600 hover:text-primary-500 relative cursor-pointer rounded-md bg-white font-medium">
                  <span>Upload Aadhaar document</span>
                  <input
                    type="file"
                    className="sr-only"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={e =>
                      e.target.files?.[0] &&
                      handleFileUpload('aadhaarDocument', e.target.files[0])
                    }
                  />
                </label>
                <p className="pl-1">or drag and drop</p>
              </div>
              <p className="text-gray-500 text-xs">PDF, PNG, JPG up to 10MB</p>
            </div>

            {formData.aadhaarDocument && (
              <div className="mt-4 text-center">
                <p className="text-sm text-green-600">
                  ✓ {formData.aadhaarDocument.name}
                </p>
              </div>
            )}
          </div>
          {errors.aadhaarDocument && (
            <p className="mt-1 text-sm text-red-600">
              {errors.aadhaarDocument}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );

  const renderStep2 = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          PAN Card Details
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div>
            <label className="text-gray-700 mb-2 block text-sm font-medium">
              PAN Number *
            </label>
            <Input
              value={formData.panNumber}
              onChange={e =>
                handleInputChange('panNumber', e.target.value.toUpperCase())
              }
              placeholder="Enter PAN number"
              maxLength={10}
              error={errors.panNumber}
            />
          </div>

          <div>
            <label className="text-gray-700 mb-2 block text-sm font-medium">
              Name on PAN *
            </label>
            <Input
              value={formData.nameOnPAN}
              onChange={e => handleInputChange('nameOnPAN', e.target.value)}
              placeholder="Enter name as on PAN"
              error={errors.nameOnPAN}
            />
          </div>
        </div>

        <div>
          <label className="text-gray-700 mb-2 block text-sm font-medium">
            PAN Document *
          </label>
          <div className="border-gray-300 rounded-lg border-2 border-dashed p-6">
            <div className="text-center">
              <Upload className="text-gray-400 mx-auto mb-4 h-12 w-12" />
              <div className="text-gray-600 flex text-sm">
                <label className="text-primary-600 hover:text-primary-500 relative cursor-pointer rounded-md bg-white font-medium">
                  <span>Upload PAN document</span>
                  <input
                    type="file"
                    className="sr-only"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={e =>
                      e.target.files?.[0] &&
                      handleFileUpload('panDocument', e.target.files[0])
                    }
                  />
                </label>
                <p className="pl-1">or drag and drop</p>
              </div>
              <p className="text-gray-500 text-xs">PDF, PNG, JPG up to 10MB</p>
            </div>

            {formData.panDocument && (
              <div className="mt-4 text-center">
                <p className="text-sm text-green-600">
                  ✓ {formData.panDocument.name}
                </p>
              </div>
            )}
          </div>
          {errors.panDocument && (
            <p className="mt-1 text-sm text-red-600">{errors.panDocument}</p>
          )}
        </div>
      </CardContent>
    </Card>
  );

  const renderStep3 = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Hammer className="h-5 w-5" />
          Professional Details
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <label className="text-gray-700 mb-2 block text-sm font-medium">
            Years of Experience *
          </label>
          <Input
            type="number"
            value={formData.experience.toString()}
            onChange={e =>
              handleInputChange('experience', parseInt(e.target.value) || 0)
            }
            placeholder="Enter years of experience"
            min="0"
            error={errors.experience}
          />
        </div>

        <div>
          <label className="text-gray-700 mb-2 block text-sm font-medium">
            Specializations * (Select your areas of expertise)
          </label>
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            {SPECIALIZATIONS.map(spec => {
              const SpecIcon = spec.icon;
              return (
                <label
                  key={spec.value}
                  className="border-gray-200 hover:bg-gray-50 flex cursor-pointer items-center space-x-3 rounded-lg border p-3"
                >
                  <input
                    type="checkbox"
                    checked={formData.specializations.includes(spec.value)}
                    onChange={() => handleSpecializationToggle(spec.value)}
                    className="border-gray-300 text-primary-600 focus:ring-primary-500 rounded"
                  />
                  <SpecIcon className="text-gray-600 h-5 w-5" />
                  <span className="text-gray-700 text-sm">{spec.label}</span>
                </label>
              );
            })}
          </div>
          {errors.specializations && (
            <p className="mt-1 text-sm text-red-600">
              {errors.specializations}
            </p>
          )}
          {formData.specializations.length > 0 && (
            <p className="text-gray-600 mt-2 text-sm">
              Selected {formData.specializations.length} specialization(s)
            </p>
          )}
        </div>

        <div>
          <label className="text-gray-700 mb-2 block text-sm font-medium">
            Service Areas * (Select cities/areas where you provide services)
          </label>
          <div className="border-gray-200 grid max-h-60 grid-cols-2 gap-3 overflow-y-auto rounded-lg border p-4 md:grid-cols-3 lg:grid-cols-4">
            {MAJOR_CITIES.map(city => (
              <label
                key={city}
                className="flex cursor-pointer items-center space-x-2"
              >
                <input
                  type="checkbox"
                  checked={formData.serviceAreas.includes(city)}
                  onChange={() => handleServiceAreaToggle(city)}
                  className="border-gray-300 text-primary-600 focus:ring-primary-500 rounded"
                />
                <span className="text-gray-700 text-sm">{city}</span>
              </label>
            ))}
          </div>
          {errors.serviceAreas && (
            <p className="mt-1 text-sm text-red-600">{errors.serviceAreas}</p>
          )}
          {formData.serviceAreas.length > 0 && (
            <p className="text-gray-600 mt-2 text-sm">
              Selected {formData.serviceAreas.length} area(s):{' '}
              {formData.serviceAreas.slice(0, 3).join(', ')}
              {formData.serviceAreas.length > 3 &&
                ` and ${formData.serviceAreas.length - 3} more`}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <form onSubmit={handleSubmit} className="mx-auto max-w-4xl space-y-8">
      {renderStepIndicator()}

      {currentStep === 1 && renderStep1()}
      {currentStep === 2 && renderStep2()}
      {currentStep === 3 && renderStep3()}

      <div className="flex justify-between">
        <Button
          type="button"
          variant="outline"
          onClick={handlePrevious}
          disabled={currentStep === 1}
        >
          Previous
        </Button>

        {currentStep < 3 ? (
          <Button type="button" variant="primary" onClick={handleNext}>
            Next
          </Button>
        ) : (
          <Button
            type="submit"
            variant="primary"
            disabled={isSubmitting}
            loading={isSubmitting}
          >
            Submit Application
          </Button>
        )}
      </div>
    </form>
  );
}
