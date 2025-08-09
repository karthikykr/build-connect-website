'use client';

import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/layout';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Loading } from '@/components/ui/Loading';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { 
  MapPin,
  Search,
  Filter,
  Plus,
  Eye,
  Calendar,
  User,
  Camera,
  FileText,
  Clock,
  CheckCircle,
  AlertTriangle,
  Navigation,
  Ruler,
  DollarSign,
  Star
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

interface SiteScoutRequest {
  id: string;
  title: string;
  description: string;
  location: {
    address: string;
    city: string;
    state: string;
    pincode: string;
    coordinates?: {
      lat: number;
      lng: number;
    };
  };
  budget: {
    min: number;
    max: number;
  };
  requirements: {
    propertyType: string;
    minArea: number;
    maxArea: number;
    amenities: string[];
    features: string[];
  };
  status: 'open' | 'assigned' | 'in_progress' | 'completed' | 'cancelled';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  requestedBy: {
    id: string;
    name: string;
    email: string;
    phone: string;
  };
  assignedTo?: {
    id: string;
    name: string;
    email: string;
    phone: string;
  };
  deadline: string;
  createdAt: string;
  updatedAt: string;
  responses: SiteScoutResponse[];
}

interface SiteScoutResponse {
  id: string;
  scoutId: string;
  scoutName: string;
  properties: {
    id: string;
    title: string;
    address: string;
    price: number;
    area: number;
    images: string[];
    notes: string;
    rating: number;
    pros: string[];
    cons: string[];
  }[];
  summary: string;
  recommendations: string;
  submittedAt: string;
}

