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
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { brokersService, BrokerProfile } from '@/services/brokers.service';
import { formatRelativeTime } from '@/lib/utils';

export default function BrokerProfilePage() {
  const { user } = useAuth();
  const [brokerProfile, setBrokerProfile] = useState<BrokerProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState<Partial<BrokerProfile>>({});

  useEffect(() => {
    loadBrokerProfile();
  }, []);

  const loadBrokerProfile = async () => {
    try {
      setIsLoading(true);
      const response = await brokersService.getBrokerApplication();
      if (response.success && response.data) {
        setBrokerProfile(response.data);
        setEditData(response.data);
      }
    } catch (error) {
      console.error('Error loading broker profile:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    if (!brokerProfile) return;

    try {
      const response = await brokersService.updateBrokerProfile(editData);
      if (response.success) {
        setBrokerProfile({ ...brokerProfile, ...editData });
        setIsEditing(false);
      }
    } catch (error) {
      console.error('Error updating broker profile:', error);
    }
  };

  const handleCancel = () => {
    setEditData(brokerProfile || {});
    setIsEditing(false);
  };

  const breadcrumbs = [
    { label: 'Broker Dashboard', href: '/broker/dashboard' },
    { label: 'Profile', current: true }
  ];

  if (isLoading) {
    return (
      <ProtectedRoute allowedRoles={['broker']}>
        <DashboardLayout
          breadcrumbs={breadcrumbs}
          title="Broker Profile"
          description="Manage your broker profile and information"
        >
          <Loading />
        </DashboardLayout>
      </ProtectedRoute>
    );
  }

  if (!brokerProfile) {
    return (
      <ProtectedRoute allowedRoles={['broker']}>
        <DashboardLayout
          breadcrumbs={breadcrumbs}
          title="Broker Profile"
          description="Manage your broker profile and information"
        >
          <Card>
            <CardContent className="text-center py-12">
              <AlertTriangle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No Broker Profile Found
              </h3>
              <p className="text-gray-600 mb-6">
                You haven't applied to become a broker yet.
              </p>
              <Button variant="primary" href="/become-broker">
                Apply to Become a Broker
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

  const statusConfig = getStatusConfig(brokerProfile.status);
  const StatusIcon = statusConfig.icon;

  return (
    <ProtectedRoute allowedRoles={['broker']}>
      <DashboardLayout
        breadcrumbs={breadcrumbs}
        title="Broker Profile"
        description="Manage your broker profile and information"
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
                    {brokerProfile.status === 'approved' && 'Your broker application has been approved. You can now list properties and connect with clients.'}
                    {brokerProfile.status === 'pending' && 'Your broker application is under review. We\'ll notify you once the review is complete.'}
                    {brokerProfile.status === 'rejected' && 'Your broker application was rejected. Please contact support for more information.'}
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
                    <p className="text-gray-900">{brokerProfile.nameOnAadhaar}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Aadhaar Number
                  </label>
                  <p className="text-gray-900">
                    {brokerProfile.aadhaarNumber.replace(/(\d{4})(\d{4})(\d{4})/, '****-****-$3')}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date of Birth
                  </label>
                  <p className="text-gray-900">{new Date(brokerProfile.dateOfBirth).toLocaleDateString()}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Gender
                  </label>
                  <p className="text-gray-900 capitalize">{brokerProfile.gender}</p>
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
                  <p className="text-gray-900">{brokerProfile.address}</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Professional Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="w-5 h-5" />
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
                    <p className="text-gray-900">{brokerProfile.experience} years</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Application Date
                  </label>
                  <p className="text-gray-900">{formatRelativeTime(brokerProfile.createdAt)}</p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Service Areas
                </label>
                <div className="flex flex-wrap gap-2">
                  {brokerProfile.serviceAreas.map((area, index) => (
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
