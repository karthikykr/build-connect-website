'use client';

import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/layout';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Loading } from '@/components/ui/Loading';
import {
  User,
  MapPin,
  Calendar,
  Award,
  Star,
  Edit,
  Save,
  X,
  Phone,
  Mail,
  FileText,
  CheckCircle,
  Clock,
  AlertTriangle,
  Hammer,
  Wrench,
  Home,
  Building,
  Palette,
  Zap,
  Droplets,
  Trees,
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { contractorsService, ContractorProfile } from '@/services/contractors.service';
import { formatRelativeTime } from '@/lib/utils';

const SPECIALIZATION_ICONS: Record<string, React.ComponentType<any>> = {
  residential_construction: Home,
  commercial_construction: Building,
  interior_design: Palette,
  landscaping: Trees,
  renovation: Hammer,
  electrical: Zap,
  plumbing: Droplets,
  painting: Palette,
};

export default function ContractorProfilePage() {
  const { user } = useAuth();
  const [contractorProfile, setContractorProfile] = useState<ContractorProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState<Partial<ContractorProfile>>({});

  useEffect(() => {
    loadContractorProfile();
  }, []);

  const loadContractorProfile = async () => {
    try {
      setIsLoading(true);
      const response = await contractorsService.getContractorApplication();
      if (response.success && response.data) {
        setContractorProfile(response.data);
        setEditData(response.data);
      }
    } catch (error) {
      console.error('Error loading contractor profile:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    if (!contractorProfile) return;

    try {
      const response = await contractorsService.updateContractorProfile(editData);
      if (response.success) {
        setContractorProfile({ ...contractorProfile, ...editData });
        setIsEditing(false);
      }
    } catch (error) {
      console.error('Error updating contractor profile:', error);
    }
  };

  const handleCancel = () => {
    setEditData(contractorProfile || {});
    setIsEditing(false);
  };

  const breadcrumbs = [
    { label: 'Contractor Dashboard', href: '/contractor/dashboard' },
    { label: 'Profile', current: true }
  ];

  if (isLoading) {
    return (
      <ProtectedRoute allowedRoles={['contractor']}>
        <DashboardLayout
          breadcrumbs={breadcrumbs}
          title="Contractor Profile"
          description="Manage your contractor profile and information"
        >
          <Loading />
        </DashboardLayout>
      </ProtectedRoute>
    );
  }

  if (!contractorProfile) {
    return (
      <ProtectedRoute allowedRoles={['contractor']}>
        <DashboardLayout
          breadcrumbs={breadcrumbs}
          title="Contractor Profile"
          description="Manage your contractor profile and information"
        >
          <Card>
            <CardContent className="text-center py-12">
              <AlertTriangle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No Contractor Profile Found
              </h3>
              <p className="text-gray-600 mb-6">
                You haven't applied to become a contractor yet.
              </p>
              <Button variant="primary" href="/become-contractor">
                Apply to Become a Contractor
              </Button>
            </CardContent>
          </Card>
        </DashboardLayout>
      </ProtectedRoute>
    );
  }

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'approved':
        return {
          color: 'text-green-600',
          bgColor: 'bg-green-50',
          icon: CheckCircle,
          label: 'Approved'
        };
      case 'pending':
        return {
          color: 'text-yellow-600',
          bgColor: 'bg-yellow-50',
          icon: Clock,
          label: 'Under Review'
        };
      case 'rejected':
        return {
          color: 'text-red-600',
          bgColor: 'bg-red-50',
          icon: AlertTriangle,
          label: 'Rejected'
        };
      default:
        return {
          color: 'text-gray-600',
          bgColor: 'bg-gray-50',
          icon: Clock,
          label: 'Unknown'
        };
    }
  };

  const statusConfig = getStatusConfig(contractorProfile.status);
  const StatusIcon = statusConfig.icon;

  return (
    <ProtectedRoute allowedRoles={['contractor']}>
      <DashboardLayout
        breadcrumbs={breadcrumbs}
        title="Contractor Profile"
        description="Manage your contractor profile and information"
        actions={
          <div className="flex gap-3">
            {isEditing ? (
              <>
                <Button variant="outline" onClick={handleCancel}>
                  <X className="w-4 h-4 mr-2" />
                  Cancel
                </Button>
                <Button variant="primary" onClick={handleSave}>
                  <Save className="w-4 h-4 mr-2" />
                  Save Changes
                </Button>
              </>
            ) : (
              <Button variant="primary" onClick={() => setIsEditing(true)}>
                <Edit className="w-4 h-4 mr-2" />
                Edit Profile
              </Button>
            )}
          </div>
        }
      >
        <div className="space-y-6">
          {/* Status Banner */}
          <Card className={`border-2 ${statusConfig.bgColor}`}>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-full ${statusConfig.bgColor} flex items-center justify-center`}>
                  <StatusIcon className={`w-6 h-6 ${statusConfig.color}`} />
                </div>
                <div>
                  <h3 className={`text-lg font-semibold ${statusConfig.color}`}>
                    Application Status: {statusConfig.label}
                  </h3>
                  <p className="text-gray-600">
                    {contractorProfile.status === 'approved' && 'Your contractor application has been approved. You can now bid on projects and connect with clients.'}
                    {contractorProfile.status === 'pending' && 'Your contractor application is under review. We\'ll notify you once the review is complete.'}
                    {contractorProfile.status === 'rejected' && 'Your contractor application was rejected. Please contact support for more information.'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Personal Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                Personal Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Name on Aadhaar
                  </label>
                  {isEditing ? (
                    <Input
                      value={editData.nameOnAadhaar || ''}
                      onChange={(e) => setEditData(prev => ({ ...prev, nameOnAadhaar: e.target.value }))}
                    />
                  ) : (
                    <p className="text-gray-900">{contractorProfile.nameOnAadhaar}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Aadhaar Number
                  </label>
                  <p className="text-gray-900">
                    {contractorProfile.aadhaarNumber.replace(/(\d{4})(\d{4})(\d{4})/, '****-****-$3')}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date of Birth
                  </label>
                  <p className="text-gray-900">{new Date(contractorProfile.dateOfBirth).toLocaleDateString()}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Gender
                  </label>
                  <p className="text-gray-900 capitalize">{contractorProfile.gender}</p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Address
                </label>
                {isEditing ? (
                  <textarea
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    value={editData.address || ''}
                    onChange={(e) => setEditData(prev => ({ ...prev, address: e.target.value }))}
                    rows={3}
                  />
                ) : (
                  <p className="text-gray-900">{contractorProfile.address}</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Professional Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Hammer className="w-5 h-5" />
                Professional Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Years of Experience
                  </label>
                  {isEditing ? (
                    <Input
                      type="number"
                      value={editData.experience || ''}
                      onChange={(e) => setEditData(prev => ({ ...prev, experience: parseInt(e.target.value) || 0 }))}
                    />
                  ) : (
                    <p className="text-gray-900">{contractorProfile.experience} years</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Application Date
                  </label>
                  <p className="text-gray-900">{formatRelativeTime(contractorProfile.createdAt)}</p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Specializations
                </label>
                <div className="flex flex-wrap gap-2">
                  {contractorProfile.specializations.map((spec, index) => {
                    const IconComponent = SPECIALIZATION_ICONS[spec] || Hammer;
                    return (
                      <span
                        key={index}
                        className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-orange-100 text-orange-800"
                      >
                        <IconComponent className="w-3 h-3 mr-1" />
                        {spec.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      </span>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Service Areas
                </label>
                <div className="flex flex-wrap gap-2">
                  {contractorProfile.serviceAreas.map((area, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary-100 text-primary-800"
                    >
                      <MapPin className="w-3 h-3 mr-1" />
                      {area}
                    </span>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Documents */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Submitted Documents
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <FileText className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">Aadhaar Document</h4>
                    <p className="text-sm text-gray-600">Submitted and verified</p>
                  </div>
                  <CheckCircle className="w-5 h-5 text-green-600 ml-auto" />
                </div>

                <div className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg">
                  <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                    <FileText className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">PAN Document</h4>
                    <p className="text-sm text-gray-600">Submitted and verified</p>
                  </div>
                  <CheckCircle className="w-5 h-5 text-green-600 ml-auto" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