export default function SiteScoutingPage() {
  const [requests, setRequests] = useState<SiteScoutRequest[]>([]);
  const [filteredRequests, setFilteredRequests] = useState<SiteScoutRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const { user, isBroker } = useAuth();

  useEffect(() => {
    loadSiteScoutRequests();
  }, []);

  useEffect(() => {
    filterRequests();
  }, [requests, searchTerm, statusFilter, priorityFilter]);

  const loadSiteScoutRequests = async () => {
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      const mockRequests: SiteScoutRequest[] = [
        {
          id: '1',
          title: 'Residential Plot in Whitefield',
          description: 'Looking for a residential plot in Whitefield area for building a villa. Prefer corner plot with good road access.',
          location: {
            address: 'Whitefield Main Road',
            city: 'Bangalore',
            state: 'Karnataka',
            pincode: '560066',
            coordinates: { lat: 12.9698, lng: 77.7500 }
          },
          budget: { min: 2000000, max: 3500000 },
          requirements: {
            propertyType: 'residential_plot',
            minArea: 1200,
            maxArea: 2000,
            amenities: ['Water Supply', 'Electricity', 'Road Access'],
            features: ['Corner Plot', 'East Facing']
          },
          status: 'open',
          priority: 'high',
          requestedBy: {
            id: 'user1',
            name: 'Priya Sharma',
            email: 'priya@example.com',
            phone: '+91 9876543210'
          },
          deadline: '2024-02-15T00:00:00Z',
          createdAt: '2024-01-20T10:00:00Z',
          updatedAt: '2024-01-20T10:00:00Z',
          responses: []
        },
        {
          id: '2',
          title: 'Commercial Space in Electronic City',
          description: 'Need commercial space for IT office setup. Looking for ready-to-move space with parking facilities.',
          location: {
            address: 'Electronic City Phase 1',
            city: 'Bangalore',
            state: 'Karnataka',
            pincode: '560100'
          },
          budget: { min: 5000000, max: 8000000 },
          requirements: {
            propertyType: 'commercial',
            minArea: 2000,
            maxArea: 4000,
            amenities: ['Parking', 'Lift', 'Power Backup', 'Security'],
            features: ['Ready to Move', 'IT Park Location']
          },
          status: 'assigned',
          priority: 'medium',
          requestedBy: {
            id: 'user2',
            name: 'Amit Patel',
            email: 'amit@example.com',
            phone: '+91 9876543211'
          },
          assignedTo: {
            id: 'scout1',
            name: 'Rajesh Kumar',
            email: 'rajesh@example.com',
            phone: '+91 9876543212'
          },
          deadline: '2024-02-20T00:00:00Z',
          createdAt: '2024-01-18T14:30:00Z',
          updatedAt: '2024-01-19T09:15:00Z',
          responses: []
        },
        {
          id: '3',
          title: 'Investment Property in HSR Layout',
          description: 'Looking for investment property with good rental potential. Prefer apartment or villa.',
          location: {
            address: 'HSR Layout Sector 2',
            city: 'Bangalore',
            state: 'Karnataka',
            pincode: '560102'
          },
          budget: { min: 6000000, max: 12000000 },
          requirements: {
            propertyType: 'apartment',
            minArea: 1500,
            maxArea: 3000,
            amenities: ['Swimming Pool', 'Gym', 'Security', 'Parking'],
            features: ['High Rental Yield', 'Good Connectivity']
          },
          status: 'completed',
          priority: 'low',
          requestedBy: {
            id: 'user3',
            name: 'Sunita Singh',
            email: 'sunita@example.com',
            phone: '+91 9876543213'
          },
          assignedTo: {
            id: 'scout2',
            name: 'Priya Sharma',
            email: 'priya.scout@example.com',
            phone: '+91 9876543214'
          },
          deadline: '2024-01-25T00:00:00Z',
          createdAt: '2024-01-10T11:20:00Z',
          updatedAt: '2024-01-24T16:45:00Z',
          responses: [
            {
              id: 'resp1',
              scoutId: 'scout2',
              scoutName: 'Priya Sharma',
              properties: [
                {
                  id: 'prop1',
                  title: '3BHK Apartment in HSR Layout',
                  address: 'HSR Layout Sector 2, Bangalore',
                  price: 8500000,
                  area: 1800,
                  images: ['/api/placeholder/300/200'],
                  notes: 'Excellent location with good rental potential',
                  rating: 4.5,
                  pros: ['Prime location', 'Good amenities', 'High rental yield'],
                  cons: ['Slightly over budget', 'Traffic during peak hours']
                }
              ],
              summary: 'Found 3 suitable properties in HSR Layout area. All properties have good rental potential.',
              recommendations: 'Recommend the 3BHK apartment for best ROI.',
              submittedAt: '2024-01-24T16:45:00Z'
            }
          ]
        }
      ];

      setRequests(mockRequests);
      setLoading(false);
    }, 1000);
  };

  const filterRequests = () => {
    let filtered = [...requests];

    if (searchTerm) {
      filtered = filtered.filter(request =>
        request.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        request.location.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
        request.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(request => request.status === statusFilter);
    }

    if (priorityFilter !== 'all') {
      filtered = filtered.filter(request => request.priority === priorityFilter);
    }

    setFilteredRequests(filtered);
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      open: 'bg-blue-100 text-blue-800',
      assigned: 'bg-warning/10 text-warning',
      in_progress: 'bg-purple-100 text-purple-800',
      completed: 'bg-success/10 text-success',
      cancelled: 'bg-error/10 text-error'
    };

    const icons = {
      open: <Search className="w-3 h-3" />,
      assigned: <User className="w-3 h-3" />,
      in_progress: <Clock className="w-3 h-3" />,
      completed: <CheckCircle className="w-3 h-3" />,
      cancelled: <AlertTriangle className="w-3 h-3" />
    };

    return (
      <span className={`inline-flex items-center space-x-1 px-2 py-1 rounded-lg text-xs font-medium ${styles[status as keyof typeof styles]}`}>
        {icons[status as keyof typeof icons]}
        <span className="capitalize">{status.replace('_', ' ')}</span>
      </span>
    );
  };

  const getPriorityBadge = (priority: string) => {
    const styles = {
      low: 'bg-gray-100 text-gray-800',
      medium: 'bg-blue-100 text-blue-800',
      high: 'bg-orange-100 text-orange-800',
      urgent: 'bg-red-100 text-red-800'
    };

    return (
      <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${styles[priority as keyof typeof styles]}`}>
        {priority.charAt(0).toUpperCase() + priority.slice(1)}
      </span>
    );
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const breadcrumbs = [
    { label: 'Site Scouting', current: true }
  ];

  return (
    <ProtectedRoute>
      <DashboardLayout
        breadcrumbs={breadcrumbs}
        title="Site Scouting"
        description="Professional site scouting and property research services"
        actions={
          <div className="flex items-center space-x-2">
            {!isBroker() && (
              <Button
                variant="primary"
                leftIcon={<Plus className="w-4 h-4" />}
                onClick={() => setShowCreateForm(true)}
              >
                Request Site Scout
              </Button>
            )}
          </div>
        }
      >
        {loading ? (
          <div className="flex items-center justify-center min-h-[400px]">
            <Loading size="lg" text="Loading site scout requests..." />
          </div>
        ) : (
          <div className="space-y-8">
            {/* Filters */}
            <Card>
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-4">
                  <Input
                    placeholder="Search requests..."
                    leftIcon={<Search className="w-4 h-4" />}
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
                    <option value="open">Open</option>
                    <option value="assigned">Assigned</option>
                    <option value="in_progress">In Progress</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                  
                  <select
                    className="form-input"
                    value={priorityFilter}
                    onChange={(e) => setPriorityFilter(e.target.value)}
                  >
                    <option value="all">All Priority</option>
                    <option value="urgent">Urgent</option>
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                  </select>
                </div>
              </CardContent>
            </Card>

            {/* Requests List */}
            {filteredRequests.length === 0 ? (
              <div className="text-center py-12">
                <Search className="w-16 h-16 text-text-secondary mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-text-primary mb-2">
                  No site scout requests found
                </h3>
                <p className="text-text-secondary mb-6">
                  {requests.length === 0 
                    ? "No site scout requests have been created yet."
                    : "Try adjusting your search or filters."
                  }
                </p>
                {!isBroker() && (
                  <Button
                    variant="primary"
                    onClick={() => setShowCreateForm(true)}
                  >
                    Create Your First Request
                  </Button>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                {filteredRequests.map((request) => (
                  <Card key={request.id} className="overflow-hidden">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h3 className="text-lg font-semibold text-text-primary">
                              {request.title}
                            </h3>
                            {getStatusBadge(request.status)}
                            {getPriorityBadge(request.priority)}
                          </div>
                          
                          <div className="flex items-center space-x-4 text-sm text-text-secondary mb-3">
                            <div className="flex items-center">
                              <MapPin className="w-4 h-4 mr-1" />
                              <span>{request.location.city}, {request.location.state}</span>
                            </div>
                            <div className="flex items-center">
                              <DollarSign className="w-4 h-4 mr-1" />
                              <span>
                                {formatCurrency(request.budget.min)} - {formatCurrency(request.budget.max)}
                              </span>
                            </div>
                            <div className="flex items-center">
                              <Ruler className="w-4 h-4 mr-1" />
                              <span>
                                {request.requirements.minArea} - {request.requirements.maxArea} sqft
                              </span>
                            </div>
                          </div>
                          
                          <p className="text-text-secondary mb-4 line-clamp-2">
                            {request.description}
                          </p>
                          
                          <div className="flex items-center space-x-4 text-sm text-text-secondary">
                            <div className="flex items-center">
                              <User className="w-4 h-4 mr-1" />
                              <span>By {request.requestedBy.name}</span>
                            </div>
                            <div className="flex items-center">
                              <Calendar className="w-4 h-4 mr-1" />
                              <span>Deadline: {formatDate(request.deadline)}</span>
                            </div>
                            {request.assignedTo && (
                              <div className="flex items-center">
                                <Navigation className="w-4 h-4 mr-1" />
                                <span>Assigned to {request.assignedTo.name}</span>
                              </div>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <Button variant="outline" size="sm">
                            <Eye className="w-4 h-4 mr-1" />
                            View Details
                          </Button>
                          {isBroker() && request.status === 'open' && (
                            <Button variant="primary" size="sm">
                              Accept Request
                            </Button>
                          )}
                        </div>
                      </div>
                      
                      {request.responses.length > 0 && (
                        <div className="border-t border-gray-light pt-4">
                          <div className="flex items-center space-x-2 mb-2">
                            <FileText className="w-4 h-4 text-success" />
                            <span className="text-sm font-medium text-success">
                              {request.responses.length} Response(s) Received
                            </span>
                          </div>
                          <div className="text-sm text-text-secondary">
                            Latest response from {request.responses[0].scoutName} on{' '}
                            {formatDate(request.responses[0].submittedAt)}
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}
      </DashboardLayout>
    </ProtectedRoute>
  );
}
