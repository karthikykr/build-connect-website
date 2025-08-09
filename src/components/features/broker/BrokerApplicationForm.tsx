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
  Award
} from 'lucide-react';
import { BrokerApplicationRequest } from '@/services/brokers.service';

interface BrokerApplicationFormProps {
  onSubmit: (data: BrokerApplicationRequest) => void;
  isSubmitting?: boolean;
}

const INDIAN_STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
  'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram',
  'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu',
  'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
  'Delhi', 'Jammu and Kashmir', 'Ladakh', 'Puducherry', 'Chandigarh',
  'Dadra and Nagar Haveli and Daman and Diu', 'Lakshadweep', 'Andaman and Nicobar Islands'
];

const MAJOR_CITIES = [
  'Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Chennai', 'Kolkata', 'Pune',
  'Ahmedabad', 'Surat', 'Jaipur', 'Lucknow', 'Kanpur', 'Nagpur', 'Indore',
  'Thane', 'Bhopal', 'Visakhapatnam', 'Pimpri-Chinchwad', 'Patna', 'Vadodara',
  'Ghaziabad', 'Ludhiana', 'Agra', 'Nashik', 'Faridabad', 'Meerut', 'Rajkot',
  'Kalyan-Dombivli', 'Vasai-Virar', 'Varanasi', 'Srinagar', 'Aurangabad',
  'Dhanbad', 'Amritsar', 'Navi Mumbai', 'Allahabad', 'Ranchi', 'Howrah',
  'Coimbatore', 'Jabalpur', 'Gwalior', 'Vijayawada', 'Jodhpur', 'Madurai',
  'Raipur', 'Kota', 'Guwahati', 'Chandigarh', 'Solapur', 'Hubballi-Dharwad'
];

