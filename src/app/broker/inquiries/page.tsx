'use client';

import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/layout';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Loading } from '@/components/ui/Loading';
import {
  MessageSquare,
  Search,
  Filter,
  Phone,
  Mail,
  Calendar,
  User,
  Home,
  Star,
  Reply,
  CheckCircle,
  Clock,
  AlertTriangle,
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { formatRelativeTime } from '@/lib/utils';

interface Inquiry {
  _id: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  propertyName: string;
  propertyId: string;
  message: string;
  status: 'new' | 'replied' | 'closed';
  priority: 'low' | 'medium' | 'high';
  createdAt: string;
  lastReply?: string;
}

const INQUIRY_STATUS_CONFIG = {
  new: { label: 'New', color: 'text-blue-600', bgColor: 'bg-blue-50', icon: AlertTriangle },
  replied: { label: 'Replied', color: 'text-green-600', bgColor: 'bg-green-50', icon: CheckCircle },
  closed: { label: 'Closed', color: 'text-gray-600', bgColor: 'bg-gray-50', icon: CheckCircle },
};

const PRIORITY_CONFIG = {
  low: { label: 'Low', color: 'text-green-600', bgColor: 'bg-green-50' },
  medium: { label: 'Medium', color: 'text-yellow-600', bgColor: 'bg-yellow-50' },
  high: { label: 'High', color: 'text-red-600', bgColor: 'bg-red-50' },
};

export default function BrokerInquiriesPage() {
  const { user } = useAuth();
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null);
  const [replyMessage, setReplyMessage] = useState('');

  useEffect(() => {
    loadInquiries();
  }, []);

  const loadInquiries = async () => {
    try {
      setIsLoading(true);
      // Mock data for demonstration
      const mockInquiries: Inquiry[] = [
        {
          _id: '1',
          clientName: 'Rajesh Kumar',
          clientEmail: 'rajesh.kumar@email.com',
          clientPhone: '+91 9876543210',
          propertyName: '3BHK Luxury Apartment',
          propertyId: 'prop1',
          message: 'I am interested in this property. Can we schedule a viewing this weekend?',
          status: 'new',
          priority: 'high',
          createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        },
        {
          _id: '2',
          clientName: 'Priya Sharma',
          clientEmail: 'priya.sharma@email.com',
          clientPhone: '+91 9876543211',
          propertyName: '2BHK Modern Flat',
          propertyId: 'prop2',
          message: 'What is the final price for this property? Is there any room for negotiation?',
          status: 'replied',
          priority: 'medium',
          createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
          lastReply: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
        },
        {
          _id: '3',
          clientName: 'Amit Patel',
          clientEmail: 'amit.patel@email.com',
          clientPhone: '+91 9876543212',
          propertyName: 'Independent Villa',
          propertyId: 'prop3',
          message: 'I would like to know more about the amenities and nearby facilities.',
          status: 'new',
          priority: 'medium',
          createdAt: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
        },
      ];
      setInquiries(mockInquiries);
    } catch (error) {
      console.error('Error loading inquiries:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReply = async (inquiryId: string) => {
    if (!replyMessage.trim()) return;

    try {
      // In real app, this would send the reply via API
      setInquiries(prev => prev.map(inquiry => 
        inquiry._id === inquiryId 
          ? { ...inquiry, status: 'replied' as const, lastReply: new Date().toISOString() }
          : inquiry
      ));
      setReplyMessage('');
      setSelectedInquiry(null);
    } catch (error) {
      console.error('Error sending reply:', error);
    }
  };

  const handleStatusChange = (inquiryId: string, newStatus: 'new' | 'replied' | 'closed') => {
    setInquiries(prev => prev.map(inquiry => 
      inquiry._id === inquiryId ? { ...inquiry, status: newStatus } : inquiry
    ));
  };

  const filteredInquiries = inquiries.filter(inquiry => {
    const matchesSearch = inquiry.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         inquiry.propertyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         inquiry.message.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || inquiry.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const breadcrumbs = [
    { label: 'Broker Dashboard', href: '/broker/dashboard' },
    { label: 'Client Inquiries', current: true }
  ];

  if (isLoading) {
    return (
      <ProtectedRoute allowedRoles={['broker']}>
        <DashboardLayout
          breadcrumbs={breadcrumbs}
          title="Client Inquiries"
          description="Manage and respond to client inquiries"
        >
          <Loading />
        </DashboardLayout>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute allowedRoles={['broker']}>
      <DashboardLayout
        breadcrumbs={breadcrumbs}
        title="Client Inquiries"
        description="Manage and respond to client inquiries"
      >
        <div className="space-y-6">
          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Inquiries</p>
                    <p className="text-2xl font-bold text-gray-900">{inquiries.length}</p>
                  </div>
                  <MessageSquare className="w-8 h-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">New Inquiries</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {inquiries.filter(i => i.status === 'new').length}
                    </p>
                  </div>
                  <AlertTriangle className="w-8 h-8 text-red-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Replied</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {inquiries.filter(i => i.status === 'replied').length}
                    </p>
                  </div>
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">High Priority</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {inquiries.filter(i => i.priority === 'high').length}
                    </p>
                  </div>
                  <Star className="w-8 h-8 text-yellow-600" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Filters */}
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      placeholder="Search inquiries..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <div className="sm:w-48">
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="all">All Status</option>
                    <option value="new">New</option>
                    <option value="replied">Replied</option>
                    <option value="closed">Closed</option>
                  </select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Inquiries List */}
          {filteredInquiries.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MessageSquare className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {inquiries.length === 0 ? 'No inquiries yet' : 'No inquiries found'}
                </h3>
                <p className="text-gray-600">
                  {inquiries.length === 0 
                    ? 'Client inquiries will appear here when they contact you about your properties.'
                    : 'Try adjusting your search or filters.'
                  }
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-6">
              {filteredInquiries.map((inquiry) => {
                const statusConfig = INQUIRY_STATUS_CONFIG[inquiry.status];
                const priorityConfig = PRIORITY_CONFIG[inquiry.priority];
                const StatusIcon = statusConfig.icon;
                
                return (
                  <Card key={inquiry._id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-3">
                            <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                              <User className="w-5 h-5 text-primary-600" />
                            </div>
                            <div>
                              <h3 className="font-semibold text-gray-900">{inquiry.clientName}</h3>
                              <p className="text-sm text-gray-600">
                                Interested in: {inquiry.propertyName}
                              </p>
                            </div>
                            <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${statusConfig.color} ${statusConfig.bgColor}`}>
                              <StatusIcon className="w-3 h-3" />
                              {statusConfig.label}
                            </span>
                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${priorityConfig.color} ${priorityConfig.bgColor}`}>
                              {priorityConfig.label} Priority
                            </span>
                          </div>
                          
                          <p className="text-gray-700 mb-4">{inquiry.message}</p>
                          
                          <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                            <div className="flex items-center gap-1">
                              <Mail className="w-4 h-4" />
                              {inquiry.clientEmail}
                            </div>
                            <div className="flex items-center gap-1">
                              <Phone className="w-4 h-4" />
                              {inquiry.clientPhone}
                            </div>
                            <div className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              {formatRelativeTime(inquiry.createdAt)}
                            </div>
                          </div>

                          {inquiry.lastReply && (
                            <p className="text-xs text-gray-500">
                              Last replied: {formatRelativeTime(inquiry.lastReply)}
                            </p>
                          )}
                        </div>

                        <div className="flex items-center gap-2 ml-4">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setSelectedInquiry(inquiry)}
                          >
                            <Reply className="w-4 h-4 mr-1" />
                            Reply
                          </Button>
                          
                          <select
                            value={inquiry.status}
                            onChange={(e) => handleStatusChange(inquiry._id, e.target.value as any)}
                            className="px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-primary-500"
                          >
                            <option value="new">New</option>
                            <option value="replied">Replied</option>
                            <option value="closed">Closed</option>
                          </select>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}

          {/* Reply Modal */}
          {selectedInquiry && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
              <Card className="w-full max-w-2xl">
                <CardHeader>
                  <CardTitle>Reply to {selectedInquiry.clientName}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600 mb-2">Original Message:</p>
                    <p className="text-gray-900">{selectedInquiry.message}</p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Your Reply
                    </label>
                    <textarea
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                      value={replyMessage}
                      onChange={(e) => setReplyMessage(e.target.value)}
                      placeholder="Type your reply here..."
                      rows={5}
                    />
                  </div>
                  
                  <div className="flex justify-end gap-3">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setSelectedInquiry(null);
                        setReplyMessage('');
                      }}
                    >
                      Cancel
                    </Button>
                    <Button
                      variant="primary"
                      onClick={() => handleReply(selectedInquiry._id)}
                      disabled={!replyMessage.trim()}
                    >
                      Send Reply
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
