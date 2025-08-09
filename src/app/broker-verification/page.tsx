'use client';

import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/layout';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Loading } from '@/components/ui/Loading';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { 
  Shield,
  Upload,
  FileText,
  CheckCircle,
  Clock,
  AlertTriangle,
  User,
  Award,
  Camera,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Star,
  Eye,
  Download
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

interface VerificationDocument {
  id: string;
  type: 'rera_certificate' | 'real_estate_license' | 'pan_card' | 'aadhar_card' | 'business_license' | 'experience_certificate';
  name: string;
  url: string;
  status: 'pending' | 'verified' | 'rejected';
  uploadedAt: string;
  verifiedAt?: string;
  rejectionReason?: string;
}

interface BrokerVerification {
  id: string;
  brokerId: string;
  brokerName: string;
  email: string;
  phone: string;
  profileImage?: string;
  businessDetails: {
    companyName: string;
    businessAddress: string;
    yearsOfExperience: number;
    specializations: string[];
    serviceAreas: string[];
  };
  documents: VerificationDocument[];
  overallStatus: 'pending' | 'in_review' | 'verified' | 'rejected' | 'incomplete';
  submittedAt: string;
  reviewedAt?: string;
  reviewedBy?: string;
  verificationScore: number;
  notes?: string;
}

