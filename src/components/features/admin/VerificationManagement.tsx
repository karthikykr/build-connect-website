'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Loading } from '@/components/ui/Loading';
import {
  Shield,
  Search,
  Filter,
  Eye,
  Check,
  X,
  Clock,
  FileText,
  User,
  Calendar,
  MapPin,
  Phone,
  Mail,
  Download,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Hammer,
  Briefcase,
} from 'lucide-react';
import { adminService, VerificationRequest } from '@/services/admin.service';
import { formatRelativeTime } from '@/lib/utils';

interface VerificationManagementProps {
  user: any;
}

export function VerificationManagement({ user }: VerificationManagementProps) {
  const [verifications, setVerifications] = useState<VerificationRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('pending');
  const [selectedVerification, setSelectedVerification] = useState<VerificationRequest | null>(null);

  useEffect(() => {
    loadVerifications();
  }, [selectedType, selectedStatus]);

  const loadVerifications = async () => {
    try {
      setIsLoading(true);
      
      // Load both broker and contractor applications
      const [brokerResponse, contractorResponse] = await Promise.all([
        adminService.getBrokerApplications(selectedStatus !== 'all' ? selectedStatus as any : undefined),
        adminService.getContractorApplications(selectedStatus !== 'all' ? selectedStatus as any : undefined),
      ]);

      const allVerifications: VerificationRequest[] = [];

      if (brokerResponse.success) {
        allVerifications.push(...brokerResponse.data);
      }

      if (contractorResponse.success) {
        allVerifications.push(...contractorResponse.data);
      }

      // Filter by type
      const filteredVerifications = selectedType === 'all' 
        ? allVerifications 
        : allVerifications.filter(v => v.type === selectedType);

      setVerifications(filteredVerifications);
    } catch (error) {
      console.error('Error loading verifications:', error);
      // Mock data for demonstration
      const mockVerifications: VerificationRequest[] = [
        {
          _id: '1',
          type: 'broker',
          applicantName: 'Rajesh Kumar',
          email: 'rajesh.kumar@email.com',
          phone: '+91 9876543210',
          status: 'pending',
          submittedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          documents: [
            { type: 'aadhaar', url: '/documents/aadhaar-1.pdf', verified: false },
            { type: 'pan', url: '/documents/pan-1.pdf', verified: false },
            { type: 'license', url: '/documents/license-1.pdf', verified: false },
          ],
          experience: 5,
          specializations: ['residential', 'commercial'],
          serviceAreas: ['Bangalore', 'Mumbai'],
          notes: '',
        },
        {
          _id: '2',
          type: 'contractor',
          applicantName: 'Priya Sharma',
          email: 'priya.sharma@email.com',
          phone: '+91 9876543211',
          status: 'pending',
          submittedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
          documents: [
            { type: 'aadhaar', url: '/documents/aadhaar-2.pdf', verified: false },
            { type: 'pan', url: '/documents/pan-2.pdf', verified: false },
          ],
          experience: 8,
          specializations: ['renovation', 'interior_design'],
          serviceAreas: ['Delhi', 'Gurgaon'],
          notes: '',
        },
        {
          _id: '3',
          type: 'broker',
          applicantName: 'Amit Patel',
          email: 'amit.patel@email.com',
          phone: '+91 9876543212',
          status: 'approved',
          submittedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
          reviewedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
          reviewedBy: 'Admin User',
          documents: [
            { type: 'aadhaar', url: '/documents/aadhaar-3.pdf', verified: true },
            { type: 'pan', url: '/documents/pan-3.pdf', verified: true },
            { type: 'license', url: '/documents/license-3.pdf', verified: true },
          ],
          experience: 3,
          specializations: ['residential'],
          serviceAreas: ['Chennai', 'Coimbatore'],
          notes: 'All documents verified successfully.',
        },
      ];
      setVerifications(mockVerifications);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerificationAction = async (verificationId: string, action: 'approve' | 'reject', notes?: string) => {
    try {
      const verification = verifications.find(v => v._id === verificationId);
      if (!verification) return;

      if (verification.type === 'broker') {
        await adminService.updateBrokerApplicationStatus(verificationId, action === 'approve' ? 'approved' : 'rejected', notes);
      } else {
        await adminService.updateContractorApplicationStatus(verificationId, action === 'approve' ? 'approved' : 'rejected', notes);
      }

      loadVerifications();
      setSelectedVerification(null);
    } catch (error) {
      console.error(`Error ${action}ing verification:`, error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'text-yellow-600 bg-yellow-50';
      case 'approved': return 'text-green-600 bg-green-50';
      case 'rejected': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'broker': return Briefcase;
      case 'contractor': return Hammer;
      default: return User;
    }
  };

  const filteredVerifications = verifications.filter(verification =>
    verification.applicantName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    verification.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="space-y-6">
      {/* Header with Search and Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search by name or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <div className="flex gap-3">
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="all">All Types</option>
                <option value="broker">Brokers</option>
                <option value="contractor">Contractors</option>
              </select>

              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>

              <Button variant="outline" onClick={loadVerifications}>
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Verifications List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Verification Requests ({filteredVerifications.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {filteredVerifications.length === 0 ? (
            <div className="text-center py-12">
              <Shield className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No verification requests found</h3>
              <p className="text-gray-600">Try adjusting your search criteria or filters.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredVerifications.map((verification) => {
                const TypeIcon = getTypeIcon(verification.type);
                return (
                  <div key={verification._id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                          <TypeIcon className="w-6 h-6 text-gray-600" />
                        </div>
                        
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-semibold text-gray-900">{verification.applicantName}</h3>
                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(verification.status)}`}>
                              {verification.status.charAt(0).toUpperCase() + verification.status.slice(1)}
                            </span>
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                              {verification.type.charAt(0).toUpperCase() + verification.type.slice(1)}
                            </span>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-600 mb-3">
                            <div className="flex items-center gap-1">
                              <Mail className="w-3 h-3" />
                              {verification.email}
                            </div>
                            <div className="flex items-center gap-1">
                              <Phone className="w-3 h-3" />
                              {verification.phone}
                            </div>
                            <div className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              Submitted {formatRelativeTime(verification.submittedAt)}
                            </div>
                            <div className="flex items-center gap-1">
                              <Hammer className="w-3 h-3" />
                              {verification.experience} years experience
                            </div>
                          </div>

                          <div className="flex flex-wrap gap-1 mb-3">
                            {verification.specializations.map((spec, index) => (
                              <span key={index} className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                {spec.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                              </span>
                            ))}
                          </div>

                          <div className="flex items-center gap-2 text-sm">
                            <span className="text-gray-600">Documents:</span>
                            {verification.documents.map((doc, index) => (
                              <span key={index} className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${doc.verified ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                {doc.type.toUpperCase()}
                                {doc.verified ? <CheckCircle className="w-3 h-3 ml-1" /> : <Clock className="w-3 h-3 ml-1" />}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setSelectedVerification(verification)}
                        >
                          <Eye className="w-3 h-3 mr-1" />
                          Review
                        </Button>
                        
                        {verification.status === 'pending' && (
                          <>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleVerificationAction(verification._id, 'approve')}
                              className="text-green-600 border-green-600 hover:bg-green-50"
                            >
                              <Check className="w-3 h-3 mr-1" />
                              Approve
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleVerificationAction(verification._id, 'reject')}
                              className="text-red-600 border-red-600 hover:bg-red-50"
                            >
                              <X className="w-3 h-3 mr-1" />
                              Reject
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Verification Detail Modal */}
      {selectedVerification && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Verification Details - {selectedVerification.applicantName}</span>
                <Button variant="outline" size="sm" onClick={() => setSelectedVerification(null)}>
                  <X className="w-4 h-4" />
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Applicant Information */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Applicant Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                    <p className="text-gray-900">{selectedVerification.applicantName}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <p className="text-gray-900">{selectedVerification.email}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                    <p className="text-gray-900">{selectedVerification.phone}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Experience</label>
                    <p className="text-gray-900">{selectedVerification.experience} years</p>
                  </div>
                </div>
              </div>

              {/* Documents */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Documents</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {selectedVerification.documents.map((doc, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-gray-900">{doc.type.toUpperCase()}</h4>
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${doc.verified ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                          {doc.verified ? 'Verified' : 'Pending'}
                        </span>
                      </div>
                      <Button size="sm" variant="outline" className="w-full">
                        <FileText className="w-3 h-3 mr-1" />
                        View Document
                      </Button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Specializations and Service Areas */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Specializations</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedVerification.specializations.map((spec, index) => (
                      <span key={index} className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                        {spec.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Service Areas</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedVerification.serviceAreas.map((area, index) => (
                      <span key={index} className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                        <MapPin className="w-3 h-3 mr-1" />
                        {area}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Notes */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Review Notes</h3>
                <textarea
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="Add review notes..."
                  rows={4}
                  defaultValue={selectedVerification.notes}
                />
              </div>

              {/* Actions */}
              {selectedVerification.status === 'pending' && (
                <div className="flex justify-end gap-3">
                  <Button
                    variant="outline"
                    onClick={() => handleVerificationAction(selectedVerification._id, 'reject')}
                    className="text-red-600 border-red-600 hover:bg-red-50"
                  >
                    <X className="w-4 h-4 mr-2" />
                    Reject Application
                  </Button>
                  <Button
                    variant="primary"
                    onClick={() => handleVerificationAction(selectedVerification._id, 'approve')}
                  >
                    <Check className="w-4 h-4 mr-2" />
                    Approve Application
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