export function BrokerApplicationForm({ onSubmit, isSubmitting = false }: BrokerApplicationFormProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<BrokerApplicationRequest>({
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
    experience: 0,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (field: keyof BrokerApplicationRequest, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleFileUpload = (field: 'aadhaarDocument' | 'panDocument', file: File) => {
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
        : [...prev.serviceAreas, area]
    }));
  };

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};

    if (step === 1) {
      if (!formData.aadhaarNumber.trim()) newErrors.aadhaarNumber = 'Aadhaar number is required';
      if (!formData.nameOnAadhaar.trim()) newErrors.nameOnAadhaar = 'Name on Aadhaar is required';
      if (!formData.dateOfBirth) newErrors.dateOfBirth = 'Date of birth is required';
      if (!formData.address.trim()) newErrors.address = 'Address is required';
      if (!formData.aadhaarDocument) newErrors.aadhaarDocument = 'Aadhaar document is required';
    }

    if (step === 2) {
      if (!formData.panNumber.trim()) newErrors.panNumber = 'PAN number is required';
      if (!formData.nameOnPAN.trim()) newErrors.nameOnPAN = 'Name on PAN is required';
      if (!formData.panDocument) newErrors.panDocument = 'PAN document is required';
    }

    if (step === 3) {
      if (formData.serviceAreas.length === 0) newErrors.serviceAreas = 'At least one service area is required';
      if (formData.experience < 0) newErrors.experience = 'Experience cannot be negative';
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
    { number: 3, title: 'Professional Details', icon: Building },
  ];

  const renderStepIndicator = () => (
    <div className="flex items-center justify-center mb-8">
      {steps.map((step, index) => {
        const StepIcon = step.icon;
        const isActive = currentStep === step.number;
        const isCompleted = currentStep > step.number;
        
        return (
          <div key={step.number} className="flex items-center">
            <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
              isCompleted 
                ? 'bg-green-500 border-green-500 text-white' 
                : isActive 
                  ? 'bg-primary-500 border-primary-500 text-white' 
                  : 'bg-gray-100 border-gray-300 text-gray-400'
            }`}>
              {isCompleted ? (
                <CheckCircle className="w-5 h-5" />
              ) : (
                <StepIcon className="w-5 h-5" />
              )}
            </div>
            <div className="ml-3 text-sm">
              <p className={`font-medium ${isActive ? 'text-primary-600' : 'text-gray-500'}`}>
                Step {step.number}
              </p>
              <p className={`${isActive ? 'text-primary-600' : 'text-gray-500'}`}>
                {step.title}
              </p>
            </div>
            {index < steps.length - 1 && (
              <div className={`w-12 h-0.5 mx-4 ${
                currentStep > step.number ? 'bg-green-500' : 'bg-gray-300'
              }`} />
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
          <User className="w-5 h-5" />
          Personal Information & Aadhaar Details
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
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
            <label className="block text-sm font-medium text-gray-700 mb-2">
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
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
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Gender *
            </label>
            <select
              value={formData.gender}
              onChange={e => handleInputChange('gender', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Address *
          </label>
          <textarea
            className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 ${errors.address ? 'border-red-500' : ''}`}
            value={formData.address}
            onChange={e => handleInputChange('address', e.target.value)}
            placeholder="Enter complete address"
            rows={3}
          />
          {errors.address && (
            <p className="text-sm text-red-600 mt-1">{errors.address}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Aadhaar Document *
          </label>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
            <div className="text-center">
              <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <div className="flex text-sm text-gray-600">
                <label className="relative cursor-pointer bg-white rounded-md font-medium text-primary-600 hover:text-primary-500">
                  <span>Upload Aadhaar document</span>
                  <input
                    type="file"
                    className="sr-only"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={e => e.target.files?.[0] && handleFileUpload('aadhaarDocument', e.target.files[0])}
                  />
                </label>
                <p className="pl-1">or drag and drop</p>
              </div>
              <p className="text-xs text-gray-500">PDF, PNG, JPG up to 10MB</p>
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
            <p className="text-sm text-red-600 mt-1">{errors.aadhaarDocument}</p>
          )}
        </div>
      </CardContent>
    </Card>
  );

  const renderStep2 = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="w-5 h-5" />
          PAN Card Details
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              PAN Number *
            </label>
            <Input
              value={formData.panNumber}
              onChange={e => handleInputChange('panNumber', e.target.value.toUpperCase())}
              placeholder="Enter PAN number"
              maxLength={10}
              error={errors.panNumber}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
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
          <label className="block text-sm font-medium text-gray-700 mb-2">
            PAN Document *
          </label>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
            <div className="text-center">
              <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <div className="flex text-sm text-gray-600">
                <label className="relative cursor-pointer bg-white rounded-md font-medium text-primary-600 hover:text-primary-500">
                  <span>Upload PAN document</span>
                  <input
                    type="file"
                    className="sr-only"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={e => e.target.files?.[0] && handleFileUpload('panDocument', e.target.files[0])}
                  />
                </label>
                <p className="pl-1">or drag and drop</p>
              </div>
              <p className="text-xs text-gray-500">PDF, PNG, JPG up to 10MB</p>
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
            <p className="text-sm text-red-600 mt-1">{errors.panDocument}</p>
          )}
        </div>
      </CardContent>
    </Card>
  );

  const renderStep3 = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Building className="w-5 h-5" />
          Professional Details
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Years of Experience *
          </label>
          <Input
            type="number"
            value={formData.experience.toString()}
            onChange={e => handleInputChange('experience', parseInt(e.target.value) || 0)}
            placeholder="Enter years of experience"
            min="0"
            error={errors.experience}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Service Areas * (Select cities/areas where you provide services)
          </label>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 max-h-60 overflow-y-auto border border-gray-200 rounded-lg p-4">
            {MAJOR_CITIES.map(city => (
              <label key={city} className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.serviceAreas.includes(city)}
                  onChange={() => handleServiceAreaToggle(city)}
                  className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
                <span className="text-sm text-gray-700">{city}</span>
              </label>
            ))}
          </div>
          {errors.serviceAreas && (
            <p className="text-sm text-red-600 mt-1">{errors.serviceAreas}</p>
          )}
          {formData.serviceAreas.length > 0 && (
            <p className="text-sm text-gray-600 mt-2">
              Selected {formData.serviceAreas.length} area(s): {formData.serviceAreas.slice(0, 3).join(', ')}
              {formData.serviceAreas.length > 3 && ` and ${formData.serviceAreas.length - 3} more`}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <form onSubmit={handleSubmit} className="max-w-4xl mx-auto space-y-8">
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
          <Button
            type="button"
            variant="primary"
            onClick={handleNext}
          >
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
