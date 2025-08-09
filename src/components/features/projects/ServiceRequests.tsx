'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Loading } from '@/components/ui/Loading';
import { 
  Plus,
  MessageSquare,
  User,
  Calendar,
  CheckCircle,
  XCircle,
  Clock,
  Send,
  Search,
  Filter
} from 'lucide-react';
import { Project, ServiceRequest } from '@/types';
import { sitesService, CreateServiceRequestRequest } from '@/services/sites.service';
import { brokersService } from '@/services/brokers.service';
import { contractorsService } from '@/services/contractors.service';
import { formatRelativeTime } from '@/lib/utils';

interface ServiceRequestsProps {
  project: Project;
  onUpdate: () => void;
}

interface Professional {
  _id: string;
  name: string;
  role: 'broker' | 'contractor';
  experience: number;
  rating: number;
  location: string[];
}

const REQUEST_STATUS_CONFIG = {
  pending: { label: 'Pending', color: 'text-yellow-600', bgColor: 'bg-yellow-50', icon: Clock },
  accepted: { label: 'Accepted', color: 'text-green-600', bgColor: 'bg-green-50', icon: CheckCircle },
  rejected: { label: 'Rejected', color: 'text-red-600', bgColor: 'bg-red-50', icon: XCircle },
};

export function ServiceRequests({ project, onUpdate }: ServiceRequestsProps) {
  const [activeTab, setActiveTab] = useState<'sent' | 'received'>('sent');
  const [sentRequests, setSentRequests] = useState<ServiceRequest[]>([]);
  const [receivedRequests, setReceivedRequests] = useState<ServiceRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreatingRequest, setIsCreatingRequest] = useState(false);
  const [professionals, setProfessionals] = useState<Professional[]>([]);
  const [selectedProfessional, setSelectedProfessional] = useState<string>('');
  const [requestMessage, setRequestMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    loadServiceRequests();
    loadProfessionals();
  }, []);

  const loadServiceRequests = async () => {
    try {
      setIsLoading(true);
      const [sentResponse, receivedResponse] = await Promise.all([
        sitesService.getSentServiceRequests(),
        sitesService.getServiceRequests(),
      ]);

      if (sentResponse.success && sentResponse.data) {
        setSentRequests(sentResponse.data.filter(req => req.projectId === project._id));
      }

      if (receivedResponse.success && receivedResponse.data) {
        setReceivedRequests(receivedResponse.data.filter(req => req.projectId === project._id));
      }
    } catch (error) {
      console.error('Error loading service requests:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadProfessionals = async () => {
    try {
      const [brokersResponse, contractorsResponse] = await Promise.all([
        brokersService.getProfessionalBrokers(),
        contractorsService.getProfessionalContractors(),
      ]);

      const allProfessionals: Professional[] = [];

      if (brokersResponse.success && brokersResponse.data) {
        allProfessionals.push(
          ...brokersResponse.data.map(broker => ({
            _id: broker._id,
            name: broker.name,
            role: 'broker' as const,
            experience: broker.experience,
            rating: broker.rating,
            location: broker.serviceAreas,
          }))
        );
      }

      if (contractorsResponse.success && contractorsResponse.data) {
        allProfessionals.push(
          ...contractorsResponse.data.map(contractor => ({
            _id: contractor._id,
            name: contractor.name,
            role: 'contractor' as const,
            experience: contractor.experience,
            rating: contractor.rating,
            location: contractor.serviceAreas,
          }))
        );
      }

      setProfessionals(allProfessionals);
    } catch (error) {
      console.error('Error loading professionals:', error);
    }
  };

  const handleSendRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedProfessional || !requestMessage.trim()) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      const requestData: CreateServiceRequestRequest = {
        toUserId: selectedProfessional,
        message: requestMessage,
        projectType: 'construction',
      };

      const response = await sitesService.createServiceRequest(project._id, requestData);
      
      if (response.success) {
        setSelectedProfessional('');
        setRequestMessage('');
        setIsCreatingRequest(false);
        loadServiceRequests();
      }
    } catch (error) {
      console.error('Error sending service request:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateRequest = async (requestId: string, status: 'accepted' | 'rejected') => {
    try {
      const response = await sitesService.updateServiceRequest(requestId, { status });
      if (response.success) {
        loadServiceRequests();
        onUpdate();
      }
    } catch (error) {
      console.error('Error updating service request:', error);
    }
  };

  const renderRequestCard = (request: ServiceRequest, type: 'sent' | 'received') => {
    const statusConfig = REQUEST_STATUS_CONFIG[request.status];
    const StatusIcon = statusConfig.icon;

    return (
      <Card key={request._id} className="border border-gray-200">
        <CardContent className="p-4">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-primary-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">
                    {type === 'sent' ? 'Request to Professional' : 'Request from Client'}
                  </h4>
                  <p className="text-sm text-gray-600">
                    {formatRelativeTime(request.createdAt)}
                  </p>
                </div>
              </div>
              
              <p className="text-gray-700 mb-3">{request.message}</p>
              
              <div className="flex items-center gap-4">
                <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${statusConfig.color} ${statusConfig.bgColor}`}>
                  <StatusIcon className="w-3 h-3" />
                  {statusConfig.label}
                </span>
              </div>
            </div>
            
            {type === 'received' && request.status === 'pending' && (
              <div className="flex items-center gap-2 ml-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleUpdateRequest(request._id, 'accepted')}
                  className="text-green-600 border-green-600 hover:bg-green-50"
                >
                  Accept
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleUpdateRequest(request._id, 'rejected')}
                  className="text-red-600 border-red-600 hover:bg-red-50"
                >
                  Reject
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    );
  };

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Service Requests</h3>
              <p className="text-gray-600">Manage requests to and from professionals</p>
            </div>
            <Button
              variant="primary"
              leftIcon={<Plus className="w-4 h-4" />}
              onClick={() => setIsCreatingRequest(true)}
            >
              Send Request
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Create Request Form */}
      {isCreatingRequest && (
        <Card>
          <CardHeader>
            <CardTitle>Send Service Request</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSendRequest} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Professional *
                </label>
                <select
                  value={selectedProfessional}
                  onChange={(e) => setSelectedProfessional(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  required
                >
                  <option value="">Choose a professional</option>
                  {professionals.map(professional => (
                    <option key={professional._id} value={professional._id}>
                      {professional.name} - {professional.role} ({professional.experience} years exp.)
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Message *
                </label>
                <textarea
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  value={requestMessage}
                  onChange={(e) => setRequestMessage(e.target.value)}
                  placeholder="Describe your project requirements and what you need help with..."
                  rows={4}
                  required
                />
              </div>

              <div className="flex justify-end gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsCreatingRequest(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  disabled={isSubmitting}
                  loading={isSubmitting}
                  leftIcon={<Send className="w-4 h-4" />}
                >
                  Send Request
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Tabs */}
      <Card>
        <CardContent className="p-0">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              <button
                onClick={() => setActiveTab('sent')}
                className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'sent'
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Send className="w-4 h-4" />
                Sent Requests ({sentRequests.length})
              </button>
              <button
                onClick={() => setActiveTab('received')}
                className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'received'
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <MessageSquare className="w-4 h-4" />
                Received Requests ({receivedRequests.length})
              </button>
            </nav>
          </div>
        </CardContent>
      </Card>

      {/* Requests List */}
      <div className="space-y-4">
        {activeTab === 'sent' && (
          <>
            {sentRequests.length > 0 ? (
              sentRequests.map(request => renderRequestCard(request, 'sent'))
            ) : (
              <Card>
                <CardContent className="text-center py-12">
                  <Send className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No requests sent</h3>
                  <p className="text-gray-600 mb-6">
                    Send requests to professionals to get help with your project.
                  </p>
                  <Button
                    variant="primary"
                    onClick={() => setIsCreatingRequest(true)}
                    leftIcon={<Plus className="w-4 h-4" />}
                  >
                    Send First Request
                  </Button>
                </CardContent>
              </Card>
            )}
          </>
        )}

        {activeTab === 'received' && (
          <>
            {receivedRequests.length > 0 ? (
              receivedRequests.map(request => renderRequestCard(request, 'received'))
            ) : (
              <Card>
                <CardContent className="text-center py-12">
                  <MessageSquare className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No requests received</h3>
                  <p className="text-gray-600">
                    Requests from professionals will appear here.
                  </p>
                </CardContent>
              </Card>
            )}
          </>
        )}
      </div>
    </div>
  );
}