export default function BrokerVerificationPage() {
  const [verifications, setVerifications] = useState<BrokerVerification[]>([]);
  const [filteredVerifications, setFilteredVerifications] = useState<BrokerVerification[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedVerification, setSelectedVerification] = useState<BrokerVerification | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const { user, isAdmin } = useAuth();

  useEffect(() => {
    loadVerifications();
  }, []);

  useEffect(() => {
    filterVerifications();
  }, [verifications, searchTerm, statusFilter]);

  const loadVerifications = async () => {
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      const mockVerifications: BrokerVerification[] = [
        {
          id: '1',
          brokerId: 'broker1',
          brokerName: 'Rajesh Kumar',
          email: 'rajesh@example.com',
          phone: '+91 9876543210',
          profileImage: '/api/placeholder/150/150',
          businessDetails: {
            companyName: 'Kumar Real Estate Solutions',
            businessAddress: 'Whitefield, Bangalore, Karnataka',
            yearsOfExperience: 8,
            specializations: ['Residential', 'Commercial', 'Investment'],
            serviceAreas: ['Bangalore', 'Whitefield', 'Electronic City']
          },
          documents: [
            {
              id: 'doc1',
              type: 'rera_certificate',
              name: 'RERA Certificate',
              url: '/documents/rera_cert.pdf',
              status: 'verified',
              uploadedAt: '2024-01-15T10:00:00Z',
              verifiedAt: '2024-01-16T14:30:00Z'
            },
            {
              id: 'doc2',
              type: 'real_estate_license',
              name: 'Real Estate License',
              url: '/documents/license.pdf',
              status: 'verified',
              uploadedAt: '2024-01-15T10:05:00Z',
              verifiedAt: '2024-01-16T14:35:00Z'
            },
            {
              id: 'doc3',
              type: 'pan_card',
              name: 'PAN Card',
              url: '/documents/pan.pdf',
              status: 'verified',
              uploadedAt: '2024-01-15T10:10:00Z',
              verifiedAt: '2024-01-16T14:40:00Z'
            }
          ],
          overallStatus: 'verified',
          submittedAt: '2024-01-15T10:00:00Z',
          reviewedAt: '2024-01-16T15:00:00Z',
          reviewedBy: 'Admin User',
          verificationScore: 95,
          notes: 'All documents verified successfully. Excellent track record.'
        },
        {
          id: '2',
          brokerId: 'broker2',
          brokerName: 'Priya Sharma',
          email: 'priya@example.com',
          phone: '+91 9876543211',
          profileImage: '/api/placeholder/150/150',
          businessDetails: {
            companyName: 'Sharma Properties',
            businessAddress: 'Bandra, Mumbai, Maharashtra',
            yearsOfExperience: 5,
            specializations: ['Residential', 'Luxury Homes'],
            serviceAreas: ['Mumbai', 'Bandra', 'Juhu']
          },
          documents: [
            {
              id: 'doc4',
              type: 'rera_certificate',
              name: 'RERA Certificate',
              url: '/documents/rera_cert2.pdf',
              status: 'pending',
              uploadedAt: '2024-01-18T09:00:00Z'
            },
            {
              id: 'doc5',
              type: 'real_estate_license',
              name: 'Real Estate License',
              url: '/documents/license2.pdf',
              status: 'pending',
              uploadedAt: '2024-01-18T09:05:00Z'
            }
          ],
          overallStatus: 'in_review',
          submittedAt: '2024-01-18T09:00:00Z',
          verificationScore: 0
        },
        {
          id: '3',
          brokerId: 'broker3',
          brokerName: 'Amit Patel',
          email: 'amit@example.com',
          phone: '+91 9876543212',
          businessDetails: {
            companyName: 'Patel Realty',
            businessAddress: 'Hinjewadi, Pune, Maharashtra',
            yearsOfExperience: 3,
            specializations: ['Commercial', 'Industrial'],
            serviceAreas: ['Pune', 'Hinjewadi', 'Wakad']
          },
          documents: [
            {
              id: 'doc6',
              type: 'rera_certificate',
              name: 'RERA Certificate',
              url: '/documents/rera_cert3.pdf',
              status: 'rejected',
              uploadedAt: '2024-01-16T11:00:00Z',
              rejectionReason: 'Document is not clear. Please upload a clearer copy.'
            }
          ],
          overallStatus: 'rejected',
          submittedAt: '2024-01-16T11:00:00Z',
          reviewedAt: '2024-01-17T10:00:00Z',
          reviewedBy: 'Admin User',
          verificationScore: 0,
          notes: 'Document quality issues. Broker needs to resubmit clearer documents.'
        }
      ];

      setVerifications(mockVerifications);
      setLoading(false);
    }, 1000);
  };

  const filterVerifications = () => {
    let filtered = [...verifications];

    if (searchTerm) {
      filtered = filtered.filter(verification =>
        verification.brokerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        verification.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        verification.businessDetails.companyName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(verification => verification.overallStatus === statusFilter);
    }

    setFilteredVerifications(filtered);
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      pending: 'bg-gray-100 text-gray-800',
      in_review: 'bg-blue-100 text-blue-800',
      verified: 'bg-success/10 text-success',
      rejected: 'bg-error/10 text-error',
      incomplete: 'bg-warning/10 text-warning'
    };

    const icons = {
      pending: <Clock className="w-3 h-3" />,
      in_review: <Eye className="w-3 h-3" />,
      verified: <CheckCircle className="w-3 h-3" />,
      rejected: <AlertTriangle className="w-3 h-3" />,
      incomplete: <FileText className="w-3 h-3" />
    };

    return (
      <span className={`inline-flex items-center space-x-1 px-2 py-1 rounded-lg text-xs font-medium ${styles[status as keyof typeof styles]}`}>
        {icons[status as keyof typeof icons]}
        <span className="capitalize">{status.replace('_', ' ')}</span>
      </span>
    );
  };

  const getDocumentStatusBadge = (status: string) => {
    const styles = {
      pending: 'bg-warning/10 text-warning',
      verified: 'bg-success/10 text-success',
      rejected: 'bg-error/10 text-error'
    };

    return (
      <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${styles[status as keyof typeof styles]}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleVerificationAction = (verificationId: string, action: 'approve' | 'reject', notes?: string) => {
    // Handle verification approval/rejection
    console.log('Verification action:', { verificationId, action, notes });
    // Update verification status
    setVerifications(prev => prev.map(v => 
      v.id === verificationId 
        ? { 
            ...v, 
            overallStatus: action === 'approve' ? 'verified' : 'rejected',
            reviewedAt: new Date().toISOString(),
            reviewedBy: user?.name || 'Admin',
            notes: notes || v.notes,
            verificationScore: action === 'approve' ? 95 : 0
          }
        : v
    ));
    setShowDetails(false);
  };

  const breadcrumbs = [
    { label: 'Broker Verification', current: true }
  ];

  if (!isAdmin()) {
    return (
      <ProtectedRoute>
        <DashboardLayout
          breadcrumbs={breadcrumbs}
          title="Access Denied"
          description="Only administrators can access broker verification"
        >
          <div className="text-center py-12">
            <Shield className="w-16 h-16 text-text-secondary mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-text-primary mb-2">
              Access Restricted
            </h3>
            <p className="text-text-secondary">
              You need administrator privileges to access broker verification.
            </p>
          </div>
        </DashboardLayout>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <DashboardLayout
        breadcrumbs={breadcrumbs}
        title="Broker Verification"
        description="Review and verify broker applications and documents"
      >
        {loading ? (
          <div className="flex items-center justify-center min-h-[400px]">
            <Loading size="lg" text="Loading verification requests..." />
          </div>
        ) : (
          <div className="space-y-8">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card>
                <CardContent className="p-6 text-center">
                  <Clock className="w-8 h-8 text-warning mx-auto mb-3" />
                  <p className="text-2xl font-bold text-text-primary">
                    {verifications.filter(v => v.overallStatus === 'pending' || v.overallStatus === 'in_review').length}
                  </p>
                  <p className="text-sm text-text-secondary">Pending Review</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6 text-center">
                  <CheckCircle className="w-8 h-8 text-success mx-auto mb-3" />
                  <p className="text-2xl font-bold text-text-primary">
                    {verifications.filter(v => v.overallStatus === 'verified').length}
                  </p>
                  <p className="text-sm text-text-secondary">Verified</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6 text-center">
                  <AlertTriangle className="w-8 h-8 text-error mx-auto mb-3" />
                  <p className="text-2xl font-bold text-text-primary">
                    {verifications.filter(v => v.overallStatus === 'rejected').length}
                  </p>
                  <p className="text-sm text-text-secondary">Rejected</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6 text-center">
                  <User className="w-8 h-8 text-primary mx-auto mb-3" />
                  <p className="text-2xl font-bold text-text-primary">{verifications.length}</p>
                  <p className="text-sm text-text-secondary">Total Applications</p>
                </CardContent>
              </Card>
            </div>

            {/* Filters */}
            <Card>
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-4">
                  <Input
                    placeholder="Search by broker name, email, or company..."
                    leftIcon={<User className="w-4 h-4" />}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="md:w-80"
                  />
                  
                  <select
                    className="form-input"
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                  >
                    <option value="all">All Status</option>
                    <option value="pending">Pending</option>
                    <option value="in_review">In Review</option>
                    <option value="verified">Verified</option>
                    <option value="rejected">Rejected</option>
                    <option value="incomplete">Incomplete</option>
                  </select>
                </div>
              </CardContent>
            </Card>

            {/* Verification List */}
            {filteredVerifications.length === 0 ? (
              <div className="text-center py-12">
                <Shield className="w-16 h-16 text-text-secondary mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-text-primary mb-2">
                  No verification requests found
                </h3>
                <p className="text-text-secondary">
                  {verifications.length === 0 
                    ? "No broker verification requests have been submitted yet."
                    : "Try adjusting your search or filters."
                  }
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredVerifications.map((verification) => (
                  <Card key={verification.id} className="overflow-hidden">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-4">
                          <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center">
                            {verification.profileImage ? (
                              <img
                                src={verification.profileImage}
                                alt={verification.brokerName}
                                className="w-full h-full rounded-full object-cover"
                              />
                            ) : (
                              <User className="w-8 h-8 text-white" />
                            )}
                          </div>
                          
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-2">
                              <h3 className="text-lg font-semibold text-text-primary">
                                {verification.brokerName}
                              </h3>
                              {getStatusBadge(verification.overallStatus)}
                              {verification.verificationScore > 0 && (
                                <div className="flex items-center space-x-1">
                                  <Star className="w-4 h-4 text-warning fill-current" />
                                  <span className="text-sm font-medium">{verification.verificationScore}%</span>
                                </div>
                              )}
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-text-secondary mb-3">
                              <div className="flex items-center">
                                <Mail className="w-4 h-4 mr-2" />
                                <span>{verification.email}</span>
                              </div>
                              <div className="flex items-center">
                                <Phone className="w-4 h-4 mr-2" />
                                <span>{verification.phone}</span>
                              </div>
                              <div className="flex items-center">
                                <Award className="w-4 h-4 mr-2" />
                                <span>{verification.businessDetails.companyName}</span>
                              </div>
                              <div className="flex items-center">
                                <Calendar className="w-4 h-4 mr-2" />
                                <span>{verification.businessDetails.yearsOfExperience} years experience</span>
                              </div>
                            </div>
                            
                            <div className="flex items-center space-x-4 text-sm text-text-secondary">
                              <div className="flex items-center">
                                <FileText className="w-4 h-4 mr-1" />
                                <span>{verification.documents.length} documents</span>
                              </div>
                              <div className="flex items-center">
                                <Clock className="w-4 h-4 mr-1" />
                                <span>Submitted {formatDate(verification.submittedAt)}</span>
                              </div>
                              {verification.reviewedAt && (
                                <div className="flex items-center">
                                  <CheckCircle className="w-4 h-4 mr-1" />
                                  <span>Reviewed {formatDate(verification.reviewedAt)}</span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setSelectedVerification(verification);
                              setShowDetails(true);
                            }}
                          >
                            <Eye className="w-4 h-4 mr-1" />
                            Review
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {/* Verification Details Modal */}
            {showDetails && selectedVerification && (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
                  <CardHeader>
                    <CardTitle>Verification Details - {selectedVerification.brokerName}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {/* Business Details */}
                      <div>
                        <h4 className="font-semibold mb-3">Business Information</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="font-medium">Company:</span> {selectedVerification.businessDetails.companyName}
                          </div>
                          <div>
                            <span className="font-medium">Experience:</span> {selectedVerification.businessDetails.yearsOfExperience} years
                          </div>
                          <div className="md:col-span-2">
                            <span className="font-medium">Address:</span> {selectedVerification.businessDetails.businessAddress}
                          </div>
                          <div>
                            <span className="font-medium">Specializations:</span> {selectedVerification.businessDetails.specializations.join(', ')}
                          </div>
                          <div>
                            <span className="font-medium">Service Areas:</span> {selectedVerification.businessDetails.serviceAreas.join(', ')}
                          </div>
                        </div>
                      </div>

                      {/* Documents */}
                      <div>
                        <h4 className="font-semibold mb-3">Documents</h4>
                        <div className="space-y-3">
                          {selectedVerification.documents.map((doc) => (
                            <div key={doc.id} className="flex items-center justify-between p-3 border border-gray-light rounded-lg">
                              <div className="flex items-center space-x-3">
                                <FileText className="w-5 h-5 text-text-secondary" />
                                <div>
                                  <p className="font-medium">{doc.name}</p>
                                  <p className="text-sm text-text-secondary">
                                    Uploaded {formatDate(doc.uploadedAt)}
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-center space-x-2">
                                {getDocumentStatusBadge(doc.status)}
                                <Button variant="ghost" size="sm">
                                  <Download className="w-4 h-4" />
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex space-x-2 pt-4 border-t border-gray-light">
                        <Button
                          variant="outline"
                          onClick={() => setShowDetails(false)}
                          className="flex-1"
                        >
                          Close
                        </Button>
                        {selectedVerification.overallStatus !== 'verified' && (
                          <>
                            <Button
                              variant="outline"
                              onClick={() => handleVerificationAction(selectedVerification.id, 'reject')}
                              className="flex-1"
                            >
                              Reject
                            </Button>
                            <Button
                              variant="primary"
                              onClick={() => handleVerificationAction(selectedVerification.id, 'approve')}
                              className="flex-1"
                            >
                              Approve
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        )}
      </DashboardLayout>
    </ProtectedRoute>
  );
}
